/*
 * Created by: Primoz Kos
 * On: 2016-07-13
 */

function INTERACT () {

  // Set scope instead of binding this
  var scope = this;

  // browser window objects
  this.win = window;
  this.doc = document;
  this.container = document.getElementById('container');

  // Current mode of interaction
  // Possible: none (-1), rotate (0), pan (1), zoom (2)
  this.MODE = -1;

}
