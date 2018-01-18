/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: testitem.js
// * Description: this is the public class for all test items.
// * Note:
// ************************************************************************

/* global dump */
'use strict';

const DEBUG = true;
function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [testitem.js] = ' + s + '\n');
  }
}

//-------------------------------------------------------------------------

var passButton = document.createElement('input');
passButton.setAttribute('type', 'button');
passButton.setAttribute('class', 'buttons');
passButton.setAttribute('id', 'passButton');
passButton.setAttribute('value', 'Pass');

var failButton = document.createElement('input');
failButton.setAttribute('type', 'button');
failButton.setAttribute('class', 'buttons');
failButton.setAttribute('id', 'failButton');
failButton.setAttribute('value', 'Fail');

var a = document.getElementsByTagName('body');
a[0].appendChild(passButton);
a[0].appendChild(failButton);

/*
* The TestItem class
*/
function TestItem() {
  debug('TestItem');
}

/*
* If you have something need init, inherit the onInit function.
* If you have something need deinit, inherit the onDeinit function.
* If you need handle event, inherit the onHandleEvent function.
*/
TestItem.prototype.onkeyevent = function() {
};


TestItem.prototype.onInit = function() {
};
TestItem.prototype.onDeinit = function() {
};
TestItem.prototype.onHandleEvent = function() {
  debug('TestItem.prototype.onHandleEvent');
  return false;
};


TestItem.prototype.init = function() {
  debug('TestItem.prototype.init');
  delete this.passButton;
  delete this.failButton;
  this.passButton = document.getElementById('passButton');
  this.failButton = document.getElementById('failButton');

  if (navigator.engmodeExtension) {
    navigator.engmodeExtension.onkeyevent = this.onkeyevent.bind(this);
  }
  // Dont let the phone go to sleep while in mmitest.
  // user must manually close it
  if (navigator.requestWakeLock) {
    navigator.requestWakeLock('screen');
  }
  this._timer = window.setTimeout(this.enableButton.bind(this), 15000);
  this.onInit();
};

TestItem.prototype.uninit = function() {
  if (navigator.engmodeExtension) {
    navigator.engmodeExtension.onkeyevent = null;
  }

  debug('TestItem.prototype.uninit');
  clearTimeout(this._timer);
  this.onDeinit();
};

TestItem.prototype.enableButton = function() {

};

TestItem.prototype.autoPass = function(timeout) {
  if (parent.AutoTest !== undefined) {
    this._timer = window.setTimeout(function() {
      var event = {type: 'click', name: 'pass'};
      parent.AutoTest.handleEvent.call(parent.AutoTest, event);
    }, timeout);
  }
};

TestItem.prototype.handleEvent = function(evt) {
  debug('TestItem.prototype.handleEvent');
  var event;
  var ret = this.onHandleEvent(evt);
  if (ret) {
    return;
  }

  switch (evt.type) {
    case 'click':
      switch (evt.target) {
        case this.passButton:
          clearTimeout(this._timer);
          event = {
            type: 'click',
            name: 'pass'
          };
          if (parent.ManuTest !== undefined) {
            parent.ManuTest.handleEvent.call(parent.ManuTest, event);
          } else {
            parent.AutoTest.handleEvent.call(parent.AutoTest, event);
          }
          break;

        case this.failButton:
          clearTimeout(this._timer);
          event = {
            type: 'click',
            name: 'fail'
          };
          if (parent.ManuTest !== undefined) {
            parent.ManuTest.handleEvent.call(parent.ManuTest, event);
          } else {
            parent.AutoTest.handleEvent.call(parent.AutoTest, event);
          }
          break;
      }
      break;
  }
};

TestItem.prototype.visibilityChange = function() {
  if (document.mozHidden) {
    if (navigator.engmodeExtension) {
      navigator.engmodeExtension.onkeyevent = this.onkeyevent;
    }
  } else {
    if (navigator.engmodeExtension) {
      navigator.engmodeExtension.onkeyevent = null;
    }
  }
};

TestItem.prototype.handleKeydown = function(evt) {
  var event;
  var ret = this.onHandleEvent(evt);
  if (ret) {
    return;
  }
  if (evt.key) {
    switch (evt.key) {
      case 'SoftRight':
        if (this.failButton.disabled) {
          return;
        }
        clearTimeout(this._timer);
        event = {
          type: 'click',
          name: 'fail'
        };
        if (parent.ManuTest !== undefined) {
          parent.ManuTest.handleEvent.call(parent.ManuTest, event);
        } else {
          parent.AutoTest.handleEvent.call(parent.AutoTest, event);
        }
        break;
      case 'SoftLeft':
        if (this.passButton.disabled) {
          return;
        }
        clearTimeout(this._timer);
        event = {
          type: 'click',
          name: 'pass'
        };
        if (parent.ManuTest !== undefined) {
          parent.ManuTest.handleEvent.call(parent.ManuTest, event);
        } else {
          parent.AutoTest.handleEvent.call(parent.AutoTest, event);
        }
        break;
      case 'Up':
      case 'ArrowUp':
        break;
      case 'Down':
      case 'ArrowDown':
        break;
    }
  }
};

window.addEventListener('mozvisibilitychange', TestItem.prototype.visibilityChange.bind(this));
