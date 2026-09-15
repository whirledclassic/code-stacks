(function () {
  function $(id) { return document.getElementById(id); }
  function boot() {
    document.onkeydown = function (e) {
      e = e || window.event;
      var key = e.keyCode || e.which;
      if (key === 27) {
        var ids = ["settings", "how", "handoff"];
        var i;
        for (i = 0; i < ids.length; i++) {
          var el = $(ids[i]);
          if (el && el.className.indexOf("hidden") === -1 && ids[i] !== "handoff") el.className += " hidden";
        }
      }
    };
    var last = window.CSUtil && CSUtil.read ? CSUtil.read("cs_last_mission") : null;
    if (last && window.MISSIONS) {
      var ok = false, i;
      for (i = 0; i < MISSIONS.length; i++) if (MISSIONS[i].id === last) ok = true;
      if (ok && window.UI) {}
      window._csLastMission = last;
    }
    var box = $("missions");
    if (box) {
      box.addEventListener("click", function (ev) {
        var t = ev.target;
        while (t && t !== box) {
          if (t.className && String(t.className).indexOf("mission") >= 0) {
            var strong = t.getElementsByTagName("strong")[0];
            if (strong && window.MISSIONS && CSUtil && CSUtil.store) {
              var title = strong.textContent;
              var j;
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
