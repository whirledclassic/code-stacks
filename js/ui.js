(function () {
  var COLORS = ["#3DE0FF", "#FF3D9A", "#7CFF6B", "#FFB020", "#C084FC", "#FF6B6B"];
  var ui = { names: ["Ada", "Linus"], missionId: "first-blood", state: null, submitting: false, ended: false };
  function $(id) { return document.getElementById(id); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c];
    });
  }
  function toast(msg) {
    var el = $("toast"); if (!el) return;
    el.textContent = msg; el.classList.remove("hidden");
    clearTimeout(toast._t); toast._t = setTimeout(function () { el.classList.add("hidden"); }, 2600);
  }
  function renderChips() {
    var box = $("player-chips"); if (!box) return; box.innerHTML = "";
    ui.names.forEach(function (n, i) {
      var el = document.createElement("div"); el.className = "chip";
      el.innerHTML = "<b style=\"background:" + COLORS[i % COLORS.length] + "\"></b>" + escapeHtml(n) + "<button type=\"button\">x</button>";
      el.querySelector("button").onclick = function () {
        if (ui.names.length <= 1) return toast("Need at least 1 stacker.");
        ui.names.splice(i, 1); renderChips();
      };
      box.appendChild(el);
    });
  }
  function renderMissions() {
    var box = $("missions"); if (!box || !window.MISSIONS) return; box.innerHTML = "";
    MISSIONS.forEach(function (m) {
      var locked = window.Progress && !Progress.isUnlocked(m.id);
      var stars = window.Progress ? ((Progress.load().stars || {})[m.id] || 0) : 0;
      var b = document.createElement("button"); b.type = "button";
      b.className = "mission" + (m.id === ui.missionId ? " on" : "") + (locked ? " locked" : "");
      b.innerHTML = "<strong>" + escapeHtml(m.title) + "</strong> <em>" + escapeHtml(m.difficulty) + (stars ? " · " + stars + "*" : "") + "</em><span>" + (locked ? "Ship the previous mission to unlock." : escapeHtml(m.blurb)) + "</span>";
      b.onclick = function () {
        if (locked) return toast("Ship the previous mission first.");
        ui.missionId = m.id; renderMissions(); SFX.select();
      };
      box.appendChild(b);
    });
  }
  function startGame() {
    ui.ended = false;
    if (!ui.names.length) ui.names = ["You"];
    if (window.Progress && !Progress.isUnlocked(ui.missionId)) { toast("That mission is locked."); return; }
    var mission = MISSIONS.filter(function (m) { return m.id === ui.missionId; })[0] || MISSIONS[0];
    ui.state = Game.create({
      names: ui.names, mission: mission,
      turnSeconds: parseInt($("turn-sec").value, 10) || 45,
      failsToOut: parseInt($("fails-out").value, 10) || 3
    });
    $("splash").classList.add("hidden");
    $("game").classList.remove("hidden");
    $("end").classList.add("hidden");
    var solo = ui.names.length === 1;
    $("game").classList.toggle("solo-mode", solo);
    if (solo) { $("handoff").classList.add("hidden"); Game.startTurn(ui.state); $("line-input").focus(); }
    else $("handoff").classList.remove("hidden");
    paint(); SFX.open();
  }
  function beginTurn() {
    Game.startTurn(ui.state);
    $("handoff").classList.add("hidden");
    $("line-input").value = ui.state.draft || "";
    $("line-input").focus();
    paint(); SFX.turn();
  }
  function paintHooks(s) {
    var combo = $("combo-pill");
    if (combo) {
      var c = s.combo || 0;
      combo.textContent = c >= 2 ? ("COMBO x" + c) : "COMBO";
      combo.style.opacity = c >= 2 ? "1" : "0.45";
    }
    var meter = $("ship-meter");
    if (meter && window.Progress) {
      var pct = Progress.shipPct(s);
      meter.innerHTML = "<b style=\"width:" + pct + "%\"></b><span>" + pct + "% to ship</span>";
      meter.className = "ship-meter" + (pct >= 100 ? " done" : pct >= 70 ? " hot" : "");
    }
  }
  function paint() {
    var s = ui.state; if (!s) return;
    var p = Game.current(s);
    if ($("mission-pill")) $("mission-pill").textContent = s.mission.title;
    if ($("stack-pill")) $("stack-pill").textContent = s.lines.length + " lines";
    var left = Math.max(0, Math.ceil((s.turnDeadline - Date.now()) / 1000));
    if ($("timer")) {
      $("timer").textContent = Math.floor(left / 60) + ":" + (left % 60 < 10 ? "0" : "") + (left % 60);
      $("timer").className = "timer" + (left <= 10 ? " low" : "") + (left <= 0 ? " dead" : "");
    }
    if ($("who-name")) $("who-name").textContent = p ? p.name : "-";
    if ($("phase-tag")) {
      $("phase-tag").textContent = s.phase === "fix" ? "FIX THE LINE" : "STACK A LINE";
      $("phase-tag").className = "phase-tag " + (s.phase === "fix" ? "fix" : "play");
    }
    if ($("who-fail")) $("who-fail").textContent = p ? p.fails + " / " + s.failsToOut + " fails" : "";
    if ($("source-view")) $("source-view").textContent = Game.source(s) || "// empty";
    var list = $("stack-list");
    if (list) {
      list.innerHTML = "";
      if (!s.lines.length) list.innerHTML = "<div class=\"empty-stack\">No lines yet.</div>";
      s.lines.forEach(function (l, i) {
        var d = document.createElement("div"); d.className = "sline"; d.style.borderLeftColor = l.color;
        d.innerHTML = "<div class=\"meta\"><span>" + escapeHtml(l.name) + "</span><span>" + (i + 1) + "</span></div><pre>" + escapeHtml(l.text) + "</pre>";
        list.appendChild(d);
      });
    }
    if ($("spec")) $("spec").innerHTML = "<strong>" + escapeHtml(s.mission.title) + "</strong><ul>" + s.mission.spec.map(function (x) { return "<li>" + escapeHtml(x) + "</li>"; }).join("") + "</ul>";
    if ($("checks")) {
      $("checks").innerHTML = "";
      (s.checkResults || []).forEach(function (c) {
        var row = document.createElement("div");
        row.className = "check " + (c.passed ? "pass" : "fail");
        row.textContent = (c.passed ? "OK " : "- ") + c.name;
        $("checks").appendChild(row);
      });
    }
    paintHooks(s);
    if ($("players")) {
      $("players").innerHTML = "";
      s.players.forEach(function (pl) {
        var row = document.createElement("div");
        row.className = "player" + (p && pl.id === p.id ? " on" : "") + (pl.alive ? "" : " dead");
        row.innerHTML = "<span class=\"dot\" style=\"background:" + pl.color + "\"></span><span>" + escapeHtml(pl.name) + "</span><span>" + pl.lines + "</span>";
        $("players").appendChild(row);
      });
    }
    if (s.phase === "handoff" && !ui.ended) {
      $("handoff").classList.remove("hidden");
      if ($("handoff-name")) $("handoff-name").textContent = p ? p.name : "";
    }
    if ((s.phase === "win" || s.phase === "lose") && !ui.ended) showEnd(s.phase === "win");
    if (s.lastResult && $("console")) {
      var r = s.lastResult;
      $("console").innerHTML = "<div class=\"" + (r.ok ? "ok" : "bad") + "\">" + escapeHtml(r.message || (r.ok ? "ran" : "error")) + "</div>";
    }
  }
  function showEnd(won) {
    if (ui.ended) return;
    ui.ended = true;
    $("end").classList.remove("hidden");
    $("handoff").classList.add("hidden");
    $("end-title").textContent = won ? "REPO SHIPS" : "STACK COLLAPSED";
    $("end-body").textContent = ui.state.winnerNote || "";
    if (won) SFX.win(); else SFX.out();
  }
  function submit() {
    if (!ui.state || ui.submitting) return;
    ui.submitting = true;
    Game.submitLine(ui.state, $("line-input").value).then(function (res) {
      ui.submitting = false;
      if (res.ok) { SFX.ok(); $("line-input").value = ""; }
      else {
        SFX.bad();
        toast(res.message || "Broken.");
        if (ui.state.draft) $("line-input").value = ui.state.draft;
      }
      paint();
    });
  }
  function backToMenu() {
    ui.state = null; ui.ended = false;
    $("game").classList.add("hidden");
    $("splash").classList.remove("hidden");
    $("handoff").classList.add("hidden");
    $("end").classList.add("hidden");
    renderMissions();
  }
  window.UI = {
    boot: function () {
      renderChips(); renderMissions();
      $("add-player").onclick = function () {
        var name = $("new-name").value.trim();
        if (!name) return;
        ui.names.push(name); $("new-name").value = ""; renderChips(); SFX.select();
      };
      $("new-name").onkeydown = function (e) { if (e.keyCode === 13) $("add-player").click(); };
      $("btn-start").onclick = function () { SFX.unlock(); startGame(); };
      if ($("btn-solo")) $("btn-solo").onclick = function () {
        SFX.unlock(); ui.names = ["You"]; renderChips();
        if ($("turn-sec")) $("turn-sec").value = 90;
        startGame();
      };
      $("btn-begin").onclick = beginTurn;
      $("btn-stack").onclick = submit;
      $("line-input").onkeydown = function (e) { if (e.keyCode === 13 && !e.shiftKey) { e.preventDefault(); submit(); } };
      $("btn-hint").onclick = function () { var h = Game.useHint(ui.state); if (h) toast(h); };
      $("btn-quit").onclick = backToMenu;
      $("btn-again").onclick = backToMenu;
      $("btn-replay").onclick = function () { ui.ended = false; startGame(); };
      $("btn-mute").onclick = function () { $("btn-mute").textContent = SFX.toggle() ? "Sound off" : "Sound on"; };
      if ($("btn-how")) $("btn-how").onclick = function () { $("how").classList.remove("hidden"); };
      if ($("btn-how-close")) $("btn-how-close").onclick = function () { $("how").classList.add("hidden"); };
      if ($("btn-download")) $("btn-download").onclick = function () {
        var exp = Game.exportRepo(ui.state);
        var blob = new Blob([exp.code], { type: "text/javascript" });
        var a = document.createElement("a"); a.href = (window.URL || window.webkitURL).createObjectURL(blob); a.download = exp.file; a.click();
      };
      setInterval(function () {
        if (!ui.state || ui.ended) return;
        Game.tick(ui.state);
        paint();
      }, 250);
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", UI.boot);
  else UI.boot();
})();
