# Decision 618 — `Implementation.Node` is renamed `JavaScript`: a source names the language the template is written in, not a runtime.

The program declares one host cell, `utf8Bytes`, with `#[compiler.external(…)]`, and each of its two templates is named after the language it is written in: `.Erlang("""byte_size($0)""")` and `.JavaScript("""Buffer.byteLength($0, "utf8")""")`. The JavaScript template serves the commonJS target, and any other runtime of the language would read the same one; nothing in the source names Node. The cell backs a field rule: `Label`'s text must fit a column of eight bytes, `#[refine(fitsColumn)]`.

On erlang and on commonJS the program prints `6` (the four letters of `ação` take six bytes), `true` for `café`, and `text:custom` for a label of nine characters and twelve bytes. A template written `.Node(…)` names a variant that no longer exists.

Cells in this repository that prove it: none yet. The library's host cells (`src/derived.bp`, `src/spi.bp`, `src/binding.bp`) already name `.JavaScript`; 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
