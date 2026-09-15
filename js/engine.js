window.Engine = (function () {
  var LIMITS = { timeoutMs: 700, maxLogs: 40 };
  var WORKER_SRC = "self.onmessage=function(e){var msg=e.data||{};var code=String(msg.code||'');var checks=msg.checks||[];function capture(){var logs=[];var console={log:function(){var s=Array.prototype.slice.call(arguments).map(function(x){return typeof x==='string'?x:String(x);}).join(' ');if(logs.length<40)logs.push(s);}};console.info=console.warn=console.error=console.log;console.logs=logs;return {logs:logs,console:console};}try{new Function(code);}catch(err){self.postMessage({ok:false,type:'syntax',message:String(err.message||err),logs:[],checks:[]});return;}var cap=capture();try{var run=new Function('console','\"use strict\";\\n'+code);run(cap.console);}catch(err){self.postMessage({ok:false,type:'runtime',message:String(err.message||err),logs:cap.logs,checks:[]});return;}if(msg.mode!=='tests'){self.postMessage({ok:true,type:'run',message:'ran',logs:cap.logs,checks:[]});return;}var results=[];var all=true;for(var i=0;i<checks.length;i++){var c=checks[i];try{var fn=new Function('console','\"use strict\";\\n'+code+'\\n'+c.code);fn(capture().console);results.push({name:c.name,passed:true,message:''});}catch(err){all=false;results.push({name:c.name,passed:false,message:String(err.message||err)});}}self.postMessage({ok:true,passed:all&&checks.length>0,type:'tests',message:all?'All tests passed.':'Repo runs, spec is not green yet.',logs:cap.logs,checks:results});};"
  function syntaxCheck(code) {
    try { new Function(code); return { ok: true }; }
    catch (e) { return { ok: false, type: 'syntax', message: e.message, logs: [], checks: [] }; }
  }
  function runInWorker(payload) {
    return new Promise(function (resolve) {
      var settled = false, worker, timer;
      function finish(result) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        try { worker.terminate(); } catch (e) {}
        resolve(result);
      }
      try {
        var blob = new Blob([WORKER_SRC], { type: 'text/javascript' });
        worker = new Worker((window.URL || window.webkitURL).createObjectURL(blob));
      } catch (e) {
        finish({ ok: false, type: 'runtime', message: 'Serve the folder over http to run code.', logs: [], checks: [] });
        return;
      }
      timer = setTimeout(function () {
        finish({ ok: false, type: 'timeout', message: 'Run killed after 700ms.', logs: [], checks: [] });
      }, LIMITS.timeoutMs);
      worker.onmessage = function (e) { finish(e.data); };
      worker.onerror = function (e) { finish({ ok: false, type: 'runtime', message: e.message || 'Worker crashed.', logs: [], checks: [] }); };
      worker.postMessage(payload);
    });
  }
  function runScript(code) {
    var syn = syntaxCheck(code);
    if (!syn.ok) return Promise.resolve(syn);
    return runInWorker({ mode: 'run', code: String(code || '') });
  }
  function runTests(code, checks) {
    var syn = syntaxCheck(code);
    if (!syn.ok) return Promise.resolve({ ok: false, passed: false, type: syn.type, message: syn.message, logs: [], checks: [] });
    return runInWorker({ mode: 'tests', code: String(code || ''), checks: checks || [] });
  }
  return { syntaxCheck: syntaxCheck, runScript: runScript, runTests: runTests, LIMITS: LIMITS };
})();
