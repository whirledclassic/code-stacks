window.Engine = (function () {
  var LIMITS = { timeoutMs: 1200, maxLogs: 50 };
  var adapters = {};
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
    if (typeof ln === "number") {
      var idx = ln - 2;
      var lines = String(code || "").split("\n");
      if (idx >= 1 && idx <= lines.length) msg += " (stack line " + idx + ")";
    }
    return msg;
  }
  function syntaxCheck(code) {
    try { new Function(code); return { ok: true }; }
    catch (e) { return { ok: false, type: "syntax", message: e.message, logs: [], checks: [] }; }
  }
  function hasLanguage(id) {
    if (!id || id === "javascript" || id === "js" || id === "JavaScript") return true;
    return !!(adapters[id] && typeof adapters[id].run === "function");
  }
  function languages() {
    var list = [{ id: "javascript", title: "JavaScript", ready: true }];
    var k;
    for (k in adapters) if (adapters[k] && adapters[k].run) list.push({ id: k, title: k, ready: true });
    return list;
  }
  function registerLanguage(id, adapter) {
    if (!id || !adapter || typeof adapter.run !== "function") return false;
    adapters[id] = adapter;
    return true;
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
    var results = [], all = true, checks = payload.checks || [];
    for (var i = 0; i < checks.length; i++) {
      var c = checks[i];
      try {
        var fn = new Function("console", "exports", "stack", "\"use strict\";\n" + payload.code + "\n" + c.code);
        fn(captureFactory()().console, {}, stack);
        results.push({ name: c.name, passed: true, message: "" });
      } catch (err) {
        all = false;
        results.push({ name: c.name, passed: false, message: String(err.message || err) });
      }
    }
    return { ok: true, passed: all && checks.length > 0, type: "tests", message: all ? "All tests passed." : "Repo runs, spec is not green yet.", logs: cap.logs, checks: results, exportsKeys: Object.keys(exportsObj) };
  }
  function runScript(code, lang) {
    if (adapters[lang] && adapters[lang].run) return Promise.resolve(adapters[lang].run(code));
    if (!hasLanguage(lang)) return Promise.resolve({ ok: false, type: "engine", message: "No runner for " + lang + ". JavaScript only." });
    var syn = syntaxCheck(code);
    if (!syn.ok) return Promise.resolve(syn);
    return Promise.resolve(runLocal({ mode: "run", code: String(code || "") }));
  }
  function runTests(code, checks, lang) {
    if (adapters[lang] && adapters[lang].test) return Promise.resolve(adapters[lang].test(code, checks));
    if (!hasLanguage(lang)) return Promise.resolve({ ok: false, passed: false, type: "engine", message: "No runner for " + lang + ".", checks: [] });
    var syn = syntaxCheck(code);
    if (!syn.ok) return Promise.resolve({ ok: false, passed: false, type: syn.type, message: syn.message, logs: [], checks: [] });
    return Promise.resolve(runLocal({ mode: "tests", code: String(code || ""), checks: checks || [] }));
  }
  return { syntaxCheck: syntaxCheck, runScript: runScript, runTests: runTests, runLocal: runLocal, LIMITS: LIMITS, languages: languages, hasLanguage: hasLanguage, registerLanguage: registerLanguage };
})();
