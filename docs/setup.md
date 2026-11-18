# Copilot and SAP setup

## Required versus optional tooling

For ABAP generation in Eclipse, use ADT, a tool-capable Copilot client, and a working ADT MCP connection. **Do not install Node.js/npm or restore this repository's `node_modules` just to generate ABAP or use ADT service preview.**

The default UI scope is `project.uiMode: "adt-preview"`, including when the property is omitted. Generate RAP objects, CDS/UI annotations, bindings, and preview instructions only. Do not generate or run standalone frontend/npm projects merely because the user requests a list report, overview, analytical scenario, or all examples.

The Node.js/Ajv configuration checker is optional. When it is unavailable, Copilot must inspect the schema/configuration directly, record that review, mark the automated check as not run, and continue once genuine configuration/SAP prerequisites are satisfied. Missing `ajv` is not an SAP generation error. See the [generation contract](generation-contract.md).

Standalone frontend generation requires an explicit standalone request or `project.uiMode: "standalone"`. Its build can require Node.js/npm and that project's dependencies, independently of the optional configuration checker.

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

### Eclipse skills and prompt files

Updated GitHub Copilot for Eclipse supports `.github/skills` and `.github/prompts` through the chat `/` picker. Install/update the plugin from **Help > Eclipse Marketplace**.

Import this repository using **File > Import > Git > Projects from Git > Clone URI**, clone `main` outside the workspace, and choose **Import as General Project** with the repository root selected. No individual prompt files need to be copied.

In **Preferences > GitHub Copilot > Custom Instructions**, choose **Referenced projects** to load instructions only for projects referenced in chat, or **All projects** when that is intentional. Reference the selected project configuration, type `/`, and select **sap-rap-development** or the relevant `rap-*` prompt. These are Eclipse chat choices, not terminal commands.

The [Equipment Request Hub showcase](../examples/equipment-request-hub/README.md) supplies three RAP-focused examples: transactional preview, overview backend preparation, and analytics service/annotations. Use its configuration path explicitly instead of the root purchase-order configuration. Full overview/analytical UI apps are opt-in, not automatic ADT preview outputs.

### Older clients or unavailable prompt discovery

Use the editor's supported file-attachment/context mechanism to supply:

1. The chosen file from `.github/prompts`.
2. `docs/generation-contract.md`.
3. Your `rap-project.json`.

Ask Copilot to follow the attached prompt and contract, read any linked prerequisites, and generate files. If the client cannot read links, attach the referenced prerequisite templates too. If it cannot write local files or use tools, it can only return suggested source; use a tool-capable client for end-to-end generation.

## Source-only generation

Leave `target.mode` as `source-only`. No SAP connection is required to draft ABAP sources and annotations, although a connected target improves compatibility checks. Review the object inventory and follow its ADT import/activation steps. Source-only mode does not enable standalone frontend generation.

An unconnected run must mark SAP activation, real metadata, and service-backed acceptance as unverified. It must not infer the installed ABAP/SAPUI5 release from this repository's defaults.

## Connected generation through Eclipse ADT MCP

1. Install a supported Eclipse/ADT version and log on to an ABAP project.
2. In Eclipse preferences, find **ABAP Development > MCP Server** and enable the server.
3. Configure the project's allowed access and the packages allowed for editing. Native object/file editing may require a separate ADT setting.
4. Connect your Copilot client's MCP integration to the exact endpoint and authentication details shown by your ADT installation. Store the generated token in secure client settings, not this repository.
5. Keep Eclipse and the relevant ABAP project connected. Verify that Copilot can discover the selected project and list available tools/generators.
6. Set `target.mode` to `connected` and configure the real ADT project, package, and transport request/task in `rap-project.json`.

For Eclipse Copilot, its client-side MCP configuration is under **Preferences > GitHub Copilot > MCP** (also accessible through chat's **Configure Tools** action). This is separate from **ABAP Development > MCP Server**. Use the actual ADT server endpoint/authentication requirements, not the GitHub MCP server URL or a GitHub PAT.

Enabling Eclipse's server and enabling an MCP client are separate steps. Available tools, licensing, experimental-feature restrictions, SAP release support, and permissions depend on your installation. Follow the linked SAP documentation rather than assuming a tool name, port, or capability.

## Connected generation through VS Code ADT MCP

SAP also documents an ADT MCP server for its VS Code ABAP tooling. Enable it according to SAP's instructions, activate the destination in the workspace, and verify tool discovery in a tool-capable Copilot session.

Do not copy an Eclipse server port or tool signature into the VS Code configuration without inspecting the actual installation. The templates intentionally discover generators and schemas instead of hardcoding either variant.

## Optional standalone Fiori UI tooling

Only for explicit standalone scope, generating/building a separate Fiori project requires local file access and normally Node.js, npm, and SAP Fiori tools/UI5 tooling. The installed SAPUI5 version must support the requested floorplan and service features. Do not require these tools or run existing frontend lint/build scripts for RAP-only development.

For live preview, configure the generated project's real service connection/proxy using your organization's supported authentication and destination mechanism. Never embed SAP passwords or MCP tokens in a UI manifest. Launchpad publication and intent configuration are separate from generating a local app.

An OVP is a separate frontend, not a page automatically available in ADT service preview. Default overview generation prepares service data/annotations and documents remaining frontend work. Analytical preview features likewise depend on the target; a working aggregation query is not proof of a complete analytical UI.

## Using the library in an existing repository

For a new application, use GitHub's **Use this template** button or clone this repository. No manual copying is required.

For an existing SAP backend/package, you can still work from this clone: set its target project/package, and ask Copilot to inspect and extend the existing objects. A local clone does not require creating a new SAP package.

To keep prompts inside an existing local code repository instead, copy the five prompt files, the complete skill folder, `docs`, the configuration, and its schema while preserving relative paths. Merge repository instructions rather than overwriting existing ones.

If you choose to use the optional automated checker, it additionally needs `scripts/validate.mjs` and the Ajv development dependency. Do not overwrite another application's `package.json`; integrate that check into its existing tooling if needed. The prompts must inspect the configuration directly when the automated checker is unavailable, without requiring npm setup solely for ABAP generation.

See [official references](references.md) for all setup sources.
