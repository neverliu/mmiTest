/* (c) 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED All rights reserved. This
 * file or any portion thereof may not be reproduced or used in any manner
 * whatsoever without the express written permission of KAI OS TECHNOLOGIES
 * (HONG KONG) LIMITED. KaiOS is the trademark of KAI OS TECHNOLOGIES (HONG KONG)
 * LIMITED or its affiliate company and may be registered in some jurisdictions.
 * All other trademarks are the property of their respective owners.
 */
// ************************************************************************
// * File Name: backlight.js
// * Description: mmitest -> test item: backlight test.
// * Note:
// ************************************************************************

/* global TestItem */

'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [backlight.js] = ' + s + '\n');
  }
}

const REPEAT = 3;
const LOW_BRIGHTNESS = 0;
const HIGH_BRIGHTNESS = 1;

var BacklightTest = new TestItem();

BacklightTest.toggleBacklight = function() {
  debug('this.power.screenBrightness = ' + navigator.mozPower.screenBrightness);
  if (navigator.mozPower.screenBrightness === this.orignScreenBrightness) {
    debug('Disable the device screen.');
    navigator.engmodeExtension.setKeypadLED(0);
    this.power.screenEnabled = false;
    this.power.screenBrightness = LOW_BRIGHTNESS;
    setTimeout(this.timeoutCallback.bind(this), 1000);
  } else {
    // Set keypad Led blacklight together
    debug('Light the device screen.');
    navigator.engmodeExtension.setKeypadLED(100);
    this.power.screenEnabled = true;
    this.power.screenBrightness = HIGH_BRIGHTNESS;
    setTimeout(this.timeoutCallback.bind(this), 1000);
    this.count += 1;
  }

  // Show fail/pass button after three time flash
  if (this.count === REPEAT) {
    this.retestButton.hidden = false;
    this.passButton.disabled = '';
    this.failButton.disabled = '';
    debug('End the backlight test.');
  }
};

BacklightTest.timeoutCallback = function() {
  if (this.count < REPEAT) {
    this.toggleBacklight();
  }
};

BacklightTest.startTest = function() {
  this.count = 0;
  this.retestButton.hidden = true;
  this.passButton.disabled = 'disabled';
  this.failButton.disabled = 'disabled';
  setTimeout(this.timeoutCallback.bind(this), 500);
};

//the following are inherit functions
BacklightTest.onInit = function() {
  if (navigator.mozPower) {
    this.power = navigator.mozPower;
  } else {
    let centerContent = document.getElementById('centertext');
    debug('Do not support the mozPower API in Gecko.');
    centerContent.innerHTML = 'Device do\'t support the mozPower API.';
    return;
  }

  this.retestButton = document.getElementById('retestButton');
  this.orignScreenBrightness = this.power.screenBrightness;
  this.startTest();
};

BacklightTest.onDeinit = function() {
  // set back the brightness when exit.
  this.power.screenBrightness = this.orignScreenBrightness;
};

BacklightTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  switch (evt.key) {
    case 'ArrowUp':
      // Retest this backlight test
      debug('Retest the backlight test.');
      this.startTest();
      break;
  }
  return false;
};

window.addEventListener('load', BacklightTest.init.bind(BacklightTest));
window.addEventListener('beforeunload', BacklightTest.uninit.bind(BacklightTest));
window.addEventListener('keydown', BacklightTest.handleKeydown.bind(BacklightTest));
