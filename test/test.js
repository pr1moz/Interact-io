/*
 * Created by: Primoz Kos
 * On: 2016-07-12
 */

TEST = function () {
  var scope = this;
  this.win = window;
  this.doc = document;

  this.mouse = {
    x: 0,
    y: 0
  };

  this.keyboard = {
    key: null
  };

  this.gamepad = {};

  this.mouseEl = this.doc.getElementById('mouse');
  this.keyEl = this.doc.getElementById('keyboard');
  this.padEl = this.doc.getElementById('gamepad').getElementsByClassName('axis');
  this.leapEl = this.doc.getElementById('leap').getElementsByClassName('data')[0];

  this.onMouseMove = function (event) {
    scope.mouse.x = event.clientX;
    scope.mouse.y = event.clientY;
  };

  this.onKeyDown = function (event) {
    scope.keyboard.key = event.keyCode;
  };

  this.leap = Leap.loop({enableGestures:true}, function(frame){
    scope.leap.currentFrame = frame;
    scope.leap.previousFrame = scope.leap.frame(1);
    scope.leap.tenFramesBack = scope.leap.frame(10);
  });

  this.render = function () {
    var i;
    scope.mouseEl.getElementsByClassName('pos-x')[0].innerHTML = scope.mouse.x;

    scope.mouseEl.getElementsByClassName('pos-y')[0].innerHTML = scope.mouse.y;
    scope.keyEl.getElementsByClassName('key')[0].innerHTML = scope.keyboard.key;

    scope.gamepad = (typeof navigator.getGamepads === "function" ? navigator.getGamepads() : void 0) ||
      (typeof navigator.webkitGetGamepads === "function" ? navigator.webkitGetGamepads() : void 0) || [];

    if (scope.gamepad[0]) {
      for (i = 0; i < 6; i++) {
        scope.padEl[i].innerHTML = scope.gamepad[0].axes[i].toFixed(2);
      }
    }

    scope.leapEl.innerHTML = scope.leap.lastFrame.dump();

    scope.win.requestAnimationFrame(scope.render);
  };

  this.win.addEventListener('mousemove', scope.onMouseMove, false);
  this.win.addEventListener('keydown', scope.onKeyDown, false);

  this.render();
};

var test = new TEST();
