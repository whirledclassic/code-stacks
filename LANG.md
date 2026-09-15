# How to add a language

Working now: JavaScript (engine.js) and Tiny (js/tiny.js, mission Tiny Blood).

Game calls Engine.runScript(source, mission.language) then Engine.runTests(source, checks, language).

## Recipe

1. js/foo.js — Engine.registerLanguage("foo", { run: fn, test: fn })
2. Load it after js/engine.js in index.html
3. One mission with language: "foo", file, hint, checks as data (expectLog), not JS snippets
4. Practice solo that mission. If new Function runs the source, you added a label, not a language.

Tiny is the template: print TEXT, say TEXT, # comments, unknown command = FIX.

Do not add a language dropdown until run + test + one mission exist.
Do not put syntax in game.js.

See BACKEND.md for layers.
