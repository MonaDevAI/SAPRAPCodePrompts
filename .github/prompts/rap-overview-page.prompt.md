---
name: rap-overview-page
description: Prepare RAP services and annotations for overview cards; generate a standalone OVP frontend only on explicit opt-in.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Generate a RAP-based overview page

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

By default, prepare RAP data services and annotations for `ui.overview.cards`, documenting the remaining frontend work. An OVP is a separate frontend and does not appear automatically in ADT service preview. Generate the actual OVP app only for explicit standalone scope under the contract; never substitute an object page decorated as a dashboard.

## Execute

1. Resolve UI scope; omitted `project.uiMode` means `adt-preview`. Require `ui.overview`; if omitted, ask only which meaningful cards are needed. Inspect backend capabilities and relevant target frontend compatibility where available. Only inspect local OVP generators/build tools for standalone scope. Modern OVP supports V2 and V4, but individual card/filter features depend on the target version.
2. This library's configuration targets OData V4. Use a RAP V4 UI service; require a supported V4 OVP implementation only for a requested standalone frontend. Identify unsupported backend features and known card compatibility limits without blocking RAP preparation solely on unavailable local frontend tooling. Do not silently downgrade the service to V2 or substitute a different floorplan.
3. Reuse the transactional backend or generate missing prerequisites using the [business-object template](rap-business-object.prompt.md). For chart cards, also perform the analytical service checks in the [analytical-page template](rap-analytical-page.prompt.md), without generating an extra analytical UI app unless requested.
4. In default scope, deliver backend sources, a card-to-entity/annotation mapping, and a list of frontend configuration still required. Do not create an OVP manifest, app folder, npm scripts, or local UI harness. Only in standalone scope scaffold `project.appId + ".overview"` with supported `sap.ovp` settings, models, filters, i18n, and card modules.
5. For each list card, create the required qualified annotations from its `fields`, `sortBy`, and `sortDescending`. For each chart card, create qualified chart/presentation annotations, verify its measure and aggregation support, and apply the currency/unit rules in the contract.
6. Map compatible filter properties against actual service metadata. In standalone scope implement global-filter propagation; in default scope document the mapping without claiming runtime card filtering was tested.
7. In default scope document navigation requirements only. For a requested standalone app use real configured launchpad/local targets where available; never invent an intent or label an unconfigured link as working.
8. Do not add data-changing card actions or publish a launchpad tile unless explicitly requested.

## Acceptance checks

- In default scope, backend properties, entity sets, and card annotation qualifiers resolve; remaining frontend configuration is explicitly identified.
- Only for standalone scope: the manifest represents an OVP, card models/templates resolve, and global filtering/empty/error states work.
- Chart cards use server-supported aggregation with separate or explicitly filtered currency/unit contexts.
- For standalone scope, navigation works where a real target exists; missing setup is reported.
- Run backend service checks in default scope. Build/browser-check a frontend only when explicitly requested. Default-scope frontend checks are not applicable; do not call backend readiness a working dashboard.

## Deliver

By default provide backend/annotation changes, the compatibility decision, pending frontend requirements, and the contract's verification report. Provide the separate overview UI project/navigation setup only for explicit standalone scope.
