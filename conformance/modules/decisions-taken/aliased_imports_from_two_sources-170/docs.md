# Decision 170 — std takes the natural name and a library's copy goes (`clock.parseDuration`, `async.RetryPolicy`, `async.nextDelay`; rak

Two declarations named `Violation` meet in `main.bp`: validation's, one failed constraint of a report, and the program's own in `audit.bp`, an entry of its audit log with another shape. Each import names its source, validation `from "validation"` and the program's module by its path, and gives the name an alias, `FieldViolation` and `AuditEntry`, so both are legal side by side and every use says which one it means. `logged` turns the first into the second: the field's code becomes the entry's rule and its path the entry's place.

The link built in code breaks both of its markers, so the program prints `title notBlank 1` and `href url 1`. What stays refused is a use that cannot tell: two un-aliased imports of `Violation` into one module, or a bare name reaching both declarations, is `ambiguous-import-use`.

Cells in this repository that prove it: none yet; 146 Conformance writes the library's cells.

[draft/main.bp](draft/main.bp)
[draft/audit.bp](draft/audit.bp)
