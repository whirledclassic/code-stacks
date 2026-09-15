/* Language adapters.
   Built-in: JavaScript (Engine default).
   Add another later:
     Engine.registerLanguage("python", {
       run: function (code) { return { ok:false, message:"no python runner yet" }; },
       test: function (code, checks) { return { ok:false, passed:false, checks:[] }; }
     });
   Missions may set language: "javascript".
*/
(function () {
  if (!window.Engine || !Engine.registerLanguage) return;
})();
