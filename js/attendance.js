function getToday() {
  return new Date().toISOString().split("T")[0];
}

// Check In
document.getElementById("checkInBtn").addEventListener("click", function () {
  const user = getCurrentUser();
  if (!user) return;

  const today = getToday();
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 5);

  // Check if already checked in today
  const existing = attendanceRecords.find(
    r => r.userId === user.id && r.date === today
  );

  if (existing) {
    alert("Already checked in today");
    return;
  }

  const status = now.getHours() > 9 ? "late" : "present";

  const record = {
    id: getNextId(attendanceRecords),
    userId: user.id,
    date: today,
    checkInTime: timeStr,
    checkOutTime: null,
    status,
    totalHours: 0,
    createdAt: now.toISOString(),
  };

  attendanceRecords.push(record);
  saveData();
  loadEmployeeDashboard();
  loadMarkAttendance();
  alert("Checked in successfully");
});

// Check Out
document.getElementById("checkOutBtn").addEventListener("click", function () {
  const user = getCurrentUser();
  if (!user) return;

  const today = getToday();
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 5);

  const record = attendanceRecords.find(
    r => r.userId === user.id && r.date === today
  );

  if (!record || record.checkOutTime) {
    alert("No active check-in or already checked out");
    return;
  }

  const checkIn = new Date(`${today}T${record.checkInTime}`);
  const hours = (now - checkIn) / (1000 * 60 * 60);

  record.checkOutTime = timeStr;
  record.totalHours = parseFloat(hours.toFixed(2));

  // If total hours < 4, mark as half-day
  if (hours < 4) {
    record.status = "half-day";
  }

  saveData();
  loadEmployeeDashboard();
  loadMarkAttendance();
  alert("Checked out successfully");
});

// Quick Check In/Out
document.getElementById("quickCheckInOut").addEventListener("click", function () {
  const user = getCurrentUser();
  if (!user) return;

  const today = getToday();
  const record = attendanceRecords.find(
    r => r.userId === user.id && r.date === today
  );

  if (!record || record.checkOutTime) {
    // Need to check in
    document.getElementById("checkInBtn").click();
  } else {
    // Need to check out
    document.getElementById("checkOutBtn").click();
  }
});

// Load Mark Attendance page
function loadMarkAttendance() {
  const user = getCurrentUser();
  if (!user) return;

  const today = getToday();
  document.getElementById("todayDate").textContent = today;

  const record = attendanceRecords.find(
    r => r.userId === user.id && r.date === today
  );

  if (!record) {
    document.getElementById("currentStatus").textContent = "Not Checked In";
    document.getElementById("checkInBtn").disabled = false;
    document.getElementById("checkOutBtn").disabled = true;
  } else if (!record.checkOutTime) {
    document.getElementById("currentStatus").textContent = "Checked In";
    document.getElementById("checkInBtn").disabled = true;
    document.getElementById("checkOutBtn").disabled = false;
  } else {
    document.getElementById("currentStatus").textContent = "Checked Out";
    document.getElementById("checkInBtn").disabled = true;
    document.getElementById("checkOutBtn").disabled = true;
  }
}

// Load My History
function loadMyHistory() {
  const user = getCurrentUser();
  if (!user) return;

  const records = attendanceRecords
    .filter(r => r.userId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const tbody = document.querySelector("#myHistoryContent tbody");
  tbody.innerHTML = "";

  records.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.date}</td>
      <td>${r.status}</td>
      <td>${r.checkInTime || "-"}</td>
      <td>${r.checkOutTime || "-"}</td>
      <td>${r.totalHours} hrs</td>
    `;
    tbody.appendChild(tr);
  });

  // Load calendar
  loadCalendar(user.id);
}

// Calendar functions
function loadCalendar(userId) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  renderCalendar(year, month, userId);
}

function renderCalendar(year, month, userId) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  // Day headers
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
    const header = document.createElement("div");
    header.textContent = day;
    header.style.fontWeight = "bold";
    grid.appendChild(header);
  });

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  // Days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const record = attendanceRecords.find(r => r.userId === userId && r.date === dateStr);

    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.textContent = day;

    if (record) {
      cell.classList.add(record.status);
      cell.title = `${record.status}`;
    }

    grid.appendChild(cell);
  }
}
