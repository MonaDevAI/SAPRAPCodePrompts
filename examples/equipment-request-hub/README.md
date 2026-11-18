# IT Equipment Request Hub: three Copilot examples

Build one custom RAP business object and three Fiori experiences from the same [configuration](rap-project.json). This folder supplies input, synthetic data, and prompts to run in your own environment, **not pre-generated or SAP-validated applications**.

| Run | Example | Intended result |
| --- | --- | --- |
| 1 | [List report + object page](01-transactional.md) | Search/filter requests, create/edit drafts, fixed-value helps, and server validation |
| 2 | [Overview page](02-overview.md) | Recent requests, required dates, estimated cost by equipment, and requested units by office |
| 3 | [Analytical page](03-analytical.md) | Chart/table analysis by equipment, office, priority, status, and currency |

Run them in this order to reuse the backend. Overview chart cards need aggregation support even before the separate analytical UI exists.

## What the app tracks

The configured entity has a request number, request date, equipment type, office, unit count, estimated total cost, currency, required date, priority, and status.

Equipment, office, priority, and status have synthetic fixed-value lists. No real supplier, material, employee, or standard procurement master data is required. `EstimatedAmount` is the **whole request's estimated cost**, not a unit price; do not multiply it by `Quantity` again. `Quantity` counts individual pieces, not mixed measurement units.

Status is an editable tracking value, not an implemented approval workflow. This example does not purchase equipment, reserve stock, send notifications, or create standard SAP business documents.

## Open in Eclipse

1. Use the repository's **Use this template** option if you want your own copy.
2. In Eclipse, choose **File > Import > Git > Projects from Git > Clone URI** and enter your repository URL, or `https://github.com/MonaDevAI/SAPRAPCodePrompts.git`.
3. Clone branch `main` outside the Eclipse workspace and choose **Import as General Project**, selecting the repository root.
4. Update GitHub Copilot for Eclipse. In **Preferences > GitHub Copilot > Custom Instructions**, choose **Referenced projects** to avoid unrelated workspace instructions.
5. Reference this folder's `rap-project.json` in Copilot Chat, then type `/` and select **sap-rap-development** or the relevant `rap-*` prompt. Current Eclipse Copilot supports both; see [official references](../../docs/references.md).

Do not copy this configuration over the root purchase-order example. Every request below names this folder's configuration explicitly. If a picker or file reference is unavailable, use the attachment fallback in [setup](../../docs/setup.md).

## Select source-only or connected generation

The example defaults to `source-only`: generate local files without changing SAP. Source-only runs cannot prove SAP activation or live service behavior.

For connected generation, follow [ADT MCP setup](../../docs/setup.md), then edit **this folder's** `rap-project.json`:

- Set `target.mode` to `connected`.
- Set the real `target.adtProject` and authorized development `target.package`.
- Set a valid `target.transport` request/task for transportable packages; use `null` for `$TMP`.
- Select the actual ABAP language version; allow Copilot to discover release/UI5 capabilities rather than guessing.

Keep the template General project and the ABAP project in the same Eclipse workspace. The former stores instructions; ADT MCP creates actual ABAP objects in the latter's SAP system/package. Standalone overview/analytical UI builds also need local file/build tooling; ABAP MCP alone does not establish those capabilities.

Start with this read-only preflight:

```text
Use the sap-rap-development skill.
Read examples\equipment-request-hub\rap-project.json,
not the root purchase-order configuration.

Inspect available ABAP MCP tools/generators and the configured target.
Check project/package/transport access and discover ABAP/SAPUI5 versions.
Identify support for RAP draft UI services, OVP V4 cards,
and server-side OData V4 aggregation.

Report available capabilities and blockers.
Do not create/change objects or load data during this preflight.
```

In source-only mode, missing SAP access is expected; the preflight must label release-dependent conclusions as unverified. In connected mode, resolve target-access blockers before running generation.

## Generate all three

For the easiest supervised demo, run the three linked walkthroughs separately. Each includes a complete request and acceptance checks.

To request the full set in one Copilot conversation:

```text
Use the sap-rap-development skill with
examples\equipment-request-hub\rap-project.json.

Read this example's README and its three walkthroughs.
Generate all three examples in order:
1. Managed draft RAP backend, list report, and object page.
2. Separate overview app using the configured cards.
3. Separate analytical app using the configured dimensions/measures.

Reuse compatible backend objects; do not create three transactional BOs.
Honor target.mode and preserve currency-separated aggregation.
Apply the additional business rules stated in walkthrough 01.
Do not insert fixtures or create approval/purchasing integrations.
Run available checks and report exact outcomes for each example.
```

Expected output below `generated/equipment-request-hub`:

| Directory/artifact | Expected identity |
| --- | --- |
| `backend/` | Shared RAP sources/object inventory; active table `ZRC_T_EQR` |
| `app/` | Main app `com.example.equipmentrequests` |
| `overview/` | OVP app `com.example.equipmentrequests.overview` |
| `analytics/` | Analytical app `com.example.equipmentrequests.analytics` |
| `GENERATION-REPORT.md` | Separate outcomes and evidence for each example |

Additional read-only analytical/value-help objects may be required by the target. Inventory them rather than renaming/replacing the transactional service.

## Sample data and reproducible totals

[requests.sample.json](requests.sample.json) contains 20 synthetic requests: 16 in USD and four in EUR. Dates are fixed fixtures, not a promise of future delivery dates. The files are not automatically inserted into SAP.

For a predictable first chart, filter `CurrencyCode=USD`. Over the **unchanged full fixture**, expected results are:

| Currency | Equipment | Requested units | Estimated total cost |
| --- | --- | --- | --- |
| USD | LAPTOP | 8 | 9600.00 |
| USD | MONITOR | 10 | 3000.00 |
| USD | DOCK | 13 | 1950.00 |
| USD | HEADSET | 14 | 1400.00 |
| EUR | LAPTOP | 1 | 1100.00 |
| EUR | MONITOR | 2 | 500.00 |
| EUR | DOCK | 3 | 390.00 |
| EUR | HEADSET | 2 | 180.00 |

Currency subtotals are USD 15950.00 / 45 units and EUR 2170.00 / 8 units. Never label their combined numeric sum as one currency. Creating/editing records during a live demo changes these expected totals; restore the fixture state or filter to a separately identified test subset before comparing.

For authorized DEV data loading, use the separate request in [walkthrough 01](01-transactional.md). It requires supported transactional APIs/EML and must not silently overwrite existing records or directly insert into RAP-managed tables.

## Validate inputs locally

From the repository root, after restoring repository dependencies:

```powershell
npm run check -- --config .\examples\equipment-request-hub\rap-project.json --fixtures .\examples\equipment-request-hub\requests.sample.json
npm test
```

The fixture checker validates configured types, required values, defaults, and allowed-value membership. It does not execute RAP validations, check SAP currency customizing, or prove that the target supports the floorplans.

For the recording/blog, show the selected skill, configuration, real tool calls, generated inventory, and **observed** checks. Only show running UI screenshots after actually launching and verifying that UI.
