/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: bluetooth.js
// * Description: mmitest -> test item: bluetooth test.
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [bluetooth.js] = ' + s + '\n');
  }
}

function $(id) {
  return document.getElementById(id);
}

// ------------------------------------------------------------------------
const DISCOVER_TIMER_DURATION = 30000;

var BtTest = new TestItem();

BtTest.discoverTimeout = null;
BtTest.bluetooth = navigator.mozBluetooth;
BtTest.settings = navigator.mozSettings;

BtTest.scan = function() {
  this.discoverTimeout = null;
  this.foundDevice = false;
  this.startDiscovery();
};

BtTest.discoverTimeoutCallback = function() {
  this.discoverTimeout = null;
  this.stopDiscovery();
};

BtTest.startDiscovery = function() {
  $('retestButton').style.visibility = 'hidden';
  $('centertext').innerHTML = 'searching...';

  this.passButton.disabled = 'disabled';
  this.failButton.disabled = 'disabled';

  if (!this.defaultAdapter) {
    return Promise.reject('default adapter is not existed!!');
  }

  return this.defaultAdapter.startDiscovery().then((handle) => {
    if (!this.discoverTimeout) {
      this.discoverTimeout = setTimeout(
          this.discoverTimeoutCallback.bind(this), DISCOVER_TIMER_DURATION);
    }
    handle.ondevicefound = this.onDeviceFound.bind(this);
  }, (reason) => {
    window.setTimeout(() => {
      this.failButton.disabled = '';
      $('retestButton').style.visibility = 'visible';
    }, 3000);
    this.stopDiscovery();
    return Promise.reject(reason);
  });
};

BtTest.stopDiscovery = function() {
  if (!this.defaultAdapter) {
    return Promise.reject('default adapter is not existed!!');
  }

  if (this.discoverTimeout) {
    clearTimeout(this.discoverTimeout);
  }
  this.discoverTimeout = null;

  $('retestButton').style.visibility = 'visible';
  this.failButton.disabled = '';

  return this.defaultAdapter.stopDiscovery().then(() => {
    if (!this.foundDevice) {
      $('centertext').innerHTML = 'No Device found';
    }
  }, (reason) => {
    debug('stopDiscovery(): stopDiscovery failed: reason = ' + reason);
    return Promise.reject(reason);
  });
};

// ---- onDeviceFound
BtTest.onDeviceFound = function(evt) {
  this.foundDevice = true;

  this.passButton.disabled = '';
  this.autoPass(1000);

  // display the bt address.
  $('centertext').innerHTML = 'Devices:<br>' + evt.device.address;
  // when found a device, just stop.
  this.stopDiscovery();
};

//--- the following are inherit functions
BtTest.onInit = function() {
  $('retestButton').style.visibility = 'hidden';
  $('retestButton').addEventListener('click', this);
  this.passButton.disabled = 'disabled';
  this.failButton.disabled = '';
  $('centertext').innerHTML = '';

  this.bluetooth.addEventListener('attributechanged', (evt) => {
    for (var i in evt.attrs) {
      switch (evt.attrs[i]) {
        case 'defaultAdapter':
          // Default adapter attribute change.
          // Usually, it means that we reach new default adapter.
          BtTest.defaultAdapter = BtTest.bluetooth.defaultAdapter;
          debug('_watchMozBluetoothAttributechanged(): ' +
                'this.defaultAdapter = ' + BtTest.defaultAdapter);
          BtTest.startTest();
          break;
        default:
          break;
      }
    }
  });

  this.defaultAdapter = this.bluetooth.defaultAdapter;
};

BtTest.startTest = function() {
  if (!this.defaultAdapter) {
    return;
  }
  if (this.defaultAdapter.state === 'enabled') {
    this.scan();
  } else {
    $('centertext').innerHTML = 'Enabling Bluetooth...';
    this.defaultAdapter.enable().then(() => {
      this.scan();
    }, (reason) => {
      debug('setEnabled(): set enable failed: reason = ' + reason);
    });
  }
};

BtTest.onDeinit = function() {
  // we don't set bluetooth settings back when quit bt test,
  // to avoid a race condition that may cause fail to test bt
  // net time enter the menu.
};

BtTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  switch (evt.type) {
    case 'keydown':
      if (evt.key === 'ArrowUp' && $('retestButton').style.visibility !== 'hidden') {
        if (this.defaultAdapter && !this.defaultAdapter.discovering) {
          this.scan();
        }
      }
      break;
  }
  return false;
};

window.addEventListener('load', BtTest.init.bind(BtTest));
window.addEventListener('beforeunload', BtTest.uninit.bind(BtTest));
window.addEventListener('keydown', BtTest.handleKeydown.bind(BtTest));
