const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function createElement({ value = "", className = "", type = "" } = {}) {
  const listeners = {};
  const attributes = new Map();
  const wrapper = {
    hasError: false,
    classList: {
      toggle(token, force) {
        if (token === "has-error") {
          wrapper.hasError = Boolean(force);
        }
      },
    },
  };

  return {
    value,
    className,
    textContent: "",
    disabled: false,
    focused: false,
    type,
    listeners,
    wrapper,
    addEventListener(eventName, listener) {
      listeners[eventName] = listener;
    },
    closest(selector) {
      return selector === ".input-wrap" ? wrapper : null;
    },
    focus() {
      this.focused = true;
    },
    getAttribute(attributeName) {
      return attributes.get(attributeName) ?? null;
    },
    setAttribute(attributeName, valueToSet) {
      attributes.set(attributeName, valueToSet);
    },
  };
}

function loadLoginScript({ username = "", password = "" } = {}) {
  const form = createElement();
  const usernameInput = createElement({ value: username, type: "text" });
  const passwordInput = createElement({ value: password, type: "password" });
  const usernameError = createElement();
  const passwordError = createElement();
  const formMessage = createElement({ className: "form-message" });
  const passwordToggle = createElement({ className: "password-toggle" });
  const submitButtonLabel = createElement();
  const submitButton = createElement({ className: "submit-button" });
  const timers = [];

  submitButtonLabel.textContent = "Sign in";
  submitButton.querySelector = (selector) => (selector === "span" ? submitButtonLabel : null);
  form.reset = () => {
    usernameInput.value = "";
    passwordInput.value = "";
  };

  const elements = {
    "#loginForm": form,
    "#username": usernameInput,
    "#password": passwordInput,
    "#usernameError": usernameError,
    "#passwordError": passwordError,
    "#formMessage": formMessage,
    ".password-toggle": passwordToggle,
    ".submit-button": submitButton,
  };

  vm.runInNewContext(fs.readFileSync("script.js", "utf8"), {
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
  });

  return {
    form,
    usernameInput,
    passwordInput,
    usernameError,
    passwordError,
    formMessage,
    passwordToggle,
    submitButton,
    submitButtonLabel,
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

test("accepts any non-empty password", () => {
  const page = loadLoginScript({ username: "alex", password: "123" });

  assert.equal(submit(page.form), true);

  assert.equal(page.passwordError.textContent, "");
  assert.equal(page.passwordInput.getAttribute("aria-invalid"), "false");
  assert.equal(page.passwordInput.wrapper.hasError, false);
  assert.equal(page.submitButton.disabled, true);
  assert.equal(page.submitButtonLabel.textContent, "Signing in...");
  assert.equal(page.timers.length, 1);
});

test("still blocks blank passwords", () => {
  const page = loadLoginScript({ username: "alex", password: "" });

  assert.equal(submit(page.form), true);

  assert.equal(page.passwordError.textContent, "Please enter your password.");
  assert.equal(page.passwordInput.getAttribute("aria-invalid"), "true");
  assert.equal(page.passwordInput.wrapper.hasError, true);
  assert.equal(page.submitButton.disabled, false);
  assert.equal(page.formMessage.className, "form-message error");
  assert.equal(page.timers.length, 0);
});

test("password field does not declare a minimum length constraint", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const inputs = [...html.matchAll(/<input[\s\S]*?\/>/g)].map((match) => match[0]);
  const passwordInput = inputs.find((input) => input.includes('id="password"'));

  assert.ok(passwordInput, "password input exists");
  assert.equal(passwordInput.includes("minlength"), false);
});
