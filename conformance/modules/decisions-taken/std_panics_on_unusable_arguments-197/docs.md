# Decision 197 — † (1) erlang's `indexOf` / `lastIndexOf` count codepoints (320).

std treats an argument it cannot use as a programming error, so the program validates configuration before it reaches std. `RetryConfig` bounds a retry policy read from a document: at least one attempt, no negative delay, a ceiling a timer can arm. The good document becomes an `async.RetryPolicy` whose second pause `nextDelay` computes as `200`; the bad one never becomes a policy, and the report names both fields, `maxAttempts:minValue,initialMillis:positiveOrZero`.

The last three lines show what std answers when the arguments come straight from code. `nextDelay` of a policy with no attempts is `null` (a `retry` with it would panic, as `race([])` does). `"ação-é".indexOf("é")` counts code points, `5`, on erlang as on commonJS. `hash.pbkdf2Sha256` with zero iterations panics with one text on every target, never the host's own raise, and `failure.attempt` hands the program that text: `hash.pbkdf2Sha256: iterations and length must be at least 1`. The program prints the same five lines on both targets.

Cells in this repository that prove it: none. The rules are std's; the example is a consumer's that guards them with `#[validated]`, and 146 Conformance writes the library's cells.

[draft/main.bp](draft/main.bp)
