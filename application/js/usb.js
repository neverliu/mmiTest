/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: usb.js
// * Description: mmitest -> test item: usb test.
// * Note: check usb
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [usb.js] = ' + s + '\n');
  }
}

var UsbTest = new TestItem();
UsbTest.result = {charger: false, usb: false};

UsbTest.check = function() {
  var allDone = true;

  for (var i in this.result) {
    if (!this.result[i]) {
      allDone = false;
      break;
    }
  }

  if (allDone) {
    this.failButton.disabled = '';
    this.passButton.disabled = '';
  }
};


UsbTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  this.displayUsbInfo();
  return false;
};

UsbTest.displayUsbInfo = function() {
  var battery = window.navigator.battery;
  if (battery.charging) {
    // charging, check usb cable.
    document.getElementById('cable').innerHTML = 'Please check.';
    document.getElementById('charger').innerHTML = 'Charger: OK';
    this.result.charger = true;

    if (navigator.engmodeExtension) {
      var self = this;
      // if get usb status immediately, the status would be DISCONNECTED
      setTimeout(function() {
        var request = navigator.engmodeExtension.getSysInfo('USB_CONNECT');
        request.onsuccess = function() {
          var isUsb = request.result;
          if (isUsb) {
            document.getElementById('usb').innerHTML = 'USB: OK';
            self.result.usb = true;
            self.check();
          }
        };
        request.onerror = function() {
          debug('get USB_CONNECT failed-------------');
        };
      }, 1000);
    }
  } else {
    document.getElementById('cable').innerHTML = 'Please insert cable.';
    document.getElementById('charger').innerHTML = 'unknown';
    document.getElementById('usb').innerHTML = 'unknown';
  }
};

/*--the following are inherit functions--*/
UsbTest.onInit = function() {
  var battery = window.navigator.battery;
  battery.addEventListener('chargingchange', this);

  this.passButton.disabled = 'disabled';
  this.failButton.disabled = '';
  this.displayUsbInfo();
};

UsbTest.onDeinit = function() {
  var battery = window.navigator.battery;
  battery.removeEventListener('chargingchange', this);
};

window.addEventListener('load', UsbTest.init.bind(UsbTest));
window.addEventListener('beforeunload', UsbTest.uninit.bind(UsbTest));
window.addEventListener('keydown', UsbTest.handleKeydown.bind(UsbTest));
