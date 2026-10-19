# Decision 404 — Two annotations never add one member name: a decorator adds and never merges or replaces (216); several annotations reach one member through typed meta.

`Account` carries three annotations that all bear on validation, and it ends up with one `validate`. Each `#[check]` adds no member: it records a `Check` value, the message, the rule and the field it reports at, as typed meta on the type. `#[validated]` is the one decorator that writes `validate`, and its body reads every recorded `Check` and runs its rule after the field markers, so `notBlank` on `handle` and both checks answer through the same member.

The program prints `0` and nothing else for the good account, `2 confirm,handle` for the account whose passwords differ and whose handle is taken (the checks in the order they are written), and `1 handle` for the blank handle.

What is refused is a second writer of one name. Had `Account` declared a `validate` of its own, or had another decorator also called `addMember("validate", …)`, the second is `decorator-member-duplicate` at the second annotation, whether the member is given as a function or as text: a decorator adds a member, it never merges into or replaces one.

Cells in this repository that prove it: none yet. The type-level `#[check]` is not built in the library; 146 s1 (125 step 7) brings it, and 146 Conformance its cells.

[draft/main.bp](draft/main.bp)
