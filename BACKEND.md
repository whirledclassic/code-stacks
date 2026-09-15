# Backend framework

missions.js (data)
  → game.js (turns, FIX, vote) — language-agnostic
    → engine.js (dispatch)
      → javascript | tiny.js | your adapter

game.js must not call new Function.

Phases: handoff | play | fix | vote | win | lose
Clock frozen on handoff, vote, win, lose.

JS checks use { code: "throw …" }.
New languages use data checks { expectLog, … }.

Add features: state → rule → UI → news.js + version.json → docs.
