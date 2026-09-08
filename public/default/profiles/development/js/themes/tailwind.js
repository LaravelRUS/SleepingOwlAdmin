/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/frontend/themes/tailwind/runtime.js"
/*!*******************************************************!*\
  !*** ./resources/frontend/themes/tailwind/runtime.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyColorMode: () => (/* binding */ applyColorMode),
/* harmony export */   installTailwindTheme: () => (/* binding */ installTailwindTheme)
/* harmony export */ });
var INSTALLATION = Symbol["for"]('sleepingowl.theme.tailwind');
function installTailwindTheme() {
  var _readStoredMode;
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globalThis;
  if (target[INSTALLATION]) return target[INSTALLATION];
  var document = target.document;
  if (!document) return null;
  var toggle = document.getElementById('theme-mode');
  if (!toggle) return null;
  var apply = function apply(mode) {
    return applyColorMode(target, toggle, mode);
  };
  var onClick = function onClick() {
    return apply(toggle.getAttribute('data-mode') === 'dark' ? 'light' : 'dark');
  };
  toggle.addEventListener('click', onClick);
  apply((_readStoredMode = readStoredMode(target)) !== null && _readStoredMode !== void 0 ? _readStoredMode : toggle.getAttribute('data-mode'));
  var controller = {
    apply: apply,
    destroy: function destroy() {
      toggle.removeEventListener('click', onClick);
      delete target[INSTALLATION];
    }
  };
  target[INSTALLATION] = controller;
  return controller;
}
function applyColorMode(target, toggle, requestedMode) {
  var mode = requestedMode === 'dark' ? 'dark' : 'light';
  var root = target.document.documentElement;
  var icon = target.document.getElementById('theme-icon');
  root.dataset.bsTheme = mode;
  root.dataset.colorScheme = mode;
  toggle.setAttribute('data-mode', mode);
  if (icon) {
    icon.className = mode === 'dark' ? 'fa-regular fa-lightbulb' : 'fa-solid fa-moon';
  }
  writeStoredMode(target, mode);
  return mode;
}
function readStoredMode(target) {
  try {
    var _target$localStorage;
    var value = (_target$localStorage = target.localStorage) === null || _target$localStorage === void 0 ? void 0 : _target$localStorage.getItem('theme-mode');
    return value === 'dark' || value === 'light' ? value : null;
  } catch (_unused) {
    return null;
  }
}
function writeStoredMode(target, mode) {
  var _target$location;
  try {
    var _target$localStorage2;
    (_target$localStorage2 = target.localStorage) === null || _target$localStorage2 === void 0 || _target$localStorage2.setItem('theme-mode', mode);
  } catch (_unused2) {
    // Storage can be unavailable in private or embedded browsing contexts.
  }
  var secure = ((_target$location = target.location) === null || _target$location === void 0 ? void 0 : _target$location.protocol) === 'https:' ? '; Secure' : '';
  target.document.cookie = "theme-mode=".concat(mode, "; Path=/; SameSite=Lax").concat(secure);
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
/*!*****************************************************!*\
  !*** ./resources/frontend/themes/tailwind/index.js ***!
  \*****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   THEME_ID: () => (/* binding */ THEME_ID),
/* harmony export */   installTailwindTheme: () => (/* reexport safe */ _runtime_js__WEBPACK_IMPORTED_MODULE_0__.installTailwindTheme)
/* harmony export */ });
/* harmony import */ var _runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runtime.js */ "./resources/frontend/themes/tailwind/runtime.js");

if (globalThis.document) (0,_runtime_js__WEBPACK_IMPORTED_MODULE_0__.installTailwindTheme)(globalThis);
var THEME_ID = 'tailwind';

})();

/******/ })()
;
//# sourceMappingURL=tailwind.js.map