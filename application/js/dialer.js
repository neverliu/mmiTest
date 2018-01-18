/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: dialer.js
// * Description: mmitest -> test item: dialer test.
// * Note:
// ************************************************************************

/* global TestItem */
'use strict';

function $(id) {
  return document.getElementById(id);
}

// ------------------------------------------------------------------------

var DialerTest = new TestItem();

DialerTest._call = null;

//the following are inherit functions
DialerTest.onInit = function() {
  $('dialButton').addEventListener('click', this);

  $('centertext').innerHTML =
      'OUTGOING CALL' + '<br />' + 'Press "Dial" to start';
};

DialerTest.onDeinit = function() {

};

DialerTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  if (evt.key === 'ArrowUp') {
    var tel = navigator.mozTelephony;
    if (tel) {
      tel.dialEmergency('112').then(function() {
        // do nothing
      });
    }
  }
  return false;
};

window.addEventListener('load', DialerTest.init.bind(DialerTest));
window.addEventListener('beforeunload', DialerTest.uninit.bind(DialerTest));
window.addEventListener('keydown', DialerTest.handleKeydown.bind(DialerTest));
