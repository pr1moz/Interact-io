/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

function INTERACT (cont) {

  // Set scope instead of binding this
  var scope = this;

  // browser window elements
  this.win = window;
  this.doc = document;
  this.container = cont;

  // Use this timer interval when an input updates periodically
  this.timerInterval = 30;

  // Current mode of interaction
  this.MODE = -1;
  // Possible modes
  this.MODELIST = {NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2};

  // Current input mode
  this.INPUT = -1;
  this.INPUTLIST = {NONE: -1};

  // Interaction modes modifiers
  this.zoomSpeed = 1.0;
  this.rotateSpeed = 1.0;

  this.keyRotateSpeed = 7.0; // in pixels
  this.keyZoomSpeed = 0.3;
  this.panSpeed = 7.0; // in pixels

  // SpaceNavigator
  this.gamepadThreshold = 0.01; // lower tracking threshold
  this.gamepadSensitivity = 1.2; // set rotate/pan gamepad sensitivity
  this.gamepadZoomSensitivity = 1.0; // set zoom gamepad sensitivity

  // Interaction events
  this.events = {
    updateView: function (source) {
      return new CustomEvent('updateView', { detail: source })
    },
    resetView: new Event('resetView')
  };

  this.panChanged = false;
  this.zoomChanged = false;

  // Objects shared between inputs and renderer
  // Spherical coordinate system delta
  this.sphericalDelta = new INTERACT.Spherical;
  // Panning delta
  this.panDelta = new INTERACT.Vector3;
  // Zoom delta
  this.zoomDelta = 0;

}

// Set up object types needed
// 2D vector
INTERACT.Vector2 = function (x, y) {
  this.x = x || 0;
  this.y = y || 0;
  return this;
};

// 3D vector
INTERACT.Vector3 = function (x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
};

// Spherical coordinate system
INTERACT.Spherical = function (radius, phi, theta) {
  this.radius = radius || 1.0;
  this.phi = phi || 0;
  this.theta = theta || 0;
};

// Object types functions
INTERACT.Vector2.prototype = {
  set: function (x, y) {
    this.x = x;
    this.y = y;
    return this;
  },
  copy: function (a) {
    this.x = a.x;
    this.y = a.y;
    return this;
  },
  copyMouseEv: function (e) {
    this.x = e.clientX;
    this.y = e.clientY;
    return this;
  },
  getDelta: function (a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  },
  length: function () {
    return Math.sqrt( this.x * this.x + this.y * this.y );
  }
};

INTERACT.Vector3.prototype = {
  set: function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  },
  copy: function (a) {
    this.x = a.x || 0;
    this.y = a.y || 0;
    this.z = a.z || 0;
    return this;
  },
  getDelta: function (a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  },
  length: function () {
    return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
  }
};

INTERACT.Spherical.prototype = {
  set: function (radius, phi, theta) {
    this.radius = radius || 1.0;
    this.phi = phi || 0;
    this.theta = theta || 0;
    return this;
  },
  rotateLeft: function (angle) {
    if (angle) {
      this.theta -= angle;
    } else {
      this.theta = 0;
    }
    return this;
  },
  rotateUp: function (angle) {
    if (angle) {
      this.phi -= angle;
    } else {
      this.phi = 0;
    }
    return this;
  }
};
