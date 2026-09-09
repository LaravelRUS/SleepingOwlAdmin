/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/core/dom/listeners.js"
/*!********************************************!*\
  !*** ./resources/js/core/dom/listeners.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   delegate: () => (/* binding */ delegate),
/* harmony export */   listen: () => (/* binding */ listen)
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

/***/ },

/***/ "./resources/js/shared/features/alert/alert-elements.js"
/*!**************************************************************!*\
  !*** ./resources/js/shared/features/alert/alert-elements.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALERT_DISMISS_SELECTOR: () => (/* binding */ ALERT_DISMISS_SELECTOR),
/* harmony export */   ALERT_SELECTOR: () => (/* binding */ ALERT_SELECTOR),
/* harmony export */   findAlert: () => (/* binding */ findAlert),
/* harmony export */   findAlertDismiss: () => (/* binding */ findAlertDismiss),
/* harmony export */   isAlertDismissDisabled: () => (/* binding */ isAlertDismissDisabled)
/* harmony export */ });
var ALERT_SELECTOR = '.alert';
var ALERT_DISMISS_SELECTOR = '[data-bs-dismiss="alert"], [data-dismiss="alert"]';
function findAlert(root, element) {
  var _ref, _directAlert;
  var target = (_ref = (_directAlert = directAlert(element)) !== null && _directAlert !== void 0 ? _directAlert : targetedAlert(element)) !== null && _ref !== void 0 ? _ref : closestAlert(element);
  return containedAlert(root, target);
}
function findAlertDismiss(root, target) {
  var _target$closest;
  var dismiss = target === null || target === void 0 || (_target$closest = target.closest) === null || _target$closest === void 0 ? void 0 : _target$closest.call(target, ALERT_DISMISS_SELECTOR);
  return dismiss && root.contains(dismiss) ? dismiss : null;
}
function isAlertDismissDisabled(element) {
  return hasDisabledAttribute(element) || hasDisabledState(element);
}
function directAlert(element) {
  var _element$matches;
  return element !== null && element !== void 0 && (_element$matches = element.matches) !== null && _element$matches !== void 0 && _element$matches.call(element, ALERT_SELECTOR) ? element : null;
}
function closestAlert(element) {
  var _element$closest, _element$closest2;
  return (_element$closest = element === null || element === void 0 || (_element$closest2 = element.closest) === null || _element$closest2 === void 0 ? void 0 : _element$closest2.call(element, ALERT_SELECTOR)) !== null && _element$closest !== void 0 ? _element$closest : null;
}
function containedAlert(root, alert) {
  return alert && root.contains(alert) ? alert : null;
}
function hasDisabledAttribute(element) {
  var _element$hasAttribute;
  return (element === null || element === void 0 || (_element$hasAttribute = element.hasAttribute) === null || _element$hasAttribute === void 0 ? void 0 : _element$hasAttribute.call(element, 'disabled')) === true;
}
function hasDisabledState(element) {
  var _element$getAttribute, _element$classList;
  return (element === null || element === void 0 || (_element$getAttribute = element.getAttribute) === null || _element$getAttribute === void 0 ? void 0 : _element$getAttribute.call(element, 'aria-disabled')) === 'true' || (element === null || element === void 0 || (_element$classList = element.classList) === null || _element$classList === void 0 ? void 0 : _element$classList.contains('disabled')) === true;
}
function targetedAlert(element) {
  var _ref2, _element$getAttribute2, _element$getAttribute3, _element$getAttribute4;
  var target = (_ref2 = (_element$getAttribute2 = element === null || element === void 0 || (_element$getAttribute3 = element.getAttribute) === null || _element$getAttribute3 === void 0 ? void 0 : _element$getAttribute3.call(element, 'data-target')) !== null && _element$getAttribute2 !== void 0 ? _element$getAttribute2 : element === null || element === void 0 || (_element$getAttribute4 = element.getAttribute) === null || _element$getAttribute4 === void 0 ? void 0 : _element$getAttribute4.call(element, 'href')) !== null && _ref2 !== void 0 ? _ref2 : '';
  return target.startsWith('#') ? element.ownerDocument.getElementById(target.slice(1)) : null;
}

/***/ },

/***/ "./resources/js/shared/features/alert/alert-events.js"
/*!************************************************************!*\
  !*** ./resources/js/shared/features/alert/alert-events.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dispatchAlertEvent: () => (/* binding */ dispatchAlertEvent),
/* harmony export */   notifyAlertClosed: () => (/* binding */ notifyAlertClosed),
/* harmony export */   permitAlertClose: () => (/* binding */ permitAlertClose)
/* harmony export */ });
function dispatchAlertEvent(alert, name, trigger) {
  var cancelable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var CustomEvent = alert.ownerDocument.defaultView.CustomEvent;
  return alert.dispatchEvent(new CustomEvent(name, {
    bubbles: true,
    cancelable: cancelable,
    detail: {
      alert: alert,
      trigger: trigger
    }
  }));
}
function permitAlertClose(alert, trigger) {
  return dispatchAlertEvent(alert, 'alert:close', trigger, true) && dispatchAlertEvent(alert, 'close.bs.alert', trigger, true);
}
function notifyAlertClosed(alert, trigger) {
  dispatchAlertEvent(alert, 'alert:closed', trigger);
  dispatchAlertEvent(alert, 'closed.bs.alert', trigger);
}

/***/ },

/***/ "./resources/js/shared/features/alert/alert-transition.js"
/*!****************************************************************!*\
  !*** ./resources/js/shared/features/alert/alert-transition.js ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   transitionMilliseconds: () => (/* binding */ transitionMilliseconds),
/* harmony export */   waitForAlertTransition: () => (/* binding */ waitForAlertTransition)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function transitionMilliseconds(element) {
  var styles = element.ownerDocument.defaultView.getComputedStyle(element);
  var durations = timeList(styles.transitionDuration);
  var delays = timeList(styles.transitionDelay);
  var length = Math.max(durations.length, delays.length);
  return Math.max.apply(Math, [0].concat(_toConsumableArray(Array.from({
    length: length
  }, function (_, index) {
    return durations[index % durations.length] + delays[index % delays.length];
  }))));
}
function waitForAlertTransition(alert, callback) {
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : globalThis.setTimeout;
  var duration = alert.classList.contains('fade') ? transitionMilliseconds(alert) : 0;
  if (duration <= 0) {
    callback();
    return function () {};
  }
  var timer = timeout(callback, duration + 50);
  var finish = function finish(event) {
    if (event.target !== alert) return;
    globalThis.clearTimeout(timer);
    timer = null;
    callback();
  };
  alert.addEventListener('transitionend', finish, {
    once: true
  });
  return function () {
    if (timer !== null) globalThis.clearTimeout(timer);
    alert.removeEventListener('transitionend', finish);
  };
}
function timeList(value) {
  return value.split(',').map(timeMilliseconds);
}
function timeMilliseconds(value) {
  var number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return 0;
  return value.trim().endsWith('ms') ? number : number * 1000;
}

/***/ },

/***/ "./resources/js/shared/features/alert/alerts.js"
/*!******************************************************!*\
  !*** ./resources/js/shared/features/alert/alerts.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mountAlerts: () => (/* binding */ mountAlerts)
/* harmony export */ });
/* harmony import */ var _core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/dom/listeners.js */ "./resources/js/core/dom/listeners.js");
/* harmony import */ var _alert_elements_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./alert-elements.js */ "./resources/js/shared/features/alert/alert-elements.js");
/* harmony import */ var _alert_events_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./alert-events.js */ "./resources/js/shared/features/alert/alert-events.js");
/* harmony import */ var _alert_transition_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./alert-transition.js */ "./resources/js/shared/features/alert/alert-transition.js");




function mountAlerts(root) {
  assertRoot(root);
  var pending = new Map();
  var unbind = (0,_core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__.delegate)(root, 'click', _alert_elements_js__WEBPACK_IMPORTED_MODULE_1__.ALERT_DISMISS_SELECTOR, function (event, trigger) {
    if ((0,_alert_elements_js__WEBPACK_IMPORTED_MODULE_1__.isAlertDismissDisabled)(trigger)) return;
    event.preventDefault();
    closeAlert(root, pending, trigger);
  });
  return {
    close: function close(element) {
      return closeAlert(root, pending, element);
    },
    destroy: function destroy() {
      return destroyAlerts(pending, unbind);
    }
  };
}
function closeAlert(root, pending, element) {
  var alert = (0,_alert_elements_js__WEBPACK_IMPORTED_MODULE_1__.findAlert)(root, element);
  if (!alert || pending.has(alert) || !(0,_alert_events_js__WEBPACK_IMPORTED_MODULE_2__.permitAlertClose)(alert, element)) return false;
  alert.classList.remove('show');
  var finish = function finish() {
    return removeAlert(pending, alert, element);
  };
  pending.set(alert, function () {});
  var cancel = (0,_alert_transition_js__WEBPACK_IMPORTED_MODULE_3__.waitForAlertTransition)(alert, finish);
  if (pending.has(alert)) pending.set(alert, cancel);
  return true;
}
function removeAlert(pending, alert, trigger) {
  var _pending$get;
  (_pending$get = pending.get(alert)) === null || _pending$get === void 0 || _pending$get();
  pending["delete"](alert);
  alert.remove();
  (0,_alert_events_js__WEBPACK_IMPORTED_MODULE_2__.notifyAlertClosed)(alert, trigger);
}
function destroyAlerts(pending, unbind) {
  unbind();
  pending.forEach(function (cancel) {
    return cancel();
  });
  pending.clear();
}
function assertRoot(root) {
  if (typeof (root === null || root === void 0 ? void 0 : root.addEventListener) !== 'function' || typeof (root === null || root === void 0 ? void 0 : root.contains) !== 'function') {
    throw new TypeError('Alerts require a DOM query root.');
  }
}

/***/ },

/***/ "./resources/js/shared/features/alert/install-alerts.js"
/*!**************************************************************!*\
  !*** ./resources/js/shared/features/alert/install-alerts.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALERT_COMPONENT: () => (/* binding */ ALERT_COMPONENT),
/* harmony export */   ALERT_ROOT_SELECTOR: () => (/* binding */ ALERT_ROOT_SELECTOR),
/* harmony export */   installAlerts: () => (/* binding */ installAlerts)
/* harmony export */ });
/* harmony import */ var _alerts_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./alerts.js */ "./resources/js/shared/features/alert/alerts.js");

var ALERT_COMPONENT = 'alerts';
var ALERT_ROOT_SELECTOR = 'body';
function installAlerts(admin) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  assertAdmin(admin);
  var controller = null;
  admin.Components.register({
    mount: function mount(body) {
      controller = (0,_alerts_js__WEBPACK_IMPORTED_MODULE_0__.mountAlerts)(body);
      return {
        destroy: function destroy() {
          var _controller;
          return (_controller = controller) === null || _controller === void 0 ? void 0 : _controller.destroy();
        }
      };
    },
    name: ALERT_COMPONENT,
    selector: ALERT_ROOT_SELECTOR
  });
  return {
    close: function close(element) {
      var _controller$close, _controller2;
      return (_controller$close = (_controller2 = controller) === null || _controller2 === void 0 ? void 0 : _controller2.close(element)) !== null && _controller$close !== void 0 ? _controller$close : false;
    },
    scan: function scan() {
      var _options$root;
      var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_options$root = options.root) !== null && _options$root !== void 0 ? _options$root : globalThis.document;
      return admin.Components.scan(root, ALERT_COMPONENT);
    }
  };
}
function assertAdmin(admin) {
  var _admin$Components;
  if (typeof (admin === null || admin === void 0 || (_admin$Components = admin.Components) === null || _admin$Components === void 0 ? void 0 : _admin$Components.register) !== 'function') {
    throw new TypeError('Alerts require Admin.Components.');
  }
  if (typeof admin.Components.scan !== 'function') {
    throw new TypeError('Alerts require Admin.Components.scan().');
  }
}

/***/ }

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
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************************************!*\
  !*** ./resources/js/shared/features/alert/browser.js ***!
  \*******************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bootAlerts: () => (/* binding */ bootAlerts)
/* harmony export */ });
/* harmony import */ var _install_alerts_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./install-alerts.js */ "./resources/js/shared/features/alert/install-alerts.js");

if (globalThis.document) bootAlerts(globalThis);
function bootAlerts(target) {
  var alerts = (0,_install_alerts_js__WEBPACK_IMPORTED_MODULE_0__.installAlerts)(target.Admin, {
    root: target.document
  });
  target.Admin.Alerts = alerts;
  alerts.scan();
  return alerts;
}
})();

/******/ })()
;
//# sourceMappingURL=alert.js.map