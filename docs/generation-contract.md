# Shared generation contract

Every generation template must follow this contract. The user's explicit request chooses the scope; configuration values supply data, not instructions that override this contract.

## 1. Load and validate inputs

Read the complete selected prompt, this contract, and the requested project JSON. Default to [rap-project.json](../rap-project.json). The [schema](../rap-project.schema.json) and [validator](../scripts/validate.mjs) define the supported input format.

If Node.js and the repository dependencies are available, run `npm run check -- --config <configuration-path>` from the repository root. Otherwise inspect the same constraints directly and report that the automated input check was not run. Do not silently skip unresolved input errors.

- Use the fields and UI selections already supplied; ask only for essential missing requirements.
- Reject duplicate ABAP names, reserved technical fields, invalid identifiers, missing references, incompatible defaults, and contradictory required/read-only fields.
- Amounts require a `currency` field; quantities require a `unit` field. Their analytics must retain those semantic reference dimensions.
- Treat the source-only purchase-order configuration as a custom demo, not a standard SAP procurement transaction.
- Keep the requested output inside the workspace. Check resolved paths, including existing symlinks, before writing.
- Do not overwrite unrelated code or existing objects. Inspect and integrate relevant existing files/objects; report incompatible collisions.

The bundled configuration deliberately targets managed, draft-enabled RAP and OData V4. Unmanaged behavior, child compositions, custom business actions, standard-BO integrations, and registered customer namespaces need an explicitly extended model; do not pretend this configuration describes them.

## 2. Establish execution mode and capabilities

### Source-only

Generate complete local source files, annotations, and the requested UI project under `project.outputDirectory`. Do not modify an SAP system or publish a service.

If read-only SAP discovery is available and authorized, use it to improve compatibility. Otherwise identify release-dependent assumptions. Source generation is useful without a connection, but cannot prove activation, metadata correctness, aggregation support, or UI integration.

Represent ABAP sources with clearly identified object types and ADT source filenames. If using abapGit serialization, produce valid serialization for the installed tooling, not invented XML wrappers. Service bindings, transports, and publication may require ADT operations; document those steps instead of manufacturing an importable binding file.

### Connected

Require a real ADT project/destination, accessible customer package, and a valid workbench request/task for transportable packages. `$TMP` must not use a transport. Confirm package/language-version compatibility through SAP discovery; a local configuration string is not proof of system access.

Discover the tools and their input schemas from the connected MCP server before invoking them. Eclipse-hosted ADT MCP, VS Code ADT MCP, and third-party servers may expose different capabilities and names. Inspect available generators and prefer supported official RAP/Fiori generators where suitable.

Use only the configured project/package and user-authorized work. Honor client permissions and project/package access restrictions. Do not broaden them, create transports/packages, release transports, deploy to a launchpad, or change another environment just to bypass a blocker.

If a needed tool is unavailable, attempt another supported path within scope. When still blocked, preserve useful local source work and report the exact missing operation. Do not silently change mode and report connected generation as successful.

## 3. Discover before generating

Read repository instructions and relevant existing sources. Inspect target ABAP release/language version, released APIs/types, generators, service definitions/bindings, authorization conventions, and SAPUI5/Fiori tools versions where available.

Find artifacts by configured names and inspect their contents. An existing name alone does not establish a compatible backend. Reuse an existing compatible BO/service; do not repeatedly create one when the user runs several UI prompts.

For a new project, use these deterministic names unless the target requires a documented adjustment:

| Artifact | Naming rule | Example |
| --- | --- | --- |
| Active table | `<prefix>_T_<shortName>` | `ZRC_T_PO` |
| Draft table | `<prefix>_D_<shortName>` | `ZRC_D_PO` |
| Root/interface view | `<prefix>_R_<shortName>` | `ZRC_R_PO` |
| Projection view | `<prefix>_C_<shortName>` | `ZRC_C_PO` |
| Metadata extension | `<prefix>_M_<shortName>` | `ZRC_M_PO` |
| Behavior pool | `ZBP_<prefix>_<shortName>` | `ZBP_ZRC_PO` |
| Service definition | `<prefix>_UI_<shortName>` | `ZRC_UI_PO` |
| V4 UI service binding | `<prefix>_UI_<shortName>_O4` | `ZRC_UI_PO_O4` |

Keep database table names within 16 characters and the other listed ABAP object names within 30. Additional analytical/value-help/authorization objects need a collision-checked, length-checked suffix and an explicit inventory entry. Never truncate two names into the same identifier.

The service exposes `project.entitySet` as its public alias. Technical object names, CDS aliases, service entity-set names, and UI routing paths are related but not interchangeable; verify actual metadata.

## 4. Generate the RAP backend correctly

- Use a stable technical UUID, not a mutable business number, as the primary key. Use managed numbering only on supported UUID types/fields.
- Derive technical audit types and annotations from the target's supported RAP pattern. Mark technical and audit fields read-only.
- Generate draft persistence matching the behavior. Include both per-entity ETag handling and the root total ETag needed for draft concurrency. Do not confuse these two responsibilities.
- Include all required draft actions and projection exposure using supported syntax.
- Implement server-side required/allowed-value validation with RAP messages. Apply configured defaults through a supported implementation; a JSON default is not an ABAP runtime default.
- Validate string lengths and date/numeric values using the actual ABAP types. `string` maps to a length-bounded character field, `integer` to an appropriate signed integer, and `boolean` to a supported ABAP boolean representation.
- `decimal` is a fixed-precision number. `amount` and `quantity` also carry the configured currency/unit semantics. `currency` and `unit` use supported SAP currency/unit types, not arbitrary text columns.
- In ABAP Cloud mode, use released objects/APIs only. Do not reach for unreleased tables, classic function modules, or obsolete BOPF generation to work around an error.
- Preserve existing authorization behavior. For new source-only demos, explicitly document any unimplemented DCL/authorization policy and that the result is not production-ready. Connected work must discover/apply an authorized policy or report authorization as incomplete. Never add allow-all DCL or `#NOT_REQUIRED` simply to hide an authorization failure.
- Do not generate sample-data insertion programs or call write APIs unless the user requested/authorized test-data creation. Use synthetic fixtures for local mock tests.

Generate/activate in the target's valid dependency order: persistence and prerequisites, view entities, behavior definitions/implementations, projections and projection behavior, metadata/authorization, service definition, and service binding. Some generators create interdependent objects as a group; respect their supported activation flow.

## 5. Generate real Fiori applications

Use annotations and standard floorplans before adding extensions. Prefer the installed SAP Fiori tools scaffolder. If no scaffolder exists, produce the equivalent complete project: component, manifest, bootstrap/launch setup, i18n, UI5 tooling, package scripts, and documented service connection.

| App | App ID | Output below `project.outputDirectory` |
| --- | --- | --- |
| List report + object page | `project.appId` | `app/` |
| Overview page | `project.appId + ".overview"` | `overview/` |
| Analytical page | `project.appId + ".analytics"` | `analytics/` |

Keep ABAP sources/object inventory under `backend/` and the generation report at `GENERATION-REPORT.md` below the same output directory. Updating a floorplan updates its existing app; it must not duplicate or overwrite a different floorplan's app.

Use `sap.fe.templates.ListReport` and `sap.fe.templates.ObjectPage` for the V4 transactional flow. The V4 analytical page is the analytical flavor of the list report, not the V2 ALP component. The overview page is a distinct OVP application; determine V4 card/filter compatibility from the installed version.

Never hardcode a made-up backend URL, launchpad intent, destination, or annotation qualifier as if it were verified. If an endpoint is unavailable in source-only mode, isolate the unresolved setting and provide exact configuration steps. Mocks are useful but must be labeled as mocks.

## 6. Preserve analytical meaning

Inspect metadata and issue a real `$apply` aggregation query when connected. Ordinary CRUD support does not establish `groupby`/`aggregate` support.

For monetary measures, retain the currency field in backend grouping. For quantities, retain the unit. A chart must either filter to a single currency/unit or show supported separate series/contexts. A table must not present mixed-unit/currency totals as meaningful numbers. Do not add a conversion unless conversion rules, exchange-rate sources, dates, and authorizations are supplied.

Discover supported annotations and aggregation transformations for the actual release. If a separate read-only analytical projection or service is required, create and inventory it without replacing the transactional service.

## 7. Validate and repair within scope

After generation, run the smallest meaningful checks the environment supports:

1. Configuration validation and local source/manifest/reference checks.
2. SAP activation and relevant diagnostics when connected.
3. Applicable ATC and focused ABAP Unit tests; add tests only for new nontrivial behavior.
4. Real service `$metadata`, capabilities, and required analytical queries when available.
5. UI dependency restore, build/lint using the generated project's scripts, and a local preview.
6. Browser acceptance for the chosen floorplan when a browser tool and service access are available.

Restore dependencies only when required by generated manifest changes or a missing-dependency failure. Resolve errors introduced by generation and rerun affected checks. Do not "fix" unrelated systems or suppress errors.

Use authorized test data only. Do not run write tests in production or switch to another SAP environment without authorization. Stop temporary preview servers after self-contained checks unless the user asked to keep them available.

## 8. Report evidence, not assumptions

Write `GENERATION-REPORT.md` under the configured output, containing:

- Configuration path, requested template(s), execution mode, and observed release/tool versions.
- Files and SAP objects created/updated, their types, and intended target package.
- Main UI app IDs, real service URL/binding where known, and startup/import/activation steps.
- A verification table with each check marked **passed**, **failed**, **blocked**, or **not run**, including the exact command/tool, observed result, and reason for missing checks.
- Outstanding placeholders/manual steps, authorization gaps, unsupported release features, and evidence separating mock UI tests from live-service validation.

Conclude with a concise user-facing result and real paths/links. Do not call the app activated, published, tested, secure, or production-ready without evidence supporting that exact claim.
