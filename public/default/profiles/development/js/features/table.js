/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/frontend/features/table/filters/filter-elements.js":
/*!**********************************************************************!*\
  !*** ./resources/frontend/features/table/filters/filter-elements.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "forEachColumnFilter": () => (/* binding */ forEachColumnFilter),
/* harmony export */   "readControlValue": () => (/* binding */ readControlValue)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function forEachColumnFilter(root, tableId, callback) {
  assertRoot(root);
  var _iterator = _createForOfIteratorHelper(tableContainers(root, tableId)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var container = _step.value;
      var _iterator2 = _createForOfIteratorHelper(container.querySelectorAll('.column-filter[data-type]')),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var filter = _step2.value;
          var column = filter.closest('[data-index]');
          callback(filter, column === null || column === void 0 ? void 0 : column.dataset.index, filter.dataset.type);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function readControlValue(control) {
  var _control$value;
  if (control !== null && control !== void 0 && control.multiple && control.selectedOptions) {
    return _toConsumableArray(control.selectedOptions).map(function (option) {
      return option.value;
    });
  }
  return (_control$value = control === null || control === void 0 ? void 0 : control.value) !== null && _control$value !== void 0 ? _control$value : null;
}
function tableContainers(root, tableId) {
  return _toConsumableArray(root.querySelectorAll('[data-datatables-id]')).filter(function (container) {
    return container.dataset.datatablesId === String(tableId);
  });
}
function assertRoot(root) {
  if (typeof (root === null || root === void 0 ? void 0 : root.querySelectorAll) !== 'function') {
    throw new TypeError('Column filter root must support querySelectorAll().');
  }
}

/***/ }),

/***/ "./resources/frontend/features/table/hooks/table-hooks.js":
/*!****************************************************************!*\
  !*** ./resources/frontend/features/table/hooks/table-hooks.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyCreatedRowClass": () => (/* binding */ applyCreatedRowClass),
/* harmony export */   "createDrawHook": () => (/* binding */ createDrawHook)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function createDrawHook(_ref) {
  var events = _ref.events,
    highlight = _ref.highlight,
    lazyload = _ref.lazyload,
    tooltips = _ref.tooltips;
  assertHookDependencies(events, highlight, lazyload, tooltips);
  return function drawHook() {
    events.fire('datatables::draw', this);
    tooltips();
    lazyload();
    highlight(this);
  };
}
function applyCreatedRowClass(row, data) {
  var _metadata$add_class$t, _metadata$add_class;
  var metadata = Array.isArray(data) ? data.at(-1) : null;
  var classes = (_metadata$add_class$t = metadata === null || metadata === void 0 || (_metadata$add_class = metadata.add_class) === null || _metadata$add_class === void 0 ? void 0 : _metadata$add_class.trim().split(/\s+/).filter(Boolean)) !== null && _metadata$add_class$t !== void 0 ? _metadata$add_class$t : [];
  if (classes.length > 0) {
    var _row$classList;
    (_row$classList = row.classList).add.apply(_row$classList, _toConsumableArray(classes));
  }
}
function assertHookDependencies(events) {
  for (var _len = arguments.length, hooks = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    hooks[_key - 1] = arguments[_key];
  }
  if (typeof (events === null || events === void 0 ? void 0 : events.fire) !== 'function' || hooks.some(function (hook) {
    return typeof hook !== 'function';
  })) {
    throw new TypeError('Table draw hook requires an event bus and hook functions.');
  }
}

/***/ }),

/***/ "./resources/frontend/features/table/lifecycle/data-table-adapter.js":
/*!***************************************************************************!*\
  !*** ./resources/frontend/features/table/lifecycle/data-table-adapter.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DataTableAdapter": () => (/* binding */ DataTableAdapter),
/* harmony export */   "mountDataTable": () => (/* binding */ mountDataTable)
/* harmony export */ });
/* harmony import */ var _selection_selected_rows_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../selection/selected-rows.js */ "./resources/frontend/features/table/selection/selected-rows.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var DataTableAdapter = /*#__PURE__*/function () {
  function DataTableAdapter(_ref) {
    var element = _ref.element,
      engineInstance = _ref.engineInstance,
      registry = _ref.registry;
    _classCallCheck(this, DataTableAdapter);
    this.element = element;
    this.engineInstance = engineInstance;
    this.registry = registry;
  }
  return _createClass(DataTableAdapter, [{
    key: "reload",
    value: function reload() {
      return this.engineInstance.draw();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      try {
        return this.engineInstance.destroy();
      } finally {
        this.registry.unregister(this.element);
      }
    }
  }, {
    key: "clearState",
    value: function clearState() {
      return this.engineInstance.state.clear();
    }
  }, {
    key: "selectedRows",
    value: function selectedRows() {
      return (0,_selection_selected_rows_js__WEBPACK_IMPORTED_MODULE_0__.selectedRowValues)(this.element);
    }
  }]);
}();
function mountDataTable(_ref2) {
  var createEngine = _ref2.createEngine,
    element = _ref2.element,
    options = _ref2.options,
    registry = _ref2.registry;
  assertMountDependencies(createEngine, registry);
  var engineInstance = createEngine(element, options);
  var adapter = new DataTableAdapter({
    element: element,
    engineInstance: engineInstance,
    registry: registry
  });
  return registry.register(adapter);
}
function assertMountDependencies(createEngine, registry) {
  if (typeof createEngine !== 'function' || typeof (registry === null || registry === void 0 ? void 0 : registry.register) !== 'function') {
    throw new TypeError('Table mount requires an engine factory and table registry.');
  }
}

/***/ }),

/***/ "./resources/frontend/features/table/options/table-options.js":
/*!********************************************************************!*\
  !*** ./resources/frontend/features/table/options/table-options.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyServerOptions": () => (/* binding */ applyServerOptions),
/* harmony export */   "readTableDefinition": () => (/* binding */ readTableDefinition),
/* harmony export */   "tableDomLayout": () => (/* binding */ tableDomLayout)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function readTableDefinition(element) {
  assertElement(element);
  return {
    id: element.dataset.id,
    method: element.dataset.method || 'GET',
    options: parseOptions(element.dataset.attributes),
    payload: parsePayload(element.dataset.payload),
    showLength: parseFlag(element.dataset.displayDtlength),
    showSearch: parseFlag(element.dataset.displaySearch),
    url: element.dataset.url || null
  };
}
function applyServerOptions(options, definition) {
  if (!definition.url) {
    return options;
  }
  return _objectSpread(_objectSpread({}, options), {}, {
    processing: true,
    serverSide: true,
    sDom: tableDomLayout(definition)
  });
}
function tableDomLayout(_ref) {
  var showLength = _ref.showLength,
    showSearch = _ref.showSearch;
  var controls = "".concat(showLength ? 'l' : '').concat(showSearch ? 'f' : '');
  return "<\"H\"".concat(controls, "r>t<\"F\"ip>");
}
function parseOptions(source) {
  var options = parseJson(source, {});
  if (!options || Array.isArray(options) || _typeof(options) !== 'object') {
    throw new TypeError('Table data-attributes must contain a JSON object.');
  }
  return options;
}
function parsePayload(source) {
  if (source === undefined) {
    return undefined;
  }
  try {
    return JSON.parse(source);
  } catch (_unused) {
    return source;
  }
}
function parseJson(source, fallback) {
  if (source === undefined || source === '') {
    return fallback;
  }
  try {
    return JSON.parse(source);
  } catch (error) {
    throw new TypeError('Table data-attributes must contain valid JSON.', {
      cause: error
    });
  }
}
function parseFlag(value) {
  return value === '1' || value === 'true' || value === true || value === 1;
}
function assertElement(element) {
  if (!element || element.nodeType !== 1 || !element.dataset) {
    throw new TypeError('Table definition requires a DOM Element with dataset support.');
  }
}

/***/ }),

/***/ "./resources/frontend/features/table/selection/selected-rows.js":
/*!**********************************************************************!*\
  !*** ./resources/frontend/features/table/selection/selected-rows.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "selectedRowValues": () => (/* binding */ selectedRowValues)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function selectedRowValues(element) {
  if (typeof (element === null || element === void 0 ? void 0 : element.querySelectorAll) !== 'function') {
    throw new TypeError('Selected rows require a table element.');
  }
  return _toConsumableArray(element.querySelectorAll('.adminCheckboxRow:checked')).map(function (checkbox) {
    return checkbox.value;
  });
}

/***/ }),

/***/ "./resources/frontend/features/table/state/filter-state.js":
/*!*****************************************************************!*\
  !*** ./resources/frontend/features/table/state/filter-state.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clearFilterState": () => (/* binding */ clearFilterState),
/* harmony export */   "clearSavedTableSearch": () => (/* binding */ clearSavedTableSearch),
/* harmony export */   "filterStateKey": () => (/* binding */ filterStateKey),
/* harmony export */   "loadFilterState": () => (/* binding */ loadFilterState),
/* harmony export */   "saveFilterState": () => (/* binding */ saveFilterState)
/* harmony export */ });
/* harmony import */ var _filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../filters/filter-elements.js */ "./resources/frontend/features/table/filters/filter-elements.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

function filterStateKey(path) {
  var normalized = path.match(/\d+\/edit$/) ? path.replace(/\d+\/edit$/, 'edit') : path;
  return "Filters_/".concat(normalized);
}
function loadFilterState(storage, key, containers) {
  var serialized = storage.getItem(key);
  if (serialized) {
    restoreFilterState(containers, parseState(serialized));
  }
}
function saveFilterState(storage, key, containers) {
  var state = collectFilterState(containers);
  if (Object.keys(state).length === 0) {
    storage.removeItem(key);
    return;
  }
  storage.setItem(key, JSON.stringify(state));
}
function clearFilterState(storage, key) {
  storage.removeItem(key);
}
function clearSavedTableSearch(_settings, state) {
  state.search.search = '';
  var _iterator = _createForOfIteratorHelper(state.columns),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var column = _step.value;
      column.search.search = '';
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function collectFilterState(containers) {
  return Object.fromEntries(_toConsumableArray(containers).map(function (container, index) {
    return [index, collectContainerState(container)];
  }).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      state = _ref2[1];
    return Object.keys(state).length > 0;
  }));
}
function collectContainerState(container) {
  return Object.fromEntries(_toConsumableArray(container.querySelectorAll('[data-index]')).map(function (column) {
    return [column.dataset.index, collectColumnState(column)];
  }).filter(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
      state = _ref4[1];
    return state !== null;
  }));
}
function collectColumnState(column) {
  var filter = column.querySelector('.column-filter');
  var type = filter === null || filter === void 0 ? void 0 : filter.dataset.type;
  if (!filter || type === 'control') {
    return null;
  }
  var value = type === 'range' ? collectRangeState(filter) : (0,_filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_0__.readControlValue)(filter);
  return isEmptyValue(value) ? null : {
    type: type,
    val: value
  };
}
function collectRangeState(filter) {
  return Object.fromEntries(_toConsumableArray(filter.querySelectorAll('.form-control.column-filter')).map(function (control, index) {
    return [index, control.value];
  }).filter(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
      value = _ref6[1];
    return value !== '';
  }));
}
function restoreFilterState(containers, state) {
  for (var _i = 0, _Object$entries = Object.entries(state); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      containerIndex = _Object$entries$_i[0],
      columns = _Object$entries$_i[1];
    var container = containers[containerIndex];
    if (container) {
      restoreContainerState(container, columns);
    }
  }
}
function restoreContainerState(container, columns) {
  for (var _i2 = 0, _Object$entries2 = Object.entries(columns); _i2 < _Object$entries2.length; _i2++) {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
      index = _Object$entries2$_i[0],
      state = _Object$entries2$_i[1];
    var column = findColumn(container, index);
    if (state.type === 'range') {
      restoreRangeState(column, state.val);
    } else {
      setControlValue(column === null || column === void 0 ? void 0 : column.querySelector('.column-filter'), state.val);
    }
  }
}
function restoreRangeState(column, values) {
  var _column$querySelector;
  var controls = (_column$querySelector = column === null || column === void 0 ? void 0 : column.querySelectorAll('[data-type="range"] .column-filter')) !== null && _column$querySelector !== void 0 ? _column$querySelector : [];
  for (var _i3 = 0, _Object$entries3 = Object.entries(values); _i3 < _Object$entries3.length; _i3++) {
    var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
      index = _Object$entries3$_i[0],
      value = _Object$entries3$_i[1];
    setControlValue(controls[index], value);
  }
}
function findColumn(container, index) {
  return _toConsumableArray(container.querySelectorAll('[data-index]')).find(function (column) {
    return column.dataset.index === index;
  });
}
function setControlValue(control, value) {
  if (!control) {
    return;
  }
  if (control.multiple && Array.isArray(value)) {
    var _iterator2 = _createForOfIteratorHelper(control.options),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var option = _step2.value;
        option.selected = value.includes(option.value);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  } else {
    control.value = value;
  }
  control.dispatchEvent(new globalThis.Event('change', {
    bubbles: true
  }));
}
function isEmptyValue(value) {
  return value === null || value === '' || Array.isArray(value) && value.length === 0;
}
function parseState(serialized) {
  try {
    return JSON.parse(serialized);
  } catch (error) {
    throw new TypeError('Saved table filters contain invalid JSON.', {
      cause: error
    });
  }
}

/***/ }),

/***/ "./resources/frontend/features/table/transport/table-ajax.js":
/*!*******************************************************************!*\
  !*** ./resources/frontend/features/table/transport/table-ajax.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "appendNamedFilterData": () => (/* binding */ appendNamedFilterData),
/* harmony export */   "createTableAjax": () => (/* binding */ createTableAjax)
/* harmony export */ });
/* harmony import */ var _filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../filters/filter-elements.js */ "./resources/frontend/features/table/filters/filter-elements.js");

function createTableAjax(_ref) {
  var events = _ref.events,
    id = _ref.id,
    method = _ref.method,
    payload = _ref.payload,
    root = _ref.root,
    url = _ref.url;
  assertEvents(events);
  return {
    data: function data(parameters) {
      events.fire('datatables::ajax::data', parameters);
      appendNamedFilterData(parameters, root, id);
      parameters.payload = payload;
    },
    type: method,
    url: url
  };
}
function appendNamedFilterData(parameters, root, tableId) {
  (0,_filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_0__.forEachColumnFilter)(root, tableId, function (filter, index) {
    var _parameters$columns;
    var name = filter.dataset.ajaxDataName;
    var search = (_parameters$columns = parameters.columns) === null || _parameters$columns === void 0 || (_parameters$columns = _parameters$columns[index]) === null || _parameters$columns === void 0 ? void 0 : _parameters$columns.search;
    if (name && search) {
      search[name] = (0,_filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_0__.readControlValue)(filter);
    }
  });
}
function assertEvents(events) {
  if (typeof (events === null || events === void 0 ? void 0 : events.fire) !== 'function') {
    throw new TypeError('Table transport requires an event bus.');
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
  !*** ./resources/frontend/features/table/index.js ***!
  \****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DataTableAdapter": () => (/* reexport safe */ _lifecycle_data_table_adapter_js__WEBPACK_IMPORTED_MODULE_2__.DataTableAdapter),
/* harmony export */   "TABLE_FEATURE_ID": () => (/* binding */ TABLE_FEATURE_ID),
/* harmony export */   "appendNamedFilterData": () => (/* reexport safe */ _transport_table_ajax_js__WEBPACK_IMPORTED_MODULE_6__.appendNamedFilterData),
/* harmony export */   "applyCreatedRowClass": () => (/* reexport safe */ _hooks_table_hooks_js__WEBPACK_IMPORTED_MODULE_1__.applyCreatedRowClass),
/* harmony export */   "applyServerOptions": () => (/* reexport safe */ _options_table_options_js__WEBPACK_IMPORTED_MODULE_3__.applyServerOptions),
/* harmony export */   "clearFilterState": () => (/* reexport safe */ _state_filter_state_js__WEBPACK_IMPORTED_MODULE_5__.clearFilterState),
/* harmony export */   "clearSavedTableSearch": () => (/* reexport safe */ _state_filter_state_js__WEBPACK_IMPORTED_MODULE_5__.clearSavedTableSearch),
/* harmony export */   "createDrawHook": () => (/* reexport safe */ _hooks_table_hooks_js__WEBPACK_IMPORTED_MODULE_1__.createDrawHook),
/* harmony export */   "createTableAjax": () => (/* reexport safe */ _transport_table_ajax_js__WEBPACK_IMPORTED_MODULE_6__.createTableAjax),
/* harmony export */   "filterStateKey": () => (/* reexport safe */ _state_filter_state_js__WEBPACK_IMPORTED_MODULE_5__.filterStateKey),
/* harmony export */   "forEachColumnFilter": () => (/* reexport safe */ _filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_0__.forEachColumnFilter),
/* harmony export */   "loadFilterState": () => (/* reexport safe */ _state_filter_state_js__WEBPACK_IMPORTED_MODULE_5__.loadFilterState),
/* harmony export */   "mountDataTable": () => (/* reexport safe */ _lifecycle_data_table_adapter_js__WEBPACK_IMPORTED_MODULE_2__.mountDataTable),
/* harmony export */   "readControlValue": () => (/* reexport safe */ _filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_0__.readControlValue),
/* harmony export */   "readTableDefinition": () => (/* reexport safe */ _options_table_options_js__WEBPACK_IMPORTED_MODULE_3__.readTableDefinition),
/* harmony export */   "saveFilterState": () => (/* reexport safe */ _state_filter_state_js__WEBPACK_IMPORTED_MODULE_5__.saveFilterState),
/* harmony export */   "selectedRowValues": () => (/* reexport safe */ _selection_selected_rows_js__WEBPACK_IMPORTED_MODULE_4__.selectedRowValues),
/* harmony export */   "tableDomLayout": () => (/* reexport safe */ _options_table_options_js__WEBPACK_IMPORTED_MODULE_3__.tableDomLayout)
/* harmony export */ });
/* harmony import */ var _filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filters/filter-elements.js */ "./resources/frontend/features/table/filters/filter-elements.js");
/* harmony import */ var _hooks_table_hooks_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hooks/table-hooks.js */ "./resources/frontend/features/table/hooks/table-hooks.js");
/* harmony import */ var _lifecycle_data_table_adapter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lifecycle/data-table-adapter.js */ "./resources/frontend/features/table/lifecycle/data-table-adapter.js");
/* harmony import */ var _options_table_options_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./options/table-options.js */ "./resources/frontend/features/table/options/table-options.js");
/* harmony import */ var _selection_selected_rows_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./selection/selected-rows.js */ "./resources/frontend/features/table/selection/selected-rows.js");
/* harmony import */ var _state_filter_state_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./state/filter-state.js */ "./resources/frontend/features/table/state/filter-state.js");
/* harmony import */ var _transport_table_ajax_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transport/table-ajax.js */ "./resources/frontend/features/table/transport/table-ajax.js");
var TABLE_FEATURE_ID = 'table';







})();

/******/ })()
;
//# sourceMappingURL=table.js.map