---
name: rap-list-report
description: Generate a Fiori elements OData V4 list report on a managed RAP backend.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Generate a RAP-based list report

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

Generate a usable Fiori elements list report with configured filters and columns. Reuse an existing compatible RAP service or generate its missing prerequisites using the [business-object template](rap-business-object.prompt.md).

## Execute

1. Inspect the existing backend, service metadata, UI project, and installed generators. Do not create a second backend or overwrite an existing manifest when the configured entity already exists.
2. Add CDS metadata extensions or supported local annotations for labels, `UI.LineItem`, `UI.SelectionFields`, header information, and presentation defaults. Resolve every property path against actual metadata in connected mode.
3. Enable basic search only on supported searchable text fields and expose the required search metadata. Configure filter behavior appropriate to each field type. Reuse real value-help/text associations; do not invent supplier master-data services from the example's `SupplierName` field.
4. Generate a real OData V4 Fiori elements application using the available SAP Fiori tools generator, or create the equivalent complete UI5 project when that tool is unavailable. Use the standard `sap.fe.templates.ListReport` target, the real entity-set/context path, supported model settings, and actual service URL. Source-only mode must identify any endpoint still awaiting publication.
5. Wire draft create/delete capabilities only when supported by the backend. A create action must lead to a usable draft editor: if an object page is needed for the installed floorplan, follow the [object-page template](rap-object-page.prompt.md) for that prerequisite. Never display a create button that has no working flow.
6. Keep application IDs, i18n, routing, component setup, UI5 tooling, package scripts, and proxy/destination configuration consistent. The main app uses `project.appId`; separate overview/analytics apps use the suffixes defined in the contract.
7. Preserve an existing object-page route when extending an app. If no details page was requested and no editing flow needs one, do not add broken row-navigation links.

## Acceptance checks

- Every configured `ui.lineItems` and `ui.selectionFields` property exists with a compatible type.
- The service-backed table loads; text search, field filters, sorting, and paging behave correctly with real or explicitly identified mock data.
- Amounts and quantities display their currency/unit; empty results and service errors are understandable.
- Create/delete actions follow service capabilities and backend authorization. Draft creation can be completed or discarded when create is exposed.
- Run the generated project's actual build/lint checks. Run browser checks when the app can be started and a browser tool is available; distinguish mocked from live-service results.

## Deliver

Provide the runnable UI project, annotations, backend changes if needed, launch steps, and the contract's verification report. Do not call an annotation-only change a complete standalone Fiori application.
