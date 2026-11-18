---
name: rap-overview-page
description: Create RAP services and qualified annotations for overview-card data; does not generate an OVP frontend.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Prepare RAP services and annotations for overview cards

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

Prepare RAP data services and annotations for `ui.overview.cards`, documenting what a separate frontend would need. An OVP is outside this library's scope and does not appear automatically in ADT service preview. Do not generate an OVP app or substitute an object page decorated as a dashboard.

## Execute

1. Resolve execution intent and validate the effective SAP target using the contract. For connected work, create/update and activate actual data-service/annotation objects through ABAP MCP and read back their state; a local mapping is not SAP-side completion. Require `ui.overview`; if omitted, ask only which meaningful cards are needed. Inspect backend/annotation compatibility, not local OVP generators/build tools.
2. This library targets OData V4. Use a RAP V4 UI service and identify unsupported backend features or known annotation limits. Do not downgrade to V2 or require a local frontend implementation to prepare RAP services.
3. Reuse the transactional backend or generate missing prerequisites using the [business-object template](rap-business-object.prompt.md). For chart cards, also perform the analytical service checks in the [analytical-page template](rap-analytical-page.prompt.md).
4. Deliver RAP objects/sources, a card-to-entity/annotation mapping, and documented requirements for a separate frontend. Do not create an OVP manifest, app folder, npm scripts, or local UI harness.
5. For each list card, create the required qualified annotations from its `fields`, `sortBy`, and `sortDescending`. For each chart card, create qualified chart/presentation annotations, verify its measure and aggregation support, and apply the currency/unit rules in the contract.
6. Map compatible filter properties against actual service metadata without implementing or claiming runtime frontend filter propagation.
7. Document navigation requirements only; never invent a launchpad intent or label an unconfigured link as working.
8. Do not add data-changing actions or load sample data as part of overview data preparation.

## Acceptance checks

- Backend properties, entity sets, and card annotation qualifiers resolve; requirements for a separate frontend are explicitly identified.
- Chart cards use server-supported aggregation with separate or explicitly filtered currency/unit contexts.
- Run backend service checks. Frontend build/rendering/filtering/navigation checks are outside scope and not applicable; do not call backend readiness a working dashboard.

## Deliver

Provide backend/annotation changes, the compatibility decision, separate-frontend requirements, and the contract's verification report. Do not deliver an overview frontend project.
