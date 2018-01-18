/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: auto.js
// * Description: mmitest -> auto test part.
// * Note: When you want to add a new test item, just add the html file
// *       name in array testList
// ************************************************************************

/* global dump, asyncStorage */
'use strict';

const RESULT_LIST = 'result_list';

//liuhao add 2017/08/07
var engmodeExtension = navigator.engmodeExtension;

const DEBUG = true;
function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [auto.js] = ' + s + '\n');
  }
}
//-------------------------------------------------------------------------

var AutoTest = {

  testList: [],
  index: 0,
  // 'start', 'next', the start button will be used in two cases.
  autoStartButtonStatus: 'start',

  resultList: [],

  getResultList: function AutoTest_geResultList(callback) {
    asyncStorage.getItem(RESULT_LIST, (value) => {
      debug('get test result list:' + value);
      value && callback(value);
    });
  },

  setResultList: function AutoTest_setResult() {
    var resultList = this.resultList.toString();
    asyncStorage.setItem(RESULT_LIST, resultList);
    debug('setResult, result list:' + resultList);
  },

  restartAutoTest: function AutoTest_restartAutoTest() {
    this.index = 0;
    this.resultList = [];
    this.startAutoTest();
  },

  startAutoTest: function AutoTest_startAutoTest() {
    //if end , show end play
    if (this.index >= this.testList.length) {
      this.autoStartButtonStatus = 'end';
      this.displayResultList();
      return;
    }

    this.resultPanel.classList.add('hidden');

    // add class 'test' for page animation, detail refer to auto.css
    document.body.classList.add('test');
    this.autoStartButton.innerHTML = 'Start';
    this.autoStartButtonStatus = 'start';
    this.retestButton.style.visibility = 'hidden';

    this.iframe.src = this.testList[this.index] + '.html';
    this.iframe.focus();
  },

  endAutoTest: function AutoTest_endAutoTest() {
    this.stopGps();
    this.stopNfc();
    this.setResultList();
    window.location = '../index.html';
  },

  goToNextTest: function AutoTest_goToNextTest() {
    debug('goToNextTest ==================== ');
    this.setResultList();
    this.index += 1;
    if (this.index < this.testList.length) {
      this.iframe.src = this.testList[this.index] + '.html';
    } else {
      this.displayResultList();
      this.autoStartButtonStatus = 'end';
    }
  },

  failAutoTest: function AutoTest_failAutoTest() {
    debug('failAutoTest ==================== ');
    this.setResultList();

    this.autoStartButton.innerHTML = 'Next';
    this.autoStartButtonStatus = 'next';
    this.retestButton.style.visibility = 'visible';

    this.centerContext.innerHTML =
        this.getItemName(this.testList[this.index]) +
        ' test failed <br > Press Next or Retest';

    // add class 'test' for page animation, detail refer to auto.css
    document.body.classList.remove('test');
    this.iframe.blur();
  },

  displayResultList: function AutoTest_displayResultList(list) {
    this.resultPanel.classList.remove('hidden');
    this.iframe.blur();

    if (list) {
      this.resultList = list.split(',');
    }

    debug(this.resultList);
    var result = '';
    //liuhao add 2017/08/07 
     var resultFile = '';
    for (var i = 0; i < this.testList.length; i++) {
      result += '<p class=' + this.resultList[i] + '>' + this.testList[i] + ': ' +
       (this.resultList[i] === undefined || this.resultList[i] === '' ?
        'not test' : (this.resultList[i] === 'true' ? 'pass': 'fail')) + '</p>' ;
        //liuhao add 2017/08/07 @{
        if(i === 0){
        	resultFile += '####AUTO Test####'+'\n'+'\n';
    }
//				resultFile += i+':'+this.testList[i]+':'+this.resultList[i]+"\n";

				resultFile += this.testList[i]+':'+(this.resultList[i] === undefined || this.resultList[i] === '' ? 'notTest' : (this.resultList[i] === 'true' ? 'pass' : 'fail'))+"\n";
    }
    this.showFile(resultFile);
    //}@
    this.resultText.innerHTML = result;
  },

	//liuhao add 2017/08/07
	refeshfiletimes: function AutoTest_refeshfiletimes(path) {
		var parmArray = new Array();
		var imei = this.showIMEIs();
		//		var path = '/data/kaioslog/' + imei+'.txt';
		console.log(' liuhao refeshfiletimes path '+path);
		parmArray.push(path);
		console.log(' parmArray:' + parmArray.toString());
		var request = engmodeExtension.getFilesLastTime('normal', parmArray, 1);
		request.onsuccess = function(e) {
			console.log(' request onsuccess');
    };
    request.onerror = function() {
     console.log(' request fail '+JSON.parse(request.error.name).errorInfo);
    };
	},

  //liuhao add 2017/08/08
  showFile: function AutoTest_showFile(resulFile) {
  var promises = [];
  for (var i = 0; i < navigator.mozMobileConnections.length; i++) {
    promises.push(navigator.mozMobileConnections[i].getDeviceIdentities());
  }

  Promise.all(promises).then((imeis) => {
    var elem = document.querySelector('#imei');
    var mImei = '';
    var time = '';
    time = this.getTimes();
    if (imeis.length === 2) {
    	mImei = imeis[0].imei + '_' +imeis[1].imei;
//    elem.innerHTML = 'IMEI1: ' + imeis[0].imei + '<br>' +
//        'IMEI2: ' + imeis[1].imei;
    } else {
    	mImei =  imeis[0].imei;
//    elem.innerHTML = 'IMEI: ' + imeis[0].imei;
    }
    var path = '/data/kaioslog/' + mImei+'_'+time+'.txt';
    console.log(' liuhao path '+path);
    engmodeExtension.createFileLE('FILE', path);
    engmodeExtension.execCmdLE(['data_kaioslog_upper'], 1);
    engmodeExtension.fileWriteLE(resulFile, path, 'f');
    this.refeshfiletimes(path);
  }, () => {
  });
	},
	getTimes: function AutoTest_getTimes() {
    var tempDate = new Date();
    var date_str = tempDate.toLocaleFormat('%Y%m%d_%H%M%S');
    return date_str;
 	},
	
  get autoStartButton() {
    return document.getElementById('autoStartButton');
  },

  get autoEndButton() {
    return document.getElementById('autoEndButton');
  },

  get retestButton() {
    return document.getElementById('retestButton');
  },

  get resultText() {
    return document.getElementById('result-text');
  },

  get centerContext() {
    return document.getElementById('centertext');
  },

  get iframe() {
    return document.getElementById('test-iframe');
  },

  get restartYes() {
    return document.getElementById('restartYes');
  },

  get restartNo() {
    return document.getElementById('restartNo');
  },

  // according to file name, get the item name.
  getItemName: function AutoTest_getItemName(fileName) {
    var item = fileName;
    switch (fileName) {
      case 'traceability':
        item = 'Traceability';
        break;
      case 'lcd':
        item = 'LCD display';
        break;
      case 'keypad':
        item = 'Keypad';
        break;
      case 'keypad_led':
        item = 'KeypadLED';
        break;
      case 'backlight':
        item = 'LCD backlight';
        break;
      case 'camera':
        item = 'Camera';
        break;
      case 'camera_front':
        item = 'Front Camera';
        break;
      case 'flashlight':
        item = 'Flashlight';
        break;
      case 'audio':
        item = 'Audio Test';
        break;
      case 'vibrate':
        item = 'Vibrator';
        break;
      case 'accessories':
        item = 'Accessories';
        break;
      case 'charger':
        item = 'Charging';
        break;
      case 'usb':
        item = 'USB';
        break;
      case 'gsensor':
        item = 'G-sensor';
        break;
      case 'sim':
        item = 'SIM';
        break;
      case 'sdcard':
        item = 'Micro SD card';
        break;
      case 'battery':
        item = 'Battery Temperature';
        break;
      case 'nfc':
        item = 'NFC';
        break;
      case 'bluetooth':
        item = 'Bluetooth';
        break;
      case 'wifi':
        item = 'Wi-Fi';
        break;
      case 'fm':
        item = 'FM';
        break;
      case 'gps':
        item = 'GPS';
        break;
      case 'dialer':
        item = 'Call';
        break;
    }

    return item;
  },

  loadConfig: function ut_loadConfig() {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', '../resource/config.json', true);
    xhr.send(null);
    xhr.onreadystatechange = function cc_loadConfiguration() {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status === 0 || xhr.status === 200) {
        var list = JSON.parse(xhr.responseText);
        for (var i = 0, j = 0; i < list.testItems.length; i++) {
          debug('name = ' + list.testItems[i].itemName + ' | ' + list.testItems[i].itemInfo);
          if ('true' === list.testItems[i].autoTest[0].testFlag) {
            AutoTest.testList[j++] = list.testItems[i].itemName;
          }
        }
      }
    };
  },

  loadTestItems: function AutoTest_loadTestItems() {
    AutoTest.testList = ['lcd', 'keypad', 'backlight'
    , 'camera', 'flashlight', 'audio'
    , 'vibrate', 'accessories', 'fm'
    , 'charger', 'sim', 'sdcard'
    , 'battery', 'nfc', 'bluetooth'
    , 'wifi', 'gps'];

    var cameras = navigator.mozCameras.getListOfCameras();
    if (cameras.length == 2) {
      var index = AutoTest.testList.indexOf('camera');
      if (index > 0 && index < AutoTest.testList.length) {
        AutoTest.testList.splice(index + 1, 0, 'camera_front');
      }
    }

    // Hiding the NFC testing if device not support it.
    if (!navigator.mozNfc) {
      debug('AutoTest: device don\'t support NFC.');
      var index = AutoTest.testList.indexOf('nfc');
      AutoTest.testList.splice(index, 1);
    }
  },

  startGps: function _startGps() {
    if (navigator.engmodeExtension) {
      navigator.engmodeExtension.startGpsTest();
    }
  },

  stopGps: function _stopGps() {
    if (navigator.engmodeExtension) {
      navigator.engmodeExtension.stopGpsTest();
    }
  },

  stopNfc: function() {
    if (navigator.engmodeExtension) {
      navigator.engmodeExtension.execCmdLE(['nfc_stop'], 1);
    }
  },

  init: function AutoTest_init() {
    this.resultPanel = document.getElementById('result-screen');

    // XXX, let's load config later ..
    // this.loadConfig();
    this.loadTestItems();

    // start gps_test module when enter test.
    this.startGps();
    this.iframe.addEventListener('load', this);
    this.iframe.addEventListener('unload', this);
    this.retestButton.addEventListener('click', this);
    this.retestButton.style.visibility = 'hidden';
    this.restartYes.addEventListener('click', this);
    this.restartNo.addEventListener('click', this);

    this.getResultList((list) => {
      this.displayResultList(list);
    });

  },

  handleEvent: function AutoTest_handleEvent(evt) {
    switch (evt.type) {
      case 'click':
        if (evt.name === 'pass') {
          this.resultList[this.index] = 'true';
          if (this.testList[this.index] === 'audio') {
            this.iframe.blur();
            window.focus();
            var self = this;
            setTimeout(function() {
              self.index += 1;
              self.startAutoTest();
            }, 500);
            return;
          }
          this.goToNextTest();
        } else if (evt.name === 'fail') {
          this.resultList[this.index] = false;
          this.failAutoTest();
        }
        break;
      case 'retestButton':
        if (this.retestButton.style.visibility !== 'hidden') {
          this.startAutoTest();
        }
        break;
      default:
        break;
    }
  },

  handleKeydown: function AutoTest_handleKeydown(evt){
    evt.preventDefault();
    switch(evt.key){
      case 'SoftRight':
        this.endAutoTest();
        break;

      case 'SoftLeft':
        if (!this.resultPanel.classList.contains('hidden') &&
            this.autoStartButtonStatus === 'end') {
          this.restartAutoTest();
          return;
        }
        if (this.autoStartButtonStatus === 'next') {
          this.index += 1;
        }
        this.startAutoTest();
        break;

      case 'ArrowUp':
        if (!this.resultPanel.classList.contains('hidden')) {
          this.resultText.scrollTop -= 60;
        } else {
          this.startAutoTest();
        }
        break;

      case 'ArrowDown':
        if (!this.resultPanel.classList.contains('hidden')) {
          this.resultText.scrollTop += 60;
        }
        break;

      default:
        break;
    }
  }
};

window.onload = AutoTest.init.bind(AutoTest);
window.addEventListener('keydown', AutoTest.handleKeydown.bind(AutoTest));
