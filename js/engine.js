window.Engine = (function () {
  var LIMITS = { timeoutMs: 1200, maxLogs: 50 };
  function captureFactory() {
    return function capture() {
      var logs = [];
      var consoleObj = {
        log: function () {
          var s = Array.prototype.slice.call(arguments).map(function (x) {
            return typeof x === "string" ? x : String(x);
          }).join(" ");
          if (logs.length < 50) logs.push(s);
        }
      };
      consoleObj.info = consoleObj.warn = consoleObj.error = consoleObj.log;
      consoleObj.logs = logs;
      return { logs: logs, console: consoleObj };
    };
  }
  function annotate(err, code) {
    var msg = String(err && err.message ? err.message : err);
    var ln = err && (err.lineNumber || err.line);
    var lines = String(code || "").split("\n");
    if (typeof ln === "number") {
      var idx = ln - 2;
      if (idx >= 1 && idx <= lines.length) msg += " (stack line " + idx + ")";
    }
    return msg;
  }
  function syntaxCheck(code) {
    try { new Function(code); return { ok: true }; }
    catch (e) { return { ok: false, type: "syntax", message: e.message, logs: [], checks: [] }; }
  }
  function runLocal(payload) {
    var syn = syntaxCheck(payload.code);
    if (!syn.ok) return syn;
    var cap = captureFactory()();
    var exportsObj = {};
    var stack = { file: "stack.js", lineCount: String(payload.code || "").split("\n").length };
    try {
      var run = new Function("console", "exports", "stack", "\"use strict\";\n" + String(payload.code || ""));
      run(cap.console, exportsObj, stack);
      stack.keys = Object.keys(exportsObj);
    } catch (err) {
      return { ok: false, type: "runtime", message: annotate(err, payload.code), logs: cap.logs, checks: [], exportsKeys: Object.keys(exportsObj) };
    }
    if (payload.mode !== "tests") {
      return { ok: true, type: "run", message: "ran", logs: cap.logs, checks: [], exportsKeys: Object.keys(exportsObj) };
    }
    var results = [];
    var all = true;
    var checks = payload.checks || [];
    for (var i = 0; i < checks.length; i++) {
      var c = checks[i];
      try {
        var fn = new Function("console", "exports", "stack", "\"use strict\";\n" + payload.code + "\n" + c.code);
        fn(captureFactory()().console, {}, { file: "stack.js" });
        results.push({ name: c.name, passed: true, message: "" });
      } catch (err) {
        all = false;
        results.push({ name: c.name, passed: false, message: String(err.message || err) });
      }
    }
    return { ok: true, passed: all && checks.length > 0, type: "tests", message: all ? "All tests passed." : "Repo runs, spec is not green yet.", logs: cap.logs, checks: results, exportsKeys: Object.keys(exportsObj) };
  }
  function runScript(code) {
    var syn = syntaxCheck(code);
    if (!syn.ok) return Promise.resolve(syn);
    return Promise.resolve(runLocal({ mode: "run", code: String(code || "") }));
  }
  function runTests(code, checks) {
    var syn = syntaxCheck(code);
    if (!syn.ok) return Promise.resolve({ ok: false, passed: false, type: syn.type, message: syn.message, logs: [], checks: [] });
    return Promise.resolve(runLocal({ mode: "tests", code: String(code || ""), checks: checks || [] }));
  }
  return { syntaxCheck: syntaxCheck, runScript: runScript, runTests: runTests, runLocal: runLocal, LIMITS: LIMITS };
})();
