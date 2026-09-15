# Languages

This build: **JavaScript only**.

`Engine.languages()` returns runners. `Engine.hasLanguage(id)` is true for `javascript` / `js`.
Any other id fails with a clear engine error instead of pretending to run.

## Ready to add another language?

Not in the browser copy, not yet.

A second language needs:
1. A runner that can execute one file with a timeout (WASM interpreter or a local server).
2. A way to inject `console` + `exports` equivalents.
3. Mission checks written in that language or a shared JSON test format.
4. Win7-safe delivery (no huge toolchain).

Until that runner exists, extra languages would be labels on a JS sandbox. That is not a language.

Next honest step after JS missions feel deep enough: pick ONE of Python (Pyodide, heavy) or a tiny custom lang. Do not add a dropdown first.
