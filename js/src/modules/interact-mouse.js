/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.initMouse = function () {
  var scope = this;

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

    switch (event.button) {
      case 0:
        scope.MODE = scope.MODELIST.ROTATE;
        break;
      case 1:
        scope.MODE = scope.MODELIST.ZOOM;
        break;
      case 2:
        scope.MODE = scope.MODELIST.PAN;
        break;
    }

    if (scope.MODE > -1) {
      // set the starting mouse position of interaction
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

    if (scope.MODE === scope.MODELIST.ROTATE) {
      scope.sphericalDelta.rotateLeft(2 * Math.PI * scope.mousePos.delta.x / scope.container.clientWidth * scope.rotateSpeed);
      scope.sphericalDelta.rotateUp(2 * Math.PI * scope.mousePos.delta.y / scope.container.clientWidth * scope.rotateSpeed);
    }

    scope.win.dispatchEvent(scope.changeEvent);
    scope.mousePos.start.copyMouseEv(event);
  }

  function onMouseUp (event) {
    event.preventDefault();
    scope.win.removeEventListener('mousemove', onMouseMove, false);
    scope.win.removeEventListener('mouseup', onMouseUp, false);
    scope.win.removeEventListener('mouseout', onMouseUp, false);
    scope.MODE = -1;
  }

  function onContextMenu (event) {
    event.preventDefault();
  }

  function onWheel (event) {
    event.preventDefault();
    //console.log(event.deltaY);
  }

};
