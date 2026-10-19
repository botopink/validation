# Decision 503 — `testing.asserts` imports on wasm, its API unchanged; `matches` waits on std's regex there, a located refusal until then. Amends 146.

The program checks its own constraint table at build. `tableProblems` reads `Signup.constraints()` and runs five assertions of std's `testing.asserts` over it: two `contains`, a `notContains`, a `deepEquals` of two arrays and a `throwsWith` over a body that panics with the expected text. `main` calls it under `comptime`, so the whole function, the library's table and the module of assertions with it, runs on the wasm comptime runtime: `testing.asserts` imports there with its API unchanged, `throwsWith` catches the panic through `failure.attempt` and `deepEquals` compares with a botopink body of its own. The program prints `0`, no assertion failed.

Only `asserts.matches` waits: it needs std's regex on wasm, and until that lands a call reaching it at build is refused, located at the call, while the import itself is accepted.

Cells in this repository that prove it: none yet. Today the build refuses `deepEquals` (`comptime-host-cell-unavailable`, `testing_asserts.canonical` has no wasm cell), which 144 B-25 gives a botopink body; 146 Conformance writes the library's cells.

[draft/main.bp](draft/main.bp)
