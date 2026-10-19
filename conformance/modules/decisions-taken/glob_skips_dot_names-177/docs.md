# Decision 177 — † `fs.glob`, one rule on both targets: `*` and `**` do not match a name that starts with `.` unless the pattern writes t

The program writes four service files into a scratch directory, two of them named with a leading dot, then loads services with `fs.glob` and validates each file as a `Service`. `*.json` and `**/*.json` match only the visible names, `api.json` and `nested/db.json`, at any depth, so the draft with the empty name is never loaded. A pattern that writes the dot, `.*.json` or `**/.*.json`, matches the dotted names, and the draft is then loaded and refused by `#[notBlank]`, marked `(invalid)`.

The program prints `api.json`, `api.json, nested/db.json`, `.draft.json (invalid)` and `.draft.json (invalid), nested/.cache.json`, the same on erlang and commonJS, and removes the directory it made. The walk under `**` does not descend through a link to a directory either.

Cells in this repository that prove it: none. The rule is std's; the example is a consumer's, and 146 Conformance writes the library's cells.

[draft/main.bp](draft/main.bp)
