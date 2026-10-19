# Decision 395 — A typed member reads its own type's typed meta through the decorator's type parameter, checked twice — pre-comptime in the decorator's body, post-comptime in the annotated type.

Two types use the same `#[validated]`, and each one's `validate` runs only the checks written on that type. `#[validated]`'s body is written once, generic in the annotated type `T`: it reads `compiler.typeInfo(T).metaAll(Check)` under `comptime`, so the list of checks is a constant of the build while the loop over it and each rule run when `validate()` is called. In the library the read is checked against `Check<T>[]` before any type uses it; rendered into `Signup`, `T` is `Signup` and the read answers the one check its annotation recorded; rendered into `Transfer`, it answers the two recorded there, and the member is checked again against each type. Every check's rule and message resolve where the annotation wrote them, so `passwordsMatch`, `notToSelf` and `withinLimit` are this program's functions.

The program prints `1 [the passwords differ]`, then `2 [a transfer needs two accounts; over the daily limit]`, then `true` for a transfer that passes both of its checks. No member asks for "its own type" by any other means: there is no `typeInfo(Self)`, the decorator's `T` is the annotated type.

Cells in this repository that prove it: none yet. The library's typed-member route for `#[check]` lands with 146 s1 (125 step 7), and 146 Conformance writes its cells.

[draft/main.bp](draft/main.bp)
