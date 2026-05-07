# Test Microsoft

Repository for Microsoft integration testing experiments.

## Microsoft Teams command guide

Before starting work from Microsoft Teams, connect the channel with:

```text
@knoon.ai connect
```

After the channel is connected, use the supported commands:

- `@knoon.ai work boxes` - list available work boxes.
- `@knoon.ai start work on <work box> <task>` - start a new task.
- `@knoon.ai status` - check the status of pending work.
- `@knoon.ai help` - show the available commands.

Bare messages such as `Cursor fix`, `Cursor explain`, or `Rovo Identify blockers`
are not recognized as work requests unless they are sent through the supported
bot command format.
