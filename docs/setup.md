# Copilot and SAP setup

## Required versus optional tooling

For ABAP generation in Eclipse, use ADT, a tool-capable Copilot client, and a working ADT MCP connection. **Do not install Node.js/npm or restore this repository's `node_modules` just to generate ABAP or use ADT service preview.**

The primary workflow uses ABAP MCP to create/update and activate real SAP repository objects, including annotations, bindings, and supported ADT preview: **not local-only development**. Frontend generation is not supported. Do not generate or run frontend/npm projects for any floorplan or example.

The Node.js/Ajv configuration checker is optional. When it is unavailable, Copilot must inspect the schema/configuration directly, record that review, mark the automated check as not run, and continue once genuine configuration/SAP prerequisites are satisfied. Missing `ajv` is not an SAP generation error. See the [generation contract](generation-contract.md).

## Choose how to load the templates

### Skills-capable Copilot clients

Open the repository as a workspace and confirm the client discovers [sap-rap-development](../.github/skills/sap-rap-development/SKILL.md). Then request, for example:

```text
Use the sap-rap-development skill.
Use rap-project.json and ABAP MCP in connected mode.
Create and activate the RAP backend and list/object-page annotations
in the configured SAP development target, then verify the service.
Resolve missing target details before writes. Do not stop at local files.
Do not generate a standalone frontend.
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

The [Equipment Request Hub showcase](../examples/equipment-request-hub/README.md) supplies three RAP-focused examples: transactional preview, overview backend preparation, and analytics service/annotations. Use its configuration path explicitly instead of the root purchase-order configuration. Full overview/analytical frontend apps are outside scope, not automatic ADT preview outputs.

### Older clients or unavailable prompt discovery

Use the editor's supported file-attachment/context mechanism to supply:

1. The chosen file from `.github/prompts`.
2. `docs/generation-contract.md`.
3. Your `rap-project.json`.

Ask Copilot to follow the attached prompt/contract, read linked prerequisites, and use ABAP MCP in connected mode to create and activate the requested SAP objects. If the client cannot read links, attach prerequisite templates too. If it cannot use MCP tools, it cannot complete connected development; suggested source alone is not that outcome.

## Connected generation through Eclipse ADT MCP

1. Install a supported Eclipse/ADT version and log on to an ABAP project.
2. In Eclipse preferences, find **ABAP Development > MCP Server** and enable the server.
3. Configure the project's allowed access and the packages allowed for editing. Native object/file editing may require a separate ADT setting.
4. Connect your Copilot client's MCP integration to the exact endpoint and authentication details shown by your ADT installation. Store the generated token in secure client settings, not this repository.
5. Keep Eclipse and the relevant ABAP project connected. Verify that Copilot can discover the selected project and list available tools/generators.
6. Configure the real ADT project, package, transport request/task, and package-compatible ABAP language version in the selected project configuration; set `target.mode` to `connected`. An explicit connected creation request can instead select the effective mode without changing the saved sample, but unresolved target details still must be discovered/confirmed and validated before writes.

For Eclipse Copilot, its client-side MCP configuration is under **Preferences > GitHub Copilot > MCP** (also accessible through chat's **Configure Tools** action). This is separate from **ABAP Development > MCP Server**. Use the actual ADT server endpoint/authentication requirements, not the GitHub MCP server URL or a GitHub PAT.

Enabling Eclipse's server and enabling an MCP client are separate steps. Available tools, licensing, experimental-feature restrictions, SAP release support, and permissions depend on your installation. Follow the linked SAP documentation rather than assuming a tool name, port, or capability.

After discovery, Copilot must invoke actual MCP creation/update/generator operations, activate dependencies in SAP, inspect diagnostics, and read back object contents/state. Verify the real service definition/binding, metadata, and supported preview/publication. Unavailable operations remain explicit blockers/manual steps. A local `backend` folder or a list of planned objects does not complete this workflow.

For classic private-edition/on-premise packages, confirm `standard` language compatibility; use `cloud` only where the actual package supports it. Do not infer this from `$TMP` or deployment type.

## Connected generation through VS Code ADT MCP

SAP also documents an ADT MCP server for its VS Code ABAP tooling. Enable it according to SAP's instructions, activate the destination in the workspace, and verify tool discovery in a tool-capable Copilot session.

Do not copy an Eclipse server port or tool signature into the VS Code configuration without inspecting the actual installation. The templates intentionally discover generators and schemas instead of hardcoding either variant.

## Optional source-only generation

Explicitly request source-only drafting or use the saved sample `target.mode: "source-only"` without a connected override. No SAP connection is required to draft local ABAP sources/annotations, but those files do not create SAP repository objects. Review their inventory and follow import/activation steps separately.

The bundled samples retain source-only settings as offline inputs. The primary requests above explicitly select connected execution instead. Copilot must record that choice without silently changing configuration, and must not downgrade connected work to source-only if MCP is unavailable. An offline run must mark SAP activation, real metadata, and service-backed acceptance unverified.

## ADT service preview

Open the real UI service binding/entity set using the target's supported ADT preview. SAPUI5 renders the preview supplied by SAP; it does not require this library to create a local frontend, install UI5 build tools, or run npm scripts. Verify the actual publication state and supported preview features, and keep authentication details in secure client settings.

An OVP is a separate frontend, not a page automatically available in ADT service preview. The overview template prepares service data/annotations and documents requirements for that separate project. Analytical preview features likewise depend on the target; a working aggregation query is not proof of a complete analytical UI.

The removed `project.uiMode` option is no longer accepted. Omit it from configurations; an existing optional `project.appId` can remain as an identifier without enabling a frontend. Do not modify or run previously generated frontend files as part of this RAP workflow.

## Using the library in an existing repository

For a new application, use GitHub's **Use this template** button or clone this repository. No manual copying is required.

For an existing SAP backend/package, you can still work from this clone: set its target project/package, and ask Copilot to inspect and extend the existing objects. A local clone does not require creating a new SAP package.

To keep prompts inside an existing local code repository instead, copy the five prompt files, the complete skill folder, `docs`, the configuration, and its schema while preserving relative paths. Merge repository instructions rather than overwriting existing ones.

If you choose to use the optional automated checker, it additionally needs `scripts/validate.mjs` and the Ajv development dependency. Do not overwrite another application's `package.json`; integrate that check into its existing tooling if needed. The prompts must inspect the configuration directly when the automated checker is unavailable, without requiring npm setup solely for ABAP generation.

See [official references](references.md) for all setup sources.
