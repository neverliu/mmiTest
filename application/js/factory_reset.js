/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: efuse_check.js
// * Description: mmitest -> test item: factory reset test.
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [factory_reset.js] = ' + s + '\n');
  }
}

function $(id) {
  return document.getElementById(id);
}

// ------------------------------------------------------------------------
var FactoryResetTest = new TestItem();
function factoryReset() {
  var power = navigator.mozPower;
  if (!power) {
    debug('Cannot get mozPower');
    return;
  }

  if (!power.factoryReset) {
    debug('Cannot invoke mozPower.factoryReset()');
    return;
  }

  power.factoryReset();
}

//the following are inherit functions
FactoryResetTest.onInit = function() {
  this.passButton.style.display = 'none';
  this.failButton.style.visibility = 'hidden';

  $('factory_reset').addEventListener('click', this);
};

FactoryResetTest.onDeinit = function() {
};

FactoryResetTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  switch (evt.key) {
    case 'Enter':
      factoryReset();
      break;
    case 'Backspace':
      var event = {type: 'click', name: 'passButton'};
      parent.ManuTest.handleEvent.call(parent.ManuTest, event);
      break;
  }
  return false;
};

window.addEventListener('load', FactoryResetTest.init.bind(FactoryResetTest));
window.addEventListener('beforeunload', FactoryResetTest.uninit.bind(FactoryResetTest));
window.addEventListener('keydown', FactoryResetTest.handleKeydown.bind(FactoryResetTest));
