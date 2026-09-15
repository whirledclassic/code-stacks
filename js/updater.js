window.CS_VERSION = "1.35.3";
window.Updater = (function () {
  function check() {
    if (!window.location || String(window.location.protocol).indexOf("file") === 0) return;
    var req = new XMLHttpRequest();
    req.open("GET", "https://raw.githubusercontent.com/whirledclassic/code-stacks/main/version.json?t=" + Date.now(), true);
    req.timeout = 4000;
    req.onreadystatechange = function () {
      if (req.readyState !== 4 || req.status < 200 || req.status >= 300) return;
      try {
        var remote = JSON.parse(req.responseText);
        if (String(remote.version) !== window.CS_VERSION) {
          if (document.getElementById("update-banner")) return;
          var bar = document.createElement("div");
          bar.id = "update-banner"; bar.className = "update-banner";
          bar.innerHTML = "GitHub has v" + remote.version + ". This copy is v" + window.CS_VERSION + ". <button type=\"button\" id=\"upd-dismiss\">Later</button>";
          if (document.body) document.body.insertBefore(bar, document.body.firstChild);
          var d = document.getElementById("upd-dismiss");
          if (d) d.onclick = function () { bar.parentNode.removeChild(bar); };
        }
      } catch (e) {}
    };
    try { req.send(); } catch (e) {}
  }
  return { check: check };
})();
if (document.addEventListener) document.addEventListener("DOMContentLoaded", function () { if (window.Updater) Updater.check(); });
