# Decision 144 — A `#[validated]` record (306) refuses a key it does not declare: a violation coded `unrecognizedKey`, at the key's own p

One document, three types. The text carries `name`, `phone` and a key `admin` that a client slipped in. `Contact` declares only `name` and `phone`, so `Contact.decode` refuses the document with one violation coded `unrecognizedKey` at the key's own path, `admin`; without the extra key the same type decodes. The default is the refusal, and nothing outside the type turns it off.

The two other types each say otherwise where the type is declared. `Lenient` carries `#[stripUnknown]`: the undeclared keys are dropped and the record is built from `name` alone. `Tagged` marks one `Dict<string, string>` field `#[rest]`: every key the type does not declare lands there, so `extra` holds `phone` and `admin`.

The program prints `admin:unrecognizedKey`, `ok`, `ana` and `phone,admin`. A framework that adds keys of its own to a form drops them before the pairs reach the type.

Cells in this repository that prove it: none yet. The suite holds it (`test/object_policy_example_test.bp`) until 146 Conformance writes its cells.

[draft/main.bp](draft/main.bp)
