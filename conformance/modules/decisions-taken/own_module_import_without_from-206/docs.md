# Decision 206 — `import {…} from "<name>"` resolves only to a package — std, a bundled package or a declared dependency.

The program imports from two packages and from one module of its own. `import {io.terminal.print} from "std"` and `import {report.ValidationReport} from "validation"` name a package after `from`: std, and `validation`, the dependency the program declares. `forms.bp` is a module of the program's own package, named by its path; it declares the `#[validated]` record `Signup`, and `main.bp` reaches it by that path in braces with no `from`: `import {forms.Signup};`. The members `#[validated]` gave `Signup` travel with it, so `main.bp` calls `Signup.decode` without importing the decorator.

The program prints `welcome ana@example.com` and `email:email,password:minLength`. Writing `import {Signup} from "forms"` would name a module of this package after `from` and is refused at the source string (`module-import-with-from`), its fix the brace form the example uses; and `from "validation"` keeps meaning the dependency even in a package that had a `validation` module of its own.

Cells in this repository that prove it: none yet; 146 Conformance writes the library's cells.

[draft/main.bp](draft/main.bp)
[draft/forms.bp](draft/forms.bp)
