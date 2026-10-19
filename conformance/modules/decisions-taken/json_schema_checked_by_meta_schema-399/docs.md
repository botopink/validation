# Decision 399 — `validation`'s JSON Schema documents are checked against the 2020-12 meta-schema by a vendored validator — in the tests only.

The program publishes `Signup`'s JSON Schema document and reads four of its members back with the `json` library: `$schema` names draft 2020-12, `type` is `object`, `required` lists `email` and `password` but not the optional `nickname`, and `additionalProperties` is a boolean (`false`: the record refuses undeclared keys). It prints `https://json-schema.org/draft/2020-12/schema`, `object`, `email,password` and `a boolean`.

What holds such a document to the 2020-12 meta-schema is not in the program and not in the library. The suite runs a vendored copy of Ajv's standalone 2020 build (`test/tools/check-schema.js`) through `io.process.run("node", …)` for every document it emits, on commonJS, with no network and nothing installed. The validator is never in `src/`, never shipped, and never imported by the library or by a consumer such as this one, which only produces and reads the document.

Cells in this repository that prove it: none. The rule is a property of the suite (`test/json_schema_test.bp`), which a cell does not hold; 146 Conformance writes the cells of the document's content.

[draft/main.bp](draft/main.bp)
