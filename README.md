# CODE STACKS
### Code Stacker — v1.4

Turn-based programming game. One line of JavaScript per turn. The file must still run. Then the next person stacks. Keep going until the mission is a working project.

**GitHub:** https://github.com/whirledclassic/code-stacks

## Play

```bash
git clone https://github.com/whirledclassic/code-stacks.git
cd code-stacks
python3 -m http.server 8765
```

Open `http://localhost:8765`.

1. Add names (1–6). Solo works.
2. Pick a mission. Start with Greeter or First Blood.
3. On the handoff screen the current player confirms, types **one line**, hits Enter.
4. The whole stack is executed.
   - Runs clean → line locks, spec tests update, next player.
   - Errors → same player stays and fixes that line.
   - 3 failed runs or the timer hits zero → out, stack rolls back.
5. When every spec test is green, download the shipped repo zip.

Art and wav files live in `assets/`. If you cloned before those were uploaded, copy them from the local game folder.

## Language

JavaScript only in this version.

## Audio

Interface SFX by Kenney (www.kenney.nl), CC0.
See `assets/sfx/CREDITS.txt`.

## Windows 7

Use Chrome 109 or Firefox 115 ESR. Internet Explorer is not supported.
