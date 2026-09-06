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
/* harmony export */   "parseBoolean": () => (/* reexport safe */ _data_island_props_js__WEBPACK_IMPORTED_MODULE_0__.parseBoolean),
/* harmony export */   "parseJsonProps": () => (/* reexport safe */ _data_island_props_js__WEBPACK_IMPORTED_MODULE_0__.parseJsonProps),
/* harmony export */   "parseNumber": () => (/* reexport safe */ _data_island_props_js__WEBPACK_IMPORTED_MODULE_0__.parseNumber),
/* harmony export */   "readDataset": () => (/* reexport safe */ _data_island_props_js__WEBPACK_IMPORTED_MODULE_0__.readDataset)
/* harmony export */ });
/* harmony import */ var _data_island_props_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data/island-props.js */ "./resources/frontend/core/data/island-props.js");

})();

/******/ })()
;
//# sourceMappingURL=admin-core.js.map