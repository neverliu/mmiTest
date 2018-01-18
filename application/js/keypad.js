/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: key.js
// * Description: mmitest -> test item: key test.
// * Note:
// ************************************************************************

/* global TestItem */
'use strict';

var KeyPadTest = new TestItem();

KeyPadTest.result = {
  one: false,
  two: false,
  three: false,
  four: false,
  five: false,
  six: false,
  seven: false,
  eight: false,
  nine: false,
  star: false,
  zero: false,
  fourone: false,
  softleft: false,
  softright: false,
  arrowup: false,
  arrowdown: false,
  arrowleft: false,
  arrowright: false,
  backspace: false,
  enter: false,
  acacall: false
};

KeyPadTest.onHandleEvent = function (evt) {
  var keyId = '';
  evt.preventDefault();
  switch(evt.key) {
    case '1':
      keyId = 'one';
      break;
    case '2':
      keyId = 'two';
      break;
    case '3':
      keyId = 'three';
      break;
    case '4':
      keyId = 'four';
      break;
    case '5':
      keyId = 'five';
      break;
    case '6':
      keyId = 'six';
      break;
    case '7':
      keyId = 'seven';
      break;
    case '8':
      keyId = 'eight';
      break;
    case '9':
      keyId = 'nine';
      break;
    case '0':
      keyId = 'zero';
      break;
    case '*':
      keyId = 'star';
      break;
    case '#':
      keyId = 'fourone';
      break;
    case 'SoftLeft':
      keyId = 'softleft';
      break;
    case 'SoftRight':
      keyId = 'softright';
      this.failButton.disabled = '';
      break;
    case 'ArrowUp':
      keyId = 'arrowup';
      break;
    case 'ArrowDown':
      keyId = 'arrowdown';
      break;
    case 'ArrowLeft':
      keyId = 'arrowleft';
      break;
    case 'ArrowRight':
      keyId = 'arrowright';
      break;
    case 'Backspace':
      keyId = 'backspace';
      break;
    case 'Notification':
      keyId = 'message';
      break;
    case 'VolumeUp':
      keyId = 'volumeup';
      break;
    case 'VolumeDown':
      keyId = 'volumedown';
      break;
    case 'Enter':
      keyId = 'enter';
      break;
    case 'Call':
      keyId = 'acacall';
      break;
    case 'Camera':
      keyId = 'camera';
      break;
    case 'EndCall':
      keyId = 'power';
      break;
    case 'Flip':
      keyId = 'clam';
      break;
  }

  var rskResult = KeyPadTest.result['softright'];
  if (keyId) {
    document.getElementById(keyId).style.color = 'yellow';
    KeyPadTest.result[keyId] = true;
  }
  KeyPadTest.checkIfAllDone();

  return !((evt.key === 'SoftRight' || evt.key === 'SoftLeft') && rskResult);
};

KeyPadTest.checkIfAllDone = function() {
  var allDone = true;
  for (var i in KeyPadTest.result) {
    if (!KeyPadTest.result[i]) {
      allDone = false;
      break;
    }
  }
  if (allDone) {
    this.passButton.disabled = '';
    this.failButton.disabled = '';
  }
};

KeyPadTest.onkeyevent = function(evt) {
  if (evt.type == 'sleep-button-press'){
    document.getElementById('power').style.color = 'yellow';
    KeyPadTest.result['power'] = true;
    KeyPadTest.checkIfAllDone();
  }
};

KeyPadTest.showClam = function() {
  navigator.getFlipManager && navigator.getFlipManager().then((fm) => {
    this._flipManager = fm;
    this._flipManager.addEventListener('flipchange', function(){
      document.getElementById('clam').style.color = 'yellow';
      KeyPadTest.result['clam'] = true;
      KeyPadTest.checkIfAllDone();
    });
  });
};

//the following are inherit functions
KeyPadTest.onInit = function() {
  this.passButton.disabled = 'disabled';
  this.failButton.disabled = 'disabled';
  this.showClam();
};

KeyPadTest.onDeinit = function() {
};

window.addEventListener('load', KeyPadTest.init.bind(KeyPadTest));
window.addEventListener('beforeunload', KeyPadTest.uninit.bind(KeyPadTest));
window.addEventListener('keydown', KeyPadTest.handleKeydown.bind(KeyPadTest));
