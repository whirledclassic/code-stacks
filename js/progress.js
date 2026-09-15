window.Progress = (function () {
  var KEY = "cs_progress";
  var ORDER = ["first-blood", "greeter", "adder", "toolbox", "ledger"];
  function load() {
    var raw = window.CSUtil && CSUtil.read ? CSUtil.read(KEY) : null;
    if (!raw || typeof raw !== "object") raw = { stars: {}, commits: 0, bestCombo: 0 };
    if (!raw.stars) raw.stars = {};
    return raw;
  }
  function save(data) { if (window.CSUtil && CSUtil.store) CSUtil.store(KEY, data); }
  function isUnlocked(id) {
    var i = ORDER.indexOf(id);
    if (i <= 0) return true;
    var prev = ORDER[i - 1];
    var data = load();
    return !!(data.stars[prev] && data.stars[prev] >= 1);
  }
  function starsFor(state) {
    if (!state || state.phase !== "win") return 0;
    var fails = 0, lines = state.lines.length, checks = (state.mission.checks || []).length;
    for (var i = 0; i < state.players.length; i++) fails += (state.players[i].fixes || 0);
    var stars = 1;
    if (fails <= 2) stars = 2;
    if (fails === 0 && lines <= checks + 2) stars = 3;
    return stars;
  }
  function recordShip(state) {
    var data = load();
    var id = state.mission.id;
    var got = starsFor(state);
    if (!data.stars[id] || data.stars[id] < got) data.stars[id] = got;
    data.commits = (data.commits || 0) + state.lines.length;
    save(data);
    return got;
  }
  function shipPct(state) {
    var list = (state && state.checkResults) || [];
    if (!list.length) return 0;
    var n = 0;
    for (var i = 0; i < list.length; i++) if (list[i].passed) n++;
    return Math.round((n / list.length) * 100);
  }
  return { load: load, save: save, isUnlocked: isUnlocked, starsFor: starsFor, recordShip: recordShip, shipPct: shipPct, ORDER: ORDER };
})();
