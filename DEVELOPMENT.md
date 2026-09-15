# CODE STACKS — Development manual

This is the in-depth guide for people who will change the game, add missions, or ship a new language later. Player-facing rules live in DOCS.md. This file is how the program is put together.

Repo: https://github.com/whirledclassic/code-stacks
Product name: CODE STACKS / Code Stacker
Language lock for this version: JavaScript only

## 1. Design contract

Do not break these without renaming the game:

1. Exactly one line of source per accepted turn.
2. After that line is appended, the entire file is executed.
3. If execution succeeds, the line is locked and the turn passes.
4. If execution fails, the same player stays and must fix that line.
5. Too many failed runs on the same turn, or the timer hitting zero, eliminates the player. The file rolls back to the last good stack.
6. The table wins when every mission spec test is green. That is a finished working repo.

Art, music, solo mode, and snippets are garnish on that contract.

## 2. Runtime shape

Static website. No server-side game logic.

```
browser
  index.html
    css/style.css, css/art.css, css/beauty.css
    js/compat.js      Win7 / old Chrome shims
    js/updater.js     local version vs GitHub version.json
    js/missions.js    data only
    js/engine.js      sandbox + tests
    js/audio.js       SFX
    js/music.js       looping bed
    js/fx.js          flash / shake
    js/game.js        rules / state machine
    js/ui.js          DOM + input
```

Serve over HTTP. On Windows 7: `python -m http.server 8765` or play.bat.

## 3. State machine (js/game.js)

Game.create(opts) returns the match.

opts.names — player names (use ["You"] for solo)
opts.mission — one object from MISSIONS
opts.turnSeconds — clock length
opts.failsToOut — strikes

state.phase: handoff | play | fix | win | lose
state.lines — locked lines { text, author, name, color }
state.lastGood — snapshot used on rollback
state.pending — line being tried or fixed
state.players[] — { id, name, color, alive, fails, lines }
state.turnIndex — index into ALIVE players
state.turnDeadline — epoch ms
state.checkResults — last spec list
state.log — human feed

Phases:
- handoff — between people. Timer does not eliminate. Game.startTurn -> play.
- play — accept a new line.
- fix — last line broke the file. Same player, same draft.
- win / lose — terminal.

Solo (alive.length === 1): UI skips handoff and calls startTurn. After a clean line nextTurn keeps phase play and refreshes the timer.

Game.submitLine(state, raw) pipeline:
1. Reject if phase is not play/fix or busy.
2. Strip CR/LF. Empty line does not burn a fail. Cap 320 chars.
3. trial = lines + pending.
4. Engine.runScript(joined source).
5. Fail -> player.fails++, phase fix. If fails >= failsToOut, eliminate + rollback.
6. Success -> commit lines, copy lastGood, reset fails, Engine.runTests.
7. All tests pass -> phase win.
8. Else nextTurn.

Game.tick: if play/fix and now > turnDeadline, eliminate for clock.
Game.nextTarget: first failing check name (UI cue).

## 4. Engine (js/engine.js)

User code is invoked as:

```
new Function("console", "exports", "\"use strict\";\n" + code)
```

Every stack sees a fake console (console.logs captures log text) and an exports object.

Tests append to the same function body:

```
new Function("console", "exports", code + "\n" + check.code)
```

That is why function greet(name) is visible to greet("Ada") in a check.

Result shape:
- ok: file ran (syntax + runtime)
- passed: every check passed (test runs only)
- type: run | tests | syntax | runtime | timeout
- message, logs[], checks[{ name, passed, message }]

A clean stack only needs ok === true. Spec green needs passed === true and at least one check.

Timeout: LIMITS.timeoutMs (1200) on the worker path. If Worker/Blob fails, runLocal on the main thread so the game still plays.

Do not grant fetch, document, or extra eval. Do not persist exports across separate runs — persistence is the source file. Do not auto-fix player code.

## 5. Missions (js/missions.js)

Missions are data. Required fields: id, title, file, difficulty, blurb, spec[], hint, checks[].

Each check: { name, code }. Throw to fail. No throw to pass.

Writing checks:
- Test typeof before calling a function.
- Keep name short; UI shows it as the next target.
- Order checks in the order a table would stack them.

Project missions should hang API on exports so each turn can add one export. Do not require two new symbols in the first check if you want incremental shipping.

Add-mission checklist:
1. Append to window.MISSIONS.
2. Prove the happy path with Engine.runLocal.
3. Prove a broken path throws a readable Error.
4. Bump version.json.
5. Mention it in DOCS.md.

A syntax error in checks[].code is a developer bug.

## 6. UI

UI owns no rules. It builds the lobby, calls Game.create, paints, and sends submitLine / startTurn / tick.

Required element ids include: splash, game, handoff, end, how, toast, new-name, add-player, missions, turn-sec, fails-out, btn-start, btn-solo, btn-begin, btn-stack, btn-hint, btn-quit, btn-mute, line-input, source-view, stack-list, spec, checks, players, console, timer, who-name, phase-tag, end-title, end-body.

Add the id in index.html before you read it in ui.js.

## 7. Audio

SFX.unlock() must run from a user gesture. Music.start() is called from unlock. Mute calls Music.setMuted. Music is oscillators, not an mp3. wav files in assets/sfx are optional; beep fallback always exists.

## 8. Compatibility

js/compat.js covers padStart, Object.entries, Array.find, XHR fetch stand-in.
When editing: no optional chaining, no ??, prefer classic functions in the slim GitHub copies. Document python and py -3, not only python3.

## 9. Versioning

version.json is what the in-game updater fetches from GitHub raw. Browsers cannot overwrite disk; update.bat runs git pull or a zip extract.
Ship list: bump version.json, bump CS_VERSION if updater.js is in play, note the change in DOCS.md or this file.

## 10. Work order for new features

1. Can it be a new mission? Do that first.
2. Does the engine need a new injected global? Only if exports + console cannot express it.
3. UI last.

A second language is a new engine + mission pack, not a flag on this sandbox.

## 11. Local verification

First Blood happy path:
Engine.runLocal({ mode: "tests", code: "console.log(\"CODE STACKS\");", checks: firstBloodChecks }).passed === true

Toolbox is three stacked lines on exports.clamp, exports.pad, exports.once. All six checks should pass when concatenated.

## 12. File ownership

New mission — js/missions.js + DOCS.md
Turn / fail / win — js/game.js
How code runs — js/engine.js
Buttons / paint — js/ui.js, index.html
Look — css/
Music / mute — js/music.js, js/audio.js
Win7 shims — js/compat.js
Player manual — DOCS.md
This document — DEVELOPMENT.md
