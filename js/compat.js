/* Windows 7 / older-Chromium shims. Not an IE11 port. */
(function () {
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
        if (window.fetch) {
          fetch(url).then(function (res) {
            if (!res.ok) throw new Error(url);
            return res.arrayBuffer();
          }).then(resolve, reject);
          return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
          else reject(new Error(url));
        };
        xhr.onerror = function () { reject(new Error(url)); };
        xhr.send();
      });
    },
    decodeAudio: function (ctx, arr) {
      return new Promise(function (resolve, reject) {
        try {
          var maybe = ctx.decodeAudioData(arr, resolve, reject);
          if (maybe && typeof maybe.then === "function") maybe.then(resolve, reject);
        } catch (e) {
          reject(e);
        }
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
    isLegacyIE: function () {
      return !!(document.documentMode);
    }
  };

  if (!String.prototype.padStart) {
    String.prototype.padStart = function (w, ch) { return pad(this, w, ch); };
  }
  if (!Object.assign) {
    Object.assign = function (t) {
      for (var i = 1; i < arguments.length; i++) {
        var s = arguments[i];
        if (!s) continue;
        for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k];
      }
      return t;
    };
  }
  if (!Object.entries) {
    Object.entries = function (obj) {
      var out = [];
      for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) out.push([k, obj[k]]);
      return out;
    };
  }
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (v) {
      return this.indexOf(v) !== -1;
    };
  }
  if (!Array.prototype.find) {
    Array.prototype.find = function (fn) {
      for (var i = 0; i < this.length; i++) if (fn(this[i], i, this)) return this[i];
    };
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || function (cb) { return setTimeout(function () { cb(Date.now()); }, 16); };
  }
  if (!window.AudioContext && window.webkitAudioContext) {
    window.AudioContext = window.webkitAudioContext;
  }
  if (!window.URL && window.webkitURL) {
    window.URL = window.webkitURL;
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.CSUtil.isLegacyIE()) {
      var bar = document.createElement("div");
      bar.className = "ie-banner";
      bar.innerHTML = "Internet Explorer on Windows 7 cannot run Code Stacks. Install Firefox 115 ESR or Chrome 109 (last Win7 builds), then reopen this page.";
      document.body.insertBefore(bar, document.body.firstChild);
    }
  });
})();
