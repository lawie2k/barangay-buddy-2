const hamburgerMenu = document.querySelector(".hamburger-menu");
const sidebar = document.querySelector(".sidebar");
const exitbutton = document.querySelector(".exit-btn");

hamburgerMenu.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

exitbutton.addEventListener("click", () => {
  sidebar.classList.remove("open");
});
