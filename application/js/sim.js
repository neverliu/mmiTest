/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: sim.js
// * Description: mmitest -> test item: sim card test.
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [sim.js] = ' + s + '\n');
  }
}

function $(id) {
  return document.getElementById(id);
}

// ------------------------------------------------------------------------

var SimTest = new TestItem();

SimTest.onInit = function() {
  debug('Sim Card Test init ...');
  this.passButton.disabled = 'disabled';
  this.statusItem = $('centertext');

  let conns = navigator.mozMobileConnections;
  // To record the test result failed flag
  let isFailed = false;
  if (conns) {
    [].forEach.call(conns, (simcard, cardIndex) => {
      cardIndex += 1;
      if (simcard.iccId === null) {
        isFailed = true;
        this.statusItem.innerHTML = 'SIM' + cardIndex + ' is missing, test failed.';
        debug('SIM' + cardIndex + ' is missing.');
        return;
      }
      debug('SIM' + cardIndex + ' iccid = ' + simcard.iccId);
    });
  } else {
    this.statusItem.innerHTML = 'Device don\'t support mozMobileConnections API.';
    debug('Device don\'t support mozMobileConnections API.');
    return;
  }

  if (!isFailed) {
    this.statusItem.innerHTML = 'SIM Test is OK.';
    this.passButton.disabled = '';
    this.autoPass(1000);
  }
};

SimTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  return false;
};

window.addEventListener('load', SimTest.init.bind(SimTest));
window.addEventListener('beforeunload', SimTest.uninit.bind(SimTest));
window.addEventListener('keydown', SimTest.handleKeydown.bind(SimTest));
