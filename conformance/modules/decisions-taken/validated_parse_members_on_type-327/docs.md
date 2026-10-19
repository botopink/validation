# Decision 327 — `#[validated]`'s parse half are members of the type, named without the type's name:

Every way the program reads or writes a `Player` is a member of `Player`, named without the type's name. `Player.parse(doc)` takes a `Json` document the `json` library decoded and answers `Result<Player, ValidationReport>`; `Player.parseAt(bad, "players[2]")` does the same for a document that sits inside a larger one, so each violation is reported under `players[2]`; `Player.decode(text)` starts from JSON text; `Player.bind(pairs)` reads form pairs, the score coerced from the text `"12"`; `Player.encode(p)` writes the record back as a `Json` and refuses one its own `validate()` refuses; `Player.jsonSchema()` answers the JSON Schema document. `validate()` beside them checks a record built in code.

The program prints `ana=7`, `players[2].name:notBlank,players[2].score:minValue`, `bo=3`, `cy=12`, `{"name":"di","score":5}`, then `true` three times: the empty name is not encoded, the record built in code is valid, and the schema opens with `$schema`.

No module-level function carries the type's name (`parsePlayer`, `decodePlayer`, `schemaOfPlayer`): the members travel with `Player` to every module that imports it.

Cells in this repository that prove it: none yet. The suite holds the members (`test/schema_test.bp`, `test/coercion_and_forms_example_test.bp`, `test/json_schema_test.bp`) until 146 Conformance writes its cells.

[draft/main.bp](draft/main.bp)
