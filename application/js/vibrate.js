/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: vibrate.js
// * Description: mmitest -> test item: vibrate test.
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [vibrate.js] = ' + s + '\n');
  }
}

function $(id) {
  return document.getElementById(id);
}

// ------------------------------------------------------------------------
const TOTAL_DURATION = 1500;

var Vibrate = new TestItem();

Vibrate._vibrateInterval = null;

Vibrate.centertext = ['Is vibrator on?', 'Test finished.'];

Vibrate.timeOutCallback = function() {
  $('centertext').innerHTML = this.centertext[1];
  $('retestButton').style.visibility = 'visible';
  this.passButton.disabled = '';
  this.failButton.disabled = '';
};

Vibrate.startTest = function() {
  debug('Vibrate.startTest');
  $('centertext').innerHTML = this.centertext[0];
  $('retestButton').style.visibility = 'hidden';
  this.passButton.disabled = 'disabled';
  this.failButton.disabled = 'disabled';

  this._vibrateInterval = setInterval(function(){
    navigator.vibrate(TOTAL_DURATION);
  }, TOTAL_DURATION);

  if ('vibrate' in navigator) {
    navigator.vibrate(TOTAL_DURATION);
  }
  window.setTimeout(this.timeOutCallback.bind(this), TOTAL_DURATION);
};

//the following are inherit functions
Vibrate.onInit = function() {
  debug('Vibrate.onInit');
  $('retestButton').addEventListener('click', this);

  this.startTest();
};


Vibrate.onDeinit = function(){
  if (this._vibrateInterval) {
    window.clearInterval(this._vibrateInterval);
    this._vibrateInterval = null;
  }
};

Vibrate.onHandleEvent = function(evt) {
  evt.preventDefault();
  switch (evt.type) {
    case 'click':
      switch (evt.target) {
        case $('retestButton'):
          this.startTest();
          break;
      }
      break;
  }
  return false;
};

window.addEventListener('load', Vibrate.init.bind(Vibrate));
window.addEventListener('beforeunload', Vibrate.uninit.bind(Vibrate));
window.addEventListener('keydown', Vibrate.handleKeydown.bind(Vibrate));
