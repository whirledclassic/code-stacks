(function () {
  function kick() {
    try {
      if (window.SFX && SFX.unlock) SFX.unlock();
      else if (window.Music && Music.start) Music.start();
    } catch (e) {}
  }
  function onFirst() {
    kick();
    if (document.removeEventListener) {
      document.removeEventListener("click", onFirst, true);
      document.removeEventListener("keydown", onFirst, true);
    }
  }
  if (document.addEventListener) {
    document.addEventListener("click", onFirst, true);
    document.addEventListener("keydown", onFirst, true);
  }
})();
