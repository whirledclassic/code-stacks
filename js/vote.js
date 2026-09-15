(function () {
  function $(id) { return document.getElementById(id); }
  function state() { return window._csState; }
  function paintVote(s) {
    if (!s || s.phase !== "vote") return;
    var end = $("end"); if (!end) return;
    end.classList.remove("hidden");
    if ($("handoff")) $("handoff").classList.add("hidden");
    if ($("end-title")) $("end-title").textContent = "REPO IS GREEN";
    if ($("end-body")) $("end-body").textContent = "Vote export or destroy. Living stackers each click once. Majority wins. Solo is one click.";
    if ($("vote-row")) $("vote-row").classList.remove("hidden");
    if ($("btn-download")) $("btn-download").classList.add("hidden");
  }
  function resolve(r) {
    if (!r) return;
    if (!r.done) {
      var t = $("toast");
      if (t) { t.textContent = "Votes  export " + r.export + "  /  destroy " + r.destroy + "  (need " + r.need + ")"; t.classList.remove("hidden"); }
      return;
    }
    if ($("vote-row")) $("vote-row").classList.add("hidden");
    if ($("end-title")) $("end-title").textContent = r.result === "destroy" ? "STACK BURNED" : "REPO SHIPS";
    if ($("end-body")) $("end-body").textContent = (state() && state().winnerNote) || "";
    if (r.result === "export" && $("btn-download")) $("btn-download").classList.remove("hidden");
    if (r.result === "export" && window.SFX) SFX.win();
    if (r.result === "destroy" && window.SFX) SFX.out();
  }
  function boot() {
    if (window.Game && !Game._voteWrapped) {
      Game._voteWrapped = true;
      var inner = Game.create;
      Game.create = function (opts) {
        var s = inner(opts);
        window._csState = s;
        return s;
      };
    }
    if ($("btn-export")) $("btn-export").onclick = function () {
      if (!window.Game || !state()) return;
      resolve(Game.castVote(state(), "export"));
    };
    if ($("btn-destroy")) $("btn-destroy").onclick = function () {
      if (!window.Game || !state()) return;
      resolve(Game.castVote(state(), "destroy"));
    };
    setInterval(function () { paintVote(state()); }, 300);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
