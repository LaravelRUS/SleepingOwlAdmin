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

/***/ "./resources/frontend/features/forms/date/date-format.js":
/*!***************************************************************!*\
  !*** ./resources/frontend/features/forms/date/date-format.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "formatDateValue": () => (/* binding */ formatDateValue),
/* harmony export */   "parseDateValue": () => (/* binding */ parseDateValue),
/* harmony export */   "toAirDateFormat": () => (/* binding */ toAirDateFormat)
/* harmony export */ });
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var FORMAT_TOKENS = /\[[^\]]*]|YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|A|a|./g;
var AIR_FORMAT_TOKENS = Object.freeze({
  D: 'd',
  DD: 'dd',
  M: 'M',
  MM: 'MM',
  MMM: 'MMM',
  MMMM: 'MMMM',
  YY: 'yy',
  YYYY: 'yyyy'
});
var DATE_PART_READERS = Object.freeze({
  D: ['day', numberValue],
  DD: ['day', numberValue],
  H: ['hour', numberValue],
  HH: ['hour', numberValue],
  h: ['hour', numberValue],
  hh: ['hour', numberValue],
  M: ['month', numberValue],
  MM: ['month', numberValue],
  MMM: ['month', function (value, locale) {
    return namedMonth(value, locale.monthsShort);
  }],
  MMMM: ['month', function (value, locale) {
    return namedMonth(value, locale.months);
  }],
  m: ['minute', numberValue],
  mm: ['minute', numberValue],
  s: ['second', numberValue],
  ss: ['second', numberValue],
  YY: ['year', function (value) {
    return 2000 + Number(value);
  }],
  YYYY: ['year', numberValue]
});
function formatDateValue(date, format) {
  var locale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!isValidDate(date)) return '';
  var values = dateTokenValues(date, locale);
  return tokenize(format).map(function (token) {
    var _values$token;
    return (_values$token = values[token]) !== null && _values$token !== void 0 ? _values$token : literalValue(token);
  }).join('');
}
function parseDateValue(value, format) {
  var locale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var input = String(value !== null && value !== void 0 ? value : '').trim();
  if (!input) return null;
  var parsed = parseFormattedDate(input, format, locale);
  if (parsed) return parsed;
  return parseIsoDate(input);
}
function toAirDateFormat(format) {
  return tokenize(format).map(function (token) {
    var _AIR_FORMAT_TOKENS$to;
    return (_AIR_FORMAT_TOKENS$to = AIR_FORMAT_TOKENS[token]) !== null && _AIR_FORMAT_TOKENS$to !== void 0 ? _AIR_FORMAT_TOKENS$to : literalValue(token);
  }).join('');
}
function parseFormattedDate(value, format, locale) {
  var captures = [];
  var source = tokenize(format).map(function (token) {
    return tokenPattern(token, captures, locale);
  }).join('');
  var match = new RegExp("^".concat(source, "$"), 'iu').exec(value);
  if (!match) return null;
  return dateFromCaptures(captures, match.slice(1), locale);
}
function tokenPattern(token, captures, locale) {
  var patterns = {
    A: '(AM|PM)',
    a: '(am|pm)',
    D: '(\\d{1,2})',
    DD: '(\\d{2})',
    H: '(\\d{1,2})',
    HH: '(\\d{2})',
    h: '(\\d{1,2})',
    hh: '(\\d{2})',
    M: '(\\d{1,2})',
    MM: '(\\d{2})',
    MMM: namedMonthPattern(locale.monthsShort),
    MMMM: namedMonthPattern(locale.months),
    m: '(\\d{1,2})',
    mm: '(\\d{2})',
    s: '(\\d{1,2})',
    ss: '(\\d{2})',
    YY: '(\\d{2})',
    YYYY: '(\\d{4})'
  };
  if (!patterns[token]) return escapeRegExp(literalValue(token));
  captures.push(token);
  return patterns[token];
}
function dateFromCaptures(tokens, values, locale) {
  var now = new Date();
  var parts = {
    day: 1,
    hour: 0,
    minute: 0,
    month: 1,
    second: 0,
    year: now.getFullYear()
  };
  var period = null;
  tokens.forEach(function (token, index) {
    var value = values[index];
    if (token === 'A' || token === 'a') period = value.toLowerCase();else assignDatePart(parts, token, value, locale);
  });
  parts.hour = normalizeTwelveHour(parts.hour, period);
  var date = new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return matchesParts(date, parts) ? date : null;
}
function assignDatePart(parts, token, value, locale) {
  var _DATE_PART_READERS$to = _slicedToArray(DATE_PART_READERS[token], 2),
    field = _DATE_PART_READERS$to[0],
    read = _DATE_PART_READERS$to[1];
  parts[field] = read(value, locale);
}
function dateTokenValues(date, locale) {
  var _locale$monthsShort$d, _locale$monthsShort, _locale$months$date$g, _locale$months;
  var hour = date.getHours();
  var hour12 = hour % 12 || 12;
  return {
    A: hour >= 12 ? 'PM' : 'AM',
    a: hour >= 12 ? 'pm' : 'am',
    D: String(date.getDate()),
    DD: pad(date.getDate()),
    H: String(hour),
    HH: pad(hour),
    h: String(hour12),
    hh: pad(hour12),
    M: String(date.getMonth() + 1),
    MM: pad(date.getMonth() + 1),
    MMM: (_locale$monthsShort$d = (_locale$monthsShort = locale.monthsShort) === null || _locale$monthsShort === void 0 ? void 0 : _locale$monthsShort[date.getMonth()]) !== null && _locale$monthsShort$d !== void 0 ? _locale$monthsShort$d : pad(date.getMonth() + 1),
    MMMM: (_locale$months$date$g = (_locale$months = locale.months) === null || _locale$months === void 0 ? void 0 : _locale$months[date.getMonth()]) !== null && _locale$months$date$g !== void 0 ? _locale$months$date$g : pad(date.getMonth() + 1),
    m: String(date.getMinutes()),
    mm: pad(date.getMinutes()),
    s: String(date.getSeconds()),
    ss: pad(date.getSeconds()),
    YY: String(date.getFullYear()).slice(-2),
    YYYY: String(date.getFullYear())
  };
}
function matchesParts(date, parts) {
  return isValidDate(date) && date.getFullYear() === parts.year && date.getMonth() === parts.month - 1 && date.getDate() === parts.day && date.getHours() === parts.hour && date.getMinutes() === parts.minute && date.getSeconds() === parts.second;
}
function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}(?:[T ][0-2]\d:[0-5]\d(?::[0-5]\d)?)?$/.test(value)) return null;
  var date = new Date(value.replace(' ', 'T'));
  return isValidDate(date) ? date : null;
}
function namedMonthPattern() {
  var months = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return months.length ? "(".concat(months.map(escapeRegExp).join('|'), ")") : '([^\\d]+)';
}
function namedMonth(value) {
  var months = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return months.findIndex(function (month) {
    return month.toLocaleLowerCase() === value.toLocaleLowerCase();
  }) + 1;
}
function numberValue(value) {
  return Number(value);
}
function normalizeTwelveHour(hour, period) {
  if (!period) return hour;
  if (hour < 1 || hour > 12) return -1;
  if (period === 'am') return hour === 12 ? 0 : hour;
  return hour === 12 ? 12 : hour + 12;
}
function tokenize(format) {
  var _String$match;
  return (_String$match = String(format !== null && format !== void 0 ? format : '').match(FORMAT_TOKENS)) !== null && _String$match !== void 0 ? _String$match : [];
}
function literalValue(token) {
  return token.startsWith('[') && token.endsWith(']') ? token.slice(1, -1) : token;
}
function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function pad(value) {
  return String(value).padStart(2, '0');
}
function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

/***/ }),

/***/ "./resources/frontend/features/table/actions/action-context.js":
/*!*********************************************************************!*\
  !*** ./resources/frontend/features/table/actions/action-context.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "actionCallbackContext": () => (/* binding */ actionCallbackContext),
/* harmony export */   "appendSelectedRows": () => (/* binding */ appendSelectedRows),
/* harmony export */   "findActionTable": () => (/* binding */ findActionTable),
/* harmony export */   "formParameters": () => (/* binding */ formParameters),
/* harmony export */   "selectedRowParameters": () => (/* binding */ selectedRowParameters),
/* harmony export */   "selectedRows": () => (/* binding */ selectedRows)
/* harmony export */ });
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function findActionTable(form, tables) {
  var _find;
  var document = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : globalThis.document;
  var scope = form.closest('.card') || document;
  return (_find = _toConsumableArray(scope.querySelectorAll('table.datatables')).find(function (table) {
    return tables.has(table);
  })) !== null && _find !== void 0 ? _find : null;
}
function selectedRows(tables, table) {
  return table ? tables.selectedRows(table) : [];
}
function selectedRowParameters(tables, table) {
  var parameters = new globalThis.URLSearchParams();
  selectedRows(tables, table).forEach(function (value) {
    return parameters.append('_id[]', value);
  });
  return parameters;
}
function formParameters(form) {
  var FormData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : globalThis.FormData;
  var parameters = new globalThis.URLSearchParams();
  var _iterator = _createForOfIteratorHelper(new FormData(form)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        name = _step$value[0],
        value = _step$value[1];
      if (typeof value === 'string') {
        parameters.append(name, value);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return parameters;
}
function appendSelectedRows(parameters, tables, table) {
  selectedRows(tables, table).forEach(function (value) {
    return parameters.append('_id[]', value);
  });
  return parameters;
}
function actionCallbackContext(form, table) {
  var _table$closest;
  var select = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var wrapper = (_table$closest = table === null || table === void 0 ? void 0 : table.closest('.dataTables_wrapper')) !== null && _table$closest !== void 0 ? _table$closest : form.closest('.card');
  var checkboxes = wrapper ? _toConsumableArray(wrapper.querySelectorAll('.adminCheckboxRow:checked')) : [];
  return {
    checkboxes: checkboxes,
    form: form,
    select: select,
    table: table,
    wrapper: wrapper
  };
}

/***/ }),

/***/ "./resources/frontend/features/table/actions/action-request.js":
/*!*********************************************************************!*\
  !*** ./resources/frontend/features/table/actions/action-request.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "actionRequestSettings": () => (/* binding */ actionRequestSettings),
/* harmony export */   "executeTableAction": () => (/* binding */ executeTableAction)
/* harmony export */ });
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var SAFE_METHODS = new Set(['GET', 'HEAD']);
function executeTableAction(_x) {
  return _executeTableAction.apply(this, arguments);
}
function _executeTableAction() {
  _executeTableAction = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(_ref) {
    var callbacks, events, form, http, notify, reload, settings, _ref$showResult, showResult, _ref$timeout, timeout, message, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          callbacks = _ref.callbacks, events = _ref.events, form = _ref.form, http = _ref.http, notify = _ref.notify, reload = _ref.reload, settings = _ref.settings, _ref$showResult = _ref.showResult, showResult = _ref$showResult === void 0 ? true : _ref$showResult, _ref$timeout = _ref.timeout, timeout = _ref$timeout === void 0 ? 5000 : _ref$timeout;
          events.fire('datatables::actions::submitting', settings);
          _context.p = 1;
          _context.n = 2;
          return requestJson(http, settings);
        case 2:
          message = _context.v;
          showActionResult(message, notify, showResult, timeout);
          callbacks(message);
          events.fire('datatables::actions::submitted', form);
          reload();
          return _context.a(2, message);
        case 3:
          _context.p = 3;
          _t = _context.v;
          events.fire('datatables::actions::failed', _t, form);
          throw _t;
        case 4:
          return _context.a(2);
      }
    }, _callee, null, [[1, 3]]);
  }));
  return _executeTableAction.apply(this, arguments);
}
function actionRequestSettings(url, method, parameters) {
  return {
    data: parameters.toString(),
    dataType: 'json',
    type: method || 'POST',
    url: url
  };
}
function requestJson(http, settings) {
  var method = String(settings.type || 'POST').toUpperCase();
  var options = {
    method: method
  };
  var url = settings.url;
  if (SAFE_METHODS.has(method)) {
    url = appendQuery(url, settings.data);
  } else {
    options.body = settings.data;
    options.headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    };
  }
  return http.request(url, options).then(function (response) {
    return response.json();
  });
}
function showActionResult(message, notify, enabled, timeout) {
  if (!enabled || !Object.hasOwn(message, 'text')) {
    return;
  }
  notify({
    icon: message.type,
    text: message.message,
    timer: timeout,
    title: message.text
  });
}
function appendQuery(url, query) {
  if (!query) {
    return url;
  }
  return "".concat(url).concat(url.includes('?') ? '&' : '?').concat(query);
}

/***/ }),

/***/ "./resources/frontend/features/table/actions/bulk-actions.js":
/*!*******************************************************************!*\
  !*** ./resources/frontend/features/table/actions/bulk-actions.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bindBulkActions": () => (/* binding */ bindBulkActions)
/* harmony export */ });
/* harmony import */ var _core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/dom/listeners.js */ "./resources/frontend/core/dom/listeners.js");
/* harmony import */ var _action_context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action-context.js */ "./resources/frontend/features/table/actions/action-context.js");
/* harmony import */ var _action_request_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action-request.js */ "./resources/frontend/features/table/actions/action-request.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }



function bindBulkActions(dependencies) {
  assertDependencies(dependencies);
  return (0,_core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__.delegate)(dependencies.root, 'submit', 'form[data-type="display-actions"]', function (event, form) {
    event.preventDefault();
    void submitBulkAction(form, dependencies)["catch"](function (error) {
      return reportActionError(error, dependencies);
    });
  });
}
function submitBulkAction(_x, _x2) {
  return _submitBulkAction.apply(this, arguments);
}
function _submitBulkAction() {
  _submitBulkAction = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(form, dependencies) {
    var table, select, option, confirmation;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          table = (0,_action_context_js__WEBPACK_IMPORTED_MODULE_1__.findActionTable)(form, dependencies.tables);
          select = form.querySelector('.sleepingOwlActionsStore');
          option = select === null || select === void 0 ? void 0 : select.selectedOptions[0];
          if (!(!option || option.value === '0')) {
            _context.n = 1;
            break;
          }
          showSelectionError(dependencies, 'lang.table.no-action', 'lang.select.nothing');
          return _context.a(2);
        case 1:
          if (!((0,_action_context_js__WEBPACK_IMPORTED_MODULE_1__.selectedRows)(dependencies.tables, table).length === 0)) {
            _context.n = 2;
            break;
          }
          showSelectionError(dependencies, 'lang.select.nothing', 'lang.select.no_items');
          return _context.a(2);
        case 2:
          _context.n = 3;
          return dependencies.messages.confirm(dependencies.translate('lang.table.action-confirm'), null, form);
        case 3:
          confirmation = _context.v;
          if (confirmation !== null && confirmation !== void 0 && confirmation.value) {
            _context.n = 4;
            break;
          }
          dependencies.events.fire('datatables::actions::cancel', form);
          return _context.a(2);
        case 4:
          _context.n = 5;
          return runBulkAction(form, table, select, option, dependencies);
        case 5:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _submitBulkAction.apply(this, arguments);
}
function runBulkAction(form, table, select, option, dependencies) {
  var settings = (0,_action_request_js__WEBPACK_IMPORTED_MODULE_2__.actionRequestSettings)(option.value, option.dataset.method, (0,_action_context_js__WEBPACK_IMPORTED_MODULE_1__.selectedRowParameters)(dependencies.tables, table));
  var context = (0,_action_context_js__WEBPACK_IMPORTED_MODULE_1__.actionCallbackContext)(form, table, select);
  return (0,_action_request_js__WEBPACK_IMPORTED_MODULE_2__.executeTableAction)({
    callbacks: function callbacks(message) {
      return dependencies.callbacks.bulk(message, context);
    },
    events: dependencies.events,
    form: form,
    http: dependencies.http,
    notify: dependencies.notify,
    reload: function reload() {
      return dependencies.tables.reload(table);
    },
    settings: settings
  }).then(function (message) {
    return redirect(message, dependencies.location);
  });
}
function showSelectionError(dependencies, title, text) {
  dependencies.notify({
    icon: 'error',
    text: dependencies.translate(text),
    timer: 5000,
    title: dependencies.translate(title)
  });
}
function redirect(message, location) {
  if (message.__redirect) {
    location.href = message.__redirect;
  }
}
function reportActionError(error, dependencies) {
  dependencies.messages.error(dependencies.translate('lang.table.error'), error.message);
}
function assertDependencies(dependencies) {
  var required = ['callbacks', 'events', 'http', 'location', 'messages', 'notify', 'root', 'tables'];
  if (required.some(function (name) {
    return !dependencies[name];
  })) {
    throw new TypeError('Bulk actions require table, HTTP, event and UI dependencies.');
  }
  if (typeof dependencies.translate !== 'function') {
    throw new TypeError('Bulk actions require a translator.');
  }
}

/***/ }),

/***/ "./resources/frontend/features/table/actions/form-actions.js":
/*!*******************************************************************!*\
  !*** ./resources/frontend/features/table/actions/form-actions.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bindFormActions": () => (/* binding */ bindFormActions)
/* harmony export */ });
/* harmony import */ var _core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/dom/listeners.js */ "./resources/frontend/core/dom/listeners.js");
/* harmony import */ var _action_context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action-context.js */ "./resources/frontend/features/table/actions/action-context.js");
/* harmony import */ var _action_request_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action-request.js */ "./resources/frontend/features/table/actions/action-request.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }



function bindFormActions(dependencies) {
  assertDependencies(dependencies);
  return (0,_core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__.delegate)(dependencies.root, 'submit', '.display-actions-form-wrapper form', function (event, form) {
    event.preventDefault();
    void submitFormAction(form, dependencies)["catch"](function (error) {
      return reportActionError(error, dependencies);
    });
  });
}
function submitFormAction(_x, _x2) {
  return _submitFormAction.apply(this, arguments);
}
function _submitFormAction() {
  _submitFormAction = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(form, dependencies) {
    var confirmation;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!readFlag(form, 'confirm', true)) {
            _context.n = 2;
            break;
          }
          _context.n = 1;
          return dependencies.messages.confirm(dependencies.translate('lang.table.action-confirm'), null, form);
        case 1:
          confirmation = _context.v;
          if (confirmation !== null && confirmation !== void 0 && confirmation.value) {
            _context.n = 2;
            break;
          }
          dependencies.events.fire('datatables::actions::cancel', form);
          return _context.a(2);
        case 2:
          _context.n = 3;
          return runFormAction(form, dependencies);
        case 3:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _submitFormAction.apply(this, arguments);
}
function runFormAction(form, dependencies) {
  var table = (0,_action_context_js__WEBPACK_IMPORTED_MODULE_1__.findActionTable)(form, dependencies.tables);
  var parameters = (0,_action_context_js__WEBPACK_IMPORTED_MODULE_1__.appendSelectedRows)((0,_action_context_js__WEBPACK_IMPORTED_MODULE_1__.formParameters)(form, dependencies.FormData), dependencies.tables, table);
  var settings = (0,_action_request_js__WEBPACK_IMPORTED_MODULE_2__.actionRequestSettings)(form.getAttribute('action'), form.getAttribute('method'), parameters);
  var context = (0,_action_context_js__WEBPACK_IMPORTED_MODULE_1__.actionCallbackContext)(form, table);
  return (0,_action_request_js__WEBPACK_IMPORTED_MODULE_2__.executeTableAction)({
    callbacks: function callbacks(message) {
      return dependencies.callbacks.form(message, context);
    },
    events: dependencies.events,
    form: form,
    http: dependencies.http,
    notify: dependencies.notify,
    reload: function reload() {
      return dependencies.tables.reload(table);
    },
    settings: settings,
    showResult: readFlag(form, 'result', true),
    timeout: readTimeout(form)
  });
}
function readFlag(form, name, fallback) {
  var value = form.dataset[name];
  return value === undefined ? fallback : !['0', 'false'].includes(value.toLowerCase());
}
function readTimeout(form) {
  var timeout = Number(form.dataset.resultTimeout);
  return Number.isFinite(timeout) && timeout >= 0 ? timeout : 5000;
}
function reportActionError(error, dependencies) {
  dependencies.messages.error(dependencies.translate('lang.table.error'), error.message);
}
function assertDependencies(dependencies) {
  var required = ['callbacks', 'events', 'FormData', 'http', 'messages', 'notify', 'root', 'tables'];
  if (required.some(function (name) {
    return !dependencies[name];
  })) {
    throw new TypeError('Form actions require table, HTTP, event and UI dependencies.');
  }
  if (typeof dependencies.translate !== 'function') {
    throw new TypeError('Form actions require a translator.');
  }
}

/***/ }),

/***/ "./resources/frontend/features/table/autoupdate/table-auto-update.js":
/*!***************************************************************************!*\
  !*** ./resources/frontend/features/table/autoupdate/table-auto-update.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AUTO_UPDATE_COLOR_PROPERTY": () => (/* binding */ AUTO_UPDATE_COLOR_PROPERTY),
/* harmony export */   "mountTableAutoUpdate": () => (/* binding */ mountTableAutoUpdate),
/* harmony export */   "mountTableAutoUpdates": () => (/* binding */ mountTableAutoUpdates),
/* harmony export */   "readAutoUpdateConfig": () => (/* binding */ readAutoUpdateConfig)
/* harmony export */ });
var AUTO_UPDATE_COLOR_PROPERTY = '--soa-datatables-autoupdate-color';
function mountTableAutoUpdates(host, dependencies) {
  assertTableCollection(dependencies.tables);
  var config = readAutoUpdateConfig(host);
  var controllers = matchingTables(dependencies.tables, config.tableClass).map(function (table) {
    return mountTableAutoUpdate(table, config, dependencies);
  });
  return {
    destroy: function destroy() {
      controllers.forEach(function (controller) {
        return controller.destroy();
      });
    }
  };
}
function mountTableAutoUpdate(table, config, dependencies) {
  assertDependencies(dependencies);
  var close = createCloseControl(table.ownerDocument, config.closeLabel);
  var bar = createProgressBar(table, config, dependencies.ProgressBar);
  var timer = null;
  var stopped = false;
  table.classList.add('autoupdater');
  table.style.setProperty(AUTO_UPDATE_COLOR_PROPERTY, config.color);
  table.appendChild(close);
  var schedule = function schedule() {
    bar.animate(1);
    timer = dependencies.scheduler.setTimeout(refresh, config.interval);
  };
  var refresh = function refresh() {
    bar.set(0);
    if (stopped) return;
    dependencies.tables.reload(table);
    schedule();
  };
  var _destroy = function destroy() {
    var _bar$destroy;
    if (stopped) return;
    stopped = true;
    dependencies.scheduler.clearTimeout(timer);
    close.removeEventListener('click', _destroy);
    close.remove();
    bar.set(0);
    (_bar$destroy = bar.destroy) === null || _bar$destroy === void 0 || _bar$destroy.call(bar);
    table.classList.remove('autoupdater');
    table.style.removeProperty(AUTO_UPDATE_COLOR_PROPERTY);
  };
  close.addEventListener('click', _destroy);
  schedule();
  return {
    destroy: _destroy
  };
}
function readAutoUpdateConfig(host) {
  var interval = Number(host.dataset.interval);
  var color = host.style.getPropertyValue(AUTO_UPDATE_COLOR_PROPERTY).trim();
  if (!Number.isFinite(interval) || interval < 1) {
    throw new TypeError('Table auto-update interval must be a positive number.');
  }
  if (!color) {
    throw new TypeError('Table auto-update requires a configured color.');
  }
  return {
    closeLabel: host.dataset.closeLabel || 'Stop auto-update',
    color: color,
    interval: interval,
    tableClass: host.dataset.tableClass || null
  };
}
function matchingTables(tables, tableClass) {
  return tables.all().map(function (adapter) {
    return adapter.element;
  }).filter(function (table) {
    return !tableClass || table.classList.contains(tableClass);
  });
}
function createCloseControl(document, label) {
  var control = document.createElement('button');
  control.className = 'autoupdater-close';
  control.type = 'button';
  control.setAttribute('aria-label', label);
  control.textContent = "\xD7";
  return control;
}
function createProgressBar(table, config, ProgressBar) {
  return new ProgressBar.Line(table, {
    color: "var(".concat(AUTO_UPDATE_COLOR_PROPERTY, ")"),
    duration: config.interval,
    strokeWidth: 2,
    svgStyle: null
  });
}
function assertDependencies(_ref) {
  var ProgressBar = _ref.ProgressBar,
    scheduler = _ref.scheduler,
    tables = _ref.tables;
  if (typeof (ProgressBar === null || ProgressBar === void 0 ? void 0 : ProgressBar.Line) !== 'function') {
    throw new TypeError('Table auto-update requires ProgressBar.Line.');
  }
  assertScheduler(scheduler);
  if (typeof (tables === null || tables === void 0 ? void 0 : tables.reload) !== 'function') {
    throw new TypeError('Table auto-update requires the Admin.Tables registry.');
  }
}
function assertScheduler(scheduler) {
  if (typeof (scheduler === null || scheduler === void 0 ? void 0 : scheduler.setTimeout) !== 'function' || typeof (scheduler === null || scheduler === void 0 ? void 0 : scheduler.clearTimeout) !== 'function') {
    throw new TypeError('Table auto-update requires timer functions.');
  }
}
function assertTableCollection(tables) {
  if (typeof (tables === null || tables === void 0 ? void 0 : tables.all) !== 'function') {
    throw new TypeError('Table auto-update requires the Admin.Tables collection.');
  }
}

/***/ }),

/***/ "./resources/frontend/features/table/controls/confirm-submit.js":
/*!**********************************************************************!*\
  !*** ./resources/frontend/features/table/controls/confirm-submit.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bindConfirmedControls": () => (/* binding */ bindConfirmedControls)
/* harmony export */ });
/* harmony import */ var _core_dom_forms_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/dom/forms.js */ "./resources/frontend/core/dom/forms.js");
/* harmony import */ var _core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/dom/listeners.js */ "./resources/frontend/core/dom/listeners.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }


function bindConfirmedControls(_ref) {
  var containerSelector = _ref.containerSelector,
    events = _ref.events,
    messages = _ref.messages,
    questions = _ref.questions,
    root = _ref.root;
  assertDependencies({
    events: events,
    messages: messages,
    questions: questions
  });
  return (0,_core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_1__.delegate)(root, 'click', controlSelector(containerSelector), function (event, button) {
    void confirmControlSubmission(event, button, {
      events: events,
      messages: messages,
      questions: questions
    });
  });
}
function confirmControlSubmission(_x, _x2, _x3) {
  return _confirmControlSubmission.apply(this, arguments);
}
function _confirmControlSubmission() {
  _confirmControlSubmission = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(event, button, dependencies) {
    var control, form, result;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          event.preventDefault();
          control = controlAction(button, dependencies.questions);
          form = button.closest('form');
          if (form) {
            _context.n = 1;
            break;
          }
          throw new Error('Confirmed control button must belong to a form.');
        case 1:
          _context.n = 2;
          return dependencies.messages.confirm(control.question, null, button);
        case 2:
          result = _context.v;
          if (result !== null && result !== void 0 && result.value) {
            _context.n = 3;
            break;
          }
          dependencies.events.fire('datatables::confirm::cancel', form, control.selector);
          return _context.a(2);
        case 3:
          dependencies.events.fire('datatables::confirm::submitting', form, control.selector);
          (0,_core_dom_forms_js__WEBPACK_IMPORTED_MODULE_0__.submitForm)(form);
          dependencies.events.fire('datatables::confirm::submitted', form, control.selector);
        case 4:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _confirmControlSubmission.apply(this, arguments);
}
function controlAction(button, questions) {
  if (button.classList.contains('btn-destroy')) {
    return {
      question: questions.destroy,
      selector: 'button.btn-destroy'
    };
  }
  return {
    question: questions["delete"],
    selector: 'button.btn-delete'
  };
}
function controlSelector(containerSelector) {
  if (typeof containerSelector !== 'string' || containerSelector.length === 0) {
    throw new TypeError('Confirmed controls require a container selector.');
  }
  return ["".concat(containerSelector, " button.btn-delete"), "".concat(containerSelector, " button.btn-destroy")].join(', ');
}
function assertDependencies(_ref2) {
  var events = _ref2.events,
    messages = _ref2.messages,
    questions = _ref2.questions;
  assertFunction(events === null || events === void 0 ? void 0 : events.fire, 'Confirmed controls require an event bus.');
  assertFunction(messages === null || messages === void 0 ? void 0 : messages.confirm, 'Confirmed controls require a confirmation service.');
  assertQuestion(questions === null || questions === void 0 ? void 0 : questions["delete"], 'delete');
  assertQuestion(questions === null || questions === void 0 ? void 0 : questions.destroy, 'destroy');
}
function assertFunction(value, message) {
  if (typeof value !== 'function') {
    throw new TypeError(message);
  }
}
function assertQuestion(value, action) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError("Confirmed controls require a ".concat(action, " question."));
  }
}

/***/ }),

/***/ "./resources/frontend/features/table/filters/date-filter-support.js":
/*!**************************************************************************!*\
  !*** ./resources/frontend/features/table/filters/date-filter-support.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createDateFilterSupport": () => (/* binding */ createDateFilterSupport)
/* harmony export */ });
/* harmony import */ var _forms_date_date_format_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../forms/date/date-format.js */ "./resources/frontend/features/forms/date/date-format.js");

function createDateFilterSupport() {
  var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.freeze({
    bindDateChange: function bindDateChange() {},
    bindSyntheticChange: function bindSyntheticChange() {},
    parseDate: function parseDate(value, format) {
      return (0,_forms_date_date_format_js__WEBPACK_IMPORTED_MODULE_0__.parseDateValue)(value, format, locale);
    }
  });
}

/***/ }),

/***/ "./resources/frontend/features/table/filters/filter-controls.js":
/*!**********************************************************************!*\
  !*** ./resources/frontend/features/table/filters/filter-controls.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bindFilterControls": () => (/* binding */ bindFilterControls),
/* harmony export */   "clearFilterControls": () => (/* binding */ clearFilterControls)
/* harmony export */ });
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function bindFilterControls(container, _ref) {
  var clear = _ref.clear,
    execute = _ref.execute,
    reload = _ref.reload;
  assertCallbacks(clear, execute, reload);
  bindClick(container, '#filters-exec', execute);
  bindClick(container, '#filters-cancel', clear);
  var _iterator = _createForOfIteratorHelper(container.querySelectorAll('[data-index] input')),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var input = _step.value;
      input.addEventListener('keyup', function (event) {
        if (isEnter(event)) reload();
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function clearFilterControls(containers) {
  var _iterator2 = _createForOfIteratorHelper(containers),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var container = _step2.value;
      var _iterator3 = _createForOfIteratorHelper(container.querySelectorAll('[data-index] input, [data-index] select')),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var control = _step3.value;
          resetControl(control);
          dispatchChange(control);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
function bindClick(container, selector, listener) {
  var _iterator4 = _createForOfIteratorHelper(container.querySelectorAll(selector)),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var control = _step4.value;
      control.addEventListener('click', listener);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
}
function resetControl(control) {
  if (control.options) {
    var _iterator5 = _createForOfIteratorHelper(control.options),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var option = _step5.value;
        option.selected = false;
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    control.selectedIndex = -1;
  } else {
    control.value = '';
  }
}
function dispatchChange(control) {
  var _control$ownerDocumen, _control$ownerDocumen2;
  var EventConstructor = (_control$ownerDocumen = (_control$ownerDocumen2 = control.ownerDocument) === null || _control$ownerDocumen2 === void 0 || (_control$ownerDocumen2 = _control$ownerDocumen2.defaultView) === null || _control$ownerDocumen2 === void 0 ? void 0 : _control$ownerDocumen2.Event) !== null && _control$ownerDocumen !== void 0 ? _control$ownerDocumen : globalThis.Event;
  control.dispatchEvent(new EventConstructor('change', {
    bubbles: true
  }));
}
function isEnter(event) {
  return event.key === 'Enter' || event.keyCode === 13;
}
function assertCallbacks(clear, execute, reload) {
  if (![clear, execute, reload].every(function (callback) {
    return typeof callback === 'function';
  })) {
    throw new TypeError('Table filter controls require clear, execute and reload callbacks.');
  }
}

/***/ }),

/***/ "./resources/frontend/features/table/filters/filter-drivers.js":
/*!*********************************************************************!*\
  !*** ./resources/frontend/features/table/filters/filter-drivers.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTableFilterDrivers": () => (/* binding */ createTableFilterDrivers),
/* harmony export */   "dataTables2SearchExtensions": () => (/* binding */ dataTables2SearchExtensions),
/* harmony export */   "isDateInRange": () => (/* binding */ isDateInRange),
/* harmony export */   "isNumberInRange": () => (/* binding */ isNumberInRange)
/* harmony export */ });
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var NO_COMPATIBILITY_EVENTS = Object.freeze({
  bindDateChange: function bindDateChange() {},
  bindSyntheticChange: function bindSyntheticChange() {},
  parseDate: unsupportedDateParser
});
function createTableFilterDrivers(engine) {
  var compatibilityEvents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NO_COMPATIBILITY_EVENTS;
  var searchExtensions = dataTables2SearchExtensions(engine);
  var events = normalizeCompatibilityEvents(compatibilityEvents);
  return {
    date: function date(input, table, column) {
      return bindDateFilter(input, table, column, events);
    },
    daterange: function daterange(input, table, column) {
      return bindDateRangeFilter(input, table, column, events);
    },
    range: function range(container, table, column, index, serverSide) {
      return bindRangeFilter(container, table, column, index, serverSide, searchExtensions, events);
    },
    select: function select(input, table, column, index, serverSide) {
      return bindSelectFilter(input, table, column, index, serverSide, events);
    },
    text: bindTextFilter
  };
}
function dataTables2SearchExtensions(engine) {
  var _engine$ext;
  if (!Array.isArray(engine === null || engine === void 0 || (_engine$ext = engine.ext) === null || _engine$ext === void 0 ? void 0 : _engine$ext.search)) {
    throw new TypeError('Table range filters require a DataTables search registry.');
  }
  return engine.ext.search;
}
function isNumberInRange(fromValue, toValue, value) {
  if (Number.isNaN(fromValue) && Number.isNaN(toValue)) return true;
  if (Number.isNaN(value)) return false;
  if (Number.isNaN(fromValue)) return value <= toValue;
  if (Number.isNaN(toValue)) return value >= fromValue;
  return value >= fromValue && value <= toValue;
}
function isDateInRange(fromValue, toValue, value) {
  if (!fromValue && !toValue) return true;
  var timestamp = dateTimestamp(value);
  if (!Number.isFinite(timestamp)) return false;
  var fromTimestamp = dateTimestamp(fromValue);
  var toTimestamp = dateTimestamp(toValue);
  if (!fromValue) return timestamp <= toTimestamp;
  if (!toValue) return timestamp >= fromTimestamp;
  return timestamp >= fromTimestamp && timestamp <= toTimestamp;
}
function bindDateFilter(input, _table, column, events) {
  var search = function search() {
    return column.search(input.value);
  };
  bindEvents(input, ['change'], search);
  events.bindDateChange(input, search);
}
function bindDateRangeFilter(input, _table, column, events) {
  bindTextFilter(input, _table, column);
  events.bindSyntheticChange(input, function () {
    return column.search(input.value);
  });
}
function bindTextFilter(input, _table, column) {
  bindEvents(input, ['keyup', 'change'], function () {
    return column.search(input.value);
  });
}
function bindSelectFilter(input, _table, column, _index, serverSide, events) {
  var search = function search() {
    return searchSelectedValues(column, selectedValues(input), serverSide);
  };
  bindEvents(input, ['change'], search);
  events.bindSyntheticChange(input, search);
}
function selectedValues(input) {
  return _toConsumableArray(input.selectedOptions).map(function (option) {
    return option.value;
  }).filter(Boolean);
}
function searchSelectedValues(column, selected, serverSide) {
  if (serverSide) {
    column.search(selected.join(':::'));
  } else {
    column.search(selected.join('|'), true, false, true);
  }
}
function bindRangeFilter(container, table, column, index, serverSide, searchExtensions, events) {
  var _rangeInputs = rangeInputs(container),
    from = _rangeInputs.from,
    to = _rangeInputs.to;
  var isDateRange = hasDatePickers(from, to);
  var search = function search() {
    return searchRange(from, to, table, column, serverSide);
  };
  bindEvents(from, ['keyup', 'change'], search);
  bindEvents(to, ['keyup', 'change'], search);
  bindDateRangeEvents(from, to, search, isDateRange, events);
  if (!serverSide) {
    searchExtensions.push(function (settings, data) {
      return filterRange(settings, data, table, index, from, to, isDateRange, events.parseDate);
    });
  }
}
function rangeInputs(container) {
  var inputs = container.querySelectorAll('input');
  var from = inputs[0];
  var to = inputs[inputs.length - 1];
  if (!from || !to || from === to) {
    throw new TypeError('Table range filters require two input controls.');
  }
  from.dataset.ajaxDataName = 'from';
  to.dataset.ajaxDataName = 'to';
  return {
    from: from,
    to: to
  };
}
function hasDatePickers(from, to) {
  return Boolean(from.closest('.input-date') && to.closest('.input-date'));
}
function bindDateRangeEvents(from, to, search, isDateRange, events) {
  if (!isDateRange) return;
  events.bindDateChange(from, search);
  events.bindDateChange(to, search);
}
function searchRange(from, to, table, column, serverSide) {
  if (serverSide) {
    column.search("".concat(from.value, "::").concat(to.value));
  } else {
    table.draw();
  }
}
function filterRange(settings, data, table, index, from, to, isDateRange, parseDate) {
  if (table.settings()[0].sTableId !== settings.sTableId) return true;
  var value = orderedValue(data[index]);
  return isDateRange ? filterDateRange(value, from, to, parseDate) : isNumberInRange(Number.parseInt(from.value), Number.parseInt(to.value), Number.parseInt(value));
}
function orderedValue(value) {
  return value && value['@data-order'] !== undefined ? value['@data-order'] : value;
}
function filterDateRange(value, from, to, parseDate) {
  var format = from.dataset.dateFormat;
  return isDateInRange(inputDate(from, format, parseDate), inputDate(to, format, parseDate), parseDate(value, format));
}
function inputDate(input, format, parseDate) {
  return input.value.length > 0 ? parseDate(input.value, format) : false;
}
function bindEvents(control, types, listener) {
  var _iterator = _createForOfIteratorHelper(types),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var type = _step.value;
      control.addEventListener(type, listener);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function normalizeCompatibilityEvents(events) {
  if (typeof (events === null || events === void 0 ? void 0 : events.bindDateChange) !== 'function' || typeof (events === null || events === void 0 ? void 0 : events.bindSyntheticChange) !== 'function' || typeof (events === null || events === void 0 ? void 0 : events.parseDate) !== 'function') {
    throw new TypeError('Table filters require valid compatibility event bindings.');
  }
  return events;
}
function unsupportedDateParser() {
  throw new TypeError('Client-side date filters require a date parser.');
}
function dateTimestamp(value) {
  var _value$valueOf;
  if (typeof (value === null || value === void 0 ? void 0 : value.isValid) === 'function' && !value.isValid()) return Number.NaN;
  var timestamp = value instanceof Date ? value.getTime() : Number(value === null || value === void 0 || (_value$valueOf = value.valueOf) === null || _value$valueOf === void 0 ? void 0 : _value$valueOf.call(value));
  return Number.isFinite(timestamp) ? timestamp : Number.NaN;
}

/***/ }),

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

/***/ "./resources/frontend/features/table/hooks/column-highlight.js":
/*!*********************************************************************!*\
  !*** ./resources/frontend/features/table/hooks/column-highlight.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "highlightColumn": () => (/* binding */ highlightColumn),
/* harmony export */   "syncColumnHighlight": () => (/* binding */ syncColumnHighlight)
/* harmony export */ });
var bindings = new WeakMap();
function syncColumnHighlight(element, table, enabled) {
  if (!enabled) {
    removeColumnHighlight(element);
    return null;
  }
  var current = bindings.get(element);
  if (current) {
    current.table = table;
    return current.destroy;
  }
  return bindColumnHighlight(element, table);
}
function highlightColumn(table, cell) {
  var _table$cell$index;
  if (!table.data().any()) {
    return;
  }
  var index = (_table$cell$index = table.cell(cell).index()) === null || _table$cell$index === void 0 ? void 0 : _table$cell$index.column;
  if (index === undefined) {
    return;
  }
  Array.from(table.cells().nodes()).forEach(function (node) {
    return node.classList.remove('highlight');
  });
  Array.from(table.column(index).nodes()).forEach(function (node) {
    return node.classList.add('highlight');
  });
}
function bindColumnHighlight(element, table) {
  var binding = {
    destroy: null,
    table: table
  };
  var onMouseOver = function onMouseOver(event) {
    return handleMouseOver(element, binding.table, event);
  };
  binding.destroy = function () {
    element.removeEventListener('mouseover', onMouseOver);
    bindings["delete"](element);
  };
  element.addEventListener('mouseover', onMouseOver);
  bindings.set(element, binding);
  return binding.destroy;
}
function removeColumnHighlight(element) {
  var _bindings$get;
  (_bindings$get = bindings.get(element)) === null || _bindings$get === void 0 || _bindings$get.destroy();
}
function handleMouseOver(element, table, event) {
  var _event$target$closest, _event$target;
  var cell = (_event$target$closest = (_event$target = event.target).closest) === null || _event$target$closest === void 0 ? void 0 : _event$target$closest.call(_event$target, 'td');
  if (!cell || !element.contains(cell) || cell.contains(event.relatedTarget)) {
    return;
  }
  highlightColumn(table, cell);
}

/***/ }),

/***/ "./resources/frontend/features/table/hooks/lazy-images.js":
/*!****************************************************************!*\
  !*** ./resources/frontend/features/table/hooks/lazy-images.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadLazyImage": () => (/* binding */ loadLazyImage),
/* harmony export */   "loadLazyImages": () => (/* binding */ loadLazyImages)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function loadLazyImages(root) {
  var images = matchingElements(root, '.lazyload');
  images.forEach(loadLazyImage);
  return images.length;
}
function loadLazyImage(element) {
  var _element$tagName;
  if (((_element$tagName = element.tagName) === null || _element$tagName === void 0 ? void 0 : _element$tagName.toLowerCase()) === 'img') {
    element.loading = 'lazy';
    copyAttribute(element, 'data-src', 'src');
    copyAttribute(element, 'data-srcset', 'srcset');
    return;
  }
  var source = element.getAttribute('data-src');
  if (source) {
    element.style.backgroundImage = "url(".concat(JSON.stringify(source), ")");
  }
}
function copyAttribute(element, source, target) {
  var value = element.getAttribute(source);
  if (value) {
    element.setAttribute(target, value);
  }
}
function matchingElements(root, selector) {
  var elements = _toConsumableArray(root.querySelectorAll(selector));
  if (typeof root.matches === 'function' && root.matches(selector)) {
    elements.unshift(root);
  }
  return elements;
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
    inlineEditor = _ref.inlineEditor,
    lazyload = _ref.lazyload,
    tooltips = _ref.tooltips;
  assertHookDependencies(events, highlight, inlineEditor, lazyload, tooltips);
  return function drawHook() {
    events.fire('datatables::draw', this);
    inlineEditor();
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

/***/ "./resources/frontend/features/table/options/option-aliases.js":
/*!*********************************************************************!*\
  !*** ./resources/frontend/features/table/options/option-aliases.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "normalizeDataTables2Options": () => (/* binding */ normalizeDataTables2Options)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var LEGACY_OPTION_ALIASES = Object.freeze([['sDom', 'dom'], ['bStateSave', 'stateSave'], ['fnDrawCallback', 'drawCallback']]);
var REMOVED_DATATABLES1_OPTIONS = Object.freeze([['asStripeClasses', 'Move row striping to the active theme CSS.'], ['fnServerData', 'Use an ajax function.'], ['fnServerParams', 'Use ajax.data.'], ['sAjaxSource', 'Use ajax.'], ['sAjaxDataProp', 'Use ajax.dataSrc.']]);
function normalizeDataTables2Options(options) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$warn = _ref.warn,
    warn = _ref$warn === void 0 ? warnRemovedOption : _ref$warn;
  var normalized = _objectSpread({}, options);
  LEGACY_OPTION_ALIASES.forEach(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
      legacyName = _ref3[0],
      currentName = _ref3[1];
    moveOption(normalized, legacyName, currentName);
  });
  REMOVED_DATATABLES1_OPTIONS.forEach(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
      legacyName = _ref5[0],
      migration = _ref5[1];
    removeUnsupportedOption(normalized, legacyName, migration, warn);
  });
  return normalized;
}
function moveOption(options, legacyName, currentName) {
  if (options[currentName] === undefined && options[legacyName] !== undefined) {
    options[currentName] = options[legacyName];
  }
  delete options[legacyName];
}
function removeUnsupportedOption(options, legacyName, migration, warn) {
  if (!Object.hasOwn(options, legacyName)) {
    return;
  }
  warn(formatRemovedOptionWarning(legacyName, migration));
  delete options[legacyName];
}
function formatRemovedOptionWarning(legacyName, migration) {
  return "[SleepingOwl Admin] DataTables 1 option \"".concat(legacyName, "\" ") + "is not supported by DataTables 2. ".concat(migration);
}
function warnRemovedOption(message) {
  var _globalThis$console;
  (_globalThis$console = globalThis.console) === null || _globalThis$console === void 0 || _globalThis$console.warn(message);
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
/* harmony export */   "tableLayout": () => (/* binding */ tableLayout)
/* harmony export */ });
/* harmony import */ var _option_aliases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./option-aliases.js */ "./resources/frontend/features/table/options/option-aliases.js");
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
  var normalized = (0,_option_aliases_js__WEBPACK_IMPORTED_MODULE_0__.normalizeDataTables2Options)(options);
  if (!definition.url) {
    return normalized;
  }
  delete normalized.dom;
  return _objectSpread(_objectSpread({}, normalized), {}, {
    layout: tableLayout(definition),
    processing: true,
    serverSide: true
  });
}
function tableLayout(_ref) {
  var showLength = _ref.showLength,
    showSearch = _ref.showSearch;
  return {
    bottomEnd: 'paging',
    bottomStart: 'info',
    topEnd: showSearch ? 'search' : null,
    topStart: showLength ? 'pageLength' : null
  };
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

/***/ "./resources/frontend/features/table/selection/checkbox-controls.js":
/*!**************************************************************************!*\
  !*** ./resources/frontend/features/table/selection/checkbox-controls.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bindTableCheckboxes": () => (/* binding */ bindTableCheckboxes),
/* harmony export */   "updateRowSelection": () => (/* binding */ updateRowSelection)
/* harmony export */ });
/* harmony import */ var _core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/dom/listeners.js */ "./resources/frontend/core/dom/listeners.js");

var CHECKBOX_SELECTOR = '.adminCheckboxRow, .adminCheckboxAll';
function bindTableCheckboxes(_ref) {
  var root = _ref.root,
    _ref$selectedRowClass = _ref.selectedRowClass,
    selectedRowClass = _ref$selectedRowClass === void 0 ? null : _ref$selectedRowClass;
  return (0,_core_dom_listeners_js__WEBPACK_IMPORTED_MODULE_0__.delegate)(root, 'change', CHECKBOX_SELECTOR, function (_event, checkbox) {
    if (checkbox.classList.contains('adminCheckboxAll')) {
      updateTableSelection(checkbox, selectedRowClass);
      return;
    }
    updateRowSelection(checkbox, selectedRowClass);
  });
}
function updateRowSelection(checkbox) {
  var selectedRowClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var row = checkbox.closest('tr');
  if (!row) {
    return;
  }
  row.toggleAttribute('data-soa-selected', checkbox.checked);
  row.setAttribute('aria-selected', String(checkbox.checked));
  if (selectedRowClass) {
    row.classList.toggle(selectedRowClass, checkbox.checked);
  }
}
function updateTableSelection(selectAll, selectedRowClass) {
  var table = selectAll.closest('table');
  if (!table) {
    return;
  }
  table.querySelectorAll('.adminCheckboxRow').forEach(function (checkbox) {
    if (checkbox.checked === selectAll.checked) {
      updateRowSelection(checkbox, selectedRowClass);
      return;
    }
    checkbox.checked = selectAll.checked;
    dispatchChange(checkbox);
  });
}
function dispatchChange(element) {
  var _element$ownerDocumen, _element$ownerDocumen2;
  var EventConstructor = (_element$ownerDocumen = (_element$ownerDocumen2 = element.ownerDocument) === null || _element$ownerDocumen2 === void 0 || (_element$ownerDocumen2 = _element$ownerDocumen2.defaultView) === null || _element$ownerDocumen2 === void 0 ? void 0 : _element$ownerDocumen2.Event) !== null && _element$ownerDocumen !== void 0 ? _element$ownerDocumen : globalThis.Event;
  element.dispatchEvent(new EventConstructor('change', {
    bubbles: true
  }));
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
/* harmony export */   "migrateLegacyFilterState": () => (/* binding */ migrateLegacyFilterState),
/* harmony export */   "saveFilterState": () => (/* binding */ saveFilterState)
/* harmony export */ });
/* harmony import */ var _filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../filters/filter-elements.js */ "./resources/frontend/features/table/filters/filter-elements.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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

function filterStateKey(path, tableId) {
  var normalized = path.match(/\d+\/edit$/) ? path.replace(/\d+\/edit$/, 'edit') : path;
  var legacyKey = "Filters_/".concat(normalized);
  return tableId === undefined ? legacyKey : "".concat(legacyKey, "::").concat(globalThis.encodeURIComponent(String(tableId)));
}
function migrateLegacyFilterState(storage, path, containers) {
  var legacyKey = filterStateKey(path);
  var serialized = storage.getItem(legacyKey);
  if (!serialized) return [];
  var migration = groupLegacyState(parseState(serialized), containers);
  var keys = writeMigratedState(storage, path, migration.tables);
  if (migration.complete) {
    storage.removeItem(legacyKey);
  }
  return keys;
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
function groupLegacyState(state, containers) {
  var tables = new Map();
  var complete = true;
  for (var _i = 0, _Object$entries = Object.entries(state); _i < _Object$entries.length; _i++) {
    var _containers$container, _tables$get;
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      containerIndex = _Object$entries$_i[0],
      columns = _Object$entries$_i[1];
    var tableId = (_containers$container = containers[containerIndex]) === null || _containers$container === void 0 || (_containers$container = _containers$container.dataset) === null || _containers$container === void 0 ? void 0 : _containers$container.datatablesId;
    if (!tableId) {
      complete = false;
      continue;
    }
    var table = (_tables$get = tables.get(tableId)) !== null && _tables$get !== void 0 ? _tables$get : [];
    table.push(columns);
    tables.set(tableId, table);
  }
  return {
    complete: complete,
    tables: tables
  };
}
function writeMigratedState(storage, path, tables) {
  var keys = [];
  var _iterator2 = _createForOfIteratorHelper(tables),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _step2$value = _slicedToArray(_step2.value, 2),
        tableId = _step2$value[0],
        containers = _step2$value[1];
      var key = filterStateKey(path, tableId);
      keys.push(key);
      if (storage.getItem(key) === null) {
        storage.setItem(key, JSON.stringify(Object.fromEntries(containers.entries())));
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return keys;
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
  for (var _i2 = 0, _Object$entries2 = Object.entries(state); _i2 < _Object$entries2.length; _i2++) {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
      containerIndex = _Object$entries2$_i[0],
      columns = _Object$entries2$_i[1];
    var container = containers[containerIndex];
    if (container) {
      restoreContainerState(container, columns);
    }
  }
}
function restoreContainerState(container, columns) {
  for (var _i3 = 0, _Object$entries3 = Object.entries(columns); _i3 < _Object$entries3.length; _i3++) {
    var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
      index = _Object$entries3$_i[0],
      state = _Object$entries3$_i[1];
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
  for (var _i4 = 0, _Object$entries4 = Object.entries(values); _i4 < _Object$entries4.length; _i4++) {
    var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
      index = _Object$entries4$_i[0],
      value = _Object$entries4$_i[1];
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
    var _iterator3 = _createForOfIteratorHelper(control.options),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var option = _step3.value;
        option.selected = value.includes(option.value);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  } else {
    control.value = value;
  }
  control.dispatchEvent(new globalThis.Event('change', {
    bubbles: true
  }));
}
function isEmptyValue(value) {
  if (value === null || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  return _typeof(value) === 'object' && Object.keys(value).length === 0;
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
/* harmony export */   "AUTO_UPDATE_COLOR_PROPERTY": () => (/* reexport safe */ _autoupdate_table_auto_update_js__WEBPACK_IMPORTED_MODULE_0__.AUTO_UPDATE_COLOR_PROPERTY),
/* harmony export */   "DataTableAdapter": () => (/* reexport safe */ _lifecycle_data_table_adapter_js__WEBPACK_IMPORTED_MODULE_13__.DataTableAdapter),
/* harmony export */   "TABLE_FEATURE_ID": () => (/* binding */ TABLE_FEATURE_ID),
/* harmony export */   "actionRequestSettings": () => (/* reexport safe */ _actions_action_request_js__WEBPACK_IMPORTED_MODULE_2__.actionRequestSettings),
/* harmony export */   "appendNamedFilterData": () => (/* reexport safe */ _transport_table_ajax_js__WEBPACK_IMPORTED_MODULE_19__.appendNamedFilterData),
/* harmony export */   "applyCreatedRowClass": () => (/* reexport safe */ _hooks_table_hooks_js__WEBPACK_IMPORTED_MODULE_12__.applyCreatedRowClass),
/* harmony export */   "applyServerOptions": () => (/* reexport safe */ _options_table_options_js__WEBPACK_IMPORTED_MODULE_15__.applyServerOptions),
/* harmony export */   "bindBulkActions": () => (/* reexport safe */ _actions_bulk_actions_js__WEBPACK_IMPORTED_MODULE_3__.bindBulkActions),
/* harmony export */   "bindConfirmedControls": () => (/* reexport safe */ _controls_confirm_submit_js__WEBPACK_IMPORTED_MODULE_5__.bindConfirmedControls),
/* harmony export */   "bindFilterControls": () => (/* reexport safe */ _filters_filter_controls_js__WEBPACK_IMPORTED_MODULE_6__.bindFilterControls),
/* harmony export */   "bindFormActions": () => (/* reexport safe */ _actions_form_actions_js__WEBPACK_IMPORTED_MODULE_4__.bindFormActions),
/* harmony export */   "bindTableCheckboxes": () => (/* reexport safe */ _selection_checkbox_controls_js__WEBPACK_IMPORTED_MODULE_17__.bindTableCheckboxes),
/* harmony export */   "clearFilterControls": () => (/* reexport safe */ _filters_filter_controls_js__WEBPACK_IMPORTED_MODULE_6__.clearFilterControls),
/* harmony export */   "clearFilterState": () => (/* reexport safe */ _state_filter_state_js__WEBPACK_IMPORTED_MODULE_18__.clearFilterState),
/* harmony export */   "clearSavedTableSearch": () => (/* reexport safe */ _state_filter_state_js__WEBPACK_IMPORTED_MODULE_18__.clearSavedTableSearch),
/* harmony export */   "createDateFilterSupport": () => (/* reexport safe */ _filters_date_filter_support_js__WEBPACK_IMPORTED_MODULE_7__.createDateFilterSupport),
/* harmony export */   "createDrawHook": () => (/* reexport safe */ _hooks_table_hooks_js__WEBPACK_IMPORTED_MODULE_12__.createDrawHook),
/* harmony export */   "createTableAjax": () => (/* reexport safe */ _transport_table_ajax_js__WEBPACK_IMPORTED_MODULE_19__.createTableAjax),
/* harmony export */   "createTableFilterDrivers": () => (/* reexport safe */ _filters_filter_drivers_js__WEBPACK_IMPORTED_MODULE_8__.createTableFilterDrivers),
/* harmony export */   "dataTables2SearchExtensions": () => (/* reexport safe */ _filters_filter_drivers_js__WEBPACK_IMPORTED_MODULE_8__.dataTables2SearchExtensions),
/* harmony export */   "executeTableAction": () => (/* reexport safe */ _actions_action_request_js__WEBPACK_IMPORTED_MODULE_2__.executeTableAction),
/* harmony export */   "filterStateKey": () => (/* reexport safe */ _state_filter_state_js__WEBPACK_IMPORTED_MODULE_18__.filterStateKey),
/* harmony export */   "findActionTable": () => (/* reexport safe */ _actions_action_context_js__WEBPACK_IMPORTED_MODULE_1__.findActionTable),
/* harmony export */   "forEachColumnFilter": () => (/* reexport safe */ _filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_9__.forEachColumnFilter),
/* harmony export */   "highlightColumn": () => (/* reexport safe */ _hooks_column_highlight_js__WEBPACK_IMPORTED_MODULE_10__.highlightColumn),
/* harmony export */   "isDateInRange": () => (/* reexport safe */ _filters_filter_drivers_js__WEBPACK_IMPORTED_MODULE_8__.isDateInRange),
/* harmony export */   "isNumberInRange": () => (/* reexport safe */ _filters_filter_drivers_js__WEBPACK_IMPORTED_MODULE_8__.isNumberInRange),
/* harmony export */   "loadFilterState": () => (/* reexport safe */ _state_filter_state_js__WEBPACK_IMPORTED_MODULE_18__.loadFilterState),
/* harmony export */   "loadLazyImage": () => (/* reexport safe */ _hooks_lazy_images_js__WEBPACK_IMPORTED_MODULE_11__.loadLazyImage),
/* harmony export */   "loadLazyImages": () => (/* reexport safe */ _hooks_lazy_images_js__WEBPACK_IMPORTED_MODULE_11__.loadLazyImages),
/* harmony export */   "migrateLegacyFilterState": () => (/* reexport safe */ _state_filter_state_js__WEBPACK_IMPORTED_MODULE_18__.migrateLegacyFilterState),
/* harmony export */   "mountDataTable": () => (/* reexport safe */ _lifecycle_data_table_adapter_js__WEBPACK_IMPORTED_MODULE_13__.mountDataTable),
/* harmony export */   "mountTableAutoUpdate": () => (/* reexport safe */ _autoupdate_table_auto_update_js__WEBPACK_IMPORTED_MODULE_0__.mountTableAutoUpdate),
/* harmony export */   "mountTableAutoUpdates": () => (/* reexport safe */ _autoupdate_table_auto_update_js__WEBPACK_IMPORTED_MODULE_0__.mountTableAutoUpdates),
/* harmony export */   "normalizeDataTables2Options": () => (/* reexport safe */ _options_option_aliases_js__WEBPACK_IMPORTED_MODULE_14__.normalizeDataTables2Options),
/* harmony export */   "readAutoUpdateConfig": () => (/* reexport safe */ _autoupdate_table_auto_update_js__WEBPACK_IMPORTED_MODULE_0__.readAutoUpdateConfig),
/* harmony export */   "readControlValue": () => (/* reexport safe */ _filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_9__.readControlValue),
/* harmony export */   "readTableDefinition": () => (/* reexport safe */ _options_table_options_js__WEBPACK_IMPORTED_MODULE_15__.readTableDefinition),
/* harmony export */   "saveFilterState": () => (/* reexport safe */ _state_filter_state_js__WEBPACK_IMPORTED_MODULE_18__.saveFilterState),
/* harmony export */   "selectedRowParameters": () => (/* reexport safe */ _actions_action_context_js__WEBPACK_IMPORTED_MODULE_1__.selectedRowParameters),
/* harmony export */   "selectedRowValues": () => (/* reexport safe */ _selection_selected_rows_js__WEBPACK_IMPORTED_MODULE_16__.selectedRowValues),
/* harmony export */   "syncColumnHighlight": () => (/* reexport safe */ _hooks_column_highlight_js__WEBPACK_IMPORTED_MODULE_10__.syncColumnHighlight),
/* harmony export */   "tableLayout": () => (/* reexport safe */ _options_table_options_js__WEBPACK_IMPORTED_MODULE_15__.tableLayout),
/* harmony export */   "updateRowSelection": () => (/* reexport safe */ _selection_checkbox_controls_js__WEBPACK_IMPORTED_MODULE_17__.updateRowSelection)
/* harmony export */ });
/* harmony import */ var _autoupdate_table_auto_update_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./autoupdate/table-auto-update.js */ "./resources/frontend/features/table/autoupdate/table-auto-update.js");
/* harmony import */ var _actions_action_context_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions/action-context.js */ "./resources/frontend/features/table/actions/action-context.js");
/* harmony import */ var _actions_action_request_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actions/action-request.js */ "./resources/frontend/features/table/actions/action-request.js");
/* harmony import */ var _actions_bulk_actions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actions/bulk-actions.js */ "./resources/frontend/features/table/actions/bulk-actions.js");
/* harmony import */ var _actions_form_actions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions/form-actions.js */ "./resources/frontend/features/table/actions/form-actions.js");
/* harmony import */ var _controls_confirm_submit_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./controls/confirm-submit.js */ "./resources/frontend/features/table/controls/confirm-submit.js");
/* harmony import */ var _filters_filter_controls_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./filters/filter-controls.js */ "./resources/frontend/features/table/filters/filter-controls.js");
/* harmony import */ var _filters_date_filter_support_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./filters/date-filter-support.js */ "./resources/frontend/features/table/filters/date-filter-support.js");
/* harmony import */ var _filters_filter_drivers_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./filters/filter-drivers.js */ "./resources/frontend/features/table/filters/filter-drivers.js");
/* harmony import */ var _filters_filter_elements_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./filters/filter-elements.js */ "./resources/frontend/features/table/filters/filter-elements.js");
/* harmony import */ var _hooks_column_highlight_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./hooks/column-highlight.js */ "./resources/frontend/features/table/hooks/column-highlight.js");
/* harmony import */ var _hooks_lazy_images_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./hooks/lazy-images.js */ "./resources/frontend/features/table/hooks/lazy-images.js");
/* harmony import */ var _hooks_table_hooks_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./hooks/table-hooks.js */ "./resources/frontend/features/table/hooks/table-hooks.js");
/* harmony import */ var _lifecycle_data_table_adapter_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./lifecycle/data-table-adapter.js */ "./resources/frontend/features/table/lifecycle/data-table-adapter.js");
/* harmony import */ var _options_option_aliases_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./options/option-aliases.js */ "./resources/frontend/features/table/options/option-aliases.js");
/* harmony import */ var _options_table_options_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./options/table-options.js */ "./resources/frontend/features/table/options/table-options.js");
/* harmony import */ var _selection_selected_rows_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./selection/selected-rows.js */ "./resources/frontend/features/table/selection/selected-rows.js");
/* harmony import */ var _selection_checkbox_controls_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./selection/checkbox-controls.js */ "./resources/frontend/features/table/selection/checkbox-controls.js");
/* harmony import */ var _state_filter_state_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./state/filter-state.js */ "./resources/frontend/features/table/state/filter-state.js");
/* harmony import */ var _transport_table_ajax_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./transport/table-ajax.js */ "./resources/frontend/features/table/transport/table-ajax.js");
var TABLE_FEATURE_ID = 'table';




















})();

/******/ })()
;
//# sourceMappingURL=table.js.map