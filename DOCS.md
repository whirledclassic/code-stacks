# CODE STACKS docs

## Rules
1. One line per turn.
2. Whole file is executed after that line.
3. Clean run locks the line and passes the turn.
4. Error keeps the same player on that line.
5. Three fails or timeout = out. Last good stack stays.
6. All spec tests green = shipped repo.

## Play
`python -m http.server 8765` then http://localhost:8765
Practice solo skips handoff. Music starts on first click. Mute stops music and SFX.

## Missions
- First Blood: console.log("CODE STACKS");
- Greeter: function greet(name)
- Adder: function add(a, b)
- Toolbox: exports.clamp, exports.pad, exports.once

## Engine
Sandbox gets `console` and `exports`. Checks append to the player file and throw to fail.

## Add a mission
Edit js/missions.js. Add id, title, spec[], hint, and checks[] with `code` that throws if the requirement is missing.
