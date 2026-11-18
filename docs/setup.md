# Copilot and SAP setup

## Choose how to load the templates

### Skills-capable Copilot clients

Open the repository as a workspace and confirm the client discovers [sap-rap-development](../.github/skills/sap-rap-development/SKILL.md). Then request, for example:

```text
Use the sap-rap-development skill.
Generate an object page and its list report using rap-project.json.
```

Skill locations/discovery vary by client and organization policy. Follow the client's normal trust/permission flow; copying a file does not grant tool permissions.

### VS Code prompt-file support

In a VS Code session that supports `.github/prompts`, choose the appropriate `rap-*` prompt from chat. Current VS Code documentation describes prompt execution in the **Local** harness, with skills recommended for the newer Copilot harness. Do not assume prompt-file slash commands are available in a different harness.

Examples for a supporting Local session:

```text
/rap-business-object
/rap-list-report
/rap-object-page
/rap-overview-page
/rap-analytical-page
```

These are editor chat commands, not PowerShell commands.

### Eclipse or another client without prompt discovery

Use the editor's supported file-attachment/context mechanism to supply:

1. The chosen file from `.github/prompts`.
2. `docs/generation-contract.md`.
3. Your `rap-project.json`.

Ask Copilot to follow the attached prompt and contract, read any linked prerequisites, and generate files. If the client cannot read links, attach the referenced prerequisite templates too. If it cannot write local files or use tools, it can only return suggested source; use a tool-capable client for end-to-end generation.

## Source-only generation

Leave `target.mode` as `source-only`. No SAP connection is required to draft the source and UI files, although a connected target improves compatibility checks. Review the generated object inventory and follow its ADT import/activation steps.

An unconnected run must mark SAP activation, real metadata, and service-backed acceptance as unverified. It must not infer the installed ABAP/SAPUI5 release from this repository's defaults.

## Connected generation through Eclipse ADT MCP

1. Install a supported Eclipse/ADT version and log on to an ABAP project.
2. In Eclipse preferences, find **ABAP Development > MCP Server** and enable the server.
3. Configure the project's allowed access and the packages allowed for editing. Native object/file editing may require a separate ADT setting.
4. Connect your Copilot client's MCP integration to the exact endpoint and authentication details shown by your ADT installation. Store the generated token in secure client settings, not this repository.
5. Keep Eclipse and the relevant ABAP project connected. Verify that Copilot can discover the selected project and list available tools/generators.
6. Set `target.mode` to `connected` and configure the real ADT project, package, and transport request/task in `rap-project.json`.

Enabling Eclipse's server and enabling an MCP client are separate steps. Available tools, licensing, experimental-feature restrictions, SAP release support, and permissions depend on your installation. Follow the linked SAP documentation rather than assuming a tool name, port, or capability.

## Connected generation through VS Code ADT MCP

SAP also documents an ADT MCP server for its VS Code ABAP tooling. Enable it according to SAP's instructions, activate the destination in the workspace, and verify tool discovery in a tool-capable Copilot session.

Do not copy an Eclipse server port or tool signature into the VS Code configuration without inspecting the actual installation. The templates intentionally discover generators and schemas instead of hardcoding either variant.

## Fiori UI tooling

Generating a standalone Fiori project requires local file access and normally Node.js, npm, and SAP Fiori tools/UI5 tooling. The installed SAPUI5 version must support the requested floorplan and service features.

For live preview, configure the generated project's real service connection/proxy using your organization's supported authentication and destination mechanism. Never embed SAP passwords or MCP tokens in a UI manifest. Launchpad publication and intent configuration are separate from generating a local app.

## Using the library in an existing repository

For a new application, use GitHub's **Use this template** button or clone this repository. No manual copying is required.

For an existing SAP backend/package, you can still work from this clone: set its target project/package, and ask Copilot to inspect and extend the existing objects. A local clone does not require creating a new SAP package.

To keep prompts inside an existing local code repository instead, copy the five prompt files, the complete skill folder, `docs`, the configuration, and its schema while preserving relative paths. Merge repository instructions rather than overwriting existing ones.

The optional automated checker additionally needs `scripts/validate.mjs` and the Ajv development dependency. Do not overwrite another application's `package.json`; integrate that check into its existing tooling if needed. The prompts can still inspect the configuration directly when the automated checker is unavailable.

See [official references](references.md) for all setup sources.
