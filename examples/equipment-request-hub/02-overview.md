# Example 2: RAP preparation for an overview page

Reuse the backend from [Example 1](01-transactional.md) and the same [configuration](rap-project.json). Default scope prepares RAP data and annotations for cards. A complete overview page is a separate Fiori frontend, not an ADT-preview page or an extra object-page facet.

## Copilot request

```text
Use the sap-rap-development skill and
examples\equipment-request-hub\rap-project.json.
Follow docs\generation-contract.md and the overview-page template.

Use ABAP MCP in connected mode, even if the saved sample says source-only.
Resolve/validate the SAP target before writes without silently editing it.
Create/update and activate required SAP objects and read back their state;
do not stop at local sources/mappings or silently fall back if MCP is unavailable.
Reuse the Equipment Request Hub backend from example 01.
Prepare the backend data and qualified annotations for these cards:
RecentRequests, RequiredDates, CostByEquipment, and UnitsByOffice.

Use RAP/ADT-preview scope, not standalone frontend generation.
Inspect service capabilities and verify chart-card aggregation support;
reuse or add a read-only analytical service only when necessary.
Map card fields, entity sets, annotation qualifiers, and compatible filters.
Do not create UI manifests, frontend folders, npm scripts, or a local harness.
Do not run existing standalone UI lint/build scripts.

For cost data, preserve currency-separated aggregation.
Use CurrencyCode=USD for the first service-query demonstration.
Keep the raw status codes associated with their configured labels.

Keep the confirmed SAP target and preserve existing transactional objects/files.
Document what a real OVP frontend still requires, including target
version/card compatibility, filtering, and navigation configuration.
Do not claim ADT preview renders a full OVP or invent a launchpad intent.

Run available backend/service checks and append this
example's results to GENERATION-REPORT.md without erasing example 01.
```

## Cards and evidence

| Card | Data and acceptance check |
| --- | --- |
| Recent Equipment Requests | Request number, equipment, and status; sorted by request date descending |
| Requests by Required Date | Request number, office, and required date; sorted ascending |
| Estimated Cost by Equipment | Real server aggregation of estimated total cost, with currency context preserved |
| Requested Units by Office | Real server aggregation of the integer unit count, not the number of request rows |

Records with equal sort dates need not appear in a particular relative order. The required-date card includes fulfilled requests unless the user applies a status filter; it is not automatically an overdue/open-work queue.

The connected request updates actual SAP service/annotation objects and verifies activation. Supplementary sources/mappings go under `generated/equipment-request-hub/backend`, with real MCP/activation evidence in the shared report. The cost-card data needs analytical service support even though its intended UI is an overview card.

## Show and verify

1. Inspect the card-to-entity/annotation mapping against real service metadata.
2. Query cost groups with currency USD. With the unchanged [fixture](requests.sample.json), compare against the [reference table](README.md).
3. Verify mapped office filters and configured sort order using service queries.
4. Record which properties/value-help texts are exposed and any unsupported aggregation.
5. Mark frontend rendering/filter propagation/navigation checks not applicable in RAP scope.

Do not label backend readiness a working dashboard. If aggregation is unsupported, report that real backend limitation separately from the intentionally omitted frontend.

## Optional standalone overview frontend

Only when you want the actual OVP app, explicitly request:

```text
Generate the standalone Equipment Request Hub overview frontend
using the existing RAP services and the four configured cards.
This explicitly opts this request into standalone UI scope.
Use app ID com.example.equipmentrequests.overview under overview/.
Verify target V4 OVP/card compatibility, implement valid filters
and real navigation targets, and run available UI checks.
Preserve backend data/objects and do not generate fake launchpad intents.
```

Only this opt-in adds OVP manifests, frontend build dependencies, and UI acceptance checks. A successful backend query alone does not prove that frontend works.

Continue with [Example 3: analytical service and annotations](03-analytical.md).
