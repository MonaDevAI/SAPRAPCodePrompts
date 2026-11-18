# IT Equipment Request Hub: three Copilot examples

Use connected ABAP MCP to create and activate one custom RAP business object with three RAP-focused scenarios from the same [configuration](rap-project.json). This folder supplies input, synthetic data, and prompts to run in your environment, **not pre-generated or SAP-validated applications**. Frontend generation is outside scope.

| Run | Example | Intended result |
| --- | --- | --- |
| 1 | [List report + object page](01-transactional.md) | RAP objects, UI annotations, draft behavior, validations, and supported ADT preview |
| 2 | [Overview backend preparation](02-overview.md) | Data/annotations for recent requests, required dates, cost, and unit cards; remaining frontend work documented |
| 3 | [Analytical service and annotations](03-analytical.md) | Read-only aggregation support, chart/table annotations, queries, and supported preview instructions |

Run them in this order to reuse the backend. Chart-card data needs aggregation support even without a separate UI.

**This is a RAP backend and ADT-preview project only.** Generate backend objects, annotations, service bindings, inventory, and preview instructions: no frontend folders, npm scripts, or UI5 build checks. An actual OVP is a separate frontend outside this library and does not appear automatically in ADT preview. Analytical preview capabilities also depend on the target.

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

## Connect ABAP MCP and select the SAP target

The walkthrough requests explicitly select **connected** development: create/activate actual SAP objects through ABAP MCP. The bundled JSON retains `source-only` as an offline input. An explicit connected request overrides that saved sample mode for the run, without silently editing the file; all real target requirements still apply.

Follow [ADT MCP setup](../../docs/setup.md), then configure **this folder's** `rap-project.json`:

- Set `target.mode` to `connected`.
- Set the real `target.adtProject` and authorized development `target.package`.
- Set a valid `target.transport` request/task for transportable packages; use `null` for `$TMP`.
- Confirm actual package/language compatibility (`standard` for a compatible classic package, `cloud` only for an ABAP Cloud-compatible package); discover release/UI5 capabilities rather than guessing.

Keep the template General project and the ABAP project in the same Eclipse workspace. The former stores instructions; ADT MCP creates actual ABAP objects in the latter's SAP system/package. No local frontend tooling is required for this RAP workflow.

Start with this read-only preflight:

```text
Use the sap-rap-development skill.
Read examples\equipment-request-hub\rap-project.json,
not the root purchase-order configuration.

Inspect available ABAP MCP tools/generators and the configured target.
Check project/package/transport access and discover ABAP/SAPUI5 versions.
Identify support for RAP draft UI services, requested service
annotations, and server-side OData V4 aggregation.
Use RAP/ADT-preview scope; frontend generation is outside this project.

Report available capabilities and blockers.
Do not create/change objects or load data during this preflight.
```

This preflight is read-only regardless of saved mode. Resolve connection/target blockers before the generation request below. If you instead want offline drafting, explicitly request source-only mode; local files cannot prove SAP activation or live service behavior.

## Generate all three

For the easiest supervised demo, run the three linked walkthroughs separately. Each includes a complete request and acceptance checks.

To request the full set in one Copilot conversation:

```text
Use the sap-rap-development skill with
examples\equipment-request-hub\rap-project.json.

Read this example's README and its three walkthroughs.
Use ABAP MCP in connected mode to create/update and activate
the actual SAP objects, even if the saved sample says source-only.
Resolve and validate the real project/package/transport/language
before writes; do not silently edit the configuration.
Generate all three examples in the same SAP target, in order:
1. Managed draft RAP backend and list/object-page annotations.
2. Backend data/annotation preparation for the configured overview cards.
3. Analytical service support and configured chart/table annotations.

Reuse compatible backend objects; do not create three transactional BOs.
Verify their persisted activation state and real service metadata.
Preserve currency-separated aggregation.
Stay in RAP/ADT-preview scope. Do not generate frontend projects
or run existing standalone UI lint/build scripts.
Document the frontend work needed for a real OVP or full analytical UI.
Apply the additional business rules stated in walkthrough 01.
Do not insert fixtures or create approval/purchasing integrations.
Run available checks and report exact outcomes for each example.
Do not stop after local file generation. If required MCP operations
are unavailable, report the connected-development blocker.
```

The primary output is actual ABAP repository objects in the confirmed SAP project/package, with activation diagnostics and read-back evidence. Also record local output below `generated/equipment-request-hub`:

| Directory/artifact | Expected identity |
| --- | --- |
| `backend/` | Supplementary source copies/object inventory, including SAP table `ZRC_T_EQR` |
| `GENERATION-REPORT.md` | Actual SAP target/object identities, MCP operations, activation state, and separate outcomes for each example |

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

## Optional automated input checks

**Skip npm setup if your goal is ABAP generation through Eclipse ADT MCP.** Copilot must inspect this configuration directly when the optional checker is unavailable, report the automated check as not run, and proceed once actual configuration/SAP requirements are satisfied.

If you choose automated input checks, run these from the repository root with Node.js 22+ installed. The first command restores only the local check tooling:

```powershell
npm ci --ignore-scripts
npm run check -- --config .\examples\equipment-request-hub\rap-project.json --fixtures .\examples\equipment-request-hub\requests.sample.json
npm test
```

The fixture checker validates configured types, required values, defaults, and allowed-value membership. A missing `ajv` package must not be presented as a blocker to ABAP generation. The checker does not execute RAP validations, check SAP currency customizing, or prove that the target supports preview features.

For the recording/blog, show the selected skill, configuration, real tool calls, generated inventory, and **observed** checks. Only show running UI screenshots after actually launching and verifying that UI.
