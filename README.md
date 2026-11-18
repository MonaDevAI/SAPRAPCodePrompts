# SAPRAPCodePrompts

**Configure once. Ask GitHub Copilot to build your RAP-based Fiori application.**

Reusable Markdown prompts for ABAP RAP business objects and SAP Fiori elements applications. Describe your business entity in one JSON file, choose a prompt, and let Copilot generate the backend, annotations, and the requested UI.

This is a prompt library, not a generator executable or an SAP product. Markdown provides instructions to Copilot; the available tools, SAP release, and permissions determine what it can actually generate, activate, and test.

**No npm setup is required to generate ABAP through Eclipse ADT MCP.** Node.js/npm/Ajv are optional tools for this repository's automated configuration checks. Without them, Copilot must inspect the inputs directly, report that the automated check was not run, and continue once actual configuration/SAP requirements are satisfied.

## Choose a template

| Template | What Copilot builds |
| --- | --- |
| [RAP business object](.github/prompts/rap-business-object.prompt.md) | Managed, draft-enabled RAP BO, persistence, CDS views, behavior, and OData V4 UI service |
| [List report](.github/prompts/rap-list-report.prompt.md) | Searchable, filterable Fiori elements list report using the RAP service |
| [Object page](.github/prompts/rap-object-page.prompt.md) | Draft-enabled detail/edit page, sections, field groups, and list-to-detail navigation |
| [Overview page](.github/prompts/rap-overview-page.prompt.md) | Card-based dashboard with global filtering and navigation |
| [Analytical page](.github/prompts/rap-analytical-page.prompt.md) | OData V4 analytical list-report variant with a chart, table, dimensions, and measures |

UI prompts reuse an existing compatible RAP backend or create the required backend first. Running multiple prompts for the same configuration must reuse objects, not create duplicate business objects.

## Three-example showcase

The [IT Equipment Request Hub](examples/equipment-request-hub/README.md) includes one complete configuration, 20 synthetic requests, and three Eclipse/Copilot walkthroughs:

1. [List report + object page](examples/equipment-request-hub/01-transactional.md).
2. [Overview page](examples/equipment-request-hub/02-overview.md).
3. [Analytical page](examples/equipment-request-hub/03-analytical.md).

The examples reuse one RAP business object and need no real supplier/material masters. They include copyable Copilot requests and expected fixture totals, not pre-generated or SAP-validated applications. Use the showcase configuration path explicitly; the root configuration remains the purchase-order example.

## Quick start

1. Select **Use this template > Create a new repository** on GitHub, then clone your new repository and open its root in your Copilot-enabled editor. No individual prompt files need to be copied.

   To try the library directly instead:

   ```powershell
   git clone https://github.com/MonaDevAI/SAPRAPCodePrompts.git
   Set-Location SAPRAPCodePrompts
   ```

2. Edit [rap-project.json](rap-project.json). The supplied purchase-order example already works as a complete input. For your own application, change the entity names, `shortName`, title, and `businessObject.fields`; update the UI field references to match.

3. Ask Copilot:

   ```text
   Use the sap-rap-development skill to generate a list report from rap-project.json.
   ```

   If your editor does not discover skills, attach the chosen `.prompt.md`, [generation contract](docs/generation-contract.md), and `rap-project.json` to chat and say:

   ```text
   Follow the attached prompt and generation contract.
   Use rap-project.json as the configuration and generate the application files.
   ```

4. Review the generated files under `generated/purchase-orders`. The default `source-only` mode does not change an SAP system. Follow the generated activation/import steps, or configure connected mode as described below.

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

### Generate directly in SAP

Connect and authenticate ADT MCP first. In `rap-project.json`, set:

```json
{
  "target": {
    "mode": "connected",
    "adtProject": "YOUR_EXISTING_ADT_PROJECT",
    "package": "YOUR_EXISTING_CUSTOMER_PACKAGE",
    "transport": "YOUR_EXISTING_WORKBENCH_REQUEST",
    "abapLanguageVersion": "cloud",
    "odataVersion": "4.0",
    "ui5Version": null
  }
}
```

Replace the example target values with real ones. Use `transport: null` for the local `$TMP` package only. The client must be able to access the selected project/package, and the installed SAP release must support the requested features. `ui5Version: null` asks Copilot to discover it; it does not mean every UI5 version is compatible.

The prompts discover actual MCP tools and generators instead of assuming tool names or signatures. If SAP access is missing, Copilot must report that limitation, not claim that local files were activated.

## Generation and verification

Every prompt follows the same [generation contract](docs/generation-contract.md): validate inputs, inspect capabilities and existing objects, generate in dependency order, run available checks, and report exact outcomes.

- New transactional backends use managed RAP, UUID keys, and draft support.
- Standard Fiori elements and annotations are preferred over custom controllers.
- Overview cards and analytical aggregation are checked against the installed release.
- Currency/unit boundaries are preserved; mixed currencies must not be added into one unqualified total.
- Connected checks include activation, applicable ATC/ABAP Unit checks, and real service metadata. UI checks use the generated project's actual scripts and a browser when available.

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

If the checker reports a missing `ajv` package, either restore dependencies using the optional command above or let Copilot perform the documented manual review. A missing validator does not prevent SAP-side generation/activation checks through ADT MCP. Invalid configuration and actual SAP errors must still be resolved. Building a separately generated Fiori UI project may need its own Node/npm tooling; that is a different requirement.

Do not commit passwords, MCP tokens, destinations containing credentials, or authenticated browser state. Keep local MCP connection settings in your client's secure configuration.

## Contents

- `.github/prompts`: the five generation templates.
- `.github/skills/sap-rap-development`: a skill entry point that selects a template.
- `docs`: shared generation rules, editor setup, and official references.
- `rap-project.json`: the single editable configuration and purchase-order example.
- `rap-project.schema.json`: the configuration contract.
- `examples/equipment-request-hub`: the three-floorplan showcase configuration, fixtures, and walkthroughs.
- `scripts` and `tests`: repository/configuration checks and focused regression tests.

See [official references](docs/references.md) for SAP RAP, ADT MCP, Fiori elements, and Copilot documentation. MIT licensed; not affiliated with or endorsed by SAP or GitHub.
