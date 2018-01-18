/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: fm.js
// * Description: mmitest -> test item: fm radio test.
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [fm.js] = ' + s + '\n');
  }
}

var mozFMRadio = navigator.mozFMRadio;

//------------------------------------------------------------------------------
var FMTest = new TestItem();

FMTest.frequency = 103.7;
FMTest.freqMIN = 87.5;
FMTest.freqMAX = 108;

FMTest.updateUI = function() {
  debug('FMTest.updateUI');
  var freq = this.frequency;
  freq = parseFloat(freq.toFixed(1));
  document.getElementById('centertext').innerHTML =
      freq + 'MHz.' +
      '<br>' +
      'Press Left and Right to change frequency';

  this.freqP.style.visibility = 'visible';
  this.freqM.style.visibility = 'visible';

  this.passButton.disabled = '';
  this.failButton.disabled = '';
};

FMTest.onAntennaChange = function() {
  debug('FMTest.onAntennaChange');
  if (mozFMRadio.antennaAvailable) {
    this.turnOn();
  } else {
    this.passButton.disabled = 'disabled';
    this.turnOff('antenna-unavailable');
  }
};

FMTest.freqPlus = function() {
  debug('FMTest.freqPlus');
  if (mozFMRadio.enabled) {
    this.frequency += 0.1;
    if (this.frequency > this.freqMAX) {
      this.frequency = this.freqMAX;
    }
    this.updateUI();
    mozFMRadio.setFrequency(this.frequency);
  }
};

FMTest.freqMinus = function() {
  debug('FMTest.freqMinus');
  if (mozFMRadio.enabled) {
    this.frequency -= 0.1;
    if (this.frequency < this.freqMIN) {
      this.frequency = this.freqMIN;
    }
    this.updateUI();
    mozFMRadio.setFrequency(this.frequency);
  }
};

FMTest.turnOn = function() {
  if (!mozFMRadio.enabled) {
    document.getElementById('centertext').innerHTML = 'FM init...';
    mozFMRadio.enable(this.frequency);
    this.passButton.disabled = '';
    this.failButton.disabled = '';
  }
};

FMTest.turnOff = function(because) {
  if (mozFMRadio.enabled) {
    mozFMRadio.disable();
  }

  if (because === 'antenna-unavailable') {
    document.getElementById('centertext').innerHTML = 'Please insert headset';
  }

  this.freqP.style.visibility = 'hidden';
  this.freqM.style.visibility = 'hidden';
  this.passButton.disabled = '';
  this.failButton.disabled = '';
};

// the following are inherit functions
FMTest.onInit = function() {
  debug('FMTest.onInit');
  this.freqP = document.getElementById('freq+');
  this.freqM = document.getElementById('freq-');
  this.freqP.addEventListener('click', this);
  this.freqM.addEventListener('click', this);

  this.freqP.style.visibility = 'hidden';
  this.freqM.style.visibility = 'hidden';

  if (parent.AutoTest !== undefined) {
    this.passButton.disabled = 'disabled';
    this.failButton.disabled = 'disabled';
  } else {
    this.passButton.disabled = 'disabled';
  }

  var settings = window.navigator.mozSettings;
  if (settings) {
    settings.createLock().set({'audio.volume.content': 8});
  }

  mozFMRadio.onenabled = this.updateUI.bind(this);
  mozFMRadio.onantennaavailablechange = this.onAntennaChange.bind(this);

  if (mozFMRadio.antennaAvailable) {
    this.turnOn();
  } else {
    this.turnOff('antenna-unavailable');
  }

};

FMTest.onDeinit = function() {
  if (mozFMRadio.enabled) {
    mozFMRadio.disable();
  }
};

FMTest.step = 0;
FMTest.removeHeadsetTest = function() {
  if (mozFMRadio.enabled) {
    mozFMRadio.disable();
  }
  document.getElementById('centertext').innerHTML = 'Please remove headset';
  FMTest.step++;
  this.freqP.style.visibility = 'hidden';
  this.freqM.style.visibility = 'hidden';
  this.passButton.disabled = 'disabled';
  this.failButton.disabled = '';
  this.passButton.style.visibility = 'visible';
  this.failButton.style.visibility = 'visible';
};

FMTest.onHandleEvent = function(evt) {
  switch (evt.key) {
    case 'ArrowLeft':
      this.freqMinus();
      break;
    case 'ArrowRight':
      this.freqPlus();
      break;
    case 'SoftLeft':
      if (this.passButton.disabled) {
        return;
      }
      break;
    case 'SoftRight':
      if (this.failButton.disabled) {
        return;
      }
      var event = {
        type: 'click',
        name: 'fail'
      };
      setTimeout(function() {
        if (parent.ManuTest !== undefined) {
          parent.ManuTest.handleEvent.call(parent.ManuTest, event);
        } else {
          parent.AutoTest.handleEvent.call(parent.AutoTest, event);
        }
      }, 800);
      return true;
  }
  return false;
};

window.addEventListener('load', FMTest.init.bind(FMTest));
window.addEventListener('beforeunload', FMTest.uninit.bind(FMTest));
window.addEventListener('keydown', FMTest.handleKeydown.bind(FMTest));
