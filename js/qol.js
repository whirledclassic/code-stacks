(function () {
  function $(id) { return document.getElementById(id); }
  function hide(id) {
    var el = $(id);
    if (!el) return;
    if (el.className.indexOf("hidden") === -1) el.className = el.className + " hidden";
  }
  function boot() {
    if (document.addEventListener) {
      document.addEventListener("keydown", function (e) {
        e = e || window.event;
        if ((e.keyCode || e.which) === 27) {
          hide("settings"); hide("how"); hide("news");
        }
      });
    }
    var box = $("missions");
    if (box && box.addEventListener) {
      box.addEventListener("click", function (ev) {
        var t = ev.target;
        while (t && t !== box) {
          if (t.className && String(t.className).indexOf("mission") >= 0) {
            var strong = t.getElementsByTagName("strong")[0];
            if (strong && window.MISSIONS && window.CSUtil) {
              var title = strong.textContent, j;
              for (j = 0; j < MISSIONS.length; j++) {
                if (MISSIONS[j].title === title) CSUtil.store("cs_last_mission", MISSIONS[j].id);
              }
            }
          }
          t = t.parentNode;
        }
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
