(function () {
  if (!window.Game) return;
  Game.nextTarget = Game.nextTarget || function (state) {
    var list = (state && state.checkResults) || [];
    var i;
    for (i = 0; i < list.length; i++) if (!list[i].passed) return list[i].name;
    return "";
  };
  if (Game.exportRepo && !Game._exportWrapped) {
    Game._exportWrapped = true;
    var inner = Game.exportRepo;
    Game.exportRepo = function (state) {
      var out = inner(state);
      var title = state && state.mission ? state.mission.title : "stack";
      var file = state && state.mission ? state.mission.file : "stack.js";
      out.code = "// CODE STACKS / " + title + " / " + file + "\n" + (out.code || "");
      return out;
    };
  }
})();
