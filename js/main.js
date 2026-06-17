document.addEventListener("DOMContentLoaded", () => {
  const logout = document.getElementById("logout-btn") || document.getElementById("logoutBtn");
  if (logout && window.auth) {
    logout.addEventListener("click", (event) => {
      event.preventDefault();
      window.auth.logout();
    });
  }

  const user = window.auth && window.auth.getStoredUser();
  if (user) {
    const display = user.title ? `${user.title} ${user.firstName || ""} ${user.lastName || ""}`.trim() : (user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim());
    document.querySelectorAll("#user-name-display, #userNameDisplay, .user-profile, .current-user-name").forEach((el) => {
      if (el.children.length === 0) el.textContent = display || user.email;
    });
  }
});
