const floatingEmail = document.querySelector(".floating-username");
const floatingPassword = document.querySelector(".floating-password");
const emailInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const cancelButton = document.getElementById("cancel");

console.log(floatingEmail, floatingPassword, emailInput, passwordInput);

//REGISTER MODAL
const register = document.getElementById("register");
const registrationModal = document.querySelector(".registration-form");
register.addEventListener("click", openRegistrationModal);
cancelButton.addEventListener("click", closeRegistrationModal);

//functions

function openRegistrationModal() {
     console.log("clicked");
     registrationModal.style.display = "block";
     backdrop.style.display = "block";
}
function closeRegistrationModal() {
     registrationModal.style.display = "none";
     backdrop.style.display = "none";
}
