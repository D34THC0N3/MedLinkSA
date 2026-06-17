document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".mobile-menu-toggle").forEach((button) => {
    button.addEventListener("click", () => document.body.classList.toggle("sidebar-open"));
  });
});
