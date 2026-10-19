# Decision 257 — `#[validated]` (306) and its private schema machinery live in `validation`, beside the constraint markers; every failure

`Customer` holds an `Address`, an array of tags and a number, and every way a document can be wrong comes back the same way: a `ValidationReport` whose violations each name the path of the value they are about. The program imports `#[validated]`, its markers and `ValidationReport` from `validation` and decodes with the type's own member; std plays no part in it.

The second document has values that do not decode: a number where `city` is a string, a number as the second tag, text where `age` is an integer. They are reported at `address.city`, `tags[1]` and `age`, all three, in declaration order. The third decodes and breaks two markers, reported at `name` and `tags`. The fourth is not JSON at all, one `invalidJson` at the empty path, the document itself. The last breaks a marker of the nested `Address`, and `pretty()` writes the message and then its path, `address.street`.

The program prints `ok ana`, `[address.city] invalidType [tags[1]] invalidType [age] invalidType`, `[name] minLength [tags] minLength`, `[] invalidJson`, and the two lines `✖ must not be blank` and `  → at address.street`.

Cells in this repository that prove it: none yet. The suite holds it (`test/nested_and_arrays_example_test.bp`, `test/error_views_example_test.bp`, `test/path_test.bp`) until 146 Conformance writes its cells.

[draft/main.bp](draft/main.bp)
