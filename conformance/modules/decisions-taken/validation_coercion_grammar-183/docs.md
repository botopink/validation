# Decision 183 — † `validation`'s coercion is a grammar per target type, the same on erlang and commonJS: `bool` reads the `stringbool` s

`Search` is a query string's record: every value arrives as text and each field marked `#[coerce]` reads it by its own type. The first request reads `"2"` as the integer 2, `"1.5e1"` by the integer grammar extended with a fraction and an exponent as `15.0`, `"Yes"` from the stringbool set, case-insensitive, as `true`, and the empty `limit` as absent, so the optional field is `null`. The second reads `"off"` as `false` and `"10"` into the optional `limit`.

The third request carries text no grammar reads: `"two"` for an integer, `"maybe"` for a `bool`, `"x"` for an optional integer. Each stays text and is `invalidType` at its field, never a zero or a `false` standing in for it. In the fourth, the empty `page` is absent like a missing key, so the required field answers `required`.

The program prints `2 15.0 true none`, `7 0.25 false 10`, `page:invalidType,exact:invalidType,limit:invalidType` and `page:required`, the same lines on erlang and commonJS.

Cells in this repository that prove it: none yet. The suite holds the grammar (`test/coercion_and_forms_example_test.bp`, `test/parity_test.bp`) until 146 Conformance writes its cells.

[draft/main.bp](draft/main.bp)
