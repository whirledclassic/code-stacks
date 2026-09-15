window.CS_NEWS = [
  { v: "1.27.1", date: "2026-09-15", text: "Esc closes Updates. Tiny Blood is a second language: print CODE STACKS." },
  { v: "1.27.0", date: "2026-09-15", text: "Tiny language runner. Mission Tiny Blood. runScript honors mission.language." },
  { v: "1.26.0", date: "2026-09-15", text: "In-game Updates panel on the menu. Scroll for older patches." },
  { v: "1.25.2", date: "2026-09-15", text: "Stars count on the export/destroy vote so the next mission unlocks." },
  { v: "1.25.1", date: "2026-09-15", text: "Esc closes Settings. Last mission id is remembered." },
  { v: "1.24.0", date: "2026-09-15", text: "After a ship, vote Export or Destroy." },
  { v: "1.16.0", date: "2026-09-15", text: "INSTALL / PLAY / UPDATE. Win7 zip download." },
  { v: "1.14.0", date: "2026-09-15", text: "Settings: audio, contrast, large text, reduce motion." },
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
