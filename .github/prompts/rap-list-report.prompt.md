---
name: rap-list-report
description: Generate RAP service annotations for an OData V4 list-report preview, with standalone frontend generation opt-in.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Generate a RAP-based list report

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

Generate the RAP service and CDS/UI annotations for a list report with configured filters and columns, using ADT preview by default. Reuse an existing compatible RAP service or generate its missing prerequisites using the [business-object template](rap-business-object.prompt.md). Generate a standalone frontend only for explicit standalone scope under the contract.

## Execute

1. Resolve UI scope: omitted `project.uiMode` means `adt-preview`. Inspect the existing backend, service metadata, and relevant generators. Do not create a second backend. Inspect local UI projects/build tooling only for explicit standalone scope.
2. Add CDS metadata extensions/service annotations for labels, `UI.LineItem`, `UI.SelectionFields`, header information, and presentation defaults. Use local annotation files only in explicit standalone scope. Resolve every property path against actual metadata in connected mode.
3. Enable basic search only on supported searchable text fields and expose the required search metadata. Configure filter behavior appropriate to each field type. Reuse real value-help/text associations; do not invent supplier master-data services from the example's `SupplierName` field.
4. In default scope, provide the service-binding/entity-set preview steps and verify the actual ADT preview where possible; do not scaffold UI files or npm scripts. Only in standalone scope, use the available SAP Fiori tools generator or equivalent complete project with `sap.fe.templates.ListReport`, correct routing/model settings, and the real service URL. Source-only mode must identify unpublished endpoints.
5. Wire draft create/delete capabilities only when supported by the backend. A create action must lead to a usable draft editor: if an object page is needed for the installed floorplan, follow the [object-page template](rap-object-page.prompt.md) for that prerequisite. Never display a create button that has no working flow.
6. Only for a standalone app, keep IDs, i18n, routing, components, build scripts, and service-connection configuration consistent. The main app uses `project.appId`. Do not run or repair pre-existing standalone frontend scripts as a prerequisite to the default RAP task.
7. In standalone scope, preserve existing object-page routes and avoid broken row links. In default scope, use the supported preview navigation and metadata rather than generating a custom local router.

## Acceptance checks

- Every configured `ui.lineItems` and `ui.selectionFields` property exists with a compatible type.
- The service-backed table loads; text search, field filters, sorting, and paging behave correctly with real or explicitly identified mock data.
- Amounts and quantities display their currency/unit; empty results and service errors are understandable.
- Create/delete actions follow service capabilities and backend authorization. Draft creation can be completed or discarded when create is exposed.
- Validate backend metadata and the ADT preview where available. Run standalone build/lint/browser checks only when that frontend was explicitly requested; otherwise mark those checks not applicable. Distinguish mocked from live-service results.

## Deliver

Provide RAP objects/annotations, ADT preview steps, and the contract's verification report by default. Only in standalone scope also provide the runnable UI project and its launch steps. Do not call an annotation-only change a complete standalone Fiori application.
