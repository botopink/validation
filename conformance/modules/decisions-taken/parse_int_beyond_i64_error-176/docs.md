# Decision 176 — † `string.parseInt()` of an integer beyond the `i64` range (−2^63 … 2^63 − 1, 319) is `Error` on every target

The program reads integers from text at the edge of the `i64` range. std's `parseInt()` answers `Ok` for `9223372036854775807`, the largest `i64`, and an `Error` for `9223372036854775808` and for `-9223372036854775809`, one past each end, on every target; it never wraps, saturates or hands back a float. The program prints `true` three times.

`Lookup` reads its order number from a form field under `#[coerce]`, so the same text reaches validation's coercion. `9007199254740991` is read and prints `ok 9007199254740991`; the integer past the range is refused at the field, `orderNumber:invalidType`, the violation standing where a host's overflow would otherwise have produced a wrong number. Both lines are the same on erlang and commonJS.

Cells in this repository that prove it: none yet. The suite holds the coercion's integer grammar (`test/coercion_and_forms_example_test.bp`, `test/binding_test.bp`); 146 Conformance writes the library's cells.

[draft/main.bp](draft/main.bp)
