/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.initKeyboard = function () {
  var scope = this;

  var keyPress = null;

  // Binding event listeners
  scope.win.addEventListener('keydown', onKeyDown, false);

  // Event functions
  function onKeyDown (event) {
    // do nothing if F5, CTRL or CMD keys are pressed to ease development
    if (event.metaKey || event.ctrlKey || event.keyCode === 116) return;

    event.preventDefault();
    keyPress = event.keyCode;
  }

};
