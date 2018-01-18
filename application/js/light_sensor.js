/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: light_sensor.js
// * Description: mmitest -> test item: light sensor test.
// * Note:
// ************************************************************************

/* global TestItem */
'use strict';

var LightSensorTest = new TestItem();

LightSensorTest.result = {dark: false, bright: false};

LightSensorTest.check = function() {
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

LightSensorTest.onPsensorEvent = function(dir) {
  switch (dir) {
    case 'dark':
      this.result.dark = true;
      document.getElementById('dark').innerHTML = 'dark: OK';
      break;

    case 'bright':
      this.result.bright = true;
      document.getElementById('bright').innerHTML = 'bright: OK';
      break;
  }

  this.check();
};

//the following are inherit functions
LightSensorTest.onInit = function() {
  window.addEventListener('devicelight', this);
  if (parent.AutoTest !== undefined) {
    this.passButton.disabled = 'disabled';
    this.failButton.disabled = 'disabled';
  }
};

LightSensorTest.onDeinit = function() {
  window.removeEventListener('devicelight', this);
};

LightSensorTest.onHandleEvent = function(evt) {
  switch (evt.type) {
    case 'devicelight':
      document.getElementById('centertext').innerHTML =
          'ambient light is ' + evt.value;

      if (evt.value < 50) {
        this.onPsensorEvent('dark');
      } else {
        this.onPsensorEvent('bright');
      }
      break;
  }

  return false;
};

window.addEventListener('load', LightSensorTest.init.bind(LightSensorTest));
window.addEventListener('beforeunload', LightSensorTest.uninit.bind(LightSensorTest));
