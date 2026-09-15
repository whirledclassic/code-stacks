(function () {
  var COLORS = ["#3DE0FF", "#FF3D9A", "#7CFF6B", "#FFB020", "#C084FC", "#FF6B6B"];
  var ui = { names: ["Ada", "Linus"], missionId: "greeter", state: null, ticker: null, lastTickSec: null, submitting: false };
  function $(id) { return document.getElementById(id); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" })[c]; }); }
  function toast(msg) {
    var el = $("toast"); if (!el) return;
    el.textContent = msg; el.classList.remove("hidden");
    clearTimeout(toast._t); toast._t = setTimeout(function () { el.classList.add("hidden"); }, 2600);
  }
  function renderChips() {
    var box = $("player-chips"); if (!box) return; box.innerHTML = "";
    ui.names.forEach(function (n, i) {
      var el = document.createElement("div"); el.className = "chip";
      el.innerHTML = "<b style=\"background:" + COLORS[i % COLORS.length] + "\"></b>" + escapeHtml(n) + "<button type=\"button\">×</button>";
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
      var b = document.createElement("button"); b.type = "button";
      b.className = "mission" + (m.id === ui.missionId ? " on" : "");
      b.innerHTML = "<div class=\"mission-body\"><div class=\"top\"><strong>" + escapeHtml(m.title) + "</strong><em>" + escapeHtml(m.difficulty) + "</em></div><span>" + escapeHtml(m.blurb) + "</span></div>";
      b.onclick = function () { ui.missionId = m.id; renderMissions(); SFX.select(); };
      box.appendChild(b);
    });
  }
  function startGame() {
    var mission = MISSIONS.filter(function (m) { return m.id === ui.missionId; })[0] || MISSIONS[0];
    ui.state = Game.create({
      names: ui.names, mission: mission,
      turnSeconds: parseInt($("turn-sec").value, 10) || 45,
      failsToOut: parseInt($("fails-out").value, 10) || 3
    });
    $("splash").classList.add("hidden");
    $("game").classList.remove("hidden");
    $("handoff").classList.remove("hidden");
    $("end").classList.add("hidden");
    paint();
    SFX.open();
  }
  function beginTurn() {
    Game.startTurn(ui.state);
    $("handoff").classList.add("hidden");
    $("line-input").value = ui.state.draft || "";
    $("line-input").focus();
    paint();
    SFX.turn();
  }
  function paint() {
    var s = ui.state; if (!s) return;
    var p = Game.current(s);
    $("mission-pill").textContent = s.mission.title;
    $("stack-pill").textContent = s.lines.length + " lines";
    var left = Math.max(0, Math.ceil((s.turnDeadline - Date.now()) / 1000));
    $("timer").textContent = Math.floor(left / 60) + ":" + (left % 60 < 10 ? "0" : "") + (left % 60);
    $("timer").className = "timer" + (left <= 10 ? " low" : "") + (left <= 0 ? " dead" : "");
    $("who-name").textContent = p ? p.name : "—";
    $("phase-tag").textContent = s.phase === "fix" ? "FIX THE LINE" : "STACK A LINE";
    $("phase-tag").className = "phase-tag " + (s.phase === "fix" ? "fix" : "play");
    $("who-fail").textContent = p ? p.fails + " / " + s.failsToOut + " fails" : "";
    $("source-view").textContent = Game.source(s) || "// empty";
    var list = $("stack-list"); list.innerHTML = "";
    if (!s.lines.length && !s.pending) list.innerHTML = "<div class=\"empty-stack\">No lines yet.</div>";
    s.lines.forEach(function (l, i) {
      var d = document.createElement("div"); d.className = "sline"; d.style.borderLeftColor = l.color;
      d.innerHTML = "<div class=\"meta\"><span>" + escapeHtml(l.name) + "</span><span>" + (i + 1) + "</span></div><pre>" + escapeHtml(l.text) + "</pre>";
      list.appendChild(d);
    });
    if (s.pending && s.phase === "fix") {
      var g = document.createElement("div"); g.className = "sline ghost"; g.style.borderLeftColor = s.pending.color;
      g.innerHTML = "<div class=\"meta\"><span>" + escapeHtml(s.pending.name) + " · broken</span></div><pre>" + escapeHtml(s.pending.text) + "</pre>";
      list.appendChild(g);
    }
    var spec = $("spec"); spec.innerHTML = "<strong>" + escapeHtml(s.mission.title) + "</strong><ul>" + s.mission.spec.map(function (x) { return "<li>" + escapeHtml(x) + "</li>"; }).join("") + "</ul>";
    var checks = $("checks"); checks.innerHTML = "";
    (s.checkResults || []).forEach(function (c) {
      var row = document.createElement("div"); row.className = "check " + (c.passed ? "pass" : "fail");
      row.textContent = (c.passed ? "✓ " : "· ") + c.name;
      checks.appendChild(row);
    });
    var players = $("players"); players.innerHTML = "";
    s.players.forEach(function (pl) {
      var row = document.createElement("div");
      row.className = "player" + (p && pl.id === p.id ? " on" : "") + (pl.alive ? "" : " dead");
      row.innerHTML = "<span class=\"dot\" style=\"background:" + pl.color + "\"></span><span class=\"nm\">" + escapeHtml(pl.name) + "</span><span class=\"st\">" + pl.lines + " lines</span>";
      players.appendChild(row);
    });
    var feed = $("feed"); feed.innerHTML = s.log.slice(-12).map(function (item) {
      return "<div class=\"item \" + item.kind + \">" + escapeHtml(item.text) + "</div>";
    }).join("");
    if (s.phase === "handoff") {
      $("handoff").classList.remove("hidden");
      $("handoff-name").textContent = p ? p.name : "";
    }
    if (s.phase === "win" || s.phase === "lose") showEnd(s.phase === "win");
    if (s.lastResult) {
      var r = s.lastResult;
      $("console").innerHTML = "<div class=\"" + (r.ok ? "ok" : "bad") + "\">" + escapeHtml(r.message || (r.ok ? "ran" : "error")) + "</div>";
    }
  }
  function showEnd(won) {
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
      if (res.ok) { SFX.ok(); $("line-input").value = ""; if (window.FX) FX.flash("ok"); }
      else { SFX.bad(); if (window.FX) { FX.flash("bad"); FX.shake(); } toast(res.message || "Broken."); }
      paint();
    });
  }
  function loop() {
    if (!ui.state) return;
    Game.tick(ui.state);
    var left = Math.max(0, Math.ceil((ui.state.turnDeadline - Date.now()) / 1000));
    if (left <= 10 && left !== ui.lastTickSec && ui.state.phase !== "handoff") SFX.tick();
    ui.lastTickSec = left;
    paint();
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
      $("btn-begin").onclick = beginTurn;
      $("btn-stack").onclick = submit;
      $("line-input").onkeydown = function (e) { if (e.keyCode === 13 && !e.shiftKey) { e.preventDefault(); submit(); } };
      $("btn-hint").onclick = function () { var h = Game.useHint(ui.state); if (h) toast(h); };
      $("btn-quit").onclick = function () { ui.state = null; $("game").classList.add("hidden"); $("splash").classList.remove("hidden"); $("handoff").classList.add("hidden"); $("end").classList.add("hidden"); };
      $("btn-again").onclick = $("btn-quit").onclick;
      $("btn-replay").onclick = startGame;
      $("btn-mute").onclick = function () { $("btn-mute").textContent = SFX.toggle() ? "Sound off" : "Sound on"; };
      $("btn-how").onclick = function () { $("how").classList.remove("hidden"); };
      $("btn-how-close").onclick = function () { $("how").classList.add("hidden"); };
      $("btn-download").onclick = function () {
        var exp = Game.exportRepo(ui.state);
        var blob = new Blob([exp.code], { type: "text/javascript" });
        var a = document.createElement("a"); a.href = (window.URL || window.webkitURL).createObjectURL(blob); a.download = exp.file; a.click();
      };
      document.onkeydown = function (e) {
        if (ui.state && e.keyCode === 32 && ui.state.phase === "handoff" && document.activeElement.id !== "line-input") {
          e.preventDefault(); beginTurn();
        }
      };
      setInterval(loop, 250);
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", UI.boot);
  else UI.boot();
})();
