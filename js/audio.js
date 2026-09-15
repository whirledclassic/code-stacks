window.SFX = (function () {
  var muted = false;
  function beep(freq, dur) {
    if (muted) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!window._csac) window._csac = new AC();
      var c = window._csac;
      if (c.state === "suspended") c.resume();
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = "square";
      o.frequency.value = freq;
      g.gain.value = 0.04;
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + dur);
    } catch (e) {}
  }
  return {
    unlock: function () { beep(440, 0.03); if (window.Music) Music.start(); },
    toggle: function () { muted = !muted; if (window.Music) Music.setMuted(muted); return muted; },
    isMuted: function () { return muted; },
    setVolume: function (v) { if (window.Music) Music.setVolume(v); },
    click: function () { beep(720, 0.05); },
    select: function () { beep(720, 0.05); },
    ok: function () { beep(520, 0.07); setTimeout(function(){ beep(780, 0.09); }, 70); },
    bad: function () { beep(180, 0.18); },
    tick: function () { beep(880, 0.03); },
    out: function () { beep(140, 0.35); },
    win: function () { [523,659,784].forEach(function(f,i){ setTimeout(function(){ beep(f,0.16); }, i*90); }); },
    turn: function () { beep(440, 0.08); },
    open: function () { beep(440, 0.08); },
    hint: function () { beep(660, 0.12); },
    glass: function () {},
    close: function () { beep(220, 0.1); },
    type: function () { beep(900, 0.02); }
  };
})();
