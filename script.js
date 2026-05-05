const form = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const togglePasswordButton = document.querySelector(".password-toggle");
const usernameError = document.querySelector("#username-error");
const passwordError = document.querySelector("#password-error");
const submitButton = document.querySelector("#submit-button");
const buttonLabel = submitButton.querySelector("span");
const statusMessage = document.querySelector("#status-message");

const defaultStatus = "Enter your credentials to access your dashboard.";

function setFieldError(input, messageElement, message) {
  input.setAttribute("aria-invalid", "true");
  messageElement.textContent = message;
}

function clearFieldError(input, messageElement) {
  input.removeAttribute("aria-invalid");
  messageElement.textContent = "";
}

function setStatus(message = defaultStatus, type = "") {
  statusMessage.className = "status-message";

  if (type) {
    statusMessage.classList.add(type);
  }

  statusMessage.textContent = message;
}

function validateUsername() {
  const username = usernameInput.value.trim();

  if (!username) {
    setFieldError(usernameInput, usernameError, "Please enter your username.");
    return false;
  }

  if (username.length < 3) {
    setFieldError(usernameInput, usernameError, "Username must be at least 3 characters.");
    return false;
  }

  clearFieldError(usernameInput, usernameError);
  return true;
}

function validatePassword() {
  const password = passwordInput.value;

  if (!password) {
    setFieldError(passwordInput, passwordError, "Please enter your password.");
    return false;
  }

  if (password.length < 6) {
    setFieldError(passwordInput, passwordError, "Password must be at least 6 characters.");
    return false;
  }

  clearFieldError(passwordInput, passwordError);
  return true;
}

function validateForm() {
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();

  return isUsernameValid && isPasswordValid;
}

function handleInput(input, validator, errorElement) {
  setStatus();

  if (input.getAttribute("aria-invalid") === "true" || errorElement.textContent) {
    validator();
  }
}

usernameInput.addEventListener("blur", validateUsername);
passwordInput.addEventListener("blur", validatePassword);

usernameInput.addEventListener("input", () => {
  handleInput(usernameInput, validateUsername, usernameError);
});

passwordInput.addEventListener("input", () => {
  handleInput(passwordInput, validatePassword, passwordError);
});

togglePasswordButton.addEventListener("click", () => {
  const isPasswordVisible = passwordInput.type === "text";

  passwordInput.type = isPasswordVisible ? "password" : "text";
  togglePasswordButton.setAttribute("aria-pressed", String(!isPasswordVisible));
  togglePasswordButton.textContent = isPasswordVisible ? "Show" : "Hide";
  passwordInput.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  setStatus("");

  if (!validateForm()) {
    setStatus("Please fix the highlighted fields before signing in.", "error");

    const firstInvalidField = form.querySelector('[aria-invalid="true"]');
    firstInvalidField?.focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  buttonLabel.textContent = "Signing in...";
  setStatus("Checking your credentials securely...");

  window.setTimeout(() => {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
    buttonLabel.textContent = "Sign in";
    setStatus(`Welcome back, ${usernameInput.value.trim()}! Your login was submitted.`, "success");
    form.reset();
    passwordInput.type = "password";
    togglePasswordButton.setAttribute("aria-pressed", "false");
    togglePasswordButton.textContent = "Show";
    usernameInput.focus();
  }, 800);
});
