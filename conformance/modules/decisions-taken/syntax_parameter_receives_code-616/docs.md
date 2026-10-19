# Decision 616 — The parameter modifier `expr` is renamed `syntax`: a parameter marked `syntax` receives the code as it was written — a declaration, an argument expression, a lambda — and `comptime` one receives a value known at build.

The program's build layer, `comptime/audit.bp`, declares one decorator of its own, `owned`, and `Invoice` carries it beside validation's `#[validated]`. Its two parameters arrive in the two ways a build-time parameter can. `syntax decl: T` receives the annotated declaration as it was written, the `Invoice` type itself, which the body hands to `compiler.name` to read its name and to `compiler.addMember` to give it a member. `comptime team: string` receives a value known at build, the text `"billing"`. validation's own markers are declared the same way: `notBlank(syntax decl: unknown)` receives the field, `minValue(syntax decl: unknown, comptime min: i32)` the field and the bound.

The program prints `Invoice belongs to billing`, then `true` for the valid invoice and `customer,cents` for the one that breaks both markers: the member `owned` added and the members `#[validated]` added live side by side on one type.

Cells in this repository that prove it: none yet. The library's decorators already write `syntax decl`; 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
[draft/comptime/audit.bp](draft/comptime/audit.bp)
