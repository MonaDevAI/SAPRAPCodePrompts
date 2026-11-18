---
name: rap-list-report
description: Create RAP service and CDS/UI annotations for an OData V4 list report in supported ADT preview.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Generate RAP list-report annotations

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

Generate the RAP service and CDS/UI annotations for a list report with configured filters and columns, using supported ADT preview. Reuse an existing compatible RAP service or generate its missing prerequisites using the [business-object template](rap-business-object.prompt.md). Do not generate a frontend project.

## Execute

1. Resolve execution intent and validate the effective SAP target using the contract. For connected work, use ABAP MCP to create/update and activate actual backend/CDS metadata extensions and verify their persisted state; do not stop at local sources. Inspect existing objects, real service metadata, and RAP generators; do not create a second backend or inspect local frontend tooling.
2. Add CDS metadata extensions/service annotations for labels, `UI.LineItem`, `UI.SelectionFields`, header information, and presentation defaults. Resolve every property path against actual metadata in connected mode.
3. Enable basic search only on supported searchable text fields and expose the required search metadata. Configure filter behavior appropriate to each field type. Reuse real value-help/text associations; do not invent supplier master-data services from the example's `SupplierName` field.
4. Provide service-binding/entity-set preview steps and verify actual ADT preview where possible. Do not scaffold UI files or npm scripts. Source-only mode must identify unpublished endpoints and unverified preview behavior.
5. Wire draft create/delete capabilities only when supported by the backend. A create action must lead to a usable draft editor: if an object page is needed for the installed floorplan, follow the [object-page template](rap-object-page.prompt.md) for that prerequisite. Never display a create button that has no working flow.
6. Preserve compatible existing annotations and verify supported preview navigation through actual metadata rather than generating a local router. Leave existing frontend files/scripts untouched.

## Acceptance checks

- Every configured `ui.lineItems` and `ui.selectionFields` property exists with a compatible type.
- In supported ADT preview, the service-backed table loads; text search, field filters, sorting, and paging behave correctly. Mark unavailable preview checks unrun rather than inventing a local frontend.
- Amounts and quantities display their currency/unit; empty results and service errors are understandable.
- Create/delete actions follow service capabilities and backend authorization. Draft creation can be completed or discarded when create is exposed.
- Validate backend metadata and ADT preview where available. Frontend build/lint checks are outside scope and not applicable. Distinguish mocked from live-service results.

## Deliver

Provide RAP objects/annotations, ADT preview steps, and the contract's verification report. Do not deliver a frontend project or call an annotation-only change a deployed Fiori application.
