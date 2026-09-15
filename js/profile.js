window.Profile = (function () {
  var KEY = "cs_profile";
  function empty() {
    return { names: ["Ada", "Linus"], ships: 0, burns: 0, lines: 0, games: 0, trophies: {}, bestCombo: 0 };
  }
  function load() {
    var raw = window.CSUtil && CSUtil.read ? CSUtil.read(KEY) : null;
    if (!raw || typeof raw !== "object") raw = empty();
    if (!raw.trophies) raw.trophies = {};
    if (!raw.names || !raw.names.length) raw.names = ["Ada", "Linus"];
    return raw;
  }
  function save(data) { if (window.CSUtil && CSUtil.store) CSUtil.store(KEY, data); }
  function recordGame() { var d = load(); d.games += 1; save(d); return d; }
  function recordShip(state, burned) {
    var d = load();
    d.ships += 1;
    if (burned) d.burns += 1;
    d.lines += (state && state.lines) ? state.lines.length : 0;
    var combo = state && state.combo ? state.combo : 0;
    if (combo > (d.bestCombo || 0)) d.bestCombo = combo;
    save(d);
    if (window.Trophies) Trophies.inspect(state, d, burned);
    return d;
  }
  function setNames(names) {
    var d = load();
    if (names && names.length) d.names = names.slice();
    save(d);
  }
  return { load: load, save: save, recordGame: recordGame, recordShip: recordShip, setNames: setNames };
})();
