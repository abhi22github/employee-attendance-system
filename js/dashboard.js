// Employee Dashboard
function loadEmployeeDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  const today = getToday();
  const record = attendanceRecords.find(r => r.userId === user.id && r.date === today);

  // Today status
  if (!record) {
    document.getElementById("todayStatus").textContent = "Not Checked In";
  } else if (!record.checkOutTime) {
    document.getElementById("todayStatus").textContent = "Checked In";
  } else {
    document.getElementById("todayStatus").textContent = "Checked Out";
  }

  // Monthly summary
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyRecords = attendanceRecords.filter(
    r => r.userId === user.id && r.date.startsWith(thisMonth)
  );

  const present = monthlyRecords.filter(r => r.status === "present").length;
  const absent = monthlyRecords.filter(r => r.status === "absent").length;
  const late = monthlyRecords.filter(r => r.status === "late").length;
  const halfDay = monthlyRecords.filter(r => r.status === "half-day").length;

  document.getElementById("monthlySummary").textContent =
    `${present} present, ${absent} absent, ${late} late, ${halfDay} half-day`;

  // Total hours
  const totalHours = monthlyRecords.reduce((sum, r) => sum + r.totalHours, 0);
  document.getElementById("totalHours").textContent = `${totalHours.toFixed(1)} hours`;

  // Recent attendance (last 7 days)
  const recentList = document.getElementById("recentList");
  recentList.innerHTML = "";

  const recentDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    recentDays.push(dateStr);
  }

  recentDays.forEach(date => {
    const r = attendanceRecords.find(r => r.userId === user.id && r.date === date);
    const li = document.createElement("li");
    li.textContent = `${date}: ${r ? r.status : "Absent"}`;
    recentList.appendChild(li);
  });

  loadMarkAttendance();
  loadMyHistory();
}

// Manager Dashboard
function loadManagerDashboard() {
  const today = getToday();

  // Total employees
  const employees = users.filter(u => u.role === "employee");
  document.getElementById("totalEmployees").textContent = employees.length;

  // Today attendance
  const todayRecords = attendanceRecords.filter(r => r.date === today);
  const presentCount = todayRecords.filter(r => r.status === "present").length;
  const absentCount = employees.length - todayRecords.length;
  document.getElementById("todayAttendance").textContent =
    `${presentCount} present, ${absentCount} absent`;

  // Late today
  const lateCount = todayRecords.filter(r => r.status === "late").length;
  document.getElementById("lateToday").textContent = lateCount;

  // Absent list
  const absentList = document.getElementById("absentList");
  absentList.innerHTML = "";
  employees.forEach(emp => {
    const hasRecord = todayRecords.some(r => r.userId === emp.id);
    if (!hasRecord) {
      const li = document.createElement("li");
      li.textContent = emp.name;
      absentList.appendChild(li);
    }
  });

  // Weekly trend (mock)
  const weeklyChart = document.getElementById("weeklyChart");
  weeklyChart.innerHTML = `
    <div class="chart-bar">
      <span class="chart-label">Mon</span>
      <div class="chart-bar-fill" style="width: 80%"></div>
    </div>
    <div class="chart-bar">
      <span class="chart-label">Tue</span>
      <div class="chart-bar-fill" style="width: 70%"></div>
    </div>
    <div class="chart-bar">
      <span class="chart-label">Wed</span>
      <div class="chart-bar-fill" style="width: 90%"></div>
    </div>
    <div class="chart-bar">
      <span class="chart-label">Thu</span>
      <div class="chart-bar-fill" style="width: 85%"></div>
    </div>
    <div class="chart-bar">
      <span class="chart-label">Fri</span>
      <div class="chart-bar-fill" style="width: 75%"></div>
    </div>
  `;

  // Department-wise (mock)
  const deptChart = document.getElementById("deptChart");
  deptChart.innerHTML = `
    <div class="chart-bar">
      <span class="chart-label">IT</span>
      <div class="chart-bar-fill" style="width: 85%"></div>
    </div>
    <div class="chart-bar">
      <span class="chart-label">HR</span>
      <div class="chart-bar-fill" style="width: 90%"></div>
    </div>
    <div class="chart-bar">
      <span class="chart-label">Finance</span>
      <div class="chart-bar-fill" style="width: 70%"></div>
    </div>
  `;

  // Load manager pages
  loadAllAttendance();
  loadReports();
}
