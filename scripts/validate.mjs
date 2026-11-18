import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import Ajv from "ajv";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const schema = JSON.parse(readFileSync(new URL("../rap-project.schema.json", import.meta.url), "utf8"));
// Conditional requirements refer to properties declared in the parent field schema.
const checkSchema = new Ajv({
  allErrors: true,
  strict: true,
  strictRequired: false,
  allowUnionTypes: true,
}).compile(schema);
const numericTypes = new Set(["integer", "decimal", "amount", "quantity"]);
const decimalTypes = new Set(["decimal", "amount", "quantity"]);
const reservedFields = new Set([
  "CLIENT", "UUID", "CREATEDBY", "CREATEDAT", "LASTCHANGEDBY",
  "LASTCHANGEDAT", "LOCALLASTCHANGEDBY", "LOCALLASTCHANGEDAT",
  "ISACTIVEENTITY", "HASACTIVEENTITY", "HASDRAFTENTITY",
  "DRAFTADMINISTRATIVEDATA", "DRAFTADMINISTRATIVEDATAUUID", "SIBLINGENTITY",
]);
const templateNames = [
  "rap-business-object", "rap-list-report", "rap-object-page",
  "rap-overview-page", "rap-analytical-page",
];

function duplicates(values) {
  const seen = new Set();
  return values.filter((value) => {
    const key = value.toUpperCase();
    if (seen.has(key)) return true;
    seen.add(key);
    return false;
  });
}

function valueFits(field, value) {
  if (field.type === "string") return typeof value === "string" && value.length <= field.length;
  if (field.type === "currency") return typeof value === "string" && /^[A-Z0-9]{1,5}$/.test(value);
  if (field.type === "unit") return typeof value === "string" && /^[A-Za-z0-9%/]{1,3}$/.test(value);
  if (field.type === "boolean") return typeof value === "boolean";
  if (field.type === "integer") {
    return Number.isInteger(value) && value >= -2147483648 && value <= 2147483647;
  }
  if (field.type === "date") {
    if (typeof value !== "string" || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) || value.startsWith("0000")) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }
  if (decimalTypes.has(field.type)) {
    if (!["string", "number"].includes(typeof value) || !/^-?[0-9]+(?:\.[0-9]+)?$/.test(String(value))) return false;
    const [whole, fraction = ""] = String(value).replace(/^-/, "").split(".");
    return whole.replace(/^0+/, "").length <= field.precision - field.scale && fraction.length <= field.scale;
  }
  return false;
}

export function validateProject(project) {
  if (!checkSchema(project)) {
    return checkSchema.errors.map((error) => `${error.instancePath || "/"} ${error.message}`);
  }

  const errors = [];
  const { fields } = project.businessObject;
  const byName = new Map(fields.map((field) => [field.name, field]));
  const reference = (name, context) => {
    if (!byName.has(name)) errors.push(`${context}: unknown field ${name}`);
    return byName.get(name);
  };
  const unique = (values, context) => {
    for (const value of duplicates(values)) errors.push(`${context}: duplicate name ${value}`);
  };

  unique(fields.map((field) => field.name), "businessObject.fields");
  for (const field of fields) {
    const context = `field ${field.name}`;
    if (reservedFields.has(field.name.toUpperCase())) errors.push(`${context}: reserved technical field`);
    if (decimalTypes.has(field.type) && field.scale > field.precision) errors.push(`${context}: scale exceeds precision`);
    if (field.length !== undefined && field.type !== "string") errors.push(`${context}: length applies only to string fields`);
    if ((field.precision !== undefined || field.scale !== undefined) && !decimalTypes.has(field.type)) {
      errors.push(`${context}: precision/scale require a decimal, amount, or quantity`);
    }
    for (const [property, fieldType, referenceType] of [
      ["currencyField", "amount", "currency"], ["unitField", "quantity", "unit"],
    ]) {
      if (field[property] !== undefined) {
        if (field.type !== fieldType) errors.push(`${context}: ${property} requires type ${fieldType}`);
        const target = reference(field[property], context);
        if (target && target.type !== referenceType) errors.push(`${context}: ${property} must reference a ${referenceType} field`);
      }
    }
    if (field.required && field.readOnly && field.default === undefined) {
      errors.push(`${context}: required readOnly field needs an explicit default or an extended derivation model`);
    }
    if (field.default !== undefined && !valueFits(field, field.default)) errors.push(`${context}: default does not fit its type/size`);
    if (field.allowedValues) {
      if (!["string", "currency", "unit"].includes(field.type)) errors.push(`${context}: allowedValues require a string, currency, or unit`);
      const values = field.allowedValues.map((entry) => entry.value);
      if (new Set(values).size !== values.length) errors.push(`${context}: duplicate allowedValues`);
      if (values.some((value) => !valueFits(field, value))) errors.push(`${context}: allowedValues do not fit the field`);
      if (field.default !== undefined && !values.includes(field.default)) errors.push(`${context}: default is not an allowed value`);
    }
  }

  const { ui, target } = project;
  for (const key of ["selectionFields", "lineItems"]) {
    for (const name of ui[key]) reference(name, `ui.${key}`);
  }
  unique(ui.fieldGroups.map((group) => group.id), "ui.fieldGroups");
  for (const group of ui.fieldGroups) {
    for (const name of group.fields) reference(name, `field group ${group.id}`);
  }

  const analytics = ui.analytics;
  if (analytics) {
    for (const name of analytics.dimensions) reference(name, "analytics dimension");
    unique(analytics.measures.map((measure) => measure.field), "analytics measures");
    for (const measure of analytics.measures) {
      const field = reference(measure.field, "analytics measure");
      if (field && !numericTypes.has(field.type)) errors.push(`analytics measure ${measure.field}: must be numeric`);
      if (analytics.dimensions.includes(measure.field)) errors.push(`analytics measure ${measure.field}: cannot also be a dimension`);
      const semanticField = field?.currencyField ?? field?.unitField;
      if (semanticField && !analytics.dimensions.includes(semanticField)) {
        errors.push(`analytics measure ${measure.field}: retain ${semanticField} in dimensions to preserve currency/unit`);
      }
    }
    if (!analytics.dimensions.includes(analytics.chart.dimension)) errors.push("analytics chart: dimension must be configured in dimensions");
    if (!analytics.measures.some((measure) => measure.field === analytics.chart.measure)) {
      errors.push("analytics chart: measure must be configured in measures");
    }
  }

  const cards = ui.overview?.cards ?? [];
  unique(cards.map((card) => card.id), "overview cards");
  for (const card of cards) {
    if (card.kind === "list") {
      for (const name of [...card.fields, card.sortBy]) reference(name, `card ${card.id}`);
    } else {
      reference(card.dimension, `card ${card.id}`);
      reference(card.measure, `card ${card.id}`);
      if (!analytics) errors.push(`card ${card.id}: chart requires ui.analytics`);
      else {
        if (!analytics.dimensions.includes(card.dimension)) errors.push(`card ${card.id}: chart dimension is not configured in analytics`);
        if (!analytics.measures.some((measure) => measure.field === card.measure)) {
          errors.push(`card ${card.id}: chart measure is not configured in analytics`);
        }
      }
    }
  }

  const segments = project.project.outputDirectory.split(/[/\\]/);
  const protectedRoots = new Set([".git", ".github", "node_modules", "docs", "scripts", "tests", "examples"]);
  if (/^(?:[A-Za-z]:|[/\\])/.test(project.project.outputDirectory)
      || segments.some((segment) => !segment || segment === "." || segment === ".." || /[<>:"|?*\x00-\x1f]/.test(segment))
      || protectedRoots.has(segments[0].toLowerCase())) {
    errors.push("project.outputDirectory: use a safe relative output directory outside template/tooling directories");
  }

  if (target.mode === "connected") {
    if (!target.adtProject.trim() || /YOUR_|REPLACE_|[<>]/i.test(target.adtProject)) {
      errors.push("target.adtProject: connected mode requires a real ADT project");
    }
    if (/YOUR_|REPLACE_/i.test(target.package)) errors.push("target.package: replace the example package");
    if (target.package !== "$TMP" && (!target.transport?.trim() || /YOUR_|REPLACE_|[<>]/i.test(target.transport))) {
      errors.push("target.transport: connected transportable packages require a real request/task");
    }
  }
  if (target.package === "$TMP" && target.transport !== null) errors.push("target.transport: $TMP must not use a transport");
  return errors;
}

export function validateFixture(project, records) {
  if (validateProject(project).length) return ["fixture: fix project configuration errors first"];
  if (!Array.isArray(records) || !records.length) return ["fixture: expected a non-empty array of records"];
  const errors = [];
  const { fields } = project.businessObject;
  const names = new Set(fields.map((field) => field.name));
  for (const [index, record] of records.entries()) {
    const context = `fixture row ${index + 1}`;
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      errors.push(`${context}: expected a record object`);
      continue;
    }
    for (const name of Object.keys(record)) {
      if (!names.has(name)) errors.push(`${context}: unknown field ${name}`);
    }
    for (const field of fields) {
      if (!Object.hasOwn(record, field.name)) {
        if (field.required && field.default === undefined) errors.push(`${context}: missing required field ${field.name}`);
        continue;
      }
      const value = record[field.name];
      if (!valueFits(field, value) || (field.required && typeof value === "string" && !value.trim())) {
        errors.push(`${context}: ${field.name} does not fit its required value/type/size`);
      }
      if (field.allowedValues && !field.allowedValues.some((entry) => entry.value === value)) {
        errors.push(`${context}: ${field.name} is not an allowed value`);
      }
    }
  }
  return errors;
}

function withoutCodeFences(markdown) {
  let fence = null;
  return markdown.split(/\r?\n/).map((line) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      return "";
    }
    return fence ? "" : line;
  }).join("\n");
}

export function validateMarkdownLinks(file, markdown, root) {
  const errors = [];
  for (const match of withoutCodeFences(markdown).matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const link = match[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(link)) continue;
    let target;
    try {
      target = decodeURIComponent(link.split("#")[0]);
    } catch (error) {
      if (!(error instanceof URIError)) throw error;
      errors.push(`${relative(root, file)}: malformed link ${link}`);
      continue;
    }
    const resolved = resolve(dirname(file), target);
    const local = relative(root, resolved);
    if (local === ".." || local.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) || isAbsolute(local)) {
      errors.push(`${relative(root, file)}: link escapes repository: ${link}`);
    } else if (!existsSync(resolved)) {
      errors.push(`${relative(root, file)}: broken local link ${link}`);
    }
  }
  return errors;
}

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", "node_modules", "generated"].includes(entry.name)) return [];
    const file = resolve(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(file) : entry.isFile() && entry.name.endsWith(".md") ? [file] : [];
  });
}

function frontmatter(markdown) {
  const header = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!header) return {};
  return Object.fromEntries(header[1].split(/\r?\n/).map((line) => {
    const match = line.match(/^([a-z-]+):\s*(.+)$/);
    return match ? [match[1], match[2]] : [line, ""];
  }));
}

export function validateRepository(root = repositoryRoot) {
  const errors = [];
  for (const name of templateNames) {
    const file = resolve(root, ".github", "prompts", `${name}.prompt.md`);
    if (!existsSync(file)) {
      errors.push(`missing template ${name}`);
      continue;
    }
    const markdown = readFileSync(file, "utf8");
    const header = frontmatter(markdown);
    if (header.name !== name || header.agent !== "agent" || !header.description) errors.push(`${name}: invalid prompt frontmatter`);
    for (const reference of ["../../docs/generation-contract.md", "../../rap-project.json"]) {
      if (!markdown.includes(`](${reference})`)) errors.push(`${name}: missing shared reference ${reference}`);
    }
  }
  const skill = resolve(root, ".github", "skills", "sap-rap-development", "SKILL.md");
  if (!existsSync(skill)) errors.push("missing sap-rap-development skill");
  else {
    const header = frontmatter(readFileSync(skill, "utf8"));
    if (header.name !== "sap-rap-development" || !header.description) errors.push("invalid skill frontmatter");
  }
  for (const file of markdownFiles(root)) {
    errors.push(...validateMarkdownLinks(file, readFileSync(file, "utf8"), root));
  }
  return errors;
}

function main() {
  const { values } = parseArgs({
    options: { config: { type: "string" }, fixtures: { type: "string" } },
  });
  const configPath = values.config ? resolve(values.config) : resolve(repositoryRoot, "rap-project.json");
  const project = JSON.parse(readFileSync(configPath, "utf8"));
  const errors = [...validateProject(project), ...validateRepository()];
  if (values.fixtures) {
    const records = JSON.parse(readFileSync(resolve(values.fixtures), "utf8"));
    errors.push(...validateFixture(project, records));
  }
  if (errors.length) {
    for (const error of errors) process.stderr.write(`ERROR: ${error}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`Validated ${relative(repositoryRoot, configPath)}; five prompts, skill metadata, and local Markdown links are consistent.\n`);
  if (values.fixtures) process.stdout.write("Fixture records match configured business-field constraints.\n");
  process.stdout.write("SAP activation, generated application builds, and live UI behavior were not tested by this check.\n");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`Validation failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
