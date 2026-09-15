window.Music = (function () {
  var ctx = null, master = null, playing = false, muted = false, step = 0, timer = null;
  var NOTES = [196, 246.94, 293.66, 392, 329.63, 246.94, 220, 196];
  function ac() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.07;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type, gain, delay) {
    if (muted || !playing) return;
    try {
      var c = ac();
      var t0 = c.currentTime + (delay || 0);
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = type || "triangle";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain || 0.04, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(master);
      o.start(t0); o.stop(t0 + dur + 0.02);
    } catch (e) {}
  }
  function bar() {
    if (!playing || muted) return;
    var n = NOTES[step % NOTES.length];
    tone(n / 2, 0.38, "sine", 0.035, 0);
    tone(n, 0.16, "triangle", 0.03, 0);
    if (step % 2 === 0) tone(n * 1.5, 0.1, "sine", 0.018, 0.12);
    step += 1;
  }
  function start() {
    if (playing) return;
    playing = true;
    try { ac(); } catch (e) { return; }
    bar();
    timer = setInterval(bar, 420);
  }
  return {
    start: start,
    stop: function () { playing = false; if (timer) clearInterval(timer); timer = null; },
    setMuted: function (m) { muted = !!m; if (master) master.gain.value = muted ? 0 : 0.07; },
    setVolume: function (v) { try { ac(); if (master) master.gain.value = muted ? 0 : Math.max(0, Math.min(1, Number(v))) * 0.12; } catch (e) {} }
  };
})();
