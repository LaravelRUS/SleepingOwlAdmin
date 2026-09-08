/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/frontend/features/tooltip/install-tooltips.js":
/*!*****************************************************************!*\
  !*** ./resources/frontend/features/tooltip/install-tooltips.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TOOLTIP_COMPONENT": () => (/* binding */ TOOLTIP_COMPONENT),
/* harmony export */   "TOOLTIP_ROOT_SELECTOR": () => (/* binding */ TOOLTIP_ROOT_SELECTOR),
/* harmony export */   "installTooltips": () => (/* binding */ installTooltips)
/* harmony export */ });
/* harmony import */ var _tooltips_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tooltips.js */ "./resources/frontend/features/tooltip/tooltips.js");

var TOOLTIP_COMPONENT = 'tooltips';
var TOOLTIP_ROOT_SELECTOR = 'body';
function installTooltips(admin) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  assertAdmin(admin);
  var controller = null;
  admin.Components.register({
    mount: function mount(body) {
      controller = (0,_tooltips_js__WEBPACK_IMPORTED_MODULE_0__.mountTooltips)(body);
      return {
        destroy: function destroy() {
          return destroyController(controller);
        }
      };
    },
    name: TOOLTIP_COMPONENT,
    selector: TOOLTIP_ROOT_SELECTOR
  });
  return {
    hide: function hide() {
      var _controller$hide, _controller;
      return (_controller$hide = (_controller = controller) === null || _controller === void 0 ? void 0 : _controller.hide()) !== null && _controller$hide !== void 0 ? _controller$hide : false;
    },
    scan: function scan() {
      var _options$root;
      var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_options$root = options.root) !== null && _options$root !== void 0 ? _options$root : globalThis.document;
      return _scan(admin, controller, root);
    }
  };
}
function _scan(admin, controller, root) {
  var _controller$scan;
  admin.Components.scan(root, TOOLTIP_COMPONENT);
  return (_controller$scan = controller === null || controller === void 0 ? void 0 : controller.scan(root)) !== null && _controller$scan !== void 0 ? _controller$scan : 0;
}
function destroyController(controller) {
  controller === null || controller === void 0 || controller.destroy();
}
function assertAdmin(admin) {
  var _admin$Components;
  if (typeof (admin === null || admin === void 0 || (_admin$Components = admin.Components) === null || _admin$Components === void 0 ? void 0 : _admin$Components.register) !== 'function') {
    throw new TypeError('Tooltips require Admin.Components.');
  }
  if (typeof admin.Components.scan !== 'function') {
    throw new TypeError('Tooltips require Admin.Components.scan().');
  }
}

/***/ }),

/***/ "./resources/frontend/features/tooltip/tooltip-elements.js":
/*!*****************************************************************!*\
  !*** ./resources/frontend/features/tooltip/tooltip-elements.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TOOLTIP_TRIGGER_SELECTOR": () => (/* binding */ TOOLTIP_TRIGGER_SELECTOR),
/* harmony export */   "findTooltipTrigger": () => (/* binding */ findTooltipTrigger),
/* harmony export */   "tooltipPlacement": () => (/* binding */ tooltipPlacement),
/* harmony export */   "tooltipText": () => (/* binding */ tooltipText)
/* harmony export */ });
var TOOLTIP_TRIGGER_SELECTOR = '[data-bs-toggle="tooltip"], [data-toggle="tooltip"]';
var PLACEMENTS = new Set(['top', 'right', 'bottom', 'left']);
function findTooltipTrigger(root, target) {
  var _target$closest;
  var trigger = target === null || target === void 0 || (_target$closest = target.closest) === null || _target$closest === void 0 ? void 0 : _target$closest.call(target, TOOLTIP_TRIGGER_SELECTOR);
  return trigger && root.contains(trigger) ? trigger : null;
}
function tooltipText(trigger) {
  var _candidates$find$trim, _candidates$find;
  var candidates = [trigger.getAttribute('title'), trigger.getAttribute('data-original-title')];
  return (_candidates$find$trim = (_candidates$find = candidates.find(function (value) {
    return value === null || value === void 0 ? void 0 : value.trim();
  })) === null || _candidates$find === void 0 ? void 0 : _candidates$find.trim()) !== null && _candidates$find$trim !== void 0 ? _candidates$find$trim : '';
}
function tooltipPlacement(trigger) {
  var _trigger$getAttribute;
  var placement = (_trigger$getAttribute = trigger.getAttribute('data-placement')) !== null && _trigger$getAttribute !== void 0 ? _trigger$getAttribute : 'top';
  return PLACEMENTS.has(placement) ? placement : 'top';
}

/***/ }),

/***/ "./resources/frontend/features/tooltip/tooltip-position.js":
/*!*****************************************************************!*\
  !*** ./resources/frontend/features/tooltip/tooltip-position.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tooltipPosition": () => (/* binding */ tooltipPosition)
/* harmony export */ });
var VIEWPORT_MARGIN = 4;
var TOOLTIP_GAP = 8;
var OPPOSITE_PLACEMENT = {
  bottom: 'top',
  left: 'right',
  right: 'left',
  top: 'bottom'
};
var PLACEMENT_FITS = {
  bottom: function bottom(trigger, tooltip, viewport) {
    return viewport.height - trigger.bottom >= tooltip.height + TOOLTIP_GAP;
  },
  left: function left(trigger, tooltip) {
    return trigger.left >= tooltip.width + TOOLTIP_GAP;
  },
  right: function right(trigger, tooltip, viewport) {
    return viewport.width - trigger.right >= tooltip.width + TOOLTIP_GAP;
  },
  top: function top(trigger, tooltip) {
    return trigger.top >= tooltip.height + TOOLTIP_GAP;
  }
};
function tooltipPosition(triggerRect, tooltipRect, requestedPlacement, viewport) {
  var placement = fittingPlacement(triggerRect, tooltipRect, requestedPlacement, viewport);
  var position = positionFor(triggerRect, tooltipRect, placement);
  return {
    placement: placement,
    x: clamp(position.x, VIEWPORT_MARGIN, viewport.width - tooltipRect.width - VIEWPORT_MARGIN),
    y: clamp(position.y, VIEWPORT_MARGIN, viewport.height - tooltipRect.height - VIEWPORT_MARGIN)
  };
}
function fittingPlacement(trigger, tooltip, requested, viewport) {
  var placement = PLACEMENT_FITS[requested] ? requested : 'top';
  return PLACEMENT_FITS[placement](trigger, tooltip, viewport) ? placement : OPPOSITE_PLACEMENT[placement];
}
function positionFor(trigger, tooltip, placement) {
  var horizontalCenter = trigger.left + (trigger.width - tooltip.width) / 2;
  var verticalCenter = trigger.top + (trigger.height - tooltip.height) / 2;
  if (placement === 'bottom') return {
    x: horizontalCenter,
    y: trigger.bottom + TOOLTIP_GAP
  };
  if (placement === 'left') return {
    x: trigger.left - tooltip.width - TOOLTIP_GAP,
    y: verticalCenter
  };
  if (placement === 'right') return {
    x: trigger.right + TOOLTIP_GAP,
    y: verticalCenter
  };
  return {
    x: horizontalCenter,
    y: trigger.top - tooltip.height - TOOLTIP_GAP
  };
}
function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

/***/ }),

/***/ "./resources/frontend/features/tooltip/tooltip-template.js":
/*!*****************************************************************!*\
  !*** ./resources/frontend/features/tooltip/tooltip-template.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTooltipElement": () => (/* binding */ createTooltipElement)
/* harmony export */ });
var TOOLTIP_TEMPLATE_SELECTOR = 'template[data-tooltip-template]';
var TOOLTIP_POPUP_SELECTOR = '[data-tooltip-popup]';
var TOOLTIP_CONTENT_SELECTOR = '[data-tooltip-content]';
function createTooltipElement(root, content, placement, id) {
  var _cloneTooltip;
  var tooltip = (_cloneTooltip = cloneTooltip(root)) !== null && _cloneTooltip !== void 0 ? _cloneTooltip : createFallbackTooltip(root.ownerDocument);
  prepareTooltip(tooltip, content, placement, id);
  return tooltip;
}
function cloneTooltip(root) {
  var _root$querySelector, _template$content, _template$content$clo, _fragment$querySelect, _fragment$querySelect2;
  var template = (_root$querySelector = root.querySelector) === null || _root$querySelector === void 0 ? void 0 : _root$querySelector.call(root, TOOLTIP_TEMPLATE_SELECTOR);
  var fragment = template === null || template === void 0 || (_template$content = template.content) === null || _template$content === void 0 || (_template$content$clo = _template$content.cloneNode) === null || _template$content$clo === void 0 ? void 0 : _template$content$clo.call(_template$content, true);
  return (_fragment$querySelect = fragment === null || fragment === void 0 || (_fragment$querySelect2 = fragment.querySelector) === null || _fragment$querySelect2 === void 0 ? void 0 : _fragment$querySelect2.call(fragment, TOOLTIP_POPUP_SELECTOR)) !== null && _fragment$querySelect !== void 0 ? _fragment$querySelect : null;
}
function createFallbackTooltip(document) {
  var tooltip = document.createElement('div');
  tooltip.dataset.tooltipPopup = '';
  return tooltip;
}
function prepareTooltip(tooltip, content, placement, id) {
  tooltip.id = id;
  tooltip.dataset.placement = placement;
  tooltip.setAttribute('data-tooltip-popup', '');
  tooltip.setAttribute('role', 'tooltip');
  findContentTarget(tooltip).textContent = content;
}
function findContentTarget(tooltip) {
  var _tooltip$matches, _tooltip$querySelecto, _tooltip$querySelecto2;
  if ((_tooltip$matches = tooltip.matches) !== null && _tooltip$matches !== void 0 && _tooltip$matches.call(tooltip, TOOLTIP_CONTENT_SELECTOR)) return tooltip;
  return (_tooltip$querySelecto = (_tooltip$querySelecto2 = tooltip.querySelector) === null || _tooltip$querySelecto2 === void 0 ? void 0 : _tooltip$querySelecto2.call(tooltip, TOOLTIP_CONTENT_SELECTOR)) !== null && _tooltip$querySelecto !== void 0 ? _tooltip$querySelecto : tooltip;
}

/***/ }),

/***/ "./resources/frontend/features/tooltip/tooltips.js":
/*!*********************************************************!*\
  !*** ./resources/frontend/features/tooltip/tooltips.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mountTooltips": () => (/* binding */ mountTooltips)
/* harmony export */ });
/* harmony import */ var _tooltip_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tooltip-elements.js */ "./resources/frontend/features/tooltip/tooltip-elements.js");
/* harmony import */ var _tooltip_position_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tooltip-position.js */ "./resources/frontend/features/tooltip/tooltip-position.js");
/* harmony import */ var _tooltip_template_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tooltip-template.js */ "./resources/frontend/features/tooltip/tooltip-template.js");



var ROOT_EVENT_NAMES = ['focusin', 'focusout', 'keydown', 'pointerout', 'pointerover'];
function mountTooltips(root) {
  assertRoot(root);
  var state = createState(root);
  var listeners = bindTooltipListeners(state);
  return {
    destroy: function destroy() {
      return destroyTooltips(state, listeners);
    },
    hide: function hide() {
      return hideTooltip(state);
    },
    scan: function scan() {
      var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : root;
      return scanTooltips(state, container);
    }
  };
}
function createState(root) {
  return {
    current: null,
    nextId: 1,
    root: root,
    window: root.ownerDocument.defaultView
  };
}
function bindTooltipListeners(state) {
  var listeners = {
    focusin: function focusin(event) {
      return startTooltip(state, event.target, 'focus');
    },
    focusout: function focusout(event) {
      return handleFocusOut(state, event);
    },
    keydown: function keydown(event) {
      return handleKeydown(state, event);
    },
    pointerout: function pointerout(event) {
      return handlePointerOut(state, event);
    },
    pointerover: function pointerover(event) {
      return handlePointerOver(state, event);
    },
    reposition: function reposition() {
      return repositionTooltip(state);
    }
  };
  ROOT_EVENT_NAMES.forEach(function (name) {
    return state.root.addEventListener(name, listeners[name]);
  });
  state.window.addEventListener('resize', listeners.reposition);
  state.window.addEventListener('scroll', listeners.reposition, true);
  return listeners;
}
function handlePointerOver(state, event) {
  var trigger = (0,_tooltip_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTooltipTrigger)(state.root, event.target);
  if (trigger && !trigger.contains(event.relatedTarget)) startTooltip(state, trigger, 'pointer');
}
function handleFocusOut(state, event) {
  var trigger = (0,_tooltip_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTooltipTrigger)(state.root, event.target);
  if (trigger && !trigger.contains(event.relatedTarget)) stopTooltip(state, trigger, 'focus');
}
function handlePointerOut(state, event) {
  var trigger = (0,_tooltip_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTooltipTrigger)(state.root, event.target);
  if (trigger && !trigger.contains(event.relatedTarget)) stopTooltip(state, trigger, 'pointer');
}
function handleKeydown(state, event) {
  var _trigger$focus;
  if (event.key !== 'Escape' || !state.current) return;
  var trigger = state.current.trigger;
  hideTooltip(state);
  (_trigger$focus = trigger.focus) === null || _trigger$focus === void 0 || _trigger$focus.call(trigger);
}
function startTooltip(state, target, reason) {
  var _state$current;
  var trigger = (0,_tooltip_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTooltipTrigger)(state.root, target);
  if (!trigger || isDisabled(trigger)) return false;
  if (((_state$current = state.current) === null || _state$current === void 0 ? void 0 : _state$current.trigger) === trigger) {
    state.current.reasons.add(reason);
    return true;
  }
  return showTooltip(state, trigger, reason);
}
function stopTooltip(state, target, reason) {
  var _state$current2;
  var trigger = (0,_tooltip_elements_js__WEBPACK_IMPORTED_MODULE_0__.findTooltipTrigger)(state.root, target);
  if (!trigger || ((_state$current2 = state.current) === null || _state$current2 === void 0 ? void 0 : _state$current2.trigger) !== trigger) return;
  state.current.reasons["delete"](reason);
  if (state.current.reasons.size === 0) hideTooltip(state);
}
function showTooltip(state, trigger, reason) {
  var content = (0,_tooltip_elements_js__WEBPACK_IMPORTED_MODULE_0__.tooltipText)(trigger);
  if (!content) return false;
  hideTooltip(state);
  var tooltip = createTooltip(state, content, (0,_tooltip_elements_js__WEBPACK_IMPORTED_MODULE_0__.tooltipPlacement)(trigger));
  var current = createCurrent(trigger, tooltip, reason);
  state.current = current;
  trigger.ownerDocument.body.append(tooltip);
  applyOpenState(current);
  repositionTooltip(state);
  dispatchTooltipEvent(current, 'tooltip:shown');
  return true;
}
function createTooltip(state, content, placement) {
  return (0,_tooltip_template_js__WEBPACK_IMPORTED_MODULE_2__.createTooltipElement)(state.root, content, placement, "soa-tooltip-".concat(state.nextId++));
}
function createCurrent(trigger, tooltip, reason) {
  return {
    describedBy: trigger.getAttribute('aria-describedby'),
    placement: (0,_tooltip_elements_js__WEBPACK_IMPORTED_MODULE_0__.tooltipPlacement)(trigger),
    reasons: new Set([reason]),
    title: trigger.hasAttribute('title') ? trigger.getAttribute('title') : null,
    tooltip: tooltip,
    trigger: trigger
  };
}
function applyOpenState(current) {
  current.trigger.removeAttribute('title');
  current.trigger.dataset.tooltipOpen = '';
  current.trigger.setAttribute('aria-describedby', [current.describedBy, current.tooltip.id].filter(Boolean).join(' '));
}
function repositionTooltip(state) {
  var current = state.current;
  if (!current) return;
  if (!current.trigger.isConnected) return hideTooltip(state);
  var position = (0,_tooltip_position_js__WEBPACK_IMPORTED_MODULE_1__.tooltipPosition)(current.trigger.getBoundingClientRect(), current.tooltip.getBoundingClientRect(), current.placement, {
    height: state.window.innerHeight,
    width: state.window.innerWidth
  });
  current.tooltip.dataset.placement = position.placement;
  current.tooltip.style.left = "".concat(Math.round(position.x), "px");
  current.tooltip.style.top = "".concat(Math.round(position.y), "px");
}
function hideTooltip(state) {
  var current = state.current;
  if (!current) return false;
  state.current = null;
  restoreTrigger(current);
  current.tooltip.remove();
  dispatchTooltipEvent(current, 'tooltip:hidden');
  return true;
}
function restoreTrigger(current) {
  delete current.trigger.dataset.tooltipOpen;
  restoreAttribute(current.trigger, 'aria-describedby', current.describedBy);
  restoreAttribute(current.trigger, 'title', current.title);
}
function restoreAttribute(element, name, value) {
  if (value === null) element.removeAttribute(name);else element.setAttribute(name, value);
}
function dispatchTooltipEvent(current, name) {
  current.trigger.dispatchEvent(new current.trigger.ownerDocument.defaultView.CustomEvent(name, {
    bubbles: true,
    detail: {
      tooltip: current.tooltip,
      trigger: current.trigger
    }
  }));
}
function scanTooltips(state, container) {
  if (state.current && !state.current.trigger.isConnected) hideTooltip(state);
  return matchingTooltipCount(container);
}
function matchingTooltipCount(container) {
  var _container$querySelec, _container$querySelec2, _container$matches;
  var descendants = (_container$querySelec = (_container$querySelec2 = container.querySelectorAll) === null || _container$querySelec2 === void 0 || (_container$querySelec2 = _container$querySelec2.call(container, _tooltip_elements_js__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_TRIGGER_SELECTOR)) === null || _container$querySelec2 === void 0 ? void 0 : _container$querySelec2.length) !== null && _container$querySelec !== void 0 ? _container$querySelec : 0;
  return descendants + ((_container$matches = container.matches) !== null && _container$matches !== void 0 && _container$matches.call(container, _tooltip_elements_js__WEBPACK_IMPORTED_MODULE_0__.TOOLTIP_TRIGGER_SELECTOR) ? 1 : 0);
}
function isDisabled(trigger) {
  return trigger.hasAttribute('disabled') || trigger.getAttribute('aria-disabled') === 'true';
}
function destroyTooltips(state, listeners) {
  hideTooltip(state);
  ROOT_EVENT_NAMES.forEach(function (name) {
    return state.root.removeEventListener(name, listeners[name]);
  });
  state.window.removeEventListener('resize', listeners.reposition);
  state.window.removeEventListener('scroll', listeners.reposition, true);
}
function assertRoot(root) {
  if (typeof (root === null || root === void 0 ? void 0 : root.addEventListener) !== 'function' || !root.ownerDocument) {
    throw new TypeError('Tooltips require a DOM root.');
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
  !*** ./resources/frontend/features/tooltip/browser.js ***!
  \********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bootTooltips": () => (/* binding */ bootTooltips)
/* harmony export */ });
/* harmony import */ var _install_tooltips_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./install-tooltips.js */ "./resources/frontend/features/tooltip/install-tooltips.js");

if (globalThis.document) bootTooltips(globalThis);
function bootTooltips(target) {
  var tooltips = (0,_install_tooltips_js__WEBPACK_IMPORTED_MODULE_0__.installTooltips)(target.Admin, {
    root: target.document
  });
  target.Admin.Tooltips = tooltips;
  tooltips.scan();
}
})();

/******/ })()
;
//# sourceMappingURL=tooltip.js.map