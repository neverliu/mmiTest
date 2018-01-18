'use strict';
/* global ComponentUtils */

window.GaiaGcBody = (function(win) {
  // Extend from the HTMLElement prototype
  var proto = Object.create(HTMLElement.prototype);

  // Allow baseurl to be overridden (used for demo page)
  var baseurl = window.GaiaGcBodyBaseurl ||
    '/js/gaia_gc_body/';

  var baseImeType = 'Abc-W';

  proto.createdCallback = function() {
    var shadow = this.createShadowRoot();
    this._template = template.content.cloneNode(true);
    shadow.appendChild(this._template);
    ComponentUtils.style.call(this, baseurl);

    // Get all known elements in gaia-gc-body element.
    this.mainHeader = this.querySelector('h1');
    this.subHeader = this.querySelector('h2');
    this.containerElement = this.querySelector('section');
    if(this.containerElement) {
      this.containerElement.classList.add('gc-section');
    }
    this.footerElement = this.querySelector('footer');

    this.tabIndex = 1;

    // this.observeColorChange();
    if(this.mainHeader) {
      this.mainHeader.classList.add('gaia-gc-theme');
    }

    if(this.footerElement) {
      this.footerElement.classList.add('gaia-gc-theme');
    }

    // Observe IME type change and update subHeader
    this.observeGcImeTypeChange();
  };

  proto.observeGcImeTypeChange = function() {
    var settings = window.navigator.mozSettings;
    if (!settings) {
      return;
    }

    var name = 'gc.ime.type';
    var req = settings.createLock().get(name);
    req.addEventListener('success', (function onsuccess() {
      baseImeType = typeof(req.result[name]) != 'undefined' ?
        req.result[name] : 'Abc-W';
      this.updateSubHeader(typeof(req.result[name]) != 'undefined' ?
        req.result[name] : 'Abc-W');
    }.bind(this)));

    var updateImeType = function settingChanged(evt) {
      baseImeType = evt.settingValue;
      this.updateSubHeader(evt.settingValue);
    };

    settings.addObserver(name, updateImeType.bind(this));
  };

  proto.updateSubHeader = function(type) {
    if(!this.subHeader) {
      return;
    }

    var span = document.getElementById('gc-ime-type');
    if (!span) {
      return;
    }

    span.innerHTML = type;
  };

  proto.addImeTypeInSubHeader = function() {
    if(!this.subHeader) {
      return;
    }

    var span = document.getElementById('gc-ime-type');
    if (!span) {
      var span = document.createElement('span');
      span.id = 'gc-ime-type';
      span.className = 'gc-ime-type';
      span.innerHTML = baseImeType || 'Abc-W';

      this.subHeader.classList.add('displayInLeft');
      this.subHeader.appendChild(span);
    }
  };

  proto.removeImeTypeInSubHeader = function() {
    if(!this.subHeader) {
      return;
    }

    var span = document.getElementById('gc-ime-type');
    if (!span) {
      return;
    }

    this.subHeader.classList.remove('displayInLeft');
    this.subHeader.removeChild(span);
  };

  proto.observeColorChange = function() {
    var settings = window.navigator.mozSettings;
    if (!settings) {
      return;
    }

    var name = 'gc.settings.color';
    var req = settings.createLock().get(name);
    req.addEventListener('success', (function onsuccess() {
      this.setColor(typeof(req.result[name]) != 'undefined' ?
        req.result[name] : '#CD2D2D');
    }.bind(this)));

    var settingChanged = function settingChanged(evt) {
      this.setColor(evt.settingValue);
    };

    settings.addObserver(name, settingChanged.bind(this));
  };

  proto.getMainHeader = function() {
    return this.mainHeader;
  };

  proto.setMainHeader = function(str) {
    if (str) {
      this.mainHeader.textContent = str;
    } else {
      this.mainHeader.textContent = '';
    }
  };

  proto.getSubHeader = function() {
    return this.subHeader;
  };

  proto.setSubHeader = function(str) {
    if (str) {
      this.subHeader.textContent = str;
    } else {
      this.subHeader.textContent = '';
    }
  };

  proto.getFooter = function() {
    return this.footerElement;
  };

  proto.setFooter = function(str) {
    if (str) {
      this.footerElement.textContent = str;
    } else {
      this.footerElement.textContent = '';
    }
  };

  proto.getContainerElement = function() {
    return this.containerElement;
  };

  proto.getMsgElement = function() {
    return this.msgElement;
  };

  /**
   * var msg = {
   *   'header': 'Msg Header',
   *   'subHeader': 'Sub Header',
   *   'content': 'Sending Message!',
   *   'footer': 'Footer'
   * };
   * Or without subHeader
   * var msg = {
   *   'header': 'Msg Header',
   *   'content': 'Sending Message!',
   *   'footer': 'Footer'
   * };
   * gaiaGcBody.showMsg(msg, true);
   */
  proto.showMsg = function(msg, autoHide) {
    this.msgElement = document.getElementById('gaia-gc-msg');
    if (!this.msgElement) {
      this.msgElement = document.createElement('gaia-gc-msg');
      this.msgElement.id = 'gaia-gc-msg';
      this.msgElement.style.cssText="background-color:#E4E4E4; opacity:1;";
      document.body.appendChild(this.msgElement);
    }
    this.msgElement.showMsg(msg, autoHide);
  };

  proto.hideMsg = function() {
    if (this.msgElement) {
      this.msgElement.hideMsg();
    }
  };

  proto.setColor = function(color) {
    this.mainHeader.style.backgroundColor = color;
    this.footerElement.style.backgroundColor = color;
  };

  var template = document.createElement('template');
  template.innerHTML = `<content select="h1"></content>
      <content select="h2"></content>
      <content select="section"></content>
      <content select="footer"></content>`;

  // Register and return the constructor
  return document.registerElement('gaia-gc-body', { prototype: proto });

})(window);

window.GaiaGcMsg = (function(win) {
  // Extend from the HTMLElement prototype
  var proto = Object.create(HTMLElement.prototype);

  // Allow baseurl to be overridden (used for demo page)
  var baseurl = window.GaiaGcMsgBaseurl ||
    '/shared/elements/gaia_gc_body/';

  proto.createdCallback = function() {
    var shadow = this.createShadowRoot();
    this._template = template.content.cloneNode(true);

    //this.mainHeader = this._template.getElementById('gc-msg-title');
    //this.subHeader = this._template.getElementById('gc-msg-subTitle');
    this.containerElement = this._template.getElementById('gc-msg');
    this.containerElement.classList.add('gc-section');
    this.msgContent = this._template.getElementById('gc-msg-content');
    //this.footerElement = this._template.getElementById('gc-msg-footer');

    shadow.appendChild(this._template);
    ComponentUtils.style.call(this, baseurl);

    this.mainHeader = document.createElement('h1');
    this.mainHeader.id = 'gc-msg-title';
    this.appendChild(this.mainHeader);

    this.subHeader = document.createElement('h2');
    this.subHeader.id = 'gc-msg-subTitle';
    this.appendChild(this.subHeader);

    this.footerElement = document.createElement('footer');
    this.footerElement.id = 'gc-msg-footer';
    this.appendChild(this.footerElement);

    this.mainHeader.classList.add('gaia-gc-theme');
    this.footerElement.classList.add('gaia-gc-theme');

    this.hideMsg();
    this.msgTimeoutHandle = null;

    this.addEventListener('keydown', this.handleClick.bind(this));
    this.tabIndex = 1;

    this.createTime = true; // For the first time focus

    //this.observeColorChange();
  };

  proto.observeColorChange = function() {
    var settings = window.navigator.mozSettings;
    if (!settings) {
      return;
    }

    var name = 'gc.settings.color';
    var req = settings.createLock().get(name);
    req.addEventListener('success', (function onsuccess() {
      this.setColor(typeof(req.result[name]) != 'undefined' ?
        req.result[name] : '#CD2D2D');
    }.bind(this)));

    var settingChanged = function settingChanged(evt) {
      this.setColor(evt.settingValue);
    };

    settings.addObserver(name, settingChanged.bind(this));
  };

  proto.handleClick = function(e) {
    if (e.key && !this.msgIsHide) {
      if (this.msgAutoHide) {
        this.hideMsg();
      } else {
        var cmd = ConvertToCmd(e.key);
        if (cmd == 'engmodeExcmNo' || cmd == 'engmodeExcmYes') {
          this.hideMsg();
          window.dispatchEvent(new CustomEvent(cmd));
        }
      }
      e.stopImmediatePropagation();
    }
  };

  proto.getMainHeader = function() {
    return this.mainHeader;
  };

  proto.setMainHeader = function(str) {
    if (str) {
      this.mainHeader.textContent = str;
    } else {
      this.mainHeader.textContent = '';
    }
  };

  proto.getSubHeader = function() {
    return this.subHeader;
  };

  proto.setSubHeader = function(str) {
    if (str) {
      this.subHeader.textContent = str;
    } else {
      this.subHeader.textContent = '';
    }
  };

  proto.getFooter = function() {
    return this.footerElement;
  };

  proto.setFooter = function(str) {
    if (str) {
      this.footerElement.textContent = str;
    } else {
      this.footerElement.textContent = '';
    }
  };

  proto.getContainerElement = function() {
    return this.containerElement;
  };

  proto.showMsg = function(msg, autoHide) {
    this.setMainHeader(msg.header);

    if (msg.subHeader) {
      this.subHeader.classList.remove('hidden');
      this.containerElement.classList.remove('no-subHeader');
      this.setSubHeader(msg.subHeader);
      var subHeaderBgColor =
        window.getComputedStyle(document.body).backgroundColor;
      this.subHeader.style.backgroundColor = subHeaderBgColor;
    } else {
      this.subHeader.classList.add('hidden');
      this.containerElement.classList.add('no-subHeader');
    }

    this.msgContent.textContent = msg.content;
    this.setFooter(msg.footer);

    proto.msgAutoHide = autoHide;
    this.msgIsHide = false;
    this.classList.remove('hidden');
    this.oldEl = document.activeElement;

    if (this.createTime) {
      setTimeout(function () {
        this.focus();
        this.createTime = false;
      }.bind(this));
    } else {
      this.focus();
    }

    if (this.msgTimeoutHandle) {
      clearTimeout(this.msgTimeoutHandle);
      this.msgTimeoutHandle = null;
    }
    if (autoHide == true) {
      this.msgTimeoutHandle = setTimeout(function () {
        this.hideMsg();
      }.bind(this), 3000);
    }
  };

  proto.hideMsg = function() {
    this.msgIsHide = true;
    this.classList.add('hidden');

    window.dispatchEvent(new CustomEvent('hideMsg'));

    if (this.oldEl) {
      this.oldEl.focus();
    }
    if (this.msgTimeoutHandle) {
      clearTimeout(this.msgTimeoutHandle);
      this.msgTimeoutHandle = null;
    }
  };

  proto.setColor = function(color) {
    this.mainHeader.style.backgroundColor = color;
    this.footerElement.style.backgroundColor = color;
  };

  var template = document.createElement('template');
  template.innerHTML = `<content select="h1"></content>
    <content select="h2"></content>
    <section id="gc-msg">
      <div id="gc-msg-content"></div>
    </section>
    <content select="footer"></content>`;
  // Register and return the constructor
  return document.registerElement('gaia-gc-msg', { prototype: proto });

})(window);
