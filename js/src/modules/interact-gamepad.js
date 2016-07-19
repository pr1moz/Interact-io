/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.initGamepad = function () {
  var scope = this;

  this.INPUTLIST.GAMEPAD = 2;

  var gamepad = {};
  var checkTimer;

  var threshold = 0.01; // lower tracking threshold
  var sensitivity = 1.2; // higher sensitivity threshold

  // Check every second if gamepad is connected
  checkTimer = setInterval(function () {
    if (navigator.getGamepads()[0] !== undefined) {
      update();
      clearInterval(checkTimer);
      scope.INPUT = scope.INPUTLIST.GAMEPAD;
    }
  }, 1000);

  // Loop to check axes values
  var update = function () {
    gamepad = navigator.getGamepads()[0];

    // Zooming
    if (Math.abs(gamepad.axes[5]) > threshold) {
      scope.zoomDelta = gamepad.axes[5] * sensitivity;
      scope.zoomChanged = true;
    }

    // Rotating X-axis
    if (Math.abs(gamepad.axes[4]) > threshold) {
      rotateX(gamepad.axes[4] * sensitivity);
    }

    // Rotating Y-axis
    if (Math.abs(gamepad.axes[3]) > threshold) {
      rotateY(-gamepad.axes[3] * sensitivity);
    }

    // Panning X-axis
    if (Math.abs(gamepad.axes[0]) > threshold) {
      panX(-gamepad.axes[0] * sensitivity);
      scope.panChanged = true;
    }

    // Panning Y-axis
    if (Math.abs(gamepad.axes[2]) > threshold) {
      panY(-gamepad.axes[2] * sensitivity);
      scope.panChanged = true;
    }

    // Reset view
    if (gamepad.buttons[1].value > threshold) {
      scope.win.dispatchEvent(scope.events.resetView);
    }

    scope.win.dispatchEvent(scope.events.updateView);
    requestAnimationFrame(update);
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
