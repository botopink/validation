# Decision 280 — Decorator arguments are typed comptime values.

Every argument the program hands a validation decorator is a typed value of the build, checked at the argument against the parameter's type, and none survives into the running program except through what the decorator outputs. `#[minValue(1)]` takes a number, `#[pattern("^[A-Z]{3}-[0-9]{4}$")]` a text, `#[oneOf("card", "pix")]` a list of texts, `#[orElse(.Standard)]` a variant of the field's own type `Tier`, resolved by its name exactly as declared, `#[refine(isEven)]` a function that is passed on, never called at build, and the type's `#[check]` a message, the function `premiumBoxed` and `at: .boxes`, a `compiler.Field<Order>` naming a field of the annotated type. A misspelt `.boxs` would be an error at the `.boxs`, and `.standard` an error too: no output changes a name's case.

The first order decodes with the default tier and prints `ok ABC-1234 standard`. The second breaks four rules and prints `quantity:minValue,sku:pattern,payment:oneOf,boxes:custom`: the three field markers, then the type's check, which reads the decoded `Premium` and finds no box.

Cells in this repository that prove it: none yet. The library takes most of these arguments today; `#[refine]` and the type-level `#[check]` with `at:` come with 146 s1 (125 steps 7 and 12), and 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
