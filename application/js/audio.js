/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: audio.js
// * Description: mmitest -> test item: audio test.
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [audio.js] = ' + s + '\n');
  }
}

function $(id) {
  return document.getElementById(id);
}

/**
 * Timeout click fail/pass to close test item, we need time to stop mic test.
 */
function click(event) {
  setTimeout(() => {
    if (parent.ManuTest !== undefined) {
      parent.ManuTest.handleEvent.call(parent.ManuTest, event);
    } else {
      parent.AutoTest.handleEvent.call(parent.AutoTest, event);
    }
  }, 1500);
}

var AudioTest = new TestItem();

AudioTest.resumeVolume = function() {
  navigator.mozSettings.createLock().set({
    'audio.volume.content': 8
  });
};

AudioTest.setDefaultVolume = function() {
  // set to default volume to make sure we can test
  navigator.mozSettings.createLock().set({
    'audio.volume.telephony': 5
  });

  navigator.mozSettings.createLock().set({
    'audio.volume.content': 15
  });
};

AudioTest.startReceiverTest = function() {
  debug('AudioTest.doTest = receiver');
  $('centertext').innerHTML = 'receiver test';
  this.testIndex++;
  this.setAudioType(false);
  setTimeout(this.timeoutCallback.bind(this), 3000);
};

AudioTest.startSpeakerTest = function() {
  debug('AudioTest.doTest = speaker');
  $('centertext').innerHTML = 'speaker test';
  this.testIndex++;
  this.setAudioType(true);
  setTimeout(this.timeoutCallback.bind(this), 3000);
};

/**
 * Set the audio playing type to receiver or speaker
 */
AudioTest.setAudioType = function(speakerEnabled) {
  debug('AudioTest set audio play type : speakerEnabled = ' + speakerEnabled);
  if (!navigator.mozTelephony) {
    $('centertext').innerHTML = 'MozTelephony is not available.';
    return;
  }

  navigator.mozTelephony.speakerEnabled = speakerEnabled;

  if (!this.isAudioPlaying) {
    debug('AudioTest start force in call.');
    navigator.engmodeExtension.startForceInCall();
    try {
      this.audio.play();
      this.isAudioPlaying = true;
    } catch (e) {
      debug('AudioTest play audio failed: ' + e);
    }
  }
};

AudioTest.startMicTest = function() {
  debug('AudioTest.doTest = mic');
  $('centertext').innerHTML = 'loop from MIC test';
  this.testIndex++;
  navigator.engmodeExtension.startAudioLoopTest('mic');
  AudioTest.isAudioLoopProcessing = true;
};

AudioTest.stopMicTest = function() {
  debug('AudioTest stop audio loop test.');
  if (this.isAudioLoopProcessing) {
    navigator.engmodeExtension.stopAudioLoopTest();
    setTimeout(() => {
      navigator.engmodeExtension.startAudioLoopTest('stop-mic');
      AudioTest.isAudioLoopProcessing = false;
    }, 1000);
  }
};

/**
 * Stop playing audio test
 */
AudioTest.stopPlayAudio = function() {
  debug('AudioTest stop playing audio test');
  if (this.isAudioPlaying) {
    this.audio.removeAttribute('src');
    debug('AudioTest stop force in call.');
    navigator.engmodeExtension.stopForceInCall();
    this.isAudioPlaying = false;
  }
};

AudioTest.timeoutCallback = function() {
  this.passButton.disabled = '';
  this.failButton.disabled = '';
};

AudioTest.clearTestItem = function() {
  if (this.isAudioPlaying) {
    this.audio.pause();
    this.audio.removeAttribute('src');
    debug('AudioTest stop force in call.');
    navigator.engmodeExtension.stopForceInCall();
    this.isAudioPlaying = false;
  } else if (this.isAudioLoopProcessing) {
    this.stopMicTest();
  }

  this.testIndex = 0;
  this.audio = null;
};

//the following are inherit functions
AudioTest.onInit = function() {
  debug('AudioTest.onInit');
  if (!navigator.engmodeExtension) {
    $('centertext').innerHTML = 'KaiOS extension NOT support.';
    return;
  }

  this.audio = $('audio-element-id');
  this.testIndex = 0;
  this.isAudioPlaying = false;
  this.isAudioLoopProcessing = false;
  this.setDefaultVolume();
  this.startReceiverTest();
};

AudioTest.onDeinit = function() {
  debug('AudioTest onDeinit: Exit current audio test.');
  this.resumeVolume();
  this.clearTestItem();
};

AudioTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  debug('AudioTest.onHandleEvent');
  switch (evt.key) {
    case 'SoftLeft':
      if (this.passButton.disabled) {
        return;
      }
      if (this.testIndex == 0) {
        this.startReceiverTest();
      } else if (this.testIndex == 1) {
        this.startSpeakerTest();
      } else if (this.testIndex == 2) {
        this.stopPlayAudio();
        setTimeout(this.startMicTest.bind(this), 1000);
      } else if (this.testIndex == 3) {
        this.stopMicTest();
        click({
          type: 'click',
          name: 'pass'
        });
        return true;
      } else {
        return false;
      }
      return true;
      break;
    case 'SoftRight':
      if (this.failButton.disabled) {
        return;
      }
      this.clearTestItem();
      if (this.testIndex <= 3) {
        click({
          type: 'click',
          name: 'fail'
        });
        return true;
      }
      break;
    default:
      break;
  }
  return false;
};

window.addEventListener('load', AudioTest.init.bind(AudioTest));
window.addEventListener('beforeunload', AudioTest.uninit.bind(AudioTest));
window.addEventListener('keydown', AudioTest.handleKeydown.bind(AudioTest));
