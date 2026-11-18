import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { validateMarkdownLinks, validateProject, validateRepository } from "../scripts/validate.mjs";

const example = JSON.parse(readFileSync(new URL("../rap-project.json", import.meta.url), "utf8"));
const fresh = () => structuredClone(example);

test("the complete example and repository validate", () => {
  assert.deepEqual(validateProject(fresh()), []);
  assert.deepEqual(validateRepository(), []);
});

test("non-analytical transactional applications need no analytics or overview", () => {
  const config = fresh();
  delete config.ui.analytics;
  delete config.ui.overview;
  assert.deepEqual(validateProject(config), []);
});

test("schema errors stop semantic traversal and identify missing field details", () => {
  assert.ok(validateProject(null).length);
  const config = fresh();
  delete config.businessObject.fields.find((field) => field.name === "NetAmount").currencyField;
  config.target.unrecognizedSetting = true;
  const errors = validateProject(config).join("\n");
  assert.match(errors, /currencyField/);
  assert.match(errors, /additional properties/);
});

test("ABAP names are unique case-insensitively and technical fields are reserved", () => {
  const config = fresh();
  config.businessObject.fields.push({ name: "suppliername", label: "Duplicate", type: "string", length: 10 });
  config.businessObject.fields.push({ name: "UUID", label: "Reserved", type: "string", length: 10 });
  const errors = validateProject(config).join("\n");
  assert.match(errors, /duplicate name suppliername/);
  assert.match(errors, /UUID: reserved/);
});

test("UI references and amount semantics resolve to compatible fields", () => {
  const config = fresh();
  config.ui.lineItems.push("Missing");
  config.businessObject.fields.find((field) => field.name === "NetAmount").currencyField = "SupplierName";
  const errors = validateProject(config).join("\n");
  assert.match(errors, /unknown field Missing/);
  assert.match(errors, /must reference a currency field/);
});

test("analytics rejects text measures and missing currency groupings", () => {
  const config = fresh();
  config.ui.analytics.dimensions = ["Status"];
  config.ui.analytics.measures.push({ field: "SupplierName", aggregation: "SUM" });
  const errors = validateProject(config).join("\n");
  assert.match(errors, /retain CurrencyCode in dimensions/);
  assert.match(errors, /SupplierName: must be numeric/);
});

test("chart and card configuration cannot silently refer to undeclared analytics", () => {
  const config = fresh();
  config.ui.analytics.chart.measure = "SupplierName";
  config.ui.overview.cards[1].dimension = "SupplierName";
  assert.match(validateProject(config).join("\n"), /measure must be configured/);
  assert.match(validateProject(config).join("\n"), /chart dimension is not configured/);
  delete config.ui.analytics;
  assert.match(validateProject(config).join("\n"), /chart requires ui.analytics/);
});

test("defaults and fixed values obey field size, type, and allowed-value membership", () => {
  const config = fresh();
  const status = config.businessObject.fields.find((field) => field.name === "Status");
  status.default = "X";
  status.allowedValues.push({ value: "LONG", label: "Invalid" });
  const amount = config.businessObject.fields.find((field) => field.name === "NetAmount");
  amount.default = "1.999";
  const errors = validateProject(config).join("\n");
  assert.match(errors, /default is not an allowed value/);
  assert.match(errors, /allowedValues do not fit/);
  assert.match(errors, /NetAmount: default does not fit/);
});

test("invalid dates, impossible precision, and required read-only fields are explicit errors", () => {
  const config = fresh();
  config.businessObject.fields.find((field) => field.name === "OrderDate").default = "2026-02-30";
  config.businessObject.fields.find((field) => field.name === "NetAmount").scale = 14;
  config.businessObject.fields.find((field) => field.name === "NetAmount").precision = 2;
  config.businessObject.fields.find((field) => field.name === "SupplierName").readOnly = true;
  const errors = validateProject(config).join("\n");
  assert.match(errors, /OrderDate: default does not fit/);
  assert.match(errors, /scale exceeds precision/);
  assert.match(errors, /required readOnly field/);
});

test("quantity measures retain unit semantics just like currency measures", () => {
  const config = fresh();
  config.businessObject.fields.push(
    { name: "Quantity", label: "Quantity", type: "quantity", precision: 10, scale: 2, unitField: "UnitCode" },
    { name: "UnitCode", label: "Unit", type: "unit" },
  );
  config.ui.analytics.measures.push({ field: "Quantity", aggregation: "SUM" });
  assert.match(validateProject(config).join("\n"), /retain UnitCode/);
  config.ui.analytics.dimensions.push("UnitCode");
  assert.deepEqual(validateProject(config), []);
});

test("connected generation requires real target details without restricting source-only design", () => {
  const config = fresh();
  config.target.package = "ZDEMO";
  assert.deepEqual(validateProject(config), []);
  config.target.mode = "connected";
  assert.match(validateProject(config).join("\n"), /real ADT project/);
  assert.match(validateProject(config).join("\n"), /real request\/task/);
  config.target.adtProject = "DEV_PROJECT";
  config.target.transport = "DEVK900001";
  assert.deepEqual(validateProject(config), []);
  config.target.package = "$TMP";
  assert.match(validateProject(config).join("\n"), /\$TMP must not use a transport/);
  config.target.transport = null;
  assert.deepEqual(validateProject(config), []);
});

test("output paths cannot escape the workspace or replace library directories", () => {
  for (const outputDirectory of ["../outside", "generated\\..\\outside", "C:\\outside", "/tmp/output", ".github/new", "docs/new", "."]) {
    const config = fresh();
    config.project.outputDirectory = outputDirectory;
    assert.match(validateProject(config).join("\n"), /safe relative output directory/, outputDirectory);
  }
});

test("Markdown checking finds broken and escaping links but ignores URLs and code examples", () => {
  const root = mkdtempSync(join(tmpdir(), "sap-rap-prompts-links-"));
  try {
    const file = join(root, "README.md");
    writeFileSync(join(root, "present.md"), "# Present\n");
    const markdown = [
      "[valid](present.md#section)",
      "[remote](https://example.com)",
      "```markdown",
      "[example](not-a-real-file.md)",
      "```",
      "[broken](missing.md)",
      "[escape](../outside.md)",
      "[malformed](bad%ZZ.md)",
    ].join("\n");
    const errors = validateMarkdownLinks(file, markdown, root);
    assert.equal(errors.length, 3);
    assert.match(errors.join("\n"), /broken local link missing.md/);
    assert.match(errors.join("\n"), /link escapes repository/);
    assert.match(errors.join("\n"), /malformed link/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
