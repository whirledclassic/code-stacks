window.CS_VERSION = "1.32.2";
window.Updater = (function () {
  var REMOTE = "https://raw.githubusercontent.com/whirledclassic/code-stacks/main/version.json?t=" + Date.now();
  function cmp(a, b) {
    var pa = String(a || "0").split(".").map(function (n) { return parseInt(n, 10) || 0; });
    var pb = String(b || "0").split(".").map(function (n) { return parseInt(n, 10) || 0; });
    var i;
    for (i = 0; i < Math.max(pa.length, pb.length); i++) {
      var x = pa[i] || 0, y = pb[i] || 0;
      if (x < y) return -1;
      if (x > y) return 1;
    }
    return 0;
  }
  function banner(remote) {
    if (document.getElementById("update-banner")) return;
    var bar = document.createElement("div");
    bar.id = "update-banner"; bar.className = "update-banner";
    bar.innerHTML = "<b>Update available</b> — v" + window.CS_VERSION + " vs GitHub v" + remote.version + ". Run UPDATE.bat. <button type=\"button\" id=\"upd-dismiss\">Later</button>";
    document.body.insertBefore(bar, document.body.firstChild);
    var d = document.getElementById("upd-dismiss");
    if (d) d.onclick = function () { bar.parentNode.removeChild(bar); };
  }
  function check() {
    var req = new XMLHttpRequest();
    req.open("GET", REMOTE, true); req.timeout = 7000;
    req.onreadystatechange = function () {
      if (req.readyState !== 4 || req.status < 200 || req.status >= 300) return;
      try {
        var remote = JSON.parse(req.responseText);
        if (cmp(window.CS_VERSION, remote.version) < 0) banner(remote);
      } catch (e) {}
    };
    try { req.send(); } catch (e) {}
  }
  return { check: check };
})();
document.addEventListener("DOMContentLoaded", function () { if (window.Updater) Updater.check(); });
