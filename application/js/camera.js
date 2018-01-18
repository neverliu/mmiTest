/*© 2017 KAI OS TECHNOLOGIES (HONG KONG) LIMITED, all rights reserved.*/
// ************************************************************************
// * File Name: camera.js
// * Description: mmitest -> test item: camera test.
// * Note:
// ************************************************************************

/* global DEBUG, dump, TestItem */
'use strict';

function debug(s) {
  if (DEBUG) {
    dump('<mmitest> ------: [camera.js] = ' + s + '\n');
  }
}

function $(id) {
  return document.getElementById(id);
}

// ------------------------------------------------------------------------

var WHICH_CAMERA = $('camera_front') ? 1 : 0; // 0 is back camera and 1 is front camera.

var beInited = false;

var CameraTest = new TestItem();

CameraTest.testFlag = true;
CameraTest._cameras = null;
CameraTest._cameraObj = null;
CameraTest.setSource = function() {
  $('viewfinder').mozSrcObject = null;

  this._cameras = navigator.mozCameras.getListOfCameras();
  debug('cameras: ' + this._cameras.toString() + '-- index: ' + WHICH_CAMERA);

  navigator.mozCameras.getCamera(this._cameras[WHICH_CAMERA])
      .then(this.gotCamera.bind(this), this.gotCameraError.bind(this));};

CameraTest.startPreview = function() {
  $('viewfinder').play();
  this.setSource();
};

CameraTest.stopPreview = function() {
  $('viewfinder').pause();
  $('viewfinder').mozSrcObject = null;
};

CameraTest.resumePreview = function() {
  this._cameraObj.resumePreview();
};

CameraTest.gotPreviewScreen = function(stream) {
  $('viewfinder').mozSrcObject = stream;
  $('viewfinder').play();
};

CameraTest.gotCamera = function(params) {
  var camera = this._cameraObj = params.camera;
  var config = {
    pictureSize: this.getProperPictureSize(camera.capabilities.pictureSizes)
  };
  camera.setConfiguration(config);

  var viewfinder = $('viewfinder');
  var style = viewfinder.style;

  var transform = '';
  if (WHICH_CAMERA === 1) {
    transform += ' scale(-1, 1)';
  }
  var angle = camera.sensorAngle;
  transform += 'rotate(' + angle + 'deg)';
  debug('transform ===================== ' + transform);

  style.MozTransform = transform;

  var width = document.body.clientWidth;
  var height = document.body.clientHeight;
  if (angle % 180 === 0) {
    style.top = 0;
    style.left = 0;
    style.width = width + 'px';
    style.height = height + 'px';
  } else {
    style.top = ((height / 2) - (width / 2)) + 'px';
    style.left = -((height / 2) - (width / 2)) + 'px';
    style.width = height + 'px';
    style.height = width + 'px';
  }
  viewfinder.mozSrcObject = camera;
  viewfinder.play();
};

CameraTest.getProperPictureSize = function (sizes) {
  var delta, ratio, gradual = 1, index = 0;
  var screenRatio = document.body.clientWidth/ document.body.clientHeight;

  // get a picture size that's the largest and mostly eaqual to screen ratio
  for (var i = 0, len = sizes.length; i < len; i++) {
    ratio = sizes[i].height / sizes[i].width;
    if (ratio > 1) {
      ratio = 1 / ratio;
    }
    delta = Math.abs(screenRatio - ratio);
    if (delta < gradual || (delta === gradual &&
        sizes[index].height * sizes[index].width < sizes[i].height * sizes[i].width)) {
      gradual = delta;
      index = i;
    }
  }
  return sizes[index];
};

CameraTest.gotCameraError = function() {
  $('centertext').innerHTML = 'got camera error';
  this.failButton.disabled = '';
  this.testFlag = false;
};

CameraTest.visibilityChange = function() {
  if (document.mozHidden) {
    this.stopPreview();
  } else {
    this.startPreview();
  }

  var self = this;
  if (this._cameraObj) {
    this._cameraObj.release().then(function() {
      self._cameraObj = null;
    }, function() {
      debug('fail to release camera');
    });
  }
};

CameraTest.startInit = function() {
  if (!navigator.mozCameras) {
    $('centertext').innerHTML = 'mozCameras does not exist';
    return;
  }

  if (beInited) {
    return;
  }
  beInited = true;

  if ($('camera_front')) {
    $('title').innerHTML = 'Front Camera';
  } else {
    $('title').innerHTML = 'Camera';
  }
  this.setSource();

  this.passButton.disabled = 'disabled';
  this.failButton.disabled = 'disabled';
  var self = this;
  setTimeout(function() {
    if (self.testFlag) {
      self.passButton.disabled = '';
    }
    self.failButton.disabled = '';
  }, 3000);
};

//the following are inherit functions
CameraTest.onInit = function() {
  var self = this;
  if (($('camera_front')) && (parent.AutoTest != undefined)) {
    setTimeout(function() {
      self.startInit();
    }, 200);
  } else {
    self.startInit();
  }
};

CameraTest.onDeinit = function() {
};

CameraTest.onHandleEvent = function(evt) {
  evt.preventDefault();
  return false;
};

window.addEventListener('DOMContentLoaded', CameraTest.init.bind(CameraTest));
window.addEventListener('mozvisibilitychange', CameraTest.visibilityChange.bind(CameraTest));
window.addEventListener('keydown', CameraTest.handleKeydown.bind(CameraTest));
