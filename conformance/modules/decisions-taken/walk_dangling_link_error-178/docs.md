# Decision 178 — † A dangling link under `fs.walk` is an `Error` naming the link, on both targets — not skipped

The program audits a directory of service files: `fs.walk` lists every file under it and each is decoded as a `Service`. With one valid file the audit prints `api.json true`. The program then adds `db.json`, a link to a file that does not exist, through a small host cell of its own, `makeLink`. The walk no longer answers a list that silently leaves the link out: it is an `Error` naming the link, and the audit prints `build/walk-services: fs.walk: dangling link "db.json"`. Both lines are the same on erlang and commonJS, so a broken deployment is reported before any service is loaded.

Cells in this repository that prove it: none. The rule is std's; the example is a consumer's, and 146 Conformance writes the library's cells.

[draft/main.bp](draft/main.bp)
