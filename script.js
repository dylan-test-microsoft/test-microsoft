const form = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const usernameError = document.querySelector("#username-error");
const passwordError = document.querySelector("#password-error");
const loginButton = document.querySelector("#login-button");
const loginStatus = document.querySelector("#login-status");

const idleStatus = "Enter your credentials to continue.";
let isSubmitting = false;

function setFieldError(input, errorElement, message) {
  input.setAttribute("aria-invalid", "true");
  errorElement.textContent = message;
}

function clearFieldError(input, errorElement) {
  input.removeAttribute("aria-invalid");
  errorElement.textContent = "";
}

function setStatus(message, type = "") {
  loginStatus.className = type ? `login-status ${type}` : "login-status";
  loginStatus.textContent = message;
}

function resetStatus() {
  if (!isSubmitting) {
    setStatus(idleStatus);
  }
}

function validateUsername() {
  const username = usernameInput.value.trim();

  if (!username) {
    setFieldError(usernameInput, usernameError, "Enter your username.");
    return false;
  }

  clearFieldError(usernameInput, usernameError);
  return true;
}

function validatePassword() {
  if (!passwordInput.value) {
    setFieldError(passwordInput, passwordError, "Enter your password.");
    return false;
  }

  clearFieldError(passwordInput, passwordError);
  return true;
}

function validateForm() {
  const hasUsername = validateUsername();
  const hasPassword = validatePassword();

  return hasUsername && hasPassword;
}

function setSubmitting(submitting) {
  isSubmitting = submitting;
  loginButton.disabled = submitting;

  if (submitting) {
    loginButton.setAttribute("aria-busy", "true");
    loginButton.textContent = "Logging in...";
    return;
  }

  loginButton.removeAttribute("aria-busy");
  loginButton.textContent = "Log in";
}

function handleInput() {
  resetStatus();

  if (usernameInput.getAttribute("aria-invalid") === "true") {
    validateUsername();
  }

  if (passwordInput.getAttribute("aria-invalid") === "true") {
    validatePassword();
  }
}

usernameInput.addEventListener("blur", validateUsername);
passwordInput.addEventListener("blur", validatePassword);
usernameInput.addEventListener("input", handleInput);
passwordInput.addEventListener("input", handleInput);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isSubmitting) {
    return;
  }

  if (!validateForm()) {
    setStatus("Please fix the highlighted fields before logging in.", "error");
    return;
  }

  setSubmitting(true);
  setStatus("Logging in securely...");

  window.setTimeout(() => {
    form.reset();
    setSubmitting(false);
    clearFieldError(usernameInput, usernameError);
    clearFieldError(passwordInput, passwordError);
    setStatus("You are logged in.", "success");
    usernameInput.focus();
  }, 700);
});
