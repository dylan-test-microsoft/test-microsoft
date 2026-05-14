const form = document.querySelector("#loginForm");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const usernameError = document.querySelector("#usernameError");
const passwordError = document.querySelector("#passwordError");
const formMessage = document.querySelector("#formMessage");
const passwordToggle = document.querySelector(".password-toggle");
const submitButton = document.querySelector(".submit-button");

const setFieldError = (input, errorElement, message) => {
  errorElement.textContent = message;
  input.closest(".input-wrap").classList.toggle("has-error", Boolean(message));
  input.setAttribute("aria-invalid", String(Boolean(message)));
};

const validateUsername = () => {
  const username = usernameInput.value.trim();

  if (!username) {
    setFieldError(usernameInput, usernameError, "Please enter your username.");
    return false;
  }

  if (username.length < 3) {
    setFieldError(usernameInput, usernameError, "Username must be at least 3 characters.");
    return false;
  }

  setFieldError(usernameInput, usernameError, "");
  return true;
};

const validatePassword = () => {
  if (!passwordInput.value) {
    setFieldError(passwordInput, passwordError, "Please enter your password.");
    return false;
  }

  setFieldError(passwordInput, passwordError, "");
  return true;
};

const setFormMessage = (message, type) => {
  formMessage.textContent = message;
  formMessage.className = type ? `form-message ${type}` : "form-message";
};

usernameInput.addEventListener("input", () => {
  if (usernameError.textContent) {
    validateUsername();
  }
});

passwordInput.addEventListener("input", () => {
  if (passwordError.textContent) {
    validatePassword();
  }
});

passwordToggle.addEventListener("click", () => {
  const shouldShowPassword = passwordInput.type === "password";

  passwordInput.type = shouldShowPassword ? "text" : "password";
  passwordToggle.textContent = shouldShowPassword ? "Hide" : "Show";
  passwordToggle.setAttribute("aria-label", shouldShowPassword ? "Hide password" : "Show password");
  passwordToggle.setAttribute("aria-pressed", String(shouldShowPassword));
  passwordInput.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  setFormMessage("", "");

  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();

  if (!isUsernameValid || !isPasswordValid) {
    setFormMessage("Check the highlighted fields and try again.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Signing in...";

  window.setTimeout(() => {
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent = "Sign in";
    setFormMessage(`Welcome back, ${usernameInput.value.trim()}! Login submitted successfully.`, "success");
    form.reset();
    passwordInput.type = "password";
    passwordToggle.textContent = "Show";
    passwordToggle.setAttribute("aria-label", "Show password");
    passwordToggle.setAttribute("aria-pressed", "false");
  }, 650);
});
