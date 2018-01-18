/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: lcd.js
// * Description: mmitest -> test item: lcd test.
// * Note:
// ************************************************************************

/* global TestItem */
'use strict';

const EVERY_STEP_DURING_TIME = 2000;
var LcdTest = new TestItem();

LcdTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  switch (evt.type) {
    case 'keydown':
      switch (evt.key) {
        case 'Enter':
          this.passButton.style.visibility = 'hidden';
          this.failButton.style.visibility = 'hidden';
          this._timer = window.setTimeout(this.timeoutCallback.bind(this), 500);
          break;
      }
      break;
  }
  return false;
};

LcdTest.timeoutCallback = function() {
  this.passButton.disabled = '';
  this.failButton.disabled = '';
  this.passButton.style.visibility = 'visible';
  this.failButton.style.visibility = 'visible';
};

LcdTest.showStep = function() {
  for (var i = 0, len = this.stepEls.length; i < len; i ++) {
    if (parseInt(this.stepEls[i].dataset.value) === this.step) {
      this.stepEls[i].classList.remove('hidden');
    } else {
      this.stepEls[i].classList.add('hidden');
    }
  }

  this.step++;

  if (this.step < 6) {
    this._stepTimer = window.setTimeout(() => {
      this.showStep();
    }, EVERY_STEP_DURING_TIME);
  }
};

LcdTest.onInit = function() {
  this.step = 1;
  this.stepEls = document.querySelectorAll('.step');

  this.passButton.style.visibility = 'hidden';
  this.failButton.style.visibility = 'hidden';
  this.passButton.disabled = 'disabled';
  this.failButton.disabled = 'disabled';
  this.showStep();

  this._timer = window.setTimeout(this.timeoutCallback.bind(this), 500);
};

LcdTest.onDeinit = function() {
  clearTimeout(this._timer);
  clearTimeout(this._stepTimer);
};

window.addEventListener('load', LcdTest.init.bind(LcdTest));
window.addEventListener('beforeunload', LcdTest.uninit.bind(LcdTest));
window.addEventListener('keydown', LcdTest.handleKeydown.bind(LcdTest));
