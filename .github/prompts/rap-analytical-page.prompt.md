---
name: rap-analytical-page
description: Generate an OData V4 analytical list-report variant with verified RAP aggregation support.
agent: agent
argument-hint: Optional path to a project configuration JSON file
---

# Generate a RAP-based analytical page

Read and follow the complete [generation contract](../../docs/generation-contract.md). Use the configuration path supplied by the user, or [rap-project.json](../../rap-project.json).

## Objective

Generate an OData V4 analytical list page with a chart/table experience using `ui.analytics`. A chart annotation by itself does not make an ordinary RAP service analytical.

## Execute

1. Require `ui.analytics` for this template; if omitted, ask only for the missing meaningful dimensions/measures and chart choice. Inspect the SAP release, SAPUI5 version, service metadata, and installed generator. Determine which documented RAP/SADL aggregation approach the target supports. Do not assume a transactional projection can aggregate on every release.
2. Reuse existing backend data and generate a separate, read-only analytical projection/service when necessary. Use supported grouping/aggregation exposure. Only use release-specific annotations such as `@OData.applySupportedForAggregation` when supported by the actual target; never add an analytical-query provider contract or `@Analytics.query` and assume it automatically exposes a usable RAP V4 service.
3. Ensure the real entity-set metadata exposes the `Aggregation.ApplySupported` transformations required by the target SAPUI5 version and the aggregatable/groupable properties. Execute a representative `$apply=groupby(...,aggregate(...))` query when connected. If aggregation is unavailable, state the blocker rather than presenting client-side totals as server analytics.
4. Implement configured dimensions and measure aggregations. Preserve amount/currency and quantity/unit associations. Include semantic references in groupings and require a single-currency/unit filter or a supported split/series presentation for charts. Do not plot or total a mixture as though it were a single currency/unit.
5. Generate qualified `UI.Chart`, `UI.LineItem`, and presentation/selection-presentation variants as required. Every manifest annotation path must resolve to an emitted qualifier. Check aggregation support for `AVG`, `MIN`, or `MAX` rather than assuming that supporting `SUM` is enough.
6. Generate a separate app with ID `project.appId + ".analytics"` in the contract's analytics directory. For OData V4, configure the analytical flavor of `sap.fe.templates.ListReport`; do not use the V2 `sap.suite.ui.generic.template.AnalyticalListPage` component. Derive the chart/table `views` settings from documentation matching the target release.
7. Enable the requested chart and table switching/drilldown supported by the stack. Do not add visual filters, KPIs, or intent navigation unless their annotations and backend support are actually implemented.
8. Keep analytical endpoints read-only. Any drill-through to the transactional app must pass real keys/filter context and preserve authorization.

## Acceptance checks

- A real `$apply` aggregation query returns expected groups and values when SAP access exists.
- Chart and table use consistent filters and the configured measure aggregation.
- Mixed-currency/unit test data does not produce a misleading combined total.
- Annotation paths resolve and the generated app uses the correct V4 list-report flavor.
- Empty data, service failures, and authorization restrictions are handled.
- Run actual UI build checks and available browser checks. Without a connected service, mark aggregation correctness and release compatibility as unverified.

## Deliver

Provide the analytical backend additions, separate UI app, representative query and observed results where available, compatibility limitations, and the contract's verification report.
