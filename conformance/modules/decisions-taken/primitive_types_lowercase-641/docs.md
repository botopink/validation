# Decision 641 — (b) for the names, and no contract with one implementor: every primitive type is written lowercase — `i32`, `i64`, `u32`, `u64`, `f32`, `f64`, `bool`, `string`, `bigint`, `bytes`, `array<T>` — and a capitalised name is a contract shared by several types (`Number`, `Integer`, `Signed`, `Float`); `String`, `Bool`, `BigInt`, `Bytes` and `Array` dissolve into their types, which hold their methods and statics.

`Survey`'s fields are written in the primitive types' one spelling, all lowercase: `string`, `i32`, `i64`, `f64`, `bool`, and `string[]` for an `array<string>`. The capitalised names left in the program are other types, `Set` and `Dict` from std's `collections`, and the markers do not care how a type is spelt: `#[minLength]` checks the `string`, `#[notEmpty]` the array. A primitive's statics live on the type itself: `array.range(0, 3)` answers `[0, 1, 2]` and `string.fromCodepoint(65 + i)` turns each into a letter, so the options are `A`, `B` and `C`.

The program prints `ABC true`, then `true` for the document whose title is too short and whose options are empty. `String.fromCodepoint(65)` or a field typed `Array<string>` names no type: `String` and `Array` dissolved into `string` and `array<T>`, and a capitalised name is a contract shared by several types (`Number`, `Integer`).

Cells in this repository that prove it: none yet. The library still writes `Array<T>` (`conformance/docs.md` § Departures), which front 146's codemod respells; 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
