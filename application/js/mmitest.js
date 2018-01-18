/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: mmitest.js
// * Description: mmitest -> main page.
// * Note: has auto and manu parts.
// ************************************************************************

/* exported DEBUG */
'use strict';

const DEBUG = true;
var settings = navigator.mozSettings;

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [mmitest.js] = ' + s + '\n');
  }
}

function $(id) {
  return document.getElementById(id);
}

// ------------------------------------------------------------------------
var MMITest = {
  enterAutoTest: function MMITest_enterAutoTest() {
    window.location = './tests/auto.html';
  },

  enterManuTest: function MMITest_enterManuTest() {
    window.location = './tests/manu.html';
  },

  get autoButton() {
    delete this.autoButton;
    return this.autoButton = document.getElementById('autoButton');
  },

  get manuButton() {
    delete this.manuButton;
    return this.manuButton = document.getElementById('manuButton');
  },

  disableNfc: function ut_disableNfc() {
    if (!navigator.mozNfc) {
      return;
    }

    let NFC_KEY = 'nfc.enabled';
    settings.createLock().get(NFC_KEY).then((result) => {
      if (result[NFC_KEY] || navigator.mozNfc.enabled) {
        let options = {};
        options[NFC_KEY] = false;
        settings.createLock().set(options);
      }
    }).catch((error) => {
      debug('MMITest desable NFC error: ' + error.name);
    });
  },

  getDateTime: function MMITest_getDateTime(buildId) {
    var dateTimeStr = '';
    var dateStr = buildId.substring(0, 8);
    dateTimeStr = dateStr.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');

    var timeStr = buildId.substring(8);
    dateTimeStr =
      dateTimeStr + ' ' + timeStr.replace(/^(\d{2})(\d{2})(\d{2})$/, '$1:$2:$3');

    return dateTimeStr;
  },

  getDeviceInfo: function MMITest_getDeviceInfo() {
    var _self = this;
    const VERSION_KEY = 'deviceinfo.build_number';
    const BUILD_TIME_KEY = 'deviceinfo.platform_build_id';

    Promise.all([
      settings.createLock().get(VERSION_KEY),
      settings.createLock().get(BUILD_TIME_KEY)
    ]).then((results) => {
      $('version').textContent = 'Version: ' + results[0][VERSION_KEY];
      $('build-time').textContent =
        'Build Time: ' + _self.getDateTime(results[1][BUILD_TIME_KEY]);
    }).catch((error) => {
      $('version').textContent = 'SW: Demo';
      debug('Failed to get device info error: ' + error.name);
    });
  },

  init: function MMITest_init() {
    this.autoButton.addEventListener('click', this);
    this.manuButton.addEventListener('click', this);

    // Show the device software version and build time.
    this.getDeviceInfo();

    // We will enable the NFC in the testing script file,
    // so we need to disable the NFC first.
    this.disableNfc();

    // Dont let the phone go to sleep while in mmitest.
    // user must manually close it
    if (navigator.requestWakeLock) {
      navigator.requestWakeLock('screen');
    }

    /*
     * Disable airplaneMode in mmitest to avoid fm test init fail
     */
    settings.createLock().set({'airplaneMode.enabled': false});
  },

  handleEvent: function MMITest_handleEvent(evt) {
    switch (evt.type) {
      case 'click':
        switch (evt.target) {
          case this.autoButton:
            this.enterAutoTest();
            break;

          case this.manuButton:
            this.enterManuTest();
            break;
        }
        break;
    }
  },

  handleKeydown: function MMITEST_handleKeyDown(event) {
    event.preventDefault();
    switch (event.key){
      case 'SoftLeft':
        this.autoButton.click();
        break;
      case 'SoftRight':
        this.manuButton.click();
        break;
      case 'Backspace':
      case 'EndCall':
        window.close();
        break;
    }
  }
};

window.onload = MMITest.init.bind(MMITest);
window.addEventListener('keydown', MMITest.handleKeydown.bind(MMITest));
