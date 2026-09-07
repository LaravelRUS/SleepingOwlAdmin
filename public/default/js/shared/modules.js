/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/*!******************************************************!*\
  !*** ./resources/frontend/shared/modules/browser.js ***!
  \******************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bootCompatibilityModules": () => (/* binding */ bootCompatibilityModules)
/* harmony export */ });
if (globalThis.document) bootCompatibilityModules(globalThis);
function bootCompatibilityModules(target) {
  var _admin$Modules;
  var admin = target.Admin;
  if (typeof (admin === null || admin === void 0 || (_admin$Modules = admin.Modules) === null || _admin$Modules === void 0 ? void 0 : _admin$Modules.boot) !== 'function' || !(admin !== null && admin !== void 0 && admin.Components)) {
    throw new TypeError('Compatibility modules require Admin.Modules and Admin.Components.');
  }
  admin.Modules.boot();
  return admin.Components.scan(target.document);
}
/******/ })()
;
//# sourceMappingURL=modules.js.map