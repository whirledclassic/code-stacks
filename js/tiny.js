(function () {
  function runTiny(code) {
    var logs = [];
    var lines = String(code || "").split(/\r?\n/);
    var i, line, cmd, rest;
    for (i = 0; i < lines.length; i++) {
      line = lines[i].replace(/^\s+|\s+$/g, "");
      if (!line || line.charAt(0) === "#") continue;
      var sp = line.indexOf(" ");
      cmd = (sp === -1 ? line : line.slice(0, sp)).toLowerCase();
      rest = sp === -1 ? "" : line.slice(sp + 1).replace(/^\s+|\s+$/g, "");
      if (cmd === "print" || cmd === "say") {
        logs.push(rest);
      } else {
        return { ok: false, type: "runtime", message: "Tiny: unknown command '" + cmd + "' on line " + (i + 1) + ". Use: print TEXT", logs: logs, exportsKeys: [] };
      }
    }
    return { ok: true, type: "run", message: "ran", logs: logs, exportsKeys: [] };
  }
  function testTiny(code, checks) {
    var run = runTiny(code);
    if (!run.ok) return { ok: false, passed: false, type: run.type, message: run.message, logs: run.logs, checks: [] };
    var results = [];
    var all = true;
    var list = checks || [];
    var i, c, passed, msg;
    for (i = 0; i < list.length; i++) {
      c = list[i];
      passed = true;
      msg = "";
      if (c.expectLog) {
        if (!run.logs.length) { passed = false; msg = "print something"; }
        else if (run.logs.length !== 1) { passed = false; msg = "print exactly one line"; }
        else if (String(run.logs[0]) !== String(c.expectLog)) { passed = false; msg = "printed " + run.logs[0]; }
      }
      if (!passed) all = false;
      results.push({ name: c.name, passed: passed, message: msg });
    }
    return { ok: true, passed: all && list.length > 0, type: "tests", message: all ? "All tests passed." : "Tiny file runs, spec is not green yet.", logs: run.logs, checks: results };
  }
  if (window.Engine && Engine.registerLanguage) {
    Engine.registerLanguage("tiny", { run: runTiny, test: testTiny });
  }
  if (window.MISSIONS) {
    MISSIONS.push({
      id: "tiny-blood",
      language: "tiny",
      title: "Tiny Blood",
      file: "main.tiny",
      difficulty: "Warmup",
      blurb: "Second language. One Tiny line: print CODE STACKS",
      spec: ["Tiny language.", "print CODE STACKS", "Exactly one print."],
      hint: "print CODE STACKS",
      checks: [
        { name: "prints CODE STACKS", expectLog: "CODE STACKS" }
      ]
    });
  }
})();
