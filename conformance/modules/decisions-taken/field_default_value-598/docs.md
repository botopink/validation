# Decision 598 — `compiler.Field<T>` carries a field's default as `defaultValue`: the default as written, `null` when the field has none.

`Subscription` writes a default on four of its fields: two constants, `"free"` and `1`, an explicit `null` for the optional nickname, and a call, `clock.now()`. `#[validated]` reads each field at build as a `compiler.Field<Subscription>`, whose `defaultValue` holds the default as code (it is `null` for `email`, the one field with none), and writes a decoder that falls back to that code when the key is absent. The default is evaluated where the record is built, when the program runs: `startedAt` is the clock at the moment of decoding, never a value frozen at build.

The first document carries only the email and prints `ana@example.com free 1 - true`. The second gives every key and prints `bo@example.com pro 5 bo true`, the written values winning over every default. In the third the seat count is present and breaks its marker, so it prints `seats:minValue`: a default fills an absent key only, it never replaces a value that is there. The fourth lacks `email`, which has no default, and prints `email:required`.

Cells in this repository that prove it: none yet. The library's decoder does not read a field's default yet (an absent `plan` is `required`): a departure for front 146 to close over 144 B-140's `defaultValue`, and 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
