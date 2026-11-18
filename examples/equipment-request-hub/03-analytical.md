# Example 3: RAP analytical service and annotations

Reuse the business data and analytical service added for [Example 2](02-overview.md). The [configuration](rap-project.json) defines cost-by-equipment chart annotations, unit/cost measures, and equipment/office/priority/status/currency dimensions. Default output is analytical RAP service support and annotations, not a local frontend.

## Copilot request

```text
Use the sap-rap-development skill and
examples\equipment-request-hub\rap-project.json.
Follow docs\generation-contract.md and the analytical-page template.

Reuse the existing Equipment Request Hub transactional backend
and compatible analytical objects created for the overview cards.
Generate or complete the read-only analytical service and its
qualified chart/table/presentation annotations.

Use RAP/ADT-preview scope. Do not create a standalone UI project,
manifest, npm scripts, or local JavaScript verification harness.
Do not run existing standalone frontend lint/build scripts.
Verify real Aggregation.ApplySupported metadata and execute a
representative $apply query when connected.

Use SUM for EstimatedAmount and Quantity. EstimatedAmount is already
the request's total estimate; do not multiply it by Quantity.
Preserve CurrencyCode as a semantic grouping dimension.
Verify currency-separated service results and document the need
for a single-currency filter or correctly split chart presentation.

Honor target.mode. Do not replace the transactional service,
duplicate the backend, or add write actions to analytical endpoints.
Do not claim client-side sums establish server aggregation support.

Run available backend/service checks and supported ADT preview.
Do not promise a full ALP/chart experience unless actually observed.
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

## Verify the RAP output

1. Verify activated analytical objects, exposed metadata, and the real USD aggregation response.
2. Inspect chart/table annotation paths; preview only the features the target actually supports.
3. Query `EquipmentType=LAPTOP` with USD; the unchanged fixture represents 8 units and USD 9600.00.
4. Query `Status=N` with USD; across all equipment, expect 16 units and USD 6300.00.
5. Query EUR; compare its separate groups against the [complete fixture table](README.md). Never combine USD/EUR into an unqualified cost total.
6. Confirm read-only service behavior, empty/error handling, and annotation resolution. Mark standalone UI build/lint/rendering not applicable.

If aggregation or requested preview features cannot run, retain useful source output and mark the affected checks **blocked** or **not run**. A full frontend intentionally omitted from RAP scope is not a failed backend build.

## Optional standalone analytical frontend

Only when you want the separate analytical UI, explicitly request:

```text
Generate the standalone Equipment Request Hub analytical frontend
using the existing analytical RAP service and annotations.
This explicitly opts this request into standalone UI scope.
Use app ID com.example.equipmentrequests.analytics under analytics/.
Use the OData V4 analytical flavor of sap.fe.templates.ListReport,
not the V2 ALP component. Preserve currency context.
Run available UI build/browser checks and report exact outcomes.
```

Finish with separate outcomes for transactional preview, overview backend preparation, analytics service/annotations, and any explicitly requested standalone apps.
