/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.initGamepad = function () {
  var scope = this;

  var gamepad = {};

  // loop to check axes values
  var loop = function () {
    gamepad = navigator.getGamepads()[0];

    scope.win.requestAnimationFrame(loop);
  };

};
