(function() {
	//#region node_modules/datatables.net/js/dataTables.mjs
	/*! DataTables 3.0.3
	* Copyright (c) SpryMedia Ltd - datatables.net/license
	*/
	var reFormattedNumeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	var reHtml = /<([^>]*>)/g;
	var reRegexCharacters = new RegExp("(\\" + [
		"/",
		".",
		"*",
		"+",
		"?",
		"|",
		"(",
		")",
		"[",
		"]",
		"{",
		"}",
		"\\",
		"$",
		"^",
		"-"
	].join("|\\") + ")", "g");
	var regex = /*#__PURE__*/ Object.freeze({
		__proto__: null,
		isoTimezone: /[T\s]\d{2}.*?(Z|[+-]\d{2}(?::?\d{2})?)$/,
		reDate: /^\d{2,4}[./-]\d{1,2}[./-]\d{1,2}([T ]{1}\d{1,2}[:.]\d{2}([.:]\d{2})?)?$/,
		reFormattedNumeric,
		reHtml,
		reNewLines: /[\r\n\u2028]/g,
		reRegexCharacters
	});
	var maxStrLen = Math.pow(2, 28);
	/**
	* DataTables default string normalisation. Remove diacritics from a string by
	* decomposing it and then removing non-ascii characters.
	*
	* This function is replaceable if the user wishes to use a different library
	* for normalising a string.
	*
	* @param val Value to normalise (if a string)
	* @param both Include both the normalised and original in the return
	* @returns Normalised string, or original value if not a string
	*/
	var _normalize = function(val, both) {
		if (typeof val !== "string") return val;
		var res = val.normalize ? val.normalize("NFD") : val;
		return res.length !== val.length ? (both === true ? val + " " : "") + res.replace(/[\u0300-\u036f]/g, "") : res;
	};
	/**
	* DataTables default string HTML stripping from a string
	*
	* This function is replaceable if the user wishes to use a different library
	* for stripping HTML from a string.
	*
	* @param input Value to strip HTML from
	* @param replacement Value to replace the tags with
	* @returns Stripped value
	*/
	var _stripHtml = function(input, replacement = "") {
		if (!input || typeof input !== "string") return input;
		if (input.length > maxStrLen) throw new Error("Exceeded max str len");
		let previous;
		let next = input.replace(reHtml, replacement);
		do {
			previous = next;
			next = next.replace(/<script/i, "");
		} while (next !== previous);
		return previous;
	};
	/**
	* DataTables default HTML entity escaping.
	*
	* This function is replaceable if the user wishes to use a different library
	* for escaping HTML entities in a string.
	*
	* @param val Value to escape HTML in
	* @returns Escaped value
	*/
	var _escapeHtml = function(val) {
		let d = Array.isArray(val) ? val.join(",") : val;
		return typeof d === "string" ? d.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : d;
	};
	/**
	* Escape regular expression characters in a string
	*
	* @param val String to escape
	* @returns String with regex characters escaped
	*/
	function escapeRegex(val) {
		return val.replace(reRegexCharacters, "\\$1");
	}
	function escapeHtml(mixed) {
		var type = typeof mixed;
		if (type === "function") {
			_escapeHtml = mixed;
			return;
		} else if (type === "string" || Array.isArray(mixed)) return _escapeHtml(mixed);
		return mixed;
	}
	function normalize(mixed, both) {
		if (typeof mixed !== "function") return _normalize(mixed, both);
		_normalize = mixed;
	}
	function stripHtml(mixed, replacement) {
		const type = typeof mixed;
		if (type === "function") {
			_stripHtml = mixed;
			return;
		} else if (type === "string") return _stripHtml(mixed, replacement);
		return mixed;
	}
	var string = /*#__PURE__*/ Object.freeze({
		__proto__: null,
		escapeHtml,
		escapeRegex,
		normalize,
		stripHtml
	});
	var _re_dic = {};
	/**
	* Get integer value
	*
	* @param s Value
	* @returns Int, or null if not a number
	*/
	function intVal(s) {
		var integer = parseInt(s, 10);
		return !isNaN(integer) && isFinite(s) ? integer : null;
	}
	function numToDecimal(num, decimalPoint) {
		if (!_re_dic[decimalPoint]) _re_dic[decimalPoint] = new RegExp(escapeRegex(decimalPoint), "g");
		return typeof num === "string" && decimalPoint !== "." ? num.replace(/\./g, "").replace(_re_dic[decimalPoint], ".") : num;
	}
	var conv = /*#__PURE__*/ Object.freeze({
		__proto__: null,
		intVal,
		numToDecimal
	});
	function arrayLike(test) {
		return test && typeof test !== "string" && test.length !== void 0 && test.nodeType === void 0;
	}
	/**
	* Determine if the input is a Dom instance
	*
	* @param input Value to check
	* @returns true if it is a Dom instance, false otherwise
	*/
	function dom(input) {
		return input && typeof input === "object" && input._isDom;
	}
	/**
	* Determine if the input is an HTML element
	*
	* @param input Value to check
	* @returns true if an HTML element was passed in
	*/
	function element(input) {
		return typeof input === "object" && input.nodeName;
	}
	/**
	* Check if a value is empty or not. Note that a string with `-` is considered
	* empty
	*
	* @param d Value to check
	* @returns `true` if empty, `false` otherwise
	*/
	function empty(d) {
		return !d || d === true || d === "-" ? true : false;
	}
	/**
	* Check if a string is HTML. Note that a string without HTML in it can be
	* considered to be HTML still!
	*
	* @todo Can we drop this?
	* @param d
	* @returns
	*/
	function html(d) {
		return empty(d) || typeof d === "string";
	}
	/**
	* Is a string a number surrounded by HTML?
	*
	* @param d Value to check
	* @param decimalPoint Decimal place character
	* @param formatted Consider formatted numbers
	* @param allowEmpty Allow empty to be considered as a number
	* @returns True if a number, null otherwise
	*/
	function htmlNum(d, decimalPoint, formatted, allowEmpty) {
		if (allowEmpty && empty(d)) return true;
		if (typeof d === "string" && d.match(/<(input|select)/i)) return null;
		return !html(d) ? null : num$1(stripHtml(d), decimalPoint, formatted, allowEmpty) ? true : null;
	}
	/**
	* Determine if an input is a jQuery instance
	*
	* @param input Value to check
	* @returns true if it is a jQuery instance, false otherwise
	*/
	function jquery(input) {
		return input && typeof input.jquery === "string";
	}
	/**
	* Check if a given value is numeric, taking into account if it might be
	* formatted or uses a decimal point that is not a period.
	*
	* @param d Value to check
	* @param decimalPoint DP character
	* @param formatted Allow the number to be formatted or not
	* @param allowEmpty Allow an empty value to be considered a number
	* @returns `true` if numeric
	*/
	function num$1(d, decimalPoint, formatted, allowEmpty) {
		let type = typeof d;
		if (type === "number" || type === "bigint") return true;
		if (allowEmpty && empty(d)) return true;
		if (decimalPoint && type === "string") d = numToDecimal(d, decimalPoint);
		if (formatted && type === "string") d = d.replace(reFormattedNumeric, "");
		return !isNaN(parseFloat(d)) && isFinite(d);
	}
	/**
	* Determine if a value is a plain object or not
	*
	* @param value Value to check
	* @returns true if is a plain object, otherwise false
	*/
	function plainObject(value) {
		if (typeof value !== "object" || value === null) return false;
		let proto = Object.getPrototypeOf(value);
		return proto === null || proto === Object.prototype;
	}
	var is = /*#__PURE__*/ Object.freeze({
		__proto__: null,
		arrayLike,
		dom,
		element,
		empty,
		html,
		htmlNum,
		jquery,
		num: num$1,
		plainObject
	});
	/**
	* Object iteration function, executing a callback for each key in the object
	*
	* @param input Input object
	* @param fn Function to execute
	*/
	function each(input, fn) {
		if (!input) return;
		let keys = Object.keys(input);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			fn(key, input[key], i);
		}
	}
	/**
	* Merge the contents of two or more objects into the first object.
	*
	* @param out Object to be assigned the properties
	* @param inputs Objects to take the values from
	* @returns The `output`, just for convenience - output === the return.
	*/
	function assign(out, ...inputs) {
		let output = Object(out);
		for (let i = 0; i < inputs.length; i++) {
			let options = inputs[i];
			if (options != null) for (let name in options) {
				let copy = options[name];
				if (name === "__proto__" || output === copy) continue;
				if (copy !== void 0) output[name] = copy;
			}
		}
		return output;
	}
	/**
	* Deep merge the contents of two or more objects into the first object. This
	* breaks references for both objects and array.
	*
	* @param out Object to be assigned the properties
	* @param inputs Objects to take the values from
	* @returns The `output`, just for convenience - output === the return.
	*/
	function assignDeep(out, ...inputs) {
		if (!out) return {};
		for (let i = 0; i < inputs.length; i++) {
			let input = inputs[i];
			if (!input) continue;
			for (const [key, value] of Object.entries(input)) if (Array.isArray(value)) {
				if (!Array.isArray(out[key])) out[key] = [];
				assignDeep(out[key], value);
			} else if (plainObject(value)) {
				if (!plainObject(out[key])) out[key] = {};
				assignDeep(out[key], value);
			} else if (input[key] !== void 0) out[key] = input[key];
		}
		return out;
	}
	/**
	* Deep merge objects, but shallow copy arrays. The reason we need to do this,
	* is that we don't want to deep copy array init values (such as aaSorting)
	* since the dev wouldn't be able to override them, but we do want to deep copy
	* arrays.
	*
	* @param out Object to extend
	* @param extender Object from which the properties will be applied to out
	* @param breakRefs If true, then arrays will be sliced to take an independent
	*   copy with the exception of the `data` or `aaData` parameters if they are
	*   present. This is so you can pass in a collection to DataTables and have
	*   that used as your data source without breaking the references
	* @returns out Reference, just for convenience - out === the return.
	* @todo This doesn't take account of arrays inside the deep copied objects.
	*/
	function assignDeepObjects(out, extender, breakRefs = false) {
		let val;
		for (let prop in extender) if (Object.prototype.hasOwnProperty.call(extender, prop)) {
			val = extender[prop];
			if (plainObject(val)) {
				if (!plainObject(out[prop])) out[prop] = {};
				assignDeep(out[prop], val);
			} else if (breakRefs && prop !== "data" && prop !== "aaData" && Array.isArray(val)) out[prop] = val.slice();
			else out[prop] = val;
		}
		return out;
	}
	/**
	* Map entries to an array
	*
	* @param obj In object
	* @param fn Map transform function. Same signature as `each`
	* @returns Result
	*/
	function map$1(obj, fn) {
		let out = [];
		each(obj, (key, val) => {
			out.push(fn(key, val));
		});
		return out;
	}
	var object = /*#__PURE__*/ Object.freeze({
		__proto__: null,
		assign,
		assignDeep,
		assignDeepObjects,
		each,
		map: map$1
	});
	var defaults$5 = {
		cache: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		headers: {},
		traditional: false,
		url: location.href
	};
	/**
	* Trigger an Ajax call to the server based on the configuration parameters
	* passed in.
	*
	* @param optionsIn Ajax options
	* @returns The XHR request
	*/
	function ajax(optionsIn) {
		let xhr = new XMLHttpRequest();
		let options = assign({}, defaults$5, optionsIn);
		let urlParams = queryParams(options);
		let method = httpMethod(options);
		let sendData = null;
		if (options.submitAs === "json" && options.data) {
			options.data = JSON.stringify(options.data);
			if (!options.contentType) options.contentType = "application/json; charset=utf-8";
		}
		xhr.open(method, options.url + (urlParams ? (options.url.includes("?") ? "&" : "?") + urlParams : ""), true, options.username || null, options.password || null);
		if (options.contentType && !(options.data instanceof FormData)) xhr.setRequestHeader("Content-Type", options.contentType);
		if (options.headers && !options.headers["X-Requested-With"] && !isCrossDomain(options.url)) options.headers["X-Requested-With"] = "XMLHttpRequest";
		if (options.dataType === "json" && options.headers && !options.headers["accepts"]) options.headers["Accept"] = "application/json, text/javascript, */*; q=0.01";
		each(options.headers, (key, val) => {
			xhr.setRequestHeader(key, val);
		});
		if (options.data instanceof FormData) sendData = options.data;
		else if (method !== "GET" && options.data) {
			if (typeof options.data === "string") sendData = options.data;
			else {
				sendData = serialize(options.data, options.traditional);
				sendData = convertSpaces(sendData, options);
				options.data = sendData;
			}
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return;
			let responseData = xhr.responseText;
			let statusText = "success";
			if (xhr.status === 0) return;
			else if (xhr.status === 204 || method === "HEAD") statusText = "nocontent";
			else if (xhr.status === 304) statusText = "notmodified";
			else if (xhr.status >= 400) statusText = "error";
			if (options.dataType === "json") try {
				responseData = JSON.parse(responseData);
			} catch (e) {
				statusText = "parsererror";
			}
			else if (!options.dataType) try {
				responseData = JSON.parse(responseData);
			} catch (e) {}
			if (statusText === "success") callback(options.success, responseData, statusText, xhr);
			else callback(options.error, xhr, statusText, xhr.statusText);
			callback(options.complete, xhr, statusText);
		};
		if (options.beforeSend) {
			if (options.beforeSend.call(options, xhr, options) === false) {
				xhr.abort();
				return xhr;
			}
		}
		xhr.send(sendData);
		return xhr;
	}
	ajax.defaults = defaults$5;
	ajax.serialize = serialize;
	/**
	* Run callback functions (allowing for none, one or array)
	*
	* @param fnIn Function(s) to run
	* @param arg1 Parameters to pass to the function(s)
	* @param arg2 Parameters to pass to the function(s)
	* @param arg3 Parameters to pass to the function(s)
	*/
	function callback(fnIn, arg1, arg2, arg3) {
		if (!fnIn) return;
		let fnArr = Array.isArray(fnIn) ? fnIn : [fnIn];
		for (let i = 0; i < fnArr.length; i++) fnArr[i](arg1, arg2, arg3);
	}
	/**
	* For form submission with x-www-form-urlencoded, spaces should be submitted as
	* `+`. See the jQuery discussion on the topic here:
	* https://github.com/jquery/jquery/issues/2658#issuecomment-149024872
	*
	* @param sendData Serialised form of the data to submit
	* @param options Ajax options
	* @returns Query string
	*/
	function convertSpaces(sendData, options) {
		return (options.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 ? sendData.replace(/%20/g, "+") : sendData;
	}
	/**
	* Determine if a url is a cross domain request or not
	*
	* @param url URL to check
	* @returns True if cross domain, false otherwise
	*/
	function isCrossDomain(url) {
		return new URL(url, window.location.origin).origin !== window.location.origin;
	}
	/**
	* Get the HTTP method from the Ajax request options
	*
	* @param options Ajax options
	* @returns HTTP verb
	*/
	function httpMethod(options) {
		let method = "GET";
		if (options.type) method = options.type;
		if (options.method) method = options.method;
		return method.toUpperCase();
	}
	/**
	* Get the query parameters based on the options (method, cache and data all
	* need to be considered).
	*
	* @param options Ajax options
	* @returns URL string
	*/
	function queryParams(options) {
		let requestParams = [];
		if (httpMethod(options) === "GET") requestParams.push(serialize(options.data, options.traditional));
		if (httpMethod(options) === "DELETE" && (options.deleteBody === void 0 || options.deleteBody === true)) {
			requestParams.push(serialize(options.data, options.traditional));
			delete options.data;
		}
		if (options.cache === false) requestParams.push(serialize({ _: +/* @__PURE__ */ new Date() }));
		return convertSpaces(requestParams.filter((d) => !!d).join("&"), options);
	}
	/**
	* Convert an object into a list of parameters for a query request. Supports
	* jQuery traditional option for legacy applications.
	*
	* @param obj Object to convert
	* @param traditional If jQuery old style should be used
	* @returns Parameter-ized string
	*/
	function serialize(obj, traditional = false) {
		var params = [];
		if (obj === void 0 || obj === null) return "";
		serializeNested(params, obj, traditional);
		return params.join("&");
	}
	/**
	* Recursive serialisation function
	*
	* @param params Array to write the serialised parameters to
	* @param obj Object / array to serialise
	* @param traditional Traditional flag for legacy
	* @param scope Recursive scope
	*/
	function serializeNested(params, obj, traditional, scope = "") {
		let array = Array.isArray(obj);
		for (let key in obj) {
			let value = obj[key];
			let nestDown = Array.isArray(value) || !traditional && plainObject(value);
			if (scope) {
				let index = !array || nestDown ? key : "";
				key = traditional ? scope : scope + "[" + index + "]";
			}
			if (!scope && array) serializeAdd(params, value.name, value.value);
			else if (nestDown) serializeNested(params, value, traditional, key);
			else serializeAdd(params, key, value);
		}
	}
	/**
	* Add a name / value pair to the list of parameters
	*
	* @param params Parameter values
	* @param name Parameter name
	* @param value Parameter value
	*/
	function serializeAdd(params, name, value) {
		let strVal = typeof value === "function" ? value() : value;
		params.push(encodeURIComponent(name) + "=" + encodeURIComponent(strVal === null ? "" : strVal));
	}
	/**
	* Determine if all values in the array are unique. This means we can short
	* cut the _unique method at the cost of a single loop. A sorted array is used
	* to easily check the values.
	*
	* @param  src Source array
	* @return true if all unique, false otherwise
	*/
	function allUnique(src) {
		if (src.length < 2) return true;
		var sorted = src.slice().sort();
		var last = sorted[0];
		for (var i = 1, iLen = sorted.length; i < iLen; i++) {
			if (sorted[i] === last) return false;
			last = sorted[i];
		}
		return true;
	}
	/**
	* Flatten an array
	*
	* Surprisingly this is faster than [].concat.apply
	* https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	*
	* @param out Array to write to
	* @param val Source array, or single value
	* @returns Flattened array
	*/
	function flatten(out, val) {
		if (Array.isArray(val) || arrayLike(val)) for (var i = 0; i < val.length; i++) flatten(out, val[i]);
		else out.push(val);
		return out;
	}
	function intersection(a1, a2) {
		return a1.filter((item) => a2.includes(item));
	}
	/**
	* Pluck items from an array of objects, or from a nested array of objects
	*
	* @param a Array to get values from
	* @param prop Property to read values from
	* @param prop2 Inner property to get values from if a 2D array
	* @returns Array of read values
	*/
	function pluck(a, prop, prop2) {
		let out = [], i = 0, iLen = a.length;
		if (prop2 !== void 0) {
			for (; i < iLen; i++) if (a[i] && a[i][prop]) out.push(a[i][prop][prop2]);
		} else for (; i < iLen; i++) if (a[i]) out.push(a[i][prop]);
		return out;
	}
	/**
	* Basically the same as _pluck, but rather than looping over the source array we use `order`
	* as the indexes to pick from the source array
	*
	* @param a Array to get values from
	* @param order Indexes to pick
	* @param prop Property to read values from
	* @param prop2 Inner property to get values from if a 2D array
	* @returns Array of read values
	*/
	function pluckOrder(a, order, prop, prop2) {
		let out = [], i = 0, iLen = order.length;
		if (prop2 !== void 0) {
			for (; i < iLen; i++) if (a[order[i]] && a[order[i]][prop]) out.push(a[order[i]][prop][prop2]);
		} else for (; i < iLen; i++) if (a[order[i]]) out.push(a[order[i]][prop]);
		return out;
	}
	function range(len, start) {
		var out = [];
		var end;
		if (start === void 0) {
			start = 0;
			end = len;
		} else {
			end = start;
			start = len;
		}
		for (var i = start; i < end; i++) out.push(i);
		return out;
	}
	/**
	* Remove all falsy values from an array
	*
	* @param a Source array
	* @returns A new array, with empty values removed
	*/
	function removeEmpty(a) {
		var out = [];
		for (var i = 0, iLen = a.length; i < iLen; i++) if (a[i]) out.push(a[i]);
		return out;
	}
	/**
	* Join data from an array, but only for specific columns.
	*
	* Performance testing for this available here:
	* https://jsperf.app/vejijo/2/preview.
	*
	* @param src Data source array to pick from
	* @param use Indexes we want from the array
	* @returns Joined string
	*/
	function selectiveJoin(src, use) {
		if (typeof use === "number") return "" + src[use];
		if (use.length === 0) return "";
		let result = "" + src[use[0]];
		for (let i = 1; i < use.length; i++) result += "  " + src[use[i]];
		return result;
	}
	/**
	* Find the unique elements in a source array.
	*
	* @param src Source array
	* @return Array of unique items
	*/
	function unique(src) {
		if (Array.from && Set) return Array.from(new Set(src));
		if (allUnique(src)) return src.slice();
		var out = [], val, i, iLen = src.length, j, k = 0;
		again: for (i = 0; i < iLen; i++) {
			val = src[i];
			for (j = 0; j < k; j++) if (out[j] === val) continue again;
			out.push(val);
			k++;
		}
		return out;
	}
	var array = /*#__PURE__*/ Object.freeze({
		__proto__: null,
		flatten,
		intersection,
		pluck,
		pluckOrder,
		range,
		removeEmpty,
		selectiveJoin,
		unique
	});
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	/**
	* Split string on periods, taking into account escaped periods
	*
	* @param str String to split
	* @return Split string
	*/
	function splitObjNotation(str) {
		return (str.match(/(\\.|[^.])+/g) || [""]).map(function(s) {
			return s.replace(/\\\./g, ".");
		});
	}
	/**
	* Create a function that will read data a common data point from different (but same structure)
	* data objects. This is primarily used to get data for a specific cell in a single column, but it
	* can also be used in other places, such as when using JSON notation.
	*
	* @param dataPoint The data point to get
	* @returns Function to get a data point's value from a source.
	*/
	function get$1(dataPoint) {
		if (dataPoint === null) return function(data) {
			return data;
		};
		else if (typeof dataPoint === "function") return function(data, type, row, meta) {
			return dataPoint(data, type, row, meta);
		};
		else if (typeof dataPoint === "string" && (dataPoint.indexOf(".") !== -1 || dataPoint.indexOf("[") !== -1 || dataPoint.indexOf("(") !== -1)) {
			let fetchData = function(data, type, src) {
				let arrayNotation, funcNotation, out, innerSrc;
				if (src !== "") {
					let a = splitObjNotation(src);
					for (let i = 0, iLen = a.length; i < iLen; i++) {
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
						if (arrayNotation) {
							a[i] = a[i].replace(__reArray, "");
							if (a[i] !== "") data = data[a[i]];
							out = [];
							a.splice(0, i + 1);
							innerSrc = a.join(".");
							if (Array.isArray(data)) for (let j = 0, jLen = data.length; j < jLen; j++) out.push(fetchData(data[j], type, innerSrc));
							let join = arrayNotation[0].substring(1, arrayNotation[0].length - 1);
							data = join === "" ? out : out.join(join);
							break;
						} else if (funcNotation) {
							a[i] = a[i].replace(__reFn, "");
							data = data[a[i]]();
							continue;
						}
						if (data === null || data[a[i]] === null) return null;
						else if (data === void 0 || data[a[i]] === void 0) return;
						data = data[a[i]];
					}
				}
				return data;
			};
			return function(data, type) {
				return fetchData(data, type, dataPoint);
			};
		} else if (plainObject(dataPoint)) {
			let o = {};
			each(dataPoint, function(key, val) {
				if (val) o[key] = get$1(val);
			});
			return function(data, type, row, meta) {
				let t = o[type] || o._;
				return t !== void 0 ? t(data, type, row, meta) : data;
			};
		} else return function(data) {
			return data[dataPoint];
		};
	}
	/**
	* Write a value into an existing data store
	*
	* @param dataPoint The data point to write to
	*/
	function set$1(dataPoint) {
		if (dataPoint === null) return function() {};
		else if (typeof dataPoint === "function") return function(data, val, meta) {
			dataPoint(data, "set", val, meta);
		};
		else if (typeof dataPoint === "string" && (dataPoint.indexOf(".") !== -1 || dataPoint.indexOf("[") !== -1 || dataPoint.indexOf("(") !== -1)) {
			let setData = function(data, val, src) {
				let a = splitObjNotation(src), b;
				let aLast = a[a.length - 1];
				let arrayNotation, funcNotation, o, innerSrc;
				for (let i = 0, iLen = a.length - 1; i < iLen; i++) {
					if (a[i] === "__proto__" || a[i] === "constructor") throw new Error("Cannot set prototype values");
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
					if (arrayNotation) {
						a[i] = a[i].replace(__reArray, "");
						data[a[i]] = [];
						b = a.slice();
						b.splice(0, i + 1);
						innerSrc = b.join(".");
						if (Array.isArray(val)) for (let j = 0, jLen = val.length; j < jLen; j++) {
							o = {};
							setData(o, val[j], innerSrc);
							data[a[i]].push(o);
						}
						else data[a[i]] = val;
						return;
					} else if (funcNotation) {
						a[i] = a[i].replace(__reFn, "");
						data = data[a[i]](val);
					}
					if (data[a[i]] === null || data[a[i]] === void 0) data[a[i]] = {};
					data = data[a[i]];
				}
				if (aLast.match(__reFn)) data = data[aLast.replace(__reFn, "")](val);
				else data[aLast.replace(__reArray, "")] = val;
			};
			return function(data, val) {
				return setData(data, val, dataPoint);
			};
		} else if (plainObject(dataPoint)) return set$1(dataPoint._);
		else return function(data, val) {
			data[dataPoint] = val;
		};
	}
	var data = /*#__PURE__*/ Object.freeze({
		__proto__: null,
		get: get$1,
		set: set$1
	});
	var __bootstrap;
	var __foundation;
	var __luxon$1;
	var __moment$1;
	var __dateTime;
	var __dataTable;
	var __jquery;
	/**
	* Set the libraries that DataTables uses, or the global objects.
	* Note that the arguments can be either way around (legacy support)
	* and the second is optional. See docs.
	*/
	function external(arg1, arg2) {
		var module = typeof arg1 === "string" ? arg2 : arg1;
		var type = typeof arg2 === "string" ? arg2 : arg1;
		if (module === void 0 && typeof type === "string") switch (type) {
			case "lib":
			case "jq": return __jquery !== void 0 ? __jquery : window.jQuery || null;
			case "win": return window;
			case "datatable": return __dataTable;
			case "datetime": return __dateTime;
			case "luxon": return __luxon$1 || window.luxon || null;
			case "moment": return __moment$1 || window.moment || null;
			case "bootstrap": return __bootstrap || window.bootstrap || null;
			case "foundation": return __foundation || window.Foundation || null;
			default: return null;
		}
		if (type === "lib" || type === "jq" || module && module.fn && module.fn.jquery) {
			__jquery = module;
			jQuerySetup();
		} else if (type === "datatable" || module && module.isDataTable) __dataTable = module;
		else if (type === "win" || module && module.document) {
			window = module;
			document = module.document;
		} else if (type === "datetime" || module && module.type === "DateTime") __dateTime = module;
		else if (type === "luxon" || module && module.FixedOffsetZone) __luxon$1 = module;
		else if (type === "moment" || module && module.isMoment) __moment$1 = module;
		else if (type === "bootstrap" || module && module.Modal && module.Modal.NAME === "modal") __bootstrap = module;
		else if (type === "foundation" || module && module.Reveal) __foundation = module;
	}
	/**
	* Attach jQuery to DataTables
	*/
	function jQuerySetup() {
		if (!__dataTable || !__jquery) return;
		__dataTable.$ = __jquery;
		__jquery.fn.dataTable = __dataTable;
		__jquery.fn.DataTable = function(options) {
			return new __dataTable(this.toArray(), options);
		};
		__jquery.fn.dataTableSettings = __dataTable.ext.settings;
		__jquery.fn.dataTableExt = __dataTable.ext;
		each(__dataTable, function(prop, val) {
			__jquery.fn.DataTable[prop] = val;
		});
	}
	function debounce(fn, timeout = 250) {
		let timer;
		return function(...args) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn.call(this, ...args);
			}, timeout);
		};
	}
	function throttle(fn, freq = 200) {
		let last, timer;
		return function(...args) {
			const now = +/* @__PURE__ */ new Date();
			if (last && now < last + freq) {
				clearTimeout(timer);
				timer = setTimeout(() => {
					last = void 0;
					fn.call(this, ...args);
				}, freq);
			} else {
				last = now;
				fn.call(this, ...args);
			}
		};
	}
	var timer = /*#__PURE__*/ Object.freeze({
		__proto__: null,
		debounce,
		throttle
	});
	/**
	* Provide a common method for plug-ins to check the version of DataTables being
	* used, in order to ensure compatibility.
	*
	* @param version1 Version string to check for, in the format "X.Y.Z". Note that
	*   the formats "X" and "X.Y" are also acceptable.
	* @param version2 As above, but optional. If not given the current DataTables
	*   version will be used.
	* @returns true if this version of DataTables is greater or equal to the
	*   required version, or false if this version of DataTales is not suitable
	*/
	function check$1(version1, version2) {
		let dt = external("datatable");
		var parts1 = version2 ? version2.split(".") : dt.ext.version.split(".");
		var parts2 = version1.split(".");
		var int1, int2;
		for (var i = 0, iLen = parts2.length; i < iLen; i++) {
			int1 = parseInt(parts1[i], 10) || 0;
			int2 = parseInt(parts2[i], 10) || 0;
			if (int1 === int2) continue;
			return int1 > int2;
		}
		return true;
	}
	var util = {
		ajax,
		array,
		conv,
		data,
		/** @see timer.debounce */
		debounce,
		/** @see string.normalize */
		diacritics: normalize,
		/** @see string.escapeHtml */
		escapeHtml,
		/** @see string.escapeRegex */
		escapeRegex,
		external,
		/** @see data.get */
		get: get$1,
		is,
		object,
		regex,
		/** @see data.set */
		set: set$1,
		string,
		/** @see string.stripHtml */
		stripHtml,
		/** @see timer.throttle */
		throttle,
		timer,
		/** @see array.unique */
		unique,
		version: /* @__PURE__ */ Object.freeze({
			__proto__: null,
			check: check$1
		})
	};
	/** Each element with an event attached needs a unique id */
	var _uidCounter = 1;
	/**
	* All wrapped event handlers are stored in this array so we can refer back to
	* them for removal. Each entry in the array is for a unique element, using the
	* index to refer to it (the `uid` that is attached to the element).
	*/
	var _eventStore = [];
	/**
	* Get a unique id that can be assigned to an element.
	*
	* @returns UID
	*/
	function getUid(el) {
		if (!el._event_uid) el._event_uid = _uidCounter++;
		return el._event_uid;
	}
	/**
	* Get all event handlers that have been assigned to an element
	*
	* @param el Element
	* @returns Array of functions
	*/
	function get(el) {
		let uid = el._event_uid;
		if (!uid || !_eventStore[uid]) return null;
		return _eventStore[uid];
	}
	/**
	* Store an event handler for an element (does not apply it)
	*
	* @param el Element
	* @param wrapper Function to set
	*/
	function set(el, wrapper) {
		let uid = getUid(el);
		if (_eventStore[uid] === void 0) _eventStore[uid] = [];
		_eventStore[uid].push(wrapper);
	}
	/**
	* Remove an event handler from an element's store
	*
	* @param el Element
	* @param wrapper Function to set
	* @returns void
	*/
	function remove$1(el, wrapper) {
		let store = get(el);
		if (!store) return;
		let idx = store.indexOf(wrapper);
		if (idx !== -1) store.splice(idx, 1);
	}
	var _mouseEvents = [
		"click",
		"dblclick",
		"mousedown",
		"mouseenter",
		"mouseleave",
		"mousemove",
		"mouseout",
		"mouseover",
		"mouseup"
	];
	/**
	* Add a property to an event object.
	*
	* @param event Event
	* @param name Property name
	* @param value Value to give the value
	*/
	function setEventProp(event, name, value) {
		Object.defineProperty(event, name, {
			configurable: true,
			get() {
				return value;
			}
		});
	}
	/**
	* Check that an element matches a given selector for a given event (ie its
	* target)
	*
	* @param el Root element
	* @param selector CSS selector
	* @param event Event that
	* @returns The matching element if there is one
	*/
	function delegateTarget(el, selector, event) {
		let elements = Array.from(el.querySelectorAll(selector));
		let target = event.target;
		for (; target && target !== this; target = target.parentNode) for (let element of elements) {
			if (element !== target) continue;
			return target;
		}
	}
	/**
	* Get the event name and namespaces from a string
	*
	* @param original event name and dot delimited namespaces
	* @returns Object with split parts
	*/
	function parseEventName(original) {
		if (!original) return {
			eventName: null,
			namespaces: []
		};
		let parts = original.split(".");
		let name = parts.shift();
		let isHover = false;
		let isFocus = false;
		if (name === "mouseenter") {
			name = "mouseover";
			isHover = true;
		} else if (name === "mouseleave") {
			name = "mouseout";
			isHover = true;
		} else if (name === "focus") {
			name = "focusin";
			isFocus = true;
		} else if (name === "blur") {
			name = "focusout";
			isFocus = true;
		} else if (name === "ready") name = "DOMContentLoaded";
		return {
			eventName: name,
			isFocus,
			isHover,
			namespaces: parts
		};
	}
	/**
	* Add an event listener to a function
	*
	* @param el The element to add an event handler to
	* @param nameFull Event name. This can optionally be followed by a dot
	*   separated list of namespaces, a la jQuery. This allows for easy event
	*   removal and also matching triggering.
	* @param handler Callback function to execute
	* @param selector Delegate selector. `null` for non-delegate events
	* @param one Indicate if the event handler should execute only once and then be
	*   removed.
	*/
	function add(el, nameFull, handler, selector, one) {
		let jq = external("jq");
		if (jq) {
			let method = one ? "one" : "on";
			if (selector) jq(el)[method](nameFull, selector, handler);
			else jq(el)[method](nameFull, handler);
			return;
		}
		let { eventName, namespaces, isFocus, isHover } = parseEventName(nameFull);
		if (!eventName) return;
		if (el === document && eventName === "DOMContentLoaded" && nameFull.includes("ready")) {
			if (document.readyState === "complete") {
				handler(new Event("DOMContentLoaded"));
				return;
			}
		}
		let wrapped = function(event) {
			let callScope = el;
			if (event.namespace && !intersection(namespaces, event.namespace.split(".")).length) return;
			if (!selector && (isFocus && event.target !== el || isHover && event.relatedTarget && el.contains(event.relatedTarget))) return;
			if (selector) {
				let dTarget = delegateTarget(el, selector, event);
				if (!dTarget) return;
				if (isHover && event.relatedTarget && dTarget.contains(event.relatedTarget)) return;
				callScope = dTarget;
			}
			setEventProp(event, "currentTarget", callScope);
			setEventProp(event, "delegateTarget", el);
			setEventProp(event, "relatedTarget", event.relatedTarget);
			let retVal = handler.apply(callScope, [event, ...event._args || []]);
			if (one) remove(el, eventName, handler, selector);
			if (retVal === false) {
				event.preventDefault();
				event.stopPropagation();
			}
			event.result = retVal;
		};
		wrapped.delegateSelector = selector;
		wrapped.original = handler;
		wrapped.one = one;
		wrapped.type = eventName;
		wrapped.namespaces = namespaces;
		set(el, wrapped);
		el.addEventListener(eventName, wrapped);
	}
	/**
	* Remove an event from an element
	*
	* @param el The element to remove the event(s) from
	* @param nameFull Event name and / or dot separated namespaces
	* @param handler The function to remove (optional)
	* @param selector Delegate selector (optional)
	*/
	function remove(el, nameFull, handler, selector) {
		let jq = external("jq");
		if (jq) {
			if (selector) jq(el).off(nameFull, selector, handler);
			else jq(el).off(nameFull, handler);
			return;
		}
		let { eventName, namespaces } = parseEventName(nameFull);
		let removeEvents = [];
		let stored = get(el);
		if (stored === null) return;
		if (eventName && selector && handler) removeEvents = stored.filter((wrapped) => wrapped.type === eventName && wrapped.delegateSelector === selector && wrapped.original === handler);
		else if (eventName && selector) removeEvents = stored.filter((wrapped) => wrapped.type === eventName && wrapped.delegateSelector === selector);
		else if (eventName && handler) removeEvents = stored.filter((wrapped) => wrapped.type === eventName && wrapped.original === handler);
		else if (eventName) removeEvents = stored.filter((wrapped) => wrapped.type === eventName);
		else removeEvents = stored;
		if (namespaces.length) removeEvents = removeEvents.filter((ev) => ev.namespaces.filter((ns) => namespaces.includes(ns)).length === namespaces.length);
		removeEvents.forEach((wrapped) => {
			remove$1(el, wrapped);
			el.removeEventListener(wrapped.type, wrapped);
		});
	}
	/**
	* Trigger an event on an element. Can have extra data given, which is useful
	* for custom events.
	*
	* @param el Element to trigger the event on
	* @param nameFull Event name with optional dot separated namespaces
	* @param bubbles If the event should bubble up through the DOM or not
	* @param args Array of arguments to pass to the event handler
	* @param eventProps Object of extra parameters to attach to the event object
	* @param returnEvent Indicate if the return should be the event object (for
	*   further processing) or the default prevented state.
	* @returns `true` if default was NOT prevented, `false` if default was
	*   prevented. If `returnEvent` is `true` then the return will be the event
	*   object.
	*/
	function trigger(el, nameFull, bubbles = false, args = [], eventProps = null, returnEvent = false) {
		let jq = external("jq");
		if (jq) {
			let method = bubbles ? "trigger" : "triggerHandler";
			let ev = jq.Event(nameFull);
			each(eventProps, (key, val) => {
				setEventProp(ev, key, val);
			});
			jq(el)[method](ev, args || []);
			if (returnEvent) {
				ev.defaultPrevented = ev.isDefaultPrevented();
				return ev;
			}
			return !ev.isDefaultPrevented();
		}
		let { eventName, namespaces } = parseEventName(nameFull);
		if (!eventName) return false;
		let event = _mouseEvents.includes(eventName.toLowerCase()) ? new MouseEvent(eventName, {
			bubbles,
			cancelable: true
		}) : new Event(eventName, {
			bubbles,
			cancelable: true
		});
		setEventProp(event, "namespace", namespaces.join("."));
		setEventProp(event, "_args", args || []);
		each(eventProps, (key, val) => setEventProp(event, key, val));
		el.dispatchEvent(event);
		return returnEvent ? event : !event.defaultPrevented;
	}
	var win = {
		/**
		* Get the height of the window, excluding a horizontal scrollbar if it is
		* present.
		*
		* @returns Height in pixels
		*/
		height() {
			var _a;
			return ((_a = document.querySelector("html")) === null || _a === void 0 ? void 0 : _a.clientHeight) || 0;
		},
		/**
		* Remove an event handler from the window
		*
		* @param name Event name (can include or just be a namespace)
		* @param cb Event callback function
		*/
		off(name, cb = null) {
			remove(window, name, cb, null);
		},
		/**
		* Add an event handler to the window
		*
		* @param name Event name (can include a namespace)
		* @param cb Event callback function
		*/
		on(name, cb) {
			add(window, name, cb, null, false);
		},
		/**
		* Add an event handler to the window that will execute just once
		*
		* @param name Event name (can include a namespace)
		* @param cb Event callback function
		*/
		one(name, cb) {
			add(window, name, cb, null, true);
		},
		/**
		* Get the left scroll offset of the window / document
		*
		* @param set Set the scroll position
		* @returns Window X scroll offset in pixels
		*/
		scrollLeft(set) {
			if (set !== void 0) window.scrollX = set;
			return window.scrollX;
		},
		/**
		* Get the top scroll offset of the window / document
		*
		* @param set Set the scroll position
		* @returns Window Y scroll offset in pixels
		*/
		scrollTop(set) {
			if (set !== void 0) window.scrollY = set;
			return window.scrollY;
		},
		/**
		* Get the width of the window, excluding a vertical scrollbar if it is
		* present.
		*
		* @returns Width in pixels
		*/
		width() {
			var _a;
			return ((_a = document.querySelector("html")) === null || _a === void 0 ? void 0 : _a.clientWidth) || 0;
		}
	};
	function create$3(name) {
		return new Dom$1(document.createElement(name));
	}
	function select(selector) {
		return new Dom$1(selector);
	}
	/**
	* `Dom` is a class that provides a chaining UI for simple DOM manipulation and
	* selection.
	*/
	var Dom$1 = class Dom$1 {
		/**
		* `Dom` is used for selection and manipulation of the DOM elements in a
		* chaining interface.
		*
		* @param selector
		*/
		constructor(selector) {
			/** Number of elements in the array */
			this.length = 0;
			/** Flag to indicate that this is a Dom instance */
			this._isDom = true;
			if (selector) this.add(selector);
		}
		/**
		* Add an element (or multiple) to the instance. Will ensure uniqueness.
		*
		* @param selector Element(s) to add
		* @param sort Indicate if the element should be added in document order.
		* @returns Self for chaining
		*/
		add(selector, sort = true) {
			if (selector) {
				if (typeof selector === "string") {
					let elements = Array.from(document.querySelectorAll(selector));
					addArray(this, elements);
				} else if (selector instanceof Dom$1) addArray(this, selector.get());
				else if (typeof selector === "object" && !selector.nodeName && selector.length !== void 0) {
					let arrayLike = selector;
					for (let i = 0; i < arrayLike.length; i++) addArray(this, arrayLike[i]);
					sort = false;
				} else addArray(this, selector);
			}
			if (sort) this.sort();
			return this;
		}
		/**
		* Insert the given content to each item in the result set.
		*
		* Limit your result set to a single item!
		*
		* @param content The content to append
		* @returns Self for chaining
		*/
		append(content) {
			if (!content) return this;
			if (!arrayLike(content)) content = [content];
			let flatContent = flatten([], content).filter((c) => !!c);
			if (flatContent.find((val) => typeof val === "string")) return this.each((el) => {
				for (let i = 0; i < flatContent.length; i++) if (typeof flatContent[i] === "string") el.insertAdjacentHTML("beforeend", flatContent[i]);
				else el.append(flatContent[i]);
			});
			return this.each((el) => {
				let fragment = new DocumentFragment();
				for (let i = 0; i < flatContent.length; i++) fragment.append(flatContent[i]);
				el.append(fragment);
			});
		}
		/**
		* Append the current data set items to the element from the selector
		*
		* @param selector
		*/
		appendTo(selector) {
			(selector instanceof Dom$1 ? selector : new Dom$1(selector)).append(this);
			return this;
		}
		attr(name, value) {
			if (typeof name === "string" && value === void 0) return this.count() ? this[0].getAttribute(name) : null;
			return this.each((el) => {
				if (typeof name === "string") {
					if (value !== void 0 && value !== null) el.setAttribute(name, typeof value === "string" ? value : value.toString());
				} else each(name, (key, val) => {
					if (val !== void 0 && val !== null) el.setAttribute(key, val);
				});
			});
		}
		/**
		* Remove an attribute on each element in the result set
		*
		* @param attr Attribute to remove
		* @returns Self for chaining
		*/
		attrRemove(attr) {
			return this.each((el) => el.removeAttribute(attr));
		}
		/**
		* Blur on the target elements
		*
		* @returns Self for chaining
		*/
		blur() {
			return this.each((el) => el.blur());
		}
		/**
		* Get the child from all elements in the result set
		*
		* @param selector Query string that the child much match to be selected
		* @returns New Dom instance with children as the result set
		*/
		children(selector) {
			return this.map((el) => {
				let children = Array.from(el.children);
				return selector ? children.filter((child) => child.matches(selector)) : children;
			});
		}
		/**
		* Add one or more class names to the result set
		*
		* @param name Class name(s) to set
		* @returns Self for chaining
		*/
		classAdd(name) {
			if (!name) return this;
			let names = stringArrays(name);
			return this.each((el) => {
				names.filter((n) => n).forEach((n) => el.classList.add(n));
			});
		}
		/**
		* Check if the first element in the result set has the given class
		*
		* @param name Class name to check for
		* @returns Self for chaining
		*/
		classHas(name) {
			return this.count() ? this[0].classList.contains(name) : false;
		}
		/**
		* Remove the given class(s) from all elements in the result set
		*
		* @param name Class name to remove
		* @returns Self for chaining
		*/
		classRemove(name) {
			if (!name) return this;
			let names = stringArrays(name);
			return this.each((el) => {
				names.filter((n) => n).forEach((n) => el.classList.remove(n));
			});
		}
		/**
		* Toggle a class on all elements in the result set
		*
		* @param name Class name(s) to toggle - space separated
		* @param toggle Toggle on or off
		* @returns Self for chaining
		*/
		classToggle(name, toggle) {
			let names = Array.isArray(name) ? name : name.split(" ");
			return this.each((el) => {
				names.filter((n) => n).forEach((n) => el.classList.toggle(n, toggle));
			});
		}
		/**
		* Clone the nodes in the result set and return a new instance
		*
		* @param deep Include the subtree (`true`) or not (`false` - default)
		* @returns New Dom instance with new elements
		*/
		clone(deep = false) {
			return this.map((el) => el.cloneNode(deep));
		}
		/**
		* Find the closest ancestor for each element in the result set
		*
		* @param selector
		* @returns New Dom instance when the matching ancestors
		*/
		closest(selector) {
			if (typeof selector === "string") return this.map((el) => el.closest(selector));
			return this.map((el) => {
				while (el.parentElement) {
					if (el.parentElement === selector) return selector;
					el = el.parentElement;
				}
				return null;
			});
		}
		/**
		* Determine if the result set contains the element specified. Shorthand for
		* .find().count()
		*
		* @param input Element / selector to look for
		* @returns true if it does contain, false otherwise
		*/
		contains(input) {
			return this.find(input).count() !== 0;
		}
		/**
		* Get the number of elements in the current result set
		*
		* @returns Number of elements
		*/
		count() {
			return this.length;
		}
		css(rule, value) {
			if (typeof rule === "string" && value === void 0) return this.length ? getComputedStyle(this[0])[rule] : null;
			return this.each((el) => {
				if (typeof rule === "string") el.style[rule] = value;
				else Object.assign(el.style, rule);
			});
		}
		data(name, value) {
			if (!name) {
				let out = {};
				if (!this.count()) return out;
				util.object.each(this[0].dataset, (key, val) => {
					out[key] = dataConvert(val);
				});
				return out;
			}
			if (typeof name === "string" && value === void 0) return this.length ? dataConvert(this[0].dataset[name]) : null;
			if (typeof name === "string") this.each((el) => el.dataset[name] = JSON.stringify(value));
			else each(name, (key, val) => {
				this.each((el) => el.dataset[key] = JSON.stringify(val));
			});
			return this;
		}
		/**
		* Remove the elements in the result set from the document. Does not remove
		* event listeners.
		*
		* @returns Self for chaining
		*/
		detach() {
			return this.each((el) => el.remove());
		}
		/**
		* Remove the child elements from each element in the result set from the
		* document. Does not remove event listeners.
		*
		* @returns Self for chaining
		*/
		detachChildren() {
			return this.each((el) => {
				el.replaceChildren();
			});
		}
		/**
		* Iterate over each item in the result set and perform an action
		*
		* @param callback Callback function
		* @returns Self for chaining
		*/
		each(callback) {
			for (let i = 0; i < this.length; i++) {
				let el = this[i];
				callback.call(el, el, i);
			}
			return this;
		}
		/**
		* Inverse iteration over each item in the result set and perform an action
		*
		* @param callback Callback function
		* @returns Self for chaining
		*/
		eachReverse(callback) {
			for (let i = this.length - 1; i >= 0; i--) {
				let el = this[i];
				callback.call(el, el, i);
			}
			return this;
		}
		/**
		* Remove all children
		*
		* @returns Self for chaining
		*/
		empty() {
			return this.each((el) => {
				var _a;
				if (el.replaceChildren) el.replaceChildren();
				else while (el.childNodes.length) (_a = el.firstChild) === null || _a === void 0 || _a.remove();
			});
		}
		/**
		* Get a new Dom instance with just a specific element from the result set
		*
		* @param idx The element to use
		* @returns New Dom instance
		*/
		eq(idx) {
			return idx < this.count() ? new Dom$1(this.get(idx)) : new Dom$1();
		}
		get(idx) {
			return idx !== void 0 ? this[idx] : Array.from(this);
		}
		/**
		* Call focus on the target elements
		*
		* @returns Self for chaining
		*/
		focus() {
			return this.each((el) => el.focus());
		}
		/**
		* Reduce the result set based on a given filter, which can be a CSS
		* selector, an element or array of elements.
		*
		* @param filter Optional selector or function that the result set element
		*   would need to match to be selected.
		* @returns New Dom instance containing the filters elements
		*/
		filter(filter) {
			return this.map((el) => {
				if (filter === void 0) return el;
				if (typeof filter === "function") return filter(el) ? el : null;
				if (typeof filter !== "string") {
					if (arrayLike(filter)) return Array.from(filter).includes(el) ? el : null;
					return filter === el ? el : null;
				}
				if (!el.matches(filter)) return null;
				if (!el.parentNode && (filter.match(/:\w+-child/) || filter.match(/:\w+-of-type/))) return null;
				return el;
			});
		}
		/**
		* Get all matching descendants
		*
		* @param input Elements to find
		* @returns A new Dom instance with all matching elements
		*/
		find(input) {
			if (input === null) return new Dom$1();
			if (typeof input === "string") return this.map((el) => Array.from(el.querySelectorAll(input)));
			let selector = input instanceof Dom$1 ? input.get() : input;
			let hasParent = false;
			this.each((el) => {
				if (new Dom$1(selector).closest(el).count()) hasParent = true;
			});
			return new Dom$1(hasParent ? selector : []);
		}
		/**
		* Get the last element in the result set
		*
		* @returns New instance with just the selected item
		*/
		first() {
			return new Dom$1(this.length ? this[0] : null);
		}
		height(include) {
			if (!this.count()) return 0;
			if (include === void 0 || include === "withPadding" || include === "withBorder" || include === "withMargin" || include === "inner" || include === "outer") {
				let el = this[0];
				let computed = window.getComputedStyle(this[0]);
				let rectHeight = el.getBoundingClientRect().height;
				if (!include || include === "content") {
					let barHeight = el.offsetHeight - parseFloat(computed.borderTop) - parseFloat(computed.borderBottom) - el.clientHeight;
					return rectHeight - parseFloat(computed.paddingTop) - parseFloat(computed.paddingBottom) - parseFloat(computed.borderTop) - parseFloat(computed.borderBottom) - barHeight;
				} else if (include === "withPadding" || include === "inner") return rectHeight - parseFloat(computed.borderTop) - parseFloat(computed.borderBottom);
				else if (include === "withBorder") return rectHeight;
				else return rectHeight + parseFloat(computed.marginTop) + parseFloat(computed.marginBottom);
			} else return this.each((el) => el.style.height = typeof include === "string" ? include : include + "px");
		}
		/**
		* Hide an element by setting it to `display: none`
		*
		* @returns Self for chaining
		*/
		hide() {
			return this.each((el) => {
				el.style.display = "none";
			});
		}
		html(data) {
			if (data !== void 0) return this.each((el) => {
				el.innerHTML = data;
			});
			else return this.count() ? this[0].innerHTML : null;
		}
		/**
		* Boolean return check on if an item in the result set matches the selector
		* given. Only one need match.
		*
		* @param selector Selector to match against
		* @returns Boolean true if there is a match
		*/
		is(selector) {
			return this.filter(selector).count() > 0;
		}
		/**
		* Determine if the first element in the result set is in the document or
		* not
		*
		* @returns true if is, false if detached
		*/
		isAttached() {
			if (this.count() === 0) return false;
			return document.body.contains(this[0]);
		}
		/**
		* Determine if the first element in the result set is visible or not.
		*
		* @returns Visibility flag
		*/
		isVisible() {
			if (this.count() === 0) return false;
			let el = this[0];
			return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
		}
		/**
		* Get the index of an element from among its siblings
		*
		* @returns Element index
		*/
		index() {
			if (this.count()) {
				let el = this[0];
				return Array.from(el.parentNode.children).indexOf(el);
			}
			return -1;
		}
		/**
		* Insert each element in the result set after a target node
		*
		* @param target Element after which the insert should happen
		* @returns Self for chaining
		*/
		insertAfter(target) {
			let nodes = elementArray(target);
			return this.eachReverse((el) => {
				nodes.forEach((n) => {
					var _a;
					return (_a = n === null || n === void 0 ? void 0 : n.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, n.nextSibling);
				});
			});
		}
		/**
		* Insert each element in the result set before a target node
		*
		* @param target Element before which the insert should happen
		* @returns Self for chaining
		*/
		insertBefore(target) {
			let nodes = elementArray(target);
			return this.each((el) => {
				nodes.forEach((n) => {
					var _a;
					return (_a = n === null || n === void 0 ? void 0 : n.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, n);
				});
			});
		}
		/**
		* Get the last element in the result set
		*
		* @returns New instance with just the selected item
		*/
		last() {
			let s = this;
			return new Dom$1(s.length ? s[s.length - 1] : null);
		}
		/**
		* Create a new Dom instance based on the results from a callback function
		* which is executed per element in the result set.
		*
		* @param fn Function to get the elements to add to the new instance
		* @returns New Dom instance with the results from the callback
		*/
		map(fn) {
			let next = new Dom$1();
			this.each((el) => {
				next.add(fn(el), false);
			});
			return next;
		}
		/**
		* Create an array of any data type based on a function returning a value
		* from each element in the result set.
		*
		* @param fn Mapping function
		* @returns Array of returned objects.
		*/
		mapTo(fn) {
			let result = [];
			this.each((el, idx) => result.push(fn(el, idx)));
			return result;
		}
		off(arg1, arg2, arg3) {
			let { handler, names, selector } = normaliseEventParams(arg1, arg2, arg3);
			return this.each((el) => {
				names.forEach((name) => {
					remove(el, name, handler, selector);
				});
			});
		}
		/**
		* Get the offset of the first element in the result set. The offset is the
		* coordinates of the element relative to the document.
		*
		* @returns Object with top and left offset
		*/
		offset() {
			if (!this.count()) return {
				top: 0,
				left: 0
			};
			let box = this[0].getBoundingClientRect();
			let docElem = document.documentElement;
			return {
				top: box.top + window.pageYOffset - docElem.clientTop,
				left: box.left + window.pageXOffset - docElem.clientLeft
			};
		}
		/**
		* Get the offset parents of the elements in the result set.
		*
		* Departure from jQuery - it won't go up to `html`
		*
		* @returns Instance with the result set as the offset parents
		*/
		offsetParent() {
			return this.map((el) => el.offsetParent || document.body);
		}
		on(arg1, arg2, arg3) {
			let { handler, names, selector } = normaliseEventParams(arg1, arg2, arg3);
			return this.each((el) => {
				names.filter((n) => n !== null).forEach((name) => {
					add(el, name, handler, selector, false);
				});
			});
		}
		one(arg1, arg2, arg3) {
			let { handler, names, selector } = normaliseEventParams(arg1, arg2, arg3);
			return this.each((el) => {
				names.filter((n) => n !== null).forEach((name) => {
					add(el, name, handler, selector, true);
				});
			});
		}
		/**
		* Get the parent element for each element in the result set
		*
		* @param filter Optional selector that the parent element would need to
		*   match to be selected.
		* @returns New Dom instance containing the parent elements
		*/
		parent(filter) {
			return this.map((el) => {
				let parent = el.parentElement;
				if (filter) return (parent === null || parent === void 0 ? void 0 : parent.matches(filter)) ? parent : null;
				return parent;
			});
		}
		/**
		* Get the position of the first element in the result set. The position is
		* the coordinates relative to the offset parent.
		*
		* @returns Object with top and left position coordinates
		*/
		position() {
			if (!this.count()) return {
				top: 0,
				left: 0
			};
			let el = this[0];
			let { marginTop, marginLeft } = getComputedStyle(el);
			return {
				top: el.offsetTop - parseInt(marginTop),
				left: el.offsetLeft - parseInt(marginLeft)
			};
		}
		/**
		* Prepend the given content to each item in the result set.
		*
		* You should limit your result set to a single item!
		*
		* @param content Item(s) to prepend
		* @returns Self for chaining
		*/
		prepend(content) {
			return this.each((el) => {
				if (content instanceof Dom$1) Array.from(content).reverse().forEach((item) => el.prepend(item));
				else if (typeof content === "string") el.insertAdjacentHTML("afterbegin", content);
				else el.prepend(content);
			});
		}
		/**
		* Append the current data set items to the element from the selector
		*
		* @param selector Select item to insert result sets into
		* @returns Self for chaining
		*/
		prependTo(selector) {
			if (selector instanceof Dom$1) selector.prepend(this);
			else new Dom$1(selector).prepend(this);
			return this;
		}
		prop(name, value) {
			if (typeof name === "string" && value === void 0) return this.count() ? this[0][name] : null;
			return this.each((el) => {
				el[name] = value;
			});
		}
		/**
		* Remove a property from all elements in the result set
		*
		* @param name Property name to remove
		* @returns Self for chaining
		*/
		propRemove(name) {
			return this.each((el) => {
				delete el[name];
			});
		}
		/**
		* Removed all nodes in the result set from the document
		*
		* @returns Self for chaining
		*/
		remove() {
			return this.each((el) => el.remove());
		}
		/**
		* Replace the elements in the result set with those given.
		*
		* @param replacer Element(s) to insert in place of the originals
		* @returns Self
		*/
		replaceWith(replacer) {
			return this.each((el) => {
				if (replacer instanceof Dom$1) el.replaceWith(...replacer.get());
				else el.replaceWith(replacer);
			});
		}
		scrollLeft(val) {
			if (val === void 0) return this.count() ? this[0].scrollLeft : 0;
			return this.each((el) => el.scrollLeft = val);
		}
		scrollTop(val) {
			if (val === void 0) return this.count() ? this[0].scrollTop : 0;
			return this.each((el) => el.scrollTop = val);
		}
		/**
		* Get the siblings of all elements in the result set
		*
		* @returns New Dom instance containing the sibling elements
		*/
		siblings() {
			return this.map((el) => {
				return el.parentElement ? Array.from(el.parentElement.children).filter((child) => child !== el) : [];
			});
		}
		/**
		* Set the elements in the result set to display as blocks
		*
		* @returns Self for chaining
		* @todo Could be smarter with hide, since some elements might have been a
		*   grid or flex before being hidden.
		*/
		show() {
			return this.each((el) => {
				el.style.display = "block";
			});
		}
		/**
		* Sort the DOM elements into document order.
		*
		* This is normally not needed as elements selected with a DOM selector are
		* automatically sorted in document order. However, in the case of elements
		* being added as an array, their order will be retained. In such as case
		* you might wish to sort them in document order.
		*/
		sort() {
			Array.prototype.sort.call(this, documentOrder);
			return this;
		}
		text(txt) {
			if (txt === void 0) return this.count() ? this[0].textContent : null;
			return this.each((el) => {
				el.textContent = txt;
			});
		}
		/**
		* Perform a CSS transition - i.e. an animation. Note this isn't nearly as
		* comprehensive as an animation library, nor is it meant to be. It is for
		* simple transitions such as fading in only.
		*
		* To set up something like a fade in, do `dom.css({opacity:
		* 0}).transition({opacity: 1})`.
		*
		* @param css CSS properties to transition
		* @param duration Transition duration
		* @param ease CSS easing function name
		* @param cb Callback function
		* @returns Self for chaining
		*/
		transition(css, duration, ease, cb) {
			if (!this.count()) return this;
			if (!duration && duration !== 0) duration = 400;
			if (!ease) ease = "";
			if (!cb) cb = () => {};
			if (Dom$1.transitions && duration !== 0) {
				let first = this[0];
				if (first._dom_tra) {
					clearTimeout(first._dom_tra);
					delete first._dom_tra;
				}
				setTimeout(() => {
					this.css("transition", "all " + duration + "ms " + ease);
					this.css(css);
				}, 0);
				first._dom_tra = setTimeout(() => {
					delete first._dom_tra;
					this.css("transition", "");
					cb.call(this);
				}, duration);
			} else {
				this.css(css);
				cb.call(this);
			}
			return this;
		}
		trigger(name, bubbles = true, args = null, props = null, returnEvent = false) {
			let { names } = normaliseEventParams(name);
			let ret = [];
			this.each((el) => {
				names.filter((n) => n !== null).forEach((name) => {
					ret.push(trigger(el, name, bubbles, args, props, returnEvent));
				});
			});
			return ret;
		}
		val(value) {
			if (value === void 0) {
				if (!this.count()) return null;
				let el = this[0];
				if (el.options && el.multiple) return Array.from(el.options).filter((opt) => opt.selected).map((opt) => opt.value);
				return el.value;
			}
			return this.each((el) => {
				if (el.options && el.multiple) {
					let valArr = Array.isArray(value) ? value : [value];
					Array.from(el.options).forEach((opt) => opt.selected = valArr.includes(opt.value));
				} else el.value = value;
			});
		}
		width(include) {
			if (!this.count()) return 0;
			if (include === void 0 || include === "withPadding" || include === "withBorder" || include === "withMargin" || include === "inner" || include === "outer") {
				let el = this[0];
				let computed = window.getComputedStyle(el);
				let rectWidth = el.getBoundingClientRect().width;
				if (!include || include === "content") {
					let barWidth = el.offsetWidth - parseFloat(computed.borderLeft) - parseFloat(computed.borderRight) - el.clientWidth;
					return rectWidth - parseFloat(computed.paddingLeft) - parseFloat(computed.paddingRight) - parseFloat(computed.borderLeft) - parseFloat(computed.borderRight) - barWidth;
				} else if (include === "withPadding" || include === "inner") return rectWidth - parseFloat(computed.borderLeft) - parseFloat(computed.borderRight);
				else if (include === "withBorder") return rectWidth;
				else return rectWidth + parseFloat(computed.marginLeft) + parseFloat(computed.marginRight);
			} else return this.each((el) => el.style.width = typeof include === "string" ? include : include + "px");
		}
	};
	/**
	* Create a new element and wrap in a `Dom` instance (alias of `create`)
	*
	* @param name Element name to create
	* @returns Dom instance for manipulating the new element
	*/
	Dom$1.c = create$3;
	/**
	* Create a new element and wrap in a `Dom` instance (alias of `c`)
	*
	* @param name Element name to create
	* @returns Dom instance for manipulating the new element
	*/
	Dom$1.create = create$3;
	/**
	* Select items from the document and wrap in a `Dom` instance (alias of
	* `select`)
	*
	* @param selector Items to select
	* @returns Dom instance for manipulating the selected items
	*/
	Dom$1.s = select;
	/**
	* Select items from the document and wrap in a `Dom` instance (alias of
	* `s`)
	*
	* @param selector Items to select
	* @returns Dom instance for manipulating the selected items
	*/
	Dom$1.select = select;
	/**
	* Flag to indicate if transitions (animations) should be allowed. Set to
	* false to disable and have it jump to the end.
	*/
	Dom$1.transitions = true;
	/**
	* Window object methods
	*/
	Dom$1.w = win;
	Dom$1.prototype.addClass = Dom$1.prototype.classAdd;
	Dom$1.prototype.hasClass = Dom$1.prototype.classHas;
	Dom$1.prototype.removeClass = Dom$1.prototype.classRemove;
	/**
	* Convert a data value into a typed value
	*
	* @param val Data to convert
	* @returns Converted value
	*/
	function dataConvert(val) {
		if (val === void 0) return null;
		try {
			return JSON.parse(val);
		} catch (e) {
			return val;
		}
	}
	function normaliseEventParams(name, arg2, arg3) {
		let selector;
		let handler;
		let names = name ? name.split(" ").map((str) => str.trim()) : [null];
		if (typeof arg2 === "string") {
			selector = arg2;
			handler = arg3;
		} else {
			selector = null;
			handler = arg2;
		}
		return {
			handler,
			names,
			selector
		};
	}
	function documentOrder(a, b) {
		if (a === b) return 0;
		let position = a.compareDocumentPosition(b);
		if (position & Node.DOCUMENT_POSITION_DISCONNECTED) {
			if (document.body.contains(a)) return -1;
			else if (document.body.contains(b)) return 1;
			return 0;
		} else if (position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) return -1;
		else if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) return 1;
		else return 0;
	}
	function elementArray(target) {
		return dom(target) ? target.get() : Array.isArray(target) ? target : [target];
	}
	function addArray(store, el) {
		if (util.is.arrayLike(el)) for (var i = 0; i < el.length; i++) {
			let e = el[i];
			if (e !== null && e !== void 0) {
				store[store.length] = e;
				store.length++;
			}
		}
		else if (el !== null && el !== void 0) {
			store[store.length] = el;
			store.length++;
		}
	}
	function stringArrays(name) {
		let names = [];
		let add = function(n) {
			names.push.apply(names, n.split(" "));
		};
		if (Array.isArray(name)) name.forEach((n) => add(n));
		else add(name);
		return names;
	}
	var features = {};
	var legacy = [];
	/**
	* Create a new feature that can be used for layout
	*
	* @param name The name of the new feature.
	* @param cb A function that will create the elements and event listeners for
	* the feature being added.
	* @param legacyChar
	*/
	function register$2(name, cb, legacyChar = "") {
		features[name] = cb;
		if (legacyChar) legacy.push({
			cFeature: legacyChar,
			fnInit: cb
		});
	}
	var classes$1 = {
		container: "dt-container",
		empty: { row: "dt-empty" },
		info: { container: "dt-info" },
		layout: {
			row: "dt-layout-row",
			cell: "dt-layout-cell",
			tableRow: "dt-layout-table",
			tableCell: "",
			start: "dt-layout-start",
			end: "dt-layout-end",
			full: "dt-layout-full"
		},
		length: {
			container: "dt-length",
			select: "dt-input"
		},
		order: {
			canAsc: "dt-orderable-asc",
			canDesc: "dt-orderable-desc",
			isAsc: "dt-ordering-asc",
			isDesc: "dt-ordering-desc",
			none: "dt-orderable-none",
			position: "sorting_"
		},
		processing: { container: "dt-processing" },
		scrolling: {
			body: "dt-scroll-body",
			container: "dt-scroll",
			footer: {
				self: "dt-scroll-foot",
				inner: "dt-scroll-footInner"
			},
			header: {
				self: "dt-scroll-head",
				inner: "dt-scroll-headInner"
			}
		},
		search: {
			container: "dt-search",
			input: "dt-input"
		},
		table: "dataTable",
		tbody: {
			cell: "",
			row: ""
		},
		thead: {
			cell: "",
			row: ""
		},
		tfoot: {
			cell: "",
			row: ""
		},
		paging: {
			active: "current",
			button: "dt-paging-button",
			container: "dt-paging",
			disabled: "disabled",
			nav: ""
		}
	};
	/**
	* Compute what number buttons to show in the paging control
	*
	* @param page Current page
	* @param pages Total number of pages
	* @param buttons Target number of number buttons
	* @param addFirstLast Indicate if page 1 and end should be included
	* @returns Buttons to show
	*/
	function pagingNumbers(page, pages, buttons, addFirstLast) {
		let numbers = [], half = Math.floor(buttons / 2), before = addFirstLast ? 2 : 1, after = addFirstLast ? 1 : 0;
		if (pages <= buttons) numbers = range(0, pages);
		else if (buttons === 1) numbers = [page];
		else if (buttons === 3) {
			if (page <= 1) numbers = [
				0,
				1,
				"ellipsis"
			];
			else if (page >= pages - 2) {
				numbers = range(pages - 2, pages);
				numbers.unshift("ellipsis");
			} else numbers = [
				"ellipsis",
				page,
				"ellipsis"
			];
		} else if (page <= half) {
			numbers = range(0, buttons - before);
			numbers.push("ellipsis");
			if (addFirstLast) numbers.push(pages - 1);
		} else if (page >= pages - 1 - half) {
			numbers = range(pages - (buttons - before), pages);
			numbers.unshift("ellipsis");
			if (addFirstLast) numbers.unshift(0);
		} else {
			numbers = range(page - half + before, page + half - after);
			numbers.push("ellipsis");
			numbers.unshift("ellipsis");
			if (addFirstLast) {
				numbers.push(pages - 1);
				numbers.unshift(0);
			}
		}
		return numbers;
	}
	var pager = {
		simple: function() {
			return ["previous", "next"];
		},
		full: function() {
			return [
				"first",
				"previous",
				"next",
				"last"
			];
		},
		numbers: function() {
			return ["numbers"];
		},
		simple_numbers: function() {
			return [
				"previous",
				"numbers",
				"next"
			];
		},
		full_numbers: function() {
			return [
				"first",
				"previous",
				"numbers",
				"next",
				"last"
			];
		},
		first_last: function() {
			return ["first", "last"];
		},
		first_last_numbers: function() {
			return [
				"first",
				"numbers",
				"last"
			];
		},
		_numbers: pagingNumbers,
		numbers_length: 7
	};
	var footer = (settings, cell, classes) => {
		cell.classAdd(classes.tfoot.cell);
	};
	var header = (settings, cell, classes) => {
		cell.classAdd(classes.thead.cell);
		if (!settings.features.ordering) cell.classAdd(classes.order.none);
		var titleRow = settings.titleRow;
		var headerRows = cell.closest("thead").find("tr");
		var rowIdx = cell.parent().index();
		if (cell.attr("data-dt-order") === "disable" || cell.parent().attr("data-dt-order") === "disable" || titleRow === true && rowIdx !== 0 || titleRow === false && rowIdx !== headerRows.count() - 1 || typeof titleRow === "number" && rowIdx !== titleRow) return;
		Dom$1.s(settings.table).on("order.dt.DT column-visibility.dt.DT", function(e, ctx, column) {
			if (settings !== ctx) return;
			var sorting = ctx.sortDetails;
			if (!sorting) return;
			var orderedColumns = pluck(sorting, "col");
			if (e.type === "column-visibility" && !orderedColumns.includes(column)) return;
			var i;
			var orderClasses = classes.order;
			var columns = ctx.api.columns(cell);
			var col = settings.columns[columns.flatten()[0]];
			var orderable = columns.orderable().includes(true);
			var ariaType = "";
			var indexes = columns.indexes();
			var sortDirs = columns.orderable(true).flatten();
			var tabIndex = settings.tabIndex;
			var canOrder = ctx.orderHandler && orderable;
			cell.classRemove(orderClasses.isAsc + " " + orderClasses.isDesc).classToggle(orderClasses.none, !orderable).classToggle(orderClasses.canAsc, canOrder && sortDirs.includes("asc")).classToggle(orderClasses.canDesc, canOrder && sortDirs.includes("desc"));
			var isOrdering = true;
			for (i = 0; i < indexes.length; i++) if (!orderedColumns.includes(indexes[i])) isOrdering = false;
			if (isOrdering) {
				var orderDirs = columns.order();
				cell.classAdd((orderDirs.includes("asc") ? orderClasses.isAsc : "") + (orderDirs.includes("desc") ? orderClasses.isDesc : ""));
			}
			var firstVis = -1;
			for (i = 0; i < orderedColumns.length; i++) if (settings.columns[orderedColumns[i]].visible) {
				firstVis = orderedColumns[i];
				break;
			}
			if (indexes[0] == firstVis) {
				var firstSort = sorting[0];
				var sortOrder = col.orderSequence;
				cell.attr("aria-sort", firstSort.dir === "asc" ? "ascending" : "descending");
				ariaType = sortOrder && !sortOrder[firstSort.index + 1] ? "Remove" : "Reverse";
			} else cell.attrRemove("aria-sort");
			if (orderable) {
				var orderSpan = cell.find(".dt-column-order");
				orderSpan.attr("role", "button").attr("aria-label", orderable ? col.ariaTitle + ctx.api.i18n("aria.orderable" + ariaType) : col.ariaTitle);
				if (tabIndex !== -1) orderSpan.attr("tabindex", tabIndex);
			}
		});
	};
	var layout = (settings, container, items) => {
		let classes = settings.classes.layout;
		let row = Dom$1.c("div").attr("id", items.id || null).classAdd(items.className || classes.row).appendTo(container);
		displayRowCells(items, function(key, val) {
			var klass = "";
			if (val.table) {
				row.classAdd(classes.tableRow);
				klass += classes.tableCell + " ";
			}
			if (key === "start") klass += classes.start;
			else if (key === "end") klass += classes.end;
			else klass += classes.full;
			Dom$1.c("div").attr({
				id: val.id || null,
				class: val.className ? val.className : classes.cell + " " + klass
			}).append(val.contents).appendTo(row);
		});
	};
	var pagingButton = (settings, buttonType, content, active, disabled) => {
		var classes = settings.classes.paging;
		var btnClasses = [classes.button];
		var btn;
		if (active) btnClasses.push(classes.active);
		if (disabled) btnClasses.push(classes.disabled);
		if (buttonType === "ellipsis") btn = Dom$1.c("span").classAdd("ellipsis").html(content).get(0);
		else btn = Dom$1.c("button").classAdd(btnClasses.join(" ")).attr("role", "link").attr("type", "button").html(content).get(0);
		return {
			display: btn,
			clicker: btn
		};
	};
	var pagingContainer = (settings, buttons) => {
		return buttons;
	};
	function displayRowCells(items, fn) {
		if (items.start) fn("start", items.start);
		if (items.end) fn("end", items.end);
		if (items.full) fn("full", items.full);
	}
	var store = {
		className: {},
		detect: [],
		render: {},
		search: {},
		order: {}
	};
	function _filterString(stripHtml, normalize) {
		return function(str) {
			if (util.is.empty(str) || typeof str !== "string") return str;
			str = str.replace(util.regex.reNewLines, " ");
			if (stripHtml) str = util.stripHtml(str);
			str = util.diacritics(str, false);
			return str;
		};
	}
	function __numericReplace(d, decimalPlace, re1, re2) {
		if (d !== 0 && (!d || d === "-")) return -Infinity;
		if (typeof d === "number" || typeof d === "bigint") return d;
		if (decimalPlace) d = util.conv.numToDecimal(d, decimalPlace);
		if (typeof d === "string") {
			if (re1) d = d.replace(re1, "");
			if (re2) d = d.replace(re2, "");
		}
		return d * 1;
	}
	function register$1(name, prop, val) {
		if (!prop) return {
			className: store.className[name],
			detect: store.detect.find(function(fn) {
				return fn._name === name;
			}),
			order: {
				pre: store.order[name + "-pre"],
				asc: store.order[name + "-asc"],
				desc: store.order[name + "-desc"]
			},
			render: store.render[name],
			search: store.search[name]
		};
		var setProp = function(prop2, propVal) {
			store[prop2][name] = propVal;
		};
		var setDetect = function(detect) {
			Object.defineProperty(detect, "_name", { value: name });
			var idx = store.detect.findIndex(function(item) {
				return item._name === name;
			});
			if (idx === -1) store.detect.unshift(detect);
			else store.detect.splice(idx, 1, detect);
		};
		var setOrder = function(obj) {
			store.order[name + "-pre"] = obj.pre;
			store.order[name + "-asc"] = obj.asc;
			store.order[name + "-desc"] = obj.desc;
		};
		if (val === void 0) {
			val = prop;
			prop = void 0;
		}
		if (prop === "className") setProp("className", val);
		else if (prop === "detect") setDetect(val);
		else if (prop === "order") setOrder(val);
		else if (prop === "render") setProp("render", val);
		else if (prop === "search") setProp("search", val);
		else if (!prop) {
			if (val.className) setProp("className", val.className);
			if (val.detect !== void 0) setDetect(val.detect);
			if (val.order) setOrder(val.order);
			if (val.render !== void 0) setProp("render", val.render);
			if (val.search !== void 0) setProp("search", val.search);
		}
	}
	function types() {
		return store.detect.map(function(detect) {
			return detect._name;
		});
	}
	var __diacriticSort = function(a, b) {
		a = a !== null && a !== void 0 ? a.toString().toLowerCase() : "";
		b = b !== null && b !== void 0 ? b.toString().toLowerCase() : "";
		return a.localeCompare(b, navigator.languages[0] || navigator.language, {
			numeric: true,
			ignorePunctuation: true
		});
	};
	var __diacriticHtmlSort = function(a, b) {
		a = util.stripHtml(a);
		b = util.stripHtml(b);
		return __diacriticSort(a, b);
	};
	register$1("string", {
		detect: function() {
			return "string";
		},
		order: { pre: function(a) {
			return util.is.empty(a) && typeof a !== "boolean" ? "" : typeof a === "string" ? a.toLowerCase() : !a.toString ? "" : a.toString();
		} },
		search: _filterString(false)
	});
	register$1("string-utf8", {
		detect: {
			allOf: function() {
				return true;
			},
			oneOf: function(d) {
				return !util.is.empty(d) && navigator.languages && typeof d === "string" && !!d.match(/[^\x00-\x7F]/);
			}
		},
		order: {
			asc: __diacriticSort,
			desc: function(a, b) {
				return __diacriticSort(a, b) * -1;
			}
		},
		search: _filterString(false)
	});
	register$1("html", {
		detect: {
			allOf: function(d) {
				return util.is.empty(d) || typeof d === "string" && d.indexOf("<") !== -1;
			},
			oneOf: function(d) {
				return !util.is.empty(d) && typeof d === "string" && d.indexOf("<") !== -1;
			}
		},
		order: { pre: function(a) {
			return util.is.empty(a) ? "" : a.replace ? util.stripHtml(a).trim().toLowerCase() : a + "";
		} },
		search: _filterString(true)
	});
	register$1("html-utf8", {
		detect: {
			allOf: function(d) {
				return util.is.empty(d) || typeof d === "string" && d.indexOf("<") !== -1;
			},
			oneOf: function(d) {
				return navigator.languages && !util.is.empty(d) && typeof d === "string" && d.indexOf("<") !== -1 && typeof d === "string" && !!d.match(/[^\x00-\x7F]/);
			}
		},
		order: {
			asc: __diacriticHtmlSort,
			desc: function(a, b) {
				return __diacriticHtmlSort(a, b) * -1;
			}
		},
		search: _filterString(true)
	});
	register$1("date", {
		className: "dt-type-date",
		detect: {
			allOf: function(d) {
				if (d && !(d instanceof Date) && !util.regex.reDate.test(d)) return null;
				var parsed = Date.parse(d);
				return parsed !== null && !isNaN(parsed) || util.is.empty(d);
			},
			oneOf: function(d) {
				return d instanceof Date || typeof d === "string" && util.regex.reDate.test(d);
			}
		},
		order: { pre: function(d) {
			var ts = Date.parse(d);
			return isNaN(ts) ? -Infinity : ts;
		} }
	});
	register$1("html-num-fmt", {
		className: "dt-type-numeric",
		detect: {
			allOf: function(d, settings) {
				var decimal = settings.language.decimal;
				return util.is.htmlNum(d, decimal, true, false);
			},
			oneOf: function(d, settings) {
				var decimal = settings.language.decimal;
				return util.is.htmlNum(d, decimal, true, false);
			}
		},
		order: { pre: function(d, s) {
			var dp = s.language.decimal;
			return __numericReplace(d, dp, util.regex.reHtml, util.regex.reFormattedNumeric);
		} },
		search: _filterString(true)
	});
	register$1("html-num", {
		className: "dt-type-numeric",
		detect: {
			allOf: function(d, settings) {
				var decimal = settings.language.decimal;
				return util.is.htmlNum(d, decimal, false, true);
			},
			oneOf: function(d, settings) {
				var decimal = settings.language.decimal;
				return util.is.htmlNum(d, decimal, false, false);
			}
		},
		order: { pre: function(d, s) {
			var dp = s.language.decimal;
			return __numericReplace(d, dp, util.regex.reHtml);
		} },
		search: _filterString(true)
	});
	register$1("num-fmt", {
		className: "dt-type-numeric",
		detect: {
			allOf: function(d, settings) {
				var decimal = settings.language.decimal;
				return util.is.num(d, decimal, true, true);
			},
			oneOf: function(d, settings) {
				var decimal = settings.language.decimal;
				return util.is.num(d, decimal, true, false);
			}
		},
		order: { pre: function(d, s) {
			var dp = s.language.decimal;
			return __numericReplace(d, dp, util.regex.reFormattedNumeric);
		} }
	});
	register$1("num", {
		className: "dt-type-numeric",
		detect: {
			allOf: function(d, settings) {
				var decimal = settings.language.decimal;
				return util.is.num(d, decimal, false, true);
			},
			oneOf: function(d, settings) {
				var decimal = settings.language.decimal;
				return util.is.num(d, decimal, false, false);
			}
		},
		order: { pre: function(d, s) {
			var dp = s.language.decimal;
			return __numericReplace(d, dp);
		} }
	});
	/**
	* DataTables extensions
	*
	* This namespace acts as a collection area for plug-ins that can be used to
	* extend DataTables capabilities. Indeed many of the build in methods
	* use this method to provide their own capabilities (sorting methods for
	* example).
	*
	* Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	* reasons
	*/
	var ext = {
		/**
		* DataTables build type (expanded by the download builder)
		*/
		builder: "-source-",
		/**
		* Buttons. For use with the Buttons extension for DataTables. This is
		* defined here so other extensions can define buttons regardless of load
		* order. It is _not_ used by DataTables core.
		*/
		buttons: {},
		/**
		* ColumnControl buttons and content
		*/
		ccContent: {},
		/**
		* Element class names
		*/
		classes: classes$1,
		/**
		* Error reporting.
		*
		* How should DataTables report an error. Can take the value 'alert',
		* 'throw', 'none' or a function.
		*/
		errMode: "alert",
		/** HTML entity escaping */
		escape: { 
		/** When reading data-* attributes for initialisation options */
attributes: false },
		/**
		* Legacy so v1 plug-ins don't throw js errors on load
		*/
		feature: legacy,
		/**
		* Feature plug-ins.
		*
		* This is an object of callbacks which provide the features for DataTables
		* to be initialised via the `layout` option.
		*/
		features,
		/**
		* Row searching.
		*
		* This method of searching is complimentary to the default type based
		* searching, and a lot more comprehensive as it allows you complete control
		* over the searching logic. Each element in this array is a function
		* (parameters described below) that is called for every row in the table,
		* and your logic decides if it should be included in the searching data set
		* or not.
		*/
		search: [],
		/**
		* Selector extensions
		*
		* The `selector` option can be used to extend the options available for the
		* selector modifier options (`selector-modifier` object data type) that
		* each of the three built in selector types offer (row, column and cell +
		* their plural counterparts). For example the Select extension uses this
		* mechanism to provide an option to select only rows, columns and cells
		* that have been marked as selected by the end user (`{selected: true}`),
		* which can be used in conjunction with the existing built in selector
		* options.
		*/
		selector: {
			cell: [],
			column: [],
			row: []
		},
		settings: [],
		/**
		* Legacy configuration options. Enable and disable legacy options that
		* are available in DataTables.
		*
		*  @type object
		*/
		legacy: { 
		/**
		* Enable / disable DataTables 1.9 compatible server-side processing
		* requests
		*/
ajax: null },
		/**
		* Pagination plug-in methods.
		*
		* Each entry in this object is a function and defines which buttons should
		* be shown by the pagination rendering method that is used for the table.
		* The renderer addresses how the buttons are displayed in the document,
		* while the functions here tell it what buttons to display. This is done by
		* returning an array of button descriptions (what each button will do).
		*/
		pager,
		renderer: {
			footer: { _: footer },
			header: { _: header },
			layout: { _: layout },
			pagingButton: { _: pagingButton },
			pagingContainer: { _: pagingContainer }
		},
		/**
		* Rendering helper function exposed for use by the styling integrations.
		*/
		rendererDisplayRowCells: displayRowCells,
		/**
		* Ordering plug-ins - custom data source
		*
		* The extension options for ordering of data available here is
		* complimentary to the default type based ordering that DataTables
		* typically uses. It allows much greater control over the data that is
		* being used to order a column, but is necessarily therefore more complex.
		*/
		order: {},
		/**
		* Type based plug-ins.
		*
		* Each column in DataTables has a type assigned to it, either by automatic
		* detection or by direct assignment using the `type` option for the column.
		* The type of a column will effect how it is ordering and search (plug-ins
		* can also make use of the column type if required).
		*/
		type: store,
		/**
		* Unique DataTables instance counter
		*
		* @type int
		* @private
		*/
		_unique: 0,
		/**
		* Software version
		*  @type string
		*/
		version: "3.0.3"
	};
	Object.assign(ext, {
		afnFiltering: ext.search,
		aTypes: ext.type.detect,
		ofnSearch: ext.type.search,
		oSort: ext.type.order,
		afnSortData: ext.order,
		aoFeatures: ext.feature,
		oStdClasses: ext.classes,
		oPagination: ext.pager,
		sVersion: ext.version,
		fnVersionCheck: check$1
	});
	/**
	* Log an error message
	*
	* @param ctx DataTables settings object
	* @param level log error messages, or display them to the user
	* @param msg error message
	* @param tn Technical note id to get more information about the error.
	*/
	function log(ctx, level, msg, tn) {
		msg = "DataTables warning: " + (ctx ? "table id=" + ctx.tableId + " - " : "") + msg;
		if (tn) msg += ". For more information about this error, please see https://datatables.net/tn/" + tn;
		var type = ext.sErrMode || ext.errMode;
		if (ctx) callbackFire(ctx, null, "dt-error", [
			ctx,
			tn,
			msg
		], true);
		if (type == "alert") alert(msg);
		else if (type == "throw") throw new Error(msg);
		else if (typeof type == "function") type(ctx, tn, msg);
	}
	/**
	* See if a property is defined on one object, if so assign it to the other
	* object
	*
	* @param ret target object
	* @param src source object
	* @param name property
	* @param mappedName name to map too - optional, name used if not given
	*/
	function map(ret, src, name, mappedName) {
		if (Array.isArray(name)) {
			for (let i = 0; i < name.length; i++) {
				let val = name[i];
				if (Array.isArray(val)) map(ret, src, val[0], val[1]);
				else map(ret, src, val);
			}
			return;
		}
		if (mappedName === void 0) mappedName = name;
		if (src[name] !== void 0) ret[mappedName] = src[name];
	}
	/**
	* Bind an event handler to allow a click or return key to activate the callback.
	* This is good for accessibility since a return on the keyboard will have the
	* same effect as a click, if the element has focus.
	*
	* @param n Element to bind the action to
	* @param selector Selector (for delegated events)
	* @param fn Callback function for when the event is triggered
	*/
	function bindAction(n, selector, fn) {
		Dom$1.s(n).on("click.DT", selector, function(e) {
			fn(e);
		}).on("keypress.DT", selector, function(e) {
			if (e.which === 13) {
				e.preventDefault();
				fn(e);
			}
		}).on("selectstart.DT", selector, function() {
			return false;
		});
	}
	/**
	* Register a callback function. Easily allows a callback function to be added
	* to an array store of callback functions that can then all be called together.
	*
	* @param settings dataTables settings object
	* @param store Name of the array storage for the callbacks in settings
	* @param fn Function to be called back
	*/
	function callbackReg(ctx, store, fn) {
		if (fn) ctx.callbacks[store].push(fn);
	}
	/**
	* Fire callback functions and trigger events. Note that the loop over the
	* callback array store is done backwards! Further note that you do not want to
	* fire off triggers in time sensitive applications (for example cell creation)
	* as its slow.
	*
	* @param ctx DataTables settings object
	* @param callbackArr Name of the array storage for the callbacks in the context
	* @param eventName Name of the custom event to trigger. If null no trigger is
	*   fired
	* @param args Array of arguments to pass to the callback function / trigger
	* @param bubbles True if the event should bubble
	*/
	function callbackFire(ctx, callbackArr, eventName, args, bubbles = false) {
		var ret = [];
		if (callbackArr) ret = ctx.callbacks[callbackArr].slice().reverse().map(function(val) {
			return val.apply(ctx.instance, args);
		});
		if (eventName !== null) {
			let table = Dom$1.s(ctx.table);
			let result = table.trigger(eventName + ".dt", bubbles, args, { dt: ctx.api });
			if (bubbles && table.closest("body").count() === 0) Dom$1.s("body").trigger(eventName + ".dt", bubbles, args, { dt: ctx.api });
			ret.push(result[0]);
		}
		return ret;
	}
	function lengthOverflow(ctx) {
		var start = ctx.displayStart, end = displayEnd(ctx), len = ctx.pageLength;
		if (start >= end) start = end - len;
		start -= start % len;
		if (len === -1 || start < 0) start = 0;
		ctx.displayStart = start;
	}
	/**
	* Detect the data source being used for the table. Used to simplify the code a
	* little (ajax) and to make it compress a little smaller.
	*
	* @param ctx DataTables settings object
	* @returns Data source
	*/
	function dataSource(ctx) {
		if (ctx.features.serverSide) return "ssp";
		else if (ctx.ajax) return "ajax";
		return "dom";
	}
	/**
	* Common replacement for language strings
	*
	* @param ctx DataTables settings object
	* @param str String with values to replace
	* @param entries Plural number for _ENTRIES_ - can be undefined
	* @returns String
	*/
	function macros(ctx, str, entries) {
		var formatter = ctx.formatNumber, start = ctx.displayStart + 1, len = ctx.pageLength, vis = recordsDisplay(ctx), max = recordsTotal(ctx), all = len === -1;
		return str.replace(/_START_/g, formatter(start, ctx)).replace(/_END_/g, formatter(displayEnd(ctx), ctx)).replace(/_MAX_/g, formatter(max, ctx)).replace(/_TOTAL_/g, formatter(vis, ctx)).replace(/_PAGE_/g, formatter(all ? 1 : Math.ceil(start / len), ctx)).replace(/_PAGES_/g, formatter(all ? 1 : Math.ceil(vis / len), ctx)).replace(/_ENTRIES_/g, ctx.api.i18n("entries", "", entries)).replace(/_ENTRIES-MAX_/g, ctx.api.i18n("entries", "", max)).replace(/_ENTRIES-TOTAL_/g, ctx.api.i18n("entries", "", vis));
	}
	/**
	* Add elements to an array as quickly as possible, but stack safe.
	*
	* @param arr Array to add the data to
	* @param data Data array that is to be added
	*/
	function arrayApply(arr, data) {
		if (!data) return;
		if (data.length < 1e4) arr.push.apply(arr, data);
		else for (var i = 0; i < data.length; i++) arr.push(data[i]);
	}
	/**
	* Add one or more listeners to the table
	*
	* @param that JQ for the table
	* @param name Event name
	* @param src Listener(s)
	*/
	function listener(that, name, src) {
		let srcArr = Array.isArray(src) ? src : [src];
		for (var i = 0; i < srcArr.length; i++) that.on(name + ".dt.DT", srcArr[i]);
	}
	/**
	* Escape HTML entities in strings, in an object
	*/
	function escapeObject(obj) {
		if (ext.escape.attributes) each(obj, function(key, val) {
			obj[key] = escapeHtml(val);
		});
		return obj;
	}
	/**
	* Common logic for moment, luxon or a date action.
	*
	* Happens after __mldObj, so don't need to call `resolveWindowsLibs` again
	*/
	function __mld(dtLib, momentFn, luxonFn, dateFn, arg1) {
		if (__moment) return dtLib[momentFn](arg1);
		else if (__luxon) return dtLib[luxonFn](arg1);
		return dateFn ? dtLib[dateFn](arg1) : dtLib;
	}
	var __mlWarning = false;
	var __luxon;
	var __moment;
	/**
	*
	*/
	function resolveWindowLibs() {
		__luxon = util.external("luxon");
		__moment = util.external("moment");
	}
	function __mldObj(d, format, locale) {
		var dt;
		resolveWindowLibs();
		if (__moment) {
			dt = __moment(d, format, locale, true);
			if (!dt.isValid()) return null;
		} else if (__luxon) {
			dt = format && typeof d === "string" ? __luxon.DateTime.fromFormat(d, format) : __luxon.DateTime.fromISO(d);
			if (!dt.isValid) return null;
			dt = dt.setLocale(locale);
		} else if (!format) dt = new Date(d);
		else {
			if (!__mlWarning) alert("DataTables warning: Formatted date without Moment.js or Luxon - https://datatables.net/tn/17");
			__mlWarning = true;
		}
		return dt;
	}
	function __mlHelper(localeString) {
		return function(from, to, locale, def) {
			if (arguments.length === 0) {
				locale = "en";
				to = null;
				from = null;
			} else if (arguments.length === 1) {
				locale = "en";
				to = from;
				from = null;
			} else if (arguments.length === 2) {
				locale = to;
				to = from;
				from = null;
			}
			var typeName = "datetime" + (to ? "-" + to : "");
			if (!store.order[typeName + "-pre"]) register$1(typeName, {
				detect: function(d) {
					return d === typeName ? typeName : false;
				},
				order: { pre: function(d) {
					return d.valueOf();
				} }
			});
			if (!store.className[typeName]) store.className[typeName] = "dt-right";
			return function(d, type) {
				if (d === null || d === void 0) {
					if (def === "--now") {
						var local = /* @__PURE__ */ new Date();
						d = new Date(Date.UTC(local.getFullYear(), local.getMonth(), local.getDate(), local.getHours(), local.getMinutes(), local.getSeconds()));
					} else d = "";
				}
				if (type === "type") return typeName;
				if (d === "") return type !== "sort" ? "" : __mldObj("0000-01-01 00:00:00", null, locale);
				if (to !== null && from === to && type !== "sort" && type !== "type" && !(d instanceof Date)) return d;
				let options = {};
				let tzMatch = typeof d === "string" ? d.match(util.regex.isoTimezone) : null;
				if (tzMatch) options.timeZone = tzMatch[1] === "Z" ? "UTC" : tzMatch[1];
				var dt = __mldObj(d, from, locale);
				if (dt === null) return d;
				if (type === "sort") return dt;
				var formatted = to === null ? __mld(dt, "toDate", "toJSDate", "")[localeString](navigator.language, options) : __mld(dt, "format", "toFormat", "toISOString", to);
				return type === "display" ? util.escapeHtml(formatted) : formatted;
			};
		};
	}
	var __thousands = ",";
	var __decimal = ".";
	if (window.Intl !== void 0) try {
		var num = new Intl.NumberFormat().formatToParts(100000.1);
		for (var i = 0; i < num.length; i++) if (num[i].type === "group") __thousands = num[i].value;
		else if (num[i].type === "decimal") __decimal = num[i].value;
	} catch (e) {}
	/**
	* Register a date / time format for DataTables to use.
	*
	* @param format The date / time format to detect data in. Please refer to the
	*   Moment.js or Luxon document for the full list of tokens, depending on which
	*   of the two libraries you are using.
	* @param locale The locale to pass to Moment.js / Luxon.
	*/
	function datetime(format, locale) {
		var typeName = "datetime-" + format;
		if (!locale) locale = "en";
		if (!store.order[typeName]) register$1(typeName, {
			detect: function(d) {
				var dt = __mldObj(d, format, locale);
				return d === "" || dt ? typeName : false;
			},
			order: { pre: function(d) {
				return __mldObj(d, format, locale) || 0;
			} }
		});
		if (!store.className[typeName]) store.className[typeName] = "dt-right";
	}
	/**
	* Helpers for `columns.render`.
	*/
	var helpers = {
		date: __mlHelper("toLocaleDateString"),
		datetime: __mlHelper("toLocaleString"),
		time: __mlHelper("toLocaleTimeString"),
		number: function(thousands, decimal, precision, prefix, postfix) {
			if (thousands === null || thousands === void 0) thousands = __thousands;
			if (decimal === null || decimal === void 0) decimal = __decimal;
			return { display: function(d) {
				if (typeof d !== "number" && typeof d !== "string") return d;
				if (d === "" || d === null) return d;
				var flo = typeof d === "number" ? d : parseFloat(d);
				var negative = flo < 0 ? "-" : "";
				var abs = Math.abs(flo);
				if (abs >= 1e11 || abs < 1e-4 && abs !== 0) {
					var exp = flo.toExponential(precision).split(/e\+?/);
					return exp[0] + " x 10<sup>" + exp[1] + "</sup>";
				}
				if (isNaN(flo)) return util.escapeHtml(d);
				flo = flo.toFixed(precision);
				var absPart = Math.abs(flo);
				var intPart = Math.abs(parseInt(flo, 10));
				var floatPart = precision ? decimal + (absPart - intPart).toFixed(precision).substring(2) : "";
				if (intPart === 0 && parseFloat(floatPart) === 0) negative = "";
				return negative + (prefix || "") + intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands) + floatPart + (postfix || "");
			} };
		},
		text: function() {
			return {
				display: util.escapeHtml,
				filter: util.escapeHtml
			};
		}
	};
	/**
	* Column options that can be given to DataTables at initialisation time.
	*/
	var defaults$4 = {
		ariaTitle: "",
		cellType: "td",
		className: "",
		contentPadding: "",
		createdCell: null,
		data: null,
		defaultContent: null,
		footer: null,
		name: "",
		orderable: true,
		orderData: null,
		orderDataType: "std",
		orderSequence: [
			"asc",
			"desc",
			""
		],
		render: null,
		search: null,
		searchable: true,
		title: null,
		type: null,
		visible: true,
		width: null
	};
	/**
	* Internal settings object used for individual columns. Instances are held in
	* the setting object's `columns` array and contains all the information that
	* DataTables needs about each individual column.
	*
	* Note that this object is related to the column defaults but this one is the
	* internal data store for DataTables's cache of columns. It should NOT be
	* manipulated outside of DataTables. Any configuration should be done through
	* the initialisation options.
	*/
	var Settings = class {
		constructor() {
			/**
			* Flag to indicate if HTML5 data attributes should be used as the data
			* source for filtering or sorting. True is either are.
			*/
			this.attrSrc = false;
			this.ariaTitle = "";
			/**
			* The class to apply to all cells in the table's `tbody`` for the column
			*/
			this.className = null;
			/**
			* When DataTables calculates the column widths to assign to each column, it
			* finds the longest string in each column and then constructs a temporary
			* table and reads the widths from that. The problem with this is that "mmm"
			* is much wider then "iiii", but the latter is a longer string - thus the
			* calculation can go wrong (doing it properly and putting it into an DOM
			* object and measuring that is horribly(!) slow). Thus as a "work around"
			* we provide this option. It will append its value to the text that is
			* found to be the longest string for the column - i.e. padding.
			*/
			this.contentPadding = null;
			/**
			* Property to read the value for the cells in the column from the data
			* source array / object. If null, then the default content is used, if a
			* function is given then the return from the function is used.
			*/
			this.data = null;
			/**
			* Allows a default value to be given for a column's data, and will be used
			* whenever a null data source is encountered (this can be because mData is
			* set to null, or because the data source itself is null).
			*/
			this.defaultContent = null;
			/**
			* Name for the column, allowing reference to the column by name as well as
			* by index (needs a lookup to work by name).
			*/
			this.name = null;
			/**
			* A list of the columns that sorting should occur on when this column is
			* sorted. That this property is an array allows multi-column sorting to be
			* defined for a column (for example first name / last name columns would
			* benefit from this). The values are integers pointing to the columns to be
			* sorted on (typically it will be a single integer pointing at itself, but
			* that doesn't need to be the case).
			*/
			this.orderData = [];
			/**
			* Custom sorting data type - defines which of the available plug-ins in
			* afnSortData the custom sorting will use - if any is defined.
			*/
			this.orderDataType = "std";
			/**
			* Class to be applied to the header element when sorting on this column
			*/
			this.orderingClass = null;
			/**
			* Define the sorting directions that are applied to the column, in sequence
			* as the column is repeatedly sorted upon - i.e. the first value is used as
			* the sorting direction when the column if first sorted (clicked on). Sort
			* it again (click again) and it will move on to the next index. Repeat
			* until loop.
			*/
			this.orderSequence = [];
			/**
			* Partner property to mData which is used (only when defined) to get the
			* data - i.e. it is basically the same as mData, but without the 'set'
			* option, and also the data fed to it is the result from mData. This is the
			* rendering method to match the data method of mData.
			*/
			this.render = null;
			/**
			* Title of the column - what is seen in the TH element (nTh).
			*/
			this.title = null;
			/**
			* Store for manual type assignment using the `column.type` option. This
			* is held in store so we can manipulate the column's `type` property.
			*/
			this.typeManual = null;
			/** Cached longest strings from a column */
			this.wideStrings = null;
			/**
			* Width of the column
			*/
			this.width = null;
			/**
			* Width of the column when it was first "encountered"
			*/
			this.widthOrig = null;
		}
	};
	var defaults$3 = {
		boundary: false,
		caseInsensitive: true,
		columns: null,
		exact: false,
		regex: false,
		return: false,
		search: "",
		smart: true
	};
	/**
	* Create a new search options object
	*
	* @param parts Values to assign, otherwise the defaults will be used
	* @returns New object
	*/
	function create$2(parts = {}) {
		return util.object.assignDeep({}, defaults$3, parts);
	}
	var browser = {
		barWidth: -1,
		scrollbarLeft: false
	};
	var hungarianToCamelRe = /^(a|aa|ai|ao|as|b|fn|i|m|o|s)([A-Z])([a-z].*$)/;
	/**
	* Take an object which has hungarian notation parameters and convert them to
	* camelCase style. This is to allow compatibility with DataTables 1.9 and
	* earlier which only used hungarian notation, and also with DataTables 1.10 - 2
	* which allowed it to be used.
	*/
	function hungarianToCamel(user) {
		if (!user) return user;
		let userKeys = Object.keys(user);
		let userAny = user;
		for (let i = 0; i < userKeys.length; i++) {
			let userKey = userKeys[i];
			let match = userKey.match(hungarianToCamelRe);
			if (match) user[match[2].toLowerCase() + match[3]] = userAny[userKey];
			if (util.is.plainObject(userAny[userKey])) hungarianToCamel(userAny[userKey]);
		}
		return user;
	}
	/**
	* Map one parameter onto another
	*
	* @param o Object to map
	* @param newKey The new parameter name
	* @param oldKey The old parameter name
	*/
	function compatMap(o, newKey, oldKey) {
		if (o[oldKey] !== void 0) o[newKey] = o[oldKey];
	}
	/**
	* Provide backwards compatibility for the main DT options. Note that the new
	* options are mapped onto the old parameters, so this is an external interface
	* change only.
	*
	* @param init Object to map
	*/
	function compatOpts(init) {
		hungarianToCamel(init);
		compatMap(init, "ordering", "sort");
		compatMap(init, "orderMulti", "sortMulti");
		compatMap(init, "orderClasses", "sortClasses");
		compatMap(init, "orderCellsTop", "sortCellsTop");
		compatMap(init, "order", "sorting");
		compatMap(init, "orderFixed", "sortingFixed");
		compatMap(init, "paging", "paginate");
		compatMap(init, "pagingType", "paginationType");
		compatMap(init, "pageLength", "displayLength");
		compatMap(init, "searching", "filter");
		compatMap(init, "stateDuration", "cookieDuration");
		if (typeof init.scrollX === "boolean") init.scrollX = init.scrollX ? "100%" : "";
		if (typeof init.ordering === "object") {
			init.orderIndicators = init.ordering.indicators !== void 0 ? init.ordering.indicators : true;
			init.orderHandler = init.ordering.handler !== void 0 ? init.ordering.handler : true;
			init.ordering = true;
		} else if (init.ordering === false) {
			init.orderIndicators = false;
			init.orderHandler = false;
		} else if (init.ordering === true) {
			init.orderIndicators = true;
			init.orderHandler = true;
		}
		if (typeof init.orderCellsTop === "boolean") init.titleRow = init.orderCellsTop;
		var searchCols = init.searchCols;
		if (searchCols) {
			for (var i = 0, iLen = searchCols.length; i < iLen; i++) if (searchCols[i]) hungarianToCamel(searchCols[i]);
		}
		if (init.serverSide && !init.searchDelay) init.searchDelay = 400;
		if (init.language && init.language.url && !init.language.ajax) init.language.ajax = init.language.url;
	}
	/**
	* Provide backwards compatibility for column options. Note that the new options
	* are mapped onto the old parameters, so this is an external interface change
	* only.
	*
	* @param init Object to map
	*/
	function compatCols(init) {
		hungarianToCamel(init);
		compatMap(init, "orderable", "sortable");
		compatMap(init, "orderData", "dataSort");
		compatMap(init, "orderSequence", "sorting");
		compatMap(init, "orderDataType", "sortDataType");
		compatMap(init, "className", "class");
		var dataSort = init.aDataSort;
		var orderData = init.orderData;
		if (typeof dataSort === "number") init.orderData = [dataSort];
		if (typeof orderData === "number") init.orderData = [orderData];
		if (init.dataProp !== void 0 && !init.data) init.data = init.dataProp;
	}
	/**
	* Browser feature detection for capabilities, quirks
	*
	* @param ctx DataTables settings object
	*/
	function browserDetect(ctx) {
		if (browser.barWidth === -1) {
			var n = Dom$1.c("div").css({
				position: "fixed",
				top: "0",
				left: -1 * window.pageXOffset + "px",
				height: "1px",
				width: "1px",
				overflow: "hidden"
			}).append(Dom$1.c("div").css({
				position: "absolute",
				top: "1px",
				left: "1px",
				width: "100px",
				overflow: "scroll"
			}).append(Dom$1.c("div").css({
				width: "100%",
				height: "10px"
			}))).appendTo("body");
			var outer = n.children();
			var inner = outer.children();
			browser.barWidth = outer.get(0).offsetWidth - outer.get(0).clientWidth;
			browser.scrollbarLeft = Math.round(inner.offset().left) !== 1;
			n.remove();
		}
		Object.assign(ctx.browser, browser);
		ctx.scroll.barWidth = browser.barWidth;
	}
	var defaults$2 = {
		addedClasses: [],
		cells: [],
		data: [],
		details: void 0,
		detailsShow: void 0,
		displayData: null,
		idx: -1,
		orderCache: null,
		searchCellCache: null,
		searchRowCache: null,
		src: "dom",
		tr: null
	};
	/**
	* Create a new object that is a row model
	*
	* @param parts Values to assign, otherwise the defaults will be used
	* @returns New object
	*/
	function create$1(parts = {}) {
		return util.object.assignDeep({}, defaults$2, parts);
	}
	/**
	* Add a data array to the table, creating DOM node etc. This is the parallel to
	* gatherData, but for adding rows from a JavaScript source, rather than a
	* DOM source.
	*
	* @param settings DataTables settings object
	* @param dataIn data array to be added
	* @param tr TR element to add to the table - optional. If not given, DataTables
	*   will create a row automatically
	* @param tds Array of TD|TH elements for the row - must be given if tr is.
	* @returns >=0 if successful (index of new data entry), -1 if failed
	*/
	function addData(settings, dataIn, tr, tds) {
		var rowIdx = settings.data.length;
		var row = create$1({
			src: tr ? "dom" : "data",
			idx: rowIdx
		});
		row.data = dataIn;
		settings.data.push(row);
		var columns = settings.columns;
		for (var i = 0, iLen = columns.length; i < iLen; i++) columns[i].type = null;
		settings.displayMaster.push(rowIdx);
		var id = settings.rowIdFn(dataIn);
		if (id !== void 0) settings.ids[id] = row;
		if (tr || !settings.features.deferRender) createTr(settings, rowIdx, tr, tds);
		return rowIdx;
	}
	/**
	* Add one or more TR elements to the table. Generally we'd expect to
	* use this for reading data from a DOM sourced table, but it could be
	* used for an TR element. Note that if a TR is given, it is used (i.e.
	* it is not cloned).
	*
	* @param settings DataTables settings object
	* @param rows The TR element(s) to add to the table
	* @returns Array of indexes for the added rows
	*/
	function addTr(settings, rows) {
		return rows.mapTo((el) => {
			let row = getRowElementsFromNode(settings, el);
			return addData(settings, row.data, el, row.cells);
		});
	}
	/**
	* Get the data for a given cell from the internal cache, taking into account
	* data mapping
	*
	* @param settings DataTables settings object
	* @param rowIdx data row id
	* @param colIdx Column index
	* @param type data get type ('display', 'type' 'filter|search' 'sort|order')
	* @returns Cell data
	*/
	function getCellData(settings, rowIdx, colIdx, type) {
		if (type === "search") type = "filter";
		else if (type === "order") type = "sort";
		var row = settings.data[rowIdx];
		if (!row) return;
		var draw = settings.drawCount;
		var col = settings.columns[colIdx];
		var rowData = row.data;
		var defaultContent = col.defaultContent;
		var cellData = col.dataGet(rowData, type, {
			settings,
			row: rowIdx,
			col: colIdx
		});
		if (type !== "display" && cellData && typeof cellData === "object" && cellData.nodeName) cellData = cellData.innerHTML;
		if (cellData === void 0) {
			if (settings.drawError != draw && defaultContent === null) {
				log(settings, 0, "Requested unknown parameter " + (typeof col.data == "function" ? "{function}" : "'" + col.data + "'") + " for row " + rowIdx + ", column " + colIdx, 4);
				settings.drawError = draw;
			}
			return defaultContent;
		}
		if ((cellData === rowData || cellData === null) && defaultContent !== null && type !== void 0) cellData = defaultContent;
		else if (typeof cellData === "function") return cellData.call(rowData);
		if (cellData === null && type === "display") return "";
		if (type === "filter") {
			var formatters = ext.type.search;
			if (col.type && formatters[col.type]) cellData = formatters[col.type](cellData);
		}
		return cellData;
	}
	/**
	* Set the value for a specific cell, into the internal data cache
	*
	* @param settings DataTables settings object
	* @param rowIdx data row id
	* @param colIdx Column index
	* @param val Value to set
	*/
	function setCellData(settings, rowIdx, colIdx, val) {
		let row = settings.data[rowIdx];
		if (row) {
			let col = settings.columns[colIdx];
			let rowData = row.data;
			col.dataSet(rowData, val, {
				settings,
				row: rowIdx,
				col: colIdx
			});
		}
	}
	/**
	* Write a value to a cell
	*
	* @param td Cell
	* @param val Value
	*/
	function writeCell(td, val) {
		let cell = Dom$1.s(td);
		if (val && typeof val === "object" && val.nodeName) cell.empty().append(val);
		else cell.html(val);
	}
	/**
	* Return an array with the full table data
	*
	* @param settings DataTables settings object
	* @returns array {array} aData Master data array
	*/
	function getDataMaster(settings) {
		return util.array.pluck(settings.data, "data");
	}
	/**
	* Nuke the table
	*
	* @param settings DataTables settings object
	*/
	function clearTable(settings) {
		settings.data.length = 0;
		settings.displayMaster.length = 0;
		settings.display.length = 0;
		settings.ids = {};
	}
	/**
	* Mark cached data as invalid such that a re-read of the data will occur when
	* the cached data is next requested. Also update from the data source object.
	*
	* @param settings DataTables settings object
	* @param rowIdx Row index to invalidate
	* @param src Source to invalidate from: undefined, 'auto', 'dom' or 'data'
	* @param colIdx Column index to invalidate. If undefined the whole row will be
	*    invalidated
	*/
	function invalidateRow(settings, rowIdx, src, colIdx) {
		var row = settings.data[rowIdx];
		var i, iLen;
		if (!row) return;
		row.orderCache = null;
		row.searchCellCache = null;
		row.displayData = null;
		if (src === "dom" || (!src || src === "auto") && row.src === "dom") row.data = getRowElementsFromModel(settings, row, colIdx).data;
		else {
			var cells = row.cells;
			var display = getRowDisplay(settings, rowIdx);
			if (cells.length) {
				if (colIdx !== void 0) writeCell(cells[colIdx], display[colIdx]);
				else for (i = 0, iLen = cells.length; i < iLen; i++) writeCell(cells[i], display[i]);
			}
		}
		invalidColumn(settings, colIdx);
		rowAttributes(settings, row);
		callbackFire(settings, null, "rowInvalidate", [
			settings,
			rowIdx,
			colIdx
		], false);
	}
	/**
	* Column specific invalidation
	*
	* @param settings DataTables settings object
	* @param colIdx Column index to invalidate, or all columns if not given
	*/
	function invalidColumn(settings, colIdx) {
		var cols = settings.columns;
		if (colIdx !== void 0) {
			cols[colIdx].type = null;
			cols[colIdx].wideStrings = null;
		} else for (let i = 0, iLen = cols.length; i < iLen; i++) {
			cols[i].type = null;
			cols[i].wideStrings = null;
		}
		settings.containerWidth = -1;
	}
	/**
	* Get the cells and data for a given row - from a <tr> element
	*
	* @param settings DataTables settings object
	* @param row TR element from which to read data or existing row object from
	*   which to re-read the data from the cells
	*/
	function getRowElementsFromNode(settings, row) {
		let data = settings.rowReadObject ? {} : [];
		let cells = Dom$1.s(row).children("th, td");
		let id = row.getAttribute("id");
		cells.each((el, idx) => {
			readCellData(settings, el, data, idx);
		});
		if (id) util.set(settings.rowId)(data, id);
		return {
			data,
			cells: cells.get()
		};
	}
	/**
	* Get the cells and data for a given row - from an existing row model
	*
	* @param settings DataTables settings object
	* @param row Existing row object from which to re-read the data from the cells
	* @param colIdx Optional column index
	*/
	function getRowElementsFromModel(settings, row, colIdx) {
		let tds = row.cells;
		for (let i = 0; i < tds.length; i++) if (colIdx === void 0 || colIdx === i) readCellData(settings, tds[i], row.data, i);
		if (row.tr) {
			let id = row.tr.getAttribute("id");
			if (id) util.set(settings.rowId)(row.data, id);
		}
		return {
			data: row.data,
			cells: tds
		};
	}
	/**
	* Read data from a cell into the data source object
	*
	* @param settings DataTables settings object
	* @param cell The HTML cell element to read from
	* @param data Data object / array to store data into
	* @param colIdx The column index for the cell
	*/
	function readCellData(settings, cell, data, colIdx) {
		let column = settings.columns[colIdx];
		let contents = cell.innerHTML.trim();
		if (column.attrSrc) {
			let dataPoint = column.data;
			let setter = util.set(dataPoint._);
			let attr = function(str, cell) {
				if (typeof str === "string") {
					let idx = str.indexOf("@");
					if (idx !== -1) {
						let att = str.substring(idx + 1);
						util.set(str)(data, cell.getAttribute(att));
					}
				}
			};
			setter(data, contents);
			attr(dataPoint.sort, cell);
			attr(dataPoint.type, cell);
			attr(dataPoint.filter, cell);
		} else {
			if (!column.setter) column.setter = util.set(column.data);
			column.setter(data, contents);
		}
	}
	/**
	* Recalculate the column widths, if needed (by a column having been
	* invalidated)
	*
	* @param settings DataTables settings object
	*/
	function columnWidths(settings) {
		if (settings.columns.map((c) => c.wideStrings).includes(null)) calculateColumnWidths(settings);
	}
	/**
	* Calculate the width of columns for the table
	*
	* @param settings DataTables settings object
	*/
	function calculateColumnWidths(settings) {
		if (!settings.features.autoWidth) return;
		var table = settings.table, columns = settings.columns, scroll = settings.scroll, scrollY = scroll.y, scrollX = scroll.x, visibleColumns = getColumns(settings, "visible"), tableWidthAttr = table.getAttribute("width"), tableContainer = table.parentElement, i, j, column, columnIdx;
		var styleWidth = table.style.width;
		var containerWidth = wrapperWidth(settings);
		if (containerWidth === settings.containerWidth) return false;
		settings.containerWidth = containerWidth;
		if (!styleWidth && !tableWidthAttr) {
			table.style.width = "100%";
			styleWidth = "100%";
		}
		if (styleWidth && styleWidth.indexOf("%") !== -1) tableWidthAttr = styleWidth;
		callbackFire(settings, null, "column-calc", [{ visible: visibleColumns }], false);
		var tmpTable = Dom$1.s(table.cloneNode()).css("visibility", "hidden").css("margin", "0").attrRemove("id");
		tmpTable.append(Dom$1.c("tbody"));
		tmpTable.append(settings.thead.cloneNode(true)).append(settings.tfoot.cloneNode(true));
		tmpTable.find("tfoot th, tfoot td").css("width", "");
		tmpTable.find("thead th, thead td").each((cell) => {
			var width = columnsSumWidth(settings, cell, true);
			if (width) {
				cell.style.width = width;
				if (scrollX) {
					cell.style.minWidth = width;
					Dom$1.s(cell).append(Dom$1.c("div").css({
						width,
						margin: "0",
						padding: "0",
						border: "0",
						height: "1px"
					}));
				}
			} else cell.style.width = "";
		});
		var longestData = [];
		for (i = 0; i < visibleColumns.length; i++) longestData.push(getWideStrings(settings, visibleColumns[i]));
		if (longestData.length) for (i = 0; i < longestData[0].length; i++) {
			var tr = Dom$1.c("tr").appendTo(tmpTable.find("tbody"));
			for (j = 0; j < visibleColumns.length; j++) {
				columnIdx = visibleColumns[j];
				column = columns[columnIdx];
				var longest = longestData[j][i] || "";
				var autoClass = ext.type.className[column.type];
				var text = longest + (column.contentPadding || (scrollX ? "-" : ""));
				var cell = Dom$1.c("td").classAdd(autoClass).classAdd(column.className).appendTo(tr);
				if (longest.indexOf("<") === -1 && longest.indexOf("&") === -1) cell.text(text);
				else cell.html(text);
			}
		}
		tmpTable.find("[name]").attrRemove("name");
		var holder = Dom$1.c("div").css(scrollX || scrollY ? {
			position: "absolute",
			top: "0",
			left: "0",
			height: "1px",
			right: "0",
			overflow: "hidden"
		} : {}).append(tmpTable).appendTo(tableContainer);
		if (scrollX) {
			tmpTable.css("width", "auto").attrRemove("width");
			if (tmpTable.width() < tableContainer.clientWidth && tableWidthAttr) tmpTable.width(tableContainer.clientWidth);
		} else if (scrollY) tmpTable.width(tableContainer.clientWidth);
		else if (tableWidthAttr) tmpTable.width(tableWidthAttr);
		var total = 0;
		var bodyCells = tmpTable.find("tbody tr").eq(0).children();
		for (i = 0; i < visibleColumns.length; i++) {
			var bounding = bodyCells.get(i).getBoundingClientRect().width;
			total += bounding;
			columns[visibleColumns[i]].width = stringToCss(bounding);
		}
		table.style.width = stringToCss(total);
		holder.remove();
		if (tableWidthAttr) table.style.width = stringToCss(tableWidthAttr);
		if ((tableWidthAttr || scrollX) && !settings.reszEvt) {
			var resize = util.throttle(function() {
				var newWidth = wrapperWidth(settings);
				if (!settings.destroying && newWidth !== 0) adjustColumnSizing(settings);
			});
			if (window.ResizeObserver) {
				var first = Dom$1.s(settings.tableWrapper).isVisible();
				var resizer = Dom$1.c("div").css({
					width: "100%",
					height: "0"
				}).classAdd("dt-autosize").appendTo(settings.tableWrapper);
				settings.resizeObserver = new ResizeObserver(function(e) {
					if (first) first = false;
					else resize();
				});
				settings.resizeObserver.observe(resizer.get(0));
			} else {
				window.addEventListener("resize", resize);
				settings.windowResizeCb = resize;
			}
			settings.reszEvt = true;
		}
	}
	/**
	* Get the width of the DataTables wrapper element
	*
	* @param settings DataTables settings object
	* @returns Width
	*/
	function wrapperWidth(settings) {
		let wrapper = Dom$1.s(settings.tableWrapper);
		return wrapper.isVisible() ? wrapper.width() : 0;
	}
	/**
	* Get the widest strings for each column.
	*
	* It is very difficult to determine what the widest string actually is due to variable character
	* width and kerning. Doing an exact calculation with the DOM or even Canvas would kill performance
	* and this is a critical point, so we use two techniques to determine a collection of the longest
	* strings from the column, which will likely contain the widest strings:
	*
	* 1) Get the top three longest strings from the column
	* 2) Get the top three widest words (i.e. an unbreakable phrase)
	*
	* @param settings DataTables settings object
	* @param colIdx column of interest
	* @returns Array of the longest strings
	*/
	function getWideStrings(settings, colIdx) {
		var column = settings.columns[colIdx];
		if (!column.wideStrings) {
			var allStrings = [];
			var collection = [];
			for (var i = 0, iLen = settings.displayMaster.length; i < iLen; i++) {
				var rowIdx = settings.displayMaster[i];
				var data = getRowDisplay(settings, rowIdx)[colIdx];
				var cellString = data && typeof data === "object" && data.nodeType ? data.innerHTML : data + "";
				cellString = cellString.replace(/id=".*?"/g, "").replace(/name=".*?"/g, "");
				cellString = cellString.replace(/<script[\s\S]*?<\/script(?:\s[^>]*)?>/gi, " ").replace(/<dialog[\s\S]*?<\/dialog(?:\s[^>]*)?>/gi, " ").replace(/<template[\s\S]*?<\/template(?:\s[^>]*)?>/gi, " ");
				var noHtml = util.string.stripHtml(cellString, " ").replace(/&nbsp;/g, " ");
				collection.push({
					str: cellString,
					len: noHtml.length
				});
				allStrings.push(noHtml);
			}
			collection.sort(function(a, b) {
				return b.len - a.len;
			}).splice(3);
			column.wideStrings = collection.map(function(item) {
				return item.str;
			});
			const parts = allStrings.join(" ").split(" ");
			parts.sort(function(a, b) {
				return b.length - a.length;
			});
			if (parts.length) column.wideStrings.push(parts[0]);
			if (parts.length > 1) column.wideStrings.push(parts[1]);
			if (parts.length > 2) column.wideStrings.push(parts[3]);
		}
		return column.wideStrings;
	}
	/**
	* Append a CSS unit (only if required) to a string
	*
	* @param s Value to css-ify
	* @returns Value with css unit
	*/
	function stringToCss(s) {
		if (s === null) return "0px";
		if (typeof s == "number") return s < 0 ? "0px" : s + "px";
		return s.match(/\d$/) ? s + "px" : s;
	}
	/**
	* Re-insert the `col` elements for current visibility
	*
	* @param settings DT settings
	*/
	function colGroup(settings) {
		var cols = settings.columns;
		settings.colgroup.empty();
		for (var i = 0; i < cols.length; i++) if (cols[i].visible) settings.colgroup.append(cols[i].colEl);
	}
	/**
	* Scrolling setup
	*
	* @param settings DataTables settings object
	* @returns Node to add to the DOM
	*/
	function featureTable(settings) {
		let table = Dom$1.s(settings.table);
		let scroll = settings.scroll;
		let scrollX = scroll.x;
		let scrollY = scroll.y;
		if (scrollY === "" && scrollX === "") return table.get(0);
		let classes = settings.classes.scrolling;
		let caption = settings.captionNode;
		let captionSide = caption ? caption._captionSide : null;
		let tableCloneHeader = table.clone(false);
		let tableCloneFooter = table.clone(false);
		let footer = table.children("tfoot");
		let size = function(s) {
			return !s ? "100%" : stringToCss(s);
		};
		let scroller = Dom$1.c("div").classAdd(classes.container).attr("role", "table").append(Dom$1.c("div").classAdd(classes.header.self).css({
			overflow: "hidden",
			position: "relative",
			border: "0",
			width: scrollX ? size(scrollX) : "100%"
		}).attr("role", "none").append(Dom$1.c("div").classAdd(classes.header.inner).css({
			"box-sizing": "content-box",
			width: scroll.xInner || "100%"
		}).attr("role", "none").append(tableCloneHeader.attrRemove("id").css("margin-left", "0").append(captionSide === "top" ? caption : null).append(table.children("thead"))))).append(Dom$1.c("div").classAdd(classes.body).css({
			position: "relative",
			overflow: "auto",
			width: size(scrollX)
		}).attr("role", "none").append(table));
		if (footer.count()) scroller.append(Dom$1.c("div").classAdd(classes.footer.self).css({
			overflow: "hidden",
			border: "0",
			width: scrollX ? size(scrollX) : "100%"
		}).attr("role", "none").append(Dom$1.c("div").classAdd(classes.footer.inner).attr("role", "none").append(tableCloneFooter.attrRemove("id").css("margin-left", "0").append(captionSide === "bottom" ? caption : null).append(table.children("tfoot")))));
		let children = scroller.children();
		let scrollHead = children.eq(0);
		let scrollBody = children.eq(1);
		let scrollFoot = children.eq(2);
		scrollBody.on("scroll.DT", () => {
			let scrollLeft = scrollBody.scrollLeft();
			scrollHead.scrollLeft(scrollLeft);
			scrollFoot.scrollLeft(scrollLeft);
		});
		scrollHead.on("scroll.DT", () => {
			let scrollLeft = scrollHead.scrollLeft();
			scrollBody.scrollLeft(scrollLeft);
			scrollFoot.scrollLeft(scrollLeft);
		});
		scrollFoot.on("scroll.DT", () => {
			let scrollLeft = scrollFoot.scrollLeft();
			scrollHead.scrollLeft(scrollLeft);
			scrollBody.scrollLeft(scrollLeft);
		});
		scrollBody.css("max-height", size(scrollY));
		if (!scroll.collapse) scrollBody.css("height", size(scrollY));
		settings.scrollHead = scrollHead;
		settings.scrollBody = scrollBody;
		settings.scrollFoot = scrollFoot;
		settings.callbacks.draw.push(scrollDraw);
		table.attr("role", "none");
		table.find("tbody").attr("role", "rowgroup");
		tableCloneHeader.attr("role", "none");
		tableCloneFooter.attr("role", "none");
		settings.colgroup.find("colgroup").attr("role", "none");
		let describedBy = table.attr("aria-describedby");
		if (describedBy) {
			scroller.attr("aria-describedby", describedBy);
			table.attrRemove("aria-describedby");
		}
		return scroller.get(0);
	}
	/**
	* Update the header, footer and body tables for resizing - i.e. column
	* alignment.
	*
	* Welcome to the most horrible function DataTables. The process that this
	* function follows is basically:
	*   1. Re-create the table inside the scrolling div
	*   2. Correct colgroup > col values if needed
	*   3. Copy colgroup > col over to header and footer
	*   4. Clean up
	*
	* @param settings DataTables settings object
	*/
	function scrollDraw(settings) {
		let scroll = settings.scroll, barWidth = scroll.barWidth, divHeaderInner = settings.scrollHead.children("div"), divHeaderTable = divHeaderInner.children("table"), divBodyEl = settings.scrollBody, divBody = divBodyEl, divFooterInner = settings.scrollFoot.children("div"), divFooterTable = divFooterInner.children("table"), header = Dom$1.s(settings.thead), table = Dom$1.s(settings.table), footer = Dom$1.s(settings.tfoot), browser = settings.browser, headerCopy, footerCopy;
		let scrollBarVis = divBodyEl.get(0).scrollHeight > divBodyEl.get(0).clientHeight;
		if (settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== void 0) {
			settings.scrollBarVis = scrollBarVis;
			adjustColumnSizing(settings);
			return;
		} else settings.scrollBarVis = scrollBarVis;
		header.find("thead").attr("role", "rowgroup");
		footer.find("tfoot").attr("role", "rowgroup");
		table.children("thead, tfoot").remove();
		headerCopy = header.clone(true).prependTo(table);
		headerCopy.find("th, td").attrRemove("tabindex");
		headerCopy.find("[id]").attrRemove("id");
		if (footer.count()) {
			footerCopy = footer.clone(true).prependTo(table);
			footerCopy.find("[id]").attrRemove("id");
		}
		if (settings.display.length) {
			let firstTr = null;
			let start = dataSource(settings) !== "ssp" ? settings.displayStart : 0;
			for (let i = start; i < start + settings.display.length; i++) {
				let idx = settings.display[i];
				let row = settings.data[idx];
				if (row) {
					let tr = row.tr;
					if (tr) {
						firstTr = tr;
						break;
					}
				}
			}
			if (firstTr) {
				let colSizes = Dom$1.s(firstTr).children("th, td").mapTo(function(cell, idx) {
					return {
						idx: visibleToColumnIndex(settings, idx),
						width: Dom$1.s(cell).width("outer")
					};
				});
				for (let i = 0; i < colSizes.length; i++) {
					let colEl = settings.columns[colSizes[i].idx].colEl;
					colEl.css("width", colSizes[i].width + "px");
					if (scroll.x) colEl.css("minWidth", colSizes[i].width + "px");
				}
			}
		}
		divHeaderTable.find("colgroup").remove();
		divHeaderTable.append(settings.colgroup.clone(true));
		if (footer) {
			divFooterTable.find("colgroup").remove();
			divFooterTable.append(settings.colgroup.clone(true));
		}
		headerCopy.find("th, td").each(function(el) {
			Dom$1.c("div").classAdd("dt-scroll-sizing").append(Array.from(el.childNodes)).appendTo(el);
		});
		if (footerCopy) footerCopy.find("th, td").each(function(el) {
			Dom$1.c("div").classAdd("dt-scroll-sizing").append(Array.from(el.childNodes)).appendTo(el);
		});
		let isScrolling = Math.floor(table.height()) > divBodyEl.get(0).clientHeight || divBody.css("overflow-y") == "scroll";
		let paddingSide = "padding" + (browser.scrollbarLeft ? "Left" : "Right");
		let outerWidth = table.width("withPadding");
		divHeaderTable.css("width", stringToCss(outerWidth));
		divHeaderInner.css("width", stringToCss(outerWidth)).css(paddingSide, isScrolling ? barWidth + "px" : "0px");
		if (footer.count()) {
			divFooterTable.css("width", stringToCss(outerWidth));
			divFooterInner.css("width", stringToCss(outerWidth)).css(paddingSide, isScrolling ? barWidth + "px" : "0px");
		}
		table.children("colgroup").prependTo(table);
		table.find("thead, tfoot").find("[tabindex]").attrRemove("tabindex");
		table.find("thead, tfoot").attr("role", "none").find("[role]").attrRemove("role");
		table.find("tbody tr:not([role])").attr("role", "row");
		table.find("tbody td:not([role]), tbody th:not([role])").attr("role", "cell");
		scrollAria(headerCopy);
		scrollAria(footerCopy);
		divBody.trigger("scroll");
		if ((settings.wasOrdered || settings.wasFiltered) && !settings.drawHold) divBodyEl.scrollTop(0);
	}
	/**
	* Apply ARIA roles for the header / footer of a scrolling table
	* @param element
	*/
	function scrollAria(element) {
		if (element) {
			element.find("tfoot:not([role])").attr("role", "rowgroup");
			element.find("tr:not([role])").attr("role", "row");
			element.find("th:not([role])").attr("role", "columnheader");
			element.find("td:not([role])").attr("role", "cell");
		}
	}
	/**
	* Add a column to the list used for the table with default values
	*
	* @param settings DataTables settings object
	*/
	function addColumn(settings) {
		let columnIdx = settings.columns.length;
		let column = util.object.assign({}, new Settings(), defaults$4, {
			orderData: defaults$4.orderData ? defaults$4.orderData : [columnIdx],
			data: defaults$4.data ? defaults$4.data : columnIdx,
			idx: columnIdx,
			searchFixed: {},
			colEl: Dom$1.c("col").attr("data-dt-column", columnIdx)
		});
		settings.columns.push(column);
		let searchCols = settings.searchCols;
		settings.searches[columnIdx] = create$2(searchCols[columnIdx] ? hungarianToCamel(searchCols[columnIdx]) : {});
		settings.searches[columnIdx].columns = [columnIdx];
	}
	/**
	* Apply options for a column
	*
	* @param settings DataTables settings object
	* @param colIdx column index to consider
	* @param options Column configuration options
	*/
	function columnOptions(settings, colIdx, options) {
		var column = settings.columns[colIdx];
		if (options !== void 0 && options !== null) {
			compatCols(options);
			if (options.type) column.typeManual = options.type;
			if (options.className && !options.className) options.className = options.className;
			var origClass = column.className;
			util.object.assign(column, options);
			map(column, options, "width", "widthOrig");
			if (origClass !== column.className) column.className = origClass + " " + column.className;
			map(column, options, "orderData");
			if (options.search) util.object.assign(settings.searches[colIdx], options.search);
		}
		var dataSrc = column.data;
		var dataFn = util.get(dataSrc);
		if (column.render && Array.isArray(column.render)) {
			var copy = column.render.slice();
			column.render = helpers[copy.shift()].apply(window, copy);
		}
		column.renderer = column.render ? util.get(column.render) : null;
		var attrTest = function(src) {
			return typeof src === "string" && src.indexOf("@") !== -1;
		};
		column.attrSrc = !!dataSrc && util.is.plainObject(dataSrc) && (attrTest(dataSrc.sort) || attrTest(dataSrc.type) || attrTest(dataSrc.filter));
		column.setter = null;
		column.dataGet = function(rowData, type, meta) {
			var innerData = dataFn(rowData, type, void 0, meta);
			return column.renderer && type ? column.renderer(innerData, type, rowData, meta) : innerData;
		};
		column.dataSet = function(rowData, val, meta) {
			return util.set(dataSrc)(rowData, val, meta);
		};
		if (typeof dataSrc !== "number" && !column._isArrayHost) settings.rowReadObject = true;
		if (!settings.features.ordering) column.orderable = false;
	}
	/**
	* Adjust the table column widths for new data. Note: you would probably want to
	* do a redraw after calling this function!
	*
	* @param settings DataTables settings object
	*/
	function adjustColumnSizing(settings) {
		calculateColumnWidths(settings);
		columnSizes(settings);
		let scroll = settings.scroll;
		if (scroll.y !== "" || scroll.x !== "") scrollDraw(settings);
		callbackFire(settings, null, "column-sizing", [settings]);
	}
	/**
	* Apply column sizes
	*
	* @param settings DataTables settings object
	*/
	function columnSizes(settings) {
		let cols = settings.columns;
		for (let i = 0; i < cols.length; i++) {
			let width = columnsSumWidth(settings, [i], false);
			if (width) {
				cols[i].colEl.css("width", width);
				if (settings.scroll.x) cols[i].colEl.css("min-width", width);
			}
		}
	}
	/**
	* Convert the index of a visible column to the index in the data array (take
	* account of hidden columns)
	*
	* @param settings DataTables settings object
	* @param visIdx Visible column index to lookup
	* @returns i the data index
	*/
	function visibleToColumnIndex(settings, visIdx) {
		let aiVis = getColumns(settings, "visible");
		return typeof aiVis[visIdx] === "number" ? aiVis[visIdx] : null;
	}
	/**
	* Convert the index of an index in the data array and convert it to the visible
	* column index (take account of hidden columns)
	*
	* @param settings DataTables settings object
	* @param match Column index to lookup
	* @returns The data index
	*/
	function columnIndexToVisible(settings, match) {
		let iPos = getColumns(settings, "visible").indexOf(match);
		return iPos !== -1 ? iPos : null;
	}
	/**
	* Get the number of visible columns
	*
	* @param settings DataTables settings object
	* @returns i the number of visible columns
	*/
	function visibleColumns(settings) {
		let layout = settings.header;
		let columns = settings.columns;
		let vis = 0;
		if (layout.length) {
			for (let i = 0, iLen = layout[0].length; i < iLen; i++) if (columns[i].visible && Dom$1.s(layout[0][i].cell).css("display") !== "none") vis++;
		}
		return vis;
	}
	/**
	* Get an array of column indexes that match a given property
	*
	* @param settings DataTables settings object
	* @param param Parameter in the columns array to look for
	*  @returns Array of indexes with matched properties
	*/
	function getColumns(settings, param) {
		let a = [];
		settings.columns.map(function(val, i) {
			if (val[param]) a.push(i);
		});
		return a;
	}
	/**
	* Allow the result from a type detection function to be `true` while
	* translating that into a string. Old type detection functions will return the
	* type name if it passes. An object store would be better, but not backwards
	* compatible.
	*
	* @param typeDetect Object or function for type detection
	* @param res Result from the type detection function
	* @returns Type name or false
	*/
	function _typeResult(typeDetect, res) {
		return res === true ? typeDetect._name : res;
	}
	/**
	* Calculate the 'type' of a column
	* @param settings DataTables settings object
	*/
	function columnTypes(settings, originalTypes = "") {
		var columns = settings.columns;
		var data = settings.data;
		var types = ext.type.detect;
		var i, iLen, j, jen, k, ken;
		var col, detectedType, cache;
		if (!originalTypes) originalTypes = columns.map((c) => c.type).join(",");
		for (i = 0, iLen = columns.length; i < iLen; i++) {
			col = columns[i];
			cache = [];
			if (!col.type && col.typeManual) col.type = col.typeManual;
			else if (!col.type) {
				if (!settings.typeDetect) return;
				for (j = 0, jen = types.length; j < jen; j++) {
					let typeDetect = types[j];
					let oneOf;
					let allOf;
					let init;
					let one = false;
					if (typeof typeDetect === "function") allOf = typeDetect;
					else {
						oneOf = typeDetect.oneOf;
						allOf = typeDetect.allOf;
						init = typeDetect.init;
					}
					detectedType = null;
					if (init) {
						detectedType = _typeResult(typeDetect, init(settings, col, i));
						if (detectedType) {
							col.type = detectedType;
							break;
						}
					}
					for (k = 0, ken = data.length; k < ken; k++) {
						if (!data[k]) continue;
						if (cache[k] === void 0) cache[k] = getCellData(settings, k, i, "type");
						if (oneOf && !one) one = _typeResult(typeDetect, oneOf(cache[k], settings));
						detectedType = _typeResult(typeDetect, allOf(cache[k], settings));
						if (!detectedType && j !== types.length - 3) break;
						if (detectedType === "html" && !util.is.empty(cache[k])) break;
					}
					if (oneOf && one && detectedType || !oneOf && detectedType) {
						col.type = detectedType;
						break;
					}
				}
				if (!col.type) col.type = "string";
			}
			var autoClass = ext.type.className[col.type];
			if (autoClass) {
				_columnAutoClass(settings.header, i, autoClass);
				_columnAutoClass(settings.footer, i, autoClass);
			}
			var renderer = ext.type.render[col.type];
			if (renderer && !col.renderer) {
				col.renderer = util.get(renderer);
				_columnAutoRender(settings, i);
			}
		}
		if (columns.map((c) => c.type).join(",") !== originalTypes) callbackFire(settings, null, "columnTypes", [settings], false);
	}
	/**
	* Apply an auto detected renderer to data which doesn't yet have a renderer
	*/
	function _columnAutoRender(settings, colIdx) {
		let data = settings.data;
		for (let i = 0; i < data.length; i++) {
			let d = data[i];
			if (d && d.tr) {
				let display = getCellData(settings, i, colIdx, "display");
				d.displayData[colIdx] = display;
				writeCell(d.cells[colIdx], display);
			}
		}
	}
	/**
	* Apply a class name to a column's header cells
	*
	* @param container The header / footer structure array
	* @param colIdx Column index
	* @param className Class name to apply
	*/
	function _columnAutoClass(container, colIdx, className) {
		container.forEach(function(row) {
			if (row[colIdx] && row[colIdx].unique) Dom$1.s(row[colIdx].cell).classAdd(className);
		});
	}
	/**
	* Take the column definitions and static columns arrays and calculate how they
	* relate to column indexes. The callback function will then apply the
	* definition found for a column to a suitable configuration object.
	*
	* @param settings DataTables settings object
	* @param aoColDefs The aoColumnDefs array that is to be applied
	* @param aoCols The aoColumns array that defines columns individually
	* @param headerLayout Layout for header as it was loaded
	* @param fn Callback function - takes two parameters, the calculated column
	*    index and the definition for that column.
	*/
	function applyColumnDefs(settings, aoColDefs, aoCols, headerLayout, fn) {
		var i, iLen, j, jLen, k, kLen;
		var columns = settings.columns;
		if (aoCols) {
			for (i = 0, iLen = aoCols.length; i < iLen; i++) if (aoCols[i] && aoCols[i].name) columns[i].name = aoCols[i].name;
		}
		if (aoColDefs) for (i = aoColDefs.length - 1; i >= 0; i--) {
			let def = aoColDefs[i];
			let aTargets = def.target !== void 0 ? def.target : def.targets !== void 0 ? def.targets : def.aTargets;
			if (!Array.isArray(aTargets)) aTargets = [aTargets];
			for (j = 0, jLen = aTargets.length; j < jLen; j++) {
				var target = aTargets[j];
				if (typeof target === "number" && target >= 0) {
					while (columns.length <= target) addColumn(settings);
					fn(target, def);
				} else if (typeof target === "number" && target < 0) fn(columns.length + target, def);
				else if (typeof target === "string") for (k = 0, kLen = columns.length; k < kLen; k++) if (target === "_all") fn(k, def);
				else if (target.indexOf(":name") !== -1) {
					if (columns[k].name === target.replace(":name", "")) fn(k, def);
				} else headerLayout.forEach(function(row) {
					if (row[k]) {
						var cell = row[k].cell;
						if (target.match(/^[a-z][\w-]*$/i)) target = "." + target;
						if (cell.matches(target)) fn(k, def);
					}
				});
			}
		}
		if (aoCols) for (i = 0, iLen = aoCols.length; i < iLen; i++) fn(i, aoCols[i]);
	}
	/**
	* Get the width for a given set of columns
	*
	* @param settings DataTables settings object
	* @param targets Columns - comma separated string or array of numbers
	* @param original Use the original width (true) or calculated (false)
	* @param incVisible Include visible columns (true) or not (false)
	* @returns Combined CSS value
	*/
	function columnsSumWidth(settings, targets, original, incVisible) {
		if (!Array.isArray(targets)) targets = columnsFromHeader(targets);
		let sum = 0;
		let unit = "px";
		let columns = settings.columns;
		for (let i = 0, iLen = targets.length; i < iLen; i++) {
			let column = columns[targets[i]];
			let definedWidth = original ? column.widthOrig : column.width;
			if (column.visible === false) continue;
			if (definedWidth === null || definedWidth === void 0) return null;
			else if (typeof definedWidth === "number") sum += definedWidth;
			else {
				let matched = definedWidth.match(/([\d\.]+)([^\d]*)/);
				if (matched) {
					sum += parseFloat(matched[1]);
					unit = matched.length === 3 ? matched[2] : "px";
				}
			}
		}
		return sum + unit;
	}
	/**
	* Determine what columns a header cell covers (can be multiple for colspan
	* cases).
	*
	* @param cell The header cell in question
	* @returns An array of column indexes
	*/
	function columnsFromHeader(cell) {
		let attr = Dom$1.s(cell).closest("[data-dt-column]").attr("data-dt-column");
		if (!attr) return [];
		return attr.split(",").map(function(val) {
			return parseInt(val);
		});
	}
	/**
	* Generate the node required for the processing node
	*
	* @param ctx DataTables settings object
	*/
	function processingHtml(ctx) {
		var table = ctx.table;
		var scrolling = ctx.scroll.x !== "" || ctx.scroll.y !== "";
		if (ctx.features.processing) {
			var n = Dom$1.c("div").attr("id", ctx.tableId + "_processing").attr("role", "status").classAdd(ctx.classes.processing.container).html(ctx.language.processing).append(Dom$1.c("div").append(Dom$1.c("div")).append(Dom$1.c("div")).append(Dom$1.c("div")).append(Dom$1.c("div")));
			if (scrolling) n.prependTo(Dom$1.s(ctx.tableWrapper).find("div.dt-scroll").get(0));
			else n.insertBefore(table);
			Dom$1.s(table).on("processing.dt.DT", (e, s, show) => {
				n.css("display", show ? "block" : "none");
			});
		}
	}
	/**
	* Display or hide the processing indicator
	*
	* @param ctx DataTables settings object
	* @param show Show the processing indicator (true) or not (false)
	*/
	function processingDisplay(ctx, show) {
		if (ctx.doingDraw && show === false) return;
		callbackFire(ctx, null, "processing", [ctx, show]);
	}
	/**
	* Show the processing element if an action takes longer than a given time
	*
	* @param ctx DataTables settings object
	* @param enable Do (true) or not (false) async processing (local feature enablement)
	* @param run Function to run
	*/
	function processingRun(ctx, enable, run) {
		if (!enable) run();
		else {
			processingDisplay(ctx, true);
			setTimeout(function() {
				run();
				processingDisplay(ctx, false);
			}, 0);
		}
	}
	function renderer(ctx, type) {
		var render = ctx.renderer;
		var host = ext.renderer[type];
		if (plainObject(render) && render[type]) return host[render[type]] || host._;
		else if (typeof render === "string") return host[render] || host._;
		return host._;
	}
	/**
	* Add the options to the page HTML for the table
	*
	* @param ctx DataTables context
	*/
	function createLayout(ctx) {
		var classes = ctx.classes;
		var insert = Dom$1.c("div").attr("id", ctx.tableId + "_wrapper").classAdd(classes.container).insertBefore(ctx.table);
		ctx.tableWrapper = insert.get(0);
		if (ctx.dom) legacyDom(ctx, ctx.dom, insert);
		else {
			var top = convert(ctx, ctx.layout, "top");
			var bottom = convert(ctx, ctx.layout, "bottom");
			var render = renderer(ctx, "layout");
			top.forEach(function(item) {
				render(ctx, insert, item);
			});
			render(ctx, insert, { full: {
				contents: [featureTable(ctx)],
				items: [],
				table: true
			} });
			bottom.forEach(function(item) {
				render(ctx, insert, item);
			});
		}
		processingHtml(ctx);
	}
	/**
	* Expand the layout items into an object for the rendering function
	*/
	function layoutItems(row, align, items) {
		if (Array.isArray(items)) {
			for (var i = 0; i < items.length; i++) layoutItems(row, align, items[i]);
			return;
		}
		var rowCell = row[align];
		if (util.is.plainObject(items)) {
			if (items.features) {
				if (items.rowId) row.id = items.rowId;
				if (items.rowClass) row.className = items.rowClass;
				rowCell.id = items.id;
				rowCell.className = items.className;
				layoutItems(row, align, items.features);
			} else util.object.each(items, (key, val) => {
				rowCell.items.push({
					feature: key,
					opts: val
				});
			});
		} else rowCell.items.push(items);
	}
	/**
	* Find, or create a layout row and setup a target cell in it
	*
	* @param rows Rows array to search for the target row. Is mutated when a row is
	*   added if not found.
	* @param rowNum Row index to get
	* @param align Where the cell position is
	* @returns The row
	*/
	function getRow(rows, rowNum, align) {
		var row;
		for (var i = 0; i < rows.length; i++) {
			row = rows[i];
			if (row.rowNum === rowNum) {
				if (align === "full" && row.full || (align === "start" || align === "end") && (row.start || row.end)) {
					if (!row[align]) row[align] = {
						contents: [],
						items: []
					};
					return row;
				}
			}
		}
		row = { rowNum };
		row[align] = {
			contents: [],
			items: []
		};
		rows.push(row);
		return row;
	}
	/**
	* Convert a `layout` object given by a user to the object structure needed
	* for the renderer. This is done twice, once for above and once for below
	* the table. Ordering must also be considered.
	*
	* @param settings DataTables settings object
	* @param layout Layout object to convert
	* @param side `top` or `bottom`
	* @returns Converted array structure - one item for each row.
	*/
	function convert(settings, layout, side) {
		var rows = [];
		util.object.each(layout, function(pos, items) {
			var parts = pos.match(/^([a-z]+)([0-9]*)([A-Za-z]*)$/);
			if (items === null || !parts) return;
			var rowNum = parts[2] ? parseInt(parts[2]) : 0;
			var align = parts[3] ? parts[3].toLowerCase() : "full";
			if (parts[1] !== side) return;
			if (align !== "full" && align !== "start" && align !== "end") return;
			layoutItems(getRow(rows, rowNum, align), align, items);
		});
		rows.sort(function(a, b) {
			var order1 = a.rowNum || 0;
			var order2 = b.rowNum || 0;
			if (order1 === order2) {
				var ret = a.full && !b.full ? -1 : 1;
				return side === "bottom" ? ret * -1 : ret;
			}
			return order2 - order1;
		});
		if (side === "bottom") rows.reverse();
		for (var row = 0; row < rows.length; row++) {
			delete rows[row].rowNum;
			resolve(settings, rows[row]);
		}
		return rows;
	}
	/**
	* Convert the contents of a row's layout object to nodes that can be inserted
	* into the document by a renderer. Execute functions, look up plug-ins, etc.
	*
	* @param settings DataTables settings object
	* @param row Layout object for this row
	*/
	function resolve(settings, row) {
		var getFeature = function(feature, opts) {
			if (!ext.features[feature]) log(settings, 0, "Unknown feature: " + feature);
			return ext.features[feature].apply(this, [settings, opts]);
		};
		var resolve = function(item) {
			if (!row[item]) return;
			row[item].contents = row[item].items.filter((item) => !!item).map((item) => {
				if (typeof item === "string") return getFeature(item, null);
				else if (util.is.plainObject(item)) return getFeature(item.feature, item.opts);
				else if (typeof item.node === "function") return item.node(settings);
				else if (typeof item === "function") {
					var inst = item(settings);
					return typeof inst.node === "function" ? inst.node() : inst;
				} else if (item.nodeName) return item;
				else if (item instanceof Dom$1) return item.get(0);
				else if (item.length) return item[0];
			});
		};
		resolve("start");
		resolve("end");
		resolve("full");
	}
	/**
	* Draw the table with the legacy DOM property
	*
	* @param settings DT settings instance
	* @param layout DOM string
	* @param insert Insert point
	*/
	function legacyDom(settings, layout, insert) {
		let parts = layout.match(/(".*?")|('.*?')|./g);
		let featureNode, option, newNode, next, attr;
		if (!parts) return;
		for (let i = 0; i < parts.length; i++) {
			featureNode = null;
			option = parts[i];
			if (option == "<") {
				newNode = Dom$1.c("div");
				next = parts[i + 1];
				if (next[0] == "'" || next[0] == "\"") {
					attr = next.replace(/['"]/g, "");
					let id = "", className;
					if (attr.indexOf(".") != -1) {
						let split = attr.split(".");
						id = split[0];
						className = split[1];
					} else if (attr[0] == "#") id = attr;
					else className = attr;
					newNode.attr("id", id.substring(1)).classAdd(className);
					i++;
				}
				insert.append(newNode.get());
				insert = newNode;
			} else if (option == ">") insert = insert.parent();
			else if (option == "t") featureNode = featureTable(settings);
			else ext.feature.forEach(function(feature) {
				if (option == feature.cFeature) featureNode = feature.fnInit(settings);
			});
			if (featureNode) insert.append(featureNode instanceof Dom$1 ? featureNode.get() : featureNode);
		}
	}
	function sortInit(settings) {
		var target = settings.thead;
		var headerRows = target.querySelectorAll("tr");
		var titleRow = settings.titleRow;
		var notSelector = ":not([data-dt-order=\"disable\"]):not([data-dt-order=\"icon-only\"])";
		if (titleRow === true) target = headerRows[0];
		else if (titleRow === false) target = headerRows[headerRows.length - 1];
		else if (titleRow !== null) target = headerRows[titleRow];
		if (settings.orderHandler) sortAttachListener(settings, target, target === settings.thead ? "tr" + notSelector + " th" + notSelector + ", tr" + notSelector + " td" + notSelector : "th" + notSelector + ", td" + notSelector);
		var order = [];
		sortResolve(settings, order, settings.order);
		settings.order = order;
	}
	/**
	* Attach event listeners to a node that will trigger ordering on a column
	*
	* @param settings DataTables context
	* @param node Node to attach to
	* @param selector Delegate selector
	* @param column Column index to target
	* @param callback Callback for when done
	*/
	function sortAttachListener(settings, node, selector, column, callback) {
		bindAction(node, selector, function(e) {
			var run = false;
			var columns = column === void 0 ? columnsFromHeader(e.target) : typeof column === "function" ? column() : Array.isArray(column) ? column : [column];
			if (columns.length) {
				for (var i = 0, iLen = columns.length; i < iLen; i++) {
					if (sortAdd(settings, columns[i], i, e.shiftKey) !== false) run = true;
					if (settings.order.length === 1 && settings.order[0][1] === "") break;
				}
				if (run) processingRun(settings, true, function() {
					sort(settings);
					sortDisplay(settings, settings.display);
					reDraw(settings, false, false);
					if (callback) callback();
				});
			}
		});
	}
	/**
	* Sort the display array to match the master's order
	*
	* @param settings DataTables context
	* @param display The display array
	*/
	function sortDisplay(settings, display) {
		if (display.length < 2) return;
		var master = settings.displayMaster;
		var masterMap = {};
		var map = {};
		var i = 0;
		for (; i < master.length; i++) masterMap[master[i]] = i;
		for (i = 0; i < display.length; i++) map[display[i]] = masterMap[display[i]];
		display.sort(function(a, b) {
			return map[a] - map[b];
		});
	}
	/**
	* Convert the API variants that can be used for defining the order into our
	* internal OrderColumn array.
	*
	* @param settings DataTable context object
	* @param nestedSort Array to write the resolve values to
	* @param sortItem Source object / array from user (It is really an `Order`
	*   but due to `aaSorting` being used for input and the internal structure
	*   it is currently any).
	* @todo Split aaSorting into unresolved and resolved parameters (in state.ts as
	*   well)
	*/
	function sortResolve(settings, nestedSort, sortItem) {
		var push = function(a) {
			if (plainObject(a)) {
				let orderIdx = a;
				let orderName = a;
				if (orderIdx.idx !== void 0) nestedSort.push([orderIdx.idx, orderIdx.dir]);
				else if (orderName.name) {
					var idx = pluck(settings.columns, "name").indexOf(orderName.name);
					if (idx !== -1) nestedSort.push([idx, orderName.dir]);
				}
			} else nestedSort.push(a);
		};
		if (plainObject(sortItem)) push(sortItem);
		else if (Array.isArray(sortItem) && typeof sortItem[0] === "number") push(sortItem);
		else if (Array.isArray(sortItem)) for (var z = 0; z < sortItem.length; z++) push(sortItem[z]);
	}
	function sortFlatten(settings) {
		var i, k, kLen, aSort = [], extSort = ext.type.order, aoColumns = settings.columns, dataSort, colIdx, type, srcCol, fixed = settings.orderFixed, fixedObj = plainObject(fixed), nestedSort = [];
		if (!settings.features.ordering) return aSort;
		if (Array.isArray(fixed)) sortResolve(settings, nestedSort, fixed);
		if (fixedObj && fixed.pre) sortResolve(settings, nestedSort, fixed.pre);
		sortResolve(settings, nestedSort, settings.order);
		if (fixedObj && fixed.post) sortResolve(settings, nestedSort, fixed.post);
		for (i = 0; i < nestedSort.length; i++) {
			srcCol = nestedSort[i][0];
			if (aoColumns[srcCol]) {
				dataSort = aoColumns[srcCol].orderData;
				for (k = 0, kLen = dataSort.length; k < kLen; k++) {
					colIdx = dataSort[k];
					type = aoColumns[colIdx].type || "string";
					if (nestedSort[i]._idx === void 0) nestedSort[i]._idx = aoColumns[colIdx].orderSequence.indexOf(nestedSort[i][1]);
					if (nestedSort[i][1]) aSort.push({
						src: srcCol,
						col: colIdx,
						dir: nestedSort[i][1],
						index: nestedSort[i]._idx,
						type,
						formatter: extSort[type + "-pre"],
						sorter: extSort[type + "-" + nestedSort[i][1]]
					});
				}
			}
		}
		return aSort;
	}
	/**
	* Change the order of the table
	*
	* @param ctx DataTables settings object
	* @param col Column to perform sort on
	* @param dir Direction to sort on
	*/
	function sort(ctx, col, dir) {
		var i, iLen, aiOrig = [], extSort = ext.type.order, data = ctx.data, sortCol, displayMaster = ctx.displayMaster, aSort;
		columnTypes(ctx);
		if (col !== void 0) {
			var srcCol = ctx.columns[col];
			aSort = [{
				src: col,
				col,
				dir: dir || "",
				index: 0,
				type: srcCol.type,
				formatter: extSort[srcCol.type + "-pre"],
				sorter: extSort[srcCol.type + "-" + dir]
			}];
			displayMaster = displayMaster.slice();
		} else aSort = sortFlatten(ctx);
		for (i = 0, iLen = aSort.length; i < iLen; i++) {
			sortCol = aSort[i];
			sortData(ctx, sortCol.col);
		}
		if (dataSource(ctx) != "ssp" && aSort.length !== 0) {
			for (i = 0, iLen = displayMaster.length; i < iLen; i++) aiOrig[i] = i;
			if (aSort.length && aSort[0].dir === "desc" && ctx.orderDescReverse) aiOrig.reverse();
			displayMaster.sort(function(a, b) {
				var _a, _b;
				var x, y, k, test, sortItem, len = aSort.length, dataA = (_a = data[a]) === null || _a === void 0 ? void 0 : _a.orderCache, dataB = (_b = data[b]) === null || _b === void 0 ? void 0 : _b.orderCache;
				for (k = 0; k < len; k++) {
					sortItem = aSort[k];
					x = dataA[sortItem.col];
					y = dataB[sortItem.col];
					if (sortItem.sorter) {
						test = sortItem.sorter(x, y);
						if (test !== 0) return test;
					} else {
						test = x < y ? -1 : x > y ? 1 : 0;
						if (test !== 0) return sortItem.dir === "asc" ? test : -test;
					}
				}
				x = aiOrig[a];
				y = aiOrig[b];
				return x < y ? -1 : x > y ? 1 : 0;
			});
		} else if (aSort.length === 0) displayMaster.sort(function(x, y) {
			return x < y ? -1 : x > y ? 1 : 0;
		});
		if (col === void 0) {
			ctx.wasOrdered = true;
			ctx.sortDetails = aSort;
			callbackFire(ctx, null, "order", [ctx, aSort]);
		}
		return displayMaster;
	}
	/**
	* Function to run on user sort request
	*
	* @param settings dataTables settings object
	* @param colIdx column sorting index
	* @param addIndex Counter
	* @param shift Shift click add
	*/
	function sortAdd(settings, colIdx, addIndex, shift) {
		var col = settings.columns[colIdx];
		var sorting = settings.order;
		var asSorting = col.orderSequence;
		var nextSortIdx;
		var next = function(a, overflow) {
			var idx = a._idx;
			if (idx === void 0) idx = asSorting.indexOf(a[1]);
			return idx + 1 < asSorting.length ? idx + 1 : overflow ? null : 0;
		};
		if (!col.orderable) return false;
		if (typeof sorting[0] === "number") sorting = settings.order = [sorting];
		if ((shift || addIndex) && settings.features.orderMulti) {
			var sortIdx = pluck(sorting, "0").indexOf(colIdx);
			if (sortIdx !== -1) {
				nextSortIdx = next(sorting[sortIdx], true);
				if (nextSortIdx === null && sorting.length === 1) nextSortIdx = 0;
				if (nextSortIdx === null || asSorting[nextSortIdx] === "") sorting.splice(sortIdx, 1);
				else {
					sorting[sortIdx][1] = asSorting[nextSortIdx];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			} else if (shift) {
				sorting.push([
					colIdx,
					asSorting[0],
					0
				]);
				sorting[sorting.length - 1]._idx = 0;
			} else {
				sorting.push([
					colIdx,
					sorting[0][1],
					0
				]);
				sorting[sorting.length - 1]._idx = 0;
			}
		} else if (sorting.length && sorting[0][0] == colIdx) {
			nextSortIdx = next(sorting[0]);
			if (nextSortIdx) {
				sorting.length = 1;
				sorting[0][1] = asSorting[nextSortIdx];
				sorting[0]._idx = nextSortIdx;
			} else {
				sorting.length = 1;
				sorting[0][1] = asSorting[0];
				sorting[0]._idx = 0;
			}
		} else {
			sorting.length = 0;
			sorting.push([colIdx, asSorting[0]]);
			sorting[0]._idx = 0;
		}
	}
	/**
	* Set the sorting classes on table's body, Note: it is safe to call this function
	* when bSort and bSortClasses are false
	*
	* @param settings DataTables settings object
	*/
	function sortingClasses(settings) {
		var oldSort = settings.lastOrder;
		var sortClass = settings.classes.order.position;
		var sortFlat = sortFlatten(settings);
		var features = settings.features;
		var i, iLen, colIdx;
		if (features.ordering && features.orderClasses) {
			for (i = 0, iLen = oldSort.length; i < iLen; i++) {
				colIdx = oldSort[i].src;
				Dom$1.s(pluck(settings.data, "cells", colIdx)).classRemove(sortClass + (i < 2 ? i + 1 : 3));
			}
			for (i = 0, iLen = sortFlat.length; i < iLen; i++) {
				colIdx = sortFlat[i].src;
				Dom$1.s(pluck(settings.data, "cells", colIdx)).classAdd(sortClass + (i < 2 ? i + 1 : 3));
			}
		}
		settings.lastOrder = sortFlat;
	}
	/**
	* Get the data to sort a column, be it from cache, fresh (populating the
	* cache), or from a sort formatter
	*
	* @param settings DataTables settings object
	* @param colIdx Column index
	*/
	function sortData(settings, colIdx) {
		var column = settings.columns[colIdx];
		var customSort = ext.order[column.orderDataType];
		var customData;
		if (customSort) customData = customSort.call(settings.instance, settings, colIdx, columnIndexToVisible(settings, colIdx));
		var row, cellData;
		var formatter = ext.type.order[column.type + "-pre"];
		var data = settings.data;
		for (var rowIdx = 0; rowIdx < data.length; rowIdx++) {
			if (!data[rowIdx]) continue;
			row = data[rowIdx];
			if (row && !row.orderCache) row.orderCache = [];
			if (row && (!row.orderCache[colIdx] || customSort)) {
				cellData = customSort ? customData[rowIdx] : getCellData(settings, rowIdx, colIdx, "sort");
				row.orderCache[colIdx] = formatter ? formatter(cellData, settings) : cellData;
			}
		}
	}
	/**
	* Alter the display settings to change the page
	*
	* @param settings DataTables settings object
	* @param action Paging action to take: "first", "previous", "next" or "last" or
	*   page number to jump to (integer)
	* @param redraw Automatically draw the update or not
	* @returns true page has changed, false - no change
	*/
	function pageChange(settings, action, redraw) {
		var start = settings.displayStart, len = settings.pageLength, records = recordsDisplay(settings);
		if (records === 0 || len === -1) start = 0;
		else if (typeof action === "number") {
			start = action * len;
			if (start > records) start = 0;
		} else if (action == "first") start = 0;
		else if (action == "previous") {
			start = len >= 0 ? start - len : 0;
			if (start < 0) start = 0;
		} else if (action == "next") {
			if (start + len < records) start += len;
		} else if (action == "last") start = Math.floor((records - 1) / len) * len;
		else if (action === "ellipsis") return;
		else log(settings, 0, "Unknown paging action: " + action, 5);
		var changed = settings.displayStart !== start;
		settings.displayStart = start;
		callbackFire(settings, null, changed ? "page" : "page-nc", [settings]);
		if (changed && redraw) draw(settings);
		return changed;
	}
	/**
	* State information for a table
	*
	* @param settings DataTables settings object
	*/
	function saveState(settings) {
		if (settings.loadingState) return;
		var sorting = [];
		sortResolve(settings, sorting, settings.order);
		var columns = settings.columns;
		var state = {
			columns: settings.columns.map(function(col, i) {
				return {
					name: col.name,
					visible: col.visible,
					search: Object.assign({}, settings.searches[i])
				};
			}),
			length: settings.pageLength,
			order: sorting.map(function(sort) {
				return columns[sort[0]] && columns[sort[0]].name ? [columns[sort[0]].name, sort[1]] : sort.slice();
			}),
			search: Object.assign({}, settings.searches["*"]),
			searchGroups: Object.keys(settings.searches).filter((c) => c.includes(",")).map((c) => Object.assign({}, settings.searches[c])),
			start: settings.displayStart,
			time: +/* @__PURE__ */ new Date()
		};
		settings.stateSaved = state;
		callbackFire(settings, "stateSaveParams", "stateSaveParams", [settings, state]);
		if (settings.features.stateSave && !settings.destroying) settings.stateSaveCallback.call(settings.instance, settings, state);
	}
	/**
	* Attempt to load a saved table state
	*
	* @param settings dataTables settings object
	* @param callback Callback to execute when the state has been loaded
	*/
	function loadState(settings, callback) {
		if (!settings.features.stateSave) {
			callback();
			return;
		}
		var loaded = function(state, ignoreTime = false) {
			implementState(settings, state, ignoreTime, callback);
		};
		var state = settings.stateLoadCallback.call(settings.instance, settings, loaded);
		if (state !== void 0) implementState(settings, state, false, callback);
		return true;
	}
	function implementState(settings, s, ignoreTime, callback) {
		var i, iLen;
		var columns = settings.columns;
		var currentNames = pluck(settings.columns, "name");
		settings.loadingState = true;
		var api = settings.initDone ? new Api(settings) : null;
		if (!ignoreTime) {
			if (!s || !s.time) {
				settings.loadingState = false;
				callback();
				return;
			}
			var duration = settings.stateDuration;
			if (duration > 0 && s.time < +/* @__PURE__ */ new Date() - duration * 1e3) {
				settings.loadingState = false;
				callback();
				return;
			}
		}
		if (callbackFire(settings, "stateLoadParams", "stateLoadParams", [settings, s]).indexOf(false) !== -1) {
			settings.loadingState = false;
			callback();
			return;
		}
		settings.stateLoaded = assignDeep({}, s);
		callbackFire(settings, null, "stateLoadInit", [settings, s], true);
		if (s.length !== void 0) {
			if (api) api.page.len(s.length);
			else settings.pageLength = s.length;
		}
		if (s.start !== void 0) {
			if (api === null) {
				settings.displayStart = s.start;
				settings.displayStartInit = s.start;
			} else pageChange(settings, s.start / settings.pageLength);
		}
		if (s.order !== void 0) {
			settings.order = [];
			for (let i = 0; i < s.order.length; i++) {
				let col = s.order[i];
				let set = [col[0], col[1]];
				if (typeof col[0] === "string") {
					let idx = currentNames.indexOf(col[0]);
					if (idx < 0) continue;
					set[0] = idx;
				} else if (set[0] >= columns.length) continue;
				settings.order.push(set);
			}
		}
		if (s.search !== void 0) Object.assign(settings.searches["*"], s.search);
		if (s.searchGroups) s.searchGroups.forEach((group) => {
			if (group.columns) {
				let index = group.columns.join(",");
				settings.searches[index] = create$2(group);
			}
		});
		if (s.columns) {
			var set = s.columns;
			var incoming = pluck(s.columns, "name");
			if (incoming.join("").length && incoming.join("") !== currentNames.join("")) {
				set = [];
				for (i = 0; i < currentNames.length; i++) if (currentNames[i] != "") {
					var idx = incoming.indexOf(currentNames[i]);
					if (idx >= 0) set.push(s.columns[idx]);
					else set.push({});
				} else set.push({});
			}
			if (set.length === columns.length) {
				for (i = 0, iLen = set.length; i < iLen; i++) {
					var col = set[i];
					if (col.visible !== void 0) {
						if (api) api.column(i).visible(col.visible, false);
						else columns[i].visible = col.visible;
					}
					if (col.search !== void 0) {
						Object.assign(settings.searches[i], col.search);
						settings.searches[i].columns = [i];
					}
				}
				if (api) api.one("draw", function() {
					api.columns.adjust();
				});
			}
		}
		settings.loadingState = false;
		callbackFire(settings, "stateLoaded", "stateLoaded", [settings, s]);
		callback();
	}
	/**
	* Draw the table for the first time, adding all required features
	*
	* @param settings DataTables settings object
	*/
	function initialise(settings) {
		var i;
		var init = settings.init;
		var deferLoading = settings.deferLoading;
		var dataSrc = dataSource(settings);
		if (!settings.initialised) {
			setTimeout(function() {
				initialise(settings);
			}, 200);
			return;
		}
		buildHead(settings, "header");
		buildHead(settings, "footer");
		loadState(settings, function() {
			drawHead(settings, settings.header);
			drawHead(settings, settings.footer);
			var iAjaxStart = settings.displayStartInit;
			if (init && init.data) for (i = 0; i < init.data.length; i++) addData(settings, init.data[i]);
			else if (deferLoading || dataSrc == "dom") addTr(settings, Dom$1.s(settings.tbody).children("tr"));
			settings.display = settings.displayMaster.slice();
			createLayout(settings);
			sortInit(settings);
			colGroup(settings);
			processingDisplay(settings, true);
			callbackFire(settings, null, "preInit", [settings], true);
			reDraw(settings);
			if (dataSrc != "ssp" || deferLoading) {
				if (dataSrc == "ajax") buildAjax(settings, {}, function(json) {
					var aData = ajaxDataSrc(settings, json, false);
					for (i = 0; i < aData.length; i++) addData(settings, aData[i]);
					settings.displayStartInit = iAjaxStart;
					reDraw(settings);
					processingDisplay(settings, false);
					initComplete(settings);
				});
				else {
					initComplete(settings);
					processingDisplay(settings, false);
				}
			}
		});
	}
	/**
	* Draw the table for the first time, adding all required features
	*
	* @param settings DataTables settings object
	*/
	function initComplete(settings) {
		if (settings.initDone) return;
		var args = [settings, settings.json];
		settings.initDone = true;
		let tfoot = Dom$1.s(settings.tfoot);
		if (tfoot.children().count() === 0) tfoot.remove();
		adjustColumnSizing(settings);
		callbackFire(settings, null, "plugin-init", args, true);
		callbackFire(settings, "init", "init", args, true);
	}
	/**
	* Create an Ajax call based on the table's settings, taking into account that
	* parameters can have multiple forms, and backwards compatibility.
	*
	* @param settings DataTables settings object
	* @param data Data to send to the server, required by DataTables - may be
	*   augmented by developer callbacks
	* @param fn Callback function to run when data is obtained
	*/
	function buildAjax(settings, data, fn) {
		var ajaxData;
		var ajaxConfig = settings.ajax;
		var instance = settings.instance;
		var callback = function(json) {
			var status = settings.jqXHR ? settings.jqXHR.status : null;
			if (json === null || typeof status === "number" && status == 204) {
				json = {};
				ajaxDataSrc(settings, json, []);
			}
			var error = json.error || json.sError;
			if (error) log(settings, 0, error);
			if (json.d && typeof json.d === "string") try {
				json = JSON.parse(json.d);
			} catch (e) {}
			settings.json = json;
			callbackFire(settings, null, "xhr", [
				settings,
				json,
				settings.jqXHR
			], true);
			fn(json);
		};
		if (util.is.plainObject(ajaxConfig) && ajaxConfig.data) {
			ajaxData = ajaxConfig.data;
			var newData = typeof ajaxData === "function" ? ajaxData(data, settings) : ajaxData;
			data = typeof ajaxData === "function" && newData ? newData : util.object.assignDeep(data, newData);
			delete ajaxConfig.data;
		}
		var baseAjax = {
			url: typeof ajaxConfig === "string" ? ajaxConfig : "",
			data,
			success: callback,
			dataType: "json",
			cache: false,
			type: settings.serverMethod,
			error: function(xhr, error) {
				if (callbackFire(settings, null, "xhr", [
					settings,
					null,
					settings.jqXHR
				], true).indexOf(false) === -1) {
					if (error == "parsererror") log(settings, 0, "Invalid JSON response", 1);
					else if (xhr.readyState === 4) log(settings, 0, "Ajax error", 7);
				}
				processingDisplay(settings, false);
			}
		};
		if (util.is.plainObject(ajaxConfig)) util.object.assign(baseAjax, ajaxConfig);
		settings.ajaxData = data;
		callbackFire(settings, null, "preXhr", [
			settings,
			data,
			baseAjax
		], true);
		if (typeof ajaxConfig === "function") settings.jqXHR = ajaxConfig.call(instance, data, callback, settings);
		else if (ajaxConfig && typeof ajaxConfig !== "string" && ajaxConfig.url === "") {
			var empty = {};
			ajaxDataSrc(settings, empty, []);
			callback(empty);
		} else settings.jqXHR = util.ajax(baseAjax);
		if (ajaxData) ajaxConfig.data = ajaxData;
	}
	/**
	* Update the table using an Ajax call
	*
	* @param settings DataTables settings object
	* @returns Block the table drawing or not
	*/
	function ajaxUpdate(settings) {
		settings.drawCount++;
		processingDisplay(settings, true);
		buildAjax(settings, ajaxParameters(settings), function(json) {
			ajaxUpdateDraw(settings, json);
		});
	}
	function functionOrValue(val) {
		return typeof val === "function" ? "function" : val.toString();
	}
	/**
	* Build up the parameters in an object needed for a server-side processing
	* request.
	*
	* @param settings DataTables settings object
	* @returns Block the table drawing or not
	*/
	function ajaxParameters(settings) {
		var columns = settings.columns, features = settings.features, searches = settings.searches, searchesFixed = settings.searchesFixed, colData = function(idx, prop) {
			return typeof columns[idx][prop] === "function" ? "function" : columns[idx][prop];
		};
		return {
			draw: settings.drawCount,
			columns: columns.map(function(column, i) {
				return {
					data: colData(i, "data"),
					name: column.name,
					searchable: column.searchable,
					orderable: column.orderable,
					search: {
						value: searches[i] ? functionOrValue(searches[i].search) : "",
						regex: searches[i] ? searches[i].regex : false,
						fixed: searchesFixed[i] ? Object.keys(searchesFixed[i]).map((name) => ({
							name,
							term: functionOrValue(searchesFixed[i][name].search)
						})) : []
					}
				};
			}),
			order: sortFlatten(settings).map(function(val) {
				return {
					column: val.col,
					dir: val.dir,
					name: colData(val.col, "name")
				};
			}),
			start: settings.displayStart,
			length: features.paging ? settings.pageLength : -1,
			search: {
				value: functionOrValue(searches["*"].search),
				regex: searches["*"].regex,
				fixed: Object.keys(settings.searchesFixed["*"]).map((name) => ({
					name,
					term: functionOrValue(settings.searchesFixed["*"][name].search)
				})),
				groups: Object.keys(settings.searches).filter((c) => c.includes(",")).map((c) => ({
					columns: settings.searches[c].columns || [],
					term: functionOrValue(settings.searches[c].search)
				})),
				groupsFixed: Object.keys(settings.searchesFixed).filter((c) => c.includes(",")).map((c) => {
					let searches = settings.searchesFixed[c];
					return Object.keys(searches).map((n) => ({
						columns: searches[n].columns || [],
						name: n,
						term: functionOrValue(searches[n].search)
					}));
				}).flat()
			}
		};
	}
	/**
	* Data the data from the server (nuking the old) and redraw the table
	*
	* @param settings DataTables settings object
	* @param json json data return from the server.
	*/
	function ajaxUpdateDraw(settings, json) {
		var data = ajaxDataSrc(settings, json, false);
		var drawUnique = ajaxDataSrcParam(settings, "draw", json);
		var recordsTotal = ajaxDataSrcParam(settings, "recordsTotal", json);
		var recordsFiltered = ajaxDataSrcParam(settings, "recordsFiltered", json);
		var existingTypes = settings.columns.map((c) => c.type).join(",");
		if (drawUnique !== void 0) {
			if (drawUnique * 1 < settings.drawCount) return;
			settings.drawCount = drawUnique * 1;
		}
		if (!data) data = [];
		clearTable(settings);
		settings.recordsTotal = parseInt(recordsTotal, 10);
		settings.recordsDisplay = parseInt(recordsFiltered, 10);
		for (var i = 0, iLen = data.length; i < iLen; i++) addData(settings, data[i]);
		settings.display = settings.displayMaster.slice();
		columnTypes(settings, existingTypes);
		draw(settings, true);
		initComplete(settings);
		processingDisplay(settings, false);
	}
	/**
	* Get the data from the JSON data source to use for drawing a table.
	*
	* @param settings DataTables settings object
	* @param json Data source object / array from the server
	* @param write Array or object to write the data to
	* @return Array of data to use
	*/
	function ajaxDataSrc(settings, json, write) {
		var dataProp = "data";
		if (util.is.plainObject(settings.ajax) && settings.ajax.dataSrc !== void 0) {
			var dataSrc = settings.ajax.dataSrc;
			if (typeof dataSrc === "string" || typeof dataSrc === "function") dataProp = dataSrc;
			else if (dataSrc.data !== void 0) dataProp = dataSrc.data;
		}
		if (!write) {
			if (dataProp === "data") return json.aaData || json[dataProp];
			return dataProp !== "" ? util.get(dataProp)(json) : json;
		}
		util.set(dataProp)(json, write);
	}
	/**
	* Very similar to ajaxDataSrc, but for the other SSP properties
	*
	* @param settings DataTables settings object
	* @param param Target parameter
	* @param json JSON data
	* @returns Resolved value
	*/
	function ajaxDataSrcParam(settings, param, json) {
		var dataSrc = util.is.plainObject(settings.ajax) ? settings.ajax.dataSrc : null;
		if (dataSrc && dataSrc[param]) return util.data.get(dataSrc[param])(json);
		var old = "";
		if (param === "draw") old = "sEcho";
		else if (param === "recordsTotal") old = "iTotalRecords";
		else if (param === "recordsFiltered") old = "iTotalDisplayRecords";
		return json[old] !== void 0 ? json[old] : json[param];
	}
	var __filter_div = Dom$1.c("div").get(0);
	var __filter_div_textContent = __filter_div.textContent !== void 0;
	/**
	* Filter the table using both the global filter and column based filtering
	*
	* @param settings DataTables settings object
	*/
	function filterComplete(settings) {
		settings.columns;
		if (dataSource(settings) != "ssp") {
			filterData(settings);
			settings.display = settings.displayMaster.slice();
			util.object.each(settings.searches, (key, s) => {
				filter(settings.display, settings, s.search, s);
			});
			util.object.each(settings.searchesFixed, function(columns) {
				util.object.each(settings.searchesFixed[columns], function(name, s) {
					filter(settings.display, settings, s.search, s);
				});
			});
			filterCustom(settings);
		}
		settings.wasFiltered = true;
		callbackFire(settings, null, "search", [settings]);
	}
	/**
	* Apply custom filtering functions
	*
	* This is legacy now that we have named functions, but it is widely used
	* from 1.x, so it is not yet deprecated.
	*
	* @param settings DataTables settings object
	*/
	function filterCustom(settings) {
		let filters = ext.search;
		let displayRows = settings.display;
		let row, rowIdx;
		for (let i = 0, iLen = filters.length; i < iLen; i++) {
			let rows = [];
			for (let j = 0, jen = displayRows.length; j < jen; j++) {
				rowIdx = displayRows[j];
				row = settings.data[rowIdx];
				if (row && filters[i](settings, row.searchCellCache, rowIdx, row.data, j)) rows.push(rowIdx);
			}
			displayRows.length = 0;
			arrayApply(displayRows, rows);
		}
	}
	/**
	* Filter the data table based on user input and draw the table
	*
	* @param searchRows
	* @param settings
	* @param input
	* @param options
	* @returns
	*/
	function filter(searchRows, settings, input, options) {
		if (input === "") return;
		let i = 0;
		let matched = [];
		let searchFunc = typeof input === "function" ? input : null;
		let rpSearch = input instanceof RegExp ? input : searchFunc ? null : filterCreateSearch(input, options);
		let columns = options.columns ? options.columns : util.array.range(settings.columns.length);
		for (i = 0; i < searchRows.length; i++) {
			let row = settings.data[searchRows[i]];
			if (row) {
				let data = util.array.selectiveJoin(row.searchCellCache, columns);
				if (searchFunc && searchFunc(data, row.data, searchRows[i], columns.length === 1 ? columns[0] : columns) || rpSearch && typeof data === "string" && rpSearch.test(data)) matched.push(searchRows[i]);
			}
		}
		searchRows.length = matched.length;
		for (i = 0; i < matched.length; i++) searchRows[i] = matched[i];
	}
	/**
	* Build a regular expression object suitable for searching a table
	*/
	function filterCreateSearch(searchIn, inOpts) {
		let not = [];
		let options = Object.assign({}, {
			boundary: false,
			caseInsensitive: true,
			exact: false,
			regex: false,
			smart: true
		}, inOpts);
		let search = typeof searchIn !== "string" ? searchIn.toString() : searchIn;
		search = util.diacritics(search);
		if (options.exact) return new RegExp("^" + util.escapeRegex(search) + "$", options.caseInsensitive ? "i" : "");
		search = options.regex ? search : util.escapeRegex(search);
		if (options.smart) {
			let a = (search.match(/!?["\u201C][^"\u201D]+["\u201D]|[^ ]+/g) || [""]).map(function(word) {
				let negative = false;
				let m;
				if (word.charAt(0) === "!") {
					negative = true;
					word = word.substring(1);
				}
				if (word.charAt(0) === "\"") {
					m = word.match(/^"(.*)"$/);
					word = m ? m[1] : word;
				} else if (word.charAt(0) === "“") {
					m = word.match(/^\u201C(.*)\u201D$/);
					word = m ? m[1] : word;
				}
				if (negative) {
					if (word.length > 1) not.push("(?!" + word + ")");
					word = "";
				}
				return word.replace(/"/g, "");
			});
			let match = not.length ? not.join("") : "";
			let boundary = options.boundary ? "\\b" : "";
			search = "^(?=.*?" + boundary + a.join(")(?=.*?" + boundary) + ")(" + match + ".)*$";
		}
		return new RegExp(search, options.caseInsensitive ? "i" : "");
	}
	function filterData(settings) {
		let columns = settings.columns;
		let data = settings.data;
		let column;
		let j, jen, cellData, row;
		let wasInvalidated = false;
		for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
			if (!data[rowIdx]) continue;
			row = data[rowIdx];
			if (row && !row.searchCellCache) {
				const rowFilterData = [];
				for (j = 0, jen = columns.length; j < jen; j++) {
					column = columns[j];
					if (column.searchable) {
						cellData = getCellData(settings, rowIdx, j, "filter");
						if (cellData === null) cellData = "";
						if (typeof cellData !== "string" && cellData.toString) cellData = cellData.toString();
					} else cellData = "";
					if (cellData.indexOf && cellData.indexOf("&") !== -1) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ? __filter_div.textContent : __filter_div.innerText;
					}
					if (cellData.replace) cellData = cellData.replace(/[\r\n\u2028]/g, "");
					rowFilterData.push(cellData);
				}
				row.searchCellCache = rowFilterData;
				row.searchRowCache = rowFilterData.join("  ");
				wasInvalidated = true;
			}
		}
		return wasInvalidated;
	}
	/**
	* Render and cache a row's display data for the columns, if required
	*
	* @param settings DataTables settings object
	* @param rowIdx Row index
	* @returns Array with display information
	*/
	function getRowDisplay(settings, rowIdx) {
		var rowModal = settings.data[rowIdx];
		var columns = settings.columns;
		if (!rowModal) return [];
		if (!rowModal.displayData) {
			rowModal.displayData = [];
			for (var colIdx = 0, len = columns.length; colIdx < len; colIdx++) rowModal.displayData.push(getCellData(settings, rowIdx, colIdx, "display"));
		}
		return rowModal.displayData;
	}
	/**
	* Create a new TR element (and it's TD children) for a row
	*
	* @param settings DataTables settings object
	* @param rowIdx Row to consider
	* @param trIn TR element to add to the table - optional. If not given,
	*   DataTables will create a row automatically
	* @param tds Array of TD|TH elements for the row - must be given if trIn is.
	*/
	function createTr(settings, rowIdx, trIn, tds) {
		var row = settings.data[rowIdx], cells = [], tr, td, column, i, iLen, create, trClass = settings.classes.tbody.row;
		if (row && row.tr === null) {
			let rowData = row.data;
			tr = trIn || document.createElement("tr");
			row.tr = tr;
			row.cells = cells;
			Dom$1.s(tr).classAdd(trClass);
			tr._DT_RowIndex = rowIdx;
			rowAttributes(settings, row);
			for (i = 0, iLen = settings.columns.length; i < iLen; i++) {
				column = settings.columns[i];
				create = trIn && tds && tds[i] ? false : true;
				td = create ? document.createElement(column.cellType) : tds[i];
				if (!td) log(settings, 0, "Incorrect column count", 18);
				td._DT_CellIndex = {
					row: rowIdx,
					column: i
				};
				cells.push(td);
				var display = getRowDisplay(settings, rowIdx);
				if (create || (column.render || column.data !== i) && (!util.is.plainObject(column.data) || column.data && column.data._ !== i + ".display")) writeCell(td, display[i]);
				Dom$1.s(td).classAdd(column.className);
				if (column.visible && create) tr.appendChild(td);
				else if (!column.visible && !create) td.parentNode.removeChild(td);
				if (column.createdCell) column.createdCell.call(settings.instance, td, getCellData(settings, rowIdx, i), rowData, rowIdx, i);
			}
			callbackFire(settings, "rowCreated", "row-created", [
				tr,
				rowData,
				rowIdx,
				cells
			]);
		} else if (row) Dom$1.s(row.tr).classAdd(trClass);
	}
	/**
	* Add attributes to a row based on the special `DT_*` parameters in a data
	* source object.
	*
	* @param settings DataTables settings object
	* @param row Row object for the row to be modified
	*/
	function rowAttributes(settings, row) {
		var tr = row.tr;
		var data = row.data;
		if (tr) {
			var id = settings.rowIdFn(data);
			if (id) tr.id = id;
			if (data.DT_RowClass) {
				var a = data.DT_RowClass.split(" ");
				row.addedClasses = row.addedClasses ? util.unique(row.addedClasses.concat(a)) : a;
				Dom$1.s(tr).classRemove(row.addedClasses.join(" ")).classAdd(data.DT_RowClass);
			}
			if (data.DT_RowAttr) Dom$1.s(tr).attr(data.DT_RowAttr);
			if (data.DT_RowData) Dom$1.s(tr).data(data.DT_RowData);
		}
	}
	/**
	* Create the HTML header for the table
	*
	* @param settings DataTable instance
	* @param side If the header or footer should be used
	* @returns
	*/
	function buildHead(settings, side) {
		let classes = settings.classes;
		let columns = settings.columns;
		let i, iLen, row;
		let target = Dom$1.s(side === "header" ? settings.thead : settings.tfoot);
		let titleProp = side === "header" ? "title" : side;
		if (!target) return;
		if (side === "header" || util.array.pluck(settings.columns, titleProp).join("")) {
			row = target.find("tr");
			if (!row.count()) row = Dom$1.c("tr").appendTo(target);
			if (row.count() === 1) {
				let cellCount = 0;
				row.find("td, th").each((el) => {
					cellCount += el.colSpan;
				});
				for (i = cellCount, iLen = columns.length; i < iLen; i++) Dom$1.c("th").html(columns[i][titleProp] || "").appendTo(row);
			}
		}
		let detected = detectHeader(settings, target.get(0), true);
		if (side === "header") {
			settings.header = detected;
			target.find("tr").classAdd(classes.thead.row);
		} else {
			settings.footer = detected;
			target.find("tr").classAdd(classes.tfoot.row);
		}
		target.children("tr").children("th, td").each((el) => {
			(side === "header" ? renderer(settings, "header") : renderer(settings, "footer"))(settings, Dom$1.s(el), classes);
		});
	}
	/**
	* Build a layout structure for a header or footer
	*
	* @param settings DataTables settings
	* @param source Source layout array
	* @param incColumns What columns should be included
	* @returns Layout array in column index order
	*/
	function headerLayout(settings, source, incColumns) {
		var row, column, cell;
		var local = [];
		var structure = [];
		var columns = settings.columns;
		var columnCount = columns.length;
		var rowspan, colspan;
		if (!source) return;
		if (!incColumns) incColumns = util.array.range(columnCount).filter(function(idx) {
			return columns[idx].visible;
		});
		for (row = 0; row < source.length; row++) {
			local[row] = source[row].slice().filter(function(c, i) {
				return incColumns.includes(i);
			});
			structure.push([]);
		}
		for (row = 0; row < local.length; row++) for (column = 0; column < local[row].length; column++) {
			rowspan = 1;
			colspan = 1;
			if (structure[row][column] === void 0) {
				cell = local[row][column].cell;
				while (local[row + rowspan] !== void 0 && local[row][column].cell == local[row + rowspan][column].cell) {
					structure[row + rowspan][column] = null;
					rowspan++;
				}
				while (local[row][column + colspan] !== void 0 && local[row][column].cell == local[row][column + colspan].cell) {
					for (var k = 0; k < rowspan; k++) structure[row + k][column + colspan] = null;
					colspan++;
				}
				var titleSpan = Dom$1.s(cell).find(".dt-column-title");
				structure[row][column] = {
					cell,
					colspan,
					rowspan,
					title: titleSpan.count() ? titleSpan.html() : Dom$1.s(cell).html()
				};
			}
		}
		return structure;
	}
	/**
	* Draw the header (or footer) element based on the column visibility states.
	*
	* @param settings DataTables settings object
	* @param source Layout array from detectHeader
	*/
	function drawHead(settings, source) {
		let layout = headerLayout(settings, source);
		let tr;
		if (!layout) return;
		for (let row = 0; row < source.length; row++) {
			tr = source[row].row;
			if (tr) Dom$1.s(tr).detachChildren();
			for (let column = 0; column < layout[row].length; column++) {
				let point = layout[row][column];
				if (point) Dom$1.s(point.cell).appendTo(tr).attr("rowspan", point.rowspan).attr("colspan", point.colspan);
			}
		}
	}
	/**
	* Insert the required TR nodes into the table for display
	*
	* @param settings DataTables settings object
	* @param ajaxComplete true after ajax call to complete rendering
	*/
	function draw(settings, ajaxComplete) {
		setStartPosition(settings);
		if (callbackFire(settings, "preDraw", "preDraw", [settings]).indexOf(false) !== -1) {
			processingDisplay(settings, false);
			return;
		}
		var rowEls = [];
		var rowCount = 0;
		var isServerSide = dataSource(settings) == "ssp";
		var display = settings.display;
		var start = settings.displayStart;
		var end = displayEnd(settings);
		var columns = settings.columns;
		var body = Dom$1.s(settings.tbody);
		settings.doingDraw = true;
		if (settings.deferLoading) {
			settings.deferLoading = false;
			settings.drawCount++;
			processingDisplay(settings, false);
		} else if (!isServerSide) settings.drawCount++;
		else if (!settings.destroying && !ajaxComplete) {
			if (settings.drawCount === 0) body.empty().append(_emptyRow(settings));
			ajaxUpdate(settings);
			return;
		}
		if (display.length !== 0) {
			var iStart = isServerSide ? 0 : start;
			var iEnd = isServerSide ? settings.data.length : end;
			for (var j = iStart; j < iEnd; j++) {
				var dataIdx = display[j];
				var data = settings.data[dataIdx];
				if (data === null) continue;
				if (data.tr === null) createTr(settings, dataIdx);
				var nRow = data.tr;
				for (var i = 0; i < columns.length; i++) {
					var col = columns[i];
					var td = data.cells[i];
					Dom$1.s(td).classAdd(col.type ? ext.type.className[col.type] : null).classAdd(settings.classes.tbody.cell);
				}
				callbackFire(settings, "row", null, [
					nRow,
					data.data,
					rowCount,
					j,
					dataIdx
				]);
				rowEls.push(nRow);
				rowCount++;
			}
		} else rowEls[0] = _emptyRow(settings);
		callbackFire(settings, "header", "header", [
			Dom$1.s(settings.thead).children("tr").get(0),
			getDataMaster(settings),
			start,
			end,
			display
		]);
		callbackFire(settings, "footer", "footer", [
			Dom$1.s(settings.tfoot).children("tr").get(0),
			getDataMaster(settings),
			start,
			end,
			display
		]);
		body.detachChildren().append(rowEls);
		Dom$1.s(settings.tableWrapper).classToggle("dt-empty-footer", Dom$1.s(settings.tfoot).find("tr").count() === 0);
		callbackFire(settings, "draw", "draw", [settings], true);
		settings.wasOrdered = false;
		settings.wasFiltered = false;
		settings.doingDraw = false;
	}
	/**
	* Redraw the table - taking account of the various features which are enabled
	*
	* @param settings DataTables settings object
	* @param holdPosition Keep the current paging position. By default the paging
	*    is reset to the first page
	* @param recompute Indicate if a rebuild of sort and filter should happen
	*/
	function reDraw(settings, holdPosition, recompute) {
		let features = settings.features, doSort = features.ordering, doFilter = features.searching;
		if (recompute === void 0 || recompute === true) {
			columnTypes(settings);
			columnWidths(settings);
			if (doSort) sort(settings);
			if (doFilter) filterComplete(settings);
			else settings.display = settings.displayMaster.slice();
		}
		if (holdPosition !== true) settings.displayStart = 0;
		else lengthOverflow(settings);
		settings.drawHold = holdPosition;
		draw(settings);
		settings.api.one("draw", function() {
			settings.drawHold = false;
		});
	}
	/**
	* Table is empty - create a row with an empty message in it
	*
	* @param settings DataTables context
	*/
	function _emptyRow(settings) {
		let lang = settings.language;
		let zero = lang.zeroRecords;
		let dataSrc = dataSource(settings);
		if ((dataSrc === "ssp" || dataSrc === "ajax") && !settings.json) zero = lang.loadingRecords;
		else if (lang.emptyTable && recordsTotal(settings) === 0) zero = lang.emptyTable;
		return Dom$1.c("tr").append(Dom$1.c("td").attr("colSpan", visibleColumns(settings)).classAdd(settings.classes.empty.row).html(zero)).get(0);
	}
	/**
	* Use the DOM source to create up an array of header cells. The idea here is to
	* create a layout grid (array) of rows x columns, which contains a reference to
	* the cell at that point in the grid (regardless of col/rowspan), such that any
	* column / row could be removed and the new grid constructed.
	*
	* @param settings DataTables context
	* @param thead thead / tbody element
	* @param write If cells should be written (if required)
	* @returns Calculated layout array
	*/
	function detectHeader(settings, thead, write) {
		let columns = settings.columns;
		let rows = Dom$1.s(thead).children("tr");
		let row, loopCell;
		let i, k, l, len, shifted, column, colspan, rowspan;
		let titleRow = settings.titleRow;
		let isHeader = thead && thead.nodeName.toLowerCase() === "thead";
		let layout = [];
		let isUnique;
		let shift = function(a, b, j) {
			let d = a[b];
			while (d[j]) j++;
			return j;
		};
		for (i = 0, len = rows.count(); i < len; i++) layout.push([]);
		for (i = 0, len = rows.count(); i < len; i++) {
			row = rows.get(i);
			column = 0;
			loopCell = row.firstChild;
			while (loopCell) {
				if (loopCell.nodeName.toUpperCase() == "TD" || loopCell.nodeName.toUpperCase() == "TH") {
					let cell = Dom$1.s(loopCell);
					let cols = [];
					colspan = parseInt(cell.attr("colspan") || "1") || 1;
					rowspan = parseInt(cell.attr("rowspan") || "1") || 1;
					colspan = !colspan || colspan === 0 || colspan === 1 ? 1 : colspan;
					rowspan = !rowspan || rowspan === 0 || rowspan === 1 ? 1 : rowspan;
					shifted = shift(layout, i, column);
					isUnique = colspan === 1 ? true : false;
					if (write) {
						if (isUnique) {
							columnOptions(settings, shifted, escapeObject(cell.data()));
							let columnDef = columns[shifted];
							let width = cell.attr("width") || null;
							let t = cell.get(0).style.width.match(/width:\s*(\d+[pxem%]+)/);
							if (t) width = t[1];
							columnDef.widthOrig = columnDef.width || width;
							if (isHeader) {
								if (columnDef.title !== null && !columnDef.autoTitle) {
									if (titleRow === true && i === 0 || titleRow === false && i === rows.count() - 1 || titleRow === i || titleRow === null) cell.html(columnDef.title);
								}
								if (!columnDef.title && isUnique) {
									columnDef.title = util.string.stripHtml(cell.html());
									columnDef.autoTitle = true;
								}
							} else if (columnDef.footer) cell.html(columnDef.footer);
							if (!columnDef.ariaTitle) columnDef.ariaTitle = cell.attr("aria-label") || columnDef.title;
							if (columnDef.className) cell.classAdd(columnDef.className);
						}
						if (cell.find("div.dt-column-title").count() === 0) Dom$1.c("div").classAdd("dt-column-title").append(Array.from(cell.get(0).childNodes)).appendTo(cell);
						if (settings.orderIndicators && isHeader && cell.filter(":not([data-dt-order=disable])").count() !== 0 && cell.parent(":not([data-dt-order=disable])").count() !== 0 && cell.find("div.dt-column-order").count() === 0) Dom$1.c("div").classAdd("dt-column-order").appendTo(cell);
						var headerFooter = isHeader ? "header" : "footer";
						if (cell.find("div.dt-column-" + headerFooter).count() === 0) Dom$1.c("div").classAdd("dt-column-" + headerFooter).append(Array.from(cell.get(0).childNodes)).appendTo(cell);
					}
					for (l = 0; l < colspan; l++) {
						for (k = 0; k < rowspan; k++) {
							layout[i + k][shifted + l] = {
								cell: cell.get(0),
								unique: isUnique
							};
							layout[i + k].row = row;
						}
						cols.push(shifted + l);
					}
					cell.attr("data-dt-column", util.unique(cols).join(","));
				}
				loopCell = loopCell.nextSibling;
			}
		}
		return layout;
	}
	/**
	* Set the start position for draw
	*
	* @param settings DataTables settings object
	*/
	function setStartPosition(settings) {
		var bServerSide = dataSource(settings) == "ssp";
		var iInitDisplayStart = settings.displayStartInit;
		if (iInitDisplayStart !== void 0 && iInitDisplayStart !== -1) {
			settings.displayStart = bServerSide ? iInitDisplayStart : iInitDisplayStart >= recordsDisplay(settings) ? 0 : iInitDisplayStart;
			settings.displayStartInit = -1;
		}
	}
	/**
	* Get the number of records in the current record set, before filtering
	*
	* @param ctx DataTables settings object
	*/
	function recordsTotal(ctx) {
		return dataSource(ctx) == "ssp" ? ctx.recordsTotal * 1 : ctx.displayMaster.length;
	}
	/**
	* Get the number of records in the current record set, after filtering
	*
	* @param ctx DataTables settings object
	*/
	function recordsDisplay(ctx) {
		return dataSource(ctx) == "ssp" ? ctx.recordsDisplay * 1 : ctx.display.length;
	}
	/**
	* Get the display end point - display index
	*
	* @param ctx DataTables settings object
	*/
	function displayEnd(ctx) {
		var len = ctx.pageLength, start = ctx.displayStart, calc = start + len, records = ctx.display.length, features = ctx.features, paginate = features.paging;
		if (features.serverSide) return paginate === false || len === -1 ? start + records : Math.min(start + len, ctx.recordsDisplay);
		else return !paginate || calc > records || len === -1 ? records : calc;
	}
	/**
	* Common run function for selector types
	*/
	function selectorRun(type, selector, selectFn, settings, opts) {
		var out = [], res, i, iLen, selectorType = typeof selector;
		if (selector instanceof Dom$1) selector = selector.get();
		if (!selector || selectorType === "string" || selectorType === "function" || selector.length === void 0) selector = [selector];
		for (i = 0, iLen = selector.length; i < iLen; i++) {
			res = selectFn(typeof selector[i] === "string" ? selector[i].trim() : selector[i]);
			res = res.filter(function(item) {
				return item !== null && item !== void 0;
			});
			if (res && res.length) out = out.concat(res);
		}
		var extSelectors = ext.selector[type];
		if (extSelectors.length) for (i = 0, iLen = extSelectors.length; i < iLen; i++) out = extSelectors[i](settings, opts, out);
		return unique(out);
	}
	function selectorOpts(opts) {
		if (!opts) opts = {};
		if (opts.filter && opts.search === void 0) opts.search = opts.filter;
		return assign({}, {
			columnOrder: "implied",
			search: "none",
			order: "current",
			page: "all"
		}, opts);
	}
	function selectorFirst(old) {
		var inst = old.inst(old.context[0], null, old._newClass.replace(/s$/, ""));
		if (old.length) inst.push(old[0]);
		inst.selector = old.selector;
		if (inst.length && inst[0].length > 1) inst[0].splice(1);
		return inst;
	}
	function selectorRowIndexes(settings, opts) {
		var i, iLen, tmp, a = [], displayFiltered = settings.display, displayMaster = settings.displayMaster;
		var search = opts.search, order = opts.order, page = opts.page;
		if (dataSource(settings) == "ssp") return search === "removed" ? [] : range(0, displayMaster.length);
		if (page == "current") for (i = settings.displayStart, iLen = displayEnd(settings); i < iLen; i++) a.push(displayFiltered[i]);
		else if (order == "current" || order == "applied") {
			if (search == "none") a = displayMaster.slice();
			else if (search == "applied") a = displayFiltered.slice();
			else if (search == "removed") {
				var displayFilteredMap = {};
				for (i = 0, iLen = displayFiltered.length; i < iLen; i++) displayFilteredMap[displayFiltered[i]] = null;
				displayMaster.forEach(function(item) {
					if (!Object.prototype.hasOwnProperty.call(displayFilteredMap, item)) a.push(item);
				});
			}
		} else if (order == "index" || order == "original") for (i = 0, iLen = settings.data.length; i < iLen; i++) {
			if (!settings.data[i]) continue;
			if (search == "none") a.push(i);
			else {
				tmp = displayFiltered.indexOf(i);
				if (tmp === -1 && search == "removed" || tmp >= 0 && search == "applied") a.push(i);
			}
		}
		else if (typeof order === "number") {
			var ordered = sort(settings, order, "asc");
			if (search === "none") a = ordered;
			else for (i = 0; i < ordered.length; i++) {
				tmp = displayFiltered.indexOf(ordered[i]);
				if (tmp === -1 && search == "removed" || tmp >= 0 && search == "applied") a.push(ordered[i]);
			}
		}
		return a;
	}
	/**
	* `Array.prototype` reference as methods from it are used in the array-like
	* methods of the API.
	*/
	var __arrayProto = Array.prototype;
	var Api = function(context, data) {
		if (!(this instanceof Api)) return new Api(context, data);
		this.context = toContextArray(context);
		arrayApply(this, data);
		extendApi(this, "Api");
	};
	util.object.assign(Api.prototype, {
		_newClass: "Api",
		isDataTableApi: true,
		any() {
			return this.count() !== 0;
		},
		context: [],
		count() {
			return this.flatten().length;
		},
		each(fn) {
			for (var i = 0, iLen = this.length; i < iLen; i++) fn.call(this, this[i], i, this);
			return this;
		},
		eq(idx) {
			var ctx = this.context;
			return ctx.length > idx ? this.inst(ctx[idx], this[idx], "Api") : null;
		},
		filter(fn) {
			var a = __arrayProto.filter.call(this, fn, this);
			return this.inst(this.context, a);
		},
		flatten() {
			var a = [];
			return this.inst(this.context, a.concat.apply(a, this.toArray()));
		},
		get(idx) {
			return this[idx];
		},
		join: __arrayProto.join,
		includes(find) {
			return this.indexOf(find) === -1 ? false : true;
		},
		indexOf: __arrayProto.indexOf,
		inst(context, data, newClass) {
			let name = newClass || this._newClass;
			let inst = Api;
			if (classes[name]) inst = classes[name];
			return new inst(context, data);
		},
		iterator(flatten, type, fn, alwaysNew) {
			var a = [], ret, i, iLen, j, jen, context = this.context, rows, items, item, selector = this.selector;
			if (typeof flatten === "string") {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
			for (i = 0, iLen = context.length; i < iLen; i++) {
				var apiInst = this.inst(context[i]);
				if (type === "table") {
					ret = fn.call(apiInst, context[i], i);
					if (ret !== void 0) a.push(ret);
				} else if (type === "columns" || type === "rows") {
					ret = fn.call(apiInst, context[i], this[i], i);
					if (ret !== void 0) a.push(ret);
				} else if (type === "every" || type === "column" || type === "column-rows" || type === "row" || type === "cell") {
					items = this[i];
					if (type === "column-rows") rows = selectorRowIndexes(context[i], selector.opts);
					for (j = 0, jen = items.length; j < jen; j++) {
						item = items[j];
						if (type === "cell") ret = fn.call(apiInst, context[i], item.row, item.column, i, j);
						else ret = fn.call(apiInst, context[i], item, i, j, rows);
						if (ret !== void 0) a.push(ret);
					}
				}
			}
			if (a.length || alwaysNew) {
				var api = this.inst(context, flatten ? a.concat.apply([], a) : a);
				var apiSelector = api.selector;
				if (apiSelector) {
					apiSelector.rows = selector.rows;
					apiSelector.cols = selector.cols;
					apiSelector.opts = selector.opts;
				}
				return api;
			}
			return this;
		},
		lastIndexOf: __arrayProto.lastIndexOf,
		length: 0,
		map(fn) {
			var a = __arrayProto.map.call(this, fn, this);
			return this.inst(this.context, a);
		},
		pluck(prop) {
			var fn = util.get(prop);
			return this.map((src) => fn(src));
		},
		pop: __arrayProto.pop,
		push: __arrayProto.push,
		reduce: __arrayProto.reduce,
		reduceRight: __arrayProto.reduceRight,
		reverse: __arrayProto.reverse,
		selector: {
			rows: void 0,
			cols: void 0,
			opts: void 0
		},
		shift: __arrayProto.shift,
		slice() {
			return this.inst(this.context, this);
		},
		sort: __arrayProto.sort,
		splice: __arrayProto.splice,
		toArray() {
			return __arrayProto.slice.call(this);
		},
		to$() {
			return util.external("jq")(this);
		},
		toDom() {
			return new Dom$1(this.toArray());
		},
		toJQuery: function() {
			return util.external("jq")(this);
		},
		unique: function() {
			return this.inst(this.context, util.array.unique(this.toArray()));
		},
		unshift: __arrayProto.unshift
	});
	function register(name, func) {
		if (Array.isArray(name)) {
			for (let i = 0; i < name.length; i++) Api.register(name[i], func);
			return;
		}
		let names = getPrototypeNames(name);
		if (!classes[names.hostClass]) createApiClass(names.hostClass);
		if (names.property) {
			if (!properties[names.propertyHost]) properties[names.propertyHost] = [];
			properties[names.propertyHost].push({
				couldReturn: names.couldReturn,
				property: names.property,
				method: names.methodName,
				fn: func
			});
		} else {
			let wrapped = function() {
				let previousCould = this._newClass;
				this._newClass = names.couldReturn;
				let result = func.apply(this, arguments);
				this._newClass = previousCould;
				return result;
			};
			classes[names.hostClass].prototype[names.methodName] = wrapped;
			if (names.hostClass === "Api") util.object.each(classes, (className, klass) => {
				if (!klass.prototype[names.methodName]) klass.prototype[names.methodName] = wrapped;
			});
		}
	}
	function registerPlural(pluralName, singularName, func) {
		Api.register(pluralName, func);
		Api.register(singularName, function() {
			var ret = func.apply(this, arguments);
			if (ret === this) return this;
			else if (ret && ret.isDataTableApi) return ret.length ? Array.isArray(ret[0]) ? this.inst(ret.context, ret[0]) : ret[0] : void 0;
			return ret;
		});
	}
	Api.register = register;
	Api.registerPlural = registerPlural;
	/** A collection of properties to apply to the classes as they are constructed */
	var properties = {};
	/** Collection of API classes */
	var classes = { Api };
	window.classes = classes;
	window.properties = properties;
	/**
	* Create a new API "class" (function), used for nested levels of the API - e.g.
	* `ApiRows` and `ApiColumn`.
	*
	* @param name
	*/
	function createApiClass(name) {
		let newClass = function(context, data) {
			this.context = toContextArray(context);
			arrayApply(this, data);
			extendApi(this, "Api");
			extendApi(this, this._newClass);
		};
		newClass.prototype = Object.create(Api.prototype);
		Object.defineProperty(newClass, "name", {
			value: name,
			writable: false
		});
		newClass.prototype._newClass = name;
		classes[name] = newClass;
	}
	/**
	* When an instance is created it needs to be extended with properties (since
	* these cannot be given a scope from the prototype due to the nesting).
	*
	* @param api API instance to extend
	* @param className The name of the instance to extend
	* @returns void
	*/
	function extendApi(api, className) {
		let props = properties[className];
		if (!props) return;
		for (let i = 0; i < props.length; i++) {
			let def = props[i];
			if (!api[def.property]) api[def.property] = {};
			else if (!api.hasOwnProperty(def.property)) {
				let fn = api[def.property];
				api[def.property] = function() {
					return fn.apply(api, arguments);
				};
			}
			api[def.property][def.method] = function() {
				let previousCould = api._newClass;
				api._newClass = def.couldReturn;
				let result = def.fn.apply(api, arguments);
				api._newClass = previousCould;
				return result;
			};
		}
	}
	/**
	* Based on an API method name, construct the class, property, etc names that
	* are used to store and construct the API.
	*
	* @param name API function name
	* @returns Name components
	*/
	function getPrototypeNames(name) {
		let parts = name.split(".");
		let property = null;
		let hostClass = "Api";
		let returnClass = "Api";
		let methodName = "";
		let propertyHost = "";
		let lastPart = "";
		for (let i = 0; i < parts.length; i++) {
			let part = parts[i];
			let partNoParen = part.replace("()", "");
			hostClass = returnClass;
			returnClass += partNoParen.charAt(0).toUpperCase() + partNoParen.slice(1).toLowerCase();
			if (part.includes("()")) {
				methodName = partNoParen;
				if (lastPart.includes("()")) {
					property = null;
					propertyHost = "";
				}
			} else {
				property = part;
				propertyHost = hostClass;
			}
			lastPart = part;
		}
		return {
			couldReturn: returnClass,
			hostClass,
			property,
			propertyHost,
			methodName
		};
	}
	/**
	* Abstraction for `context` parameter of the `Api` constructor to allow it to
	* take several different forms for ease of use.
	*
	* Each of the input parameter types will be converted to a DataTables settings
	* object where possible.
	*
	* @param mixedIn DataTable identifier. Can be one of:
	*   * `string` - jQuery selector. Any DataTables' matching the given selector
	*     with be found and used.
	*   * `node` - `TABLE` node which has already been formed into a DataTable.
	*   * `jQuery` - A jQuery object of `TABLE` nodes.
	*   * `object` - DataTables settings object
	*   * `DataTables.Api` - API instance
	* @return Matching DataTables settings objects. `null` or `undefined` is
	*   returned if no matching DataTable is found.
	*/
	function toContext(mixedIn) {
		var mixed = mixedIn;
		var idx, nodes = null;
		var settings = ext.settings;
		var tables = util.array.pluck(settings, "table");
		if (!mixed) return [];
		else if (mixed.table && mixed.features) return [mixed];
		else if (mixed.nodeName && mixed.nodeName.toLowerCase() === "table") {
			idx = tables.indexOf(mixed);
			return idx !== -1 ? [settings[idx]] : null;
		} else if (mixed && typeof mixed.settings === "function") return mixed.settings().toArray();
		else if (typeof mixed === "string") nodes = Dom$1.s(mixed).get();
		else if (util.is.jquery(mixed)) nodes = mixed.get();
		else if (util.is.dom(mixed)) nodes = mixed.get();
		if (nodes) return settings.filter(function(v, i) {
			return nodes.includes(tables[i]);
		});
	}
	/**
	* Create the context array for an instance
	*
	* @param mixed The passed in options to convert to context
	* @returns Context array
	*/
	function toContextArray(mixed) {
		var i;
		var settings = [];
		var ctxSettings = function(o) {
			var a = toContext(o);
			if (a) settings.push.apply(settings, a);
		};
		if (Array.isArray(mixed)) for (i = 0; i < mixed.length; i++) ctxSettings(mixed[i]);
		else ctxSettings(mixed);
		return settings.length > 1 ? util.unique(settings) : settings;
	}
	register("$()", function(selector, opts) {
		let jq = util.external("jq");
		if (!jq) log(this.context[0], 0, "No jQuery available. Use `.dom()` or register jQuery");
		let jqRows = jq(this.rows(opts).nodes());
		return jq([].concat(jqRows.filter(selector).toArray(), jqRows.find(selector).toArray()));
	});
	[
		"on",
		"one",
		"off"
	].forEach((key) => {
		register(key + "()", function() {
			var args = Array.prototype.slice.call(arguments);
			args[0] = args[0].split(/\s/).map(function(e) {
				return !e.match(/\.dt\b/) ? e + ".dt" : e;
			}).join(" ");
			var inst = Dom$1.s(this.tables().nodes());
			inst[key].apply(inst, args);
			return this;
		});
	});
	register("clear()", function() {
		return this.iterator("table", function(settings) {
			clearTable(settings);
		});
	});
	register("error()", function(msg) {
		return this.iterator("table", function(settings) {
			log(settings, 0, msg);
		});
	});
	register("settings()", function() {
		return new Api(this.context, this.context);
	});
	register("init()", function() {
		var ctx = this.context;
		return ctx.length ? ctx[0].init : null;
	});
	register("data()", function() {
		return this.iterator("table", function(settings) {
			return util.array.pluck(settings.data, "data");
		}).flatten();
	});
	register("trigger()", function(name, args, bubbles) {
		return this.iterator("table", function(settings) {
			return callbackFire(settings, null, name, args, bubbles);
		}).flatten();
	});
	register("ready()", function(fn) {
		var ctx = this.context;
		if (!fn) return ctx.length ? ctx[0].initDone || false : false;
		return this.tables().every(function() {
			var api = this;
			if (this.context[0].initDone) fn.call(api);
			else this.on("init.dt.DT", function() {
				fn.call(api);
			});
		});
	});
	register("destroy()", function(remove) {
		remove = remove || false;
		return this.iterator("table", function(settings) {
			var classes = settings.classes;
			var table = settings.table;
			var tbody = settings.tbody;
			var thead = settings.thead;
			var tfoot = settings.tfoot;
			var jqTable = Dom$1.s(table);
			var jqTbody = Dom$1.s(tbody);
			var jqWrapper = Dom$1.s(settings.tableWrapper);
			var rows = settings.data.map(function(r) {
				return r ? r.tr : null;
			}).filter((r) => !!r);
			var orderClasses = classes.order;
			settings.destroying = true;
			callbackFire(settings, "destroy", "destroy", [settings], true);
			if (!remove) new Api(settings).columns().visible();
			if (settings.resizeObserver) settings.resizeObserver.disconnect();
			jqWrapper.off(".DT").find(":not(tbody *)").off(".DT");
			if (settings.windowResizeCb) window.removeEventListener("resize", settings.windowResizeCb);
			if (table != thead.parentNode) {
				jqTable.children("thead").detach();
				jqTable.append(thead);
			}
			if (tfoot && table != tfoot.parentNode) {
				jqTable.children("tfoot").detach();
				jqTable.append(tfoot);
			}
			cleanHeader(thead, "header");
			cleanHeader(tfoot, "footer");
			settings.colgroup.remove();
			settings.order = [];
			settings.orderFixed = [];
			sortingClasses(settings);
			jqTable.find("th, td").classRemove(Object.values(ext.type.className).join(" "));
			Dom$1.s(thead).find("th, td").classRemove(orderClasses.none + " " + orderClasses.canAsc + " " + orderClasses.canDesc + " " + orderClasses.isAsc + " " + orderClasses.isDesc).css("width", "").attrRemove("aria-sort");
			jqTbody.children().detach();
			jqTbody.append(rows);
			var orig = settings.tableWrapper.parentNode;
			var insertBefore = settings.tableWrapper.nextSibling;
			var removedMethod = remove ? "remove" : "detach";
			jqTable[removedMethod]();
			jqWrapper[removedMethod]();
			if (!remove && orig) {
				orig.insertBefore(table, insertBefore);
				jqTable.css("width", settings + "px").classRemove(classes.table);
			}
			var idx = ext.settings.indexOf(settings);
			if (idx !== -1) ext.settings.splice(idx, 1);
		});
	});
	register("i18n()", function(token, def, plural) {
		var ctx = this.context[0];
		var resolved = util.get(token)(ctx.language);
		if (resolved === void 0) resolved = def;
		if (util.is.plainObject(resolved)) {
			if (plural !== false) resolved = plural !== void 0 && resolved[plural] !== void 0 ? resolved[plural] : resolved._;
		}
		return typeof resolved === "string" ? resolved.replace("%d", plural) : resolved;
	});
	function cleanHeader(node, className) {
		let headerCell = Dom$1.s(node);
		headerCell.find(".dt-column-order").remove();
		headerCell.find(".dt-column-title").each(function(el) {
			let cell = Dom$1.s(el);
			var title = cell.html();
			cell.parent().parent().html(title);
			cell.remove();
		});
		headerCell.find("div.dt-column-" + className).remove();
		headerCell.find("th, td").attrRemove("data-dt-column");
	}
	var __reload = function(settings, holdPosition, callback) {
		if (callback) {
			var api = new Api(settings);
			api.one("draw", function() {
				callback(api.ajax.json());
			});
		}
		if (dataSource(settings) == "ssp") reDraw(settings, holdPosition);
		else {
			processingDisplay(settings, true);
			var xhr = settings.jqXHR;
			if (xhr && xhr.readyState !== 4 && typeof xhr.abort === "function") xhr.abort();
			buildAjax(settings, {}, function(json) {
				clearTable(settings);
				var data = ajaxDataSrc(settings, json, false);
				for (var i = 0, iLen = data.length; i < iLen; i++) addData(settings, data[i]);
				reDraw(settings, holdPosition);
				initComplete(settings);
				processingDisplay(settings, false);
			});
		}
	};
	register("ajax.json()", function() {
		var ctx = this.context;
		if (ctx.length > 0) return ctx[0].json;
	});
	register("ajax.params()", function() {
		var ctx = this.context;
		if (ctx.length > 0) return ctx[0].ajaxData;
	});
	register("ajax.reload()", function(callback, resetPaging) {
		return this.iterator("table", function(settings) {
			__reload(settings, resetPaging === false, callback);
		});
	});
	register("ajax.url()", function(url) {
		var ctx = this.context;
		if (url === void 0) {
			if (ctx.length === 0) return;
			let context = ctx[0];
			return util.is.plainObject(context.ajax) ? context.ajax.url : context.ajax;
		}
		return this.iterator("table", function(settings) {
			if (util.is.plainObject(settings.ajax)) settings.ajax.url = url;
			else settings.ajax = url;
		}, true);
	});
	register("ajax.url().load()", function(callback, resetPaging) {
		return this.iterator("table", function(ctx) {
			__reload(ctx, resetPaging === false, callback);
		});
	});
	function selectCells(settings, selector, opts) {
		var data = settings.data;
		var rows = selectorRowIndexes(settings, opts);
		var allCells;
		var row;
		var columns = settings.columns.length;
		var a, i, iLen, j, o, host;
		var run = function(s) {
			var fnSelector = typeof s === "function";
			if (s === null || s === void 0 || fnSelector) {
				a = [];
				for (i = 0, iLen = rows.length; i < iLen; i++) {
					row = rows[i];
					for (j = 0; j < columns; j++) {
						o = {
							row,
							column: j
						};
						if (fnSelector) {
							host = data[row];
							if (s(o, getCellData(settings, row, j), host && host.cells ? host.cells[j] : null)) a.push(o);
						} else a.push(o);
					}
				}
				return a;
			}
			if (plainObject(s)) return s.column !== void 0 && s.row !== void 0 && rows.indexOf(s.row) !== -1 ? [s] : [];
			if (!allCells) {
				let cells = removeEmpty(pluckOrder(data, rows, "cells"));
				allCells = Dom$1.s(flatten([], cells));
			}
			let jqResult = allCells.filter(s).mapTo((el) => {
				return {
					row: el._DT_CellIndex.row,
					column: el._DT_CellIndex.column
				};
			});
			if (jqResult.length || !s.nodeName) return jqResult;
			let rowHost = Dom$1.s(s).closest("*[data-dt-row]");
			let columnHost = Dom$1.s(s).closest("*[data-dt-column]");
			return rowHost.count() ? [{
				row: parseInt(rowHost.attr("data-dt-row")),
				column: parseInt(columnHost.attr("data-dt-column"))
			}] : [];
		};
		return selectorRun("cell", selector, run, settings, opts);
	}
	register("cells()", function(arg1, arg2, arg3) {
		let rowSelector = null;
		let columnSelector = null;
		let cellSelector;
		let opts;
		if (plainObject(arg1)) {
			if (arg1.row === void 0) opts = arg1;
			else {
				cellSelector = arg1;
				opts = arg2;
			}
		} else if (plainObject(arg2) || arg2 === void 0) {
			cellSelector = arg1;
			opts = arg2;
		} else if (arg1 !== void 0) {
			rowSelector = arg1;
			columnSelector = arg2;
			opts = arg3;
		}
		if (columnSelector === null) return this.iterator("table", function(settings) {
			return selectCells(settings, cellSelector, selectorOpts(opts));
		});
		let internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
		let columns = this.columns(columnSelector, internalOpts);
		let rows = this.rows(rowSelector, internalOpts);
		let i, iLen, j, jen;
		let cellsNoOpts = this.iterator("table", function(settings, idx) {
			let a = [];
			for (i = 0, iLen = rows[idx].length; i < iLen; i++) for (j = 0, jen = columns[idx].length; j < jen; j++) a.push({
				row: rows[idx][i],
				column: columns[idx][j]
			});
			return a;
		}, true);
		let cells = opts && opts.selected ? this.cells(cellsNoOpts.toArray(), opts) : cellsNoOpts;
		assign(cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts
		});
		return cells;
	});
	register("cells().every()", function(fn) {
		var opts = this.selector.opts;
		var counter = 0;
		return this.iterator("every", (settings, selectedIdx, tableIdx) => {
			let inst = this.cell(selectedIdx, opts);
			fn.call(inst, inst[0][0].row, inst[0][0].column, tableIdx, counter);
			counter++;
		});
	});
	registerPlural("cells().nodes()", "cell().node()", function() {
		return this.iterator("cell", function(settings, row, column) {
			var data = settings.data[row];
			return data && data.cells ? data.cells[column] : void 0;
		}, true);
	});
	register("cells().data()", function() {
		return this.iterator("cell", function(settings, row, column) {
			return getCellData(settings, row, column);
		}, true);
	});
	registerPlural("cells().render()", "cell().render()", function(type) {
		return this.iterator("cell", function(settings, row, column) {
			return getCellData(settings, row, column, type);
		}, true);
	});
	registerPlural("cells().indexes()", "cell().index()", function() {
		return this.iterator("cell", function(settings, row, column) {
			return {
				row,
				column,
				columnVisible: columnIndexToVisible(settings, column)
			};
		}, true);
	});
	registerPlural("cells().invalidate()", "cell().invalidate()", function(src) {
		return this.iterator("cell", function(settings, row, column) {
			invalidateRow(settings, row, src, column);
		});
	});
	register("cell()", function(rowSelector, columnSelector, opts) {
		return selectorFirst(this.cells(rowSelector, columnSelector, opts));
	});
	register("cell().data()", function(data) {
		var ctx = this.context;
		var cell = this[0];
		if (data === void 0) return ctx.length && cell.length ? getCellData(ctx[0], cell[0].row, cell[0].column) : void 0;
		setCellData(ctx[0], cell[0].row, cell[0].column, data);
		invalidateRow(ctx[0], cell[0].row, "data", cell[0].column);
		return this;
	});
	var __re_column_selector = /^(.*?):(name|title|visIdx|visible)$/;
	function columnData(settings, column, r1, r2, rows, type) {
		let a = [];
		for (let row = 0, iLen = rows.length; row < iLen; row++) a.push(getCellData(settings, rows[row], column, type));
		return a;
	}
	function columnHeader(settings, column, row) {
		var header = settings.header;
		var titleRow = settings.titleRow;
		var target = 0;
		if (row !== void 0) target = row;
		else if (titleRow === true) target = 0;
		else if (titleRow === false) target = header.length - 1;
		else if (titleRow !== null) target = titleRow;
		else {
			for (var i = 0; i < header.length; i++) if (header[i][column].unique && Dom$1.s(header[i][column].cell).find(".dt-column-title").text()) target = i;
			if (target === null) target = 0;
		}
		return header[target][column].cell;
	}
	function columnHeaderCells(header) {
		var out = [];
		for (var i = 0; i < header.length; i++) for (var j = 0; j < header[i].length; j++) {
			var cell = header[i][j].cell;
			if (!out.includes(cell)) out.push(cell);
		}
		return out;
	}
	function selectColumns(settings, selector, opts) {
		var columns = settings.columns, names, titles, nodes = columnHeaderCells(settings.header);
		var run = function(s) {
			var selInt = intVal(s);
			if (s === "") return range(columns.length);
			if (selInt !== null) return [selInt >= 0 ? selInt : columns.length + selInt];
			if (typeof s === "function") {
				var rows = selectorRowIndexes(settings, opts);
				return columns.map(function(col, idx) {
					return s(idx, columnData(settings, idx, 0, 0, rows), columnHeader(settings, idx)) ? idx : null;
				});
			}
			var match = typeof s === "string" ? s.match(__re_column_selector) : "";
			if (match) switch (match[2]) {
				case "visIdx":
				case "visible":
					if (match[1] && match[1].match(/^\d+$/)) {
						var idx = parseInt(match[1], 10);
						if (idx < 0) {
							var visColumns = columns.map(function(col, i) {
								return col.visible ? i : null;
							});
							return [visColumns[visColumns.length + idx]];
						}
						return [visibleToColumnIndex(settings, idx)];
					}
					return columns.map(function(col, mapIdx) {
						if (!col.visible) return null;
						if (col.responsiveVisible === false) return null;
						if (match && match[1]) return Dom$1.s(nodes[mapIdx]).filter(match[1]).count() > 0 ? mapIdx : null;
						return mapIdx;
					});
				case "name":
					if (!names) names = pluck(columns, "name");
					return names.map(function(name, i) {
						return match && name === match[1] ? i : null;
					});
				case "title":
					if (!titles) titles = pluck(columns, "title");
					return titles.map(function(title, i) {
						return match && title === match[1] ? i : null;
					});
				default: return [];
			}
			if (s.nodeName && s._DT_CellIndex) return [s._DT_CellIndex.column];
			var result = Dom$1.s(nodes).filter(s).mapTo((el) => {
				return columnsFromHeader(el);
			}).flat().sort(function(a, b) {
				return a - b;
			});
			if (result.length || !s.nodeName) return result;
			var host = Dom$1.s(s).closest("*[data-dt-column]");
			return host.count() ? [parseInt(host.attr("data-dt-column"))] : [];
		};
		var selected = selectorRun("column", selector, run, settings, opts);
		return opts.columnOrder && opts.columnOrder === "index" ? selected.sort(function(a, b) {
			return a - b;
		}) : selected;
	}
	function setColumnVis(settings, column, vis) {
		var cols = settings.columns, col = cols[column], data = settings.data, cells, i, iLen, tr;
		if (vis === void 0) return col.visible;
		if (col.visible === vis) return false;
		if (vis) {
			var insertBefore = pluck(cols, "visible").indexOf(true, column + 1);
			for (i = 0, iLen = data.length; i < iLen; i++) {
				let row = data[i];
				if (row) {
					tr = row.tr;
					cells = row.cells;
					if (tr) tr.insertBefore(cells[column], cells[insertBefore] || null);
				}
			}
		} else Dom$1.s(removeEmpty(pluck(settings.data, "cells", column))).detach();
		col.visible = vis;
		colGroup(settings);
		return true;
	}
	register("columns()", function(arg1, arg2) {
		let selector;
		let opts;
		if (arg1 === void 0) selector = "";
		else if (plainObject(arg1)) {
			selector = "";
			arg2 = arg1;
		} else selector = arg1;
		opts = selectorOpts(arg2);
		let inst = this.iterator("table", (settings) => selectColumns(settings, selector, opts), true);
		inst.selector.cols = selector;
		inst.selector.opts = opts;
		return inst;
	});
	register("columns().every()", function(fn) {
		var opts = this.selector.opts;
		var counter = 0;
		return this.iterator("every", (settings, selectedIdx, tableIdx) => {
			let inst = this.column(selectedIdx, opts);
			fn.call(inst, selectedIdx, tableIdx, counter);
			counter++;
		});
	});
	registerPlural("columns().header()", "column().header()", function(row) {
		return this.iterator("column", function(settings, column) {
			return columnHeader(settings, column, row);
		}, true);
	});
	registerPlural("columns().footer()", "column().footer()", function(row) {
		return this.iterator("column", function(settings, column) {
			if (!settings.footer.length) return null;
			return settings.footer[row !== void 0 ? row : 0][column].cell;
		}, true);
	});
	registerPlural("columns().data()", "column().data()", function() {
		return this.iterator("column-rows", columnData, true);
	});
	registerPlural("columns().render()", "column().render()", function(type) {
		return this.iterator("column-rows", function(settings, column, i, j, rows) {
			return columnData(settings, column, i, j, rows, type);
		}, true);
	});
	registerPlural("columns().dataSrc()", "column().dataSrc()", function() {
		return this.iterator("column", function(settings, column) {
			return settings.columns[column].data;
		}, true);
	});
	registerPlural("columns().init()", "column().init()", function() {
		return this.iterator("column", function(settings, column) {
			return settings.columns[column];
		}, true);
	});
	registerPlural("columns().names()", "column().name()", function() {
		return this.iterator("column", function(settings, column) {
			return settings.columns[column].name;
		}, true);
	});
	registerPlural("columns().nodes()", "column().nodes()", function() {
		return this.iterator("column-rows", function(settings, column, i, j, rows) {
			return removeEmpty(pluckOrder(settings.data, rows, "cells", column));
		}, true);
	});
	registerPlural("columns().titles()", "column().title()", function(title, row) {
		return this.iterator("column", function(settings, column) {
			if (typeof title === "number") {
				row = title;
				title = void 0;
			}
			var span = Dom$1.s(this.column(column).header(row)).find(".dt-column-title");
			if (title !== void 0) {
				span.html(title);
				return this;
			}
			return span.html();
		}, true);
	});
	registerPlural("columns().types()", "column().type()", function() {
		return this.iterator("column", function(settings, column) {
			var colObj = settings.columns[column];
			var type = colObj.type;
			if (!type) {
				columnTypes(settings);
				type = colObj.type;
			}
			return type;
		}, true);
	});
	registerPlural("columns().visible()", "column().visible()", function(vis, calc) {
		var that = this;
		var changed = [];
		var ret = this.iterator("column", function(settings, column) {
			if (vis === void 0) return settings.columns[column].visible;
			if (setColumnVis(settings, column, vis)) changed.push(column);
		});
		if (vis !== void 0) this.iterator("table", function(settings) {
			drawHead(settings, settings.header);
			drawHead(settings, settings.footer);
			if (!settings.display.length) Dom$1.s(settings.tbody).find("td[colspan]").attr("colspan", visibleColumns(settings));
			saveState(settings);
			that.iterator("column", function(ctx, column) {
				if (changed.includes(column)) callbackFire(ctx, null, "column-visibility", [
					ctx,
					column,
					vis,
					calc
				]);
			});
			if (changed.length && (calc === void 0 || calc)) that.columns.adjust();
		});
		return ret;
	});
	registerPlural("columns().widths()", "column().width()", function() {
		var columns = this.columns(":visible");
		var row = Dom$1.c("tr").html("<td>" + Array(columns.count()).join("</td><td>") + "</td>");
		Dom$1.s(this.table().body()).append(row);
		var widths = [];
		var indexes = columns.indexes();
		row.children().each((el, idx) => {
			widths[indexes[idx]] = Dom$1.s(el).width("outer");
		});
		row.remove();
		return this.iterator("column", (settings, column) => {
			return widths[column] || 0;
		}, true);
	});
	registerPlural("columns().indexes()", "column().index()", function(type) {
		return this.iterator("column", function(settings, column) {
			return type === "visible" ? columnIndexToVisible(settings, column) : column;
		}, true);
	});
	register("columns.adjust()", function() {
		return this.iterator("table", function(settings) {
			settings.containerWidth = -1;
			adjustColumnSizing(settings);
		}, true);
	});
	register("column.index()", function(type, idx) {
		if (this.context.length !== 0) {
			var ctx = this.context[0];
			if (type === "fromVisible" || type === "toData") return visibleToColumnIndex(ctx, idx);
			else if (type === "fromData" || type === "toVisible") return columnIndexToVisible(ctx, idx);
		}
		return -1;
	});
	register("column()", function(selector, opts) {
		return selectorFirst(this.columns(selector, opts));
	});
	/**
	* Redraw the tables in the current context.
	*/
	Api.register("draw()", function(paging) {
		return this.iterator("table", function(settings) {
			if (paging === "page") draw(settings);
			else {
				if (typeof paging === "string") paging = paging === "full-hold" ? false : true;
				reDraw(settings, paging === false);
			}
		});
	});
	register("order()", function(order, dir) {
		let ctx = this.context;
		let args = Array.prototype.slice.call(arguments);
		if (order === void 0) return ctx.length !== 0 ? ctx[0].order : void 0;
		if (typeof order === "number" && typeof dir === "string") order = [[order, dir]];
		else if (args.length > 1) order = args;
		return this.iterator("table", function(settings) {
			let resolved = [];
			sortResolve(settings, resolved, order);
			settings.order = resolved;
		});
	});
	register("order.listener()", function(node, column, callback) {
		return this.iterator("table", function(settings) {
			sortAttachListener(settings, node, "", column, callback);
		});
	});
	register("order.fixed()", function(set) {
		if (!set) {
			var ctx = this.context;
			var fixed = ctx.length ? ctx[0].orderFixed : void 0;
			return Array.isArray(fixed) ? { pre: fixed } : fixed;
		}
		return this.iterator("table", function(settings) {
			settings.orderFixed = assignDeep({}, set);
		});
	});
	register(["columns().order()", "column().order()"], function(dir) {
		var that = this;
		if (!dir) return this.iterator("column", function(settings, idx) {
			var sort = sortFlatten(settings);
			for (var i = 0, iLen = sort.length; i < iLen; i++) if (sort[i].col === idx) return sort[i].dir;
			return null;
		}, true);
		else return this.iterator("table", function(settings, i) {
			settings.order = that[i].map(function(col) {
				return [col, dir];
			});
		});
	});
	registerPlural("columns().orderable()", "column().orderable()", function(directions) {
		return this.iterator("column", function(settings, idx) {
			var col = settings.columns[idx];
			return directions ? col.orderSequence : col.orderable;
		}, true);
	});
	/**
	* Set the page length
	*
	* @param ctx DataTables context
	* @param val Value to change to
	*/
	function lengthChange(ctx, val) {
		let len = typeof val === "string" ? parseInt(val, 10) : val;
		ctx.pageLength = len;
		lengthOverflow(ctx);
		callbackFire(ctx, null, "length", [ctx, len]);
	}
	register("page()", function(action) {
		if (action === void 0) return this.page.info().page;
		return this.iterator("table", function(settings) {
			pageChange(settings, action);
		});
	});
	register("page.info()", function() {
		var settings = this.context[0], start = settings.displayStart, len = settings.features.paging ? settings.pageLength : -1, visRecords = recordsDisplay(settings), all = len === -1;
		return {
			page: all ? 0 : Math.floor(start / len),
			pages: all ? 1 : Math.ceil(visRecords / len),
			start,
			end: displayEnd(settings),
			length: len,
			recordsTotal: recordsTotal(settings),
			recordsDisplay: visRecords,
			serverSide: dataSource(settings) === "ssp"
		};
	});
	register("page.len()", function(len) {
		if (len === void 0 || len === null) return this.context.length !== 0 ? this.context[0].pageLength : void 0;
		return this.iterator("table", function(settings) {
			lengthChange(settings, len);
		});
	});
	register("processing()", function(show) {
		return this.iterator("table", (ctx) => processingDisplay(ctx, show));
	});
	Dom$1.s(document).on("preInit.dt", function(e, context) {
		var api = new Api(context);
		api.on("stateSaveParams.DT", function(ev, settings, d) {
			var idFn = settings.rowIdFn;
			var rows = settings.displayMaster;
			var ids = [];
			for (var i = 0; i < rows.length; i++) {
				var rowIdx = rows[i];
				var row = settings.data[rowIdx];
				if (row.detailsShow) ids.push("#" + idFn(row.data));
			}
			d.childRows = ids;
		});
		api.on("stateLoaded.DT", function(ev, settings, state) {
			detailsStateLoad(api, state);
		});
	});
	Dom$1.s(document).on("plugin-init.dt", function(e, context) {
		var api = context.api;
		detailsStateLoad(api, api.state.loaded());
	});
	function detailsStateLoad(api, state) {
		if (state && state.childRows) api.rows(state.childRows.map(function(id) {
			return id.replace(/([^:\\]*(?:\\.[^:\\]*)*):/g, "$1\\:");
		})).every(function() {
			callbackFire(api.settings()[0], null, "requestChild", [this]);
		});
	}
	function detailsAdd(ctx, row, data, klass) {
		if (!row) return;
		var rows = [];
		var addRow = function(r, k) {
			if (Array.isArray(r) || util.is.jquery(r)) {
				for (var i = 0, iLen = r.length; i < iLen; i++) addRow(r[i], k);
				return;
			}
			if (r.nodeName && r.nodeName.toLowerCase() === "tr") {
				r.setAttribute("data-dt-row", row.idx);
				rows.push(r);
			} else {
				let td = Dom$1.c("td").classAdd(k);
				let created = Dom$1.c("tr").append(td).attr("data-dt-row", row.idx).classAdd(k);
				if (r.nodeName) td.append(r);
				else td.html(r);
				td.get(0).colSpan = visibleColumns(ctx);
				rows.push(created.get(0));
			}
		};
		addRow(data, klass);
		if (row.details) row.details.detach();
		row.details = Dom$1.s(rows);
		if (row.detailsShow && row.tr) row.details.insertAfter(row.tr);
	}
	var detailsState = util.throttle(function(ctx) {
		saveState(ctx[0]);
	}, 500);
	function detailsRemove(api, idx) {
		var ctx = api.context;
		if (ctx.length) {
			var row = ctx[0].data[idx !== void 0 ? idx : api[0]];
			if (row && row.details) {
				row.details.detach();
				row.detailsShow = void 0;
				row.details = void 0;
				Dom$1.s(row.tr).classRemove("dt-hasChild");
				detailsState(ctx);
			}
		}
	}
	function detailsDisplay(api, show) {
		var ctx = api.context;
		if (ctx.length && api.length) {
			var row = ctx[0].data[api[0]];
			if (row && row.details) {
				row.detailsShow = show;
				if (show && row.tr) {
					row.details.insertAfter(row.tr);
					Dom$1.s(row.tr).classAdd("dt-hasChild");
				} else if (!show) {
					row.details.detach();
					Dom$1.s(row.tr).classRemove("dt-hasChild");
				}
				callbackFire(ctx[0], null, "childRow", [show, api.row(api[0])]);
				detailsEvents(ctx[0]);
				detailsState(ctx);
			}
		}
	}
	function detailsEvents(settings) {
		var api = new Api(settings);
		var namespace = ".dt.DT_details";
		var drawEvent = "draw" + namespace;
		var colvisEvent = "column-sizing" + namespace;
		var destroyEvent = "destroy" + namespace;
		var data = settings.data;
		api.off(drawEvent + " " + colvisEvent + " " + destroyEvent);
		if (util.array.pluck(data, "details").length > 0) {
			api.on(drawEvent, function(e, ctx) {
				if (settings !== ctx) return;
				api.rows({ page: "current" }).eq(0).each(function(idx) {
					var row = data[idx];
					if (row && row.detailsShow && row.details && row.tr) row.details.insertAfter(row.tr);
				});
			});
			api.on(colvisEvent, function(e, ctx) {
				if (settings !== ctx) return;
				var row, visible = visibleColumns(ctx);
				for (var i = 0, iLen = data.length; i < iLen; i++) {
					row = data[i];
					if (row && row.details) row.details.each(function(el) {
						var td = Dom$1.s(el).children("td");
						if (td.count() == 1) td.attr("colspan", visible);
					});
				}
			});
			api.on(destroyEvent, function(e, ctx) {
				if (settings !== ctx) return;
				for (var i = 0, iLen = data.length; i < iLen; i++) {
					let d = data[i];
					if (d && d.details) detailsRemove(api, i);
				}
			});
		}
	}
	var _child_obj = "row().child";
	var _child_mth = _child_obj + "()";
	Api.register(_child_mth, function(data, klass) {
		var _a;
		var ctx = this.context;
		if (data === void 0) return ctx.length && this.length && ctx[0].data[this[0]] ? (_a = ctx[0].data[this[0]]) === null || _a === void 0 ? void 0 : _a.details : void 0;
		else if (data === true) this.child.show();
		else if (data === false) detailsRemove(this);
		else if (ctx.length && this.length) detailsAdd(ctx[0], ctx[0].data[this[0]], data, klass);
		return this.inst(this.context, this);
	});
	Api.register([_child_obj + ".show()", _child_mth + ".show()"], function() {
		detailsDisplay(this, true);
		return this;
	});
	Api.register([_child_obj + ".hide()", _child_mth + ".hide()"], function() {
		detailsDisplay(this, false);
		return this;
	});
	Api.register([_child_obj + ".remove()", _child_mth + ".remove()"], function() {
		detailsRemove(this);
		return this;
	});
	Api.register(_child_obj + ".isShown()", function() {
		var ctx = this.context;
		if (ctx.length && this.length && ctx[0].data[this[0]]) return ctx[0].data[this[0]].detailsShow || false;
		return false;
	});
	function selectRows(settings, selector, opts) {
		var rows;
		var run = function(sel) {
			var selInt = util.conv.intVal(sel);
			var data = settings.data;
			if (selInt !== null && !opts) return [selInt];
			if (!rows) rows = selectorRowIndexes(settings, opts);
			if (selInt !== null && rows.indexOf(selInt) !== -1) return [selInt];
			else if (sel === null || sel === void 0 || sel === "") return rows;
			if (typeof sel === "function") return rows.map(function(idx) {
				var row = data[idx];
				return row && sel(idx, row.data, row.tr) ? idx : null;
			});
			if (sel.nodeName) {
				var rowIdx = sel._DT_RowIndex;
				var cellIdx = sel._DT_CellIndex;
				var row;
				if (rowIdx !== void 0) {
					row = data[rowIdx];
					return row && row.tr === sel ? [rowIdx] : [];
				} else if (cellIdx) {
					row = data[cellIdx.row];
					return row && row.tr === sel.parentNode ? [cellIdx.row] : [];
				} else {
					var host = Dom$1.s(sel).closest("*[data-dt-row]");
					return host.count() ? [parseInt(host.attr("data-dt-row"))] : [];
				}
			}
			if (typeof sel === "string") {
				if (sel.charAt(0) === "#") {
					var rowObj = settings.ids[sel.replace(/^#/, "")];
					if (rowObj !== void 0) return [rowObj.idx];
				} else if (sel.match(/^(tr)?:eq\(\d+\)$/)) {
					let idx = parseInt(sel.replace(/[^\d]/g, ""));
					return rows[idx] !== void 0 ? [rows[idx]] : [];
				}
			}
			var nodes = util.array.removeEmpty(util.array.pluckOrder(settings.data, rows, "tr"));
			return Dom$1.s(nodes).filter(sel).mapTo((el) => el._DT_RowIndex);
		};
		var matched = selectorRun("row", selector, run, settings, opts);
		if (opts.order === "current" || opts.order === "applied") sortDisplay(settings, matched);
		return matched;
	}
	register("rows()", function(arg1, arg2) {
		let opts;
		let selector;
		if (arg1 === void 0) selector = "";
		else if (util.is.plainObject(arg1)) {
			selector = "";
			opts = arg1;
		} else {
			selector = arg1;
			opts = arg2;
		}
		opts = selectorOpts(opts);
		var inst = this.iterator("table", function(settings) {
			return selectRows(settings, selector, opts);
		}, true);
		inst.selector.rows = selector;
		inst.selector.opts = opts;
		return inst;
	});
	register("rows().every()", function(fn) {
		var opts = this.selector.opts;
		var counter = 0;
		return this.iterator("every", (settings, selectedIdx, tableIdx) => {
			let inst = this.row(selectedIdx, opts);
			fn.call(inst, selectedIdx, tableIdx, counter);
			counter++;
		});
	});
	register("rows().nodes()", function() {
		return this.iterator("row", function(settings, row) {
			var _a;
			return ((_a = settings.data[row]) === null || _a === void 0 ? void 0 : _a.tr) || void 0;
		}, true);
	});
	register("rows().data()", function() {
		return this.iterator(true, "rows", function(settings, rows) {
			return util.array.pluckOrder(settings.data, rows, "data");
		}, true);
	});
	registerPlural("rows().invalidate()", "row().invalidate()", function(src) {
		return this.iterator("row", function(settings, row) {
			invalidateRow(settings, row, src);
		});
	});
	registerPlural("rows().indexes()", "row().index()", function() {
		return this.iterator("row", function(settings, row) {
			return row;
		}, true);
	});
	registerPlural("rows().ids()", "row().id()", function(hash) {
		var _a;
		var a = [];
		var context = this.context;
		for (var i = 0, iLen = context.length; i < iLen; i++) for (var j = 0, jen = this[i].length; j < jen; j++) {
			var id = context[i].rowIdFn((_a = context[i].data[this[i][j]]) === null || _a === void 0 ? void 0 : _a.data);
			a.push((hash === true ? "#" : "") + id);
		}
		return this.inst(context, a);
	});
	registerPlural("rows().remove()", "row().remove()", function() {
		this.iterator("row", function(settings, row) {
			var data = settings.data;
			var rowData = data[row];
			var idx = settings.displayMaster.indexOf(row);
			if (idx !== -1) settings.displayMaster.splice(idx, 1);
			if (settings.recordsDisplay > 0) settings.recordsDisplay--;
			lengthOverflow(settings);
			var id = settings.rowIdFn(rowData === null || rowData === void 0 ? void 0 : rowData.data);
			if (id !== void 0) delete settings.ids[id];
			data[row] = null;
		});
		return this;
	});
	register("rows.add()", function(rows) {
		var newRows = this.iterator("table", function(settings) {
			var row, i, iLen;
			var out = [];
			for (i = 0, iLen = rows.length; i < iLen; i++) {
				row = rows[i];
				if (row.nodeName && row.nodeName.toUpperCase() === "TR") out.push(addTr(settings, Dom$1.s(row))[0]);
				else out.push(addData(settings, row));
			}
			return out;
		}, true);
		var modRows = this.rows(-1);
		modRows.pop();
		arrayApply(modRows, newRows);
		return modRows;
	});
	register("row()", function(selector, opts) {
		return selectorFirst(this.rows(selector, opts));
	});
	register("row().data()", function(data) {
		var _a;
		var ctx = this.context;
		if (data === void 0) return ctx.length && this.length && this[0].length ? (_a = ctx[0].data[this[0]]) === null || _a === void 0 ? void 0 : _a.data : void 0;
		var row = ctx[0].data[this[0]];
		row.data = data;
		if (Array.isArray(data) && row.tr && row.tr.id) util.set(ctx[0].rowId)(data, row.tr.id);
		invalidateRow(ctx[0], this[0][0], "data");
		return this;
	});
	register("row().node()", function() {
		var ctx = this.context;
		if (ctx.length && this.length && this[0].length) {
			var row = ctx[0].data[this[0]];
			if (row && row.tr) return row.tr;
		}
		return null;
	});
	register("row.add()", function(row) {
		if (row && row.fn && row.length) row = row[0];
		var rows = this.iterator("table", function(settings) {
			invalidColumn(settings);
			if (row.nodeName && row.nodeName.toUpperCase() === "TR") return addTr(settings, Dom$1.s(row))[0];
			return addData(settings, row);
		});
		return this.row(rows[0]);
	});
	register("search()", function(input, regex, smart, caseInsen) {
		if (input === void 0) {
			let ctx = this.context;
			if (ctx.length === 0) return;
			return ctx[0].searches["*"].search;
		}
		return this.iterator("table", function(ctx) {
			if (!ctx.features.searching) return;
			let target = ctx.searches["*"];
			if (!target) target = create$2();
			if (typeof regex === "object") assign(target, regex);
			else assign(target, {
				regex: regex === null ? false : regex,
				smart: smart === null ? true : smart,
				caseInsensitive: caseInsen === null ? true : caseInsen
			});
			target.search = input;
			ctx.searches["*"] = target;
			filterComplete(ctx);
		});
	});
	register("search.fixed()", function(name, search, options) {
		var ret = this.iterator(true, "table", function(settings) {
			var _a;
			var fixed = settings.searchesFixed["*"];
			if (!name) return Object.keys(fixed);
			else if (search === void 0) return (_a = fixed[name]) === null || _a === void 0 ? void 0 : _a.search;
			else if (search === null) delete fixed[name];
			else {
				let target = fixed[name];
				if (!target || !util.is.plainObject(target)) target = create$2();
				if (options) assign(target, options);
				target.search = search;
				fixed[name] = target;
			}
			return this;
		});
		return name !== void 0 && search === void 0 ? ret[0] : ret;
	});
	register(["columns().search()", "column().search()"], function(input, regex, smart, caseInsen) {
		var _a;
		if (input === void 0) {
			let name = this[0].join(",");
			return this.context.length ? ((_a = this.context[0].searches[name]) === null || _a === void 0 ? void 0 : _a.search) || "" : "";
		}
		return this.iterator("columns", function(ctx, columns) {
			let colIdxs = columns.join(",");
			let target = ctx.searches[colIdxs];
			if (!target) target = create$2();
			if ((input === "" || input === null) && columns.length > 1) {
				delete ctx.searches[colIdxs];
				return;
			}
			if (typeof regex === "object") assign(target, regex);
			else assign(target, {
				regex: regex === null ? false : regex,
				smart: smart === null ? true : smart,
				caseInsensitive: caseInsen === null ? true : caseInsen
			});
			target.search = input;
			target.columns = columns.slice();
			ctx.searches[colIdxs] = target;
			filterComplete(ctx);
		});
	});
	register(["columns().search.fixed()", "column().search.fixed()"], function(name, search, options) {
		if (!name) return this.iterator(true, "columns", function(settings, columns) {
			let colIdxs = columns.join(",");
			let fixed = settings.searchesFixed[colIdxs];
			return fixed ? Object.keys(fixed) : [];
		});
		if (search === void 0) {
			if (!this.context.length) return;
			else {
				let colIdxs = this[0].join(",");
				let fixed = this.context[0].searchesFixed[colIdxs];
				return fixed && fixed[name] ? fixed[name].search : void 0;
			}
		}
		return this.iterator(true, "columns", function(settings, columns) {
			let colIdxs = columns.join(",");
			let fixed = settings.searchesFixed[colIdxs];
			if (!fixed) {
				fixed = {};
				settings.searchesFixed[colIdxs] = fixed;
			}
			if (search === null) delete fixed[name];
			else {
				let target = fixed[name];
				if (!target || !util.is.plainObject(target)) target = create$2();
				if (options) assign(target, options);
				target.search = search;
				target.columns = columns;
				fixed[name] = target;
			}
			return this;
		});
	});
	register("state()", function(set, ignoreTime = true) {
		if (!set) return this.context.length ? this.context[0].stateSaved : null;
		let setMutate = assignDeep({}, set);
		return this.iterator("table", function(settings) {
			implementState(settings, setMutate, ignoreTime, function() {});
		});
	});
	register("state.clear()", function() {
		return this.iterator("table", function(settings) {
			settings.stateSaveCallback.call(settings.instance, settings, {});
		});
	});
	register("state.loaded()", function() {
		return this.context.length ? this.context[0].stateLoaded : null;
	});
	register("state.save()", function() {
		return this.iterator("table", function(settings) {
			saveState(settings);
		});
	});
	/**
	* Selector for HTML tables. Apply the given selector to the give array of
	* DataTables settings objects.
	*
	* @param selector Selector string or integer
	* @param a Array of DataTables settings objects to be filtered
	* @return Selected table notes
	*/
	function table_selector(selector, a) {
		if (Array.isArray(selector)) {
			var result = [];
			selector.forEach(function(sel) {
				arrayApply(result, table_selector(sel, a));
			});
			return result.filter((item) => !!item);
		}
		if (typeof selector === "number") return [a[selector]];
		var nodes = a.map(function(el) {
			return el.table;
		});
		return Dom$1.s(nodes).filter(selector).mapTo((el) => {
			return a[nodes.indexOf(el)];
		});
	}
	register("tables()", function(selector) {
		return selector !== void 0 && selector !== null ? this.inst(table_selector(selector, this.context)) : this.inst(this.context);
	});
	register("table()", function(selector) {
		return selectorFirst(this.tables(selector));
	});
	[
		[
			"nodes",
			"node",
			"table"
		],
		[
			"body",
			"body",
			"tbody"
		],
		[
			"header",
			"header",
			"thead"
		],
		[
			"footer",
			"footer",
			"tfoot"
		]
	].forEach(function(item) {
		registerPlural("tables()." + item[0] + "()", "table()." + item[1] + "()", function() {
			return this.iterator("table", (ctx) => ctx[item[2]], true);
		});
	});
	["header", "footer"].forEach(function(item) {
		register("table()." + item + ".structure()", function(selector) {
			var indexes = this.columns(selector).indexes().flatten().toArray();
			var ctx = this.context[0];
			var structure = headerLayout(ctx, ctx[item], indexes);
			var orderedIndexes = indexes.slice().sort(function(a, b) {
				return a - b;
			});
			return structure.map(function(row) {
				return indexes.map(function(colIdx) {
					return row[orderedIndexes.indexOf(colIdx)];
				});
			});
		});
	});
	registerPlural("tables().containers()", "table().container()", function() {
		return this.iterator("table", function(ctx) {
			return ctx.tableWrapper;
		}, true);
	});
	register("tables().every()", function(fn) {
		return this.iterator("table", (s, i) => {
			fn.call(this.table(i), i);
		});
	});
	register("caption()", function(value, side) {
		var context = this.context;
		if (value === void 0) {
			var node = context[0].captionNode;
			return node && context.length ? node.innerHTML : null;
		}
		return this.iterator("table", function(ctx) {
			var table = Dom$1.s(ctx.table);
			var caption = Dom$1.s(ctx.captionNode);
			var container = Dom$1.s(ctx.tableWrapper);
			if (!caption.count()) {
				caption = Dom$1.c("caption").html(value);
				ctx.captionNode = caption.get(0);
				if (!side) {
					table.prepend(caption);
					side = caption.css("caption-side");
				}
			}
			caption.html(value);
			if (side) {
				caption.css("caption-side", side);
				caption.get(0)._captionSide = side;
			}
			if (container.find("div.dt-scroll").count()) {
				var selector = side === "top" ? "head" : "foot";
				container.find("div.dt-scroll-" + selector + " table").prepend(caption);
			} else table.prepend(caption);
		}, true);
	});
	register("caption.node()", function() {
		var ctx = this.context;
		return ctx.length ? ctx[0].captionNode : null;
	});
	/**
	* What's this!? "DataTables Plus" is a commercial set of extensions for
	* DataTables, such as Editor, and the functions in this file allow a license
	* key to be provided (`DataTable.key(...)`) to unlock those features.
	*
	* This is the modal that I've selected to make DataTables sustainable, open
	* source core, with some commercial extensions available.
	*
	* Please support DataTables and open source by purchasing a Plus license from
	* https://datatables.net/plus .
	*/
	var _ready = false;
	var _notice;
	var _processingKey = false;
	var _delayedReleaseDate = null;
	var _delayedSoftware = null;
	var _licenseInfo = {
		developers: 0,
		type: null,
		expires: null,
		valid: null
	};
	var _wm = Dom$1.c("div");
	var _publicKey = "BE1A9w9D9U/4s4/TogY+1sW/dLJ8IquzK1PmV70J93ZTIvXMZ0eV2NAb52ntpgwVFySSB2fOI7geLNO737rQAyo=";
	/**
	* Convert a base64 string to a binary array
	*
	* @param b64 Source string
	* @returns Array
	*/
	function b64ToBuf(b64) {
		return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
	}
	/**
	* Logic to check the trial and plus license expiry and display messages if
	* needed. There is particular consideration for checking a release date of
	* software, as the license for DataTables Plus is perpetual for the version
	* purchased, and it shouldn't show a message for the purchased version ever.
	*
	* @param releaseDate The date the software was released on.
	* @param software The software name being validated. Can be null for a general
	*   "Plus" check.
	* @returns true if valid, false otherwise
	*/
	function check(releaseDate, software) {
		let expires = _licenseInfo.expires;
		if (!getSubtle()) {
			noticePrep("Unable to validate license key");
			noticeDisplay();
		} else if (_licenseInfo.valid === false) {
			noticePrep("License key invalid");
			noticeDisplay();
		} else if (_licenseInfo.type === "trial") {
			let remaining = expires ? Math.ceil((expires.getTime() - (/* @__PURE__ */ new Date()).getTime()) / 864e5) : -1;
			if (remaining < 0) {
				consoleMsg("Your trial has now expired - https://datatables.net/plus", "warn");
				noticePrep("Trial expired");
				noticeDisplay();
				return false;
			} else {
				consoleMsg("Your trial expires in " + remaining + " day" + (remaining === 1 ? "" : "s"));
				return true;
			}
		} else if (software === null) return true;
		else if (_licenseInfo.type === "plus" || _licenseInfo.type === "editor" && software === "editor") {
			if (!expires || new Date(releaseDate) > expires) {
				noticePrep("Upgrade required for this version");
				noticeDisplay();
				return false;
			}
			return true;
		} else if (_licenseInfo.type === "editor" && software !== "editor") {
			noticePrep("License for Editor only. Upgrade for Plus");
			noticeDisplay();
			return false;
		}
		noticePrep();
		noticeDisplay();
		return false;
	}
	/**
	* Common log message handling
	*
	* @param msg Message to show
	* @param level Log level
	*/
	function consoleMsg(msg, level = "log") {
		(level === "log" ? console.log : console.warn)("%cDataTables Plus%c " + msg, "background: #007bff; color: #fff; padding: 2px 5px;", "color: inherit;");
	}
	/**
	* Set the DataTables Plus key to use
	*
	* @param key DataTables Plus key - obtain from https://datatables.net/account .
	*/
	var key = function(key) {
		_processingKey = true;
		verify(key).then((result) => {
			_processingKey = false;
			check(_delayedReleaseDate, _delayedSoftware);
		}).catch(() => {
			_processingKey = false;
			check(_delayedReleaseDate, _delayedSoftware);
		});
	};
	/**
	* Build the notice
	*
	* @returns
	*/
	function noticePrep(text) {
		if (!_ready) {
			let shadow = _wm[0].attachShadow({ mode: "closed" });
			let notice = Dom$1.c("div").css({
				position: "fixed",
				bottom: "1em",
				right: "1em",
				border: "1px solid #ffc107",
				background: "#fff3cd",
				color: "#856404",
				padding: "0.5em 1em",
				"font-family": "sans-serif",
				"font-size": "12px",
				"border-radius": "4px",
				"z-index": "10000",
				"box-shadow": "0 2px 5px rgba(0,0,0,0.2)"
			});
			Dom$1.c("a").attr("href", "https://datatables.net/tn/25").attr("target", "_blank").css({
				color: "inherit",
				"text-decoration": "none"
			}).appendTo(notice);
			if (!text) text = "License key required";
			shadow.appendChild(notice[0]);
			_notice = notice;
			_ready = true;
		}
		if (text) _notice.find("a").html("DataTables Plus: " + text + " - learn more &#187;");
	}
	/**
	* Display the license notice
	*/
	function noticeDisplay() {
		if (!_processingKey && document.body && !document.body.contains(_wm[0])) document.body.appendChild(_wm[0]);
	}
	/**
	* Validate the license string, which is in two parts - the first is a payload
	* that provides a small amount of information about the license, and the second
	* which is the license key.
	*
	* @param licenseString Key to validate
	* @returns Promise with validation information
	*/
	function verify(licenseString) {
		return new Promise(function(resolve) {
			try {
				var parts = licenseString.split(":");
				if (parts.length !== 2) {
					_licenseInfo.valid = false;
					return resolve();
				}
				var payload = parts[0];
				var signatureB64 = parts[1];
				var payloadParts = payload.match(/(plus|trial|editor)_(\d+)_(\d{4})(\d{2})(\d{2})/);
				if (!payloadParts || payloadParts.length !== 6) {
					_licenseInfo.valid = false;
					return resolve();
				}
				_licenseInfo.type = payloadParts[1];
				_licenseInfo.developers = parseInt(payloadParts[2]);
				_licenseInfo.expires = /* @__PURE__ */ new Date(payloadParts[3] + "-" + payloadParts[4] + "-" + payloadParts[5]);
				var subtle = getSubtle();
				var rawKey = b64ToBuf(_publicKey);
				var rawSig = b64ToBuf(signatureB64);
				var data = new TextEncoder().encode(payload);
				if (!subtle) {
					_licenseInfo.valid = false;
					resolve();
					return;
				}
				subtle.importKey("raw", rawKey, {
					name: "ECDSA",
					namedCurve: "P-256"
				}, false, ["verify"]).then(function(key) {
					return subtle.verify({
						name: "ECDSA",
						hash: { name: "SHA-256" }
					}, key, rawSig, data);
				}).then(function(isValid) {
					_licenseInfo.valid = isValid;
					resolve();
				}).catch(function() {
					_licenseInfo.valid = false;
					resolve();
				});
			} catch (e) {
				_licenseInfo.valid = false;
				resolve();
			}
		});
	}
	/**
	* Create the `plus` function on `DataTable` which Plus extensions can call to
	* determine if the license key is valid and in date for the release. The
	* resulting function is called like this: `DataTable.plus('2026-12-25')` and
	* will return `true` or `false` depending on the key that was given (or not).
	*
	* @param DataTable The DataTable host object
	*/
	function plus(DataTable) {
		Object.defineProperty(DataTable, "plus", {
			value: function(releaseDate, software = "") {
				let host = window.location.hostname;
				if (host === "192.168.234.234" || host.endsWith(".datatables.net") || host === "datatables.net") return true;
				if (_processingKey) {
					_delayedReleaseDate = releaseDate;
					_delayedSoftware = software;
					return true;
				}
				return check(releaseDate, software);
			},
			configurable: false,
			enumerable: false,
			writable: false
		});
	}
	function getSubtle() {
		let cryptoObj = window.crypto || window.msCrypto;
		return cryptoObj.subtle || cryptoObj.webkitSubtle;
	}
	/**
	* CommonJS factory function pass through. This will check if the arguments
	* given are a window object or a jQuery object. If so they are set accordingly.
	*
	* @param root Window
	* @param jq jQuery
	* @returns Indicator
	*/
	function factory(root, jq) {
		var is = false;
		if (root && root.document) {
			window = root;
			document = root.document;
		}
		if (jq && jq.fn && jq.fn.jquery) is = true;
		return is;
	}
	/**
	* Check if a `<table>` node is a DataTable table already or not.
	*
	* @param table Table node or selector for the table to test. Note that if more
	*   than more than one table is passed on, only the first will be checked
	* @returns true the table given is a DataTable, or false otherwise
	*/
	var isDataTable = function(table) {
		if (table instanceof Api) return true;
		else if (arrayLike(table)) table = Array.from(table);
		var t = Dom$1.s(table).get(0);
		var is = false;
		for (let i = 0; i < ext.settings.length; i++) {
			let ctx = ext.settings[i];
			var head = ctx.scrollHead ? ctx.scrollHead.find("table").get(0) : null;
			var foot = ctx.scrollFoot ? ctx.scrollFoot.find("table").get(0) : null;
			if (ctx.table === t || head === t || foot === t) is = true;
		}
		return is;
	};
	/**
	* Get all DataTable tables that have been initialised - optionally you can
	* select to get only currently visible tables.
	*
	* @param visible Flag to indicate if you want all (default) or visible tables
	*   only.
	* @returns Array of `table` nodes (not DataTable instances) which are
	*   DataTables
	*/
	var tables = function(visible) {
		var api = false;
		if (visible && typeof visible !== "boolean") {
			api = visible.api || false;
			visible = visible.visible || false;
		}
		var a = ext.settings.filter(function(o) {
			return !visible || visible && Dom$1.s(o.table).isVisible() ? true : false;
		}).map(function(o) {
			return o.table;
		});
		return api ? new Api(a) : a;
	};
	function _divProp(el, prop, val) {
		if (val) el[prop] = val;
	}
	register$2("div", function(settings, opts) {
		var n = document.createElement("div");
		if (opts) {
			_divProp(n, "className", opts.className);
			_divProp(n, "id", opts.id);
			_divProp(n, "innerHTML", opts.html);
			_divProp(n, "textContent", opts.text);
		}
		return n;
	});
	register$2("info", function(settings, optsIn) {
		if (!settings.features.info) return null;
		let lang = settings.language, tid = settings.tableId, n = Dom$1.c("div").classAdd(settings.classes.info.container);
		let opts = Object.assign({
			callback: lang.infoCallback,
			empty: lang.infoEmpty,
			postfix: lang.infoPostFix,
			search: lang.infoFiltered,
			text: lang.info
		}, optsIn);
		settings.callbacks.draw.push(function(s) {
			updateInfo(s, opts, n);
		});
		if (!settings.infoEl) {
			n.attr({
				"aria-live": "polite",
				id: tid + "_info",
				role: "status"
			});
			Dom$1.s(settings.table).attr("aria-describedby", tid + "_info");
			settings.infoEl = n;
		}
		return n;
	}, "i");
	/**
	* Update the information elements in the display
	*  @param settings DataTables settings object
	*  @param opts
	*  @param node
	*/
	function updateInfo(settings, opts, node) {
		var start = settings.displayStart + 1, end = displayEnd(settings), max = recordsTotal(settings), total = recordsDisplay(settings), out = total ? opts.text : opts.empty;
		if (total !== max) out += " " + opts.search;
		out += opts.postfix;
		out = macros(settings, out);
		if (opts.callback) out = opts.callback.call(settings.instance, settings, start, end, max, total, out);
		node.html(out);
		callbackFire(settings, null, "info", [
			settings,
			node.get(0),
			out
		]);
	}
	register$2("paging", function(settings, optsIn) {
		if (!settings.features.paging) return null;
		let opts = Object.assign({
			buttons: ext.pager.numbers_length,
			type: settings.pagingType,
			boundaryNumbers: true,
			firstLast: true,
			previousNext: true,
			numbers: true
		}, optsIn);
		let host = Dom$1.c("div").classAdd(settings.classes.paging.container + (opts.type ? " paging_" + opts.type : "")).append(Dom$1.c("nav").attr("aria-label", "pagination").classAdd(settings.classes.paging.nav));
		let draw = function() {
			_pagingDraw(settings, host.children(), opts);
		};
		settings.callbacks.draw.push(draw);
		Dom$1.s(settings.table).on("column-sizing.dt.DT", draw);
		return host;
	}, "p");
	/**
	* Dynamically create the button type array based on the configuration options.
	* This will only happen if the paging type is not defined.
	*/
	function _pagingDynamic(opts) {
		let out = [];
		if (opts.numbers) out.push("numbers");
		if (opts.previousNext) {
			out.unshift("previous");
			out.push("next");
		}
		if (opts.firstLast) {
			out.unshift("first");
			out.push("last");
		}
		return out;
	}
	function _pagingDraw(settings, host, opts) {
		if (!settings.initDone) return;
		let plugin = opts.type ? ext.pager[opts.type] : _pagingDynamic, aria = settings.language.aria.paginate || {}, start = settings.displayStart, len = settings.pageLength, visRecords = recordsDisplay(settings), all = len === -1, page = all ? 0 : Math.ceil(start / len), pages = all ? visRecords ? 1 : 0 : Math.ceil(visRecords / len), buttons = [], buttonEls = [], buttonsNested = plugin(opts).map(function(val) {
			return val === "numbers" ? pagingNumbers(page, pages, opts.buttons, opts.boundaryNumbers) : val;
		});
		buttons = buttons.concat.apply(buttons, buttonsNested);
		for (let i = 0; i < buttons.length; i++) {
			let button = buttons[i];
			let btnInfo = _pagingButtonInfo(settings, button, page, pages);
			let btn = renderer(settings, "pagingButton")(settings, button, btnInfo.display, btnInfo.active, btnInfo.disabled);
			let ariaLabel = typeof button === "string" ? aria[button] : aria.number ? aria.number + (button + 1) : null;
			Dom$1.s(btn.clicker).attr({
				"aria-controls": settings.tableId,
				"aria-disabled": btnInfo.disabled ? "true" : null,
				"aria-current": btnInfo.active ? "page" : null,
				"aria-label": ariaLabel,
				"data-dt-idx": button,
				tabIndex: btnInfo.disabled ? -1 : settings.tabIndex && btn.clicker.nodeName.toLowerCase() !== "span" ? settings.tabIndex : null
			});
			if (typeof button !== "number") Dom$1.s(btn.clicker).classAdd(button);
			bindAction(btn.clicker, "", function(e) {
				e.preventDefault();
				pageChange(settings, button, true);
			});
			buttonEls.push(btn.display);
		}
		let wrapped = renderer(settings, "pagingContainer")(settings, buttonEls);
		let activeEl = host.find(document.activeElement).attr("data-dt-idx");
		host.empty().append(wrapped);
		if (activeEl) host.find("[data-dt-idx=\"" + activeEl + "\"]").trigger("focus");
		if (buttonEls.length) {
			let outerHeight = Dom$1.s(buttonEls[0]).height("withBorder");
			if (opts.buttons > 1 && outerHeight > 0 && host.height() >= outerHeight * 2 - 10) _pagingDraw(settings, host, Object.assign({}, opts, { buttons: opts.buttons - 2 }));
		}
	}
	/**
	* Get properties for a button based on the current paging state of the table
	*
	* @param settings DT settings object
	* @param button The button type in question
	* @param page Table's current page
	* @param pages Number of pages
	* @returns Info object
	*/
	function _pagingButtonInfo(settings, button, page, pages) {
		let lang = settings.language.paginate;
		let o = {
			display: "",
			active: false,
			disabled: false
		};
		switch (button) {
			case "ellipsis":
				o.display = "&#x2026;";
				break;
			case "first":
				o.display = lang.first;
				if (page === 0) o.disabled = true;
				break;
			case "previous":
				o.display = lang.previous;
				if (page === 0) o.disabled = true;
				break;
			case "next":
				o.display = lang.next;
				if (pages === 0 || page === pages - 1) o.disabled = true;
				break;
			case "last":
				o.display = lang.last;
				if (pages === 0 || page === pages - 1) o.disabled = true;
				break;
			default: if (typeof button === "number") {
				o.display = settings.formatNumber(button + 1, settings);
				if (page === button) o.active = true;
			}
		}
		return o;
	}
	var __lengthCounter = 0;
	register$2("pageLength", function(settings, optsIn) {
		var features = settings.features;
		if (!features.paging || !features.lengthChange) return null;
		let opts = Object.assign({
			menu: settings.lengthMenu,
			text: settings.language.lengthMenu
		}, optsIn);
		let classes = settings.classes.length, tableId = settings.tableId, menu = opts.menu, lengths = [], language = [], i;
		if (Array.isArray(menu[0])) {
			lengths = menu[0];
			language = menu[1];
		} else for (i = 0; i < menu.length; i++) if (plainObject(menu[i])) {
			lengths.push(menu[i].value);
			language.push(menu[i].label);
		} else {
			lengths.push(menu[i]);
			language.push(menu[i]);
		}
		var end = opts.text.match(/_MENU_$/);
		var start = opts.text.match(/^_MENU_/);
		var removed = opts.text.replace(/_MENU_/, "");
		var str = "<label>" + opts.text + "</label>";
		if (start) str = "_MENU_<label>" + removed + "</label>";
		else if (end) str = "<label>" + removed + "</label>_MENU_";
		var tmpId = "tmp-" + +/* @__PURE__ */ new Date();
		var div = Dom$1.c("div").classAdd(classes.container).html(str.replace("_MENU_", "<span id=\"" + tmpId + "\"></span>"));
		var textNodes = [];
		Array.prototype.slice.call(div.find("label").get(0).childNodes).forEach(function(el) {
			if (el.nodeType === Node.TEXT_NODE) textNodes.push({
				el,
				text: el.textContent
			});
		});
		var updateEntries = function(len) {
			textNodes.forEach(function(node) {
				node.el.textContent = macros(settings, node.text, len);
			});
		};
		var select = Dom$1.c("select").attr("aria-controls", tableId).attr("autocomplete", "off").classAdd(classes.select);
		for (i = 0; i < lengths.length; i++) {
			var label = settings.api.i18n("lengthLabels." + lengths[i], null);
			if (label === null) label = typeof language[i] === "number" ? settings.formatNumber(language[i], settings) : language[i];
			select.get(0)[i] = new Option(label, lengths[i]);
		}
		div.find("#" + tmpId).replaceWith(select);
		div.find("select").attr("id", "dt-length-" + __lengthCounter).val(settings.pageLength).on("change.DT", function() {
			lengthChange(settings, select.val());
			draw(settings);
		});
		div.find("label").attr("for", "dt-length-" + __lengthCounter);
		__lengthCounter++;
		Dom$1.s(settings.table).on("length.dt.DT", function(e, s, len) {
			if (settings === s) {
				let localSelect = div.find("select");
				localSelect.find("option[data-dt-len-tmp]").remove();
				if (!localSelect.find("option[value=\"" + len + "\"]").length) {
					let after = findInsertBeforePoint(select, len);
					let tempOption = Dom$1.c("option").val(len).text(len).attr("data-dt-len-tmp", true);
					if (after && after.length) tempOption.insertBefore(after);
					else localSelect.append(tempOption);
				}
				localSelect.val(len);
				updateEntries(len);
			}
		});
		updateEntries(settings.pageLength);
		return div;
	}, "l");
	/**
	* Find the element to insert the temporary option before to keep the sequence.
	*
	* @param select Select element
	* @param insertValue Page length value
	* @returns Target option or null if not found
	*/
	function findInsertBeforePoint(select, insertValue) {
		let options = select.find("option");
		let idx = options.mapTo((el) => parseInt(el.value)).findIndex((val) => val > insertValue);
		return idx < -1 ? null : options.eq(idx);
	}
	var __searchCounter = 0;
	register$2("search", function(settings, optsIn) {
		if (!settings.features.searching) return null;
		let classes = settings.classes.search;
		let tableId = settings.tableId;
		let language = settings.language;
		let input = "<input type=\"search\" class=\"" + classes.input + "\" autocomplete=\"off\"/>";
		let opts = util.object.assignDeep({
			columns: "*",
			placeholder: language.searchPlaceholder,
			processing: false,
			text: language.search
		}, optsIn);
		if (opts.text.indexOf("_INPUT_") === -1) opts.text += "_INPUT_";
		opts.text = macros(settings, opts.text);
		let indexes = settings.api.columns(opts.columns).indexes().toArray();
		let searchName = opts.columns === "*" ? "*" : indexes.join(",");
		let appliedSearch = settings.searches[searchName];
		if (!appliedSearch) {
			appliedSearch = create$2();
			settings.searches[searchName] = appliedSearch;
		}
		appliedSearch.columns = indexes;
		let end = opts.text.match(/_INPUT_$/);
		let start = opts.text.match(/^_INPUT_/);
		let removed = opts.text.replace(/_INPUT_/, "");
		let str = "<label>" + opts.text + "</label>";
		if (start) str = "_INPUT_<label>" + removed + "</label>";
		else if (end) str = "<label>" + removed + "</label>_INPUT_";
		let filter = Dom$1.c("div").classAdd(classes.container).html(str.replace(/_INPUT_/, input));
		filter.find("label").attr("for", "dt-search-" + __searchCounter);
		filter.find("input").attr("id", "dt-search-" + __searchCounter);
		__searchCounter++;
		let searchFn = function(event) {
			let val = this.value;
			if (appliedSearch.return && event.key !== "Enter") return;
			if (val != appliedSearch.search) processingRun(settings, opts.processing, function() {
				appliedSearch.search = val;
				filterComplete(settings);
				settings.displayStart = 0;
				draw(settings);
			});
		};
		let searchDelay = settings.searchDelay;
		let filterEl = filter.find("input").val(textValue(appliedSearch.search)).attr("placeholder", opts.placeholder).on("keyup.DT search.DT input.DT paste.DT cut.DT", searchDelay ? util.debounce(searchFn, searchDelay) : searchFn).on("mouseup.DT", function(e) {
			setTimeout(function() {
				searchFn.call(filterEl.get(0), e);
			}, 10);
		}).on("keypress.DT", function(e) {
			if (e.keyCode == 13) return false;
		}).attr("aria-controls", tableId);
		Dom$1.s(settings.table).on("search.dt.DT", function(ev, s) {
			if (settings === s && filterEl.get(0) !== document.activeElement) {
				let host = settings.searches[searchName];
				filterEl.val(textValue(host.search));
			}
		});
		return filter;
	}, "f");
	/**
	* Convert a search input into a plain string value for display. This is needed
	* as the value could be a function or regex, which can't be displayed in the
	* input element.
	*
	* @param val Search term
	* @returns String version
	*/
	function textValue(val) {
		if (val instanceof RegExp) return val.toString();
		else if (typeof val !== "function") return val;
		return "";
	}
	var defaults$1 = {
		ajax: null,
		ajaxDataGet: false,
		api: null,
		browser: {
			barWidth: 0,
			scrollbarLeft: false
		},
		callbacks: {
			destroy: [],
			draw: [],
			footer: [],
			header: [],
			init: [],
			preDraw: [],
			row: [],
			rowCreated: [],
			stateLoadParams: [],
			stateLoaded: [],
			stateSaveParams: []
		},
		caption: "",
		captionNode: null,
		classes: {},
		columns: [],
		containerWidth: -1,
		data: [],
		deferLoading: false,
		destroyWidth: 0,
		destroying: false,
		display: [],
		displayMaster: [],
		displayStart: 0,
		displayStartInit: -1,
		doingDraw: false,
		dom: null,
		drawCount: 0,
		drawError: -1,
		drawHold: false,
		features: {
			autoWidth: false,
			deferRender: false,
			info: false,
			lengthChange: false,
			orderClasses: false,
			orderMulti: false,
			ordering: false,
			paging: false,
			processing: false,
			searching: false,
			serverSide: false,
			stateSave: false
		},
		footer: [],
		header: [],
		ids: {},
		init: {},
		initDone: false,
		initialised: false,
		language: {
			ajax: "",
			aria: {
				orderable: "",
				orderableRemove: "",
				orderableReverse: "",
				paginate: {
					first: "",
					last: "",
					next: "",
					number: "",
					previous: ""
				}
			},
			decimal: "",
			emptyTable: "",
			entries: { _: "" },
			info: "",
			infoEmpty: "",
			infoFiltered: "",
			infoPostFix: "",
			lengthMenu: "",
			lengthLabels: {},
			loadingRecords: "",
			paginate: {
				first: "",
				last: "",
				next: "",
				previous: ""
			},
			processing: "",
			search: "",
			searchPlaceholder: "",
			thousands: "",
			url: "",
			zeroRecords: ""
		},
		lastOrder: [],
		layout: {},
		loadingState: false,
		order: [],
		orderCellsTop: null,
		orderDescReverse: false,
		orderFixed: [],
		orderHandler: true,
		orderIndicators: true,
		pageLength: 10,
		pagingControls: 0,
		pagingType: "two_button",
		searchCols: [],
		recordsDisplay: 0,
		recordsTotal: 0,
		renderer: null,
		resizeObserver: null,
		reszEvt: false,
		rowId: "",
		rowReadObject: false,
		scroll: {
			barWidth: 0,
			collapse: null,
			x: "",
			xInner: "",
			y: ""
		},
		scrollBarVis: false,
		searchDelay: 0,
		searches: {},
		searchesFixed: { "*": {} },
		serverMethod: null,
		sortDetails: [],
		stateDuration: 0,
		stateLoadCallback: () => {
			return {};
		},
		stateLoaded: null,
		stateSaveCallback: () => {},
		stateSaved: null,
		tabIndex: 0,
		tableId: "",
		titleRow: null,
		typeDetect: true,
		unique: "",
		wasFiltered: false,
		wasOrdered: false,
		windowResizeCb: () => {}
	};
	/**
	* Create a new context object
	*
	* @param parts Values to assign, otherwise the defaults will be used
	* @returns New object
	*/
	function create(parts = {}) {
		return util.object.assignDeep({}, defaults$1, parts);
	}
	var models = {
		Column: Settings,
		Row: create$1,
		Search: create$2,
		Settings: create
	};
	/**
	* Initialisation options that can be given to DataTables at initialisation
	* time.
	*/
	var defaults = {
		ajax: null,
		autoWidth: true,
		caption: "",
		classes: {},
		column: defaults$4,
		columnDefs: null,
		columns: null,
		createdRow: null,
		data: null,
		deferLoading: null,
		deferRender: true,
		destroy: false,
		displayStart: 0,
		dom: null,
		drawCallback: null,
		footerCallback: null,
		formatNumber: function(toFormat, ctx) {
			return toFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ctx.language.thousands);
		},
		headerCallback: null,
		info: true,
		infoCallback: null,
		initComplete: null,
		language: {
			ajax: "",
			aria: {
				orderable: ": Activate to sort",
				orderableRemove: ": Activate to remove sorting",
				orderableReverse: ": Activate to invert sorting",
				paginate: {
					first: "First",
					last: "Last",
					next: "Next",
					number: "",
					previous: "Previous"
				}
			},
			decimal: "",
			emptyTable: "No data available in table",
			entries: {
				_: "entries",
				1: "entry"
			},
			info: "Showing _START_ to _END_ of _TOTAL_ _ENTRIES-TOTAL_",
			infoEmpty: "Showing 0 to 0 of 0 _ENTRIES-TOTAL_",
			infoFiltered: "(filtered from _MAX_ total _ENTRIES-MAX_)",
			infoPostFix: "",
			lengthLabels: { "-1": "All" },
			lengthMenu: "_MENU_ _ENTRIES_ per page",
			loadingRecords: "Loading...",
			paginate: {
				first: "«",
				last: "»",
				next: "›",
				previous: "‹"
			},
			processing: "",
			search: "Search:",
			searchPlaceholder: "",
			thousands: ",",
			url: "",
			zeroRecords: "No matching records found"
		},
		layout: {
			bottomEnd: "paging",
			bottomStart: "info",
			topEnd: "search",
			topStart: "pageLength"
		},
		lengthChange: true,
		lengthMenu: [
			10,
			25,
			50,
			100
		],
		on: {},
		order: [[0, "asc"]],
		orderCellsTop: null,
		orderClasses: true,
		orderDescReverse: true,
		orderFixed: [],
		orderMulti: true,
		ordering: true,
		pageLength: 10,
		paging: true,
		pagingType: "",
		preDrawCallback: null,
		processing: false,
		renderer: null,
		retrieve: false,
		rowCallback: null,
		rowId: "DT_RowId",
		scrollCollapse: false,
		scrollX: "",
		scrollY: "",
		search: defaults$3,
		searchCols: [],
		searchDelay: 0,
		searching: true,
		serverMethod: "GET",
		serverSide: false,
		stateDuration: 7200,
		stateLoadCallback: function(settings) {
			try {
				const state = (settings.stateDuration === -1 ? sessionStorage : localStorage).getItem("DataTables_" + settings.unique + "_" + location.pathname);
				return state ? JSON.parse(state) : {};
			} catch (e) {
				return {};
			}
		},
		stateLoadParams: null,
		stateLoaded: null,
		stateSave: false,
		stateSaveCallback: function(settings, data) {
			try {
				(settings.stateDuration === -1 ? sessionStorage : localStorage).setItem("DataTables_" + settings.unique + "_" + location.pathname, JSON.stringify(data));
			} catch (e) {}
		},
		stateSaveParams: null,
		tabIndex: 0,
		titleRow: null,
		typeDetect: true
	};
	var DataTable = function(selector, options) {
		if (factory(selector, options)) return DataTable;
		this.api = () => {
			return new Api(selector);
		};
		if (typeof this.jquery === "string") {
			new DataTable(this.toArray(), selector);
			return this;
		}
		var emptyInit = options === void 0;
		let tableEls = Dom$1.s(selector);
		let len = tableEls.count();
		if (emptyInit) options = {};
		tableEls.each((tableEl) => {
			var init = len > 1 ? util.object.assignDeepObjects({}, options, true) : options;
			var i = 0, iLen;
			var id = tableEl.getAttribute("id");
			var table = Dom$1.s(tableEl);
			if (tableEl.nodeName.toLowerCase() != "table") {
				log(null, 0, "Non-table node initialisation (" + tableEl.nodeName + ")", 2);
				return;
			}
			if (init.on && init.on.options) listener(table, "options", init.on.options);
			table.trigger("options.dt", true, [init]);
			compatOpts(defaults);
			compatCols(defaults$4);
			util.object.assign(init, escapeObject(table.data()));
			compatOpts(init);
			var allSettings = ext.settings;
			for (i = 0, iLen = allSettings.length; i < iLen; i++) {
				var s = allSettings[i];
				if (s.table == tableEl || s.thead && s.thead.parentNode == tableEl || s.tfoot && s.tfoot.parentNode == tableEl) {
					var retrieve = init.retrieve || false;
					var destroy = init.destroy || false;
					if (emptyInit || retrieve) return s.instance;
					else if (destroy) {
						new Api(s).destroy();
						break;
					} else {
						log(s, 0, "Cannot reinitialise DataTable", 3);
						return;
					}
				}
				if (s.tableId == tableEl.id) {
					allSettings.splice(i, 1);
					break;
				}
			}
			if (id === null || id === "") {
				id = "DataTables_Table_" + ext._unique++;
				tableEl.id = id;
			}
			table.children("colgroup").remove();
			var settings = create({
				destroyWidth: table.width(),
				unique: id,
				tableId: id,
				colgroup: Dom$1.c("colgroup"),
				fastData: function(row, column, type) {
					return getCellData(settings, row, column, type);
				}
			});
			settings.table = tableEl;
			settings.init = init;
			allSettings.push(settings);
			settings.api = new Api(settings);
			settings.instance = Dom$1.s(tableEl);
			settings.instance.api = () => settings.api;
			if (init.lengthMenu && !init.pageLength) init.pageLength = typeof init.lengthMenu[0] === "number" ? init.lengthMenu[0] : Array.isArray(init.lengthMenu[0]) ? init.lengthMenu[0][0] : init.lengthMenu[0].value;
			let config = util.object.assignDeepObjects(util.object.assignDeep({}, defaults), init);
			map(settings.features, config, [
				"autoWidth",
				"deferRender",
				"info",
				"lengthChange",
				"orderClasses",
				"ordering",
				"orderMulti",
				"paging",
				"processing",
				"searching",
				"serverSide"
			]);
			map(settings, config, [
				"ajax",
				"formatNumber",
				"serverMethod",
				"order",
				"orderFixed",
				"lengthMenu",
				"pagingType",
				"stateDuration",
				"orderCellsTop",
				"tabIndex",
				"dom",
				"stateLoadCallback",
				"stateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				"caption",
				"layout",
				"orderDescReverse",
				"orderIndicators",
				"orderHandler",
				"titleRow",
				"typeDetect",
				"pageLength",
				"searchCols"
			]);
			map(settings.scroll, config, [
				["scrollX", "x"],
				["scrollY", "y"],
				["scrollCollapse", "collapse"]
			]);
			map(settings.language, config, "infoCallback");
			settings.searches["*"] = create$2(config.search);
			callbackReg(settings, "draw", config.drawCallback);
			callbackReg(settings, "stateSaveParams", config.stateSaveParams);
			callbackReg(settings, "stateLoadParams", config.stateLoadParams);
			callbackReg(settings, "stateLoaded", config.stateLoaded);
			callbackReg(settings, "row", config.rowCallback);
			callbackReg(settings, "rowCreated", config.createdRow);
			callbackReg(settings, "header", config.headerCallback);
			callbackReg(settings, "footer", config.footerCallback);
			callbackReg(settings, "init", config.initComplete);
			callbackReg(settings, "preDraw", config.preDrawCallback);
			settings.rowIdFn = util.get(settings.rowId);
			if (config.on) Object.keys(config.on).forEach(function(key) {
				listener(table, key, config.on[key]);
			});
			browserDetect(settings);
			var classes = settings.classes;
			util.object.assignDeep(classes, ext.classes, config.classes);
			table.classAdd(classes.table);
			if (!settings.features.paging) config.displayStart = 0;
			if (settings.displayStartInit === -1) {
				settings.displayStartInit = config.displayStart;
				settings.displayStart = config.displayStart;
			}
			var defer = config.deferLoading;
			if (defer !== null) {
				settings.deferLoading = true;
				if (Array.isArray(defer)) {
					settings.recordsDisplay = defer[0];
					settings.recordsTotal = defer[1];
				} else {
					settings.recordsDisplay = defer;
					settings.recordsTotal = defer;
				}
			}
			var columnsInit = [];
			var thead = table.children("thead");
			var initHeaderLayout = detectHeader(settings, thead.get(0), false);
			if (config.columns) columnsInit = config.columns;
			else if (initHeaderLayout.length) for (i = 0, iLen = initHeaderLayout[0].length; i < iLen; i++) columnsInit.push(null);
			for (i = 0, iLen = columnsInit.length; i < iLen; i++) addColumn(settings);
			applyColumnDefs(settings, config.columnDefs, columnsInit, initHeaderLayout, function(idx, def) {
				columnOptions(settings, idx, def);
			});
			var rowOne = table.children("tbody").find("tr:first-child").eq(0);
			if (rowOne.count()) {
				var a = function(cell, name) {
					return cell.getAttribute("data-" + name) !== null ? name : null;
				};
				rowOne.eq(0).children("th, td").each(function(cell, loop) {
					var col = settings.columns[loop];
					if (!col) log(settings, 0, "Incorrect column count", 18);
					if (col.data === loop) {
						var sort = a(cell, "sort") || a(cell, "order");
						var filter = a(cell, "filter") || a(cell, "search");
						if (sort !== null || filter !== null) {
							col.data = {
								_: loop + ".display",
								sort: sort !== null ? loop + ".@data-" + sort : void 0,
								type: sort !== null ? loop + ".@data-" + sort : void 0,
								filter: filter !== null ? loop + ".@data-" + filter : void 0
							};
							col._isArrayHost = true;
							columnOptions(settings, loop);
						}
					}
				});
			}
			callbackReg(settings, "draw", saveState);
			var features = settings.features;
			if (config.stateSave) features.stateSave = true;
			if (config.order === void 0) {
				var sorting = settings.order;
				for (i = 0, iLen = sorting.length; i < iLen; i++) sorting[i][1] = settings.columns[i].orderSequence[0];
			}
			sortingClasses(settings);
			callbackReg(settings, "draw", function() {
				if (settings.wasOrdered || dataSource(settings) === "ssp" || features.deferRender) sortingClasses(settings);
			});
			var caption = table.children("caption");
			if (settings.caption) {
				if (caption.count() === 0) caption = Dom$1.c("caption").prependTo(table);
				caption.html(settings.caption);
			}
			if (caption.count()) {
				caption.get(0)._captionSide = caption.css("caption-side");
				settings.captionNode = caption.get(0);
			}
			if (caption.count()) settings.colgroup.insertAfter(caption.get(0));
			else settings.colgroup.prependTo(tableEl);
			if (thead.count() === 0) thead = Dom$1.c("thead").appendTo(table);
			settings.thead = thead.get(0);
			var tbody = table.children("tbody");
			if (tbody.count() === 0) tbody = Dom$1.c("tbody").insertAfter(thead.get(0));
			settings.tbody = tbody.get(0);
			var tfoot = table.children("tfoot");
			if (tfoot.count() === 0) tfoot = Dom$1.c("tfoot").appendTo(tableEl);
			settings.tfoot = tfoot.get(0);
			settings.display = settings.displayMaster.slice();
			settings.initialised = true;
			var language = settings.language;
			if (config.language) util.object.assignDeep(language, config.language);
			if (language.ajax) {
				let languageLoaded = function(json) {
					hungarianToCamel(json);
					util.object.assignDeep(language, json, settings.init.language);
					callbackFire(settings, null, "i18n", [settings], true);
					initialise(settings);
				};
				if (typeof language.ajax === "function") language.ajax(settings, languageLoaded);
				else {
					let ajaxBase = {
						dataType: "json",
						url: "",
						success: languageLoaded,
						error: function() {
							log(settings, 0, "i18n file loading error", 21);
							initialise(settings);
						}
					};
					if (typeof language.ajax === "string") ajaxBase.url = language.ajax;
					else ajaxBase = util.object.assign(ajaxBase, language.ajax);
					util.ajax(ajaxBase);
				}
			} else {
				callbackFire(settings, null, "i18n", [settings], true);
				initialise(settings);
			}
		});
		return this.api();
	};
	DataTable.type = register$1;
	DataTable.types = types;
	DataTable.render = helpers;
	DataTable.ext = ext;
	DataTable.use = util.external;
	DataTable.factory = factory;
	DataTable.versionCheck = util.version.check;
	DataTable.version = ext.version;
	DataTable.isDataTable = isDataTable;
	DataTable.tables = tables;
	DataTable.util = util;
	DataTable.Api = Api;
	DataTable.datetime = datetime;
	DataTable.__browser = browser;
	DataTable.Dom = Dom$1;
	DataTable.ajax = util.ajax;
	DataTable.key = key;
	plus(DataTable);
	/**
	* Private data store, containing all of the settings objects that are created
	* for the tables on a given page.
	*/
	DataTable.settings = ext.settings;
	/**
	* Object models container, for the various models that DataTables has available
	* to it. These models define the objects that are used to hold the active state
	* and configuration of the table.
	*/
	DataTable.models = models;
	DataTable.defaults = defaults;
	DataTable.feature = { register: register$2 };
	util.external(DataTable);
	if (window.jQuery) util.external(window.jQuery);
	//#endregion
	//#region node_modules/datatables.net-bs5/js/dataTables.bootstrap5.mjs
	/*! DataTables Bootstrap 5 integration
	* © SpryMedia Ltd - datatables.net/license
	*/
	DataTable.util.object.assignDeep(DataTable.defaults, { renderer: "bootstrap" });
	DataTable.util.object.assignDeep(DataTable.ext.classes, {
		container: "dt-container dt-bootstrap5",
		search: { input: "form-control form-control-sm" },
		length: { select: "form-select form-select-sm" },
		processing: { container: "dt-processing card" },
		layout: {
			row: "row mt-2 justify-content-between",
			cell: "d-md-flex justify-content-between align-items-center",
			tableCell: "col-12",
			start: "dt-layout-start col-md-auto me-auto",
			end: "dt-layout-end col-md-auto ms-auto",
			full: "dt-layout-full col-md"
		}
	});
	DataTable.ext.renderer.pagingButton.bootstrap = function(settings, buttonType, content, active, disabled) {
		var btnClasses = ["dt-paging-button", "page-item"];
		if (active) btnClasses.push("active");
		if (disabled) btnClasses.push("disabled");
		var li = DataTable.Dom.c("li").classAdd(btnClasses.join(" "));
		var a = DataTable.Dom.c("button").classAdd("page-link").attr("role", "link").attr("type", "button").html(content).appendTo(li);
		return {
			display: li.get(0),
			clicker: a.get(0)
		};
	};
	DataTable.ext.renderer.pagingContainer.bootstrap = function(settings, buttonEls) {
		return DataTable.Dom.c("ul").classAdd("pagination").append(buttonEls).get(0);
	};
	var dataTables_bootstrap5_default = DataTable;
	//#endregion
	//#region node_modules/datatables.net-responsive/js/dataTables.responsive.mjs
	/*! Responsive 4.0.3 for DataTables
	* Copyright (c) SpryMedia Ltd - datatables.net/license
	*/
	DataTable.util;
	var childRow = function(row, update, render) {
		var rowNode = Dom$1.s(row.node());
		if (update) {
			if (rowNode.classHas("dtr-expanded")) {
				row.child(render(), "child").show();
				return true;
			}
		} else if (!rowNode.classHas("dtr-expanded")) {
			var rendered = render();
			if (rendered === false) return false;
			row.child(rendered, "child").show();
			return true;
		} else row.child(false);
		return false;
	};
	var childRowImmediate = function(row, update, render) {
		var rowNode = Dom$1.s(row.node());
		if (!update && rowNode.classHas("dtr-expanded") || !row.responsive.hasHidden()) {
			row.child(false);
			return false;
		} else {
			var rendered = render();
			if (rendered === false) return false;
			row.child(rendered, "child").show();
			return true;
		}
	};
	function modal$1(options) {
		return function(row, update, render, closeCallback) {
			var modal;
			var rendered = render();
			if (rendered === false) return false;
			if (!update) {
				var close = function() {
					modal.remove();
					Dom$1.s(document).off("keypress.dtr");
					Dom$1.s(row.node()).classRemove("dtr-expanded");
					closeCallback();
				};
				modal = Dom$1.c("div").classAdd("dtr-modal").append(Dom$1.c("div").classAdd("dtr-modal-display").append(Dom$1.c("div").classAdd("dtr-modal-content").data("dtrRowIdx", row.index()).append(rendered)).append(Dom$1.c("div").classAdd("dtr-modal-close").html("&times;").on("click", function() {
					close();
				}))).append(Dom$1.c("div").classAdd("dtr-modal-background").on("click", function() {
					close();
				})).appendTo("body");
				Dom$1.s(row.node()).classAdd("dtr-expanded");
				Dom$1.s(document).on("keyup.dtr", function(e) {
					if (e.keyCode === 27) {
						e.stopPropagation();
						close();
					}
				});
			} else {
				modal = Dom$1.s("div.dtr-modal-content");
				if (modal.count() && row.index() === modal.data("dtrRowIdx")) modal.empty().append(rendered);
				else return false;
			}
			if (options && options.header) Dom$1.s("div.dtr-modal-content").prepend(Dom$1.c("h2").html(options.header(row)));
			return true;
		};
	}
	function listHiddenNodes() {
		let fn = function(api, rowIdx, columns) {
			let that = this;
			let ul = Dom$1.c("ul").attr("data-dtr-index", rowIdx).classAdd("dtr-details");
			let found = false;
			columns.forEach(function(col) {
				if (col.hidden) {
					col.className && "" + col.className;
					Dom$1.c("li").classAdd(col.className).attr("data-dtr-index", col.columnIndex).attr("data-dt-row", col.rowIndex).attr("data-dt-column", col.columnIndex).append(Dom$1.c("span").classAdd("dtr-title").html(col.title)).append(Dom$1.c("span").classAdd("dtr-data").append(that.childNodes(api, col.rowIndex, col.columnIndex))).appendTo(ul);
					found = true;
				}
			});
			return found ? ul.get(0) : false;
		};
		fn._responsiveMovesNodes = true;
		return fn;
	}
	function listHidden() {
		return function(api, rowIdx, columns) {
			let ul = Dom$1.c("ul").attr("data-dtr-index", rowIdx).classAdd("dtr-details");
			columns.forEach(function(col) {
				if (!col.hidden) return;
				Dom$1.c("li").classAdd(col.className).attr("data-dtr-index", col.columnIndex).attr("data-dt-row", col.rowIndex).attr("data-dt-column", col.columnIndex).append(Dom$1.c("span").classAdd("dtr-title").html(col.title)).append(Dom$1.c("span").classAdd("dtr-data").html(col.data)).appendTo(ul);
			});
			return ul.children().count() ? ul.get(0) : false;
		};
	}
	function tableAll(options = {}) {
		options = DataTable.util.object.assign({ tableClass: "" }, options);
		return function(api, rowIdx, columns) {
			let table = Dom$1.c("table").classAdd(options.tableClass).classAdd("dtr-details");
			columns.forEach(function(col) {
				if (!col.hidden) return;
				Dom$1.c("tr").classAdd(col.className).attr("data-dt-row", col.rowIndex).attr("data-dt-column", col.columnIndex).append(Dom$1.c("td").html(col.title)).append(Dom$1.c("td").html(col.data)).appendTo(table);
			});
			return table.children().count() ? table.get(0) : false;
		};
	}
	if (!DataTable || !DataTable.versionCheck || !DataTable.versionCheck("3")) throw "DataTables Responsive requires DataTables 3 or newer";
	var Responsive = class Responsive {
		constructor(dt, opts) {
			let details = { type: "inline" };
			if (opts && typeof opts.details === "string") details = { type: opts.details };
			else if (opts && opts.details === false) details = { type: false };
			this.c = util.object.assignDeep({}, Responsive.defaults, DataTable.defaults.responsive, opts);
			this.s = {
				childNodeStore: {},
				columns: [],
				current: [],
				details: util.is.plainObject(this.c.details) ? util.object.assign(details, this.c.details) : details,
				dt: new DataTable.Api(dt),
				timer: null
			};
			let settings = this.s.dt.settings()[0];
			if (settings._responsive) return;
			settings._responsive = this;
			this._init();
		}
		_init() {
			var that = this;
			var dt = this.s.dt;
			var oldWindowWidth = Dom$1.w.width();
			Dom$1.w.on("orientationchange.dtr", DataTable.util.throttle(function() {
				var width = Dom$1.w.width();
				if (width !== oldWindowWidth) {
					that._resize();
					oldWindowWidth = width;
				}
			}));
			dt.on("row-created.dtr", function(e, tr, data, idx) {
				if (that.s.current.includes(false)) Dom$1.s(tr).children("td, th").each(function(el, i) {
					var idx = dt.column.index("toData", i);
					if (that.s.current[idx] === false) Dom$1.s(el).css("display", "none").classAdd("dtr-hidden");
				});
			});
			dt.on("rowInvalidate.dtr", (e, ctx, rowIdx) => {
				this._redrawChildren();
			});
			dt.on("destroy.dtr", function() {
				dt.off(".dtr");
				Dom$1.s(dt.table().body()).off(".dtr");
				Dom$1.w.off("resize.dtr orientationchange.dtr");
				dt.cells(".dtr-control").nodes().toDom().classRemove("dtr-control");
				Dom$1.s(dt.table().node()).classRemove("dtr-inline collapsed");
				that.s.current.forEach((val, i) => {
					if (val === false) that._setColumnVis(i, true);
				});
			});
			if (this.c.breakpoints) this.c.breakpoints.sort((a, b) => {
				return a.width < b.width ? 1 : a.width > b.width ? -1 : 0;
			});
			this._classLogic();
			var details = this.s.details;
			if (details.type !== false) {
				that._detailsInit();
				dt.on("column-visibility.dtr", function() {
					if (that.s.timer) clearTimeout(that.s.timer);
					that.s.timer = setTimeout(function() {
						that.s.timer = null;
						that._classLogic();
						that._resizeAuto();
						that._resize(true);
						that._redrawChildren();
					}, 100);
				});
				dt.on("draw.dtr", function() {
					that._redrawChildren();
				});
				Dom$1.s(dt.table().node()).classAdd("dtr-" + details.type);
			}
			dt.on("column-calc.dt", function(e, d) {
				var curr = that.s.current;
				for (var i = 0; i < curr.length; i++) {
					var idx = d.visible.indexOf(i);
					if (curr[i] === false && idx >= 0) d.visible.splice(idx, 1);
				}
			});
			dt.on("preXhr.dtr", function() {
				var rowIds = [];
				dt.rows().every(function() {
					if (this.child.isShown()) rowIds.push(this.id(true));
				});
				dt.one("draw.dtr", function() {
					that._resizeAuto();
					that._resize();
					dt.rows(rowIds).every(function() {
						that._detailsDisplay(this, false);
					});
				});
			});
			dt.on("draw.dtr", function() {
				if (dt.page.info().serverSide) that.s.childNodeStore = {};
				that._controlClass();
			}).ready(function() {
				that._resizeAuto();
				that._resize();
				dt.on("column-sizing.dtr", function() {
					that._resizeAuto();
					that._resize();
				});
			});
			dt.on("column-reorder.dtr", function(e, settings, details) {
				that._classLogic();
				that._resizeAuto();
				that._resize(true);
			});
		}
		/**
		* Get and store nodes from a cell - use for node moving renderers
		*
		* @param dt DT instance
		* @param row Row index
		* @param col Column index
		*/
		childNodes(dt, row, col) {
			var name = row + "-" + col;
			if (this.s.childNodeStore[name]) return this.s.childNodeStore[name];
			var nodes = [];
			var children = dt.cell(row, col).node().childNodes;
			for (var i = 0, iLen = children.length; i < iLen; i++) nodes.push(children[i]);
			this.s.childNodeStore[name] = nodes;
			return nodes;
		}
		/**
		* Insert a `col` tag into the correct location in a `colgroup`.
		*
		* @param colGroup The `colgroup` tag
		* @param colEl Array of `col` tags
		* @param idx Column index
		*/
		_colGroupAttach(colGroup, colEls, idx) {
			var found = null;
			if (colEls[idx].get(0).parentNode === colGroup.get(0)) return;
			for (var i = idx + 1; i < colEls.length; i++) if (colGroup.get(0) === colEls[i].get(0).parentNode) {
				found = i;
				break;
			}
			if (found !== null) colEls[idx].insertBefore(colEls[found].get(0));
			else colGroup.append(colEls[idx]);
		}
		/**
		* Restore nodes from the cache to a table cell
		*
		* @param dt DT instance
		* @param row Row index
		* @param col Column index
		*/
		_childNodesRestore(dt, row, col) {
			var name = row + "-" + col;
			if (!this.s.childNodeStore[name]) return;
			var node = dt.cell(row, col).node();
			var store = this.s.childNodeStore[name];
			if (store.length > 0) {
				var parentChildren = store[0].parentNode.childNodes;
				var a = [];
				for (var i = 0, iLen = parentChildren.length; i < iLen; i++) a.push(parentChildren[i]);
				for (var j = 0, jen = a.length; j < jen; j++) node.appendChild(a[j]);
			}
			delete this.s.childNodeStore[name];
		}
		/**
		* Calculate the visibility for the columns in a table for a given
		* breakpoint. The result is pre-determined based on the class logic if
		* class names are used to control all columns, but the width of the table
		* is also used if there are columns which are to be automatically shown and
		* hidden.
		*
		* @param  breakpoint Breakpoint name to use for the calculation
		* @return {array} Array of boolean values initiating the visibility of each
		*   column.
		*/
		_columnsVisibility(breakpoint) {
			var dt = this.s.dt;
			var columns = this.s.columns;
			var i, iLen;
			var order = columns.map(function(col, idx) {
				return {
					columnIdx: idx,
					priority: col.priority
				};
			}).sort(function(a, b) {
				if (a.priority !== b.priority) return a.priority - b.priority;
				return a.columnIdx - b.columnIdx;
			});
			var display = columns.map((col, i) => {
				if (dt.column(i).visible() === false) return "not-visible";
				return col.auto && col.minWidth === null ? false : col.auto === true ? "-" : col.includeIn.includes(breakpoint);
			});
			var requiredWidth = 0;
			for (i = 0, iLen = display.length; i < iLen; i++) if (display[i] === true) requiredWidth += columns[i].minWidth;
			var scrolling = dt.settings()[0].scroll;
			var bar = scrolling.y || scrolling.x ? scrolling.barWidth : 0;
			var usedWidth = dt.table().container().offsetWidth - bar - requiredWidth;
			for (i = 0, iLen = display.length; i < iLen; i++) if (columns[i].control) usedWidth -= columns[i].minWidth;
			var empty = false;
			for (i = 0, iLen = order.length; i < iLen; i++) {
				var colIdx = order[i].columnIdx;
				if (display[colIdx] === "-" && !columns[colIdx].control && columns[colIdx].minWidth) {
					if (empty || usedWidth - columns[colIdx].minWidth < 0) {
						empty = true;
						display[colIdx] = false;
					} else display[colIdx] = true;
					usedWidth -= columns[colIdx].minWidth;
				}
			}
			var showControl = false;
			for (i = 0, iLen = columns.length; i < iLen; i++) if (!columns[i].control && !columns[i].never && display[i] === false) {
				showControl = true;
				break;
			}
			for (i = 0, iLen = columns.length; i < iLen; i++) {
				if (columns[i].control) display[i] = showControl;
				if (display[i] === "not-visible") display[i] = false;
			}
			if (!display.includes(true)) display[0] = true;
			return display;
		}
		/**
		* Create the internal `columns` array with information about the columns
		* for the table. This includes determining which breakpoints the column
		* will appear in, based upon class names in the column, which makes up the
		* vast majority of this method.
		*/
		_classLogic() {
			var that = this;
			var breakpoints = this.c.breakpoints;
			var dt = this.s.dt;
			var columns = [];
			dt.columns().every(function(i) {
				var column = this.column(i);
				var className = column.header().className;
				var priority = column.init().responsivePriority;
				var dataPriority = column.header().getAttribute("data-priority");
				if (priority === void 0) priority = dataPriority === void 0 || dataPriority === null ? 1e4 : parseInt(dataPriority) * 1;
				columns.push({
					className,
					includeIn: [],
					auto: false,
					control: false,
					never: className.match(/\b(dtr\-)?never\b/) ? true : false,
					priority,
					minWidth: 0
				});
			});
			var add = function(colIdx, name) {
				var includeIn = columns[colIdx].includeIn;
				if (!includeIn.includes(name)) includeIn.push(name);
			};
			var column = function(colIdx, name, operator, matched) {
				var size, i, iLen;
				let breakpoint = that._find(name);
				if (!breakpoints) return;
				if (!operator) columns[colIdx].includeIn.push(name);
				else if (operator === "max-") {
					if (breakpoint) {
						size = breakpoint.width;
						for (i = 0, iLen = breakpoints.length; i < iLen; i++) if (breakpoints[i].width <= size) add(colIdx, breakpoints[i].name);
					}
				} else if (operator === "min-") {
					if (breakpoint) {
						size = breakpoint.width;
						for (i = 0, iLen = breakpoints.length; i < iLen; i++) if (breakpoints[i].width >= size) add(colIdx, breakpoints[i].name);
					}
				} else if (operator === "not-") {
					for (i = 0, iLen = breakpoints.length; i < iLen; i++) if (matched && breakpoints[i].name.indexOf(matched) === -1) add(colIdx, breakpoints[i].name);
				}
			};
			columns.forEach(function(col, i) {
				var classNames = col.className.split(" ");
				var hasClass = false;
				for (var k = 0, ken = classNames.length; k < ken; k++) {
					var className = classNames[k].trim();
					if (className === "all" || className === "dtr-all") {
						hasClass = true;
						col.includeIn = breakpoints.map((a) => a.name);
						return;
					} else if (className === "none" || className === "dtr-none" || col.never) {
						hasClass = true;
						return;
					} else if (className === "control" || className === "dtr-control") {
						hasClass = true;
						col.control = true;
						return;
					}
					breakpoints === null || breakpoints === void 0 || breakpoints.forEach((breakpoint) => {
						var brokenPoint = breakpoint.name.split("-");
						var re = new RegExp("(min\\-|max\\-|not\\-)?(" + brokenPoint[0] + ")(\\-[_a-zA-Z0-9])?");
						var match = className.match(re);
						if (match) {
							hasClass = true;
							if (match[2] === brokenPoint[0] && match[3] === "-" + brokenPoint[1]) column(i, breakpoint.name, match[1], match[2] + match[3]);
							else if (match[2] === brokenPoint[0] && !match[3]) column(i, breakpoint.name, match[1], match[2]);
						}
					});
				}
				if (!hasClass) col.auto = true;
			});
			this.s.columns = columns;
		}
		/**
		* Update the cells to show the correct control class / button
		*/
		_controlClass() {
			if (this.s.details.type === "inline") {
				var dt = this.s.dt;
				var firstVisible = this.s.current.indexOf(true);
				dt.cells(null, function(idx) {
					return idx !== firstVisible;
				}, { page: "current" }).nodes().toDom().filter(".dtr-control").classRemove("dtr-control");
				if (firstVisible >= 0) dt.cells(null, firstVisible, { page: "current" }).nodes().toDom().classAdd("dtr-control");
			}
			this._tabIndexes();
		}
		/**
		* Show the details for the child row
		*
		* @param  row    API instance for the row
		* @param  update Update flag
		*/
		_detailsDisplay(row, update) {
			var that = this;
			var dt = this.s.dt;
			var details = this.s.details;
			var event = function(res) {
				Dom$1.s(row.node()).classToggle("dtr-expanded", res !== false);
				Dom$1.s(dt.table().node()).trigger("responsive-display.dt", false, [
					dt,
					row,
					res,
					update
				]);
			};
			if (details && details.type !== false) {
				var renderer = typeof details.renderer === "string" ? Responsive.renderer[details.renderer]() : details.renderer;
				var res = details.display(row, update, function() {
					return renderer ? renderer.call(that, dt, row[0][0], that._detailsObj(row[0])) : false;
				}, function() {
					event(false);
				});
				if (typeof res === "boolean") event(res);
			}
		}
		/**
		* Initialisation for the details handler
		*/
		_detailsInit() {
			var that = this;
			var dt = this.s.dt;
			var details = this.s.details;
			if (details.type === "inline") details.target = "td.dtr-control, th.dtr-control";
			Dom$1.s(dt.table().body()).on("keyup.dtr", "td, th", function(e) {
				if (document.activeElement) {
					let activeNodeName = document.activeElement.nodeName.toLowerCase();
					if (e.keyCode === 13 && Dom$1.s(this).data("dtrKeyboard") && (activeNodeName === "td" || activeNodeName === "th")) Dom$1.s(this).trigger("click");
				}
			});
			var target = details.target;
			var selector = typeof target === "string" ? target : "td, th";
			if (target !== void 0 || target !== null) Dom$1.s(dt.table().body()).on("click.dtr mousedown.dtr mouseup.dtr", selector, function(e) {
				if (!Dom$1.s(dt.table().node()).classHas("collapsed")) return;
				if (!dt.rows().nodes().toArray().includes(Dom$1.s(this).closest("tr").get(0))) return;
				if (typeof target === "number") {
					var targetIdx = target < 0 ? dt.columns().eq(0).length + target : target;
					if (dt.cell(this).index().column !== targetIdx) return;
				}
				var row = dt.row(Dom$1.s(this).closest("tr"));
				if (e.type === "click") that._detailsDisplay(row, false);
				else if (e.type === "mousedown") Dom$1.s(this).css("outline", "none");
				else if (e.type === "mouseup") Dom$1.s(this).css("outline", "").trigger("blur");
			});
		}
		/**
		* Get the details to pass to a renderer for a row
		* @param rowIdx Row index
		*/
		_detailsObj(rowIdx) {
			var that = this;
			var dt = this.s.dt;
			var columnApis = [];
			let settings = dt.settings()[0];
			return this.s.columns.map(function(col, i) {
				if (col.never || col.control) return false;
				var dtCol = settings.columns[i];
				if (!columnApis[i]) columnApis[i] = dt.column(i);
				return {
					className: dtCol.className,
					columnIndex: i,
					data: settings.fastData(rowIdx, i, that.c.orthogonal),
					hidden: columnApis[i].visible() && !that.s.current[i],
					rowIndex: rowIdx,
					title: columnApis[i].title()
				};
			}).filter((c) => !!c);
		}
		/**
		* Find a breakpoint object from a name
		*
		* @param  name Breakpoint name to find
		* @return Breakpoint description object
		*/
		_find(name) {
			var breakpoints = this.c.breakpoints;
			if (breakpoints) {
				for (var i = 0, len = breakpoints.length; i < len; i++) if (breakpoints[i].name === name) return breakpoints[i];
			}
		}
		/**
		* Re-create the contents of the child rows as the display has changed in
		* some way.
		*/
		_redrawChildren() {
			var that = this;
			var dt = this.s.dt;
			dt.rows({ page: "current" }).iterator("row", function(settings, idx) {
				that._detailsDisplay(dt.row(idx), true);
			});
		}
		/**
		* Alter the table display for a resized viewport. This involves first
		* determining what breakpoint the window currently is in, getting the
		* column visibilities to apply and then setting them.
		*
		* @param forceRedraw Force a redraw
		*/
		_resize(forceRedraw = false) {
			var that = this;
			var dt = this.s.dt;
			var width = Dom$1.w.width();
			var breakpoints = this.c.breakpoints;
			var breakpoint = breakpoints[0].name;
			var columns = this.s.columns;
			var i, iLen;
			var oldVis = this.s.current.slice();
			for (i = breakpoints.length - 1; i >= 0; i--) if (width <= breakpoints[i].width) {
				breakpoint = breakpoints[i].name;
				break;
			}
			var columnsVis = this._columnsVisibility(breakpoint);
			this.s.current = columnsVis;
			var collapsedClass = false;
			for (i = 0, iLen = columns.length; i < iLen; i++) if (columnsVis[i] === false && !columns[i].never && !columns[i].control && !dt.column(i).visible() === false) {
				collapsedClass = true;
				break;
			}
			Dom$1.s(dt.table().node()).classToggle("collapsed", collapsedClass);
			var changed = false;
			var visible = 0;
			var dtSettings = dt.settings()[0];
			var colGroup = Dom$1.s(dt.table().node()).children("colgroup");
			var colEls = dtSettings.columns.map(function(col) {
				return col.colEl;
			});
			dt.columns().eq(0).each(function(colIdx, i) {
				if (!dt.column(colIdx).visible()) return;
				if (columnsVis[i] === true) visible++;
				if (forceRedraw || columnsVis[i] !== oldVis[i]) {
					changed = true;
					that._setColumnVis(colIdx, columnsVis[i]);
				}
				if (!columnsVis[i]) colEls[i].detach();
				else that._colGroupAttach(colGroup, colEls, i);
			});
			if (changed) {
				dt.columns.adjust();
				this._redrawChildren();
				Dom$1.s(dt.table().node()).trigger("responsive-resize.dt", false, [dt, this._responsiveOnlyHidden()]);
				if (dt.page.info().recordsDisplay === 0) Dom$1.s(dt.table().body()).find("td").eq(0).attr("colspan", visible);
			}
			that._controlClass();
		}
		/**
		* Determine the width of each column in the table so the auto column hiding
		* has that information to work with. This method is never going to be 100%
		* perfect since column widths can change slightly per page, but without
		* seriously compromising performance this is quite effective.
		*/
		_resizeAuto() {
			var dt = this.s.dt;
			var columns = this.s.columns;
			var that = this;
			var visibleColumns = dt.columns().indexes().filter(function(idx) {
				return dt.column(idx).visible();
			});
			if (!this.c.auto) return;
			if (!columns.map((c) => c.auto).includes(true)) return;
			var clonedTable = dt.table().node().cloneNode(false);
			var clonedHeader = Dom$1.s(dt.table().header().cloneNode(false)).appendTo(clonedTable);
			var clonedFooter = Dom$1.s(dt.table().footer().cloneNode(false)).appendTo(clonedTable);
			var clonedBody = Dom$1.s(dt.table().body()).clone(true).empty().appendTo(clonedTable);
			clonedTable.style.width = "auto";
			dt.table().header.structure(visibleColumns).forEach((row) => {
				var cells = row.filter(function(el) {
					return el ? true : false;
				}).map(function(el) {
					return Dom$1.s(el.cell).clone(true).css("display", "table-cell").css("width", "auto").css("min-width", "0").get(0);
				});
				Dom$1.c("tr").append(cells).appendTo(clonedHeader);
			});
			var emptyRow = Dom$1.c("tr").appendTo(clonedBody);
			for (var i = 0; i < visibleColumns.count(); i++) emptyRow.append(Dom$1.c("td"));
			let renderer = this.s.details.renderer;
			if (typeof renderer === "function" && renderer._responsiveMovesNodes) dt.rows({ page: "current" }).every(function(rowIdx) {
				var node = this.node();
				if (!node) return;
				var tr = node.cloneNode(false);
				dt.cells(rowIdx, visibleColumns).every(function(rowIdx2, colIdx) {
					var store = that.s.childNodeStore[rowIdx + "-" + colIdx];
					if (store) Dom$1.s(this.node().cloneNode(false)).append(Dom$1.s(store).clone(true)).appendTo(tr);
					else Dom$1.s(this.node()).clone(true).appendTo(tr);
				});
				clonedBody.append(tr);
			});
			else clonedBody.append(dt.rows({ page: "current" }).nodes().toDom().clone(true)).find("th, td").css("display", "");
			clonedBody.find("th, td").css("display", "");
			dt.table().footer.structure(visibleColumns).forEach((row) => {
				var cells = row.filter(function(el) {
					return el ? true : false;
				}).map(function(el) {
					return Dom$1.s(el.cell).clone(false).css("display", "table-cell").css("width", "auto").css("min-width", "0").get(0);
				});
				Dom$1.c("tr").append(cells).appendTo(clonedFooter);
			});
			if (this.s.details.type === "inline") Dom$1.s(clonedTable).classAdd("dtr-inline collapsed");
			Dom$1.s(clonedTable).find("[name]").attrRemove("name");
			Dom$1.s(clonedTable).css("position", "relative");
			var inserted = Dom$1.c("div").css({
				width: "1px",
				height: "1px",
				overflow: "hidden",
				clear: "both"
			}).append(clonedTable);
			inserted.insertBefore(dt.table().node());
			emptyRow.children().each(function(el, i) {
				var idx = dt.column.index("fromVisible", i);
				if (idx !== null) columns[idx].minWidth = el.offsetWidth || 0;
			});
			inserted.remove();
		}
		/**
		* Get the state of the current hidden columns - controlled by Responsive
		* only
		*/
		_responsiveOnlyHidden() {
			var dt = this.s.dt;
			return this.s.current.map(function(v, i) {
				if (dt.column(i).visible() === false) return true;
				return v;
			});
		}
		/**
		* Set a column's visibility.
		*
		* We don't use DataTables' column visibility controls in order to ensure
		* that column visibility can Responsive can no-exist. Since only IE8+ is
		* supported (and all evergreen browsers of course) the control of the
		* display attribute works well.
		*
		* @param col      Column index
		* @param showHide Show or hide (true or false)
		*/
		_setColumnVis(col, showHide) {
			var that = this;
			var dt = this.s.dt;
			var display = showHide ? "" : "none";
			this._setHeaderVis(col, showHide, dt.table().header.structure());
			this._setHeaderVis(col, showHide, dt.table().footer.structure());
			dt.column(col).nodes().toDom().css("display", display).classToggle("dtr-hidden", !showHide);
			dt.settings()[0].columns[col].responsiveVisible = showHide;
			if (Object.keys(this.s.childNodeStore).length !== 0) dt.cells(null, col).indexes().each(function(idx) {
				that._childNodesRestore(dt, idx.row, idx.column);
			});
		}
		/**
		* Set a column's visibility, taking into account multiple rows
		* in a header / footer and colspan attributes
		* @param col
		* @param showHide
		* @param structure
		*/
		_setHeaderVis(col, showHide, structure) {
			var that = this;
			var display = showHide ? "" : "none";
			structure.forEach(function(row, rowIdx) {
				for (var col = 0; col < row.length; col++) if (row[col] && row[col].rowspan > 1) {
					var span = row[col].rowspan;
					for (var i = 1; i < span; i++) structure[rowIdx + i][col] = {};
				}
			});
			structure.forEach(function(row) {
				if (row[col] && row[col].cell) Dom$1.s(row[col].cell).css("display", display).classToggle("dtr-hidden", !showHide);
				else {
					var search = col;
					while (search >= 0) {
						if (row[search] && row[search].cell) {
							Dom$1.s(row[search].cell).attr("colSpan", that._colspan(row, search));
							break;
						}
						search--;
					}
				}
			});
		}
		/**
		* How many columns should this cell span
		*
		* @param row Header structure row
		* @param idx The column index of the cell to span
		*/
		_colspan(row, idx) {
			var colspan = 1;
			for (var col = idx + 1; col < row.length; col++) if (row[col] === null && this.s.current[col]) colspan++;
			else if (row[col]) break;
			return colspan;
		}
		/**
		* Update the cell tab indexes for keyboard accessibility. This is called on
		* every table draw - that is potentially inefficient, but also the least
		* complex option given that column visibility can change on the fly. Its a
		* shame user-focus was removed from CSS 3 UI, as it would have solved this
		* issue with a single CSS statement.
		*/
		_tabIndexes() {
			var dt = this.s.dt;
			var cells = dt.cells({ page: "current" }).nodes().toDom();
			var ctx = dt.settings()[0];
			var target = this.s.details.target;
			cells.filter("[data-dtr-keyboard]").attrRemove("data-dtr-keyboard");
			if (typeof target === "number") dt.cells(null, target, { page: "current" }).nodes().toDom().attr("tabIndex", ctx.tabIndex).data("dtrKeyboard", 1);
			else if (target) {
				if (target === "td:first-child, th:first-child") target = ">td:first-child, >th:first-child";
				var rows = dt.rows({ page: "current" }).nodes().toDom();
				(target === "tr" ? rows : rows.find(target)).attr("tabIndex", ctx.tabIndex).data("dtrKeyboard", 1);
			}
		}
	};
	Responsive.breakpoints = [
		{
			name: "desktop",
			width: Infinity
		},
		{
			name: "tablet-l",
			width: 1024
		},
		{
			name: "tablet-p",
			width: 768
		},
		{
			name: "mobile-l",
			width: 480
		},
		{
			name: "mobile-p",
			width: 320
		}
	];
	Responsive.defaults = {
		breakpoints: Responsive.breakpoints,
		auto: true,
		details: {
			display: childRow,
			renderer: listHidden(),
			target: 0,
			type: "inline"
		},
		orthogonal: "display"
	};
	Responsive.display = {
		childRow,
		childRowImmediate,
		modal: modal$1
	};
	Responsive.renderer = {
		listHidden,
		listHiddenNodes,
		tableAll
	};
	Responsive.version = "4.0.3";
	Api.register("responsive()", function() {
		return this.inst(this.context);
	});
	Api.register("responsive.index()", function(li) {
		li = Dom$1.s(li);
		return {
			column: li.data("dtr-index"),
			row: li.parent().data("dtr-index")
		};
	});
	Api.register("responsive.rebuild()", function() {
		return this.iterator("table", function(ctx) {
			if (ctx._responsive) ctx._responsive._classLogic();
		});
	});
	Api.register("responsive.recalc()", function() {
		return this.iterator("table", function(ctx) {
			if (ctx._responsive) {
				ctx._responsive._resizeAuto();
				ctx._responsive._resize();
			}
		});
	});
	Api.register("responsive.hasHidden()", function() {
		var ctx = this.context[0];
		return ctx._responsive ? ctx._responsive._responsiveOnlyHidden().includes(false) : false;
	});
	Api.registerPlural("columns().responsiveHidden()", "column().responsiveHidden()", function() {
		return this.iterator("column", function(settings, column) {
			return settings._responsive ? settings._responsive._responsiveOnlyHidden()[column] : false;
		}, true);
	});
	DataTable.Responsive = Responsive;
	Dom$1.s(document).on("preInit.dt.dtr", function(e, settings, json) {
		if (e.namespace !== "dt") return;
		if (Dom$1.s(settings.table).classHas("responsive") || Dom$1.s(settings.table).classHas("dt-responsive") || settings.init.responsive || DataTable.defaults.responsive) {
			var init = settings.init.responsive;
			if (init !== false) new Responsive(settings, util.is.plainObject(init) ? init : {});
		}
	});
	//#endregion
	//#region node_modules/datatables.net-responsive-bs5/js/responsive.bootstrap5.mjs
	/*! Responsive Bootstrap 5 styling 4.0.3 for DataTables
	* Copyright (c) SpryMedia Ltd - datatables.net/license
	*/
	var Dom = dataTables_bootstrap5_default.Dom;
	var _display = dataTables_bootstrap5_default.Responsive.display;
	var _original = _display.modal;
	var _modal = Dom.c("div").classAdd("modal fade dtr-bs-modal").attr("role", "dialog").append(Dom.c("div").classAdd("modal-dialog").attr("role", "document").append(Dom.c("div").classAdd("modal-content").append(Dom.c("div").classAdd("modal-header").append(Dom.c("button").attr("type", "button").attr("data-bs-dismiss", "modal").attr("aria-label", "Close").classAdd("btn-close"))).append(Dom.c("div").classAdd("modal-body")))).append(Dom.c("div").classAdd("content"));
	var modal;
	var _bs = window.bootstrap;
	dataTables_bootstrap5_default.Responsive.bootstrap = function(bs) {
		_bs = bs;
	};
	function getBs() {
		let dtBs = dataTables_bootstrap5_default.use("bootstrap");
		if (dtBs) return dtBs;
		if (_bs) return _bs;
		throw new Error("No Bootstrap library. Set it with `DataTable.use(bootstrap);`");
	}
	_display.modal = function(options) {
		if (!modal && _bs.Modal) modal = new (getBs()).Modal(_modal.get(0));
		return function(row, update, render, closeCallback) {
			if (!modal) return _original(row, update, render, closeCallback);
			else {
				var rendered = render();
				if (rendered === false) return false;
				if (!update) {
					if (options && options.header) {
						var header = _modal.find("div.modal-header");
						var button = header.find("button").detach();
						header.empty().append(Dom.c("h4").classAdd("modal-title").html(options.header(row))).append(button);
					}
					_modal.find("div.modal-body").empty().append(rendered);
					_modal.attr("data-dtr-index", row.index()).appendTo("body");
					_modal.get(0).addEventListener("hidden.bs.modal", closeCallback, { once: true });
					modal.show();
				} else if (_modal.isAttached() && row.index() === _modal.attr("data-dtr-index")) _modal.find("div.modal-body").empty().append(rendered);
				else return null;
				return true;
			}
		};
	};
	//#endregion
	//#region resources/js/themes/adminlte/features/table/datatables.js
	var DATATABLES_PRESENTATION_ID = "adminlte.bootstrap5";
	function createLegacyDataTableEngine(element, options) {
		return new dataTables_bootstrap5_default(element, options);
	}
	function legacyDataTableEngineRuntime() {
		return dataTables_bootstrap5_default;
	}
	//#endregion
	//#region resources/js/themes/adminlte/features/table/browser.js
	if (globalThis.document) installLegacyDataTablesAdapter(globalThis);
	function installLegacyDataTablesAdapter(target) {
		const admin = target.Admin;
		if (!(admin === null || admin === void 0 ? void 0 : admin.Components)) throw new TypeError("The AdminLTE DataTables adapter requires the admin runtime.");
		admin.TablePresentation = Object.freeze({
			createEngine: createLegacyDataTableEngine,
			engine: legacyDataTableEngineRuntime(),
			id: DATATABLES_PRESENTATION_ID
		});
		return admin.TablePresentation;
	}
	//#endregion
	//#region resources/js/themes/adminlte/features/tree/notifications.js
	function createLegacyTreeNotifications(swal, messages, labels) {
		assertDependencies(swal, messages);
		const toast = swal.mixin({
			didOpen: bindToastPause(swal),
			position: "top-end",
			showConfirmButton: false,
			timer: 3e3,
			timerProgressBar: true,
			toast: true
		});
		return {
			error: () => messages.error(labels.error),
			success: () => toast.fire({
				icon: "success",
				title: labels.success
			})
		};
	}
	function bindToastPause(swal) {
		return (toast) => {
			toast.addEventListener("mouseenter", swal.stopTimer);
			toast.addEventListener("mouseleave", swal.resumeTimer);
		};
	}
	function assertDependencies(swal, messages) {
		if (typeof (swal === null || swal === void 0 ? void 0 : swal.mixin) !== "function" || typeof (messages === null || messages === void 0 ? void 0 : messages.error) !== "function") throw new TypeError("Legacy tree notifications require SweetAlert and Admin.Messages.");
	}
	//#endregion
	//#region resources/js/themes/adminlte/features/tree/browser.js
	if (globalThis.document) installLegacyTreeNotifications(globalThis);
	function installLegacyTreeNotifications(target) {
		var _target$Admin;
		const root = requireEventTarget(target.document);
		const notifications = createLegacyTreeNotifications(target.Swal, (_target$Admin = target.Admin) === null || _target$Admin === void 0 ? void 0 : _target$Admin.Messages, notificationLabels(target.trans));
		const onChanged = () => notifications.success();
		const onFailed = (event) => {
			var _event$detail;
			return notifications.error((_event$detail = event.detail) === null || _event$detail === void 0 ? void 0 : _event$detail.error);
		};
		root.addEventListener("tree:changed", onChanged);
		root.addEventListener("tree:failed", onFailed);
		return { destroy: () => removeListeners(root, {
			onChanged,
			onFailed
		}) };
	}
	function notificationLabels(translate) {
		return {
			error: translated(translate, "lang.table.error", "Unable to save tree"),
			success: translated(translate, "lang.tree.reorderCompleted", "Tree order saved")
		};
	}
	function translated(translate, key, fallback) {
		if (typeof translate !== "function") return fallback;
		const value = translate(key);
		return typeof value === "string" && value !== key ? value : fallback;
	}
	function removeListeners(root, listeners) {
		root.removeEventListener("tree:changed", listeners.onChanged);
		root.removeEventListener("tree:failed", listeners.onFailed);
	}
	function requireEventTarget(root) {
		if (typeof (root === null || root === void 0 ? void 0 : root.addEventListener) !== "function" || typeof (root === null || root === void 0 ? void 0 : root.removeEventListener) !== "function") throw new TypeError("Legacy tree notifications require a document event target.");
		return root;
	}
	//#endregion
})();

//# sourceMappingURL=adminlte.js.map