window.Settings = (function () {
  var KEY = "cs_settings";
  var defaults = { music: true, sfx: true, volume: 0.8, reduceMotion: false, highContrast: false, largeText: false, skipBoot: false, turnSeconds: 45, failsToOut: 3 };
  function load() {
    var raw = window.CSUtil && CSUtil.read ? CSUtil.read(KEY) : null;
    var out = {}, k;
    for (k in defaults) out[k] = defaults[k];
    if (raw && typeof raw === "object") for (k in raw) if (Object.prototype.hasOwnProperty.call(raw, k)) out[k] = raw[k];
    return out;
  }
  function save(data) { if (window.CSUtil && CSUtil.store) CSUtil.store(KEY, data); }
  function apply(data) {
    var d = data || load();
    var body = document.body;
    if (!body) return d;
    body.className = body.className.replace(/\b(a11y-contrast|a11y-large|a11y-motion)\b/g, "").replace(/\s+/g, " ").trim();
    if (d.highContrast) body.className += " a11y-contrast";
    if (d.largeText) body.className += " a11y-large";
    if (d.reduceMotion) body.className += " a11y-motion";
    if (window.Music) { Music.setMuted(!d.music); Music.setVolume(d.volume); }
    if (window.SFX && SFX.setVolume) SFX.setVolume(d.volume);
    if (window.SFX && SFX.setMuted) SFX.setMuted(!d.sfx);
    var ts = document.getElementById("turn-sec");
    var fo = document.getElementById("fails-out");
    if (ts) ts.value = d.turnSeconds;
    if (fo) fo.value = d.failsToOut;
    return d;
  }
  function bind() {
    var data = apply(load());
    function hook(id, key, kind) {
      var el = document.getElementById(id); if (!el) return;
      if (kind === "chk") { el.checked = !!data[key]; el.onchange = function () { data[key] = !!el.checked; save(data); apply(data); }; }
      else if (kind === "rng") { el.value = data[key]; el.oninput = function () { data[key] = Number(el.value); save(data); apply(data); }; }
      else { el.value = data[key]; el.onchange = function () { data[key] = parseInt(el.value, 10) || defaults[key]; save(data); apply(data); }; }
    }
    hook("set-music", "music", "chk"); hook("set-sfx", "sfx", "chk");
    hook("set-motion", "reduceMotion", "chk"); hook("set-contrast", "highContrast", "chk");
    hook("set-large", "largeText", "chk"); hook("set-boot", "skipBoot", "chk");
    hook("set-volume", "volume", "rng"); hook("set-turn", "turnSeconds", "num"); hook("set-fails", "failsToOut", "num");
  }
  function boot() {
    bind();
    var open = document.getElementById("btn-settings");
    var close = document.getElementById("btn-settings-close");
    var panel = document.getElementById("settings");
    if (open && panel) open.onclick = function () { bind(); panel.classList.remove("hidden"); };
    if (close && panel) close.onclick = function () { panel.classList.add("hidden"); };
    if (load().skipBoot) { var b = document.getElementById("boot"); if (b && b.parentNode) b.parentNode.removeChild(b); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  return { load: load, save: save, apply: apply, bind: bind, defaults: defaults };
})();
