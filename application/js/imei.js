/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
/* global TestItem */
'use strict';

var IMEITest = new TestItem();

IMEITest.onInit = function() {
  this.handleButtons();
  this.showIMEIs();
};

IMEITest.showIMEIs = function() {
  var promises = [];
  for (var i = 0; i < navigator.mozMobileConnections.length; i++) {
    promises.push(navigator.mozMobileConnections[i].getDeviceIdentities());
  }

  Promise.all(promises).then((imeis) => {
    var elem = document.querySelector('#imei');
    if (imeis.length === 2) {
      elem.innerHTML = 'IMEI1: ' + imeis[0].imei + '<br>' +
          'IMEI2: ' + imeis[1].imei;
    } else {
      elem.innerHTML = 'IMEI: ' + imeis[0].imei;
    }
  }, () => {
  });
};

IMEITest.handleButtons = function() {
  document.getElementById('passButton').style.display = 'none';
  document.getElementById('failButton').style.display = 'none';

  var okButton = document.createElement('input');
  okButton.setAttribute('type', 'button');
  okButton.setAttribute('class', 'buttons');
  okButton.setAttribute('id', 'okButton');
  okButton.setAttribute('value', 'OK');
  document.body.appendChild(okButton);
};

IMEITest.onHandleEvent = function(evt) {
  evt.preventDefault();
  if (evt.key === 'Enter') {
    var event = {
      type: 'click',
      name: 'pass'
    };
    if (parent.ManuTest !== undefined) {
      parent.ManuTest.handleEvent.call(parent.ManuTest, event);
    }
  }
};

window.addEventListener('load', IMEITest.init.bind(IMEITest));
window.addEventListener('beforeunload', IMEITest.uninit.bind(IMEITest));
window.addEventListener('keydown', IMEITest.handleKeydown.bind(IMEITest));
