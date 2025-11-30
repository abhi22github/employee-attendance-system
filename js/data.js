// Initialize data from localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];
let attendanceRecords = JSON.parse(localStorage.getItem("attendance")) || [];

// Seed data if empty
function seedData() {
  if (users.length === 0) {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    users = [
      {
        id: 1,
        name: "John Manager",
        email: "manager@example.com",
        password: "manager123",
        role: "manager",
        employeeId: "EMP001",
        department: "HR",
        createdAt: now.toISOString(),
      },
      {
        id: 2,
        name: "Alice Employee",
        email: "employee@example.com",
        password: "employee123",
        role: "employee",
        employeeId: "EMP002",
        department: "IT",
        createdAt: now.toISOString(),
      },
    ];

    attendanceRecords = [
      {
        id: 1,
        userId: 2,
        date: today,
        checkInTime: "09:00",
        checkOutTime: "18:00",
        status: "present",
        totalHours: 9,
        createdAt: now.toISOString(),
      },
    ];

    saveData();
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("attendance", JSON.stringify(attendanceRecords));
}

// Generate next ID
function getNextId(arr) {
  return arr.length > 0 ? Math.max(...arr.map(item => item.id)) + 1 : 1;
}

seedData();
