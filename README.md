# Test Microsoft

Repository for Microsoft integration testing experiments.

## Microsoft Teams command behavior

General help should remain available even when a Microsoft Teams channel has not
been connected yet.

### Expected responses

- `Help` and `<agent name> Help`, including `Cursor Help`, return the supported
  command list without requiring sign-in or channel integration.
- Protected work commands, such as starting work or checking work status,
  verify that the Teams channel is integrated before running.
- If a protected command is sent from an unintegrated channel, the bot asks the
  user to connect the channel with `@knoon.ai connect` or sign in before
  retrying.
- Short unsupported messages, such as `Cursor fix`, return actionable guidance
  for the supported work command format instead of a generic "didn't
  understand" response.

### Supported work command format

After the Teams channel is connected, use:

```text
@knoon.ai start work on <work box> <task>
```

Useful supporting commands:

- `@knoon.ai work boxes` - list available work boxes.
- `@knoon.ai status` - check pending work.
- `@knoon.ai help` - show available commands.
