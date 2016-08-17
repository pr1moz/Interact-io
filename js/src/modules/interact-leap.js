/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.initLeap = function () {
  var scope = this;
  var i;
  var len;
  var timer;

  this.INPUTLIST.LEAP = 3;

  // Leap frames
  var curr;
  var prev;
  var last;

  // Hands objects
  var left = {
    id: null,
    tracking: false
  };
  var right = {
    id: null,
    tracking: false
  };

  var prevZoom = 0;

  // Set up Leap Motion controller
  this.leap = new Leap.Controller();
  this.leap.connect();

  // Bind listening events
  this.leap.on('streamingStarted', startUpdating);
  this.leap.on('streamingStopped', stopUpdating);

  function startUpdating () {
    timer = setInterval(update, scope.timerInterval);
  }

  function stopUpdating () {
    clearInterval(timer);
  }

  function update () {
    curr = scope.leap.frame(0);
    prev = scope.leap.frame(1);
    last = scope.leap.frame(10);

    if (curr.hands.length && prev.hands.length) {
      scope.INPUT.set(scope.INPUTLIST.LEAP);

      // Check and store hands
      for (i = 0, len = curr.hands.length; i < len; i++) {
        if (curr.hands[i].confidence > scope.leapThreshold) {
          if (curr.hands[i].type === 'left') {
            left.id = i;
            left.tracking = !curr.hands[i].fingers[scope.leapTriggerFinger].extended;
          } else {
            right.id = i;
            right.tracking = !curr.hands[i].fingers[scope.leapTriggerFinger].extended;
          }
        }
      }

      // Check which hands are tracking and calculate deltas
      if (left.tracking && right.tracking) {

        // Zoom with both hands
        scope.MODE.set(scope.MODELIST.ZOOM);
        zoom(curr, prev);
        scope.zoomChanged = true;

      } else if (left.tracking) {

        // Rotate with left hand
        scope.MODE.set(scope.MODELIST.ROTATE);
        if (prev.hands[left.id]) {
          rotate(getDelta(curr.hands[left.id].palmPosition, prev.hands[left.id].palmPosition));
        }

      } else if (right.tracking) {

        // Pan with right hand
        scope.MODE.set(scope.MODELIST.PAN);
        if (prev.hands[right.id]) {
          pan(getDelta(curr.hands[right.id].palmPosition, prev.hands[right.id].palmPosition));
          scope.panChanged = true;
        }

      } else {
        scope.MODE.set(scope.MODELIST.NONE);
        prevZoom = curr.scaleFactor(prev);
      }

      scope.win.dispatchEvent(scope.events.updateView(scope.INPUT.get()));

    } else {
      scope.MODE.set(scope.MODELIST.NONE);
    }

    left.tracking = right.tracking = false;
  }

  function getDelta (curr, prev) {
    return {
      x: (curr[0] - prev[0]),
      y: (curr[1] - prev[1])
    };
  }

  function rotate (delta) {
    scope.sphericalDelta.rotateLeft(2 * Math.PI * delta.x / scope.container.clientWidth * scope.leapSensitivity);
    scope.sphericalDelta.rotateUp(2 * Math.PI * (-delta.y) / scope.container.clientWidth * scope.leapSensitivity);
  }

  function pan (delta) {
    scope.panDelta.set(delta.x * scope.panSpeed, -delta.y * scope.panSpeed);
    scope.panChanged = true;
  }

  function zoom(curr, prev) {
    var currZoom = curr.scaleFactor(prev);
    scope.zoomDelta = (currZoom - 1) * scope.leapZoomSpeed;
    prevZoom = currZoom;
  }

};
