const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function createElement({ value = "", className = "" } = {}) {
  const listeners = {};
  const attributes = new Map();
  let currentClassName = className;

  const element = {
    value,
    textContent: "",
    className,
    disabled: false,
    focused: false,
    listeners,
    classList: {
      add(token) {
        const classes = new Set(currentClassName.split(/\s+/).filter(Boolean));
        classes.add(token);
        currentClassName = [...classes].join(" ");
        element.className = currentClassName;
      },
      remove(token) {
        const classes = new Set(currentClassName.split(/\s+/).filter(Boolean));
        classes.delete(token);
        currentClassName = [...classes].join(" ");
        element.className = currentClassName;
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

  return element;
}

function loadLoginScript({ username = "", password = "" } = {}) {
  const form = createElement({ className: "login-form" });
  const usernameInput = createElement({ value: username });
  const passwordInput = createElement({ value: password });
  const usernameError = createElement();
  const passwordError = createElement();
  const loginButton = createElement({ className: "login-button" });
  loginButton.textContent = "Log in";
  const statusMessage = createElement({ className: "login-status" });
  const timers = [];

  form.reset = () => {
    usernameInput.value = "";
    passwordInput.value = "";
  };

  const elements = {
    "#login-form": form,
    "#username": usernameInput,
    "#password": passwordInput,
    "#username-error": usernameError,
    "#password-error": passwordError,
    "#login-button": loginButton,
    "#login-status": statusMessage,
  };

  const context = {
    document: {
      querySelector(selector) {
        return elements[selector] ?? null;
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
    loginButton,
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

test("login button blocks blank credentials and keeps the button usable", () => {
  const page = loadLoginScript();

  assert.equal(submit(page.form), true);

  assert.equal(page.usernameError.textContent, "Enter your username.");
  assert.equal(page.passwordError.textContent, "Enter your password.");
  assert.equal(page.usernameInput.getAttribute("aria-invalid"), "true");
  assert.equal(page.passwordInput.getAttribute("aria-invalid"), "true");
  assert.equal(page.loginButton.disabled, false);
  assert.equal(page.loginButton.textContent, "Log in");
  assert.match(page.statusMessage.className, /\berror\b/);
  assert.equal(
    page.statusMessage.textContent,
    "Please fix the highlighted fields before logging in.",
  );
});

test("login button enters a busy state for valid credentials", () => {
  const page = loadLoginScript({ username: "alex", password: "123" });

  assert.equal(submit(page.form), true);

  assert.equal(page.usernameError.textContent, "");
  assert.equal(page.passwordError.textContent, "");
  assert.equal(page.loginButton.disabled, true);
  assert.equal(page.loginButton.getAttribute("aria-busy"), "true");
  assert.equal(page.loginButton.textContent, "Logging in...");
  assert.equal(page.statusMessage.textContent, "Logging in securely...");
  assert.equal(page.timers.length, 1);
});

test("login button resets after the simulated sign-in completes", () => {
  const page = loadLoginScript({ username: "alex", password: "secret" });

  submit(page.form);
  page.timers[0]();

  assert.equal(page.loginButton.disabled, false);
  assert.equal(page.loginButton.getAttribute("aria-busy"), null);
  assert.equal(page.loginButton.textContent, "Log in");
  assert.equal(page.usernameInput.value, "");
  assert.equal(page.passwordInput.value, "");
  assert.equal(page.usernameInput.focused, true);
  assert.match(page.statusMessage.className, /\bsuccess\b/);
  assert.equal(page.statusMessage.textContent, "You are logged in.");
});

test("editing invalid fields clears stale button errors", () => {
  const page = loadLoginScript();
  submit(page.form);

  page.usernameInput.value = "alex";
  page.usernameInput.listeners.input();

  assert.equal(page.statusMessage.className, "login-status");
  assert.equal(page.statusMessage.textContent, "Enter your credentials to continue.");
  assert.equal(page.usernameError.textContent, "");
  assert.equal(page.usernameInput.getAttribute("aria-invalid"), null);
});
