# Decision 396 — Markdown, YAML and JSON are three libraries of their own — `markdown`, `yaml`, `json` (`botopink/{markdown,yaml,json}` at `repository/{markdown,yaml,json}`, 326's rule) — and std knows nothing of JSON.

The program builds, reads and writes JSON only through the `json` library, and validates it with `validation`; from std it imports nothing but `print`. `object` and `quote` write the document's text, `decode` reads it into a `Json`, `Member.parse` turns that value into the record, and `Member.encode` writes the record back as a `Json` that `encode` renders as text. The `Json` that `#[validated]`'s members take and answer is the `json` library's type: validation declares `json` as a dependency, as every consumer does, because std knows nothing of JSON.

The program prints `ana ana@example.com`, then `{"name":"ana","email":"ana@example.com"}`, then `true` for the document whose email breaks its marker.

Cells in this repository that prove it: none yet. The library still imports `json.Json` from std (`src/derived.bp`, `src/decorators.bp`, …); the move to `from "json"` is 151 s1 with its consumer commit here (146 consumers, 142 s1), and 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
