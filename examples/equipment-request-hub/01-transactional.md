# Example 1: list report and object page

Start with the [shared example setup](README.md). Select the **sap-rap-development** skill in Eclipse Copilot Chat, then submit the request below. Alternatively choose the list-report/object-page prompts and supply the same configuration path.

## Copilot request

```text
Use the sap-rap-development skill.
Act as an ABAP RAP developer. Develop a managed, draft-enabled
EquipmentRequest business object using
examples\equipment-request-hub\rap-project.json.

Use connected ABAP MCP and the confirmed ADT project, development
package, transport, and compatible ABAP language version.
Follow docs\generation-contract.md and the RAP business-object,
list-report, and object-page templates.

Create or extend these artifacts using the configured naming rules
(names below are for the supplied ZRC prefix and EQR short name):
- Active table ZRC_T_EQR and draft table ZRC_D_EQR.
- Root/interface CDS entity ZRC_R_EQR and projection ZRC_C_EQR.
- Root/projection behavior definitions and behavior pool ZBP_ZRC_EQR.
- CDS metadata extensions for list columns, filters, header, and
  Request, Delivery, Cost, and Tracking field groups.
- Service definition ZRC_UI_EQR and OData V4 UI binding ZRC_UI_EQR_O4,
  exposing entity set EquipmentRequests.

Implement UUID keys, audit fields, entity ETags, total draft ETag,
draft actions, configured defaults, fixed-value helps/texts,
required-field checks, and allowed-value validations.
Also validate Quantity > 0 and EstimatedAmount >= 0;
these are additional business rules beyond the JSON field constraints.
Apply the target's authorization policy and preserve currency semantics.
Reuse compatible existing SAP objects. Do not load test data or add
approval/purchasing integrations.

Activate in dependency order, correct introduced errors, read back
the active SAP objects, and check the real service metadata.
Run applicable ATC/ABAP Unit checks and supported ADT preview.
Return the SAP object inventory, activation/check results, preview
steps, and any unresolved target or tool limitations.
```

## Intended results

The base technical names are `ZRC_T_EQR`, `ZRC_D_EQR`, `ZRC_R_EQR`, `ZRC_C_EQR`, `ZBP_ZRC_EQR`, `ZRC_UI_EQR`, and `ZRC_UI_EQR_O4`. The service alias is `EquipmentRequests`. Use the shared [naming contract](../../docs/generation-contract.md), and report any target-driven naming adjustments.

The requested output is actual ABAP objects in the confirmed SAP project/package, with verified activation state. Supplementary sources/inventory and the evidence report live under `generated/equipment-request-hub`. Local copies alone do not complete this request. Use supported ADT service preview to inspect the annotated list/object flow; it is not a standalone UI app or proof of deployment.

## Optional DEV fixture loading

For local mocks, use [requests.sample.json](requests.sample.json) without modifying SAP. To load it into an authorized DEV target, send the following **separate** request only after reviewing the target and generated behavior:

```text
I authorize loading the supplied synthetic equipment fixtures into
the configured non-production development target only.
Use examples\equipment-request-hub\requests.sample.json.

Inspect supported data-loading capabilities first.
Use the BO's supported transactional service/draft flow or RAP EML,
never direct inserts into RAP-managed persistence.
Resolve each RequestNumber before creating records: skip existing
matching records, and report conflicting/multiple matches without
overwriting them. Do not delete records or reset the database.
Validate currency codes against the target; do not create SAP
currency/unit customizing or standard master data.

If tools cannot load the records, provide a separate reviewed loader
or exact manual instructions and mark the load as not run.
Report records created, skipped, conflicted, and failed.
```

Fixture loading may trigger normal authorizations and validations; do not bypass them. The generic fixture checker does not enforce the two additional business rules above; those require generated backend tests.

## Show and verify

| Demo action | Expected behavior to verify |
| --- | --- |
| Open the list and filter `EquipmentType=LAPTOP` | Only matching requests remain |
| Create a draft request | Default priority/status/quantity/currency appear through implemented backend behavior |
| Leave equipment or required date empty | Save is rejected with a meaningful backend message |
| Submit an invalid status through a supported API test | Server-side allowed-value validation rejects it |
| Set quantity to zero or cost below zero | The additional business-rule validations reject the change |
| Edit, discard, then reopen an existing request | Active data remains unchanged by the discarded edit |
| Save/activate a valid draft | The active record reflects the valid change |

Run write scenarios only against authorized test data. Review activation and applicable ATC/ABAP Unit results in connected mode. Preserve the observed outcomes in `GENERATION-REPORT.md`; the table above is an acceptance plan, not a record of passed tests.

Continue with [Example 2: overview page](02-overview.md).
