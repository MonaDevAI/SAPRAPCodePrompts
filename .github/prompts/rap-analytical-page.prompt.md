---
name: rap-analytical-page
description: Generate RAP analytical service support and annotations; a standalone analytical frontend is explicitly opt-in.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Generate a RAP-based analytical page

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

Generate RAP analytical service support and chart/table annotations using `ui.analytics`, with available ADT preview instructions. A chart annotation alone does not make a CRUD service analytical or guarantee a full ALP in ADT preview. Generate the separate analytical frontend only for explicit standalone scope under the contract.

## Execute

1. Resolve UI scope; omitted `project.uiMode` means `adt-preview`. Require `ui.analytics`; if omitted, ask only for meaningful dimensions/measures and chart choice. Inspect the SAP release, service metadata, and relevant backend generators. Check target frontend compatibility when needed, but inspect local UI tooling only for standalone scope. Determine the supported RAP/SADL aggregation approach rather than assuming any transactional projection can aggregate.
2. Reuse existing backend data and generate a separate, read-only analytical projection/service when necessary. Use supported grouping/aggregation exposure. Only use release-specific annotations such as `@OData.applySupportedForAggregation` when supported by the actual target; never add an analytical-query provider contract or `@Analytics.query` and assume it automatically exposes a usable RAP V4 service.
3. Ensure the real entity-set metadata exposes the `Aggregation.ApplySupported` transformations required by the target SAPUI5 version and the aggregatable/groupable properties. Execute a representative `$apply=groupby(...,aggregate(...))` query when connected. If aggregation is unavailable, state the blocker rather than presenting client-side totals as server analytics.
4. Implement configured dimensions and measure aggregations. Preserve amount/currency and quantity/unit associations. Include semantic references in groupings and require a single-currency/unit filter or a supported split/series presentation for charts. Do not plot or total a mixture as though it were a single currency/unit.
5. Generate backend-qualified `UI.Chart`, `UI.LineItem`, and presentation/selection-presentation variants as required. Resolve annotation references against exposed metadata. Check `AVG`, `MIN`, or `MAX` support rather than assuming `SUM` implies every aggregation works.
6. In default scope, deliver analytical backend objects/annotations and actual supported preview instructions; do not scaffold UI files, npm scripts, or a verification harness. Only in standalone scope create `project.appId + ".analytics"` using the V4 analytical flavor of `sap.fe.templates.ListReport`, not the V2 ALP component, with release-matched `views` settings.
7. Claim chart/table switching or drilldown only when observed in the actual preview or explicitly generated standalone app. Do not add unsupported KPIs, visual filters, or intent navigation.
8. Keep analytical endpoints read-only. Any drill-through to the transactional app must pass real keys/filter context and preserve authorization.

## Acceptance checks

- A real `$apply` aggregation query returns expected groups and values when SAP access exists.
- Backend queries/annotations preserve the configured filters and measure aggregation; verify chart/table behavior only where an actual preview/frontend supports it.
- Mixed-currency/unit test data does not produce a misleading combined total.
- Annotation paths resolve. A standalone app, if requested, uses the correct V4 list-report flavor.
- Empty data, service failures, and authorization restrictions are handled.
- In default scope run backend/service checks and available ADT preview, marking frontend build/lint not applicable. Run standalone UI checks only for explicit standalone scope. Without a connected service, mark aggregation correctness and release compatibility unverified.

## Deliver

Provide analytical backend additions/annotations, a representative query and observed results where available, supported preview steps, limitations, and the verification report. Include a separate UI app only for explicit standalone scope.
