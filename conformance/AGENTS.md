# conformance

The `validation` library's conformance tree (decisions 457, 463). [`docs.md`](docs.md) is the library's reference; every
example in it will be a cell of `modules/`, checked by `botopink cell check conformance/`. No cell exists yet: the library's
behaviour is held by the suite in `../test/` until its cells are written.

- `docs.md` — the reference, one section per public module, in the pattern of botopink-lang's `conformance/docs.md`:
  - *Loading* — the dependency and the imports an annotated type needs.
  - *`decorators`* — `#[validated]`, its members, the constraint markers, the parse-half markers, the JSON Schema.
  - *`report`* — `Violation`, `ValidationReport`, `Flat`, `ReportTree`.
  - *`path`* — the path a violation's `field` is.
  - *`messages`, `locales`* — message templates, the message source, the shipped locales.
  - *`constraints`, `formats`* — the `v*` predicates and the string formats.
  - *`table`* — the constraint table and the JSON Schema dialects.
  - *`spi`* — an application's own constraints and the schema registry.
  - *`binding`* — typed coercion of path, query and form values.
  - *`codecs`* — the codec recipes.
  - *`derived`* — the machinery the emitted members call.
  - *Departures* — where the source still writes a form the rules in force have replaced.
- `modules/decisions-taken/<slug>-<N>/` — front 166's decision cells, when a row of `../decisions-taken.md` calls for one;
  that subtree is front 166's alone (651). None exists yet.
