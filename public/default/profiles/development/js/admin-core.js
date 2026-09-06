/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/*!******************************************!*\
  !*** ./resources/frontend/core/index.js ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AdminEventBus": () => (/* reexport safe */ _events_event_bus_js__WEBPACK_IMPORTED_MODULE_1__.AdminEventBus),
/* harmony export */   "createEventBus": () => (/* reexport safe */ _events_event_bus_js__WEBPACK_IMPORTED_MODULE_1__.createEventBus),
/* harmony export */   "parseBoolean": () => (/* reexport safe */ _data_island_props_js__WEBPACK_IMPORTED_MODULE_0__.parseBoolean),
/* harmony export */   "parseJsonProps": () => (/* reexport safe */ _data_island_props_js__WEBPACK_IMPORTED_MODULE_0__.parseJsonProps),
/* harmony export */   "parseNumber": () => (/* reexport safe */ _data_island_props_js__WEBPACK_IMPORTED_MODULE_0__.parseNumber),
/* harmony export */   "readDataset": () => (/* reexport safe */ _data_island_props_js__WEBPACK_IMPORTED_MODULE_0__.readDataset)
/* harmony export */ });
/* harmony import */ var _data_island_props_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data/island-props.js */ "./resources/frontend/core/data/island-props.js");
/* harmony import */ var _events_event_bus_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events/event-bus.js */ "./resources/frontend/core/events/event-bus.js");


})();

/******/ })()
;
//# sourceMappingURL=admin-core.js.map