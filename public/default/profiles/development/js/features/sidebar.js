/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/frontend/features/sidebar/install-sidebar.js":
/*!****************************************************************!*\
  !*** ./resources/frontend/features/sidebar/install-sidebar.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SIDEBAR_COMPONENT": () => (/* binding */ SIDEBAR_COMPONENT),
/* harmony export */   "SIDEBAR_ROOT_SELECTOR": () => (/* binding */ SIDEBAR_ROOT_SELECTOR),
/* harmony export */   "installSidebar": () => (/* binding */ installSidebar)
/* harmony export */ });
/* harmony import */ var _sidebars_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sidebars.js */ "./resources/frontend/features/sidebar/sidebars.js");

var SIDEBAR_COMPONENT = 'sidebar-navigation';
var SIDEBAR_ROOT_SELECTOR = 'body';
function installSidebar(admin) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  assertAdmin(admin);
  var controller = null;
  admin.Components.register({
    mount: function mount(body) {
      controller = (0,_sidebars_js__WEBPACK_IMPORTED_MODULE_0__.mountSidebar)(body, options);
      return {
        destroy: function destroy() {
          var _controller;
          return (_controller = controller) === null || _controller === void 0 ? void 0 : _controller.destroy();
        }
      };
    },
    name: SIDEBAR_COMPONENT,
    selector: SIDEBAR_ROOT_SELECTOR
  });
  return {
    collapse: function collapse(settings) {
      var _controller$collapse, _controller2;
      return (_controller$collapse = (_controller2 = controller) === null || _controller2 === void 0 ? void 0 : _controller2.collapse(settings)) !== null && _controller$collapse !== void 0 ? _controller$collapse : false;
    },
    collapseItem: function collapseItem(context) {
      var _controller$collapseI, _controller3;
      return (_controller$collapseI = (_controller3 = controller) === null || _controller3 === void 0 ? void 0 : _controller3.collapseItem(context)) !== null && _controller$collapseI !== void 0 ? _controller$collapseI : false;
    },
    expand: function expand(settings) {
      var _controller$expand, _controller4;
      return (_controller$expand = (_controller4 = controller) === null || _controller4 === void 0 ? void 0 : _controller4.expand(settings)) !== null && _controller$expand !== void 0 ? _controller$expand : false;
    },
    expandItem: function expandItem(context) {
      var _controller$expandIte, _controller5;
      return (_controller$expandIte = (_controller5 = controller) === null || _controller5 === void 0 ? void 0 : _controller5.expandItem(context)) !== null && _controller$expandIte !== void 0 ? _controller$expandIte : false;
    },
    scan: function scan() {
      var _options$root;
      var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_options$root = options.root) !== null && _options$root !== void 0 ? _options$root : globalThis.document;
      return _scan(admin, controller, root);
    },
    toggle: function toggle(settings) {
      var _controller$toggle, _controller6;
      return (_controller$toggle = (_controller6 = controller) === null || _controller6 === void 0 ? void 0 : _controller6.toggle(settings)) !== null && _controller$toggle !== void 0 ? _controller$toggle : false;
    },
    toggleItem: function toggleItem(context) {
      var _controller$toggleIte, _controller7;
      return (_controller$toggleIte = (_controller7 = controller) === null || _controller7 === void 0 ? void 0 : _controller7.toggleItem(context)) !== null && _controller$toggleIte !== void 0 ? _controller$toggleIte : false;
    }
  };
}
function _scan(admin, controller, root) {
  var _controller$scan;
  admin.Components.scan(root, SIDEBAR_COMPONENT);
  return (_controller$scan = controller === null || controller === void 0 ? void 0 : controller.scan(root)) !== null && _controller$scan !== void 0 ? _controller$scan : 0;
}
function assertAdmin(admin) {
  var _admin$Components;
  if (typeof (admin === null || admin === void 0 || (_admin$Components = admin.Components) === null || _admin$Components === void 0 ? void 0 : _admin$Components.register) !== 'function') {
    throw new TypeError('Sidebar requires Admin.Components.');
  }
  if (typeof admin.Components.scan !== 'function') {
    throw new TypeError('Sidebar requires Admin.Components.scan().');
  }
}

/***/ }),

/***/ "./resources/frontend/features/sidebar/sidebar-elements.js":
/*!*****************************************************************!*\
  !*** ./resources/frontend/features/sidebar/sidebar-elements.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PUSH_MENU_SELECTOR": () => (/* binding */ PUSH_MENU_SELECTOR),
/* harmony export */   "TREE_ITEM_SELECTOR": () => (/* binding */ TREE_ITEM_SELECTOR),
/* harmony export */   "TREE_LINK_SELECTOR": () => (/* binding */ TREE_LINK_SELECTOR),
/* harmony export */   "TREE_MENU_SELECTOR": () => (/* binding */ TREE_MENU_SELECTOR),
/* harmony export */   "TREE_ROOT_SELECTOR": () => (/* binding */ TREE_ROOT_SELECTOR),
/* harmony export */   "collectPushMenuToggles": () => (/* binding */ collectPushMenuToggles),
/* harmony export */   "collectTreeContexts": () => (/* binding */ collectTreeContexts),
/* harmony export */   "collectTreeRoots": () => (/* binding */ collectTreeRoots),
/* harmony export */   "findPushMenuToggle": () => (/* binding */ findPushMenuToggle),
/* harmony export */   "findTreeContext": () => (/* binding */ findTreeContext),
/* harmony export */   "isControlDisabled": () => (/* binding */ isControlDisabled),
/* harmony export */   "parentTreeContext": () => (/* binding */ parentTreeContext),
/* harmony export */   "siblingTreeContexts": () => (/* binding */ siblingTreeContexts)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var PUSH_MENU_SELECTOR = '[data-lte-toggle="sidebar"], [data-widget="pushmenu"]';
var TREE_ROOT_SELECTOR = '[data-lte-toggle="treeview"], [data-widget="treeview"]';
var TREE_ITEM_SELECTOR = '.nav-item';
var TREE_LINK_SELECTOR = '.nav-link';
var TREE_MENU_SELECTOR = '.nav-treeview';
function collectPushMenuToggles(root) {
  return collectMatching(root, PUSH_MENU_SELECTOR);
}
function collectTreeRoots(root) {
  return collectMatching(root, TREE_ROOT_SELECTOR);
}
function findPushMenuToggle(root, target) {
  var _target$closest;
  var toggle = target === null || target === void 0 || (_target$closest = target.closest) === null || _target$closest === void 0 ? void 0 : _target$closest.call(target, PUSH_MENU_SELECTOR);
  return toggle && root.contains(toggle) ? toggle : null;
}
function findTreeContext(root, target) {
  var _target$closest2;
  var link = target === null || target === void 0 || (_target$closest2 = target.closest) === null || _target$closest2 === void 0 ? void 0 : _target$closest2.call(target, TREE_LINK_SELECTOR);
  if (!link) return null;
  var context = contextForLink(link);
  return isTreeContextInside(root, context) ? context : null;
}
function collectTreeContexts(tree) {
  return _toConsumableArray(tree.querySelectorAll(TREE_ITEM_SELECTOR)).map(function (item) {
    return treeContextForItem(tree, item);
  }).filter(Boolean);
}
function siblingTreeContexts(context) {
  var _context$item$parentE, _context$item$parentE2;
  return _toConsumableArray((_context$item$parentE = (_context$item$parentE2 = context.item.parentElement) === null || _context$item$parentE2 === void 0 ? void 0 : _context$item$parentE2.children) !== null && _context$item$parentE !== void 0 ? _context$item$parentE : []).map(function (item) {
    return treeContextForItem(context.tree, item);
  }).filter(Boolean);
}
function parentTreeContext(context) {
  var _context$item$parentE3, _context$item$parentE4;
  var parentItem = (_context$item$parentE3 = context.item.parentElement) === null || _context$item$parentE3 === void 0 || (_context$item$parentE4 = _context$item$parentE3.closest) === null || _context$item$parentE4 === void 0 ? void 0 : _context$item$parentE4.call(_context$item$parentE3, TREE_ITEM_SELECTOR);
  return parentItem ? treeContextForItem(context.tree, parentItem) : null;
}
function isControlDisabled(element) {
  var _element$hasAttribute, _element$getAttribute, _element$classList;
  var checks = [element === null || element === void 0 || (_element$hasAttribute = element.hasAttribute) === null || _element$hasAttribute === void 0 ? void 0 : _element$hasAttribute.call(element, 'disabled'), (element === null || element === void 0 || (_element$getAttribute = element.getAttribute) === null || _element$getAttribute === void 0 ? void 0 : _element$getAttribute.call(element, 'aria-disabled')) === 'true', element === null || element === void 0 || (_element$classList = element.classList) === null || _element$classList === void 0 ? void 0 : _element$classList.contains('disabled')];
  return checks.some(Boolean);
}
function contextForLink(link) {
  var _item$closest;
  var item = link.closest(TREE_ITEM_SELECTOR);
  var tree = item === null || item === void 0 || (_item$closest = item.closest) === null || _item$closest === void 0 ? void 0 : _item$closest.call(item, TREE_ROOT_SELECTOR);
  var menu = directChild(item, TREE_MENU_SELECTOR);
  return item && tree && menu ? {
    item: item,
    link: link,
    menu: menu,
    tree: tree
  } : null;
}
function isTreeContextInside(root, context) {
  return Boolean(context && root.contains(context.tree) && directChild(context.item, TREE_LINK_SELECTOR) === context.link);
}
function treeContextForItem(tree, item) {
  if (item.closest(TREE_ROOT_SELECTOR) !== tree) return null;
  var link = directChild(item, TREE_LINK_SELECTOR);
  var menu = directChild(item, TREE_MENU_SELECTOR);
  return link && menu ? {
    item: item,
    link: link,
    menu: menu,
    tree: tree
  } : null;
}
function directChild(element, selector) {
  var _find, _element$children;
  return (_find = _toConsumableArray((_element$children = element === null || element === void 0 ? void 0 : element.children) !== null && _element$children !== void 0 ? _element$children : []).find(function (child) {
    return child.matches(selector);
  })) !== null && _find !== void 0 ? _find : null;
}
function collectMatching(root, selector) {
  var _root$querySelectorAl, _root$querySelectorAl2, _root$matches;
  var elements = _toConsumableArray((_root$querySelectorAl = (_root$querySelectorAl2 = root.querySelectorAll) === null || _root$querySelectorAl2 === void 0 ? void 0 : _root$querySelectorAl2.call(root, selector)) !== null && _root$querySelectorAl !== void 0 ? _root$querySelectorAl : []);
  if ((_root$matches = root.matches) !== null && _root$matches !== void 0 && _root$matches.call(root, selector)) elements.unshift(root);
  return elements;
}

/***/ }),

/***/ "./resources/frontend/features/sidebar/sidebar-navigation.js":
/*!*******************************************************************!*\
  !*** ./resources/frontend/features/sidebar/sidebar-navigation.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TREE_NAVIGATION_KEYS": () => (/* binding */ TREE_NAVIGATION_KEYS),
/* harmony export */   "navigateTree": () => (/* binding */ navigateTree)
/* harmony export */ });
/* harmony import */ var _sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sidebar-elements.js */ "./resources/frontend/features/sidebar/sidebar-elements.js");
/* harmony import */ var _sidebar_tree_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sidebar-tree.js */ "./resources/frontend/features/sidebar/sidebar-tree.js");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }


var TREE_NAVIGATION_KEYS = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home']);
function navigateTree(context, key) {
  if (key === 'ArrowRight') return navigateRight(context);
  if (key === 'ArrowLeft') return navigateLeft(context);
  var links = visibleTreeLinks(context.tree);
  var current = links.indexOf(context.link);
  var target = navigationTarget(links, current, key);
  target === null || target === void 0 || target.focus();
  return Boolean(target);
}
function navigateRight(context) {
  if (!context.item.classList.contains('menu-open')) return (0,_sidebar_tree_js__WEBPACK_IMPORTED_MODULE_1__.expandTreeItem)(context);
  var child = visibleTreeLinks(context.menu)[0];
  child === null || child === void 0 || child.focus();
  return Boolean(child);
}
function navigateLeft(context) {
  if (context.item.classList.contains('menu-open')) return (0,_sidebar_tree_js__WEBPACK_IMPORTED_MODULE_1__.collapseTreeItem)(context);
  var parent = (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.parentTreeContext)(context);
  parent === null || parent === void 0 || parent.link.focus();
  return Boolean(parent);
}
function navigationTarget(links, current, key) {
  if (key === 'Home') return links[0];
  if (key === 'End') return links.at(-1);
  var offset = key === 'ArrowUp' ? -1 : 1;
  return links[(current + offset + links.length) % links.length];
}
function visibleTreeLinks(root) {
  return _toConsumableArray(root.querySelectorAll('.nav-link')).filter(function (link) {
    return !isInsideHiddenMenu(link) && !link.matches('[disabled], [aria-disabled="true"]');
  }).filter(function (link) {
    return link.closest('.nav-item');
  });
}
function isInsideHiddenMenu(link) {
  var menu = link.closest('.nav-treeview');
  while (menu) {
    var _menu$parentElement, _menu$parentElement$c;
    if (menu.hidden) return true;
    menu = (_menu$parentElement = menu.parentElement) === null || _menu$parentElement === void 0 || (_menu$parentElement$c = _menu$parentElement.closest) === null || _menu$parentElement$c === void 0 ? void 0 : _menu$parentElement$c.call(_menu$parentElement, '.nav-treeview');
  }
  return false;
}

/***/ }),

/***/ "./resources/frontend/features/sidebar/sidebar-state.js":
/*!**************************************************************!*\
  !*** ./resources/frontend/features/sidebar/sidebar-state.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clearCollapsedDone": () => (/* binding */ clearCollapsedDone),
/* harmony export */   "collapseSidebar": () => (/* binding */ collapseSidebar),
/* harmony export */   "expandSidebar": () => (/* binding */ expandSidebar),
/* harmony export */   "normalizeSidebar": () => (/* binding */ normalizeSidebar),
/* harmony export */   "sidebarPreference": () => (/* binding */ sidebarPreference),
/* harmony export */   "toggleSidebar": () => (/* binding */ toggleSidebar)
/* harmony export */ });
/* harmony import */ var _sidebar_storage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sidebar-storage.js */ "./resources/frontend/features/sidebar/sidebar-storage.js");

var COLLAPSED_EVENTS = ['sidebar:collapsed', 'collapsed.lte.pushmenu'];
var EXPANDED_EVENTS = ['sidebar:shown', 'shown.lte.pushmenu'];
function normalizeSidebar(state, expanded) {
  state.expanded = expanded;
  applySidebarClasses(state, expanded);
  syncPushMenuToggles(state);
}
function expandSidebar(state) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return changeSidebarState(state, true, options);
}
function collapseSidebar(state) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return changeSidebarState(state, false, options);
}
function toggleSidebar(state) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return state.expanded ? collapseSidebar(state, options) : expandSidebar(state, options);
}
function sidebarPreference(expanded) {
  return expanded ? _sidebar_storage_js__WEBPACK_IMPORTED_MODULE_0__.SIDEBAR_EXPANDED : _sidebar_storage_js__WEBPACK_IMPORTED_MODULE_0__.SIDEBAR_COLLAPSED;
}
function changeSidebarState(state, expanded, options) {
  var _ref, _options$target;
  if (state.expanded === expanded) return false;
  var target = (_ref = (_options$target = options.target) !== null && _options$target !== void 0 ? _options$target : state.toggles[0]) !== null && _ref !== void 0 ? _ref : state.body;
  var before = expanded ? 'sidebar:show' : 'sidebar:collapse';
  if (!dispatchSidebarEvent(target, before, state, true)) return false;
  clearCollapsedDone(state);
  state.expanded = expanded;
  applySidebarClasses(state, expanded);
  syncPushMenuToggles(state);
  dispatchSidebarEvents(target, expanded ? EXPANDED_EVENTS : COLLAPSED_EVENTS, state);
  if (!expanded) dispatchCollapsedDone(target, state);
  return true;
}
function applySidebarClasses(state, expanded) {
  state.body.classList.toggle('sidebar-collapse', !expanded);
  state.body.classList.toggle('sidebar-closed', !expanded && state.compact);
  state.body.classList.toggle('sidebar-open', expanded || !state.compact);
}
function syncPushMenuToggles(state) {
  state.toggles.forEach(function (toggle) {
    toggle.setAttribute('aria-expanded', String(state.expanded));
    if (!toggle.hasAttribute('href')) toggle.setAttribute('role', 'button');
    if (!toggle.hasAttribute('href') && !toggle.hasAttribute('tabindex')) {
      toggle.setAttribute('tabindex', '0');
    }
  });
}
function dispatchSidebarEvents(target, names, state) {
  names.forEach(function (name) {
    return dispatchSidebarEvent(target, name, state);
  });
}
function dispatchCollapsedDone(target, state) {
  state.collapseTimer = state.window.setTimeout(function () {
    return completeCollapsedEvent(target, state);
  }, state.animationDuration);
}
function completeCollapsedEvent(target, state) {
  state.collapseTimer = null;
  dispatchSidebarEvent(target, 'collapsed-done.lte.pushmenu', state);
}
function clearCollapsedDone(state) {
  if (state.collapseTimer === null) return;
  state.window.clearTimeout(state.collapseTimer);
  state.collapseTimer = null;
}
function dispatchSidebarEvent(target, name, state) {
  var cancelable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  return target.dispatchEvent(new state.window.CustomEvent(name, {
    bubbles: true,
    cancelable: cancelable,
    detail: {
      body: state.body,
      expanded: state.expanded
    }
  }));
}

/***/ }),

/***/ "./resources/frontend/features/sidebar/sidebar-storage.js":
/*!****************************************************************!*\
  !*** ./resources/frontend/features/sidebar/sidebar-storage.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SIDEBAR_COLLAPSED": () => (/* binding */ SIDEBAR_COLLAPSED),
/* harmony export */   "SIDEBAR_EXPANDED": () => (/* binding */ SIDEBAR_EXPANDED),
/* harmony export */   "SIDEBAR_STORAGE_KEY": () => (/* binding */ SIDEBAR_STORAGE_KEY),
/* harmony export */   "normalizeSidebarPreference": () => (/* binding */ normalizeSidebarPreference),
/* harmony export */   "readSidebarPreference": () => (/* binding */ readSidebarPreference),
/* harmony export */   "writeSidebarPreference": () => (/* binding */ writeSidebarPreference)
/* harmony export */ });
var SIDEBAR_COLLAPSED = 'sidebar-collapse';
var SIDEBAR_EXPANDED = 'sidebar-open';
var SIDEBAR_STORAGE_KEY = 'sidebar-state';
function readSidebarPreference(storage) {
  try {
    var _storage$getItem;
    return normalizeSidebarPreference(storage === null || storage === void 0 || (_storage$getItem = storage.getItem) === null || _storage$getItem === void 0 ? void 0 : _storage$getItem.call(storage, SIDEBAR_STORAGE_KEY));
  } catch (_unused) {
    return null;
  }
}
function writeSidebarPreference(storage, document, value) {
  var preference = normalizeSidebarPreference(value);
  if (!preference) return false;
  writeStorage(storage, preference);
  writeCookie(document, preference);
  return true;
}
function normalizeSidebarPreference(value) {
  return [SIDEBAR_COLLAPSED, SIDEBAR_EXPANDED].includes(value) ? value : null;
}
function writeStorage(storage, value) {
  try {
    var _storage$setItem;
    storage === null || storage === void 0 || (_storage$setItem = storage.setItem) === null || _storage$setItem === void 0 || _storage$setItem.call(storage, SIDEBAR_STORAGE_KEY, value);
  } catch (_unused2) {
    // Storage can be unavailable in privacy-restricted browsing contexts.
  }
}
function writeCookie(document, value) {
  var _document$location;
  if (!document || typeof document.cookie !== 'string') return;
  var secure = ((_document$location = document.location) === null || _document$location === void 0 ? void 0 : _document$location.protocol) === 'https:' ? '; Secure' : '';
  document.cookie = "".concat(SIDEBAR_STORAGE_KEY, "=").concat(encodeURIComponent(value), "; Path=/; SameSite=Lax").concat(secure);
}

/***/ }),

/***/ "./resources/frontend/features/sidebar/sidebar-tree.js":
/*!*************************************************************!*\
  !*** ./resources/frontend/features/sidebar/sidebar-tree.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "collapseTreeItem": () => (/* binding */ collapseTreeItem),
/* harmony export */   "expandTreeItem": () => (/* binding */ expandTreeItem),
/* harmony export */   "normalizeTree": () => (/* binding */ normalizeTree),
/* harmony export */   "toggleTreeItem": () => (/* binding */ toggleTreeItem)
/* harmony export */ });
/* harmony import */ var _sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sidebar-elements.js */ "./resources/frontend/features/sidebar/sidebar-elements.js");

function normalizeTree(tree) {
  var _tree$getAttribute;
  tree.setAttribute('role', (_tree$getAttribute = tree.getAttribute('role')) !== null && _tree$getAttribute !== void 0 ? _tree$getAttribute : 'menu');
  (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.collectTreeContexts)(tree).forEach(function (context) {
    applyTreeItemState(context, context.item.classList.contains('menu-open'));
  });
}
function expandTreeItem(context) {
  if (context.item.classList.contains('menu-open')) return false;
  if (!dispatchTreeEvent(context, 'navigation:expand', true)) return false;
  if (!collapseAccordionSiblings(context)) return false;
  applyTreeItemState(context, true);
  dispatchTreeEvents(context, ['navigation:expanded', 'expanded.lte.treeview']);
  return true;
}
function collapseTreeItem(context) {
  if (!context.item.classList.contains('menu-open')) return false;
  if (!dispatchTreeEvent(context, 'navigation:collapse', true)) return false;
  closeTreeBranch(context);
  dispatchTreeEvents(context, ['navigation:collapsed', 'collapsed.lte.treeview']);
  return true;
}
function toggleTreeItem(context) {
  return context.item.classList.contains('menu-open') ? collapseTreeItem(context) : expandTreeItem(context);
}
function collapseAccordionSiblings(context) {
  if (context.tree.getAttribute('data-accordion') === 'false') return true;
  return (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.siblingTreeContexts)(context).filter(function (sibling) {
    return sibling.item !== context.item;
  }).filter(function (sibling) {
    return sibling.item.classList.contains('menu-open');
  }).every(collapseTreeItem);
}
function closeTreeBranch(context) {
  applyTreeItemState(context, false);
  (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.collectTreeContexts)(context.menu).forEach(function (nested) {
    return applyTreeItemState(nested, false);
  });
}
function applyTreeItemState(context, expanded) {
  context.item.classList.toggle('menu-open', expanded);
  context.item.classList.remove('menu-is-opening');
  context.menu.hidden = !expanded;
  context.link.setAttribute('aria-expanded', String(expanded));
  context.link.setAttribute('aria-haspopup', 'true');
}
function dispatchTreeEvents(context, names) {
  names.forEach(function (name) {
    return dispatchTreeEvent(context, name);
  });
}
function dispatchTreeEvent(context, name) {
  var cancelable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return context.tree.dispatchEvent(new context.tree.ownerDocument.defaultView.CustomEvent(name, {
    bubbles: true,
    cancelable: cancelable,
    detail: context
  }));
}

/***/ }),

/***/ "./resources/frontend/features/sidebar/sidebars.js":
/*!*********************************************************!*\
  !*** ./resources/frontend/features/sidebar/sidebars.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mountSidebar": () => (/* binding */ mountSidebar)
/* harmony export */ });
/* harmony import */ var _sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sidebar-elements.js */ "./resources/frontend/features/sidebar/sidebar-elements.js");
/* harmony import */ var _sidebar_navigation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sidebar-navigation.js */ "./resources/frontend/features/sidebar/sidebar-navigation.js");
/* harmony import */ var _sidebar_state_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sidebar-state.js */ "./resources/frontend/features/sidebar/sidebar-state.js");
/* harmony import */ var _sidebar_storage_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sidebar-storage.js */ "./resources/frontend/features/sidebar/sidebar-storage.js");
/* harmony import */ var _sidebar_tree_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sidebar-tree.js */ "./resources/frontend/features/sidebar/sidebar-tree.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





var DEFAULT_BREAKPOINT = 1200;
var DEFAULT_ANIMATION_DURATION = 300;
function mountSidebar(root) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var state = createSidebarState(root, options);
  var listeners = bindSidebarListeners(state);
  scanSidebar(state, root);
  restoreSidebar(state);
  return sidebarController(state, listeners);
}
function sidebarController(state, listeners) {
  return {
    collapse: function collapse(options) {
      return setSidebar(state, false, options);
    },
    collapseItem: _sidebar_tree_js__WEBPACK_IMPORTED_MODULE_4__.collapseTreeItem,
    destroy: function destroy() {
      return destroySidebar(state, listeners);
    },
    expand: function expand(options) {
      return setSidebar(state, true, options);
    },
    expandItem: _sidebar_tree_js__WEBPACK_IMPORTED_MODULE_4__.expandTreeItem,
    scan: function scan() {
      var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.root;
      return scanSidebar(state, root);
    },
    toggle: function toggle(options) {
      return toggleAndPersist(state, options);
    },
    toggleItem: _sidebar_tree_js__WEBPACK_IMPORTED_MODULE_4__.toggleTreeItem
  };
}
function createSidebarState(root, options) {
  var _options$animationDur, _options$breakpoint, _options$breakpoint2;
  assertRoot(root);
  var document = root.ownerDocument;
  var window = document.defaultView;
  return {
    animationDuration: (_options$animationDur = options.animationDuration) !== null && _options$animationDur !== void 0 ? _options$animationDur : DEFAULT_ANIMATION_DURATION,
    body: root,
    breakpoint: (_options$breakpoint = options.breakpoint) !== null && _options$breakpoint !== void 0 ? _options$breakpoint : DEFAULT_BREAKPOINT,
    compact: isCompact(window, (_options$breakpoint2 = options.breakpoint) !== null && _options$breakpoint2 !== void 0 ? _options$breakpoint2 : DEFAULT_BREAKPOINT),
    collapseTimer: null,
    document: document,
    expanded: !root.classList.contains('sidebar-collapse'),
    preference: (0,_sidebar_storage_js__WEBPACK_IMPORTED_MODULE_3__.readSidebarPreference)(window.localStorage),
    root: root,
    toggles: [],
    treeRoots: [],
    window: window
  };
}
function bindSidebarListeners(state) {
  var listeners = {
    click: function click(event) {
      return handleSidebarClick(state, event);
    },
    keydown: function keydown(event) {
      return handleSidebarKeydown(state, event);
    },
    resize: function resize() {
      return handleSidebarResize(state);
    }
  };
  state.root.addEventListener('click', listeners.click);
  state.root.addEventListener('keydown', listeners.keydown);
  state.window.addEventListener('resize', listeners.resize);
  return listeners;
}
function handleSidebarClick(state, event) {
  var _event$target$closest, _event$target;
  var toggle = (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.findPushMenuToggle)(state.root, event.target);
  if (toggle) return handlePushMenuClick(state, event, toggle);
  if ((_event$target$closest = (_event$target = event.target).closest) !== null && _event$target$closest !== void 0 && _event$target$closest.call(_event$target, '#sidebar-overlay')) return handleOverlayClick(state, event);
  var context = (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTreeContext)(state.root, event.target);
  if (!context || !isPlainPrimaryClick(event) || (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.isControlDisabled)(context.link)) return false;
  event.preventDefault();
  event.stopPropagation();
  return (0,_sidebar_tree_js__WEBPACK_IMPORTED_MODULE_4__.toggleTreeItem)(context);
}
function handlePushMenuClick(state, event, toggle) {
  if (!isPlainPrimaryClick(event) || (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.isControlDisabled)(toggle)) return false;
  event.preventDefault();
  event.stopPropagation();
  return toggleAndPersist(state, {
    target: toggle
  });
}
function handleOverlayClick(state, event) {
  event.preventDefault();
  event.stopPropagation();
  return setSidebar(state, false, {
    persist: true
  });
}
function handleSidebarKeydown(state, event) {
  if (event.key === 'Escape') return handleSidebarEscape(state, event);
  var toggle = (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.findPushMenuToggle)(state.root, event.target);
  if (toggle) return handlePushMenuKeydown(state, event, toggle);
  var context = (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTreeContext)(state.root, event.target);
  return context ? handleTreeKeydown(event, context) : false;
}
function handlePushMenuKeydown(state, event, toggle) {
  return ['Enter', ' '].includes(event.key) ? handleKeyboardToggle(state, event, toggle) : false;
}
function handleSidebarEscape(state, event) {
  return state.compact && state.expanded ? closeOnEscape(state, event) : false;
}
function handleTreeKeydown(event, context) {
  if ((0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.isControlDisabled)(context.link)) return false;
  if (['Enter', ' '].includes(event.key)) return handleKeyboardTreeToggle(event, context);
  if (!_sidebar_navigation_js__WEBPACK_IMPORTED_MODULE_1__.TREE_NAVIGATION_KEYS.has(event.key)) return false;
  event.preventDefault();
  return (0,_sidebar_navigation_js__WEBPACK_IMPORTED_MODULE_1__.navigateTree)(context, event.key);
}
function handleKeyboardToggle(state, event, toggle) {
  event.preventDefault();
  event.stopPropagation();
  return toggleAndPersist(state, {
    target: toggle
  });
}
function handleKeyboardTreeToggle(event, context) {
  event.preventDefault();
  event.stopPropagation();
  return (0,_sidebar_tree_js__WEBPACK_IMPORTED_MODULE_4__.toggleTreeItem)(context);
}
function closeOnEscape(state, event) {
  var _state$toggles$;
  event.preventDefault();
  var changed = setSidebar(state, false, {
    persist: true
  });
  if (changed) (_state$toggles$ = state.toggles[0]) === null || _state$toggles$ === void 0 || _state$toggles$.focus();
  return changed;
}
function handleSidebarResize(state) {
  var compact = isCompact(state.window, state.breakpoint);
  if (compact === state.compact) return false;
  state.compact = compact;
  var expanded = compact ? false : state.preference !== _sidebar_storage_js__WEBPACK_IMPORTED_MODULE_3__.SIDEBAR_COLLAPSED;
  (0,_sidebar_state_js__WEBPACK_IMPORTED_MODULE_2__.normalizeSidebar)(state, expanded);
  return true;
}
function restoreSidebar(state) {
  var expanded = state.compact ? false : state.preference !== _sidebar_storage_js__WEBPACK_IMPORTED_MODULE_3__.SIDEBAR_COLLAPSED;
  (0,_sidebar_state_js__WEBPACK_IMPORTED_MODULE_2__.normalizeSidebar)(state, expanded);
}
function toggleAndPersist(state) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var expanded = !state.expanded;
  return setSidebar(state, expanded, _objectSpread(_objectSpread({}, options), {}, {
    persist: true
  }));
}
function setSidebar(state, expanded) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var changed = expanded ? (0,_sidebar_state_js__WEBPACK_IMPORTED_MODULE_2__.expandSidebar)(state, options) : (0,_sidebar_state_js__WEBPACK_IMPORTED_MODULE_2__.collapseSidebar)(state, options);
  if (!changed || !options.persist) return changed;
  state.preference = (0,_sidebar_state_js__WEBPACK_IMPORTED_MODULE_2__.sidebarPreference)(expanded);
  (0,_sidebar_storage_js__WEBPACK_IMPORTED_MODULE_3__.writeSidebarPreference)(state.window.localStorage, state.document, state.preference);
  return true;
}
function scanSidebar(state, root) {
  state.toggles = (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.collectPushMenuToggles)(state.root);
  state.treeRoots = (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.collectTreeRoots)(state.root);
  state.treeRoots.forEach(_sidebar_tree_js__WEBPACK_IMPORTED_MODULE_4__.normalizeTree);
  (0,_sidebar_state_js__WEBPACK_IMPORTED_MODULE_2__.normalizeSidebar)(state, state.expanded);
  return (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.collectPushMenuToggles)(root).length + (0,_sidebar_elements_js__WEBPACK_IMPORTED_MODULE_0__.collectTreeRoots)(root).length;
}
function destroySidebar(state, listeners) {
  (0,_sidebar_state_js__WEBPACK_IMPORTED_MODULE_2__.clearCollapsedDone)(state);
  state.root.removeEventListener('click', listeners.click);
  state.root.removeEventListener('keydown', listeners.keydown);
  state.window.removeEventListener('resize', listeners.resize);
}
function isCompact(window, breakpoint) {
  return window.innerWidth <= breakpoint;
}
function isPlainPrimaryClick(event) {
  return !event.defaultPrevented && event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
}
function assertRoot(root) {
  if (!(root !== null && root !== void 0 && root.ownerDocument) || typeof root.addEventListener !== 'function') {
    throw new TypeError('Sidebar requires a document body root.');
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
/*!********************************************************!*\
  !*** ./resources/frontend/features/sidebar/browser.js ***!
  \********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bootSidebar": () => (/* binding */ bootSidebar)
/* harmony export */ });
/* harmony import */ var _install_sidebar_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./install-sidebar.js */ "./resources/frontend/features/sidebar/install-sidebar.js");

if (globalThis.document) bootSidebar(globalThis);
function bootSidebar(target) {
  var sidebar = (0,_install_sidebar_js__WEBPACK_IMPORTED_MODULE_0__.installSidebar)(target.Admin, {
    root: target.document
  });
  target.Admin.Sidebar = sidebar;
  sidebar.scan();
  return sidebar;
}
})();

/******/ })()
;
//# sourceMappingURL=sidebar.js.map