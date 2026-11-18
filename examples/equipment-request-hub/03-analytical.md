# Example 3: analytical page

Reuse the business data and any analytical service added for [Example 2](02-overview.md). The [configuration](rap-project.json) defines a cost-by-equipment column chart, requested-unit and cost measures, and equipment/office/priority/status/currency dimensions.

## Copilot request

```text
Use the sap-rap-development skill and
examples\equipment-request-hub\rap-project.json.
Follow docs\generation-contract.md and the analytical-page template.

Reuse the existing Equipment Request Hub transactional backend
and compatible analytical objects created for the overview cards.
Generate a separate read-only analytical UI:
com.example.equipmentrequests.analytics.

Use the OData V4 analytical flavor of sap.fe.templates.ListReport,
not the V2 AnalyticalListPage component.
Verify real Aggregation.ApplySupported metadata and execute a
representative $apply query when connected.

Use SUM for EstimatedAmount and Quantity. EstimatedAmount is already
the request's total estimate; do not multiply it by Quantity.
Preserve CurrencyCode as a semantic grouping dimension.
Require a single currency for the main cost chart unless the target
supports a correctly separated multi-currency presentation.

Honor target.mode. Do not replace the transactional service,
duplicate the backend, or add write actions to analytical endpoints.
Do not claim client-side sums establish server aggregation support.

Run available service/build/browser checks.
Append exact outcomes and remaining limitations to the shared
GENERATION-REPORT.md, preserving the previous examples' results.
```

## Query to verify

After confirming the actual service URL and entity set, use this relative query against the analytical entity set. Replace the entity-set alias if the target exposes a separately named analytical projection:

```text
EquipmentRequests?$apply=filter(CurrencyCode eq 'USD')/groupby((EquipmentType,CurrencyCode),aggregate(EstimatedAmount with sum as TotalEstimatedAmount,Quantity with sum as TotalQuantity))
```

The service client must correctly encode query spaces and other URL characters. Inspect release-specific support before issuing the query; the example is an acceptance request, not proof the service supports it.

For an unchanged fixture, the query should produce:

| Equipment | Currency | TotalQuantity | TotalEstimatedAmount |
| --- | --- | --- | --- |
| LAPTOP | USD | 8 | 9600.00 |
| MONITOR | USD | 10 | 3000.00 |
| DOCK | USD | 13 | 1950.00 |
| HEADSET | USD | 14 | 1400.00 |

Order is not significant. Compare decimal values numerically, not by JSON string/number serialization or trailing-zero formatting. Results may also contain protocol/type annotations.

## Show and verify

1. Launch the app under `generated/equipment-request-hub/analytics` and filter `CurrencyCode=USD`.
2. Compare the chart and table against the real aggregation response above.
3. Filter `EquipmentType=LAPTOP`; the unchanged fixture represents 8 units and USD 9600.00.
4. Filter `Status=N` with USD; across all equipment, expect 16 units and USD 6300.00.
5. Select EUR; compare its separate groups against the [complete fixture table](README.md). Never display USD and EUR as one unqualified cost total.
6. Confirm read-only analytical behavior, empty/error handling, annotation resolution, and any supported chart/table switching.

If aggregation or the UI cannot run on the installed stack, retain useful source output and mark those checks **blocked** or **not run**. Finish with separate outcomes for transactional, overview, and analytical examples, rather than a single unsupported success claim.
