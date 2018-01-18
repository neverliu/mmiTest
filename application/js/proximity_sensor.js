/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: proximity_sensor.js
// * Description: mmitest -> test item: proximity sensor test.
// * Note:
// ************************************************************************

/* global TestItem */
'use strict';

var PSensorTest = new TestItem();

PSensorTest.result = {far: false, near: false};
PSensorTest.check = function() {
  var allDone = true;
  for (var i in this.result) {
    if (!this.result[i]) {
      allDone = false;
      break;
    }
  }

  if (allDone) {
    this.passButton.disabled = '';
    this.failButton.disabled = '';
    // pass the test automatically
    if (parent.AutoTest !== undefined) {
      var event = {type: 'click', name: 'pass'};
      parent.AutoTest.handleEvent.call(parent.AutoTest, event);
    }
  }
};

PSensorTest.onPsensorEvent = function(dir) {
  switch (dir) {
    case 'far':
      this.result.far = true;
      document.getElementById('far').innerHTML = 'far: OK';
      break;

    case 'near':
      this.result.near = true;
      document.getElementById('near').innerHTML = 'near: OK';
      break;
  }

  this.check();
};

//the following are inherit functions
PSensorTest.onInit = function() {
  window.addEventListener('userproximity', this);

  if (parent.AutoTest !== undefined) {
    this.passButton.disabled = 'disabled';
    this.failButton.disabled = 'disabled';
  }
};

PSensorTest.onDeinit = function() {
  window.removeEventListener('userproximity', this);
};

PSensorTest.onHandleEvent = function(evt) {
  switch (evt.type) {
    case 'userproximity':
      if (evt.near) {
        this.onPsensorEvent('near');
      } else {
        this.onPsensorEvent('far');
      }
      break;
  }
  return false;
};

window.addEventListener('load', PSensorTest.init.bind(PSensorTest));
window.addEventListener('beforeunload', PSensorTest.uninit.bind(PSensorTest));
