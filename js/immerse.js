(function () {
  function paint() {
    var s = window._csState;
    var box = document.getElementById("console");
    if (!s || !box) return;
    var r = s.lastResult || {};
    var logs = r.logs || [];
    var hold = document.getElementById("console-logs");
    if (!hold) {
      hold = document.createElement("div");
      hold.id = "console-logs";
      hold.style.marginTop = "8px";
      hold.style.color = "#7cff6b";
      hold.style.fontFamily = "Consolas, Courier New, monospace";
      hold.style.whiteSpace = "pre-wrap";
      box.appendChild(hold);
    }
    hold.textContent = logs.length ? logs.join("\n") : "";
    var pill = document.getElementById("mission-pill");
    if (pill && s.mission) {
      var lang = s.mission.language || "javascript";
      var title = s.mission.title || "";
      if (pill.getAttribute("data-base") !== title) pill.setAttribute("data-base", title);
      if (pill.textContent.indexOf(lang) === -1) pill.textContent = title + " · " + lang;
    }
  }
  setInterval(paint, 400);
})();
