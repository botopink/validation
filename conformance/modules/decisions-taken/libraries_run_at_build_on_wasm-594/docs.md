# Decision 594 — Every library runs at build on the wasm comptime runtime (434), jhonstart first; a function only Erlang or Node can run is a located error there.

Three of the program's values are computed with `comptime`, so they run at build on the wasm comptime runtime, whatever target the program is built for: `Signup`'s constraint table, its JSON Schema document and the verdict on one sample document. All three run validation's own code, the members `#[validated]` added and the library functions they call, which are plain botopink over std, so the build computes them as the program would. The run-time `Signup.jsonSchema()` answers the same document the build did.

The program prints the constraint table `{"type":"Signup","fields":[{"name":"email","constraints":[{"code":"email"}]},{"name":"password","constraints":[{"code":"minLength","min":8}]}]}` and then `true true`.

A call that reaches a host cell with no wasm form, one only Erlang or JavaScript can run (a real host effect such as the constraint registry's `persistent_term`), is refused at build, at the `comptime`, naming the cell, on an erlang build as on any other.

Cells in this repository that prove it: none yet. Today the build runs `constraints()` but not `jsonSchema()` nor `decode` (the comptime run does not reach the helpers they call, `hasDef`, `decodeText`); front 146's wasm step brings the library to the build, and 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
