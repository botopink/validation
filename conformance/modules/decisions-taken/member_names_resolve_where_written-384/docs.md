# Decision 384 — A member a library's decorator writes resolves each name where it was written: the library's names in the decorator's module, the annotation's arguments in the annotated module — 112's hygiene for members.

The program imports `validated`, `check` and `notBlank` from `validation` and nothing else of the library, yet `Signup` gets a working `validate`. The member `#[validated]` writes names the library's `Violation`, its report type and its predicate `vNotBlank`; each of those resolves in `validation`'s module, where the decorator wrote it, and reaches this module under a name no source here can spell. The arguments of the annotations resolve here, where the annotation wrote them: the message text and `passwordsMatch`.

To make the point visible the module declares its own `Violation`, a record of another shape, and its own `vNotBlank`, a function of another signature. Neither is captured: the member's violations are the library's (the first line prints `handle:notBlank,confirm:custom`) and the local names keep their own meaning (the second prints `house-style 2 false`).

Cells in this repository that prove it: none yet. The library's members are still text rendered into the annotated module, so a consumer imports the names they reference (`conformance/docs.md` § Loading); 146 s1 (125 step 7) moves them to typed members, and 146 Conformance writes its cells.

[draft/main.bp](draft/main.bp)
