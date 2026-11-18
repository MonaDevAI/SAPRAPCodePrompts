---
name: rap-overview-page
description: Generate a card-based Fiori overview page using release-compatible RAP OData services.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Generate a RAP-based overview page

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

Generate a real SAP Fiori overview page with the configured `ui.overview.cards`, not an object page decorated to resemble a dashboard.

## Execute

1. Require `ui.overview` for this template; if omitted, ask only which meaningful cards the user needs. Inspect the installed SAPUI5/Fiori tools versions and actual OVP generator/card capabilities. Modern OVP supports OData V2 and V4, but support for individual card types, filters, and navigation depends on the installed version. Do not assume V4 is unsupported, and do not assume every V2 card setting works unchanged with V4.
2. This library's configuration targets OData V4. Use a RAP V4 UI service and a supported V4 OVP implementation. If the installed stack cannot support a requested card, identify the exact limitation and offer a documented alternative; do not silently downgrade the service to V2 or substitute a different floorplan.
3. Reuse the transactional backend or generate missing prerequisites using the [business-object template](rap-business-object.prompt.md). For chart cards, also perform the analytical service checks in the [analytical-page template](rap-analytical-page.prompt.md), without generating an extra analytical UI app unless requested.
4. Scaffold a separate UI app with ID `project.appId + ".overview"` under the contract's overview directory. Use the supported OVP component, `sap.ovp` configuration, model mappings, global filter configuration, i18n, and the card template modules appropriate to the installed version.
5. For each list card, create the required qualified annotations from its `fields`, `sortBy`, and `sortDescending`. For each chart card, create qualified chart/presentation annotations, verify its measure and aggregation support, and apply the currency/unit rules in the contract.
6. Configure common filters against the actual global-filter entity. Only propagate filters to cards whose service properties/types map correctly.
7. Provide card-to-application navigation using a real configured launchpad intent/target when available. If no launchpad target exists, generate explicit setup instructions or a working supported local navigation path; never invent a deployed intent or label a broken link as configured.
8. Do not add data-changing card actions or publish a launchpad tile unless explicitly requested.

## Acceptance checks

- The manifest represents an OVP, not `sap.fe.templates.ObjectPage`.
- Every configured card resolves its data model, entity set, template, and annotation qualifiers.
- Global filters refresh the intended cards; cards load or display meaningful empty/error states.
- Chart cards use server-supported aggregation with separate or explicitly filtered currency/unit contexts.
- Navigation works where a target exists; missing launchpad setup is reported explicitly.
- Build and browser-check the app when tools and service access permit. Do not claim a dashboard works from a manifest parse alone.

## Deliver

Provide the separate overview UI project, all required backend/annotation changes, the compatibility decision, navigation setup, and the contract's verification report.
