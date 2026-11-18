---
name: sap-rap-development
description: Develop managed draft-enabled ABAP RAP business objects through ABAP MCP, including persistence, CDS entities, behavior definitions and classes, metadata extensions, service bindings, and activation.
---

# ABAP RAP development

Act as an ABAP RAP developer. Use this skill to create or extend RAP persistence, CDS entities, behavior implementations, annotations, and services in the selected SAP development package. Follow the shared contract for target discovery, execution mode, and verification.

1. Read the [generation contract](../../../docs/generation-contract.md) and the user's configuration, defaulting to [rap-project.json](../../../rap-project.json).
2. Resolve execution intent before validating target requirements. The primary workflow is connected ABAP development. An explicit request to create/activate SAP objects through ABAP MCP selects connected execution even if the saved sample says `source-only`; report the override without rewriting the file. Otherwise honor the configured mode or an explicit source-only/read-only request. Merely mentioning MCP or opening the repository does not authorize writes.
3. Select and read the complete template below. Treat its frontmatter as editor metadata and execute its Markdown instructions. For an unspecified "RAP application", use the list report and object page templates together, creating the backend once. For an explicitly requested floorplan, generate only that floorplan and its missing prerequisites.
4. Develop RAP persistence, behavior, CDS annotations, services, and supported ADT preview according to the shared contract. Overview requests prepare RAP data/services and qualified annotations, not a complete overview application.
5. In connected execution, discover the actual ABAP MCP tools, authenticated project, package, transport, release, and language compatibility. Resolve essential missing target details before writes. Create/update real SAP objects, activate them in dependency order, read back their state, and verify the service. Do not stop after drafting local sources. If connection, authorization, or required operations are unavailable, report the exact blocker and partial state, not connected success. Source-only drafts remain a separate workflow.
6. Continue through the scope-appropriate acceptance checks. Return actual file/object locations, checks run, blockers, and remaining manual steps.

| User request | Template |
| --- | --- |
| Backend, RAP BO, CDS, behavior, OData service | [RAP business object](../../prompts/rap-business-object.prompt.md) |
| List report, filters, report table | [List-report CDS annotations](../../prompts/rap-list-report.prompt.md) |
| Object page, details, edit, list-to-detail application | [Object-page behavior and annotations](../../prompts/rap-object-page.prompt.md) |
| Overview, dashboard, cards | [Overview data services and annotations](../../prompts/rap-overview-page.prompt.md) |
| Analytics, analytical list page, chart and table | [Analytical CDS and service](../../prompts/rap-analytical-page.prompt.md) |

Ask only for essential missing business requirements or SAP target details that cannot be discovered. Do not ask the user to rewrite every field already present in the configuration.
