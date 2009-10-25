/**
 * Dom
 * Shortcuts for common DOM operations.
 */

function createText(txt) {
  return document.createTextNode(txt); 
}

function createEl(el) {
  return document.createElement(el); 
}

function getEl(id) {
  return document.getElementById(id);
}

function query(sel) {
  return document.querySelectorAll(sel);
}

function clickElement(el) {
  var evt = document.createEvent('MouseEvents');
  evt.initMouseEvent('click', true, true, window,
      0, 0, 0, 0, 0, false, false, false, false, 0, null);
  el.dispatchEvent(evt);
}