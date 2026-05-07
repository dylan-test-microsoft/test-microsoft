# Microsoft Teams Cursor Command Fix

This repository records the expected behavior for Cursor-triggered work requests
sent from Microsoft Teams.

## Issue

In the shared Teams thread, general help requests such as `Cursor Help` returned
the command list, but follow-up requests such as `Cursor fix` also produced:

```text
Microsoft Teams channel has not been integrated. Please sign in to continue.
```

That integration prompt is useful only when the user is trying to run a command
that needs a connected Teams channel. It should not replace help text or leave
short, unsupported commands without next steps.

## Expected behavior

- `Help` and `<agent name> Help` always return the supported command list.
- Work commands verify that the Teams channel is integrated before starting
  work, checking status, or reading assigned work.
- If the channel is not integrated, protected commands ask the user to connect
  with `@knoon.ai connect` or sign in before retrying.
- Short unsupported requests, including `Cursor fix`, should receive actionable
  guidance such as `start work on <work box>` instead of a generic
  "didn't understand" response.

## Verification checklist

1. In an unintegrated Teams channel, send `Cursor Help`.
2. Confirm the bot returns the command list without requiring sign-in.
3. Send `Cursor fix`.
4. Confirm the response explains how to start work or connect the channel.
5. Send a protected work command, such as `Cursor Identify blockers`.
6. Confirm the bot returns the integration/sign-in prompt.
