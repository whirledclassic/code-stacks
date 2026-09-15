window.SFX = (function () {
  var muted = false;
  function beep(freq, dur, type) {
    if (muted) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!window._csac) window._csac = new AC();
      var c = window._csac;
      if (c.state === "suspended") c.resume();
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = type || "square";
      o.frequency.value = freq;
      g.gain.value = 0.04;
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + dur);
    } catch (e) {}
  }
  return {
    unlock: function () {
      if (window.Music) {
        Music.start();
        if (window.Settings && !Settings.load().music) Music.setMuted(true);
        else Music.setMuted(false);
      }
      beep(440, 0.03);
    },
    toggle: function () { muted = !muted; if (window.Music) Music.setMuted(muted); return muted; },
    setMuted: function (m) { muted = !!m; if (window.Music && window.Settings && !Settings.load().music) Music.setMuted(true); },
    isMuted: function () { return muted; },
    setVolume: function (v) { if (window.Music) Music.setVolume(v); },
    click: function () { beep(720, 0.05); },
    select: function () { beep(720, 0.05); },
    ok: function () { beep(520, 0.07, "triangle"); setTimeout(function(){ beep(780, 0.09, "triangle"); }, 70); },
    lock: function () { beep(300, 0.08, "sine"); setTimeout(function(){ beep(520, 0.07, "triangle"); }, 50); },
    combo: function (n) { for (var i = 0; i < Math.min(5, n || 3); i++) (function (k) { setTimeout(function () { beep(520 + k * 90, 0.07, "triangle"); }, k * 55); })(i); },
    ship: function () { [523,659,784].forEach(function(f,i){ setTimeout(function(){ beep(f,0.16,"triangle"); }, i*90); }); if (window.Music) Music.duck(); },
    bad: function () { beep(180, 0.18, "sawtooth"); },
    tick: function () { beep(880, 0.03); },
    lowClock: function () { beep(980, 0.04); },
    out: function () { beep(140, 0.35, "sawtooth"); },
    win: function () { this.ship(); },
    turn: function () { beep(440, 0.08); },
    open: function () { beep(440, 0.08); },
    hint: function () { beep(660, 0.12, "triangle"); },
    glass: function () {},
    close: function () { beep(220, 0.1); },
    type: function () { beep(900, 0.02); }
  };
})();
