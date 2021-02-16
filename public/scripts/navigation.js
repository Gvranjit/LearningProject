const navMenu = document.querySelector(".nav-items");
const body = document.body;
const profilePicture = document.querySelector(".profile-picture");
const transparentBackdrop = document.querySelector(".transparent-backdrop");
const confirmation = document.querySelector(".confirmation");
let menuIsOpen = false;
if (profilePicture) {
     profilePicture.addEventListener("click", toggleMenu);
}

transparentBackdrop.addEventListener("click", toggleMenu);
//functions

function toggleMenu() {
     if (!menuIsOpen) {
          navMenu.style.display = "flex";
          transparentBackdrop.style.display = "block";
          menuIsOpen = true;
     } else {
          navMenu.style.display = "none";
          transparentBackdrop.style.display = "none";
          menuIsOpen = false;
     }
}
