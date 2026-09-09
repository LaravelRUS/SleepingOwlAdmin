/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/themes/shadcn/runtime.js"
/*!***********************************************!*\
  !*** ./resources/js/themes/shadcn/runtime.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyColorMode: () => (/* binding */ applyColorMode),
/* harmony export */   installTailwindCardControls: () => (/* binding */ installTailwindCardControls),
/* harmony export */   installTailwindTheme: () => (/* binding */ installTailwindTheme)
/* harmony export */ });
var INSTALLATION = Symbol["for"]('sleepingowl.theme.tailwind');
function installTailwindTheme() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globalThis;
  if (target[INSTALLATION]) return target[INSTALLATION];
  var document = target.document;
  if (!document) return null;
  var toggle = document.getElementById('theme-mode');
  var cards = installTailwindCardControls(document);
  var apply = function apply(mode) {
    return toggle ? applyColorMode(target, toggle, mode) : null;
  };
  var onClick = toggle ? function () {
    return apply(toggle.getAttribute('data-mode') === 'dark' ? 'light' : 'dark');
  } : null;
  if (toggle) {
    var _readStoredMode;
    toggle.addEventListener('click', onClick);
    apply((_readStoredMode = readStoredMode(target)) !== null && _readStoredMode !== void 0 ? _readStoredMode : toggle.getAttribute('data-mode'));
  }
  var controller = {
    apply: apply,
    cards: cards,
    destroy: function destroy() {
      if (toggle) toggle.removeEventListener('click', onClick);
      cards === null || cards === void 0 || cards.destroy();
      delete target[INSTALLATION];
    }
  };
  target[INSTALLATION] = controller;
  return controller;
}
function installTailwindCardControls(document) {
  if (typeof (document === null || document === void 0 ? void 0 : document.addEventListener) !== 'function') return null;
  var onClick = function onClick(event) {
    var _event$target, _event$target$closest, _button$closest;
    var button = (_event$target = event.target) === null || _event$target === void 0 || (_event$target$closest = _event$target.closest) === null || _event$target$closest === void 0 ? void 0 : _event$target$closest.call(_event$target, '[data-card-widget]');
    var card = button === null || button === void 0 || (_button$closest = button.closest) === null || _button$closest === void 0 ? void 0 : _button$closest.call(button, '.soa-card, .card');
    if (!button || !card) return;
    var action = button.getAttribute('data-card-widget');
    if (action === 'collapse') {
      var collapsed = card.classList.toggle('collapsed-card');
      button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      updateCollapseIcon(button, collapsed);
      event.preventDefault();
    }
    if (action === 'maximize') {
      var maximized = card.classList.toggle('soa-card-maximized');
      button.setAttribute('aria-pressed', maximized ? 'true' : 'false');
      event.preventDefault();
    }
  };
  var onKeydown = function onKeydown(event) {
    var _document$querySelect, _card$querySelector;
    if (event.key !== 'Escape') return;
    var card = (_document$querySelect = document.querySelector) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.call(document, '.soa-card-maximized');
    if (!card) return;
    card.classList.remove('soa-card-maximized');
    (_card$querySelector = card.querySelector) === null || _card$querySelector === void 0 || (_card$querySelector = _card$querySelector.call(card, '[data-card-widget="maximize"]')) === null || _card$querySelector === void 0 || _card$querySelector.setAttribute('aria-pressed', 'false');
  };
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeydown);
  return {
    destroy: function destroy() {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeydown);
    }
  };
}
function updateCollapseIcon(button, collapsed) {
  var _button$querySelector;
  var icon = (_button$querySelector = button.querySelector) === null || _button$querySelector === void 0 ? void 0 : _button$querySelector.call(button, 'i');
  if (!(icon !== null && icon !== void 0 && icon.classList)) return;
  icon.classList.toggle('fa-plus', collapsed);
  icon.classList.toggle('fa-minus', !collapsed);
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
/*!*********************************************!*\
  !*** ./resources/js/themes/shadcn/theme.js ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   THEME_ID: () => (/* binding */ THEME_ID),
/* harmony export */   installTailwindTheme: () => (/* reexport safe */ _runtime_js__WEBPACK_IMPORTED_MODULE_0__.installTailwindTheme)
/* harmony export */ });
/* harmony import */ var _runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runtime.js */ "./resources/js/themes/shadcn/runtime.js");

if (globalThis.document) (0,_runtime_js__WEBPACK_IMPORTED_MODULE_0__.installTailwindTheme)(globalThis);
var THEME_ID = 'shadcn';

})();

/******/ })()
;
//# sourceMappingURL=shadcn.js.map