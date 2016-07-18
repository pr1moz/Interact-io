/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.initMouse = function () {
  var scope = this;

  this.INPUTLIST.MOUSE = 0;

  // Mouse position object
  this.mousePos = {
    curr: new INTERACT.Vector2(),
    start: new INTERACT.Vector2(),
    delta: new INTERACT.Vector2()
  };

  // Binding event listeners
  scope.win.addEventListener('contextmenu', onContextMenu, false);
  scope.win.addEventListener('wheel', onWheel, false);
  scope.win.addEventListener('mousedown', onMouseDown, false);

  // Event functions
  function onMouseDown (event) {
    event.preventDefault();

    scope.INPUT = scope.INPUTLIST.MOUSE;

    switch (event.button) {
      case 0:
        scope.MODE = scope.MODELIST.ROTATE;
        break;
      case 2:
        scope.MODE = scope.MODELIST.PAN;
        break;
      default:
        scope.MODE = scope.MODELIST.NONE;
    }

    if (scope.MODE > -1) {
      // Set the starting mouse position of interaction
      scope.mousePos.start.copyMouseEv(event);

      scope.win.addEventListener('mousemove', onMouseMove, false);
      scope.win.addEventListener('mouseup', onMouseUp, false);
      scope.win.addEventListener('mouseout', onMouseUp, false);
    }
  }

  function onMouseMove (event) {
    event.preventDefault();
    scope.mousePos.curr.copyMouseEv(event);
    scope.mousePos.delta.getDelta(scope.mousePos.curr, scope.mousePos.start);

    if (scope.MODE !== scope.MODELIST.NONE) {
      // Calculate for the right mode
      switch (scope.MODE) {
        case scope.MODELIST.ROTATE:
          rotate();
          break;
        case scope.MODELIST.PAN:
          pan();
          break;
      }

      scope.win.dispatchEvent(scope.events.updateView);
      scope.mousePos.start.copyMouseEv(event);
    }
  }

  function onMouseUp (event) {
    event.preventDefault();
    scope.win.removeEventListener('mousemove', onMouseMove, false);
    scope.win.removeEventListener('mouseup', onMouseUp, false);
    scope.win.removeEventListener('mouseout', onMouseUp, false);
    scope.MODE = scope.MODELIST.NONE;
    scope.INPUT = scope.INPUTLIST.NONE;
  }

  function onContextMenu (event) {
    event.preventDefault();
  }

  function onWheel (event) {
    event.preventDefault();
    scope.zoomDelta = event.wheelDelta || -event.detail;

    if (scope.zoomDelta !== 0) {
      scope.zoomDelta = scope.zoomDelta > 0 ? 1 : -1;
      scope.zoomChanged = true;
    }

    scope.win.dispatchEvent(scope.events.updateView);
  }

  function rotate () {
    scope.sphericalDelta.rotateLeft(2 * Math.PI * scope.mousePos.delta.x / scope.container.clientWidth * scope.rotateSpeed);
    scope.sphericalDelta.rotateUp(2 * Math.PI * scope.mousePos.delta.y / scope.container.clientWidth * scope.rotateSpeed);
  }

  function pan () {
    scope.panDelta.copy(scope.mousePos.delta);
    scope.panChanged = true;
  }

};
