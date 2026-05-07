# Test Microsoft

Repository for Microsoft integration testing notes.

## Microsoft Teams command handling

The Microsoft Teams bot should provide useful guidance for short user messages
from an unintegrated channel instead of treating every message as a protected
work command.

### Expected behavior

- `Help` and `<agent name> Help`, including `Cursor Help`, show the supported
  command list without requiring sign-in or channel integration.
- Protected work commands, such as starting work or checking status, verify that
  the Teams channel is integrated before running.
- If a protected command is sent from an unintegrated channel, the bot asks the
  user to connect the channel with `@knoon.ai connect` or sign in before
  retrying.
- Short unsupported messages, such as `Cursor fix`, return actionable guidance
  for the supported command format instead of a generic error.

### Supported work command format

After the Teams channel is connected, start work with:

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
5. Send a protected work command, such as `Cursor Identify blockers`.
6. Confirm the bot returns the integration or sign-in prompt.