window.Trophies = (function () {
  var LIST = [
    { id: "first_ship", title: "First ship", text: "Finish any spec." },
    { id: "tiny_ship", title: "Tiny table", text: "Ship a Tiny mission." },
    { id: "js_ship", title: "JS table", text: "Ship a JavaScript mission." },
    { id: "arson", title: "Arson", text: "Vote to destroy a green repo." },
    { id: "combo3", title: "On a roll", text: "Hit combo x3 in a match." },
    { id: "ten_lines", title: "Ten deep", text: "Export a stack of 10+ lines." },
    { id: "five_ships", title: "Foreman", text: "Ship 5 repos on this machine." }
  ];
  function grant(id) {
    var d = Profile.load();
    if (d.trophies[id]) return false;
    d.trophies[id] = { at: Date.now() };
    Profile.save(d);
    return true;
  }
  function inspect(state, prof, burned) {
    grant("first_ship");
    var lang = state && state.mission && state.mission.language;
    if (lang === "tiny") grant("tiny_ship");
    if (!lang || lang === "javascript" || lang === "js") grant("js_ship");
    if (burned) grant("arson");
    if (state && (state.combo || 0) >= 3) grant("combo3");
    if (state && state.lines && state.lines.length >= 10 && !burned) grant("ten_lines");
    if (prof && prof.ships >= 5) grant("five_ships");
  }
  function paint() {
    var box = document.getElementById("trophy-list");
    if (!box || !window.Profile) return;
    var d = Profile.load();
    box.innerHTML = "";
    var i;
    for (i = 0; i < LIST.length; i++) {
      var t = LIST[i];
      var on = !!(d.trophies && d.trophies[t.id]);
      var el = document.createElement("div");
      el.className = "news-item";
      el.innerHTML = "<strong>" + (on ? "★ " : "· ") + t.title + "</strong><p>" + t.text + (on ? " — earned" : "") + "</p>";
      box.appendChild(el);
    }
    var stats = document.getElementById("profile-stats");
    if (stats) {
      stats.textContent = "Ships " + (d.ships || 0) + " · Burns " + (d.burns || 0) + " · Lines " + (d.lines || 0) + " · Best combo x" + (d.bestCombo || 0);
    }
  }
  function boot() {
    var open = document.getElementById("btn-trophies");
    var panel = document.getElementById("trophies");
    var close = document.getElementById("btn-trophies-close");
    if (open && panel) open.onclick = function () { paint(); panel.classList.remove("hidden"); };
    if (close && panel) close.onclick = function () { panel.classList.add("hidden"); };
    paint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  return { LIST: LIST, inspect: inspect, paint: paint, grant: grant };
})();
