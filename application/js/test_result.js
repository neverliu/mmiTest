/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
/* global TestItem */
'use strict';
const MMITESTRESULT = 'mmitest_result';

var TestResult = new TestItem();

//liuhao add 2017/08/07
var engmodeExtension = navigator.engmodeExtension;

TestResult.onInit = function() {
  this.content = document.getElementById('test-result-content');
  this.content.focus();
  this.showTestResult();
};

TestResult.showTestResult = function() {
  asyncStorage.getItem(MMITESTRESULT, (value) => {
    var testResult = JSON.parse(value);
    var result = '';
    var resultFile = '';
    var i = 1;
    if (testResult) {
      for (var name in testResult.items) {
       result += '<p class=' + testResult.items[name] + '>' + name + ': ' + testResult.items[name] + '</p>' ;
       //liuhao add 2017/08/09 @{
       if(i === 1){
      		resultFile += '####MENU Test####'+'\n'+'\n';
      	}
       resultFile += name + ':' + testResult.items[name] + '\n';
//     resultFile += i + '. ' + name + ':' + testResult.items[name] + '\n';
        i++;
      }
      console.log(' liuhao result '+result);
      this.showFile(resultFile);
      //}@
      this.content.innerHTML = result;
    }
  });
};


  //liuhao add 2017/08/09
  TestResult.showFile = function(resulFile){
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
};

  TestResult.getTimes = function(){
    var tempDate = new Date();
    var date_str = tempDate.toLocaleFormat('%Y%m%d_%H%M%S');
    return date_str;
  };
  //liuhao add 2017/08/09
  TestResult.refeshfiletimes = function(path){
    var parmArray = new Array();
    var imei = this.showIMEIs();
    //    var path = '/data/kaioslog/' + imei+'.txt';
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
  };



TestResult.onHandleEvent = function(evt) {
  return false;
};

window.addEventListener('load', TestResult.init.bind(TestResult));
window.addEventListener('beforeunload', TestResult.uninit.bind(TestResult));
window.addEventListener('keydown', TestResult.handleKeydown.bind(TestResult));
