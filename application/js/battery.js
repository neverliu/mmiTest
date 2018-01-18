/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: battery.js
// * Description: mmitest -> test item: battery temperature test.
// * Note:
// ************************************************************************

/* global TestItem */
'use strict';

function $(id) {
  return document.getElementById(id);
}

var BatteryTest = new TestItem();

//the following are inherit functions
BatteryTest.onInit = function() {
  this.passButton.disabled = 'disabled';

  if (navigator.engmodeExtension) {
    var request = navigator.engmodeExtension.getSysInfo('BATTERY_TEMP');
    var self = this;
    request.onsuccess = function() {
      var temp = request.result;
      $('temp_current').innerHTML = 'Now: ' + (temp / 10) + '°C';
      $('content_current').innerHTML = 'Now: ' + navigator.engmodeExtension.fileReadLE('batterycapacity') + '%';
      $('battery_voltage').innerHTML = 'Voltage now: ' +
          (navigator.engmodeExtension.fileReadLE('batteryvoltage_now') / 1000000).toFixed(2) + 'V';
      var present = navigator.engmodeExtension.fileReadLE('battery_present');
      $('battery_present').innerHTML = 'Battery Present is ' + present;

      if (present == 1) {
        self.passButton.disabled = '';
        self.autoPass(1000);
      } else {
        self.passButton.disabled = 'disabled';
      }
    };

    request.onerror = function() {
      $('centertext').innerHTML = 'get battery info failed.';
    };
  } else {
    $('centertext').innerHTML = 'engmodeExtension Not support';
  }
};

BatteryTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  return false;
};

window.addEventListener('load', BatteryTest.init.bind(BatteryTest));
window.addEventListener('beforeunload', BatteryTest.uninit.bind(BatteryTest));
window.addEventListener('keydown', BatteryTest.handleKeydown.bind(BatteryTest));
