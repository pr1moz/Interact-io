/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.initKeyboard = function () {
  var scope = this;

  this.INPUTLIST.KEYBOARD = 1;

  var keys = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, F5: 116, SHIFT: 16, I: 73, O: 79, R: 82};
  var arrowKeys = [37, 38, 39, 40];
  var zoomKeys = [73, 79];
  var pressed = {};
  var updating = false;

  // Use timer to update view
  var timer;

  // Binding event listeners
  scope.win.addEventListener('keydown', onKeyDown, false);
  scope.win.addEventListener('keyup', onKeyUp, false);

  // Event functions
  function onKeyDown (event) {

    // Do nothing if CMD, CTRL, Shift or F5 keys are pressed to ease development
    if (event.metaKey ||
        event.ctrlKey ||
        pressed[event.keyCode] !== undefined ||
        event.keyCode === keys.SHIFT ||
        event.keyCode === keys.F5) return;

    event.preventDefault();

    // Reset the view
    if (event.keyCode === keys.R) {
      scope.win.dispatchEvent(scope.events.resetView);
      return;
    }

    // Set input type
    scope.INPUT = scope.INPUTLIST.KEYBOARD;

    // Set current interaction mode
    if (arrowKeys.indexOf(event.keyCode) > -1) {
      scope.MODE = scope.MODELIST.ROTATE;
      if (event.shiftKey) {
        scope.MODE = scope.MODELIST.PAN;
      }
    } else if (zoomKeys.indexOf(event.keyCode) > -1) {
      scope.MODE = scope.MODELIST.ZOOM;
    } else {
      // No need to continue if not one of the designated keys
      return;
    }

    // Add to the list of currently pressed keys
    pressed[event.keyCode] = true;

    switch (scope.MODE) {
      case scope.MODELIST.ROTATE:
        switch (event.keyCode) {
          case keys.LEFT:
            // Set rotation delta
            rotateX(1);
            // Set reset function on keyup
            pressed[event.keyCode] = rotateX;
            break;
          case keys.RIGHT:
            rotateX(-1);
            pressed[event.keyCode] = rotateX;
            break;
          case keys.UP:
            rotateY(1);
            pressed[event.keyCode] = rotateY;
            break;
          case keys.DOWN:
            rotateY(-1);
            pressed[event.keyCode] = rotateY;
            break;
        }
        break;
      case scope.MODELIST.PAN:
        switch (event.keyCode) {
          case keys.LEFT:
            panX(1);
            pressed[event.keyCode] = panX;
            break;
          case keys.RIGHT:
            panX(-1);
            pressed[event.keyCode] = panX;
            break;
          case keys.UP:
            panY(1);
            pressed[event.keyCode] = panY;
            break;
          case keys.DOWN:
            panY(-1);
            pressed[event.keyCode] = panY;
            break;
        }
        scope.panChanged = true;
        break;
      case scope.MODELIST.ZOOM:
        switch (event.keyCode) {
          case keys.I:
            zoom(1);
            pressed[event.keyCode] = zoom;
            break;
          case keys.O:
            zoom(-1);
            pressed[event.keyCode] = zoom;
            break;
        }
        scope.zoomChanged = true;
        break;
    }

    if (!updating) {
      timer = setInterval(update, scope.timerInterval);
      updating = true;
    }

  }

  function onKeyUp (event) {
    if (pressed[event.keyCode] !== undefined) {
      pressed[event.keyCode].call(null, 0);
      delete pressed[event.keyCode];
    }
  }

  function zoom (direction) {
    scope.zoomDelta = direction * scope.keyZoomSpeed;
  }

  function rotateX (direction) {
    scope.sphericalDelta.rotateLeft(2 * Math.PI * (direction * scope.keyRotateSpeed) / scope.container.clientWidth * scope.rotateSpeed);
  }

  function rotateY (direction) {
    scope.sphericalDelta.rotateUp(2 * Math.PI * (direction * scope.keyRotateSpeed) / scope.container.clientWidth * scope.rotateSpeed);
  }

  function panX (direction) {
    scope.panDelta.x = direction * scope.panSpeed;
  }

  function panY (direction) {
    scope.panDelta.y = direction * scope.panSpeed;
  }

  function update () {
    if (!Object.keys(pressed).length) {
      updating = false;
      clearInterval(timer);
      return;
    }

    requestAnimationFrame(function () {
      var source = 'aaa';
      scope.win.dispatchEvent(scope.events.updateView(scope.INPUTLIST.KEYBOARD));
    });
  }

};
