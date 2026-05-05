const form = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const message = document.querySelector("#form-message");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showMessage("Please enter both username and password.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.", "error");
    return;
  }

  showMessage(`Welcome, ${username}. Login details submitted.`, "success");
  form.reset();
  usernameInput.focus();
});

function showMessage(text, type) {
  message.textContent = text;
  message.className = `form-message ${type}`;
}
