# Decision 370 — A decorator hands a parameter's `@Expr` on to the program through two typed channels — typed meta or a typed member — never source text.

The program uses both channels a decorator has for handing an annotation's arguments on to the program, and neither is text. `#[check("the passwords differ", passwordsMatch, at: .confirm)]` records a typed value on `Account`, a `Check<Account>` whose `message` is the string and whose `rule` is the function `passwordsMatch` itself, spliced where the annotation wrote it. `#[validated]` adds a typed member, `validate`, a function whose body runs those rules.

`main` reads the member first: `draft.validate()` answers `confirm: the passwords differ | handle: that handle is taken`. `pending` is another reader of the same meta: it takes `compiler.typeInfo(Account).metaAll(Check)` as a constant of the build, typed `Check<Account>[]`, and at run time calls each `c.rule(a)` as the ordinary function it is, printing `the passwords differ | that handle is taken` for the draft and `0` for an account that breaks neither rule.

What the channels never carry is source text: a decorator that took `rule`'s text and spliced it into a string of code would be refused (`expr-param-method`), and no name passes as a string.

Cells in this repository that prove it: none yet. The library still hands its members on as text and has no `Check` meta; 146 s1 (125 step 7) brings the typed-member route, and 146 Conformance its cells.

[draft/main.bp](draft/main.bp)
