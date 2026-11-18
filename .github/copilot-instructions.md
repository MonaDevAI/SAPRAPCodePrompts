# Repository instructions

This repository contains GitHub Copilot prompts for ABAP RAP development, not an SAP runtime or a deployed Fiori application.

- Keep the five templates focused and put shared behavior in `docs/generation-contract.md`.
- Read the generation contract and selected prompt before generating an application. Do not run generation just because this repository is opened.
- Connected ABAP development uses authenticated ABAP/ADT MCP tools to create/update and activate real SAP repository objects, not just local source files. An explicit connected creation request takes precedence over a saved sample `target.mode: "source-only"`; report the effective mode, resolve and validate the actual target before writes, and do not silently rewrite user configuration. Respect explicit source-only and read-only requests. If MCP is unavailable, report connected work blocked rather than claiming local generation completed it.
- Default to RAP backend objects, CDS/UI annotations, service bindings, and ADT preview instructions. An omitted `project.uiMode` means `adt-preview`. Generate standalone Fiori/npm projects only for an explicit standalone request or `project.uiMode: "standalone"`; requesting a floorplan or all examples is not itself an opt-in. Do not run generated frontend lint/build scripts in the default RAP scope.
- ABAP generation through Eclipse ADT MCP does not require this repository's Node.js/npm/Ajv tools or `node_modules`. If the optional checker is unavailable, inspect the configuration directly, report the automated check as not run, and continue when genuine configuration/SAP prerequisites are satisfied. Do not require dependency installation solely to generate ABAP.
- Preserve the single configuration contract in `rap-project.json` and `rap-project.schema.json`.
- Never claim SAP activation, service publication, or browser validation without actual tool evidence.
- Discover MCP capabilities at runtime. Do not assume one server's tool names or schemas apply to another.
- Keep credentials, MCP tokens, and authenticated test state out of version control.
- Avoid release-specific SAP syntax unless the target release or official documentation supports it.
- Put related validator regression tests together in `tests/validate.test.mjs`.
- When maintaining this prompt library or its validator, run `npm run check` and `npm test`. These maintainer checks are not prerequisites for generating an application and are not SAP application validation.
