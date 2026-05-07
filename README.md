# Microsoft Teams Channel Integration Check

This repository tracks the expected Microsoft Teams channel integration behavior for
the Knoon bot.

## Observed issue

Recent Teams messages show that general help requests return the help text, but some
follow-up commands also trigger:

```text
Microsoft Teams channel has not been integrated. Please sign in to continue.
```

That message is appropriate only when the channel has not been connected and the
user is attempting an action that requires an integrated channel.

## Expected behavior

- `Help` or `<agent name> Help` should always return the available command list.
- Work actions, such as starting work or checking work status, should first verify
  that the Teams channel is integrated.
- If the channel is not integrated, the bot should direct the user to run
  `@knoon.ai connect` or sign in before retrying the protected command.

## Verification checklist

1. In an unintegrated Teams channel, send `Cursor Help`.
2. Confirm the bot returns the command list without requiring sign-in.
3. Send a protected work command, such as `Cursor Identify blockers`.
4. Confirm the bot returns the integration/sign-in prompt.