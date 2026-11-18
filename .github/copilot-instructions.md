# Repository instructions

This repository contains GitHub Copilot prompts for ABAP RAP development, not an SAP runtime or a deployed Fiori application.

- Keep the five templates focused and put shared behavior in `docs/generation-contract.md`.
- Read the generation contract and selected prompt before generating an application. Do not run generation just because this repository is opened.
- Preserve the single configuration contract in `rap-project.json` and `rap-project.schema.json`.
- Never claim SAP activation, service publication, or browser validation without actual tool evidence.
- Discover MCP capabilities at runtime. Do not assume one server's tool names or schemas apply to another.
- Keep credentials, MCP tokens, and authenticated test state out of version control.
- Avoid release-specific SAP syntax unless the target release or official documentation supports it.
- Put related validator regression tests together in `tests/validate.test.mjs`.
- For repository changes, run `npm run check` and `npm test`. Do not describe those checks as SAP application validation.
