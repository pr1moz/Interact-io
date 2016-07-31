/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.initGamepad = function () {
  var scope = this;

  this.INPUTLIST.GAMEPAD = 2;

  var gamepad = {};
  var connected = false;
  var checkTimer;
  var timer;
  var hasChanged = false;

  // Check every second if gamepad is connected
  checkTimer = setInterval(function () {
    if (navigator.getGamepads()[0] !== undefined && !connected) {
      timer = setInterval(update, scope.timerInterval);
      connected = true;
      scope.INPUT = scope.INPUTLIST.GAMEPAD;
    }
  }, 1000);

  // Loop to check axes values
  var update = function () {
    gamepad = navigator.getGamepads()[0];

    // Quit if the gamepad is disconnected
    if (gamepad === undefined) {
      clearInterval(timer);
      connected = false;
      return
    }

    // Zooming
    if (Math.abs(gamepad.axes[5]) > scope.gamepadThreshold) {
      scope.zoomDelta = gamepad.axes[5] * scope.gamepadZoomSensitivity;
      scope.zoomChanged = true;
      hasChanged = true;
    }

    // Rotating X-axis
    if (Math.abs(gamepad.axes[4]) > scope.gamepadThreshold) {
      rotateX(gamepad.axes[4] * scope.gamepadSensitivity);
      hasChanged = true;
    }

    // Rotating Y-axis
    if (Math.abs(gamepad.axes[3]) > scope.gamepadThreshold) {
      rotateY(-gamepad.axes[3] * scope.gamepadSensitivity);
      hasChanged = true;
    }

    // Panning X-axis
    if (Math.abs(gamepad.axes[0]) > scope.gamepadThreshold) {
      panX(-gamepad.axes[0] * scope.gamepadSensitivity);
      scope.panChanged = true;
      hasChanged = true;
    }

    // Panning Y-axis
    if (Math.abs(gamepad.axes[2]) > scope.gamepadThreshold) {
      panY(-gamepad.axes[2] * scope.gamepadSensitivity);
      scope.panChanged = true;
      hasChanged = true;
    }

    // Reset view
    if (gamepad.buttons[1].value > scope.gamepadThreshold) {
      scope.win.dispatchEvent(scope.events.resetView);
      hasChanged = true;
    }

    if (hasChanged) {
      requestAnimationFrame(function () {
        scope.win.dispatchEvent(scope.events.updateView(scope.INPUTLIST.GAMEPAD));
      });
      hasChanged = false;
    }
  };

  function rotateX (delta) {
    scope.sphericalDelta.rotateLeft(2 * Math.PI * (delta * scope.keyRotateSpeed) / scope.container.clientWidth * scope.rotateSpeed);
  }

  function rotateY (delta) {
    scope.sphericalDelta.rotateUp(2 * Math.PI * (delta * scope.keyRotateSpeed) / scope.container.clientWidth * scope.rotateSpeed);
  }

  function panX (delta) {
    scope.panDelta.x = delta * scope.panSpeed;
  }

  function panY (delta) {
    scope.panDelta.y = delta * scope.panSpeed;
  }

};
