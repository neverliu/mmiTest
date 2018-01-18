'use strict';
/* global ComponentUtils */

window.GaiaGcList = (function(win) {
  // Extend from the HTMLElement prototype
  var proto = Object.create(HTMLElement.prototype);

  // Allow baseurl to be overridden (used for demo page)
  var baseurl = window.GaiaGcListBaseurl ||
    '/js/gaia_gc_list/';

  proto.createdCallback = function() {
    var shadow = this.createShadowRoot();
    this._template = template.content.cloneNode(true);

    // Get the three element in the list
    this.firstElement = this._template.getElementById('first');
    this.centerElement = this._template.getElementById('center');
    this.lastElement = this._template.getElementById('last');
    this.upIcon = this._template.getElementById('up-icon');
    this.downIcon = this._template.getElementById('down-icon');

    shadow.appendChild(this._template);
    ComponentUtils.style.call(this, baseurl);

    this.addEventListener('keydown', this.handleSelect.bind(this));
    this.tabIndex = 1;

    this.focusIndex = 0; // Indicator which element is selecting
    this.listLength = 0; // Indicator how many element in the list
    this.settingsIndex = undefined; // Indicator which element is setting
  };

  proto.setcolortext = function(index) {
    this.firstElement.classList.remove('setcolortext');
    this.centerElement.classList.remove('setcentertext');
    this.lastElement.classList.remove('setcolortext');

    var firstindex = this.getFirstElementContent();
    var centerindex = this.getCenterElementContent();
    var lastindex = this.getLastElementContent();

    if (firstindex == index) {
      this.firstElement.classList.add('setcolortext');
    }
    else if (centerindex == index) {
      this.centerElement.classList.add('setcentertext');
    }
    else if (lastindex == index) {
      this.lastElement.classList.add('setcolortext');
    }
  };
  // Added end.

  proto.setGcListLength = function(length, selectedIndex, settingsIndex) {
    this.focusIndex = selectedIndex;
    this.listLength = length;
    this.settingsIndex = settingsIndex;
  };

  proto.createOrUpdateListUI = function() {
    if(typeof(this.getElementContent) == 'function') {
      this.setFirstElementContent('');
      this.setCenterElementContent('');
      this.setLastElementContent('');

      if(this.listLength == 0) {
        return;
      }

      if (this.listLength == 1) {
        var centerContent = this.getElementContent(this.focusIndex);
        this.setCenterElementContent(centerContent);

        if (this.compareSettingsIndex(this.focusIndex)) {
          this.centerElement.className = 'settings';
        } else {
          this.centerElement.className = '';
        }

        return;
      }

      var firstIndex =
        (this.focusIndex -1 + this.listLength) % this.listLength;
      var firstContent = this.getElementContent(firstIndex);
      this.setFirstElementContent(firstContent);

      if (this.compareSettingsIndex(firstIndex)) {
        this.firstElement.className = 'settings';
      } else {
        this.firstElement.className = '';
      }

      var centerContent = this.getElementContent(this.focusIndex);
      this.setCenterElementContent(centerContent);

      if (this.compareSettingsIndex(this.focusIndex)) {
        this.centerElement.className = 'settings';
      } else {
        this.centerElement.className = '';
      }

      if (this.listLength >= 3) {
        var lastIndex =
          (this.focusIndex + 1) % this.listLength;
        var lastContent = this.getElementContent(lastIndex);
        this.setLastElementContent(lastContent);

        if (this.compareSettingsIndex(lastIndex)) {
          this.lastElement.className = 'settings';
        } else {
          this.lastElement.className = '';
        }
      }
    }
  };

  proto.compareSettingsIndex = function(index) {
    if (typeof(this.settingsIndex) === 'undefined') {
      return false;
    }

    if (index == this.settingsIndex) {
      return true;
    }

    return false;
  };

  proto.getFirstElementContent = function() {
    return this.firstElement.textContent;
  };

  proto.setFirstElementContent = function(str) {
    this.firstElement.textContent = str;
  };

  proto.getCenterElementContent = function() {
    return this.centerElement.textContent;
  };

  proto.setCenterElementContent = function(str) {
    this.centerElement.textContent = str;
  };

  proto.getLastElementContent = function() {
    return this.lastElement.textContent;
  };

  proto.setLastElementContent = function(str) {
    this.lastElement.textContent = str;
  };

  // this function should be written in app, for get the
  // element value to show.
  //proto.getElementContent = function(index) {
  //};

  proto.setDownIconFocus = function() {
    this.downIcon.classList.add('active');
    setTimeout(function() {
      this.downIcon.classList.remove('active');
    }.bind(this), 200);
  };

  proto.getFocusIndex = function() {
    return this.focusIndex;
  };

  proto.handleSelect = function(e) {
    if (e.key) {
      switch (e.key) {
        case 'Up':
        case 'ArrowUp':
          this.focusIndex =
            (this.focusIndex - 1 + this.listLength) % this.listLength;
          this.createOrUpdateListUI();

          this.upIcon.classList.add('active');
          setTimeout(function() {
            this.upIcon.classList.remove('active');
          }.bind(this), 200);
          break;

        case "Down":
        case "ArrowDown":
          this.focusIndex = (this.focusIndex + 1) % this.listLength;
          this.createOrUpdateListUI();

          this.downIcon.classList.add('active');
          setTimeout(function() {
            this.downIcon.classList.remove('active');
          }.bind(this), 200);
          break;

        case "Enter":
          e.stopImmediatePropagation();

          var event = document.createEvent('CustomEvent');
          var detail = {
            type: 'select',
            selectedIndex: this.focusIndex
          };
          event.initCustomEvent('select',
          /* canBubble */ true, /* cancelable */ false, detail);
          this.dispatchEvent(event);
          break;
      }
    }
  };

  var template = document.createElement('template');
  template.innerHTML = `<div id="first"></div>
    <span id="up-icon">&#9650</span>
    <div id="center"></div>
    <span id="down-icon">&#9660</span>
    <div id="last"></div>`;

  // Register and return the constructor
  return document.registerElement('gaia-gc-list', { prototype: proto });

})(window);
