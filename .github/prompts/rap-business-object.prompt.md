---
name: rap-business-object
description: Develop a managed draft-enabled ABAP RAP business object with persistence, CDS entities, behavior implementation, and an OData V4 UI service.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# ABAP RAP business-object development

Act as an ABAP RAP developer. Develop the configured business object with managed implementation, draft handling, server-side validations, and an OData V4 UI service. For connected development, create and activate the objects directly in the SAP repository using ABAP MCP.

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## SAP target and business requirements

Use the configured ADT project, development package, transport, namespace prefix, entity, and business fields. Confirm the target release and package-compatible ABAP language version. Use the supplied field types, required/default values, fixed values, and currency/unit relationships as the business model.

## RAP development tasks

1. Establish the SAP target and execution mode using the contract. Inspect existing objects with the configured names and reuse compatible definitions. Discover the available ABAP MCP operations and supported RAP generators before creating repository objects.
2. Create or extend active persistence and draft persistence. Include a technical UUID key, client field where required, configured business fields, and the audit/ETag fields required by the target release. Generate the draft table using supported ADT tooling where available; do not guess draft administration includes.
3. Generate root/interface and projection CDS view entities. Preserve amount/currency and quantity/unit semantics, expose only intended business fields, and enable metadata extensions. Use the target release's supported projection provider contract.
4. Generate the managed behavior definition, behavior pool, and projection behavior. Include create/update/delete, managed UUID numbering, immutable technical keys, locking, ETag handling, draft operations, and a total ETag for draft concurrency. Expose all required draft actions in the projection behavior.
5. Implement configured defaults, required-field validation, and allowed-value validation using supported determinations/validations and standard RAP `failed`/`reported` messages. Marking a UI field required is not a substitute for server-side validation. Do not add business actions such as approval unless their business rules were requested.
6. Where a field declares `allowedValues`, provide a supported fixed-value help/text solution as well as server validation. Do not invent references to nonexistent value-help entities.
7. Generate the service definition and an OData V4 **UI** service binding. In source-only mode, provide service-binding creation/publication instructions if the binding cannot be represented faithfully as an importable source artifact.
8. Add baseline metadata for labels and a meaningful line item so an ADT service preview can be inspected. Keep authorization requirements explicit as defined in the contract.
9. In connected execution, create/update these SAP repository objects through ABAP MCP, activate in dependency order, inspect diagnostics, and correct introduced errors. Read back the object contents/activation state and verify the actual service binding. Record any unavailable creation, activation, or publication operation as incomplete.

## RAP verification

- The root has a stable UUID key and configured fields with correct lengths and semantic references.
- Create, edit, discard, resume, and activate draft operations are supported by the generated behavior where the release supports the requested configuration.
- Missing required data and invalid allowed values yield RAP messages and cannot be persisted through direct service calls.
- The service exposes the configured entity-set alias, capabilities, and draft metadata.
- Connected mode records activation, applicable ATC/ABAP Unit results, and a real `$metadata` check. Exercise draft CRUD only with authorized test data.
- Source-only mode supplies the complete source inventory and exact manual steps without claiming any remote checks passed.

## Development result

Use the contract's output layout and verification report. Identify every generated object and dependency, service binding, implementation decision, unresolved release restriction, and test result.
