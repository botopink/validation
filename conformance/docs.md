# validation — conformance reference

> Path: `repository/validation/conformance/`
> Sibling (AGENTS): [`./AGENTS.md`](AGENTS.md) · Repository guide: [`../AGENTS.md`](../AGENTS.md)
> Decisions: [`../decisions-taken.md`](../decisions-taken.md)

`validation` is botopink's constraint library: constraint markers, the `#[validated]` decorator, the violation
report, the constraint table, typed coercion, and the parse half of `#[validated]` — a type read from a `Json`
document and written back, its form binder and its JSON Schema. It is a repository of its own
(`botopink/validation`, decision 326), imports std and nothing else, and ships `.bp` files only, so one source
compiles for erlang and commonJS and the server's handler and the client's form run the same predicate. The type is
the only schema (decisions 306, 327): there is no schema value.

This reference describes the library as it is built and as the rules in force
([`../decisions-taken.md`](../decisions-taken.md)) fix it. Every example is a conformance cell (decisions 457, 461,
462): a line `<!-- example: modules/<cell> -->` names `modules/<cell>/` of this directory, checked by
`botopink cell check conformance/`. This directory holds no cell yet, so this page carries none; a table, a grammar
or a manifest is not a program and is fenced as `text`. The library's behaviour is held today by the suite `test/`
(`botopink test`), which the cells will take over.

| Section | What |
|---|---|
| *Loading* | the dependency and the imports an annotated type needs |
| *`decorators`* | `#[validated]`, the constraint markers, the parse-half markers and their refusals |
| *`report`* | `Violation`, `ValidationReport`, `Flat`, `ReportTree` |
| *`path`* | the path a violation's `field` is |
| *`messages`, `locales`* | message templates, the message source, the shipped locales |
| *`constraints`, `formats`* | the `v*` predicates and the string formats they walk |
| *`table`* | the constraint table and the JSON Schema dialects |
| *`spi`* | an application's own constraints and schema registry |
| *`binding`* | typed coercion of path, query and form values |
| *`codecs`* | the codec recipes |
| *`derived`* | the machinery the members `#[validated]` adds call |
| *Departures* | where the source still writes a form the rules in force have replaced |

## Loading

A program that imports `from "validation"` declares it in `dependencies`; without the entry the import is
`unresolved import source "validation" — declare it in botopink.json "dependencies"` (decision 242):

```text
{ "dependencies": { "validation": { "git": "https://github.com/botopink/validation.git", "branch": "feat" } } }
```

Every `.bp` under `src/` is a module, its path its name (592 (1)); a consumer writes the brace form with the package
named: `import {decorators.validated, report.ValidationReport} from "validation";`. A `#[validated]` type imports
`from "validation"` and `from "std"` only, and answers the same report on erlang and commonJS.

A type annotated `#[validated]` gets its members at the application site (`compiler.addMember`, 216), so the module
that declares it imports the names the members reference: `derived`, `report.ValidationReport`, `report.Violation`,
`table.constraintTableJson`, `spi.vConstraint`, the `constraints.v*` predicates its markers use, and std's `Json`.
`validated` is imported from `"validation"`, never a framework's placement-only marker of the same name: importing
that one gives no `validate()` member, and importing both is a duplicate binding.

## `decorators`

### `#[validated]`

`#[validated]` on a `type` reads each field's markers and gives the type its members, which travel with it to every
importer. The checks:

- `validate(self) -> ValidationReport` — runs every marker; all of them run, the first failure does not stop the next.
- `constraints() -> string` — the constraint table as JSON (see *`table`*).

and the parse half, named without the type's name (327):

| Member | What |
|---|---|
| `T.parse(input: Json)` | a `Json` document to `Result<T, ValidationReport>` |
| `T.parseAt(input, at)` | the same, every violation under the path `at` |
| `T.decode(text)` | JSON text to the same |
| `T.bind(pairs)` | form pairs `#(name, value)[]` to the same |
| `T.encode(v)` | the value as a `Json` document, `Result<Json, ValidationReport>`; runs the type's own `validate()` first and is an `Error` for a value it refuses |
| `T.jsonSchema()` | the JSON Schema document (draft 2020-12), a `string` |
| `E.options()` | an enum's variant names in declaration order |

Three more members, `__json`, `__schemaNode` and `__schemaDefs`, are what a type calls on another; no application
calls them. A type that already has a `validate` or `constraints` member is refused at the annotation
(`decorator-member-duplicate`). `#[validated(transparent)]` (with `decorators.transparent` imported) on a type of one
field writes and reads the type as that field; on a type of any other number of fields it is refused.

What the parse half decodes: `string`, `i32`, `i64`, `f64`, `bool`, `Json`, `?T`, arrays, sets (a repeated item is
`duplicate` at its own index), dictionaries (`K` is `string`, `i32` or a `#[validated]` enum), tuples `#(A, B, …)`
(a list of exactly that length; a labelled tuple is refused), unions `A | B` (the arms in the type's order, the first
that accepts; none is one `invalidUnion` naming each arm's first violation), in any nesting, and another `#[validated]`
record or enum, the type itself included. Any other field type is a located compile error naming the field and the
type. Each field is decoded, every violation is collected, and the record is built only when there are none; the
checks then run on what was decoded, re-rooted under the record's path.

- **Absent is one value.** A missing key and `null` decode the same: `null` for a `?T`, `required` for a `T`.
- **Numbers.** A JSON number is an `f64`. An `i32` field takes a whole number in range (`7.0` is whole, `1.5` and
  `2147483648` are `invalidType`); an `i64` field a whole number within ±(2^53 − 1).
- **An undeclared key is refused** (144): `unrecognizedKey` at the key's own path, after the declared fields;
  `#[stripUnknown]` and `#[rest]` are the two located ways to say otherwise, and no setting changes the default.
- **Enums.** On a payload-less enum the variant's name decodes (`"Tuna"` to `Fish.Tuna`); absent is `required`,
  another kind `invalidType`, another text `invalidValue` with `{options}`. With `#[tag("status")]` the enum is an
  object whose member `status` names the variant and whose other members are the payload, a `#[validated]` record named
  `<Enum><Variant>` held as the variant's one field `value`.
- **Coercion** (183): `#[coerce]` on a `string`, `i32`, `i64`, `f64` or `bool` field (or its `?T`) reads text by the
  field's type — a number by the integer grammar extended with a fraction and an exponent, a `bool` by the stringbool
  set (`true 1 yes on y enabled` / `false 0 no off n disabled`, case-insensitive); `""` and `null` are absent; text the
  type does not read stays text and is `invalidType`, never a zero. `#[stringbool]` takes only that set.
  `#[coerce] #[isoDatetime]` on an `i64` reads an RFC 3339 instant as epoch milliseconds.
- **The form binder.** `T.bind(pairs)` reads form pairs into the document `T.parseAt` reads, every field by its type as
  `#[coerce]` would; a repeated name is an array's items (none is `[]`), a `bool` with no value `false`, a name the type
  does not declare the unknown-key rule.

### Constraint markers

`markerNames()` lists the 73 markers `#[validated]` reads, in file order. Every marker names the types it checks; on
any other it is a located compile error, since a constraint that could never fail is refused rather than emitted. A
marker other than `#[notNull]` on `?string`, `?i32`, `?i64` or `?f64` checks the value when present and nothing when
`null`. Text arguments may not be empty nor carry `;`, `|` or `"`; a bound that could never fail is refused
(`#[minLength(0)]`, `#[multipleOf(0)]`). A parameter is never named `value` in a template: `gt` and `lt` say `{bound}`,
`multipleOf` `{step}`. The bound of `gt`, `lt` and `multipleOf` is the field's type (`#[gt(5.0)]` on an `f64` field, a
fraction on an integer field refused at the argument).

| Group | Markers |
|---|---|
| Presence and size | `notNull`, `notBlank`, `notEmpty`, `sizeBetween`, `minLength`, `maxLength`, `length` (code points of a `string`, items of an array, set or dictionary) |
| Numbers | `minValue`, `maxValue`, `positive`, `positiveOrZero`, `gt`, `lt`, `negative`, `negativeOrZero`, `multipleOf`, `safeInt`, `float32` |
| Text | `startsWith`, `endsWith`, `includes`, `uppercase`, `lowercase`, `pattern(regex)` |
| String formats | `email`, `emailHtml5`, `emailRfc5322`, `emailUnicode`, `uuid`, `uuidV`, `guid`, `url`, `urlHost`, `urlProtocol`, `httpUrl`, `hostname`, `e164`, `emoji`, `base64`, `base64url`, `hex`, `jwt`, `jwtAlg`, `nanoid`, `cuid`, `cuid2`, `ulid`, `ipv4`, `ipv6`, `mac`, `macDelimiter`, `cidrv4`, `cidrv6`, `creditCard`, `currencyCode`, `iban`, `hash`, `hashEnc` |
| Dates | `pastDate`, `futureDate`, `afterIso`, `beforeIso`, `isoDate`, `isoTime`, `isoTimePrecision`, `isoDatetime`, `isoDatetimeOffset`, `isoDatetimeLocal`, `isoDatetimePrecision`, `isoDuration` |
| Values | `literal` (a `string`, `i32` or `bool` held to one value), `oneOf` (a text field held to a closed set, two or more options) |
| Application | `constraint(name)` — a constraint registered through `spi` |

### Markers of the parse half

| Marker | What |
|---|---|
| `#[tag(member)]`, `#[exhaustive]` | a tagged enum; a dictionary keyed by an enum holding every variant |
| `#[stripUnknown]`, `#[rest]`, `#[present]` | the object policy: drop undeclared members; hold them in one `Dict<string, T>` field; take an absent `?T` key as `null` and refuse a key holding `null` |
| `#[orElse(v)]`, `#[orElseOf(f)]` | a default for an absent key |
| `#[fallback(v)]`, `#[fallbackOf(f)]` | a replacement for a value that does not decode or fails its checks, with no violation |
| `#[coerce]`, `#[stringbool]` | coercion |
| `#[trim]`, `#[lowercased]`, `#[uppercased]`, `#[normalized(form)]`, `#[normalizedUrl]` | transforms of a text field, in the order written, after a default and before the checks |
| `#[message(text)]`, `#[typeMessage(text)]`, `#[stopOnFirst]` | restate the marker just before it; restate the decoder's `invalidType`; report only the first failing check of the field (refused with fewer than two checks) |
| `#[preprocess(f)]`, `#[each(marker)]` | rewrite the raw value before it is decoded; apply one marker to every item of an array or set, each violation at `field[i]` |
| `#[title]`, `#[describe]`, `#[example]`, `#[deprecated]`, `#[schemaId]`, `#[jsonSchema]` | JSON Schema annotations; the id a registry knows the type by; refuse any marker with no keyword |

A literal given to `#[orElse]` or `#[fallback]` is a value of the field's type (an enum's variant by reference,
`#[orElse(.Tuna)]`) or the marker is refused at the field. Refused: `#[present]` on a field that is not `?T`, `#[rest]`
on one that is not `Dict<string, T>` or twice, `#[rest]` beside `#[stripUnknown]`, a default beside `#[rest]` or
`#[present]`.

A field rule is a function: `check` on a field takes `rule: fn(v: T) -> bool`, and `false` is a violation coded `custom`;
on a type it is refused until typed decorator arguments land. The rules in force (406, 731 (11), 735) name it
differently: see *Departures*.

### JSON Schema

`T.jsonSchema()` is the document (draft 2020-12): `$schema` first (and `$id`, the `#[schemaId]`), the type's node,
`$defs` with every other `#[validated]` type it reaches (so mutual recursion is finite), a reference to the document's
own type `{"$ref": "#"}`. A marker becomes its keyword (formats, `contentEncoding`, a regex format's `pattern`, bounds as
`minLength`, `minItems`, `minimum`, …, `#[literal]` as `const`, `#[oneOf]` as `enum`); a `?T` takes `null`; `#[present]`,
`#[orElse]` (which also writes `default`) and `?T` fields are not `required`; `additionalProperties` is `false` unless
`#[stripUnknown]` or a `#[rest]` field. A marker with no keyword makes the field `{}`; under `#[jsonSchema]` on the type it
is a compile error naming the field and the marker. The suite checks every document it emits against the 2020-12
meta-schema with a vendored validator, in the tests only (399).

## `report`

A `Violation` is one failed constraint: `field` (a path), `code` (the constraint's name), `message` (the resolved,
interpolated template) and `invalidValue` (what was rejected, as a string). Its helpers restate the violations of the
marker before a `#[message]` (`restated`), keep them only when a value is present (`onlyIf`) and keep the first failing
list (`firstFailing`).

A `ValidationReport` is a list of violations, never a first failure, in declaration order. `isValid()`; `merge(other)`
keeps the receiver's violations in front; `toJson()`; `toProblemDetail()`, which never echoes `invalidValue` (a report is
rendered into an HTTP body); `empty()` and `of(violations)`. The error views:

- `flatten()` answers `Flat(formErrors, fieldErrors)`: the messages of the document itself, and per first path segment the
  messages under that field.
- `tree()` answers `ReportTree(errors, properties, items)`: the messages where the document holds the value they are
  about, `properties` by key, `items` by index; `ReportTree.none()` is the tree of a value nothing was said about.
- `pretty()` writes `✖ <message>` then `  → at <path>` when the value is not the document itself.

`violation(field, code, message, invalidValue)`, `noViolation()`, `oneViolation(v)` and `violationJson(v)` are where every
constraint builds its answer. Structural codes: `invalidType`, `required`, `unrecognizedKey`, `invalidJson`,
`invalidUnion`, `invalidValue`, `duplicate`, `custom`.

## `path`

A violation's `field` is a path, a `string` the whole way: `email`, `address.street`, `tags[1]`, and the empty text for the
document itself; a flat record's path is its field's name. `root()`, `key(at, name)`, `index(at, i)` build one going down;
`segments`, `head`, `parts`, `joined` and `parent` read one back. A key that would read as structure is quoted: a member
named `a.b` is written `["a.b"]`, so is a key holding `[`, `]` or `"` and the empty key, with `"` and `\` escaped inside.

## `messages`, `locales`

A violation's `message` is a template resolved at validation time. The library spells no property key: a framework hands a
`MessageSource(locale: fn() -> string, template: fn(key: string) -> string)` to `setMessageSource`, and the resolution is
`template(locale + "." + code)` when the locale is not `""`, then `template(code)`, then the built-in text; a `""` from the
source means no entry. `builtInOnly()` is the source in force until one is set; `messageSource()` reads it.
`underSource(source, run)` (over `useParseSource` and `clearParseSource`) installs a source for one parse. Above every source
a field's `#[message]` restates the marker before it, and `#[typeMessage]` its decoder's `invalidType`.
Placeholders are `{field}`, `{value}` and the constraint's own parameters, substituted by name; a name the constraint does
not have is left as written. `message(code, builtIn, field, value, params)` resolves one, `interpolate`, `templateFor`,
`arg`, `noArgs`, `codes()`, `builtInTemplate(code)` and `currentLocale()` are its parts, `showI32`, `showI64`, `showF64` render
a number. `locales.en()` (the built-in table), `locales.ptBR()` and `locales.es()` each hold a template for every code of
`codes()`.

## `constraints`, `formats`

`constraints.bp` is the `v*` predicates, one per marker (`vNotBlank`, `vSizeBetween`, `vGtI32`, `vIsoDate`, …), each answering
an `Array<Violation>`, empty or one, and one per numeric width where the width matters; `vCheck` and `vEach` lower
`#[check]` and `#[each]`, `emailPattern()` is the `email` regex. All are plain botopink over std's `regex`, `unicode` and
`io.clock`, so one predicate answers alike on both targets. `formats.bp` is the formats as walks or as regexes in the
intersection of PCRE and ECMAScript (bracket classes, groups and counted repeats; no backslash class, no lookaround):
`is<Format>(s)` for every format marker, `<name>Pattern()` per regex format, `urlParts` and `digitsValue`. Where the reference
is loose and the rule here stricter, the stricter wins.

## `table`

`T.constraints()` answers a JSON description of the record's constraints, the one thing serialized for a consumer that is not
botopink. It is built by `constraintTableJson(typeName, blob)` from a blob the decorator concatenates: records separated by
`;`, fields of a record by `|`:

```text
<field>|<code>[|<arg>]*
```

in declaration order, grouped by field; an argument carrying `;` or `|` is refused at compile time, so the grammar has no
escape. `splitBlob`, `paramNames`, `paramIsNumber`, `renderParam`, `constraintJson` and `fieldJson` are its parts.
`toDraft07`, `toOpenApi30` and `withRefBase` rewrite a JSON Schema document for another dialect (draft-07's `definitions`
and `items`; OpenAPI 3.0's `nullable`, `enum` and `#/components/schemas/` references); a text that is no JSON document is
answered unchanged.

## `spi`

An application adds a constraint without touching the library: a type implementing the behavior `Constraint` (`code(self)`
and `check(self, field, value) -> string`, where the empty string is a pass and a non-empty answer is the message template),
registered by `registerConstraint(name, code, check)` and reached with `#[constraint("name")]`. `constraintRegistered`,
`registeredConstraints`, `clearConstraints` and `unknownConstraintMessage` complete it. An unregistered name is a violation
coded `unknownConstraint`, not a pass, naming the registered ones; `vConstraint` is what the marker lowers to. The registry is
host state (a `persistent_term` entry on erlang, a cell on `globalThis.__bp_validation` on node). `registerSchema(id, document)`,
`registeredJsonSchemas()` (`{"schemas": {id: …}}`, each with its `id` and a `$ref` by id) and `clearSchemas()` are the schema
registry.

## `binding`

Typed coercion of values a server framework reads as plain strings (path, query, header, form). A coercion that fails records a
violation and answers the zero, so the zero is never mistaken for a value: `bindInt`, `bindBool`, `bindFloat`, `bindRequired`
and `bindEpochMillis` take `(field, raw)`; `bindingReport()` and `bindingCount()` read the accumulator and `bindingReset()`
clears it. The pattern is bind everything, then ask once. The accumulator is host state keyed on the request process;
`bindingIsolated()` is measured on erlang and stated on node. `isIntegerText` and `digits` are the integer grammar.

## `codecs`

Each recipe is a pair of plain functions: `decode` from the wire value to the program's, answering an `Error` with the reason when
the wire value is not one, and `encode` back, each an inverse on its domain: `textToInt` / `intToText`, `textToLong` /
`longToText`, `textToFloat` / `floatToText`, `isoToMillis` / `millisToIso` (UTC with milliseconds), `secondsToMillis` /
`millisToSeconds`, `textToJson` / `jsonToText`, `base64ToText` / `textToBase64`, `base64urlToText` / `textToBase64url`,
`hexToText` / `textToHex`, `uriComponentToText` / `textToUriComponent`, `textToUrl` / `urlToText`, `textToBool` / `boolToText`.
`#[codec(decode: f, encode: g)]`, `#[map]` and `#[tryMap]` wait on typed decorator arguments; the pairs are usable on their own.

## `derived`

The machinery the emitted members call, imported by the application only because they name it through one namespace,
`derived`: the decoders (`decodeString`, `decodeInt`, `decodeLong`, `decodeFloat`, `decodeBool`, `decodeJson`, `optionalOf`,
`decodeArrayOf`, `decodeSetOf`, `decodeDictOf`, `decodeIntKey`, `decodeText`), the path and report helpers (`memberPath`,
`indexPath`, `required`, `under`, `underField`, `violationsOf`, `objectProblems`, `unknownKeys`), the coercion and transforms
(`coerced`, `decodeStringBool`, `transformText`, `transformOptional`, `transformEach`, `formDocument`), the encoders
(`encodeInt`, `encodeLong`, `encodeOptional`, `encodeArrayOf`, `encodeSetOf`, `encodeDictOf`, `objectOf`, `membersOf`,
`tagged`) and the JSON Schema writers (`documentOf`, `withTag`, `hasDef`, `refsRenamed`, `refsPrefixed`, `jsonText`,
`numberText`). Five host cells hold no state — `wholeI32`, `wholeI64`, `isWhole`, `floatOfI32`, `floatOfI64` — because the language has
no conversion between `f64` and the integers; whether a number fits is botopink's, the cells convert. A decoder is a named
function, never a lambda, and answers `Result<T, ValidationReport>`.

## Departures

Where the source has not yet caught up with the rules in force, this reference follows the rules:

- A field's rule is written `#[check(rule)]` in the source; the rules in force name it `#[refine(rule)]`, with `#[check]` on a type taking
  `message` first and `rule`, `at` and `code` after it (406, 731 (11), 735). The type-level form is not built.
- `#[each(marker)]` takes a `Decorator`; a decorator is compared with `compiler.same` and the `Decorator` type is retired (666).
- Types are written `Array<T>` in the source where the rules spell `T[]` (641, 617 (1)), and `pub mod` lines in `root.bp` and
  `entry` and `files` in `botopink.json` remain where the tree alone is the module list (592 (1), 703, 733).
