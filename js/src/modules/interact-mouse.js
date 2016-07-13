/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.initMouse = function () {
  var scope = this;

  // Mouse position object
  var mousePos = {
    curr: {
      x: 0,
      y: 0
    },
    start: {
      x: 0,
      y: 0
    }
  };

  // Binding event listeners
  scope.win.addEventListener('contextmenu', onContextMenu, false);
  scope.win.addEventListener('wheel', onWheel, false);
  scope.win.addEventListener('mousedown', onMouseDown, false);

  // Event functions
  function onMouseDown (event) {
    event.preventDefault();

    if (event.button === 0) {
      scope.MODE = 0;
    } else if (event.button === 1) {
      scope.MODE = 1;
    } else if (event.button === 2) {
      scope.MODE = 2;
    }

    setPos(mousePos.start, event);

    scope.win.addEventListener('mousemove', onMouseMove, false);
    scope.win.addEventListener('mouseup', onMouseUp, false);
  }

  function onMouseMove (event) {
    event.preventDefault();
    setPos(mousePos.curr, event);
  }

  function onMouseUp (event) {
    event.preventDefault();
    scope.win.removeEventListener('mousemove', onMouseMove, false);
  }

  function onContextMenu (event) {
    event.preventDefault();
  }

  function onWheel (event) {
    event.preventDefault();
    //console.log(event.deltaY);
  }

  // Helper functions
  function setPos (obj, event) {
    obj.x = event.clientX;
    obj.y = event.clientY;
  }

};
