# Adding a language to CODE STACKS

## Current state

The match is language-agnostic enough:

- `mission.language` is passed into `Engine.runScript` / `runTests`
- `Engine.registerLanguage(id, { run, test })` plugs a runner
- Unknown ids fail with a clear error

The **built-in runner is JavaScript only** (`new Function` + `console` / `exports` / `stack`).

A dropdown that says Python while still calling `new Function` would be a lie.

## Adapter contract

    Engine.registerLanguage("python", {
      run: function (code) {
        // execute the whole stacked file
        return { ok: true|false, type: "run"|"syntax"|"runtime"|"timeout", message: "", logs: [], exportsKeys: [] };
      },
      test: function (code, checks) {
        // checks[i] = { name, code }  -- today check.code is JS
        return { ok: true, passed: true|false, checks: [{ name, passed, message }], logs: [] };
      }
    });

Timeout: kill the run by 1200ms or the table can freeze.

## What else must change for a real second language

1. **Check format.** Today every mission check is a JS snippet appended to the file. Python needs either:
   - checks written in that language, or
   - a shared JSON assert format the adapter interprets.
2. **Globals map.** JS uses `console` / `exports` / `stack`. Python would use `print` capture + a module dict.
3. **Mission packs.** `file: main.py`, hints in that language, separate from JS First Blood.
4. **Host.** Browser needs a WASM interpreter (Pyodide is large) or a tiny local server the launcher already starts.
5. **Win7.** Any runtime must run on Chrome 109 / old Firefox or stay in the optional exe/python host — not IE.

## Recommended order

1. Keep shipping JS missions on `exports` (Toolbox / Ledger style).
2. Pick ONE next language.
3. Implement `run` + `test` + timeout.
4. Add one warmup mission in that language.
5. Only then show a language picker on the menu.

Do not add the picker first.
