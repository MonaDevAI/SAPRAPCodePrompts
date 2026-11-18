---
name: sap-rap-development
description: Create and activate ABAP RAP objects through connected ABAP/ADT MCP, including CDS/UI annotations, services, and ADT preview. Supports explicit source-only drafting; does not generate frontend projects.
---

# SAP RAP development

Use this skill when the user requests ABAP RAP application generation with this library.

1. Read the [generation contract](../../../docs/generation-contract.md) and the user's configuration, defaulting to [rap-project.json](../../../rap-project.json).
2. Resolve execution intent before validating target requirements. The primary workflow is connected ABAP development. An explicit request to create/activate SAP objects through ABAP MCP selects connected execution even if the saved sample says `source-only`; report the override without rewriting the file. Otherwise honor the configured mode or an explicit source-only/read-only request. Merely mentioning MCP or opening the repository does not authorize writes.
3. Select and read the complete template below. Treat its frontmatter as editor metadata and execute its Markdown instructions. For an unspecified "RAP application", use the list report and object page templates together, creating the backend once. For an explicitly requested floorplan, generate only that floorplan and its missing prerequisites.
4. Stay within RAP backend/annotation/service/ADT-preview scope in either execution mode. There is no frontend-generation selector or branch. Do not create UI projects, manifests, npm scripts, or local JavaScript harnesses. Overview requests prepare RAP data/annotations and identify what a separate frontend would need; do not generate that frontend or claim a complete OVP app.
5. In connected execution, discover the actual ABAP MCP tools, authenticated project, package, transport, release, and language compatibility. Resolve essential missing target details before writes. Create/update real SAP objects, activate them in dependency order, read back their state, and verify the service. Do not stop after drafting local sources. If connection, authorization, or required operations are unavailable, report the exact blocker and partial state, not connected success. Source-only drafts remain a separate workflow.
6. Treat Node.js/npm/Ajv as optional configuration-check tooling, not ABAP generation prerequisites. If unavailable, inspect inputs directly using the contract, report the automated check as not run, and continue once genuine input/SAP requirements are satisfied. Do not demand or perform dependency installation solely for ABAP generation or run frontend lint/build scripts. Preserve previously generated frontend files.
7. Continue through the scope-appropriate acceptance checks. Return actual file/object locations, checks run, blockers, and remaining manual steps.

| User request | Template |
| --- | --- |
| Backend, RAP BO, CDS, behavior, OData service | [RAP business object](../../prompts/rap-business-object.prompt.md) |
| List report, filters, report table | [List report](../../prompts/rap-list-report.prompt.md) |
| Object page, details, edit, list-to-detail application | [Object page](../../prompts/rap-object-page.prompt.md) |
| Overview, dashboard, cards | [Overview page](../../prompts/rap-overview-page.prompt.md) |
| Analytics, analytical list page, chart and table | [Analytical page](../../prompts/rap-analytical-page.prompt.md) |

Ask only for essential missing business requirements or SAP target details that cannot be discovered. Do not ask the user to rewrite every field already present in the configuration.
