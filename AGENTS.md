# validation

> Repository: `botopink/validation` (`git@github.com:botopink/validation.git`) · in the meta checkout: `repository/validation/`

The `validation` library (decision 116 rule 5): constraint markers,
`#[validated]`, the violation report, the constraint table, typed coercion, and
— since `specs/1.0.11-beta/07-bundled-libs/125-validation-zod` — the parse half
of `#[validated]`: the type's members from a `Json` document to a typed record
and back, its form binder and its JSON Schema (decisions 306, 327).
One source compiled for erlang and commonJS, so the server's handler and the
client's form run the same predicate. Moved from rakun front 14's validation
member (`repository/rakun/modules/rakun-validation`) by
`specs/1.0.10-beta/01-std/06-validation-lib`.

Imports `std` and nothing else. Ships `.bp` files only — no `.erl`, no `.mjs`;
target-native code is inline `#[@External.<Target>(…)]` templates (decision 117
rule 8). Module atoms follow decision 109: `validation@report`,
`validation@report@@ValidationReport`.

**A library of its own** (decision 326). It was bundled with the compiler until
`03-bundled-libs/138` moved it here with its history; the compiler now embeds std alone.
A program that imports `from "validation"` declares it in `dependencies` (decision 242) —
`{ "validation": { "git": "https://github.com/botopink/validation.git", "branch": "feat" } }`; inside the meta checkout that entry
resolves by name through the `repository/` root (`repository/validation`), elsewhere
through the install store. Without the entry, `from "validation"` is
`unresolved import source "validation" — declare it in botopink.json "dependencies"`.
A `#[validated]` record in a consumer imports only `from "validation"` and
`from "std"` and answers the same report on erlang and commonJS.

## Tree

```text
validation/
├── botopink.json     "name": "validation", "target": "erlang", "targets": ["erlang", "commonJS"], no dependencies
├── AGENTS.md         ← you are here
├── src/
│   ├── root.bp         pub mod path; report; table; messages; locales; derived; spi; formats; constraints;
│   │                   binding; codecs; decorators
│   ├── path.bp         root, key, index, segments, head, parts, joined, parent — the path a violation's
│   │                   `field` is
│   ├── report.bp       Violation (restated, onlyIf, firstFailing), ValidationReport (isValid, merge,
│   │                   toJson, toProblemDetail, flatten, tree, pretty, empty, of), Flat,
│   │                   ReportTree (none),
│   │                   violationJson, violation, noViolation, oneViolation
│   ├── table.bp        constraintTableJson and the blob grammar (splitBlob, paramNames, paramIsNumber,
│   │                   renderParam, constraintJson, fieldJson); the JSON Schema dialects toDraft07,
│   │                   toOpenApi30, withRefBase
│   ├── messages.bp     Arg, arg, noArgs, MessageSource, setMessageSource, builtInOnly, messageSource,
│   │                   useParseSource, clearParseSource, underSource, currentLocale, templateFor,
│   │                   interpolate,
│   │                   message, codes, builtInTemplate, showI32/I64/F64
│   ├── locales.bp      en, ptBR, es — one `fn() -> MessageSource` each (`en` is the built-in table)
│   ├── derived.bp      what the members `#[validated]` adds call (no schema value — decision 306):
│   │                   the decoders decodeString/Int/Long/Float/Bool/Json,
│   │                   optionalOf, decodeArrayOf, decodeSetOf, decodeDictOf, decodeIntKey;
│   │                   memberPath, indexPath, objectProblems, unknownKeys, violationsOf, under,
│   │                   underField, decodeText, required, variantName, noArm, tupleItems,
│   │                   itemOf, absentKeys, without, presentOf, restOf, widened, failedFields,
│   │                   coerced, decodeStringBool, transformText, transformOptional, formDocument,
│   │                   typeRestated, transformEach; encoding: encodeInt, encodeLong,
│   │                   encodeOptional, encodeArrayOf, encodeSetOf, encodeDictOf, intKeyText, textOfJson,
│   │                   objectOf, membersOf, tagged (two more conversion cells: floatOfI32, floatOfI64);
│   │                   JSON Schema: hasDef, textArray, withTag, documentOf,
│   │                   refsRenamed, refsPrefixed; the JSON writer jsonText, numberText
│   │                   kindOf, isNull, shown
│   │                   (three conversion cells: wholeI32, wholeI64, isWhole)
│   ├── spi.bp          Constraint, registerConstraint, constraintRegistered, registeredConstraints,
│   │                   clearConstraints, unknownConstraintMessage, vConstraint; registerSchema,
│   │                   registeredJsonSchemas, clearSchemas   (registries: templates)
│   ├── formats.bp      the string formats as walks or intersection-grammar regexes: is<Format>(s) for every
│   │                   format marker, <name>Pattern() per regex format, urlParts, digitsValue (no host cell)
│   ├── constraints.bp  the v* predicates (std `regex`, `unicode`, `io.clock`, `formats.bp`), emailPattern,
│   │                   vCheck (`#[check(rule)]`), vEach (`#[each(marker)]`)
│   ├── binding.bp      bindInt, bindBool, bindFloat, bindRequired, bindEpochMillis, bindingReport, bindingCount,
│   │                   bindingReset, bindingIsolated, isIntegerText   (accumulator: templates; numerals: std's parseInt, toI32)
│   ├── codecs.bp       the twelve codec recipes as decode / encode pairs: textToInt / intToText,
│   │                   textToLong / longToText, textToFloat / floatToText, isoToMillis / millisToIso,
│   │                   secondsToMillis / millisToSeconds, textToJson / jsonToText, base64ToText /
│   │                   textToBase64, base64urlToText / textToBase64url, hexToText / textToHex,
│   │                   uriComponentToText / textToUriComponent, textToUrl / urlToText, textToBool /
│   │                   boolToText (four conversion cells)
│   └── decorators.bp   #[validated] (Form, transparent), the 73 constraint markers (`markerNames()`),
│                       markerRule, the parse half (`parsing`); #[tag], #[exhaustive], #[stripUnknown], #[rest], #[present], #[orElse],
│                       #[orElseOf], #[fallback], #[fallbackOf], #[coerce], #[stringbool], #[trim],
│                       #[lowercased], #[uppercased], #[normalized], #[normalizedUrl], #[message],
│                       #[typeMessage], #[stopOnFirst], #[preprocess], #[check], #[each], #[jsonSchema],
│                       #[schemaId], #[title], #[describe], #[example], #[deprecated]
└── test/             binding · checks_and_formats_example · codecs · coercion_and_forms_example · collections_example · constraints ·
                      enums_and_unions_example · error_views_example · json_schema · json_schema_example ·
                      locales · message_order · messages · nested_and_arrays_example ·
                      object_policy_example · parity · path · refine_and_messages_example ·
                      transform_and_codec_example ·
                      platform · refusal · report · schema · schema_parity · signup_schema_example ·
                      spi · table   (suite `validation:`)
    └── tools/        the meta-schema check's vendored validator — tests only (see § Testing)
```

`botopink.json`'s `files` order is a dependency order: a module is listed before
the siblings that import it (`formats` before `derived`, which coerces an ISO
instant; `derived` before `table` and `spi`, which write JSON Schema).

## The message source

The library spells no property key. A framework hands it where templates come
from:

```bp
pub type MessageSource(locale: fn() -> string, template: fn(key: string) -> string)
pub fn setMessageSource(source: MessageSource) -> i32
pub fn builtInOnly() -> MessageSource      // in force until a source is set
```

`templateFor(code, builtIn)` asks `template(locale() + "." + code)` when the
locale is not `""`, then `template(code)`, then answers `builtIn`. A `""` from
the source means "no entry". A per-parse source (`messages.underSource(source, { ->
T.parse(doc) })`, over `useParseSource` / `clearParseSource`) is asked the same two keys
first, for the one call; it lives in the process dictionary on erlang (key
`{validation, parse}`) and in the node cell's `parse` member, which is read as
absent when never set, so the cell's init literal is unchanged. Above every
source: a field's `#[message("…")]` restates the marker just before it
(`Violation.restated`), `#[typeMessage("…")]` its decoder's `invalidType`
(`derived.typeRestated`) — `test/message_order_test.bp` holds the six levels.
`#[stopOnFirst]` on a field reports only the first of its checks that fails
(`Violation.firstFailing`); with fewer than two checks it is refused, and so is
a `#[message]` with no marker before it. The shipped locales are `locales.en()`, `locales.ptBR()` and `locales.es()`
(`setMessageSource(locales.ptBR())`): a template for every code of
`messages.codes()`, each a different text with the built-in template's
placeholders (`test/locales_test.bp`). rakun installs a source over its own property keys
at boot (rakun front 14 Step 7); onze installs the browser's in the entry it
generates (front 68).

## Host cells

`derived.bp` has five host cells that hold no state — `wholeI32`, `wholeI64`
(an `f64` already known whole and in range, as the integer it is), `isWhole`,
and `floatOfI32` / `floatOfI64` (an integer as the `f64` a JSON number is) —
because the language has no conversion between `f64` and the integers
(`codecs.bp` repeats four of them). The decision of
whether a number fits is botopink; the cells convert.

Three pieces of host state, all inline templates:

| State | Erlang | Node |
|---|---|---|
| constraint registry (`spi.bp`, 7 cells) | one `persistent_term` entry `{validation, constraints}` = `{Order, Funs, Codes}` | `constraints` / `codes` Maps on `globalThis.__bp_validation` |
| binding accumulator (`binding.bp`, 5 cells) | the process dictionary, key `{validation, acc}` | `acc` array on `globalThis.__bp_validation` |
| message source (`messages.bp`, 2 cells) | `persistent_term` entry `{validation, messages}` | `messages` on `globalThis.__bp_validation` |

The node cell is created lazily by whichever template runs first, so **every
node template carries the identical init literal**
`{ constraints: new Map(), codes: new Map(), acc: [], messages: null }` — a
cell with a different literal leaves the object without the fields the others
read (measured: `__V.constraints.has is not a function`). Erlang template
variables are spelled `Va<Name>__` and every template is a `fun` applied in
place, so two inlined cells in one function never share a binding.

`bindingIsolated()` is MEASURED on erlang (spawn a process, push two
violations there, compare its count and this process's) and stated on node
(one request runs to completion before the next).

## The markers

`decorators.markerNames()` lists the 73 markers `#[validated]` reads, in file
order: the thirteen of step 2, the 58 of front 125 step 3 — string checks
(`minLength`, `maxLength`, `length`, `startsWith`, `endsWith`, `includes`,
`uppercase`, `lowercase`), string formats (`emailHtml5` … `isoDuration`, rules
in `formats.bp`), numbers (`gt`, `lt`, `negative`, `negativeOrZero`,
`multipleOf`, `safeInt`, `float32`) and date bounds (`afterIso`, `beforeIso`) —
and the two of step 4: `literal` (a `string`, `i32` or `bool` field held to one
value; the argument's lexeme is read as the field's type) and `oneOf` (a text
field held to a closed set, the options comma-joined in one argument).

- **Field types.** Every marker names the types it checks; on any other it is a
  located compile error (`test/refusal_test.bp`: one row per marker, and the
  count is `markerNames()`'s). The length markers read `string` (code points),
  `Array<T>`, `Dict<K, V>` and `Set<T>` (items); `gt` / `lt` / `negative*` /
  `multipleOf` one predicate per width (`I32`, `I64`, `F64`).
- **Optional fields.** A marker other than `#[notNull]` on `?string`, `?i32`,
  `?i64` or `?f64` checks the value when it is present and nothing when it is
  null (`if (v.f != null) …`); on any other optional type it is refused.
- **Numeric bounds.** The bound of `gt` / `lt` / `multipleOf` is the field's
  type — `fn gt<T>(comptime decl: @Decl<T>, comptime value: @Expr<T>)` (decision 280
  (2)): the checker refuses at the argument a fraction on an integer field and
  a whole literal on an `f64` field (`#[gt(5)]` is written `#[gt(5.0)]`,
  decision 247); the message shows the bound as written (a whole `f64`
  renders `2.0` on erlang and `2` on node). `minValue` / `maxValue` on `f64`
  take an integer bound widened.
- **Messages.** A parameter is never named `value` (the field's value is
  `{value}` in every template): `gt` / `lt` say `{bound}`, `multipleOf`
  `{step}`.
- **Arguments.** Text arguments may not be empty nor carry `;`, `|` or `"`
  (the table's separators, the lexeme's delimiter); a bound that could never
  fail is refused (`#[minLength(0)]`, `#[multipleOf(0)]`); `afterIso` /
  `beforeIso` take RFC 3339 text with its zone; `#[isoDatetimePrecision]` needs
  one of `isoDatetime`, `isoDatetimeOffset`, `isoDatetimeLocal` beside it,
  which say the zones it takes.
- **Every marker parameter is `comptime x: @Expr<T>`**, as decisions 280 (0) and 364 write it: a
  body reads the argument with `x.value` (known at build), and a marker that never reads a
  parameter accepts any expression of its type there.

## The parse half of `#[validated]` — a document in, a record out

The type is the only schema (decisions 306, 327): `#[validated]` gives the type,
beside `validate()` and `constraints()`, the members that read and write it —
there is no schema value, no `Schema<T>`, no `#[schema]`:

```bp
Player.parse(input: Json) -> @Result<Player, ValidationReport>
Player.parseAt(input: Json, at: string) -> @Result<Player, ValidationReport>   // under the path `at`
Player.decode(text: string) -> @Result<Player, ValidationReport>               // JSON text
Player.bind(pairs: Array<#(string, string)>) -> @Result<Player, ValidationReport>   // form pairs
Player.encode(p: Player) -> @Result<Json, ValidationReport>
Player.jsonSchema() -> string                                                  // draft 2020-12
Fish.options() -> Array<string>                                                // an enum's variants
```

and three a type calls on another — `__json`, `__schemaNode`, `__schemaDefs` —
named with `__` because no application calls them. A field of another
`#[validated]` type is read by `ThatType.parseAt`, written by `ThatType.__json`,
described by `ThatType.__schemaNode`: members travel with the type (decision
216), so the decorator never needs a second declaration. The private machinery
the members call is the module `derived` (`derived.bp`), which the application
imports only because the emitted members name it.

`#[validated(transparent)]` (with `decorators.transparent` imported) on a type
of one field writes and reads the type as that field — `Email(#[email] value:
string)` is the text `"a@b.c"`, its violations at the field's own path, its
JSON Schema the field's; on a type of any other number of fields it is refused.

- **Fields it decodes:** `string`, `i32`, `i64`, `f64`, `bool`, `Json`, `?T`,
  `Array<T>` / `T[]`, `Set<T>` (a list; a repeated item is `duplicate` at its
  own index), `Dict<K, V>` (an object; `K` is `string`, `i32` — the key text
  read by the integer grammar — or a `#[validated]` enum), a tuple `#(A, B, …)` (a
  list of exactly that length, each item at `at[i]`; a labelled tuple is
  refused), a union `A | B` (the arms in the type's order, the first that
  accepts; none → one `invalidUnion` whose `{arms}` names each arm's first
  violation; absent is `required` unless an arm is `?T` or `Json`), in any
  nesting, and another `#[validated]` record or enum — the type itself
  included — reached by `ThatType.parseAt`. Any other field type is a located
  compile error naming the field and the type.
- **Enums.** `#[validated]` on a payload-less enum decodes the variant's NAME
  (`"Tuna"` → `Fish.Tuna`); absent is `required`, another kind `invalidType`,
  another text `invalidValue` with `{options}`. `Fish.options()` answers the
  variants in declaration order —
  what `#[exhaustive]` on a `Dict<Key, V>` field reads (every variant a key, else
  `required` at `field.<Variant>`). With `#[tag("status")]` the enum is an
  object whose member `status` names the variant and whose other members are
  the payload: a `#[validated]` record named `<Enum><Variant>` (`ReplySuccess`),
  held as the variant's one field `value` (`Success(value: ReplySuccess)`).
  Not the variant's own name — a variant's constructor is a name of its module,
  so a record `Success` beside `Reply.Success` is constructed as the variant.
  `Decl.variants` carries names only (`language-gaps.md`), so a payload a
  variant does not have, or a missing payload record, fails where the emitted
  code names it rather than at the annotation.
- **Every violation, at its path.** Each field is decoded, every violation is
  collected, and the record is constructed only when there are none.
  `Violation.field` is a path (`path.bp`): `ship.zip`, `lines[1].sku`, `` for
  the document itself. A flat record's path is its field's name.
- **Members are read with std's `Json` methods**: the emitted decoder reads
  `input.field("name") ?? Json.Null`; `derived.bp` walks `input.items()` and
  `input.members()` and keeps no reader of its own.
- **Absent is one value.** A missing key and `null` decode the same: `null` for
  a `?T`, `required` for a `T`.
- **Numbers.** A JSON number is an `f64`. An `i32` field takes a whole number in
  range (`7.0` is whole, `1.5` and `2147483648` are `invalidType`); an `i64`
  field takes a whole number within ±(2^53 − 1).
- **An undeclared key is refused** (`unrecognizedKey`; decision 144), at its own path, after the declared fields.
- **Object policy** (front 125 step 5), each read by `#[validated]` and placed by
  its own marker: `#[stripUnknown]` on the type drops the undeclared members; a
  `#[rest]` field — one, typed `Dict<string, T>` — holds them, each decoded as
  `T` at its own key; `#[present]` on a `?T` field takes an absent key as
  `null` and refuses a key holding `null` (`invalidType`); `#[orElse(literal)]`
  / `#[orElseOf(f)]` give an absent key its default; `#[fallback(literal)]` /
  `#[fallbackOf(f)]` replace a value that does not decode or fails its
  checks, with no violation (the record is built, validated, rebuilt with the
  fallback of every such field, and validated again). A literal is a value of
  the field's type — `string`, `i32`, `i64` (emitted as `derived.widened(n.0)`),
  `f64`, `bool`, an enum's variant by reference (`#[orElse(.Tuna)]` on a `Fish`
  field, emitted `Fish.Tuna` — decision 281, step 11), or their `?T` — or the
  marker is refused at the field; `#[orElseOf(f)]` / `#[fallbackOf(f)]` take the
  function itself. The markers declare 280's shape (`orElse<T>(decl: @Decl<T>,
  value: T)`); until decorator arguments are typed (`01-checker` step 24) a
  variant the enum does not have fails where the emitted code names it. Refused: `#[present]` on a field that is not `?T`, `#[rest]` on one that
  is not `Dict<string, T>` or twice, `#[rest]` beside `#[stripUnknown]`, a
  default beside `#[rest]` / `#[present]`.
- **Coercion, transforms, the form binder** (step 6). `#[coerce]` on a
  `string`, `i32`, `i64`, `f64` or `bool` field (or its `?T`) reads text by the
  type (`derived.coerced`, decision 183): a number by std's numeral grammar, a
  `bool` by the stringbool set (`"false"` is `false`), a `string` from a number
  or a boolean; text the type does not read stays text and is `invalidType`,
  never a zero; `""` is absent. `#[coerce] #[isoDatetime]` (or
  `#[isoDatetimeOffset]`) on an `i64` reads an RFC 3339 instant as epoch
  milliseconds — no check is emitted for that marker, the decoder has read
  it. `#[stringbool]` on a `bool` takes only text of the set
  (`true 1 yes on y enabled` / `false 0 no off n disabled`, case-insensitive).
  The transforms `#[trim]`, `#[lowercased]`, `#[uppercased]`,
  `#[normalized("NFC")]`, `#[normalizedUrl]` rewrite a text field in the order
  written, after a default and before the checks. `T.bind(pairs)` reads form
  pairs (`querystring.parse`, `encoding.formParse`) through
  `derived.formDocument` into the document `T.parseAt` reads: every
  field by its type as `#[coerce]` would, a repeated name as an array's items
  (none is `[]`), a `bool` with no value `false`, a name the type does not
  declare the unknown-key rule.
- **Encoding and value markers** (step 8). `T.__json(v)` writes a value
  as the document its decoder reads (a member holding `null` left out, a
  `#[rest]` field's members merged in, an enum as its variant's name, a tagged
  enum as its payload with the tag first); `T.encode(v)` runs the type's
  own `validate()` first and is an `Error` for a value it refuses — the checks
  of a nested record are its own decoder's, not re-run by the outer encode.
  `#[preprocess(f)]` (`f: fn(input: Json) -> Json`) rewrites the field's raw
  value before it is decoded; `#[check(rule)]` on a field (`rule: fn(v: T) ->
  bool`) is a `custom` violation when the rule answers `false`; `#[each("m")]`
  applies one marker — a parameterless check, or a transform on an
  `Array<string>` — to every item of an `Array<T>` / `Set<T>`, each violation at
  `field[i]`. A decorator argument is not typed yet (`01-checker` step 24), so
  a function that is missing or of another signature fails where the emitted
  code calls it, not at the argument; `#[map]`, `#[tryMap]`, `#[codec]` and the
  type-level `#[check(rule, at: .field, …)]` wait on it (the input type of `f`,
  a labelled argument), and `#[check]` on a type is refused saying so.
  `#[orElseOf(f)]` / `#[fallbackOf(f)]` take the function itself (decision 281).
  `codecs.bp` holds Zod's recipes as decode / encode pairs, each an inverse on
  its domain (`test/codecs_test.bp`); `millisToIso` writes UTC with milliseconds
  itself, because std's `clock.formatIso8601` answers local time without them
  on erlang.
- **JSON Schema** (step 9, draft 2020-12). `T.jsonSchema()` is the
  document: `$schema` first (and `$id`, the `#[schemaId("…")]`), the type's
  node, `$defs` with every other `#[validated]` type it reaches
  (`ThatType.__schemaDefs`, so mutual recursion
  is finite), a reference to the document's own type `{"$ref": "#"}`. A marker
  becomes its keyword as ZOD_DOCUMENTATION.md § 8.3 maps it (formats,
  `contentEncoding`, the regex formats' `pattern`, bounds as
  `minLength`/`minItems`/`minProperties`, `minimum`, `exclusiveMinimum`, …,
  `#[literal]` as `const`, `#[oneOf]` as `enum`); a `?T` takes `null` into a
  bare `type`, else `anyOf` with `{"type": "null"}`; `#[present]`, `#[orElse]`
  (which also writes `default`) and `?T` fields are not `required`;
  `additionalProperties` is `false` unless `#[stripUnknown]` (absent) or a
  `#[rest]` field (its value's node). A marker with no keyword (a walk-checked
  format, a registered constraint, a date bound, `#[check]`, `#[preprocess]`)
  makes the field `{}`; under `#[jsonSchema]` on the type it is a compile error
  naming the field and the marker. `#[title]`, `#[describe]`, `#[example]`,
  `#[deprecated]` on a type or a field are its annotations.
  `spi.registerSchema(id, { -> T.jsonSchema() })` and
  `spi.registeredJsonSchemas()` (§ 8.4: `{"schemas": {id: …}}`, each with its
  `id`, a `$ref` by id); `table.toDraft07`, `table.toOpenApi30` and
  `table.withRefBase` rewrite a document for another dialect. The emitted code
  builds the document as `Json` at run time and writes it with
  `derived.jsonText` (a number by its digits when whole, the same on both
  targets).
- **Error views** (step 9): `report.flatten()` (`Flat(formErrors,
  fieldErrors)`, keyed by the first path segment), `report.tree()`
  (`ReportTree(errors, properties, items)`), `report.pretty()` (`✖ message` /
  `  → at path`). An `unrecognizedKey` is said at the object that holds the key,
  as Zod reports `unrecognized_keys`.
- **The checks run on what was decoded.** `T.parseAt` builds the record, calls
  its `validate()` and re-roots the report under the record's path
  (`derived.under`); `T.encode` calls `validate()` before it writes.
- **Structural codes** (built-in templates in `messages.bp`): `invalidType`
  (`{expected}`, `{received}`), `required`, `unrecognizedKey` (`{key}`,
  `{type}`), `invalidJson` (`{reason}`), `invalidUnion` (`{arms}`),
  `invalidValue` (`{options}`), `duplicate`; `custom` is declared for the
  steps that follow.

What the application has in scope — the emitted members name the library
through ONE namespace, `derived`, and the types their signatures spell are
leaves (a type cannot be named through a namespace); a field typed `Dict` or
`Set` needs `collections.Dict` / `collections.Set` from std as well:

```bp
import {decorators.validated} from "validation";
import {derived, report.ValidationReport, report.Violation, table.constraintTableJson} from "validation";
import {json.Json} from "std";
```

Each part of a field's type below the field's own level (`Array<Array<i32>>`,
`?Array<string>`, a `Dict`'s key and value, a field of another `#[validated]`
type) gets one emitted function, `__decode<Record>_<field>_<place>` (`0` the
field, `0_1` its second part, …), because neither a library decoder nor a
type's member can be passed as a value from emitted code (see *Language
notes*); a tuple and a union get one for themselves, their straight-line
decoder. `decode` hands `derived.decodeText` the emitted `__parseAt<Type>`.

The checks emit bare predicate names (`vNotBlank(…)`), so a type with markers
imports the predicates too. Decision 145 moves them to the namespaced form;
that change edits rakun's import lines and lands with them.

## Consuming it

`#[validated]` reads each field's type from `f.typeName`, the type as the source
spells it: a list is `Array<…>` or `…[]`, a nullable field `?…`. Its members —
`validate(self) -> ValidationReport` (`req.validate()`), `constraints() ->
string` (`T.constraints()`) and the parse half above — are declared at the
application site (`decl.addMember`, decision 216), so the application imports
the names the members reference (decision 107 — the leaf is bound):

```bp
import {decorators.validated, decorators.notBlank, decorators.sizeBetween} from "validation";
import {derived, report.ValidationReport, report.Violation} from "validation";
import {constraints.vNotBlank, constraints.vSizeBetween, table.constraintTableJson} from "validation";
import {json.Json} from "std";
```

Measured before bundling with a scratch consumer declaring the library as a
`{ "path": … }` dependency: green on erlang and commonJS. Import `validated`
from here, never rakun's placement-only `#[validated]`, and never both.

## Testing

```sh
../botopink-lang/zig-out/bin/botopink test --target erlang
../botopink-lang/zig-out/bin/botopink test --target commonJS
../botopink-lang/zig-out/bin/botopink format --check src test
```

`*_example_test.bp` are the front's `examples/` files as suite cases, byte for
byte but for the import lines (a module of this package cannot name it
`from "validation"` — the namespace is unbound in emitted code). A refusal is a
case of `refusal_test.bp`: it writes a one-file project under
`BOTOPINK_TEST_TMPDIR`, runs `botopink check` on it (`BOTOPINK_BIN`, else the
meta checkout's `repository/botopink-lang/zig-out/bin/botopink`, else a
`botopink-lang/repository/validation` CI layout's `botopink-lang/zig-out/bin/botopink`)
and asserts status, message and location. The fixture's `botopink.json` declares
`validation` by `path` — this package's directory — as any consumer must (decision 242).

**The meta-schema check** (decision 399). `test/tools/` vendors Ajv's standalone
2020-12 build — `ajv2020.min.js`, Ajv 8.17.1 (MIT; `ajv-dist@8.17.1`, published
2024-07-12, tarball `dist/ajv2020.min.js`), sha256
`d2f97a24636c44135e1ffffeea29656c06a1c1f71b315e958c88d0e8126c2100`, its licence in
`ajv.LICENSE` — and `check-schema.js`, the entry that validates one document
(its argument) against the 2020-12 meta-schema (`validateSchema`, formats
unchecked) and prints `ok` or one line per error. `test/json_schema_test.bp`
runs it through `io.process.run("node", …)` for every document the suite
emits (`metaChecked(doc) == "ok"`, which `schema_test.bp` uses too); the erlang
row skips the check (commonJS only, like the `hostTarget()` branch that says
so) and keeps the sixteen literals against ZOD_DOCUMENTATION.md § 8 on both
targets. No network and nothing installed at test time. The validator is a test
tool only: never in `src/`, never in `botopink.json`'s `files`, never imported by
the library or a consumer. Updating it means replacing the file, this version and
this hash together.

Tests import the package's modules by their path inside the braces
(`import {report.Violation};`, decision 206), as any package's tests do. Every test that depends on message templates sets its
own source first (`setMessageSource(builtInOnly())` or a table source) — the
source is global host state and outlives a test. Every expected text is a
literal.

## Language notes (measured)

Re-measured on 2026-10-01 against this checkout's compiler, on erlang and
commonJS. What holds is a case of `test/platform_test.bp`; what is refused or
miscompiled cannot be a green test and is listed here with the form this
library writes instead.

**Holds on both targets** (`platform_test.bp`):

- A generic record carries a function field and a generic method; a record
  field of fn type is called through a local (`val f = self.run; f(x)`).
- A union is a generic argument (`Holder<i32 | string>`) and `x is T` tells its
  arms apart at run time.
- A decorator body calls a bodied function of its own module, recursion
  included, and a decorator parameter's default is applied (`#[maker]` for
  `maker(decl, suffix: string = "X")`) — a run-time parameter; a comptime one
  takes no default (below). The per-marker rules of `#[validated]` are written
  out inline for historical reasons, not because they must be.
- Emitted code names a module through its namespace (`constraints.vNotBlank(…)`).
- `json.decode` keeps member order, refuses a duplicate member and refuses
  `NaN`; a JSON number is an `f64`.
- An `f32` is written `1.5f` (a bare `1.5` is an `f64` and does not fit one)
  and is held as a double on both targets: `0.1f` reads back `0.1`, so the
  single-precision range is a marker's check, not a rounding.
- `std/url.parse` answers every input and normalizes nothing: it keeps the
  case WHATWG lowers, keeps a default port, reads `mailto:a@b.c` as one
  scheme, splits `[::1]:8080` at its first colon (host `[`) and answers
  `not a url`, `http://`, `http://a b.com/`, `http://a.com:abc/` where WHATWG
  refuses. A URL check splits the authority and checks scheme, host and port
  itself.

**Refused or miscompiled — and what is written instead:**

- `Ok(v)` / `Error(e)` are patterns, not constructors (`unbound variable 'Ok'`).
  A `@Result` comes out of a function through `return` and `throw`, so every
  decoder is a named function and a lambda only calls one.
- A `throw` inside a `case` arm does not become the function's `Error` — an
  uncaught throw on node, `nocatch` on erlang. Test first, `throw` from a
  top-level `if`.
- `val assert Ok(v) = r;` inside an `if` inside a `while` leaves `v` undefined
  on commonJS. Use a `case` as an expression:
  `out = case r { Ok(v) -> out.append([v]); Error(_) -> out; };`.
- An enum variant's constructor is a name of its module: a record `Success`
  declared beside `type Reply { Success(value: …) }` is constructed as the
  variant (`` `Success` has no parameter named `data` ``). A tagged enum's
  payload record is named `<Enum><Variant>` (`ReplySuccess`).
- A function named like a primitive type (`pub fn string()`) shadows the type
  in every annotation of its module; the mismatch is reported far from the
  cause ("expected string, got function").
- A type cannot be named through a namespace (`report.ValidationReport` in an
  annotation is "unknown type"); the emitted signatures need the type imported
  as a leaf.
- A namespace member is resolved where it is called, not where it is passed:
  `derived.optionalOf(x, at, derived.decodeString)` is "unbound variable
  'derived'".
- In a module of THIS package — the tests — a namespace bound by the bare
  `import {derived};` is not resolved inside a lambda of emitted code
  (`derived is not defined` on node, `decodeString/3 undefined` on erlang). A
  consumer's `from "validation"` namespace is. The emitted code uses named
  functions instead of lambdas, which works in both.
- A type's static member is not a value on erlang (`Address.parseAt` as an
  argument is "variable 'Address' is unbound"); the emitted function that calls
  it is passed instead.
- A record spread inside a member a decorator adds (`T(..v, f: x)`) is emitted
  `new T(v, x)` on commonJS; the fallback rebuild names every field.
- A comptime decorator parameter takes no default, and a run-time one whose
  default is an enum value names "a binding the decorator body cannot read":
  `#[validated]`'s `form` is a run-time `?Form = null`, the lexeme read from
  `decl.annotations`.
- `Decorator` (decision 268) is an unknown type in a package's module, and a
  decorator's name is assignable to no other parameter type: `#[each("email")]`
  names its marker as text.
- A decorator body whose lambda holds many locals overflows the comptime stack
  (`wasm3: [trap] stack overflow`): the per-field work of the parse half is in
  helpers (`fieldNode`) taking plain data.
- Under `botopink test --target erlang`, two test modules declaring a type of
  one name share its module (a member of one is reached from the other):
  `schema_test.bp`'s types are named apart from the examples'.
- std's `clock.formatIso8601` answers local time without milliseconds on erlang
  and UTC with them on node; `codecs.millisToIso` writes the text itself.
- A method called on a lambda parameter whose type arrives through a generic
  (`box.map({ s -> s.length() })`) is emitted verbatim on commonJS
  (`s.length is not a function`). Pass a named function.
- **A string's `length()` is not one number**: `"😀".length()` is 2 on commonJS
  (UTF-16 units) and 1 on erlang (code points); `indexOf` counts bytes on
  erlang. `vSizeBetween` inherits it for text outside the BMP. The portable
  count is `unicode.codepoints(s).length`, which the length markers of the next
  step are written against.
- There is no `f64` → integer conversion in `std/math` (hence `derived.bp`'s
  conversion cells).
- A helper cannot take a `@Decl` (the call lowers to a run-time module that
  does not exist): every marker body calls `decl.fail` itself. Inside a
  decorator body an optional has no `unwrapOr` (`xs.slice(0, 1).join("")`
  instead), and a top-level `val` is not readable from a function a decorator
  calls (`formats.bp`'s character sets are functions).
- An `i64` beyond ±(2^53 − 1) cannot be built on commonJS (the arithmetic is
  refused as an overflow), so `#[safeInt]`'s refusal is reached on erlang only.
- An integer literal does not widen to `i64` in arithmetic; `wholeI64`
  (`derived.bp`) is the host cell that produces one. `bindEpochMillis` reads its
  `i64` with std's `String.parseInt` over the trimmed text (front 97), so a
  numeral past the `i64` range is a `typeMismatch` on every target (decision 319).

## Local gate

`scripts/git-hooks/pre-commit` is the tracked pre-commit gate, self-contained:
it sources `scripts/git-hooks/lib/runner-standalone.sh` from this repository and
reaches nothing outside it, so a standalone clone, a checkout inside the botopink
meta workspace and a worktree run the same gate. Install it once per clone:

```sh
git config core.hooksPath scripts/git-hooks
```

The repository is one plain package, so the gate's test stage runs
`botopink test --target <t>` at the root on each target `botopink.json` declares
(`erlang`, `commonJS`). Never commit with `--no-verify`; fix the red instead.
`scripts/git-hooks/pre-commit` and `scripts/git-hooks/lib/runner-standalone.sh`
are one text across every library repository: the meta repository's
`hook-integrity` workflow compares the bytes (its check 4), so a change to either
lands in all of them together. CI: `.github/workflows/test.yml` runs the same
package on linux and macos, on each declared target, with the compiler built from
`botopink/botopink-lang` `feat`.
