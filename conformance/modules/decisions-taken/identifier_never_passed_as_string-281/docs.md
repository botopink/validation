# Decision 281 — No code identifier passes as a string.

Everything in `Signup`'s annotations that is code is named by the thing itself, and everything that is text belongs to another system. `#[refine(notReserved)]` and the type's `#[check(…, proNeedsCompany, at: .company)]` pass the functions as values and the field as `.company`, a `compiler.Field<Signup>`; `#[orElse(.Free)]` names the variant of `Plan`. Each is checked where it is written, so a renamed function or field breaks the build at the annotation. What stays a string is what no botopink name stands for: the regex of `#[pattern]`, the URL `#[schemaId]` gives the JSON Schema document, and the messages a user reads.

The first document decodes with the default plan and prints `ok ana_1`. The second chooses `Pro` with no company and prints `company: a pro plan needs a company`. The third, `admin`, matches the pattern but not the rule, and prints `handle: that handle is reserved`, the text `#[message]` gave it. The last line, `true`, is the schema document carrying its URL.

Writing the rule as `#[refine("notReserved")]`, or the field as `at: "company"`, is the form this rules out: a code identifier never passes as text.

Cells in this repository that prove it: none yet. `#[refine]` and the type-level `#[check]` come with 146 s1 (125 step 7), and 146 Conformance writes the cells.

[draft/main.bp](draft/main.bp)
