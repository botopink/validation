# Decision 337 — The shorthand import goes; `mod m;` binds the namespace `m` in the module that declares it.

The program keeps its rule for account handles in a module of its own package, `checks/handles.bp`, whose path makes it `checks.handles`. `main.bp` imports the two functions it uses by that path in braces, with no `from`: `import {checks.handles.notReserved, checks.handles.reservedCount};`, the module's path first and then the item. Every other name arrives by an import that names its source: `print` `from "std"`, `#[validated]` and `#[refine]` `from "validation"`. The rule is handed to `#[refine]` and `Account`'s `validate()` runs it, so the program prints `2`, `true` for `ana` and `handle:custom` for `root`.

The refused spelling is the shorthand. `import {notReserved};` has no `from` and its first segment names no module of the package, so it is refused with `shorthand-import` at the item, the fix written: `import {checks.handles.notReserved};`, the line the example uses. A bare `import {validated};` does not reach the library either; it is written `from "validation"`.

337 (2)'s `mod m;` namespace is replaced by decision 592 (1): every `.bp` under `src/` is a module and there is no `mod` / `pub mod`, so the example declares none; with 337 (3) there is no re-export syntax, and a name has the one path of the module that declares it.

Cells in this repository that prove it: none yet; 146 Conformance writes the library's cells.

[draft/main.bp](draft/main.bp)
[draft/checks/handles.bp](draft/checks/handles.bp)
