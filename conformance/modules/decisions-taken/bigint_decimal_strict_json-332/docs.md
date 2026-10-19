# Decision 332 — Big numbers, and `Json` read like Jackson's strict configuration.

`Order` has one field of each numeric kind, and the decoder reads every one by its own type, as Jackson's strict binding does. The first document fits them all: `quantity` is an `i64` within range, `serial` a `bigint` of thirty digits, `total` an exact `Decimal` that keeps its scale, `weight` an `f64`, and `code` an `i64` read from the text `"42"` because the field says `#[coerce]`. It prints `3 123456789012345678901234567890 19.90 1.25 42`.

The second document sends `1.5` for the `i64` quantity: a fraction is a violation at the field, never truncated, and it prints `quantity:invalidType`, while `7`, `1` and `2` are good values for the `bigint`, the `Decimal` and the `f64`. The third breaks every field: an integer past the `i64` range, a fraction for the `bigint`, text for the `Decimal` and the `f64` (a string becomes a number only under `#[coerce]`), and text no grammar reads for the coerced `code`; it prints `quantity:invalidType,serial:invalidType,total:invalidType,weight:invalidType,code:invalidType`.

The last line compares two decoded totals, `19.90` and `19.9`: `==` on `Decimal` compares the value, so it prints `true 19.90 19.9`, each text keeping the scale it was written with.

Cells in this repository that prove it: none yet. The library does not decode a `bigint` or a `Decimal` field today (`#[validated]` refuses `serial` at the annotation); front 146 brings them with the `json` library's exact numbers (332 (4)), and 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
