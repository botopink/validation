# Decision 250 — † std's `io.random.bool()` is dropped, not renamed; `coin()` is the boolean draw

The program assigns four samples to a control group at random, each with one draw of `random.coin()`, std's boolean draw, and stores the answer in the `bool` field of a `#[validated]` record. Whatever the coin answers, every sample encodes, so the program prints `true 4` on every run although the draws differ. There is no `random.bool()`: that name was dropped, not renamed, since `bool` is the name of a primitive type, and `coin()` is the one way to draw a boolean.

Cells in this repository that prove it: none. The rule is std's; the example is a consumer's, and 146 Conformance writes the library's cells.

[draft/main.bp](draft/main.bp)
