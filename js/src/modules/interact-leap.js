/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

INTERACT.prototype.initLeap = function () {
  var scope = this;

  this.leap = Leap.loop({enableGestures:true}, function(frame){
    leap.currentFrame = frame;
    leap.previousFrame = scope.leap.frame(1);
    leap.tenFramesBack = scope.leap.frame(10);
  });

  // leap.currentFrame.dump();

};
