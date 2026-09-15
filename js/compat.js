(function () {
  if (!window.Promise) {
    window.Promise = function (fn) {
      var ok = null, bad = null, val = null, err = null, settled = 0;
      this.then = function (a, b) {
        ok = a; bad = b;
        if (settled === 1 && ok) ok(val);
        if (settled === 2 && bad) bad(err);
        return this;
      };
      function res(v) { if (settled) return; settled = 1; val = v; if (ok) ok(v); }
      function rej(e) { if (settled) return; settled = 2; err = e; if (bad) bad(e); }
      try { fn(res, rej); } catch (e) { rej(e); }
    };
    window.Promise.resolve = function (v) { return new Promise(function (r) { r(v); }); };
  }
  function pad(value, width, ch) {
    var s = String(value);
    var c = ch || "0";
    while (s.length < width) s = c + s;
    return s;
  }
  window.CSUtil = {
    pad: pad,
    loadBuffer: function (url) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
          else reject(new Error(url));
        };
        xhr.onerror = function () { reject(new Error(url)); };
        try { xhr.send(); } catch (e) { reject(e); }
      });
    },
    decodeAudio: function (ctx, arr) {
      return new Promise(function (resolve, reject) {
        try {
          var maybe = ctx.decodeAudioData(arr, resolve, reject);
          if (maybe && typeof maybe.then === "function") maybe.then(resolve, reject);
        } catch (e) { reject(e); }
      });
    },
    store: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    },
    read: function (key) {
      try {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    },
    isLegacyIE: function () { return !!(document.documentMode); }
  };
  if (!String.prototype.padStart) String.prototype.padStart = function (w, ch) { return pad(this, w, ch); };
  if (!Object.assign) {
    Object.assign = function (t) {
      for (var i = 1; i < arguments.length; i++) {
        var s = arguments[i]; if (!s) continue;
        for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k];
      }
      return t;
    };
  }
  if (!Object.keys) {
    Object.keys = function (obj) {
      var o = []; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) o.push(k); return o;
    };
  }
  if (!Array.prototype.includes) Array.prototype.includes = function (v) { return this.indexOf(v) !== -1; };
  if (!window.AudioContext && window.webkitAudioContext) window.AudioContext = window.webkitAudioContext;
  if (document.documentMode) {
    document.write("<div style='padding:20px;background:#4a0010;color:#fff;font-family:sans-serif'>Internet Explorer cannot run CODE STACKS. Install Chrome 109 or Firefox 115 ESR, then right-click index.html and Open with that browser.</div>");
  }
})();
