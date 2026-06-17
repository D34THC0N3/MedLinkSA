document.addEventListener("DOMContentLoaded", () => {
  const user = window.auth && window.auth.getStoredUser();
  const name = user ? `${user.firstName || user.name || "Patient"}` : "Patient";
  document.querySelectorAll("#userNameDisplay, .current-user-name").forEach((el) => {
    el.textContent = name;
  });
});
