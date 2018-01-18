/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: nfc.js
// * Description: mmitest -> test item: nfc test.
// * Note: check nfc
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [nfc.js] = ' + s + '\n');
  }
}

function sleep(executeFunc, millisec) {
  let timer = null;
  let promise = new Promise((resolve) => {
    timer = setTimeout(() => {
      executeFunc();
      resolve();
    }, millisec);
  });

  promise.then(() => {
    clearTimeout(timer);
  });
}

var NfcTest = new TestItem();
var nfcStatusItem = document.getElementById('centertext');
var startButton = document.getElementById('retestButton');

/**
 * Start NFC test with command
 */
NfcTest.startNfcTest = function() {
  navigator.engmodeExtension.execCmdLE(['nfc_test'], 1).then((result) => {
    debug('NfcTest execute command success and start to read nfc test data.');
    NfcTest.interval = setInterval(NfcTest.readNfcInfo, 3000);
  }).catch((error) => {
    debug('NfcTest execute command error: ' + error.name);
    nfcStatusItem.innerHTML = 'Execute NFC testing command failed.';
  });
};

NfcTest.stopNfcTest = function() {
  navigator.engmodeExtension.execCmdLE(['nfc_stop'], 1);
}

/**
 *  Read NFC testing result and display the result
 */
NfcTest.readNfcInfo = function() {
  var nfcString = navigator.engmodeExtension.fileReadLE('nfcInfo');
  if (!nfcString || nfcString === '') {
    debug('NfcTest can\'t get file content.');
    return;
  }

  debug('nfc test result:' + nfcString);
  clearInterval(NfcTest.interval);

  // XXX: It's a workaround to display cureent NFC testing result
  if (nfcString.indexOf('Error') > 0) {
    debug('NfcTest testing failed reason: device don\'t support NFC.');
    nfcStatusItem.innerHTML = 'Device don\'t support NFC';
  }

  if (nfcString.indexOf('Unknown') > 0) {
    debug('NfcTest testing failed reason: Unknown');
    nfcStatusItem.innerHTML = 'NFC testing failed.';
  }

  if (nfcString.indexOf('FAILED') > 0) {
    debug('NfcTest testing failed.');
    nfcStatusItem.innerHTML = 'NFC testing failed.';
  }

  if (nfcString.indexOf('PASSED') > 0) {
    debug('NfcTest testing passed.');
    this.passButton.disabled = '';
    nfcStatusItem.innerHTML = 'NFC testing passed.';
  }
};


NfcTest.onInit = function() {
  // Disable the PASS button first
  this.passButton.disabled = 'disabled';
  this.failButton.disabled = '';

  if (!navigator.engmodeExtension) {
    nfcStatusItem.innerHTML = 'KaiOS extension NOT support.';
    startButton.disabled = 'disabled';
    return;
  }

  this.stopNfcTest();
  // Create and elevate data file permissions
  navigator.engmodeExtension.execCmdLE(['data_nfc_upper'], 1);
};

NfcTest.onDeinit = function() {
  this.stopNfcTest();
  // Clear interval when exiting this page
  if (NfcTest.interval) {
    clearInterval(NfcTest.interval);
  }
};

NfcTest.onHandleEvent = function(evt) {
  switch (evt.key) {
    case 'ArrowUp':
      if (!startButton.hidden) {
        startButton.hidden = true;
        nfcStatusItem.innerHTML = 'Waiting for NFC test initing ...';
        setTimeout(this.startNfcTest.bind(this), 500)
      }
      evt.preventDefault();
      break;
  }
  return false;
};

window.addEventListener('load', NfcTest.init.bind(NfcTest));
window.addEventListener('beforeunload', NfcTest.uninit.bind(NfcTest));
window.addEventListener('keydown', NfcTest.handleKeydown.bind(NfcTest));
