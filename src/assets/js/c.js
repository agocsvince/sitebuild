const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".pages");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.getElementsByTagName("header")[0].classList.toggle("active");
}

const navLink = document.querySelectorAll(".pages")[0];

navLink.childNodes.forEach(n => {
    if (n.nodeName !== "#text")
    {
    n.addEventListener("click", closeMenu);
}});

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}