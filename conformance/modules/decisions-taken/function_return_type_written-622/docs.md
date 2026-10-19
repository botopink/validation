# Decision 622 — Every function writes its return type, `-> void` included: `fn m(self: Self) -> void { … }`, `pub fn main() -> void { … }`; a `fn` with no `->` is refused at its name, `fn-return-missing`, `write -> void, or the type it answers`.

Every function the program declares says what it answers, `-> void` included: the methods `total` (`-> string`) and `describe` (`-> void`) of the `#[validated]` record `Cart`, the helpers `read` (`-> Result<Cart, ValidationReport>`) and `report` (`-> void`), `main` (`-> void`) and the typed lambda `fn(c: Cart) -> bool { … }` bound to `atLeastOne`. Nothing is inferred from a body: `report`, whose body is a `case` of calls, is a `-> void` function because its declaration says so. The members `#[validated]` adds are written the same way (`validate(self: Self) -> ValidationReport`, `decode(text: string) -> Result<Cart, ValidationReport>`).

The program prints `2 items, R$ 45`, then `items:minValue` for the empty cart, then `true`.

A function written without `->`, `fn report(r: Result<Cart, ValidationReport>) { … }`, is refused at its name with `fn-return-missing`, the fix written: `write -> void, or the type it answers`.

Cells in this repository that prove it: none yet. The library's own functions still omit `-> void` in places (its decorators among them, `src/decorators.bp`); front 146 adds it by codemod, and 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
