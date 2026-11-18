# Example 1: list report and object page

Start with the [shared example setup](README.md). Select the **sap-rap-development** skill in Eclipse Copilot Chat, then submit the request below. Alternatively choose the list-report/object-page prompts and supply the same configuration path.

## Copilot request

```text
Use the sap-rap-development skill.
Use examples\equipment-request-hub\rap-project.json,
not the root purchase-order configuration.
Read docs\generation-contract.md and follow the RAP business-object,
list-report, and object-page templates.

Generate the IT Equipment Request Hub:
- One managed draft-enabled RAP BO with UUID keys and correct ETags.
- CDS/UI annotations for list-report filters and columns.
- Object-page annotations for Request, Delivery, Cost, and Tracking sections.
- Supported value helps/texts for the configured fixed-value fields.
- Server-side required-field and allowed-value validations.

Also implement these explicit demo-specific business rules:
Quantity must be greater than zero.
EstimatedAmount must be greater than or equal to zero.
These rules are additional requirements, not constraints already
expressed by the JSON schema.

Use ABAP MCP in connected mode to create/update and activate these
objects in SAP, even if the saved sample still says source-only.
Discover actual MCP/generator schemas and reuse compatible SAP objects.
Resolve and validate the real project/package/transport/language
before writes; do not silently edit the configuration.
Read back SAP object contents/activation state and verify real metadata.
Do not stop after generating local files. Report unavailable MCP
creation/activation operations as connected-development blockers.
Use RAP/ADT-preview scope: no standalone frontend projects,
UI manifests, npm scripts, or local UI verification harnesses.
Do not run existing generated frontend lint/build scripts.
Do not create purchasing integrations or an approval workflow.
Do not insert sample data yet.

Run available checks. Provide actual object/file locations,
the real service binding and preview steps where available,
and a report distinguishing passed, failed, blocked, and unrun checks.
Do not claim local source generation activated anything in SAP.
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
