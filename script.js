const form = document.querySelector(".login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const usernameError = document.querySelector("#username-error");
const passwordError = document.querySelector("#password-error");
const submitButton = document.querySelector(".submit-button");
const statusMessage = document.querySelector("#status-message");

function setError(input, messageElement, message) {
  input.setAttribute("aria-invalid", "true");
  messageElement.textContent = message;
}

function clearError(input, messageElement) {
  input.removeAttribute("aria-invalid");
  messageElement.textContent = "";
}

function resetStatusMessage() {
  statusMessage.className = "status-message";
  statusMessage.textContent = "Enter your credentials to get started.";
}

function validateUsername() {
  const username = usernameInput.value.trim();

  if (!username) {
    setError(usernameInput, usernameError, "Enter your username.");
    return false;
  }

  clearError(usernameInput, usernameError);
  return true;
}

function validatePassword() {
  const password = passwordInput.value;

  if (!password) {
    setError(passwordInput, passwordError, "Enter your password.");
    return false;
  }

  clearError(passwordInput, passwordError);
  return true;
}

function validateForm() {
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();

  return isUsernameValid && isPasswordValid;
}

usernameInput.addEventListener("blur", validateUsername);
passwordInput.addEventListener("blur", validatePassword);

usernameInput.addEventListener("input", () => {
  resetStatusMessage();

  if (usernameInput.getAttribute("aria-invalid") === "true") {
    validateUsername();
  }
});

passwordInput.addEventListener("input", () => {
  resetStatusMessage();

  if (passwordInput.getAttribute("aria-invalid") === "true") {
    validatePassword();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  statusMessage.className = "status-message";
  statusMessage.textContent = "";

  if (!validateForm()) {
    statusMessage.classList.add("error");
    statusMessage.textContent = "Please fix the highlighted fields and try again.";
    return;
  }

  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  submitButton.textContent = "Signing in...";
  statusMessage.textContent = "Signing in securely...";

  window.setTimeout(() => {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
    submitButton.textContent = "Sign in";
    form.reset();
    statusMessage.classList.add("success");
    statusMessage.textContent = "Your login details were submitted.";
    usernameInput.focus();
  }, 700);
});
