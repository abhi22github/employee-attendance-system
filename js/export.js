// Export to CSV
function exportToCSV(data, filename) {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => headers.map(field => `"${row[field] || ""}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export Reports
document.getElementById("exportCSV").addEventListener("click", function () {
  const table = document.getElementById("reportsTable");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const data = rows.map(row => {
    const cells = row.querySelectorAll("td");
    return {
      Date: cells[0].textContent,
      Employee: cells[1].textContent,
      "Employee ID": cells[2].textContent,
      Status: cells[3].textContent,
      "Check In": cells[4].textContent,
      "Check Out": cells[5].textContent,
      "Total Hours": cells[6].textContent,
    };
  });

  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  exportToCSV(data, "attendance_report.csv");
});
