/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: wifi.js
// * Description: mmitest -> test item: wifi test.
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [vibrate.js] = ' + s + '\n');
  }
}

var wifiEnabled = false;
const gWifiManager = navigator.mozWifiManager;

// ------------------------------------------------------------------------

var WifiTest = new TestItem();

WifiTest.retestButton = null;
WifiTest.centerText = null;
// When enter the test, the init status 'on' or 'off'
WifiTest.initStatus = null;
WifiTest.currStatus = null;
// save the event when press pass/fail button,
// reset wifi status then go to next.
WifiTest.event = null;

WifiTest.NetworkList = function networkList(list) {
  var self = this;
  var scanning = false;

  function newListItem(network) {
    // ssid
    var li = document.createElement('li');
    // signal is between 0 and 100
    li.textContent = '"' + network.ssid + '" -' + network.relSignalStrength;

    return li;
  }

  // clear the network list
  function clear(scanning) {
    while (list.hasChildNodes())
      list.removeChild(list.lastChild);
    if (scanning) {
      self.centerText.innerHTML =
          'Detecting WIFI network...';
    }
    else {
      self.centerText.innerHTML = '';
    }

    self.retestButton.style.visibility = 'hidden';

    if (parent.AutoTest !== undefined) {
      self.passButton.disabled = 'disabled';
      self.failButton.disabled = 'disabled';
    }
  }

  // scan wifi networks and display them in the list
  function scan() {
    var i = 0;
    var network;
    if (scanning) {
      return;
    }

    // stop auto-scanning if wifi disabled or the app is hidden
    if (!gWifiManager.enabled || document.mozHidden) {
      scanning = false;
      return;
    }

    self.centerText.innerHTML = 'Detecting WIFI network...';
    scanning = true;
    var req = gWifiManager.getNetworks();

    req.onsuccess = function onScanSuccess() {
      // clear list again for showing scaning result.
      clear(false);

      var allNetworks = req.result;
      var networks = {};
      for (i = 0; i < allNetworks.length; ++i) {
        network = allNetworks[i];
        // use ssid + capabilities as a composited key
        var key = network.ssid + '+' + network.capabilities.join('+');
        // keep connected network first, or select the highest strength
        if (!networks[key] || network.connected) {
          networks[key] = network;
        } else {
          if (!networks[key].connected &&
              network.relSignalStrength > networks[key].relSignalStrength)
            networks[key] = network;
        }
      }

      self.retestButton.style.visibility = 'visible';
      self.passButton.disabled = '';
      self.failButton.disabled = '';

      //  var networks = req.result;
      var ssids = Object.getOwnPropertyNames(networks);
      debug('wifi: network ssids.length: ' + ssids.length);
      if (ssids.length) {
        ssids.sort(function(a, b) {
          return networks[b].relSignalStrength - networks[a].relSignalStrength;
        });
      }

      // add detected networks
      for (i = 0; i < ssids.length; i++) {
        network = networks[ssids[i]];
        if (network === undefined || network.ssid === undefined) {
          continue;
        }
        if (i >= 7) { // don't make the list too long.
          break;
        }
        var listItem = newListItem(network);
        list.appendChild(listItem);
      }

      if (ssids.length === 0) {
        self.centerText.innerHTML = 'No network detected.';
      } else {
        self.autoPass(1000);
      }
      scanning = false;
    };

    req.onerror = function onScanError() {
      // always try again.
      scanning = false;
      window.setTimeout(scan, 5000);
    };
  }

  return {
    clear: clear,
    scan: scan,
    get scanning() {
      return scanning;
    }
  };
};


//the following are inherit functions
WifiTest.onInit = function() {
  var settings = window.navigator.mozSettings;

  if (!settings)
    return;

  var self = this;

  this.retestButton = document.getElementById('retestButton');
  this.retestButton.addEventListener('click', this);

  this.centerText = document.getElementById('centertext');

  var list = document.getElementById('wifi-networks');

  this.gNetworkList = this.NetworkList(list);

  gWifiManager.onenabled = function onWifiEnabled() {
    self.currStatus = 'on';
    self.gNetworkList.scan();
  };

  gWifiManager.ondisabled = function onWifiDisabled() {
    self.currStatus = 'off';
    self.centerText.innerHTML = 'Turned off';
    self.handleEvent(self.event);
  };

  self.retestButton.style.visibility = 'hidden';
  var req = settings.createLock().get('wifi.enabled');
  req.onsuccess = function wf_getStatusSuccess() {
    var enabled = req.result['wifi.enabled'];
    wifiEnabled = enabled;

    if (enabled) {
      self.initStatus = 'on';
      self.currStatus = 'on';
      self.gNetworkList.scan();
    } else {
      self.initStatus = 'off';
      self.currStatus = 'off';
      settings.createLock().set({'wifi.enabled': true});
      self.centerText.innerHTML = 'WIFI initializing...';
      self.retestButton.style.visibility = 'hidden';
    }
  };
  //------------------------------------------------------------------

  if (parent.AutoTest !== undefined) {
    this.passButton.disabled = 'disabled';
    this.failButton.disabled = 'disabled';
  }
};

WifiTest.onDeinit = function() {
  var settings = window.navigator.mozSettings;
  var req = settings.createLock().set({'wifi.enabled': wifiEnabled});
  req.onsuccess = function wf_getStatusSuccess() {
  };
};

WifiTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  switch (evt.type) {
    case 'keydown':
      if (evt.key === 'Enter' || evt.target === 'Backspace') {
        var settings = window.navigator.mozSettings;
        if (!settings) {
          return false;
        }

      } else if (evt.key === 'ArrowUp' && this.retestButton.style.visibility !== 'hidden') {
        //scan retry
        this.gNetworkList.clear(true);
        this.gNetworkList.scan();
      }
      break;
  }
  return false;
};

window.addEventListener('load', WifiTest.init.bind(WifiTest));
window.addEventListener('beforeunload', WifiTest.uninit.bind(WifiTest));
window.addEventListener('keydown', WifiTest.handleKeydown.bind(WifiTest));
