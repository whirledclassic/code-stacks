window.FX = {
  burst: function () {},
  flash: function (cls) {
    var el = document.getElementById('flash');
    if (!el) return;
    el.className = 'flash ' + cls + ' on';
    setTimeout(function () { el.className = 'flash'; }, 280);
  },
  shake: function () {
    document.body.className = (document.body.className || '').replace('shake','') + ' shake';
    setTimeout(function () { document.body.className = (document.body.className || '').replace('shake',''); }, 420);
  },
  pulseStack: function () {},
  ensureCanvas: function () {}
};
