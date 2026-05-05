const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function createElement({ value = "", className = "" } = {}) {
  const listeners = {};
  const attributes = new Map();

  return {
    value,
    textContent: "",
    className,
    disabled: false,
    focused: false,
    listeners,
    classList: {
      add(token) {
        const classes = new Set(className.split(/\s+/).filter(Boolean));
        classes.add(token);
        className = [...classes].join(" ");
        this.owner.className = className;
      },
    },
    addEventListener(type, listener) {
      listeners[type] = listener;
    },
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    getAttribute(name) {
      return attributes.get(name) ?? null;
    },
    removeAttribute(name) {
      attributes.delete(name);
    },
    focus() {
      this.focused = true;
    },
  };
}

function loadLoginScript({ username = "", password = "" } = {}) {
  const form = createElement({ className: "login-form" });
  const usernameInput = createElement({ value: username });
  const passwordInput = createElement({ value: password });
  const usernameError = createElement();
  const passwordError = createElement();
  const submitButton = createElement({ className: "submit-button" });
  const statusMessage = createElement({ className: "status-message" });
  const timers = [];

  for (const element of [
    form,
    usernameInput,
    passwordInput,
    usernameError,
    passwordError,
    submitButton,
    statusMessage,
  ]) {
    element.classList.owner = element;
  }

  form.reset = () => {
    usernameInput.value = "";
    passwordInput.value = "";
  };

  const elements = {
    ".login-form": form,
    "#username": usernameInput,
    "#password": passwordInput,
    "#username-error": usernameError,
    "#password-error": passwordError,
    ".submit-button": submitButton,
    "#status-message": statusMessage,
  };

  const context = {
    document: {
      querySelector(selector) {
        return elements[selector];
      },
    },
    window: {
      setTimeout(callback) {
        timers.push(callback);
      },
    },
  };

  vm.runInNewContext(fs.readFileSync("script.js", "utf8"), context);

  return {
    form,
    usernameInput,
    passwordInput,
    usernameError,
    passwordError,
    submitButton,
    statusMessage,
    timers,
  };
}

function submit(form) {
  let defaultPrevented = false;
  form.listeners.submit({
    preventDefault() {
      defaultPrevented = true;
    },
  });
  return defaultPrevented;
}

test("login accepts any non-empty password instead of rejecting short credentials", () => {
  const page = loadLoginScript({ username: "alex", password: "123" });

  assert.equal(submit(page.form), true);

  assert.equal(page.passwordError.textContent, "");
  assert.equal(page.passwordInput.getAttribute("aria-invalid"), null);
  assert.equal(page.submitButton.disabled, true);
  assert.equal(page.submitButton.getAttribute("aria-busy"), "true");
  assert.equal(page.statusMessage.textContent, "Signing in securely...");
});

test("login blocks submission when required fields are blank", () => {
  const page = loadLoginScript();

  assert.equal(submit(page.form), true);

  assert.equal(page.usernameError.textContent, "Enter your username.");
  assert.equal(page.passwordError.textContent, "Enter your password.");
  assert.equal(page.usernameInput.getAttribute("aria-invalid"), "true");
  assert.equal(page.passwordInput.getAttribute("aria-invalid"), "true");
  assert.match(page.statusMessage.className, /\berror\b/);
});

test("editing a field clears stale submit status and revalidates invalid input", () => {
  const page = loadLoginScript();
  submit(page.form);

  page.usernameInput.value = "alex";
  page.usernameInput.listeners.input();

  assert.equal(page.statusMessage.className, "status-message");
  assert.equal(page.statusMessage.textContent, "Enter your credentials to get started.");
  assert.equal(page.usernameError.textContent, "");
  assert.equal(page.usernameInput.getAttribute("aria-invalid"), null);
});
