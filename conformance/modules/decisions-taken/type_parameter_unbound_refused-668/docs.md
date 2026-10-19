# Decision 668 — A function's type parameter is always bound by a parameter, never by the return type alone.

Both generic functions of the program take their type parameter from a parameter. `firstValid<T>` finds `T` in `items: T[]` and in the rule `ok: fn(v: T) -> bool`, so the call with an array of `Invite`s answers a `?Invite` without the caller writing the type; the rule asks each invite's `validate()`, and the first one whose email passes is `ana@example.com`. `nothing<T>` has no value to take `T` from, so it takes the type itself as its argument, `comptime t: type<T>`, and `nothing(Invite)` answers a `?Invite` that is `null`.

The program prints `ana@example.com` and `none`. The refused form is a type parameter only the return type mentions: `fn nothing<T>() -> ?T` is `type-parameter-unbound` at the declaration, naming `T`, because nothing at a call fixes it but the caller's wish. validation's own `absent<T>() -> ?T` gains the type token the same way.

Cells in this repository that prove it: none yet. The library's `absent<T>()` is respelled by front 146; 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
