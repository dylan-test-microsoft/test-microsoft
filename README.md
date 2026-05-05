# test-microsoft

A small static page with a textbox that accepts and safely previews special
characters.

## Run

Open `index.html` in a browser.

## What it supports

- UTF-8 text entry through the page metadata
- Multiline input for longer text
- Safe preview rendering with `textContent`, preserving characters such as
  `<`, `>`, `&`, quotes, symbols, and Unicode text without treating them as HTML
- Character and code-point counts for entered text