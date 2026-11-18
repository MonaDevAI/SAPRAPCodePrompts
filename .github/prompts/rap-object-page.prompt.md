---
name: rap-object-page
description: Create draft-enabled RAP behavior, object-page annotations, and supported ADT preview.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Generate RAP object-page behavior and annotations

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

Create RAP metadata and behavior for a usable detail/create/edit object page in supported ADT service preview. Do not create or extend a frontend project.

## Execute

1. Resolve execution intent and validate the effective SAP target using the contract. For connected work, create/update and activate actual behavior/annotation objects through ABAP MCP and read back their state, rather than only writing local sources. Reuse or generate the backend using the [business-object template](rap-business-object.prompt.md). Inspect metadata before editing annotations; do not edit frontend routes.
2. Generate `UI.HeaderInfo`, `UI.Facets`, and the qualified `UI.FieldGroup` annotations described by `ui.fieldGroups`. Every reference facet must resolve to its exact qualified target; do not create empty sections.
3. Distinguish technical UUIDs from business identifiers. Keep technical keys, audit fields, and ETags read-only. Reflect configured required/read-only fields without replacing server-side validation.
4. Provide text/value-help annotations for configured fixed values and genuine referenced master data. Only add child tables or composition facets if a child entity actually exists or the user explicitly supplies the child model.
5. Verify list-to-detail/draft navigation through supported ADT service preview, including actual OData V4 keys and draft semantics. Do not scaffold a local app or router.
6. Expose supported edit, save/activate, cancel/discard, and draft-resume flows. Use the standard message handling and unsaved-change behavior. Do not create custom save controllers for functionality supplied by Fiori elements.
7. For read-only configured fields, preserve server-managed/default behavior. If a required read-only field has no way to acquire a value, report the model contradiction rather than emitting an unusable create flow.
8. Preserve unrelated annotations and existing frontend files. Do not generate frontend components or run frontend npm checks.

## Acceptance checks

- Selecting a list row opens the correct instance, including draft instances.
- Every configured section and field group renders with readable labels.
- Create and edit display backend validation messages and persist only valid data.
- Cancel/discard does not silently activate a draft; stale updates are rejected through ETags.
- A user lacking update permission cannot bypass backend restrictions through a direct request.
- Run backend activation/service checks and available ADT-preview flows. Frontend build/lint checks are outside scope and not applicable. Report connected, mocked, and untested behavior separately.

## Deliver

Provide backend/annotation changes, ADT preview and draft-flow details, and the contract's verification report. Do not deliver a frontend project.
