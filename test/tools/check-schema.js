// A test tool, nothing more (decision 399): checks one JSON Schema document,
// given as the only argument, against the 2020-12 meta-schema with the
// vendored Ajv standalone build beside this file. Prints `ok` and exits 0, or
// one line per meta-schema error and exits 1. Never imported by the library.
"use strict";
const path = require("path");
const Ajv2020 = require(path.join(__dirname, "ajv2020.min.js"));

const text = process.argv[2];
if (text === undefined) {
  console.log("usage: check-schema.js <document>");
  process.exit(2);
}
let doc;
try {
  doc = JSON.parse(text);
} catch (e) {
  console.log("not JSON: " + e.message);
  process.exit(1);
}
// Formats are left unchecked (no `ajv-formats`): the meta-schema check is
// about the document's shape, not about a format's grammar.
const ajv = new Ajv2020({ strict: true, validateFormats: false, allErrors: true });
if (ajv.validateSchema(doc)) {
  console.log("ok");
  process.exit(0);
}
for (const e of ajv.errors) {
  console.log((e.instancePath || "/") + " " + e.message + " " + JSON.stringify(e.params));
}
process.exit(1);
