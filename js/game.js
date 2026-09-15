window.Game = (function () {
  function uid() { return Math.random().toString(36).slice(2, 8); }
  function langOf(state) {
    return (state && state.mission && state.mission.language) || "javascript";
  }
  function createPlayers(names) {
    var palette = ["#3DE0FF", "#FF3D9A", "#7CFF6B", "#FFB020", "#C084FC", "#FF6B6B"];
    return names.map(function (name, i) {
      return { id: uid(), name: (name || "Player " + (i + 1)).trim(), color: palette[i % palette.length], alive: true, fails: 0, lines: 0, fixes: 0, streak: 0 };
    });
  }
  function emptyChecks(mission) {
    return (mission.checks || []).map(function (c) { return { name: c.name, passed: false, message: "not run yet" }; });
  }
  function create(opts) {
    opts = opts || {};
    var names = (opts.names && opts.names.length) ? opts.names : ["You"];
    var mission = opts.mission || (window.MISSIONS && MISSIONS[0]);
    return {
      language: langOf({ mission: mission }), mission: mission, players: createPlayers(names),
      turnIndex: 0, lines: [], lastGood: [], pending: null, phase: "handoff",
      turnDeadline: Date.now() + (opts.turnSeconds || 45) * 1000, turnSeconds: opts.turnSeconds || 45,
      failsToOut: opts.failsToOut || 3, draft: "", lastResult: null, checkResults: emptyChecks(mission),
      hintUsed: false, justEliminated: false, busy: false, combo: 0,
      vote: { export: 0, destroy: 0 },
      log: [{ t: Date.now(), kind: "sys", text: "Repo opened. Language: " + ((mission && mission.language) || "javascript") }],
      startedAt: Date.now(), winnerNote: ""
    };
  }
  function alive(state) { return state.players.filter(function (p) { return p.alive; }); }
  function current(state) { var a = alive(state); return a.length ? a[state.turnIndex % a.length] : null; }
  function source(state) { return state.lines.map(function (l) { return l.text; }).join("\n"); }
  function startTurn(state) {
    if (state.phase !== "handoff") return;
    state.phase = "play"; state.justEliminated = false;
    state.turnDeadline = Date.now() + state.turnSeconds * 1000;
  }
  function nextTurn(state) {
    var a = alive(state);
    if (!a.length) { state.phase = "lose"; state.winnerNote = "Every stacker is out."; return; }
    state.pending = null; state.draft = "";
    if (a.length === 1) {
      state.turnIndex = 0; a[0].fails = 0; state.phase = "play";
      state.turnDeadline = Date.now() + state.turnSeconds * 1000;
      return;
    }
    state.turnIndex = (state.turnIndex + 1) % a.length;
    current(state).fails = 0; state.phase = "handoff";
    state.turnDeadline = Date.now() + state.turnSeconds * 1000;
  }
  function revertToGood(state) {
    state.lines = state.lastGood.map(function (l) {
      return { id: l.id, text: l.text, author: l.author, name: l.name, color: l.color, at: l.at };
    });
    state.pending = null;
  }
  function eliminate(state, player, reason) {
    player.alive = false; player.fails = 0; player.streak = 0; revertToGood(state); state.draft = ""; state.combo = 0; state.justEliminated = true;
    var a = alive(state);
    if (!a.length) { state.phase = "lose"; state.winnerNote = "No repo."; return; }
    state.turnIndex = state.turnIndex % a.length;
    state.turnDeadline = Date.now() + state.turnSeconds * 1000;
    state.phase = a.length === 1 ? "play" : "handoff";
  }
  function castVote(state, choice) {
    if (state.phase !== "vote") return { done: false };
    choice = choice === "destroy" ? "destroy" : "export";
    state.vote = state.vote || { export: 0, destroy: 0 };
    state.vote[choice] += 1;
    var need = Math.max(1, alive(state).length);
    var total = state.vote.export + state.vote.destroy;
    if (total < need && need > 1) {
      return { done: false, export: state.vote.export, destroy: state.vote.destroy, need: need };
    }
    if (state.vote.destroy > state.vote.export) {
      state.lines = []; state.lastGood = []; state.phase = "lose";
      state.winnerNote = "The table voted to destroy the repo.";
      return { done: true, result: "destroy" };
    }
    state.phase = "win";
    state.winnerNote = "The table voted to export the repo.";
    return { done: true, result: "export" };
  }
  function submitLine(state, raw) {
    if (state.phase === "handoff" && alive(state).length === 1) startTurn(state);
    var player = current(state);
    if (!player || state.busy || state.phase === "win" || state.phase === "lose" || state.phase === "handoff" || state.phase === "vote") {
      return Promise.resolve({ ok: false, message: "Not accepting a line right now." });
    }
    var text = String(raw || "").replace(/[\r\n]+/g, "").replace(/\s+$/, "");
    if (!text.trim()) return Promise.resolve({ ok: false, message: "Empty line." });
    var pending = { id: uid(), text: text, author: player.id, name: player.name, color: player.color, at: Date.now() };
    var trial = state.lines.concat([pending]);
    var code = trial.map(function (l) { return l.text; }).join("\n");
    var lang = langOf(state);
    state.busy = true; state.pending = pending;
    return Engine.runScript(code, lang).then(function (result) {
      state.busy = false; state.lastResult = result;
      if (!result.ok) {
        player.fails += 1; player.fixes += 1; player.streak = 0; state.combo = 0; state.phase = "fix"; state.draft = text;
        if (player.fails >= state.failsToOut) { eliminate(state, player, player.fails + " failed runs"); return { ok: false, eliminated: true, result: result }; }
        return { ok: false, result: result, message: (result.message || "Broken.") + " Fix that line. " + (state.failsToOut - player.fails) + " chance(s) left." };
      }
      state.lines = trial; state.lastGood = trial.slice(); state.pending = null;
      player.lines += 1; player.fails = 0; player.streak = (player.streak || 0) + 1; state.combo = player.streak; state.draft = "";
      if (result.exportsKeys) state.exportKeys = result.exportsKeys;
      if (player.streak >= 3) state.turnDeadline += 4000;
      return Engine.runTests(code, state.mission.checks || [], lang).then(function (tests) {
        if (tests.checks && tests.checks.length) state.checkResults = tests.checks;
        if (tests.passed) {
          state.phase = "vote";
          state.vote = { export: 0, destroy: 0 };
          state.winnerNote = "Repo is green. Export it or destroy it.";
          if (window.Progress) Progress.recordShip(state);
          return { ok: true, won: true, result: result };
        }
        nextTurn(state);
        return { ok: true, result: result };
      });
    });
  }
  function tick(state) {
    if (state.busy || state.phase === "win" || state.phase === "lose" || state.phase === "handoff" || state.phase === "vote") return state;
    if (state.turnDeadline - Date.now() <= 0) {
      var p = current(state);
      if (p) eliminate(state, p, "clock ran out");
    }
    return state;
  }
  function useHint(state) {
    if (state.hintUsed) return null;
    state.hintUsed = true;
    return state.mission.hint;
  }
  function exportRepo(state) {
    var code = source(state) || "# empty stack\n";
    return { file: state.mission.file, code: code + "\n", readme: "# " + state.mission.title + "\n", zip: null };
  }
  return { create: create, current: current, alive: alive, source: source, submitLine: submitLine, tick: tick, startTurn: startTurn, exportRepo: exportRepo, useHint: useHint, castVote: castVote };
})();
