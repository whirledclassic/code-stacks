window.CS_NEWS = [
  { v: "1.26.0", date: "2026-09-15", text: "In-game Updates panel on the menu. Scroll for older patches." },
  { v: "1.25.2", date: "2026-09-15", text: "Stars now count when the export/destroy vote opens, so the next mission unlocks. Esc no longer steals other keys." },
  { v: "1.25.1", date: "2026-09-15", text: "Esc closes Settings. Last mission id is remembered." },
  { v: "1.25.0", date: "2026-09-15", text: "Brand kit folder assets/brand. Modern client chrome." },
  { v: "1.24.1", date: "2026-09-15", text: "Exported files get a CODE STACKS banner. nextTarget helper." },
  { v: "1.24.0", date: "2026-09-15", text: "After a ship, vote Export project or Destroy it." },
  { v: "1.23.0", date: "2026-09-15", text: "Language adapter API. JavaScript is still the only runner." },
  { v: "1.22.0", date: "2026-09-15", text: "Stacked lines animate in. Combo and low clock pulse." },
  { v: "1.21.0", date: "2026-09-15", text: "SETUP.bat: shortcut, optional exe, play." },
  { v: "1.20.0", date: "2026-09-15", text: "Win7 compatibility docs. Chrome 109 / Firefox 115 ESR." },
  { v: "1.18.0", date: "2026-09-15", text: "BUILD-CLIENT.bat builds CodeStacks.exe launcher." },
  { v: "1.16.0", date: "2026-09-15", text: "INSTALL / PLAY / UPDATE bats. Win7 zip download." },
  { v: "1.14.0", date: "2026-09-15", text: "Settings: audio, contrast, large text, reduce motion." },
  { v: "1.11.0", date: "2026-09-15", text: "Combo, ship meter, mission stars." },
  { v: "1.0", date: "2026-09-15", text: "First Blood. One line. Keep the repo alive." }
];
(function () {
  function boot() {
    var list = document.getElementById("news-list");
    if (!list || !window.CS_NEWS) return;
    list.innerHTML = "";
    var i;
    for (i = 0; i < CS_NEWS.length; i++) {
      var n = CS_NEWS[i];
      var el = document.createElement("div");
      el.className = "news-item";
      el.innerHTML = "<strong>v" + n.v + "</strong> <em>" + n.date + "</em><p>" + n.text + "</p>";
      list.appendChild(el);
    }
    var open = document.getElementById("btn-news");
    var close = document.getElementById("btn-news-close");
    var panel = document.getElementById("news");
    if (open && panel) open.onclick = function () { panel.classList.remove("hidden"); };
    if (close && panel) close.onclick = function () { panel.classList.add("hidden"); };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
