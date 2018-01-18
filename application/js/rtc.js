/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: rtc.js
// * Description: mmitest -> test item: RTC test.
// * Note:
// ************************************************************************

/* global TestItem */
'use strict';

var RtcTest = new TestItem();

RtcTest.onHandleEvent = function(evt) {
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

RtcTest.timeoutCallback = function() {
  this.passButton.disabled = '';
  this.failButton.disabled = '';
  this.passButton.style.visibility = 'visible';
  this.failButton.style.visibility = 'visible';
  this.autoPass(2000);
};

RtcTest.updateTime = function() {
  var now = new Date();
  this.time.textContent = now.toTimeString();
};

RtcTest.onInit = function() {
  this.time = document.getElementById('rtc-time');
  this.passButton.style.visibility = 'hidden';
  this.failButton.style.visibility = 'hidden';
  this.passButton.disabled = 'disabled';
  this.failButton.disabled = 'disabled';

  this.updateTime();
  this._intervalId = window.setInterval(this.updateTime.bind(this), 1000);
  this._timer = window.setTimeout(this.timeoutCallback.bind(this), 500);
};

RtcTest.onDeinit = function() {
  clearInterval(this._intervalId);
  clearTimeout(this._timer);
};

window.addEventListener('load', RtcTest.init.bind(RtcTest));
window.addEventListener('beforeunload', RtcTest.uninit.bind(RtcTest));
window.addEventListener('keydown', RtcTest.handleKeydown.bind(RtcTest));
