/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/assets/js_owl/admin/display/themes.js":
/*!*********************************************************!*\
  !*** ./resources/assets/js_owl/admin/display/themes.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Admin.Modules.register('display.theme', function () {
  window.Cookies = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/dist/js.cookie.js");
  var theme_mode = document.querySelector('#theme-mode');
  var theme_icon = document.querySelector('#theme-icon');
  var setColorMode = function setColorMode(mode) {
    mode = mode === 'dark' ? 'dark' : 'light';
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
      document.documentElement.dataset.colorScheme = 'dark';
      theme_icon.className = 'fa-regular fa-lightbulb';
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.dataset.colorScheme = 'light';
      theme_icon.className = 'fa-solid fa-moon';
    }
    window.localStorage.setItem('theme-mode', mode);
    Cookies.set('theme-mode', mode);
    theme_mode.setAttribute('data-mode', mode);
  };
  document.querySelector('#theme-mode').addEventListener('click', function () {
    if (theme_mode.getAttribute('data-mode') === 'light') {
      setColorMode('dark');
    } else {
      setColorMode('light');
    }
  });
  setColorMode(window.localStorage.getItem('theme-mode'));
});

/***/ }),

/***/ "./resources/frontend/themes/legacy-adminlte/scroll-controls.js":
/*!**********************************************************************!*\
  !*** ./resources/frontend/themes/legacy-adminlte/scroll-controls.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "installScrollControls": () => (/* binding */ installScrollControls),
/* harmony export */   "pageMetrics": () => (/* binding */ pageMetrics)
/* harmony export */ });
var INSTALLATION = Symbol["for"]('sleepingowl.theme.legacy-adminlte.scroll-controls');
var SCROLL_END_TOLERANCE = 10;
function installScrollControls() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globalThis;
  if (target[INSTALLATION]) return target[INSTALLATION];
  var document = target.document;
  if (!document) return null;
  var scrollTop = document.getElementById('scrolltotop');
  var scrollBottom = document.getElementById('scrolltobottom');
  if (!scrollTop && !scrollBottom) return null;
  var update = function update() {
    return updateControls(target, scrollTop, scrollBottom);
  };
  var toTop = function toTop(event) {
    return scrollPage(target, event, 0);
  };
  var toBottom = function toBottom(event) {
    return scrollPage(target, event, pageMetrics(target).height);
  };
  listen(scrollTop, 'click', toTop);
  listen(scrollBottom, 'click', toBottom);
  target.addEventListener('scroll', update, {
    passive: true
  });
  var controls = createControls(target, scrollTop, scrollBottom, update, toTop, toBottom);
  target[INSTALLATION] = controls;
  update();
  return controls;
}
function pageMetrics(target) {
  var _document$documentEle;
  var document = target.document;
  var root = scrollRoot(document);
  return {
    height: Math.max(elementHeight(root), elementHeight(document.documentElement), elementHeight(document.body)),
    top: root ? root.scrollTop : target.pageYOffset || 0,
    viewport: firstPositive(target.innerHeight, root === null || root === void 0 ? void 0 : root.clientHeight, (_document$documentEle = document.documentElement) === null || _document$documentEle === void 0 ? void 0 : _document$documentEle.clientHeight)
  };
}
function updateControls(target, scrollTop, scrollBottom) {
  var metrics = pageMetrics(target);
  toggleClass(scrollTop, 'show', metrics.top > metrics.viewport);
  toggleClass(scrollBottom, 'hide', metrics.top + metrics.viewport + SCROLL_END_TOLERANCE >= metrics.height);
}
function scrollPage(target, event, top) {
  event === null || event === void 0 || event.preventDefault();
  if (typeof target.scrollTo === 'function') {
    target.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: top
    });
    return;
  }
  var root = scrollRoot(target.document);
  if (root) root.scrollTop = top;
}
function createControls(target, scrollTop, scrollBottom, update, toTop, toBottom) {
  return {
    update: update,
    destroy: function destroy() {
      unlisten(scrollTop, 'click', toTop);
      unlisten(scrollBottom, 'click', toBottom);
      target.removeEventListener('scroll', update);
      delete target[INSTALLATION];
    }
  };
}
function scrollRoot(document) {
  return document.scrollingElement || document.documentElement || document.body;
}
function elementHeight(element) {
  return element ? element.scrollHeight : 0;
}
function firstPositive() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }
  return values.find(function (value) {
    return value > 0;
  }) || 0;
}
function toggleClass(element, name, enabled) {
  if (element) element.classList.toggle(name, enabled);
}
function listen(element, type, listener) {
  if (element) element.addEventListener(type, listener);
}
function unlisten(element, type, listener) {
  if (element) element.removeEventListener(type, listener);
}

/***/ }),

/***/ "./node_modules/js-cookie/dist/js.cookie.js":
/*!**************************************************!*\
  !*** ./node_modules/js-cookie/dist/js.cookie.js ***!
  \**************************************************/
/***/ (function(module) {

/*! js-cookie v3.0.7 | MIT */
;
(function (global, factory) {
   true ? module.exports = factory() :
  0;
})(this, (function () { 'use strict';

  function assign (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (key === '__proto__') continue
        target[key] = source[key];
      }
    }
    return target
  }

  var defaultConverter = {
    read: function (value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    },
    write: function (value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      )
    }
  };

  function init(converter, defaultAttributes) {
    function set(name, value, attributes) {
      if (typeof document === 'undefined') {
        return
      }

      attributes = assign({}, defaultAttributes, attributes);

      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }

      name = encodeURIComponent(name)
        .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
        .replace(/[()]/g, escape);

      var stringifiedAttributes = '';
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue
        }

        stringifiedAttributes += '; ' + attributeName;

        if (attributes[attributeName] === true) {
          continue
        }

        // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...
        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
      }

      return (document.cookie =
        name + '=' + converter.write(value, name) + stringifiedAttributes)
    }

    function get(name) {
      if (typeof document === 'undefined' || (arguments.length && !name)) {
        return
      }

      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all.
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var value = parts.slice(1).join('=');

        try {
          var found = decodeURIComponent(parts[0]);
          if (!(found in jar)) jar[found] = converter.read(value, found);
          if (name === found) {
            break
          }
        } catch {
          // Do nothing...
        }
      }

      return name ? jar[name] : jar
    }

    return Object.create(
      {
        set,
        get,
        remove: function (name, attributes) {
          set(
            name,
            '',
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function (attributes) {
          return init(this.converter, assign({}, this.attributes, attributes))
        },
        withConverter: function (converter) {
          return init(assign({}, this.converter, converter), this.attributes)
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    )
  }

  var api = init(defaultConverter, { path: '/' });

  return api;

}));


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************************************!*\
  !*** ./resources/frontend/themes/legacy-adminlte/index.js ***!
  \************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "THEME_ID": () => (/* binding */ THEME_ID)
/* harmony export */ });
/* harmony import */ var _assets_js_owl_admin_display_themes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../assets/js_owl/admin/display/themes */ "./resources/assets/js_owl/admin/display/themes.js");
/* harmony import */ var _assets_js_owl_admin_display_themes__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_js_owl_admin_display_themes__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _scroll_controls_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scroll-controls.js */ "./resources/frontend/themes/legacy-adminlte/scroll-controls.js");


if (globalThis.document) (0,_scroll_controls_js__WEBPACK_IMPORTED_MODULE_1__.installScrollControls)(globalThis);
var THEME_ID = 'legacy-adminlte';
})();

/******/ })()
;
//# sourceMappingURL=legacy-adminlte.js.map