# Test Microsoft

Repository for Microsoft Teams integration testing notes.

## LSEG Workspace Teams prompts

The Teams bot should recognize LSEG Workspace prompts that ask for help,
market quick views, news, league tables, and supported Tradefeedr prompts.
These prompts are written as plain chat messages that start with
`LSEG Workspace`.

### Supported examples

- `LSEG Workspace Help`
- `LSEG Workspace Bond quick view for US10YT=RR`
- `LSEG Workspace Equity quick view for LSEG.L`
- `LSEG Workspace Vessel quick view C}KP7309844020`
- `LSEG Workspace Open the league table for Deals`
- `LSEG Workspace Show me Reuters Top News`
- `LSEG Workspace Prompts supported by Tradefeedr`

### Expected behavior

- Help prompts, including `LSEG Workspace Help` and
  `LSEG Workspace help`, return the supported command list.
- Quick view prompts open the matching LSEG Workspace view for the requested
  instrument or vessel identifier.
- News prompts open the requested Reuters news view.
- League table prompts open the requested Deals league table.
- Tradefeedr prompts return the supported Tradefeedr prompt list.
- If a prompt cannot be matched, the bot should return actionable guidance with
  examples of supported LSEG Workspace prompts.

## Repository status

This repository currently contains documentation only. There is no application
source code, package manifest, build pipeline, or automated test suite checked
in yet.
