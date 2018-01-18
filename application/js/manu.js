/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: manu.js
// * Description: mmitest -> manual test part.
// * Note: When you want to add a new test item, just add the html file
// *       name in manu.html
// ************************************************************************

/* global dump */
'use strict';

const DEBUG = true;
function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [manu.js] = ' + s + '\n');
  }
}

var TestItemArray = ['LCD test', 'Keypad Test', 'Backlight test'
  , 'Camera test', 'Flashlight test', 'RTC test'
  , 'Audio test', 'Vibrator test', 'Accessories test'
  , 'FM test', 'Charging test', 'SIM test'
  , 'Micro SD test', 'Battery test', 'NFC test'
  , 'Wifi test', 'Bluetooth test', 'GPS test'
  , 'Call test', 'FactoryReset test', 'Exit'
  , 'Test Result'];

var cameras = navigator.mozCameras.getListOfCameras();
if (cameras.length == 2) {
  var index = TestItemArray.indexOf('Camera test');
  if (index > 0 && index < TestItemArray.length) {
    TestItemArray.splice(index + 1, 0, 'Front Camera');
    TestItemArray.splice(index, 1, 'Main Camera');
  }
}

var appArray = [];
var manuList = null;

//-------------------------------------------------------------------------
var ManuTest = {
  get iframe() {
    return document.getElementById('test-iframe');
  },

  createListItem: function ut_createListItem(name, info) {
    var liNode = document.createElement('li');
    var aNode = document.createElement('a');
    var hrefString = '#test=' + name;
    aNode.innerHTML = info;
    aNode.setAttribute('href', hrefString);
    liNode.appendChild(aNode);
    var element = document.getElementById('test-list');
    element.appendChild(liNode);
  },

  loadConfig: function ut_loadConfig() {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', '../resource/config.json', true);
    xhr.send(null);
    xhr.onreadystatechange = function cc_loadConfiguration() {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status === 0 || xhr.status === 200) {
        var list = JSON.parse(xhr.responseText);
        for (var i = 0; i < list.testItems.length; i++) {
          debug('name = ' + list.testItems[i].itemName + ' | ' + list.testItems[i].itemInfo);
          if ('true' === list.testItems[i].manuTest[0].testFlag) {
            ManuTest.createListItem(list.testItems[i].itemName, list.testItems[i].itemInfo);
          }
        }
      }
    };
  },

  loadTestItems: function ut_loadTestItems() {
    appArray = TestItemArray;

    // Hiding the NFC testing if device not support it.
    if (!navigator.mozNfc) {
      debug('ManuTest: device don\'t support NFC.');
      var index = appArray.indexOf('NFC test');
      appArray.splice(index, 1);
    }

    manuList = document.getElementById('manuList');
    if (manuList) {
      manuList.setGcListLength(appArray.length, 0);
      manuList.createOrUpdateListUI();
      manuList.focus();
    }
    manuList.addEventListener('select', function(event){
      var selectItem = appArray[event.detail.selectedIndex];
      var testlocation = '';
      switch(selectItem) {
        case 'Traceability':
          testlocation = '#test=traceability';
          break;
        case 'LCD test':
          testlocation = '#test=lcd';
          break;
        case 'Keypad Test':
          testlocation = '#test=keypad';
          break;
        case 'Keypad LED':
          testlocation = '#test=keypad_led';
          break;
        case 'Backlight test':
          testlocation = '#test=backlight';
          break;
        case 'Camera test':
        case 'Main Camera':
          testlocation = '#test=camera';
          break;
        case 'Front Camera':
          testlocation = '#test=camera_front';
          break;
        case 'Flashlight test':
          testlocation = '#test=flashlight';
          break;
        case 'RTC test':
          testlocation = '#test=rtc';
          break;
        case 'Audio test':
          testlocation = '#test=audio';
          break;
        case 'Vibrator test':
          testlocation = '#test=vibrate';
          break;
        case 'Accessories test':
          testlocation = '#test=accessories';
          break;
        case 'Charging test':
          testlocation = '#test=charger';
          break;
        case 'USB test':
          testlocation = '#test=usb';
          break;
        case 'G-sensor test':
          testlocation = '#test=gsensor';
          break;
        case 'SIM test':
          testlocation = '#test=sim';
          break;
        case 'Micro SD test':
          testlocation = '#test=sdcard';
          break;
        case 'Battery test':
          testlocation = '#test=battery';
          break;
        case 'NFC test':
          testlocation = '#test=nfc';
          break;
        case 'Bluetooth test':
          testlocation = '#test=bluetooth';
          break;
        case 'Wifi test':
          testlocation = '#test=wifi';
          break;
        case 'FM test':
          testlocation = '#test=fm';
          break;
        case 'GPS test':
          testlocation = '#test=gps';
          break;
        case 'Calling test':
          testlocation = '#test=dialer';
          break;
        case 'Phone IMEI':
          testlocation = '#test=phone_imei';
          break;
        case 'Call test':
          testlocation = '#test=call';
          break;
        case 'FactoryReset test':
          testlocation = '#test=factory_reset';
          break;
        case 'Test Result':
          testlocation = '#test=test_result';
          break;
        case 'Exit':
          window.close();
          break;
      }
      if (testlocation) {
        window.location.hash = testlocation;
        ManuTest.triggerHashChangeEvent();
      }
    });

  },

  triggerHashChangeEvent: function() {
    var name = this.getNameFromHash();
    if (!name) {
      this.closeTest();
      return;
    }
    this.openTest(name);
  },

  startGps: function _startGps() {
    if (navigator.engmodeExtension) {
      navigator.engmodeExtension.startGpsTest();
    }
  },

  stopGps: function _stopGps() {
    if (navigator.engmodeExtension) {
      navigator.engmodeExtension.stopGpsTest();
    }
  },

  init: function ut_init() {
    this.loadTestItems();

    // start gps  to speed up test result.
    this.startGps();
    // Dont let the phone go to sleep while in mmitest.
    // user must manually close it
    if (navigator.requestWakeLock) {
      navigator.requestWakeLock('screen');
    }

    this.iframe.addEventListener('load', this);
    this.iframe.addEventListener('unload', this);

    document.body.addEventListener('transitionend', this);

    window.addEventListener('hashchange', this);

    // Init test result list in asycstorage
    ResultManager.getResultList();
  },

  phasecheckLockInfo: function(info) {
    var isAllPass = false;
    var array = info.split('\n');

    function nameisMMI(str) {
      return str.indexOf('MMI') !== -1;
    }

    function valueisPass(str) {
      return str.indexOf('Pass') !== -1;
    }

    isAllPass = array.some(function(str) {
      var sub = str.split(' ');
      return (nameisMMI(sub[0]) && valueisPass(sub[1]));
    });

    return isAllPass;
  },

  getNameFromHash: function ut_getNameFromHash() {
    return (/\btest=(.+)(&|$)/.exec(window.location.hash) || [])[1];
  },

  handleEvent: function ut_handleEvent(ev) {
    switch (ev.type) {
      case 'click':
        if (ev.name === 'pass') {
          ResultManager.saveResult(this.currentTest, 'pass');
        } else if (ev.name == 'fail') {
          ResultManager.saveResult(this.currentTest, 'fail');
        }

        if (window.location.hash) {
          window.location.hash = '';
          ManuTest.triggerHashChangeEvent();
          manuList.focus();
        }
        break;

      case 'transitionend':
        var name = this.getNameFromHash();
        if (!name) {
          this.iframe.src = 'about:blank';
        }
        break;
    }
  },

  openTest: function ut_openTest(name) {
    document.body.classList.add('test');

    var self = this;
    window.setTimeout(function openTestPage() {
      self.iframe.src = name + '.html';
      self.iframe.focus();
    }, 200);

    this.currentTest = name;
  },

  closeTest: function ut_closeTest() {
    var isOpened = document.body.classList.contains('test');
    if (!isOpened) {
      return false;
    }
    document.body.classList.remove('test');
    return true;
  },

  handleKeydown: function ut_handleKeydown(evt) {
    evt.preventDefault();
    if (evt.key === 'Backspace') {
      this.stopGps();
      window.location = '../index.html';
    }
  }
};

window.onload = ManuTest.init.bind(ManuTest);
window.GaiaGcList.prototype.getElementContent = function(index) {
  if (index < 0 || index > (appArray.length - 1)) {
    return null;
  }
  return appArray[index];
};
window.addEventListener('keydown', ManuTest.handleKeydown.bind(ManuTest));
