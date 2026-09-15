window.Game = (function () {
  function uid() { return Math.random().toString(36).slice(2, 8); }
  function createPlayers(names) {
    var palette = ["#3DE0FF", "#FF3D9A", "#7CFF6B", "#FFB020", "#C084FC", "#FF6B6B"];
    return names.map(function (name, i) {
      return { id: uid(), name: (name || "Player " + (i + 1)).trim(), color: palette[i % palette.length], alive: true, fails: 0, lines: 0, fixes: 0 };
    });
  }
  function emptyChecks(mission) {
    return (mission.checks || []).map(function (c) { return { name: c.name, passed: false, message: "not run yet" }; });
  }
  function create(opts) {
    var mission = opts.mission;
    return {
      language: "JavaScript", mission: mission, players: createPlayers(opts.names),
      turnIndex: 0, lines: [], lastGood: [], pending: null, phase: "handoff",
      turnDeadline: Date.now() + opts.turnSeconds * 1000, turnSeconds: opts.turnSeconds,
      failsToOut: opts.failsToOut, draft: "", lastResult: null, checkResults: emptyChecks(mission),
      hintUsed: false, justEliminated: false, busy: false,
      log: [{ t: Date.now(), kind: "sys", text: "Repo opened." }, { t: Date.now(), kind: "sys", text: "Mission: " + mission.title }],
      startedAt: Date.now(), winnerNote: ""
    };
  }
  function alive(state) { return state.players.filter(function (p) { return p.alive; }); }
  function current(state) { var a = alive(state); return a.length ? a[state.turnIndex % a.length] : null; }
  function source(state) { return state.lines.map(function (l) { return l.text; }).join("\n"); }
  function pushLog(state, kind, text) { state.log.push({ t: Date.now(), kind: kind, text: text }); if (state.log.length > 80) state.log.shift(); }
  function nextTurn(state) {
    var a = alive(state);
    if (!a.length) { state.phase = "lose"; state.winnerNote = "Every stacker is out."; return; }
    state.pending = null; state.draft = "";
    if (a.length === 1) {
      state.turnIndex = 0; a[0].fails = 0; state.phase = "play";
      state.turnDeadline = Date.now() + state.turnSeconds * 1000;
      pushLog(state, "turn", a[0].name + " is last stacker standing.");
      return;
    }
    state.turnIndex = (state.turnIndex + 1) % a.length;
    var p = current(state); p.fails = 0; state.phase = "handoff";
    state.turnDeadline = Date.now() + state.turnSeconds * 1000;
    pushLog(state, "turn", p.name + " is up.");
  }
  function revertToGood(state) { state.lines = state.lastGood.map(function (l) { return { id: l.id, text: l.text, author: l.author, name: l.name, color: l.color, at: l.at }; }); state.pending = null; }
  function eliminate(state, player, reason) {
    player.alive = false; player.fails = 0; revertToGood(state); state.draft = ""; state.justEliminated = true;
    pushLog(state, "out", player.name + " is OUT — " + reason);
    var a = alive(state);
    if (!a.length) { state.phase = "lose"; state.winnerNote = "No repo."; return; }
    state.turnIndex = state.turnIndex % a.length;
    state.turnDeadline = Date.now() + state.turnSeconds * 1000;
    state.phase = a.length === 1 ? "play" : "handoff";
  }
  function submitLine(state, raw) {
    var player = current(state);
    if (!player || state.busy || state.phase === "win" || state.phase === "lose" || state.phase === "handoff") {
      return Promise.resolve({ ok: false, message: "Not accepting a line right now." });
    }
    var text = String(raw || "").replace(/[\r\n]+/g, "").replace(/\s+$/, "");
    if (!text.trim()) return Promise.resolve({ ok: false, message: "Empty line." });
    var pending = { id: uid(), text: text, author: player.id, name: player.name, color: player.color, at: Date.now() };
    var trial = state.lines.concat([pending]);
    var code = trial.map(function (l) { return l.text; }).join("\n");
    state.busy = true; state.pending = pending;
    return Engine.runScript(code).then(function (result) {
      state.busy = false; state.lastResult = result;
      if (!result.ok) {
        player.fails += 1; player.fixes += 1; state.phase = "fix"; state.draft = text;
        pushLog(state, "fail", player.name + " broke the stack: " + result.message);
        if (player.fails >= state.failsToOut) { eliminate(state, player, player.fails + " failed runs"); return { ok: false, eliminated: true, result: result }; }
        return { ok: false, result: result, message: "Fix that line. " + (state.failsToOut - player.fails) + " chance(s) left." };
      }
      state.lines = trial; state.lastGood = trial.slice(); state.pending = null; player.lines += 1; player.fails = 0; state.draft = "";
      pushLog(state, "ok", player.name + " stacked a clean line.");
      return Engine.runTests(code, state.mission.checks || []).then(function (tests) {
        if (tests.checks && tests.checks.length) state.checkResults = tests.checks;
        state.lastResult = result;
        if (tests.passed) {
          state.phase = "win";
          state.winnerNote = "Repo ships.";
          pushLog(state, "win", "All tests green.");
          return { ok: true, won: true, result: result };
        }
        nextTurn(state);
        return { ok: true, result: result };
      });
    });
  }
  function tick(state) {
    if (state.busy || state.phase === "win" || state.phase === "lose" || state.phase === "handoff") return state;
    if (state.turnDeadline - Date.now() <= 0) {
      var p = current(state);
      if (p) eliminate(state, p, "clock ran out");
    }
    return state;
  }
  function startTurn(state) {
    if (state.phase !== "handoff") return;
    state.phase = "play"; state.justEliminated = false;
    state.turnDeadline = Date.now() + state.turnSeconds * 1000;
  }
  function useHint(state) {
    if (state.hintUsed) return null;
    state.hintUsed = true;
    pushLog(state, "sys", "Hint burned: " + state.mission.hint);
    return state.mission.hint;
  }
  function exportRepo(state) {
    var code = source(state) || "// empty stack";
    var readme = "# " + state.mission.title + "\n\nShipped with Code Stacks.\n";
    return { file: state.mission.file, code: code + "\n", readme: readme, zip: null };
  }
  return { create: create, current: current, alive: alive, source: source, submitLine: submitLine, tick: tick, startTurn: startTurn, exportRepo: exportRepo, useHint: useHint };
})();
