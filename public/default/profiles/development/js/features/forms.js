/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "./resources/frontend/features/forms/actions/form-buttons.js":
/*!*******************************************************************!*\
  !*** ./resources/frontend/features/forms/actions/form-buttons.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bindFormButtons": () => (/* binding */ bindFormButtons)
/* harmony export */ });
/* harmony import */ var _core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/dom/listeners.js */ "./resources/frontend/core/dom/listeners.js");
/* harmony import */ var _core_dom_forms_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/dom/forms.js */ "./resources/frontend/core/dom/forms.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }


var BUTTON_SELECTOR = ['.form-buttons button.btn-delete', '.form-buttons button.btn-destroy', '.form-buttons button.btn-restore'].join(', ');
function bindFormButtons(_ref) {
  var document = _ref.document,
    events = _ref.events,
    messages = _ref.messages,
    questions = _ref.questions,
    root = _ref.root,
    token = _ref.token;
  assertDependencies({
    document: document,
    events: events,
    messages: messages,
    questions: questions,
    token: token
  });
  return (0,_core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__.delegate)(root, 'click', BUTTON_SELECTOR, function (event, button) {
    void handleFormButton(event, button, {
      document: document,
      events: events,
      messages: messages,
      questions: questions,
      token: token
    });
  });
}
function handleFormButton(_x, _x2, _x3) {
  return _handleFormButton.apply(this, arguments);
}
function _handleFormButton() {
  _handleFormButton = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(event, button, dependencies) {
    var action, result;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          event.preventDefault();
          action = buttonAction(button, dependencies.questions);
          if (action.question) {
            _context.n = 1;
            break;
          }
          submitButtonAction(button, action, dependencies);
          return _context.a(2);
        case 1:
          _context.n = 2;
          return dependencies.messages.confirm(action.question, null, button);
        case 2:
          result = _context.v;
          if (result !== null && result !== void 0 && result.value) {
            _context.n = 3;
            break;
          }
          dependencies.events.fire('datatables::confirm::cancel', button);
          return _context.a(2);
        case 3:
          dependencies.events.fire('datatables::confirm::submitting', button);
          submitButtonAction(button, action, dependencies);
          dependencies.events.fire('datatables::confirm::submitted', button);
        case 4:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _handleFormButton.apply(this, arguments);
}
function submitButtonAction(button, action, _ref2) {
  var document = _ref2.document,
    events = _ref2.events,
    token = _ref2.token;
  var parameters = {
    _token: token
  };
  if (action.method) {
    parameters._method = action.method;
  }
  if (button.dataset.redirect !== undefined) {
    parameters._redirectBack = button.dataset.redirect;
  }
  events.fire('datatables::confirm::submitting::data', parameters);
  var form = (0,_core_dom_forms_js__WEBPACK_IMPORTED_MODULE_1__.submitPostForm)(document, button.dataset.url, parameters);
  events.fire('datatables::confirm::submitted::data', parameters);
  return form;
}
function buttonAction(button, questions) {
  if (button.classList.contains('btn-delete')) {
    return {
      method: 'DELETE',
      question: questions["delete"]
    };
  }
  if (button.classList.contains('btn-destroy')) {
    return {
      method: 'DELETE',
      question: questions.destroy
    };
  }
  return {
    method: null,
    question: null
  };
}
function assertDependencies(_ref3) {
  var document = _ref3.document,
    events = _ref3.events,
    messages = _ref3.messages,
    questions = _ref3.questions,
    token = _ref3.token;
  if (!document || typeof (events === null || events === void 0 ? void 0 : events.fire) !== 'function') {
    throw new TypeError('Form buttons require document and event bus dependencies.');
  }
  if (typeof (messages === null || messages === void 0 ? void 0 : messages.confirm) !== 'function') {
    throw new TypeError('Form buttons require a confirmation service.');
  }
  if (!questions || typeof token !== 'string') {
    throw new TypeError('Form buttons require questions and a CSRF token.');
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
/*!****************************************************!*\
  !*** ./resources/frontend/features/forms/index.js ***!
  \****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FORM_FEATURE_ID": () => (/* binding */ FORM_FEATURE_ID),
/* harmony export */   "bindFormButtons": () => (/* reexport safe */ _actions_form_buttons_js__WEBPACK_IMPORTED_MODULE_0__.bindFormButtons)
/* harmony export */ });
/* harmony import */ var _actions_form_buttons_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions/form-buttons.js */ "./resources/frontend/features/forms/actions/form-buttons.js");
var FORM_FEATURE_ID = 'forms';

})();

/******/ })()
;
//# sourceMappingURL=forms.js.map