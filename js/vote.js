(function () {
  function $(id) { return document.getElementById(id); }
  function paintVote(state) {
    if (!state || state.phase !== "vote") return;
    var end = $("end"); if (!end) return;
    end.classList.remove("hidden");
    if ($("end-title")) $("end-title").textContent = "REPO IS GREEN";
    if ($("end-body")) $("end-body").textContent = "Each living stacker votes. Majority export keeps the file. Majority destroy wipes it.";
    if ($("vote-row")) $("vote-row").classList.remove("hidden");
    if ($("btn-download")) $("btn-download").classList.add("hidden");
  }
  function resolve(r) {
    if (!r || !r.done) {
      var t = $("toast");
      if (t) { t.textContent = "Votes export " + r.export + " / destroy " + r.destroy; t.classList.remove("hidden"); }
      return;
    }
    if ($("vote-row")) $("vote-row").classList.add("hidden");
    if ($("end-title")) $("end-title").textContent = r.result === "destroy" ? "STACK BURNED" : "REPO SHIPS";
    if ($("end-body")) $("end-body").textContent = (window.UI && window.UI.state && window.UI.state.winnerNote) || "";
    if (r.result === "export" && $("btn-download")) $("btn-download").classList.remove("hidden");
    if (r.result === "export" && window.SFX) SFX.win();
    if (r.result === "destroy" && window.SFX) SFX.out();
  }
  function boot() {
    if ($("btn-export")) $("btn-export").onclick = function () {
      if (!window.Game || !window.UI || !UI.state) return;
      resolve(Game.castVote(UI.state, "export"));
    };
    if ($("btn-destroy")) $("btn-destroy").onclick = function () {
      if (!window.Game || !window.UI || !UI.state) return;
      resolve(Game.castVote(UI.state, "destroy"));
    };
    setInterval(function () {
      if (window.UI && UI.state) paintVote(UI.state);
    }, 300);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
