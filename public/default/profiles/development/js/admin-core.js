/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/frontend/core/assets/runtime-assets.js":
/*!**********************************************************!*\
  !*** ./resources/frontend/core/assets/runtime-assets.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createRuntimeAssetLoader": () => (/* binding */ createRuntimeAssetLoader)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var SUPPORTED_ASSET_TYPES = new Set(['css', 'img', 'js']);
function createRuntimeAssetLoader() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$document = _ref.document,
    document = _ref$document === void 0 ? globalThis.document : _ref$document,
    _ref$createImage = _ref.createImage,
    createImage = _ref$createImage === void 0 ? function () {
      return new globalThis.Image();
    } : _ref$createImage,
    _ref$log = _ref.log,
    log = _ref$log === void 0 ? function () {} : _ref$log;
  assertDocument(document);
  assertFunction(createImage, 'Image factory');
  assertFunction(log, 'Asset logger');
  var pending = new Map();
  var loader = {
    css: function css(url) {
      return loadStylesheet(document, url, log, pending);
    },
    img: function img(url) {
      return loadImage(createImage, url);
    },
    js: function js(url) {
      return loadScript(document, url, log, pending);
    },
    register: function register(assets) {
      return registerAssets(loader, assets);
    }
  };
  return loader;
}
function registerAssets(loader, assets) {
  if (!assets || _typeof(assets) !== 'object') {
    return Promise.resolve([]);
  }
  return Promise.all(Object.entries(assets).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
      type = _ref3[0],
      url = _ref3[1];
    if (!SUPPORTED_ASSET_TYPES.has(type)) {
      throw new TypeError("Unsupported runtime asset type: ".concat(type, "."));
    }
    return loader[type](url);
  }));
}
function loadScript(document, url, log, pending) {
  assertUrl(url);
  var key = assetKey(document, 'js', url);
  if (pending.has(key)) {
    return pending.get(key);
  }
  if (hasMatchingUrl(document, 'script[src]', 'src', url)) {
    log("Script file ".concat(url, " is loaded."));
    return Promise.resolve(url);
  }
  var script = document.createElement('script');
  script.src = url;
  return trackPending(pending, key, appendAndWait(document.head, script, url));
}
function loadStylesheet(document, url, log, pending) {
  assertUrl(url);
  var key = assetKey(document, 'css', url);
  if (pending.has(key)) {
    return pending.get(key);
  }
  if (hasMatchingUrl(document, 'link[href]', 'href', url)) {
    log("CSS file ".concat(url, " is loaded."));
    return Promise.resolve(url);
  }
  var link = document.createElement('link');
  link.href = url;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  return trackPending(pending, key, appendAndWait(document.head, link, url));
}
function loadImage(createImage, url) {
  assertUrl(url);
  var image = createImage();
  var loaded = waitForLoad(image, url);
  image.src = url;
  return loaded;
}
function appendAndWait(parent, element, url) {
  var loaded = waitForLoad(element, url);
  parent.appendChild(element);
  return loaded;
}
function waitForLoad(element, url) {
  return new Promise(function (resolve, reject) {
    element.onload = function () {
      return resolve(url);
    };
    element.onerror = function () {
      var _element$remove;
      (_element$remove = element.remove) === null || _element$remove === void 0 || _element$remove.call(element);
      reject(url);
    };
  });
}
function trackPending(pending, key, promise) {
  pending.set(key, promise);
  void promise.then(function () {
    return pending["delete"](key);
  }, function () {
    return pending["delete"](key);
  });
  return promise;
}
function assetKey(document, type, url) {
  return "".concat(type, ":").concat(absoluteUrl(document, url));
}
function hasMatchingUrl(document, selector, property, url) {
  var expected = absoluteUrl(document, url);
  return _toConsumableArray(document.querySelectorAll(selector)).some(function (element) {
    return absoluteUrl(document, element[property]) === expected;
  });
}
function absoluteUrl(document, url) {
  return new globalThis.URL(url, document.baseURI).href;
}
function assertDocument(document) {
  if (!(document !== null && document !== void 0 && document.head) || typeof document.createElement !== 'function') {
    throw new TypeError('Runtime assets require a document with a head element.');
  }
  if (typeof document.querySelectorAll !== 'function') {
    throw new TypeError('Runtime assets require document.querySelectorAll().');
  }
}
function assertUrl(url) {
  if (typeof url !== 'string' || url.length === 0) {
    throw new TypeError('Runtime asset URL must be a non-empty string.');
  }
}
function assertFunction(value, label) {
  if (typeof value !== 'function') {
    throw new TypeError("".concat(label, " must be a function."));
  }
}

/***/ }),

/***/ "./resources/frontend/core/data/island-props.js":
/*!******************************************************!*\
  !*** ./resources/frontend/core/data/island-props.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parseBoolean": () => (/* binding */ parseBoolean),
/* harmony export */   "parseJsonProps": () => (/* binding */ parseJsonProps),
/* harmony export */   "parseNumber": () => (/* binding */ parseNumber),
/* harmony export */   "readDataset": () => (/* binding */ readDataset)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var DATASET_PARSERS = {
  "boolean": parseBoolean,
  number: parseNumber,
  string: String
};
function parseBoolean(value) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'value';
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  throw new TypeError("".concat(name, " must be true or false."));
}
function parseNumber(value) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'value';
  var number = typeof value === 'number' ? value : Number(value);
  if (value === '' || !Number.isFinite(number)) {
    throw new TypeError("".concat(name, " must be a finite number."));
  }
  return number;
}
function readDataset(dataset, schema) {
  return Object.fromEntries(Object.entries(schema).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
      name = _ref2[0];
    return Object.hasOwn(dataset, name);
  }).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
      name = _ref4[0],
      type = _ref4[1];
    return [name, parseDatasetValue(dataset[name], type, name)];
  }));
}
function parseJsonProps(source) {
  var value;
  try {
    value = JSON.parse(source);
  } catch (error) {
    throw new TypeError('Island props must contain valid JSON.', {
      cause: error
    });
  }
  if (value === null || Array.isArray(value) || _typeof(value) !== 'object') {
    throw new TypeError('Island props JSON must contain an object.');
  }
  return value;
}
function parseDatasetValue(value, type, name) {
  var parser = DATASET_PARSERS[type];
  if (!parser) {
    throw new TypeError("Unsupported dataset type for ".concat(name, ": ").concat(type, "."));
  }
  return parser(value, name);
}

/***/ }),

/***/ "./resources/frontend/core/dom/forms.js":
/*!**********************************************!*\
  !*** ./resources/frontend/core/dom/forms.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPostForm": () => (/* binding */ createPostForm),
/* harmony export */   "submitForm": () => (/* binding */ submitForm),
/* harmony export */   "submitPostForm": () => (/* binding */ submitPostForm)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function createPostForm(document, url) {
  var parameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  assertDocument(document);
  assertUrl(url);
  assertParameters(parameters);
  var form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', url);
  Object.entries(parameters).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      name = _ref2[0],
      value = _ref2[1];
    form.appendChild(createHiddenInput(document, name, value));
  });
  return form;
}
function submitPostForm(document, url) {
  var parameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var form = createPostForm(document, url, parameters);
  document.body.appendChild(form);
  submitForm(form);
  return form;
}
function submitForm(form) {
  if (typeof (form === null || form === void 0 ? void 0 : form.requestSubmit) === 'function') {
    return form.requestSubmit();
  }
  if (typeof (form === null || form === void 0 ? void 0 : form.submit) === 'function') {
    return form.submit();
  }
  throw new TypeError('Form submission requires requestSubmit() or submit().');
}
function createHiddenInput(document, name, value) {
  var input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', name);
  input.setAttribute('value', String(value));
  return input;
}
function assertDocument(document) {
  if (!(document !== null && document !== void 0 && document.body) || typeof document.createElement !== 'function') {
    throw new TypeError('Form creation requires a document with a body element.');
  }
}
function assertUrl(url) {
  if (typeof url !== 'string' || url.length === 0) {
    throw new TypeError('Form action URL must be a non-empty string.');
  }
}
function assertParameters(parameters) {
  if (!parameters || _typeof(parameters) !== 'object' || Array.isArray(parameters)) {
    throw new TypeError('Form parameters must be an object.');
  }
}

/***/ }),

/***/ "./resources/frontend/core/dom/listeners.js":
/*!**************************************************!*\
  !*** ./resources/frontend/core/dom/listeners.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "delegate": () => (/* binding */ delegate),
/* harmony export */   "listen": () => (/* binding */ listen)
/* harmony export */ });
function listen(target, type, listener, options) {
  assertEventTarget(target);
  assertEventType(type);
  assertListener(listener);
  target.addEventListener(type, listener, options);
  return function () {
    return target.removeEventListener(type, listener, options);
  };
}
function delegate(root, type, selector, listener, options) {
  assertDelegationRoot(root);
  assertSelector(selector);
  assertListener(listener);
  return listen(root, type, function (event) {
    return invokeDelegate(event, root, selector, listener);
  }, options);
}
function invokeDelegate(event, root, selector, listener) {
  var matched = findDelegateTarget(event.target, root, selector);
  if (matched) {
    listener.call(matched, event, matched);
  }
}
function findDelegateTarget(target, root, selector) {
  var element = closestElement(target);
  var matched = element === null || element === void 0 ? void 0 : element.closest(selector);
  return matched && root.contains(matched) ? matched : null;
}
function closestElement(target) {
  var _target$parentElement;
  if (typeof (target === null || target === void 0 ? void 0 : target.closest) === 'function') {
    return target;
  }
  return (_target$parentElement = target === null || target === void 0 ? void 0 : target.parentElement) !== null && _target$parentElement !== void 0 ? _target$parentElement : null;
}
function assertEventTarget(target) {
  if (typeof (target === null || target === void 0 ? void 0 : target.addEventListener) !== 'function' || typeof (target === null || target === void 0 ? void 0 : target.removeEventListener) !== 'function') {
    throw new TypeError('Event target must support addEventListener and removeEventListener.');
  }
}
function assertDelegationRoot(root) {
  assertEventTarget(root);
  if (typeof root.contains !== 'function') {
    throw new TypeError('Delegation root must support contains().');
  }
}
function assertEventType(type) {
  if (typeof type !== 'string' || type.length === 0) {
    throw new TypeError('Event type must be a non-empty string.');
  }
}
function assertSelector(selector) {
  if (typeof selector !== 'string' || selector.length === 0) {
    throw new TypeError('Delegated selector must be a non-empty string.');
  }
}
function assertListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('Event listener must be a function.');
  }
}

/***/ }),

/***/ "./resources/frontend/core/events/event-bus.js":
/*!*****************************************************!*\
  !*** ./resources/frontend/core/events/event-bus.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AdminEventBus": () => (/* binding */ AdminEventBus),
/* harmony export */   "createEventBus": () => (/* binding */ createEventBus)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var dispatchStates = new WeakMap();
var AdminEventBus = /*#__PURE__*/function () {
  function AdminEventBus() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultEventTarget();
    _classCallCheck(this, AdminEventBus);
    this.eventTarget = target;
    this.subscriptions = new Map();
  }
  return _createClass(AdminEventBus, [{
    key: "on",
    value: function on(type, callback, context) {
      var _this$subscriptions$g;
      assertEventType(type);
      assertCallback(callback);
      var subscription = this.createSubscription(callback, context);
      var subscriptions = (_this$subscriptions$g = this.subscriptions.get(type)) !== null && _this$subscriptions$g !== void 0 ? _this$subscriptions$g : [];
      subscriptions.push(subscription);
      this.subscriptions.set(type, subscriptions);
      this.eventTarget.addEventListener(type, subscription.listener);
    }
  }, {
    key: "off",
    value: function off(type, callback) {
      var _this$subscriptions$g2;
      if (!type) {
        this.clear();
        return;
      }
      var subscriptions = (_this$subscriptions$g2 = this.subscriptions.get(type)) !== null && _this$subscriptions$g2 !== void 0 ? _this$subscriptions$g2 : [];
      var removed = callback ? subscriptions.filter(function (subscription) {
        return subscription.callback === callback;
      }) : subscriptions;
      this.removeSubscriptions(type, removed);
    }
  }, {
    key: "fire",
    value: function fire(type) {
      assertEventType(type);
      for (var _len = arguments.length, parameters = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        parameters[_key - 1] = arguments[_key];
      }
      var event = createCustomEvent(type, parameters);
      var state = {
        error: null
      };
      dispatchStates.set(event, state);
      try {
        this.eventTarget.dispatchEvent(event);
      } finally {
        dispatchStates["delete"](event);
      }
      if (state.error) {
        throw state.error;
      }
    }
  }, {
    key: "target",
    value: function target() {
      return this.eventTarget;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _iterator = _createForOfIteratorHelper(this.subscriptions),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            type = _step$value[0],
            subscriptions = _step$value[1];
          this.removeSubscriptions(type, subscriptions);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "createSubscription",
    value: function createSubscription(callback, context) {
      return {
        callback: callback,
        listener: function listener(event) {
          return invokeCallback(event, callback, context);
        }
      };
    }
  }, {
    key: "removeSubscriptions",
    value: function removeSubscriptions(type, removed) {
      var _this$subscriptions$g3;
      if (removed.length === 0) {
        return;
      }
      var _iterator2 = _createForOfIteratorHelper(removed),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var subscription = _step2.value;
          this.eventTarget.removeEventListener(type, subscription.listener);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var removedSet = new Set(removed);
      var remaining = ((_this$subscriptions$g3 = this.subscriptions.get(type)) !== null && _this$subscriptions$g3 !== void 0 ? _this$subscriptions$g3 : []).filter(function (subscription) {
        return !removedSet.has(subscription);
      });
      if (remaining.length === 0) {
        this.subscriptions["delete"](type);
      } else {
        this.subscriptions.set(type, remaining);
      }
    }
  }]);
}();
function createEventBus(target) {
  return new AdminEventBus(target);
}
function invokeCallback(event, callback, context) {
  var state = dispatchStates.get(event);
  if (state !== null && state !== void 0 && state.error) {
    return;
  }
  try {
    callback.apply(context, event.detail);
  } catch (error) {
    if (!state) {
      throw error;
    }
    state.error = error;
  }
}
function defaultEventTarget() {
  var _globalThis$document;
  return (_globalThis$document = globalThis.document) !== null && _globalThis$document !== void 0 ? _globalThis$document : new globalThis.EventTarget();
}
function createCustomEvent(type, detail) {
  if (typeof globalThis.CustomEvent === 'function') {
    return new globalThis.CustomEvent(type, {
      detail: detail
    });
  }
  var event = new globalThis.Event(type);
  Object.defineProperty(event, 'detail', {
    value: detail
  });
  return event;
}
function assertEventType(type) {
  if (typeof type !== 'string' || type.length === 0) {
    throw new TypeError('Event type must be a non-empty string.');
  }
}
function assertCallback(callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Event callback must be a function.');
  }
}

/***/ }),

/***/ "./resources/frontend/core/http/csrf-token.js":
/*!****************************************************!*\
  !*** ./resources/frontend/core/http/csrf-token.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "readCsrfToken": () => (/* binding */ readCsrfToken)
/* harmony export */ });
function readCsrfToken() {
  var _document$querySelect;
  var document = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globalThis.document;
  var content = document === null || document === void 0 || (_document$querySelect = document.querySelector) === null || _document$querySelect === void 0 || (_document$querySelect = _document$querySelect.call(document, 'meta[name="csrf-token"]')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.getAttribute('content');
  return typeof content === 'string' && content.length > 0 ? content : null;
}

/***/ }),

/***/ "./resources/frontend/core/http/http-client.js":
/*!*****************************************************!*\
  !*** ./resources/frontend/core/http/http-client.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HttpClient": () => (/* binding */ HttpClient),
/* harmony export */   "HttpError": () => (/* binding */ HttpError),
/* harmony export */   "createHttpClient": () => (/* binding */ createHttpClient)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
var HttpError = /*#__PURE__*/function (_Error) {
  function HttpError(response) {
    var _response$status;
    var _this;
    _classCallCheck(this, HttpError);
    _this = _callSuper(this, HttpError, [httpErrorMessage(response)]);
    _this.name = 'HttpError';
    _this.response = response;
    _this.status = (_response$status = response === null || response === void 0 ? void 0 : response.status) !== null && _response$status !== void 0 ? _response$status : 0;
    return _this;
  }
  _inherits(HttpError, _Error);
  return _createClass(HttpError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
var HttpClient = /*#__PURE__*/function () {
  function HttpClient() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$fetch = _ref.fetch,
      fetch = _ref$fetch === void 0 ? globalThis.fetch : _ref$fetch,
      _ref$csrfToken = _ref.csrfToken,
      csrfToken = _ref$csrfToken === void 0 ? null : _ref$csrfToken;
    _classCallCheck(this, HttpClient);
    assertFetch(fetch);
    this.fetch = fetch;
    this.csrfToken = csrfToken;
  }
  return _createClass(HttpClient, [{
    key: "request",
    value: function () {
      var _request = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(url) {
        var _options$credentials;
        var options,
          method,
          response,
          _args = arguments;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              assertUrl(url);
              assertOptions(options);
              method = normalizeMethod(options.method);
              _context.n = 1;
              return this.fetch(url, _objectSpread(_objectSpread({}, options), {}, {
                credentials: (_options$credentials = options.credentials) !== null && _options$credentials !== void 0 ? _options$credentials : 'same-origin',
                headers: requestHeaders(options.headers, method, this.csrfToken),
                method: method
              }));
            case 1:
              response = _context.v;
              if (response !== null && response !== void 0 && response.ok) {
                _context.n = 2;
                break;
              }
              throw new HttpError(response);
            case 2:
              return _context.a(2, response);
          }
        }, _callee, this);
      }));
      function request(_x) {
        return _request.apply(this, arguments);
      }
      return request;
    }()
  }, {
    key: "get",
    value: function get(url, options) {
      return this.request(url, _objectSpread(_objectSpread({}, options), {}, {
        method: 'GET'
      }));
    }
  }, {
    key: "post",
    value: function post(url, body, options) {
      return this.request(url, _objectSpread(_objectSpread({}, options), {}, {
        body: body,
        method: 'POST'
      }));
    }
  }, {
    key: "put",
    value: function put(url, body, options) {
      return this.request(url, _objectSpread(_objectSpread({}, options), {}, {
        body: body,
        method: 'PUT'
      }));
    }
  }, {
    key: "patch",
    value: function patch(url, body, options) {
      return this.request(url, _objectSpread(_objectSpread({}, options), {}, {
        body: body,
        method: 'PATCH'
      }));
    }
  }, {
    key: "delete",
    value: function _delete(url, options) {
      return this.request(url, _objectSpread(_objectSpread({}, options), {}, {
        method: 'DELETE'
      }));
    }
  }]);
}();
function createHttpClient(options) {
  return new HttpClient(options);
}
function requestHeaders(input, method, csrfToken) {
  var headers = new globalThis.Headers(input);
  setDefaultHeader(headers, 'Accept', 'application/json');
  setDefaultHeader(headers, 'X-Requested-With', 'XMLHttpRequest');
  if (!SAFE_METHODS.has(method) && csrfToken) {
    setDefaultHeader(headers, 'X-CSRF-TOKEN', csrfToken);
  }
  return headers;
}
function setDefaultHeader(headers, name, value) {
  if (!headers.has(name)) headers.set(name, value);
}
function normalizeMethod() {
  var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GET';
  if (typeof method !== 'string' || method.length === 0) {
    throw new TypeError('HTTP method must be a non-empty string.');
  }
  return method.toUpperCase();
}
function httpErrorMessage(response) {
  var _response$status2;
  var status = (_response$status2 = response === null || response === void 0 ? void 0 : response.status) !== null && _response$status2 !== void 0 ? _response$status2 : 0;
  var text = response !== null && response !== void 0 && response.statusText ? " ".concat(response.statusText) : '';
  return "HTTP request failed with status ".concat(status).concat(text, ".");
}
function assertFetch(fetch) {
  if (typeof fetch !== 'function') {
    throw new TypeError('HTTP client requires a fetch function.');
  }
}
function assertUrl(url) {
  if (typeof url !== 'string' || url.length === 0) {
    throw new TypeError('HTTP request URL must be a non-empty string.');
  }
}
function assertOptions(options) {
  if (!options || _typeof(options) !== 'object' || Array.isArray(options)) {
    throw new TypeError('HTTP request options must be an object.');
  }
}

/***/ }),

/***/ "./resources/frontend/core/lifecycle/component-lifecycle.js":
/*!******************************************************************!*\
  !*** ./resources/frontend/core/lifecycle/component-lifecycle.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComponentLifecycle": () => (/* binding */ ComponentLifecycle),
/* harmony export */   "componentMountSkipped": () => (/* binding */ componentMountSkipped),
/* harmony export */   "createComponentLifecycle": () => (/* binding */ createComponentLifecycle)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var componentMountSkipped = Symbol["for"]('sleepingowl.component-mount-skipped');
var ComponentLifecycle = /*#__PURE__*/function () {
  function ComponentLifecycle() {
    _classCallCheck(this, ComponentLifecycle);
    this.definitions = [];
    this.definitionsByName = new Map();
    this.records = new Set();
    this.recordsByElement = new WeakMap();
  }
  return _createClass(ComponentLifecycle, [{
    key: "register",
    value: function register(definition) {
      var _this = this;
      var normalized = normalizeDefinition(definition);
      if (this.definitionsByName.has(normalized.name)) {
        throw new Error("Component ".concat(normalized.name, " is already registered."));
      }
      this.definitions.push(normalized);
      this.definitionsByName.set(normalized.name, normalized);
      return function () {
        return _this.unregister(normalized.name);
      };
    }
  }, {
    key: "unregister",
    value: function unregister(name) {
      var definition = this.definitionsByName.get(name);
      if (!definition) return false;
      this.definitions = this.definitions.filter(function (item) {
        return item !== definition;
      });
      this.definitionsByName["delete"](name);
      this.destroyRecords(recordsForDefinition(this.records, definition));
      return true;
    }
  }, {
    key: "scan",
    value: function scan() {
      var _this2 = this;
      var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globalThis.document;
      var name = arguments.length > 1 ? arguments[1] : undefined;
      assertRoot(root);
      return this.resolveDefinitions(name).reduce(function (count, definition) {
        return count + matchingElements(root, definition.selector).reduce(function (mounted, element) {
          return mounted + _this2.mountDefinition(element, definition);
        }, 0);
      }, 0);
    }
  }, {
    key: "mount",
    value: function mount(element) {
      var _this3 = this;
      assertElement(element);
      return this.definitions.reduce(function (count, definition) {
        return count + (element.matches(definition.selector) ? _this3.mountDefinition(element, definition) : 0);
      }, 0);
    }
  }, {
    key: "destroy",
    value: function destroy(root, name) {
      assertRoot(root);
      return this.destroyRecords(recordsInside(this.records, root, name));
    }
  }, {
    key: "get",
    value: function get(element, name) {
      var _this$recordsByElemen;
      return (_this$recordsByElemen = this.recordsByElement.get(element)) === null || _this$recordsByElemen === void 0 || (_this$recordsByElemen = _this$recordsByElemen.get(name)) === null || _this$recordsByElemen === void 0 ? void 0 : _this$recordsByElemen.instance;
    }
  }, {
    key: "mountDefinition",
    value: function mountDefinition(element, definition) {
      var _this$recordsByElemen2;
      if ((_this$recordsByElemen2 = this.recordsByElement.get(element)) !== null && _this$recordsByElemen2 !== void 0 && _this$recordsByElemen2.has(definition.name)) return 0;
      var record = {
        definition: definition,
        element: element,
        instance: undefined
      };
      this.track(record);
      try {
        record.instance = definition.mount(element);
      } catch (error) {
        this.untrack(record);
        throw error;
      }
      if (record.instance === componentMountSkipped) {
        this.untrack(record);
        return 0;
      }
      return 1;
    }
  }, {
    key: "resolveDefinitions",
    value: function resolveDefinitions(name) {
      if (name === undefined) return this.definitions;
      var definition = this.definitionsByName.get(name);
      return definition ? [definition] : [];
    }
  }, {
    key: "destroyRecords",
    value: function destroyRecords(records) {
      var _this4 = this;
      var errors = [];
      records.forEach(function (record) {
        if (!_this4.records.has(record)) return;
        _this4.untrack(record);
        try {
          destroyRecord(record);
        } catch (error) {
          errors.push(error);
        }
      });
      throwCleanupErrors(errors);
      return records.length;
    }
  }, {
    key: "track",
    value: function track(record) {
      var _this$recordsByElemen3;
      var elementRecords = (_this$recordsByElemen3 = this.recordsByElement.get(record.element)) !== null && _this$recordsByElemen3 !== void 0 ? _this$recordsByElemen3 : new Map();
      elementRecords.set(record.definition.name, record);
      this.recordsByElement.set(record.element, elementRecords);
      this.records.add(record);
    }
  }, {
    key: "untrack",
    value: function untrack(record) {
      var elementRecords = this.recordsByElement.get(record.element);
      elementRecords === null || elementRecords === void 0 || elementRecords["delete"](record.definition.name);
      if ((elementRecords === null || elementRecords === void 0 ? void 0 : elementRecords.size) === 0) this.recordsByElement["delete"](record.element);
      this.records["delete"](record);
    }
  }]);
}();
function createComponentLifecycle() {
  return new ComponentLifecycle();
}
function normalizeDefinition(definition) {
  var _definition$destroy;
  if (!definition || _typeof(definition) !== 'object') {
    throw new TypeError('Component definition must be an object.');
  }
  assertNonEmptyString(definition.name, 'name');
  assertNonEmptyString(definition.selector, 'selector');
  if (typeof definition.mount !== 'function') {
    throw new TypeError('Component definition mount must be a function.');
  }
  if (definition.destroy !== undefined && typeof definition.destroy !== 'function') {
    throw new TypeError('Component definition destroy must be a function when provided.');
  }
  return Object.freeze({
    destroy: (_definition$destroy = definition.destroy) !== null && _definition$destroy !== void 0 ? _definition$destroy : null,
    mount: definition.mount,
    name: definition.name,
    selector: definition.selector
  });
}
function matchingElements(root, selector) {
  var descendants = _toConsumableArray(root.querySelectorAll(selector));
  if (typeof root.matches === 'function' && root.matches(selector)) descendants.unshift(root);
  return descendants;
}
function recordsInside(records, root, name) {
  return _toConsumableArray(records).filter(function (record) {
    return root === record.element || root.contains(record.element);
  }).filter(function (record) {
    return name === undefined || record.definition.name === name;
  }).reverse();
}
function recordsForDefinition(records, definition) {
  return _toConsumableArray(records).filter(function (record) {
    return record.definition === definition;
  }).reverse();
}
function destroyRecord(_ref) {
  var definition = _ref.definition,
    element = _ref.element,
    instance = _ref.instance;
  if (definition.destroy) return definition.destroy(element, instance);
  if (typeof instance === 'function') return instance();
  if (typeof (instance === null || instance === void 0 ? void 0 : instance.destroy) === 'function') return instance.destroy();
}
function throwCleanupErrors(errors) {
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) {
    throw new AggregateError(errors, 'Multiple component destroy callbacks failed.');
  }
}
function assertRoot(root) {
  if (typeof (root === null || root === void 0 ? void 0 : root.querySelectorAll) !== 'function' || typeof (root === null || root === void 0 ? void 0 : root.contains) !== 'function') {
    throw new TypeError('Component lifecycle root must be a DOM query root.');
  }
}
function assertElement(element) {
  if (!element || element.nodeType !== 1 || typeof element.matches !== 'function') {
    throw new TypeError('Component lifecycle mount requires an Element.');
  }
}
function assertNonEmptyString(value, field) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError("Component definition ".concat(field, " must be a non-empty string."));
  }
}

/***/ }),

/***/ "./resources/frontend/core/runtime/admin-core.js":
/*!*******************************************************!*\
  !*** ./resources/frontend/core/runtime/admin-core.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createAdminCore": () => (/* binding */ createAdminCore),
/* harmony export */   "installAdminCore": () => (/* binding */ installAdminCore)
/* harmony export */ });
/* harmony import */ var _assets_runtime_assets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/runtime-assets.js */ "./resources/frontend/core/assets/runtime-assets.js");
/* harmony import */ var _data_island_props_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/island-props.js */ "./resources/frontend/core/data/island-props.js");
/* harmony import */ var _dom_forms_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom/forms.js */ "./resources/frontend/core/dom/forms.js");
/* harmony import */ var _dom_listeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom/listeners.js */ "./resources/frontend/core/dom/listeners.js");
/* harmony import */ var _events_event_bus_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../events/event-bus.js */ "./resources/frontend/core/events/event-bus.js");
/* harmony import */ var _http_csrf_token_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../http/csrf-token.js */ "./resources/frontend/core/http/csrf-token.js");
/* harmony import */ var _http_http_client_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../http/http-client.js */ "./resources/frontend/core/http/http-client.js");
/* harmony import */ var _lifecycle_component_lifecycle_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lifecycle/component-lifecycle.js */ "./resources/frontend/core/lifecycle/component-lifecycle.js");
/* harmony import */ var _storage_storage_repository_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../storage/storage-repository.js */ "./resources/frontend/core/storage/storage-repository.js");
/* harmony import */ var _tables_table_registry_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../tables/table-registry.js */ "./resources/frontend/core/tables/table-registry.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }










var DATA_API = Object.freeze({
  parseBoolean: _data_island_props_js__WEBPACK_IMPORTED_MODULE_1__.parseBoolean,
  parseJsonProps: _data_island_props_js__WEBPACK_IMPORTED_MODULE_1__.parseJsonProps,
  parseNumber: _data_island_props_js__WEBPACK_IMPORTED_MODULE_1__.parseNumber,
  readDataset: _data_island_props_js__WEBPACK_IMPORTED_MODULE_1__.readDataset
});
var DOM_API = Object.freeze({
  createPostForm: _dom_forms_js__WEBPACK_IMPORTED_MODULE_2__.createPostForm,
  delegate: _dom_listeners_js__WEBPACK_IMPORTED_MODULE_3__.delegate,
  listen: _dom_listeners_js__WEBPACK_IMPORTED_MODULE_3__.listen,
  submitForm: _dom_forms_js__WEBPACK_IMPORTED_MODULE_2__.submitForm,
  submitPostForm: _dom_forms_js__WEBPACK_IMPORTED_MODULE_2__.submitPostForm
});
function createAdminCore() {
  var _options$document, _options$csrfToken, _options$fetch, _options$storage;
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var document = (_options$document = options.document) !== null && _options$document !== void 0 ? _options$document : globalThis.document;
  return {
    Asset: (0,_assets_runtime_assets_js__WEBPACK_IMPORTED_MODULE_0__.createRuntimeAssetLoader)({
      createImage: options.createImage,
      document: document,
      log: options.assetLog
    }),
    Components: (0,_lifecycle_component_lifecycle_js__WEBPACK_IMPORTED_MODULE_7__.createComponentLifecycle)(),
    Data: DATA_API,
    DOM: DOM_API,
    Events: (0,_events_event_bus_js__WEBPACK_IMPORTED_MODULE_4__.createEventBus)(document),
    Http: (0,_http_http_client_js__WEBPACK_IMPORTED_MODULE_6__.createHttpClient)({
      csrfToken: (_options$csrfToken = options.csrfToken) !== null && _options$csrfToken !== void 0 ? _options$csrfToken : (0,_http_csrf_token_js__WEBPACK_IMPORTED_MODULE_5__.readCsrfToken)(document),
      fetch: (_options$fetch = options.fetch) !== null && _options$fetch !== void 0 ? _options$fetch : globalThis.fetch
    }),
    Storage: (0,_storage_storage_repository_js__WEBPACK_IMPORTED_MODULE_8__.createStorageRepository)((_options$storage = options.storage) !== null && _options$storage !== void 0 ? _options$storage : globalThis.localStorage),
    Tables: (0,_tables_table_registry_js__WEBPACK_IMPORTED_MODULE_9__.createTableRegistry)()
  };
}
function installAdminCore() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globalThis;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  assertTarget(target);
  var admin = adminNamespace(target);
  var services = createAdminCore(_objectSpread(_objectSpread({}, targetOptions(target)), options));
  Object.entries(services).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      name = _ref2[0],
      service = _ref2[1];
    if (!(name in admin)) admin[name] = service;
  });
  target.Admin = admin;
  return admin;
}
function adminNamespace(target) {
  var _target$Admin;
  var admin = (_target$Admin = target.Admin) !== null && _target$Admin !== void 0 ? _target$Admin : {};
  if ((_typeof(admin) !== 'object' || admin === null) && typeof admin !== 'function') {
    throw new TypeError('Existing Admin namespace must be an object.');
  }
  return admin;
}
function targetOptions(target) {
  var Image = safeProperty(target, 'Image');
  var fetch = safeProperty(target, 'fetch');
  return {
    createImage: typeof Image === 'function' ? function () {
      return new Image();
    } : undefined,
    document: safeProperty(target, 'document'),
    fetch: typeof fetch === 'function' ? fetch.bind(target) : fetch,
    storage: safeProperty(target, 'localStorage')
  };
}
function safeProperty(target, name) {
  try {
    return target[name];
  } catch (_unused) {
    return undefined;
  }
}
function assertTarget(target) {
  if (!target || _typeof(target) !== 'object' && typeof target !== 'function') {
    throw new TypeError('Admin core target must be an object.');
  }
}

/***/ }),

/***/ "./resources/frontend/core/storage/storage-repository.js":
/*!***************************************************************!*\
  !*** ./resources/frontend/core/storage/storage-repository.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StorageRepository": () => (/* binding */ StorageRepository),
/* harmony export */   "createStorageRepository": () => (/* binding */ createStorageRepository)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DEFAULT_PREFIX = 'SleepingOwl::';
var StorageRepository = /*#__PURE__*/function () {
  function StorageRepository() {
    var storage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globalThis.localStorage;
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_PREFIX;
    _classCallCheck(this, StorageRepository);
    assertStorage(storage);
    assertPrefix(prefix);
    this.storage = storage;
    this.prefix = prefix;
  }
  return _createClass(StorageRepository, [{
    key: "set",
    value: function set(key, value) {
      var _this = this;
      if (isRecord(key)) {
        Object.entries(key).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            name = _ref2[0],
            item = _ref2[1];
          return _this.write(name, item);
        });
        return this;
      }
      this.write(key, value);
      return this;
    }
  }, {
    key: "get",
    value: function get(key) {
      var _this2 = this;
      if (Array.isArray(key)) {
        return Object.fromEntries(key.map(function (name) {
          return [name, _this2.read(name)];
        }));
      }
      return this.read(key);
    }
  }, {
    key: "remove",
    value: function remove(key) {
      var _this3 = this;
      normalizeKeys(key).forEach(function (name) {
        return _this3.storage.removeItem(_this3.storageKey(name));
      });
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this4 = this;
      var keys = this.ownedKeys();
      keys.forEach(function (key) {
        return _this4.storage.removeItem(key);
      });
      return keys.length;
    }
  }, {
    key: "read",
    value: function read(key) {
      return this.storage.getItem(this.storageKey(key));
    }
  }, {
    key: "write",
    value: function write(key, value) {
      this.storage.setItem(this.storageKey(key), value);
    }
  }, {
    key: "storageKey",
    value: function storageKey(key) {
      assertKey(key);
      return "".concat(this.prefix).concat(key);
    }
  }, {
    key: "ownedKeys",
    value: function ownedKeys() {
      var _this5 = this;
      return Array.from({
        length: this.storage.length
      }, function (_, index) {
        return _this5.storage.key(index);
      }).filter(function (key) {
        return typeof key === 'string' && key.startsWith(_this5.prefix);
      });
    }
  }]);
}();
function createStorageRepository(storage, prefix) {
  return new StorageRepository(storage, prefix);
}
function normalizeKeys(key) {
  return Array.isArray(key) ? key : [key];
}
function isRecord(value) {
  return value !== null && _typeof(value) === 'object' && !Array.isArray(value);
}
function assertStorage(storage) {
  var methods = ['getItem', 'setItem', 'removeItem', 'key'];
  if (!storage || methods.some(function (method) {
    return typeof storage[method] !== 'function';
  })) {
    throw new TypeError('Storage repository requires the Web Storage interface.');
  }
}
function assertPrefix(prefix) {
  if (typeof prefix !== 'string' || prefix.length === 0) {
    throw new TypeError('Storage prefix must be a non-empty string.');
  }
}
function assertKey(key) {
  if (typeof key !== 'string' || key.length === 0) {
    throw new TypeError('Storage key must be a non-empty string.');
  }
}

/***/ }),

/***/ "./resources/frontend/core/tables/table-registry.js":
/*!**********************************************************!*\
  !*** ./resources/frontend/core/tables/table-registry.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TableRegistry": () => (/* binding */ TableRegistry),
/* harmony export */   "assertTableAdapter": () => (/* binding */ assertTableAdapter),
/* harmony export */   "createTableRegistry": () => (/* binding */ createTableRegistry)
/* harmony export */ });
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ADAPTER_METHODS = ['reload', 'destroy', 'clearState', 'selectedRows'];
var TableRegistry = /*#__PURE__*/function () {
  function TableRegistry() {
    _classCallCheck(this, TableRegistry);
    this.adapters = new Map();
    this.listeners = new Set();
  }
  return _createClass(TableRegistry, [{
    key: "register",
    value: function register(adapter) {
      assertTableAdapter(adapter);
      var current = this.adapters.get(adapter.element);
      if (current && current !== adapter) {
        throw new Error('A table adapter is already registered for this element.');
      }
      if (current === adapter) return adapter;
      this.adapters.set(adapter.element, adapter);
      this.notify('registered', adapter);
      return adapter;
    }
  }, {
    key: "unregister",
    value: function unregister(element) {
      var _this$adapters$get;
      assertElement(element);
      var adapter = (_this$adapters$get = this.adapters.get(element)) !== null && _this$adapters$get !== void 0 ? _this$adapters$get : null;
      this.adapters["delete"](element);
      if (adapter) this.notify('unregistered', adapter);
      return adapter;
    }
  }, {
    key: "get",
    value: function get(element) {
      var _this$adapters$get2;
      assertElement(element);
      return (_this$adapters$get2 = this.adapters.get(element)) !== null && _this$adapters$get2 !== void 0 ? _this$adapters$get2 : null;
    }
  }, {
    key: "require",
    value: function require(element) {
      var adapter = this.get(element);
      if (!adapter) {
        throw new Error('No table adapter is registered for this element.');
      }
      return adapter;
    }
  }, {
    key: "has",
    value: function has(element) {
      assertElement(element);
      return this.adapters.has(element);
    }
  }, {
    key: "all",
    value: function all() {
      return _toConsumableArray(this.adapters.values());
    }
  }, {
    key: "subscribe",
    value: function subscribe(listener) {
      var _this = this;
      if (typeof listener !== 'function') {
        throw new TypeError('Table registry listener must be a function.');
      }
      this.listeners.add(listener);
      return function () {
        return _this.listeners["delete"](listener);
      };
    }
  }, {
    key: "reload",
    value: function reload(element) {
      return invokeAdapters(this, 'reload', element);
    }
  }, {
    key: "clearState",
    value: function clearState(element) {
      return invokeAdapters(this, 'clearState', element);
    }
  }, {
    key: "selectedRows",
    value: function selectedRows(element) {
      var rows = this.require(element).selectedRows();
      if (!Array.isArray(rows)) {
        throw new TypeError('Table adapter selectedRows() must return an array.');
      }
      return rows;
    }
  }, {
    key: "notify",
    value: function notify(type, adapter) {
      this.listeners.forEach(function (listener) {
        return listener({
          adapter: adapter,
          type: type
        });
      });
    }
  }]);
}();
function createTableRegistry() {
  return new TableRegistry();
}
function assertTableAdapter(adapter) {
  if (!adapter || _typeof(adapter) !== 'object') {
    throw new TypeError('Table adapter must be an object.');
  }
  assertElement(adapter.element);
  assertEngineInstance(adapter);
  var _iterator = _createForOfIteratorHelper(ADAPTER_METHODS),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var method = _step.value;
      assertAdapterMethod(adapter, method);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function assertElement(element) {
  if (!element || _typeof(element) !== 'object' || element.nodeType !== 1) {
    throw new TypeError('Table adapter element must be a DOM Element.');
  }
}
function assertEngineInstance(adapter) {
  if (!('engineInstance' in adapter) || adapter.engineInstance === undefined) {
    throw new TypeError('Table adapter must expose engineInstance.');
  }
}
function assertAdapterMethod(adapter, method) {
  if (typeof adapter[method] !== 'function') {
    throw new TypeError("Table adapter must implement ".concat(method, "()."));
  }
}
function invokeAdapters(registry, method, element) {
  if (element !== undefined) {
    return registry.require(element)[method]();
  }
  return registry.all().map(function (adapter) {
    return adapter[method]();
  });
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************!*\
  !*** ./resources/frontend/core/browser.js ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _runtime_admin_core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runtime/admin-core.js */ "./resources/frontend/core/runtime/admin-core.js");

if (globalThis.document) (0,_runtime_admin_core_js__WEBPACK_IMPORTED_MODULE_0__.installAdminCore)(globalThis);
})();

/******/ })()
;
//# sourceMappingURL=admin-core.js.map