/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/themes/shadcn/features/tree/notifications.js"
/*!*******************************************************************!*\
  !*** ./resources/js/themes/shadcn/features/tree/notifications.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTailwindTreeNotifications: () => (/* binding */ createTailwindTreeNotifications)
/* harmony export */ });
function createTailwindTreeNotifications() {
  var _labels$error, _labels$success;
  var labels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var messages = {
    error: (_labels$error = labels.error) !== null && _labels$error !== void 0 ? _labels$error : 'Unable to save tree',
    success: (_labels$success = labels.success) !== null && _labels$success !== void 0 ? _labels$success : 'Tree order saved'
  };
  return {
    error: function error(region) {
      return updateRegion(region, 'error', messages.error);
    },
    success: function success(region) {
      return updateRegion(region, 'success', messages.success);
    }
  };
}
function updateRegion(region, state, message) {
  if (!region) return false;
  region.dataset.state = state;
  region.hidden = false;
  region.setAttribute('role', state === 'error' ? 'alert' : 'status');
  region.textContent = message;
  return true;
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
/*!*************************************************************!*\
  !*** ./resources/js/themes/shadcn/features/tree/browser.js ***!
  \*************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   installTailwindTreeNotifications: () => (/* binding */ installTailwindTreeNotifications)
/* harmony export */ });
/* harmony import */ var _notifications_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notifications.js */ "./resources/js/themes/shadcn/features/tree/notifications.js");

var TREE_SELECTOR = '[data-tree]';
var NOTIFICATION_SELECTOR = '[data-tree-notification]';
if (globalThis.document) installTailwindTreeNotifications(globalThis);
function installTailwindTreeNotifications(target) {
  var root = requireEventTarget(target.document);
  var notifications = (0,_notifications_js__WEBPACK_IMPORTED_MODULE_0__.createTailwindTreeNotifications)(notificationLabels(target.trans));
  var onChanged = function onChanged(event) {
    return notifications.success(notificationRegion(event));
  };
  var onFailed = function onFailed(event) {
    return notifications.error(notificationRegion(event));
  };
  root.addEventListener('tree:changed', onChanged);
  root.addEventListener('tree:failed', onFailed);
  return {
    destroy: function destroy() {
      root.removeEventListener('tree:changed', onChanged);
      root.removeEventListener('tree:failed', onFailed);
    }
  };
}
function notificationRegion(event) {
  var _event$target$closest, _event$target, _event$target$closest2, _event$target$closest3;
  return (_event$target$closest = (_event$target = event.target) === null || _event$target === void 0 || (_event$target$closest2 = _event$target.closest) === null || _event$target$closest2 === void 0 || (_event$target$closest2 = _event$target$closest2.call(_event$target, TREE_SELECTOR)) === null || _event$target$closest2 === void 0 || (_event$target$closest3 = _event$target$closest2.querySelector) === null || _event$target$closest3 === void 0 ? void 0 : _event$target$closest3.call(_event$target$closest2, NOTIFICATION_SELECTOR)) !== null && _event$target$closest !== void 0 ? _event$target$closest : null;
}
function notificationLabels(translate) {
  return {
    error: translated(translate, 'lang.table.error', 'Unable to save tree'),
    success: translated(translate, 'lang.tree.reorderCompleted', 'Tree order saved')
  };
}
function translated(translate, key, fallback) {
  if (typeof translate !== 'function') return fallback;
  var value = translate(key);
  return typeof value === 'string' && value !== key ? value : fallback;
}
function requireEventTarget(root) {
  if (typeof (root === null || root === void 0 ? void 0 : root.addEventListener) !== 'function' || typeof (root === null || root === void 0 ? void 0 : root.removeEventListener) !== 'function') {
    throw new TypeError('Tailwind tree notifications require a document event target.');
  }
  return root;
}
})();

/******/ })()
;
//# sourceMappingURL=shadcn.js.map