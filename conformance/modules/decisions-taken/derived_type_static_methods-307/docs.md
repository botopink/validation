# Decision 307 — A derived type is a compile-time function that answers a new type, bound by a `val`; the five are static methods of one std type, `Type`:

`Recipe` is declared once, and two more record types are derived from it by std's `Type`, imported with `import {types.Type} from "std";`. `Type.partial(Recipe)` answers a new type with every field made optional, bound by `pub val RecipePatch`; `Type.pick(Recipe, .title, .servings)` answers one with only the two fields named, as `compiler.Field<Recipe>` references, bound by `pub val RecipeCard`. Each is a compile-time call, so no `comptime` keyword is written, and each answer is a nominal record named after its `val`, annotated `#[validated]` like any type. The source fields' markers come along: `servings` keeps `#[minValue(1)]` in both, `title` keeps `#[notBlank]` in the card.

The program prints `ok` for a patch with one field; `servings:minValue` for a patch whose one field breaks its marker; `ok` and `title:notBlank` for two cards; `description:unrecognizedKey` for a card sent the field `pick` left out; and `Pão true` for a card built in code. validation's former `#[pick]`, `#[omit]`, `#[partial]`, `#[required]` and `#[extending]` markers are gone: the derived type is the language's, and the library validates it like any other.

Cells in this repository that prove it: none yet. The suite's derived-types example joins it with 146 s1 (125 step 5), and 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
