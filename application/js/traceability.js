/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: traceability.js
// * Description: mmitest -> test item: traceability test.
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [traceability.js] = ' + s + '\n');
  }
}

function $(id) {
  return document.getElementById(id);
}

var TraceTest = new TestItem();

//the following are inherit functions
TraceTest.onInit = function() {
  this.getIMEIs();

  $('trace-info').focus();
};

TraceTest.getIMEIs = function() {
  var promises = [];
  for (var i = 0; i < navigator.mozMobileConnections.length; i++) {
    promises.push(navigator.mozMobileConnections[i].getDeviceIdentities());
  }

  Promise.all(promises).then((imeis) => {
    if (imeis.length === 2) {
      $('trace-imei').innerHTML =
          'IMEI1: ' + imeis[0].imei + '<br/>' +
          'IMEI2: ' + imeis[1].imei + '<br/>';
    } else {
      $('trace-imei').innerHTML =
          'IMEI: ' + imeis[0].imei + '<br/>';
    }
  }, () => {});
};

TraceTest.formatInfo = function(response) {
  response = response.replace(/OK/g, '');
  var array = response.split('\n');
  var s = '';
  array.forEach(function(str) {
    s += str + '<br/>';
  });

  return s;
};

TraceTest.onDeinit = function() {
};

TraceTest.onHandleEvent = function() {
  return false;
};

window.addEventListener('load', TraceTest.init.bind(TraceTest));
window.addEventListener('beforeunload', TraceTest.uninit.bind(TraceTest));
window.addEventListener('keydown', TraceTest.handleKeydown.bind(TraceTest));
