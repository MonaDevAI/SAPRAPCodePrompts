# sapdevgitskill

**ABAP RAP development prompts for GitHub Copilot and ABAP MCP.**

Develop managed, draft-enabled RAP business objects directly in SAP: persistence tables, CDS view entities, behavior definitions and implementations, metadata extensions, and OData V4 UI services. Use the prompts with connected ABAP/ADT MCP to create, activate, and check these objects in your development package.

This is a prompt library, not a generator executable or an SAP product. Markdown provides instructions to Copilot; the available tools, SAP release, and permissions determine what it can actually generate, activate, and test.

## Choose a RAP prompt

| RAP prompt | ABAP development deliverables |
| --- | --- |
| [RAP business object](.github/prompts/rap-business-object.prompt.md) | Managed, draft-enabled RAP BO, persistence, CDS views, behavior, and OData V4 UI service |
| [List-report CDS annotations](.github/prompts/rap-list-report.prompt.md) | Metadata extensions for columns, filters, search, and supported ADT list preview |
| [Object-page behavior and annotations](.github/prompts/rap-object-page.prompt.md) | Draft behavior, facets, field groups, value helps, and supported detail/edit preview |
| [Overview data services](.github/prompts/rap-overview-page.prompt.md) | RAP service entities, qualified annotations, and card-to-entity mappings |
| [Analytical CDS and service](.github/prompts/rap-analytical-page.prompt.md) | Read-only analytical entities, aggregation support, chart/table annotations, and service-query checks |

Annotation and analytical-service prompts reuse a compatible RAP business object or create missing prerequisites first. Running multiple prompts for the same configuration must reuse objects, not create duplicate business objects.

Scope is ABAP RAP development and supported ADT service preview, as defined in the [generation contract](docs/generation-contract.md). Overview data services and analytical annotations do not by themselves create a complete dashboard or analytical UI.

## Three-example showcase

The [IT Equipment Request Hub](examples/equipment-request-hub/README.md) includes one complete configuration, 20 synthetic requests, and three Eclipse/Copilot walkthroughs:

1. [List report + object page](examples/equipment-request-hub/01-transactional.md).
2. [Overview backend preparation](examples/equipment-request-hub/02-overview.md).
3. [Analytical service and annotations](examples/equipment-request-hub/03-analytical.md).

The examples reuse one RAP business object and need no real supplier/material masters. They include copyable Copilot requests and expected fixture totals, not pre-generated or SAP-validated applications. All requests stay within RAP scope; frontend applications are not generated. Use the showcase configuration path explicitly; the root configuration remains the purchase-order example.

## Quick start

1. Select **Use this template > Create a new repository** on GitHub, then clone your new repository and open its root in your Copilot-enabled editor. No individual prompt files need to be copied.

   To try the library directly instead:

   ```powershell
   git clone https://github.com/MonaDevAI/sapdevgitskill.git
   Set-Location sapdevgitskill
   ```

2. Connect/authenticate [ABAP ADT MCP](docs/setup.md) in Eclipse. Edit [rap-project.json](rap-project.json) with your real ADT project, authorized package, transport, and package-compatible ABAP language version; select `target.mode: "connected"`. The supplied business model is complete, but its saved `source-only` target is an offline sample, not a connected SAP configuration. For a different business entity, update names, fields, and UI references.

3. Give Copilot this RAP development prompt:

   ```text
   Use the sap-rap-development skill.
   Act as an ABAP RAP developer and develop the business object
   defined in rap-project.json using connected ABAP MCP.

   Use the configured ADT project, development package, transport,
   and compatible ABAP language version. Resolve missing target details first.

   Create a managed, draft-enabled RAP business object with:
   - Active and draft persistence tables.
   - Root/interface and projection CDS view entities.
   - Root and projection behavior definitions.
   - A behavior pool with defaults and server-side validations.
   - CDS metadata extensions for list-report and object-page annotations.
   - A service definition and OData V4 UI service binding.

   Use UUID keys, audit fields, entity ETags, and the draft total ETag.
   Preserve currency/unit semantics.
   Reuse compatible existing SAP objects.

   Activate the objects in dependency order, correct introduced errors,
   and verify their SAP activation state and real service metadata.
   Provide the object inventory, check results, and ADT preview steps.
   ```

   If your editor does not discover skills, attach the chosen `.prompt.md`, [generation contract](docs/generation-contract.md), and `rap-project.json` to chat and say:

   ```text
   Follow the attached prompt and generation contract.
   Use rap-project.json and ABAP MCP in connected mode to create and activate
   the RAP objects in SAP, not just local files. Verify their actual state.
   Resolve missing target details before writes. Do not generate a standalone UI.
   ```

4. Inspect the actual SAP repository objects in your ADT project/package and their activation diagnostics. Review the inventory/evidence in `generated/purchase-orders/GENERATION-REPORT.md`; local source copies are supplementary. Missing MCP access or creation/activation capability must be reported as a blocker, not replaced by a local-files success claim. ADT preview does not require a local frontend project or mean source-only development.

**VS Code Local sessions:** clients supporting prompt files also expose `/rap-business-object`, `/rap-list-report`, `/rap-object-page`, `/rap-overview-page`, and `/rap-analytical-page`. Current VS Code documentation restricts prompt-file execution to its Local harness and recommends skills for newer Copilot harness sessions. Use the included [skill](.github/skills/sap-rap-development/SKILL.md) or the attachment workflow rather than assuming these commands exist in every editor.

**Eclipse:** updated GitHub Copilot for Eclipse supports skills and prompt files in the chat `/` picker. Import the whole repository as a General project, reference the selected configuration, and choose the skill or prompt. Connected SAP generation additionally needs an enabled/configured ADT MCP server. See [setup](docs/setup.md).

## Minimal configuration

The default example uses a custom demo entity, not SAP's standard purchase-order business object.

| Setting | Purpose |
| --- | --- |
| `project.entity`, `entitySet`, `shortName` | Business names and a short technical object stem |
| `project.namespacePrefix` | Customer-object prefix, initially `ZRC` |
| `businessObject.fields` | Your business fields; technical UUID/audit/draft fields are generated separately |
| `ui` | List columns, filters, object-page groups, overview cards, and analytical measures |
| `target.mode` | `source-only` or `connected` |
| `target.adtProject`, `package`, `transport` | Required SAP target details for connected work |

Field types are `string`, `date`, `integer`, `boolean`, `decimal`, `amount`, `currency`, `quantity`, and `unit`. Amounts reference a currency field; quantities reference a unit field. For a non-analytical application, omit `ui.analytics` and any overview chart cards; `ui.overview` is optional too. The [JSON schema](rap-project.schema.json) supplies editor validation. The [worked example](examples/purchase-order.md) explains the inputs and expected results.

The former `project.uiMode` option has been removed and is rejected by validation; omit it from configurations. Existing `project.appId` values remain accepted as optional project identifiers, not frontend settings. Existing generated frontend files are left untouched.

### Connected target details

Connect and authenticate ADT MCP first. In `rap-project.json`, set:

```json
{
  "target": {
    "mode": "connected",
    "adtProject": "YOUR_EXISTING_ADT_PROJECT",
    "package": "YOUR_EXISTING_CUSTOMER_PACKAGE",
    "transport": "YOUR_EXISTING_WORKBENCH_REQUEST",
    "abapLanguageVersion": "standard",
    "odataVersion": "4.0",
    "ui5Version": null
  }
}
```

Replace the example target values with real ones. Use `transport: null` for the local `$TMP` package only. The client must be able to access the selected project/package, and the installed SAP release must support the requested features. `ui5Version: null` asks Copilot to discover it; it does not mean every UI5 version is compatible.

Use `standard` for a compatible classic ABAP package; select `cloud` only for an ABAP Cloud-compatible package. Private/on-premise deployment or `$TMP` alone does not establish language compatibility.

An explicit connected creation request, like the quick start above, selects effective connected execution even if the sample file still says `source-only`. Copilot must report that override, discover/confirm and validate the real target before writes, and leave saved configuration unchanged unless asked to edit it. Without an explicit override, the saved execution mode is respected.

The prompts discover actual MCP tools/generators, create or update real objects, activate in dependency order, read back their state, and check the service. They do not assume tool names/signatures. If SAP access is missing, Copilot must report that limitation, not claim local files were activated. Read-only preflight never authorizes writes.

### Optional source-only drafting

For offline ABAP source drafts, explicitly request source-only generation or use the saved sample `target.mode: "source-only"` without a connected override. This produces local sources/import steps and cannot satisfy connected creation or prove activation. It is an alternative to the primary MCP workflow, not a fallback silently chosen when MCP fails.

## Generation and verification

Every prompt follows the same [generation contract](docs/generation-contract.md): validate inputs, inspect capabilities and existing objects, generate in dependency order, run available checks, and report exact outcomes.

- New transactional backends use managed RAP, UUID keys, and draft support.
- CDS/UI annotations support the target's standard Fiori elements ADT preview; no local controllers are generated.
- Overview backend readiness and analytical aggregation are checked against the installed release; backend readiness is not a working dashboard claim.
- Currency/unit boundaries are preserved; mixed currencies must not be added into one unqualified total.
- Connected RAP checks include activation, applicable ATC/ABAP Unit checks, real service metadata, and supported ADT preview. Frontend build/lint checks are outside scope.

Repository checks validate configuration, references, prompt structure, and validation logic. **They do not prove that generated ABAP activates or that a Fiori application runs.** No SAP-system generation or browser acceptance run is included in this repository's initial verification.

## Optional template-repository checks

This section is for maintainers and users who choose automated input validation; it is **not** an initial setup requirement for ABAP generation. Node.js 22 or later is needed only for these checks:

```powershell
npm ci --ignore-scripts
npm run check
npm test
```

To validate another configuration:

```powershell
npm run check -- --config .\my-project.json
```

To also validate the showcase's synthetic fixture records:

```powershell
npm run check -- --config .\examples\equipment-request-hub\rap-project.json --fixtures .\examples\equipment-request-hub\requests.sample.json
```

Fixture checks cover the configured types, required values, defaults, and allowed-value membership; generated RAP business-rule tests and live-service checks remain separate.

If the checker reports a missing `ajv` package, either restore dependencies using the optional command above or let Copilot perform the documented manual review. A missing validator does not prevent SAP-side generation/activation checks through ADT MCP. Invalid configuration and actual SAP errors must still be resolved.

Do not commit passwords, MCP tokens, destinations containing credentials, or authenticated browser state. Keep local MCP connection settings in your client's secure configuration.

## Contents

- `.github/prompts`: the five generation templates.
- `.github/skills/sap-rap-development`: a skill entry point that selects a template.
- `docs`: shared generation rules, editor setup, and official references.
- `rap-project.json`: the single editable configuration and purchase-order example.
- `rap-project.schema.json`: the configuration contract.
- `examples/equipment-request-hub`: three RAP showcase walkthroughs, shared configuration, and fixtures.
- `scripts` and `tests`: repository/configuration checks and focused regression tests.

See [official references](docs/references.md) for SAP RAP, ADT MCP, Fiori elements, and Copilot documentation. MIT licensed; not affiliated with or endorsed by SAP or GitHub.
