# Test Microsoft

Test Microsoft is a lightweight repository for Microsoft integration testing
notes and workflow validation.

## Current status

This repository currently contains documentation only. There is no application
source code, package manifest, build pipeline, or automated test suite checked
in yet.

## Repository contents

- `README.md` - project overview, Microsoft Teams command behavior, and
  contributor guidance.

## Microsoft Teams command behavior

The Teams bot should keep low-risk informational commands available while
protecting work commands behind the expected channel connection or sign-in
flow.

### Expected responses

- `Help` and `<agent name> Help`, including `Cursor Help`, return the supported
  command list without requiring sign-in or channel integration.
- Short unsupported requests, including `Cursor fix` and `Cursor explain`,
  return actionable guidance that points the user to the supported work command
  format instead of a generic "didn't understand" response.
- Protected work commands, such as starting work or checking work status,
  verify that the Teams channel is integrated before running.
- If a protected command is sent from an unintegrated channel, the bot asks the
  user to connect the channel with `@knoon.ai connect` or sign in before
  retrying.

### Supported work command format

After the Teams channel is connected, use:

```text
@knoon.ai start work on <work box> <task>
```

Useful supporting commands:

- `@knoon.ai work boxes` - list available work boxes.
- `@knoon.ai status` - check pending work.
- `@knoon.ai help` - show available commands.

### Verification checklist

1. In an unintegrated Teams channel, send `Cursor Help`.
2. Confirm the bot returns the command list without requiring sign-in.
3. Send `Cursor fix`.
4. Confirm the response explains the supported work command format.
5. Send `Cursor explain`.
6. Confirm the response explains what information is needed to start work.
7. Send a protected work command, such as `Cursor identify blockers`.
8. Confirm the bot returns the integration or sign-in prompt.

## Contributing

When adding source code, workflows, or additional documentation:

1. Keep changes focused and easy to review.
2. Document setup, build, and test commands alongside new functionality.
3. Add automated tests when introducing executable code.
4. Update this README if the repository structure or requirements change.
