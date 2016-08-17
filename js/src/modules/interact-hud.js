/*
 * Created by: Primoz Kos
 * On: 2016-08-17
 */

INTERACT.prototype.initHUD = function () {
  var scope = this;

  // Generate HTML structure
  generateHTML(scope);

  scope.win.addEventListener('modeChange', () => setModeBlock(event, 'mode', scope), false);
  scope.win.addEventListener('inputChange', () => setInputBlock(event, 'inputs', scope), false);

  // Reset inputs and modes after no activity
  scope.win.addEventListener('updateView', () => resetModes(scope), false);

};

setInputBlock = INTERACT.debounce((event, blockType, scope) => {
  var curr = document.querySelector(`.${blockType} .active`);
  var block = document.querySelector(`.${blockType} .${event.detail.toLowerCase()}`);
  curr ? curr.classList.remove('active') : null;
  block ? block.classList.add('active') : null;
}, 50, true);

setModeBlock = INTERACT.debounce((event, blockType, scope) => {
  var curr = document.querySelector(`.${blockType} .active`);
  var block = document.querySelector(`.${blockType} .${event.detail.toLowerCase()}`);
  curr ? curr.classList.remove('active') : null;
  block ? block.classList.add('active') : null;
}, 250, true);

resetModes = INTERACT.debounce((scope) => {
  scope.INPUT.set(scope.INPUTLIST.NONE);
  scope.MODE.set(scope.MODELIST.NONE);
}, 250);

function generateHTML (scope) {
  // Add CSS file for the HUD
  document.write('<link rel="stylesheet" type="text/css" href="css/hud.css">');

  // Create HUD container
  var hud = document.createElement('div');
  hud.id = 'hud';
  scope.body.appendChild(hud);

  // Add HUD contents
  var content = document.createElement('div');
  var html = '<div class="inputs">';

  for (input in scope.INPUTLIST) {
    html += `<div class="block ${input.toLowerCase()}"></div>`;
  }

  html += '</div>';
  content.innerHTML = html;

  // Append content to HUD
  hud.appendChild(content.firstChild);

  var html = '<div class="mode">';

  for (mode in scope.MODELIST) {
    html += `<div class="block ${mode.toLowerCase()}"></div>`;
  }

  html += '</div>';
  content.innerHTML = html;

  // Append content to HUD
  hud.appendChild(content.firstChild);
}
