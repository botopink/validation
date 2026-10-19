# Decision 330 — `?T` is read with TypeScript's operators and has no methods; `result` goes; a type declared in a type is its associated type.

The program reads the optional fields of a decoded `Profile` only through the operators of `?T`. `Lookup` holds a `?Profile`, `null` when the document did not decode. `found.profile?.bio?.length() ?? 0` chains through two optionals, flattened rather than nested, and falls back once; `found.profile?.age ?? 18` gives the default for the `age` the document sent as `null`; `missing.profile?.name ?? "anonymous"` answers the fallback for the document whose name broke `#[minLength(2)]`; `found.profile!.name` asserts presence, checked when the program runs. The `??` beside `||` sits in parentheses, the one way the two may meet. No `?T` method is called: `isError()` and `unwrapOr` appear only on the `Result` that `Profile.decode` answers, as methods, with no `result` namespace.

`Source` is declared inside `Lookup`, so it is `Lookup`'s associated type, written `Lookup.Source` in `load`'s signature and at its construction. The program prints `signup form 12 18 true anonymous ana`.

Cells in this repository that prove it: none yet; 146 Conformance writes the library's cells.

[draft/main.bp](draft/main.bp)
