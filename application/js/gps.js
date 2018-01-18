/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: gps.js
// * Description: mmitest -> test item: gps test.
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [gps.js] = ' + s + '\n');
  }
}

function $(id) {
  return document.getElementById(id);
}

// ------------------------------------------------------------------------
const GPS_INTERVAL = 1000; //1s
const GPS_TEST_TIMEOUT = 40000; //40s

var GPSTest = new TestItem();

GPSTest._timer = null;
GPSTest._timeout = null;

GPSTest.searchCallback = function() {
  debug('GPSTest.searchCallback');
  var svString = null;
  if (navigator.engmodeExtension) {
    svString = navigator.engmodeExtension.fileReadLE('GPSif');
  } else {
    svString = '';
  }
  if (!svString || svString === '') {
    return;
  }
  var svInfo = JSON.parse(svString);

  debug('sv num:' + svInfo.num);

  if (svInfo.num === 0) {
    $('centertext').textContent = svInfo.num + ' satellite(s)';
  }
  else if (svInfo.num > 0) {
    this.passButton.disabled = '';
    this.failButton.disabled = '';
    $('centertext').textContent = svInfo.num + ' satellite(s)';
    for (var i in svInfo.gps) {
      var prn = svInfo.gps[i].prn;
      var snr = svInfo.gps[i].snr;
      if (!isNaN(prn) && !isNaN(snr)) {
        $('centertext').innerHTML += '</br>' +
            'prn: ' + prn + ', snr: ' + snr;
      }
    }
  }
};

GPSTest.startTest = function() {
  debug('GPSTest.startTest');
  $('centertext').textContent = 'Please wait...';

  // since gps_test is opened at the beginning of minitest,
  // for speed up, read file immediately when enter gps test.
  this.searchCallback();
  this._timer = setInterval(this.searchCallback.bind(this), GPS_INTERVAL);

  if (parent.AutoTest !== undefined) {
    this.passButton.disabled = 'disabled';
    this.failButton.disabled = 'disabled';
  }
  var self = this;
  this._timeout = setTimeout(function() {
    self.failButton.disabled = '';
  }, GPS_TEST_TIMEOUT);
};

GPSTest.stopTest = function() {
  debug('GPSTest.stopTest');
  if (this._timer) {
    clearInterval(this._timer);
    this._timer = null;
  }

  if (this._timeout) {
    clearTimeout(this._timeout);
    this._timeout = null;
  }
};

GPSTest.visibilityChange = function() {
  if (document.mozHidden) {
    this.stopTest();
  } else {
    this.startTest();
  }
};

//the following are inherit functions

GPSTest.onInit = function() {
  debug('gpsTest-oninit-execCmdLE-to-deletefile');
  var aParamAarry = ['rmgps'];
  var req = navigator.engmodeExtension.execCmdLE(aParamAarry, 1);
  req.onsuccess = function() {
    debug('gpsTest-oninit-execCmdLE-delete-success-req:' + req.toSource());
    GPSTest.startTest();
  };
  req.onerror = function() {
    debug('gpsTest-oninit-execCmdLE-delete-error-req:' + req.toSource());
  };
};

GPSTest.onDeinit = function() {
};

GPSTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  return false;
};

window.addEventListener('load', GPSTest.init.bind(GPSTest));
window.addEventListener('beforeunload', GPSTest.uninit.bind(GPSTest));
window.addEventListener('mozvisibilitychange', GPSTest.visibilityChange.bind(GPSTest));
window.addEventListener('keydown', GPSTest.handleKeydown.bind(GPSTest));
