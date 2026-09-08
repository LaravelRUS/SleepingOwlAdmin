/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/frontend/features/tabs/install-tabs.js":
/*!**********************************************************!*\
  !*** ./resources/frontend/features/tabs/install-tabs.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TABS_COMPONENT": () => (/* binding */ TABS_COMPONENT),
/* harmony export */   "TABS_ROOT_SELECTOR": () => (/* binding */ TABS_ROOT_SELECTOR),
/* harmony export */   "createTabsDefinition": () => (/* binding */ createTabsDefinition),
/* harmony export */   "installTabs": () => (/* binding */ installTabs)
/* harmony export */ });
/* harmony import */ var _tabs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tabs.js */ "./resources/frontend/features/tabs/tabs.js");

var TABS_COMPONENT = 'tabs';
var TABS_ROOT_SELECTOR = 'body';
function installTabs(admin) {
  var _admin$Modules, _admin$Modules$regist;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  assertAdmin(admin);
  var definition = createTabsDefinition(admin, options);
  admin.Components.register(definition);
  var scan = function scan() {
    var _options$root;
    var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_options$root = options.root) !== null && _options$root !== void 0 ? _options$root : globalThis.document;
    return admin.Components.scan(root, TABS_COMPONENT);
  };
  (_admin$Modules = admin.Modules) === null || _admin$Modules === void 0 || (_admin$Modules$regist = _admin$Modules.register) === null || _admin$Modules$regist === void 0 || _admin$Modules$regist.call(_admin$Modules, 'storage.tabbed', function () {
    return scan();
  });
  return {
    definition: definition,
    scan: scan
  };
}
function createTabsDefinition(admin) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    mount: function mount(body) {
      return mountConfiguredTabs(admin, body, options);
    },
    name: TABS_COMPONENT,
    selector: TABS_ROOT_SELECTOR
  };
}
function mountConfiguredTabs(admin, body, options) {
  var _view$location;
  var view = body.ownerDocument.defaultView;
  return (0,_tabs_js__WEBPACK_IMPORTED_MODULE_0__.mountTabs)(body, {
    events: admin.Events,
    path: preferred(options.path, view === null || view === void 0 || (_view$location = view.location) === null || _view$location === void 0 ? void 0 : _view$location.pathname),
    stateEnabled: preferred(options.stateEnabled, configuredTabState(admin)),
    storage: preferred(options.storage, view === null || view === void 0 ? void 0 : view.localStorage)
  });
}
function configuredTabState(admin) {
  var _admin$Config;
  return typeof ((_admin$Config = admin.Config) === null || _admin$Config === void 0 ? void 0 : _admin$Config.get) === 'function' ? admin.Config.get('state_tabs', false) : false;
}
function preferred(value, fallback) {
  return value === undefined ? fallback : value;
}
function assertAdmin(admin) {
  assertFunction(admin === null || admin === void 0 ? void 0 : admin.Components, 'register', 'Tabs require Admin.Components.');
  assertFunction(admin === null || admin === void 0 ? void 0 : admin.Components, 'scan', 'Tabs require Admin.Components.');
}
function assertFunction(object, method, message) {
  if (typeof (object === null || object === void 0 ? void 0 : object[method]) !== 'function') throw new TypeError(message);
}

/***/ }),

/***/ "./resources/frontend/features/tabs/tab-elements.js":
/*!**********************************************************!*\
  !*** ./resources/frontend/features/tabs/tab-elements.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TAB_LIST_SELECTOR": () => (/* binding */ TAB_LIST_SELECTOR),
/* harmony export */   "TAB_SELECTOR": () => (/* binding */ TAB_SELECTOR),
/* harmony export */   "collectTabLists": () => (/* binding */ collectTabLists),
/* harmony export */   "findTab": () => (/* binding */ findTab),
/* harmony export */   "findTabList": () => (/* binding */ findTabList),
/* harmony export */   "findTabPanel": () => (/* binding */ findTabPanel),
/* harmony export */   "tabTargetId": () => (/* binding */ tabTargetId),
/* harmony export */   "tabsInList": () => (/* binding */ tabsInList)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var TAB_SELECTOR = '[data-tab], [data-bs-toggle="tab"], [data-toggle="tab"]';
var TAB_LIST_SELECTOR = '[data-tablist], [role="tablist"]';
function findTab(root, target) {
  var _target$closest;
  var tab = target === null || target === void 0 || (_target$closest = target.closest) === null || _target$closest === void 0 ? void 0 : _target$closest.call(target, TAB_SELECTOR);
  return tab && root.contains(tab) ? tab : null;
}
function findTabList(tab) {
  var _tab$closest, _tab$closest2;
  return (_tab$closest = tab === null || tab === void 0 || (_tab$closest2 = tab.closest) === null || _tab$closest2 === void 0 ? void 0 : _tab$closest2.call(tab, TAB_LIST_SELECTOR)) !== null && _tab$closest !== void 0 ? _tab$closest : null;
}
function tabsInList(tabList) {
  return _toConsumableArray(tabList.querySelectorAll(TAB_SELECTOR)).filter(function (tab) {
    return findTabList(tab) === tabList;
  });
}
function findTabPanel(tab) {
  var id = tabTargetId(tab);
  return id ? tab.ownerDocument.getElementById(id) : null;
}
function collectTabLists(root) {
  var lists = _toConsumableArray(root.querySelectorAll(TAB_LIST_SELECTOR));
  if (typeof root.matches === 'function' && root.matches(TAB_LIST_SELECTOR)) lists.unshift(root);
  return lists.filter(function (list) {
    return tabsInList(list).length > 0;
  });
}
function tabTargetId(tab) {
  var _tab$getAttribute, _tab$getAttribute2;
  var controlled = (_tab$getAttribute = tab.getAttribute('aria-controls')) === null || _tab$getAttribute === void 0 ? void 0 : _tab$getAttribute.trim();
  if (controlled) return controlled;
  var href = (_tab$getAttribute2 = tab.getAttribute('href')) !== null && _tab$getAttribute2 !== void 0 ? _tab$getAttribute2 : '';
  if (href.startsWith('#')) return href.slice(1);
  return sameDocumentHash(tab.ownerDocument, href);
}
function sameDocumentHash(document, href) {
  if (!href || !(document !== null && document !== void 0 && document.defaultView)) return '';
  try {
    var target = new document.defaultView.URL(href, document.baseURI);
    var current = document.defaultView.location;
    if (target.origin !== current.origin || target.pathname !== current.pathname) return '';
    if (target.search !== current.search) return '';
    return target.hash.slice(1);
  } catch (_unused) {
    return '';
  }
}

/***/ }),

/***/ "./resources/frontend/features/tabs/tab-state.js":
/*!*******************************************************!*\
  !*** ./resources/frontend/features/tabs/tab-state.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "readTabState": () => (/* binding */ readTabState),
/* harmony export */   "tabStateKey": () => (/* binding */ tabStateKey),
/* harmony export */   "writeTabState": () => (/* binding */ writeTabState)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function tabStateKey() {
  var pathname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
  var normalized = normalizeEditPath(pathname);
  return "Tabbed_".concat(normalized);
}
function readTabState(storage, key) {
  if (!storage || !key) return {};
  try {
    var _storage$getItem;
    var value = JSON.parse((_storage$getItem = storage.getItem(key)) !== null && _storage$getItem !== void 0 ? _storage$getItem : '{}');
    return isRecord(value) ? value : {};
  } catch (_unused) {
    return {};
  }
}
function writeTabState(storage, key, state) {
  if (!storage || !key) return false;
  try {
    storage.setItem(key, JSON.stringify(state));
    return true;
  } catch (_unused2) {
    return false;
  }
}
function normalizeEditPath(pathname) {
  var path = typeof pathname === 'string' && pathname ? pathname : '/';
  return path.search('edit') > 0 ? path.replace(/\d+\/edit$/, '') + 'edit' : path;
}
function isRecord(value) {
  return value !== null && _typeof(value) === 'object' && !Array.isArray(value);
}

/***/ }),

/***/ "./resources/frontend/features/tabs/tabs.js":
/*!**************************************************!*\
  !*** ./resources/frontend/features/tabs/tabs.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "activateTab": () => (/* binding */ activateTab),
/* harmony export */   "mountTabs": () => (/* binding */ mountTabs)
/* harmony export */ });
/* harmony import */ var _tab_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tab-elements.js */ "./resources/frontend/features/tabs/tab-elements.js");
/* harmony import */ var _tab_state_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tab-state.js */ "./resources/frontend/features/tabs/tab-state.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }


function mountTabs(root) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  assertRoot(root);
  var state = createTabsState(root, options);
  var click = function click(event) {
    return handleClick(state, event);
  };
  var keydown = function keydown(event) {
    return handleKeydown(state, event);
  };
  root.addEventListener('click', click);
  root.addEventListener('keydown', keydown);
  initializeTabs(state);
  return {
    destroy: function destroy() {
      return destroyTabs(state, click, keydown);
    }
  };
}
function activateTab(tab) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var tabList = (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTabList)(tab);
  var panel = (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTabPanel)(tab);
  if (!tabList || !panel || isDisabled(tab)) return false;
  var previousTab = activeTab(tabList);
  var previousPanel = previousTab ? (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTabPanel)(previousTab) : null;
  if (previousTab === tab) return false;
  tabList.setAttribute('role', 'tablist');
  (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.tabsInList)(tabList).forEach(function (item) {
    return setTabActive(item, (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTabPanel)(item), item === tab);
  });
  publishChange(options.events, previousTab, previousPanel, tab, panel);
  return true;
}
function createTabsState(root, options) {
  var stateEnabled = options.stateEnabled === true;
  return {
    events: options.events,
    root: root,
    stateKey: stateEnabled ? (0,_tab_state_js__WEBPACK_IMPORTED_MODULE_1__.tabStateKey)(options.path) : null,
    storage: options.storage
  };
}
function initializeTabs(state) {
  var lists = (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.collectTabLists)(state.root);
  lists.forEach(normalizeTabList);
  restoreTabState(state, lists);
}
function normalizeTabList(tabList) {
  var _activeTab;
  var tabs = (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.tabsInList)(tabList);
  var selected = (_activeTab = activeTab(tabList)) !== null && _activeTab !== void 0 ? _activeTab : tabs[0];
  tabList.setAttribute('role', 'tablist');
  tabs.forEach(function (tab) {
    return setTabActive(tab, (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTabPanel)(tab), tab === selected);
  });
}
function restoreTabState(state, lists) {
  var stored = (0,_tab_state_js__WEBPACK_IMPORTED_MODULE_1__.readTabState)(state.storage, state.stateKey);
  Object.entries(stored).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      index = _ref2[0],
      target = _ref2[1];
    var list = lists[Number(index)];
    if (!list) return;
    var tab = (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.tabsInList)(list).find(function (candidate) {
      return (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.tabTargetId)(candidate) === target;
    });
    if (tab) activateAndStore(state, tab);
  });
}
function handleClick(state, event) {
  if (!isPlainPrimaryClick(event)) return;
  var tab = (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTab)(state.root, event.target);
  if (!tab || isDisabled(tab)) return;
  event.preventDefault();
  event.stopPropagation();
  activateAndStore(state, tab);
}
function handleKeydown(state, event) {
  var tab = (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTab)(state.root, event.target);
  var tabList = tab && (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTabList)(tab);
  if (!tabList) return;
  var target = keyboardTarget((0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.tabsInList)(tabList), tab, event.key);
  if (!target) return;
  event.preventDefault();
  event.stopPropagation();
  target.focus();
  activateAndStore(state, target);
}
function activateAndStore(state, tab) {
  if (!activateTab(tab, {
    events: state.events
  })) return false;
  persistTabState(state);
  return true;
}
function persistTabState(state) {
  if (!state.stateKey) return;
  var selected = Object.fromEntries((0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.collectTabLists)(state.root).map(function (list, index) {
    var _activeTab2;
    return [index, (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.tabTargetId)((_activeTab2 = activeTab(list)) !== null && _activeTab2 !== void 0 ? _activeTab2 : (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.tabsInList)(list)[0])];
  }));
  (0,_tab_state_js__WEBPACK_IMPORTED_MODULE_1__.writeTabState)(state.storage, state.stateKey, selected);
}
function activeTab(tabList) {
  return (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.tabsInList)(tabList).find(function (tab) {
    var _tab$parentElement;
    return tab.getAttribute('aria-selected') === 'true' || tab.classList.contains('active') || ((_tab$parentElement = tab.parentElement) === null || _tab$parentElement === void 0 ? void 0 : _tab$parentElement.classList.contains('active'));
  });
}
function setTabActive(tab, panel, active) {
  var _tab$parentElement2;
  tab.classList.toggle('active', active);
  if ((_tab$parentElement2 = tab.parentElement) !== null && _tab$parentElement2 !== void 0 && _tab$parentElement2.matches('li')) tab.parentElement.classList.toggle('active', active);
  tab.setAttribute('aria-selected', String(active));
  tab.setAttribute('role', 'tab');
  tab.tabIndex = active ? 0 : -1;
  if (!panel) return;
  panel.setAttribute('role', 'tabpanel');
  if (tab.id) panel.setAttribute('aria-labelledby', tab.id);
  panel.classList.toggle('active', active);
  panel.classList.toggle('show', active);
  panel.classList.toggle('in', active);
  panel.hidden = !active;
}
function publishChange(events, previousTab, previousPanel, tab, panel) {
  var _events$fire2;
  if (previousTab) {
    var _events$fire;
    dispatchTabEvent(previousTab, 'tab:hidden', previousPanel, tab);
    events === null || events === void 0 || (_events$fire = events.fire) === null || _events$fire === void 0 || _events$fire.call(events, 'bootstrap::tab::hidden', (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.tabTargetId)(previousTab));
  }
  dispatchTabEvent(tab, 'tab:shown', panel, previousTab);
  events === null || events === void 0 || (_events$fire2 = events.fire) === null || _events$fire2 === void 0 || _events$fire2.call(events, 'bootstrap::tab::shown', (0,_tab_elements_js__WEBPACK_IMPORTED_MODULE_0__.tabTargetId)(tab));
}
function dispatchTabEvent(tab, name, panel, relatedTab) {
  tab.dispatchEvent(new tab.ownerDocument.defaultView.CustomEvent(name, {
    bubbles: true,
    detail: {
      panel: panel,
      relatedTab: relatedTab,
      tab: tab
    }
  }));
}
function keyboardTarget(tabs, current, key) {
  var enabled = tabs.filter(function (tab) {
    return !isDisabled(tab);
  });
  var index = enabled.indexOf(current);
  if (index < 0) return null;
  if (key === 'Home') return enabled[0];
  if (key === 'End') return enabled.at(-1);
  if (key === 'ArrowRight' || key === 'ArrowDown') return enabled[(index + 1) % enabled.length];
  if (key === 'ArrowLeft' || key === 'ArrowUp') return enabled[(index - 1 + enabled.length) % enabled.length];
  return null;
}
function isDisabled(tab) {
  return tab.hasAttribute('disabled') || tab.getAttribute('aria-disabled') === 'true';
}
function isPlainPrimaryClick(event) {
  return !event.defaultPrevented && event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
}
function destroyTabs(state, click, keydown) {
  state.root.removeEventListener('click', click);
  state.root.removeEventListener('keydown', keydown);
}
function assertRoot(root) {
  if (typeof (root === null || root === void 0 ? void 0 : root.addEventListener) !== 'function' || typeof (root === null || root === void 0 ? void 0 : root.contains) !== 'function') {
    throw new TypeError('Tabs require a DOM query root.');
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
/*!*****************************************************!*\
  !*** ./resources/frontend/features/tabs/browser.js ***!
  \*****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bootTabs": () => (/* binding */ bootTabs)
/* harmony export */ });
/* harmony import */ var _install_tabs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./install-tabs.js */ "./resources/frontend/features/tabs/install-tabs.js");

if (globalThis.document) bootTabs(globalThis);
function bootTabs(target) {
  var _target$location, _target$GlobalConfig;
  var _installTabs = (0,_install_tabs_js__WEBPACK_IMPORTED_MODULE_0__.installTabs)(target.Admin, {
      path: (_target$location = target.location) === null || _target$location === void 0 ? void 0 : _target$location.pathname,
      root: target.document,
      stateEnabled: ((_target$GlobalConfig = target.GlobalConfig) === null || _target$GlobalConfig === void 0 ? void 0 : _target$GlobalConfig.state_tabs) === true,
      storage: target.localStorage
    }),
    scan = _installTabs.scan;
  scan();
}
})();

/******/ })()
;
//# sourceMappingURL=tabs.js.map