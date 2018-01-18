/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: sdcard.js
// * Description: mmitest -> test item: sd card test.
// * Note:
// ************************************************************************

/* global TestItem */
'use strict';

function $(id) {
  return document.getElementById(id);
}

// ------------------------------------------------------------------------

var SDTest = new TestItem();
SDTest.updateInfo = function(state) {
  switch (state) {
    case 'available':
      this.passButton.disabled = '';
      $('centertext').innerHTML = 'SD card test OK';
      this.autoPass(1000);
      break;

    case 'shared':
      $('centertext').innerHTML = 'SD card is in use';
      break;

    case 'unavailable':
      $('centertext').innerHTML = 'no SD card insert.';
      break;
  }
};

//the following are inherit functions

SDTest.onInit = function() {
  $('centertext').innerHTML = 'Detecting SD card...';
  this.passButton.disabled = 'disabled';

  this.storage = navigator.getDeviceStorages('sdcard');
  if (!this.storage || this.storage.length < 2 || 'undefined' === this.storage[this.storage.length - 1]) {
    $('centertext').innerHTML = 'No SD card';
    return;
  }
  this.storage[this.storage.length - 1].addEventListener('change', this);
  this.storage[this.storage.length - 1].available().onsuccess = function (e) {
    SDTest.updateInfo(e.target.result);
  };

  this.storage[this.storage.length - 1].available().onerror = function (e) {
    SDTest.updateInfo(e.target.result);
  };
};

SDTest.onDeinit = function() {
  if (this.storage && this.storage.length > 0) {
    this.storage[this.storage.length - 1].removeEventListener('change', this);
  }
};

SDTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  switch (evt.type) {
    case 'change':
      switch (evt.reason) {
        case 'available':
        case 'unavailable':
        case 'shared':
          this.updateInfo(evt.reason);
          break;
      }
      break;
  }

  return false;
};

window.addEventListener('load', SDTest.init.bind(SDTest));
window.addEventListener('beforeunload', SDTest.uninit.bind(SDTest));
window.addEventListener('keydown', SDTest.handleKeydown.bind(SDTest));
