/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: gsensor.js
// * Description: mmitest -> test item: gsensor test.
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem, GsensorOrientation */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [gsensor.js] = ' + s + '\n');
  }
}

var GSensor = new TestItem();

GSensor.result = {
  up: false, down: false, left: false, right: false,
  faceup: false, facedown: false
};

//check "up" should be "face up" to "towards up",
//so need the init state as "face up" then allow start check.
GSensor.canCheckUp = false;

GSensor.step1 = function() {
  debug('GSensor.step1');
  if (parent.AutoTest !== undefined) {
    this.passButton.disabled = 'disabled';
    this.failButton.disabled = 'disabled';
  }
  document.getElementById('finished').style.visibility = 'hidden';

  document.getElementById('up').style.visibility = 'visible';
  document.getElementById('down').style.visibility = 'hidden';
  document.getElementById('left').style.visibility = 'hidden';
  document.getElementById('right').style.visibility = 'hidden';
  document.getElementById('faceup').style.visibility = 'hidden';
  document.getElementById('facedown').style.visibility = 'hidden';
};

GSensor.step2 = function() {
  debug('GSensor.step2');
  document.getElementById('up').style.visibility = 'hidden';
  document.getElementById('down').style.visibility = 'visible';
  document.getElementById('left').style.visibility = 'visible';
  document.getElementById('right').style.visibility = 'visible';
  document.getElementById('faceup').style.visibility = 'visible';
  document.getElementById('facedown').style.visibility = 'visible';
};

GSensor.step3 = function() {
  debug('GSensor.step3');
  document.getElementById('content').style.visibility = 'hidden';
  document.getElementById('finished').style.visibility = 'visible';
  document.getElementById('up').style.visibility = 'hidden';
  document.getElementById('down').style.visibility = 'hidden';
  document.getElementById('left').style.visibility = 'hidden';
  document.getElementById('right').style.visibility = 'hidden';
  document.getElementById('faceup').style.visibility = 'hidden';
  document.getElementById('facedown').style.visibility = 'hidden';

  this.passButton.disabled = '';
  this.failButton.disabled = '';
};

GSensor.check = function() {
  debug('GSensor.check');
  var allDone = true;

  for (var i in this.result) {
    if (!this.result[i]) {
      allDone = false;
      break;
    }
  }

  if (allDone) {
    this.step3();

    // pass the test automatically
    if (parent.AutoTest !== undefined) {
      var event = {type: 'click', name: 'pass'};
      parent.AutoTest.handleEvent.call(parent.AutoTest, event);
    }
  }
};

GSensor.onGsensorEvent = function(dir) {
  debug('GSensor.onGsensorEvent dir = ' + dir);
  switch (dir) {
    case 'up':
      if (!GSensor.result.up) {
        GSensor.result.up = true;
        GSensor.step2();
      }
      break;

    case 'down':
      if (GSensor.result.up) {
        GSensor.result.down = true;
        document.getElementById('down').style.visibility = 'hidden';
        GSensor.check();
      }
      break;
    case 'left':
      if (GSensor.result.up) {
        GSensor.result.left = true;
        document.getElementById('left').style.visibility = 'hidden';
        GSensor.check();
      }
      break;
    case 'right':
      if (GSensor.result.up) {
        GSensor.result.right = true;
        document.getElementById('right').style.visibility = 'hidden';
        GSensor.check();
      }
      break;
    case 'faceup':
      if (GSensor.result.up) {
        GSensor.result.faceup = true;
        document.getElementById('faceup').style.visibility = 'hidden';
        GSensor.check();
      }
      break;
    case 'facedown':
      if (GSensor.result.up) {
        GSensor.result.facedown = true;
        document.getElementById('facedown').style.visibility = 'hidden';
        GSensor.check();
      }
      break;
    default:
      break;
  }
};

//the following are inherit functions
GSensor.onInit = function() {
  debug('GSensor.onInit');
  GsensorOrientation.addEventListener('orientation', this.onGsensorEvent);
  GsensorOrientation.start();
  this.step1();

  var self = this;
  setTimeout(function() {
    self.failButton.disabled = '';
  }, 5000);
};

GSensor.onDeinit = function() {
  debug('GSensor.onDeinit');
  GsensorOrientation.removeEventListener('orientation', this.onGsensorEvent);
};

// The number in checking orientation is not accurate,
// just make the test easier.
GSensor.onHandleEvent = function(e) {
  debug('GSensor.onHandleEvent e.type= ' + e.type);
  switch (e.type) {
    case 'deviceorientation':
      if (!this.canCheckUp) {
        // face up: (e.beta === 0 && e.gamma === 0)
        // Don't need to face up to trigger the test
        if (Math.abs(e.beta) < 70 && Math.abs(e.gamma) < 10) {
          this.canCheckUp = true;
        }
      } else {
        if (!this.result.up) {
          // towards up: (e.beta === -90 && e.gamma === 0)
          if ((e.beta < -70 && e.beta > -110) && Math.abs(e.gamma) < 10) {
            this.onGsensorEvent('up');
          }
        } else {
          if (!this.result.down) {
            // towards down: (e.beta === 90 && e.gamma === 0)
            if ((e.beta > 70 && e.beta < 110) && Math.abs(e.gamma) < 10) {
              this.onGsensorEvent('down');
            }
          }

          if (!this.result.left) {
            // left: (e.gamma === 90)
            if (e.gamma > 70) {
              this.onGsensorEvent('left');
            }
          }

          if (!this.result.right) {
            // right: (e.gamma === -90)
            if (e.gamma < -70) {
              this.onGsensorEvent('right');
            }
          }

          if (!this.result.faceup) {
            // face up: (e.beta === 0 && e.gamma === 0)
            if (Math.abs(e.beta) < 10 && Math.abs(e.gamma) < 10) {
              this.onGsensorEvent('faceup');
            }
          }

          if (!this.result.facedown) {
            // face down: (Math.abs(e.beta) === 180) && e.gamma === 0)
            if (Math.abs(e.beta) > 160 && Math.abs(e.gamma) < 10) {
              this.onGsensorEvent('facedown');
            }
          }
        }
      }
      break;
  }
};

window.addEventListener('load', GSensor.init.bind(GSensor));
window.addEventListener('beforeunload', GSensor.uninit.bind(GSensor));
window.addEventListener('keydown', GSensor.handleKeydown.bind(GSensor));
