---
name: rap-object-page
description: Generate a draft-enabled Fiori elements object page and list-to-detail navigation for RAP.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Generate a RAP-based object page

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

Create a usable detail/create/edit object page for the configured RAP business object. Extend the existing main Fiori app. When none exists, create the minimal list-report shell and backend prerequisites rather than an orphaned detail page.

## Execute

1. Reuse or generate the backend using the [business-object template](rap-business-object.prompt.md). Inspect the existing main UI project and metadata before editing routing or annotations.
2. Generate `UI.HeaderInfo`, `UI.Facets`, and the qualified `UI.FieldGroup` annotations described by `ui.fieldGroups`. Every reference facet must resolve to its exact qualified target; do not create empty sections.
3. Distinguish technical UUIDs from business identifiers. Keep technical keys, audit fields, and ETags read-only. Reflect configured required/read-only fields without replacing server-side validation.
4. Provide text/value-help annotations for configured fixed values and genuine referenced master data. Only add child tables or composition facets if a child entity actually exists or the user explicitly supplies the child model.
5. Use the standard `sap.fe.templates.ObjectPage` target and connect list-to-detail navigation with the correct OData V4 key predicate and draft semantics. Prefer the generator/runtime's supported routing conventions over handcrafted UUID/draft URLs.
6. Expose supported edit, save/activate, cancel/discard, and draft-resume flows. Use the standard message handling and unsaved-change behavior. Do not create custom save controllers for functionality supplied by Fiori elements.
7. For read-only configured fields, preserve server-managed/default behavior. If a required read-only field has no way to acquire a value, report the model contradiction rather than emitting an unusable create flow.
8. Keep the main app ID unchanged when adding this page to a generated list report. Preserve unrelated routes, user extensions, and annotations.

## Acceptance checks

- Selecting a list row opens the correct instance, including draft instances.
- Every configured section and field group renders with readable labels.
- Create and edit display backend validation messages and persist only valid data.
- Cancel/discard does not silently activate a draft; stale updates are rejected through ETags.
- A user lacking update permission cannot bypass backend restrictions through a direct request.
- Run available build/lint checks and browser flows. Report connected, mocked, and untested behavior separately.

## Deliver

Provide the updated main UI app, exact backend/annotation changes, navigation and draft-flow details, and the contract's verification report.
