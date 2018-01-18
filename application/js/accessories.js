/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: accessories.js
// * Description: mmitest -> test item: accessories(headset).
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [accessories.js] = ' + s + '\n');
  }
}

function $(id) {
  return document.getElementById(id);
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

function click(event) {
  //click fail to close test item, need time to stop headset...
  sleep(() => {
    if (parent.ManuTest !== undefined) {
      parent.ManuTest.handleEvent.call(parent.ManuTest, event);
    } else {
      parent.AutoTest.handleEvent.call(parent.AutoTest, event);
    }
  }, 1000);
}

var AccessoriesTest = new TestItem();

AccessoriesTest.step = 0;

AccessoriesTest.plugFlag = true;

/**
 * Listen to plug in headset status
 */
AccessoriesTest.onHeadsetStatusChanged = function() {
  debug('AccessoriesTest onHeadsetStatusChanged');
  let acm = navigator.mozAudioChannelManager;
  if (acm.headphones) {
    $('centertext').innerHTML = 'Headset detected';
    this.plugFlag = true;
    AccessoriesTest.step = 0;
    this.passButton.disabled = '';
    this.failButton.disabled = '';
  } else {
    this.plugFlag = false;
    sleep(() => {
      AccessoriesTest.clearTestItem();
      $('centertext').innerHTML = 'Please plug in headset';
      this.passButton.disabled = 'disabled';
      this.failButton.disabled = '';
    }, 1000);
  }
};

/**
 * Increase the headphone volume
 */
AccessoriesTest.setHeadsetVolume = function() {
  let audioKey = 'audio.volume.content';
  let settings = navigator.mozSettings;
  settings.createLock().get(audioKey).then((result) => {
    let value = parseInt(result[audioKey]);
    if (value < 10) {
      settings.createLock().set({'audio.volume.content': 10});
    }
  });
};

//the following are inherit functions
AccessoriesTest.onInit = function() {
  this.step = 0;
  this.failButton.disabled = '';
  let acm = navigator.mozAudioChannelManager;

  if (!acm) {
    debug('AccessoriesTest : mozAudioChannelManager not support.');
    $('centertext').innerHTML = 'mozAudioChannelManager not supported';
    return;
  }

  if (acm.headphones) {
    this.plugFlag = true;
    $('centertext').innerHTML = 'Headset detected';
  } else {
    this.plugFlag = false;
    this.passButton.disabled = 'disabled';
  }

  acm.addEventListener('headphoneschange',
    this.onHeadsetStatusChanged.bind(this));
};

AccessoriesTest.leftChannelTest = function() {
  debug('AccessoriesTest start left channel test.');
  $('centertext').innerHTML = 'headset left discrete test';
  this.setHeadsetVolume();
  navigator.engmodeExtension.stopAudioLoopTest();
  sleep(() => {
    navigator.engmodeExtension.startAudioLoopTest('headset-left');
  }, 1000);

  AccessoriesTest.step++;
  this.passButton.disabled = 'disabled';
  this.failButton.disabled = 'disabled';
  setTimeout(this.timeoutCallback.bind(this), 3000);
};

AccessoriesTest.leftChannelTestClose = function() {
  debug('AccessoriesTest stop left channel test.');
  navigator.engmodeExtension.stopAudioLoopTest();
  sleep(() => {
    navigator.engmodeExtension.startAudioLoopTest('headset-left-stop');
  }, 500);
};

AccessoriesTest.rightChannelTest = function() {
  debug('AccessoriesTest start right channel test.');
  $('centertext').innerHTML = 'headset right discrete test';
  sleep(() => {
    navigator.engmodeExtension.startAudioLoopTest('headset-right');
  }, 1000);

  AccessoriesTest.step++;
  this.passButton.disabled = 'disabled';
  this.failButton.disabled = 'disabled';
  setTimeout(this.timeoutCallback.bind(this), 3000);
};

AccessoriesTest.rightChannelTestClose = function() {
  debug('AccessoriesTest stop right channel test.');
  navigator.engmodeExtension.stopAudioLoopTest();
  sleep(() => {
    navigator.engmodeExtension.startAudioLoopTest('headset-right-stop');
  }, 500);
};

AccessoriesTest.micTest = function() {
  $('centertext').innerHTML = 'preparing ...';

  AccessoriesTest.step++;
  this.passButton.disabled = 'disabled';
  this.failButton.disabled = 'disabled';

  sleep(() => {
    debug('AccessoriesTest start headset mic test.');
    $('centertext').innerHTML = 'headset mic test';
    navigator.engmodeExtension.startAudioLoopTest('headset-mic');
    setTimeout(this.timeoutCallback.bind(this), 3000);
  }, 500);
};

AccessoriesTest.micTestClose = function() {
  debug('AccessoriesTest stop headset mic test.');
  navigator.engmodeExtension.stopAudioLoopTest();
  sleep(() => {
    navigator.engmodeExtension.startAudioLoopTest('stop-headset-mic');
  }, 500);
};

AccessoriesTest.timeoutCallback = function() {
  if (this.plugFlag) {
    this.passButton.disabled = '';
    this.failButton.disabled = '';
  } else {
    this.passButton.disabled = 'disabled';
    this.failButton.disabled = '';
  }
};

AccessoriesTest.clearTestItem = function() {
  if (this.step === 1) {
    this.leftChannelTestClose();
  } else if (this.step === 2) {
    this.rightChannelTestClose();
  } else if (this.step === 3) {
    this.micTestClose();
  }
};

AccessoriesTest.onDeinit = function() {
  debug('AccessoriesTest onDeinit: clear test item.');
  this.clearTestItem();
};

AccessoriesTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  if (evt.type === 'keydown') {
    switch (evt.key) {
      case 'SoftLeft':
        if (this.passButton.disabled) {
          return false;
        }

        if (AccessoriesTest.step == 0) {
          this.leftChannelTest();
        } else if (AccessoriesTest.step == 1) {
          this.leftChannelTestClose();
          setTimeout(this.rightChannelTest.bind(this), 1000);
        } else if (AccessoriesTest.step == 2) {
          this.rightChannelTestClose();
          setTimeout(this.micTest.bind(this), 1000);
        } else if (AccessoriesTest.step == 3) {
          //close mic and start fm test
          this.micTestClose();
          click({type: 'click', name: 'pass'});
          return true;
        } else {
          return false;
        }
        return true;
      case 'SoftRight':
        if (this.failButton.disabled) {
          return false;
        }

        this.clearTestItem();
        if (AccessoriesTest.step <= 3) {
          click({type: 'click', name: 'fail'});
          return true;
        }
        break;
      default:
        break;
    }
  }
  return false;
};

window.addEventListener('load', AccessoriesTest.init.bind(AccessoriesTest));
window.addEventListener('keydown', AccessoriesTest.handleKeydown.bind(AccessoriesTest));
