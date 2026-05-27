# Test Microsoft

Test Microsoft is a lightweight repository for validating Cursor Cloud agent
workflows against a GitHub-hosted project.

## Repository status

This repository currently contains documentation only. There is no application
source code, package manifest, build script, or automated test suite checked in
yet.

## Contents

- `README.md` - project overview and contributor guidance.

## Getting started

Clone the repository and inspect the working tree:

```bash
git clone https://github.com/dylan-test-microsoft/test-microsoft.git
cd test-microsoft
git status
```

No dependency installation is required for the current repository contents.

## Development workflow

1. Create a feature branch from `main`.
2. Make focused changes.
3. Run checks that are relevant to the files you changed.
4. Commit with a clear message and open a pull request.

For documentation-only changes, verify Markdown formatting and run:

```bash
git diff --check
```

## Contributing

Keep changes small, clearly scoped, and easy to review. If source code or
tooling is added later, update this README with the required setup, build, and
test commands.
