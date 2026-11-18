---
name: sap-rap-development
description: Generate or extend managed ABAP RAP business objects and RAP-based Fiori elements list reports, object pages, overview pages, and analytical pages using the SAPRAPCodePrompts configuration and templates.
---

# SAP RAP development

Use this skill when the user requests ABAP RAP application generation with this library.

1. Read the [generation contract](../../../docs/generation-contract.md) and the user's configuration, defaulting to [rap-project.json](../../../rap-project.json).
2. Select and read the complete template below. Treat its frontmatter as editor metadata and execute its Markdown instructions.
3. For an unspecified "RAP application", use the list report and object page templates together, creating the backend once. For an explicitly requested floorplan, generate only that floorplan and its missing prerequisites.
4. Honor `target.mode`. Source-only generates local files; connected mode uses only the authenticated, scoped tools actually available.
5. Treat Node.js/npm/Ajv as optional configuration-check tooling, not ABAP generation prerequisites. If unavailable, inspect inputs directly using the contract, report the automated check as not run, and continue once genuine input/SAP requirements are satisfied. Do not demand or perform dependency installation solely for ABAP generation.
6. Continue through the template's acceptance checks. Return actual file/object locations, checks run, blockers, and remaining manual steps.

| User request | Template |
| --- | --- |
| Backend, RAP BO, CDS, behavior, OData service | [RAP business object](../../prompts/rap-business-object.prompt.md) |
| List report, filters, report table | [List report](../../prompts/rap-list-report.prompt.md) |
| Object page, details, edit, list-to-detail application | [Object page](../../prompts/rap-object-page.prompt.md) |
| Overview, dashboard, cards | [Overview page](../../prompts/rap-overview-page.prompt.md) |
| Analytics, analytical list page, chart and table | [Analytical page](../../prompts/rap-analytical-page.prompt.md) |

Ask only for essential missing business requirements or SAP target details that cannot be discovered. Do not ask the user to rewrite every field already present in the configuration.
