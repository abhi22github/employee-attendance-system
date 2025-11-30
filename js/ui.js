// Show a page
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");
}

// Navigation
document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", function () {
    const pageId = this.getAttribute("data-page");
    document.querySelectorAll(".section").forEach(section => {
      section.style.display = "none";
    });
    document.getElementById(pageId + "Content").style.display = "block";
  });
});

// Initialize on load
document.addEventListener("DOMContentLoaded", function () {
  const userId = localStorage.getItem("currentUserId");
  if (userId) {
    const user = users.find(u => u.id == userId);
    if (user) {
      showDashboard(user);
    } else {
      showPage("loginPage");
    }
  } else {
    showPage("loginPage");
  }
});
