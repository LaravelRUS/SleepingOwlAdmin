/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/themes/adminlte/features/tree/notifications.js"
/*!*********************************************************************!*\
  !*** ./resources/js/themes/adminlte/features/tree/notifications.js ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createLegacyTreeNotifications: () => (/* binding */ createLegacyTreeNotifications)
/* harmony export */ });
function createLegacyTreeNotifications(swal, messages, labels) {
  assertDependencies(swal, messages);
  var toast = swal.mixin({
    didOpen: bindToastPause(swal),
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    toast: true
  });
  return {
    error: function error() {
      return messages.error(labels.error);
    },
    success: function success() {
      return toast.fire({
        icon: 'success',
        title: labels.success
      });
    }
  };
}
function bindToastPause(swal) {
  return function (toast) {
    toast.addEventListener('mouseenter', swal.stopTimer);
    toast.addEventListener('mouseleave', swal.resumeTimer);
  };
}
function assertDependencies(swal, messages) {
  if (typeof (swal === null || swal === void 0 ? void 0 : swal.mixin) !== 'function' || typeof (messages === null || messages === void 0 ? void 0 : messages.error) !== 'function') {
    throw new TypeError('Legacy tree notifications require SweetAlert and Admin.Messages.');
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
/*!***************************************************************!*\
  !*** ./resources/js/themes/adminlte/features/tree/browser.js ***!
  \***************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   installLegacyTreeNotifications: () => (/* binding */ installLegacyTreeNotifications)
/* harmony export */ });
/* harmony import */ var _notifications_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notifications.js */ "./resources/js/themes/adminlte/features/tree/notifications.js");

if (globalThis.document) installLegacyTreeNotifications(globalThis);
function installLegacyTreeNotifications(target) {
  var _target$Admin;
  var root = requireEventTarget(target.document);
  var notifications = (0,_notifications_js__WEBPACK_IMPORTED_MODULE_0__.createLegacyTreeNotifications)(target.Swal, (_target$Admin = target.Admin) === null || _target$Admin === void 0 ? void 0 : _target$Admin.Messages, notificationLabels(target.trans));
  var onChanged = function onChanged() {
    return notifications.success();
  };
  var onFailed = function onFailed(event) {
    var _event$detail;
    return notifications.error((_event$detail = event.detail) === null || _event$detail === void 0 ? void 0 : _event$detail.error);
  };
  root.addEventListener('tree:changed', onChanged);
  root.addEventListener('tree:failed', onFailed);
  return {
    destroy: function destroy() {
      return removeListeners(root, {
        onChanged: onChanged,
        onFailed: onFailed
      });
    }
  };
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
function removeListeners(root, listeners) {
  root.removeEventListener('tree:changed', listeners.onChanged);
  root.removeEventListener('tree:failed', listeners.onFailed);
}
function requireEventTarget(root) {
  if (typeof (root === null || root === void 0 ? void 0 : root.addEventListener) !== 'function' || typeof (root === null || root === void 0 ? void 0 : root.removeEventListener) !== 'function') {
    throw new TypeError('Legacy tree notifications require a document event target.');
  }
  return root;
}
})();

/******/ })()
;
//# sourceMappingURL=legacy-adminlte.js.map