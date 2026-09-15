# CODE STACKS overview (v1.24.1)

Turn-based collaborative coding. One JavaScript line per turn. File must keep running. Spec tests ship the repo. Then vote export or destroy.

https://github.com/whirledclassic/code-stacks

## Real

- Engine: JS sandbox (`console`, `exports`, `stack`)
- Match: handoff / play / fix / vote
- Missions: First Blood, Greeter, Adder, Toolbox, Ledger
- Client: client.html + PLAY.bat / SETUP.bat / optional CodeStacks.exe launcher
- Languages: JavaScript only. registerLanguage exists; no second runner

## Not real

- Networked multiplayer server
- Python in the sandbox
- Embedded Chromium exe engine
- Internet Explorer

## Rules

1. One line per accepted turn
2. Whole file runs
3. Fail = same player FIX
4. Too many fails or timeout = out + rollback
5. All tests green = vote export or destroy

## Play

    SETUP.bat

or PLAY.bat. Chrome 109 on Win7. Not IE.

Prove-it: Practice solo, First Blood, console.log("CODE STACKS"); then vote.

See README.md, DOCS.md, DEVELOPMENT.md, LANG.md, COMPAT.md, INSTALL.md, GET.md, CLIENT.md.
