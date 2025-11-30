// Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    alert("Invalid email or password");
    return;
  }

  localStorage.setItem("currentUserId", user.id);
  showDashboard(user);
});

// Register
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const employeeId = document.getElementById("regEmployeeId").value;
  const department = document.getElementById("regDepartment").value;
  const role = document.getElementById("regRole").value;

  if (users.some(u => u.email === email)) {
    alert("Email already exists");
    return;
  }
  if (users.some(u => u.employeeId === employeeId)) {
    alert("Employee ID already exists");
    return;
  }

  const now = new Date();
  const newUser = {
    id: getNextId(users),
    name,
    email,
    password,
    role,
    employeeId,
    department,
    createdAt: now.toISOString(),
  };

  users.push(newUser);
  saveData();
  alert("Registration successful! Please login.");
  showPage("loginPage");
});

// Show dashboard based on role
function showDashboard(user) {
  if (user.role === "employee") {
    document.getElementById("employeeName").textContent = user.name;
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileEmployeeId").textContent = user.employeeId;
    document.getElementById("profileDepartment").textContent = user.department;
    document.getElementById("profileRole").textContent = user.role;
    showPage("employeeDashboard");
    loadEmployeeDashboard();
  } else if (user.role === "manager") {
    document.getElementById("managerName").textContent = user.name;
    showPage("managerDashboard");
    loadManagerDashboard();
  }
}

// Get current user
function getCurrentUser() {
  const userId = localStorage.getItem("currentUserId");
  if (!userId) return null;
  return users.find(u => u.id == userId);
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("currentUserId");
  showPage("loginPage");
});

document.getElementById("managerLogoutBtn").addEventListener("click", function () {
  localStorage.removeItem("currentUserId");
  showPage("loginPage");
});

// Navigation
document.getElementById("showRegister").addEventListener("click", function (e) {
  e.preventDefault();
  showPage("registerPage");
});

document.getElementById("showLogin").addEventListener("click", function (e) {
  e.preventDefault();
  showPage("loginPage");
});
