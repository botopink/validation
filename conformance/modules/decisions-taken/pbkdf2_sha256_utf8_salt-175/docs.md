# Decision 175 — † `hash.pbkdf2Sha256(password, salt, iterations, length)` derives over the salt's UTF-8 bytes, the same on node and erla

The program checks a credential with `#[validated]` and only then derives a key from it with std's `hash.pbkdf2Sha256(password, salt, iterations, length)`. The derivation reads the salt as the UTF-8 bytes of its text, the same on erlang and commonJS, so the published vector `("password", "salt", 1, 32)` prints `Eg-2z_z4syxD5yJSVsT4N6hlSMkszDVICAWYfLcL4Xs` on both, and a password and a salt with non-ASCII letters print one key on both, `Mvi5HsXot2Jhf3l0Vdp0JxVOJUI5pGV3K8wvd66JkQs`. A salt that is itself base64 is derived over its characters, not over the bytes it would encode. The third credential never reaches the derivation: it prints `password:minLength,salt:notBlank`.

Cells in this repository that prove it: none. The library calls no hash; the example is a consumer's, and 146 Conformance writes the library's cells.

[draft/main.bp](draft/main.bp)
