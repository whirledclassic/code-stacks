window.CS_NEWS = [
  { v: "1.32.1", date: "2026-09-15", text: "INSTALL.bat plays from this folder when index.html is already here." },
  { v: "1.32.0", date: "2026-09-15", text: "START-HERE.md. Two clicks: INSTALL then ONECLICK." },
  { v: "1.31.0", date: "2026-09-15", text: "CodeStacksSetup.exe WinForms installer. BUILD-INSTALLER.bat." },
  { v: "1.30.0", date: "2026-09-15", text: "Installer wizard UI." },
  { v: "1.29.0", date: "2026-09-15", text: "CodeStacks.exe starts PLAY.bat from the game folder." },
  { v: "1.28.0", date: "2026-09-15", text: "Local trophies and ship stats." },
  { v: "1.27.0", date: "2026-09-15", text: "Tiny language. print CODE STACKS." },
  { v: "1.24.0", date: "2026-09-15", text: "Vote export or destroy after a ship." },
  { v: "1.0", date: "2026-09-15", text: "First Blood. One line." }
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
