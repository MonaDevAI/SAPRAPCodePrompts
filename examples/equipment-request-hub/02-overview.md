# Example 2: overview page

Reuse the backend from [Example 1](01-transactional.md) and the same [configuration](rap-project.json). The overview is a separate card-based Fiori app, not an extra object-page facet.

## Copilot request

```text
Use the sap-rap-development skill and
examples\equipment-request-hub\rap-project.json.
Follow docs\generation-contract.md and the overview-page template.

Reuse the Equipment Request Hub backend from example 01.
Generate a separate OVP app with the four configured cards:
RecentRequests, RequiredDates, CostByEquipment, and UnitsByOffice.

Inspect the installed SAPUI5/Fiori tools capabilities for OData V4
OVP cards and global filtering. Verify chart-card aggregation support;
reuse or add a read-only analytical service only when necessary.
Do not create the separate analytical UI yet.

Propagate compatible filters to the cards. For estimated-cost charts,
require a single currency or a supported split presentation.
Use CurrencyCode=USD for the first demonstration.
Keep the raw status codes associated with their configured labels.

Honor target.mode. Preserve the existing transactional app.
Use app ID com.example.equipmentrequests.overview.
Do not invent a launchpad intent or silently downgrade to OData V2.
Report unsupported features rather than substituting a fake dashboard.

Run available build/service/browser checks and append this
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

The output is `generated/equipment-request-hub/overview`, using `sap.ovp` configuration and release-compatible card templates. The cost chart needs analytical backend support even though its UI is an overview card.

## Show and verify

1. Launch the actual overview app using its generated run instructions; an ADT transactional service preview is not this app.
2. Filter currency to USD. With the unchanged [fixture](requests.sample.json), compare the equipment cost groups against the [reference table](README.md).
3. Apply an office filter and verify only compatible cards refresh with the correct data.
4. Inspect both list cards' labels, ordering, empty states, and service errors.
5. Demonstrate navigation only when a real local target or configured launchpad intent exists.

If the installed release cannot support a card or aggregation, record that blocker separately from any working cards. Do not label the complete overview app passed when one required card is not implemented.

Continue with [Example 3: analytical page](03-analytical.md).
