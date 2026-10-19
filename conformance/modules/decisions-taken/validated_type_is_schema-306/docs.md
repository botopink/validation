# Decision 306 — The type is the only schema, and `#[schema]` becomes `#[validated]`.

The program declares `Signup` once, as a record with a marker on each field, and annotates it `#[validated]`. That one declaration is everything the library knows about a signup: `Signup.decode` reads JSON text into the record or answers the `ValidationReport`, `validate()` checks a record built in code, and `Signup.constraints()` describes the markers as JSON for a reader that is not botopink. There is no schema value beside the type, no combinator and no `Schema<T>` to keep in step with it; the markers on the fields are the schema.

`Email` shows the one-field form: `#[validated(transparent)]` writes and reads the type as its single field, so the document `"bo@example.com"` decodes to `Email(value: …)` and `"bo"` is refused by the field's `#[email]`.

The program prints `ok ana@example.com`; `email:email,age:minValue` for the document that breaks both markers; `false` for the under-age record built in code; the constraint table; `bo@example.com`; and `true`.

A loose value with no type of its own is checked by declaring a type or by the `constraints.v*` predicates; another library takes the `#[validated]` type itself, never a schema value.

Cells in this repository that prove it: none yet. The library's behaviour is held by its suite (`test/signup_schema_example_test.bp`, `test/schema_test.bp`) until 146 Conformance writes its cells.

[draft/main.bp](draft/main.bp)
