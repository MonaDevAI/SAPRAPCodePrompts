---
name: rap-analytical-page
description: Create read-only RAP analytical services, aggregation support, chart/table annotations, and supported ADT preview.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Generate RAP analytical services and annotations

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

Generate RAP analytical service support and chart/table annotations using `ui.analytics`, with available ADT preview instructions. A chart annotation alone does not make a CRUD service analytical or guarantee a full ALP in ADT preview. Do not generate an analytical frontend.

## Execute

1. Resolve execution intent and validate the effective SAP target using the contract. For connected work, create/update and activate actual analytical CDS/service/annotation objects through ABAP MCP, read back their state, and test the real service rather than only writing local sources. Require `ui.analytics`; ask only for missing meaningful dimensions/measures and chart choice. Inspect release, metadata, RAP generators, and supported RAP/SADL aggregation; do not inspect local frontend tooling.
2. Reuse existing backend data and generate a separate, read-only analytical projection/service when necessary. Use supported grouping/aggregation exposure. Only use release-specific annotations such as `@OData.applySupportedForAggregation` when supported by the actual target; never add an analytical-query provider contract or `@Analytics.query` and assume it automatically exposes a usable RAP V4 service.
3. Ensure the real entity-set metadata exposes the `Aggregation.ApplySupported` transformations required by the target SAPUI5 version and the aggregatable/groupable properties. Execute a representative `$apply=groupby(...,aggregate(...))` query when connected. If aggregation is unavailable, state the blocker rather than presenting client-side totals as server analytics.
4. Implement configured dimensions and measure aggregations. Preserve amount/currency and quantity/unit associations. Include semantic references in groupings and require a single-currency/unit filter or a supported split/series presentation for charts. Do not plot or total a mixture as though it were a single currency/unit.
5. Generate backend-qualified `UI.Chart`, `UI.LineItem`, and presentation/selection-presentation variants as required. Resolve annotation references against exposed metadata. Check `AVG`, `MIN`, or `MAX` support rather than assuming `SUM` implies every aggregation works.
6. Deliver analytical backend objects/annotations and actual supported preview instructions. Do not scaffold UI files, npm scripts, or a local verification harness.
7. Claim chart/table switching or drilldown only when observed in actual ADT preview. Do not add unsupported KPIs, visual filters, or intent navigation.
8. Keep analytical endpoints read-only. Any drill-through to the transactional app must pass real keys/filter context and preserve authorization.

## Acceptance checks

- A real `$apply` aggregation query returns expected groups and values when SAP access exists.
- Backend queries/annotations preserve the configured filters and measure aggregation; verify chart/table behavior only where an actual preview/frontend supports it.
- Mixed-currency/unit test data does not produce a misleading combined total.
- Annotation paths resolve against the exposed service metadata.
- Empty data, service failures, and authorization restrictions are handled.
- Run backend/service checks and available ADT preview; frontend build/lint is outside scope and not applicable. Without a connected service, mark aggregation correctness and release compatibility unverified.

## Deliver

Provide analytical backend additions/annotations, a representative query and observed results where available, supported preview steps, limitations, and the verification report. Do not deliver a frontend project.
