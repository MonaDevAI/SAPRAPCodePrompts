---
name: rap-object-page
description: Generate draft-enabled RAP object-page annotations and ADT preview support, with standalone frontend generation opt-in.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Generate a RAP-based object page

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

Create the backend metadata and behavior for a usable detail/create/edit object page. Default to RAP objects, CDS/UI annotations, and ADT service preview. Only in explicit standalone scope extend/create the main Fiori frontend and its minimal list-report shell.

## Execute

1. Resolve UI scope using the contract; omitted `project.uiMode` means `adt-preview`. Reuse or generate the backend using the [business-object template](rap-business-object.prompt.md). Inspect backend metadata before editing annotations; inspect frontend routes only for explicit standalone scope.
2. Generate `UI.HeaderInfo`, `UI.Facets`, and the qualified `UI.FieldGroup` annotations described by `ui.fieldGroups`. Every reference facet must resolve to its exact qualified target; do not create empty sections.
3. Distinguish technical UUIDs from business identifiers. Keep technical keys, audit fields, and ETags read-only. Reflect configured required/read-only fields without replacing server-side validation.
4. Provide text/value-help annotations for configured fixed values and genuine referenced master data. Only add child tables or composition facets if a child entity actually exists or the user explicitly supplies the child model.
5. In default scope, verify list-to-detail/draft navigation through the supported ADT service preview; do not scaffold a local app or router. Only in standalone scope use `sap.fe.templates.ObjectPage` and supported routing conventions with correct OData V4 keys/draft semantics.
6. Expose supported edit, save/activate, cancel/discard, and draft-resume flows. Use the standard message handling and unsaved-change behavior. Do not create custom save controllers for functionality supplied by Fiori elements.
7. For read-only configured fields, preserve server-managed/default behavior. If a required read-only field has no way to acquire a value, report the model contradiction rather than emitting an unusable create flow.
8. Preserve unrelated annotations and existing frontend files. For an explicitly requested standalone app, keep its main app ID and unrelated routes/extensions unchanged. Do not run standalone npm checks in default scope.

## Acceptance checks

- Selecting a list row opens the correct instance, including draft instances.
- Every configured section and field group renders with readable labels.
- Create and edit display backend validation messages and persist only valid data.
- Cancel/discard does not silently activate a draft; stale updates are rejected through ETags.
- A user lacking update permission cannot bypass backend restrictions through a direct request.
- Run backend activation/service checks and available ADT-preview flows. Run frontend build/lint checks only for explicit standalone scope; otherwise mark them not applicable. Report connected, mocked, and untested behavior separately.

## Deliver

Provide backend/annotation changes, ADT preview and draft-flow details, and the contract's verification report. Provide a main UI app only when standalone generation was explicitly requested.
