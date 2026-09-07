/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/frontend/features/dropdown/dropdown-elements.js":
/*!*******************************************************************!*\
  !*** ./resources/frontend/features/dropdown/dropdown-elements.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DROPDOWN_CONTAINER_SELECTOR": () => (/* binding */ DROPDOWN_CONTAINER_SELECTOR),
/* harmony export */   "DROPDOWN_ITEM_SELECTOR": () => (/* binding */ DROPDOWN_ITEM_SELECTOR),
/* harmony export */   "DROPDOWN_MENU_SELECTOR": () => (/* binding */ DROPDOWN_MENU_SELECTOR),
/* harmony export */   "DROPDOWN_TOGGLE_SELECTOR": () => (/* binding */ DROPDOWN_TOGGLE_SELECTOR),
/* harmony export */   "collectDropdownToggles": () => (/* binding */ collectDropdownToggles),
/* harmony export */   "dropdownContext": () => (/* binding */ dropdownContext),
/* harmony export */   "dropdownItems": () => (/* binding */ dropdownItems),
/* harmony export */   "findDropdownItem": () => (/* binding */ findDropdownItem),
/* harmony export */   "findDropdownToggle": () => (/* binding */ findDropdownToggle),
/* harmony export */   "isDropdownDisabled": () => (/* binding */ isDropdownDisabled),
/* harmony export */   "isDropdownFormControl": () => (/* binding */ isDropdownFormControl)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var DROPDOWN_TOGGLE_SELECTOR = '[data-toggle="dropdown"]';
var DROPDOWN_CONTAINER_SELECTOR = '.dropdown, .btn-group, .nav-item';
var DROPDOWN_MENU_SELECTOR = '.dropdown-menu';
var DROPDOWN_ITEM_SELECTOR = '.dropdown-item, [role="menuitem"], a[href], button';
function findDropdownToggle(root, target) {
  var _target$closest;
  var toggle = target === null || target === void 0 || (_target$closest = target.closest) === null || _target$closest === void 0 ? void 0 : _target$closest.call(target, DROPDOWN_TOGGLE_SELECTOR);
  return toggle && root.contains(toggle) ? toggle : null;
}
function dropdownContext(toggle) {
  var menu = dropdownMenu(toggle);
  if (!menu) return null;
  return {
    menu: menu,
    root: dropdownRoot(toggle),
    toggle: toggle
  };
}
function dropdownItems(menu) {
  return _toConsumableArray(menu.querySelectorAll(DROPDOWN_ITEM_SELECTOR)).filter(function (item) {
    return item.closest(DROPDOWN_MENU_SELECTOR) === menu;
  }).filter(function (item) {
    return !isDropdownDisabled(item);
  });
}
function findDropdownItem(menu, target) {
  var _target$closest2;
  var item = target === null || target === void 0 || (_target$closest2 = target.closest) === null || _target$closest2 === void 0 ? void 0 : _target$closest2.call(target, DROPDOWN_ITEM_SELECTOR);
  return item && menu.contains(item) && item.closest(DROPDOWN_MENU_SELECTOR) === menu ? item : null;
}
function collectDropdownToggles(container) {
  var _container$querySelec, _container$querySelec2, _container$matches;
  var toggles = _toConsumableArray((_container$querySelec = (_container$querySelec2 = container.querySelectorAll) === null || _container$querySelec2 === void 0 ? void 0 : _container$querySelec2.call(container, DROPDOWN_TOGGLE_SELECTOR)) !== null && _container$querySelec !== void 0 ? _container$querySelec : []);
  if ((_container$matches = container.matches) !== null && _container$matches !== void 0 && _container$matches.call(container, DROPDOWN_TOGGLE_SELECTOR)) toggles.unshift(container);
  return toggles;
}
function isDropdownDisabled(element) {
  var _element$hasAttribute, _element$getAttribute, _element$classList;
  return ((_element$hasAttribute = element.hasAttribute) === null || _element$hasAttribute === void 0 ? void 0 : _element$hasAttribute.call(element, 'disabled')) || ((_element$getAttribute = element.getAttribute) === null || _element$getAttribute === void 0 ? void 0 : _element$getAttribute.call(element, 'aria-disabled')) === 'true' || ((_element$classList = element.classList) === null || _element$classList === void 0 ? void 0 : _element$classList.contains('disabled'));
}
function isDropdownFormControl(menu, target) {
  var _target$closest3;
  var control = target === null || target === void 0 || (_target$closest3 = target.closest) === null || _target$closest3 === void 0 ? void 0 : _target$closest3.call(target, 'form, input, label, option, select, textarea, [contenteditable]');
  return Boolean(control && menu.contains(control));
}
function dropdownMenu(toggle) {
  var _toggle$nextElementSi;
  var target = targetMenu(toggle);
  if (target) return target;
  if ((_toggle$nextElementSi = toggle.nextElementSibling) !== null && _toggle$nextElementSi !== void 0 && _toggle$nextElementSi.matches(DROPDOWN_MENU_SELECTOR)) {
    return toggle.nextElementSibling;
  }
  var root = dropdownRoot(toggle);
  return _toConsumableArray(root.querySelectorAll(DROPDOWN_MENU_SELECTOR)).find(function (menu) {
    return menu.closest(DROPDOWN_CONTAINER_SELECTOR) === root;
  });
}
function dropdownRoot(toggle) {
  var _toggle$closest;
  return (_toggle$closest = toggle.closest(DROPDOWN_CONTAINER_SELECTOR)) !== null && _toggle$closest !== void 0 ? _toggle$closest : toggle.parentElement;
}
function targetMenu(toggle) {
  var id = dropdownTargetId(toggle);
  return id ? toggle.ownerDocument.getElementById(id) : null;
}
function dropdownTargetId(toggle) {
  var _toggle$getAttribute, _ref, _toggle$getAttribute2;
  var controlled = (_toggle$getAttribute = toggle.getAttribute('aria-controls')) === null || _toggle$getAttribute === void 0 ? void 0 : _toggle$getAttribute.trim();
  if (controlled) return controlled;
  var target = (_ref = (_toggle$getAttribute2 = toggle.getAttribute('data-target')) !== null && _toggle$getAttribute2 !== void 0 ? _toggle$getAttribute2 : toggle.getAttribute('href')) !== null && _ref !== void 0 ? _ref : '';
  return target.startsWith('#') ? target.slice(1) : '';
}

/***/ }),

/***/ "./resources/frontend/features/dropdown/dropdown-navigation.js":
/*!*********************************************************************!*\
  !*** ./resources/frontend/features/dropdown/dropdown-navigation.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DROPDOWN_NAVIGATION_KEYS": () => (/* binding */ DROPDOWN_NAVIGATION_KEYS),
/* harmony export */   "dropdownNavigationTarget": () => (/* binding */ dropdownNavigationTarget)
/* harmony export */ });
var DROPDOWN_NAVIGATION_KEYS = new Set(['ArrowDown', 'ArrowUp', 'End', 'Home']);
function dropdownNavigationTarget(items, current, key) {
  if (items.length === 0 || !DROPDOWN_NAVIGATION_KEYS.has(key)) return null;
  if (key === 'Home') return items[0];
  if (key === 'End') return items.at(-1);
  var index = items.indexOf(current);
  if (key === 'ArrowDown') return items[index < 0 ? 0 : (index + 1) % items.length];
  return items[index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length];
}

/***/ }),

/***/ "./resources/frontend/features/dropdown/dropdown-state.js":
/*!****************************************************************!*\
  !*** ./resources/frontend/features/dropdown/dropdown-state.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeDropdown": () => (/* binding */ closeDropdown),
/* harmony export */   "normalizeDropdown": () => (/* binding */ normalizeDropdown),
/* harmony export */   "openDropdown": () => (/* binding */ openDropdown),
/* harmony export */   "resetDropdown": () => (/* binding */ resetDropdown)
/* harmony export */ });
function openDropdown(state, context) {
  var _state$current;
  if (((_state$current = state.current) === null || _state$current === void 0 ? void 0 : _state$current.toggle) === context.toggle) return false;
  if (state.current && !closeDropdown(state)) return false;
  if (!dispatchDropdownEvent(context, 'dropdown:show', true)) return false;
  state.current = context;
  applyDropdownState(context, true);
  dispatchDropdownEvent(context, 'dropdown:shown');
  return true;
}
function closeDropdown(state) {
  var _context$toggle$focus, _context$toggle;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var context = state.current;
  if (!context) return false;
  if (!dispatchDropdownEvent(context, 'dropdown:hide', true)) return false;
  state.current = null;
  applyDropdownState(context, false);
  dispatchDropdownEvent(context, 'dropdown:hidden');
  if (options.restoreFocus) (_context$toggle$focus = (_context$toggle = context.toggle).focus) === null || _context$toggle$focus === void 0 || _context$toggle$focus.call(_context$toggle);
  return true;
}
function normalizeDropdown(context) {
  var _context$menu$getAttr;
  var open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  context.toggle.setAttribute('aria-haspopup', 'menu');
  context.menu.setAttribute('role', (_context$menu$getAttr = context.menu.getAttribute('role')) !== null && _context$menu$getAttr !== void 0 ? _context$menu$getAttr : 'menu');
  applyDropdownState(context, open);
}
function resetDropdown(context) {
  applyDropdownState(context, false);
}
function applyDropdownState(context, open) {
  context.root.classList.toggle('show', open);
  context.root.classList.toggle('open', open);
  context.menu.classList.toggle('show', open);
  context.menu.hidden = !open;
  context.toggle.setAttribute('aria-expanded', String(open));
}
function dispatchDropdownEvent(context, name) {
  var cancelable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return context.toggle.dispatchEvent(new context.toggle.ownerDocument.defaultView.CustomEvent(name, {
    bubbles: true,
    cancelable: cancelable,
    detail: {
      menu: context.menu,
      root: context.root,
      toggle: context.toggle
    }
  }));
}

/***/ }),

/***/ "./resources/frontend/features/dropdown/dropdowns.js":
/*!***********************************************************!*\
  !*** ./resources/frontend/features/dropdown/dropdowns.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mountDropdowns": () => (/* binding */ mountDropdowns)
/* harmony export */ });
/* harmony import */ var _dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dropdown-elements.js */ "./resources/frontend/features/dropdown/dropdown-elements.js");
/* harmony import */ var _dropdown_navigation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dropdown-navigation.js */ "./resources/frontend/features/dropdown/dropdown-navigation.js");
/* harmony import */ var _dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dropdown-state.js */ "./resources/frontend/features/dropdown/dropdown-state.js");



var ROOT_EVENT_NAMES = ['click', 'focusin', 'keydown'];
function mountDropdowns(root) {
  assertRoot(root);
  var state = {
    current: null,
    root: root
  };
  var listeners = bindDropdownListeners(state);
  scanDropdowns(state, root);
  return {
    close: function close(options) {
      return (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.closeDropdown)(state, options);
    },
    destroy: function destroy() {
      return destroyDropdowns(state, listeners);
    },
    open: function open(toggle) {
      return openToggle(state, toggle);
    },
    scan: function scan() {
      var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : root;
      return scanDropdowns(state, container);
    },
    toggle: function toggle(_toggle) {
      return toggleDropdown(state, _toggle);
    }
  };
}
function bindDropdownListeners(state) {
  var listeners = {
    click: function click(event) {
      return handleDropdownClick(state, event);
    },
    documentClick: function documentClick(event) {
      return handleDocumentClick(state, event);
    },
    focusin: function focusin(event) {
      return handleDropdownFocus(state, event);
    },
    keydown: function keydown(event) {
      return handleDropdownKeydown(state, event);
    }
  };
  ROOT_EVENT_NAMES.forEach(function (name) {
    return state.root.addEventListener(name, listeners[name]);
  });
  state.root.ownerDocument.addEventListener('click', listeners.documentClick);
  return listeners;
}
function handleDocumentClick(state, event) {
  if (state.current && !state.root.contains(event.target)) (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.closeDropdown)(state);
}
function handleDropdownClick(state, event) {
  var toggle = (0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.findDropdownToggle)(state.root, event.target);
  if (toggle) return handleToggleClick(state, event, toggle);
  var current = state.current;
  if (!current) return;
  if (!current.root.contains(event.target)) return (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.closeDropdown)(state);
  if (!current.menu.contains(event.target)) return (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.closeDropdown)(state);
  if ((0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.isDropdownFormControl)(current.menu, event.target)) return;
  if ((0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.findDropdownItem)(current.menu, event.target)) (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.closeDropdown)(state);
}
function handleToggleClick(state, event, toggle) {
  if (!isPlainPrimaryClick(event) || (0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.isDropdownDisabled)(toggle)) return false;
  event.preventDefault();
  event.stopPropagation();
  return toggleDropdown(state, toggle);
}
function handleDropdownFocus(state, event) {
  var current = state.current;
  if (current && !current.root.contains(event.target)) (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.closeDropdown)(state);
}
function handleDropdownKeydown(state, event) {
  if (event.key === 'Escape') return handleEscape(state, event);
  if (!_dropdown_navigation_js__WEBPACK_IMPORTED_MODULE_1__.DROPDOWN_NAVIGATION_KEYS.has(event.key)) return false;
  var context = keyboardContext(state, event.target);
  if (!context) return false;
  var items = (0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.dropdownItems)(context.menu);
  var current = (0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.findDropdownItem)(context.menu, event.target);
  var target = (0,_dropdown_navigation_js__WEBPACK_IMPORTED_MODULE_1__.dropdownNavigationTarget)(items, current, event.key);
  event.preventDefault();
  event.stopPropagation();
  (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.openDropdown)(state, context);
  target === null || target === void 0 || target.focus();
  return true;
}
function handleEscape(state, event) {
  var current = state.current;
  if (!current || !current.root.contains(event.target)) return false;
  event.preventDefault();
  event.stopPropagation();
  return (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.closeDropdown)(state, {
    restoreFocus: true
  });
}
function keyboardContext(state, target) {
  var _state$current;
  var toggle = (0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.findDropdownToggle)(state.root, target);
  if (toggle && !(0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.isDropdownDisabled)(toggle)) return (0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.dropdownContext)(toggle);
  if ((_state$current = state.current) !== null && _state$current !== void 0 && _state$current.menu.contains(target)) return state.current;
  return null;
}
function toggleDropdown(state, toggle) {
  var _state$current2;
  var context = (0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.dropdownContext)(toggle);
  if (!context || (0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.isDropdownDisabled)(toggle)) return false;
  if (((_state$current2 = state.current) === null || _state$current2 === void 0 ? void 0 : _state$current2.toggle) === toggle) return (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.closeDropdown)(state);
  return (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.openDropdown)(state, context);
}
function openToggle(state, toggle) {
  var context = (0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.dropdownContext)(toggle);
  return context && !(0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.isDropdownDisabled)(toggle) ? (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.openDropdown)(state, context) : false;
}
function scanDropdowns(state, container) {
  var toggles = (0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.collectDropdownToggles)(container);
  toggles.forEach(function (toggle) {
    var _state$current3;
    var context = (0,_dropdown_elements_js__WEBPACK_IMPORTED_MODULE_0__.dropdownContext)(toggle);
    if (context && context.toggle !== ((_state$current3 = state.current) === null || _state$current3 === void 0 ? void 0 : _state$current3.toggle)) (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.normalizeDropdown)(context);
  });
  return toggles.length;
}
function destroyDropdowns(state, listeners) {
  if (state.current) (0,_dropdown_state_js__WEBPACK_IMPORTED_MODULE_2__.resetDropdown)(state.current);
  state.current = null;
  ROOT_EVENT_NAMES.forEach(function (name) {
    return state.root.removeEventListener(name, listeners[name]);
  });
  state.root.ownerDocument.removeEventListener('click', listeners.documentClick);
}
function isPlainPrimaryClick(event) {
  return !event.defaultPrevented && event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
}
function assertRoot(root) {
  if (typeof (root === null || root === void 0 ? void 0 : root.addEventListener) !== 'function' || typeof (root === null || root === void 0 ? void 0 : root.contains) !== 'function') {
    throw new TypeError('Dropdowns require a DOM query root.');
  }
}

/***/ }),

/***/ "./resources/frontend/features/dropdown/install-dropdowns.js":
/*!*******************************************************************!*\
  !*** ./resources/frontend/features/dropdown/install-dropdowns.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DROPDOWN_COMPONENT": () => (/* binding */ DROPDOWN_COMPONENT),
/* harmony export */   "DROPDOWN_ROOT_SELECTOR": () => (/* binding */ DROPDOWN_ROOT_SELECTOR),
/* harmony export */   "installDropdowns": () => (/* binding */ installDropdowns)
/* harmony export */ });
/* harmony import */ var _dropdowns_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dropdowns.js */ "./resources/frontend/features/dropdown/dropdowns.js");

var DROPDOWN_COMPONENT = 'dropdowns';
var DROPDOWN_ROOT_SELECTOR = 'body';
function installDropdowns(admin) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  assertAdmin(admin);
  var controller = null;
  admin.Components.register({
    mount: function mount(body) {
      controller = (0,_dropdowns_js__WEBPACK_IMPORTED_MODULE_0__.mountDropdowns)(body);
      return {
        destroy: function destroy() {
          return destroyController(controller);
        }
      };
    },
    name: DROPDOWN_COMPONENT,
    selector: DROPDOWN_ROOT_SELECTOR
  });
  return {
    close: function close(closeOptions) {
      var _controller$close, _controller;
      return (_controller$close = (_controller = controller) === null || _controller === void 0 ? void 0 : _controller.close(closeOptions)) !== null && _controller$close !== void 0 ? _controller$close : false;
    },
    open: function open(toggle) {
      var _controller$open, _controller2;
      return (_controller$open = (_controller2 = controller) === null || _controller2 === void 0 ? void 0 : _controller2.open(toggle)) !== null && _controller$open !== void 0 ? _controller$open : false;
    },
    scan: function scan() {
      var _options$root;
      var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_options$root = options.root) !== null && _options$root !== void 0 ? _options$root : globalThis.document;
      return _scan(admin, controller, root);
    },
    toggle: function toggle(_toggle) {
      var _controller$toggle, _controller3;
      return (_controller$toggle = (_controller3 = controller) === null || _controller3 === void 0 ? void 0 : _controller3.toggle(_toggle)) !== null && _controller$toggle !== void 0 ? _controller$toggle : false;
    }
  };
}
function _scan(admin, controller, root) {
  var _controller$scan;
  admin.Components.scan(root, DROPDOWN_COMPONENT);
  return (_controller$scan = controller === null || controller === void 0 ? void 0 : controller.scan(root)) !== null && _controller$scan !== void 0 ? _controller$scan : 0;
}
function destroyController(controller) {
  controller === null || controller === void 0 || controller.destroy();
}
function assertAdmin(admin) {
  var _admin$Components;
  if (typeof (admin === null || admin === void 0 || (_admin$Components = admin.Components) === null || _admin$Components === void 0 ? void 0 : _admin$Components.register) !== 'function') {
    throw new TypeError('Dropdowns require Admin.Components.');
  }
  if (typeof admin.Components.scan !== 'function') {
    throw new TypeError('Dropdowns require Admin.Components.scan().');
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
/*!*********************************************************!*\
  !*** ./resources/frontend/features/dropdown/browser.js ***!
  \*********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bootDropdowns": () => (/* binding */ bootDropdowns)
/* harmony export */ });
/* harmony import */ var _install_dropdowns_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./install-dropdowns.js */ "./resources/frontend/features/dropdown/install-dropdowns.js");

if (globalThis.document) bootDropdowns(globalThis);
function bootDropdowns(target) {
  var dropdowns = (0,_install_dropdowns_js__WEBPACK_IMPORTED_MODULE_0__.installDropdowns)(target.Admin, {
    root: target.document
  });
  target.Admin.Dropdowns = dropdowns;
  dropdowns.scan();
  return dropdowns;
}
})();

/******/ })()
;
//# sourceMappingURL=dropdown.js.map