# Decision 406 — 244 holds for decorators: `#[check]`'s `message` comes first and is required; on a field the rule is `#[refine(rule)]`, a field marker like the others.

`Booking` carries both halves of the rule. On the type, each `#[check]` opens with its message, a required text, and then names the rule function and, with `at:`, the field the violation is reported at: `passwordsMatch` at `.confirm` and `handleFree` at `.handle`, each with the default code `custom`. On the fields, the rule is `#[refine(isEven)]`, a field marker like any other, so its text comes from the field's message order: `seats` restates it with `#[message("must be even")]` written right after it, and `tables`, with none written, takes the locale's default for `custom`.

The good booking prints `true`. The bad one prints its four violations, the field checks first and the type's checks after them: `seats custom: must be even`, `tables custom: is not valid`, `confirm custom: the passwords differ` and `handle custom: that handle is taken`.

Two spellings are refused at the annotation: a type-level `#[check(passwordsMatch)]` with no message does not compile, and `#[check(isEven)]` written on a field is refused, naming `#[refine]`.

Cells in this repository that prove it: none yet. The library still writes the field rule `#[check(rule)]` and has no type-level form (`conformance/docs.md` § Departures); 146 s1 (125 step 7) brings both, and 146 Conformance their cells.

[draft/main.bp](draft/main.bp)
