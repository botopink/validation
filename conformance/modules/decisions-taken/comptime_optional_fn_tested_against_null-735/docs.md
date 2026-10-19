# Decision 735 — (a): an optional function-typed `comptime` argument is tested against `null` as any `?T` is — `if (rule == null) { … }` — the function type no exception.

The program's build layer declares `labelled`, a decorator whose last argument is an optional function, `comptime describe: ?fn(v: T) -> string = null`. Its body tells the two ways of writing the annotation apart the way any `?T` is told apart: `if (describe == null)`. `Contact` is annotated `#[labelled("contact")]`, with no function, so its member answers the label alone; `Team` is annotated `#[labelled("team", seatsText)]`, so the body takes the function out with `describe!` and hands it on to the member, which calls it when the program runs. The function type is no exception to the test, and the body needs no other way (it may still read the declaration's kind) to know which form it was given.

The program prints `contact true` and then `team (4 seats) false`, the second value being validation's verdict on a team with no seats. validation's own `#[check]` reads its optional `rule` the same way, to tell `#[check("…")]` written on a rule function from `#[check("…", rule)]` written on a type.

Cells in this repository that prove it: none yet. The test against `null` is refused by the compiler today (`expr-value-of-function`), which 144 B-17 lifts; the library's `#[check]` reading it comes with 146 s1 (125 step 7), and 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
[draft/comptime/labels.bp](draft/comptime/labels.bp)
