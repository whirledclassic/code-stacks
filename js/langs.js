(function () {
  if (!window.Engine || !Engine.registerLanguage) return;
  /* Example stub — registered so hasLanguage("python") is true but run fails honestly. */
  Engine.registerLanguage("python", {
    run: function () {
      return { ok: false, type: "engine", message: "Python runner is not in this build.", logs: [], exportsKeys: [] };
    },
    test: function () {
      return { ok: false, passed: false, type: "engine", message: "Python runner is not in this build.", checks: [], logs: [] };
    }
  });
})();
