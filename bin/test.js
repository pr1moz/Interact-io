/*
 * Created by: Primoz Kos
 * On: 2016-07-12
 */

TEST = function () {
  var scope = this;
  this.win = window;
  this.doc = document;

  this.mousePos = {
    x: 0,
    y: 0
  };

  this.keyPress = {
    key: null
  };

  this.gamepad = {};

  this.mouseEl = this.doc.getElementById('mouse');
  this.keyEl = this.doc.getElementById('keyboard');
  this.padEl = this.doc.getElementById('gamepad').getElementsByClassName('axis');
  this.leapEl = this.doc.getElementById('leap').getElementsByClassName('data')[0];

  this.onMouseMove = function (event) {
    scope.mousePos.x = event.clientX;
    scope.mousePos.y = event.clientY;
  };

  this.onKeyDown = function (event) {
    scope.keyPress.key = event.keyCode;
  };

  this.leap = Leap.loop({enableGestures:true}, function(frame){
    scope.leap.currentFrame = frame;
    scope.leap.previousFrame = scope.leap.frame(1);
  });

  this.render = function () {
    var i;
    var values;

    scope.mouseEl.getElementsByClassName('pos-x')[0].innerHTML = scope.mousePos.x;

    scope.mouseEl.getElementsByClassName('pos-y')[0].innerHTML = scope.mousePos.y;
    scope.keyEl.getElementsByClassName('key')[0].innerHTML = scope.keyPress.key;

    scope.gamepad = (typeof navigator.getGamepads === "function" ? navigator.getGamepads() : void 0) ||
      (typeof navigator.webkitGetGamepads === "function" ? navigator.webkitGetGamepads() : void 0) || [];

    if (scope.gamepad[0]) {
      for (i = 0; i < 6; i++) {
        scope.padEl[i].innerHTML = scope.gamepad[0].axes[i].toFixed(2);
      }
    }

    // scope.leapEl.innerHTML = scope.leap.lastFrame.dump();

    if (scope.leap.currentFrame && scope.leap.currentFrame.hands.length > 0) {
      values = '<p>Hand: ' + scope.leap.currentFrame.hands[0].type + '</p>' +
          '<p>Is tracking (index finger extended): ' + scope.leap.currentFrame.hands[0].pointables[1].extended + '</p>';

      if (scope.leap.currentFrame.hands[0].pointables[1].extended) {
        values += '<p>X:' + (scope.leap.previousFrame.hands[0].palmPosition[0] - scope.leap.currentFrame.hands[0].palmPosition[0]) + '</p>' +
                  '<p>Y:' + (scope.leap.previousFrame.hands[0].palmPosition[1] - scope.leap.currentFrame.hands[0].palmPosition[1]) + '</p>' +
                  '<p>Z:' + (scope.leap.previousFrame.hands[0].palmPosition[2] - scope.leap.currentFrame.hands[0].palmPosition[2]) + '</p>';
      }

      if (scope.leap.currentFrame.hands.length === 2) {
        values += '<p>Scale:' + scope.leap.currentFrame._scaleFactor + '</p>';
      }

      scope.leapEl.innerHTML = values;
    }

    scope.win.requestAnimationFrame(scope.render);
  };

  this.win.addEventListener('mousemove', scope.onMouseMove, false);
  this.win.addEventListener('keydown', scope.onKeyDown, false);

  this.render();
};

var test = new TEST();
