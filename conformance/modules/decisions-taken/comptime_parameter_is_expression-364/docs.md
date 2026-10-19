# Decision 364 — Every `comptime` parameter is an expression: `comptime x: @Expr<T>` — a decorator's, a tag annotation's, a template function's, any function's, a builtin's.

The markers on `handle` take expressions, not only literals: `#[minLength(2 + 3)]`, `#[maxLength(4 * 4)]` and `#[startsWith("user" + "_")]`. Each marker's parameter is declared `comptime` in the library (`minLength(syntax decl: unknown, comptime min: i32)`), so the argument is the user's expression, checked against the parameter's type at the argument and known when the program is built; the decorator reads the values 5, 16 and `"user_"` there. `#[refine(notReserved)]` takes a function: the decorator never calls it at build, it passes the function on to the member it writes, and the rule runs when a record is checked.

The program prints `ok user_ana`; `minLength,startsWith` for `ana`, three characters and no prefix; `maxLength` for the long handle; `custom` for `user_root`, which only the rule refuses.

An argument the build cannot know is refused at the argument, located: `#[minLength(limitFromEnv())]` names a call that runs only when the program does. A `comptime` parameter is declared with the modifier and its plain type, the spelling of 575 and 616.

Cells in this repository that prove it: none yet. The markers' `comptime` parameters are in the library; `#[refine]` comes with 146 s1 (125 step 7), and 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
