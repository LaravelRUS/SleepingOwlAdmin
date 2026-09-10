(function() {
	//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	//#endregion
	//#region node_modules/axios/lib/helpers/bind.js
	/**
	* Create a bound version of a function with a specified `this` context
	*
	* @param {Function} fn - The function to bind
	* @param {*} thisArg - The value to be passed as the `this` parameter
	* @returns {Function} A new function that will call the original function with the specified `this` context
	*/
	function bind(fn, thisArg) {
		return function wrap() {
			return fn.apply(thisArg, arguments);
		};
	}
	//#endregion
	//#region node_modules/axios/lib/utils.js
	var { toString } = Object.prototype;
	var { getPrototypeOf } = Object;
	var { iterator, toStringTag } = Symbol;
	var hasOwnProperty = (({ hasOwnProperty }) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);
	var isUnsafeObjectKey = (prop) => typeof prop === "string" && (prop === "__proto__" || prop === "constructor" || prop === "prototype");
	/**
	* Determine whether an inherited object must be treated as a shared-prototype
	* boundary. Cross-realm Object.prototype objects cannot be distinguished
	* reliably from application-created null-prototype objects because their
	* properties are mutable, so all inherited terminal prototypes are excluded
	* as a fail-closed boundary. A null-prototype source still keeps its own
	* properties, as produced by mergeConfig and other safe materialization paths.
	*
	* @param {*} obj The object to inspect
	* @param {*} prototype The object's prototype
	* @param {boolean} source Whether obj is the original traversal source
	*
	* @returns {boolean} True when obj is a safe prototype traversal boundary
	*/
	var isPrototypeBoundary = (obj, prototype, source) => obj === Object.prototype || !source && prototype === null;
	/**
	* Determine whether an object can retain its identity through code paths that
	* add, replace, and remove config properties without bypassing unsafe-key
	* filtering. Immutable objects, unsafe-key-bearing objects, and objects with
	* accessor or restricted data properties must be materialized instead.
	*
	* @param {*} obj The object to inspect
	*
	* @returns {boolean} True when every own property is safe and fully mutable
	*/
	var isSafeAndFullyMutable = (obj) => {
		if (!Object.isExtensible(obj)) return false;
		const props = Object.getOwnPropertyNames(obj);
		if (Object.getOwnPropertySymbols) props.push(...Object.getOwnPropertySymbols(obj));
		return props.every((prop) => {
			if (isUnsafeObjectKey(prop)) return false;
			const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
			return !!descriptor && descriptor.configurable && descriptor.writable === true;
		});
	};
	/**
	* Walk the prototype chain (excluding the source realm's Object.prototype)
	* looking for an own `prop`. This distinguishes genuine own/inherited members
	* — including class accessors and template prototypes — from members injected
	* via Object.prototype pollution (e.g. `Object.prototype.username = '...'`),
	* which live on Object.prototype itself and are therefore never matched.
	*
	* @param {*} thing The value whose chain to inspect
	* @param {string|symbol} prop The property key to look for
	*
	* @returns {boolean} True when `prop` is owned below Object.prototype
	*/
	var hasOwnInPrototypeChain = (thing, prop) => {
		let obj = thing;
		const seen = [];
		while (obj != null) {
			if (seen.indexOf(obj) !== -1) return false;
			seen.push(obj);
			const prototype = getPrototypeOf(obj);
			if (isPrototypeBoundary(obj, prototype, obj === thing)) return false;
			if (hasOwnProperty(obj, prop)) return true;
			obj = prototype;
		}
		return false;
	};
	/**
	* Read `obj[prop]` only when it is safe from Object.prototype pollution. Own
	* properties and members inherited from a non-Object.prototype source (a class
	* instance or template object) are honored; a value reachable only through a
	* polluted Object.prototype is ignored and `undefined` is returned.
	*
	* @param {*} obj The source object
	* @param {string|symbol} prop The property key to read
	*
	* @returns {*} The resolved value, or undefined when unsafe/absent
	*/
	var getSafeProp = (obj, prop) => obj != null && hasOwnInPrototypeChain(obj, prop) ? obj[prop] : void 0;
	/**
	* Flatten an object and its application-defined prototype chain into a
	* null-prototype object. Members inherited only from the source realm's
	* Object.prototype are deliberately excluded, while class/template members
	* below that boundary are preserved.
	*
	* @param {*} thing The value to flatten
	*
	* @returns {*} A null-prototype copy, or the original value when it is already
	* structurally safe or is not an object
	*/
	var toSafeFlatObject = (thing) => {
		if (thing == null || typeof thing !== "object" && typeof thing !== "function") return thing;
		const sourcePrototype = getPrototypeOf(thing);
		if (sourcePrototype === null && isSafeAndFullyMutable(thing)) return thing;
		const result = Object.create(null);
		const merged = Object.create(null);
		const seen = [];
		let current = thing;
		while (current != null) {
			if (seen.indexOf(current) !== -1) break;
			seen.push(current);
			const prototype = current === thing ? sourcePrototype : getPrototypeOf(current);
			if (isPrototypeBoundary(current, prototype, current === thing)) break;
			const props = Object.getOwnPropertyNames(current);
			if (Object.getOwnPropertySymbols) props.push(...Object.getOwnPropertySymbols(current));
			for (const prop of props) {
				if (isUnsafeObjectKey(prop)) continue;
				if (!hasOwnProperty(merged, prop)) {
					result[prop] = thing[prop];
					merged[prop] = true;
				}
			}
			current = prototype;
		}
		return result;
	};
	var kindOf = ((cache) => (thing) => {
		const str = toString.call(thing);
		return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
	})(Object.create(null));
	var kindOfTest = (type) => {
		type = type.toLowerCase();
		return (thing) => kindOf(thing) === type;
	};
	var typeOfTest = (type) => (thing) => typeof thing === type;
	/**
	* Determine if a value is a non-null object
	*
	* @param {Object} val The value to test
	*
	* @returns {boolean} True if value is an Array, otherwise false
	*/
	var { isArray } = Array;
	/**
	* Determine if a value is undefined
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if the value is undefined, otherwise false
	*/
	var isUndefined = typeOfTest("undefined");
	/**
	* Determine if a value is a Buffer
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a Buffer, otherwise false
	*/
	function isBuffer(val) {
		return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
	}
	/**
	* Determine if a value is an ArrayBuffer
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is an ArrayBuffer, otherwise false
	*/
	var isArrayBuffer = kindOfTest("ArrayBuffer");
	/**
	* Determine if a value is a view on an ArrayBuffer
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	*/
	function isArrayBufferView(val) {
		let result;
		if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) result = ArrayBuffer.isView(val);
		else result = val && val.buffer && isArrayBuffer(val.buffer);
		return result;
	}
	/**
	* Determine if a value is a String
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a String, otherwise false
	*/
	var isString = typeOfTest("string");
	/**
	* Determine if a value is a Function
	*
	* @param {*} val The value to test
	* @returns {boolean} True if value is a Function, otherwise false
	*/
	var isFunction$1 = typeOfTest("function");
	/**
	* Determine if a value is a Number
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a Number, otherwise false
	*/
	var isNumber = typeOfTest("number");
	/**
	* Determine if a value is an Object
	*
	* @param {*} thing The value to test
	*
	* @returns {boolean} True if value is an Object, otherwise false
	*/
	var isObject = (thing) => thing !== null && typeof thing === "object";
	/**
	* Determine if a value is a Boolean
	*
	* @param {*} thing The value to test
	* @returns {boolean} True if value is a Boolean, otherwise false
	*/
	var isBoolean = (thing) => thing === true || thing === false;
	/**
	* Determine if a value is a plain Object
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a plain Object, otherwise false
	*/
	var isPlainObject = (val) => {
		if (!isObject(val)) return false;
		const prototype = getPrototypeOf(val);
		return (prototype === null || prototype === Object.prototype || getPrototypeOf(prototype) === null) && !hasOwnInPrototypeChain(val, toStringTag) && !hasOwnInPrototypeChain(val, iterator);
	};
	/**
	* Determine if a value is an empty object (safely handles Buffers)
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is an empty object, otherwise false
	*/
	var isEmptyObject = (val) => {
		if (!isObject(val) || isBuffer(val)) return false;
		try {
			return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
		} catch (e) {
			return false;
		}
	};
	/**
	* Determine if a value is a Date
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a Date, otherwise false
	*/
	var isDate = kindOfTest("Date");
	/**
	* Determine if a value is a File
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a File, otherwise false
	*/
	var isFile = kindOfTest("File");
	/**
	* Determine if a value is a React Native Blob
	* React Native "blob": an object with a `uri` attribute. Optionally, it can
	* also have a `name` and `type` attribute to specify filename and content type
	*
	* @see https://github.com/facebook/react-native/blob/26684cf3adf4094eb6c405d345a75bf8c7c0bf88/Libraries/Network/FormData.js#L68-L71
	*
	* @param {*} value The value to test
	*
	* @returns {boolean} True if value is a React Native Blob, otherwise false
	*/
	var isReactNativeBlob = (value) => {
		return !!(value && typeof value.uri !== "undefined");
	};
	/**
	* Determine if environment is React Native
	* ReactNative `FormData` has a non-standard `getParts()` method
	*
	* @param {*} formData The formData to test
	*
	* @returns {boolean} True if environment is React Native, otherwise false
	*/
	var isReactNative = (formData) => formData && typeof formData.getParts !== "undefined";
	/**
	* Determine if a value is a Blob
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a Blob, otherwise false
	*/
	var isBlob = kindOfTest("Blob");
	/**
	* Determine if a value is a FileList
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a FileList, otherwise false
	*/
	var isFileList = kindOfTest("FileList");
	var isSet = kindOfTest("Set");
	/**
	* Determine if a value is a Stream
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a Stream, otherwise false
	*/
	var isStream = (val) => isObject(val) && isFunction$1(val.pipe);
	/**
	* Determine if a value is a FormData
	*
	* @param {*} thing The value to test
	*
	* @returns {boolean} True if value is an FormData, otherwise false
	*/
	function getGlobal() {
		if (typeof globalThis !== "undefined") return globalThis;
		if (typeof self !== "undefined") return self;
		if (typeof window !== "undefined") return window;
		if (typeof globalThis !== "undefined") return globalThis;
		return {};
	}
	var G = getGlobal();
	var FormDataCtor = typeof G.FormData !== "undefined" ? G.FormData : void 0;
	var isFormData = (thing) => {
		if (!thing) return false;
		if (FormDataCtor && thing instanceof FormDataCtor) return true;
		const proto = getPrototypeOf(thing);
		if (!proto || proto === Object.prototype) return false;
		if (!isFunction$1(thing.append)) return false;
		const kind = kindOf(thing);
		return kind === "formdata" || kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]";
	};
	/**
	* Determine if a value is a URLSearchParams object
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a URLSearchParams object, otherwise false
	*/
	var isURLSearchParams = kindOfTest("URLSearchParams");
	var [isReadableStream, isRequest, isResponse, isHeaders] = [
		"ReadableStream",
		"Request",
		"Response",
		"Headers"
	].map(kindOfTest);
	/**
	* Trim excess whitespace off the beginning and end of a string
	*
	* @param {String} str The String to trim
	*
	* @returns {String} The String freed of excess whitespace
	*/
	var trim = (str) => {
		return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
	};
	/**
	* Iterate over an Array or an Object invoking a function for each item.
	*
	* If `obj` is an Array callback will be called passing
	* the value, index, and complete array for each item.
	*
	* If 'obj' is an Object callback will be called passing
	* the value, key, and complete object for each property.
	*
	* @param {Object|Array<unknown>} obj The object to iterate
	* @param {Function} fn The callback to invoke for each item
	*
	* @param {Object} [options]
	* @param {Boolean} [options.allOwnKeys = false]
	* @returns {any}
	*/
	function forEach(obj, fn, { allOwnKeys = false } = {}) {
		if (obj === null || typeof obj === "undefined") return;
		let i;
		let l;
		if (typeof obj !== "object") obj = [obj];
		if (isArray(obj)) for (i = 0, l = obj.length; i < l; i++) fn.call(null, obj[i], i, obj);
		else {
			if (isBuffer(obj)) return;
			const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
			const len = keys.length;
			let key;
			for (i = 0; i < len; i++) {
				key = keys[i];
				fn.call(null, obj[key], key, obj);
			}
		}
	}
	/**
	* Finds a key in an object, case-insensitive, returning the actual key name.
	* Returns null if the object is a Buffer or if no match is found.
	*
	* @param {Object} obj - The object to search.
	* @param {string} key - The key to find (case-insensitive).
	* @returns {?string} The actual key name if found, otherwise null.
	*/
	function findKey(obj, key) {
		if (isBuffer(obj)) return null;
		key = key.toLowerCase();
		const keys = Object.keys(obj);
		let i = keys.length;
		let _key;
		while (i-- > 0) {
			_key = keys[i];
			if (key === _key.toLowerCase()) return _key;
		}
		return null;
	}
	var _global = (() => {
		if (typeof globalThis !== "undefined") return globalThis;
		return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : globalThis;
	})();
	var isContextDefined = (context) => !isUndefined(context) && context !== _global;
	/**
	* Accepts varargs expecting each argument to be an object, then
	* immutably merges the properties of each object and returns result.
	*
	* When multiple objects contain the same key the later object in
	* the arguments list will take precedence.
	*
	* Example:
	*
	* ```js
	* const result = merge({foo: 123}, {foo: 456});
	* console.log(result.foo); // outputs 456
	* ```
	*
	* @param {Object} obj1 Object to merge
	*
	* @returns {Object} Result of all merge properties
	*/
	function merge(...objs) {
		const { caseless, skipUndefined } = isContextDefined(this) && this || {};
		const result = {};
		const assignValue = (val, key) => {
			if (key === "__proto__" || key === "constructor" || key === "prototype") return;
			const targetKey = caseless && typeof key === "string" && findKey(result, key) || key;
			const existing = hasOwnProperty(result, targetKey) ? result[targetKey] : void 0;
			if (isPlainObject(existing) && isPlainObject(val)) result[targetKey] = merge(existing, val);
			else if (isPlainObject(val)) result[targetKey] = merge({}, val);
			else if (isArray(val)) result[targetKey] = val.slice();
			else if (!skipUndefined || !isUndefined(val)) result[targetKey] = val;
		};
		for (let i = 0, l = objs.length; i < l; i++) {
			const source = objs[i];
			if (!source || isBuffer(source)) continue;
			forEach(source, assignValue);
			if (typeof source !== "object" || isArray(source)) continue;
			const symbols = Object.getOwnPropertySymbols(source);
			for (let j = 0; j < symbols.length; j++) {
				const symbol = symbols[j];
				if (propertyIsEnumerable.call(source, symbol)) assignValue(source[symbol], symbol);
			}
		}
		return result;
	}
	/**
	* Extends object a by mutably adding to it the properties of object b.
	*
	* @param {Object} a The object to be extended
	* @param {Object} b The object to copy properties from
	* @param {Object} thisArg The object to bind function to
	*
	* @param {Object} [options]
	* @param {Boolean} [options.allOwnKeys]
	* @returns {Object} The resulting value of object a
	*/
	var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
		forEach(b, (val, key) => {
			if (thisArg && isFunction$1(val)) Object.defineProperty(a, key, {
				__proto__: null,
				value: bind(val, thisArg),
				writable: true,
				enumerable: true,
				configurable: true
			});
			else Object.defineProperty(a, key, {
				__proto__: null,
				value: val,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}, { allOwnKeys });
		return a;
	};
	/**
	* Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
	*
	* @param {string} content with BOM
	*
	* @returns {string} content value without BOM
	*/
	var stripBOM = (content) => {
		if (content.charCodeAt(0) === 65279) content = content.slice(1);
		return content;
	};
	/**
	* Inherit the prototype methods from one constructor into another
	* @param {function} constructor
	* @param {function} superConstructor
	* @param {object} [props]
	* @param {object} [descriptors]
	*
	* @returns {void}
	*/
	var inherits = (constructor, superConstructor, props, descriptors) => {
		constructor.prototype = Object.create(superConstructor.prototype, descriptors);
		Object.defineProperty(constructor.prototype, "constructor", {
			__proto__: null,
			value: constructor,
			writable: true,
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(constructor, "super", {
			__proto__: null,
			value: superConstructor.prototype
		});
		props && Object.assign(constructor.prototype, props);
	};
	/**
	* Resolve object with deep prototype chain to a flat object
	* @param {Object} sourceObj source object
	* @param {Object} [destObj]
	* @param {Function|Boolean} [filter]
	* @param {Function} [propFilter]
	*
	* @returns {Object}
	*/
	var toFlatObject = (sourceObj, destObj, filter, propFilter) => {
		let props;
		let i;
		let prop;
		const merged = {};
		destObj = destObj || {};
		if (sourceObj == null) return destObj;
		do {
			props = Object.getOwnPropertyNames(sourceObj);
			i = props.length;
			while (i-- > 0) {
				prop = props[i];
				if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
					destObj[prop] = sourceObj[prop];
					merged[prop] = true;
				}
			}
			sourceObj = filter !== false && getPrototypeOf(sourceObj);
		} while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
		return destObj;
	};
	/**
	* Determines whether a string ends with the characters of a specified string
	*
	* @param {String} str
	* @param {String} searchString
	* @param {Number} [position= 0]
	*
	* @returns {boolean}
	*/
	var endsWith = (str, searchString, position) => {
		str = String(str);
		if (position === void 0 || position > str.length) position = str.length;
		position -= searchString.length;
		const lastIndex = str.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};
	/**
	* Returns new array from array like object or null if failed
	*
	* @param {*} [thing]
	*
	* @returns {?Array}
	*/
	var toArray = (thing) => {
		if (!thing) return null;
		if (isArray(thing)) return thing;
		let i = thing.length;
		if (!isNumber(i)) return null;
		const arr = new Array(i);
		while (i-- > 0) arr[i] = thing[i];
		return arr;
	};
	/**
	* Checking if the Uint8Array exists and if it does, it returns a function that checks if the
	* thing passed in is an instance of Uint8Array
	*
	* @param {TypedArray}
	*
	* @returns {Array}
	*/
	var isTypedArray = ((TypedArray) => {
		return (thing) => {
			return TypedArray && thing instanceof TypedArray;
		};
	})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
	/**
	* For each entry in the object, call the function with the key and value.
	*
	* @param {Object<any, any>} obj - The object to iterate over.
	* @param {Function} fn - The function to call for each entry.
	*
	* @returns {void}
	*/
	var forEachEntry = (obj, fn) => {
		const _iterator = (obj && obj[iterator]).call(obj);
		let result;
		while ((result = _iterator.next()) && !result.done) {
			const pair = result.value;
			fn.call(obj, pair[0], pair[1]);
		}
	};
	/**
	* It takes a regular expression and a string, and returns an array of all the matches
	*
	* @param {string} regExp - The regular expression to match against.
	* @param {string} str - The string to search.
	*
	* @returns {Array<boolean>}
	*/
	var matchAll = (regExp, str) => {
		let matches;
		const arr = [];
		while ((matches = regExp.exec(str)) !== null) arr.push(matches);
		return arr;
	};
	var isHTMLForm = kindOfTest("HTMLFormElement");
	var toCamelCase = (str) => {
		return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
			return p1.toUpperCase() + p2;
		});
	};
	var { propertyIsEnumerable } = Object.prototype;
	/**
	* Determine if a value is a RegExp object
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a RegExp object, otherwise false
	*/
	var isRegExp = kindOfTest("RegExp");
	var reduceDescriptors = (obj, reducer) => {
		const descriptors = Object.getOwnPropertyDescriptors(obj);
		const reducedDescriptors = {};
		forEach(descriptors, (descriptor, name) => {
			let ret;
			if ((ret = reducer(descriptor, name, obj)) !== false) reducedDescriptors[name] = ret || descriptor;
		});
		Object.defineProperties(obj, reducedDescriptors);
	};
	/**
	* Makes all methods read-only
	* @param {Object} obj
	*/
	var freezeMethods = (obj) => {
		reduceDescriptors(obj, (descriptor, name) => {
			if (isFunction$1(obj) && [
				"arguments",
				"caller",
				"callee"
			].includes(name)) return false;
			const value = obj[name];
			if (!isFunction$1(value)) return;
			descriptor.enumerable = false;
			if ("writable" in descriptor) {
				descriptor.writable = false;
				return;
			}
			if (!descriptor.set) descriptor.set = () => {
				throw Error("Can not rewrite read-only method '" + name + "'");
			};
		});
	};
	/**
	* Converts an array or a delimited string into an object set with values as keys and true as values.
	* Useful for fast membership checks.
	*
	* @param {Array|string} arrayOrString - The array or string to convert.
	* @param {string} delimiter - The delimiter to use if input is a string.
	* @returns {Object} An object with keys from the array or string, values set to true.
	*/
	var toObjectSet = (arrayOrString, delimiter) => {
		const obj = {};
		const define = (arr) => {
			arr.forEach((value) => {
				obj[value] = true;
			});
		};
		isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
		return obj;
	};
	var noop = () => {};
	var toFiniteNumber = (value, defaultValue) => {
		return value != null && Number.isFinite(value = +value) ? value : defaultValue;
	};
	/**
	* If the thing is a FormData object, return true, otherwise return false.
	*
	* @param {unknown} thing - The thing to check.
	*
	* @returns {boolean}
	*/
	function isSpecCompliantForm(thing) {
		return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
	}
	/**
	* Recursively converts an object to a JSON-compatible object, handling circular references and Buffers.
	*
	* @param {Object} obj - The object to convert.
	* @returns {Object} The JSON-compatible object.
	*/
	var toJSONObject = (obj) => {
		const visited = /* @__PURE__ */ new WeakSet();
		const visit = (source) => {
			if (isObject(source)) {
				if (visited.has(source)) return;
				if (isBuffer(source)) return source;
				if (!("toJSON" in source)) {
					visited.add(source);
					let target;
					if (isSet(source)) {
						target = [];
						for (const value of source) {
							const reducedValue = visit(value);
							!isUndefined(reducedValue) && target.push(reducedValue);
						}
					} else {
						target = isArray(source) ? [] : {};
						forEach(source, (value, key) => {
							const reducedValue = visit(value);
							!isUndefined(reducedValue) && (target[key] = reducedValue);
						});
					}
					visited.delete(source);
					return target;
				}
			}
			return source;
		};
		return visit(obj);
	};
	/**
	* Determines if a value is an async function.
	*
	* @param {*} thing - The value to test.
	* @returns {boolean} True if value is an async function, otherwise false.
	*/
	var isAsyncFn = kindOfTest("AsyncFunction");
	/**
	* Determines if a value is thenable (has then and catch methods).
	*
	* @param {*} thing - The value to test.
	* @returns {boolean} True if value is thenable, otherwise false.
	*/
	var isThenable = (thing) => thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
	/**
	* Provides a cross-platform setImmediate implementation.
	* Uses native setImmediate if available, otherwise falls back to postMessage or setTimeout.
	*
	* @param {boolean} setImmediateSupported - Whether setImmediate is supported.
	* @param {boolean} postMessageSupported - Whether postMessage is supported.
	* @returns {Function} A function to schedule a callback asynchronously.
	*/
	var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
		if (setImmediateSupported) return setImmediate;
		return postMessageSupported ? ((token, callbacks) => {
			_global.addEventListener("message", ({ source, data }) => {
				if (source === _global && data === token) callbacks.length && callbacks.shift()();
			}, false);
			return (cb) => {
				callbacks.push(cb);
				_global.postMessage(token, "*");
			};
		})(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
	})(typeof setImmediate === "function", isFunction$1(_global.postMessage));
	/**
	* Schedules a microtask or asynchronous callback as soon as possible.
	* Uses queueMicrotask if available, otherwise falls back to process.nextTick or _setImmediate.
	*
	* @type {Function}
	*/
	var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
	var isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);
	/**
	* Determine if a value is iterable via an iterator that is NOT sourced solely
	* from a polluted Object.prototype. Use this instead of `isIterable` whenever
	* the iterable comes from untrusted input (e.g. user-supplied header sources),
	* so `Object.prototype[Symbol.iterator] = ...` cannot turn an ordinary object
	* into an attacker-controlled entries iterator.
	*
	* @param {*} thing The value to test
	*
	* @returns {boolean} True if value has a non-polluted iterator
	*/
	var isSafeIterable = (thing) => thing != null && hasOwnInPrototypeChain(thing, iterator) && isIterable(thing);
	var utils_default = {
		isArray,
		isArrayBuffer,
		isBuffer,
		isFormData,
		isArrayBufferView,
		isString,
		isNumber,
		isBoolean,
		isObject,
		isPlainObject,
		isEmptyObject,
		isReadableStream,
		isRequest,
		isResponse,
		isHeaders,
		isUndefined,
		isDate,
		isFile,
		isReactNativeBlob,
		isReactNative,
		isBlob,
		isRegExp,
		isFunction: isFunction$1,
		isStream,
		isURLSearchParams,
		isTypedArray,
		isFileList,
		forEach,
		merge,
		extend,
		trim,
		stripBOM,
		inherits,
		toFlatObject,
		kindOf,
		kindOfTest,
		endsWith,
		toArray,
		forEachEntry,
		matchAll,
		isHTMLForm,
		hasOwnProperty,
		hasOwnProp: hasOwnProperty,
		hasOwnInPrototypeChain,
		getSafeProp,
		toSafeFlatObject,
		reduceDescriptors,
		freezeMethods,
		toObjectSet,
		toCamelCase,
		noop,
		toFiniteNumber,
		findKey,
		global: _global,
		isContextDefined,
		isSpecCompliantForm,
		toJSONObject,
		isAsyncFn,
		isThenable,
		setImmediate: _setImmediate,
		asap,
		isIterable,
		isSafeIterable
	};
	//#endregion
	//#region node_modules/axios/lib/helpers/parseHeaders.js
	var ignoreDuplicateOf = utils_default.toObjectSet([
		"age",
		"authorization",
		"content-length",
		"content-type",
		"etag",
		"expires",
		"from",
		"host",
		"if-modified-since",
		"if-unmodified-since",
		"last-modified",
		"location",
		"max-forwards",
		"proxy-authorization",
		"referer",
		"retry-after",
		"user-agent"
	]);
	/**
	* Parse headers into an object
	*
	* ```
	* Date: Wed, 27 Aug 2014 08:58:49 GMT
	* Content-Type: application/json
	* Connection: keep-alive
	* Transfer-Encoding: chunked
	* ```
	*
	* @param {String} rawHeaders Headers needing to be parsed
	*
	* @returns {Object} Headers parsed into an object
	*/
	var parseHeaders_default = (rawHeaders) => {
		const parsed = {};
		let key;
		let val;
		let i;
		rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
			i = line.indexOf(":");
			key = line.substring(0, i).trim().toLowerCase();
			val = line.substring(i + 1).trim();
			const hasKey = utils_default.hasOwnProp(parsed, key);
			if (!key || hasKey && utils_default.hasOwnProp(ignoreDuplicateOf, key)) return;
			if (key === "set-cookie") {
				if (hasKey) parsed[key].push(val);
				else parsed[key] = [val];
			} else parsed[key] = hasKey ? parsed[key] + ", " + val : val;
		});
		return parsed;
	};
	//#endregion
	//#region node_modules/axios/lib/helpers/sanitizeHeaderValue.js
	function trimSPorHTAB(str) {
		let start = 0;
		let end = str.length;
		while (start < end) {
			const code = str.charCodeAt(start);
			if (code !== 9 && code !== 32) break;
			start += 1;
		}
		while (end > start) {
			const code = str.charCodeAt(end - 1);
			if (code !== 9 && code !== 32) break;
			end -= 1;
		}
		return start === 0 && end === str.length ? str : str.slice(start, end);
	}
	var INVALID_UNICODE_HEADER_VALUE_CHARS = /* @__PURE__ */ new RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g");
	var INVALID_BYTE_STRING_HEADER_VALUE_CHARS = /* @__PURE__ */ new RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
	function sanitizeValue(value, invalidChars) {
		if (utils_default.isArray(value)) return value.map((item) => sanitizeValue(item, invalidChars));
		return trimSPorHTAB(String(value).replace(invalidChars, ""));
	}
	var sanitizeHeaderValue = (value) => sanitizeValue(value, INVALID_UNICODE_HEADER_VALUE_CHARS);
	var sanitizeByteStringHeaderValue = (value) => sanitizeValue(value, INVALID_BYTE_STRING_HEADER_VALUE_CHARS);
	function toByteStringHeaderObject(headers) {
		const byteStringHeaders = Object.create(null);
		utils_default.forEach(headers.toJSON(), (value, header) => {
			byteStringHeaders[header] = sanitizeByteStringHeaderValue(value);
		});
		return byteStringHeaders;
	}
	//#endregion
	//#region node_modules/axios/lib/core/AxiosHeaders.js
	var $internals$1 = Symbol("internals");
	function normalizeHeader(header) {
		return header && String(header).trim().toLowerCase();
	}
	function normalizeValue(value) {
		if (value === false || value == null) return value;
		return utils_default.isArray(value) ? value.map(normalizeValue) : sanitizeHeaderValue(String(value));
	}
	function parseTokens(str) {
		const tokens = Object.create(null);
		const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
		let match;
		while (match = tokensRE.exec(str)) tokens[match[1]] = match[2];
		return tokens;
	}
	var parameterNameRE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
	function trimOWS(value) {
		let start = 0;
		let end = value.length;
		while (start < end) {
			const code = value.charCodeAt(start);
			if (code !== 9 && code !== 32) break;
			start += 1;
		}
		while (end > start) {
			const code = value.charCodeAt(end - 1);
			if (code !== 9 && code !== 32) break;
			end -= 1;
		}
		return start === 0 && end === value.length ? value : value.slice(start, end);
	}
	function decodeQuotedString(value) {
		const last = value.length - 1;
		if (last < 1 || value.charCodeAt(0) !== 34 || value.charCodeAt(last) !== 34) return value;
		let decoded = "";
		for (let i = 1; i < last; i++) {
			const code = value.charCodeAt(i);
			if (code === 34) return value;
			if (code === 92) {
				i += 1;
				if (i >= last) return value;
			}
			decoded += value[i];
		}
		return decoded;
	}
	function parseParameters(value) {
		const parameters = Object.create(null);
		const str = String(value);
		let start = 0;
		let quoted = false;
		let escaped = false;
		function parseParameter(end) {
			const part = trimOWS(str.slice(start, end));
			const equals = part.indexOf("=");
			if (equals < 1) return;
			const name = trimOWS(part.slice(0, equals));
			if (!parameterNameRE.test(name)) return;
			const normalizedName = name.toLowerCase();
			if (normalizedName === "__proto__" || normalizedName === "constructor" || normalizedName === "prototype") return;
			const parameterValue = trimOWS(part.slice(equals + 1));
			parameters[normalizedName] = decodeQuotedString(parameterValue);
		}
		for (let i = 0; i < str.length; i++) {
			const code = str.charCodeAt(i);
			if (quoted) {
				if (escaped) escaped = false;
				else if (code === 92) escaped = true;
				else if (code === 34) quoted = false;
			} else if (code === 34) quoted = true;
			else if (code === 44 || code === 59) {
				parseParameter(i);
				start = i + 1;
			}
		}
		parseParameter(str.length);
		return parameters;
	}
	var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
	function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
		if (utils_default.isFunction(filter)) return filter.call(this, value, header);
		if (isHeaderNameFilter) value = header;
		if (!utils_default.isString(value)) return;
		if (utils_default.isString(filter)) return value.indexOf(filter) !== -1;
		if (utils_default.isRegExp(filter)) return filter.test(value);
	}
	function formatHeader(header) {
		return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
			return char.toUpperCase() + str;
		});
	}
	function buildAccessors(obj, header) {
		const accessorName = utils_default.toCamelCase(" " + header);
		[
			"get",
			"set",
			"has"
		].forEach((methodName) => {
			Object.defineProperty(obj, methodName + accessorName, {
				__proto__: null,
				value: function(arg1, arg2, arg3) {
					return this[methodName].call(this, header, arg1, arg2, arg3);
				},
				configurable: true
			});
		});
	}
	var AxiosHeaders = class {
		constructor(headers) {
			headers && this.set(headers);
		}
		set(header, valueOrRewrite, rewrite) {
			const self = this;
			function setHeader(_value, _header, _rewrite) {
				const lHeader = normalizeHeader(_header);
				if (!lHeader) return;
				const key = utils_default.findKey(self, lHeader);
				if (!key || self[key] === void 0 || _rewrite === true || _rewrite === void 0 && self[key] !== false) self[key || _header] = normalizeValue(_value);
			}
			const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
			if (utils_default.isPlainObject(header) || header instanceof this.constructor) setHeaders(header, valueOrRewrite);
			else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) setHeaders(parseHeaders_default(header), valueOrRewrite);
			else if (utils_default.isObject(header) && utils_default.isSafeIterable(header)) {
				let obj = Object.create(null), dest, key;
				for (const entry of header) {
					if (!utils_default.isArray(entry)) throw new TypeError("Object iterator must return a key-value pair");
					key = entry[0];
					if (utils_default.hasOwnProp(obj, key)) {
						dest = obj[key];
						obj[key] = utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]];
					} else obj[key] = entry[1];
				}
				setHeaders(obj, valueOrRewrite);
			} else header != null && setHeader(valueOrRewrite, header, rewrite);
			return this;
		}
		get(header, parser) {
			header = normalizeHeader(header);
			if (header) {
				const key = utils_default.findKey(this, header);
				if (key) {
					const value = this[key];
					if (!parser) return value;
					if (parser === true) return parseTokens(value);
					if (utils_default.isFunction(parser)) return parser.call(this, value, key);
					if (utils_default.isRegExp(parser)) return parser.exec(value);
					throw new TypeError("parser must be boolean|regexp|function");
				}
			}
		}
		has(header, matcher) {
			header = normalizeHeader(header);
			if (header) {
				const key = utils_default.findKey(this, header);
				return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
			}
			return false;
		}
		delete(header, matcher) {
			const self = this;
			let deleted = false;
			function deleteHeader(_header) {
				_header = normalizeHeader(_header);
				if (_header) {
					const key = utils_default.findKey(self, _header);
					if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
						delete self[key];
						deleted = true;
					}
				}
			}
			if (utils_default.isArray(header)) header.forEach(deleteHeader);
			else deleteHeader(header);
			return deleted;
		}
		clear(matcher) {
			const keys = Object.keys(this);
			let i = keys.length;
			let deleted = false;
			while (i--) {
				const key = keys[i];
				if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
					delete this[key];
					deleted = true;
				}
			}
			return deleted;
		}
		normalize(format) {
			const self = this;
			const headers = {};
			utils_default.forEach(this, (value, header) => {
				const key = utils_default.findKey(headers, header);
				if (key) {
					self[key] = normalizeValue(value);
					delete self[header];
					return;
				}
				const normalized = format ? formatHeader(header) : String(header).trim();
				if (normalized !== header) delete self[header];
				self[normalized] = normalizeValue(value);
				headers[normalized] = true;
			});
			return this;
		}
		concat(...targets) {
			return this.constructor.concat(this, ...targets);
		}
		toJSON(asStrings) {
			const obj = Object.create(null);
			utils_default.forEach(this, (value, header) => {
				value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
			});
			return obj;
		}
		[Symbol.iterator]() {
			return Object.entries(this.toJSON())[Symbol.iterator]();
		}
		toString() {
			return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
		}
		getSetCookie() {
			const value = this.get("set-cookie");
			return utils_default.isArray(value) ? value : value == null || value === false ? [] : [value];
		}
		get [Symbol.toStringTag]() {
			return "AxiosHeaders";
		}
		static from(thing) {
			return thing instanceof this ? thing : new this(thing);
		}
		static parseParameters(value) {
			return parseParameters(value);
		}
		static concat(first, ...targets) {
			const computed = new this(first);
			targets.forEach((target) => computed.set(target));
			return computed;
		}
		static accessor(header) {
			const accessors = (this[$internals$1] = this[$internals$1] = { accessors: {} }).accessors;
			const prototype = this.prototype;
			function defineAccessor(_header) {
				const lHeader = normalizeHeader(_header);
				if (!accessors[lHeader]) {
					buildAccessors(prototype, _header);
					accessors[lHeader] = true;
				}
			}
			utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
			return this;
		}
	};
	AxiosHeaders.accessor([
		"Content-Type",
		"Content-Length",
		"Accept",
		"Accept-Encoding",
		"User-Agent",
		"Authorization"
	]);
	utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
		let mapped = key[0].toUpperCase() + key.slice(1);
		return {
			get: () => value,
			set(headerValue) {
				this[mapped] = headerValue;
			}
		};
	});
	utils_default.freezeMethods(AxiosHeaders);
	//#endregion
	//#region node_modules/axios/lib/core/AxiosError.js
	var REDACTED = "[REDACTED ****]";
	function hasOwnOrPrototypeToJSON(source) {
		if (utils_default.hasOwnProp(source, "toJSON")) return true;
		let prototype = Object.getPrototypeOf(source);
		while (prototype && prototype !== Object.prototype) {
			if (utils_default.hasOwnProp(prototype, "toJSON")) return true;
			prototype = Object.getPrototypeOf(prototype);
		}
		return false;
	}
	function redactConfig(config, redactKeys) {
		const lowerKeys = new Set(redactKeys.map((k) => String(k).toLowerCase()));
		const seen = [];
		const visit = (source) => {
			if (source === null || typeof source !== "object") return source;
			if (utils_default.isBuffer(source)) return source;
			if (seen.indexOf(source) !== -1) return void 0;
			if (source instanceof AxiosHeaders) source = source.toJSON();
			seen.push(source);
			let result;
			if (utils_default.isArray(source)) {
				result = [];
				source.forEach((v, i) => {
					const reducedValue = visit(v);
					if (!utils_default.isUndefined(reducedValue)) result[i] = reducedValue;
				});
			} else {
				if (!utils_default.isPlainObject(source) && hasOwnOrPrototypeToJSON(source)) {
					seen.pop();
					return source;
				}
				result = Object.create(null);
				for (const [key, value] of Object.entries(source)) {
					const reducedValue = lowerKeys.has(key.toLowerCase()) ? REDACTED : visit(value);
					if (!utils_default.isUndefined(reducedValue)) result[key] = reducedValue;
				}
			}
			seen.pop();
			return result;
		};
		return visit(config);
	}
	function stringifySafely$1(value) {
		try {
			return String(value);
		} catch (err) {
			return "";
		}
	}
	function aggregateErrorMessage(error) {
		return error.errors.map((entry) => {
			try {
				return entry && entry.message ? stringifySafely$1(entry.message) : stringifySafely$1(entry);
			} catch (err) {
				return "";
			}
		}).filter(Boolean).join("; ") || error.name || "AggregateError";
	}
	var AxiosError = class AxiosError extends Error {
		static from(error, code, config, request, response, customProps) {
			let message = error.message;
			if (!message && utils_default.isArray(error.errors) && error.errors.length) message = aggregateErrorMessage(error);
			const axiosError = new AxiosError(message, code || error.code, config, request, response);
			Object.defineProperty(axiosError, "cause", {
				__proto__: null,
				value: error,
				writable: true,
				enumerable: false,
				configurable: true
			});
			axiosError.name = error.name;
			if (error.status != null && axiosError.status == null) axiosError.status = error.status;
			customProps && Object.assign(axiosError, customProps);
			return axiosError;
		}
		/**
		* Create an Error with the specified message, config, error code, request and response.
		*
		* @param {string} message The error message.
		* @param {string} [code] The error code (for example, 'ECONNABORTED').
		* @param {Object} [config] The config.
		* @param {Object} [request] The request.
		* @param {Object} [response] The response.
		*
		* @returns {Error} The created error.
		*/
		constructor(message, code, config, request, response) {
			super(message);
			Object.defineProperty(this, "message", {
				__proto__: null,
				value: message,
				enumerable: true,
				writable: true,
				configurable: true
			});
			this.name = "AxiosError";
			this.isAxiosError = true;
			code && (this.code = code);
			config && (this.config = config);
			request && (this.request = request);
			if (response) {
				this.response = response;
				this.status = response.status;
			}
		}
		toJSON() {
			const config = this.config;
			const redactKeys = config && utils_default.hasOwnProp(config, "redact") ? config.redact : void 0;
			const serializedConfig = utils_default.isArray(redactKeys) && redactKeys.length > 0 ? redactConfig(config, redactKeys) : utils_default.toJSONObject(config);
			return {
				message: this.message,
				name: this.name,
				description: this.description,
				number: this.number,
				fileName: this.fileName,
				lineNumber: this.lineNumber,
				columnNumber: this.columnNumber,
				stack: this.stack,
				config: serializedConfig,
				code: this.code,
				status: this.status
			};
		}
	};
	AxiosError.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
	AxiosError.ERR_BAD_OPTION = "ERR_BAD_OPTION";
	AxiosError.ECONNABORTED = "ECONNABORTED";
	AxiosError.ETIMEDOUT = "ETIMEDOUT";
	AxiosError.ECONNREFUSED = "ECONNREFUSED";
	AxiosError.ERR_NETWORK = "ERR_NETWORK";
	AxiosError.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
	AxiosError.ERR_DEPRECATED = "ERR_DEPRECATED";
	AxiosError.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
	AxiosError.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
	AxiosError.ERR_CANCELED = "ERR_CANCELED";
	AxiosError.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
	AxiosError.ERR_INVALID_URL = "ERR_INVALID_URL";
	AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
	/**
	* Determines if the given thing is a array or js object.
	*
	* @param {string} thing - The object or array to be visited.
	*
	* @returns {boolean}
	*/
	function isVisitable(thing) {
		return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
	}
	/**
	* It removes the brackets from the end of a string
	*
	* @param {string} key - The key of the parameter.
	*
	* @returns {string} the key without the brackets.
	*/
	function removeBrackets(key) {
		return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
	}
	/**
	* It takes a path, a key, and a boolean, and returns a string
	*
	* @param {string} path - The path to the current key.
	* @param {string} key - The key of the current object being iterated over.
	* @param {string} dots - If true, the key will be rendered with dots instead of brackets.
	*
	* @returns {string} The path to the current key.
	*/
	function renderKey(path, key, dots) {
		if (!path) return key;
		return path.concat(key).map(function each(token, i) {
			token = removeBrackets(token);
			return !dots && i ? "[" + token + "]" : token;
		}).join(dots ? "." : "");
	}
	/**
	* If the array is an array and none of its elements are visitable, then it's a flat array.
	*
	* @param {Array<any>} arr - The array to check
	*
	* @returns {boolean}
	*/
	function isFlatArray(arr) {
		return utils_default.isArray(arr) && !arr.some(isVisitable);
	}
	var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
		return /^is[A-Z]/.test(prop);
	});
	/**
	* Convert a data object to FormData
	*
	* @param {Object} obj
	* @param {?Object} [formData]
	* @param {?Object} [options]
	* @param {Function} [options.visitor]
	* @param {Boolean} [options.metaTokens = true]
	* @param {Boolean} [options.dots = false]
	* @param {?Boolean} [options.indexes = false]
	*
	* @returns {Object}
	**/
	/**
	* It converts an object into a FormData object
	*
	* @param {Object<any, any>} obj - The object to convert to form data.
	* @param {string} formData - The FormData object to append to.
	* @param {Object<string, any>} options
	*
	* @returns
	*/
	function toFormData(obj, formData, options) {
		if (!utils_default.isObject(obj)) throw new TypeError("target must be an object");
		formData = formData || new FormData();
		const option = (name, fallback) => {
			const value = utils_default.getSafeProp(options, name);
			return utils_default.isUndefined(value) ? fallback : value;
		};
		const metaTokens = option("metaTokens", true);
		const visitor = option("visitor") || defaultVisitor;
		const dots = option("dots", false);
		const indexes = option("indexes", false);
		const _Blob = option("Blob") || typeof Blob !== "undefined" && Blob;
		const maxDepth = option("maxDepth", 100);
		const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
		const stack = [];
		if (!utils_default.isFunction(visitor)) throw new TypeError("visitor must be a function");
		function convertValue(value) {
			if (value === null) return "";
			if (utils_default.isDate(value)) return value.toISOString();
			if (utils_default.isBoolean(value)) return value.toString();
			if (!useBlob && utils_default.isBlob(value)) throw new AxiosError("Blob is not supported. Use a Buffer instead.");
			if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
				if (useBlob && typeof _Blob === "function") return new _Blob([value]);
				throw new AxiosError("Blob is not supported. Use a Buffer instead.", AxiosError.ERR_NOT_SUPPORT);
			}
			return value;
		}
		function throwIfMaxDepthExceeded(depth) {
			if (depth > maxDepth) throw new AxiosError("Object is too deeply nested (" + depth + " levels). Max depth: " + maxDepth, AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED);
		}
		function stringifyWithDepthLimit(value, depth) {
			if (maxDepth === Infinity) return JSON.stringify(value);
			const ancestors = [];
			return JSON.stringify(value, function limitDepth(_key, currentValue) {
				if (!utils_default.isObject(currentValue)) return currentValue;
				while (ancestors.length && ancestors[ancestors.length - 1] !== this) ancestors.pop();
				ancestors.push(currentValue);
				throwIfMaxDepthExceeded(depth + ancestors.length - 1);
				return currentValue;
			});
		}
		/**
		* Default visitor.
		*
		* @param {*} value
		* @param {String|Number} key
		* @param {Array<String|Number>} path
		* @this {FormData}
		*
		* @returns {boolean} return true to visit the each prop of the value recursively
		*/
		function defaultVisitor(value, key, path) {
			let arr = value;
			if (utils_default.isReactNative(formData) && utils_default.isReactNativeBlob(value)) {
				formData.append(renderKey(path, key, dots), convertValue(value));
				return false;
			}
			if (value && !path && typeof value === "object") {
				if (utils_default.endsWith(key, "{}")) {
					key = metaTokens ? key : key.slice(0, -2);
					value = stringifyWithDepthLimit(value, 1);
				} else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
					key = removeBrackets(key);
					arr.forEach(function each(el, index) {
						!(utils_default.isUndefined(el) || el === null) && formData.append(indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]", convertValue(el));
					});
					return false;
				}
			}
			if (isVisitable(value)) return true;
			formData.append(renderKey(path, key, dots), convertValue(value));
			return false;
		}
		const exposedHelpers = Object.assign(predicates, {
			defaultVisitor,
			convertValue,
			isVisitable
		});
		function build(value, path, depth = 0) {
			if (utils_default.isUndefined(value)) return;
			throwIfMaxDepthExceeded(depth);
			if (stack.indexOf(value) !== -1) throw new Error("Circular reference detected in " + path.join("."));
			stack.push(value);
			utils_default.forEach(value, function each(el, key) {
				if ((!(utils_default.isUndefined(el) || el === null) && visitor.call(formData, el, utils_default.isString(key) ? key.trim() : key, path, exposedHelpers)) === true) build(el, path ? path.concat(key) : [key], depth + 1);
			});
			stack.pop();
		}
		if (!utils_default.isObject(obj)) throw new TypeError("data must be an object");
		build(obj);
		return formData;
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/AxiosURLSearchParams.js
	/**
	* It encodes a string by replacing all characters that are not in the unreserved set with
	* their percent-encoded equivalents
	*
	* @param {string} str - The string to encode.
	*
	* @returns {string} The encoded string.
	*/
	function encode$1(str) {
		const charMap = {
			"!": "%21",
			"'": "%27",
			"(": "%28",
			")": "%29",
			"~": "%7E",
			"%20": "+"
		};
		return encodeURIComponent(str).replace(/[!'()~]|%20/g, function replacer(match) {
			return charMap[match];
		});
	}
	/**
	* It takes a params object and converts it to a FormData object
	*
	* @param {Object<string, any>} params - The parameters to be converted to a FormData object.
	* @param {Object<string, any>} options - The options object passed to the Axios constructor.
	*
	* @returns {void}
	*/
	function AxiosURLSearchParams(params, options) {
		this._pairs = [];
		params && toFormData(params, this, options);
	}
	var prototype = AxiosURLSearchParams.prototype;
	prototype.append = function append(name, value) {
		this._pairs.push([name, value]);
	};
	prototype.toString = function toString(encoder) {
		const _encode = encoder ? (value) => encoder.call(this, value, encode$1) : encode$1;
		return this._pairs.map(function each(pair) {
			return _encode(pair[0]) + "=" + _encode(pair[1]);
		}, "").join("&");
	};
	//#endregion
	//#region node_modules/axios/lib/helpers/buildURL.js
	/**
	* It replaces URL-encoded forms of `:`, `$`, `,`, and spaces with
	* their plain counterparts (`:`, `$`, `,`, `+`).
	*
	* @param {string} val The value to be encoded.
	*
	* @returns {string} The encoded value.
	*/
	function encode(val) {
		return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
	}
	/**
	* Build a URL by appending params to the end
	*
	* @param {string} url The base of the url (e.g., http://www.google.com)
	* @param {object} [params] The params to be appended
	* @param {?(object|Function)} options
	*
	* @returns {string} The formatted url
	*/
	function buildURL(url, params, options) {
		if (!params) return url;
		url = url || "";
		const _options = utils_default.isFunction(options) ? { serialize: options } : options;
		const _encode = utils_default.getSafeProp(_options, "encode") || encode;
		const serializeFn = utils_default.getSafeProp(_options, "serialize");
		let serializedParams;
		if (serializeFn) serializedParams = serializeFn(params, _options);
		else serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, _options).toString(_encode);
		if (serializedParams) {
			const hashmarkIndex = url.indexOf("#");
			if (hashmarkIndex !== -1) url = url.slice(0, hashmarkIndex);
			url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
		}
		return url;
	}
	//#endregion
	//#region node_modules/axios/lib/core/InterceptorManager.js
	var $internals = Symbol("internals");
	function countHandlers(handlers) {
		return handlers ? handlers.length : 0;
	}
	function trimHandlers(handlers) {
		if (!handlers) return;
		while (handlers.length && handlers[handlers.length - 1] === null) handlers.pop();
	}
	function syncHandlerEntries(manager, internals) {
		const handlers = manager.handlers;
		const length = countHandlers(handlers);
		if (handlers !== internals.handlersRef) {
			internals.handlersRef = handlers;
			internals.handlerEntries.clear();
		} else if (length !== internals.handlersLength) {
			if (!length) internals.handlerEntries.clear();
			else internals.handlerEntries.forEach(function removeStaleEntry(entry, id) {
				if (handlers[entry.index] !== entry.handler) internals.handlerEntries.delete(id);
			});
		}
		internals.handlersLength = length;
	}
	var InterceptorManager = class {
		constructor() {
			this.handlers = [];
			this[$internals] = {
				handlersRef: this.handlers,
				handlersLength: this.handlers.length,
				handlerEntries: /* @__PURE__ */ new Map(),
				iterationDepth: 0,
				nextId: 0
			};
		}
		/**
		* Add a new interceptor to the stack
		*
		* @param {Function} fulfilled The function to handle `then` for a `Promise`
		* @param {Function} rejected The function to handle `reject` for a `Promise`
		* @param {Object} options The options for the interceptor, synchronous and runWhen
		*
		* @return {Number} An ID used to remove interceptor later
		*/
		use(fulfilled, rejected, options) {
			const handler = {
				fulfilled,
				rejected,
				synchronous: options ? options.synchronous : false,
				runWhen: options ? options.runWhen : null
			};
			const internals = this[$internals];
			if (this.handlers == null) this.handlers = [];
			syncHandlerEntries(this, internals);
			const id = internals.nextId++;
			this.handlers.push(handler);
			internals.handlerEntries.set(id, {
				handler,
				index: this.handlers.length - 1
			});
			internals.handlersLength = this.handlers.length;
			return id;
		}
		/**
		* Remove an interceptor from the stack
		*
		* @param {Number} id The ID that was returned by `use`
		*
		* @returns {void}
		*/
		eject(id) {
			const internals = this[$internals];
			syncHandlerEntries(this, internals);
			const entry = internals.handlerEntries.get(id);
			if (entry) {
				internals.handlerEntries.delete(id);
				if (this.handlers[entry.index] !== entry.handler) return;
				this.handlers[entry.index] = null;
				if (!internals.iterationDepth) {
					trimHandlers(this.handlers);
					internals.handlersLength = this.handlers.length;
				}
			}
		}
		/**
		* Clear all interceptors from the stack
		*
		* @returns {void}
		*/
		clear() {
			if (this.handlers) {
				this.handlers = [];
				syncHandlerEntries(this, this[$internals]);
			}
		}
		/**
		* Iterate over all the registered interceptors
		*
		* This method is particularly useful for skipping over any
		* interceptors that may have become `null` calling `eject`.
		*
		* @param {Function} fn The function to call for each interceptor
		*
		* @returns {void}
		*/
		forEach(fn) {
			const internals = this[$internals];
			syncHandlerEntries(this, internals);
			internals.iterationDepth++;
			try {
				utils_default.forEach(this.handlers, function forEachHandler(h) {
					if (h !== null) fn(h);
				});
			} finally {
				if (!--internals.iterationDepth) {
					syncHandlerEntries(this, internals);
					trimHandlers(this.handlers);
					internals.handlersLength = countHandlers(this.handlers);
				}
			}
		}
	};
	//#endregion
	//#region node_modules/axios/lib/defaults/transitional.js
	var transitional_default = {
		silentJSONParsing: true,
		forcedJSONParsing: true,
		clarifyTimeoutError: false,
		legacyInterceptorReqResOrdering: true,
		advertiseZstdAcceptEncoding: false,
		validateStatusUndefinedResolves: true
	};
	//#endregion
	//#region node_modules/axios/lib/platform/browser/index.js
	var browser_default = {
		isBrowser: true,
		classes: {
			URLSearchParams: typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams,
			FormData: typeof FormData !== "undefined" ? FormData : null,
			Blob: typeof Blob !== "undefined" ? Blob : null
		},
		protocols: [
			"http",
			"https",
			"file",
			"blob",
			"url",
			"data"
		]
	};
	//#endregion
	//#region node_modules/axios/lib/platform/common/utils.js
	var utils_exports = /* @__PURE__ */ __exportAll({
		hasBrowserEnv: () => hasBrowserEnv,
		hasStandardBrowserEnv: () => hasStandardBrowserEnv,
		hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
		navigator: () => _navigator,
		origin: () => origin
	});
	var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
	var _navigator = typeof navigator === "object" && navigator || void 0;
	/**
	* Determine if we're running in a standard browser environment
	*
	* This allows axios to run in a web worker, and react-native.
	* Both environments support XMLHttpRequest, but not fully standard globals.
	*
	* web workers:
	*  typeof window -> undefined
	*  typeof document -> undefined
	*
	* react-native:
	*  navigator.product -> 'ReactNative'
	* nativescript
	*  navigator.product -> 'NativeScript' or 'NS'
	*
	* @returns {boolean}
	*/
	var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || [
		"ReactNative",
		"NativeScript",
		"NS"
	].indexOf(_navigator.product) < 0);
	/**
	* Determine if we're running in a standard browser webWorker environment
	*
	* Although the `isStandardBrowserEnv` method indicates that
	* `allows axios to run in a web worker`, the WebWorker will still be
	* filtered out due to its judgment standard
	* `typeof window !== 'undefined' && typeof document !== 'undefined'`.
	* This leads to a problem when axios post `FormData` in webWorker
	*/
	var hasStandardBrowserWebWorkerEnv = (() => {
		return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
	})();
	var origin = hasBrowserEnv && window.location.href || "http://localhost";
	//#endregion
	//#region node_modules/axios/lib/platform/index.js
	var platform_default = {
		...utils_exports,
		...browser_default
	};
	//#endregion
	//#region node_modules/axios/lib/helpers/toURLEncodedForm.js
	function toURLEncodedForm(data, options) {
		return toFormData(data, new platform_default.classes.URLSearchParams(), {
			visitor: function(value, key, path, helpers) {
				if (platform_default.isNode && utils_default.isBuffer(value)) {
					this.append(key, value.toString("base64"));
					return false;
				}
				return helpers.defaultVisitor.apply(this, arguments);
			},
			...options
		});
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/formDataToJSON.js
	var MAX_DEPTH = 100;
	function throwIfDepthExceeded(index) {
		if (index > MAX_DEPTH) throw new AxiosError("FormData field is too deeply nested (" + index + " levels). Max depth: " + MAX_DEPTH, AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED);
	}
	/**
	* It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
	*
	* @param {string} name - The name of the property to get.
	*
	* @returns An array of strings.
	*/
	function parsePropPath(name) {
		const path = [];
		const pattern = /[^.[\]]+|\[([^.[\]]*)]/g;
		let match;
		while ((match = pattern.exec(name)) !== null) {
			throwIfDepthExceeded(path.length);
			path.push(match[0] === "[]" ? "" : match[1] || match[0]);
		}
		return path;
	}
	/**
	* Convert an array to an object.
	*
	* @param {Array<any>} arr - The array to convert to an object.
	*
	* @returns An object with the same keys and values as the array.
	*/
	function arrayToObject(arr) {
		const obj = {};
		const keys = Object.keys(arr);
		let i;
		const len = keys.length;
		let key;
		for (i = 0; i < len; i++) {
			key = keys[i];
			obj[key] = arr[key];
		}
		return obj;
	}
	/**
	* It takes a FormData object and returns a JavaScript object
	*
	* @param {string} formData The FormData object to convert to JSON.
	*
	* @returns {Object<string, any> | null} The converted object.
	*/
	function formDataToJSON(formData) {
		function buildPath(path, value, target, index) {
			throwIfDepthExceeded(index);
			let name = path[index++];
			if (name === "__proto__") return true;
			const isNumericKey = Number.isFinite(+name);
			const isLast = index >= path.length;
			name = !name && utils_default.isArray(target) ? target.length : name;
			if (isLast) {
				if (utils_default.hasOwnProp(target, name)) target[name] = utils_default.isArray(target[name]) ? target[name].concat(value) : [target[name], value];
				else target[name] = value;
				return !isNumericKey;
			}
			if (!utils_default.hasOwnProp(target, name) || !utils_default.isObject(target[name])) target[name] = [];
			if (buildPath(path, value, target[name], index) && utils_default.isArray(target[name])) target[name] = arrayToObject(target[name]);
			return !isNumericKey;
		}
		if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
			const obj = {};
			utils_default.forEachEntry(formData, (name, value) => {
				buildPath(parsePropPath(name), value, obj, 0);
			});
			return obj;
		}
		return null;
	}
	//#endregion
	//#region node_modules/axios/lib/core/methodList.js
	var methodList = Object.freeze([
		"get",
		"delete",
		"head",
		"options",
		"post",
		"put",
		"patch",
		"purge",
		"link",
		"unlink",
		"query"
	]);
	//#endregion
	//#region node_modules/axios/lib/defaults/index.js
	var own = (obj, key) => obj != null && utils_default.hasOwnProp(obj, key) ? obj[key] : void 0;
	/**
	* It takes a string, tries to parse it, and if it fails, it returns the stringified version
	* of the input
	*
	* @param {any} rawValue - The value to be stringified.
	* @param {Function} parser - A function that parses a string into a JavaScript object.
	* @param {Function} encoder - A function that takes a value and returns a string.
	*
	* @returns {string} A stringified version of the rawValue.
	*/
	function stringifySafely(rawValue, parser, encoder) {
		if (utils_default.isString(rawValue)) try {
			(parser || JSON.parse)(rawValue);
			return utils_default.trim(rawValue);
		} catch (e) {
			if (e.name !== "SyntaxError") throw e;
		}
		return (encoder || JSON.stringify)(rawValue);
	}
	var defaults = {
		transitional: transitional_default,
		adapter: [
			"xhr",
			"http",
			"fetch"
		],
		transformRequest: [function transformRequest(data, headers) {
			const contentType = headers.getContentType() || "";
			const hasJSONContentType = contentType.indexOf("application/json") > -1;
			const isObjectPayload = utils_default.isObject(data);
			if (isObjectPayload && utils_default.isHTMLForm(data)) data = new FormData(data);
			if (utils_default.isFormData(data)) return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
			if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) return data;
			if (utils_default.isArrayBufferView(data)) return data.buffer;
			if (utils_default.isURLSearchParams(data)) {
				headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
				return data.toString();
			}
			let isFileList;
			if (isObjectPayload) {
				const formSerializer = own(this, "formSerializer");
				if (contentType.indexOf("application/x-www-form-urlencoded") > -1) return toURLEncodedForm(data, formSerializer).toString();
				if ((isFileList = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
					const env = own(this, "env");
					const _FormData = env && env.FormData;
					return toFormData(isFileList ? { "files[]": data } : data, _FormData && new _FormData(), formSerializer);
				}
			}
			if (isObjectPayload || hasJSONContentType) {
				headers.setContentType("application/json", false);
				return stringifySafely(data);
			}
			return data;
		}],
		transformResponse: [function transformResponse(data) {
			const transitional = own(this, "transitional") || defaults.transitional;
			const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
			const responseType = own(this, "responseType");
			const JSONRequested = responseType === "json";
			if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) return data;
			if (data && utils_default.isString(data) && (forcedJSONParsing && !responseType || JSONRequested)) {
				const strictJSONParsing = !(transitional && transitional.silentJSONParsing) && JSONRequested;
				try {
					return JSON.parse(data, own(this, "parseReviver"));
				} catch (e) {
					if (strictJSONParsing) {
						if (e.name === "SyntaxError") throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, own(this, "response"));
						throw e;
					}
				}
			}
			return data;
		}],
		/**
		* A timeout in milliseconds to abort a request. If set to 0 (default) a
		* timeout is not created.
		*/
		timeout: 0,
		xsrfCookieName: "XSRF-TOKEN",
		xsrfHeaderName: "X-XSRF-TOKEN",
		maxContentLength: -1,
		maxBodyLength: -1,
		env: {
			FormData: platform_default.classes.FormData,
			Blob: platform_default.classes.Blob
		},
		validateStatus: function validateStatus(status) {
			return status >= 200 && status < 300;
		},
		headers: { common: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": void 0
		} }
	};
	utils_default.forEach(methodList, (method) => {
		defaults.headers[method] = {};
	});
	//#endregion
	//#region node_modules/axios/lib/core/transformData.js
	/**
	* Transform the data for a request or a response
	*
	* @param {Array|Function} fns A single function or Array of functions
	* @param {?Object} response The response object
	*
	* @returns {*} The resulting transformed data
	*/
	function transformData(fns, response) {
		const config = this || defaults;
		const context = response || config;
		const headers = AxiosHeaders.from(context.headers);
		let data = context.data;
		utils_default.forEach(fns, function transform(fn) {
			data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
		});
		headers.normalize();
		return data;
	}
	//#endregion
	//#region node_modules/axios/lib/cancel/isCancel.js
	function isCancel(value) {
		return !!(value && value.__CANCEL__);
	}
	//#endregion
	//#region node_modules/axios/lib/cancel/CanceledError.js
	var CanceledError = class extends AxiosError {
		/**
		* A `CanceledError` is an object that is thrown when an operation is canceled.
		*
		* @param {string=} message The message.
		* @param {Object=} config The config.
		* @param {Object=} request The request.
		*
		* @returns {CanceledError} The created error.
		*/
		constructor(message, config, request) {
			super(message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
			this.name = "CanceledError";
			this.__CANCEL__ = true;
		}
	};
	//#endregion
	//#region node_modules/axios/lib/core/settle.js
	/**
	* Resolve or reject a Promise based on response status.
	*
	* @param {Function} resolve A function that resolves the promise.
	* @param {Function} reject A function that rejects the promise.
	* @param {object} response The response.
	*
	* @returns {object} The response.
	*/
	function settle(resolve, reject, response) {
		const validateStatus = response.config.validateStatus;
		if (!response.status || !validateStatus || validateStatus(response.status)) resolve(response);
		else reject(new AxiosError("Request failed with status code " + response.status, response.status >= 400 && response.status < 500 ? AxiosError.ERR_BAD_REQUEST : AxiosError.ERR_BAD_RESPONSE, response.config, response.request, response));
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/normalizeURLForProtocolCheck.js
	var urlParserControlCharacters = /[\t\n\r]/g;
	/**
	* Match WHATWG URL preprocessing before checking a URL's protocol.
	*
	* @param {string} url
	*
	* @returns {string}
	*/
	function normalizeURLForProtocolCheck(url) {
		if (typeof url !== "string") return url;
		let start = 0;
		while (start < url.length && url.charCodeAt(start) <= 32) start++;
		return url.slice(start).replace(urlParserControlCharacters, "");
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/parseProtocol.js
	function parseProtocol(url) {
		const match = /^([-+\w]{1,25}):(?:\/\/)?/.exec(url);
		return match && match[1] || "";
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/speedometer.js
	/**
	* Calculate data maxRate
	* @param {Number} [samplesCount= 10]
	* @param {Number} [min= 1000]
	* @returns {Function}
	*/
	function speedometer(samplesCount, min) {
		samplesCount = samplesCount || 10;
		const bytes = new Array(samplesCount);
		const timestamps = new Array(samplesCount);
		let head = 0;
		let tail = 0;
		let firstSampleTS;
		min = min !== void 0 ? min : 1e3;
		return function push(chunkLength) {
			const now = Date.now();
			const startedAt = timestamps[tail];
			if (!firstSampleTS) firstSampleTS = now;
			bytes[head] = chunkLength;
			timestamps[head] = now;
			let i = tail;
			let bytesCount = 0;
			while (i !== head) {
				bytesCount += bytes[i++];
				i = i % samplesCount;
			}
			head = (head + 1) % samplesCount;
			if (head === tail) tail = (tail + 1) % samplesCount;
			if (now - firstSampleTS < min) return;
			const passed = startedAt && now - startedAt;
			return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
		};
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/throttle.js
	/**
	* Throttle decorator
	* @param {Function} fn
	* @param {Number} freq
	* @return {Array<Function>}
	*/
	function throttle(fn, freq) {
		let timestamp = 0;
		let threshold = 1e3 / freq;
		let lastArgs;
		let timer;
		const invoke = (args, now = Date.now()) => {
			timestamp = now;
			lastArgs = null;
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			fn(...args);
		};
		const throttled = (...args) => {
			const now = Date.now();
			const passed = now - timestamp;
			if (passed >= threshold) invoke(args, now);
			else {
				lastArgs = args;
				if (!timer) timer = setTimeout(() => {
					timer = null;
					invoke(lastArgs);
				}, threshold - passed);
			}
		};
		const flush = () => lastArgs && invoke(lastArgs);
		const flushWith = (...args) => invoke(args);
		return [
			throttled,
			flush,
			flushWith
		];
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/progressEventReducer.js
	var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
		let bytesNotified = 0;
		const _speedometer = speedometer(50, 250);
		return throttle((e) => {
			if (!e || !utils_default.isNumber(e.loaded)) return;
			const rawLoaded = e.loaded;
			const total = e.lengthComputable ? e.total : void 0;
			const loaded = Math.max(0, total != null ? Math.min(rawLoaded, total) : rawLoaded);
			const progressBytes = Math.max(0, loaded - bytesNotified);
			const rate = _speedometer(progressBytes);
			bytesNotified = Math.max(bytesNotified, loaded);
			listener({
				loaded,
				total,
				progress: total ? loaded / total : void 0,
				bytes: progressBytes,
				rate: rate ? rate : void 0,
				estimated: rate && total ? (total - loaded) / rate : void 0,
				event: e,
				lengthComputable: total != null,
				[isDownloadStream ? "download" : "upload"]: true
			});
		}, freq);
	};
	var progressEventDecorator = (total, throttled) => {
		const lengthComputable = total != null;
		return [(loaded) => throttled[0]({
			lengthComputable,
			total,
			loaded
		}), throttled[1]];
	};
	var asyncDecorator = (fn, scheduler = utils_default.asap) => (...args) => scheduler(() => fn(...args));
	//#endregion
	//#region node_modules/axios/lib/helpers/isURLSameOrigin.js
	var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
		url = new URL(url, platform_default.origin);
		return origin.protocol === url.protocol && origin.host === url.host && (isMSIE || origin.port === url.port);
	})(new URL(platform_default.origin), platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)) : () => true;
	//#endregion
	//#region node_modules/axios/lib/helpers/cookies.js
	var cookies_default = platform_default.hasStandardBrowserEnv ? {
		write(name, value, expires, path, domain, secure, sameSite) {
			if (typeof document === "undefined") return;
			const cookie = [`${name}=${encodeURIComponent(value)}`];
			if (utils_default.isNumber(expires)) cookie.push(`expires=${new Date(expires).toUTCString()}`);
			if (utils_default.isString(path)) cookie.push(`path=${path}`);
			if (utils_default.isString(domain)) cookie.push(`domain=${domain}`);
			if (secure === true) cookie.push("secure");
			if (utils_default.isString(sameSite)) cookie.push(`SameSite=${sameSite}`);
			document.cookie = cookie.join("; ");
		},
		read(name) {
			if (typeof document === "undefined") return null;
			const cookies = document.cookie.split(";");
			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i].replace(/^\s+/, "");
				const eq = cookie.indexOf("=");
				if (eq !== -1 && cookie.slice(0, eq) === name) try {
					return decodeURIComponent(cookie.slice(eq + 1));
				} catch (e) {
					return cookie.slice(eq + 1);
				}
			}
			return null;
		},
		remove(name) {
			this.write(name, "", Date.now() - 864e5, "/");
		}
	} : {
		write() {},
		read() {
			return null;
		},
		remove() {}
	};
	//#endregion
	//#region node_modules/axios/lib/helpers/isAbsoluteURL.js
	/**
	* Determines whether the specified URL is absolute
	*
	* @param {string} url The URL to test
	*
	* @returns {boolean} True if the specified URL is absolute, otherwise false
	*/
	function isAbsoluteURL(url) {
		if (typeof url !== "string") return false;
		return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/combineURLs.js
	/**
	* Creates a new URL by combining the specified URLs
	*
	* @param {string} baseURL The base URL
	* @param {string} relativeURL The relative URL
	*
	* @returns {string} The combined URL
	*/
	function combineURLs(baseURL, relativeURL) {
		if (!relativeURL) return baseURL;
		let end = baseURL.length;
		while (end > 0 && baseURL.charCodeAt(end - 1) === 47) end--;
		return baseURL.slice(0, end) + "/" + relativeURL.replace(/^\/+/, "");
	}
	//#endregion
	//#region node_modules/axios/lib/core/buildFullPath.js
	var malformedHttpProtocol = /^https?:(?!\/\/)/i;
	function redactFragment(fragment) {
		if (!fragment) return fragment;
		return fragment.replace(/(^|&)([^=&]*=)?[^&]+/g, (match, separator, parameterName = "") => {
			return `${separator}${parameterName}${REDACTED}`;
		});
	}
	function redactSensitiveURLParts(url) {
		const redactedURL = url.replace(/^(https?:\/{0,2})[^/?#]*@/i, `$1${REDACTED}@`);
		const fragmentIndex = redactedURL.indexOf("#");
		const redactedURLWithoutFragment = (fragmentIndex === -1 ? redactedURL : redactedURL.slice(0, fragmentIndex)).replace(/([?&][^=&#]*=)[^&#]*/g, `$1${REDACTED}`);
		if (fragmentIndex === -1) return redactedURLWithoutFragment;
		return `${redactedURLWithoutFragment}#${redactFragment(redactedURL.slice(fragmentIndex + 1))}`;
	}
	function assertValidHttpProtocolURL(url, config) {
		if (typeof url === "string") {
			const normalizedURL = normalizeURLForProtocolCheck(url);
			if (malformedHttpProtocol.test(normalizedURL)) throw new AxiosError(`Invalid URL ${JSON.stringify(redactSensitiveURLParts(normalizedURL))}: missing "//" after protocol`, AxiosError.ERR_INVALID_URL, config);
		}
	}
	/**
	* Creates a new URL by combining the baseURL with the requestedURL,
	* only when the requestedURL is not already an absolute URL.
	* If the requestURL is absolute, this function returns the requestedURL untouched.
	*
	* @param {string} baseURL The base URL
	* @param {string} requestedURL Absolute or relative URL to combine
	*
	* @returns {string} The combined full path
	*/
	function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls, config) {
		assertValidHttpProtocolURL(requestedURL, config);
		let isRelativeUrl = !isAbsoluteURL(requestedURL);
		if (baseURL && (isRelativeUrl || allowAbsoluteUrls === false)) {
			assertValidHttpProtocolURL(baseURL, config);
			return combineURLs(baseURL, requestedURL);
		}
		return requestedURL;
	}
	//#endregion
	//#region node_modules/axios/lib/core/mergeConfig.js
	var headersToObject = (thing) => thing instanceof AxiosHeaders ? { ...thing } : thing;
	var ownEnumerableKeys = (thing) => {
		if (Object.getOwnPropertySymbols && Object.getOwnPropertyDescriptor) return Object.keys(thing).concat(Object.getOwnPropertySymbols(thing).filter((symbol) => Object.getOwnPropertyDescriptor(thing, symbol).enumerable));
		return Object.keys(thing);
	};
	/**
	* Config-specific merge-function which creates a new config-object
	* by merging two configuration objects together.
	*
	* @param {Object} config1
	* @param {Object} config2
	*
	* @returns {Object} New object resulting from merging config2 to config1
	*/
	function mergeConfig(config1, config2) {
		config1 = config1 || {};
		config2 = config2 || {};
		const config = Object.create(null);
		Object.defineProperty(config, "hasOwnProperty", {
			__proto__: null,
			value: Object.prototype.hasOwnProperty,
			enumerable: false,
			writable: true,
			configurable: true
		});
		function getMergedValue(target, source, prop, caseless) {
			if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) return utils_default.merge.call({ caseless }, target, source);
			else if (utils_default.isPlainObject(source)) return utils_default.merge({}, source);
			else if (utils_default.isArray(source)) return source.slice();
			return source;
		}
		function mergeDeepProperties(a, b, prop, caseless) {
			if (!utils_default.isUndefined(b)) return getMergedValue(a, b, prop, caseless);
			else if (!utils_default.isUndefined(a)) return getMergedValue(void 0, a, prop, caseless);
		}
		function valueFromConfig2(a, b) {
			if (!utils_default.isUndefined(b)) return getMergedValue(void 0, b);
		}
		function defaultToConfig2(a, b) {
			if (!utils_default.isUndefined(b)) return getMergedValue(void 0, b);
			else if (!utils_default.isUndefined(a)) return getMergedValue(void 0, a);
		}
		function getMergedTransitionalOption(prop) {
			const transitional2 = utils_default.hasOwnProp(config2, "transitional") ? config2.transitional : void 0;
			if (!utils_default.isUndefined(transitional2)) {
				if (utils_default.isPlainObject(transitional2)) {
					if (utils_default.hasOwnProp(transitional2, prop)) return transitional2[prop];
				} else return;
			}
			const transitional1 = utils_default.hasOwnProp(config1, "transitional") ? config1.transitional : void 0;
			if (utils_default.isPlainObject(transitional1) && utils_default.hasOwnProp(transitional1, prop)) return transitional1[prop];
		}
		function mergeDirectKeys(a, b, prop) {
			if (utils_default.hasOwnProp(config2, prop)) return getMergedValue(a, b);
			else if (utils_default.hasOwnProp(config1, prop)) return getMergedValue(void 0, a);
		}
		const mergeMap = {
			url: valueFromConfig2,
			method: valueFromConfig2,
			data: valueFromConfig2,
			baseURL: defaultToConfig2,
			transformRequest: defaultToConfig2,
			transformResponse: defaultToConfig2,
			paramsSerializer: defaultToConfig2,
			timeout: defaultToConfig2,
			timeoutErrorMessage: defaultToConfig2,
			withCredentials: defaultToConfig2,
			withXSRFToken: defaultToConfig2,
			adapter: defaultToConfig2,
			responseType: defaultToConfig2,
			xsrfCookieName: defaultToConfig2,
			xsrfHeaderName: defaultToConfig2,
			onUploadProgress: defaultToConfig2,
			onDownloadProgress: defaultToConfig2,
			decompress: defaultToConfig2,
			maxContentLength: defaultToConfig2,
			maxBodyLength: defaultToConfig2,
			beforeRedirect: defaultToConfig2,
			transport: defaultToConfig2,
			httpAgent: defaultToConfig2,
			httpsAgent: defaultToConfig2,
			cancelToken: defaultToConfig2,
			socketPath: defaultToConfig2,
			allowedSocketPaths: defaultToConfig2,
			responseEncoding: defaultToConfig2,
			validateStatus: mergeDirectKeys,
			headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
		};
		utils_default.forEach(ownEnumerableKeys({
			...config1,
			...config2
		}), function computeConfigValue(prop) {
			if (prop === "__proto__" || prop === "constructor" || prop === "prototype") return;
			const merge = utils_default.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties;
			const configValue = merge(utils_default.hasOwnProp(config1, prop) ? config1[prop] : void 0, utils_default.hasOwnProp(config2, prop) ? config2[prop] : void 0, prop);
			utils_default.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
		});
		if (utils_default.hasOwnProp(config2, "validateStatus") && utils_default.isUndefined(config2.validateStatus) && getMergedTransitionalOption("validateStatusUndefinedResolves") === false) {
			if (utils_default.hasOwnProp(config1, "validateStatus")) config.validateStatus = getMergedValue(void 0, config1.validateStatus);
			else delete config.validateStatus;
		}
		return config;
	}
	//#endregion
	//#region node_modules/axios/lib/core/setFormDataHeaders.js
	var FORM_DATA_CONTENT_HEADERS = ["content-type", "content-length"];
	/**
	* Apply the headers generated by a FormData implementation to the request headers,
	* honoring the `formDataHeaderPolicy` option: with 'content-only', copy only the
	* content-* headers; otherwise merge all of them.
	*
	* @param {AxiosHeaders} headers - the request headers to mutate
	* @param {Object | null | undefined} formHeaders - headers produced by the FormData implementation
	* @param {String} [policy] - the resolved `formDataHeaderPolicy` config value
	*
	* @returns {void}
	*/
	function setFormDataHeaders(headers, formHeaders, policy) {
		if (policy !== "content-only") {
			headers.set(formHeaders);
			return;
		}
		Object.entries(formHeaders || {}).forEach(([key, val]) => {
			if (FORM_DATA_CONTENT_HEADERS.includes(key.toLowerCase())) headers.set(key, val);
		});
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/resolveConfig.js
	/**
	* Encode a UTF-8 string to a Latin-1 byte string for use with btoa().
	* This is a modern replacement for the deprecated unescape(encodeURIComponent(str)) pattern.
	*
	* @param {string} str The string to encode
	*
	* @returns {string} UTF-8 bytes as a Latin-1 string
	*/
	var encodeUTF8$1 = (str) => encodeURIComponent(str).replace(/%([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
	function resolveConfig(config) {
		const newConfig = mergeConfig({}, config);
		const own = (key) => utils_default.hasOwnProp(newConfig, key) ? newConfig[key] : void 0;
		const data = own("data");
		let withXSRFToken = own("withXSRFToken");
		const xsrfHeaderName = own("xsrfHeaderName");
		const xsrfCookieName = own("xsrfCookieName");
		let headers = own("headers");
		const auth = own("auth");
		const baseURL = own("baseURL");
		const allowAbsoluteUrls = own("allowAbsoluteUrls");
		const url = own("url");
		newConfig.headers = headers = AxiosHeaders.from(headers);
		newConfig.url = buildURL(buildFullPath(baseURL, url, allowAbsoluteUrls, newConfig), own("params"), own("paramsSerializer"));
		if (auth) {
			const username = utils_default.getSafeProp(auth, "username") || "";
			const password = utils_default.getSafeProp(auth, "password") || "";
			try {
				headers.set("Authorization", "Basic " + btoa(username + ":" + (password ? encodeUTF8$1(password) : "")));
			} catch (e) {
				throw AxiosError.from(e, AxiosError.ERR_BAD_OPTION_VALUE, config);
			}
		}
		if (utils_default.isFormData(data)) {
			const getHeaders = utils_default.getSafeProp(data, "getHeaders");
			if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv || utils_default.isReactNative(data)) headers.setContentType(void 0);
			else if (utils_default.isFunction(getHeaders)) setFormDataHeaders(headers, getHeaders.call(data), own("formDataHeaderPolicy"));
		}
		if (platform_default.hasStandardBrowserEnv) {
			if (utils_default.isFunction(withXSRFToken)) withXSRFToken = withXSRFToken(newConfig);
			if (withXSRFToken === true || withXSRFToken == null && isURLSameOrigin_default(newConfig.url)) {
				const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
				if (xsrfValue) headers.set(xsrfHeaderName, xsrfValue);
			}
		}
		return newConfig;
	}
	var xhr_default = typeof XMLHttpRequest !== "undefined" && function(config) {
		return new Promise(function dispatchXhrRequest(resolve, reject) {
			const _config = resolveConfig(config);
			let requestData = _config.data;
			const requestHeaders = AxiosHeaders.from(_config.headers).normalize();
			let { responseType, onUploadProgress, onDownloadProgress } = _config;
			let onCanceled;
			let uploadThrottled, downloadThrottled;
			let flushUpload, flushDownload, flushDownloadWithEvent;
			function done() {
				flushUpload && flushUpload();
				flushDownload && flushDownload();
				_config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
				_config.signal && _config.signal.removeEventListener("abort", onCanceled);
			}
			let request = new XMLHttpRequest();
			request.open(_config.method.toUpperCase(), _config.url, true);
			request.timeout = _config.timeout;
			function onloadend(event) {
				if (!request) return;
				if (request.status === 0 && (parseProtocol(normalizeURLForProtocolCheck(_config.url)) || parseProtocol(platform_default.origin)) !== "file" && !(request.responseURL && request.responseURL.startsWith("file:"))) {
					reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
					done();
					request = null;
					return;
				}
				try {
					if (event) flushDownloadWithEvent && flushDownloadWithEvent(event);
					else flushDownload && flushDownload();
				} catch (err) {
					setTimeout(() => {
						throw err;
					});
				}
				if (!request) return;
				const responseHeaders = AxiosHeaders.from("getAllResponseHeaders" in request && request.getAllResponseHeaders());
				settle(function _resolve(value) {
					resolve(value);
					done();
				}, function _reject(err) {
					reject(err);
					done();
				}, {
					data: !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response,
					status: request.status,
					statusText: request.statusText,
					headers: responseHeaders,
					config,
					request
				});
				request = null;
			}
			if ("onloadend" in request) request.onloadend = onloadend;
			else request.onreadystatechange = function handleLoad() {
				if (!request || request.readyState !== 4) return;
				if (request.status === 0 && !(request.responseURL && request.responseURL.startsWith("file:"))) return;
				setTimeout(onloadend);
			};
			request.onabort = function handleAbort() {
				if (!request) return;
				reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
				done();
				request = null;
			};
			request.onerror = function handleError(event) {
				const err = new AxiosError(event && event.message ? event.message : "Network Error", AxiosError.ERR_NETWORK, config, request);
				err.event = event || null;
				reject(err);
				done();
				request = null;
			};
			request.ontimeout = function handleTimeout() {
				let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
				const transitional = _config.transitional || transitional_default;
				if (_config.timeoutErrorMessage) timeoutErrorMessage = _config.timeoutErrorMessage;
				reject(new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, request));
				done();
				request = null;
			};
			requestData === void 0 && requestHeaders.setContentType(null);
			if ("setRequestHeader" in request) utils_default.forEach(toByteStringHeaderObject(requestHeaders), function setRequestHeader(val, key) {
				request.setRequestHeader(key, val);
			});
			if (!utils_default.isUndefined(_config.withCredentials)) request.withCredentials = !!_config.withCredentials;
			if (responseType && responseType !== "json") request.responseType = _config.responseType;
			if (onDownloadProgress) {
				[downloadThrottled, flushDownload, flushDownloadWithEvent] = progressEventReducer(onDownloadProgress, true);
				request.addEventListener("progress", downloadThrottled);
			}
			if (onUploadProgress && request.upload) {
				[uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
				request.upload.addEventListener("progress", uploadThrottled);
				request.upload.addEventListener("loadend", flushUpload);
			}
			if (_config.cancelToken || _config.signal) {
				onCanceled = (cancel) => {
					if (!request) return;
					reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
					request.abort();
					done();
					request = null;
				};
				_config.cancelToken && _config.cancelToken.subscribe(onCanceled);
				if (_config.signal) _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
			}
			const protocol = parseProtocol(_config.url);
			if (protocol && !platform_default.protocols.includes(protocol)) {
				reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
				done();
				return;
			}
			request.send(requestData || null);
		});
	};
	//#endregion
	//#region node_modules/axios/lib/helpers/composeSignals.js
	var composeSignals = (signals, timeout) => {
		signals = signals ? signals.filter(Boolean) : [];
		if (!timeout && !signals.length) return;
		const controller = new AbortController();
		let aborted = false;
		const onabort = function(reason) {
			if (!aborted) {
				aborted = true;
				unsubscribe();
				const err = reason instanceof Error ? reason : this.reason;
				controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
			}
		};
		let timer = timeout && setTimeout(() => {
			timer = null;
			onabort(new AxiosError(`timeout of ${timeout}ms exceeded`, AxiosError.ETIMEDOUT));
		}, timeout);
		const unsubscribe = () => {
			if (!signals) return;
			timer && clearTimeout(timer);
			timer = null;
			signals.forEach((signal) => {
				signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener("abort", onabort);
			});
			signals = null;
		};
		signals.forEach((signal) => {
			if (aborted) return;
			if (signal.aborted) {
				onabort.call(signal);
				return;
			}
			signal.addEventListener("abort", onabort, { once: true });
		});
		const { signal } = controller;
		signal.unsubscribe = () => utils_default.asap(unsubscribe);
		return signal;
	};
	//#endregion
	//#region node_modules/axios/lib/helpers/trackStream.js
	var streamChunk = function* (chunk, chunkSize) {
		let len = chunk.byteLength;
		if (!chunkSize || len < chunkSize) {
			yield chunk;
			return;
		}
		let pos = 0;
		let end;
		while (pos < len) {
			end = pos + chunkSize;
			yield chunk.slice(pos, end);
			pos = end;
		}
	};
	var readBytes = async function* (iterable, chunkSize) {
		for await (const chunk of readStream(iterable)) yield* streamChunk(chunk, chunkSize);
	};
	var readStream = async function* (stream) {
		if (stream[Symbol.asyncIterator]) {
			yield* stream;
			return;
		}
		const reader = stream.getReader();
		try {
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				yield value;
			}
		} finally {
			await reader.cancel();
		}
	};
	var trackStream = (stream, chunkSize, onProgress, onFinish) => {
		const iterator = readBytes(stream, chunkSize);
		let bytes = 0;
		let done;
		let _onFinish = (e) => {
			if (!done) {
				done = true;
				onFinish && onFinish(e);
			}
		};
		return new ReadableStream({
			async pull(controller) {
				try {
					const { done, value } = await iterator.next();
					if (done) {
						_onFinish();
						controller.close();
						return;
					}
					let len = value.byteLength;
					if (onProgress) onProgress(bytes += len);
					controller.enqueue(new Uint8Array(value));
				} catch (err) {
					_onFinish(err);
					throw err;
				}
			},
			cancel(reason) {
				_onFinish(reason);
				return iterator.return();
			}
		}, { highWaterMark: 2 });
	};
	//#endregion
	//#region node_modules/axios/lib/helpers/estimateDataURLDecodedBytes.js
	/**
	* Estimate data: URL byte lengths *without* allocating large buffers.
	* - Fetch percent-decodes a base64 body before decoding it.
	* - Node's Buffer.from(body, 'base64') sizes its backing allocation from the
	*   raw body, including ignored characters and content after padding.
	* - Non-base64 data is percent-decoded and then encoded as UTF-8.
	*/
	var isHexDigit = (charCode) => charCode >= 48 && charCode <= 57 || charCode >= 65 && charCode <= 70 || charCode >= 97 && charCode <= 102;
	var isPercentEncodedByte = (str, i, len) => i + 2 < len && isHexDigit(str.charCodeAt(i + 1)) && isHexDigit(str.charCodeAt(i + 2));
	var hexValue = (charCode) => charCode <= 57 ? charCode - 48 : (charCode & 223) - 55;
	var isBase64Char = (charCode) => charCode >= 65 && charCode <= 90 || charCode >= 97 && charCode <= 122 || charCode >= 48 && charCode <= 57 || charCode === 43 || charCode === 47 || charCode === 45 || charCode === 95;
	var isBase64Whitespace = (charCode) => charCode === 9 || charCode === 10 || charCode === 12 || charCode === 13 || charCode === 32;
	var base64Bytes = (significant) => {
		const groups = Math.floor(significant / 4);
		const remainder = significant % 4;
		return groups * 3 + (remainder === 2 ? 1 : remainder === 3 ? 2 : 0);
	};
	var estimateBase64BufferAllocation = (body) => {
		const len = body.length;
		let padding = 0;
		if (len > 0 && body.charCodeAt(len - 1) === 61) {
			padding++;
			if (len > 1 && body.charCodeAt(len - 2) === 61) padding++;
		}
		return Math.floor((len - padding) * 3 / 4);
	};
	var estimatePercentDecodedBase64Bytes = (body) => {
		const len = body.length;
		let significant = 0;
		let padding = 0;
		let invalid = false;
		for (let i = 0; i < len; i++) {
			let code = body.charCodeAt(i);
			if (code === 37 && isPercentEncodedByte(body, i, len)) {
				code = hexValue(body.charCodeAt(i + 1)) * 16 + hexValue(body.charCodeAt(i + 2));
				i += 2;
			}
			if (isBase64Whitespace(code)) continue;
			if (code === 61) {
				padding++;
				continue;
			}
			if (!isBase64Char(code) || padding > 0) {
				invalid = true;
				continue;
			}
			significant++;
		}
		if (invalid || padding > 2 || padding > 0 && (significant + padding) % 4 !== 0 || significant % 4 === 1) return estimateBase64BufferAllocation(body);
		return base64Bytes(significant);
	};
	var estimateDataURLBytes = (url, estimateBase64) => {
		if (!url || typeof url !== "string") return 0;
		if (!url.startsWith("data:")) return 0;
		const comma = url.indexOf(",");
		if (comma < 0) return 0;
		const meta = url.slice(5, comma);
		const body = url.slice(comma + 1);
		if (/;base64/i.test(meta)) return estimateBase64(body);
		let bytes = 0;
		for (let i = 0, len = body.length; i < len; i++) {
			const c = body.charCodeAt(i);
			if (c === 37 && isPercentEncodedByte(body, i, len)) {
				bytes += 1;
				i += 2;
			} else if (c < 128) bytes += 1;
			else if (c < 2048) bytes += 2;
			else if (c >= 55296 && c <= 56319 && i + 1 < len) {
				const next = body.charCodeAt(i + 1);
				if (next >= 56320 && next <= 57343) {
					bytes += 4;
					i++;
				} else bytes += 3;
			} else bytes += 3;
		}
		return bytes;
	};
	/**
	* Estimate the percent-decoded payload size used by Fetch data: URLs.
	*
	* @param {string} url
	* @returns {number}
	*/
	function estimateDataURLDecodedBytes(url) {
		const fragmentIndex = typeof url === "string" ? url.indexOf("#") : -1;
		return estimateDataURLBytes(fragmentIndex === -1 ? url : url.slice(0, fragmentIndex), estimatePercentDecodedBase64Bytes);
	}
	//#endregion
	//#region node_modules/axios/lib/env/data.js
	var VERSION = "1.20.0";
	//#endregion
	//#region node_modules/axios/lib/adapters/fetch.js
	var DEFAULT_CHUNK_SIZE = 65536;
	var DEFAULT_REQUEST_OPTIONS = {
		cache: "default",
		redirect: "follow",
		referrer: "about:client",
		referrerPolicy: "",
		mode: "cors",
		integrity: "",
		keepalive: false,
		priority: "auto",
		window: null
	};
	var { isFunction } = utils_default;
	/**
	* Encode a UTF-8 string to a Latin-1 byte string for use with btoa().
	* This is a modern replacement for the deprecated unescape(encodeURIComponent(str)) pattern.
	*
	* @param {string} str The string to encode
	*
	* @returns {string} UTF-8 bytes as a Latin-1 string
	*/
	var encodeUTF8 = (str) => encodeURIComponent(str).replace(/%([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
	var decodeURIComponentSafe = (value) => {
		if (!utils_default.isString(value)) return value;
		try {
			return decodeURIComponent(value);
		} catch (error) {
			return value;
		}
	};
	var test = (fn, ...args) => {
		try {
			return !!fn(...args);
		} catch (e) {
			return false;
		}
	};
	var maybeWithAuthCredentials = (url) => {
		const protocolIndex = url.indexOf("://");
		let urlToCheck = url;
		if (protocolIndex !== -1) urlToCheck = urlToCheck.slice(protocolIndex + 3);
		return urlToCheck.includes("@") || urlToCheck.includes(":");
	};
	var factory = (env) => {
		const globalObject = utils_default.global !== void 0 && utils_default.global !== null ? utils_default.global : globalThis;
		const { ReadableStream, TextEncoder } = globalObject;
		env = utils_default.merge.call({ skipUndefined: true }, {
			Request: globalObject.Request,
			Response: globalObject.Response
		}, env);
		const { fetch: envFetch, Request, Response } = env;
		const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
		const isRequestSupported = isFunction(Request);
		const isResponseSupported = isFunction(Response);
		if (!isFetchSupported) return false;
		const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream);
		const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
		const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
			let duplexAccessed = false;
			const request = new Request(platform_default.origin, {
				body: new ReadableStream(),
				method: "POST",
				get duplex() {
					duplexAccessed = true;
					return "half";
				}
			});
			const hasContentType = request.headers.has("Content-Type");
			if (request.body != null) request.body.cancel();
			return duplexAccessed && !hasContentType;
		});
		const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
		const resolvers = { stream: supportsResponseStream && ((res) => res.body) };
		isFetchSupported && (() => {
			[
				"text",
				"arrayBuffer",
				"blob",
				"formData",
				"stream"
			].forEach((type) => {
				!resolvers[type] && (resolvers[type] = (res, config) => {
					let method = res && res[type];
					if (method) return method.call(res);
					throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
				});
			});
		})();
		const getBodyLength = async (body) => {
			if (body == null) return 0;
			if (utils_default.isBlob(body)) return body.size;
			if (utils_default.isSpecCompliantForm(body)) return (await new Request(platform_default.origin, {
				method: "POST",
				body
			}).arrayBuffer()).byteLength;
			if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) return body.byteLength;
			if (utils_default.isURLSearchParams(body)) body = body + "";
			if (utils_default.isString(body)) return (await encodeText(body)).byteLength;
		};
		const resolveBodyLength = async (headers, body) => {
			const length = utils_default.toFiniteNumber(headers.getContentLength());
			return length == null ? getBodyLength(body) : length;
		};
		return async (config) => {
			let { url, method, data, signal, cancelToken, timeout, onDownloadProgress, onUploadProgress, responseType, headers, withCredentials = "same-origin", fetchOptions, maxContentLength, maxBodyLength, maxRedirects } = resolveConfig(config);
			const hasMaxContentLength = utils_default.isNumber(maxContentLength) && maxContentLength > -1;
			const hasMaxBodyLength = utils_default.isNumber(maxBodyLength) && maxBodyLength > -1;
			const own = (key) => utils_default.hasOwnProp(config, key) ? config[key] : void 0;
			let _fetch = envFetch || fetch;
			responseType = responseType ? (responseType + "").toLowerCase() : "text";
			let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
			let request = null;
			const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
				composedSignal.unsubscribe();
			});
			let requestContentLength;
			let pendingBodyError = null;
			const maxBodyLengthError = () => new AxiosError("Request body larger than maxBodyLength limit", AxiosError.ERR_BAD_REQUEST, config, request);
			try {
				let auth = void 0;
				const configAuth = own("auth");
				if (configAuth) auth = {
					username: utils_default.getSafeProp(configAuth, "username") || "",
					password: utils_default.getSafeProp(configAuth, "password") || ""
				};
				if (maybeWithAuthCredentials(url)) {
					const parsedURL = new URL(url, platform_default.origin);
					if (!auth && (parsedURL.username || parsedURL.password)) auth = {
						username: decodeURIComponentSafe(parsedURL.username),
						password: decodeURIComponentSafe(parsedURL.password)
					};
					if (parsedURL.username || parsedURL.password) {
						parsedURL.username = "";
						parsedURL.password = "";
						url = parsedURL.href;
					}
				}
				if (auth) {
					headers.delete("authorization");
					headers.set("Authorization", "Basic " + btoa(encodeUTF8((auth.username || "") + ":" + (auth.password || ""))));
				}
				if (hasMaxContentLength && typeof url === "string" && url.startsWith("data:")) {
					if (estimateDataURLDecodedBytes(url) > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
				}
				if (hasMaxBodyLength && method !== "get" && method !== "head") {
					const outboundLength = await getBodyLength(data);
					if (typeof outboundLength === "number" && isFinite(outboundLength)) {
						requestContentLength = outboundLength;
						if (outboundLength > maxBodyLength) throw maxBodyLengthError();
					}
				}
				const mustEnforceStreamBody = hasMaxBodyLength && (utils_default.isReadableStream(data) || utils_default.isStream(data));
				const trackRequestStream = (stream, onProgress, flush) => trackStream(stream, DEFAULT_CHUNK_SIZE, (loadedBytes) => {
					if (hasMaxBodyLength && loadedBytes > maxBodyLength) throw pendingBodyError = maxBodyLengthError();
					onProgress && onProgress(loadedBytes);
				}, flush);
				if (supportsRequestStream && method !== "get" && method !== "head" && (onUploadProgress || mustEnforceStreamBody)) {
					requestContentLength = requestContentLength == null ? await resolveBodyLength(headers, data) : requestContentLength;
					if (requestContentLength !== 0 || mustEnforceStreamBody) {
						let _request = new Request(url, {
							method: "POST",
							body: data,
							duplex: "half"
						});
						let contentTypeHeader;
						if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) headers.setContentType(contentTypeHeader);
						if (_request.body) {
							const [onProgress, flush] = onUploadProgress && progressEventDecorator(requestContentLength, progressEventReducer(asyncDecorator(onUploadProgress))) || [];
							data = trackRequestStream(_request.body, onProgress, flush);
						}
					}
				} else if (mustEnforceStreamBody && !isRequestSupported && isReadableStreamSupported && method !== "get" && method !== "head") data = trackRequestStream(data);
				else if (mustEnforceStreamBody && isRequestSupported && !supportsRequestStream && method !== "get" && method !== "head") throw new AxiosError("Stream request bodies are not supported by the current fetch implementation", AxiosError.ERR_NOT_SUPPORT, config, request);
				if (!utils_default.isString(withCredentials)) withCredentials = withCredentials ? "include" : "omit";
				const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
				if (utils_default.isFormData(data)) {
					const contentType = headers.getContentType();
					if (contentType && /^multipart\/form-data/i.test(contentType) && !/boundary=/i.test(contentType)) headers.delete("content-type");
				}
				headers.set("User-Agent", "axios/" + VERSION, false);
				const safeFetchOptions = fetchOptions == null ? fetchOptions : Object.assign(Object.create(null), fetchOptions);
				if (safeFetchOptions) {
					delete safeFetchOptions.body;
					delete safeFetchOptions.headers;
					delete safeFetchOptions.method;
					delete safeFetchOptions.signal;
					delete safeFetchOptions.duplex;
					delete safeFetchOptions.credentials;
				}
				const resolvedOptions = Object.assign(Object.create(null), safeFetchOptions, {
					signal: composedSignal,
					method: method.toUpperCase(),
					headers: toByteStringHeaderObject(headers.normalize()),
					body: data,
					duplex: "half",
					credentials: isCredentialsSupported ? withCredentials : void 0
				});
				if (isRequestSupported) {
					utils_default.forEach(DEFAULT_REQUEST_OPTIONS, (value, key) => {
						if (resolvedOptions[key] === void 0) resolvedOptions[key] = value;
					});
					if (resolvedOptions.signal === void 0) resolvedOptions.signal = null;
					if (resolvedOptions.body === void 0) resolvedOptions.body = null;
				}
				if (maxRedirects === 0) {
					resolvedOptions.redirect = "manual";
					if (safeFetchOptions) safeFetchOptions.redirect = "manual";
				}
				request = isRequestSupported && new Request(url, resolvedOptions);
				let response = await (isRequestSupported ? _fetch(request, safeFetchOptions) : _fetch(url, resolvedOptions));
				const responseHeaders = AxiosHeaders.from(response.headers);
				if (hasMaxContentLength) {
					const declaredLength = utils_default.toFiniteNumber(responseHeaders.getContentLength());
					if (declaredLength != null && declaredLength > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
				}
				const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
				if (supportsResponseStream && response.body && (onDownloadProgress || hasMaxContentLength || isStreamResponse && unsubscribe)) {
					const options = {};
					[
						"status",
						"statusText",
						"headers"
					].forEach((prop) => {
						options[prop] = response[prop];
					});
					const responseContentLength = utils_default.toFiniteNumber(responseHeaders.getContentLength());
					const [onProgress, flush] = onDownloadProgress && progressEventDecorator(responseContentLength, progressEventReducer(asyncDecorator(onDownloadProgress), true)) || [];
					let bytesRead = 0;
					const onChunkProgress = (loadedBytes) => {
						if (hasMaxContentLength) {
							bytesRead = loadedBytes;
							if (bytesRead > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
						}
						onProgress && onProgress(loadedBytes);
					};
					response = new Response(trackStream(response.body, DEFAULT_CHUNK_SIZE, onChunkProgress, () => {
						flush && flush();
						unsubscribe && unsubscribe();
					}), options);
				}
				responseType = responseType || "text";
				let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config);
				if (hasMaxContentLength && !supportsResponseStream && !isStreamResponse) {
					let materializedSize;
					if (responseData != null) {
						if (typeof responseData.byteLength === "number") materializedSize = responseData.byteLength;
						else if (typeof responseData.size === "number") materializedSize = responseData.size;
						else if (typeof responseData === "string") materializedSize = typeof TextEncoder === "function" ? new TextEncoder().encode(responseData).byteLength : responseData.length;
					}
					if (typeof materializedSize === "number" && materializedSize > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
				}
				!isStreamResponse && unsubscribe && unsubscribe();
				return await new Promise((resolve, reject) => {
					settle(resolve, reject, {
						data: responseData,
						headers: AxiosHeaders.from(response.headers),
						status: response.status,
						statusText: response.statusText,
						config,
						request
					});
				});
			} catch (err) {
				unsubscribe && unsubscribe();
				if (composedSignal && composedSignal.aborted && composedSignal.reason instanceof AxiosError) {
					const canceledError = composedSignal.reason;
					canceledError.config = config;
					request && (canceledError.request = request);
					if (err !== canceledError) Object.defineProperty(canceledError, "cause", {
						__proto__: null,
						value: err,
						writable: true,
						enumerable: false,
						configurable: true
					});
					throw canceledError;
				}
				if (pendingBodyError) {
					request && !pendingBodyError.request && (pendingBodyError.request = request);
					throw pendingBodyError;
				}
				if (err instanceof AxiosError) {
					request && !err.request && (err.request = request);
					throw err;
				}
				if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
					const networkError = new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request, err && err.response);
					Object.defineProperty(networkError, "cause", {
						__proto__: null,
						value: err.cause || err,
						writable: true,
						enumerable: false,
						configurable: true
					});
					throw networkError;
				}
				throw AxiosError.from(err, err && err.code, config, request, err && err.response);
			}
		};
	};
	var seedCache = /* @__PURE__ */ new Map();
	var getFetch = (config) => {
		let env = config && config.env || {};
		const { fetch, Request, Response } = env;
		const seeds = [
			Request,
			Response,
			fetch
		];
		let i = seeds.length, seed, target, map = seedCache;
		while (i--) {
			seed = seeds[i];
			target = map.get(seed);
			target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
			map = target;
		}
		return target;
	};
	getFetch();
	//#endregion
	//#region node_modules/axios/lib/adapters/adapters.js
	/**
	* Known adapters mapping.
	* Provides environment-specific adapters for Axios:
	* - `http` for Node.js
	* - `xhr` for browsers
	* - `fetch` for fetch API-based requests
	*
	* @type {Object<string, Function|Object>}
	*/
	var knownAdapters = {
		http: null,
		xhr: xhr_default,
		fetch: { get: getFetch }
	};
	utils_default.forEach(knownAdapters, (fn, value) => {
		if (fn) {
			try {
				Object.defineProperty(fn, "name", {
					__proto__: null,
					value
				});
			} catch (e) {}
			Object.defineProperty(fn, "adapterName", {
				__proto__: null,
				value
			});
		}
	});
	/**
	* Render a rejection reason string for unknown or unsupported adapters
	*
	* @param {string} reason
	* @returns {string}
	*/
	var renderReason = (reason) => `- ${reason}`;
	/**
	* Check if the adapter is resolved (function, null, or false)
	*
	* @param {Function|null|false} adapter
	* @returns {boolean}
	*/
	var isResolvedHandle = (adapter) => utils_default.isFunction(adapter) || adapter === null || adapter === false;
	/**
	* Get the first suitable adapter from the provided list.
	* Tries each adapter in order until a supported one is found.
	* Throws an AxiosError if no adapter is suitable.
	*
	* @param {Array<string|Function>|string|Function} adapters - Adapter(s) by name or function.
	* @param {Object} config - Axios request configuration
	* @throws {AxiosError} If no suitable adapter is available
	* @returns {Function} The resolved adapter function
	*/
	function getAdapter(adapters, config) {
		adapters = utils_default.isArray(adapters) ? adapters : [adapters];
		const { length } = adapters;
		let nameOrAdapter;
		let adapter;
		const rejectedReasons = {};
		for (let i = 0; i < length; i++) {
			nameOrAdapter = adapters[i];
			let id;
			adapter = nameOrAdapter;
			if (!isResolvedHandle(nameOrAdapter)) {
				adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
				if (adapter === void 0) throw new AxiosError(`Unknown adapter '${id}'`);
			}
			if (adapter && (utils_default.isFunction(adapter) || (adapter = adapter.get(config)))) break;
			rejectedReasons[id || "#" + i] = adapter;
		}
		if (!adapter) {
			const reasons = Object.entries(rejectedReasons).map(([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build"));
			throw new AxiosError(`There is no suitable adapter to dispatch the request ` + (length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified"), AxiosError.ERR_NOT_SUPPORT);
		}
		return adapter;
	}
	/**
	* Exports Axios adapters and utility to resolve an adapter
	*/
	var adapters_default = {
		/**
		* Resolve an adapter from a list of adapter names or functions.
		* @type {Function}
		*/
		getAdapter,
		/**
		* Exposes all known adapters
		* @type {Object<string, Function|Object>}
		*/
		adapters: knownAdapters
	};
	//#endregion
	//#region node_modules/axios/lib/core/dispatchRequest.js
	/**
	* Throws a `CanceledError` if cancellation has been requested.
	*
	* @param {Object} config The config that is to be used for the request
	*
	* @returns {void}
	*/
	function throwIfCancellationRequested(config) {
		if (config.cancelToken) config.cancelToken.throwIfRequested();
		if (config.signal && config.signal.aborted) throw new CanceledError(null, config);
	}
	/**
	* Dispatch a request to the server using the configured adapter.
	*
	* @param {object} config The config that is to be used for the request
	*
	* @returns {Promise} The Promise to be fulfilled
	*/
	function dispatchRequest(_config) {
		const config = utils_default.toSafeFlatObject(_config);
		throwIfCancellationRequested(config);
		config.headers = AxiosHeaders.from(utils_default.getSafeProp(config, "headers"));
		config.data = transformData.call(config, config.transformRequest);
		if ([
			"post",
			"put",
			"patch"
		].indexOf(config.method) !== -1) config.headers.setContentType("application/x-www-form-urlencoded", false);
		return adapters_default.getAdapter(config.adapter || defaults.adapter, config)(config).then(function onAdapterResolution(response) {
			throwIfCancellationRequested(config);
			config.response = response;
			try {
				response.data = transformData.call(config, config.transformResponse, response);
			} finally {
				delete config.response;
			}
			response.headers = AxiosHeaders.from(response.headers);
			return response;
		}, function onAdapterRejection(reason) {
			if (!isCancel(reason)) {
				throwIfCancellationRequested(config);
				if (reason && reason.response) {
					config.response = reason.response;
					try {
						reason.response.data = transformData.call(config, config.transformResponse, reason.response);
					} finally {
						delete config.response;
					}
					reason.response.headers = AxiosHeaders.from(reason.response.headers);
				}
			}
			return Promise.reject(reason);
		});
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/validator.js
	var validators$1 = {};
	[
		"object",
		"boolean",
		"number",
		"function",
		"string",
		"symbol"
	].forEach((type, i) => {
		validators$1[type] = function validator(thing) {
			return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
		};
	});
	var deprecatedWarnings = {};
	/**
	* Transitional option validator
	*
	* @param {function|boolean?} validator - set to false if the transitional option has been removed
	* @param {string?} version - deprecated version / removed since version
	* @param {string?} message - some message with additional info
	*
	* @returns {function}
	*/
	validators$1.transitional = function transitional(validator, version, message) {
		function formatMessage(opt, desc) {
			return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
		}
		return (value, opt, opts) => {
			if (validator === false) throw new AxiosError(formatMessage(opt, " has been removed" + (version ? " in " + version : "")), AxiosError.ERR_DEPRECATED);
			if (version && !deprecatedWarnings[opt]) {
				deprecatedWarnings[opt] = true;
				console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
			}
			return validator ? validator(value, opt, opts) : true;
		};
	};
	validators$1.spelling = function spelling(correctSpelling) {
		return (value, opt) => {
			console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
			return true;
		};
	};
	/**
	* Assert object's properties type
	*
	* @param {object} options
	* @param {object} schema
	* @param {boolean?} allowUnknown
	*
	* @returns {object}
	*/
	function assertOptions(options, schema, allowUnknown) {
		if (typeof options !== "object" || options === null) throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
		const keys = Object.keys(options);
		let i = keys.length;
		while (i-- > 0) {
			const opt = keys[i];
			const validator = Object.prototype.hasOwnProperty.call(schema, opt) ? schema[opt] : void 0;
			if (validator) {
				const value = options[opt];
				const result = value === void 0 || validator(value, opt, options);
				if (result !== true) throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
				continue;
			}
			if (allowUnknown !== true) throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
		}
	}
	var validator_default = {
		assertOptions,
		validators: validators$1
	};
	//#endregion
	//#region node_modules/axios/lib/core/Axios.js
	var validators = validator_default.validators;
	/**
	* Create a new instance of Axios
	*
	* @param {Object} instanceConfig The default config for the instance
	*
	* @return {Axios} A new instance of Axios
	*/
	var Axios = class {
		constructor(instanceConfig) {
			this.defaults = instanceConfig || {};
			this.interceptors = {
				request: new InterceptorManager(),
				response: new InterceptorManager()
			};
		}
		/**
		* Dispatch a request
		*
		* @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
		* @param {?Object} config
		*
		* @returns {Promise} The Promise to be fulfilled
		*/
		async request(configOrUrl, config) {
			try {
				return await this._request(configOrUrl, config);
			} catch (err) {
				if (err instanceof Error) try {
					let dummy = {};
					Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = /* @__PURE__ */ new Error();
					const dummyStack = dummy.stack;
					let stack = "";
					if (typeof dummyStack === "string") {
						const firstNewlineIndex = dummyStack.indexOf("\n");
						stack = firstNewlineIndex === -1 ? "" : dummyStack.slice(firstNewlineIndex + 1);
					}
					if (!err.stack) err.stack = stack;
					else if (stack) {
						const firstNewlineIndex = stack.indexOf("\n");
						const secondNewlineIndex = firstNewlineIndex === -1 ? -1 : stack.indexOf("\n", firstNewlineIndex + 1);
						const stackWithoutTwoTopLines = secondNewlineIndex === -1 ? "" : stack.slice(secondNewlineIndex + 1);
						if (!String(err.stack).endsWith(stackWithoutTwoTopLines)) err.stack += "\n" + stack;
					}
				} catch (e) {}
				throw err;
			}
		}
		_request(configOrUrl, config) {
			if (typeof configOrUrl === "string") {
				config = config || {};
				config.url = configOrUrl;
			} else config = configOrUrl || {};
			config = mergeConfig(this.defaults, config);
			const { transitional, paramsSerializer, headers } = config;
			if (transitional !== void 0) validator_default.assertOptions(transitional, {
				silentJSONParsing: validators.transitional(validators.boolean),
				forcedJSONParsing: validators.transitional(validators.boolean),
				clarifyTimeoutError: validators.transitional(validators.boolean),
				legacyInterceptorReqResOrdering: validators.transitional(validators.boolean),
				advertiseZstdAcceptEncoding: validators.transitional(validators.boolean),
				validateStatusUndefinedResolves: validators.transitional(validators.boolean)
			}, false);
			if (paramsSerializer != null) {
				if (utils_default.isFunction(paramsSerializer)) config.paramsSerializer = { serialize: paramsSerializer };
				else validator_default.assertOptions(paramsSerializer, {
					encode: validators.function,
					serialize: validators.function
				}, true);
			}
			if (config.allowAbsoluteUrls !== void 0) {} else if (this.defaults.allowAbsoluteUrls !== void 0) config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
			else config.allowAbsoluteUrls = true;
			validator_default.assertOptions(config, {
				baseUrl: validators.spelling("baseURL"),
				withXsrfToken: validators.spelling("withXSRFToken")
			}, true);
			config.method = (utils_default.getSafeProp(config, "method") || utils_default.getSafeProp(this.defaults, "method") || "get").toLowerCase();
			let contextHeaders = headers && utils_default.merge(headers.common, headers[config.method]);
			headers && utils_default.forEach(methodList.concat("common"), (method) => {
				delete headers[method];
			});
			config.headers = AxiosHeaders.concat(contextHeaders, headers);
			const requestInterceptorChain = [];
			let synchronousRequestInterceptors = true;
			this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
				if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) return;
				synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
				const transitional = config.transitional || transitional_default;
				if (transitional && transitional.legacyInterceptorReqResOrdering) requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
				else requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
			});
			const responseInterceptorChain = [];
			this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
				responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
			});
			let promise;
			let i = 0;
			let len;
			if (!synchronousRequestInterceptors) {
				const chain = [dispatchRequest.bind(this), void 0];
				chain.unshift(...requestInterceptorChain);
				chain.push(...responseInterceptorChain);
				len = chain.length;
				promise = Promise.resolve(config);
				while (i < len) promise = promise.then(chain[i++], chain[i++]);
				return promise;
			}
			len = requestInterceptorChain.length;
			let newConfig = config;
			while (i < len) {
				const onFulfilled = requestInterceptorChain[i++];
				const onRejected = requestInterceptorChain[i++];
				try {
					newConfig = onFulfilled ? onFulfilled(newConfig) : newConfig;
				} catch (error) {
					if (!onRejected) {
						promise = Promise.reject(error);
						break;
					}
					try {
						const rejectedResult = onRejected.call(this, error);
						if (utils_default.isThenable(rejectedResult)) promise = Promise.resolve(rejectedResult).then(() => dispatchRequest.call(this, newConfig));
					} catch (rejectedError) {
						promise = Promise.reject(rejectedError);
					}
					break;
				}
			}
			if (!promise) try {
				promise = dispatchRequest.call(this, newConfig);
			} catch (error) {
				promise = Promise.reject(error);
			}
			i = 0;
			len = responseInterceptorChain.length;
			while (i < len) promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
			return promise;
		}
		getUri(config) {
			config = mergeConfig(this.defaults, config);
			return buildURL(buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls, config), config.params, config.paramsSerializer);
		}
	};
	utils_default.forEach([
		"delete",
		"get",
		"head",
		"options"
	], function forEachMethodNoData(method) {
		Axios.prototype[method] = function(url, config) {
			return this.request(mergeConfig(config || {}, {
				method,
				url,
				data: config && utils_default.hasOwnProp(config, "data") ? config.data : void 0
			}));
		};
	});
	utils_default.forEach([
		"post",
		"put",
		"patch",
		"query"
	], function forEachMethodWithData(method) {
		function generateHTTPMethod(isForm) {
			return function httpMethod(url, data, config) {
				return this.request(mergeConfig(config || {}, {
					method,
					headers: isForm ? { "Content-Type": "multipart/form-data" } : {},
					url,
					data
				}));
			};
		}
		Axios.prototype[method] = generateHTTPMethod();
		if (method !== "query") Axios.prototype[method + "Form"] = generateHTTPMethod(true);
	});
	//#endregion
	//#region node_modules/axios/lib/cancel/CancelToken.js
	/**
	* A `CancelToken` is an object that can be used to request cancellation of an operation.
	*
	* @param {Function} executor The executor function.
	*
	* @returns {CancelToken}
	*/
	var CancelToken = class CancelToken {
		constructor(executor) {
			if (typeof executor !== "function") throw new TypeError("executor must be a function.");
			let resolvePromise;
			this.promise = new Promise(function promiseExecutor(resolve) {
				resolvePromise = resolve;
			});
			const token = this;
			this.promise.then((cancel) => {
				if (!token._listeners) return;
				let i = token._listeners.length;
				while (i-- > 0) token._listeners[i](cancel);
				token._listeners = null;
			});
			this.promise.then = (onfulfilled) => {
				let _resolve;
				const promise = new Promise((resolve) => {
					token.subscribe(resolve);
					_resolve = resolve;
				}).then(onfulfilled);
				promise.cancel = function reject() {
					token.unsubscribe(_resolve);
				};
				return promise;
			};
			executor(function cancel(message, config, request) {
				if (token.reason) return;
				token.reason = new CanceledError(message, config, request);
				resolvePromise(token.reason);
			});
		}
		/**
		* Throws a `CanceledError` if cancellation has been requested.
		*/
		throwIfRequested() {
			if (this.reason) throw this.reason;
		}
		/**
		* Subscribe to the cancel signal
		*/
		subscribe(listener) {
			if (this.reason) {
				listener(this.reason);
				return;
			}
			if (this._listeners) this._listeners.push(listener);
			else this._listeners = [listener];
		}
		/**
		* Unsubscribe from the cancel signal
		*/
		unsubscribe(listener) {
			if (!this._listeners) return;
			const index = this._listeners.indexOf(listener);
			if (index !== -1) this._listeners.splice(index, 1);
		}
		toAbortSignal() {
			const controller = new AbortController();
			const abort = (err) => {
				controller.abort(err);
			};
			this.subscribe(abort);
			controller.signal.unsubscribe = () => this.unsubscribe(abort);
			return controller.signal;
		}
		/**
		* Returns an object that contains a new `CancelToken` and a function that, when called,
		* cancels the `CancelToken`.
		*/
		static source() {
			let cancel;
			return {
				token: new CancelToken(function executor(c) {
					cancel = c;
				}),
				cancel
			};
		}
	};
	//#endregion
	//#region node_modules/axios/lib/helpers/spread.js
	/**
	* Syntactic sugar for invoking a function and expanding an array for arguments.
	*
	* Common use case would be to use `Function.prototype.apply`.
	*
	*  ```js
	*  function f(x, y, z) {}
	*  const args = [1, 2, 3];
	*  f.apply(null, args);
	*  ```
	*
	* With `spread` this example can be re-written.
	*
	*  ```js
	*  spread(function(x, y, z) {})([1, 2, 3]);
	*  ```
	*
	* @param {Function} callback
	*
	* @returns {Function}
	*/
	function spread(callback) {
		return function wrap(arr) {
			return callback.apply(null, arr);
		};
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/isAxiosError.js
	/**
	* Determines whether the payload is an error thrown by Axios
	*
	* @param {*} payload The value to test
	*
	* @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
	*/
	function isAxiosError(payload) {
		return utils_default.isObject(payload) && payload.isAxiosError === true;
	}
	//#endregion
	//#region node_modules/axios/lib/helpers/HttpStatusCode.js
	var HttpStatusCode = {
		Continue: 100,
		SwitchingProtocols: 101,
		Processing: 102,
		EarlyHints: 103,
		Ok: 200,
		Created: 201,
		Accepted: 202,
		NonAuthoritativeInformation: 203,
		NoContent: 204,
		ResetContent: 205,
		PartialContent: 206,
		MultiStatus: 207,
		AlreadyReported: 208,
		ImUsed: 226,
		MultipleChoices: 300,
		MovedPermanently: 301,
		Found: 302,
		SeeOther: 303,
		NotModified: 304,
		UseProxy: 305,
		Unused: 306,
		TemporaryRedirect: 307,
		PermanentRedirect: 308,
		BadRequest: 400,
		Unauthorized: 401,
		PaymentRequired: 402,
		Forbidden: 403,
		NotFound: 404,
		MethodNotAllowed: 405,
		NotAcceptable: 406,
		ProxyAuthenticationRequired: 407,
		RequestTimeout: 408,
		Conflict: 409,
		Gone: 410,
		LengthRequired: 411,
		PreconditionFailed: 412,
		/**
		* @deprecated Use `ContentTooLarge` instead.
		*/
		PayloadTooLarge: 413,
		ContentTooLarge: 413,
		UriTooLong: 414,
		UnsupportedMediaType: 415,
		RangeNotSatisfiable: 416,
		ExpectationFailed: 417,
		ImATeapot: 418,
		MisdirectedRequest: 421,
		/**
		* @deprecated Use `UnprocessableContent` instead.
		*/
		UnprocessableEntity: 422,
		UnprocessableContent: 422,
		Locked: 423,
		FailedDependency: 424,
		TooEarly: 425,
		UpgradeRequired: 426,
		PreconditionRequired: 428,
		TooManyRequests: 429,
		RequestHeaderFieldsTooLarge: 431,
		UnavailableForLegalReasons: 451,
		InternalServerError: 500,
		NotImplemented: 501,
		BadGateway: 502,
		ServiceUnavailable: 503,
		GatewayTimeout: 504,
		HttpVersionNotSupported: 505,
		VariantAlsoNegotiates: 506,
		InsufficientStorage: 507,
		LoopDetected: 508,
		NotExtended: 510,
		NetworkAuthenticationRequired: 511,
		WebServerReturnsAnUnknownError: 520,
		WebServerIsDown: 521,
		ConnectionTimedOut: 522,
		OriginIsUnreachable: 523,
		TimeoutOccurred: 524,
		SslHandshakeFailed: 525,
		InvalidSslCertificate: 526
	};
	Object.entries(HttpStatusCode).forEach(([key, value]) => {
		if (HttpStatusCode[value] === void 0) HttpStatusCode[value] = key;
	});
	//#endregion
	//#region node_modules/axios/lib/axios.js
	/**
	* Create an instance of Axios
	*
	* @param {Object} defaultConfig The default config for the instance
	*
	* @returns {Axios} A new instance of Axios
	*/
	function createInstance(defaultConfig) {
		const context = new Axios(defaultConfig);
		const instance = bind(Axios.prototype.request, context);
		utils_default.extend(instance, Axios.prototype, context, { allOwnKeys: true });
		utils_default.extend(instance, context, null, { allOwnKeys: true });
		instance.create = function create(instanceConfig) {
			return createInstance(mergeConfig(defaultConfig, instanceConfig));
		};
		return instance;
	}
	var axios = createInstance(defaults);
	axios.Axios = Axios;
	axios.CanceledError = CanceledError;
	axios.CancelToken = CancelToken;
	axios.isCancel = isCancel;
	axios.VERSION = VERSION;
	axios.toFormData = toFormData;
	axios.AxiosError = AxiosError;
	axios.Cancel = axios.CanceledError;
	axios.all = function all(promises) {
		return Promise.all(promises);
	};
	axios.spread = spread;
	axios.isAxiosError = isAxiosError;
	axios.mergeConfig = mergeConfig;
	axios.AxiosHeaders = AxiosHeaders;
	axios.formToJSON = (thing) => formDataToJSON(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
	axios.getAdapter = adapters_default.getAdapter;
	axios.HttpStatusCode = HttpStatusCode;
	axios.default = axios;
	//#endregion
	//#region node_modules/lodash/lodash.js
	var require_lodash = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		/**
		* @license
		* Lodash <https://lodash.com/>
		* Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
		* Released under MIT license <https://lodash.com/license>
		* Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
		* Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
		*/
		(function() {
			/** Used as a safe reference for `undefined` in pre-ES5 environments. */
			var undefined;
			/** Used as the semantic version number. */
			var VERSION = "4.18.1";
			/** Used as the size to enable large array optimizations. */
			var LARGE_ARRAY_SIZE = 200;
			/** Error message constants. */
			var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`", INVALID_TEMPL_IMPORTS_ERROR_TEXT = "Invalid `imports` option passed into `_.template`";
			/** Used to stand-in for `undefined` hash values. */
			var HASH_UNDEFINED = "__lodash_hash_undefined__";
			/** Used as the maximum memoize cache size. */
			var MAX_MEMOIZE_SIZE = 500;
			/** Used as the internal argument placeholder. */
			var PLACEHOLDER = "__lodash_placeholder__";
			/** Used to compose bitmasks for cloning. */
			var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
			/** Used to compose bitmasks for value comparisons. */
			var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
			/** Used to compose bitmasks for function metadata. */
			var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
			/** Used as default options for `_.truncate`. */
			var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
			/** Used to detect hot functions by number of calls within a span of milliseconds. */
			var HOT_COUNT = 800, HOT_SPAN = 16;
			/** Used to indicate the type of lazy iteratees. */
			var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
			/** Used as references for various `Number` constants. */
			var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = NaN;
			/** Used as references for the maximum length and index of an array. */
			var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
			/** Used to associate wrap methods with their bit flags. */
			var wrapFlags = [
				["ary", WRAP_ARY_FLAG],
				["bind", WRAP_BIND_FLAG],
				["bindKey", WRAP_BIND_KEY_FLAG],
				["curry", WRAP_CURRY_FLAG],
				["curryRight", WRAP_CURRY_RIGHT_FLAG],
				["flip", WRAP_FLIP_FLAG],
				["partial", WRAP_PARTIAL_FLAG],
				["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
				["rearg", WRAP_REARG_FLAG]
			];
			/** `Object#toString` result references. */
			var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
			var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
			/** Used to match empty string literals in compiled template source. */
			var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
			/** Used to match HTML entities and HTML characters. */
			var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
			/** Used to match template delimiters. */
			var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
			/** Used to match property names within property paths. */
			var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
			/**
			* Used to match `RegExp`
			* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
			*/
			var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
			/** Used to match leading whitespace. */
			var reTrimStart = /^\s+/;
			/** Used to match a single whitespace character. */
			var reWhitespace = /\s/;
			/** Used to match wrap detail comments. */
			var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
			/** Used to match words composed of alphanumeric characters. */
			var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
			/**
			* Used to validate the `validate` option in `_.template` variable.
			*
			* Forbids characters which could potentially change the meaning of the function argument definition:
			* - "()," (modification of function parameters)
			* - "=" (default value)
			* - "[]{}" (destructuring of function parameters)
			* - "/" (beginning of a comment)
			* - whitespace
			*/
			var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
			/** Used to match backslashes in property paths. */
			var reEscapeChar = /\\(\\)?/g;
			/**
			* Used to match
			* [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
			*/
			var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
			/** Used to match `RegExp` flags from their coerced string values. */
			var reFlags = /\w*$/;
			/** Used to detect bad signed hexadecimal string values. */
			var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
			/** Used to detect binary string values. */
			var reIsBinary = /^0b[01]+$/i;
			/** Used to detect host constructors (Safari). */
			var reIsHostCtor = /^\[object .+?Constructor\]$/;
			/** Used to detect octal string values. */
			var reIsOctal = /^0o[0-7]+$/i;
			/** Used to detect unsigned integer values. */
			var reIsUint = /^(?:0|[1-9]\d*)$/;
			/** Used to match Latin Unicode letters (excluding mathematical operators). */
			var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
			/** Used to ensure capturing order of template delimiters. */
			var reNoMatch = /($^)/;
			/** Used to match unescaped characters in compiled string literals. */
			var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
			/** Used to compose unicode character classes. */
			var rsAstralRange = "\\ud800-\\udfff", rsComboRange = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff", rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
			/** Used to compose unicode capture groups. */
			var rsApos = "['’]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
			/** Used to compose unicode regexes. */
			var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [
				rsNonAstral,
				rsRegional,
				rsSurrPair
			].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [
				rsDingbat,
				rsRegional,
				rsSurrPair
			].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [
				rsNonAstral + rsCombo + "?",
				rsCombo,
				rsRegional,
				rsSurrPair,
				rsAstral
			].join("|") + ")";
			/** Used to match apostrophes. */
			var reApos = RegExp(rsApos, "g");
			/**
			* Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
			* [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
			*/
			var reComboMark = RegExp(rsCombo, "g");
			/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
			var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
			/** Used to match complex or compound words. */
			var reUnicodeWord = RegExp([
				rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [
					rsBreak,
					rsUpper,
					"$"
				].join("|") + ")",
				rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [
					rsBreak,
					rsUpper + rsMiscLower,
					"$"
				].join("|") + ")",
				rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
				rsUpper + "+" + rsOptContrUpper,
				rsOrdUpper,
				rsOrdLower,
				rsDigits,
				rsEmoji
			].join("|"), "g");
			/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
			var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
			/** Used to detect strings that need a more robust regexp to match words. */
			var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
			/** Used to assign default `context` object properties. */
			var contextProps = [
				"Array",
				"Buffer",
				"DataView",
				"Date",
				"Error",
				"Float32Array",
				"Float64Array",
				"Function",
				"Int8Array",
				"Int16Array",
				"Int32Array",
				"Map",
				"Math",
				"Object",
				"Promise",
				"RegExp",
				"Set",
				"String",
				"Symbol",
				"TypeError",
				"Uint8Array",
				"Uint8ClampedArray",
				"Uint16Array",
				"Uint32Array",
				"WeakMap",
				"_",
				"clearTimeout",
				"isFinite",
				"parseInt",
				"setTimeout"
			];
			/** Used to make template sourceURLs easier to identify. */
			var templateCounter = -1;
			/** Used to identify `toStringTag` values of typed arrays. */
			var typedArrayTags = {};
			typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
			typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
			/** Used to identify `toStringTag` values supported by `_.clone`. */
			var cloneableTags = {};
			cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
			cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
			/** Used to map Latin Unicode letters to basic Latin letters. */
			var deburredLetters = {
				"À": "A",
				"Á": "A",
				"Â": "A",
				"Ã": "A",
				"Ä": "A",
				"Å": "A",
				"à": "a",
				"á": "a",
				"â": "a",
				"ã": "a",
				"ä": "a",
				"å": "a",
				"Ç": "C",
				"ç": "c",
				"Ð": "D",
				"ð": "d",
				"È": "E",
				"É": "E",
				"Ê": "E",
				"Ë": "E",
				"è": "e",
				"é": "e",
				"ê": "e",
				"ë": "e",
				"Ì": "I",
				"Í": "I",
				"Î": "I",
				"Ï": "I",
				"ì": "i",
				"í": "i",
				"î": "i",
				"ï": "i",
				"Ñ": "N",
				"ñ": "n",
				"Ò": "O",
				"Ó": "O",
				"Ô": "O",
				"Õ": "O",
				"Ö": "O",
				"Ø": "O",
				"ò": "o",
				"ó": "o",
				"ô": "o",
				"õ": "o",
				"ö": "o",
				"ø": "o",
				"Ù": "U",
				"Ú": "U",
				"Û": "U",
				"Ü": "U",
				"ù": "u",
				"ú": "u",
				"û": "u",
				"ü": "u",
				"Ý": "Y",
				"ý": "y",
				"ÿ": "y",
				"Æ": "Ae",
				"æ": "ae",
				"Þ": "Th",
				"þ": "th",
				"ß": "ss",
				"Ā": "A",
				"Ă": "A",
				"Ą": "A",
				"ā": "a",
				"ă": "a",
				"ą": "a",
				"Ć": "C",
				"Ĉ": "C",
				"Ċ": "C",
				"Č": "C",
				"ć": "c",
				"ĉ": "c",
				"ċ": "c",
				"č": "c",
				"Ď": "D",
				"Đ": "D",
				"ď": "d",
				"đ": "d",
				"Ē": "E",
				"Ĕ": "E",
				"Ė": "E",
				"Ę": "E",
				"Ě": "E",
				"ē": "e",
				"ĕ": "e",
				"ė": "e",
				"ę": "e",
				"ě": "e",
				"Ĝ": "G",
				"Ğ": "G",
				"Ġ": "G",
				"Ģ": "G",
				"ĝ": "g",
				"ğ": "g",
				"ġ": "g",
				"ģ": "g",
				"Ĥ": "H",
				"Ħ": "H",
				"ĥ": "h",
				"ħ": "h",
				"Ĩ": "I",
				"Ī": "I",
				"Ĭ": "I",
				"Į": "I",
				"İ": "I",
				"ĩ": "i",
				"ī": "i",
				"ĭ": "i",
				"į": "i",
				"ı": "i",
				"Ĵ": "J",
				"ĵ": "j",
				"Ķ": "K",
				"ķ": "k",
				"ĸ": "k",
				"Ĺ": "L",
				"Ļ": "L",
				"Ľ": "L",
				"Ŀ": "L",
				"Ł": "L",
				"ĺ": "l",
				"ļ": "l",
				"ľ": "l",
				"ŀ": "l",
				"ł": "l",
				"Ń": "N",
				"Ņ": "N",
				"Ň": "N",
				"Ŋ": "N",
				"ń": "n",
				"ņ": "n",
				"ň": "n",
				"ŋ": "n",
				"Ō": "O",
				"Ŏ": "O",
				"Ő": "O",
				"ō": "o",
				"ŏ": "o",
				"ő": "o",
				"Ŕ": "R",
				"Ŗ": "R",
				"Ř": "R",
				"ŕ": "r",
				"ŗ": "r",
				"ř": "r",
				"Ś": "S",
				"Ŝ": "S",
				"Ş": "S",
				"Š": "S",
				"ś": "s",
				"ŝ": "s",
				"ş": "s",
				"š": "s",
				"Ţ": "T",
				"Ť": "T",
				"Ŧ": "T",
				"ţ": "t",
				"ť": "t",
				"ŧ": "t",
				"Ũ": "U",
				"Ū": "U",
				"Ŭ": "U",
				"Ů": "U",
				"Ű": "U",
				"Ų": "U",
				"ũ": "u",
				"ū": "u",
				"ŭ": "u",
				"ů": "u",
				"ű": "u",
				"ų": "u",
				"Ŵ": "W",
				"ŵ": "w",
				"Ŷ": "Y",
				"ŷ": "y",
				"Ÿ": "Y",
				"Ź": "Z",
				"Ż": "Z",
				"Ž": "Z",
				"ź": "z",
				"ż": "z",
				"ž": "z",
				"Ĳ": "IJ",
				"ĳ": "ij",
				"Œ": "Oe",
				"œ": "oe",
				"ŉ": "'n",
				"ſ": "s"
			};
			/** Used to map characters to HTML entities. */
			var htmlEscapes = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				"\"": "&quot;",
				"'": "&#39;"
			};
			/** Used to map HTML entities to characters. */
			var htmlUnescapes = {
				"&amp;": "&",
				"&lt;": "<",
				"&gt;": ">",
				"&quot;": "\"",
				"&#39;": "'"
			};
			/** Used to escape characters for inclusion in compiled string literals. */
			var stringEscapes = {
				"\\": "\\",
				"'": "'",
				"\n": "n",
				"\r": "r",
				"\u2028": "u2028",
				"\u2029": "u2029"
			};
			/** Built-in method references without a dependency on `root`. */
			var freeParseFloat = parseFloat, freeParseInt = parseInt;
			/** Detect free variable `global` from Node.js. */
			var freeGlobal = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis;
			/** Detect free variable `self`. */
			var freeSelf = typeof self == "object" && self && self.Object === Object && self;
			/** Used as a reference to the global object. */
			var root = freeGlobal || freeSelf || Function("return this")();
			/** Detect free variable `exports`. */
			var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
			/** Detect free variable `module`. */
			var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
			/** Detect the popular CommonJS extension `module.exports`. */
			var moduleExports = freeModule && freeModule.exports === freeExports;
			/** Detect free variable `process` from Node.js. */
			var freeProcess = moduleExports && freeGlobal.process;
			/** Used to access faster Node.js helpers. */
			var nodeUtil = function() {
				try {
					var types = freeModule && freeModule.require && freeModule.require("util").types;
					if (types) return types;
					return freeProcess && freeProcess.binding && freeProcess.binding("util");
				} catch (e) {}
			}();
			var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
			/**
			* A faster alternative to `Function#apply`, this function invokes `func`
			* with the `this` binding of `thisArg` and the arguments of `args`.
			*
			* @private
			* @param {Function} func The function to invoke.
			* @param {*} thisArg The `this` binding of `func`.
			* @param {Array} args The arguments to invoke `func` with.
			* @returns {*} Returns the result of `func`.
			*/
			function apply(func, thisArg, args) {
				switch (args.length) {
					case 0: return func.call(thisArg);
					case 1: return func.call(thisArg, args[0]);
					case 2: return func.call(thisArg, args[0], args[1]);
					case 3: return func.call(thisArg, args[0], args[1], args[2]);
				}
				return func.apply(thisArg, args);
			}
			/**
			* A specialized version of `baseAggregator` for arrays.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} setter The function to set `accumulator` values.
			* @param {Function} iteratee The iteratee to transform keys.
			* @param {Object} accumulator The initial aggregated object.
			* @returns {Function} Returns `accumulator`.
			*/
			function arrayAggregator(array, setter, iteratee, accumulator) {
				var index = -1, length = array == null ? 0 : array.length;
				while (++index < length) {
					var value = array[index];
					setter(accumulator, value, iteratee(value), array);
				}
				return accumulator;
			}
			/**
			* A specialized version of `_.forEach` for arrays without support for
			* iteratee shorthands.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Array} Returns `array`.
			*/
			function arrayEach(array, iteratee) {
				var index = -1, length = array == null ? 0 : array.length;
				while (++index < length) if (iteratee(array[index], index, array) === false) break;
				return array;
			}
			/**
			* A specialized version of `_.forEachRight` for arrays without support for
			* iteratee shorthands.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Array} Returns `array`.
			*/
			function arrayEachRight(array, iteratee) {
				var length = array == null ? 0 : array.length;
				while (length--) if (iteratee(array[length], length, array) === false) break;
				return array;
			}
			/**
			* A specialized version of `_.every` for arrays without support for
			* iteratee shorthands.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} predicate The function invoked per iteration.
			* @returns {boolean} Returns `true` if all elements pass the predicate check,
			*  else `false`.
			*/
			function arrayEvery(array, predicate) {
				var index = -1, length = array == null ? 0 : array.length;
				while (++index < length) if (!predicate(array[index], index, array)) return false;
				return true;
			}
			/**
			* A specialized version of `_.filter` for arrays without support for
			* iteratee shorthands.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} predicate The function invoked per iteration.
			* @returns {Array} Returns the new filtered array.
			*/
			function arrayFilter(array, predicate) {
				var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
				while (++index < length) {
					var value = array[index];
					if (predicate(value, index, array)) result[resIndex++] = value;
				}
				return result;
			}
			/**
			* A specialized version of `_.includes` for arrays without support for
			* specifying an index to search from.
			*
			* @private
			* @param {Array} [array] The array to inspect.
			* @param {*} target The value to search for.
			* @returns {boolean} Returns `true` if `target` is found, else `false`.
			*/
			function arrayIncludes(array, value) {
				return !!(array == null ? 0 : array.length) && baseIndexOf(array, value, 0) > -1;
			}
			/**
			* This function is like `arrayIncludes` except that it accepts a comparator.
			*
			* @private
			* @param {Array} [array] The array to inspect.
			* @param {*} target The value to search for.
			* @param {Function} comparator The comparator invoked per element.
			* @returns {boolean} Returns `true` if `target` is found, else `false`.
			*/
			function arrayIncludesWith(array, value, comparator) {
				var index = -1, length = array == null ? 0 : array.length;
				while (++index < length) if (comparator(value, array[index])) return true;
				return false;
			}
			/**
			* A specialized version of `_.map` for arrays without support for iteratee
			* shorthands.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Array} Returns the new mapped array.
			*/
			function arrayMap(array, iteratee) {
				var index = -1, length = array == null ? 0 : array.length, result = Array(length);
				while (++index < length) result[index] = iteratee(array[index], index, array);
				return result;
			}
			/**
			* Appends the elements of `values` to `array`.
			*
			* @private
			* @param {Array} array The array to modify.
			* @param {Array} values The values to append.
			* @returns {Array} Returns `array`.
			*/
			function arrayPush(array, values) {
				var index = -1, length = values.length, offset = array.length;
				while (++index < length) array[offset + index] = values[index];
				return array;
			}
			/**
			* A specialized version of `_.reduce` for arrays without support for
			* iteratee shorthands.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @param {*} [accumulator] The initial value.
			* @param {boolean} [initAccum] Specify using the first element of `array` as
			*  the initial value.
			* @returns {*} Returns the accumulated value.
			*/
			function arrayReduce(array, iteratee, accumulator, initAccum) {
				var index = -1, length = array == null ? 0 : array.length;
				if (initAccum && length) accumulator = array[++index];
				while (++index < length) accumulator = iteratee(accumulator, array[index], index, array);
				return accumulator;
			}
			/**
			* A specialized version of `_.reduceRight` for arrays without support for
			* iteratee shorthands.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @param {*} [accumulator] The initial value.
			* @param {boolean} [initAccum] Specify using the last element of `array` as
			*  the initial value.
			* @returns {*} Returns the accumulated value.
			*/
			function arrayReduceRight(array, iteratee, accumulator, initAccum) {
				var length = array == null ? 0 : array.length;
				if (initAccum && length) accumulator = array[--length];
				while (length--) accumulator = iteratee(accumulator, array[length], length, array);
				return accumulator;
			}
			/**
			* A specialized version of `_.some` for arrays without support for iteratee
			* shorthands.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} predicate The function invoked per iteration.
			* @returns {boolean} Returns `true` if any element passes the predicate check,
			*  else `false`.
			*/
			function arraySome(array, predicate) {
				var index = -1, length = array == null ? 0 : array.length;
				while (++index < length) if (predicate(array[index], index, array)) return true;
				return false;
			}
			/**
			* Gets the size of an ASCII `string`.
			*
			* @private
			* @param {string} string The string inspect.
			* @returns {number} Returns the string size.
			*/
			var asciiSize = baseProperty("length");
			/**
			* Converts an ASCII `string` to an array.
			*
			* @private
			* @param {string} string The string to convert.
			* @returns {Array} Returns the converted array.
			*/
			function asciiToArray(string) {
				return string.split("");
			}
			/**
			* Splits an ASCII `string` into an array of its words.
			*
			* @private
			* @param {string} The string to inspect.
			* @returns {Array} Returns the words of `string`.
			*/
			function asciiWords(string) {
				return string.match(reAsciiWord) || [];
			}
			/**
			* The base implementation of methods like `_.findKey` and `_.findLastKey`,
			* without support for iteratee shorthands, which iterates over `collection`
			* using `eachFunc`.
			*
			* @private
			* @param {Array|Object} collection The collection to inspect.
			* @param {Function} predicate The function invoked per iteration.
			* @param {Function} eachFunc The function to iterate over `collection`.
			* @returns {*} Returns the found element or its key, else `undefined`.
			*/
			function baseFindKey(collection, predicate, eachFunc) {
				var result;
				eachFunc(collection, function(value, key, collection) {
					if (predicate(value, key, collection)) {
						result = key;
						return false;
					}
				});
				return result;
			}
			/**
			* The base implementation of `_.findIndex` and `_.findLastIndex` without
			* support for iteratee shorthands.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {Function} predicate The function invoked per iteration.
			* @param {number} fromIndex The index to search from.
			* @param {boolean} [fromRight] Specify iterating from right to left.
			* @returns {number} Returns the index of the matched value, else `-1`.
			*/
			function baseFindIndex(array, predicate, fromIndex, fromRight) {
				var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
				while (fromRight ? index-- : ++index < length) if (predicate(array[index], index, array)) return index;
				return -1;
			}
			/**
			* The base implementation of `_.indexOf` without `fromIndex` bounds checks.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {*} value The value to search for.
			* @param {number} fromIndex The index to search from.
			* @returns {number} Returns the index of the matched value, else `-1`.
			*/
			function baseIndexOf(array, value, fromIndex) {
				return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
			}
			/**
			* This function is like `baseIndexOf` except that it accepts a comparator.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {*} value The value to search for.
			* @param {number} fromIndex The index to search from.
			* @param {Function} comparator The comparator invoked per element.
			* @returns {number} Returns the index of the matched value, else `-1`.
			*/
			function baseIndexOfWith(array, value, fromIndex, comparator) {
				var index = fromIndex - 1, length = array.length;
				while (++index < length) if (comparator(array[index], value)) return index;
				return -1;
			}
			/**
			* The base implementation of `_.isNaN` without support for number objects.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
			*/
			function baseIsNaN(value) {
				return value !== value;
			}
			/**
			* The base implementation of `_.mean` and `_.meanBy` without support for
			* iteratee shorthands.
			*
			* @private
			* @param {Array} array The array to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {number} Returns the mean.
			*/
			function baseMean(array, iteratee) {
				var length = array == null ? 0 : array.length;
				return length ? baseSum(array, iteratee) / length : NAN;
			}
			/**
			* The base implementation of `_.property` without support for deep paths.
			*
			* @private
			* @param {string} key The key of the property to get.
			* @returns {Function} Returns the new accessor function.
			*/
			function baseProperty(key) {
				return function(object) {
					return object == null ? undefined : object[key];
				};
			}
			/**
			* The base implementation of `_.propertyOf` without support for deep paths.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Function} Returns the new accessor function.
			*/
			function basePropertyOf(object) {
				return function(key) {
					return object == null ? undefined : object[key];
				};
			}
			/**
			* The base implementation of `_.reduce` and `_.reduceRight`, without support
			* for iteratee shorthands, which iterates over `collection` using `eachFunc`.
			*
			* @private
			* @param {Array|Object} collection The collection to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @param {*} accumulator The initial value.
			* @param {boolean} initAccum Specify using the first or last element of
			*  `collection` as the initial value.
			* @param {Function} eachFunc The function to iterate over `collection`.
			* @returns {*} Returns the accumulated value.
			*/
			function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
				eachFunc(collection, function(value, index, collection) {
					accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection);
				});
				return accumulator;
			}
			/**
			* The base implementation of `_.sortBy` which uses `comparer` to define the
			* sort order of `array` and replaces criteria objects with their corresponding
			* values.
			*
			* @private
			* @param {Array} array The array to sort.
			* @param {Function} comparer The function to define sort order.
			* @returns {Array} Returns `array`.
			*/
			function baseSortBy(array, comparer) {
				var length = array.length;
				array.sort(comparer);
				while (length--) array[length] = array[length].value;
				return array;
			}
			/**
			* The base implementation of `_.sum` and `_.sumBy` without support for
			* iteratee shorthands.
			*
			* @private
			* @param {Array} array The array to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {number} Returns the sum.
			*/
			function baseSum(array, iteratee) {
				var result, index = -1, length = array.length;
				while (++index < length) {
					var current = iteratee(array[index]);
					if (current !== undefined) result = result === undefined ? current : result + current;
				}
				return result;
			}
			/**
			* The base implementation of `_.times` without support for iteratee shorthands
			* or max array length checks.
			*
			* @private
			* @param {number} n The number of times to invoke `iteratee`.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Array} Returns the array of results.
			*/
			function baseTimes(n, iteratee) {
				var index = -1, result = Array(n);
				while (++index < n) result[index] = iteratee(index);
				return result;
			}
			/**
			* The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
			* of key-value pairs for `object` corresponding to the property names of `props`.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {Array} props The property names to get values for.
			* @returns {Object} Returns the key-value pairs.
			*/
			function baseToPairs(object, props) {
				return arrayMap(props, function(key) {
					return [key, object[key]];
				});
			}
			/**
			* The base implementation of `_.trim`.
			*
			* @private
			* @param {string} string The string to trim.
			* @returns {string} Returns the trimmed string.
			*/
			function baseTrim(string) {
				return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
			}
			/**
			* The base implementation of `_.unary` without support for storing metadata.
			*
			* @private
			* @param {Function} func The function to cap arguments for.
			* @returns {Function} Returns the new capped function.
			*/
			function baseUnary(func) {
				return function(value) {
					return func(value);
				};
			}
			/**
			* The base implementation of `_.values` and `_.valuesIn` which creates an
			* array of `object` property values corresponding to the property names
			* of `props`.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {Array} props The property names to get values for.
			* @returns {Object} Returns the array of property values.
			*/
			function baseValues(object, props) {
				return arrayMap(props, function(key) {
					return object[key];
				});
			}
			/**
			* Checks if a `cache` value for `key` exists.
			*
			* @private
			* @param {Object} cache The cache to query.
			* @param {string} key The key of the entry to check.
			* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
			*/
			function cacheHas(cache, key) {
				return cache.has(key);
			}
			/**
			* Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
			* that is not found in the character symbols.
			*
			* @private
			* @param {Array} strSymbols The string symbols to inspect.
			* @param {Array} chrSymbols The character symbols to find.
			* @returns {number} Returns the index of the first unmatched string symbol.
			*/
			function charsStartIndex(strSymbols, chrSymbols) {
				var index = -1, length = strSymbols.length;
				while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1);
				return index;
			}
			/**
			* Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
			* that is not found in the character symbols.
			*
			* @private
			* @param {Array} strSymbols The string symbols to inspect.
			* @param {Array} chrSymbols The character symbols to find.
			* @returns {number} Returns the index of the last unmatched string symbol.
			*/
			function charsEndIndex(strSymbols, chrSymbols) {
				var index = strSymbols.length;
				while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1);
				return index;
			}
			/**
			* Gets the number of `placeholder` occurrences in `array`.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {*} placeholder The placeholder to search for.
			* @returns {number} Returns the placeholder count.
			*/
			function countHolders(array, placeholder) {
				var length = array.length, result = 0;
				while (length--) if (array[length] === placeholder) ++result;
				return result;
			}
			/**
			* Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
			* letters to basic Latin letters.
			*
			* @private
			* @param {string} letter The matched letter to deburr.
			* @returns {string} Returns the deburred letter.
			*/
			var deburrLetter = basePropertyOf(deburredLetters);
			/**
			* Used by `_.escape` to convert characters to HTML entities.
			*
			* @private
			* @param {string} chr The matched character to escape.
			* @returns {string} Returns the escaped character.
			*/
			var escapeHtmlChar = basePropertyOf(htmlEscapes);
			/**
			* Used by `_.template` to escape characters for inclusion in compiled string literals.
			*
			* @private
			* @param {string} chr The matched character to escape.
			* @returns {string} Returns the escaped character.
			*/
			function escapeStringChar(chr) {
				return "\\" + stringEscapes[chr];
			}
			/**
			* Gets the value at `key` of `object`.
			*
			* @private
			* @param {Object} [object] The object to query.
			* @param {string} key The key of the property to get.
			* @returns {*} Returns the property value.
			*/
			function getValue(object, key) {
				return object == null ? undefined : object[key];
			}
			/**
			* Checks if `string` contains Unicode symbols.
			*
			* @private
			* @param {string} string The string to inspect.
			* @returns {boolean} Returns `true` if a symbol is found, else `false`.
			*/
			function hasUnicode(string) {
				return reHasUnicode.test(string);
			}
			/**
			* Checks if `string` contains a word composed of Unicode symbols.
			*
			* @private
			* @param {string} string The string to inspect.
			* @returns {boolean} Returns `true` if a word is found, else `false`.
			*/
			function hasUnicodeWord(string) {
				return reHasUnicodeWord.test(string);
			}
			/**
			* Converts `iterator` to an array.
			*
			* @private
			* @param {Object} iterator The iterator to convert.
			* @returns {Array} Returns the converted array.
			*/
			function iteratorToArray(iterator) {
				var data, result = [];
				while (!(data = iterator.next()).done) result.push(data.value);
				return result;
			}
			/**
			* Converts `map` to its key-value pairs.
			*
			* @private
			* @param {Object} map The map to convert.
			* @returns {Array} Returns the key-value pairs.
			*/
			function mapToArray(map) {
				var index = -1, result = Array(map.size);
				map.forEach(function(value, key) {
					result[++index] = [key, value];
				});
				return result;
			}
			/**
			* Creates a unary function that invokes `func` with its argument transformed.
			*
			* @private
			* @param {Function} func The function to wrap.
			* @param {Function} transform The argument transform.
			* @returns {Function} Returns the new function.
			*/
			function overArg(func, transform) {
				return function(arg) {
					return func(transform(arg));
				};
			}
			/**
			* Replaces all `placeholder` elements in `array` with an internal placeholder
			* and returns an array of their indexes.
			*
			* @private
			* @param {Array} array The array to modify.
			* @param {*} placeholder The placeholder to replace.
			* @returns {Array} Returns the new array of placeholder indexes.
			*/
			function replaceHolders(array, placeholder) {
				var index = -1, length = array.length, resIndex = 0, result = [];
				while (++index < length) {
					var value = array[index];
					if (value === placeholder || value === PLACEHOLDER) {
						array[index] = PLACEHOLDER;
						result[resIndex++] = index;
					}
				}
				return result;
			}
			/**
			* Converts `set` to an array of its values.
			*
			* @private
			* @param {Object} set The set to convert.
			* @returns {Array} Returns the values.
			*/
			function setToArray(set) {
				var index = -1, result = Array(set.size);
				set.forEach(function(value) {
					result[++index] = value;
				});
				return result;
			}
			/**
			* Converts `set` to its value-value pairs.
			*
			* @private
			* @param {Object} set The set to convert.
			* @returns {Array} Returns the value-value pairs.
			*/
			function setToPairs(set) {
				var index = -1, result = Array(set.size);
				set.forEach(function(value) {
					result[++index] = [value, value];
				});
				return result;
			}
			/**
			* A specialized version of `_.indexOf` which performs strict equality
			* comparisons of values, i.e. `===`.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {*} value The value to search for.
			* @param {number} fromIndex The index to search from.
			* @returns {number} Returns the index of the matched value, else `-1`.
			*/
			function strictIndexOf(array, value, fromIndex) {
				var index = fromIndex - 1, length = array.length;
				while (++index < length) if (array[index] === value) return index;
				return -1;
			}
			/**
			* A specialized version of `_.lastIndexOf` which performs strict equality
			* comparisons of values, i.e. `===`.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {*} value The value to search for.
			* @param {number} fromIndex The index to search from.
			* @returns {number} Returns the index of the matched value, else `-1`.
			*/
			function strictLastIndexOf(array, value, fromIndex) {
				var index = fromIndex + 1;
				while (index--) if (array[index] === value) return index;
				return index;
			}
			/**
			* Gets the number of symbols in `string`.
			*
			* @private
			* @param {string} string The string to inspect.
			* @returns {number} Returns the string size.
			*/
			function stringSize(string) {
				return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
			}
			/**
			* Converts `string` to an array.
			*
			* @private
			* @param {string} string The string to convert.
			* @returns {Array} Returns the converted array.
			*/
			function stringToArray(string) {
				return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
			}
			/**
			* Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
			* character of `string`.
			*
			* @private
			* @param {string} string The string to inspect.
			* @returns {number} Returns the index of the last non-whitespace character.
			*/
			function trimmedEndIndex(string) {
				var index = string.length;
				while (index-- && reWhitespace.test(string.charAt(index)));
				return index;
			}
			/**
			* Used by `_.unescape` to convert HTML entities to characters.
			*
			* @private
			* @param {string} chr The matched character to unescape.
			* @returns {string} Returns the unescaped character.
			*/
			var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
			/**
			* Gets the size of a Unicode `string`.
			*
			* @private
			* @param {string} string The string inspect.
			* @returns {number} Returns the string size.
			*/
			function unicodeSize(string) {
				var result = reUnicode.lastIndex = 0;
				while (reUnicode.test(string)) ++result;
				return result;
			}
			/**
			* Converts a Unicode `string` to an array.
			*
			* @private
			* @param {string} string The string to convert.
			* @returns {Array} Returns the converted array.
			*/
			function unicodeToArray(string) {
				return string.match(reUnicode) || [];
			}
			/**
			* Splits a Unicode `string` into an array of its words.
			*
			* @private
			* @param {string} The string to inspect.
			* @returns {Array} Returns the words of `string`.
			*/
			function unicodeWords(string) {
				return string.match(reUnicodeWord) || [];
			}
			var _ = (function runInContext(context) {
				context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
				/** Built-in constructor references. */
				var Array = context.Array, Date = context.Date, Error = context.Error, Function = context.Function, Math = context.Math, Object = context.Object, RegExp = context.RegExp, String = context.String, TypeError = context.TypeError;
				/** Used for built-in method references. */
				var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
				/** Used to detect overreaching core-js shims. */
				var coreJsData = context["__core-js_shared__"];
				/** Used to resolve the decompiled source of functions. */
				var funcToString = funcProto.toString;
				/** Used to check objects for own properties. */
				var hasOwnProperty = objectProto.hasOwnProperty;
				/** Used to generate unique IDs. */
				var idCounter = 0;
				/** Used to detect methods masquerading as native. */
				var maskSrcKey = function() {
					var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
					return uid ? "Symbol(src)_1." + uid : "";
				}();
				/**
				* Used to resolve the
				* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
				* of values.
				*/
				var nativeObjectToString = objectProto.toString;
				/** Used to infer the `Object` constructor. */
				var objectCtorString = funcToString.call(Object);
				/** Used to restore the original `_` reference in `_.noConflict`. */
				var oldDash = root._;
				/** Used to detect if a method is native. */
				var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
				/** Built-in value references. */
				var Buffer = moduleExports ? context.Buffer : undefined, Symbol = context.Symbol, Uint8Array = context.Uint8Array, allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined, getPrototype = overArg(Object.getPrototypeOf, Object), objectCreate = Object.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined, symIterator = Symbol ? Symbol.iterator : undefined, symToStringTag = Symbol ? Symbol.toStringTag : undefined;
				var defineProperty = function() {
					try {
						var func = getNative(Object, "defineProperty");
						func({}, "", {});
						return func;
					} catch (e) {}
				}();
				/** Mocked built-ins. */
				var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date && Date.now !== root.Date.now && Date.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
				var nativeCeil = Math.ceil, nativeFloor = Math.floor, nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object.keys, Object), nativeMax = Math.max, nativeMin = Math.min, nativeNow = Date.now, nativeParseInt = context.parseInt, nativeRandom = Math.random, nativeReverse = arrayProto.reverse;
				var DataView = getNative(context, "DataView"), Map = getNative(context, "Map"), Promise = getNative(context, "Promise"), Set = getNative(context, "Set"), WeakMap = getNative(context, "WeakMap"), nativeCreate = getNative(Object, "create");
				/** Used to store function metadata. */
				var metaMap = WeakMap && new WeakMap();
				/** Used to lookup unminified function names. */
				var realNames = {};
				/** Used to detect maps, sets, and weakmaps. */
				var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
				/** Used to convert symbols to primitives and strings. */
				var symbolProto = Symbol ? Symbol.prototype : undefined, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined, symbolToString = symbolProto ? symbolProto.toString : undefined;
				/**
				* Creates a `lodash` object which wraps `value` to enable implicit method
				* chain sequences. Methods that operate on and return arrays, collections,
				* and functions can be chained together. Methods that retrieve a single value
				* or may return a primitive value will automatically end the chain sequence
				* and return the unwrapped value. Otherwise, the value must be unwrapped
				* with `_#value`.
				*
				* Explicit chain sequences, which must be unwrapped with `_#value`, may be
				* enabled using `_.chain`.
				*
				* The execution of chained methods is lazy, that is, it's deferred until
				* `_#value` is implicitly or explicitly called.
				*
				* Lazy evaluation allows several methods to support shortcut fusion.
				* Shortcut fusion is an optimization to merge iteratee calls; this avoids
				* the creation of intermediate arrays and can greatly reduce the number of
				* iteratee executions. Sections of a chain sequence qualify for shortcut
				* fusion if the section is applied to an array and iteratees accept only
				* one argument. The heuristic for whether a section qualifies for shortcut
				* fusion is subject to change.
				*
				* Chaining is supported in custom builds as long as the `_#value` method is
				* directly or indirectly included in the build.
				*
				* In addition to lodash methods, wrappers have `Array` and `String` methods.
				*
				* The wrapper `Array` methods are:
				* `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
				*
				* The wrapper `String` methods are:
				* `replace` and `split`
				*
				* The wrapper methods that support shortcut fusion are:
				* `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
				* `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
				* `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
				*
				* The chainable wrapper methods are:
				* `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
				* `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
				* `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
				* `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
				* `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
				* `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
				* `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
				* `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
				* `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
				* `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
				* `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
				* `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
				* `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
				* `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
				* `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
				* `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
				* `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
				* `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
				* `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
				* `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
				* `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
				* `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
				* `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
				* `zipObject`, `zipObjectDeep`, and `zipWith`
				*
				* The wrapper methods that are **not** chainable by default are:
				* `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
				* `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
				* `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
				* `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
				* `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
				* `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
				* `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
				* `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
				* `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
				* `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
				* `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
				* `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
				* `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
				* `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
				* `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
				* `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
				* `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
				* `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
				* `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
				* `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
				* `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
				* `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
				* `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
				* `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
				* `upperFirst`, `value`, and `words`
				*
				* @name _
				* @constructor
				* @category Seq
				* @param {*} value The value to wrap in a `lodash` instance.
				* @returns {Object} Returns the new `lodash` wrapper instance.
				* @example
				*
				* function square(n) {
				*   return n * n;
				* }
				*
				* var wrapped = _([1, 2, 3]);
				*
				* // Returns an unwrapped value.
				* wrapped.reduce(_.add);
				* // => 6
				*
				* // Returns a wrapped value.
				* var squares = wrapped.map(square);
				*
				* _.isArray(squares);
				* // => false
				*
				* _.isArray(squares.value());
				* // => true
				*/
				function lodash(value) {
					if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
						if (value instanceof LodashWrapper) return value;
						if (hasOwnProperty.call(value, "__wrapped__")) return wrapperClone(value);
					}
					return new LodashWrapper(value);
				}
				/**
				* The base implementation of `_.create` without support for assigning
				* properties to the created object.
				*
				* @private
				* @param {Object} proto The object to inherit from.
				* @returns {Object} Returns the new object.
				*/
				var baseCreate = function() {
					function object() {}
					return function(proto) {
						if (!isObject(proto)) return {};
						if (objectCreate) return objectCreate(proto);
						object.prototype = proto;
						var result = new object();
						object.prototype = undefined;
						return result;
					};
				}();
				/**
				* The function whose prototype chain sequence wrappers inherit from.
				*
				* @private
				*/
				function baseLodash() {}
				/**
				* The base constructor for creating `lodash` wrapper objects.
				*
				* @private
				* @param {*} value The value to wrap.
				* @param {boolean} [chainAll] Enable explicit method chain sequences.
				*/
				function LodashWrapper(value, chainAll) {
					this.__wrapped__ = value;
					this.__actions__ = [];
					this.__chain__ = !!chainAll;
					this.__index__ = 0;
					this.__values__ = undefined;
				}
				/**
				* By default, the template delimiters used by lodash are like those in
				* embedded Ruby (ERB) as well as ES2015 template strings. Change the
				* following template settings to use alternative delimiters.
				*
				* **Security:** See
				* [threat model](https://github.com/lodash/lodash/blob/main/threat-model.md)
				* — `_.template` is insecure and will be removed in v5.
				*
				* @static
				* @memberOf _
				* @type {Object}
				*/
				lodash.templateSettings = {
					/**
					* Used to detect `data` property values to be HTML-escaped.
					*
					* @memberOf _.templateSettings
					* @type {RegExp}
					*/
					"escape": reEscape,
					/**
					* Used to detect code to be evaluated.
					*
					* @memberOf _.templateSettings
					* @type {RegExp}
					*/
					"evaluate": reEvaluate,
					/**
					* Used to detect `data` property values to inject.
					*
					* @memberOf _.templateSettings
					* @type {RegExp}
					*/
					"interpolate": reInterpolate,
					/**
					* Used to reference the data object in the template text.
					*
					* @memberOf _.templateSettings
					* @type {string}
					*/
					"variable": "",
					/**
					* Used to import variables into the compiled template.
					*
					* @memberOf _.templateSettings
					* @type {Object}
					*/
					"imports": { 
					/**
					* A reference to the `lodash` function.
					*
					* @memberOf _.templateSettings.imports
					* @type {Function}
					*/
"_": lodash }
				};
				lodash.prototype = baseLodash.prototype;
				lodash.prototype.constructor = lodash;
				LodashWrapper.prototype = baseCreate(baseLodash.prototype);
				LodashWrapper.prototype.constructor = LodashWrapper;
				/**
				* Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
				*
				* @private
				* @constructor
				* @param {*} value The value to wrap.
				*/
				function LazyWrapper(value) {
					this.__wrapped__ = value;
					this.__actions__ = [];
					this.__dir__ = 1;
					this.__filtered__ = false;
					this.__iteratees__ = [];
					this.__takeCount__ = MAX_ARRAY_LENGTH;
					this.__views__ = [];
				}
				/**
				* Creates a clone of the lazy wrapper object.
				*
				* @private
				* @name clone
				* @memberOf LazyWrapper
				* @returns {Object} Returns the cloned `LazyWrapper` object.
				*/
				function lazyClone() {
					var result = new LazyWrapper(this.__wrapped__);
					result.__actions__ = copyArray(this.__actions__);
					result.__dir__ = this.__dir__;
					result.__filtered__ = this.__filtered__;
					result.__iteratees__ = copyArray(this.__iteratees__);
					result.__takeCount__ = this.__takeCount__;
					result.__views__ = copyArray(this.__views__);
					return result;
				}
				/**
				* Reverses the direction of lazy iteration.
				*
				* @private
				* @name reverse
				* @memberOf LazyWrapper
				* @returns {Object} Returns the new reversed `LazyWrapper` object.
				*/
				function lazyReverse() {
					if (this.__filtered__) {
						var result = new LazyWrapper(this);
						result.__dir__ = -1;
						result.__filtered__ = true;
					} else {
						result = this.clone();
						result.__dir__ *= -1;
					}
					return result;
				}
				/**
				* Extracts the unwrapped value from its lazy wrapper.
				*
				* @private
				* @name value
				* @memberOf LazyWrapper
				* @returns {*} Returns the unwrapped value.
				*/
				function lazyValue() {
					var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
					if (!isArr || !isRight && arrLength == length && takeCount == length) return baseWrapperValue(array, this.__actions__);
					var result = [];
					outer: while (length-- && resIndex < takeCount) {
						index += dir;
						var iterIndex = -1, value = array[index];
						while (++iterIndex < iterLength) {
							var data = iteratees[iterIndex], iteratee = data.iteratee, type = data.type, computed = iteratee(value);
							if (type == LAZY_MAP_FLAG) value = computed;
							else if (!computed) {
								if (type == LAZY_FILTER_FLAG) continue outer;
								else break outer;
							}
						}
						result[resIndex++] = value;
					}
					return result;
				}
				LazyWrapper.prototype = baseCreate(baseLodash.prototype);
				LazyWrapper.prototype.constructor = LazyWrapper;
				/**
				* Creates a hash object.
				*
				* @private
				* @constructor
				* @param {Array} [entries] The key-value pairs to cache.
				*/
				function Hash(entries) {
					var index = -1, length = entries == null ? 0 : entries.length;
					this.clear();
					while (++index < length) {
						var entry = entries[index];
						this.set(entry[0], entry[1]);
					}
				}
				/**
				* Removes all key-value entries from the hash.
				*
				* @private
				* @name clear
				* @memberOf Hash
				*/
				function hashClear() {
					this.__data__ = nativeCreate ? nativeCreate(null) : {};
					this.size = 0;
				}
				/**
				* Removes `key` and its value from the hash.
				*
				* @private
				* @name delete
				* @memberOf Hash
				* @param {Object} hash The hash to modify.
				* @param {string} key The key of the value to remove.
				* @returns {boolean} Returns `true` if the entry was removed, else `false`.
				*/
				function hashDelete(key) {
					var result = this.has(key) && delete this.__data__[key];
					this.size -= result ? 1 : 0;
					return result;
				}
				/**
				* Gets the hash value for `key`.
				*
				* @private
				* @name get
				* @memberOf Hash
				* @param {string} key The key of the value to get.
				* @returns {*} Returns the entry value.
				*/
				function hashGet(key) {
					var data = this.__data__;
					if (nativeCreate) {
						var result = data[key];
						return result === HASH_UNDEFINED ? undefined : result;
					}
					return hasOwnProperty.call(data, key) ? data[key] : undefined;
				}
				/**
				* Checks if a hash value for `key` exists.
				*
				* @private
				* @name has
				* @memberOf Hash
				* @param {string} key The key of the entry to check.
				* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
				*/
				function hashHas(key) {
					var data = this.__data__;
					return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
				}
				/**
				* Sets the hash `key` to `value`.
				*
				* @private
				* @name set
				* @memberOf Hash
				* @param {string} key The key of the value to set.
				* @param {*} value The value to set.
				* @returns {Object} Returns the hash instance.
				*/
				function hashSet(key, value) {
					var data = this.__data__;
					this.size += this.has(key) ? 0 : 1;
					data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
					return this;
				}
				Hash.prototype.clear = hashClear;
				Hash.prototype["delete"] = hashDelete;
				Hash.prototype.get = hashGet;
				Hash.prototype.has = hashHas;
				Hash.prototype.set = hashSet;
				/**
				* Creates an list cache object.
				*
				* @private
				* @constructor
				* @param {Array} [entries] The key-value pairs to cache.
				*/
				function ListCache(entries) {
					var index = -1, length = entries == null ? 0 : entries.length;
					this.clear();
					while (++index < length) {
						var entry = entries[index];
						this.set(entry[0], entry[1]);
					}
				}
				/**
				* Removes all key-value entries from the list cache.
				*
				* @private
				* @name clear
				* @memberOf ListCache
				*/
				function listCacheClear() {
					this.__data__ = [];
					this.size = 0;
				}
				/**
				* Removes `key` and its value from the list cache.
				*
				* @private
				* @name delete
				* @memberOf ListCache
				* @param {string} key The key of the value to remove.
				* @returns {boolean} Returns `true` if the entry was removed, else `false`.
				*/
				function listCacheDelete(key) {
					var data = this.__data__, index = assocIndexOf(data, key);
					if (index < 0) return false;
					if (index == data.length - 1) data.pop();
					else splice.call(data, index, 1);
					--this.size;
					return true;
				}
				/**
				* Gets the list cache value for `key`.
				*
				* @private
				* @name get
				* @memberOf ListCache
				* @param {string} key The key of the value to get.
				* @returns {*} Returns the entry value.
				*/
				function listCacheGet(key) {
					var data = this.__data__, index = assocIndexOf(data, key);
					return index < 0 ? undefined : data[index][1];
				}
				/**
				* Checks if a list cache value for `key` exists.
				*
				* @private
				* @name has
				* @memberOf ListCache
				* @param {string} key The key of the entry to check.
				* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
				*/
				function listCacheHas(key) {
					return assocIndexOf(this.__data__, key) > -1;
				}
				/**
				* Sets the list cache `key` to `value`.
				*
				* @private
				* @name set
				* @memberOf ListCache
				* @param {string} key The key of the value to set.
				* @param {*} value The value to set.
				* @returns {Object} Returns the list cache instance.
				*/
				function listCacheSet(key, value) {
					var data = this.__data__, index = assocIndexOf(data, key);
					if (index < 0) {
						++this.size;
						data.push([key, value]);
					} else data[index][1] = value;
					return this;
				}
				ListCache.prototype.clear = listCacheClear;
				ListCache.prototype["delete"] = listCacheDelete;
				ListCache.prototype.get = listCacheGet;
				ListCache.prototype.has = listCacheHas;
				ListCache.prototype.set = listCacheSet;
				/**
				* Creates a map cache object to store key-value pairs.
				*
				* @private
				* @constructor
				* @param {Array} [entries] The key-value pairs to cache.
				*/
				function MapCache(entries) {
					var index = -1, length = entries == null ? 0 : entries.length;
					this.clear();
					while (++index < length) {
						var entry = entries[index];
						this.set(entry[0], entry[1]);
					}
				}
				/**
				* Removes all key-value entries from the map.
				*
				* @private
				* @name clear
				* @memberOf MapCache
				*/
				function mapCacheClear() {
					this.size = 0;
					this.__data__ = {
						"hash": new Hash(),
						"map": new (Map || ListCache)(),
						"string": new Hash()
					};
				}
				/**
				* Removes `key` and its value from the map.
				*
				* @private
				* @name delete
				* @memberOf MapCache
				* @param {string} key The key of the value to remove.
				* @returns {boolean} Returns `true` if the entry was removed, else `false`.
				*/
				function mapCacheDelete(key) {
					var result = getMapData(this, key)["delete"](key);
					this.size -= result ? 1 : 0;
					return result;
				}
				/**
				* Gets the map value for `key`.
				*
				* @private
				* @name get
				* @memberOf MapCache
				* @param {string} key The key of the value to get.
				* @returns {*} Returns the entry value.
				*/
				function mapCacheGet(key) {
					return getMapData(this, key).get(key);
				}
				/**
				* Checks if a map value for `key` exists.
				*
				* @private
				* @name has
				* @memberOf MapCache
				* @param {string} key The key of the entry to check.
				* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
				*/
				function mapCacheHas(key) {
					return getMapData(this, key).has(key);
				}
				/**
				* Sets the map `key` to `value`.
				*
				* @private
				* @name set
				* @memberOf MapCache
				* @param {string} key The key of the value to set.
				* @param {*} value The value to set.
				* @returns {Object} Returns the map cache instance.
				*/
				function mapCacheSet(key, value) {
					var data = getMapData(this, key), size = data.size;
					data.set(key, value);
					this.size += data.size == size ? 0 : 1;
					return this;
				}
				MapCache.prototype.clear = mapCacheClear;
				MapCache.prototype["delete"] = mapCacheDelete;
				MapCache.prototype.get = mapCacheGet;
				MapCache.prototype.has = mapCacheHas;
				MapCache.prototype.set = mapCacheSet;
				/**
				*
				* Creates an array cache object to store unique values.
				*
				* @private
				* @constructor
				* @param {Array} [values] The values to cache.
				*/
				function SetCache(values) {
					var index = -1, length = values == null ? 0 : values.length;
					this.__data__ = new MapCache();
					while (++index < length) this.add(values[index]);
				}
				/**
				* Adds `value` to the array cache.
				*
				* @private
				* @name add
				* @memberOf SetCache
				* @alias push
				* @param {*} value The value to cache.
				* @returns {Object} Returns the cache instance.
				*/
				function setCacheAdd(value) {
					this.__data__.set(value, HASH_UNDEFINED);
					return this;
				}
				/**
				* Checks if `value` is in the array cache.
				*
				* @private
				* @name has
				* @memberOf SetCache
				* @param {*} value The value to search for.
				* @returns {boolean} Returns `true` if `value` is found, else `false`.
				*/
				function setCacheHas(value) {
					return this.__data__.has(value);
				}
				SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
				SetCache.prototype.has = setCacheHas;
				/**
				* Creates a stack cache object to store key-value pairs.
				*
				* @private
				* @constructor
				* @param {Array} [entries] The key-value pairs to cache.
				*/
				function Stack(entries) {
					var data = this.__data__ = new ListCache(entries);
					this.size = data.size;
				}
				/**
				* Removes all key-value entries from the stack.
				*
				* @private
				* @name clear
				* @memberOf Stack
				*/
				function stackClear() {
					this.__data__ = new ListCache();
					this.size = 0;
				}
				/**
				* Removes `key` and its value from the stack.
				*
				* @private
				* @name delete
				* @memberOf Stack
				* @param {string} key The key of the value to remove.
				* @returns {boolean} Returns `true` if the entry was removed, else `false`.
				*/
				function stackDelete(key) {
					var data = this.__data__, result = data["delete"](key);
					this.size = data.size;
					return result;
				}
				/**
				* Gets the stack value for `key`.
				*
				* @private
				* @name get
				* @memberOf Stack
				* @param {string} key The key of the value to get.
				* @returns {*} Returns the entry value.
				*/
				function stackGet(key) {
					return this.__data__.get(key);
				}
				/**
				* Checks if a stack value for `key` exists.
				*
				* @private
				* @name has
				* @memberOf Stack
				* @param {string} key The key of the entry to check.
				* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
				*/
				function stackHas(key) {
					return this.__data__.has(key);
				}
				/**
				* Sets the stack `key` to `value`.
				*
				* @private
				* @name set
				* @memberOf Stack
				* @param {string} key The key of the value to set.
				* @param {*} value The value to set.
				* @returns {Object} Returns the stack cache instance.
				*/
				function stackSet(key, value) {
					var data = this.__data__;
					if (data instanceof ListCache) {
						var pairs = data.__data__;
						if (!Map || pairs.length < 199) {
							pairs.push([key, value]);
							this.size = ++data.size;
							return this;
						}
						data = this.__data__ = new MapCache(pairs);
					}
					data.set(key, value);
					this.size = data.size;
					return this;
				}
				Stack.prototype.clear = stackClear;
				Stack.prototype["delete"] = stackDelete;
				Stack.prototype.get = stackGet;
				Stack.prototype.has = stackHas;
				Stack.prototype.set = stackSet;
				/**
				* Creates an array of the enumerable property names of the array-like `value`.
				*
				* @private
				* @param {*} value The value to query.
				* @param {boolean} inherited Specify returning inherited property names.
				* @returns {Array} Returns the array of property names.
				*/
				function arrayLikeKeys(value, inherited) {
					var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
					for (var key in value) if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) result.push(key);
					return result;
				}
				/**
				* A specialized version of `_.sample` for arrays.
				*
				* @private
				* @param {Array} array The array to sample.
				* @returns {*} Returns the random element.
				*/
				function arraySample(array) {
					var length = array.length;
					return length ? array[baseRandom(0, length - 1)] : undefined;
				}
				/**
				* A specialized version of `_.sampleSize` for arrays.
				*
				* @private
				* @param {Array} array The array to sample.
				* @param {number} n The number of elements to sample.
				* @returns {Array} Returns the random elements.
				*/
				function arraySampleSize(array, n) {
					return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
				}
				/**
				* A specialized version of `_.shuffle` for arrays.
				*
				* @private
				* @param {Array} array The array to shuffle.
				* @returns {Array} Returns the new shuffled array.
				*/
				function arrayShuffle(array) {
					return shuffleSelf(copyArray(array));
				}
				/**
				* This function is like `assignValue` except that it doesn't assign
				* `undefined` values.
				*
				* @private
				* @param {Object} object The object to modify.
				* @param {string} key The key of the property to assign.
				* @param {*} value The value to assign.
				*/
				function assignMergeValue(object, key, value) {
					if (value !== undefined && !eq(object[key], value) || value === undefined && !(key in object)) baseAssignValue(object, key, value);
				}
				/**
				* Assigns `value` to `key` of `object` if the existing value is not equivalent
				* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
				* for equality comparisons.
				*
				* @private
				* @param {Object} object The object to modify.
				* @param {string} key The key of the property to assign.
				* @param {*} value The value to assign.
				*/
				function assignValue(object, key, value) {
					var objValue = object[key];
					if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) baseAssignValue(object, key, value);
				}
				/**
				* Gets the index at which the `key` is found in `array` of key-value pairs.
				*
				* @private
				* @param {Array} array The array to inspect.
				* @param {*} key The key to search for.
				* @returns {number} Returns the index of the matched value, else `-1`.
				*/
				function assocIndexOf(array, key) {
					var length = array.length;
					while (length--) if (eq(array[length][0], key)) return length;
					return -1;
				}
				/**
				* Aggregates elements of `collection` on `accumulator` with keys transformed
				* by `iteratee` and values set by `setter`.
				*
				* @private
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} setter The function to set `accumulator` values.
				* @param {Function} iteratee The iteratee to transform keys.
				* @param {Object} accumulator The initial aggregated object.
				* @returns {Function} Returns `accumulator`.
				*/
				function baseAggregator(collection, setter, iteratee, accumulator) {
					baseEach(collection, function(value, key, collection) {
						setter(accumulator, value, iteratee(value), collection);
					});
					return accumulator;
				}
				/**
				* The base implementation of `_.assign` without support for multiple sources
				* or `customizer` functions.
				*
				* @private
				* @param {Object} object The destination object.
				* @param {Object} source The source object.
				* @returns {Object} Returns `object`.
				*/
				function baseAssign(object, source) {
					return object && copyObject(source, keys(source), object);
				}
				/**
				* The base implementation of `_.assignIn` without support for multiple sources
				* or `customizer` functions.
				*
				* @private
				* @param {Object} object The destination object.
				* @param {Object} source The source object.
				* @returns {Object} Returns `object`.
				*/
				function baseAssignIn(object, source) {
					return object && copyObject(source, keysIn(source), object);
				}
				/**
				* The base implementation of `assignValue` and `assignMergeValue` without
				* value checks.
				*
				* @private
				* @param {Object} object The object to modify.
				* @param {string} key The key of the property to assign.
				* @param {*} value The value to assign.
				*/
				function baseAssignValue(object, key, value) {
					if (key == "__proto__" && defineProperty) defineProperty(object, key, {
						"configurable": true,
						"enumerable": true,
						"value": value,
						"writable": true
					});
					else object[key] = value;
				}
				/**
				* The base implementation of `_.at` without support for individual paths.
				*
				* @private
				* @param {Object} object The object to iterate over.
				* @param {string[]} paths The property paths to pick.
				* @returns {Array} Returns the picked elements.
				*/
				function baseAt(object, paths) {
					var index = -1, length = paths.length, result = Array(length), skip = object == null;
					while (++index < length) result[index] = skip ? undefined : get(object, paths[index]);
					return result;
				}
				/**
				* The base implementation of `_.clamp` which doesn't coerce arguments.
				*
				* @private
				* @param {number} number The number to clamp.
				* @param {number} [lower] The lower bound.
				* @param {number} upper The upper bound.
				* @returns {number} Returns the clamped number.
				*/
				function baseClamp(number, lower, upper) {
					if (number === number) {
						if (upper !== undefined) number = number <= upper ? number : upper;
						if (lower !== undefined) number = number >= lower ? number : lower;
					}
					return number;
				}
				/**
				* The base implementation of `_.clone` and `_.cloneDeep` which tracks
				* traversed objects.
				*
				* @private
				* @param {*} value The value to clone.
				* @param {boolean} bitmask The bitmask flags.
				*  1 - Deep clone
				*  2 - Flatten inherited properties
				*  4 - Clone symbols
				* @param {Function} [customizer] The function to customize cloning.
				* @param {string} [key] The key of `value`.
				* @param {Object} [object] The parent object of `value`.
				* @param {Object} [stack] Tracks traversed objects and their clone counterparts.
				* @returns {*} Returns the cloned value.
				*/
				function baseClone(value, bitmask, customizer, key, object, stack) {
					var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
					if (customizer) result = object ? customizer(value, key, object, stack) : customizer(value);
					if (result !== undefined) return result;
					if (!isObject(value)) return value;
					var isArr = isArray(value);
					if (isArr) {
						result = initCloneArray(value);
						if (!isDeep) return copyArray(value, result);
					} else {
						var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
						if (isBuffer(value)) return cloneBuffer(value, isDeep);
						if (tag == objectTag || tag == argsTag || isFunc && !object) {
							result = isFlat || isFunc ? {} : initCloneObject(value);
							if (!isDeep) return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
						} else {
							if (!cloneableTags[tag]) return object ? value : {};
							result = initCloneByTag(value, tag, isDeep);
						}
					}
					stack || (stack = new Stack());
					var stacked = stack.get(value);
					if (stacked) return stacked;
					stack.set(value, result);
					if (isSet(value)) value.forEach(function(subValue) {
						result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
					});
					else if (isMap(value)) value.forEach(function(subValue, key) {
						result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
					});
					var props = isArr ? undefined : (isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys)(value);
					arrayEach(props || value, function(subValue, key) {
						if (props) {
							key = subValue;
							subValue = value[key];
						}
						assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
					});
					return result;
				}
				/**
				* The base implementation of `_.conforms` which doesn't clone `source`.
				*
				* @private
				* @param {Object} source The object of property predicates to conform to.
				* @returns {Function} Returns the new spec function.
				*/
				function baseConforms(source) {
					var props = keys(source);
					return function(object) {
						return baseConformsTo(object, source, props);
					};
				}
				/**
				* The base implementation of `_.conformsTo` which accepts `props` to check.
				*
				* @private
				* @param {Object} object The object to inspect.
				* @param {Object} source The object of property predicates to conform to.
				* @returns {boolean} Returns `true` if `object` conforms, else `false`.
				*/
				function baseConformsTo(object, source, props) {
					var length = props.length;
					if (object == null) return !length;
					object = Object(object);
					while (length--) {
						var key = props[length], predicate = source[key], value = object[key];
						if (value === undefined && !(key in object) || !predicate(value)) return false;
					}
					return true;
				}
				/**
				* The base implementation of `_.delay` and `_.defer` which accepts `args`
				* to provide to `func`.
				*
				* @private
				* @param {Function} func The function to delay.
				* @param {number} wait The number of milliseconds to delay invocation.
				* @param {Array} args The arguments to provide to `func`.
				* @returns {number|Object} Returns the timer id or timeout object.
				*/
				function baseDelay(func, wait, args) {
					if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
					return setTimeout(function() {
						func.apply(undefined, args);
					}, wait);
				}
				/**
				* The base implementation of methods like `_.difference` without support
				* for excluding multiple arrays or iteratee shorthands.
				*
				* @private
				* @param {Array} array The array to inspect.
				* @param {Array} values The values to exclude.
				* @param {Function} [iteratee] The iteratee invoked per element.
				* @param {Function} [comparator] The comparator invoked per element.
				* @returns {Array} Returns the new array of filtered values.
				*/
				function baseDifference(array, values, iteratee, comparator) {
					var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
					if (!length) return result;
					if (iteratee) values = arrayMap(values, baseUnary(iteratee));
					if (comparator) {
						includes = arrayIncludesWith;
						isCommon = false;
					} else if (values.length >= LARGE_ARRAY_SIZE) {
						includes = cacheHas;
						isCommon = false;
						values = new SetCache(values);
					}
					outer: while (++index < length) {
						var value = array[index], computed = iteratee == null ? value : iteratee(value);
						value = comparator || value !== 0 ? value : 0;
						if (isCommon && computed === computed) {
							var valuesIndex = valuesLength;
							while (valuesIndex--) if (values[valuesIndex] === computed) continue outer;
							result.push(value);
						} else if (!includes(values, computed, comparator)) result.push(value);
					}
					return result;
				}
				/**
				* The base implementation of `_.forEach` without support for iteratee shorthands.
				*
				* @private
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} iteratee The function invoked per iteration.
				* @returns {Array|Object} Returns `collection`.
				*/
				var baseEach = createBaseEach(baseForOwn);
				/**
				* The base implementation of `_.forEachRight` without support for iteratee shorthands.
				*
				* @private
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} iteratee The function invoked per iteration.
				* @returns {Array|Object} Returns `collection`.
				*/
				var baseEachRight = createBaseEach(baseForOwnRight, true);
				/**
				* The base implementation of `_.every` without support for iteratee shorthands.
				*
				* @private
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} predicate The function invoked per iteration.
				* @returns {boolean} Returns `true` if all elements pass the predicate check,
				*  else `false`
				*/
				function baseEvery(collection, predicate) {
					var result = true;
					baseEach(collection, function(value, index, collection) {
						result = !!predicate(value, index, collection);
						return result;
					});
					return result;
				}
				/**
				* The base implementation of methods like `_.max` and `_.min` which accepts a
				* `comparator` to determine the extremum value.
				*
				* @private
				* @param {Array} array The array to iterate over.
				* @param {Function} iteratee The iteratee invoked per iteration.
				* @param {Function} comparator The comparator used to compare values.
				* @returns {*} Returns the extremum value.
				*/
				function baseExtremum(array, iteratee, comparator) {
					var index = -1, length = array.length;
					while (++index < length) {
						var value = array[index], current = iteratee(value);
						if (current != null && (computed === undefined ? current === current && !isSymbol(current) : comparator(current, computed))) var computed = current, result = value;
					}
					return result;
				}
				/**
				* The base implementation of `_.fill` without an iteratee call guard.
				*
				* @private
				* @param {Array} array The array to fill.
				* @param {*} value The value to fill `array` with.
				* @param {number} [start=0] The start position.
				* @param {number} [end=array.length] The end position.
				* @returns {Array} Returns `array`.
				*/
				function baseFill(array, value, start, end) {
					var length = array.length;
					start = toInteger(start);
					if (start < 0) start = -start > length ? 0 : length + start;
					end = end === undefined || end > length ? length : toInteger(end);
					if (end < 0) end += length;
					end = start > end ? 0 : toLength(end);
					while (start < end) array[start++] = value;
					return array;
				}
				/**
				* The base implementation of `_.filter` without support for iteratee shorthands.
				*
				* @private
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} predicate The function invoked per iteration.
				* @returns {Array} Returns the new filtered array.
				*/
				function baseFilter(collection, predicate) {
					var result = [];
					baseEach(collection, function(value, index, collection) {
						if (predicate(value, index, collection)) result.push(value);
					});
					return result;
				}
				/**
				* The base implementation of `_.flatten` with support for restricting flattening.
				*
				* @private
				* @param {Array} array The array to flatten.
				* @param {number} depth The maximum recursion depth.
				* @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
				* @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
				* @param {Array} [result=[]] The initial result value.
				* @returns {Array} Returns the new flattened array.
				*/
				function baseFlatten(array, depth, predicate, isStrict, result) {
					var index = -1, length = array.length;
					predicate || (predicate = isFlattenable);
					result || (result = []);
					while (++index < length) {
						var value = array[index];
						if (depth > 0 && predicate(value)) {
							if (depth > 1) baseFlatten(value, depth - 1, predicate, isStrict, result);
							else arrayPush(result, value);
						} else if (!isStrict) result[result.length] = value;
					}
					return result;
				}
				/**
				* The base implementation of `baseForOwn` which iterates over `object`
				* properties returned by `keysFunc` and invokes `iteratee` for each property.
				* Iteratee functions may exit iteration early by explicitly returning `false`.
				*
				* @private
				* @param {Object} object The object to iterate over.
				* @param {Function} iteratee The function invoked per iteration.
				* @param {Function} keysFunc The function to get the keys of `object`.
				* @returns {Object} Returns `object`.
				*/
				var baseFor = createBaseFor();
				/**
				* This function is like `baseFor` except that it iterates over properties
				* in the opposite order.
				*
				* @private
				* @param {Object} object The object to iterate over.
				* @param {Function} iteratee The function invoked per iteration.
				* @param {Function} keysFunc The function to get the keys of `object`.
				* @returns {Object} Returns `object`.
				*/
				var baseForRight = createBaseFor(true);
				/**
				* The base implementation of `_.forOwn` without support for iteratee shorthands.
				*
				* @private
				* @param {Object} object The object to iterate over.
				* @param {Function} iteratee The function invoked per iteration.
				* @returns {Object} Returns `object`.
				*/
				function baseForOwn(object, iteratee) {
					return object && baseFor(object, iteratee, keys);
				}
				/**
				* The base implementation of `_.forOwnRight` without support for iteratee shorthands.
				*
				* @private
				* @param {Object} object The object to iterate over.
				* @param {Function} iteratee The function invoked per iteration.
				* @returns {Object} Returns `object`.
				*/
				function baseForOwnRight(object, iteratee) {
					return object && baseForRight(object, iteratee, keys);
				}
				/**
				* The base implementation of `_.functions` which creates an array of
				* `object` function property names filtered from `props`.
				*
				* @private
				* @param {Object} object The object to inspect.
				* @param {Array} props The property names to filter.
				* @returns {Array} Returns the function names.
				*/
				function baseFunctions(object, props) {
					return arrayFilter(props, function(key) {
						return isFunction(object[key]);
					});
				}
				/**
				* The base implementation of `_.get` without support for default values.
				*
				* @private
				* @param {Object} object The object to query.
				* @param {Array|string} path The path of the property to get.
				* @returns {*} Returns the resolved value.
				*/
				function baseGet(object, path) {
					path = castPath(path, object);
					var index = 0, length = path.length;
					while (object != null && index < length) object = object[toKey(path[index++])];
					return index && index == length ? object : undefined;
				}
				/**
				* The base implementation of `getAllKeys` and `getAllKeysIn` which uses
				* `keysFunc` and `symbolsFunc` to get the enumerable property names and
				* symbols of `object`.
				*
				* @private
				* @param {Object} object The object to query.
				* @param {Function} keysFunc The function to get the keys of `object`.
				* @param {Function} symbolsFunc The function to get the symbols of `object`.
				* @returns {Array} Returns the array of property names and symbols.
				*/
				function baseGetAllKeys(object, keysFunc, symbolsFunc) {
					var result = keysFunc(object);
					return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
				}
				/**
				* The base implementation of `getTag` without fallbacks for buggy environments.
				*
				* @private
				* @param {*} value The value to query.
				* @returns {string} Returns the `toStringTag`.
				*/
				function baseGetTag(value) {
					if (value == null) return value === undefined ? undefinedTag : nullTag;
					return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
				}
				/**
				* The base implementation of `_.gt` which doesn't coerce arguments.
				*
				* @private
				* @param {*} value The value to compare.
				* @param {*} other The other value to compare.
				* @returns {boolean} Returns `true` if `value` is greater than `other`,
				*  else `false`.
				*/
				function baseGt(value, other) {
					return value > other;
				}
				/**
				* The base implementation of `_.has` without support for deep paths.
				*
				* @private
				* @param {Object} [object] The object to query.
				* @param {Array|string} key The key to check.
				* @returns {boolean} Returns `true` if `key` exists, else `false`.
				*/
				function baseHas(object, key) {
					return object != null && hasOwnProperty.call(object, key);
				}
				/**
				* The base implementation of `_.hasIn` without support for deep paths.
				*
				* @private
				* @param {Object} [object] The object to query.
				* @param {Array|string} key The key to check.
				* @returns {boolean} Returns `true` if `key` exists, else `false`.
				*/
				function baseHasIn(object, key) {
					return object != null && key in Object(object);
				}
				/**
				* The base implementation of `_.inRange` which doesn't coerce arguments.
				*
				* @private
				* @param {number} number The number to check.
				* @param {number} start The start of the range.
				* @param {number} end The end of the range.
				* @returns {boolean} Returns `true` if `number` is in the range, else `false`.
				*/
				function baseInRange(number, start, end) {
					return number >= nativeMin(start, end) && number < nativeMax(start, end);
				}
				/**
				* The base implementation of methods like `_.intersection`, without support
				* for iteratee shorthands, that accepts an array of arrays to inspect.
				*
				* @private
				* @param {Array} arrays The arrays to inspect.
				* @param {Function} [iteratee] The iteratee invoked per element.
				* @param {Function} [comparator] The comparator invoked per element.
				* @returns {Array} Returns the new array of shared values.
				*/
				function baseIntersection(arrays, iteratee, comparator) {
					var includes = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array(othLength), maxLength = Infinity, result = [];
					while (othIndex--) {
						var array = arrays[othIndex];
						if (othIndex && iteratee) array = arrayMap(array, baseUnary(iteratee));
						maxLength = nativeMin(array.length, maxLength);
						caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined;
					}
					array = arrays[0];
					var index = -1, seen = caches[0];
					outer: while (++index < length && result.length < maxLength) {
						var value = array[index], computed = iteratee ? iteratee(value) : value;
						value = comparator || value !== 0 ? value : 0;
						if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
							othIndex = othLength;
							while (--othIndex) {
								var cache = caches[othIndex];
								if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) continue outer;
							}
							if (seen) seen.push(computed);
							result.push(value);
						}
					}
					return result;
				}
				/**
				* The base implementation of `_.invert` and `_.invertBy` which inverts
				* `object` with values transformed by `iteratee` and set by `setter`.
				*
				* @private
				* @param {Object} object The object to iterate over.
				* @param {Function} setter The function to set `accumulator` values.
				* @param {Function} iteratee The iteratee to transform values.
				* @param {Object} accumulator The initial inverted object.
				* @returns {Function} Returns `accumulator`.
				*/
				function baseInverter(object, setter, iteratee, accumulator) {
					baseForOwn(object, function(value, key, object) {
						setter(accumulator, iteratee(value), key, object);
					});
					return accumulator;
				}
				/**
				* The base implementation of `_.invoke` without support for individual
				* method arguments.
				*
				* @private
				* @param {Object} object The object to query.
				* @param {Array|string} path The path of the method to invoke.
				* @param {Array} args The arguments to invoke the method with.
				* @returns {*} Returns the result of the invoked method.
				*/
				function baseInvoke(object, path, args) {
					path = castPath(path, object);
					object = parent(object, path);
					var func = object == null ? object : object[toKey(last(path))];
					return func == null ? undefined : apply(func, object, args);
				}
				/**
				* The base implementation of `_.isArguments`.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is an `arguments` object,
				*/
				function baseIsArguments(value) {
					return isObjectLike(value) && baseGetTag(value) == argsTag;
				}
				/**
				* The base implementation of `_.isArrayBuffer` without Node.js optimizations.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
				*/
				function baseIsArrayBuffer(value) {
					return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
				}
				/**
				* The base implementation of `_.isDate` without Node.js optimizations.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a date object, else `false`.
				*/
				function baseIsDate(value) {
					return isObjectLike(value) && baseGetTag(value) == dateTag;
				}
				/**
				* The base implementation of `_.isEqual` which supports partial comparisons
				* and tracks traversed objects.
				*
				* @private
				* @param {*} value The value to compare.
				* @param {*} other The other value to compare.
				* @param {boolean} bitmask The bitmask flags.
				*  1 - Unordered comparison
				*  2 - Partial comparison
				* @param {Function} [customizer] The function to customize comparisons.
				* @param {Object} [stack] Tracks traversed `value` and `other` objects.
				* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
				*/
				function baseIsEqual(value, other, bitmask, customizer, stack) {
					if (value === other) return true;
					if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) return value !== value && other !== other;
					return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
				}
				/**
				* A specialized version of `baseIsEqual` for arrays and objects which performs
				* deep comparisons and tracks traversed objects enabling objects with circular
				* references to be compared.
				*
				* @private
				* @param {Object} object The object to compare.
				* @param {Object} other The other object to compare.
				* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
				* @param {Function} customizer The function to customize comparisons.
				* @param {Function} equalFunc The function to determine equivalents of values.
				* @param {Object} [stack] Tracks traversed `object` and `other` objects.
				* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
				*/
				function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
					var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
					objTag = objTag == argsTag ? objectTag : objTag;
					othTag = othTag == argsTag ? objectTag : othTag;
					var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
					if (isSameTag && isBuffer(object)) {
						if (!isBuffer(other)) return false;
						objIsArr = true;
						objIsObj = false;
					}
					if (isSameTag && !objIsObj) {
						stack || (stack = new Stack());
						return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
					}
					if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
						var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
						if (objIsWrapped || othIsWrapped) {
							var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
							stack || (stack = new Stack());
							return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
						}
					}
					if (!isSameTag) return false;
					stack || (stack = new Stack());
					return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
				}
				/**
				* The base implementation of `_.isMap` without Node.js optimizations.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a map, else `false`.
				*/
				function baseIsMap(value) {
					return isObjectLike(value) && getTag(value) == mapTag;
				}
				/**
				* The base implementation of `_.isMatch` without support for iteratee shorthands.
				*
				* @private
				* @param {Object} object The object to inspect.
				* @param {Object} source The object of property values to match.
				* @param {Array} matchData The property names, values, and compare flags to match.
				* @param {Function} [customizer] The function to customize comparisons.
				* @returns {boolean} Returns `true` if `object` is a match, else `false`.
				*/
				function baseIsMatch(object, source, matchData, customizer) {
					var index = matchData.length, length = index, noCustomizer = !customizer;
					if (object == null) return !length;
					object = Object(object);
					while (index--) {
						var data = matchData[index];
						if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return false;
					}
					while (++index < length) {
						data = matchData[index];
						var key = data[0], objValue = object[key], srcValue = data[1];
						if (noCustomizer && data[2]) {
							if (objValue === undefined && !(key in object)) return false;
						} else {
							var stack = new Stack();
							if (customizer) var result = customizer(objValue, srcValue, key, object, source, stack);
							if (!(result === undefined ? baseIsEqual(srcValue, objValue, 3, customizer, stack) : result)) return false;
						}
					}
					return true;
				}
				/**
				* The base implementation of `_.isNative` without bad shim checks.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a native function,
				*  else `false`.
				*/
				function baseIsNative(value) {
					if (!isObject(value) || isMasked(value)) return false;
					return (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
				}
				/**
				* The base implementation of `_.isRegExp` without Node.js optimizations.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
				*/
				function baseIsRegExp(value) {
					return isObjectLike(value) && baseGetTag(value) == regexpTag;
				}
				/**
				* The base implementation of `_.isSet` without Node.js optimizations.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a set, else `false`.
				*/
				function baseIsSet(value) {
					return isObjectLike(value) && getTag(value) == setTag;
				}
				/**
				* The base implementation of `_.isTypedArray` without Node.js optimizations.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
				*/
				function baseIsTypedArray(value) {
					return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
				}
				/**
				* The base implementation of `_.iteratee`.
				*
				* @private
				* @param {*} [value=_.identity] The value to convert to an iteratee.
				* @returns {Function} Returns the iteratee.
				*/
				function baseIteratee(value) {
					if (typeof value == "function") return value;
					if (value == null) return identity;
					if (typeof value == "object") return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
					return property(value);
				}
				/**
				* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
				*
				* @private
				* @param {Object} object The object to query.
				* @returns {Array} Returns the array of property names.
				*/
				function baseKeys(object) {
					if (!isPrototype(object)) return nativeKeys(object);
					var result = [];
					for (var key in Object(object)) if (hasOwnProperty.call(object, key) && key != "constructor") result.push(key);
					return result;
				}
				/**
				* The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
				*
				* @private
				* @param {Object} object The object to query.
				* @returns {Array} Returns the array of property names.
				*/
				function baseKeysIn(object) {
					if (!isObject(object)) return nativeKeysIn(object);
					var isProto = isPrototype(object), result = [];
					for (var key in object) if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) result.push(key);
					return result;
				}
				/**
				* The base implementation of `_.lt` which doesn't coerce arguments.
				*
				* @private
				* @param {*} value The value to compare.
				* @param {*} other The other value to compare.
				* @returns {boolean} Returns `true` if `value` is less than `other`,
				*  else `false`.
				*/
				function baseLt(value, other) {
					return value < other;
				}
				/**
				* The base implementation of `_.map` without support for iteratee shorthands.
				*
				* @private
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} iteratee The function invoked per iteration.
				* @returns {Array} Returns the new mapped array.
				*/
				function baseMap(collection, iteratee) {
					var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
					baseEach(collection, function(value, key, collection) {
						result[++index] = iteratee(value, key, collection);
					});
					return result;
				}
				/**
				* The base implementation of `_.matches` which doesn't clone `source`.
				*
				* @private
				* @param {Object} source The object of property values to match.
				* @returns {Function} Returns the new spec function.
				*/
				function baseMatches(source) {
					var matchData = getMatchData(source);
					if (matchData.length == 1 && matchData[0][2]) return matchesStrictComparable(matchData[0][0], matchData[0][1]);
					return function(object) {
						return object === source || baseIsMatch(object, source, matchData);
					};
				}
				/**
				* The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
				*
				* @private
				* @param {string} path The path of the property to get.
				* @param {*} srcValue The value to match.
				* @returns {Function} Returns the new spec function.
				*/
				function baseMatchesProperty(path, srcValue) {
					if (isKey(path) && isStrictComparable(srcValue)) return matchesStrictComparable(toKey(path), srcValue);
					return function(object) {
						var objValue = get(object, path);
						return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, 3);
					};
				}
				/**
				* The base implementation of `_.merge` without support for multiple sources.
				*
				* @private
				* @param {Object} object The destination object.
				* @param {Object} source The source object.
				* @param {number} srcIndex The index of `source`.
				* @param {Function} [customizer] The function to customize merged values.
				* @param {Object} [stack] Tracks traversed source values and their merged
				*  counterparts.
				*/
				function baseMerge(object, source, srcIndex, customizer, stack) {
					if (object === source) return;
					baseFor(source, function(srcValue, key) {
						stack || (stack = new Stack());
						if (isObject(srcValue)) baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
						else {
							var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined;
							if (newValue === undefined) newValue = srcValue;
							assignMergeValue(object, key, newValue);
						}
					}, keysIn);
				}
				/**
				* A specialized version of `baseMerge` for arrays and objects which performs
				* deep merges and tracks traversed objects enabling objects with circular
				* references to be merged.
				*
				* @private
				* @param {Object} object The destination object.
				* @param {Object} source The source object.
				* @param {string} key The key of the value to merge.
				* @param {number} srcIndex The index of `source`.
				* @param {Function} mergeFunc The function to merge values.
				* @param {Function} [customizer] The function to customize assigned values.
				* @param {Object} [stack] Tracks traversed source values and their merged
				*  counterparts.
				*/
				function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
					var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
					if (stacked) {
						assignMergeValue(object, key, stacked);
						return;
					}
					var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined;
					var isCommon = newValue === undefined;
					if (isCommon) {
						var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
						newValue = srcValue;
						if (isArr || isBuff || isTyped) {
							if (isArray(objValue)) newValue = objValue;
							else if (isArrayLikeObject(objValue)) newValue = copyArray(objValue);
							else if (isBuff) {
								isCommon = false;
								newValue = cloneBuffer(srcValue, true);
							} else if (isTyped) {
								isCommon = false;
								newValue = cloneTypedArray(srcValue, true);
							} else newValue = [];
						} else if (isPlainObject(srcValue) || isArguments(srcValue)) {
							newValue = objValue;
							if (isArguments(objValue)) newValue = toPlainObject(objValue);
							else if (!isObject(objValue) || isFunction(objValue)) newValue = initCloneObject(srcValue);
						} else isCommon = false;
					}
					if (isCommon) {
						stack.set(srcValue, newValue);
						mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
						stack["delete"](srcValue);
					}
					assignMergeValue(object, key, newValue);
				}
				/**
				* The base implementation of `_.nth` which doesn't coerce arguments.
				*
				* @private
				* @param {Array} array The array to query.
				* @param {number} n The index of the element to return.
				* @returns {*} Returns the nth element of `array`.
				*/
				function baseNth(array, n) {
					var length = array.length;
					if (!length) return;
					n += n < 0 ? length : 0;
					return isIndex(n, length) ? array[n] : undefined;
				}
				/**
				* The base implementation of `_.orderBy` without param guards.
				*
				* @private
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
				* @param {string[]} orders The sort orders of `iteratees`.
				* @returns {Array} Returns the new sorted array.
				*/
				function baseOrderBy(collection, iteratees, orders) {
					if (iteratees.length) iteratees = arrayMap(iteratees, function(iteratee) {
						if (isArray(iteratee)) return function(value) {
							return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
						};
						return iteratee;
					});
					else iteratees = [identity];
					var index = -1;
					iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
					return baseSortBy(baseMap(collection, function(value, key, collection) {
						return {
							"criteria": arrayMap(iteratees, function(iteratee) {
								return iteratee(value);
							}),
							"index": ++index,
							"value": value
						};
					}), function(object, other) {
						return compareMultiple(object, other, orders);
					});
				}
				/**
				* The base implementation of `_.pick` without support for individual
				* property identifiers.
				*
				* @private
				* @param {Object} object The source object.
				* @param {string[]} paths The property paths to pick.
				* @returns {Object} Returns the new object.
				*/
				function basePick(object, paths) {
					return basePickBy(object, paths, function(value, path) {
						return hasIn(object, path);
					});
				}
				/**
				* The base implementation of  `_.pickBy` without support for iteratee shorthands.
				*
				* @private
				* @param {Object} object The source object.
				* @param {string[]} paths The property paths to pick.
				* @param {Function} predicate The function invoked per property.
				* @returns {Object} Returns the new object.
				*/
				function basePickBy(object, paths, predicate) {
					var index = -1, length = paths.length, result = {};
					while (++index < length) {
						var path = paths[index], value = baseGet(object, path);
						if (predicate(value, path)) baseSet(result, castPath(path, object), value);
					}
					return result;
				}
				/**
				* A specialized version of `baseProperty` which supports deep paths.
				*
				* @private
				* @param {Array|string} path The path of the property to get.
				* @returns {Function} Returns the new accessor function.
				*/
				function basePropertyDeep(path) {
					return function(object) {
						return baseGet(object, path);
					};
				}
				/**
				* The base implementation of `_.pullAllBy` without support for iteratee
				* shorthands.
				*
				* @private
				* @param {Array} array The array to modify.
				* @param {Array} values The values to remove.
				* @param {Function} [iteratee] The iteratee invoked per element.
				* @param {Function} [comparator] The comparator invoked per element.
				* @returns {Array} Returns `array`.
				*/
				function basePullAll(array, values, iteratee, comparator) {
					var indexOf = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values.length, seen = array;
					if (array === values) values = copyArray(values);
					if (iteratee) seen = arrayMap(array, baseUnary(iteratee));
					while (++index < length) {
						var fromIndex = 0, value = values[index], computed = iteratee ? iteratee(value) : value;
						while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
							if (seen !== array) splice.call(seen, fromIndex, 1);
							splice.call(array, fromIndex, 1);
						}
					}
					return array;
				}
				/**
				* The base implementation of `_.pullAt` without support for individual
				* indexes or capturing the removed elements.
				*
				* @private
				* @param {Array} array The array to modify.
				* @param {number[]} indexes The indexes of elements to remove.
				* @returns {Array} Returns `array`.
				*/
				function basePullAt(array, indexes) {
					var length = array ? indexes.length : 0, lastIndex = length - 1;
					while (length--) {
						var index = indexes[length];
						if (length == lastIndex || index !== previous) {
							var previous = index;
							if (isIndex(index)) splice.call(array, index, 1);
							else baseUnset(array, index);
						}
					}
					return array;
				}
				/**
				* The base implementation of `_.random` without support for returning
				* floating-point numbers.
				*
				* @private
				* @param {number} lower The lower bound.
				* @param {number} upper The upper bound.
				* @returns {number} Returns the random number.
				*/
				function baseRandom(lower, upper) {
					return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
				}
				/**
				* The base implementation of `_.range` and `_.rangeRight` which doesn't
				* coerce arguments.
				*
				* @private
				* @param {number} start The start of the range.
				* @param {number} end The end of the range.
				* @param {number} step The value to increment or decrement by.
				* @param {boolean} [fromRight] Specify iterating from right to left.
				* @returns {Array} Returns the range of numbers.
				*/
				function baseRange(start, end, step, fromRight) {
					var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result = Array(length);
					while (length--) {
						result[fromRight ? length : ++index] = start;
						start += step;
					}
					return result;
				}
				/**
				* The base implementation of `_.repeat` which doesn't coerce arguments.
				*
				* @private
				* @param {string} string The string to repeat.
				* @param {number} n The number of times to repeat the string.
				* @returns {string} Returns the repeated string.
				*/
				function baseRepeat(string, n) {
					var result = "";
					if (!string || n < 1 || n > MAX_SAFE_INTEGER) return result;
					do {
						if (n % 2) result += string;
						n = nativeFloor(n / 2);
						if (n) string += string;
					} while (n);
					return result;
				}
				/**
				* The base implementation of `_.rest` which doesn't validate or coerce arguments.
				*
				* @private
				* @param {Function} func The function to apply a rest parameter to.
				* @param {number} [start=func.length-1] The start position of the rest parameter.
				* @returns {Function} Returns the new function.
				*/
				function baseRest(func, start) {
					return setToString(overRest(func, start, identity), func + "");
				}
				/**
				* The base implementation of `_.sample`.
				*
				* @private
				* @param {Array|Object} collection The collection to sample.
				* @returns {*} Returns the random element.
				*/
				function baseSample(collection) {
					return arraySample(values(collection));
				}
				/**
				* The base implementation of `_.sampleSize` without param guards.
				*
				* @private
				* @param {Array|Object} collection The collection to sample.
				* @param {number} n The number of elements to sample.
				* @returns {Array} Returns the random elements.
				*/
				function baseSampleSize(collection, n) {
					var array = values(collection);
					return shuffleSelf(array, baseClamp(n, 0, array.length));
				}
				/**
				* The base implementation of `_.set`.
				*
				* @private
				* @param {Object} object The object to modify.
				* @param {Array|string} path The path of the property to set.
				* @param {*} value The value to set.
				* @param {Function} [customizer] The function to customize path creation.
				* @returns {Object} Returns `object`.
				*/
				function baseSet(object, path, value, customizer) {
					if (!isObject(object)) return object;
					path = castPath(path, object);
					var index = -1, length = path.length, lastIndex = length - 1, nested = object;
					while (nested != null && ++index < length) {
						var key = toKey(path[index]), newValue = value;
						if (key === "__proto__" || key === "constructor" || key === "prototype") return object;
						if (index != lastIndex) {
							var objValue = nested[key];
							newValue = customizer ? customizer(objValue, key, nested) : undefined;
							if (newValue === undefined) newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
						}
						assignValue(nested, key, newValue);
						nested = nested[key];
					}
					return object;
				}
				/**
				* The base implementation of `setData` without support for hot loop shorting.
				*
				* @private
				* @param {Function} func The function to associate metadata with.
				* @param {*} data The metadata.
				* @returns {Function} Returns `func`.
				*/
				var baseSetData = !metaMap ? identity : function(func, data) {
					metaMap.set(func, data);
					return func;
				};
				/**
				* The base implementation of `setToString` without support for hot loop shorting.
				*
				* @private
				* @param {Function} func The function to modify.
				* @param {Function} string The `toString` result.
				* @returns {Function} Returns `func`.
				*/
				var baseSetToString = !defineProperty ? identity : function(func, string) {
					return defineProperty(func, "toString", {
						"configurable": true,
						"enumerable": false,
						"value": constant(string),
						"writable": true
					});
				};
				/**
				* The base implementation of `_.shuffle`.
				*
				* @private
				* @param {Array|Object} collection The collection to shuffle.
				* @returns {Array} Returns the new shuffled array.
				*/
				function baseShuffle(collection) {
					return shuffleSelf(values(collection));
				}
				/**
				* The base implementation of `_.slice` without an iteratee call guard.
				*
				* @private
				* @param {Array} array The array to slice.
				* @param {number} [start=0] The start position.
				* @param {number} [end=array.length] The end position.
				* @returns {Array} Returns the slice of `array`.
				*/
				function baseSlice(array, start, end) {
					var index = -1, length = array.length;
					if (start < 0) start = -start > length ? 0 : length + start;
					end = end > length ? length : end;
					if (end < 0) end += length;
					length = start > end ? 0 : end - start >>> 0;
					start >>>= 0;
					var result = Array(length);
					while (++index < length) result[index] = array[index + start];
					return result;
				}
				/**
				* The base implementation of `_.some` without support for iteratee shorthands.
				*
				* @private
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} predicate The function invoked per iteration.
				* @returns {boolean} Returns `true` if any element passes the predicate check,
				*  else `false`.
				*/
				function baseSome(collection, predicate) {
					var result;
					baseEach(collection, function(value, index, collection) {
						result = predicate(value, index, collection);
						return !result;
					});
					return !!result;
				}
				/**
				* The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
				* performs a binary search of `array` to determine the index at which `value`
				* should be inserted into `array` in order to maintain its sort order.
				*
				* @private
				* @param {Array} array The sorted array to inspect.
				* @param {*} value The value to evaluate.
				* @param {boolean} [retHighest] Specify returning the highest qualified index.
				* @returns {number} Returns the index at which `value` should be inserted
				*  into `array`.
				*/
				function baseSortedIndex(array, value, retHighest) {
					var low = 0, high = array == null ? low : array.length;
					if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
						while (low < high) {
							var mid = low + high >>> 1, computed = array[mid];
							if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) low = mid + 1;
							else high = mid;
						}
						return high;
					}
					return baseSortedIndexBy(array, value, identity, retHighest);
				}
				/**
				* The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
				* which invokes `iteratee` for `value` and each element of `array` to compute
				* their sort ranking. The iteratee is invoked with one argument; (value).
				*
				* @private
				* @param {Array} array The sorted array to inspect.
				* @param {*} value The value to evaluate.
				* @param {Function} iteratee The iteratee invoked per element.
				* @param {boolean} [retHighest] Specify returning the highest qualified index.
				* @returns {number} Returns the index at which `value` should be inserted
				*  into `array`.
				*/
				function baseSortedIndexBy(array, value, iteratee, retHighest) {
					var low = 0, high = array == null ? 0 : array.length;
					if (high === 0) return 0;
					value = iteratee(value);
					var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined;
					while (low < high) {
						var mid = nativeFloor((low + high) / 2), computed = iteratee(array[mid]), othIsDefined = computed !== undefined, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
						if (valIsNaN) var setLow = retHighest || othIsReflexive;
						else if (valIsUndefined) setLow = othIsReflexive && (retHighest || othIsDefined);
						else if (valIsNull) setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
						else if (valIsSymbol) setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
						else if (othIsNull || othIsSymbol) setLow = false;
						else setLow = retHighest ? computed <= value : computed < value;
						if (setLow) low = mid + 1;
						else high = mid;
					}
					return nativeMin(high, MAX_ARRAY_INDEX);
				}
				/**
				* The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
				* support for iteratee shorthands.
				*
				* @private
				* @param {Array} array The array to inspect.
				* @param {Function} [iteratee] The iteratee invoked per element.
				* @returns {Array} Returns the new duplicate free array.
				*/
				function baseSortedUniq(array, iteratee) {
					var index = -1, length = array.length, resIndex = 0, result = [];
					while (++index < length) {
						var value = array[index], computed = iteratee ? iteratee(value) : value;
						if (!index || !eq(computed, seen)) {
							var seen = computed;
							result[resIndex++] = value === 0 ? 0 : value;
						}
					}
					return result;
				}
				/**
				* The base implementation of `_.toNumber` which doesn't ensure correct
				* conversions of binary, hexadecimal, or octal string values.
				*
				* @private
				* @param {*} value The value to process.
				* @returns {number} Returns the number.
				*/
				function baseToNumber(value) {
					if (typeof value == "number") return value;
					if (isSymbol(value)) return NAN;
					return +value;
				}
				/**
				* The base implementation of `_.toString` which doesn't convert nullish
				* values to empty strings.
				*
				* @private
				* @param {*} value The value to process.
				* @returns {string} Returns the string.
				*/
				function baseToString(value) {
					if (typeof value == "string") return value;
					if (isArray(value)) return arrayMap(value, baseToString) + "";
					if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
					var result = value + "";
					return result == "0" && 1 / value == -Infinity ? "-0" : result;
				}
				/**
				* The base implementation of `_.uniqBy` without support for iteratee shorthands.
				*
				* @private
				* @param {Array} array The array to inspect.
				* @param {Function} [iteratee] The iteratee invoked per element.
				* @param {Function} [comparator] The comparator invoked per element.
				* @returns {Array} Returns the new duplicate free array.
				*/
				function baseUniq(array, iteratee, comparator) {
					var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
					if (comparator) {
						isCommon = false;
						includes = arrayIncludesWith;
					} else if (length >= LARGE_ARRAY_SIZE) {
						var set = iteratee ? null : createSet(array);
						if (set) return setToArray(set);
						isCommon = false;
						includes = cacheHas;
						seen = new SetCache();
					} else seen = iteratee ? [] : result;
					outer: while (++index < length) {
						var value = array[index], computed = iteratee ? iteratee(value) : value;
						value = comparator || value !== 0 ? value : 0;
						if (isCommon && computed === computed) {
							var seenIndex = seen.length;
							while (seenIndex--) if (seen[seenIndex] === computed) continue outer;
							if (iteratee) seen.push(computed);
							result.push(value);
						} else if (!includes(seen, computed, comparator)) {
							if (seen !== result) seen.push(computed);
							result.push(value);
						}
					}
					return result;
				}
				/**
				* The base implementation of `_.unset`.
				*
				* @private
				* @param {Object} object The object to modify.
				* @param {Array|string} path The property path to unset.
				* @returns {boolean} Returns `true` if the property is deleted, else `false`.
				*/
				function baseUnset(object, path) {
					path = castPath(path, object);
					var index = -1, length = path.length;
					if (!length) return true;
					while (++index < length) {
						var key = toKey(path[index]);
						if (key === "__proto__" && !hasOwnProperty.call(object, "__proto__")) return false;
						if ((key === "constructor" || key === "prototype") && index < length - 1) return false;
					}
					var obj = parent(object, path);
					return obj == null || delete obj[toKey(last(path))];
				}
				/**
				* The base implementation of `_.update`.
				*
				* @private
				* @param {Object} object The object to modify.
				* @param {Array|string} path The path of the property to update.
				* @param {Function} updater The function to produce the updated value.
				* @param {Function} [customizer] The function to customize path creation.
				* @returns {Object} Returns `object`.
				*/
				function baseUpdate(object, path, updater, customizer) {
					return baseSet(object, path, updater(baseGet(object, path)), customizer);
				}
				/**
				* The base implementation of methods like `_.dropWhile` and `_.takeWhile`
				* without support for iteratee shorthands.
				*
				* @private
				* @param {Array} array The array to query.
				* @param {Function} predicate The function invoked per iteration.
				* @param {boolean} [isDrop] Specify dropping elements instead of taking them.
				* @param {boolean} [fromRight] Specify iterating from right to left.
				* @returns {Array} Returns the slice of `array`.
				*/
				function baseWhile(array, predicate, isDrop, fromRight) {
					var length = array.length, index = fromRight ? length : -1;
					while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array));
					return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
				}
				/**
				* The base implementation of `wrapperValue` which returns the result of
				* performing a sequence of actions on the unwrapped `value`, where each
				* successive action is supplied the return value of the previous.
				*
				* @private
				* @param {*} value The unwrapped value.
				* @param {Array} actions Actions to perform to resolve the unwrapped value.
				* @returns {*} Returns the resolved value.
				*/
				function baseWrapperValue(value, actions) {
					var result = value;
					if (result instanceof LazyWrapper) result = result.value();
					return arrayReduce(actions, function(result, action) {
						return action.func.apply(action.thisArg, arrayPush([result], action.args));
					}, result);
				}
				/**
				* The base implementation of methods like `_.xor`, without support for
				* iteratee shorthands, that accepts an array of arrays to inspect.
				*
				* @private
				* @param {Array} arrays The arrays to inspect.
				* @param {Function} [iteratee] The iteratee invoked per element.
				* @param {Function} [comparator] The comparator invoked per element.
				* @returns {Array} Returns the new array of values.
				*/
				function baseXor(arrays, iteratee, comparator) {
					var length = arrays.length;
					if (length < 2) return length ? baseUniq(arrays[0]) : [];
					var index = -1, result = Array(length);
					while (++index < length) {
						var array = arrays[index], othIndex = -1;
						while (++othIndex < length) if (othIndex != index) result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
					}
					return baseUniq(baseFlatten(result, 1), iteratee, comparator);
				}
				/**
				* This base implementation of `_.zipObject` which assigns values using `assignFunc`.
				*
				* @private
				* @param {Array} props The property identifiers.
				* @param {Array} values The property values.
				* @param {Function} assignFunc The function to assign values.
				* @returns {Object} Returns the new object.
				*/
				function baseZipObject(props, values, assignFunc) {
					var index = -1, length = props.length, valsLength = values.length, result = {};
					while (++index < length) {
						var value = index < valsLength ? values[index] : undefined;
						assignFunc(result, props[index], value);
					}
					return result;
				}
				/**
				* Casts `value` to an empty array if it's not an array like object.
				*
				* @private
				* @param {*} value The value to inspect.
				* @returns {Array|Object} Returns the cast array-like object.
				*/
				function castArrayLikeObject(value) {
					return isArrayLikeObject(value) ? value : [];
				}
				/**
				* Casts `value` to `identity` if it's not a function.
				*
				* @private
				* @param {*} value The value to inspect.
				* @returns {Function} Returns cast function.
				*/
				function castFunction(value) {
					return typeof value == "function" ? value : identity;
				}
				/**
				* Casts `value` to a path array if it's not one.
				*
				* @private
				* @param {*} value The value to inspect.
				* @param {Object} [object] The object to query keys on.
				* @returns {Array} Returns the cast property path array.
				*/
				function castPath(value, object) {
					if (isArray(value)) return value;
					return isKey(value, object) ? [value] : stringToPath(toString(value));
				}
				/**
				* A `baseRest` alias which can be replaced with `identity` by module
				* replacement plugins.
				*
				* @private
				* @type {Function}
				* @param {Function} func The function to apply a rest parameter to.
				* @returns {Function} Returns the new function.
				*/
				var castRest = baseRest;
				/**
				* Casts `array` to a slice if it's needed.
				*
				* @private
				* @param {Array} array The array to inspect.
				* @param {number} start The start position.
				* @param {number} [end=array.length] The end position.
				* @returns {Array} Returns the cast slice.
				*/
				function castSlice(array, start, end) {
					var length = array.length;
					end = end === undefined ? length : end;
					return !start && end >= length ? array : baseSlice(array, start, end);
				}
				/**
				* A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
				*
				* @private
				* @param {number|Object} id The timer id or timeout object of the timer to clear.
				*/
				var clearTimeout = ctxClearTimeout || function(id) {
					return root.clearTimeout(id);
				};
				/**
				* Creates a clone of  `buffer`.
				*
				* @private
				* @param {Buffer} buffer The buffer to clone.
				* @param {boolean} [isDeep] Specify a deep clone.
				* @returns {Buffer} Returns the cloned buffer.
				*/
				function cloneBuffer(buffer, isDeep) {
					if (isDeep) return buffer.slice();
					var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
					buffer.copy(result);
					return result;
				}
				/**
				* Creates a clone of `arrayBuffer`.
				*
				* @private
				* @param {ArrayBuffer} arrayBuffer The array buffer to clone.
				* @returns {ArrayBuffer} Returns the cloned array buffer.
				*/
				function cloneArrayBuffer(arrayBuffer) {
					var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
					new Uint8Array(result).set(new Uint8Array(arrayBuffer));
					return result;
				}
				/**
				* Creates a clone of `dataView`.
				*
				* @private
				* @param {Object} dataView The data view to clone.
				* @param {boolean} [isDeep] Specify a deep clone.
				* @returns {Object} Returns the cloned data view.
				*/
				function cloneDataView(dataView, isDeep) {
					var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
					return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
				}
				/**
				* Creates a clone of `regexp`.
				*
				* @private
				* @param {Object} regexp The regexp to clone.
				* @returns {Object} Returns the cloned regexp.
				*/
				function cloneRegExp(regexp) {
					var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
					result.lastIndex = regexp.lastIndex;
					return result;
				}
				/**
				* Creates a clone of the `symbol` object.
				*
				* @private
				* @param {Object} symbol The symbol object to clone.
				* @returns {Object} Returns the cloned symbol object.
				*/
				function cloneSymbol(symbol) {
					return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
				}
				/**
				* Creates a clone of `typedArray`.
				*
				* @private
				* @param {Object} typedArray The typed array to clone.
				* @param {boolean} [isDeep] Specify a deep clone.
				* @returns {Object} Returns the cloned typed array.
				*/
				function cloneTypedArray(typedArray, isDeep) {
					var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
					return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
				}
				/**
				* Compares values to sort them in ascending order.
				*
				* @private
				* @param {*} value The value to compare.
				* @param {*} other The other value to compare.
				* @returns {number} Returns the sort order indicator for `value`.
				*/
				function compareAscending(value, other) {
					if (value !== other) {
						var valIsDefined = value !== undefined, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
						var othIsDefined = other !== undefined, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
						if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) return 1;
						if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) return -1;
					}
					return 0;
				}
				/**
				* Used by `_.orderBy` to compare multiple properties of a value to another
				* and stable sort them.
				*
				* If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
				* specify an order of "desc" for descending or "asc" for ascending sort order
				* of corresponding values.
				*
				* @private
				* @param {Object} object The object to compare.
				* @param {Object} other The other object to compare.
				* @param {boolean[]|string[]} orders The order to sort by for each property.
				* @returns {number} Returns the sort order indicator for `object`.
				*/
				function compareMultiple(object, other, orders) {
					var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
					while (++index < length) {
						var result = compareAscending(objCriteria[index], othCriteria[index]);
						if (result) {
							if (index >= ordersLength) return result;
							return result * (orders[index] == "desc" ? -1 : 1);
						}
					}
					return object.index - other.index;
				}
				/**
				* Creates an array that is the composition of partially applied arguments,
				* placeholders, and provided arguments into a single array of arguments.
				*
				* @private
				* @param {Array} args The provided arguments.
				* @param {Array} partials The arguments to prepend to those provided.
				* @param {Array} holders The `partials` placeholder indexes.
				* @params {boolean} [isCurried] Specify composing for a curried function.
				* @returns {Array} Returns the new array of composed arguments.
				*/
				function composeArgs(args, partials, holders, isCurried) {
					var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(leftLength + rangeLength), isUncurried = !isCurried;
					while (++leftIndex < leftLength) result[leftIndex] = partials[leftIndex];
					while (++argsIndex < holdersLength) if (isUncurried || argsIndex < argsLength) result[holders[argsIndex]] = args[argsIndex];
					while (rangeLength--) result[leftIndex++] = args[argsIndex++];
					return result;
				}
				/**
				* This function is like `composeArgs` except that the arguments composition
				* is tailored for `_.partialRight`.
				*
				* @private
				* @param {Array} args The provided arguments.
				* @param {Array} partials The arguments to append to those provided.
				* @param {Array} holders The `partials` placeholder indexes.
				* @params {boolean} [isCurried] Specify composing for a curried function.
				* @returns {Array} Returns the new array of composed arguments.
				*/
				function composeArgsRight(args, partials, holders, isCurried) {
					var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(rangeLength + rightLength), isUncurried = !isCurried;
					while (++argsIndex < rangeLength) result[argsIndex] = args[argsIndex];
					var offset = argsIndex;
					while (++rightIndex < rightLength) result[offset + rightIndex] = partials[rightIndex];
					while (++holdersIndex < holdersLength) if (isUncurried || argsIndex < argsLength) result[offset + holders[holdersIndex]] = args[argsIndex++];
					return result;
				}
				/**
				* Copies the values of `source` to `array`.
				*
				* @private
				* @param {Array} source The array to copy values from.
				* @param {Array} [array=[]] The array to copy values to.
				* @returns {Array} Returns `array`.
				*/
				function copyArray(source, array) {
					var index = -1, length = source.length;
					array || (array = Array(length));
					while (++index < length) array[index] = source[index];
					return array;
				}
				/**
				* Copies properties of `source` to `object`.
				*
				* @private
				* @param {Object} source The object to copy properties from.
				* @param {Array} props The property identifiers to copy.
				* @param {Object} [object={}] The object to copy properties to.
				* @param {Function} [customizer] The function to customize copied values.
				* @returns {Object} Returns `object`.
				*/
				function copyObject(source, props, object, customizer) {
					var isNew = !object;
					object || (object = {});
					var index = -1, length = props.length;
					while (++index < length) {
						var key = props[index];
						var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
						if (newValue === undefined) newValue = source[key];
						if (isNew) baseAssignValue(object, key, newValue);
						else assignValue(object, key, newValue);
					}
					return object;
				}
				/**
				* Copies own symbols of `source` to `object`.
				*
				* @private
				* @param {Object} source The object to copy symbols from.
				* @param {Object} [object={}] The object to copy symbols to.
				* @returns {Object} Returns `object`.
				*/
				function copySymbols(source, object) {
					return copyObject(source, getSymbols(source), object);
				}
				/**
				* Copies own and inherited symbols of `source` to `object`.
				*
				* @private
				* @param {Object} source The object to copy symbols from.
				* @param {Object} [object={}] The object to copy symbols to.
				* @returns {Object} Returns `object`.
				*/
				function copySymbolsIn(source, object) {
					return copyObject(source, getSymbolsIn(source), object);
				}
				/**
				* Creates a function like `_.groupBy`.
				*
				* @private
				* @param {Function} setter The function to set accumulator values.
				* @param {Function} [initializer] The accumulator object initializer.
				* @returns {Function} Returns the new aggregator function.
				*/
				function createAggregator(setter, initializer) {
					return function(collection, iteratee) {
						var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
						return func(collection, setter, getIteratee(iteratee, 2), accumulator);
					};
				}
				/**
				* Creates a function like `_.assign`.
				*
				* @private
				* @param {Function} assigner The function to assign values.
				* @returns {Function} Returns the new assigner function.
				*/
				function createAssigner(assigner) {
					return baseRest(function(object, sources) {
						var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined, guard = length > 2 ? sources[2] : undefined;
						customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined;
						if (guard && isIterateeCall(sources[0], sources[1], guard)) {
							customizer = length < 3 ? undefined : customizer;
							length = 1;
						}
						object = Object(object);
						while (++index < length) {
							var source = sources[index];
							if (source) assigner(object, source, index, customizer);
						}
						return object;
					});
				}
				/**
				* Creates a `baseEach` or `baseEachRight` function.
				*
				* @private
				* @param {Function} eachFunc The function to iterate over a collection.
				* @param {boolean} [fromRight] Specify iterating from right to left.
				* @returns {Function} Returns the new base function.
				*/
				function createBaseEach(eachFunc, fromRight) {
					return function(collection, iteratee) {
						if (collection == null) return collection;
						if (!isArrayLike(collection)) return eachFunc(collection, iteratee);
						var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
						while (fromRight ? index-- : ++index < length) if (iteratee(iterable[index], index, iterable) === false) break;
						return collection;
					};
				}
				/**
				* Creates a base function for methods like `_.forIn` and `_.forOwn`.
				*
				* @private
				* @param {boolean} [fromRight] Specify iterating from right to left.
				* @returns {Function} Returns the new base function.
				*/
				function createBaseFor(fromRight) {
					return function(object, iteratee, keysFunc) {
						var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
						while (length--) {
							var key = props[fromRight ? length : ++index];
							if (iteratee(iterable[key], key, iterable) === false) break;
						}
						return object;
					};
				}
				/**
				* Creates a function that wraps `func` to invoke it with the optional `this`
				* binding of `thisArg`.
				*
				* @private
				* @param {Function} func The function to wrap.
				* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
				* @param {*} [thisArg] The `this` binding of `func`.
				* @returns {Function} Returns the new wrapped function.
				*/
				function createBind(func, bitmask, thisArg) {
					var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
					function wrapper() {
						return (this && this !== root && this instanceof wrapper ? Ctor : func).apply(isBind ? thisArg : this, arguments);
					}
					return wrapper;
				}
				/**
				* Creates a function like `_.lowerFirst`.
				*
				* @private
				* @param {string} methodName The name of the `String` case method to use.
				* @returns {Function} Returns the new case function.
				*/
				function createCaseFirst(methodName) {
					return function(string) {
						string = toString(string);
						var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined;
						var chr = strSymbols ? strSymbols[0] : string.charAt(0);
						var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
						return chr[methodName]() + trailing;
					};
				}
				/**
				* Creates a function like `_.camelCase`.
				*
				* @private
				* @param {Function} callback The function to combine each word.
				* @returns {Function} Returns the new compounder function.
				*/
				function createCompounder(callback) {
					return function(string) {
						return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
					};
				}
				/**
				* Creates a function that produces an instance of `Ctor` regardless of
				* whether it was invoked as part of a `new` expression or by `call` or `apply`.
				*
				* @private
				* @param {Function} Ctor The constructor to wrap.
				* @returns {Function} Returns the new wrapped function.
				*/
				function createCtor(Ctor) {
					return function() {
						var args = arguments;
						switch (args.length) {
							case 0: return new Ctor();
							case 1: return new Ctor(args[0]);
							case 2: return new Ctor(args[0], args[1]);
							case 3: return new Ctor(args[0], args[1], args[2]);
							case 4: return new Ctor(args[0], args[1], args[2], args[3]);
							case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
							case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
							case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
						}
						var thisBinding = baseCreate(Ctor.prototype), result = Ctor.apply(thisBinding, args);
						return isObject(result) ? result : thisBinding;
					};
				}
				/**
				* Creates a function that wraps `func` to enable currying.
				*
				* @private
				* @param {Function} func The function to wrap.
				* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
				* @param {number} arity The arity of `func`.
				* @returns {Function} Returns the new wrapped function.
				*/
				function createCurry(func, bitmask, arity) {
					var Ctor = createCtor(func);
					function wrapper() {
						var length = arguments.length, args = Array(length), index = length, placeholder = getHolder(wrapper);
						while (index--) args[index] = arguments[index];
						var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
						length -= holders.length;
						if (length < arity) return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined, args, holders, undefined, undefined, arity - length);
						return apply(this && this !== root && this instanceof wrapper ? Ctor : func, this, args);
					}
					return wrapper;
				}
				/**
				* Creates a `_.find` or `_.findLast` function.
				*
				* @private
				* @param {Function} findIndexFunc The function to find the collection index.
				* @returns {Function} Returns the new find function.
				*/
				function createFind(findIndexFunc) {
					return function(collection, predicate, fromIndex) {
						var iterable = Object(collection);
						if (!isArrayLike(collection)) {
							var iteratee = getIteratee(predicate, 3);
							collection = keys(collection);
							predicate = function(key) {
								return iteratee(iterable[key], key, iterable);
							};
						}
						var index = findIndexFunc(collection, predicate, fromIndex);
						return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
					};
				}
				/**
				* Creates a `_.flow` or `_.flowRight` function.
				*
				* @private
				* @param {boolean} [fromRight] Specify iterating from right to left.
				* @returns {Function} Returns the new flow function.
				*/
				function createFlow(fromRight) {
					return flatRest(function(funcs) {
						var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
						if (fromRight) funcs.reverse();
						while (index--) {
							var func = funcs[index];
							if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
							if (prereq && !wrapper && getFuncName(func) == "wrapper") var wrapper = new LodashWrapper([], true);
						}
						index = wrapper ? index : length;
						while (++index < length) {
							func = funcs[index];
							var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined;
							if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
							else wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
						}
						return function() {
							var args = arguments, value = args[0];
							if (wrapper && args.length == 1 && isArray(value)) return wrapper.plant(value).value();
							var index = 0, result = length ? funcs[index].apply(this, args) : value;
							while (++index < length) result = funcs[index].call(this, result);
							return result;
						};
					});
				}
				/**
				* Creates a function that wraps `func` to invoke it with optional `this`
				* binding of `thisArg`, partial application, and currying.
				*
				* @private
				* @param {Function|string} func The function or method name to wrap.
				* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
				* @param {*} [thisArg] The `this` binding of `func`.
				* @param {Array} [partials] The arguments to prepend to those provided to
				*  the new function.
				* @param {Array} [holders] The `partials` placeholder indexes.
				* @param {Array} [partialsRight] The arguments to append to those provided
				*  to the new function.
				* @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
				* @param {Array} [argPos] The argument positions of the new function.
				* @param {number} [ary] The arity cap of `func`.
				* @param {number} [arity] The arity of `func`.
				* @returns {Function} Returns the new wrapped function.
				*/
				function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
					var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined : createCtor(func);
					function wrapper() {
						var length = arguments.length, args = Array(length), index = length;
						while (index--) args[index] = arguments[index];
						if (isCurried) var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
						if (partials) args = composeArgs(args, partials, holders, isCurried);
						if (partialsRight) args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
						length -= holdersCount;
						if (isCurried && length < arity) {
							var newHolders = replaceHolders(args, placeholder);
							return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
						}
						var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
						length = args.length;
						if (argPos) args = reorder(args, argPos);
						else if (isFlip && length > 1) args.reverse();
						if (isAry && ary < length) args.length = ary;
						if (this && this !== root && this instanceof wrapper) fn = Ctor || createCtor(fn);
						return fn.apply(thisBinding, args);
					}
					return wrapper;
				}
				/**
				* Creates a function like `_.invertBy`.
				*
				* @private
				* @param {Function} setter The function to set accumulator values.
				* @param {Function} toIteratee The function to resolve iteratees.
				* @returns {Function} Returns the new inverter function.
				*/
				function createInverter(setter, toIteratee) {
					return function(object, iteratee) {
						return baseInverter(object, setter, toIteratee(iteratee), {});
					};
				}
				/**
				* Creates a function that performs a mathematical operation on two values.
				*
				* @private
				* @param {Function} operator The function to perform the operation.
				* @param {number} [defaultValue] The value used for `undefined` arguments.
				* @returns {Function} Returns the new mathematical operation function.
				*/
				function createMathOperation(operator, defaultValue) {
					return function(value, other) {
						var result;
						if (value === undefined && other === undefined) return defaultValue;
						if (value !== undefined) result = value;
						if (other !== undefined) {
							if (result === undefined) return other;
							if (typeof value == "string" || typeof other == "string") {
								value = baseToString(value);
								other = baseToString(other);
							} else {
								value = baseToNumber(value);
								other = baseToNumber(other);
							}
							result = operator(value, other);
						}
						return result;
					};
				}
				/**
				* Creates a function like `_.over`.
				*
				* @private
				* @param {Function} arrayFunc The function to iterate over iteratees.
				* @returns {Function} Returns the new over function.
				*/
				function createOver(arrayFunc) {
					return flatRest(function(iteratees) {
						iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
						return baseRest(function(args) {
							var thisArg = this;
							return arrayFunc(iteratees, function(iteratee) {
								return apply(iteratee, thisArg, args);
							});
						});
					});
				}
				/**
				* Creates the padding for `string` based on `length`. The `chars` string
				* is truncated if the number of characters exceeds `length`.
				*
				* @private
				* @param {number} length The padding length.
				* @param {string} [chars=' '] The string used as padding.
				* @returns {string} Returns the padding for `string`.
				*/
				function createPadding(length, chars) {
					chars = chars === undefined ? " " : baseToString(chars);
					var charsLength = chars.length;
					if (charsLength < 2) return charsLength ? baseRepeat(chars, length) : chars;
					var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
					return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join("") : result.slice(0, length);
				}
				/**
				* Creates a function that wraps `func` to invoke it with the `this` binding
				* of `thisArg` and `partials` prepended to the arguments it receives.
				*
				* @private
				* @param {Function} func The function to wrap.
				* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
				* @param {*} thisArg The `this` binding of `func`.
				* @param {Array} partials The arguments to prepend to those provided to
				*  the new function.
				* @returns {Function} Returns the new wrapped function.
				*/
				function createPartial(func, bitmask, thisArg, partials) {
					var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
					function wrapper() {
						var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
						while (++leftIndex < leftLength) args[leftIndex] = partials[leftIndex];
						while (argsLength--) args[leftIndex++] = arguments[++argsIndex];
						return apply(fn, isBind ? thisArg : this, args);
					}
					return wrapper;
				}
				/**
				* Creates a `_.range` or `_.rangeRight` function.
				*
				* @private
				* @param {boolean} [fromRight] Specify iterating from right to left.
				* @returns {Function} Returns the new range function.
				*/
				function createRange(fromRight) {
					return function(start, end, step) {
						if (step && typeof step != "number" && isIterateeCall(start, end, step)) end = step = undefined;
						start = toFinite(start);
						if (end === undefined) {
							end = start;
							start = 0;
						} else end = toFinite(end);
						step = step === undefined ? start < end ? 1 : -1 : toFinite(step);
						return baseRange(start, end, step, fromRight);
					};
				}
				/**
				* Creates a function that performs a relational operation on two values.
				*
				* @private
				* @param {Function} operator The function to perform the operation.
				* @returns {Function} Returns the new relational operation function.
				*/
				function createRelationalOperation(operator) {
					return function(value, other) {
						if (!(typeof value == "string" && typeof other == "string")) {
							value = toNumber(value);
							other = toNumber(other);
						}
						return operator(value, other);
					};
				}
				/**
				* Creates a function that wraps `func` to continue currying.
				*
				* @private
				* @param {Function} func The function to wrap.
				* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
				* @param {Function} wrapFunc The function to create the `func` wrapper.
				* @param {*} placeholder The placeholder value.
				* @param {*} [thisArg] The `this` binding of `func`.
				* @param {Array} [partials] The arguments to prepend to those provided to
				*  the new function.
				* @param {Array} [holders] The `partials` placeholder indexes.
				* @param {Array} [argPos] The argument positions of the new function.
				* @param {number} [ary] The arity cap of `func`.
				* @param {number} [arity] The arity of `func`.
				* @returns {Function} Returns the new wrapped function.
				*/
				function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
					var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined, newHoldersRight = isCurry ? undefined : holders, newPartials = isCurry ? partials : undefined, newPartialsRight = isCurry ? undefined : partials;
					bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
					bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
					if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
					var newData = [
						func,
						bitmask,
						thisArg,
						newPartials,
						newHolders,
						newPartialsRight,
						newHoldersRight,
						argPos,
						ary,
						arity
					];
					var result = wrapFunc.apply(undefined, newData);
					if (isLaziable(func)) setData(result, newData);
					result.placeholder = placeholder;
					return setWrapToString(result, func, bitmask);
				}
				/**
				* Creates a function like `_.round`.
				*
				* @private
				* @param {string} methodName The name of the `Math` method to use when rounding.
				* @returns {Function} Returns the new round function.
				*/
				function createRound(methodName) {
					var func = Math[methodName];
					return function(number, precision) {
						number = toNumber(number);
						precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
						if (precision && nativeIsFinite(number)) {
							var pair = (toString(number) + "e").split("e");
							pair = (toString(func(pair[0] + "e" + (+pair[1] + precision))) + "e").split("e");
							return +(pair[0] + "e" + (+pair[1] - precision));
						}
						return func(number);
					};
				}
				/**
				* Creates a set object of `values`.
				*
				* @private
				* @param {Array} values The values to add to the set.
				* @returns {Object} Returns the new set.
				*/
				var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY) ? noop : function(values) {
					return new Set(values);
				};
				/**
				* Creates a `_.toPairs` or `_.toPairsIn` function.
				*
				* @private
				* @param {Function} keysFunc The function to get the keys of a given object.
				* @returns {Function} Returns the new pairs function.
				*/
				function createToPairs(keysFunc) {
					return function(object) {
						var tag = getTag(object);
						if (tag == mapTag) return mapToArray(object);
						if (tag == setTag) return setToPairs(object);
						return baseToPairs(object, keysFunc(object));
					};
				}
				/**
				* Creates a function that either curries or invokes `func` with optional
				* `this` binding and partially applied arguments.
				*
				* @private
				* @param {Function|string} func The function or method name to wrap.
				* @param {number} bitmask The bitmask flags.
				*    1 - `_.bind`
				*    2 - `_.bindKey`
				*    4 - `_.curry` or `_.curryRight` of a bound function
				*    8 - `_.curry`
				*   16 - `_.curryRight`
				*   32 - `_.partial`
				*   64 - `_.partialRight`
				*  128 - `_.rearg`
				*  256 - `_.ary`
				*  512 - `_.flip`
				* @param {*} [thisArg] The `this` binding of `func`.
				* @param {Array} [partials] The arguments to be partially applied.
				* @param {Array} [holders] The `partials` placeholder indexes.
				* @param {Array} [argPos] The argument positions of the new function.
				* @param {number} [ary] The arity cap of `func`.
				* @param {number} [arity] The arity of `func`.
				* @returns {Function} Returns the new wrapped function.
				*/
				function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
					var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
					if (!isBindKey && typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
					var length = partials ? partials.length : 0;
					if (!length) {
						bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
						partials = holders = undefined;
					}
					ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
					arity = arity === undefined ? arity : toInteger(arity);
					length -= holders ? holders.length : 0;
					if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
						var partialsRight = partials, holdersRight = holders;
						partials = holders = undefined;
					}
					var data = isBindKey ? undefined : getData(func);
					var newData = [
						func,
						bitmask,
						thisArg,
						partials,
						holders,
						partialsRight,
						holdersRight,
						argPos,
						ary,
						arity
					];
					if (data) mergeData(newData, data);
					func = newData[0];
					bitmask = newData[1];
					thisArg = newData[2];
					partials = newData[3];
					holders = newData[4];
					arity = newData[9] = newData[9] === undefined ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
					if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
					if (!bitmask || bitmask == WRAP_BIND_FLAG) var result = createBind(func, bitmask, thisArg);
					else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) result = createCurry(func, bitmask, arity);
					else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) result = createPartial(func, bitmask, thisArg, partials);
					else result = createHybrid.apply(undefined, newData);
					return setWrapToString((data ? baseSetData : setData)(result, newData), func, bitmask);
				}
				/**
				* Used by `_.defaults` to customize its `_.assignIn` use to assign properties
				* of source objects to the destination object for all destination properties
				* that resolve to `undefined`.
				*
				* @private
				* @param {*} objValue The destination value.
				* @param {*} srcValue The source value.
				* @param {string} key The key of the property to assign.
				* @param {Object} object The parent object of `objValue`.
				* @returns {*} Returns the value to assign.
				*/
				function customDefaultsAssignIn(objValue, srcValue, key, object) {
					if (objValue === undefined || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) return srcValue;
					return objValue;
				}
				/**
				* Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
				* objects into destination objects that are passed thru.
				*
				* @private
				* @param {*} objValue The destination value.
				* @param {*} srcValue The source value.
				* @param {string} key The key of the property to merge.
				* @param {Object} object The parent object of `objValue`.
				* @param {Object} source The parent object of `srcValue`.
				* @param {Object} [stack] Tracks traversed source values and their merged
				*  counterparts.
				* @returns {*} Returns the value to assign.
				*/
				function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
					if (isObject(objValue) && isObject(srcValue)) {
						stack.set(srcValue, objValue);
						baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
						stack["delete"](srcValue);
					}
					return objValue;
				}
				/**
				* Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
				* objects.
				*
				* @private
				* @param {*} value The value to inspect.
				* @param {string} key The key of the property to inspect.
				* @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
				*/
				function customOmitClone(value) {
					return isPlainObject(value) ? undefined : value;
				}
				/**
				* A specialized version of `baseIsEqualDeep` for arrays with support for
				* partial deep comparisons.
				*
				* @private
				* @param {Array} array The array to compare.
				* @param {Array} other The other array to compare.
				* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
				* @param {Function} customizer The function to customize comparisons.
				* @param {Function} equalFunc The function to determine equivalents of values.
				* @param {Object} stack Tracks traversed `array` and `other` objects.
				* @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
				*/
				function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
					var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
					if (arrLength != othLength && !(isPartial && othLength > arrLength)) return false;
					var arrStacked = stack.get(array);
					var othStacked = stack.get(other);
					if (arrStacked && othStacked) return arrStacked == other && othStacked == array;
					var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;
					stack.set(array, other);
					stack.set(other, array);
					while (++index < arrLength) {
						var arrValue = array[index], othValue = other[index];
						if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
						if (compared !== undefined) {
							if (compared) continue;
							result = false;
							break;
						}
						if (seen) {
							if (!arraySome(other, function(othValue, othIndex) {
								if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) return seen.push(othIndex);
							})) {
								result = false;
								break;
							}
						} else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
							result = false;
							break;
						}
					}
					stack["delete"](array);
					stack["delete"](other);
					return result;
				}
				/**
				* A specialized version of `baseIsEqualDeep` for comparing objects of
				* the same `toStringTag`.
				*
				* **Note:** This function only supports comparing values with tags of
				* `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
				*
				* @private
				* @param {Object} object The object to compare.
				* @param {Object} other The other object to compare.
				* @param {string} tag The `toStringTag` of the objects to compare.
				* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
				* @param {Function} customizer The function to customize comparisons.
				* @param {Function} equalFunc The function to determine equivalents of values.
				* @param {Object} stack Tracks traversed `object` and `other` objects.
				* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
				*/
				function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
					switch (tag) {
						case dataViewTag:
							if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return false;
							object = object.buffer;
							other = other.buffer;
						case arrayBufferTag:
							if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) return false;
							return true;
						case boolTag:
						case dateTag:
						case numberTag: return eq(+object, +other);
						case errorTag: return object.name == other.name && object.message == other.message;
						case regexpTag:
						case stringTag: return object == other + "";
						case mapTag: var convert = mapToArray;
						case setTag:
							var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
							convert || (convert = setToArray);
							if (object.size != other.size && !isPartial) return false;
							var stacked = stack.get(object);
							if (stacked) return stacked == other;
							bitmask |= COMPARE_UNORDERED_FLAG;
							stack.set(object, other);
							var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
							stack["delete"](object);
							return result;
						case symbolTag: if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
					}
					return false;
				}
				/**
				* A specialized version of `baseIsEqualDeep` for objects with support for
				* partial deep comparisons.
				*
				* @private
				* @param {Object} object The object to compare.
				* @param {Object} other The other object to compare.
				* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
				* @param {Function} customizer The function to customize comparisons.
				* @param {Function} equalFunc The function to determine equivalents of values.
				* @param {Object} stack Tracks traversed `object` and `other` objects.
				* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
				*/
				function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
					var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length;
					if (objLength != getAllKeys(other).length && !isPartial) return false;
					var index = objLength;
					while (index--) {
						var key = objProps[index];
						if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) return false;
					}
					var objStacked = stack.get(object);
					var othStacked = stack.get(other);
					if (objStacked && othStacked) return objStacked == other && othStacked == object;
					var result = true;
					stack.set(object, other);
					stack.set(other, object);
					var skipCtor = isPartial;
					while (++index < objLength) {
						key = objProps[index];
						var objValue = object[key], othValue = other[key];
						if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
						if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
							result = false;
							break;
						}
						skipCtor || (skipCtor = key == "constructor");
					}
					if (result && !skipCtor) {
						var objCtor = object.constructor, othCtor = other.constructor;
						if (objCtor != othCtor && "constructor" in object && "constructor" in other && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) result = false;
					}
					stack["delete"](object);
					stack["delete"](other);
					return result;
				}
				/**
				* A specialized version of `baseRest` which flattens the rest array.
				*
				* @private
				* @param {Function} func The function to apply a rest parameter to.
				* @returns {Function} Returns the new function.
				*/
				function flatRest(func) {
					return setToString(overRest(func, undefined, flatten), func + "");
				}
				/**
				* Creates an array of own enumerable property names and symbols of `object`.
				*
				* @private
				* @param {Object} object The object to query.
				* @returns {Array} Returns the array of property names and symbols.
				*/
				function getAllKeys(object) {
					return baseGetAllKeys(object, keys, getSymbols);
				}
				/**
				* Creates an array of own and inherited enumerable property names and
				* symbols of `object`.
				*
				* @private
				* @param {Object} object The object to query.
				* @returns {Array} Returns the array of property names and symbols.
				*/
				function getAllKeysIn(object) {
					return baseGetAllKeys(object, keysIn, getSymbolsIn);
				}
				/**
				* Gets metadata for `func`.
				*
				* @private
				* @param {Function} func The function to query.
				* @returns {*} Returns the metadata for `func`.
				*/
				var getData = !metaMap ? noop : function(func) {
					return metaMap.get(func);
				};
				/**
				* Gets the name of `func`.
				*
				* @private
				* @param {Function} func The function to query.
				* @returns {string} Returns the function name.
				*/
				function getFuncName(func) {
					var result = func.name + "", array = realNames[result], length = hasOwnProperty.call(realNames, result) ? array.length : 0;
					while (length--) {
						var data = array[length], otherFunc = data.func;
						if (otherFunc == null || otherFunc == func) return data.name;
					}
					return result;
				}
				/**
				* Gets the argument placeholder value for `func`.
				*
				* @private
				* @param {Function} func The function to inspect.
				* @returns {*} Returns the placeholder value.
				*/
				function getHolder(func) {
					return (hasOwnProperty.call(lodash, "placeholder") ? lodash : func).placeholder;
				}
				/**
				* Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
				* this function returns the custom method, otherwise it returns `baseIteratee`.
				* If arguments are provided, the chosen function is invoked with them and
				* its result is returned.
				*
				* @private
				* @param {*} [value] The value to convert to an iteratee.
				* @param {number} [arity] The arity of the created iteratee.
				* @returns {Function} Returns the chosen function or its result.
				*/
				function getIteratee() {
					var result = lodash.iteratee || iteratee;
					result = result === iteratee ? baseIteratee : result;
					return arguments.length ? result(arguments[0], arguments[1]) : result;
				}
				/**
				* Gets the data for `map`.
				*
				* @private
				* @param {Object} map The map to query.
				* @param {string} key The reference key.
				* @returns {*} Returns the map data.
				*/
				function getMapData(map, key) {
					var data = map.__data__;
					return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
				}
				/**
				* Gets the property names, values, and compare flags of `object`.
				*
				* @private
				* @param {Object} object The object to query.
				* @returns {Array} Returns the match data of `object`.
				*/
				function getMatchData(object) {
					var result = keys(object), length = result.length;
					while (length--) {
						var key = result[length], value = object[key];
						result[length] = [
							key,
							value,
							isStrictComparable(value)
						];
					}
					return result;
				}
				/**
				* Gets the native function at `key` of `object`.
				*
				* @private
				* @param {Object} object The object to query.
				* @param {string} key The key of the method to get.
				* @returns {*} Returns the function if it's native, else `undefined`.
				*/
				function getNative(object, key) {
					var value = getValue(object, key);
					return baseIsNative(value) ? value : undefined;
				}
				/**
				* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
				*
				* @private
				* @param {*} value The value to query.
				* @returns {string} Returns the raw `toStringTag`.
				*/
				function getRawTag(value) {
					var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
					try {
						value[symToStringTag] = undefined;
						var unmasked = true;
					} catch (e) {}
					var result = nativeObjectToString.call(value);
					if (unmasked) {
						if (isOwn) value[symToStringTag] = tag;
						else delete value[symToStringTag];
					}
					return result;
				}
				/**
				* Creates an array of the own enumerable symbols of `object`.
				*
				* @private
				* @param {Object} object The object to query.
				* @returns {Array} Returns the array of symbols.
				*/
				var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
					if (object == null) return [];
					object = Object(object);
					return arrayFilter(nativeGetSymbols(object), function(symbol) {
						return propertyIsEnumerable.call(object, symbol);
					});
				};
				/**
				* Creates an array of the own and inherited enumerable symbols of `object`.
				*
				* @private
				* @param {Object} object The object to query.
				* @returns {Array} Returns the array of symbols.
				*/
				var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
					var result = [];
					while (object) {
						arrayPush(result, getSymbols(object));
						object = getPrototype(object);
					}
					return result;
				};
				/**
				* Gets the `toStringTag` of `value`.
				*
				* @private
				* @param {*} value The value to query.
				* @returns {string} Returns the `toStringTag`.
				*/
				var getTag = baseGetTag;
				if (DataView && getTag(new DataView(/* @__PURE__ */ new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) getTag = function(value) {
					var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : undefined, ctorString = Ctor ? toSource(Ctor) : "";
					if (ctorString) switch (ctorString) {
						case dataViewCtorString: return dataViewTag;
						case mapCtorString: return mapTag;
						case promiseCtorString: return promiseTag;
						case setCtorString: return setTag;
						case weakMapCtorString: return weakMapTag;
					}
					return result;
				};
				/**
				* Gets the view, applying any `transforms` to the `start` and `end` positions.
				*
				* @private
				* @param {number} start The start of the view.
				* @param {number} end The end of the view.
				* @param {Array} transforms The transformations to apply to the view.
				* @returns {Object} Returns an object containing the `start` and `end`
				*  positions of the view.
				*/
				function getView(start, end, transforms) {
					var index = -1, length = transforms.length;
					while (++index < length) {
						var data = transforms[index], size = data.size;
						switch (data.type) {
							case "drop":
								start += size;
								break;
							case "dropRight":
								end -= size;
								break;
							case "take":
								end = nativeMin(end, start + size);
								break;
							case "takeRight": start = nativeMax(start, end - size);
						}
					}
					return {
						"start": start,
						"end": end
					};
				}
				/**
				* Extracts wrapper details from the `source` body comment.
				*
				* @private
				* @param {string} source The source to inspect.
				* @returns {Array} Returns the wrapper details.
				*/
				function getWrapDetails(source) {
					var match = source.match(reWrapDetails);
					return match ? match[1].split(reSplitDetails) : [];
				}
				/**
				* Checks if `path` exists on `object`.
				*
				* @private
				* @param {Object} object The object to query.
				* @param {Array|string} path The path to check.
				* @param {Function} hasFunc The function to check properties.
				* @returns {boolean} Returns `true` if `path` exists, else `false`.
				*/
				function hasPath(object, path, hasFunc) {
					path = castPath(path, object);
					var index = -1, length = path.length, result = false;
					while (++index < length) {
						var key = toKey(path[index]);
						if (!(result = object != null && hasFunc(object, key))) break;
						object = object[key];
					}
					if (result || ++index != length) return result;
					length = object == null ? 0 : object.length;
					return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
				}
				/**
				* Initializes an array clone.
				*
				* @private
				* @param {Array} array The array to clone.
				* @returns {Array} Returns the initialized clone.
				*/
				function initCloneArray(array) {
					var length = array.length, result = new array.constructor(length);
					if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
						result.index = array.index;
						result.input = array.input;
					}
					return result;
				}
				/**
				* Initializes an object clone.
				*
				* @private
				* @param {Object} object The object to clone.
				* @returns {Object} Returns the initialized clone.
				*/
				function initCloneObject(object) {
					return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
				}
				/**
				* Initializes an object clone based on its `toStringTag`.
				*
				* **Note:** This function only supports cloning values with tags of
				* `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
				*
				* @private
				* @param {Object} object The object to clone.
				* @param {string} tag The `toStringTag` of the object to clone.
				* @param {boolean} [isDeep] Specify a deep clone.
				* @returns {Object} Returns the initialized clone.
				*/
				function initCloneByTag(object, tag, isDeep) {
					var Ctor = object.constructor;
					switch (tag) {
						case arrayBufferTag: return cloneArrayBuffer(object);
						case boolTag:
						case dateTag: return new Ctor(+object);
						case dataViewTag: return cloneDataView(object, isDeep);
						case float32Tag:
						case float64Tag:
						case int8Tag:
						case int16Tag:
						case int32Tag:
						case uint8Tag:
						case uint8ClampedTag:
						case uint16Tag:
						case uint32Tag: return cloneTypedArray(object, isDeep);
						case mapTag: return new Ctor();
						case numberTag:
						case stringTag: return new Ctor(object);
						case regexpTag: return cloneRegExp(object);
						case setTag: return new Ctor();
						case symbolTag: return cloneSymbol(object);
					}
				}
				/**
				* Inserts wrapper `details` in a comment at the top of the `source` body.
				*
				* @private
				* @param {string} source The source to modify.
				* @returns {Array} details The details to insert.
				* @returns {string} Returns the modified source.
				*/
				function insertWrapDetails(source, details) {
					var length = details.length;
					if (!length) return source;
					var lastIndex = length - 1;
					details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
					details = details.join(length > 2 ? ", " : " ");
					return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
				}
				/**
				* Checks if `value` is a flattenable `arguments` object or array.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
				*/
				function isFlattenable(value) {
					return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
				}
				/**
				* Checks if `value` is a valid array-like index.
				*
				* @private
				* @param {*} value The value to check.
				* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
				* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
				*/
				function isIndex(value, length) {
					var type = typeof value;
					length = length == null ? MAX_SAFE_INTEGER : length;
					return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
				}
				/**
				* Checks if the given arguments are from an iteratee call.
				*
				* @private
				* @param {*} value The potential iteratee value argument.
				* @param {*} index The potential iteratee index or key argument.
				* @param {*} object The potential iteratee object argument.
				* @returns {boolean} Returns `true` if the arguments are from an iteratee call,
				*  else `false`.
				*/
				function isIterateeCall(value, index, object) {
					if (!isObject(object)) return false;
					var type = typeof index;
					if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) return eq(object[index], value);
					return false;
				}
				/**
				* Checks if `value` is a property name and not a property path.
				*
				* @private
				* @param {*} value The value to check.
				* @param {Object} [object] The object to query keys on.
				* @returns {boolean} Returns `true` if `value` is a property name, else `false`.
				*/
				function isKey(value, object) {
					if (isArray(value)) return false;
					var type = typeof value;
					if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) return true;
					return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
				}
				/**
				* Checks if `value` is suitable for use as unique object key.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
				*/
				function isKeyable(value) {
					var type = typeof value;
					return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
				}
				/**
				* Checks if `func` has a lazy counterpart.
				*
				* @private
				* @param {Function} func The function to check.
				* @returns {boolean} Returns `true` if `func` has a lazy counterpart,
				*  else `false`.
				*/
				function isLaziable(func) {
					var funcName = getFuncName(func), other = lodash[funcName];
					if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) return false;
					if (func === other) return true;
					var data = getData(other);
					return !!data && func === data[0];
				}
				/**
				* Checks if `func` has its source masked.
				*
				* @private
				* @param {Function} func The function to check.
				* @returns {boolean} Returns `true` if `func` is masked, else `false`.
				*/
				function isMasked(func) {
					return !!maskSrcKey && maskSrcKey in func;
				}
				/**
				* Checks if `func` is capable of being masked.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `func` is maskable, else `false`.
				*/
				var isMaskable = coreJsData ? isFunction : stubFalse;
				/**
				* Checks if `value` is likely a prototype object.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
				*/
				function isPrototype(value) {
					var Ctor = value && value.constructor;
					return value === (typeof Ctor == "function" && Ctor.prototype || objectProto);
				}
				/**
				* Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
				*
				* @private
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` if suitable for strict
				*  equality comparisons, else `false`.
				*/
				function isStrictComparable(value) {
					return value === value && !isObject(value);
				}
				/**
				* A specialized version of `matchesProperty` for source values suitable
				* for strict equality comparisons, i.e. `===`.
				*
				* @private
				* @param {string} key The key of the property to get.
				* @param {*} srcValue The value to match.
				* @returns {Function} Returns the new spec function.
				*/
				function matchesStrictComparable(key, srcValue) {
					return function(object) {
						if (object == null) return false;
						return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
					};
				}
				/**
				* A specialized version of `_.memoize` which clears the memoized function's
				* cache when it exceeds `MAX_MEMOIZE_SIZE`.
				*
				* @private
				* @param {Function} func The function to have its output memoized.
				* @returns {Function} Returns the new memoized function.
				*/
				function memoizeCapped(func) {
					var result = memoize(func, function(key) {
						if (cache.size === MAX_MEMOIZE_SIZE) cache.clear();
						return key;
					});
					var cache = result.cache;
					return result;
				}
				/**
				* Merges the function metadata of `source` into `data`.
				*
				* Merging metadata reduces the number of wrappers used to invoke a function.
				* This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
				* may be applied regardless of execution order. Methods like `_.ary` and
				* `_.rearg` modify function arguments, making the order in which they are
				* executed important, preventing the merging of metadata. However, we make
				* an exception for a safe combined case where curried functions have `_.ary`
				* and or `_.rearg` applied.
				*
				* @private
				* @param {Array} data The destination metadata.
				* @param {Array} source The source metadata.
				* @returns {Array} Returns `data`.
				*/
				function mergeData(data, source) {
					var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
					var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
					if (!(isCommon || isCombo)) return data;
					if (srcBitmask & WRAP_BIND_FLAG) {
						data[2] = source[2];
						newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
					}
					var value = source[3];
					if (value) {
						var partials = data[3];
						data[3] = partials ? composeArgs(partials, value, source[4]) : value;
						data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
					}
					value = source[5];
					if (value) {
						partials = data[5];
						data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
						data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
					}
					value = source[7];
					if (value) data[7] = value;
					if (srcBitmask & WRAP_ARY_FLAG) data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
					if (data[9] == null) data[9] = source[9];
					data[0] = source[0];
					data[1] = newBitmask;
					return data;
				}
				/**
				* This function is like
				* [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
				* except that it includes inherited enumerable properties.
				*
				* @private
				* @param {Object} object The object to query.
				* @returns {Array} Returns the array of property names.
				*/
				function nativeKeysIn(object) {
					var result = [];
					if (object != null) for (var key in Object(object)) result.push(key);
					return result;
				}
				/**
				* Converts `value` to a string using `Object.prototype.toString`.
				*
				* @private
				* @param {*} value The value to convert.
				* @returns {string} Returns the converted string.
				*/
				function objectToString(value) {
					return nativeObjectToString.call(value);
				}
				/**
				* A specialized version of `baseRest` which transforms the rest array.
				*
				* @private
				* @param {Function} func The function to apply a rest parameter to.
				* @param {number} [start=func.length-1] The start position of the rest parameter.
				* @param {Function} transform The rest array transform.
				* @returns {Function} Returns the new function.
				*/
				function overRest(func, start, transform) {
					start = nativeMax(start === undefined ? func.length - 1 : start, 0);
					return function() {
						var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
						while (++index < length) array[index] = args[start + index];
						index = -1;
						var otherArgs = Array(start + 1);
						while (++index < start) otherArgs[index] = args[index];
						otherArgs[start] = transform(array);
						return apply(func, this, otherArgs);
					};
				}
				/**
				* Gets the parent value at `path` of `object`.
				*
				* @private
				* @param {Object} object The object to query.
				* @param {Array} path The path to get the parent value of.
				* @returns {*} Returns the parent value.
				*/
				function parent(object, path) {
					return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
				}
				/**
				* Reorder `array` according to the specified indexes where the element at
				* the first index is assigned as the first element, the element at
				* the second index is assigned as the second element, and so on.
				*
				* @private
				* @param {Array} array The array to reorder.
				* @param {Array} indexes The arranged array indexes.
				* @returns {Array} Returns `array`.
				*/
				function reorder(array, indexes) {
					var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
					while (length--) {
						var index = indexes[length];
						array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
					}
					return array;
				}
				/**
				* Gets the value at `key`, unless `key` is "__proto__" or "constructor".
				*
				* @private
				* @param {Object} object The object to query.
				* @param {string} key The key of the property to get.
				* @returns {*} Returns the property value.
				*/
				function safeGet(object, key) {
					if (key === "constructor" && typeof object[key] === "function") return;
					if (key == "__proto__") return;
					return object[key];
				}
				/**
				* Sets metadata for `func`.
				*
				* **Note:** If this function becomes hot, i.e. is invoked a lot in a short
				* period of time, it will trip its breaker and transition to an identity
				* function to avoid garbage collection pauses in V8. See
				* [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
				* for more details.
				*
				* @private
				* @param {Function} func The function to associate metadata with.
				* @param {*} data The metadata.
				* @returns {Function} Returns `func`.
				*/
				var setData = shortOut(baseSetData);
				/**
				* A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
				*
				* @private
				* @param {Function} func The function to delay.
				* @param {number} wait The number of milliseconds to delay invocation.
				* @returns {number|Object} Returns the timer id or timeout object.
				*/
				var setTimeout = ctxSetTimeout || function(func, wait) {
					return root.setTimeout(func, wait);
				};
				/**
				* Sets the `toString` method of `func` to return `string`.
				*
				* @private
				* @param {Function} func The function to modify.
				* @param {Function} string The `toString` result.
				* @returns {Function} Returns `func`.
				*/
				var setToString = shortOut(baseSetToString);
				/**
				* Sets the `toString` method of `wrapper` to mimic the source of `reference`
				* with wrapper details in a comment at the top of the source body.
				*
				* @private
				* @param {Function} wrapper The function to modify.
				* @param {Function} reference The reference function.
				* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
				* @returns {Function} Returns `wrapper`.
				*/
				function setWrapToString(wrapper, reference, bitmask) {
					var source = reference + "";
					return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
				}
				/**
				* Creates a function that'll short out and invoke `identity` instead
				* of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
				* milliseconds.
				*
				* @private
				* @param {Function} func The function to restrict.
				* @returns {Function} Returns the new shortable function.
				*/
				function shortOut(func) {
					var count = 0, lastCalled = 0;
					return function() {
						var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
						lastCalled = stamp;
						if (remaining > 0) {
							if (++count >= HOT_COUNT) return arguments[0];
						} else count = 0;
						return func.apply(undefined, arguments);
					};
				}
				/**
				* A specialized version of `_.shuffle` which mutates and sets the size of `array`.
				*
				* @private
				* @param {Array} array The array to shuffle.
				* @param {number} [size=array.length] The size of `array`.
				* @returns {Array} Returns `array`.
				*/
				function shuffleSelf(array, size) {
					var index = -1, length = array.length, lastIndex = length - 1;
					size = size === undefined ? length : size;
					while (++index < size) {
						var rand = baseRandom(index, lastIndex), value = array[rand];
						array[rand] = array[index];
						array[index] = value;
					}
					array.length = size;
					return array;
				}
				/**
				* Converts `string` to a property path array.
				*
				* @private
				* @param {string} string The string to convert.
				* @returns {Array} Returns the property path array.
				*/
				var stringToPath = memoizeCapped(function(string) {
					var result = [];
					if (string.charCodeAt(0) === 46) result.push("");
					string.replace(rePropName, function(match, number, quote, subString) {
						result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
					});
					return result;
				});
				/**
				* Converts `value` to a string key if it's not a string or symbol.
				*
				* @private
				* @param {*} value The value to inspect.
				* @returns {string|symbol} Returns the key.
				*/
				function toKey(value) {
					if (typeof value == "string" || isSymbol(value)) return value;
					var result = value + "";
					return result == "0" && 1 / value == -Infinity ? "-0" : result;
				}
				/**
				* Converts `func` to its source code.
				*
				* @private
				* @param {Function} func The function to convert.
				* @returns {string} Returns the source code.
				*/
				function toSource(func) {
					if (func != null) {
						try {
							return funcToString.call(func);
						} catch (e) {}
						try {
							return func + "";
						} catch (e) {}
					}
					return "";
				}
				/**
				* Updates wrapper `details` based on `bitmask` flags.
				*
				* @private
				* @returns {Array} details The details to modify.
				* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
				* @returns {Array} Returns `details`.
				*/
				function updateWrapDetails(details, bitmask) {
					arrayEach(wrapFlags, function(pair) {
						var value = "_." + pair[0];
						if (bitmask & pair[1] && !arrayIncludes(details, value)) details.push(value);
					});
					return details.sort();
				}
				/**
				* Creates a clone of `wrapper`.
				*
				* @private
				* @param {Object} wrapper The wrapper to clone.
				* @returns {Object} Returns the cloned wrapper.
				*/
				function wrapperClone(wrapper) {
					if (wrapper instanceof LazyWrapper) return wrapper.clone();
					var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
					result.__actions__ = copyArray(wrapper.__actions__);
					result.__index__ = wrapper.__index__;
					result.__values__ = wrapper.__values__;
					return result;
				}
				/**
				* Creates an array of elements split into groups the length of `size`.
				* If `array` can't be split evenly, the final chunk will be the remaining
				* elements.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Array
				* @param {Array} array The array to process.
				* @param {number} [size=1] The length of each chunk
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {Array} Returns the new array of chunks.
				* @example
				*
				* _.chunk(['a', 'b', 'c', 'd'], 2);
				* // => [['a', 'b'], ['c', 'd']]
				*
				* _.chunk(['a', 'b', 'c', 'd'], 3);
				* // => [['a', 'b', 'c'], ['d']]
				*/
				function chunk(array, size, guard) {
					if (guard ? isIterateeCall(array, size, guard) : size === undefined) size = 1;
					else size = nativeMax(toInteger(size), 0);
					var length = array == null ? 0 : array.length;
					if (!length || size < 1) return [];
					var index = 0, resIndex = 0, result = Array(nativeCeil(length / size));
					while (index < length) result[resIndex++] = baseSlice(array, index, index += size);
					return result;
				}
				/**
				* Creates an array with all falsey values removed. The values `false`, `null`,
				* `0`, `-0`, `0n`, `""`, `undefined`, and `NaN` are falsy.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {Array} array The array to compact.
				* @returns {Array} Returns the new array of filtered values.
				* @example
				*
				* _.compact([0, 1, false, 2, '', 3]);
				* // => [1, 2, 3]
				*/
				function compact(array) {
					var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
					while (++index < length) {
						var value = array[index];
						if (value) result[resIndex++] = value;
					}
					return result;
				}
				/**
				* Creates a new array concatenating `array` with any additional arrays
				* and/or values.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to concatenate.
				* @param {...*} [values] The values to concatenate.
				* @returns {Array} Returns the new concatenated array.
				* @example
				*
				* var array = [1];
				* var other = _.concat(array, 2, [3], [[4]]);
				*
				* console.log(other);
				* // => [1, 2, 3, [4]]
				*
				* console.log(array);
				* // => [1]
				*/
				function concat() {
					var length = arguments.length;
					if (!length) return [];
					var args = Array(length - 1), array = arguments[0], index = length;
					while (index--) args[index - 1] = arguments[index];
					return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
				}
				/**
				* Creates an array of `array` values not included in the other given arrays
				* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
				* for equality comparisons. The order and references of result values are
				* determined by the first array.
				*
				* **Note:** Unlike `_.pullAll`, this method returns a new array.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {...Array} [values] The values to exclude.
				* @returns {Array} Returns the new array of filtered values.
				* @see _.without, _.xor
				* @example
				*
				* _.difference([2, 1], [2, 3]);
				* // => [1]
				*/
				var difference = baseRest(function(array, values) {
					return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
				});
				/**
				* This method is like `_.difference` except that it accepts `iteratee` which
				* is invoked for each element of `array` and `values` to generate the criterion
				* by which they're compared. The order and references of result values are
				* determined by the first array. The iteratee is invoked with one argument:
				* (value).
				*
				* **Note:** Unlike `_.pullAllBy`, this method returns a new array.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {...Array} [values] The values to exclude.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {Array} Returns the new array of filtered values.
				* @example
				*
				* _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
				* // => [1.2]
				*
				* // The `_.property` iteratee shorthand.
				* _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
				* // => [{ 'x': 2 }]
				*/
				var differenceBy = baseRest(function(array, values) {
					var iteratee = last(values);
					if (isArrayLikeObject(iteratee)) iteratee = undefined;
					return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2)) : [];
				});
				/**
				* This method is like `_.difference` except that it accepts `comparator`
				* which is invoked to compare elements of `array` to `values`. The order and
				* references of result values are determined by the first array. The comparator
				* is invoked with two arguments: (arrVal, othVal).
				*
				* **Note:** Unlike `_.pullAllWith`, this method returns a new array.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {...Array} [values] The values to exclude.
				* @param {Function} [comparator] The comparator invoked per element.
				* @returns {Array} Returns the new array of filtered values.
				* @example
				*
				* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
				*
				* _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
				* // => [{ 'x': 2, 'y': 1 }]
				*/
				var differenceWith = baseRest(function(array, values) {
					var comparator = last(values);
					if (isArrayLikeObject(comparator)) comparator = undefined;
					return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator) : [];
				});
				/**
				* Creates a slice of `array` with `n` elements dropped from the beginning.
				*
				* @static
				* @memberOf _
				* @since 0.5.0
				* @category Array
				* @param {Array} array The array to query.
				* @param {number} [n=1] The number of elements to drop.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {Array} Returns the slice of `array`.
				* @example
				*
				* _.drop([1, 2, 3]);
				* // => [2, 3]
				*
				* _.drop([1, 2, 3], 2);
				* // => [3]
				*
				* _.drop([1, 2, 3], 5);
				* // => []
				*
				* _.drop([1, 2, 3], 0);
				* // => [1, 2, 3]
				*/
				function drop(array, n, guard) {
					var length = array == null ? 0 : array.length;
					if (!length) return [];
					n = guard || n === undefined ? 1 : toInteger(n);
					return baseSlice(array, n < 0 ? 0 : n, length);
				}
				/**
				* Creates a slice of `array` with `n` elements dropped from the end.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Array
				* @param {Array} array The array to query.
				* @param {number} [n=1] The number of elements to drop.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {Array} Returns the slice of `array`.
				* @example
				*
				* _.dropRight([1, 2, 3]);
				* // => [1, 2]
				*
				* _.dropRight([1, 2, 3], 2);
				* // => [1]
				*
				* _.dropRight([1, 2, 3], 5);
				* // => []
				*
				* _.dropRight([1, 2, 3], 0);
				* // => [1, 2, 3]
				*/
				function dropRight(array, n, guard) {
					var length = array == null ? 0 : array.length;
					if (!length) return [];
					n = guard || n === undefined ? 1 : toInteger(n);
					n = length - n;
					return baseSlice(array, 0, n < 0 ? 0 : n);
				}
				/**
				* Creates a slice of `array` excluding elements dropped from the end.
				* Elements are dropped until `predicate` returns falsey. The predicate is
				* invoked with three arguments: (value, index, array).
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Array
				* @param {Array} array The array to query.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the slice of `array`.
				* @example
				*
				* var users = [
				*   { 'user': 'barney',  'active': true },
				*   { 'user': 'fred',    'active': false },
				*   { 'user': 'pebbles', 'active': false }
				* ];
				*
				* _.dropRightWhile(users, function(o) { return !o.active; });
				* // => objects for ['barney']
				*
				* // The `_.matches` iteratee shorthand.
				* _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
				* // => objects for ['barney', 'fred']
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.dropRightWhile(users, ['active', false]);
				* // => objects for ['barney']
				*
				* // The `_.property` iteratee shorthand.
				* _.dropRightWhile(users, 'active');
				* // => objects for ['barney', 'fred', 'pebbles']
				*/
				function dropRightWhile(array, predicate) {
					return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
				}
				/**
				* Creates a slice of `array` excluding elements dropped from the beginning.
				* Elements are dropped until `predicate` returns falsey. The predicate is
				* invoked with three arguments: (value, index, array).
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Array
				* @param {Array} array The array to query.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the slice of `array`.
				* @example
				*
				* var users = [
				*   { 'user': 'barney',  'active': false },
				*   { 'user': 'fred',    'active': false },
				*   { 'user': 'pebbles', 'active': true }
				* ];
				*
				* _.dropWhile(users, function(o) { return !o.active; });
				* // => objects for ['pebbles']
				*
				* // The `_.matches` iteratee shorthand.
				* _.dropWhile(users, { 'user': 'barney', 'active': false });
				* // => objects for ['fred', 'pebbles']
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.dropWhile(users, ['active', false]);
				* // => objects for ['pebbles']
				*
				* // The `_.property` iteratee shorthand.
				* _.dropWhile(users, 'active');
				* // => objects for ['barney', 'fred', 'pebbles']
				*/
				function dropWhile(array, predicate) {
					return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
				}
				/**
				* Fills elements of `array` with `value` from `start` up to, but not
				* including, `end`.
				*
				* **Note:** This method mutates `array`.
				*
				* @static
				* @memberOf _
				* @since 3.2.0
				* @category Array
				* @param {Array} array The array to fill.
				* @param {*} value The value to fill `array` with.
				* @param {number} [start=0] The start position.
				* @param {number} [end=array.length] The end position.
				* @returns {Array} Returns `array`.
				* @example
				*
				* var array = [1, 2, 3];
				*
				* _.fill(array, 'a');
				* console.log(array);
				* // => ['a', 'a', 'a']
				*
				* _.fill(Array(3), 2);
				* // => [2, 2, 2]
				*
				* _.fill([4, 6, 8, 10], '*', 1, 3);
				* // => [4, '*', '*', 10]
				*/
				function fill(array, value, start, end) {
					var length = array == null ? 0 : array.length;
					if (!length) return [];
					if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
						start = 0;
						end = length;
					}
					return baseFill(array, value, start, end);
				}
				/**
				* This method is like `_.find` except that it returns the index of the first
				* element `predicate` returns truthy for instead of the element itself.
				*
				* @static
				* @memberOf _
				* @since 1.1.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @param {number} [fromIndex=0] The index to search from.
				* @returns {number} Returns the index of the found element, else `-1`.
				* @example
				*
				* var users = [
				*   { 'user': 'barney',  'active': false },
				*   { 'user': 'fred',    'active': false },
				*   { 'user': 'pebbles', 'active': true }
				* ];
				*
				* _.findIndex(users, function(o) { return o.user == 'barney'; });
				* // => 0
				*
				* // The `_.matches` iteratee shorthand.
				* _.findIndex(users, { 'user': 'fred', 'active': false });
				* // => 1
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.findIndex(users, ['active', false]);
				* // => 0
				*
				* // The `_.property` iteratee shorthand.
				* _.findIndex(users, 'active');
				* // => 2
				*/
				function findIndex(array, predicate, fromIndex) {
					var length = array == null ? 0 : array.length;
					if (!length) return -1;
					var index = fromIndex == null ? 0 : toInteger(fromIndex);
					if (index < 0) index = nativeMax(length + index, 0);
					return baseFindIndex(array, getIteratee(predicate, 3), index);
				}
				/**
				* This method is like `_.findIndex` except that it iterates over elements
				* of `collection` from right to left.
				*
				* @static
				* @memberOf _
				* @since 2.0.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @param {number} [fromIndex=array.length-1] The index to search from.
				* @returns {number} Returns the index of the found element, else `-1`.
				* @example
				*
				* var users = [
				*   { 'user': 'barney',  'active': true },
				*   { 'user': 'fred',    'active': false },
				*   { 'user': 'pebbles', 'active': false }
				* ];
				*
				* _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
				* // => 2
				*
				* // The `_.matches` iteratee shorthand.
				* _.findLastIndex(users, { 'user': 'barney', 'active': true });
				* // => 0
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.findLastIndex(users, ['active', false]);
				* // => 2
				*
				* // The `_.property` iteratee shorthand.
				* _.findLastIndex(users, 'active');
				* // => 0
				*/
				function findLastIndex(array, predicate, fromIndex) {
					var length = array == null ? 0 : array.length;
					if (!length) return -1;
					var index = length - 1;
					if (fromIndex !== undefined) {
						index = toInteger(fromIndex);
						index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
					}
					return baseFindIndex(array, getIteratee(predicate, 3), index, true);
				}
				/**
				* Flattens `array` a single level deep.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {Array} array The array to flatten.
				* @returns {Array} Returns the new flattened array.
				* @example
				*
				* _.flatten([1, [2, [3, [4]], 5]]);
				* // => [1, 2, [3, [4]], 5]
				*/
				function flatten(array) {
					return (array == null ? 0 : array.length) ? baseFlatten(array, 1) : [];
				}
				/**
				* Recursively flattens `array`.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Array
				* @param {Array} array The array to flatten.
				* @returns {Array} Returns the new flattened array.
				* @example
				*
				* _.flattenDeep([1, [2, [3, [4]], 5]]);
				* // => [1, 2, 3, 4, 5]
				*/
				function flattenDeep(array) {
					return (array == null ? 0 : array.length) ? baseFlatten(array, INFINITY) : [];
				}
				/**
				* Recursively flatten `array` up to `depth` times.
				*
				* @static
				* @memberOf _
				* @since 4.4.0
				* @category Array
				* @param {Array} array The array to flatten.
				* @param {number} [depth=1] The maximum recursion depth.
				* @returns {Array} Returns the new flattened array.
				* @example
				*
				* var array = [1, [2, [3, [4]], 5]];
				*
				* _.flattenDepth(array, 1);
				* // => [1, 2, [3, [4]], 5]
				*
				* _.flattenDepth(array, 2);
				* // => [1, 2, 3, [4], 5]
				*/
				function flattenDepth(array, depth) {
					if (!(array == null ? 0 : array.length)) return [];
					depth = depth === undefined ? 1 : toInteger(depth);
					return baseFlatten(array, depth);
				}
				/**
				* The inverse of `_.toPairs`; this method returns an object composed
				* from key-value `pairs`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} pairs The key-value pairs.
				* @returns {Object} Returns the new object.
				* @example
				*
				* _.fromPairs([['a', 1], ['b', 2]]);
				* // => { 'a': 1, 'b': 2 }
				*/
				function fromPairs(pairs) {
					var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
					while (++index < length) {
						var pair = pairs[index];
						baseAssignValue(result, pair[0], pair[1]);
					}
					return result;
				}
				/**
				* Gets the first element of `array`.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @alias first
				* @category Array
				* @param {Array} array The array to query.
				* @returns {*} Returns the first element of `array`.
				* @example
				*
				* _.head([1, 2, 3]);
				* // => 1
				*
				* _.head([]);
				* // => undefined
				*/
				function head(array) {
					return array && array.length ? array[0] : undefined;
				}
				/**
				* Gets the index at which the first occurrence of `value` is found in `array`
				* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
				* for equality comparisons. If `fromIndex` is negative, it's used as the
				* offset from the end of `array`.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {*} value The value to search for.
				* @param {number} [fromIndex=0] The index to search from.
				* @returns {number} Returns the index of the matched value, else `-1`.
				* @example
				*
				* _.indexOf([1, 2, 1, 2], 2);
				* // => 1
				*
				* // Search from the `fromIndex`.
				* _.indexOf([1, 2, 1, 2], 2, 2);
				* // => 3
				*/
				function indexOf(array, value, fromIndex) {
					var length = array == null ? 0 : array.length;
					if (!length) return -1;
					var index = fromIndex == null ? 0 : toInteger(fromIndex);
					if (index < 0) index = nativeMax(length + index, 0);
					return baseIndexOf(array, value, index);
				}
				/**
				* Gets all but the last element of `array`.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {Array} array The array to query.
				* @returns {Array} Returns the slice of `array`.
				* @example
				*
				* _.initial([1, 2, 3]);
				* // => [1, 2]
				*/
				function initial(array) {
					return (array == null ? 0 : array.length) ? baseSlice(array, 0, -1) : [];
				}
				/**
				* Creates an array of unique values that are included in all given arrays
				* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
				* for equality comparisons. The order and references of result values are
				* determined by the first array.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {...Array} [arrays] The arrays to inspect.
				* @returns {Array} Returns the new array of intersecting values.
				* @example
				*
				* _.intersection([2, 1], [2, 3]);
				* // => [2]
				*/
				var intersection = baseRest(function(arrays) {
					var mapped = arrayMap(arrays, castArrayLikeObject);
					return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
				});
				/**
				* This method is like `_.intersection` except that it accepts `iteratee`
				* which is invoked for each element of each `arrays` to generate the criterion
				* by which they're compared. The order and references of result values are
				* determined by the first array. The iteratee is invoked with one argument:
				* (value).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {...Array} [arrays] The arrays to inspect.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {Array} Returns the new array of intersecting values.
				* @example
				*
				* _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
				* // => [2.1]
				*
				* // The `_.property` iteratee shorthand.
				* _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
				* // => [{ 'x': 1 }]
				*/
				var intersectionBy = baseRest(function(arrays) {
					var iteratee = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
					if (iteratee === last(mapped)) iteratee = undefined;
					else mapped.pop();
					return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee, 2)) : [];
				});
				/**
				* This method is like `_.intersection` except that it accepts `comparator`
				* which is invoked to compare elements of `arrays`. The order and references
				* of result values are determined by the first array. The comparator is
				* invoked with two arguments: (arrVal, othVal).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {...Array} [arrays] The arrays to inspect.
				* @param {Function} [comparator] The comparator invoked per element.
				* @returns {Array} Returns the new array of intersecting values.
				* @example
				*
				* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
				* var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
				*
				* _.intersectionWith(objects, others, _.isEqual);
				* // => [{ 'x': 1, 'y': 2 }]
				*/
				var intersectionWith = baseRest(function(arrays) {
					var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
					comparator = typeof comparator == "function" ? comparator : undefined;
					if (comparator) mapped.pop();
					return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined, comparator) : [];
				});
				/**
				* Converts all elements in `array` into a string separated by `separator`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to convert.
				* @param {string} [separator=','] The element separator.
				* @returns {string} Returns the joined string.
				* @example
				*
				* _.join(['a', 'b', 'c'], '~');
				* // => 'a~b~c'
				*/
				function join(array, separator) {
					return array == null ? "" : nativeJoin.call(array, separator);
				}
				/**
				* Gets the last element of `array`.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {Array} array The array to query.
				* @returns {*} Returns the last element of `array`.
				* @example
				*
				* _.last([1, 2, 3]);
				* // => 3
				*/
				function last(array) {
					var length = array == null ? 0 : array.length;
					return length ? array[length - 1] : undefined;
				}
				/**
				* This method is like `_.indexOf` except that it iterates over elements of
				* `array` from right to left.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {*} value The value to search for.
				* @param {number} [fromIndex=array.length-1] The index to search from.
				* @returns {number} Returns the index of the matched value, else `-1`.
				* @example
				*
				* _.lastIndexOf([1, 2, 1, 2], 2);
				* // => 3
				*
				* // Search from the `fromIndex`.
				* _.lastIndexOf([1, 2, 1, 2], 2, 2);
				* // => 1
				*/
				function lastIndexOf(array, value, fromIndex) {
					var length = array == null ? 0 : array.length;
					if (!length) return -1;
					var index = length;
					if (fromIndex !== undefined) {
						index = toInteger(fromIndex);
						index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
					}
					return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
				}
				/**
				* Gets the element at index `n` of `array`. If `n` is negative, the nth
				* element from the end is returned.
				*
				* @static
				* @memberOf _
				* @since 4.11.0
				* @category Array
				* @param {Array} array The array to query.
				* @param {number} [n=0] The index of the element to return.
				* @returns {*} Returns the nth element of `array`.
				* @example
				*
				* var array = ['a', 'b', 'c', 'd'];
				*
				* _.nth(array, 1);
				* // => 'b'
				*
				* _.nth(array, -2);
				* // => 'c';
				*/
				function nth(array, n) {
					return array && array.length ? baseNth(array, toInteger(n)) : undefined;
				}
				/**
				* Removes all given values from `array` using
				* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
				* for equality comparisons.
				*
				* **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
				* to remove elements from an array by predicate.
				*
				* @static
				* @memberOf _
				* @since 2.0.0
				* @category Array
				* @param {Array} array The array to modify.
				* @param {...*} [values] The values to remove.
				* @returns {Array} Returns `array`.
				* @example
				*
				* var array = ['a', 'b', 'c', 'a', 'b', 'c'];
				*
				* _.pull(array, 'a', 'c');
				* console.log(array);
				* // => ['b', 'b']
				*/
				var pull = baseRest(pullAll);
				/**
				* This method is like `_.pull` except that it accepts an array of values to remove.
				*
				* **Note:** Unlike `_.difference`, this method mutates `array`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to modify.
				* @param {Array} values The values to remove.
				* @returns {Array} Returns `array`.
				* @example
				*
				* var array = ['a', 'b', 'c', 'a', 'b', 'c'];
				*
				* _.pullAll(array, ['a', 'c']);
				* console.log(array);
				* // => ['b', 'b']
				*/
				function pullAll(array, values) {
					return array && array.length && values && values.length ? basePullAll(array, values) : array;
				}
				/**
				* This method is like `_.pullAll` except that it accepts `iteratee` which is
				* invoked for each element of `array` and `values` to generate the criterion
				* by which they're compared. The iteratee is invoked with one argument: (value).
				*
				* **Note:** Unlike `_.differenceBy`, this method mutates `array`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to modify.
				* @param {Array} values The values to remove.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {Array} Returns `array`.
				* @example
				*
				* var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
				*
				* _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
				* console.log(array);
				* // => [{ 'x': 2 }]
				*/
				function pullAllBy(array, values, iteratee) {
					return array && array.length && values && values.length ? basePullAll(array, values, getIteratee(iteratee, 2)) : array;
				}
				/**
				* This method is like `_.pullAll` except that it accepts `comparator` which
				* is invoked to compare elements of `array` to `values`. The comparator is
				* invoked with two arguments: (arrVal, othVal).
				*
				* **Note:** Unlike `_.differenceWith`, this method mutates `array`.
				*
				* @static
				* @memberOf _
				* @since 4.6.0
				* @category Array
				* @param {Array} array The array to modify.
				* @param {Array} values The values to remove.
				* @param {Function} [comparator] The comparator invoked per element.
				* @returns {Array} Returns `array`.
				* @example
				*
				* var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
				*
				* _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
				* console.log(array);
				* // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
				*/
				function pullAllWith(array, values, comparator) {
					return array && array.length && values && values.length ? basePullAll(array, values, undefined, comparator) : array;
				}
				/**
				* Removes elements from `array` corresponding to `indexes` and returns an
				* array of removed elements.
				*
				* **Note:** Unlike `_.at`, this method mutates `array`.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Array
				* @param {Array} array The array to modify.
				* @param {...(number|number[])} [indexes] The indexes of elements to remove.
				* @returns {Array} Returns the new array of removed elements.
				* @example
				*
				* var array = ['a', 'b', 'c', 'd'];
				* var pulled = _.pullAt(array, [1, 3]);
				*
				* console.log(array);
				* // => ['a', 'c']
				*
				* console.log(pulled);
				* // => ['b', 'd']
				*/
				var pullAt = flatRest(function(array, indexes) {
					var length = array == null ? 0 : array.length, result = baseAt(array, indexes);
					basePullAt(array, arrayMap(indexes, function(index) {
						return isIndex(index, length) ? +index : index;
					}).sort(compareAscending));
					return result;
				});
				/**
				* Removes all elements from `array` that `predicate` returns truthy for
				* and returns an array of the removed elements. The predicate is invoked
				* with three arguments: (value, index, array).
				*
				* **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
				* to pull elements from an array by value.
				*
				* @static
				* @memberOf _
				* @since 2.0.0
				* @category Array
				* @param {Array} array The array to modify.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the new array of removed elements.
				* @example
				*
				* var array = [1, 2, 3, 4];
				* var evens = _.remove(array, function(n) {
				*   return n % 2 == 0;
				* });
				*
				* console.log(array);
				* // => [1, 3]
				*
				* console.log(evens);
				* // => [2, 4]
				*/
				function remove(array, predicate) {
					var result = [];
					if (!(array && array.length)) return result;
					var index = -1, indexes = [], length = array.length;
					predicate = getIteratee(predicate, 3);
					while (++index < length) {
						var value = array[index];
						if (predicate(value, index, array)) {
							result.push(value);
							indexes.push(index);
						}
					}
					basePullAt(array, indexes);
					return result;
				}
				/**
				* Reverses `array` so that the first element becomes the last, the second
				* element becomes the second to last, and so on.
				*
				* **Note:** This method mutates `array` and is based on
				* [`Array#reverse`](https://mdn.io/Array/reverse).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to modify.
				* @returns {Array} Returns `array`.
				* @example
				*
				* var array = [1, 2, 3];
				*
				* _.reverse(array);
				* // => [3, 2, 1]
				*
				* console.log(array);
				* // => [3, 2, 1]
				*/
				function reverse(array) {
					return array == null ? array : nativeReverse.call(array);
				}
				/**
				* Creates a slice of `array` from `start` up to, but not including, `end`.
				*
				* **Note:** This method is used instead of
				* [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
				* returned.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Array
				* @param {Array} array The array to slice.
				* @param {number} [start=0] The start position.
				* @param {number} [end=array.length] The end position.
				* @returns {Array} Returns the slice of `array`.
				*/
				function slice(array, start, end) {
					var length = array == null ? 0 : array.length;
					if (!length) return [];
					if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
						start = 0;
						end = length;
					} else {
						start = start == null ? 0 : toInteger(start);
						end = end === undefined ? length : toInteger(end);
					}
					return baseSlice(array, start, end);
				}
				/**
				* Uses a binary search to determine the lowest index at which `value`
				* should be inserted into `array` in order to maintain its sort order.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {Array} array The sorted array to inspect.
				* @param {*} value The value to evaluate.
				* @returns {number} Returns the index at which `value` should be inserted
				*  into `array`.
				* @example
				*
				* _.sortedIndex([30, 50], 40);
				* // => 1
				*/
				function sortedIndex(array, value) {
					return baseSortedIndex(array, value);
				}
				/**
				* This method is like `_.sortedIndex` except that it accepts `iteratee`
				* which is invoked for `value` and each element of `array` to compute their
				* sort ranking. The iteratee is invoked with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The sorted array to inspect.
				* @param {*} value The value to evaluate.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {number} Returns the index at which `value` should be inserted
				*  into `array`.
				* @example
				*
				* var objects = [{ 'x': 4 }, { 'x': 5 }];
				*
				* _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
				* // => 0
				*
				* // The `_.property` iteratee shorthand.
				* _.sortedIndexBy(objects, { 'x': 4 }, 'x');
				* // => 0
				*/
				function sortedIndexBy(array, value, iteratee) {
					return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
				}
				/**
				* This method is like `_.indexOf` except that it performs a binary
				* search on a sorted `array`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {*} value The value to search for.
				* @returns {number} Returns the index of the matched value, else `-1`.
				* @example
				*
				* _.sortedIndexOf([4, 5, 5, 5, 6], 5);
				* // => 1
				*/
				function sortedIndexOf(array, value) {
					var length = array == null ? 0 : array.length;
					if (length) {
						var index = baseSortedIndex(array, value);
						if (index < length && eq(array[index], value)) return index;
					}
					return -1;
				}
				/**
				* This method is like `_.sortedIndex` except that it returns the highest
				* index at which `value` should be inserted into `array` in order to
				* maintain its sort order.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Array
				* @param {Array} array The sorted array to inspect.
				* @param {*} value The value to evaluate.
				* @returns {number} Returns the index at which `value` should be inserted
				*  into `array`.
				* @example
				*
				* _.sortedLastIndex([4, 5, 5, 5, 6], 5);
				* // => 4
				*/
				function sortedLastIndex(array, value) {
					return baseSortedIndex(array, value, true);
				}
				/**
				* This method is like `_.sortedLastIndex` except that it accepts `iteratee`
				* which is invoked for `value` and each element of `array` to compute their
				* sort ranking. The iteratee is invoked with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The sorted array to inspect.
				* @param {*} value The value to evaluate.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {number} Returns the index at which `value` should be inserted
				*  into `array`.
				* @example
				*
				* var objects = [{ 'x': 4 }, { 'x': 5 }];
				*
				* _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
				* // => 1
				*
				* // The `_.property` iteratee shorthand.
				* _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
				* // => 1
				*/
				function sortedLastIndexBy(array, value, iteratee) {
					return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
				}
				/**
				* This method is like `_.lastIndexOf` except that it performs a binary
				* search on a sorted `array`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {*} value The value to search for.
				* @returns {number} Returns the index of the matched value, else `-1`.
				* @example
				*
				* _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
				* // => 3
				*/
				function sortedLastIndexOf(array, value) {
					if (array == null ? 0 : array.length) {
						var index = baseSortedIndex(array, value, true) - 1;
						if (eq(array[index], value)) return index;
					}
					return -1;
				}
				/**
				* This method is like `_.uniq` except that it's designed and optimized
				* for sorted arrays.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @returns {Array} Returns the new duplicate free array.
				* @example
				*
				* _.sortedUniq([1, 1, 2]);
				* // => [1, 2]
				*/
				function sortedUniq(array) {
					return array && array.length ? baseSortedUniq(array) : [];
				}
				/**
				* This method is like `_.uniqBy` except that it's designed and optimized
				* for sorted arrays.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {Function} [iteratee] The iteratee invoked per element.
				* @returns {Array} Returns the new duplicate free array.
				* @example
				*
				* _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
				* // => [1.1, 2.3]
				*/
				function sortedUniqBy(array, iteratee) {
					return array && array.length ? baseSortedUniq(array, getIteratee(iteratee, 2)) : [];
				}
				/**
				* Gets all but the first element of `array`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to query.
				* @returns {Array} Returns the slice of `array`.
				* @example
				*
				* _.tail([1, 2, 3]);
				* // => [2, 3]
				*/
				function tail(array) {
					var length = array == null ? 0 : array.length;
					return length ? baseSlice(array, 1, length) : [];
				}
				/**
				* Creates a slice of `array` with `n` elements taken from the beginning.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {Array} array The array to query.
				* @param {number} [n=1] The number of elements to take.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {Array} Returns the slice of `array`.
				* @example
				*
				* _.take([1, 2, 3]);
				* // => [1]
				*
				* _.take([1, 2, 3], 2);
				* // => [1, 2]
				*
				* _.take([1, 2, 3], 5);
				* // => [1, 2, 3]
				*
				* _.take([1, 2, 3], 0);
				* // => []
				*/
				function take(array, n, guard) {
					if (!(array && array.length)) return [];
					n = guard || n === undefined ? 1 : toInteger(n);
					return baseSlice(array, 0, n < 0 ? 0 : n);
				}
				/**
				* Creates a slice of `array` with `n` elements taken from the end.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Array
				* @param {Array} array The array to query.
				* @param {number} [n=1] The number of elements to take.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {Array} Returns the slice of `array`.
				* @example
				*
				* _.takeRight([1, 2, 3]);
				* // => [3]
				*
				* _.takeRight([1, 2, 3], 2);
				* // => [2, 3]
				*
				* _.takeRight([1, 2, 3], 5);
				* // => [1, 2, 3]
				*
				* _.takeRight([1, 2, 3], 0);
				* // => []
				*/
				function takeRight(array, n, guard) {
					var length = array == null ? 0 : array.length;
					if (!length) return [];
					n = guard || n === undefined ? 1 : toInteger(n);
					n = length - n;
					return baseSlice(array, n < 0 ? 0 : n, length);
				}
				/**
				* Creates a slice of `array` with elements taken from the end. Elements are
				* taken until `predicate` returns falsey. The predicate is invoked with
				* three arguments: (value, index, array).
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Array
				* @param {Array} array The array to query.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the slice of `array`.
				* @example
				*
				* var users = [
				*   { 'user': 'barney',  'active': true },
				*   { 'user': 'fred',    'active': false },
				*   { 'user': 'pebbles', 'active': false }
				* ];
				*
				* _.takeRightWhile(users, function(o) { return !o.active; });
				* // => objects for ['fred', 'pebbles']
				*
				* // The `_.matches` iteratee shorthand.
				* _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
				* // => objects for ['pebbles']
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.takeRightWhile(users, ['active', false]);
				* // => objects for ['fred', 'pebbles']
				*
				* // The `_.property` iteratee shorthand.
				* _.takeRightWhile(users, 'active');
				* // => []
				*/
				function takeRightWhile(array, predicate) {
					return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
				}
				/**
				* Creates a slice of `array` with elements taken from the beginning. Elements
				* are taken until `predicate` returns falsey. The predicate is invoked with
				* three arguments: (value, index, array).
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Array
				* @param {Array} array The array to query.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the slice of `array`.
				* @example
				*
				* var users = [
				*   { 'user': 'barney',  'active': false },
				*   { 'user': 'fred',    'active': false },
				*   { 'user': 'pebbles', 'active': true }
				* ];
				*
				* _.takeWhile(users, function(o) { return !o.active; });
				* // => objects for ['barney', 'fred']
				*
				* // The `_.matches` iteratee shorthand.
				* _.takeWhile(users, { 'user': 'barney', 'active': false });
				* // => objects for ['barney']
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.takeWhile(users, ['active', false]);
				* // => objects for ['barney', 'fred']
				*
				* // The `_.property` iteratee shorthand.
				* _.takeWhile(users, 'active');
				* // => []
				*/
				function takeWhile(array, predicate) {
					return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
				}
				/**
				* Creates an array of unique values, in order, from all given arrays using
				* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
				* for equality comparisons.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {...Array} [arrays] The arrays to inspect.
				* @returns {Array} Returns the new array of combined values.
				* @example
				*
				* _.union([2], [1, 2]);
				* // => [2, 1]
				*/
				var union = baseRest(function(arrays) {
					return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
				});
				/**
				* This method is like `_.union` except that it accepts `iteratee` which is
				* invoked for each element of each `arrays` to generate the criterion by
				* which uniqueness is computed. Result values are chosen from the first
				* array in which the value occurs. The iteratee is invoked with one argument:
				* (value).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {...Array} [arrays] The arrays to inspect.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {Array} Returns the new array of combined values.
				* @example
				*
				* _.unionBy([2.1], [1.2, 2.3], Math.floor);
				* // => [2.1, 1.2]
				*
				* // The `_.property` iteratee shorthand.
				* _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
				* // => [{ 'x': 1 }, { 'x': 2 }]
				*/
				var unionBy = baseRest(function(arrays) {
					var iteratee = last(arrays);
					if (isArrayLikeObject(iteratee)) iteratee = undefined;
					return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
				});
				/**
				* This method is like `_.union` except that it accepts `comparator` which
				* is invoked to compare elements of `arrays`. Result values are chosen from
				* the first array in which the value occurs. The comparator is invoked
				* with two arguments: (arrVal, othVal).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {...Array} [arrays] The arrays to inspect.
				* @param {Function} [comparator] The comparator invoked per element.
				* @returns {Array} Returns the new array of combined values.
				* @example
				*
				* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
				* var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
				*
				* _.unionWith(objects, others, _.isEqual);
				* // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
				*/
				var unionWith = baseRest(function(arrays) {
					var comparator = last(arrays);
					comparator = typeof comparator == "function" ? comparator : undefined;
					return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
				});
				/**
				* Creates a duplicate-free version of an array, using
				* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
				* for equality comparisons, in which only the first occurrence of each element
				* is kept. The order of result values is determined by the order they occur
				* in the array.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @returns {Array} Returns the new duplicate free array.
				* @example
				*
				* _.uniq([2, 1, 2]);
				* // => [2, 1]
				*/
				function uniq(array) {
					return array && array.length ? baseUniq(array) : [];
				}
				/**
				* This method is like `_.uniq` except that it accepts `iteratee` which is
				* invoked for each element in `array` to generate the criterion by which
				* uniqueness is computed. The order of result values is determined by the
				* order they occur in the array. The iteratee is invoked with one argument:
				* (value).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {Array} Returns the new duplicate free array.
				* @example
				*
				* _.uniqBy([2.1, 1.2, 2.3], Math.floor);
				* // => [2.1, 1.2]
				*
				* // The `_.property` iteratee shorthand.
				* _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
				* // => [{ 'x': 1 }, { 'x': 2 }]
				*/
				function uniqBy(array, iteratee) {
					return array && array.length ? baseUniq(array, getIteratee(iteratee, 2)) : [];
				}
				/**
				* This method is like `_.uniq` except that it accepts `comparator` which
				* is invoked to compare elements of `array`. The order of result values is
				* determined by the order they occur in the array.The comparator is invoked
				* with two arguments: (arrVal, othVal).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {Function} [comparator] The comparator invoked per element.
				* @returns {Array} Returns the new duplicate free array.
				* @example
				*
				* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
				*
				* _.uniqWith(objects, _.isEqual);
				* // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
				*/
				function uniqWith(array, comparator) {
					comparator = typeof comparator == "function" ? comparator : undefined;
					return array && array.length ? baseUniq(array, undefined, comparator) : [];
				}
				/**
				* This method is like `_.zip` except that it accepts an array of grouped
				* elements and creates an array regrouping the elements to their pre-zip
				* configuration.
				*
				* @static
				* @memberOf _
				* @since 1.2.0
				* @category Array
				* @param {Array} array The array of grouped elements to process.
				* @returns {Array} Returns the new array of regrouped elements.
				* @example
				*
				* var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
				* // => [['a', 1, true], ['b', 2, false]]
				*
				* _.unzip(zipped);
				* // => [['a', 'b'], [1, 2], [true, false]]
				*/
				function unzip(array) {
					if (!(array && array.length)) return [];
					var length = 0;
					array = arrayFilter(array, function(group) {
						if (isArrayLikeObject(group)) {
							length = nativeMax(group.length, length);
							return true;
						}
					});
					return baseTimes(length, function(index) {
						return arrayMap(array, baseProperty(index));
					});
				}
				/**
				* This method is like `_.unzip` except that it accepts `iteratee` to specify
				* how regrouped values should be combined. The iteratee is invoked with the
				* elements of each group: (...group).
				*
				* @static
				* @memberOf _
				* @since 3.8.0
				* @category Array
				* @param {Array} array The array of grouped elements to process.
				* @param {Function} [iteratee=_.identity] The function to combine
				*  regrouped values.
				* @returns {Array} Returns the new array of regrouped elements.
				* @example
				*
				* var zipped = _.zip([1, 2], [10, 20], [100, 200]);
				* // => [[1, 10, 100], [2, 20, 200]]
				*
				* _.unzipWith(zipped, _.add);
				* // => [3, 30, 300]
				*/
				function unzipWith(array, iteratee) {
					if (!(array && array.length)) return [];
					var result = unzip(array);
					if (iteratee == null) return result;
					return arrayMap(result, function(group) {
						return apply(iteratee, undefined, group);
					});
				}
				/**
				* Creates an array excluding all given values using
				* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
				* for equality comparisons.
				*
				* **Note:** Unlike `_.pull`, this method returns a new array.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {Array} array The array to inspect.
				* @param {...*} [values] The values to exclude.
				* @returns {Array} Returns the new array of filtered values.
				* @see _.difference, _.xor
				* @example
				*
				* _.without([2, 1, 2, 3], 1, 2);
				* // => [3]
				*/
				var without = baseRest(function(array, values) {
					return isArrayLikeObject(array) ? baseDifference(array, values) : [];
				});
				/**
				* Creates an array of unique values that is the
				* [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
				* of the given arrays. The order of result values is determined by the order
				* they occur in the arrays.
				*
				* @static
				* @memberOf _
				* @since 2.4.0
				* @category Array
				* @param {...Array} [arrays] The arrays to inspect.
				* @returns {Array} Returns the new array of filtered values.
				* @see _.difference, _.without
				* @example
				*
				* _.xor([2, 1], [2, 3]);
				* // => [1, 3]
				*/
				var xor = baseRest(function(arrays) {
					return baseXor(arrayFilter(arrays, isArrayLikeObject));
				});
				/**
				* This method is like `_.xor` except that it accepts `iteratee` which is
				* invoked for each element of each `arrays` to generate the criterion by
				* which by which they're compared. The order of result values is determined
				* by the order they occur in the arrays. The iteratee is invoked with one
				* argument: (value).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {...Array} [arrays] The arrays to inspect.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {Array} Returns the new array of filtered values.
				* @example
				*
				* _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
				* // => [1.2, 3.4]
				*
				* // The `_.property` iteratee shorthand.
				* _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
				* // => [{ 'x': 2 }]
				*/
				var xorBy = baseRest(function(arrays) {
					var iteratee = last(arrays);
					if (isArrayLikeObject(iteratee)) iteratee = undefined;
					return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
				});
				/**
				* This method is like `_.xor` except that it accepts `comparator` which is
				* invoked to compare elements of `arrays`. The order of result values is
				* determined by the order they occur in the arrays. The comparator is invoked
				* with two arguments: (arrVal, othVal).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Array
				* @param {...Array} [arrays] The arrays to inspect.
				* @param {Function} [comparator] The comparator invoked per element.
				* @returns {Array} Returns the new array of filtered values.
				* @example
				*
				* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
				* var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
				*
				* _.xorWith(objects, others, _.isEqual);
				* // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
				*/
				var xorWith = baseRest(function(arrays) {
					var comparator = last(arrays);
					comparator = typeof comparator == "function" ? comparator : undefined;
					return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
				});
				/**
				* Creates an array of grouped elements, the first of which contains the
				* first elements of the given arrays, the second of which contains the
				* second elements of the given arrays, and so on.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Array
				* @param {...Array} [arrays] The arrays to process.
				* @returns {Array} Returns the new array of grouped elements.
				* @example
				*
				* _.zip(['a', 'b'], [1, 2], [true, false]);
				* // => [['a', 1, true], ['b', 2, false]]
				*/
				var zip = baseRest(unzip);
				/**
				* This method is like `_.fromPairs` except that it accepts two arrays,
				* one of property identifiers and one of corresponding values.
				*
				* @static
				* @memberOf _
				* @since 0.4.0
				* @category Array
				* @param {Array} [props=[]] The property identifiers.
				* @param {Array} [values=[]] The property values.
				* @returns {Object} Returns the new object.
				* @example
				*
				* _.zipObject(['a', 'b'], [1, 2]);
				* // => { 'a': 1, 'b': 2 }
				*/
				function zipObject(props, values) {
					return baseZipObject(props || [], values || [], assignValue);
				}
				/**
				* This method is like `_.zipObject` except that it supports property paths.
				*
				* @static
				* @memberOf _
				* @since 4.1.0
				* @category Array
				* @param {Array} [props=[]] The property identifiers.
				* @param {Array} [values=[]] The property values.
				* @returns {Object} Returns the new object.
				* @example
				*
				* _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
				* // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
				*/
				function zipObjectDeep(props, values) {
					return baseZipObject(props || [], values || [], baseSet);
				}
				/**
				* This method is like `_.zip` except that it accepts `iteratee` to specify
				* how grouped values should be combined. The iteratee is invoked with the
				* elements of each group: (...group).
				*
				* @static
				* @memberOf _
				* @since 3.8.0
				* @category Array
				* @param {...Array} [arrays] The arrays to process.
				* @param {Function} [iteratee=_.identity] The function to combine
				*  grouped values.
				* @returns {Array} Returns the new array of grouped elements.
				* @example
				*
				* _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
				*   return a + b + c;
				* });
				* // => [111, 222]
				*/
				var zipWith = baseRest(function(arrays) {
					var length = arrays.length, iteratee = length > 1 ? arrays[length - 1] : undefined;
					iteratee = typeof iteratee == "function" ? (arrays.pop(), iteratee) : undefined;
					return unzipWith(arrays, iteratee);
				});
				/**
				* Creates a `lodash` wrapper instance that wraps `value` with explicit method
				* chain sequences enabled. The result of such sequences must be unwrapped
				* with `_#value`.
				*
				* @static
				* @memberOf _
				* @since 1.3.0
				* @category Seq
				* @param {*} value The value to wrap.
				* @returns {Object} Returns the new `lodash` wrapper instance.
				* @example
				*
				* var users = [
				*   { 'user': 'barney',  'age': 36 },
				*   { 'user': 'fred',    'age': 40 },
				*   { 'user': 'pebbles', 'age': 1 }
				* ];
				*
				* var youngest = _
				*   .chain(users)
				*   .sortBy('age')
				*   .map(function(o) {
				*     return o.user + ' is ' + o.age;
				*   })
				*   .head()
				*   .value();
				* // => 'pebbles is 1'
				*/
				function chain(value) {
					var result = lodash(value);
					result.__chain__ = true;
					return result;
				}
				/**
				* This method invokes `interceptor` and returns `value`. The interceptor
				* is invoked with one argument; (value). The purpose of this method is to
				* "tap into" a method chain sequence in order to modify intermediate results.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Seq
				* @param {*} value The value to provide to `interceptor`.
				* @param {Function} interceptor The function to invoke.
				* @returns {*} Returns `value`.
				* @example
				*
				* _([1, 2, 3])
				*  .tap(function(array) {
				*    // Mutate input array.
				*    array.pop();
				*  })
				*  .reverse()
				*  .value();
				* // => [2, 1]
				*/
				function tap(value, interceptor) {
					interceptor(value);
					return value;
				}
				/**
				* This method is like `_.tap` except that it returns the result of `interceptor`.
				* The purpose of this method is to "pass thru" values replacing intermediate
				* results in a method chain sequence.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Seq
				* @param {*} value The value to provide to `interceptor`.
				* @param {Function} interceptor The function to invoke.
				* @returns {*} Returns the result of `interceptor`.
				* @example
				*
				* _('  abc  ')
				*  .chain()
				*  .trim()
				*  .thru(function(value) {
				*    return [value];
				*  })
				*  .value();
				* // => ['abc']
				*/
				function thru(value, interceptor) {
					return interceptor(value);
				}
				/**
				* This method is the wrapper version of `_.at`.
				*
				* @name at
				* @memberOf _
				* @since 1.0.0
				* @category Seq
				* @param {...(string|string[])} [paths] The property paths to pick.
				* @returns {Object} Returns the new `lodash` wrapper instance.
				* @example
				*
				* var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
				*
				* _(object).at(['a[0].b.c', 'a[1]']).value();
				* // => [3, 4]
				*/
				var wrapperAt = flatRest(function(paths) {
					var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
						return baseAt(object, paths);
					};
					if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) return this.thru(interceptor);
					value = value.slice(start, +start + (length ? 1 : 0));
					value.__actions__.push({
						"func": thru,
						"args": [interceptor],
						"thisArg": undefined
					});
					return new LodashWrapper(value, this.__chain__).thru(function(array) {
						if (length && !array.length) array.push(undefined);
						return array;
					});
				});
				/**
				* Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
				*
				* @name chain
				* @memberOf _
				* @since 0.1.0
				* @category Seq
				* @returns {Object} Returns the new `lodash` wrapper instance.
				* @example
				*
				* var users = [
				*   { 'user': 'barney', 'age': 36 },
				*   { 'user': 'fred',   'age': 40 }
				* ];
				*
				* // A sequence without explicit chaining.
				* _(users).head();
				* // => { 'user': 'barney', 'age': 36 }
				*
				* // A sequence with explicit chaining.
				* _(users)
				*   .chain()
				*   .head()
				*   .pick('user')
				*   .value();
				* // => { 'user': 'barney' }
				*/
				function wrapperChain() {
					return chain(this);
				}
				/**
				* Executes the chain sequence and returns the wrapped result.
				*
				* @name commit
				* @memberOf _
				* @since 3.2.0
				* @category Seq
				* @returns {Object} Returns the new `lodash` wrapper instance.
				* @example
				*
				* var array = [1, 2];
				* var wrapped = _(array).push(3);
				*
				* console.log(array);
				* // => [1, 2]
				*
				* wrapped = wrapped.commit();
				* console.log(array);
				* // => [1, 2, 3]
				*
				* wrapped.last();
				* // => 3
				*
				* console.log(array);
				* // => [1, 2, 3]
				*/
				function wrapperCommit() {
					return new LodashWrapper(this.value(), this.__chain__);
				}
				/**
				* Gets the next value on a wrapped object following the
				* [iterator protocol](https://mdn.io/iteration_protocols#iterator).
				*
				* @name next
				* @memberOf _
				* @since 4.0.0
				* @category Seq
				* @returns {Object} Returns the next iterator value.
				* @example
				*
				* var wrapped = _([1, 2]);
				*
				* wrapped.next();
				* // => { 'done': false, 'value': 1 }
				*
				* wrapped.next();
				* // => { 'done': false, 'value': 2 }
				*
				* wrapped.next();
				* // => { 'done': true, 'value': undefined }
				*/
				function wrapperNext() {
					if (this.__values__ === undefined) this.__values__ = toArray(this.value());
					var done = this.__index__ >= this.__values__.length;
					return {
						"done": done,
						"value": done ? undefined : this.__values__[this.__index__++]
					};
				}
				/**
				* Enables the wrapper to be iterable.
				*
				* @name Symbol.iterator
				* @memberOf _
				* @since 4.0.0
				* @category Seq
				* @returns {Object} Returns the wrapper object.
				* @example
				*
				* var wrapped = _([1, 2]);
				*
				* wrapped[Symbol.iterator]() === wrapped;
				* // => true
				*
				* Array.from(wrapped);
				* // => [1, 2]
				*/
				function wrapperToIterator() {
					return this;
				}
				/**
				* Creates a clone of the chain sequence planting `value` as the wrapped value.
				*
				* @name plant
				* @memberOf _
				* @since 3.2.0
				* @category Seq
				* @param {*} value The value to plant.
				* @returns {Object} Returns the new `lodash` wrapper instance.
				* @example
				*
				* function square(n) {
				*   return n * n;
				* }
				*
				* var wrapped = _([1, 2]).map(square);
				* var other = wrapped.plant([3, 4]);
				*
				* other.value();
				* // => [9, 16]
				*
				* wrapped.value();
				* // => [1, 4]
				*/
				function wrapperPlant(value) {
					var result, parent = this;
					while (parent instanceof baseLodash) {
						var clone = wrapperClone(parent);
						clone.__index__ = 0;
						clone.__values__ = undefined;
						if (result) previous.__wrapped__ = clone;
						else result = clone;
						var previous = clone;
						parent = parent.__wrapped__;
					}
					previous.__wrapped__ = value;
					return result;
				}
				/**
				* This method is the wrapper version of `_.reverse`.
				*
				* **Note:** This method mutates the wrapped array.
				*
				* @name reverse
				* @memberOf _
				* @since 0.1.0
				* @category Seq
				* @returns {Object} Returns the new `lodash` wrapper instance.
				* @example
				*
				* var array = [1, 2, 3];
				*
				* _(array).reverse().value()
				* // => [3, 2, 1]
				*
				* console.log(array);
				* // => [3, 2, 1]
				*/
				function wrapperReverse() {
					var value = this.__wrapped__;
					if (value instanceof LazyWrapper) {
						var wrapped = value;
						if (this.__actions__.length) wrapped = new LazyWrapper(this);
						wrapped = wrapped.reverse();
						wrapped.__actions__.push({
							"func": thru,
							"args": [reverse],
							"thisArg": undefined
						});
						return new LodashWrapper(wrapped, this.__chain__);
					}
					return this.thru(reverse);
				}
				/**
				* Executes the chain sequence to resolve the unwrapped value.
				*
				* @name value
				* @memberOf _
				* @since 0.1.0
				* @alias toJSON, valueOf
				* @category Seq
				* @returns {*} Returns the resolved unwrapped value.
				* @example
				*
				* _([1, 2, 3]).value();
				* // => [1, 2, 3]
				*/
				function wrapperValue() {
					return baseWrapperValue(this.__wrapped__, this.__actions__);
				}
				/**
				* Creates an object composed of keys generated from the results of running
				* each element of `collection` thru `iteratee`. The corresponding value of
				* each key is the number of times the key was returned by `iteratee`. The
				* iteratee is invoked with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 0.5.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [iteratee=_.identity] The iteratee to transform keys.
				* @returns {Object} Returns the composed aggregate object.
				* @example
				*
				* _.countBy([6.1, 4.2, 6.3], Math.floor);
				* // => { '4': 1, '6': 2 }
				*
				* // The `_.property` iteratee shorthand.
				* _.countBy(['one', 'two', 'three'], 'length');
				* // => { '3': 2, '5': 1 }
				*/
				var countBy = createAggregator(function(result, value, key) {
					if (hasOwnProperty.call(result, key)) ++result[key];
					else baseAssignValue(result, key, 1);
				});
				/**
				* Checks if `predicate` returns truthy for **all** elements of `collection`.
				* Iteration is stopped once `predicate` returns falsey. The predicate is
				* invoked with three arguments: (value, index|key, collection).
				*
				* **Note:** This method returns `true` for
				* [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
				* [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
				* elements of empty collections.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {boolean} Returns `true` if all elements pass the predicate check,
				*  else `false`.
				* @example
				*
				* _.every([true, 1, null, 'yes'], Boolean);
				* // => false
				*
				* var users = [
				*   { 'user': 'barney', 'age': 36, 'active': false },
				*   { 'user': 'fred',   'age': 40, 'active': false }
				* ];
				*
				* // The `_.matches` iteratee shorthand.
				* _.every(users, { 'user': 'barney', 'active': false });
				* // => false
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.every(users, ['active', false]);
				* // => true
				*
				* // The `_.property` iteratee shorthand.
				* _.every(users, 'active');
				* // => false
				*/
				function every(collection, predicate, guard) {
					var func = isArray(collection) ? arrayEvery : baseEvery;
					if (guard && isIterateeCall(collection, predicate, guard)) predicate = undefined;
					return func(collection, getIteratee(predicate, 3));
				}
				/**
				* Iterates over elements of `collection`, returning an array of all elements
				* `predicate` returns truthy for. The predicate is invoked with three
				* arguments: (value, index|key, collection).
				*
				* **Note:** Unlike `_.remove`, this method returns a new array.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the new filtered array.
				* @see _.reject
				* @example
				*
				* var users = [
				*   { 'user': 'barney', 'age': 36, 'active': true },
				*   { 'user': 'fred',   'age': 40, 'active': false }
				* ];
				*
				* _.filter(users, function(o) { return !o.active; });
				* // => objects for ['fred']
				*
				* // The `_.matches` iteratee shorthand.
				* _.filter(users, { 'age': 36, 'active': true });
				* // => objects for ['barney']
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.filter(users, ['active', false]);
				* // => objects for ['fred']
				*
				* // The `_.property` iteratee shorthand.
				* _.filter(users, 'active');
				* // => objects for ['barney']
				*
				* // Combining several predicates using `_.overEvery` or `_.overSome`.
				* _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
				* // => objects for ['fred', 'barney']
				*/
				function filter(collection, predicate) {
					return (isArray(collection) ? arrayFilter : baseFilter)(collection, getIteratee(predicate, 3));
				}
				/**
				* Iterates over elements of `collection`, returning the first element
				* `predicate` returns truthy for. The predicate is invoked with three
				* arguments: (value, index|key, collection).
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object} collection The collection to inspect.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @param {number} [fromIndex=0] The index to search from.
				* @returns {*} Returns the matched element, else `undefined`.
				* @example
				*
				* var users = [
				*   { 'user': 'barney',  'age': 36, 'active': true },
				*   { 'user': 'fred',    'age': 40, 'active': false },
				*   { 'user': 'pebbles', 'age': 1,  'active': true }
				* ];
				*
				* _.find(users, function(o) { return o.age < 40; });
				* // => object for 'barney'
				*
				* // The `_.matches` iteratee shorthand.
				* _.find(users, { 'age': 1, 'active': true });
				* // => object for 'pebbles'
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.find(users, ['active', false]);
				* // => object for 'fred'
				*
				* // The `_.property` iteratee shorthand.
				* _.find(users, 'active');
				* // => object for 'barney'
				*/
				var find = createFind(findIndex);
				/**
				* This method is like `_.find` except that it iterates over elements of
				* `collection` from right to left.
				*
				* @static
				* @memberOf _
				* @since 2.0.0
				* @category Collection
				* @param {Array|Object} collection The collection to inspect.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @param {number} [fromIndex=collection.length-1] The index to search from.
				* @returns {*} Returns the matched element, else `undefined`.
				* @example
				*
				* _.findLast([1, 2, 3, 4], function(n) {
				*   return n % 2 == 1;
				* });
				* // => 3
				*/
				var findLast = createFind(findLastIndex);
				/**
				* Creates a flattened array of values by running each element in `collection`
				* thru `iteratee` and flattening the mapped results. The iteratee is invoked
				* with three arguments: (value, index|key, collection).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the new flattened array.
				* @example
				*
				* function duplicate(n) {
				*   return [n, n];
				* }
				*
				* _.flatMap([1, 2], duplicate);
				* // => [1, 1, 2, 2]
				*/
				function flatMap(collection, iteratee) {
					return baseFlatten(map(collection, iteratee), 1);
				}
				/**
				* This method is like `_.flatMap` except that it recursively flattens the
				* mapped results.
				*
				* @static
				* @memberOf _
				* @since 4.7.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the new flattened array.
				* @example
				*
				* function duplicate(n) {
				*   return [[[n, n]]];
				* }
				*
				* _.flatMapDeep([1, 2], duplicate);
				* // => [1, 1, 2, 2]
				*/
				function flatMapDeep(collection, iteratee) {
					return baseFlatten(map(collection, iteratee), INFINITY);
				}
				/**
				* This method is like `_.flatMap` except that it recursively flattens the
				* mapped results up to `depth` times.
				*
				* @static
				* @memberOf _
				* @since 4.7.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @param {number} [depth=1] The maximum recursion depth.
				* @returns {Array} Returns the new flattened array.
				* @example
				*
				* function duplicate(n) {
				*   return [[[n, n]]];
				* }
				*
				* _.flatMapDepth([1, 2], duplicate, 2);
				* // => [[1, 1], [2, 2]]
				*/
				function flatMapDepth(collection, iteratee, depth) {
					depth = depth === undefined ? 1 : toInteger(depth);
					return baseFlatten(map(collection, iteratee), depth);
				}
				/**
				* Iterates over elements of `collection` and invokes `iteratee` for each element.
				* The iteratee is invoked with three arguments: (value, index|key, collection).
				* Iteratee functions may exit iteration early by explicitly returning `false`.
				*
				* **Note:** As with other "Collections" methods, objects with a "length"
				* property are iterated like arrays. To avoid this behavior use `_.forIn`
				* or `_.forOwn` for object iteration.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @alias each
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Array|Object} Returns `collection`.
				* @see _.forEachRight
				* @example
				*
				* _.forEach([1, 2], function(value) {
				*   console.log(value);
				* });
				* // => Logs `1` then `2`.
				*
				* _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
				*   console.log(key);
				* });
				* // => Logs 'a' then 'b' (iteration order is not guaranteed).
				*/
				function forEach(collection, iteratee) {
					return (isArray(collection) ? arrayEach : baseEach)(collection, getIteratee(iteratee, 3));
				}
				/**
				* This method is like `_.forEach` except that it iterates over elements of
				* `collection` from right to left.
				*
				* @static
				* @memberOf _
				* @since 2.0.0
				* @alias eachRight
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Array|Object} Returns `collection`.
				* @see _.forEach
				* @example
				*
				* _.forEachRight([1, 2], function(value) {
				*   console.log(value);
				* });
				* // => Logs `2` then `1`.
				*/
				function forEachRight(collection, iteratee) {
					return (isArray(collection) ? arrayEachRight : baseEachRight)(collection, getIteratee(iteratee, 3));
				}
				/**
				* Creates an object composed of keys generated from the results of running
				* each element of `collection` thru `iteratee`. The order of grouped values
				* is determined by the order they occur in `collection`. The corresponding
				* value of each key is an array of elements responsible for generating the
				* key. The iteratee is invoked with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [iteratee=_.identity] The iteratee to transform keys.
				* @returns {Object} Returns the composed aggregate object.
				* @example
				*
				* _.groupBy([6.1, 4.2, 6.3], Math.floor);
				* // => { '4': [4.2], '6': [6.1, 6.3] }
				*
				* // The `_.property` iteratee shorthand.
				* _.groupBy(['one', 'two', 'three'], 'length');
				* // => { '3': ['one', 'two'], '5': ['three'] }
				*/
				var groupBy = createAggregator(function(result, value, key) {
					if (hasOwnProperty.call(result, key)) result[key].push(value);
					else baseAssignValue(result, key, [value]);
				});
				/**
				* Checks if `value` is in `collection`. If `collection` is a string, it's
				* checked for a substring of `value`, otherwise
				* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
				* is used for equality comparisons. If `fromIndex` is negative, it's used as
				* the offset from the end of `collection`.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object|string} collection The collection to inspect.
				* @param {*} value The value to search for.
				* @param {number} [fromIndex=0] The index to search from.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
				* @returns {boolean} Returns `true` if `value` is found, else `false`.
				* @example
				*
				* _.includes([1, 2, 3], 1);
				* // => true
				*
				* _.includes([1, 2, 3], 1, 2);
				* // => false
				*
				* _.includes({ 'a': 1, 'b': 2 }, 1);
				* // => true
				*
				* _.includes('abcd', 'bc');
				* // => true
				*/
				function includes(collection, value, fromIndex, guard) {
					collection = isArrayLike(collection) ? collection : values(collection);
					fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
					var length = collection.length;
					if (fromIndex < 0) fromIndex = nativeMax(length + fromIndex, 0);
					return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
				}
				/**
				* Invokes the method at `path` of each element in `collection`, returning
				* an array of the results of each invoked method. Any additional arguments
				* are provided to each invoked method. If `path` is a function, it's invoked
				* for, and `this` bound to, each element in `collection`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Array|Function|string} path The path of the method to invoke or
				*  the function invoked per iteration.
				* @param {...*} [args] The arguments to invoke each method with.
				* @returns {Array} Returns the array of results.
				* @example
				*
				* _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
				* // => [[1, 5, 7], [1, 2, 3]]
				*
				* _.invokeMap([123, 456], String.prototype.split, '');
				* // => [['1', '2', '3'], ['4', '5', '6']]
				*/
				var invokeMap = baseRest(function(collection, path, args) {
					var index = -1, isFunc = typeof path == "function", result = isArrayLike(collection) ? Array(collection.length) : [];
					baseEach(collection, function(value) {
						result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
					});
					return result;
				});
				/**
				* Creates an object composed of keys generated from the results of running
				* each element of `collection` thru `iteratee`. The corresponding value of
				* each key is the last element responsible for generating the key. The
				* iteratee is invoked with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [iteratee=_.identity] The iteratee to transform keys.
				* @returns {Object} Returns the composed aggregate object.
				* @example
				*
				* var array = [
				*   { 'dir': 'left', 'code': 97 },
				*   { 'dir': 'right', 'code': 100 }
				* ];
				*
				* _.keyBy(array, function(o) {
				*   return String.fromCharCode(o.code);
				* });
				* // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
				*
				* _.keyBy(array, 'dir');
				* // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
				*/
				var keyBy = createAggregator(function(result, value, key) {
					baseAssignValue(result, key, value);
				});
				/**
				* Creates an array of values by running each element in `collection` thru
				* `iteratee`. The iteratee is invoked with three arguments:
				* (value, index|key, collection).
				*
				* Many lodash methods are guarded to work as iteratees for methods like
				* `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
				*
				* The guarded methods are:
				* `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
				* `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
				* `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
				* `template`, `trim`, `trimEnd`, `trimStart`, and `words`
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the new mapped array.
				* @example
				*
				* function square(n) {
				*   return n * n;
				* }
				*
				* _.map([4, 8], square);
				* // => [16, 64]
				*
				* _.map({ 'a': 4, 'b': 8 }, square);
				* // => [16, 64] (iteration order is not guaranteed)
				*
				* var users = [
				*   { 'user': 'barney' },
				*   { 'user': 'fred' }
				* ];
				*
				* // The `_.property` iteratee shorthand.
				* _.map(users, 'user');
				* // => ['barney', 'fred']
				*/
				function map(collection, iteratee) {
					return (isArray(collection) ? arrayMap : baseMap)(collection, getIteratee(iteratee, 3));
				}
				/**
				* This method is like `_.sortBy` except that it allows specifying the sort
				* orders of the iteratees to sort by. If `orders` is unspecified, all values
				* are sorted in ascending order. Otherwise, specify an order of "desc" for
				* descending or "asc" for ascending sort order of corresponding values.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
				*  The iteratees to sort by.
				* @param {string[]} [orders] The sort orders of `iteratees`.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
				* @returns {Array} Returns the new sorted array.
				* @example
				*
				* var users = [
				*   { 'user': 'fred',   'age': 48 },
				*   { 'user': 'barney', 'age': 34 },
				*   { 'user': 'fred',   'age': 40 },
				*   { 'user': 'barney', 'age': 36 }
				* ];
				*
				* // Sort by `user` in ascending order and by `age` in descending order.
				* _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
				* // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
				*/
				function orderBy(collection, iteratees, orders, guard) {
					if (collection == null) return [];
					if (!isArray(iteratees)) iteratees = iteratees == null ? [] : [iteratees];
					orders = guard ? undefined : orders;
					if (!isArray(orders)) orders = orders == null ? [] : [orders];
					return baseOrderBy(collection, iteratees, orders);
				}
				/**
				* Creates an array of elements split into two groups, the first of which
				* contains elements `predicate` returns truthy for, the second of which
				* contains elements `predicate` returns falsey for. The predicate is
				* invoked with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the array of grouped elements.
				* @example
				*
				* var users = [
				*   { 'user': 'barney',  'age': 36, 'active': false },
				*   { 'user': 'fred',    'age': 40, 'active': true },
				*   { 'user': 'pebbles', 'age': 1,  'active': false }
				* ];
				*
				* _.partition(users, function(o) { return o.active; });
				* // => objects for [['fred'], ['barney', 'pebbles']]
				*
				* // The `_.matches` iteratee shorthand.
				* _.partition(users, { 'age': 1, 'active': false });
				* // => objects for [['pebbles'], ['barney', 'fred']]
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.partition(users, ['active', false]);
				* // => objects for [['barney', 'pebbles'], ['fred']]
				*
				* // The `_.property` iteratee shorthand.
				* _.partition(users, 'active');
				* // => objects for [['fred'], ['barney', 'pebbles']]
				*/
				var partition = createAggregator(function(result, value, key) {
					result[key ? 0 : 1].push(value);
				}, function() {
					return [[], []];
				});
				/**
				* Reduces `collection` to a value which is the accumulated result of running
				* each element in `collection` thru `iteratee`, where each successive
				* invocation is supplied the return value of the previous. If `accumulator`
				* is not given, the first element of `collection` is used as the initial
				* value. The iteratee is invoked with four arguments:
				* (accumulator, value, index|key, collection).
				*
				* Many lodash methods are guarded to work as iteratees for methods like
				* `_.reduce`, `_.reduceRight`, and `_.transform`.
				*
				* The guarded methods are:
				* `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
				* and `sortBy`
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @param {*} [accumulator] The initial value.
				* @returns {*} Returns the accumulated value.
				* @see _.reduceRight
				* @example
				*
				* _.reduce([1, 2], function(sum, n) {
				*   return sum + n;
				* }, 0);
				* // => 3
				*
				* _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
				*   (result[value] || (result[value] = [])).push(key);
				*   return result;
				* }, {});
				* // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
				*/
				function reduce(collection, iteratee, accumulator) {
					var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
					return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
				}
				/**
				* This method is like `_.reduce` except that it iterates over elements of
				* `collection` from right to left.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @param {*} [accumulator] The initial value.
				* @returns {*} Returns the accumulated value.
				* @see _.reduce
				* @example
				*
				* var array = [[0, 1], [2, 3], [4, 5]];
				*
				* _.reduceRight(array, function(flattened, other) {
				*   return flattened.concat(other);
				* }, []);
				* // => [4, 5, 2, 3, 0, 1]
				*/
				function reduceRight(collection, iteratee, accumulator) {
					var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
					return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
				}
				/**
				* The opposite of `_.filter`; this method returns the elements of `collection`
				* that `predicate` does **not** return truthy for.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the new filtered array.
				* @see _.filter
				* @example
				*
				* var users = [
				*   { 'user': 'barney', 'age': 36, 'active': false },
				*   { 'user': 'fred',   'age': 40, 'active': true }
				* ];
				*
				* _.reject(users, function(o) { return !o.active; });
				* // => objects for ['fred']
				*
				* // The `_.matches` iteratee shorthand.
				* _.reject(users, { 'age': 40, 'active': true });
				* // => objects for ['barney']
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.reject(users, ['active', false]);
				* // => objects for ['fred']
				*
				* // The `_.property` iteratee shorthand.
				* _.reject(users, 'active');
				* // => objects for ['barney']
				*/
				function reject(collection, predicate) {
					return (isArray(collection) ? arrayFilter : baseFilter)(collection, negate(getIteratee(predicate, 3)));
				}
				/**
				* Gets a random element from `collection`.
				*
				* @static
				* @memberOf _
				* @since 2.0.0
				* @category Collection
				* @param {Array|Object} collection The collection to sample.
				* @returns {*} Returns the random element.
				* @example
				*
				* _.sample([1, 2, 3, 4]);
				* // => 2
				*/
				function sample(collection) {
					return (isArray(collection) ? arraySample : baseSample)(collection);
				}
				/**
				* Gets `n` random elements at unique keys from `collection` up to the
				* size of `collection`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Collection
				* @param {Array|Object} collection The collection to sample.
				* @param {number} [n=1] The number of elements to sample.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {Array} Returns the random elements.
				* @example
				*
				* _.sampleSize([1, 2, 3], 2);
				* // => [3, 1]
				*
				* _.sampleSize([1, 2, 3], 4);
				* // => [2, 3, 1]
				*/
				function sampleSize(collection, n, guard) {
					if (guard ? isIterateeCall(collection, n, guard) : n === undefined) n = 1;
					else n = toInteger(n);
					return (isArray(collection) ? arraySampleSize : baseSampleSize)(collection, n);
				}
				/**
				* Creates an array of shuffled values, using a version of the
				* [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object} collection The collection to shuffle.
				* @returns {Array} Returns the new shuffled array.
				* @example
				*
				* _.shuffle([1, 2, 3, 4]);
				* // => [4, 1, 3, 2]
				*/
				function shuffle(collection) {
					return (isArray(collection) ? arrayShuffle : baseShuffle)(collection);
				}
				/**
				* Gets the size of `collection` by returning its length for array-like
				* values or the number of own enumerable string keyed properties for objects.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object|string} collection The collection to inspect.
				* @returns {number} Returns the collection size.
				* @example
				*
				* _.size([1, 2, 3]);
				* // => 3
				*
				* _.size({ 'a': 1, 'b': 2 });
				* // => 2
				*
				* _.size('pebbles');
				* // => 7
				*/
				function size(collection) {
					if (collection == null) return 0;
					if (isArrayLike(collection)) return isString(collection) ? stringSize(collection) : collection.length;
					var tag = getTag(collection);
					if (tag == mapTag || tag == setTag) return collection.size;
					return baseKeys(collection).length;
				}
				/**
				* Checks if `predicate` returns truthy for **any** element of `collection`.
				* Iteration is stopped once `predicate` returns truthy. The predicate is
				* invoked with three arguments: (value, index|key, collection).
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {boolean} Returns `true` if any element passes the predicate check,
				*  else `false`.
				* @example
				*
				* _.some([null, 0, 'yes', false], Boolean);
				* // => true
				*
				* var users = [
				*   { 'user': 'barney', 'active': true },
				*   { 'user': 'fred',   'active': false }
				* ];
				*
				* // The `_.matches` iteratee shorthand.
				* _.some(users, { 'user': 'barney', 'active': false });
				* // => false
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.some(users, ['active', false]);
				* // => true
				*
				* // The `_.property` iteratee shorthand.
				* _.some(users, 'active');
				* // => true
				*/
				function some(collection, predicate, guard) {
					var func = isArray(collection) ? arraySome : baseSome;
					if (guard && isIterateeCall(collection, predicate, guard)) predicate = undefined;
					return func(collection, getIteratee(predicate, 3));
				}
				/**
				* Creates an array of elements, sorted in ascending order by the results of
				* running each element in a collection thru each iteratee. This method
				* performs a stable sort, that is, it preserves the original sort order of
				* equal elements. The iteratees are invoked with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Collection
				* @param {Array|Object} collection The collection to iterate over.
				* @param {...(Function|Function[])} [iteratees=[_.identity]]
				*  The iteratees to sort by.
				* @returns {Array} Returns the new sorted array.
				* @example
				*
				* var users = [
				*   { 'user': 'fred',   'age': 48 },
				*   { 'user': 'barney', 'age': 36 },
				*   { 'user': 'fred',   'age': 30 },
				*   { 'user': 'barney', 'age': 34 }
				* ];
				*
				* _.sortBy(users, [function(o) { return o.user; }]);
				* // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
				*
				* _.sortBy(users, ['user', 'age']);
				* // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
				*/
				var sortBy = baseRest(function(collection, iteratees) {
					if (collection == null) return [];
					var length = iteratees.length;
					if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) iteratees = [];
					else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) iteratees = [iteratees[0]];
					return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
				});
				/**
				* Gets the timestamp of the number of milliseconds that have elapsed since
				* the Unix epoch (1 January 1970 00:00:00 UTC).
				*
				* @static
				* @memberOf _
				* @since 2.4.0
				* @category Date
				* @returns {number} Returns the timestamp.
				* @example
				*
				* _.defer(function(stamp) {
				*   console.log(_.now() - stamp);
				* }, _.now());
				* // => Logs the number of milliseconds it took for the deferred invocation.
				*/
				var now = ctxNow || function() {
					return root.Date.now();
				};
				/**
				* The opposite of `_.before`; this method creates a function that invokes
				* `func` once it's called `n` or more times.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Function
				* @param {number} n The number of calls before `func` is invoked.
				* @param {Function} func The function to restrict.
				* @returns {Function} Returns the new restricted function.
				* @example
				*
				* var saves = ['profile', 'settings'];
				*
				* var done = _.after(saves.length, function() {
				*   console.log('done saving!');
				* });
				*
				* _.forEach(saves, function(type) {
				*   asyncSave({ 'type': type, 'complete': done });
				* });
				* // => Logs 'done saving!' after the two async saves have completed.
				*/
				function after(n, func) {
					if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
					n = toInteger(n);
					return function() {
						if (--n < 1) return func.apply(this, arguments);
					};
				}
				/**
				* Creates a function that invokes `func`, with up to `n` arguments,
				* ignoring any additional arguments.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Function
				* @param {Function} func The function to cap arguments for.
				* @param {number} [n=func.length] The arity cap.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {Function} Returns the new capped function.
				* @example
				*
				* _.map(['6', '8', '10'], _.ary(parseInt, 1));
				* // => [6, 8, 10]
				*/
				function ary(func, n, guard) {
					n = guard ? undefined : n;
					n = func && n == null ? func.length : n;
					return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
				}
				/**
				* Creates a function that invokes `func`, with the `this` binding and arguments
				* of the created function, while it's called less than `n` times. Subsequent
				* calls to the created function return the result of the last `func` invocation.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Function
				* @param {number} n The number of calls at which `func` is no longer invoked.
				* @param {Function} func The function to restrict.
				* @returns {Function} Returns the new restricted function.
				* @example
				*
				* jQuery(element).on('click', _.before(5, addContactToList));
				* // => Allows adding up to 4 contacts to the list.
				*/
				function before(n, func) {
					var result;
					if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
					n = toInteger(n);
					return function() {
						if (--n > 0) result = func.apply(this, arguments);
						if (n <= 1) func = undefined;
						return result;
					};
				}
				/**
				* Creates a function that invokes `func` with the `this` binding of `thisArg`
				* and `partials` prepended to the arguments it receives.
				*
				* The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
				* may be used as a placeholder for partially applied arguments.
				*
				* **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
				* property of bound functions.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Function
				* @param {Function} func The function to bind.
				* @param {*} thisArg The `this` binding of `func`.
				* @param {...*} [partials] The arguments to be partially applied.
				* @returns {Function} Returns the new bound function.
				* @example
				*
				* function greet(greeting, punctuation) {
				*   return greeting + ' ' + this.user + punctuation;
				* }
				*
				* var object = { 'user': 'fred' };
				*
				* var bound = _.bind(greet, object, 'hi');
				* bound('!');
				* // => 'hi fred!'
				*
				* // Bound with placeholders.
				* var bound = _.bind(greet, object, _, '!');
				* bound('hi');
				* // => 'hi fred!'
				*/
				var bind = baseRest(function(func, thisArg, partials) {
					var bitmask = WRAP_BIND_FLAG;
					if (partials.length) {
						var holders = replaceHolders(partials, getHolder(bind));
						bitmask |= WRAP_PARTIAL_FLAG;
					}
					return createWrap(func, bitmask, thisArg, partials, holders);
				});
				/**
				* Creates a function that invokes the method at `object[key]` with `partials`
				* prepended to the arguments it receives.
				*
				* This method differs from `_.bind` by allowing bound functions to reference
				* methods that may be redefined or don't yet exist. See
				* [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
				* for more details.
				*
				* The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
				* builds, may be used as a placeholder for partially applied arguments.
				*
				* @static
				* @memberOf _
				* @since 0.10.0
				* @category Function
				* @param {Object} object The object to invoke the method on.
				* @param {string} key The key of the method.
				* @param {...*} [partials] The arguments to be partially applied.
				* @returns {Function} Returns the new bound function.
				* @example
				*
				* var object = {
				*   'user': 'fred',
				*   'greet': function(greeting, punctuation) {
				*     return greeting + ' ' + this.user + punctuation;
				*   }
				* };
				*
				* var bound = _.bindKey(object, 'greet', 'hi');
				* bound('!');
				* // => 'hi fred!'
				*
				* object.greet = function(greeting, punctuation) {
				*   return greeting + 'ya ' + this.user + punctuation;
				* };
				*
				* bound('!');
				* // => 'hiya fred!'
				*
				* // Bound with placeholders.
				* var bound = _.bindKey(object, 'greet', _, '!');
				* bound('hi');
				* // => 'hiya fred!'
				*/
				var bindKey = baseRest(function(object, key, partials) {
					var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
					if (partials.length) {
						var holders = replaceHolders(partials, getHolder(bindKey));
						bitmask |= WRAP_PARTIAL_FLAG;
					}
					return createWrap(key, bitmask, object, partials, holders);
				});
				/**
				* Creates a function that accepts arguments of `func` and either invokes
				* `func` returning its result, if at least `arity` number of arguments have
				* been provided, or returns a function that accepts the remaining `func`
				* arguments, and so on. The arity of `func` may be specified if `func.length`
				* is not sufficient.
				*
				* The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
				* may be used as a placeholder for provided arguments.
				*
				* **Note:** This method doesn't set the "length" property of curried functions.
				*
				* @static
				* @memberOf _
				* @since 2.0.0
				* @category Function
				* @param {Function} func The function to curry.
				* @param {number} [arity=func.length] The arity of `func`.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {Function} Returns the new curried function.
				* @example
				*
				* var abc = function(a, b, c) {
				*   return [a, b, c];
				* };
				*
				* var curried = _.curry(abc);
				*
				* curried(1)(2)(3);
				* // => [1, 2, 3]
				*
				* curried(1, 2)(3);
				* // => [1, 2, 3]
				*
				* curried(1, 2, 3);
				* // => [1, 2, 3]
				*
				* // Curried with placeholders.
				* curried(1)(_, 3)(2);
				* // => [1, 2, 3]
				*/
				function curry(func, arity, guard) {
					arity = guard ? undefined : arity;
					var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
					result.placeholder = curry.placeholder;
					return result;
				}
				/**
				* This method is like `_.curry` except that arguments are applied to `func`
				* in the manner of `_.partialRight` instead of `_.partial`.
				*
				* The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
				* builds, may be used as a placeholder for provided arguments.
				*
				* **Note:** This method doesn't set the "length" property of curried functions.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Function
				* @param {Function} func The function to curry.
				* @param {number} [arity=func.length] The arity of `func`.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {Function} Returns the new curried function.
				* @example
				*
				* var abc = function(a, b, c) {
				*   return [a, b, c];
				* };
				*
				* var curried = _.curryRight(abc);
				*
				* curried(3)(2)(1);
				* // => [1, 2, 3]
				*
				* curried(2, 3)(1);
				* // => [1, 2, 3]
				*
				* curried(1, 2, 3);
				* // => [1, 2, 3]
				*
				* // Curried with placeholders.
				* curried(3)(1, _)(2);
				* // => [1, 2, 3]
				*/
				function curryRight(func, arity, guard) {
					arity = guard ? undefined : arity;
					var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
					result.placeholder = curryRight.placeholder;
					return result;
				}
				/**
				* Creates a debounced function that delays invoking `func` until after `wait`
				* milliseconds have elapsed since the last time the debounced function was
				* invoked. The debounced function comes with a `cancel` method to cancel
				* delayed `func` invocations and a `flush` method to immediately invoke them.
				* Provide `options` to indicate whether `func` should be invoked on the
				* leading and/or trailing edge of the `wait` timeout. The `func` is invoked
				* with the last arguments provided to the debounced function. Subsequent
				* calls to the debounced function return the result of the last `func`
				* invocation.
				*
				* **Note:** If `leading` and `trailing` options are `true`, `func` is
				* invoked on the trailing edge of the timeout only if the debounced function
				* is invoked more than once during the `wait` timeout.
				*
				* If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
				* until to the next tick, similar to `setTimeout` with a timeout of `0`.
				*
				* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
				* for details over the differences between `_.debounce` and `_.throttle`.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Function
				* @param {Function} func The function to debounce.
				* @param {number} [wait=0] The number of milliseconds to delay.
				* @param {Object} [options={}] The options object.
				* @param {boolean} [options.leading=false]
				*  Specify invoking on the leading edge of the timeout.
				* @param {number} [options.maxWait]
				*  The maximum time `func` is allowed to be delayed before it's invoked.
				* @param {boolean} [options.trailing=true]
				*  Specify invoking on the trailing edge of the timeout.
				* @returns {Function} Returns the new debounced function.
				* @example
				*
				* // Avoid costly calculations while the window size is in flux.
				* jQuery(window).on('resize', _.debounce(calculateLayout, 150));
				*
				* // Invoke `sendMail` when clicked, debouncing subsequent calls.
				* jQuery(element).on('click', _.debounce(sendMail, 300, {
				*   'leading': true,
				*   'trailing': false
				* }));
				*
				* // Ensure `batchLog` is invoked once after 1 second of debounced calls.
				* var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
				* var source = new EventSource('/stream');
				* jQuery(source).on('message', debounced);
				*
				* // Cancel the trailing debounced invocation.
				* jQuery(window).on('popstate', debounced.cancel);
				*/
				function debounce(func, wait, options) {
					var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
					if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
					wait = toNumber(wait) || 0;
					if (isObject(options)) {
						leading = !!options.leading;
						maxing = "maxWait" in options;
						maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
						trailing = "trailing" in options ? !!options.trailing : trailing;
					}
					function invokeFunc(time) {
						var args = lastArgs, thisArg = lastThis;
						lastArgs = lastThis = undefined;
						lastInvokeTime = time;
						result = func.apply(thisArg, args);
						return result;
					}
					function leadingEdge(time) {
						lastInvokeTime = time;
						timerId = setTimeout(timerExpired, wait);
						return leading ? invokeFunc(time) : result;
					}
					function remainingWait(time) {
						var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
						return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
					}
					function shouldInvoke(time) {
						var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
						return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
					}
					function timerExpired() {
						var time = now();
						if (shouldInvoke(time)) return trailingEdge(time);
						timerId = setTimeout(timerExpired, remainingWait(time));
					}
					function trailingEdge(time) {
						timerId = undefined;
						if (trailing && lastArgs) return invokeFunc(time);
						lastArgs = lastThis = undefined;
						return result;
					}
					function cancel() {
						if (timerId !== undefined) clearTimeout(timerId);
						lastInvokeTime = 0;
						lastArgs = lastCallTime = lastThis = timerId = undefined;
					}
					function flush() {
						return timerId === undefined ? result : trailingEdge(now());
					}
					function debounced() {
						var time = now(), isInvoking = shouldInvoke(time);
						lastArgs = arguments;
						lastThis = this;
						lastCallTime = time;
						if (isInvoking) {
							if (timerId === undefined) return leadingEdge(lastCallTime);
							if (maxing) {
								clearTimeout(timerId);
								timerId = setTimeout(timerExpired, wait);
								return invokeFunc(lastCallTime);
							}
						}
						if (timerId === undefined) timerId = setTimeout(timerExpired, wait);
						return result;
					}
					debounced.cancel = cancel;
					debounced.flush = flush;
					return debounced;
				}
				/**
				* Defers invoking the `func` until the current call stack has cleared. Any
				* additional arguments are provided to `func` when it's invoked.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Function
				* @param {Function} func The function to defer.
				* @param {...*} [args] The arguments to invoke `func` with.
				* @returns {number} Returns the timer id.
				* @example
				*
				* _.defer(function(text) {
				*   console.log(text);
				* }, 'deferred');
				* // => Logs 'deferred' after one millisecond.
				*/
				var defer = baseRest(function(func, args) {
					return baseDelay(func, 1, args);
				});
				/**
				* Invokes `func` after `wait` milliseconds. Any additional arguments are
				* provided to `func` when it's invoked.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Function
				* @param {Function} func The function to delay.
				* @param {number} wait The number of milliseconds to delay invocation.
				* @param {...*} [args] The arguments to invoke `func` with.
				* @returns {number} Returns the timer id.
				* @example
				*
				* _.delay(function(text) {
				*   console.log(text);
				* }, 1000, 'later');
				* // => Logs 'later' after one second.
				*/
				var delay = baseRest(function(func, wait, args) {
					return baseDelay(func, toNumber(wait) || 0, args);
				});
				/**
				* Creates a function that invokes `func` with arguments reversed.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Function
				* @param {Function} func The function to flip arguments for.
				* @returns {Function} Returns the new flipped function.
				* @example
				*
				* var flipped = _.flip(function() {
				*   return _.toArray(arguments);
				* });
				*
				* flipped('a', 'b', 'c', 'd');
				* // => ['d', 'c', 'b', 'a']
				*/
				function flip(func) {
					return createWrap(func, WRAP_FLIP_FLAG);
				}
				/**
				* Creates a function that memoizes the result of `func`. If `resolver` is
				* provided, it determines the cache key for storing the result based on the
				* arguments provided to the memoized function. By default, the first argument
				* provided to the memoized function is used as the map cache key. The `func`
				* is invoked with the `this` binding of the memoized function.
				*
				* **Note:** The cache is exposed as the `cache` property on the memoized
				* function. Its creation may be customized by replacing the `_.memoize.Cache`
				* constructor with one whose instances implement the
				* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
				* method interface of `clear`, `delete`, `get`, `has`, and `set`.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Function
				* @param {Function} func The function to have its output memoized.
				* @param {Function} [resolver] The function to resolve the cache key.
				* @returns {Function} Returns the new memoized function.
				* @example
				*
				* var object = { 'a': 1, 'b': 2 };
				* var other = { 'c': 3, 'd': 4 };
				*
				* var values = _.memoize(_.values);
				* values(object);
				* // => [1, 2]
				*
				* values(other);
				* // => [3, 4]
				*
				* object.a = 2;
				* values(object);
				* // => [1, 2]
				*
				* // Modify the result cache.
				* values.cache.set(object, ['a', 'b']);
				* values(object);
				* // => ['a', 'b']
				*
				* // Replace `_.memoize.Cache`.
				* _.memoize.Cache = WeakMap;
				*/
				function memoize(func, resolver) {
					if (typeof func != "function" || resolver != null && typeof resolver != "function") throw new TypeError(FUNC_ERROR_TEXT);
					var memoized = function() {
						var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
						if (cache.has(key)) return cache.get(key);
						var result = func.apply(this, args);
						memoized.cache = cache.set(key, result) || cache;
						return result;
					};
					memoized.cache = new (memoize.Cache || MapCache)();
					return memoized;
				}
				memoize.Cache = MapCache;
				/**
				* Creates a function that negates the result of the predicate `func`. The
				* `func` predicate is invoked with the `this` binding and arguments of the
				* created function.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Function
				* @param {Function} predicate The predicate to negate.
				* @returns {Function} Returns the new negated function.
				* @example
				*
				* function isEven(n) {
				*   return n % 2 == 0;
				* }
				*
				* _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
				* // => [1, 3, 5]
				*/
				function negate(predicate) {
					if (typeof predicate != "function") throw new TypeError(FUNC_ERROR_TEXT);
					return function() {
						var args = arguments;
						switch (args.length) {
							case 0: return !predicate.call(this);
							case 1: return !predicate.call(this, args[0]);
							case 2: return !predicate.call(this, args[0], args[1]);
							case 3: return !predicate.call(this, args[0], args[1], args[2]);
						}
						return !predicate.apply(this, args);
					};
				}
				/**
				* Creates a function that is restricted to invoking `func` once. Repeat calls
				* to the function return the value of the first invocation. The `func` is
				* invoked with the `this` binding and arguments of the created function.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Function
				* @param {Function} func The function to restrict.
				* @returns {Function} Returns the new restricted function.
				* @example
				*
				* var initialize = _.once(createApplication);
				* initialize();
				* initialize();
				* // => `createApplication` is invoked once
				*/
				function once(func) {
					return before(2, func);
				}
				/**
				* Creates a function that invokes `func` with its arguments transformed.
				*
				* @static
				* @since 4.0.0
				* @memberOf _
				* @category Function
				* @param {Function} func The function to wrap.
				* @param {...(Function|Function[])} [transforms=[_.identity]]
				*  The argument transforms.
				* @returns {Function} Returns the new function.
				* @example
				*
				* function doubled(n) {
				*   return n * 2;
				* }
				*
				* function square(n) {
				*   return n * n;
				* }
				*
				* var func = _.overArgs(function(x, y) {
				*   return [x, y];
				* }, [square, doubled]);
				*
				* func(9, 3);
				* // => [81, 6]
				*
				* func(10, 5);
				* // => [100, 10]
				*/
				var overArgs = castRest(function(func, transforms) {
					transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
					var funcsLength = transforms.length;
					return baseRest(function(args) {
						var index = -1, length = nativeMin(args.length, funcsLength);
						while (++index < length) args[index] = transforms[index].call(this, args[index]);
						return apply(func, this, args);
					});
				});
				/**
				* Creates a function that invokes `func` with `partials` prepended to the
				* arguments it receives. This method is like `_.bind` except it does **not**
				* alter the `this` binding.
				*
				* The `_.partial.placeholder` value, which defaults to `_` in monolithic
				* builds, may be used as a placeholder for partially applied arguments.
				*
				* **Note:** This method doesn't set the "length" property of partially
				* applied functions.
				*
				* @static
				* @memberOf _
				* @since 0.2.0
				* @category Function
				* @param {Function} func The function to partially apply arguments to.
				* @param {...*} [partials] The arguments to be partially applied.
				* @returns {Function} Returns the new partially applied function.
				* @example
				*
				* function greet(greeting, name) {
				*   return greeting + ' ' + name;
				* }
				*
				* var sayHelloTo = _.partial(greet, 'hello');
				* sayHelloTo('fred');
				* // => 'hello fred'
				*
				* // Partially applied with placeholders.
				* var greetFred = _.partial(greet, _, 'fred');
				* greetFred('hi');
				* // => 'hi fred'
				*/
				var partial = baseRest(function(func, partials) {
					return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, replaceHolders(partials, getHolder(partial)));
				});
				/**
				* This method is like `_.partial` except that partially applied arguments
				* are appended to the arguments it receives.
				*
				* The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
				* builds, may be used as a placeholder for partially applied arguments.
				*
				* **Note:** This method doesn't set the "length" property of partially
				* applied functions.
				*
				* @static
				* @memberOf _
				* @since 1.0.0
				* @category Function
				* @param {Function} func The function to partially apply arguments to.
				* @param {...*} [partials] The arguments to be partially applied.
				* @returns {Function} Returns the new partially applied function.
				* @example
				*
				* function greet(greeting, name) {
				*   return greeting + ' ' + name;
				* }
				*
				* var greetFred = _.partialRight(greet, 'fred');
				* greetFred('hi');
				* // => 'hi fred'
				*
				* // Partially applied with placeholders.
				* var sayHelloTo = _.partialRight(greet, 'hello', _);
				* sayHelloTo('fred');
				* // => 'hello fred'
				*/
				var partialRight = baseRest(function(func, partials) {
					return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, replaceHolders(partials, getHolder(partialRight)));
				});
				/**
				* Creates a function that invokes `func` with arguments arranged according
				* to the specified `indexes` where the argument value at the first index is
				* provided as the first argument, the argument value at the second index is
				* provided as the second argument, and so on.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Function
				* @param {Function} func The function to rearrange arguments for.
				* @param {...(number|number[])} indexes The arranged argument indexes.
				* @returns {Function} Returns the new function.
				* @example
				*
				* var rearged = _.rearg(function(a, b, c) {
				*   return [a, b, c];
				* }, [2, 0, 1]);
				*
				* rearged('b', 'c', 'a')
				* // => ['a', 'b', 'c']
				*/
				var rearg = flatRest(function(func, indexes) {
					return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
				});
				/**
				* Creates a function that invokes `func` with the `this` binding of the
				* created function and arguments from `start` and beyond provided as
				* an array.
				*
				* **Note:** This method is based on the
				* [rest parameter](https://mdn.io/rest_parameters).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Function
				* @param {Function} func The function to apply a rest parameter to.
				* @param {number} [start=func.length-1] The start position of the rest parameter.
				* @returns {Function} Returns the new function.
				* @example
				*
				* var say = _.rest(function(what, names) {
				*   return what + ' ' + _.initial(names).join(', ') +
				*     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
				* });
				*
				* say('hello', 'fred', 'barney', 'pebbles');
				* // => 'hello fred, barney, & pebbles'
				*/
				function rest(func, start) {
					if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
					start = start === undefined ? start : toInteger(start);
					return baseRest(func, start);
				}
				/**
				* Creates a function that invokes `func` with the `this` binding of the
				* create function and an array of arguments much like
				* [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
				*
				* **Note:** This method is based on the
				* [spread operator](https://mdn.io/spread_operator).
				*
				* @static
				* @memberOf _
				* @since 3.2.0
				* @category Function
				* @param {Function} func The function to spread arguments over.
				* @param {number} [start=0] The start position of the spread.
				* @returns {Function} Returns the new function.
				* @example
				*
				* var say = _.spread(function(who, what) {
				*   return who + ' says ' + what;
				* });
				*
				* say(['fred', 'hello']);
				* // => 'fred says hello'
				*
				* var numbers = Promise.all([
				*   Promise.resolve(40),
				*   Promise.resolve(36)
				* ]);
				*
				* numbers.then(_.spread(function(x, y) {
				*   return x + y;
				* }));
				* // => a Promise of 76
				*/
				function spread(func, start) {
					if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
					start = start == null ? 0 : nativeMax(toInteger(start), 0);
					return baseRest(function(args) {
						var array = args[start], otherArgs = castSlice(args, 0, start);
						if (array) arrayPush(otherArgs, array);
						return apply(func, this, otherArgs);
					});
				}
				/**
				* Creates a throttled function that only invokes `func` at most once per
				* every `wait` milliseconds. The throttled function comes with a `cancel`
				* method to cancel delayed `func` invocations and a `flush` method to
				* immediately invoke them. Provide `options` to indicate whether `func`
				* should be invoked on the leading and/or trailing edge of the `wait`
				* timeout. The `func` is invoked with the last arguments provided to the
				* throttled function. Subsequent calls to the throttled function return the
				* result of the last `func` invocation.
				*
				* **Note:** If `leading` and `trailing` options are `true`, `func` is
				* invoked on the trailing edge of the timeout only if the throttled function
				* is invoked more than once during the `wait` timeout.
				*
				* If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
				* until to the next tick, similar to `setTimeout` with a timeout of `0`.
				*
				* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
				* for details over the differences between `_.throttle` and `_.debounce`.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Function
				* @param {Function} func The function to throttle.
				* @param {number} [wait=0] The number of milliseconds to throttle invocations to.
				* @param {Object} [options={}] The options object.
				* @param {boolean} [options.leading=true]
				*  Specify invoking on the leading edge of the timeout.
				* @param {boolean} [options.trailing=true]
				*  Specify invoking on the trailing edge of the timeout.
				* @returns {Function} Returns the new throttled function.
				* @example
				*
				* // Avoid excessively updating the position while scrolling.
				* jQuery(window).on('scroll', _.throttle(updatePosition, 100));
				*
				* // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
				* var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
				* jQuery(element).on('click', throttled);
				*
				* // Cancel the trailing throttled invocation.
				* jQuery(window).on('popstate', throttled.cancel);
				*/
				function throttle(func, wait, options) {
					var leading = true, trailing = true;
					if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
					if (isObject(options)) {
						leading = "leading" in options ? !!options.leading : leading;
						trailing = "trailing" in options ? !!options.trailing : trailing;
					}
					return debounce(func, wait, {
						"leading": leading,
						"maxWait": wait,
						"trailing": trailing
					});
				}
				/**
				* Creates a function that accepts up to one argument, ignoring any
				* additional arguments.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Function
				* @param {Function} func The function to cap arguments for.
				* @returns {Function} Returns the new capped function.
				* @example
				*
				* _.map(['6', '8', '10'], _.unary(parseInt));
				* // => [6, 8, 10]
				*/
				function unary(func) {
					return ary(func, 1);
				}
				/**
				* Creates a function that provides `value` to `wrapper` as its first
				* argument. Any additional arguments provided to the function are appended
				* to those provided to the `wrapper`. The wrapper is invoked with the `this`
				* binding of the created function.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Function
				* @param {*} value The value to wrap.
				* @param {Function} [wrapper=identity] The wrapper function.
				* @returns {Function} Returns the new function.
				* @example
				*
				* var p = _.wrap(_.escape, function(func, text) {
				*   return '<p>' + func(text) + '</p>';
				* });
				*
				* p('fred, barney, & pebbles');
				* // => '<p>fred, barney, &amp; pebbles</p>'
				*/
				function wrap(value, wrapper) {
					return partial(castFunction(wrapper), value);
				}
				/**
				* Casts `value` as an array if it's not one.
				*
				* @static
				* @memberOf _
				* @since 4.4.0
				* @category Lang
				* @param {*} value The value to inspect.
				* @returns {Array} Returns the cast array.
				* @example
				*
				* _.castArray(1);
				* // => [1]
				*
				* _.castArray({ 'a': 1 });
				* // => [{ 'a': 1 }]
				*
				* _.castArray('abc');
				* // => ['abc']
				*
				* _.castArray(null);
				* // => [null]
				*
				* _.castArray(undefined);
				* // => [undefined]
				*
				* _.castArray();
				* // => []
				*
				* var array = [1, 2, 3];
				* console.log(_.castArray(array) === array);
				* // => true
				*/
				function castArray() {
					if (!arguments.length) return [];
					var value = arguments[0];
					return isArray(value) ? value : [value];
				}
				/**
				* Creates a shallow clone of `value`.
				*
				* **Note:** This method is loosely based on the
				* [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
				* and supports cloning arrays, array buffers, booleans, date objects, maps,
				* numbers, `Object` objects, regexes, sets, strings, symbols, and typed
				* arrays. The own enumerable properties of `arguments` objects are cloned
				* as plain objects. An empty object is returned for uncloneable values such
				* as error objects, functions, DOM nodes, and WeakMaps.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to clone.
				* @returns {*} Returns the cloned value.
				* @see _.cloneDeep
				* @example
				*
				* var objects = [{ 'a': 1 }, { 'b': 2 }];
				*
				* var shallow = _.clone(objects);
				* console.log(shallow[0] === objects[0]);
				* // => true
				*/
				function clone(value) {
					return baseClone(value, CLONE_SYMBOLS_FLAG);
				}
				/**
				* This method is like `_.clone` except that it accepts `customizer` which
				* is invoked to produce the cloned value. If `customizer` returns `undefined`,
				* cloning is handled by the method instead. The `customizer` is invoked with
				* up to four arguments; (value [, index|key, object, stack]).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to clone.
				* @param {Function} [customizer] The function to customize cloning.
				* @returns {*} Returns the cloned value.
				* @see _.cloneDeepWith
				* @example
				*
				* function customizer(value) {
				*   if (_.isElement(value)) {
				*     return value.cloneNode(false);
				*   }
				* }
				*
				* var el = _.cloneWith(document.body, customizer);
				*
				* console.log(el === document.body);
				* // => false
				* console.log(el.nodeName);
				* // => 'BODY'
				* console.log(el.childNodes.length);
				* // => 0
				*/
				function cloneWith(value, customizer) {
					customizer = typeof customizer == "function" ? customizer : undefined;
					return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
				}
				/**
				* This method is like `_.clone` except that it recursively clones `value`.
				*
				* @static
				* @memberOf _
				* @since 1.0.0
				* @category Lang
				* @param {*} value The value to recursively clone.
				* @returns {*} Returns the deep cloned value.
				* @see _.clone
				* @example
				*
				* var objects = [{ 'a': 1 }, { 'b': 2 }];
				*
				* var deep = _.cloneDeep(objects);
				* console.log(deep[0] === objects[0]);
				* // => false
				*/
				function cloneDeep(value) {
					return baseClone(value, 5);
				}
				/**
				* This method is like `_.cloneWith` except that it recursively clones `value`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to recursively clone.
				* @param {Function} [customizer] The function to customize cloning.
				* @returns {*} Returns the deep cloned value.
				* @see _.cloneWith
				* @example
				*
				* function customizer(value) {
				*   if (_.isElement(value)) {
				*     return value.cloneNode(true);
				*   }
				* }
				*
				* var el = _.cloneDeepWith(document.body, customizer);
				*
				* console.log(el === document.body);
				* // => false
				* console.log(el.nodeName);
				* // => 'BODY'
				* console.log(el.childNodes.length);
				* // => 20
				*/
				function cloneDeepWith(value, customizer) {
					customizer = typeof customizer == "function" ? customizer : undefined;
					return baseClone(value, 5, customizer);
				}
				/**
				* Checks if `object` conforms to `source` by invoking the predicate
				* properties of `source` with the corresponding property values of `object`.
				*
				* **Note:** This method is equivalent to `_.conforms` when `source` is
				* partially applied.
				*
				* @static
				* @memberOf _
				* @since 4.14.0
				* @category Lang
				* @param {Object} object The object to inspect.
				* @param {Object} source The object of property predicates to conform to.
				* @returns {boolean} Returns `true` if `object` conforms, else `false`.
				* @example
				*
				* var object = { 'a': 1, 'b': 2 };
				*
				* _.conformsTo(object, { 'b': function(n) { return n > 1; } });
				* // => true
				*
				* _.conformsTo(object, { 'b': function(n) { return n > 2; } });
				* // => false
				*/
				function conformsTo(object, source) {
					return source == null || baseConformsTo(object, source, keys(source));
				}
				/**
				* Performs a
				* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
				* comparison between two values to determine if they are equivalent.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to compare.
				* @param {*} other The other value to compare.
				* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
				* @example
				*
				* var object = { 'a': 1 };
				* var other = { 'a': 1 };
				*
				* _.eq(object, object);
				* // => true
				*
				* _.eq(object, other);
				* // => false
				*
				* _.eq('a', 'a');
				* // => true
				*
				* _.eq('a', Object('a'));
				* // => false
				*
				* _.eq(NaN, NaN);
				* // => true
				*/
				function eq(value, other) {
					return value === other || value !== value && other !== other;
				}
				/**
				* Checks if `value` is greater than `other`.
				*
				* @static
				* @memberOf _
				* @since 3.9.0
				* @category Lang
				* @param {*} value The value to compare.
				* @param {*} other The other value to compare.
				* @returns {boolean} Returns `true` if `value` is greater than `other`,
				*  else `false`.
				* @see _.lt
				* @example
				*
				* _.gt(3, 1);
				* // => true
				*
				* _.gt(3, 3);
				* // => false
				*
				* _.gt(1, 3);
				* // => false
				*/
				var gt = createRelationalOperation(baseGt);
				/**
				* Checks if `value` is greater than or equal to `other`.
				*
				* @static
				* @memberOf _
				* @since 3.9.0
				* @category Lang
				* @param {*} value The value to compare.
				* @param {*} other The other value to compare.
				* @returns {boolean} Returns `true` if `value` is greater than or equal to
				*  `other`, else `false`.
				* @see _.lte
				* @example
				*
				* _.gte(3, 1);
				* // => true
				*
				* _.gte(3, 3);
				* // => true
				*
				* _.gte(1, 3);
				* // => false
				*/
				var gte = createRelationalOperation(function(value, other) {
					return value >= other;
				});
				/**
				* Checks if `value` is likely an `arguments` object.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is an `arguments` object,
				*  else `false`.
				* @example
				*
				* _.isArguments(function() { return arguments; }());
				* // => true
				*
				* _.isArguments([1, 2, 3]);
				* // => false
				*/
				var isArguments = baseIsArguments(function() {
					return arguments;
				}()) ? baseIsArguments : function(value) {
					return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
				};
				/**
				* Checks if `value` is classified as an `Array` object.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is an array, else `false`.
				* @example
				*
				* _.isArray([1, 2, 3]);
				* // => true
				*
				* _.isArray(document.body.children);
				* // => false
				*
				* _.isArray('abc');
				* // => false
				*
				* _.isArray(_.noop);
				* // => false
				*/
				var isArray = Array.isArray;
				/**
				* Checks if `value` is classified as an `ArrayBuffer` object.
				*
				* @static
				* @memberOf _
				* @since 4.3.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
				* @example
				*
				* _.isArrayBuffer(new ArrayBuffer(2));
				* // => true
				*
				* _.isArrayBuffer(new Array(2));
				* // => false
				*/
				var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
				/**
				* Checks if `value` is array-like. A value is considered array-like if it's
				* not a function and has a `value.length` that's an integer greater than or
				* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
				* @example
				*
				* _.isArrayLike([1, 2, 3]);
				* // => true
				*
				* _.isArrayLike(document.body.children);
				* // => true
				*
				* _.isArrayLike('abc');
				* // => true
				*
				* _.isArrayLike(_.noop);
				* // => false
				*/
				function isArrayLike(value) {
					return value != null && isLength(value.length) && !isFunction(value);
				}
				/**
				* This method is like `_.isArrayLike` except that it also checks if `value`
				* is an object.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is an array-like object,
				*  else `false`.
				* @example
				*
				* _.isArrayLikeObject([1, 2, 3]);
				* // => true
				*
				* _.isArrayLikeObject(document.body.children);
				* // => true
				*
				* _.isArrayLikeObject('abc');
				* // => false
				*
				* _.isArrayLikeObject(_.noop);
				* // => false
				*/
				function isArrayLikeObject(value) {
					return isObjectLike(value) && isArrayLike(value);
				}
				/**
				* Checks if `value` is classified as a boolean primitive or object.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
				* @example
				*
				* _.isBoolean(false);
				* // => true
				*
				* _.isBoolean(null);
				* // => false
				*/
				function isBoolean(value) {
					return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
				}
				/**
				* Checks if `value` is a buffer.
				*
				* @static
				* @memberOf _
				* @since 4.3.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
				* @example
				*
				* _.isBuffer(new Buffer(2));
				* // => true
				*
				* _.isBuffer(new Uint8Array(2));
				* // => false
				*/
				var isBuffer = nativeIsBuffer || stubFalse;
				/**
				* Checks if `value` is classified as a `Date` object.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a date object, else `false`.
				* @example
				*
				* _.isDate(new Date);
				* // => true
				*
				* _.isDate('Mon April 23 2012');
				* // => false
				*/
				var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
				/**
				* Checks if `value` is likely a DOM element.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
				* @example
				*
				* _.isElement(document.body);
				* // => true
				*
				* _.isElement('<body>');
				* // => false
				*/
				function isElement(value) {
					return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
				}
				/**
				* Checks if `value` is an empty object, collection, map, or set.
				*
				* Objects are considered empty if they have no own enumerable string keyed
				* properties.
				*
				* Array-like values such as `arguments` objects, arrays, buffers, strings, or
				* jQuery-like collections are considered empty if they have a `length` of `0`.
				* Similarly, maps and sets are considered empty if they have a `size` of `0`.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is empty, else `false`.
				* @example
				*
				* _.isEmpty(null);
				* // => true
				*
				* _.isEmpty(true);
				* // => true
				*
				* _.isEmpty(1);
				* // => true
				*
				* _.isEmpty([1, 2, 3]);
				* // => false
				*
				* _.isEmpty({ 'a': 1 });
				* // => false
				*/
				function isEmpty(value) {
					if (value == null) return true;
					if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) return !value.length;
					var tag = getTag(value);
					if (tag == mapTag || tag == setTag) return !value.size;
					if (isPrototype(value)) return !baseKeys(value).length;
					for (var key in value) if (hasOwnProperty.call(value, key)) return false;
					return true;
				}
				/**
				* Performs a deep comparison between two values to determine if they are
				* equivalent.
				*
				* **Note:** This method supports comparing arrays, array buffers, booleans,
				* date objects, error objects, maps, numbers, `Object` objects, regexes,
				* sets, strings, symbols, and typed arrays. `Object` objects are compared
				* by their own, not inherited, enumerable properties. Functions and DOM
				* nodes are compared by strict equality, i.e. `===`.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to compare.
				* @param {*} other The other value to compare.
				* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
				* @example
				*
				* var object = { 'a': 1 };
				* var other = { 'a': 1 };
				*
				* _.isEqual(object, other);
				* // => true
				*
				* object === other;
				* // => false
				*/
				function isEqual(value, other) {
					return baseIsEqual(value, other);
				}
				/**
				* This method is like `_.isEqual` except that it accepts `customizer` which
				* is invoked to compare values. If `customizer` returns `undefined`, comparisons
				* are handled by the method instead. The `customizer` is invoked with up to
				* six arguments: (objValue, othValue [, index|key, object, other, stack]).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to compare.
				* @param {*} other The other value to compare.
				* @param {Function} [customizer] The function to customize comparisons.
				* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
				* @example
				*
				* function isGreeting(value) {
				*   return /^h(?:i|ello)$/.test(value);
				* }
				*
				* function customizer(objValue, othValue) {
				*   if (isGreeting(objValue) && isGreeting(othValue)) {
				*     return true;
				*   }
				* }
				*
				* var array = ['hello', 'goodbye'];
				* var other = ['hi', 'goodbye'];
				*
				* _.isEqualWith(array, other, customizer);
				* // => true
				*/
				function isEqualWith(value, other, customizer) {
					customizer = typeof customizer == "function" ? customizer : undefined;
					var result = customizer ? customizer(value, other) : undefined;
					return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
				}
				/**
				* Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
				* `SyntaxError`, `TypeError`, or `URIError` object.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is an error object, else `false`.
				* @example
				*
				* _.isError(new Error);
				* // => true
				*
				* _.isError(Error);
				* // => false
				*/
				function isError(value) {
					if (!isObjectLike(value)) return false;
					var tag = baseGetTag(value);
					return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
				}
				/**
				* Checks if `value` is a finite primitive number.
				*
				* **Note:** This method is based on
				* [`Number.isFinite`](https://mdn.io/Number/isFinite).
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
				* @example
				*
				* _.isFinite(3);
				* // => true
				*
				* _.isFinite(Number.MIN_VALUE);
				* // => true
				*
				* _.isFinite(Infinity);
				* // => false
				*
				* _.isFinite('3');
				* // => false
				*/
				function isFinite(value) {
					return typeof value == "number" && nativeIsFinite(value);
				}
				/**
				* Checks if `value` is classified as a `Function` object.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a function, else `false`.
				* @example
				*
				* _.isFunction(_);
				* // => true
				*
				* _.isFunction(/abc/);
				* // => false
				*/
				function isFunction(value) {
					if (!isObject(value)) return false;
					var tag = baseGetTag(value);
					return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
				}
				/**
				* Checks if `value` is an integer.
				*
				* **Note:** This method is based on
				* [`Number.isInteger`](https://mdn.io/Number/isInteger).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is an integer, else `false`.
				* @example
				*
				* _.isInteger(3);
				* // => true
				*
				* _.isInteger(Number.MIN_VALUE);
				* // => false
				*
				* _.isInteger(Infinity);
				* // => false
				*
				* _.isInteger('3');
				* // => false
				*/
				function isInteger(value) {
					return typeof value == "number" && value == toInteger(value);
				}
				/**
				* Checks if `value` is a valid array-like length.
				*
				* **Note:** This method is loosely based on
				* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
				* @example
				*
				* _.isLength(3);
				* // => true
				*
				* _.isLength(Number.MIN_VALUE);
				* // => false
				*
				* _.isLength(Infinity);
				* // => false
				*
				* _.isLength('3');
				* // => false
				*/
				function isLength(value) {
					return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
				}
				/**
				* Checks if `value` is the
				* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
				* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is an object, else `false`.
				* @example
				*
				* _.isObject({});
				* // => true
				*
				* _.isObject([1, 2, 3]);
				* // => true
				*
				* _.isObject(_.noop);
				* // => true
				*
				* _.isObject(null);
				* // => false
				*/
				function isObject(value) {
					var type = typeof value;
					return value != null && (type == "object" || type == "function");
				}
				/**
				* Checks if `value` is object-like. A value is object-like if it's not `null`
				* and has a `typeof` result of "object".
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
				* @example
				*
				* _.isObjectLike({});
				* // => true
				*
				* _.isObjectLike([1, 2, 3]);
				* // => true
				*
				* _.isObjectLike(_.noop);
				* // => false
				*
				* _.isObjectLike(null);
				* // => false
				*/
				function isObjectLike(value) {
					return value != null && typeof value == "object";
				}
				/**
				* Checks if `value` is classified as a `Map` object.
				*
				* @static
				* @memberOf _
				* @since 4.3.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a map, else `false`.
				* @example
				*
				* _.isMap(new Map);
				* // => true
				*
				* _.isMap(new WeakMap);
				* // => false
				*/
				var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
				/**
				* Performs a partial deep comparison between `object` and `source` to
				* determine if `object` contains equivalent property values.
				*
				* **Note:** This method is equivalent to `_.matches` when `source` is
				* partially applied.
				*
				* Partial comparisons will match empty array and empty object `source`
				* values against any array or object value, respectively. See `_.isEqual`
				* for a list of supported value comparisons.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Lang
				* @param {Object} object The object to inspect.
				* @param {Object} source The object of property values to match.
				* @returns {boolean} Returns `true` if `object` is a match, else `false`.
				* @example
				*
				* var object = { 'a': 1, 'b': 2 };
				*
				* _.isMatch(object, { 'b': 2 });
				* // => true
				*
				* _.isMatch(object, { 'b': 1 });
				* // => false
				*/
				function isMatch(object, source) {
					return object === source || baseIsMatch(object, source, getMatchData(source));
				}
				/**
				* This method is like `_.isMatch` except that it accepts `customizer` which
				* is invoked to compare values. If `customizer` returns `undefined`, comparisons
				* are handled by the method instead. The `customizer` is invoked with five
				* arguments: (objValue, srcValue, index|key, object, source).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {Object} object The object to inspect.
				* @param {Object} source The object of property values to match.
				* @param {Function} [customizer] The function to customize comparisons.
				* @returns {boolean} Returns `true` if `object` is a match, else `false`.
				* @example
				*
				* function isGreeting(value) {
				*   return /^h(?:i|ello)$/.test(value);
				* }
				*
				* function customizer(objValue, srcValue) {
				*   if (isGreeting(objValue) && isGreeting(srcValue)) {
				*     return true;
				*   }
				* }
				*
				* var object = { 'greeting': 'hello' };
				* var source = { 'greeting': 'hi' };
				*
				* _.isMatchWith(object, source, customizer);
				* // => true
				*/
				function isMatchWith(object, source, customizer) {
					customizer = typeof customizer == "function" ? customizer : undefined;
					return baseIsMatch(object, source, getMatchData(source), customizer);
				}
				/**
				* Checks if `value` is `NaN`.
				*
				* **Note:** This method is based on
				* [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
				* global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
				* `undefined` and other non-number values.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
				* @example
				*
				* _.isNaN(NaN);
				* // => true
				*
				* _.isNaN(new Number(NaN));
				* // => true
				*
				* isNaN(undefined);
				* // => true
				*
				* _.isNaN(undefined);
				* // => false
				*/
				function isNaN(value) {
					return isNumber(value) && value != +value;
				}
				/**
				* Checks if `value` is a pristine native function.
				*
				* **Note:** This method can't reliably detect native functions in the presence
				* of the core-js package because core-js circumvents this kind of detection.
				* Despite multiple requests, the core-js maintainer has made it clear: any
				* attempt to fix the detection will be obstructed. As a result, we're left
				* with little choice but to throw an error. Unfortunately, this also affects
				* packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
				* which rely on core-js.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a native function,
				*  else `false`.
				* @example
				*
				* _.isNative(Array.prototype.push);
				* // => true
				*
				* _.isNative(_);
				* // => false
				*/
				function isNative(value) {
					if (isMaskable(value)) throw new Error(CORE_ERROR_TEXT);
					return baseIsNative(value);
				}
				/**
				* Checks if `value` is `null`.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is `null`, else `false`.
				* @example
				*
				* _.isNull(null);
				* // => true
				*
				* _.isNull(void 0);
				* // => false
				*/
				function isNull(value) {
					return value === null;
				}
				/**
				* Checks if `value` is `null` or `undefined`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is nullish, else `false`.
				* @example
				*
				* _.isNil(null);
				* // => true
				*
				* _.isNil(void 0);
				* // => true
				*
				* _.isNil(NaN);
				* // => false
				*/
				function isNil(value) {
					return value == null;
				}
				/**
				* Checks if `value` is classified as a `Number` primitive or object.
				*
				* **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
				* classified as numbers, use the `_.isFinite` method.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a number, else `false`.
				* @example
				*
				* _.isNumber(3);
				* // => true
				*
				* _.isNumber(Number.MIN_VALUE);
				* // => true
				*
				* _.isNumber(Infinity);
				* // => true
				*
				* _.isNumber('3');
				* // => false
				*/
				function isNumber(value) {
					return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
				}
				/**
				* Checks if `value` is a plain object, that is, an object created by the
				* `Object` constructor or one with a `[[Prototype]]` of `null`.
				*
				* @static
				* @memberOf _
				* @since 0.8.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				* }
				*
				* _.isPlainObject(new Foo);
				* // => false
				*
				* _.isPlainObject([1, 2, 3]);
				* // => false
				*
				* _.isPlainObject({ 'x': 0, 'y': 0 });
				* // => true
				*
				* _.isPlainObject(Object.create(null));
				* // => true
				*/
				function isPlainObject(value) {
					if (!isObjectLike(value) || baseGetTag(value) != objectTag) return false;
					var proto = getPrototype(value);
					if (proto === null) return true;
					var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
					return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
				}
				/**
				* Checks if `value` is classified as a `RegExp` object.
				*
				* @static
				* @memberOf _
				* @since 0.1.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
				* @example
				*
				* _.isRegExp(/abc/);
				* // => true
				*
				* _.isRegExp('/abc/');
				* // => false
				*/
				var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
				/**
				* Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
				* double precision number which isn't the result of a rounded unsafe integer.
				*
				* **Note:** This method is based on
				* [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
				* @example
				*
				* _.isSafeInteger(3);
				* // => true
				*
				* _.isSafeInteger(Number.MIN_VALUE);
				* // => false
				*
				* _.isSafeInteger(Infinity);
				* // => false
				*
				* _.isSafeInteger('3');
				* // => false
				*/
				function isSafeInteger(value) {
					return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
				}
				/**
				* Checks if `value` is classified as a `Set` object.
				*
				* @static
				* @memberOf _
				* @since 4.3.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a set, else `false`.
				* @example
				*
				* _.isSet(new Set);
				* // => true
				*
				* _.isSet(new WeakSet);
				* // => false
				*/
				var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
				/**
				* Checks if `value` is classified as a `String` primitive or object.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a string, else `false`.
				* @example
				*
				* _.isString('abc');
				* // => true
				*
				* _.isString(1);
				* // => false
				*/
				function isString(value) {
					return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
				}
				/**
				* Checks if `value` is classified as a `Symbol` primitive or object.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
				* @example
				*
				* _.isSymbol(Symbol.iterator);
				* // => true
				*
				* _.isSymbol('abc');
				* // => false
				*/
				function isSymbol(value) {
					return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
				}
				/**
				* Checks if `value` is classified as a typed array.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
				* @example
				*
				* _.isTypedArray(new Uint8Array);
				* // => true
				*
				* _.isTypedArray([]);
				* // => false
				*/
				var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
				/**
				* Checks if `value` is `undefined`.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
				* @example
				*
				* _.isUndefined(void 0);
				* // => true
				*
				* _.isUndefined(null);
				* // => false
				*/
				function isUndefined(value) {
					return value === undefined;
				}
				/**
				* Checks if `value` is classified as a `WeakMap` object.
				*
				* @static
				* @memberOf _
				* @since 4.3.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
				* @example
				*
				* _.isWeakMap(new WeakMap);
				* // => true
				*
				* _.isWeakMap(new Map);
				* // => false
				*/
				function isWeakMap(value) {
					return isObjectLike(value) && getTag(value) == weakMapTag;
				}
				/**
				* Checks if `value` is classified as a `WeakSet` object.
				*
				* @static
				* @memberOf _
				* @since 4.3.0
				* @category Lang
				* @param {*} value The value to check.
				* @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
				* @example
				*
				* _.isWeakSet(new WeakSet);
				* // => true
				*
				* _.isWeakSet(new Set);
				* // => false
				*/
				function isWeakSet(value) {
					return isObjectLike(value) && baseGetTag(value) == weakSetTag;
				}
				/**
				* Checks if `value` is less than `other`.
				*
				* @static
				* @memberOf _
				* @since 3.9.0
				* @category Lang
				* @param {*} value The value to compare.
				* @param {*} other The other value to compare.
				* @returns {boolean} Returns `true` if `value` is less than `other`,
				*  else `false`.
				* @see _.gt
				* @example
				*
				* _.lt(1, 3);
				* // => true
				*
				* _.lt(3, 3);
				* // => false
				*
				* _.lt(3, 1);
				* // => false
				*/
				var lt = createRelationalOperation(baseLt);
				/**
				* Checks if `value` is less than or equal to `other`.
				*
				* @static
				* @memberOf _
				* @since 3.9.0
				* @category Lang
				* @param {*} value The value to compare.
				* @param {*} other The other value to compare.
				* @returns {boolean} Returns `true` if `value` is less than or equal to
				*  `other`, else `false`.
				* @see _.gte
				* @example
				*
				* _.lte(1, 3);
				* // => true
				*
				* _.lte(3, 3);
				* // => true
				*
				* _.lte(3, 1);
				* // => false
				*/
				var lte = createRelationalOperation(function(value, other) {
					return value <= other;
				});
				/**
				* Converts `value` to an array.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Lang
				* @param {*} value The value to convert.
				* @returns {Array} Returns the converted array.
				* @example
				*
				* _.toArray({ 'a': 1, 'b': 2 });
				* // => [1, 2]
				*
				* _.toArray('abc');
				* // => ['a', 'b', 'c']
				*
				* _.toArray(1);
				* // => []
				*
				* _.toArray(null);
				* // => []
				*/
				function toArray(value) {
					if (!value) return [];
					if (isArrayLike(value)) return isString(value) ? stringToArray(value) : copyArray(value);
					if (symIterator && value[symIterator]) return iteratorToArray(value[symIterator]());
					var tag = getTag(value);
					return (tag == mapTag ? mapToArray : tag == setTag ? setToArray : values)(value);
				}
				/**
				* Converts `value` to a finite number.
				*
				* @static
				* @memberOf _
				* @since 4.12.0
				* @category Lang
				* @param {*} value The value to convert.
				* @returns {number} Returns the converted number.
				* @example
				*
				* _.toFinite(3.2);
				* // => 3.2
				*
				* _.toFinite(Number.MIN_VALUE);
				* // => 5e-324
				*
				* _.toFinite(Infinity);
				* // => 1.7976931348623157e+308
				*
				* _.toFinite('3.2');
				* // => 3.2
				*/
				function toFinite(value) {
					if (!value) return value === 0 ? value : 0;
					value = toNumber(value);
					if (value === INFINITY || value === -Infinity) return (value < 0 ? -1 : 1) * MAX_INTEGER;
					return value === value ? value : 0;
				}
				/**
				* Converts `value` to an integer.
				*
				* **Note:** This method is loosely based on
				* [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to convert.
				* @returns {number} Returns the converted integer.
				* @example
				*
				* _.toInteger(3.2);
				* // => 3
				*
				* _.toInteger(Number.MIN_VALUE);
				* // => 0
				*
				* _.toInteger(Infinity);
				* // => 1.7976931348623157e+308
				*
				* _.toInteger('3.2');
				* // => 3
				*/
				function toInteger(value) {
					var result = toFinite(value), remainder = result % 1;
					return result === result ? remainder ? result - remainder : result : 0;
				}
				/**
				* Converts `value` to an integer suitable for use as the length of an
				* array-like object.
				*
				* **Note:** This method is based on
				* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to convert.
				* @returns {number} Returns the converted integer.
				* @example
				*
				* _.toLength(3.2);
				* // => 3
				*
				* _.toLength(Number.MIN_VALUE);
				* // => 0
				*
				* _.toLength(Infinity);
				* // => 4294967295
				*
				* _.toLength('3.2');
				* // => 3
				*/
				function toLength(value) {
					return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
				}
				/**
				* Converts `value` to a number.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to process.
				* @returns {number} Returns the number.
				* @example
				*
				* _.toNumber(3.2);
				* // => 3.2
				*
				* _.toNumber(Number.MIN_VALUE);
				* // => 5e-324
				*
				* _.toNumber(Infinity);
				* // => Infinity
				*
				* _.toNumber('3.2');
				* // => 3.2
				*/
				function toNumber(value) {
					if (typeof value == "number") return value;
					if (isSymbol(value)) return NAN;
					if (isObject(value)) {
						var other = typeof value.valueOf == "function" ? value.valueOf() : value;
						value = isObject(other) ? other + "" : other;
					}
					if (typeof value != "string") return value === 0 ? value : +value;
					value = baseTrim(value);
					var isBinary = reIsBinary.test(value);
					return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
				}
				/**
				* Converts `value` to a plain object flattening inherited enumerable string
				* keyed properties of `value` to own properties of the plain object.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Lang
				* @param {*} value The value to convert.
				* @returns {Object} Returns the converted plain object.
				* @example
				*
				* function Foo() {
				*   this.b = 2;
				* }
				*
				* Foo.prototype.c = 3;
				*
				* _.assign({ 'a': 1 }, new Foo);
				* // => { 'a': 1, 'b': 2 }
				*
				* _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
				* // => { 'a': 1, 'b': 2, 'c': 3 }
				*/
				function toPlainObject(value) {
					return copyObject(value, keysIn(value));
				}
				/**
				* Converts `value` to a safe integer. A safe integer can be compared and
				* represented correctly.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to convert.
				* @returns {number} Returns the converted integer.
				* @example
				*
				* _.toSafeInteger(3.2);
				* // => 3
				*
				* _.toSafeInteger(Number.MIN_VALUE);
				* // => 0
				*
				* _.toSafeInteger(Infinity);
				* // => 9007199254740991
				*
				* _.toSafeInteger('3.2');
				* // => 3
				*/
				function toSafeInteger(value) {
					return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
				}
				/**
				* Converts `value` to a string. An empty string is returned for `null`
				* and `undefined` values. The sign of `-0` is preserved.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Lang
				* @param {*} value The value to convert.
				* @returns {string} Returns the converted string.
				* @example
				*
				* _.toString(null);
				* // => ''
				*
				* _.toString(-0);
				* // => '-0'
				*
				* _.toString([1, 2, 3]);
				* // => '1,2,3'
				*/
				function toString(value) {
					return value == null ? "" : baseToString(value);
				}
				/**
				* Assigns own enumerable string keyed properties of source objects to the
				* destination object. Source objects are applied from left to right.
				* Subsequent sources overwrite property assignments of previous sources.
				*
				* **Note:** This method mutates `object` and is loosely based on
				* [`Object.assign`](https://mdn.io/Object/assign).
				*
				* @static
				* @memberOf _
				* @since 0.10.0
				* @category Object
				* @param {Object} object The destination object.
				* @param {...Object} [sources] The source objects.
				* @returns {Object} Returns `object`.
				* @see _.assignIn
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				* }
				*
				* function Bar() {
				*   this.c = 3;
				* }
				*
				* Foo.prototype.b = 2;
				* Bar.prototype.d = 4;
				*
				* _.assign({ 'a': 0 }, new Foo, new Bar);
				* // => { 'a': 1, 'c': 3 }
				*/
				var assign = createAssigner(function(object, source) {
					if (isPrototype(source) || isArrayLike(source)) {
						copyObject(source, keys(source), object);
						return;
					}
					for (var key in source) if (hasOwnProperty.call(source, key)) assignValue(object, key, source[key]);
				});
				/**
				* This method is like `_.assign` except that it iterates over own and
				* inherited source properties.
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @alias extend
				* @category Object
				* @param {Object} object The destination object.
				* @param {...Object} [sources] The source objects.
				* @returns {Object} Returns `object`.
				* @see _.assign
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				* }
				*
				* function Bar() {
				*   this.c = 3;
				* }
				*
				* Foo.prototype.b = 2;
				* Bar.prototype.d = 4;
				*
				* _.assignIn({ 'a': 0 }, new Foo, new Bar);
				* // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
				*/
				var assignIn = createAssigner(function(object, source) {
					copyObject(source, keysIn(source), object);
				});
				/**
				* This method is like `_.assignIn` except that it accepts `customizer`
				* which is invoked to produce the assigned values. If `customizer` returns
				* `undefined`, assignment is handled by the method instead. The `customizer`
				* is invoked with five arguments: (objValue, srcValue, key, object, source).
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @alias extendWith
				* @category Object
				* @param {Object} object The destination object.
				* @param {...Object} sources The source objects.
				* @param {Function} [customizer] The function to customize assigned values.
				* @returns {Object} Returns `object`.
				* @see _.assignWith
				* @example
				*
				* function customizer(objValue, srcValue) {
				*   return _.isUndefined(objValue) ? srcValue : objValue;
				* }
				*
				* var defaults = _.partialRight(_.assignInWith, customizer);
				*
				* defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
				* // => { 'a': 1, 'b': 2 }
				*/
				var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
					copyObject(source, keysIn(source), object, customizer);
				});
				/**
				* This method is like `_.assign` except that it accepts `customizer`
				* which is invoked to produce the assigned values. If `customizer` returns
				* `undefined`, assignment is handled by the method instead. The `customizer`
				* is invoked with five arguments: (objValue, srcValue, key, object, source).
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Object
				* @param {Object} object The destination object.
				* @param {...Object} sources The source objects.
				* @param {Function} [customizer] The function to customize assigned values.
				* @returns {Object} Returns `object`.
				* @see _.assignInWith
				* @example
				*
				* function customizer(objValue, srcValue) {
				*   return _.isUndefined(objValue) ? srcValue : objValue;
				* }
				*
				* var defaults = _.partialRight(_.assignWith, customizer);
				*
				* defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
				* // => { 'a': 1, 'b': 2 }
				*/
				var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
					copyObject(source, keys(source), object, customizer);
				});
				/**
				* Creates an array of values corresponding to `paths` of `object`.
				*
				* @static
				* @memberOf _
				* @since 1.0.0
				* @category Object
				* @param {Object} object The object to iterate over.
				* @param {...(string|string[])} [paths] The property paths to pick.
				* @returns {Array} Returns the picked values.
				* @example
				*
				* var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
				*
				* _.at(object, ['a[0].b.c', 'a[1]']);
				* // => [3, 4]
				*/
				var at = flatRest(baseAt);
				/**
				* Creates an object that inherits from the `prototype` object. If a
				* `properties` object is given, its own enumerable string keyed properties
				* are assigned to the created object.
				*
				* @static
				* @memberOf _
				* @since 2.3.0
				* @category Object
				* @param {Object} prototype The object to inherit from.
				* @param {Object} [properties] The properties to assign to the object.
				* @returns {Object} Returns the new object.
				* @example
				*
				* function Shape() {
				*   this.x = 0;
				*   this.y = 0;
				* }
				*
				* function Circle() {
				*   Shape.call(this);
				* }
				*
				* Circle.prototype = _.create(Shape.prototype, {
				*   'constructor': Circle
				* });
				*
				* var circle = new Circle;
				* circle instanceof Circle;
				* // => true
				*
				* circle instanceof Shape;
				* // => true
				*/
				function create(prototype, properties) {
					var result = baseCreate(prototype);
					return properties == null ? result : baseAssign(result, properties);
				}
				/**
				* Assigns own and inherited enumerable string keyed properties of source
				* objects to the destination object for all destination properties that
				* resolve to `undefined`. Source objects are applied from left to right.
				* Once a property is set, additional values of the same property are ignored.
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Object
				* @param {Object} object The destination object.
				* @param {...Object} [sources] The source objects.
				* @returns {Object} Returns `object`.
				* @see _.defaultsDeep
				* @example
				*
				* _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
				* // => { 'a': 1, 'b': 2 }
				*/
				var defaults = baseRest(function(object, sources) {
					object = Object(object);
					var index = -1;
					var length = sources.length;
					var guard = length > 2 ? sources[2] : undefined;
					if (guard && isIterateeCall(sources[0], sources[1], guard)) length = 1;
					while (++index < length) {
						var source = sources[index];
						var props = keysIn(source);
						var propsIndex = -1;
						var propsLength = props.length;
						while (++propsIndex < propsLength) {
							var key = props[propsIndex];
							var value = object[key];
							if (value === undefined || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) object[key] = source[key];
						}
					}
					return object;
				});
				/**
				* This method is like `_.defaults` except that it recursively assigns
				* default properties.
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @memberOf _
				* @since 3.10.0
				* @category Object
				* @param {Object} object The destination object.
				* @param {...Object} [sources] The source objects.
				* @returns {Object} Returns `object`.
				* @see _.defaults
				* @example
				*
				* _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
				* // => { 'a': { 'b': 2, 'c': 3 } }
				*/
				var defaultsDeep = baseRest(function(args) {
					args.push(undefined, customDefaultsMerge);
					return apply(mergeWith, undefined, args);
				});
				/**
				* This method is like `_.find` except that it returns the key of the first
				* element `predicate` returns truthy for instead of the element itself.
				*
				* @static
				* @memberOf _
				* @since 1.1.0
				* @category Object
				* @param {Object} object The object to inspect.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @returns {string|undefined} Returns the key of the matched element,
				*  else `undefined`.
				* @example
				*
				* var users = {
				*   'barney':  { 'age': 36, 'active': true },
				*   'fred':    { 'age': 40, 'active': false },
				*   'pebbles': { 'age': 1,  'active': true }
				* };
				*
				* _.findKey(users, function(o) { return o.age < 40; });
				* // => 'barney' (iteration order is not guaranteed)
				*
				* // The `_.matches` iteratee shorthand.
				* _.findKey(users, { 'age': 1, 'active': true });
				* // => 'pebbles'
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.findKey(users, ['active', false]);
				* // => 'fred'
				*
				* // The `_.property` iteratee shorthand.
				* _.findKey(users, 'active');
				* // => 'barney'
				*/
				function findKey(object, predicate) {
					return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
				}
				/**
				* This method is like `_.findKey` except that it iterates over elements of
				* a collection in the opposite order.
				*
				* @static
				* @memberOf _
				* @since 2.0.0
				* @category Object
				* @param {Object} object The object to inspect.
				* @param {Function} [predicate=_.identity] The function invoked per iteration.
				* @returns {string|undefined} Returns the key of the matched element,
				*  else `undefined`.
				* @example
				*
				* var users = {
				*   'barney':  { 'age': 36, 'active': true },
				*   'fred':    { 'age': 40, 'active': false },
				*   'pebbles': { 'age': 1,  'active': true }
				* };
				*
				* _.findLastKey(users, function(o) { return o.age < 40; });
				* // => returns 'pebbles' assuming `_.findKey` returns 'barney'
				*
				* // The `_.matches` iteratee shorthand.
				* _.findLastKey(users, { 'age': 36, 'active': true });
				* // => 'barney'
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.findLastKey(users, ['active', false]);
				* // => 'fred'
				*
				* // The `_.property` iteratee shorthand.
				* _.findLastKey(users, 'active');
				* // => 'pebbles'
				*/
				function findLastKey(object, predicate) {
					return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
				}
				/**
				* Iterates over own and inherited enumerable string keyed properties of an
				* object and invokes `iteratee` for each property. The iteratee is invoked
				* with three arguments: (value, key, object). Iteratee functions may exit
				* iteration early by explicitly returning `false`.
				*
				* @static
				* @memberOf _
				* @since 0.3.0
				* @category Object
				* @param {Object} object The object to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Object} Returns `object`.
				* @see _.forInRight
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				*   this.b = 2;
				* }
				*
				* Foo.prototype.c = 3;
				*
				* _.forIn(new Foo, function(value, key) {
				*   console.log(key);
				* });
				* // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
				*/
				function forIn(object, iteratee) {
					return object == null ? object : baseFor(object, getIteratee(iteratee, 3), keysIn);
				}
				/**
				* This method is like `_.forIn` except that it iterates over properties of
				* `object` in the opposite order.
				*
				* @static
				* @memberOf _
				* @since 2.0.0
				* @category Object
				* @param {Object} object The object to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Object} Returns `object`.
				* @see _.forIn
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				*   this.b = 2;
				* }
				*
				* Foo.prototype.c = 3;
				*
				* _.forInRight(new Foo, function(value, key) {
				*   console.log(key);
				* });
				* // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
				*/
				function forInRight(object, iteratee) {
					return object == null ? object : baseForRight(object, getIteratee(iteratee, 3), keysIn);
				}
				/**
				* Iterates over own enumerable string keyed properties of an object and
				* invokes `iteratee` for each property. The iteratee is invoked with three
				* arguments: (value, key, object). Iteratee functions may exit iteration
				* early by explicitly returning `false`.
				*
				* @static
				* @memberOf _
				* @since 0.3.0
				* @category Object
				* @param {Object} object The object to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Object} Returns `object`.
				* @see _.forOwnRight
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				*   this.b = 2;
				* }
				*
				* Foo.prototype.c = 3;
				*
				* _.forOwn(new Foo, function(value, key) {
				*   console.log(key);
				* });
				* // => Logs 'a' then 'b' (iteration order is not guaranteed).
				*/
				function forOwn(object, iteratee) {
					return object && baseForOwn(object, getIteratee(iteratee, 3));
				}
				/**
				* This method is like `_.forOwn` except that it iterates over properties of
				* `object` in the opposite order.
				*
				* @static
				* @memberOf _
				* @since 2.0.0
				* @category Object
				* @param {Object} object The object to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Object} Returns `object`.
				* @see _.forOwn
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				*   this.b = 2;
				* }
				*
				* Foo.prototype.c = 3;
				*
				* _.forOwnRight(new Foo, function(value, key) {
				*   console.log(key);
				* });
				* // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
				*/
				function forOwnRight(object, iteratee) {
					return object && baseForOwnRight(object, getIteratee(iteratee, 3));
				}
				/**
				* Creates an array of function property names from own enumerable properties
				* of `object`.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Object
				* @param {Object} object The object to inspect.
				* @returns {Array} Returns the function names.
				* @see _.functionsIn
				* @example
				*
				* function Foo() {
				*   this.a = _.constant('a');
				*   this.b = _.constant('b');
				* }
				*
				* Foo.prototype.c = _.constant('c');
				*
				* _.functions(new Foo);
				* // => ['a', 'b']
				*/
				function functions(object) {
					return object == null ? [] : baseFunctions(object, keys(object));
				}
				/**
				* Creates an array of function property names from own and inherited
				* enumerable properties of `object`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Object
				* @param {Object} object The object to inspect.
				* @returns {Array} Returns the function names.
				* @see _.functions
				* @example
				*
				* function Foo() {
				*   this.a = _.constant('a');
				*   this.b = _.constant('b');
				* }
				*
				* Foo.prototype.c = _.constant('c');
				*
				* _.functionsIn(new Foo);
				* // => ['a', 'b', 'c']
				*/
				function functionsIn(object) {
					return object == null ? [] : baseFunctions(object, keysIn(object));
				}
				/**
				* Gets the value at `path` of `object`. If the resolved value is
				* `undefined`, the `defaultValue` is returned in its place.
				*
				* @static
				* @memberOf _
				* @since 3.7.0
				* @category Object
				* @param {Object} object The object to query.
				* @param {Array|string} path The path of the property to get.
				* @param {*} [defaultValue] The value returned for `undefined` resolved values.
				* @returns {*} Returns the resolved value.
				* @example
				*
				* var object = { 'a': [{ 'b': { 'c': 3 } }] };
				*
				* _.get(object, 'a[0].b.c');
				* // => 3
				*
				* _.get(object, ['a', '0', 'b', 'c']);
				* // => 3
				*
				* _.get(object, 'a.b.c', 'default');
				* // => 'default'
				*/
				function get(object, path, defaultValue) {
					var result = object == null ? undefined : baseGet(object, path);
					return result === undefined ? defaultValue : result;
				}
				/**
				* Checks if `path` is a direct property of `object`.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Object
				* @param {Object} object The object to query.
				* @param {Array|string} path The path to check.
				* @returns {boolean} Returns `true` if `path` exists, else `false`.
				* @example
				*
				* var object = { 'a': { 'b': 2 } };
				* var other = _.create({ 'a': _.create({ 'b': 2 }) });
				*
				* _.has(object, 'a');
				* // => true
				*
				* _.has(object, 'a.b');
				* // => true
				*
				* _.has(object, ['a', 'b']);
				* // => true
				*
				* _.has(other, 'a');
				* // => false
				*/
				function has(object, path) {
					return object != null && hasPath(object, path, baseHas);
				}
				/**
				* Checks if `path` is a direct or inherited property of `object`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Object
				* @param {Object} object The object to query.
				* @param {Array|string} path The path to check.
				* @returns {boolean} Returns `true` if `path` exists, else `false`.
				* @example
				*
				* var object = _.create({ 'a': _.create({ 'b': 2 }) });
				*
				* _.hasIn(object, 'a');
				* // => true
				*
				* _.hasIn(object, 'a.b');
				* // => true
				*
				* _.hasIn(object, ['a', 'b']);
				* // => true
				*
				* _.hasIn(object, 'b');
				* // => false
				*/
				function hasIn(object, path) {
					return object != null && hasPath(object, path, baseHasIn);
				}
				/**
				* Creates an object composed of the inverted keys and values of `object`.
				* If `object` contains duplicate values, subsequent values overwrite
				* property assignments of previous values.
				*
				* @static
				* @memberOf _
				* @since 0.7.0
				* @category Object
				* @param {Object} object The object to invert.
				* @returns {Object} Returns the new inverted object.
				* @example
				*
				* var object = { 'a': 1, 'b': 2, 'c': 1 };
				*
				* _.invert(object);
				* // => { '1': 'c', '2': 'b' }
				*/
				var invert = createInverter(function(result, value, key) {
					if (value != null && typeof value.toString != "function") value = nativeObjectToString.call(value);
					result[value] = key;
				}, constant(identity));
				/**
				* This method is like `_.invert` except that the inverted object is generated
				* from the results of running each element of `object` thru `iteratee`. The
				* corresponding inverted value of each inverted key is an array of keys
				* responsible for generating the inverted value. The iteratee is invoked
				* with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 4.1.0
				* @category Object
				* @param {Object} object The object to invert.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {Object} Returns the new inverted object.
				* @example
				*
				* var object = { 'a': 1, 'b': 2, 'c': 1 };
				*
				* _.invertBy(object);
				* // => { '1': ['a', 'c'], '2': ['b'] }
				*
				* _.invertBy(object, function(value) {
				*   return 'group' + value;
				* });
				* // => { 'group1': ['a', 'c'], 'group2': ['b'] }
				*/
				var invertBy = createInverter(function(result, value, key) {
					if (value != null && typeof value.toString != "function") value = nativeObjectToString.call(value);
					if (hasOwnProperty.call(result, value)) result[value].push(key);
					else result[value] = [key];
				}, getIteratee);
				/**
				* Invokes the method at `path` of `object`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Object
				* @param {Object} object The object to query.
				* @param {Array|string} path The path of the method to invoke.
				* @param {...*} [args] The arguments to invoke the method with.
				* @returns {*} Returns the result of the invoked method.
				* @example
				*
				* var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
				*
				* _.invoke(object, 'a[0].b.c.slice', 1, 3);
				* // => [2, 3]
				*/
				var invoke = baseRest(baseInvoke);
				/**
				* Creates an array of the own enumerable property names of `object`.
				*
				* **Note:** Non-object values are coerced to objects. See the
				* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
				* for more details.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Object
				* @param {Object} object The object to query.
				* @returns {Array} Returns the array of property names.
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				*   this.b = 2;
				* }
				*
				* Foo.prototype.c = 3;
				*
				* _.keys(new Foo);
				* // => ['a', 'b'] (iteration order is not guaranteed)
				*
				* _.keys('hi');
				* // => ['0', '1']
				*/
				function keys(object) {
					return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
				}
				/**
				* Creates an array of the own and inherited enumerable property names of `object`.
				*
				* **Note:** Non-object values are coerced to objects.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Object
				* @param {Object} object The object to query.
				* @returns {Array} Returns the array of property names.
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				*   this.b = 2;
				* }
				*
				* Foo.prototype.c = 3;
				*
				* _.keysIn(new Foo);
				* // => ['a', 'b', 'c'] (iteration order is not guaranteed)
				*/
				function keysIn(object) {
					return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
				}
				/**
				* The opposite of `_.mapValues`; this method creates an object with the
				* same values as `object` and keys generated by running each own enumerable
				* string keyed property of `object` thru `iteratee`. The iteratee is invoked
				* with three arguments: (value, key, object).
				*
				* @static
				* @memberOf _
				* @since 3.8.0
				* @category Object
				* @param {Object} object The object to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Object} Returns the new mapped object.
				* @see _.mapValues
				* @example
				*
				* _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
				*   return key + value;
				* });
				* // => { 'a1': 1, 'b2': 2 }
				*/
				function mapKeys(object, iteratee) {
					var result = {};
					iteratee = getIteratee(iteratee, 3);
					baseForOwn(object, function(value, key, object) {
						baseAssignValue(result, iteratee(value, key, object), value);
					});
					return result;
				}
				/**
				* Creates an object with the same keys as `object` and values generated
				* by running each own enumerable string keyed property of `object` thru
				* `iteratee`. The iteratee is invoked with three arguments:
				* (value, key, object).
				*
				* @static
				* @memberOf _
				* @since 2.4.0
				* @category Object
				* @param {Object} object The object to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Object} Returns the new mapped object.
				* @see _.mapKeys
				* @example
				*
				* var users = {
				*   'fred':    { 'user': 'fred',    'age': 40 },
				*   'pebbles': { 'user': 'pebbles', 'age': 1 }
				* };
				*
				* _.mapValues(users, function(o) { return o.age; });
				* // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
				*
				* // The `_.property` iteratee shorthand.
				* _.mapValues(users, 'age');
				* // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
				*/
				function mapValues(object, iteratee) {
					var result = {};
					iteratee = getIteratee(iteratee, 3);
					baseForOwn(object, function(value, key, object) {
						baseAssignValue(result, key, iteratee(value, key, object));
					});
					return result;
				}
				/**
				* This method is like `_.assign` except that it recursively merges own and
				* inherited enumerable string keyed properties of source objects into the
				* destination object. Source properties that resolve to `undefined` are
				* skipped if a destination value exists. Array and plain object properties
				* are merged recursively. Other objects and value types are overridden by
				* assignment. Source objects are applied from left to right. Subsequent
				* sources overwrite property assignments of previous sources.
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @memberOf _
				* @since 0.5.0
				* @category Object
				* @param {Object} object The destination object.
				* @param {...Object} [sources] The source objects.
				* @returns {Object} Returns `object`.
				* @example
				*
				* var object = {
				*   'a': [{ 'b': 2 }, { 'd': 4 }]
				* };
				*
				* var other = {
				*   'a': [{ 'c': 3 }, { 'e': 5 }]
				* };
				*
				* _.merge(object, other);
				* // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
				*/
				var merge = createAssigner(function(object, source, srcIndex) {
					baseMerge(object, source, srcIndex);
				});
				/**
				* This method is like `_.merge` except that it accepts `customizer` which
				* is invoked to produce the merged values of the destination and source
				* properties. If `customizer` returns `undefined`, merging is handled by the
				* method instead. The `customizer` is invoked with six arguments:
				* (objValue, srcValue, key, object, source, stack).
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Object
				* @param {Object} object The destination object.
				* @param {...Object} sources The source objects.
				* @param {Function} customizer The function to customize assigned values.
				* @returns {Object} Returns `object`.
				* @example
				*
				* function customizer(objValue, srcValue) {
				*   if (_.isArray(objValue)) {
				*     return objValue.concat(srcValue);
				*   }
				* }
				*
				* var object = { 'a': [1], 'b': [2] };
				* var other = { 'a': [3], 'b': [4] };
				*
				* _.mergeWith(object, other, customizer);
				* // => { 'a': [1, 3], 'b': [2, 4] }
				*/
				var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
					baseMerge(object, source, srcIndex, customizer);
				});
				/**
				* The opposite of `_.pick`; this method creates an object composed of the
				* own and inherited enumerable property paths of `object` that are not omitted.
				*
				* **Note:** This method is considerably slower than `_.pick`.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Object
				* @param {Object} object The source object.
				* @param {...(string|string[])} [paths] The property paths to omit.
				* @returns {Object} Returns the new object.
				* @example
				*
				* var object = { 'a': 1, 'b': '2', 'c': 3 };
				*
				* _.omit(object, ['a', 'c']);
				* // => { 'b': '2' }
				*/
				var omit = flatRest(function(object, paths) {
					var result = {};
					if (object == null) return result;
					var isDeep = false;
					paths = arrayMap(paths, function(path) {
						path = castPath(path, object);
						isDeep || (isDeep = path.length > 1);
						return path;
					});
					copyObject(object, getAllKeysIn(object), result);
					if (isDeep) result = baseClone(result, 7, customOmitClone);
					var length = paths.length;
					while (length--) baseUnset(result, paths[length]);
					return result;
				});
				/**
				* The opposite of `_.pickBy`; this method creates an object composed of
				* the own and inherited enumerable string keyed properties of `object` that
				* `predicate` doesn't return truthy for. The predicate is invoked with two
				* arguments: (value, key).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Object
				* @param {Object} object The source object.
				* @param {Function} [predicate=_.identity] The function invoked per property.
				* @returns {Object} Returns the new object.
				* @example
				*
				* var object = { 'a': 1, 'b': '2', 'c': 3 };
				*
				* _.omitBy(object, _.isNumber);
				* // => { 'b': '2' }
				*/
				function omitBy(object, predicate) {
					return pickBy(object, negate(getIteratee(predicate)));
				}
				/**
				* Creates an object composed of the picked `object` properties.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Object
				* @param {Object} object The source object.
				* @param {...(string|string[])} [paths] The property paths to pick.
				* @returns {Object} Returns the new object.
				* @example
				*
				* var object = { 'a': 1, 'b': '2', 'c': 3 };
				*
				* _.pick(object, ['a', 'c']);
				* // => { 'a': 1, 'c': 3 }
				*/
				var pick = flatRest(function(object, paths) {
					return object == null ? {} : basePick(object, paths);
				});
				/**
				* Creates an object composed of the `object` properties `predicate` returns
				* truthy for. The predicate is invoked with two arguments: (value, key).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Object
				* @param {Object} object The source object.
				* @param {Function} [predicate=_.identity] The function invoked per property.
				* @returns {Object} Returns the new object.
				* @example
				*
				* var object = { 'a': 1, 'b': '2', 'c': 3 };
				*
				* _.pickBy(object, _.isNumber);
				* // => { 'a': 1, 'c': 3 }
				*/
				function pickBy(object, predicate) {
					if (object == null) return {};
					var props = arrayMap(getAllKeysIn(object), function(prop) {
						return [prop];
					});
					predicate = getIteratee(predicate);
					return basePickBy(object, props, function(value, path) {
						return predicate(value, path[0]);
					});
				}
				/**
				* This method is like `_.get` except that if the resolved value is a
				* function it's invoked with the `this` binding of its parent object and
				* its result is returned.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Object
				* @param {Object} object The object to query.
				* @param {Array|string} path The path of the property to resolve.
				* @param {*} [defaultValue] The value returned for `undefined` resolved values.
				* @returns {*} Returns the resolved value.
				* @example
				*
				* var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
				*
				* _.result(object, 'a[0].b.c1');
				* // => 3
				*
				* _.result(object, 'a[0].b.c2');
				* // => 4
				*
				* _.result(object, 'a[0].b.c3', 'default');
				* // => 'default'
				*
				* _.result(object, 'a[0].b.c3', _.constant('default'));
				* // => 'default'
				*/
				function result(object, path, defaultValue) {
					path = castPath(path, object);
					var index = -1, length = path.length;
					if (!length) {
						length = 1;
						object = undefined;
					}
					while (++index < length) {
						var value = object == null ? undefined : object[toKey(path[index])];
						if (value === undefined) {
							index = length;
							value = defaultValue;
						}
						object = isFunction(value) ? value.call(object) : value;
					}
					return object;
				}
				/**
				* Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
				* it's created. Arrays are created for missing index properties while objects
				* are created for all other missing properties. Use `_.setWith` to customize
				* `path` creation.
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @memberOf _
				* @since 3.7.0
				* @category Object
				* @param {Object} object The object to modify.
				* @param {Array|string} path The path of the property to set.
				* @param {*} value The value to set.
				* @returns {Object} Returns `object`.
				* @example
				*
				* var object = { 'a': [{ 'b': { 'c': 3 } }] };
				*
				* _.set(object, 'a[0].b.c', 4);
				* console.log(object.a[0].b.c);
				* // => 4
				*
				* _.set(object, ['x', '0', 'y', 'z'], 5);
				* console.log(object.x[0].y.z);
				* // => 5
				*/
				function set(object, path, value) {
					return object == null ? object : baseSet(object, path, value);
				}
				/**
				* This method is like `_.set` except that it accepts `customizer` which is
				* invoked to produce the objects of `path`.  If `customizer` returns `undefined`
				* path creation is handled by the method instead. The `customizer` is invoked
				* with three arguments: (nsValue, key, nsObject).
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Object
				* @param {Object} object The object to modify.
				* @param {Array|string} path The path of the property to set.
				* @param {*} value The value to set.
				* @param {Function} [customizer] The function to customize assigned values.
				* @returns {Object} Returns `object`.
				* @example
				*
				* var object = {};
				*
				* _.setWith(object, '[0][1]', 'a', Object);
				* // => { '0': { '1': 'a' } }
				*/
				function setWith(object, path, value, customizer) {
					customizer = typeof customizer == "function" ? customizer : undefined;
					return object == null ? object : baseSet(object, path, value, customizer);
				}
				/**
				* Creates an array of own enumerable string keyed-value pairs for `object`
				* which can be consumed by `_.fromPairs`. If `object` is a map or set, its
				* entries are returned.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @alias entries
				* @category Object
				* @param {Object} object The object to query.
				* @returns {Array} Returns the key-value pairs.
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				*   this.b = 2;
				* }
				*
				* Foo.prototype.c = 3;
				*
				* _.toPairs(new Foo);
				* // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
				*/
				var toPairs = createToPairs(keys);
				/**
				* Creates an array of own and inherited enumerable string keyed-value pairs
				* for `object` which can be consumed by `_.fromPairs`. If `object` is a map
				* or set, its entries are returned.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @alias entriesIn
				* @category Object
				* @param {Object} object The object to query.
				* @returns {Array} Returns the key-value pairs.
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				*   this.b = 2;
				* }
				*
				* Foo.prototype.c = 3;
				*
				* _.toPairsIn(new Foo);
				* // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
				*/
				var toPairsIn = createToPairs(keysIn);
				/**
				* An alternative to `_.reduce`; this method transforms `object` to a new
				* `accumulator` object which is the result of running each of its own
				* enumerable string keyed properties thru `iteratee`, with each invocation
				* potentially mutating the `accumulator` object. If `accumulator` is not
				* provided, a new object with the same `[[Prototype]]` will be used. The
				* iteratee is invoked with four arguments: (accumulator, value, key, object).
				* Iteratee functions may exit iteration early by explicitly returning `false`.
				*
				* @static
				* @memberOf _
				* @since 1.3.0
				* @category Object
				* @param {Object} object The object to iterate over.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @param {*} [accumulator] The custom accumulator value.
				* @returns {*} Returns the accumulated value.
				* @example
				*
				* _.transform([2, 3, 4], function(result, n) {
				*   result.push(n *= n);
				*   return n % 2 == 0;
				* }, []);
				* // => [4, 9]
				*
				* _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
				*   (result[value] || (result[value] = [])).push(key);
				* }, {});
				* // => { '1': ['a', 'c'], '2': ['b'] }
				*/
				function transform(object, iteratee, accumulator) {
					var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
					iteratee = getIteratee(iteratee, 4);
					if (accumulator == null) {
						var Ctor = object && object.constructor;
						if (isArrLike) accumulator = isArr ? new Ctor() : [];
						else if (isObject(object)) accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
						else accumulator = {};
					}
					(isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
						return iteratee(accumulator, value, index, object);
					});
					return accumulator;
				}
				/**
				* Removes the property at `path` of `object`.
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Object
				* @param {Object} object The object to modify.
				* @param {Array|string} path The path of the property to unset.
				* @returns {boolean} Returns `true` if the property is deleted, else `false`.
				* @example
				*
				* var object = { 'a': [{ 'b': { 'c': 7 } }] };
				* _.unset(object, 'a[0].b.c');
				* // => true
				*
				* console.log(object);
				* // => { 'a': [{ 'b': {} }] };
				*
				* _.unset(object, ['a', '0', 'b', 'c']);
				* // => true
				*
				* console.log(object);
				* // => { 'a': [{ 'b': {} }] };
				*/
				function unset(object, path) {
					return object == null ? true : baseUnset(object, path);
				}
				/**
				* This method is like `_.set` except that accepts `updater` to produce the
				* value to set. Use `_.updateWith` to customize `path` creation. The `updater`
				* is invoked with one argument: (value).
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @memberOf _
				* @since 4.6.0
				* @category Object
				* @param {Object} object The object to modify.
				* @param {Array|string} path The path of the property to set.
				* @param {Function} updater The function to produce the updated value.
				* @returns {Object} Returns `object`.
				* @example
				*
				* var object = { 'a': [{ 'b': { 'c': 3 } }] };
				*
				* _.update(object, 'a[0].b.c', function(n) { return n * n; });
				* console.log(object.a[0].b.c);
				* // => 9
				*
				* _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
				* console.log(object.x[0].y.z);
				* // => 0
				*/
				function update(object, path, updater) {
					return object == null ? object : baseUpdate(object, path, castFunction(updater));
				}
				/**
				* This method is like `_.update` except that it accepts `customizer` which is
				* invoked to produce the objects of `path`.  If `customizer` returns `undefined`
				* path creation is handled by the method instead. The `customizer` is invoked
				* with three arguments: (nsValue, key, nsObject).
				*
				* **Note:** This method mutates `object`.
				*
				* @static
				* @memberOf _
				* @since 4.6.0
				* @category Object
				* @param {Object} object The object to modify.
				* @param {Array|string} path The path of the property to set.
				* @param {Function} updater The function to produce the updated value.
				* @param {Function} [customizer] The function to customize assigned values.
				* @returns {Object} Returns `object`.
				* @example
				*
				* var object = {};
				*
				* _.updateWith(object, '[0][1]', _.constant('a'), Object);
				* // => { '0': { '1': 'a' } }
				*/
				function updateWith(object, path, updater, customizer) {
					customizer = typeof customizer == "function" ? customizer : undefined;
					return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
				}
				/**
				* Creates an array of the own enumerable string keyed property values of `object`.
				*
				* **Note:** Non-object values are coerced to objects.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Object
				* @param {Object} object The object to query.
				* @returns {Array} Returns the array of property values.
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				*   this.b = 2;
				* }
				*
				* Foo.prototype.c = 3;
				*
				* _.values(new Foo);
				* // => [1, 2] (iteration order is not guaranteed)
				*
				* _.values('hi');
				* // => ['h', 'i']
				*/
				function values(object) {
					return object == null ? [] : baseValues(object, keys(object));
				}
				/**
				* Creates an array of the own and inherited enumerable string keyed property
				* values of `object`.
				*
				* **Note:** Non-object values are coerced to objects.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Object
				* @param {Object} object The object to query.
				* @returns {Array} Returns the array of property values.
				* @example
				*
				* function Foo() {
				*   this.a = 1;
				*   this.b = 2;
				* }
				*
				* Foo.prototype.c = 3;
				*
				* _.valuesIn(new Foo);
				* // => [1, 2, 3] (iteration order is not guaranteed)
				*/
				function valuesIn(object) {
					return object == null ? [] : baseValues(object, keysIn(object));
				}
				/**
				* Clamps `number` within the inclusive `lower` and `upper` bounds.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Number
				* @param {number} number The number to clamp.
				* @param {number} [lower] The lower bound.
				* @param {number} upper The upper bound.
				* @returns {number} Returns the clamped number.
				* @example
				*
				* _.clamp(-10, -5, 5);
				* // => -5
				*
				* _.clamp(10, -5, 5);
				* // => 5
				*/
				function clamp(number, lower, upper) {
					if (upper === undefined) {
						upper = lower;
						lower = undefined;
					}
					if (upper !== undefined) {
						upper = toNumber(upper);
						upper = upper === upper ? upper : 0;
					}
					if (lower !== undefined) {
						lower = toNumber(lower);
						lower = lower === lower ? lower : 0;
					}
					return baseClamp(toNumber(number), lower, upper);
				}
				/**
				* Checks if `n` is between `start` and up to, but not including, `end`. If
				* `end` is not specified, it's set to `start` with `start` then set to `0`.
				* If `start` is greater than `end` the params are swapped to support
				* negative ranges.
				*
				* @static
				* @memberOf _
				* @since 3.3.0
				* @category Number
				* @param {number} number The number to check.
				* @param {number} [start=0] The start of the range.
				* @param {number} end The end of the range.
				* @returns {boolean} Returns `true` if `number` is in the range, else `false`.
				* @see _.range, _.rangeRight
				* @example
				*
				* _.inRange(3, 2, 4);
				* // => true
				*
				* _.inRange(4, 8);
				* // => true
				*
				* _.inRange(4, 2);
				* // => false
				*
				* _.inRange(2, 2);
				* // => false
				*
				* _.inRange(1.2, 2);
				* // => true
				*
				* _.inRange(5.2, 4);
				* // => false
				*
				* _.inRange(-3, -2, -6);
				* // => true
				*/
				function inRange(number, start, end) {
					start = toFinite(start);
					if (end === undefined) {
						end = start;
						start = 0;
					} else end = toFinite(end);
					number = toNumber(number);
					return baseInRange(number, start, end);
				}
				/**
				* Produces a random number between the inclusive `lower` and `upper` bounds.
				* If only one argument is provided a number between `0` and the given number
				* is returned. If `floating` is `true`, or either `lower` or `upper` are
				* floats, a floating-point number is returned instead of an integer.
				*
				* **Note:** JavaScript follows the IEEE-754 standard for resolving
				* floating-point values which can produce unexpected results.
				*
				* **Note:** If `lower` is greater than `upper`, the values are swapped.
				*
				* @static
				* @memberOf _
				* @since 0.7.0
				* @category Number
				* @param {number} [lower=0] The lower bound.
				* @param {number} [upper=1] The upper bound.
				* @param {boolean} [floating] Specify returning a floating-point number.
				* @returns {number} Returns the random number.
				* @example
				*
				* _.random(0, 5);
				* // => an integer between 0 and 5
				*
				* // when lower is greater than upper the values are swapped
				* _.random(5, 0);
				* // => an integer between 0 and 5
				*
				* _.random(5);
				* // => also an integer between 0 and 5
				*
				* _.random(-5);
				* // => an integer between -5 and 0
				*
				* _.random(5, true);
				* // => a floating-point number between 0 and 5
				*
				* _.random(1.2, 5.2);
				* // => a floating-point number between 1.2 and 5.2
				*/
				function random(lower, upper, floating) {
					if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) upper = floating = undefined;
					if (floating === undefined) {
						if (typeof upper == "boolean") {
							floating = upper;
							upper = undefined;
						} else if (typeof lower == "boolean") {
							floating = lower;
							lower = undefined;
						}
					}
					if (lower === undefined && upper === undefined) {
						lower = 0;
						upper = 1;
					} else {
						lower = toFinite(lower);
						if (upper === undefined) {
							upper = lower;
							lower = 0;
						} else upper = toFinite(upper);
					}
					if (lower > upper) {
						var temp = lower;
						lower = upper;
						upper = temp;
					}
					if (floating || lower % 1 || upper % 1) {
						var rand = nativeRandom();
						return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
					}
					return baseRandom(lower, upper);
				}
				/**
				* Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to convert.
				* @returns {string} Returns the camel cased string.
				* @example
				*
				* _.camelCase('Foo Bar');
				* // => 'fooBar'
				*
				* _.camelCase('--foo-bar--');
				* // => 'fooBar'
				*
				* _.camelCase('__FOO_BAR__');
				* // => 'fooBar'
				*/
				var camelCase = createCompounder(function(result, word, index) {
					word = word.toLowerCase();
					return result + (index ? capitalize(word) : word);
				});
				/**
				* Converts the first character of `string` to upper case and the remaining
				* to lower case.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to capitalize.
				* @returns {string} Returns the capitalized string.
				* @example
				*
				* _.capitalize('FRED');
				* // => 'Fred'
				*/
				function capitalize(string) {
					return upperFirst(toString(string).toLowerCase());
				}
				/**
				* Deburrs `string` by converting
				* [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
				* and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
				* letters to basic Latin letters and removing
				* [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to deburr.
				* @returns {string} Returns the deburred string.
				* @example
				*
				* _.deburr('déjà vu');
				* // => 'deja vu'
				*/
				function deburr(string) {
					string = toString(string);
					return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
				}
				/**
				* Checks if `string` ends with the given target string.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to inspect.
				* @param {string} [target] The string to search for.
				* @param {number} [position=string.length] The position to search up to.
				* @returns {boolean} Returns `true` if `string` ends with `target`,
				*  else `false`.
				* @example
				*
				* _.endsWith('abc', 'c');
				* // => true
				*
				* _.endsWith('abc', 'b');
				* // => false
				*
				* _.endsWith('abc', 'b', 2);
				* // => true
				*/
				function endsWith(string, target, position) {
					string = toString(string);
					target = baseToString(target);
					var length = string.length;
					position = position === undefined ? length : baseClamp(toInteger(position), 0, length);
					var end = position;
					position -= target.length;
					return position >= 0 && string.slice(position, end) == target;
				}
				/**
				* Converts the characters "&", "<", ">", '"', and "'" in `string` to their
				* corresponding HTML entities.
				*
				* **Note:** No other characters are escaped. To escape additional
				* characters use a third-party library like [_he_](https://mths.be/he).
				*
				* Though the ">" character is escaped for symmetry, characters like
				* ">" and "/" don't need escaping in HTML and have no special meaning
				* unless they're part of a tag or unquoted attribute value. See
				* [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
				* (under "semi-related fun fact") for more details.
				*
				* When working with HTML you should always
				* [quote attribute values](http://wonko.com/post/html-escaping) to reduce
				* XSS vectors.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category String
				* @param {string} [string=''] The string to escape.
				* @returns {string} Returns the escaped string.
				* @example
				*
				* _.escape('fred, barney, & pebbles');
				* // => 'fred, barney, &amp; pebbles'
				*/
				function escape(string) {
					string = toString(string);
					return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
				}
				/**
				* Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
				* "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to escape.
				* @returns {string} Returns the escaped string.
				* @example
				*
				* _.escapeRegExp('[lodash](https://lodash.com/)');
				* // => '\[lodash\]\(https://lodash\.com/\)'
				*/
				function escapeRegExp(string) {
					string = toString(string);
					return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
				}
				/**
				* Converts `string` to
				* [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to convert.
				* @returns {string} Returns the kebab cased string.
				* @example
				*
				* _.kebabCase('Foo Bar');
				* // => 'foo-bar'
				*
				* _.kebabCase('fooBar');
				* // => 'foo-bar'
				*
				* _.kebabCase('__FOO_BAR__');
				* // => 'foo-bar'
				*/
				var kebabCase = createCompounder(function(result, word, index) {
					return result + (index ? "-" : "") + word.toLowerCase();
				});
				/**
				* Converts `string`, as space separated words, to lower case.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to convert.
				* @returns {string} Returns the lower cased string.
				* @example
				*
				* _.lowerCase('--Foo-Bar--');
				* // => 'foo bar'
				*
				* _.lowerCase('fooBar');
				* // => 'foo bar'
				*
				* _.lowerCase('__FOO_BAR__');
				* // => 'foo bar'
				*/
				var lowerCase = createCompounder(function(result, word, index) {
					return result + (index ? " " : "") + word.toLowerCase();
				});
				/**
				* Converts the first character of `string` to lower case.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to convert.
				* @returns {string} Returns the converted string.
				* @example
				*
				* _.lowerFirst('Fred');
				* // => 'fred'
				*
				* _.lowerFirst('FRED');
				* // => 'fRED'
				*/
				var lowerFirst = createCaseFirst("toLowerCase");
				/**
				* Pads `string` on the left and right sides if it's shorter than `length`.
				* Padding characters are truncated if they can't be evenly divided by `length`.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to pad.
				* @param {number} [length=0] The padding length.
				* @param {string} [chars=' '] The string used as padding.
				* @returns {string} Returns the padded string.
				* @example
				*
				* _.pad('abc', 8);
				* // => '  abc   '
				*
				* _.pad('abc', 8, '_-');
				* // => '_-abc_-_'
				*
				* _.pad('abc', 3);
				* // => 'abc'
				*/
				function pad(string, length, chars) {
					string = toString(string);
					length = toInteger(length);
					var strLength = length ? stringSize(string) : 0;
					if (!length || strLength >= length) return string;
					var mid = (length - strLength) / 2;
					return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
				}
				/**
				* Pads `string` on the right side if it's shorter than `length`. Padding
				* characters are truncated if they exceed `length`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to pad.
				* @param {number} [length=0] The padding length.
				* @param {string} [chars=' '] The string used as padding.
				* @returns {string} Returns the padded string.
				* @example
				*
				* _.padEnd('abc', 6);
				* // => 'abc   '
				*
				* _.padEnd('abc', 6, '_-');
				* // => 'abc_-_'
				*
				* _.padEnd('abc', 3);
				* // => 'abc'
				*/
				function padEnd(string, length, chars) {
					string = toString(string);
					length = toInteger(length);
					var strLength = length ? stringSize(string) : 0;
					return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
				}
				/**
				* Pads `string` on the left side if it's shorter than `length`. Padding
				* characters are truncated if they exceed `length`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to pad.
				* @param {number} [length=0] The padding length.
				* @param {string} [chars=' '] The string used as padding.
				* @returns {string} Returns the padded string.
				* @example
				*
				* _.padStart('abc', 6);
				* // => '   abc'
				*
				* _.padStart('abc', 6, '_-');
				* // => '_-_abc'
				*
				* _.padStart('abc', 3);
				* // => 'abc'
				*/
				function padStart(string, length, chars) {
					string = toString(string);
					length = toInteger(length);
					var strLength = length ? stringSize(string) : 0;
					return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
				}
				/**
				* Converts `string` to an integer of the specified radix. If `radix` is
				* `undefined` or `0`, a `radix` of `10` is used unless `value` is a
				* hexadecimal, in which case a `radix` of `16` is used.
				*
				* **Note:** This method aligns with the
				* [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
				*
				* @static
				* @memberOf _
				* @since 1.1.0
				* @category String
				* @param {string} string The string to convert.
				* @param {number} [radix=10] The radix to interpret `value` by.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {number} Returns the converted integer.
				* @example
				*
				* _.parseInt('08');
				* // => 8
				*
				* _.map(['6', '08', '10'], _.parseInt);
				* // => [6, 8, 10]
				*/
				function parseInt(string, radix, guard) {
					if (guard || radix == null) radix = 0;
					else if (radix) radix = +radix;
					return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
				}
				/**
				* Repeats the given string `n` times.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to repeat.
				* @param {number} [n=1] The number of times to repeat the string.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {string} Returns the repeated string.
				* @example
				*
				* _.repeat('*', 3);
				* // => '***'
				*
				* _.repeat('abc', 2);
				* // => 'abcabc'
				*
				* _.repeat('abc', 0);
				* // => ''
				*/
				function repeat(string, n, guard) {
					if (guard ? isIterateeCall(string, n, guard) : n === undefined) n = 1;
					else n = toInteger(n);
					return baseRepeat(toString(string), n);
				}
				/**
				* Replaces matches for `pattern` in `string` with `replacement`.
				*
				* **Note:** This method is based on
				* [`String#replace`](https://mdn.io/String/replace).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to modify.
				* @param {RegExp|string} pattern The pattern to replace.
				* @param {Function|string} replacement The match replacement.
				* @returns {string} Returns the modified string.
				* @example
				*
				* _.replace('Hi Fred', 'Fred', 'Barney');
				* // => 'Hi Barney'
				*/
				function replace() {
					var args = arguments, string = toString(args[0]);
					return args.length < 3 ? string : string.replace(args[1], args[2]);
				}
				/**
				* Converts `string` to
				* [snake case](https://en.wikipedia.org/wiki/Snake_case).
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to convert.
				* @returns {string} Returns the snake cased string.
				* @example
				*
				* _.snakeCase('Foo Bar');
				* // => 'foo_bar'
				*
				* _.snakeCase('fooBar');
				* // => 'foo_bar'
				*
				* _.snakeCase('--FOO-BAR--');
				* // => 'foo_bar'
				*/
				var snakeCase = createCompounder(function(result, word, index) {
					return result + (index ? "_" : "") + word.toLowerCase();
				});
				/**
				* Splits `string` by `separator`.
				*
				* **Note:** This method is based on
				* [`String#split`](https://mdn.io/String/split).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to split.
				* @param {RegExp|string} separator The separator pattern to split by.
				* @param {number} [limit] The length to truncate results to.
				* @returns {Array} Returns the string segments.
				* @example
				*
				* _.split('a-b-c', '-', 2);
				* // => ['a', 'b']
				*/
				function split(string, separator, limit) {
					if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) separator = limit = undefined;
					limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
					if (!limit) return [];
					string = toString(string);
					if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
						separator = baseToString(separator);
						if (!separator && hasUnicode(string)) return castSlice(stringToArray(string), 0, limit);
					}
					return string.split(separator, limit);
				}
				/**
				* Converts `string` to
				* [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
				*
				* @static
				* @memberOf _
				* @since 3.1.0
				* @category String
				* @param {string} [string=''] The string to convert.
				* @returns {string} Returns the start cased string.
				* @example
				*
				* _.startCase('--foo-bar--');
				* // => 'Foo Bar'
				*
				* _.startCase('fooBar');
				* // => 'Foo Bar'
				*
				* _.startCase('__FOO_BAR__');
				* // => 'FOO BAR'
				*/
				var startCase = createCompounder(function(result, word, index) {
					return result + (index ? " " : "") + upperFirst(word);
				});
				/**
				* Checks if `string` starts with the given target string.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to inspect.
				* @param {string} [target] The string to search for.
				* @param {number} [position=0] The position to search from.
				* @returns {boolean} Returns `true` if `string` starts with `target`,
				*  else `false`.
				* @example
				*
				* _.startsWith('abc', 'a');
				* // => true
				*
				* _.startsWith('abc', 'b');
				* // => false
				*
				* _.startsWith('abc', 'b', 1);
				* // => true
				*/
				function startsWith(string, target, position) {
					string = toString(string);
					position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
					target = baseToString(target);
					return string.slice(position, position + target.length) == target;
				}
				/**
				* Creates a compiled template function that can interpolate data properties
				* in "interpolate" delimiters, HTML-escape interpolated data properties in
				* "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
				* properties may be accessed as free variables in the template. If a setting
				* object is given, it takes precedence over `_.templateSettings` values.
				*
				* **Security:** `_.template` is insecure and should not be used. It will be
				* removed in Lodash v5. Avoid untrusted input. See
				* [threat model](https://github.com/lodash/lodash/blob/main/threat-model.md).
				*
				* **Note:** In the development build `_.template` utilizes
				* [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
				* for easier debugging.
				*
				* For more information on precompiling templates see
				* [lodash's custom builds documentation](https://lodash.com/custom-builds).
				*
				* For more information on Chrome extension sandboxes see
				* [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category String
				* @param {string} [string=''] The template string.
				* @param {Object} [options={}] The options object.
				* @param {RegExp} [options.escape=_.templateSettings.escape]
				*  The HTML "escape" delimiter.
				* @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
				*  The "evaluate" delimiter.
				* @param {Object} [options.imports=_.templateSettings.imports]
				*  An object to import into the template as free variables.
				* @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
				*  The "interpolate" delimiter.
				* @param {string} [options.sourceURL='lodash.templateSources[n]']
				*  The sourceURL of the compiled template.
				* @param {string} [options.variable='obj']
				*  The data object variable name.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {Function} Returns the compiled template function.
				* @example
				*
				* // Use the "interpolate" delimiter to create a compiled template.
				* var compiled = _.template('hello <%= user %>!');
				* compiled({ 'user': 'fred' });
				* // => 'hello fred!'
				*
				* // Use the HTML "escape" delimiter to escape data property values.
				* var compiled = _.template('<b><%- value %></b>');
				* compiled({ 'value': '<script>' });
				* // => '<b>&lt;script&gt;</b>'
				*
				* // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
				* var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
				* compiled({ 'users': ['fred', 'barney'] });
				* // => '<li>fred</li><li>barney</li>'
				*
				* // Use the internal `print` function in "evaluate" delimiters.
				* var compiled = _.template('<% print("hello " + user); %>!');
				* compiled({ 'user': 'barney' });
				* // => 'hello barney!'
				*
				* // Use the ES template literal delimiter as an "interpolate" delimiter.
				* // Disable support by replacing the "interpolate" delimiter.
				* var compiled = _.template('hello ${ user }!');
				* compiled({ 'user': 'pebbles' });
				* // => 'hello pebbles!'
				*
				* // Use backslashes to treat delimiters as plain text.
				* var compiled = _.template('<%= "\\<%- value %\\>" %>');
				* compiled({ 'value': 'ignored' });
				* // => '<%- value %>'
				*
				* // Use the `imports` option to import `jQuery` as `jq`.
				* var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
				* var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
				* compiled({ 'users': ['fred', 'barney'] });
				* // => '<li>fred</li><li>barney</li>'
				*
				* // Use the `sourceURL` option to specify a custom sourceURL for the template.
				* var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
				* compiled(data);
				* // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
				*
				* // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
				* var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
				* compiled.source;
				* // => function(data) {
				* //   var __t, __p = '';
				* //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
				* //   return __p;
				* // }
				*
				* // Use custom template delimiters.
				* _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
				* var compiled = _.template('hello {{ user }}!');
				* compiled({ 'user': 'mustache' });
				* // => 'hello mustache!'
				*
				* // Use the `source` property to inline compiled templates for meaningful
				* // line numbers in error messages and stack traces.
				* fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
				*   var JST = {\
				*     "main": ' + _.template(mainText).source + '\
				*   };\
				* ');
				*/
				function template(string, options, guard) {
					var settings = lodash.templateSettings;
					if (guard && isIterateeCall(string, options, guard)) options = undefined;
					string = toString(string);
					options = assignWith({}, options, settings, customDefaultsAssignIn);
					var imports = assignWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
					arrayEach(importsKeys, function(key) {
						if (reForbiddenIdentifierChars.test(key)) throw new Error(INVALID_TEMPL_IMPORTS_ERROR_TEXT);
					});
					var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
					var reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
					var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
					string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
						interpolateValue || (interpolateValue = esTemplateValue);
						source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
						if (escapeValue) {
							isEscaping = true;
							source += "' +\n__e(" + escapeValue + ") +\n'";
						}
						if (evaluateValue) {
							isEvaluating = true;
							source += "';\n" + evaluateValue + ";\n__p += '";
						}
						if (interpolateValue) source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
						index = offset + match.length;
						return match;
					});
					source += "';\n";
					var variable = hasOwnProperty.call(options, "variable") && options.variable;
					if (!variable) source = "with (obj) {\n" + source + "\n}\n";
					else if (reForbiddenIdentifierChars.test(variable)) throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
					source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
					source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
					var result = attempt(function() {
						return Function(importsKeys, sourceURL + "return " + source).apply(undefined, importsValues);
					});
					result.source = source;
					if (isError(result)) throw result;
					return result;
				}
				/**
				* Converts `string`, as a whole, to lower case just like
				* [String#toLowerCase](https://mdn.io/toLowerCase).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to convert.
				* @returns {string} Returns the lower cased string.
				* @example
				*
				* _.toLower('--Foo-Bar--');
				* // => '--foo-bar--'
				*
				* _.toLower('fooBar');
				* // => 'foobar'
				*
				* _.toLower('__FOO_BAR__');
				* // => '__foo_bar__'
				*/
				function toLower(value) {
					return toString(value).toLowerCase();
				}
				/**
				* Converts `string`, as a whole, to upper case just like
				* [String#toUpperCase](https://mdn.io/toUpperCase).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to convert.
				* @returns {string} Returns the upper cased string.
				* @example
				*
				* _.toUpper('--foo-bar--');
				* // => '--FOO-BAR--'
				*
				* _.toUpper('fooBar');
				* // => 'FOOBAR'
				*
				* _.toUpper('__foo_bar__');
				* // => '__FOO_BAR__'
				*/
				function toUpper(value) {
					return toString(value).toUpperCase();
				}
				/**
				* Removes leading and trailing whitespace or specified characters from `string`.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to trim.
				* @param {string} [chars=whitespace] The characters to trim.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {string} Returns the trimmed string.
				* @example
				*
				* _.trim('  abc  ');
				* // => 'abc'
				*
				* _.trim('-_-abc-_-', '_-');
				* // => 'abc'
				*
				* _.map(['  foo  ', '  bar  '], _.trim);
				* // => ['foo', 'bar']
				*/
				function trim(string, chars, guard) {
					string = toString(string);
					if (string && (guard || chars === undefined)) return baseTrim(string);
					if (!string || !(chars = baseToString(chars))) return string;
					var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars);
					return castSlice(strSymbols, charsStartIndex(strSymbols, chrSymbols), charsEndIndex(strSymbols, chrSymbols) + 1).join("");
				}
				/**
				* Removes trailing whitespace or specified characters from `string`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to trim.
				* @param {string} [chars=whitespace] The characters to trim.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {string} Returns the trimmed string.
				* @example
				*
				* _.trimEnd('  abc  ');
				* // => '  abc'
				*
				* _.trimEnd('-_-abc-_-', '_-');
				* // => '-_-abc'
				*/
				function trimEnd(string, chars, guard) {
					string = toString(string);
					if (string && (guard || chars === undefined)) return string.slice(0, trimmedEndIndex(string) + 1);
					if (!string || !(chars = baseToString(chars))) return string;
					var strSymbols = stringToArray(string);
					return castSlice(strSymbols, 0, charsEndIndex(strSymbols, stringToArray(chars)) + 1).join("");
				}
				/**
				* Removes leading whitespace or specified characters from `string`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to trim.
				* @param {string} [chars=whitespace] The characters to trim.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {string} Returns the trimmed string.
				* @example
				*
				* _.trimStart('  abc  ');
				* // => 'abc  '
				*
				* _.trimStart('-_-abc-_-', '_-');
				* // => 'abc-_-'
				*/
				function trimStart(string, chars, guard) {
					string = toString(string);
					if (string && (guard || chars === undefined)) return string.replace(reTrimStart, "");
					if (!string || !(chars = baseToString(chars))) return string;
					var strSymbols = stringToArray(string);
					return castSlice(strSymbols, charsStartIndex(strSymbols, stringToArray(chars))).join("");
				}
				/**
				* Truncates `string` if it's longer than the given maximum string length.
				* The last characters of the truncated string are replaced with the omission
				* string which defaults to "...".
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to truncate.
				* @param {Object} [options={}] The options object.
				* @param {number} [options.length=30] The maximum string length.
				* @param {string} [options.omission='...'] The string to indicate text is omitted.
				* @param {RegExp|string} [options.separator] The separator pattern to truncate to.
				* @returns {string} Returns the truncated string.
				* @example
				*
				* _.truncate('hi-diddly-ho there, neighborino');
				* // => 'hi-diddly-ho there, neighbo...'
				*
				* _.truncate('hi-diddly-ho there, neighborino', {
				*   'length': 24,
				*   'separator': ' '
				* });
				* // => 'hi-diddly-ho there,...'
				*
				* _.truncate('hi-diddly-ho there, neighborino', {
				*   'length': 24,
				*   'separator': /,? +/
				* });
				* // => 'hi-diddly-ho there...'
				*
				* _.truncate('hi-diddly-ho there, neighborino', {
				*   'omission': ' [...]'
				* });
				* // => 'hi-diddly-ho there, neig [...]'
				*/
				function truncate(string, options) {
					var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
					if (isObject(options)) {
						var separator = "separator" in options ? options.separator : separator;
						length = "length" in options ? toInteger(options.length) : length;
						omission = "omission" in options ? baseToString(options.omission) : omission;
					}
					string = toString(string);
					var strLength = string.length;
					if (hasUnicode(string)) {
						var strSymbols = stringToArray(string);
						strLength = strSymbols.length;
					}
					if (length >= strLength) return string;
					var end = length - stringSize(omission);
					if (end < 1) return omission;
					var result = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
					if (separator === undefined) return result + omission;
					if (strSymbols) end += result.length - end;
					if (isRegExp(separator)) {
						if (string.slice(end).search(separator)) {
							var match, substring = result;
							if (!separator.global) separator = RegExp(separator.source, toString(reFlags.exec(separator)) + "g");
							separator.lastIndex = 0;
							while (match = separator.exec(substring)) var newEnd = match.index;
							result = result.slice(0, newEnd === undefined ? end : newEnd);
						}
					} else if (string.indexOf(baseToString(separator), end) != end) {
						var index = result.lastIndexOf(separator);
						if (index > -1) result = result.slice(0, index);
					}
					return result + omission;
				}
				/**
				* The inverse of `_.escape`; this method converts the HTML entities
				* `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
				* their corresponding characters.
				*
				* **Note:** No other HTML entities are unescaped. To unescape additional
				* HTML entities use a third-party library like [_he_](https://mths.be/he).
				*
				* @static
				* @memberOf _
				* @since 0.6.0
				* @category String
				* @param {string} [string=''] The string to unescape.
				* @returns {string} Returns the unescaped string.
				* @example
				*
				* _.unescape('fred, barney, &amp; pebbles');
				* // => 'fred, barney, & pebbles'
				*/
				function unescape(string) {
					string = toString(string);
					return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
				}
				/**
				* Converts `string`, as space separated words, to upper case.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to convert.
				* @returns {string} Returns the upper cased string.
				* @example
				*
				* _.upperCase('--foo-bar');
				* // => 'FOO BAR'
				*
				* _.upperCase('fooBar');
				* // => 'FOO BAR'
				*
				* _.upperCase('__foo_bar__');
				* // => 'FOO BAR'
				*/
				var upperCase = createCompounder(function(result, word, index) {
					return result + (index ? " " : "") + word.toUpperCase();
				});
				/**
				* Converts the first character of `string` to upper case.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category String
				* @param {string} [string=''] The string to convert.
				* @returns {string} Returns the converted string.
				* @example
				*
				* _.upperFirst('fred');
				* // => 'Fred'
				*
				* _.upperFirst('FRED');
				* // => 'FRED'
				*/
				var upperFirst = createCaseFirst("toUpperCase");
				/**
				* Splits `string` into an array of its words.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category String
				* @param {string} [string=''] The string to inspect.
				* @param {RegExp|string} [pattern] The pattern to match words.
				* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
				* @returns {Array} Returns the words of `string`.
				* @example
				*
				* _.words('fred, barney, & pebbles');
				* // => ['fred', 'barney', 'pebbles']
				*
				* _.words('fred, barney, & pebbles', /[^, ]+/g);
				* // => ['fred', 'barney', '&', 'pebbles']
				*/
				function words(string, pattern, guard) {
					string = toString(string);
					pattern = guard ? undefined : pattern;
					if (pattern === undefined) return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
					return string.match(pattern) || [];
				}
				/**
				* Attempts to invoke `func`, returning either the result or the caught error
				* object. Any additional arguments are provided to `func` when it's invoked.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Util
				* @param {Function} func The function to attempt.
				* @param {...*} [args] The arguments to invoke `func` with.
				* @returns {*} Returns the `func` result or error object.
				* @example
				*
				* // Avoid throwing errors for invalid selectors.
				* var elements = _.attempt(function(selector) {
				*   return document.querySelectorAll(selector);
				* }, '>_>');
				*
				* if (_.isError(elements)) {
				*   elements = [];
				* }
				*/
				var attempt = baseRest(function(func, args) {
					try {
						return apply(func, undefined, args);
					} catch (e) {
						return isError(e) ? e : new Error(e);
					}
				});
				/**
				* Binds methods of an object to the object itself, overwriting the existing
				* method.
				*
				* **Note:** This method doesn't set the "length" property of bound functions.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Util
				* @param {Object} object The object to bind and assign the bound methods to.
				* @param {...(string|string[])} methodNames The object method names to bind.
				* @returns {Object} Returns `object`.
				* @example
				*
				* var view = {
				*   'label': 'docs',
				*   'click': function() {
				*     console.log('clicked ' + this.label);
				*   }
				* };
				*
				* _.bindAll(view, ['click']);
				* jQuery(element).on('click', view.click);
				* // => Logs 'clicked docs' when clicked.
				*/
				var bindAll = flatRest(function(object, methodNames) {
					arrayEach(methodNames, function(key) {
						key = toKey(key);
						baseAssignValue(object, key, bind(object[key], object));
					});
					return object;
				});
				/**
				* Creates a function that iterates over `pairs` and invokes the corresponding
				* function of the first predicate to return truthy. The predicate-function
				* pairs are invoked with the `this` binding and arguments of the created
				* function.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Util
				* @param {Array} pairs The predicate-function pairs.
				* @returns {Function} Returns the new composite function.
				* @example
				*
				* var func = _.cond([
				*   [_.matches({ 'a': 1 }),           _.constant('matches A')],
				*   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
				*   [_.stubTrue,                      _.constant('no match')]
				* ]);
				*
				* func({ 'a': 1, 'b': 2 });
				* // => 'matches A'
				*
				* func({ 'a': 0, 'b': 1 });
				* // => 'matches B'
				*
				* func({ 'a': '1', 'b': '2' });
				* // => 'no match'
				*/
				function cond(pairs) {
					var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
					pairs = !length ? [] : arrayMap(pairs, function(pair) {
						if (typeof pair[1] != "function") throw new TypeError(FUNC_ERROR_TEXT);
						return [toIteratee(pair[0]), pair[1]];
					});
					return baseRest(function(args) {
						var index = -1;
						while (++index < length) {
							var pair = pairs[index];
							if (apply(pair[0], this, args)) return apply(pair[1], this, args);
						}
					});
				}
				/**
				* Creates a function that invokes the predicate properties of `source` with
				* the corresponding property values of a given object, returning `true` if
				* all predicates return truthy, else `false`.
				*
				* **Note:** The created function is equivalent to `_.conformsTo` with
				* `source` partially applied.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Util
				* @param {Object} source The object of property predicates to conform to.
				* @returns {Function} Returns the new spec function.
				* @example
				*
				* var objects = [
				*   { 'a': 2, 'b': 1 },
				*   { 'a': 1, 'b': 2 }
				* ];
				*
				* _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
				* // => [{ 'a': 1, 'b': 2 }]
				*/
				function conforms(source) {
					return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
				}
				/**
				* Creates a function that returns `value`.
				*
				* @static
				* @memberOf _
				* @since 2.4.0
				* @category Util
				* @param {*} value The value to return from the new function.
				* @returns {Function} Returns the new constant function.
				* @example
				*
				* var objects = _.times(2, _.constant({ 'a': 1 }));
				*
				* console.log(objects);
				* // => [{ 'a': 1 }, { 'a': 1 }]
				*
				* console.log(objects[0] === objects[1]);
				* // => true
				*/
				function constant(value) {
					return function() {
						return value;
					};
				}
				/**
				* Checks `value` to determine whether a default value should be returned in
				* its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
				* or `undefined`.
				*
				* @static
				* @memberOf _
				* @since 4.14.0
				* @category Util
				* @param {*} value The value to check.
				* @param {*} defaultValue The default value.
				* @returns {*} Returns the resolved value.
				* @example
				*
				* _.defaultTo(1, 10);
				* // => 1
				*
				* _.defaultTo(undefined, 10);
				* // => 10
				*/
				function defaultTo(value, defaultValue) {
					return value == null || value !== value ? defaultValue : value;
				}
				/**
				* Creates a function that returns the result of invoking the given functions
				* with the `this` binding of the created function, where each successive
				* invocation is supplied the return value of the previous.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Util
				* @param {...(Function|Function[])} [funcs] The functions to invoke.
				* @returns {Function} Returns the new composite function.
				* @see _.flowRight
				* @example
				*
				* function square(n) {
				*   return n * n;
				* }
				*
				* var addSquare = _.flow([_.add, square]);
				* addSquare(1, 2);
				* // => 9
				*/
				var flow = createFlow();
				/**
				* This method is like `_.flow` except that it creates a function that
				* invokes the given functions from right to left.
				*
				* @static
				* @since 3.0.0
				* @memberOf _
				* @category Util
				* @param {...(Function|Function[])} [funcs] The functions to invoke.
				* @returns {Function} Returns the new composite function.
				* @see _.flow
				* @example
				*
				* function square(n) {
				*   return n * n;
				* }
				*
				* var addSquare = _.flowRight([square, _.add]);
				* addSquare(1, 2);
				* // => 9
				*/
				var flowRight = createFlow(true);
				/**
				* This method returns the first argument it receives.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Util
				* @param {*} value Any value.
				* @returns {*} Returns `value`.
				* @example
				*
				* var object = { 'a': 1 };
				*
				* console.log(_.identity(object) === object);
				* // => true
				*/
				function identity(value) {
					return value;
				}
				/**
				* Creates a function that invokes `func` with the arguments of the created
				* function. If `func` is a property name, the created function returns the
				* property value for a given element. If `func` is an array or object, the
				* created function returns `true` for elements that contain the equivalent
				* source properties, otherwise it returns `false`.
				*
				* @static
				* @since 4.0.0
				* @memberOf _
				* @category Util
				* @param {*} [func=_.identity] The value to convert to a callback.
				* @returns {Function} Returns the callback.
				* @example
				*
				* var users = [
				*   { 'user': 'barney', 'age': 36, 'active': true },
				*   { 'user': 'fred',   'age': 40, 'active': false }
				* ];
				*
				* // The `_.matches` iteratee shorthand.
				* _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
				* // => [{ 'user': 'barney', 'age': 36, 'active': true }]
				*
				* // The `_.matchesProperty` iteratee shorthand.
				* _.filter(users, _.iteratee(['user', 'fred']));
				* // => [{ 'user': 'fred', 'age': 40 }]
				*
				* // The `_.property` iteratee shorthand.
				* _.map(users, _.iteratee('user'));
				* // => ['barney', 'fred']
				*
				* // Create custom iteratee shorthands.
				* _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
				*   return !_.isRegExp(func) ? iteratee(func) : function(string) {
				*     return func.test(string);
				*   };
				* });
				*
				* _.filter(['abc', 'def'], /ef/);
				* // => ['def']
				*/
				function iteratee(func) {
					return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
				}
				/**
				* Creates a function that performs a partial deep comparison between a given
				* object and `source`, returning `true` if the given object has equivalent
				* property values, else `false`.
				*
				* **Note:** The created function is equivalent to `_.isMatch` with `source`
				* partially applied.
				*
				* Partial comparisons will match empty array and empty object `source`
				* values against any array or object value, respectively. See `_.isEqual`
				* for a list of supported value comparisons.
				*
				* **Note:** Multiple values can be checked by combining several matchers
				* using `_.overSome`
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Util
				* @param {Object} source The object of property values to match.
				* @returns {Function} Returns the new spec function.
				* @example
				*
				* var objects = [
				*   { 'a': 1, 'b': 2, 'c': 3 },
				*   { 'a': 4, 'b': 5, 'c': 6 }
				* ];
				*
				* _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
				* // => [{ 'a': 4, 'b': 5, 'c': 6 }]
				*
				* // Checking for several possible values
				* _.filter(objects, _.overSome([_.matches({ 'a': 1 }), _.matches({ 'a': 4 })]));
				* // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
				*/
				function matches(source) {
					return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
				}
				/**
				* Creates a function that performs a partial deep comparison between the
				* value at `path` of a given object to `srcValue`, returning `true` if the
				* object value is equivalent, else `false`.
				*
				* **Note:** Partial comparisons will match empty array and empty object
				* `srcValue` values against any array or object value, respectively. See
				* `_.isEqual` for a list of supported value comparisons.
				*
				* **Note:** Multiple values can be checked by combining several matchers
				* using `_.overSome`
				*
				* @static
				* @memberOf _
				* @since 3.2.0
				* @category Util
				* @param {Array|string} path The path of the property to get.
				* @param {*} srcValue The value to match.
				* @returns {Function} Returns the new spec function.
				* @example
				*
				* var objects = [
				*   { 'a': 1, 'b': 2, 'c': 3 },
				*   { 'a': 4, 'b': 5, 'c': 6 }
				* ];
				*
				* _.find(objects, _.matchesProperty('a', 4));
				* // => { 'a': 4, 'b': 5, 'c': 6 }
				*
				* // Checking for several possible values
				* _.filter(objects, _.overSome([_.matchesProperty('a', 1), _.matchesProperty('a', 4)]));
				* // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
				*/
				function matchesProperty(path, srcValue) {
					return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
				}
				/**
				* Creates a function that invokes the method at `path` of a given object.
				* Any additional arguments are provided to the invoked method.
				*
				* @static
				* @memberOf _
				* @since 3.7.0
				* @category Util
				* @param {Array|string} path The path of the method to invoke.
				* @param {...*} [args] The arguments to invoke the method with.
				* @returns {Function} Returns the new invoker function.
				* @example
				*
				* var objects = [
				*   { 'a': { 'b': _.constant(2) } },
				*   { 'a': { 'b': _.constant(1) } }
				* ];
				*
				* _.map(objects, _.method('a.b'));
				* // => [2, 1]
				*
				* _.map(objects, _.method(['a', 'b']));
				* // => [2, 1]
				*/
				var method = baseRest(function(path, args) {
					return function(object) {
						return baseInvoke(object, path, args);
					};
				});
				/**
				* The opposite of `_.method`; this method creates a function that invokes
				* the method at a given path of `object`. Any additional arguments are
				* provided to the invoked method.
				*
				* @static
				* @memberOf _
				* @since 3.7.0
				* @category Util
				* @param {Object} object The object to query.
				* @param {...*} [args] The arguments to invoke the method with.
				* @returns {Function} Returns the new invoker function.
				* @example
				*
				* var array = _.times(3, _.constant),
				*     object = { 'a': array, 'b': array, 'c': array };
				*
				* _.map(['a[2]', 'c[0]'], _.methodOf(object));
				* // => [2, 0]
				*
				* _.map([['a', '2'], ['c', '0']], _.methodOf(object));
				* // => [2, 0]
				*/
				var methodOf = baseRest(function(object, args) {
					return function(path) {
						return baseInvoke(object, path, args);
					};
				});
				/**
				* Adds all own enumerable string keyed function properties of a source
				* object to the destination object. If `object` is a function, then methods
				* are added to its prototype as well.
				*
				* **Note:** Use `_.runInContext` to create a pristine `lodash` function to
				* avoid conflicts caused by modifying the original.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Util
				* @param {Function|Object} [object=lodash] The destination object.
				* @param {Object} source The object of functions to add.
				* @param {Object} [options={}] The options object.
				* @param {boolean} [options.chain=true] Specify whether mixins are chainable.
				* @returns {Function|Object} Returns `object`.
				* @example
				*
				* function vowels(string) {
				*   return _.filter(string, function(v) {
				*     return /[aeiou]/i.test(v);
				*   });
				* }
				*
				* _.mixin({ 'vowels': vowels });
				* _.vowels('fred');
				* // => ['e']
				*
				* _('fred').vowels().value();
				* // => ['e']
				*
				* _.mixin({ 'vowels': vowels }, { 'chain': false });
				* _('fred').vowels();
				* // => ['e']
				*/
				function mixin(object, source, options) {
					var props = keys(source), methodNames = baseFunctions(source, props);
					if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
						options = source;
						source = object;
						object = this;
						methodNames = baseFunctions(source, keys(source));
					}
					var chain = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
					arrayEach(methodNames, function(methodName) {
						var func = source[methodName];
						object[methodName] = func;
						if (isFunc) object.prototype[methodName] = function() {
							var chainAll = this.__chain__;
							if (chain || chainAll) {
								var result = object(this.__wrapped__);
								(result.__actions__ = copyArray(this.__actions__)).push({
									"func": func,
									"args": arguments,
									"thisArg": object
								});
								result.__chain__ = chainAll;
								return result;
							}
							return func.apply(object, arrayPush([this.value()], arguments));
						};
					});
					return object;
				}
				/**
				* Reverts the `_` variable to its previous value and returns a reference to
				* the `lodash` function.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Util
				* @returns {Function} Returns the `lodash` function.
				* @example
				*
				* var lodash = _.noConflict();
				*/
				function noConflict() {
					if (root._ === this) root._ = oldDash;
					return this;
				}
				/**
				* This method returns `undefined`.
				*
				* @static
				* @memberOf _
				* @since 2.3.0
				* @category Util
				* @example
				*
				* _.times(2, _.noop);
				* // => [undefined, undefined]
				*/
				function noop() {}
				/**
				* Creates a function that gets the argument at index `n`. If `n` is negative,
				* the nth argument from the end is returned.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Util
				* @param {number} [n=0] The index of the argument to return.
				* @returns {Function} Returns the new pass-thru function.
				* @example
				*
				* var func = _.nthArg(1);
				* func('a', 'b', 'c', 'd');
				* // => 'b'
				*
				* var func = _.nthArg(-2);
				* func('a', 'b', 'c', 'd');
				* // => 'c'
				*/
				function nthArg(n) {
					n = toInteger(n);
					return baseRest(function(args) {
						return baseNth(args, n);
					});
				}
				/**
				* Creates a function that invokes `iteratees` with the arguments it receives
				* and returns their results.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Util
				* @param {...(Function|Function[])} [iteratees=[_.identity]]
				*  The iteratees to invoke.
				* @returns {Function} Returns the new function.
				* @example
				*
				* var func = _.over([Math.max, Math.min]);
				*
				* func(1, 2, 3, 4);
				* // => [4, 1]
				*/
				var over = createOver(arrayMap);
				/**
				* Creates a function that checks if **all** of the `predicates` return
				* truthy when invoked with the arguments it receives.
				*
				* Following shorthands are possible for providing predicates.
				* Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
				* Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Util
				* @param {...(Function|Function[])} [predicates=[_.identity]]
				*  The predicates to check.
				* @returns {Function} Returns the new function.
				* @example
				*
				* var func = _.overEvery([Boolean, isFinite]);
				*
				* func('1');
				* // => true
				*
				* func(null);
				* // => false
				*
				* func(NaN);
				* // => false
				*/
				var overEvery = createOver(arrayEvery);
				/**
				* Creates a function that checks if **any** of the `predicates` return
				* truthy when invoked with the arguments it receives.
				*
				* Following shorthands are possible for providing predicates.
				* Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
				* Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Util
				* @param {...(Function|Function[])} [predicates=[_.identity]]
				*  The predicates to check.
				* @returns {Function} Returns the new function.
				* @example
				*
				* var func = _.overSome([Boolean, isFinite]);
				*
				* func('1');
				* // => true
				*
				* func(null);
				* // => true
				*
				* func(NaN);
				* // => false
				*
				* var matchesFunc = _.overSome([{ 'a': 1 }, { 'a': 2 }])
				* var matchesPropertyFunc = _.overSome([['a', 1], ['a', 2]])
				*/
				var overSome = createOver(arraySome);
				/**
				* Creates a function that returns the value at `path` of a given object.
				*
				* @static
				* @memberOf _
				* @since 2.4.0
				* @category Util
				* @param {Array|string} path The path of the property to get.
				* @returns {Function} Returns the new accessor function.
				* @example
				*
				* var objects = [
				*   { 'a': { 'b': 2 } },
				*   { 'a': { 'b': 1 } }
				* ];
				*
				* _.map(objects, _.property('a.b'));
				* // => [2, 1]
				*
				* _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
				* // => [1, 2]
				*/
				function property(path) {
					return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
				}
				/**
				* The opposite of `_.property`; this method creates a function that returns
				* the value at a given path of `object`.
				*
				* @static
				* @memberOf _
				* @since 3.0.0
				* @category Util
				* @param {Object} object The object to query.
				* @returns {Function} Returns the new accessor function.
				* @example
				*
				* var array = [0, 1, 2],
				*     object = { 'a': array, 'b': array, 'c': array };
				*
				* _.map(['a[2]', 'c[0]'], _.propertyOf(object));
				* // => [2, 0]
				*
				* _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
				* // => [2, 0]
				*/
				function propertyOf(object) {
					return function(path) {
						return object == null ? undefined : baseGet(object, path);
					};
				}
				/**
				* Creates an array of numbers (positive and/or negative) progressing from
				* `start` up to, but not including, `end`. A step of `-1` is used if a negative
				* `start` is specified without an `end` or `step`. If `end` is not specified,
				* it's set to `start` with `start` then set to `0`.
				*
				* **Note:** JavaScript follows the IEEE-754 standard for resolving
				* floating-point values which can produce unexpected results.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Util
				* @param {number} [start=0] The start of the range.
				* @param {number} end The end of the range.
				* @param {number} [step=1] The value to increment or decrement by.
				* @returns {Array} Returns the range of numbers.
				* @see _.inRange, _.rangeRight
				* @example
				*
				* _.range(4);
				* // => [0, 1, 2, 3]
				*
				* _.range(-4);
				* // => [0, -1, -2, -3]
				*
				* _.range(1, 5);
				* // => [1, 2, 3, 4]
				*
				* _.range(0, 20, 5);
				* // => [0, 5, 10, 15]
				*
				* _.range(0, -4, -1);
				* // => [0, -1, -2, -3]
				*
				* _.range(1, 4, 0);
				* // => [1, 1, 1]
				*
				* _.range(0);
				* // => []
				*/
				var range = createRange();
				/**
				* This method is like `_.range` except that it populates values in
				* descending order.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Util
				* @param {number} [start=0] The start of the range.
				* @param {number} end The end of the range.
				* @param {number} [step=1] The value to increment or decrement by.
				* @returns {Array} Returns the range of numbers.
				* @see _.inRange, _.range
				* @example
				*
				* _.rangeRight(4);
				* // => [3, 2, 1, 0]
				*
				* _.rangeRight(-4);
				* // => [-3, -2, -1, 0]
				*
				* _.rangeRight(1, 5);
				* // => [4, 3, 2, 1]
				*
				* _.rangeRight(0, 20, 5);
				* // => [15, 10, 5, 0]
				*
				* _.rangeRight(0, -4, -1);
				* // => [-3, -2, -1, 0]
				*
				* _.rangeRight(1, 4, 0);
				* // => [1, 1, 1]
				*
				* _.rangeRight(0);
				* // => []
				*/
				var rangeRight = createRange(true);
				/**
				* This method returns a new empty array.
				*
				* @static
				* @memberOf _
				* @since 4.13.0
				* @category Util
				* @returns {Array} Returns the new empty array.
				* @example
				*
				* var arrays = _.times(2, _.stubArray);
				*
				* console.log(arrays);
				* // => [[], []]
				*
				* console.log(arrays[0] === arrays[1]);
				* // => false
				*/
				function stubArray() {
					return [];
				}
				/**
				* This method returns `false`.
				*
				* @static
				* @memberOf _
				* @since 4.13.0
				* @category Util
				* @returns {boolean} Returns `false`.
				* @example
				*
				* _.times(2, _.stubFalse);
				* // => [false, false]
				*/
				function stubFalse() {
					return false;
				}
				/**
				* This method returns a new empty object.
				*
				* @static
				* @memberOf _
				* @since 4.13.0
				* @category Util
				* @returns {Object} Returns the new empty object.
				* @example
				*
				* var objects = _.times(2, _.stubObject);
				*
				* console.log(objects);
				* // => [{}, {}]
				*
				* console.log(objects[0] === objects[1]);
				* // => false
				*/
				function stubObject() {
					return {};
				}
				/**
				* This method returns an empty string.
				*
				* @static
				* @memberOf _
				* @since 4.13.0
				* @category Util
				* @returns {string} Returns the empty string.
				* @example
				*
				* _.times(2, _.stubString);
				* // => ['', '']
				*/
				function stubString() {
					return "";
				}
				/**
				* This method returns `true`.
				*
				* @static
				* @memberOf _
				* @since 4.13.0
				* @category Util
				* @returns {boolean} Returns `true`.
				* @example
				*
				* _.times(2, _.stubTrue);
				* // => [true, true]
				*/
				function stubTrue() {
					return true;
				}
				/**
				* Invokes the iteratee `n` times, returning an array of the results of
				* each invocation. The iteratee is invoked with one argument; (index).
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Util
				* @param {number} n The number of times to invoke `iteratee`.
				* @param {Function} [iteratee=_.identity] The function invoked per iteration.
				* @returns {Array} Returns the array of results.
				* @example
				*
				* _.times(3, String);
				* // => ['0', '1', '2']
				*
				*  _.times(4, _.constant(0));
				* // => [0, 0, 0, 0]
				*/
				function times(n, iteratee) {
					n = toInteger(n);
					if (n < 1 || n > MAX_SAFE_INTEGER) return [];
					var index = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
					iteratee = getIteratee(iteratee);
					n -= MAX_ARRAY_LENGTH;
					var result = baseTimes(length, iteratee);
					while (++index < n) iteratee(index);
					return result;
				}
				/**
				* Converts `value` to a property path array.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Util
				* @param {*} value The value to convert.
				* @returns {Array} Returns the new property path array.
				* @example
				*
				* _.toPath('a.b.c');
				* // => ['a', 'b', 'c']
				*
				* _.toPath('a[0].b.c');
				* // => ['a', '0', 'b', 'c']
				*/
				function toPath(value) {
					if (isArray(value)) return arrayMap(value, toKey);
					return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
				}
				/**
				* Generates a unique ID. If `prefix` is given, the ID is appended to it.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Util
				* @param {string} [prefix=''] The value to prefix the ID with.
				* @returns {string} Returns the unique ID.
				* @example
				*
				* _.uniqueId('contact_');
				* // => 'contact_104'
				*
				* _.uniqueId();
				* // => '105'
				*/
				function uniqueId(prefix) {
					var id = ++idCounter;
					return toString(prefix) + id;
				}
				/**
				* Adds two numbers.
				*
				* @static
				* @memberOf _
				* @since 3.4.0
				* @category Math
				* @param {number} augend The first number in an addition.
				* @param {number} addend The second number in an addition.
				* @returns {number} Returns the total.
				* @example
				*
				* _.add(6, 4);
				* // => 10
				*/
				var add = createMathOperation(function(augend, addend) {
					return augend + addend;
				}, 0);
				/**
				* Computes `number` rounded up to `precision`.
				*
				* @static
				* @memberOf _
				* @since 3.10.0
				* @category Math
				* @param {number} number The number to round up.
				* @param {number} [precision=0] The precision to round up to.
				* @returns {number} Returns the rounded up number.
				* @example
				*
				* _.ceil(4.006);
				* // => 5
				*
				* _.ceil(6.004, 2);
				* // => 6.01
				*
				* _.ceil(6040, -2);
				* // => 6100
				*/
				var ceil = createRound("ceil");
				/**
				* Divide two numbers.
				*
				* @static
				* @memberOf _
				* @since 4.7.0
				* @category Math
				* @param {number} dividend The first number in a division.
				* @param {number} divisor The second number in a division.
				* @returns {number} Returns the quotient.
				* @example
				*
				* _.divide(6, 4);
				* // => 1.5
				*/
				var divide = createMathOperation(function(dividend, divisor) {
					return dividend / divisor;
				}, 1);
				/**
				* Computes `number` rounded down to `precision`.
				*
				* @static
				* @memberOf _
				* @since 3.10.0
				* @category Math
				* @param {number} number The number to round down.
				* @param {number} [precision=0] The precision to round down to.
				* @returns {number} Returns the rounded down number.
				* @example
				*
				* _.floor(4.006);
				* // => 4
				*
				* _.floor(0.046, 2);
				* // => 0.04
				*
				* _.floor(4060, -2);
				* // => 4000
				*/
				var floor = createRound("floor");
				/**
				* Computes the maximum value of `array`. If `array` is empty or falsey,
				* `undefined` is returned.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Math
				* @param {Array} array The array to iterate over.
				* @returns {*} Returns the maximum value.
				* @example
				*
				* _.max([4, 2, 8, 6]);
				* // => 8
				*
				* _.max([]);
				* // => undefined
				*/
				function max(array) {
					return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
				}
				/**
				* This method is like `_.max` except that it accepts `iteratee` which is
				* invoked for each element in `array` to generate the criterion by which
				* the value is ranked. The iteratee is invoked with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Math
				* @param {Array} array The array to iterate over.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {*} Returns the maximum value.
				* @example
				*
				* var objects = [{ 'n': 1 }, { 'n': 2 }];
				*
				* _.maxBy(objects, function(o) { return o.n; });
				* // => { 'n': 2 }
				*
				* // The `_.property` iteratee shorthand.
				* _.maxBy(objects, 'n');
				* // => { 'n': 2 }
				*/
				function maxBy(array, iteratee) {
					return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseGt) : undefined;
				}
				/**
				* Computes the mean of the values in `array`.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Math
				* @param {Array} array The array to iterate over.
				* @returns {number} Returns the mean.
				* @example
				*
				* _.mean([4, 2, 8, 6]);
				* // => 5
				*/
				function mean(array) {
					return baseMean(array, identity);
				}
				/**
				* This method is like `_.mean` except that it accepts `iteratee` which is
				* invoked for each element in `array` to generate the value to be averaged.
				* The iteratee is invoked with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 4.7.0
				* @category Math
				* @param {Array} array The array to iterate over.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {number} Returns the mean.
				* @example
				*
				* var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
				*
				* _.meanBy(objects, function(o) { return o.n; });
				* // => 5
				*
				* // The `_.property` iteratee shorthand.
				* _.meanBy(objects, 'n');
				* // => 5
				*/
				function meanBy(array, iteratee) {
					return baseMean(array, getIteratee(iteratee, 2));
				}
				/**
				* Computes the minimum value of `array`. If `array` is empty or falsey,
				* `undefined` is returned.
				*
				* @static
				* @since 0.1.0
				* @memberOf _
				* @category Math
				* @param {Array} array The array to iterate over.
				* @returns {*} Returns the minimum value.
				* @example
				*
				* _.min([4, 2, 8, 6]);
				* // => 2
				*
				* _.min([]);
				* // => undefined
				*/
				function min(array) {
					return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
				}
				/**
				* This method is like `_.min` except that it accepts `iteratee` which is
				* invoked for each element in `array` to generate the criterion by which
				* the value is ranked. The iteratee is invoked with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Math
				* @param {Array} array The array to iterate over.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {*} Returns the minimum value.
				* @example
				*
				* var objects = [{ 'n': 1 }, { 'n': 2 }];
				*
				* _.minBy(objects, function(o) { return o.n; });
				* // => { 'n': 1 }
				*
				* // The `_.property` iteratee shorthand.
				* _.minBy(objects, 'n');
				* // => { 'n': 1 }
				*/
				function minBy(array, iteratee) {
					return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseLt) : undefined;
				}
				/**
				* Multiply two numbers.
				*
				* @static
				* @memberOf _
				* @since 4.7.0
				* @category Math
				* @param {number} multiplier The first number in a multiplication.
				* @param {number} multiplicand The second number in a multiplication.
				* @returns {number} Returns the product.
				* @example
				*
				* _.multiply(6, 4);
				* // => 24
				*/
				var multiply = createMathOperation(function(multiplier, multiplicand) {
					return multiplier * multiplicand;
				}, 1);
				/**
				* Computes `number` rounded to `precision`.
				*
				* @static
				* @memberOf _
				* @since 3.10.0
				* @category Math
				* @param {number} number The number to round.
				* @param {number} [precision=0] The precision to round to.
				* @returns {number} Returns the rounded number.
				* @example
				*
				* _.round(4.006);
				* // => 4
				*
				* _.round(4.006, 2);
				* // => 4.01
				*
				* _.round(4060, -2);
				* // => 4100
				*/
				var round = createRound("round");
				/**
				* Subtract two numbers.
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Math
				* @param {number} minuend The first number in a subtraction.
				* @param {number} subtrahend The second number in a subtraction.
				* @returns {number} Returns the difference.
				* @example
				*
				* _.subtract(6, 4);
				* // => 2
				*/
				var subtract = createMathOperation(function(minuend, subtrahend) {
					return minuend - subtrahend;
				}, 0);
				/**
				* Computes the sum of the values in `array`.
				*
				* @static
				* @memberOf _
				* @since 3.4.0
				* @category Math
				* @param {Array} array The array to iterate over.
				* @returns {number} Returns the sum.
				* @example
				*
				* _.sum([4, 2, 8, 6]);
				* // => 20
				*/
				function sum(array) {
					return array && array.length ? baseSum(array, identity) : 0;
				}
				/**
				* This method is like `_.sum` except that it accepts `iteratee` which is
				* invoked for each element in `array` to generate the value to be summed.
				* The iteratee is invoked with one argument: (value).
				*
				* @static
				* @memberOf _
				* @since 4.0.0
				* @category Math
				* @param {Array} array The array to iterate over.
				* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
				* @returns {number} Returns the sum.
				* @example
				*
				* var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
				*
				* _.sumBy(objects, function(o) { return o.n; });
				* // => 20
				*
				* // The `_.property` iteratee shorthand.
				* _.sumBy(objects, 'n');
				* // => 20
				*/
				function sumBy(array, iteratee) {
					return array && array.length ? baseSum(array, getIteratee(iteratee, 2)) : 0;
				}
				lodash.after = after;
				lodash.ary = ary;
				lodash.assign = assign;
				lodash.assignIn = assignIn;
				lodash.assignInWith = assignInWith;
				lodash.assignWith = assignWith;
				lodash.at = at;
				lodash.before = before;
				lodash.bind = bind;
				lodash.bindAll = bindAll;
				lodash.bindKey = bindKey;
				lodash.castArray = castArray;
				lodash.chain = chain;
				lodash.chunk = chunk;
				lodash.compact = compact;
				lodash.concat = concat;
				lodash.cond = cond;
				lodash.conforms = conforms;
				lodash.constant = constant;
				lodash.countBy = countBy;
				lodash.create = create;
				lodash.curry = curry;
				lodash.curryRight = curryRight;
				lodash.debounce = debounce;
				lodash.defaults = defaults;
				lodash.defaultsDeep = defaultsDeep;
				lodash.defer = defer;
				lodash.delay = delay;
				lodash.difference = difference;
				lodash.differenceBy = differenceBy;
				lodash.differenceWith = differenceWith;
				lodash.drop = drop;
				lodash.dropRight = dropRight;
				lodash.dropRightWhile = dropRightWhile;
				lodash.dropWhile = dropWhile;
				lodash.fill = fill;
				lodash.filter = filter;
				lodash.flatMap = flatMap;
				lodash.flatMapDeep = flatMapDeep;
				lodash.flatMapDepth = flatMapDepth;
				lodash.flatten = flatten;
				lodash.flattenDeep = flattenDeep;
				lodash.flattenDepth = flattenDepth;
				lodash.flip = flip;
				lodash.flow = flow;
				lodash.flowRight = flowRight;
				lodash.fromPairs = fromPairs;
				lodash.functions = functions;
				lodash.functionsIn = functionsIn;
				lodash.groupBy = groupBy;
				lodash.initial = initial;
				lodash.intersection = intersection;
				lodash.intersectionBy = intersectionBy;
				lodash.intersectionWith = intersectionWith;
				lodash.invert = invert;
				lodash.invertBy = invertBy;
				lodash.invokeMap = invokeMap;
				lodash.iteratee = iteratee;
				lodash.keyBy = keyBy;
				lodash.keys = keys;
				lodash.keysIn = keysIn;
				lodash.map = map;
				lodash.mapKeys = mapKeys;
				lodash.mapValues = mapValues;
				lodash.matches = matches;
				lodash.matchesProperty = matchesProperty;
				lodash.memoize = memoize;
				lodash.merge = merge;
				lodash.mergeWith = mergeWith;
				lodash.method = method;
				lodash.methodOf = methodOf;
				lodash.mixin = mixin;
				lodash.negate = negate;
				lodash.nthArg = nthArg;
				lodash.omit = omit;
				lodash.omitBy = omitBy;
				lodash.once = once;
				lodash.orderBy = orderBy;
				lodash.over = over;
				lodash.overArgs = overArgs;
				lodash.overEvery = overEvery;
				lodash.overSome = overSome;
				lodash.partial = partial;
				lodash.partialRight = partialRight;
				lodash.partition = partition;
				lodash.pick = pick;
				lodash.pickBy = pickBy;
				lodash.property = property;
				lodash.propertyOf = propertyOf;
				lodash.pull = pull;
				lodash.pullAll = pullAll;
				lodash.pullAllBy = pullAllBy;
				lodash.pullAllWith = pullAllWith;
				lodash.pullAt = pullAt;
				lodash.range = range;
				lodash.rangeRight = rangeRight;
				lodash.rearg = rearg;
				lodash.reject = reject;
				lodash.remove = remove;
				lodash.rest = rest;
				lodash.reverse = reverse;
				lodash.sampleSize = sampleSize;
				lodash.set = set;
				lodash.setWith = setWith;
				lodash.shuffle = shuffle;
				lodash.slice = slice;
				lodash.sortBy = sortBy;
				lodash.sortedUniq = sortedUniq;
				lodash.sortedUniqBy = sortedUniqBy;
				lodash.split = split;
				lodash.spread = spread;
				lodash.tail = tail;
				lodash.take = take;
				lodash.takeRight = takeRight;
				lodash.takeRightWhile = takeRightWhile;
				lodash.takeWhile = takeWhile;
				lodash.tap = tap;
				lodash.throttle = throttle;
				lodash.thru = thru;
				lodash.toArray = toArray;
				lodash.toPairs = toPairs;
				lodash.toPairsIn = toPairsIn;
				lodash.toPath = toPath;
				lodash.toPlainObject = toPlainObject;
				lodash.transform = transform;
				lodash.unary = unary;
				lodash.union = union;
				lodash.unionBy = unionBy;
				lodash.unionWith = unionWith;
				lodash.uniq = uniq;
				lodash.uniqBy = uniqBy;
				lodash.uniqWith = uniqWith;
				lodash.unset = unset;
				lodash.unzip = unzip;
				lodash.unzipWith = unzipWith;
				lodash.update = update;
				lodash.updateWith = updateWith;
				lodash.values = values;
				lodash.valuesIn = valuesIn;
				lodash.without = without;
				lodash.words = words;
				lodash.wrap = wrap;
				lodash.xor = xor;
				lodash.xorBy = xorBy;
				lodash.xorWith = xorWith;
				lodash.zip = zip;
				lodash.zipObject = zipObject;
				lodash.zipObjectDeep = zipObjectDeep;
				lodash.zipWith = zipWith;
				lodash.entries = toPairs;
				lodash.entriesIn = toPairsIn;
				lodash.extend = assignIn;
				lodash.extendWith = assignInWith;
				mixin(lodash, lodash);
				lodash.add = add;
				lodash.attempt = attempt;
				lodash.camelCase = camelCase;
				lodash.capitalize = capitalize;
				lodash.ceil = ceil;
				lodash.clamp = clamp;
				lodash.clone = clone;
				lodash.cloneDeep = cloneDeep;
				lodash.cloneDeepWith = cloneDeepWith;
				lodash.cloneWith = cloneWith;
				lodash.conformsTo = conformsTo;
				lodash.deburr = deburr;
				lodash.defaultTo = defaultTo;
				lodash.divide = divide;
				lodash.endsWith = endsWith;
				lodash.eq = eq;
				lodash.escape = escape;
				lodash.escapeRegExp = escapeRegExp;
				lodash.every = every;
				lodash.find = find;
				lodash.findIndex = findIndex;
				lodash.findKey = findKey;
				lodash.findLast = findLast;
				lodash.findLastIndex = findLastIndex;
				lodash.findLastKey = findLastKey;
				lodash.floor = floor;
				lodash.forEach = forEach;
				lodash.forEachRight = forEachRight;
				lodash.forIn = forIn;
				lodash.forInRight = forInRight;
				lodash.forOwn = forOwn;
				lodash.forOwnRight = forOwnRight;
				lodash.get = get;
				lodash.gt = gt;
				lodash.gte = gte;
				lodash.has = has;
				lodash.hasIn = hasIn;
				lodash.head = head;
				lodash.identity = identity;
				lodash.includes = includes;
				lodash.indexOf = indexOf;
				lodash.inRange = inRange;
				lodash.invoke = invoke;
				lodash.isArguments = isArguments;
				lodash.isArray = isArray;
				lodash.isArrayBuffer = isArrayBuffer;
				lodash.isArrayLike = isArrayLike;
				lodash.isArrayLikeObject = isArrayLikeObject;
				lodash.isBoolean = isBoolean;
				lodash.isBuffer = isBuffer;
				lodash.isDate = isDate;
				lodash.isElement = isElement;
				lodash.isEmpty = isEmpty;
				lodash.isEqual = isEqual;
				lodash.isEqualWith = isEqualWith;
				lodash.isError = isError;
				lodash.isFinite = isFinite;
				lodash.isFunction = isFunction;
				lodash.isInteger = isInteger;
				lodash.isLength = isLength;
				lodash.isMap = isMap;
				lodash.isMatch = isMatch;
				lodash.isMatchWith = isMatchWith;
				lodash.isNaN = isNaN;
				lodash.isNative = isNative;
				lodash.isNil = isNil;
				lodash.isNull = isNull;
				lodash.isNumber = isNumber;
				lodash.isObject = isObject;
				lodash.isObjectLike = isObjectLike;
				lodash.isPlainObject = isPlainObject;
				lodash.isRegExp = isRegExp;
				lodash.isSafeInteger = isSafeInteger;
				lodash.isSet = isSet;
				lodash.isString = isString;
				lodash.isSymbol = isSymbol;
				lodash.isTypedArray = isTypedArray;
				lodash.isUndefined = isUndefined;
				lodash.isWeakMap = isWeakMap;
				lodash.isWeakSet = isWeakSet;
				lodash.join = join;
				lodash.kebabCase = kebabCase;
				lodash.last = last;
				lodash.lastIndexOf = lastIndexOf;
				lodash.lowerCase = lowerCase;
				lodash.lowerFirst = lowerFirst;
				lodash.lt = lt;
				lodash.lte = lte;
				lodash.max = max;
				lodash.maxBy = maxBy;
				lodash.mean = mean;
				lodash.meanBy = meanBy;
				lodash.min = min;
				lodash.minBy = minBy;
				lodash.stubArray = stubArray;
				lodash.stubFalse = stubFalse;
				lodash.stubObject = stubObject;
				lodash.stubString = stubString;
				lodash.stubTrue = stubTrue;
				lodash.multiply = multiply;
				lodash.nth = nth;
				lodash.noConflict = noConflict;
				lodash.noop = noop;
				lodash.now = now;
				lodash.pad = pad;
				lodash.padEnd = padEnd;
				lodash.padStart = padStart;
				lodash.parseInt = parseInt;
				lodash.random = random;
				lodash.reduce = reduce;
				lodash.reduceRight = reduceRight;
				lodash.repeat = repeat;
				lodash.replace = replace;
				lodash.result = result;
				lodash.round = round;
				lodash.runInContext = runInContext;
				lodash.sample = sample;
				lodash.size = size;
				lodash.snakeCase = snakeCase;
				lodash.some = some;
				lodash.sortedIndex = sortedIndex;
				lodash.sortedIndexBy = sortedIndexBy;
				lodash.sortedIndexOf = sortedIndexOf;
				lodash.sortedLastIndex = sortedLastIndex;
				lodash.sortedLastIndexBy = sortedLastIndexBy;
				lodash.sortedLastIndexOf = sortedLastIndexOf;
				lodash.startCase = startCase;
				lodash.startsWith = startsWith;
				lodash.subtract = subtract;
				lodash.sum = sum;
				lodash.sumBy = sumBy;
				lodash.template = template;
				lodash.times = times;
				lodash.toFinite = toFinite;
				lodash.toInteger = toInteger;
				lodash.toLength = toLength;
				lodash.toLower = toLower;
				lodash.toNumber = toNumber;
				lodash.toSafeInteger = toSafeInteger;
				lodash.toString = toString;
				lodash.toUpper = toUpper;
				lodash.trim = trim;
				lodash.trimEnd = trimEnd;
				lodash.trimStart = trimStart;
				lodash.truncate = truncate;
				lodash.unescape = unescape;
				lodash.uniqueId = uniqueId;
				lodash.upperCase = upperCase;
				lodash.upperFirst = upperFirst;
				lodash.each = forEach;
				lodash.eachRight = forEachRight;
				lodash.first = head;
				mixin(lodash, function() {
					var source = {};
					baseForOwn(lodash, function(func, methodName) {
						if (!hasOwnProperty.call(lodash.prototype, methodName)) source[methodName] = func;
					});
					return source;
				}(), { "chain": false });
				/**
				* The semantic version number.
				*
				* @static
				* @memberOf _
				* @type {string}
				*/
				lodash.VERSION = VERSION;
				arrayEach([
					"bind",
					"bindKey",
					"curry",
					"curryRight",
					"partial",
					"partialRight"
				], function(methodName) {
					lodash[methodName].placeholder = lodash;
				});
				arrayEach(["drop", "take"], function(methodName, index) {
					LazyWrapper.prototype[methodName] = function(n) {
						n = n === undefined ? 1 : nativeMax(toInteger(n), 0);
						var result = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
						if (result.__filtered__) result.__takeCount__ = nativeMin(n, result.__takeCount__);
						else result.__views__.push({
							"size": nativeMin(n, MAX_ARRAY_LENGTH),
							"type": methodName + (result.__dir__ < 0 ? "Right" : "")
						});
						return result;
					};
					LazyWrapper.prototype[methodName + "Right"] = function(n) {
						return this.reverse()[methodName](n).reverse();
					};
				});
				arrayEach([
					"filter",
					"map",
					"takeWhile"
				], function(methodName, index) {
					var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
					LazyWrapper.prototype[methodName] = function(iteratee) {
						var result = this.clone();
						result.__iteratees__.push({
							"iteratee": getIteratee(iteratee, 3),
							"type": type
						});
						result.__filtered__ = result.__filtered__ || isFilter;
						return result;
					};
				});
				arrayEach(["head", "last"], function(methodName, index) {
					var takeName = "take" + (index ? "Right" : "");
					LazyWrapper.prototype[methodName] = function() {
						return this[takeName](1).value()[0];
					};
				});
				arrayEach(["initial", "tail"], function(methodName, index) {
					var dropName = "drop" + (index ? "" : "Right");
					LazyWrapper.prototype[methodName] = function() {
						return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
					};
				});
				LazyWrapper.prototype.compact = function() {
					return this.filter(identity);
				};
				LazyWrapper.prototype.find = function(predicate) {
					return this.filter(predicate).head();
				};
				LazyWrapper.prototype.findLast = function(predicate) {
					return this.reverse().find(predicate);
				};
				LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
					if (typeof path == "function") return new LazyWrapper(this);
					return this.map(function(value) {
						return baseInvoke(value, path, args);
					});
				});
				LazyWrapper.prototype.reject = function(predicate) {
					return this.filter(negate(getIteratee(predicate)));
				};
				LazyWrapper.prototype.slice = function(start, end) {
					start = toInteger(start);
					var result = this;
					if (result.__filtered__ && (start > 0 || end < 0)) return new LazyWrapper(result);
					if (start < 0) result = result.takeRight(-start);
					else if (start) result = result.drop(start);
					if (end !== undefined) {
						end = toInteger(end);
						result = end < 0 ? result.dropRight(-end) : result.take(end - start);
					}
					return result;
				};
				LazyWrapper.prototype.takeRightWhile = function(predicate) {
					return this.reverse().takeWhile(predicate).reverse();
				};
				LazyWrapper.prototype.toArray = function() {
					return this.take(MAX_ARRAY_LENGTH);
				};
				baseForOwn(LazyWrapper.prototype, function(func, methodName) {
					var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
					if (!lodashFunc) return;
					lodash.prototype[methodName] = function() {
						var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee = args[0], useLazy = isLazy || isArray(value);
						var interceptor = function(value) {
							var result = lodashFunc.apply(lodash, arrayPush([value], args));
							return isTaker && chainAll ? result[0] : result;
						};
						if (useLazy && checkIteratee && typeof iteratee == "function" && iteratee.length != 1) isLazy = useLazy = false;
						var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
						if (!retUnwrapped && useLazy) {
							value = onlyLazy ? value : new LazyWrapper(this);
							var result = func.apply(value, args);
							result.__actions__.push({
								"func": thru,
								"args": [interceptor],
								"thisArg": undefined
							});
							return new LodashWrapper(result, chainAll);
						}
						if (isUnwrapped && onlyLazy) return func.apply(this, args);
						result = this.thru(interceptor);
						return isUnwrapped ? isTaker ? result.value()[0] : result.value() : result;
					};
				});
				arrayEach([
					"pop",
					"push",
					"shift",
					"sort",
					"splice",
					"unshift"
				], function(methodName) {
					var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
					lodash.prototype[methodName] = function() {
						var args = arguments;
						if (retUnwrapped && !this.__chain__) {
							var value = this.value();
							return func.apply(isArray(value) ? value : [], args);
						}
						return this[chainName](function(value) {
							return func.apply(isArray(value) ? value : [], args);
						});
					};
				});
				baseForOwn(LazyWrapper.prototype, function(func, methodName) {
					var lodashFunc = lodash[methodName];
					if (lodashFunc) {
						var key = lodashFunc.name + "";
						if (!hasOwnProperty.call(realNames, key)) realNames[key] = [];
						realNames[key].push({
							"name": methodName,
							"func": lodashFunc
						});
					}
				});
				realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{
					"name": "wrapper",
					"func": undefined
				}];
				LazyWrapper.prototype.clone = lazyClone;
				LazyWrapper.prototype.reverse = lazyReverse;
				LazyWrapper.prototype.value = lazyValue;
				lodash.prototype.at = wrapperAt;
				lodash.prototype.chain = wrapperChain;
				lodash.prototype.commit = wrapperCommit;
				lodash.prototype.next = wrapperNext;
				lodash.prototype.plant = wrapperPlant;
				lodash.prototype.reverse = wrapperReverse;
				lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
				lodash.prototype.first = lodash.prototype.head;
				if (symIterator) lodash.prototype[symIterator] = wrapperToIterator;
				return lodash;
			})();
			if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
				root._ = _;
				define(function() {
					return _;
				});
			} else if (freeModule) {
				(freeModule.exports = _)._ = _;
				freeExports._ = _;
			} else root._ = _;
		}).call(exports);
	}));
	//#endregion
	//#region node_modules/sweetalert2/dist/sweetalert2.all.js
	var require_sweetalert2_all = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		/*!
		* sweetalert2 v11.26.25
		* Released under the MIT License.
		*/
		(function(global, factory) {
			typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Sweetalert2 = factory());
		})(exports, (function() {
			"use strict";
			function _assertClassBrand(e, t, n) {
				if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
				throw new TypeError("Private element is not present on this object");
			}
			function _checkPrivateRedeclaration(e, t) {
				if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
			}
			function _classPrivateFieldGet2(s, a) {
				return s.get(_assertClassBrand(s, a));
			}
			function _classPrivateFieldInitSpec(e, t, a) {
				_checkPrivateRedeclaration(e, t), t.set(e, a);
			}
			function _classPrivateFieldSet2(s, a, r) {
				return s.set(_assertClassBrand(s, a), r), r;
			}
			const RESTORE_FOCUS_TIMEOUT = 100;
			/** @type {GlobalState} */
			const globalState = {};
			const focusPreviousActiveElement = () => {
				if (globalState.previousActiveElement instanceof HTMLElement) {
					globalState.previousActiveElement.focus();
					globalState.previousActiveElement = null;
				} else if (document.body) document.body.focus();
			};
			/**
			* Restore previous active (focused) element
			*
			* @param {boolean} returnFocus
			* @returns {Promise<void>}
			*/
			const restoreActiveElement = (returnFocus) => {
				return new Promise((resolve) => {
					if (!returnFocus) return resolve();
					const x = window.scrollX;
					const y = window.scrollY;
					globalState.restoreFocusTimeout = setTimeout(() => {
						focusPreviousActiveElement();
						resolve();
					}, RESTORE_FOCUS_TIMEOUT);
					window.scrollTo(x, y);
				});
			};
			const swalPrefix = "swal2-";
			const swalClasses = [
				"container",
				"shown",
				"height-auto",
				"iosfix",
				"popup",
				"modal",
				"no-backdrop",
				"no-transition",
				"toast",
				"toast-shown",
				"show",
				"hide",
				"close",
				"title",
				"html-container",
				"actions",
				"confirm",
				"deny",
				"cancel",
				"footer",
				"icon",
				"icon-content",
				"image",
				"input",
				"file",
				"range",
				"select",
				"radio",
				"checkbox",
				"label",
				"textarea",
				"inputerror",
				"input-label",
				"validation-message",
				"progress-steps",
				"active-progress-step",
				"progress-step",
				"progress-step-line",
				"loader",
				"loading",
				"styled",
				"top",
				"top-start",
				"top-end",
				"top-left",
				"top-right",
				"center",
				"center-start",
				"center-end",
				"center-left",
				"center-right",
				"bottom",
				"bottom-start",
				"bottom-end",
				"bottom-left",
				"bottom-right",
				"grow-row",
				"grow-column",
				"grow-fullscreen",
				"rtl",
				"timer-progress-bar",
				"timer-progress-bar-container",
				"scrollbar-measure",
				"icon-success",
				"icon-warning",
				"icon-info",
				"icon-question",
				"icon-error",
				"draggable",
				"dragging"
			].reduce(
				(acc, className) => {
					acc[className] = swalPrefix + className;
					return acc;
				},
				/** @type {SwalClasses} */
				{}
			);
			const iconTypes = [
				"success",
				"warning",
				"info",
				"question",
				"error"
			].reduce(
				(acc, icon) => {
					acc[icon] = swalPrefix + icon;
					return acc;
				},
				/** @type {SwalIcons} */
				{}
			);
			const consolePrefix = "SweetAlert2:";
			/**
			* Capitalize the first letter of a string
			*
			* @param {string} str
			* @returns {string}
			*/
			const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
			/**
			* Standardize console warnings
			*
			* @param {string | string[]} message
			*/
			const warn = (message) => {
				console.warn(`${consolePrefix} ${typeof message === "object" ? message.join(" ") : message}`);
			};
			/**
			* Standardize console errors
			*
			* @param {string} message
			*/
			const error = (message) => {
				console.error(`${consolePrefix} ${message}`);
			};
			/**
			* Private global state for `warnOnce`
			*
			* @type {string[]}
			* @private
			*/
			const previousWarnOnceMessages = [];
			/**
			* Show a console warning, but only if it hasn't already been shown
			*
			* @param {string} message
			*/
			const warnOnce = (message) => {
				if (!previousWarnOnceMessages.includes(message)) {
					previousWarnOnceMessages.push(message);
					warn(message);
				}
			};
			/**
			* Show a one-time console warning about deprecated params/methods
			*
			* @param {string} deprecatedParam
			* @param {string?} useInstead
			*/
			const warnAboutDeprecation = (deprecatedParam, useInstead = null) => {
				warnOnce(`"${deprecatedParam}" is deprecated and will be removed in the next major release.${useInstead ? ` Use "${useInstead}" instead.` : ""}`);
			};
			/**
			* If `arg` is a function, call it (with no arguments or context) and return the result.
			* Otherwise, just pass the value through
			*
			* @param {(() => *) | *} arg
			* @returns {*}
			*/
			const callIfFunction = (arg) => typeof arg === "function" ? arg() : arg;
			/**
			* @param {*} arg
			* @returns {boolean}
			*/
			const hasToPromiseFn = (arg) => arg && typeof arg.toPromise === "function";
			/**
			* @param {*} arg
			* @returns {Promise<*>}
			*/
			const asPromise = (arg) => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
			/**
			* @param {*} arg
			* @returns {boolean}
			*/
			const isPromise = (arg) => arg && Promise.resolve(arg) === arg;
			/**
			* @returns {boolean}
			*/
			const isFirefox = () => navigator.userAgent.includes("Firefox");
			/**
			* Gets the popup container which contains the backdrop and the popup itself.
			*
			* @returns {HTMLElement | null}
			*/
			const getContainer = () => document.body.querySelector(`.${swalClasses.container}`);
			/**
			* @param {string} selectorString
			* @returns {HTMLElement | null}
			*/
			const elementBySelector = (selectorString) => {
				const container = getContainer();
				return container ? container.querySelector(selectorString) : null;
			};
			/**
			* @param {string} className
			* @returns {HTMLElement | null}
			*/
			const elementByClass = (className) => {
				return elementBySelector(`.${className}`);
			};
			/**
			* @returns {HTMLElement | null}
			*/
			const getPopup = () => elementByClass(swalClasses.popup);
			/**
			* @returns {HTMLElement | null}
			*/
			const getIcon = () => elementByClass(swalClasses.icon);
			/**
			* @returns {HTMLElement | null}
			*/
			const getIconContent = () => elementByClass(swalClasses["icon-content"]);
			/**
			* @returns {HTMLElement | null}
			*/
			const getTitle = () => elementByClass(swalClasses.title);
			/**
			* @returns {HTMLElement | null}
			*/
			const getHtmlContainer = () => elementByClass(swalClasses["html-container"]);
			/**
			* @returns {HTMLElement | null}
			*/
			const getImage = () => elementByClass(swalClasses.image);
			/**
			* @returns {HTMLElement | null}
			*/
			const getProgressSteps = () => elementByClass(swalClasses["progress-steps"]);
			/**
			* @returns {HTMLElement | null}
			*/
			const getValidationMessage = () => elementByClass(swalClasses["validation-message"]);
			/**
			* @returns {HTMLButtonElement | null}
			*/
			const getConfirmButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`);
			/**
			* @returns {HTMLButtonElement | null}
			*/
			const getCancelButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`);
			/**
			* @returns {HTMLButtonElement | null}
			*/
			const getDenyButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.deny}`);
			/**
			* @returns {HTMLElement | null}
			*/
			const getInputLabel = () => elementByClass(swalClasses["input-label"]);
			/**
			* @returns {HTMLElement | null}
			*/
			const getLoader = () => elementBySelector(`.${swalClasses.loader}`);
			/**
			* @returns {HTMLElement | null}
			*/
			const getActions = () => elementByClass(swalClasses.actions);
			/**
			* @returns {HTMLElement | null}
			*/
			const getFooter = () => elementByClass(swalClasses.footer);
			/**
			* @returns {HTMLElement | null}
			*/
			const getTimerProgressBar = () => elementByClass(swalClasses["timer-progress-bar"]);
			/**
			* @returns {HTMLElement | null}
			*/
			const getCloseButton = () => elementByClass(swalClasses.close);
			const focusable = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`;
			/**
			* @returns {HTMLElement[]}
			*/
			const getFocusableElements = () => {
				const popup = getPopup();
				if (!popup) return [];
				/** @type {NodeListOf<HTMLElement>} */
				const focusableElementsWithTabindex = popup.querySelectorAll("[tabindex]:not([tabindex=\"-1\"]):not([tabindex=\"0\"])");
				const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex).sort((a, b) => {
					const tabindexA = parseInt(a.getAttribute("tabindex") || "0");
					const tabindexB = parseInt(b.getAttribute("tabindex") || "0");
					if (tabindexA > tabindexB) return 1;
					else if (tabindexA < tabindexB) return -1;
					return 0;
				});
				/** @type {NodeListOf<HTMLElement>} */
				const otherFocusableElements = popup.querySelectorAll(focusable);
				const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter((el) => el.getAttribute("tabindex") !== "-1");
				return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter((el) => isVisible$1(el));
			};
			/**
			* @returns {boolean}
			*/
			const isModal = () => {
				return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses["toast-shown"]) && !hasClass(document.body, swalClasses["no-backdrop"]);
			};
			/**
			* @returns {boolean}
			*/
			const isToast = () => {
				const popup = getPopup();
				if (!popup) return false;
				return hasClass(popup, swalClasses.toast);
			};
			/**
			* @returns {boolean}
			*/
			const isLoading = () => {
				const popup = getPopup();
				if (!popup) return false;
				return popup.hasAttribute("data-loading");
			};
			/**
			* Securely set innerHTML of an element
			* https://github.com/sweetalert2/sweetalert2/issues/1926
			*
			* @param {HTMLElement} elem
			* @param {string} html
			*/
			const setInnerHtml = (elem, html) => {
				elem.textContent = "";
				if (html) {
					const parsed = new DOMParser().parseFromString(html, `text/html`);
					const head = parsed.querySelector("head");
					if (head) Array.from(head.childNodes).forEach((child) => {
						elem.appendChild(child);
					});
					const body = parsed.querySelector("body");
					if (body) Array.from(body.childNodes).forEach((child) => {
						if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) elem.appendChild(child.cloneNode(true));
						else elem.appendChild(child);
					});
				}
			};
			/**
			* @param {HTMLElement} elem
			* @param {string} className
			* @returns {boolean}
			*/
			const hasClass = (elem, className) => {
				if (!className) return false;
				return className.split(/\s+/).every((cls) => elem.classList.contains(cls));
			};
			/**
			* @param {HTMLElement} elem
			* @param {SweetAlertOptions} params
			*/
			const removeCustomClasses = (elem, params) => {
				Array.from(elem.classList).forEach((className) => {
					if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass || {}).includes(className)) elem.classList.remove(className);
				});
			};
			/**
			* @param {HTMLElement} elem
			* @param {SweetAlertOptions} params
			* @param {string} className
			*/
			const applyCustomClass = (elem, params, className) => {
				removeCustomClasses(elem, params);
				if (!params.customClass) return;
				const customClass = params.customClass[className];
				if (!customClass) return;
				if (typeof customClass !== "string" && !customClass.forEach) {
					warn(`Invalid type of customClass.${className}! Expected string or iterable object, got "${typeof customClass}"`);
					return;
				}
				addClass(elem, customClass);
			};
			/**
			* @param {HTMLElement} popup
			* @param {import('./renderers/renderInput').InputClass | SweetAlertInput} inputClass
			* @returns {HTMLInputElement | null}
			*/
			const getInput$1 = (popup, inputClass) => {
				if (!inputClass) return null;
				switch (inputClass) {
					case "select":
					case "textarea":
					case "file": return popup.querySelector(`.${swalClasses.popup} > .${swalClasses[inputClass]}`);
					case "checkbox": return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.checkbox} input`);
					case "radio": return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:checked`) || popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:first-child`);
					case "range": return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.range} input`);
					default: return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.input}`);
				}
			};
			/**
			* @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} input
			*/
			const focusInput = (input) => {
				input.focus();
				if (input.type !== "file") {
					const val = input.value;
					input.value = "";
					input.value = val;
				}
			};
			/**
			* @param {HTMLElement | HTMLElement[] | null} target
			* @param {string | string[] | readonly string[] | undefined} classList
			* @param {boolean} condition
			*/
			const toggleClass = (target, classList, condition) => {
				if (!target || !classList) return;
				const classes = typeof classList === "string" ? classList.split(/\s+/).filter(Boolean) : classList;
				(Array.isArray(target) ? target : [target]).forEach((elem) => {
					classes.forEach((className) => {
						if (condition) elem.classList.add(className);
						else elem.classList.remove(className);
					});
				});
			};
			/**
			* @param {HTMLElement | HTMLElement[] | null} target
			* @param {string | string[] | readonly string[] | undefined} classList
			*/
			const addClass = (target, classList) => {
				toggleClass(target, classList, true);
			};
			/**
			* @param {HTMLElement | HTMLElement[] | null} target
			* @param {string | string[] | readonly string[] | undefined} classList
			*/
			const removeClass = (target, classList) => {
				toggleClass(target, classList, false);
			};
			/**
			* Get direct child of an element by class name
			*
			* @param {HTMLElement} elem
			* @param {string} className
			* @returns {HTMLElement | undefined}
			*/
			const getDirectChildByClass = (elem, className) => Array.from(elem.children).find((child) => child instanceof HTMLElement && hasClass(child, className));
			/**
			* @param {HTMLElement} elem
			* @param {string} property
			* @param {string | number | null | undefined} value
			*/
			const applyNumericalStyle = (elem, property, value) => {
				if (value === `${parseInt(`${value}`)}`) value = parseInt(value);
				if (value || value === 0) elem.style.setProperty(property, typeof value === "number" ? `${value}px` : /** @type {string} */ value);
				else elem.style.removeProperty(property);
			};
			/**
			* @param {HTMLElement | null} elem
			* @param {string} display
			*/
			const show = (elem, display = "flex") => {
				if (!elem) return;
				elem.style.display = display;
			};
			/**
			* @param {HTMLElement | null} elem
			*/
			const hide = (elem) => {
				if (!elem) return;
				elem.style.display = "none";
			};
			/**
			* @param {HTMLElement | null} elem
			* @param {string} display
			*/
			const showWhenInnerHtmlPresent = (elem, display = "block") => {
				if (!elem) return;
				new MutationObserver(() => {
					toggle(elem, elem.innerHTML, display);
				}).observe(elem, {
					childList: true,
					subtree: true
				});
			};
			/**
			* @param {HTMLElement} parent
			* @param {string} selector
			* @param {string} property
			* @param {string} value
			*/
			const setStyle = (parent, selector, property, value) => {
				/** @type {HTMLElement | null} */
				const el = parent.querySelector(selector);
				if (el) el.style.setProperty(property, value);
			};
			/**
			* @param {HTMLElement} elem
			* @param {boolean | string | null | undefined} condition
			* @param {string} display
			*/
			const toggle = (elem, condition, display = "flex") => {
				if (condition) show(elem, display);
				else hide(elem);
			};
			/**
			* borrowed from jquery $(elem).is(':visible') implementation
			*
			* @param {HTMLElement | null} elem
			* @returns {boolean}
			*/
			const isVisible$1 = (elem) => Boolean(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
			/**
			* @returns {boolean}
			*/
			const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());
			/**
			* @param {HTMLElement} elem
			* @returns {boolean}
			*/
			const isScrollable = (elem) => Boolean(elem.scrollHeight > elem.clientHeight);
			/**
			* @param {HTMLElement} element
			* @param {HTMLElement} stopElement
			* @returns {boolean}
			*/
			const selfOrParentIsScrollable = (element, stopElement) => {
				let parent = element;
				while (parent && parent !== stopElement) {
					if (isScrollable(parent)) return true;
					parent = parent.parentElement;
				}
				return false;
			};
			/**
			* borrowed from https://stackoverflow.com/a/46352119
			*
			* @param {HTMLElement} elem
			* @returns {boolean}
			*/
			const hasCssAnimation = (elem) => {
				const style = window.getComputedStyle(elem);
				const animDuration = parseFloat(style.getPropertyValue("animation-duration") || "0");
				const transDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
				return animDuration > 0 || transDuration > 0;
			};
			/**
			* @param {number} timer
			* @param {boolean} reset
			*/
			const animateTimerProgressBar = (timer, reset = false) => {
				const timerProgressBar = getTimerProgressBar();
				if (!timerProgressBar) return;
				if (isVisible$1(timerProgressBar)) {
					if (reset) {
						timerProgressBar.style.transition = "none";
						timerProgressBar.style.width = "100%";
					}
					setTimeout(() => {
						timerProgressBar.style.transition = `width ${timer / 1e3}s linear`;
						timerProgressBar.style.width = "0%";
					}, 10);
				}
			};
			const stopTimerProgressBar = () => {
				const timerProgressBar = getTimerProgressBar();
				if (!timerProgressBar) return;
				const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
				timerProgressBar.style.removeProperty("transition");
				timerProgressBar.style.width = "100%";
				const timerProgressBarPercent = timerProgressBarWidth / parseInt(window.getComputedStyle(timerProgressBar).width) * 100;
				timerProgressBar.style.width = `${timerProgressBarPercent}%`;
			};
			/**
			* Detect Node env
			*
			* @returns {boolean}
			*/
			const isNodeEnv = () => typeof window === "undefined" || typeof document === "undefined";
			const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses["html-container"]}" class="${swalClasses.popup}" tabindex="-1">
   <button type="button" class="${swalClasses.close}"></button>
   <ul class="${swalClasses["progress-steps"]}"></ul>
   <div class="${swalClasses.icon}"></div>
   <img class="${swalClasses.image}" />
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div class="${swalClasses["html-container"]}" id="${swalClasses["html-container"]}"></div>
   <input class="${swalClasses.input}" id="${swalClasses.input}" />
   <input type="file" class="${swalClasses.file}" />
   <div class="${swalClasses.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${swalClasses.select}" id="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label class="${swalClasses.checkbox}">
     <input type="checkbox" id="${swalClasses.checkbox}" />
     <span class="${swalClasses.label}"></span>
   </label>
   <textarea class="${swalClasses.textarea}" id="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses["validation-message"]}" id="${swalClasses["validation-message"]}"></div>
   <div class="${swalClasses.actions}">
     <div class="${swalClasses.loader}"></div>
     <button type="button" class="${swalClasses.confirm}"></button>
     <button type="button" class="${swalClasses.deny}"></button>
     <button type="button" class="${swalClasses.cancel}"></button>
   </div>
   <div class="${swalClasses.footer}"></div>
   <div class="${swalClasses["timer-progress-bar-container"]}">
     <div class="${swalClasses["timer-progress-bar"]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, "");
			/**
			* @returns {boolean}
			*/
			const resetOldContainer = () => {
				const oldContainer = getContainer();
				if (!oldContainer) return false;
				oldContainer.remove();
				removeClass([document.documentElement, document.body], [
					swalClasses["no-backdrop"],
					swalClasses["toast-shown"],
					swalClasses["has-column"]
				]);
				return true;
			};
			const resetValidationMessage$1 = () => {
				if (globalState.currentInstance) globalState.currentInstance.resetValidationMessage();
			};
			const addInputChangeListeners = () => {
				const popup = getPopup();
				if (!popup) return;
				const input = getDirectChildByClass(popup, swalClasses.input);
				const file = getDirectChildByClass(popup, swalClasses.file);
				/** @type {HTMLInputElement | null} */
				const range = popup.querySelector(`.${swalClasses.range} input`);
				/** @type {HTMLOutputElement | null} */
				const rangeOutput = popup.querySelector(`.${swalClasses.range} output`);
				const select = getDirectChildByClass(popup, swalClasses.select);
				/** @type {HTMLInputElement | null} */
				const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`);
				const textarea = getDirectChildByClass(popup, swalClasses.textarea);
				if (input) input.oninput = resetValidationMessage$1;
				if (file) file.onchange = resetValidationMessage$1;
				if (select) select.onchange = resetValidationMessage$1;
				if (checkbox) checkbox.onchange = resetValidationMessage$1;
				if (textarea) textarea.oninput = resetValidationMessage$1;
				if (range && rangeOutput) {
					range.oninput = () => {
						resetValidationMessage$1();
						rangeOutput.value = range.value;
					};
					range.onchange = () => {
						resetValidationMessage$1();
						rangeOutput.value = range.value;
					};
				}
			};
			/**
			* @param {string | HTMLElement} target
			* @returns {HTMLElement}
			*/
			const getTarget = (target) => {
				if (typeof target === "string") {
					const element = document.querySelector(target);
					if (!element) throw new Error(`Target element "${target}" not found`);
					return element;
				}
				return target;
			};
			/**
			* @param {SweetAlertOptions} params
			*/
			const setupAccessibility = (params) => {
				const popup = getPopup();
				if (!popup) return;
				popup.setAttribute("role", params.toast ? "alert" : "dialog");
				popup.setAttribute("aria-live", params.toast ? "polite" : "assertive");
				if (!params.toast) popup.setAttribute("aria-modal", "true");
			};
			/**
			* @param {HTMLElement} targetElement
			*/
			const setupRTL = (targetElement) => {
				if (window.getComputedStyle(targetElement).direction === "rtl") {
					addClass(getContainer(), swalClasses.rtl);
					globalState.isRTL = true;
				}
			};
			/**
			* Add modal + backdrop to DOM
			*
			* @param {SweetAlertOptions} params
			*/
			const init = (params) => {
				const oldContainerExisted = resetOldContainer();
				if (isNodeEnv()) {
					error("SweetAlert2 requires document to initialize");
					return;
				}
				const container = document.createElement("div");
				container.className = swalClasses.container;
				if (oldContainerExisted) addClass(container, swalClasses["no-transition"]);
				setInnerHtml(container, sweetHTML);
				container.dataset["swal2Theme"] = params.theme;
				const targetElement = getTarget(params.target || "body");
				targetElement.appendChild(container);
				if (params.topLayer) {
					container.setAttribute("popover", "");
					container.showPopover();
				}
				setupAccessibility(params);
				setupRTL(targetElement);
				addInputChangeListeners();
			};
			/**
			* @param {HTMLElement | object | string} param
			* @param {HTMLElement} target
			*/
			const parseHtmlToContainer = (param, target) => {
				if (param instanceof HTMLElement) target.appendChild(param);
				else if (typeof param === "object") handleObject(param, target);
				else if (param) setInnerHtml(target, param);
			};
			/**
			* @param {object} param
			* @param {HTMLElement} target
			*/
			const handleObject = (param, target) => {
				if ("jquery" in param) handleJqueryElem(target, param);
				else setInnerHtml(target, param.toString());
			};
			/**
			* @param {HTMLElement} target
			* @param {any} elem
			*/
			const handleJqueryElem = (target, elem) => {
				target.textContent = "";
				if (0 in elem) for (let i = 0; i in elem; i++) target.appendChild(elem[i].cloneNode(true));
				else target.appendChild(elem.cloneNode(true));
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const renderActions = (instance, params) => {
				const actions = getActions();
				const loader = getLoader();
				if (!actions || !loader) return;
				if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) hide(actions);
				else show(actions);
				applyCustomClass(actions, params, "actions");
				renderButtons(actions, loader, params);
				setInnerHtml(loader, params.loaderHtml || "");
				applyCustomClass(loader, params, "loader");
			};
			/**
			* @param {HTMLElement} actions
			* @param {HTMLElement} loader
			* @param {SweetAlertOptions} params
			*/
			function renderButtons(actions, loader, params) {
				const confirmButton = getConfirmButton();
				const denyButton = getDenyButton();
				const cancelButton = getCancelButton();
				if (!confirmButton || !denyButton || !cancelButton) return;
				renderButton(confirmButton, "confirm", params);
				renderButton(denyButton, "deny", params);
				renderButton(cancelButton, "cancel", params);
				handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
				if (params.reverseButtons) {
					if (params.toast) {
						actions.insertBefore(cancelButton, confirmButton);
						actions.insertBefore(denyButton, confirmButton);
					} else {
						actions.insertBefore(cancelButton, loader);
						actions.insertBefore(denyButton, loader);
						actions.insertBefore(confirmButton, loader);
					}
				}
			}
			/**
			* @param {HTMLElement} confirmButton
			* @param {HTMLElement} denyButton
			* @param {HTMLElement} cancelButton
			* @param {SweetAlertOptions} params
			*/
			function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
				if (!params.buttonsStyling) {
					removeClass([
						confirmButton,
						denyButton,
						cancelButton
					], swalClasses.styled);
					return;
				}
				addClass([
					confirmButton,
					denyButton,
					cancelButton
				], swalClasses.styled);
				[
					[
						confirmButton,
						"confirm",
						params.confirmButtonColor
					],
					[
						denyButton,
						"deny",
						params.denyButtonColor
					],
					[
						cancelButton,
						"cancel",
						params.cancelButtonColor
					]
				].forEach(([button, type, color]) => {
					if (color) button.style.setProperty(`--swal2-${type}-button-background-color`, color);
					applyOutlineColor(button);
				});
			}
			/**
			* @param {HTMLElement} button
			*/
			function applyOutlineColor(button) {
				const buttonStyle = window.getComputedStyle(button);
				if (buttonStyle.getPropertyValue("--swal2-action-button-focus-box-shadow")) return;
				const outlineColor = buttonStyle.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/, "rgba($1, $2, $3, 0.5)");
				button.style.setProperty("--swal2-action-button-focus-box-shadow", buttonStyle.getPropertyValue("--swal2-outline").replace(/ rgba\(.*/, ` ${outlineColor}`));
			}
			/**
			* @param {HTMLElement} button
			* @param {'confirm' | 'deny' | 'cancel'} buttonType
			* @param {SweetAlertOptions} params
			*/
			function renderButton(button, buttonType, params) {
				const buttonName = capitalizeFirstLetter(buttonType);
				toggle(button, params[`show${buttonName}Button`], "inline-block");
				setInnerHtml(button, params[`${buttonType}ButtonText`] || "");
				button.setAttribute("aria-label", params[`${buttonType}ButtonAriaLabel`] || "");
				button.className = swalClasses[buttonType];
				applyCustomClass(button, params, `${buttonType}Button`);
			}
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const renderCloseButton = (instance, params) => {
				const closeButton = getCloseButton();
				if (!closeButton) return;
				setInnerHtml(closeButton, params.closeButtonHtml || "");
				applyCustomClass(closeButton, params, "closeButton");
				toggle(closeButton, params.showCloseButton);
				closeButton.setAttribute("aria-label", params.closeButtonAriaLabel || "");
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const renderContainer = (instance, params) => {
				const container = getContainer();
				if (!container) return;
				handleBackdropParam(container, params.backdrop);
				handlePositionParam(container, params.position);
				handleGrowParam(container, params.grow);
				applyCustomClass(container, params, "container");
			};
			/**
			* @param {HTMLElement} container
			* @param {SweetAlertOptions['backdrop']} backdrop
			*/
			function handleBackdropParam(container, backdrop) {
				if (typeof backdrop === "string") container.style.background = backdrop;
				else if (!backdrop) addClass([document.documentElement, document.body], swalClasses["no-backdrop"]);
			}
			/**
			* @param {HTMLElement} container
			* @param {SweetAlertOptions['position']} position
			*/
			function handlePositionParam(container, position) {
				if (!position) return;
				if (position in swalClasses) addClass(container, swalClasses[position]);
				else {
					warn("The \"position\" parameter is not valid, defaulting to \"center\"");
					addClass(container, swalClasses.center);
				}
			}
			/**
			* @param {HTMLElement} container
			* @param {SweetAlertOptions['grow']} grow
			*/
			function handleGrowParam(container, grow) {
				if (!grow) return;
				addClass(container, swalClasses[`grow-${grow}`]);
			}
			/**
			* This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
			* For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
			* This is the approach that Babel will probably take to implement private methods/fields
			*   https://github.com/tc39/proposal-private-methods
			*   https://github.com/babel/babel/pull/7555
			* Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
			*   then we can use that language feature.
			*/
			var privateProps = {
				innerParams: /* @__PURE__ */ new WeakMap(),
				domCache: /* @__PURE__ */ new WeakMap(),
				focusedElement: /* @__PURE__ */ new WeakMap()
			};
			/** @type {InputClass[]} */
			const inputClasses = [
				"input",
				"file",
				"range",
				"select",
				"radio",
				"checkbox",
				"textarea"
			];
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const renderInput = (instance, params) => {
				const popup = getPopup();
				if (!popup) return;
				const innerParams = privateProps.innerParams.get(instance);
				const rerender = !innerParams || params.input !== innerParams.input;
				inputClasses.forEach((inputClass) => {
					const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
					if (!inputContainer) return;
					setAttributes(inputClass, params.inputAttributes);
					inputContainer.className = swalClasses[inputClass];
					if (rerender) hide(inputContainer);
				});
				if (params.input) {
					if (rerender) showInput(params);
					setCustomClass(params);
				}
			};
			/**
			* @param {SweetAlertOptions} params
			*/
			const showInput = (params) => {
				if (!params.input) return;
				if (!renderInputType[params.input]) {
					error(`Unexpected type of input! Expected ${Object.keys(renderInputType).join(" | ")}, got "${params.input}"`);
					return;
				}
				const inputContainer = getInputContainer(params.input);
				if (!inputContainer) return;
				const input = renderInputType[params.input](inputContainer, params);
				show(inputContainer);
				if (params.inputAutoFocus) setTimeout(() => {
					focusInput(input);
				});
			};
			/**
			* @param {HTMLInputElement} input
			*/
			const removeAttributes = (input) => {
				for (const { name } of Array.from(input.attributes)) if (![
					"id",
					"type",
					"value",
					"style"
				].includes(name)) input.removeAttribute(name);
			};
			/**
			* @param {InputClass} inputClass
			* @param {SweetAlertOptions['inputAttributes']} inputAttributes
			*/
			const setAttributes = (inputClass, inputAttributes) => {
				const popup = getPopup();
				if (!popup) return;
				const input = getInput$1(popup, inputClass);
				if (!input) return;
				removeAttributes(input);
				for (const attr in inputAttributes) input.setAttribute(attr, inputAttributes[attr]);
			};
			/**
			* @param {SweetAlertOptions} params
			*/
			const setCustomClass = (params) => {
				if (!params.input) return;
				const inputContainer = getInputContainer(params.input);
				if (inputContainer) applyCustomClass(inputContainer, params, "input");
			};
			/**
			* @param {HTMLInputElement | HTMLTextAreaElement} input
			* @param {SweetAlertOptions} params
			*/
			const setInputPlaceholder = (input, params) => {
				if (!input.placeholder && params.inputPlaceholder) input.placeholder = params.inputPlaceholder;
			};
			/**
			* @param {Input} input
			* @param {Input} prependTo
			* @param {SweetAlertOptions} params
			*/
			const setInputLabel = (input, prependTo, params) => {
				if (params.inputLabel) {
					const label = document.createElement("label");
					const labelClass = swalClasses["input-label"];
					label.setAttribute("for", input.id);
					label.className = labelClass;
					if (typeof params.customClass === "object") addClass(label, params.customClass.inputLabel);
					label.innerText = params.inputLabel;
					prependTo.insertAdjacentElement("beforebegin", label);
				}
			};
			/**
			* @param {SweetAlertInput} inputType
			* @returns {HTMLElement | undefined}
			*/
			const getInputContainer = (inputType) => {
				const popup = getPopup();
				if (!popup) return;
				return getDirectChildByClass(popup, swalClasses[inputType] || swalClasses.input);
			};
			/**
			* @param {HTMLInputElement | HTMLOutputElement | HTMLTextAreaElement} input
			* @param {SweetAlertOptions['inputValue']} inputValue
			*/
			const checkAndSetInputValue = (input, inputValue) => {
				if (["string", "number"].includes(typeof inputValue)) input.value = `${inputValue}`;
				else if (!isPromise(inputValue)) warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof inputValue}"`);
			};
			/** @type {Record<SweetAlertInput, (input: Input | HTMLElement, params: SweetAlertOptions) => Input>} */
			const renderInputType = {};
			/**
			* @param {Input | HTMLElement} input
			* @param {SweetAlertOptions} params
			* @returns {Input}
			*/
			renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = renderInputType.search = renderInputType.date = renderInputType["datetime-local"] = renderInputType.time = renderInputType.week = renderInputType.month = (input, params) => {
				const inputElement = input;
				checkAndSetInputValue(inputElement, params.inputValue);
				setInputLabel(inputElement, inputElement, params);
				setInputPlaceholder(inputElement, params);
				inputElement.type = params.input;
				return inputElement;
			};
			/**
			* @param {Input | HTMLElement} input
			* @param {SweetAlertOptions} params
			* @returns {Input}
			*/
			renderInputType.file = (input, params) => {
				const inputElement = input;
				setInputLabel(inputElement, inputElement, params);
				setInputPlaceholder(inputElement, params);
				return inputElement;
			};
			/**
			* @param {Input | HTMLElement} range
			* @param {SweetAlertOptions} params
			* @returns {Input}
			*/
			renderInputType.range = (range, params) => {
				const rangeContainer = range;
				const rangeInput = rangeContainer.querySelector("input");
				const rangeOutput = rangeContainer.querySelector("output");
				if (rangeInput) {
					checkAndSetInputValue(rangeInput, params.inputValue);
					rangeInput.type = params.input;
					setInputLabel(
						rangeInput,
						/** @type {Input} */
						range,
						params
					);
				}
				if (rangeOutput) checkAndSetInputValue(rangeOutput, params.inputValue);
				return range;
			};
			/**
			* @param {Input | HTMLElement} select
			* @param {SweetAlertOptions} params
			* @returns {Input}
			*/
			renderInputType.select = (select, params) => {
				const selectElement = select;
				selectElement.textContent = "";
				if (params.inputPlaceholder) {
					const placeholder = document.createElement("option");
					setInnerHtml(placeholder, params.inputPlaceholder);
					placeholder.value = "";
					placeholder.disabled = true;
					placeholder.selected = true;
					selectElement.appendChild(placeholder);
				}
				setInputLabel(selectElement, selectElement, params);
				return selectElement;
			};
			/**
			* @param {Input | HTMLElement} radio
			* @returns {Input}
			*/
			renderInputType.radio = (radio) => {
				const radioElement = radio;
				radioElement.textContent = "";
				return radio;
			};
			/**
			* @param {Input | HTMLElement} checkboxContainer
			* @param {SweetAlertOptions} params
			* @returns {Input}
			*/
			renderInputType.checkbox = (checkboxContainer, params) => {
				const popup = getPopup();
				if (!popup) throw new Error("Popup not found");
				const checkbox = getInput$1(popup, "checkbox");
				if (!checkbox) throw new Error("Checkbox input not found");
				checkbox.value = "1";
				checkbox.checked = Boolean(params.inputValue);
				const label = checkboxContainer.querySelector("span");
				if (label) {
					const placeholderOrLabel = params.inputPlaceholder || params.inputLabel;
					if (placeholderOrLabel) setInnerHtml(label, placeholderOrLabel);
				}
				return checkbox;
			};
			/**
			* @param {Input | HTMLElement} textarea
			* @param {SweetAlertOptions} params
			* @returns {Input}
			*/
			renderInputType.textarea = (textarea, params) => {
				const textareaElement = textarea;
				checkAndSetInputValue(textareaElement, params.inputValue);
				setInputPlaceholder(textareaElement, params);
				setInputLabel(textareaElement, textareaElement, params);
				/**
				* @param {HTMLElement} el
				* @returns {number}
				*/
				const getMargin = (el) => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);
				setTimeout(() => {
					if ("MutationObserver" in window) {
						const popup = getPopup();
						if (!popup) return;
						const initialPopupWidth = parseInt(window.getComputedStyle(popup).width);
						const textareaResizeHandler = () => {
							if (!document.body.contains(textareaElement)) return;
							const textareaWidth = textareaElement.offsetWidth + getMargin(textareaElement);
							const popupElement = getPopup();
							if (popupElement) {
								if (textareaWidth > initialPopupWidth) popupElement.style.width = `${textareaWidth}px`;
								else applyNumericalStyle(popupElement, "width", params.width);
							}
						};
						new MutationObserver(textareaResizeHandler).observe(textareaElement, {
							attributes: true,
							attributeFilter: ["style"]
						});
					}
				});
				return textareaElement;
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const renderContent = (instance, params) => {
				const htmlContainer = getHtmlContainer();
				if (!htmlContainer) return;
				showWhenInnerHtmlPresent(htmlContainer);
				applyCustomClass(htmlContainer, params, "htmlContainer");
				if (params.html) {
					parseHtmlToContainer(params.html, htmlContainer);
					show(htmlContainer, "block");
				} else if (params.text) {
					htmlContainer.textContent = params.text;
					show(htmlContainer, "block");
				} else hide(htmlContainer);
				renderInput(instance, params);
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const renderFooter = (instance, params) => {
				const footer = getFooter();
				if (!footer) return;
				showWhenInnerHtmlPresent(footer);
				toggle(footer, Boolean(params.footer), "block");
				if (params.footer) parseHtmlToContainer(params.footer, footer);
				applyCustomClass(footer, params, "footer");
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const renderIcon = (instance, params) => {
				const innerParams = privateProps.innerParams.get(instance);
				const icon = getIcon();
				if (!icon) return;
				if (innerParams && params.icon === innerParams.icon) {
					setContent(icon, params);
					applyStyles(icon, params);
					return;
				}
				if (!params.icon && !params.iconHtml) {
					hide(icon);
					return;
				}
				if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
					error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`);
					hide(icon);
					return;
				}
				show(icon);
				setContent(icon, params);
				applyStyles(icon, params);
				addClass(icon, params.showClass && params.showClass.icon);
				window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", adjustSuccessIconBackgroundColor);
			};
			/**
			* @param {HTMLElement} icon
			* @param {SweetAlertOptions} params
			*/
			const applyStyles = (icon, params) => {
				for (const [iconType, iconClassName] of Object.entries(iconTypes)) if (params.icon !== iconType) removeClass(icon, iconClassName);
				addClass(icon, params.icon && iconTypes[params.icon]);
				setColor(icon, params);
				adjustSuccessIconBackgroundColor();
				applyCustomClass(icon, params, "icon");
			};
			const adjustSuccessIconBackgroundColor = () => {
				const popup = getPopup();
				if (!popup) return;
				const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue("background-color");
				popup.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix").forEach((part) => {
					part.style.backgroundColor = popupBackgroundColor;
				});
			};
			/**
			*
			* @param {SweetAlertOptions} params
			* @returns {string}
			*/
			const successIconHtml = (params) => `
  ${params.animation ? "<div class=\"swal2-success-circular-line-left\"></div>" : ""}
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div>
  ${params.animation ? "<div class=\"swal2-success-fix\"></div>" : ""}
  ${params.animation ? "<div class=\"swal2-success-circular-line-right\"></div>" : ""}
`;
			const errorIconHtml = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`;
			/**
			* @param {HTMLElement} icon
			* @param {SweetAlertOptions} params
			*/
			const setContent = (icon, params) => {
				if (!params.icon && !params.iconHtml) return;
				let oldContent = icon.innerHTML;
				let newContent = "";
				if (params.iconHtml) newContent = iconContent(params.iconHtml);
				else if (params.icon === "success") {
					newContent = successIconHtml(params);
					oldContent = oldContent.replace(/ style=".*?"/g, "");
				} else if (params.icon === "error") newContent = errorIconHtml;
				else if (params.icon) newContent = iconContent({
					question: "?",
					warning: "!",
					info: "i"
				}[params.icon]);
				if (oldContent.trim() !== newContent.trim()) setInnerHtml(icon, newContent);
			};
			/**
			* @param {HTMLElement} icon
			* @param {SweetAlertOptions} params
			*/
			const setColor = (icon, params) => {
				if (!params.iconColor) return;
				icon.style.color = params.iconColor;
				icon.style.borderColor = params.iconColor;
				for (const sel of [
					".swal2-success-line-tip",
					".swal2-success-line-long",
					".swal2-x-mark-line-left",
					".swal2-x-mark-line-right"
				]) setStyle(icon, sel, "background-color", params.iconColor);
				setStyle(icon, ".swal2-success-ring", "border-color", params.iconColor);
			};
			/**
			* @param {string} content
			* @returns {string}
			*/
			const iconContent = (content) => `<div class="${swalClasses["icon-content"]}">${content}</div>`;
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const renderImage = (instance, params) => {
				const image = getImage();
				if (!image) return;
				if (!params.imageUrl) {
					hide(image);
					return;
				}
				show(image, "");
				image.setAttribute("src", params.imageUrl);
				image.setAttribute("alt", params.imageAlt || "");
				applyNumericalStyle(image, "width", params.imageWidth);
				applyNumericalStyle(image, "height", params.imageHeight);
				image.className = swalClasses.image;
				applyCustomClass(image, params, "image");
			};
			let dragging = false;
			let mousedownX = 0;
			let mousedownY = 0;
			let initialX = 0;
			let initialY = 0;
			/**
			* @param {HTMLElement} popup
			*/
			const addDraggableListeners = (popup) => {
				popup.addEventListener("mousedown", down);
				document.body.addEventListener("mousemove", move);
				popup.addEventListener("mouseup", up);
				popup.addEventListener("touchstart", down);
				document.body.addEventListener("touchmove", move);
				popup.addEventListener("touchend", up);
			};
			/**
			* @param {HTMLElement} popup
			*/
			const removeDraggableListeners = (popup) => {
				popup.removeEventListener("mousedown", down);
				document.body.removeEventListener("mousemove", move);
				popup.removeEventListener("mouseup", up);
				popup.removeEventListener("touchstart", down);
				document.body.removeEventListener("touchmove", move);
				popup.removeEventListener("touchend", up);
			};
			/**
			* @param {MouseEvent | TouchEvent} event
			*/
			const down = (event) => {
				const popup = getPopup();
				if (!popup) return;
				const icon = getIcon();
				if (event.target === popup || icon && icon.contains(
					/** @type {HTMLElement} */
					event.target
				)) {
					dragging = true;
					const clientXY = getClientXY(event);
					mousedownX = clientXY.clientX;
					mousedownY = clientXY.clientY;
					initialX = parseInt(popup.style.insetInlineStart) || 0;
					initialY = parseInt(popup.style.insetBlockStart) || 0;
					addClass(popup, "swal2-dragging");
				}
			};
			/**
			* @param {MouseEvent | TouchEvent} event
			*/
			const move = (event) => {
				const popup = getPopup();
				if (!popup) return;
				if (dragging) {
					let { clientX, clientY } = getClientXY(event);
					const deltaX = clientX - mousedownX;
					popup.style.insetInlineStart = `${initialX + (globalState.isRTL ? -deltaX : deltaX)}px`;
					popup.style.insetBlockStart = `${initialY + (clientY - mousedownY)}px`;
				}
			};
			const up = () => {
				const popup = getPopup();
				dragging = false;
				removeClass(popup, "swal2-dragging");
			};
			/**
			* @param {MouseEvent | TouchEvent} event
			* @returns {{ clientX: number, clientY: number }}
			*/
			const getClientXY = (event) => {
				const source = event.type.startsWith("touch") ? event.touches[0] : /** @type {MouseEvent} */ event;
				return {
					clientX: source.clientX,
					clientY: source.clientY
				};
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const renderPopup = (instance, params) => {
				const container = getContainer();
				const popup = getPopup();
				if (!container || !popup) return;
				if (params.toast) {
					applyNumericalStyle(container, "width", params.width);
					popup.style.width = "100%";
					const loader = getLoader();
					if (loader) popup.insertBefore(loader, getIcon());
				} else applyNumericalStyle(popup, "width", params.width);
				applyNumericalStyle(popup, "padding", params.padding);
				if (params.color) popup.style.color = params.color;
				if (params.background) popup.style.background = params.background;
				hide(getValidationMessage());
				addClasses$1(popup, params);
				if (params.draggable && !params.toast) {
					addClass(popup, swalClasses.draggable);
					addDraggableListeners(popup);
				} else {
					removeClass(popup, swalClasses.draggable);
					removeDraggableListeners(popup);
				}
			};
			/**
			* @param {HTMLElement} popup
			* @param {SweetAlertOptions} params
			*/
			const addClasses$1 = (popup, params) => {
				const showClass = params.showClass || {};
				popup.className = `${swalClasses.popup} ${isVisible$1(popup) ? showClass.popup : ""}`;
				if (params.toast) {
					addClass([document.documentElement, document.body], swalClasses["toast-shown"]);
					addClass(popup, swalClasses.toast);
				} else addClass(popup, swalClasses.modal);
				applyCustomClass(popup, params, "popup");
				if (typeof params.customClass === "string") addClass(popup, params.customClass);
				if (params.icon) addClass(popup, swalClasses[`icon-${params.icon}`]);
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const renderProgressSteps = (instance, params) => {
				const progressStepsContainer = getProgressSteps();
				if (!progressStepsContainer) return;
				const { progressSteps, currentProgressStep } = params;
				if (!progressSteps || progressSteps.length === 0 || currentProgressStep === void 0) {
					hide(progressStepsContainer);
					return;
				}
				show(progressStepsContainer);
				progressStepsContainer.textContent = "";
				if (currentProgressStep >= progressSteps.length) warn("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)");
				progressSteps.forEach((step, index) => {
					const stepEl = createStepElement(step);
					progressStepsContainer.appendChild(stepEl);
					if (index === currentProgressStep) addClass(stepEl, swalClasses["active-progress-step"]);
					if (index !== progressSteps.length - 1) {
						const lineEl = createLineElement(params);
						progressStepsContainer.appendChild(lineEl);
					}
				});
			};
			/**
			* @param {string} step
			* @returns {HTMLLIElement}
			*/
			const createStepElement = (step) => {
				const stepEl = document.createElement("li");
				addClass(stepEl, swalClasses["progress-step"]);
				setInnerHtml(stepEl, step);
				return stepEl;
			};
			/**
			* @param {SweetAlertOptions} params
			* @returns {HTMLLIElement}
			*/
			const createLineElement = (params) => {
				const lineEl = document.createElement("li");
				addClass(lineEl, swalClasses["progress-step-line"]);
				if (params.progressStepsDistance) applyNumericalStyle(lineEl, "width", params.progressStepsDistance);
				return lineEl;
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const renderTitle = (instance, params) => {
				const title = getTitle();
				if (!title) return;
				showWhenInnerHtmlPresent(title);
				toggle(title, Boolean(params.title || params.titleText), "block");
				if (params.title) parseHtmlToContainer(params.title, title);
				if (params.titleText) title.innerText = params.titleText;
				applyCustomClass(title, params, "title");
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const render = (instance, params) => {
				var _globalState$eventEmi;
				renderPopup(instance, params);
				renderContainer(instance, params);
				renderProgressSteps(instance, params);
				renderIcon(instance, params);
				renderImage(instance, params);
				renderTitle(instance, params);
				renderCloseButton(instance, params);
				renderContent(instance, params);
				renderActions(instance, params);
				renderFooter(instance, params);
				const popup = getPopup();
				if (typeof params.didRender === "function" && popup) params.didRender(popup);
				(_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("didRender", popup);
			};
			const isVisible = () => {
				return isVisible$1(getPopup());
			};
			const clickConfirm = () => {
				var _dom$getConfirmButton;
				return (_dom$getConfirmButton = getConfirmButton()) === null || _dom$getConfirmButton === void 0 ? void 0 : _dom$getConfirmButton.click();
			};
			const clickDeny = () => {
				var _dom$getDenyButton;
				return (_dom$getDenyButton = getDenyButton()) === null || _dom$getDenyButton === void 0 ? void 0 : _dom$getDenyButton.click();
			};
			const clickCancel = () => {
				var _dom$getCancelButton;
				return (_dom$getCancelButton = getCancelButton()) === null || _dom$getCancelButton === void 0 ? void 0 : _dom$getCancelButton.click();
			};
			/** @type {Record<DismissReason, DismissReason>} */
			const DismissReason = Object.freeze({
				cancel: "cancel",
				backdrop: "backdrop",
				close: "close",
				esc: "esc",
				timer: "timer"
			});
			/**
			* @param {GlobalState} globalState
			*/
			const removeKeydownHandler = (globalState) => {
				if (globalState.keydownTarget && globalState.keydownHandlerAdded && globalState.keydownHandler) {
					const handler = globalState.keydownHandler;
					globalState.keydownTarget.removeEventListener("keydown", handler, { capture: globalState.keydownListenerCapture });
					globalState.keydownHandlerAdded = false;
				}
			};
			/**
			* @param {GlobalState} globalState
			* @param {SweetAlertOptions} innerParams
			* @param {(dismiss: DismissReason) => void} dismissWith
			*/
			const addKeydownHandler = (globalState, innerParams, dismissWith) => {
				removeKeydownHandler(globalState);
				if (!innerParams.toast) {
					/** @type {(this: HTMLElement, event: KeyboardEvent) => void} */
					const handler = (e) => keydownHandler(innerParams, e, dismissWith);
					globalState.keydownHandler = handler;
					const target = innerParams.keydownListenerCapture ? window : getPopup();
					if (target) {
						globalState.keydownTarget = target;
						globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
						const eventHandler = handler;
						globalState.keydownTarget.addEventListener("keydown", eventHandler, { capture: globalState.keydownListenerCapture });
						globalState.keydownHandlerAdded = true;
					}
				}
			};
			/**
			* @param {number} index
			* @param {number} increment
			* @returns {boolean} shouldPreventDefault
			*/
			const setFocus = (index, increment) => {
				var _dom$getPopup;
				const focusableElements = getFocusableElements();
				if (focusableElements.length) {
					index = index + increment;
					if (index === -2) index = focusableElements.length - 1;
					if (index === focusableElements.length) index = 0;
					else if (index === -1) index = focusableElements.length - 1;
					focusableElements[index].focus();
					if (isFirefox() && focusableElements[index] instanceof HTMLIFrameElement) return false;
					return true;
				}
				(_dom$getPopup = getPopup()) === null || _dom$getPopup === void 0 || _dom$getPopup.focus();
				return true;
			};
			const arrowKeysNextButton = ["ArrowRight", "ArrowDown"];
			const arrowKeysPreviousButton = ["ArrowLeft", "ArrowUp"];
			/**
			* @param {SweetAlertOptions} innerParams
			* @param {KeyboardEvent} event
			* @param {(dismiss: DismissReason) => void} dismissWith
			*/
			const keydownHandler = (innerParams, event, dismissWith) => {
				if (!innerParams) return;
				if (event.isComposing || event.keyCode === 229) return;
				if (innerParams.stopKeydownPropagation) event.stopPropagation();
				if (event.key === "Enter") handleEnter(event, innerParams);
				else if (event.key === "Tab") handleTab(event);
				else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) handleArrows(event.key);
				else if (event.key === "Escape") handleEsc(event, innerParams, dismissWith);
			};
			/**
			* @param {KeyboardEvent} event
			* @param {SweetAlertOptions} innerParams
			*/
			const handleEnter = (event, innerParams) => {
				if (!callIfFunction(innerParams.allowEnterKey)) return;
				const popup = getPopup();
				if (!popup || !innerParams.input) return;
				const input = getInput$1(popup, innerParams.input);
				if (event.target && input && event.target instanceof HTMLElement && event.target.outerHTML === input.outerHTML) {
					if (["textarea", "file"].includes(innerParams.input)) return;
					clickConfirm();
					event.preventDefault();
				}
			};
			/**
			* @param {KeyboardEvent} event
			*/
			const handleTab = (event) => {
				const targetElement = event.target;
				const btnIndex = getFocusableElements().findIndex((el) => el === targetElement);
				let shouldPreventDefault = true;
				if (!event.shiftKey) shouldPreventDefault = setFocus(btnIndex, 1);
				else shouldPreventDefault = setFocus(btnIndex, -1);
				event.stopPropagation();
				if (shouldPreventDefault) event.preventDefault();
			};
			/**
			* @param {string} key
			*/
			const handleArrows = (key) => {
				const actions = getActions();
				const confirmButton = getConfirmButton();
				const denyButton = getDenyButton();
				const cancelButton = getCancelButton();
				if (!actions || !confirmButton || !denyButton || !cancelButton) return;
				/** @type HTMLElement[] */
				const buttons = [
					confirmButton,
					denyButton,
					cancelButton
				];
				if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) return;
				const sibling = arrowKeysNextButton.includes(key) ? "nextElementSibling" : "previousElementSibling";
				let buttonToFocus = document.activeElement;
				if (!buttonToFocus) return;
				for (let i = 0; i < actions.children.length; i++) {
					buttonToFocus = buttonToFocus[sibling];
					if (!buttonToFocus) return;
					if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) break;
				}
				if (buttonToFocus instanceof HTMLButtonElement) buttonToFocus.focus();
			};
			/**
			* @param {KeyboardEvent} event
			* @param {SweetAlertOptions} innerParams
			* @param {(dismiss: DismissReason) => void} dismissWith
			*/
			const handleEsc = (event, innerParams, dismissWith) => {
				event.preventDefault();
				if (callIfFunction(innerParams.allowEscapeKey)) dismissWith(DismissReason.esc);
			};
			/**
			* This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
			* For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
			* This is the approach that Babel will probably take to implement private methods/fields
			*   https://github.com/tc39/proposal-private-methods
			*   https://github.com/babel/babel/pull/7555
			* Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
			*   then we can use that language feature.
			*/
			var privateMethods = {
				swalPromiseResolve: /* @__PURE__ */ new WeakMap(),
				swalPromiseReject: /* @__PURE__ */ new WeakMap()
			};
			const setAriaHidden = () => {
				const container = getContainer();
				Array.from(document.body.children).forEach((el) => {
					if (el.contains(container)) return;
					if (el.hasAttribute("aria-hidden")) el.setAttribute("data-previous-aria-hidden", el.getAttribute("aria-hidden") || "");
					el.setAttribute("aria-hidden", "true");
				});
			};
			const unsetAriaHidden = () => {
				Array.from(document.body.children).forEach((el) => {
					if (el.hasAttribute("data-previous-aria-hidden")) {
						el.setAttribute("aria-hidden", el.getAttribute("data-previous-aria-hidden") || "");
						el.removeAttribute("data-previous-aria-hidden");
					} else el.removeAttribute("aria-hidden");
				});
			};
			const isSafariOrIOS = typeof window !== "undefined" && Boolean(window.GestureEvent);
			const isIOS = isSafariOrIOS && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			/**
			* Fix iOS scrolling
			* http://stackoverflow.com/q/39626302
			*/
			const iOSfix = () => {
				if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
					const offset = document.body.scrollTop;
					document.body.style.top = `${offset * -1}px`;
					addClass(document.body, swalClasses.iosfix);
					lockBodyScroll();
				}
			};
			/**
			* https://github.com/sweetalert2/sweetalert2/issues/1246
			*/
			const lockBodyScroll = () => {
				const container = getContainer();
				if (!container) return;
				/** @type {boolean} */
				let preventTouchMove;
				/**
				* @param {TouchEvent} event
				*/
				container.ontouchstart = (event) => {
					preventTouchMove = shouldPreventTouchMove(event);
				};
				/**
				* @param {TouchEvent} event
				*/
				container.ontouchmove = (event) => {
					if (preventTouchMove) {
						event.preventDefault();
						event.stopPropagation();
					}
				};
			};
			/**
			* @param {TouchEvent} event
			* @returns {boolean}
			*/
			const shouldPreventTouchMove = (event) => {
				const target = event.target;
				const container = getContainer();
				const htmlContainer = getHtmlContainer();
				if (!container || !htmlContainer) return false;
				if (isStylus(event) || isZoom(event)) return false;
				if (target === container) return true;
				if (!isScrollable(container) && target instanceof HTMLElement && !selfOrParentIsScrollable(target, htmlContainer) && target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !(isScrollable(htmlContainer) && htmlContainer.contains(target))) return true;
				return false;
			};
			/**
			* https://github.com/sweetalert2/sweetalert2/issues/1786
			*
			* @param {TouchEvent} event
			* @returns {boolean}
			*/
			const isStylus = (event) => {
				return Boolean(event.touches && event.touches.length && event.touches[0].touchType === "stylus");
			};
			/**
			* https://github.com/sweetalert2/sweetalert2/issues/1891
			*
			* @param {TouchEvent} event
			* @returns {boolean}
			*/
			const isZoom = (event) => {
				return event.touches && event.touches.length > 1;
			};
			const undoIOSfix = () => {
				if (hasClass(document.body, swalClasses.iosfix)) {
					const offset = parseInt(document.body.style.top, 10);
					removeClass(document.body, swalClasses.iosfix);
					document.body.style.top = "";
					document.body.scrollTop = offset * -1;
				}
			};
			/**
			* Measure scrollbar width for padding body during modal show/hide
			* https://github.com/twbs/bootstrap/blob/master/js/src/modal.js
			*
			* @returns {number}
			*/
			const measureScrollbar = () => {
				const scrollDiv = document.createElement("div");
				scrollDiv.className = swalClasses["scrollbar-measure"];
				document.body.appendChild(scrollDiv);
				const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
				document.body.removeChild(scrollDiv);
				return scrollbarWidth;
			};
			/**
			* Remember state in cases where opening and handling a modal will fiddle with it.
			* @type {number | null}
			*/
			let previousBodyPadding = null;
			/**
			* @param {string} initialBodyOverflow
			*/
			const replaceScrollbarWithPadding = (initialBodyOverflow) => {
				if (previousBodyPadding !== null) return;
				if (document.body.scrollHeight > window.innerHeight || initialBodyOverflow === "scroll") {
					previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"));
					document.body.style.paddingRight = `${previousBodyPadding + measureScrollbar()}px`;
				}
			};
			const undoReplaceScrollbarWithPadding = () => {
				if (previousBodyPadding !== null) {
					document.body.style.paddingRight = `${previousBodyPadding}px`;
					previousBodyPadding = null;
				}
			};
			/**
			* @param {SweetAlert} instance
			* @param {HTMLElement} container
			* @param {boolean} returnFocus
			* @param {(() => void) | undefined} didClose
			*/
			function removePopupAndResetState(instance, container, returnFocus, didClose) {
				if (isToast()) triggerDidCloseAndDispose(instance, didClose);
				else {
					restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
					removeKeydownHandler(globalState);
				}
				if (isSafariOrIOS) {
					container.setAttribute("style", "display:none !important");
					container.removeAttribute("class");
					container.innerHTML = "";
				} else container.remove();
				if (isModal()) {
					undoReplaceScrollbarWithPadding();
					undoIOSfix();
					unsetAriaHidden();
				}
				removeBodyClasses();
			}
			/**
			* Remove SweetAlert2 classes from body
			*/
			function removeBodyClasses() {
				removeClass([document.documentElement, document.body], [
					swalClasses.shown,
					swalClasses["height-auto"],
					swalClasses["no-backdrop"],
					swalClasses["toast-shown"]
				]);
			}
			/**
			* Instance method to close sweetAlert
			*
			* @param {SweetAlertResult | undefined} resolveValue
			* @this {SweetAlert}
			*/
			function close(resolveValue) {
				resolveValue = prepareResolveValue(resolveValue);
				const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
				const didClose = triggerClosePopup(this);
				if (this.isAwaitingPromise) {
					if (!resolveValue.isDismissed) {
						handleAwaitingPromise(this);
						swalPromiseResolve(resolveValue);
					}
				} else if (didClose) swalPromiseResolve(resolveValue);
			}
			/**
			* @param {SweetAlert} instance
			* @returns {boolean}
			*/
			const triggerClosePopup = (instance) => {
				const popup = getPopup();
				if (!popup) return false;
				const innerParams = privateProps.innerParams.get(instance);
				if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) return false;
				removeClass(popup, innerParams.showClass.popup);
				addClass(popup, innerParams.hideClass.popup);
				const backdrop = getContainer();
				removeClass(backdrop, innerParams.showClass.backdrop);
				addClass(backdrop, innerParams.hideClass.backdrop);
				handlePopupAnimation(instance, popup, innerParams);
				return true;
			};
			/**
			* @param {Error | string} error
			* @this {SweetAlert}
			*/
			function rejectPromise(error) {
				const rejectPromise = privateMethods.swalPromiseReject.get(this);
				handleAwaitingPromise(this);
				if (rejectPromise) rejectPromise(error);
			}
			/**
			* @param {SweetAlert} instance
			*/
			const handleAwaitingPromise = (instance) => {
				if (instance.isAwaitingPromise) {
					delete instance.isAwaitingPromise;
					if (!privateProps.innerParams.get(instance)) instance._destroy();
				}
			};
			/**
			* @param {SweetAlertResult | undefined} resolveValue
			* @returns {SweetAlertResult}
			*/
			const prepareResolveValue = (resolveValue) => {
				if (typeof resolveValue === "undefined") return {
					isConfirmed: false,
					isDenied: false,
					isDismissed: true
				};
				return Object.assign({
					isConfirmed: false,
					isDenied: false,
					isDismissed: false
				}, resolveValue);
			};
			/**
			* @param {SweetAlert} instance
			* @param {HTMLElement} popup
			* @param {SweetAlertOptions} innerParams
			*/
			const handlePopupAnimation = (instance, popup, innerParams) => {
				var _globalState$eventEmi;
				const container = getContainer();
				const animationIsSupported = hasCssAnimation(popup);
				if (typeof innerParams.willClose === "function") innerParams.willClose(popup);
				(_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("willClose", popup);
				if (animationIsSupported && container) animatePopup(instance, popup, container, Boolean(innerParams.returnFocus), innerParams.didClose);
				else if (container) removePopupAndResetState(instance, container, Boolean(innerParams.returnFocus), innerParams.didClose);
			};
			/**
			* @param {SweetAlert} instance
			* @param {HTMLElement} popup
			* @param {HTMLElement} container
			* @param {boolean} returnFocus
			* @param {(() => void) | undefined} didClose
			*/
			const animatePopup = (instance, popup, container, returnFocus, didClose) => {
				globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
				/**
				* @param {AnimationEvent | TransitionEvent} e
				*/
				const swalCloseAnimationFinished = function(e) {
					if (e.target === popup) {
						var _globalState$swalClos;
						(_globalState$swalClos = globalState.swalCloseEventFinishedCallback) === null || _globalState$swalClos === void 0 || _globalState$swalClos.call(globalState);
						delete globalState.swalCloseEventFinishedCallback;
						popup.removeEventListener("animationend", swalCloseAnimationFinished);
						popup.removeEventListener("transitionend", swalCloseAnimationFinished);
					}
				};
				popup.addEventListener("animationend", swalCloseAnimationFinished);
				popup.addEventListener("transitionend", swalCloseAnimationFinished);
			};
			/**
			* @param {SweetAlert} instance
			* @param {(() => void) | undefined} didClose
			*/
			const triggerDidCloseAndDispose = (instance, didClose) => {
				setTimeout(() => {
					var _globalState$eventEmi2;
					if (typeof didClose === "function") didClose.bind(instance.params)();
					(_globalState$eventEmi2 = globalState.eventEmitter) === null || _globalState$eventEmi2 === void 0 || _globalState$eventEmi2.emit("didClose");
					if (instance._destroy) instance._destroy();
				});
			};
			/**
			* Shows loader (spinner), this is useful with AJAX requests.
			* By default the loader be shown instead of the "Confirm" button.
			*
			* @param {HTMLButtonElement | null} [buttonToReplace]
			*/
			const showLoading = (buttonToReplace) => {
				let popup = getPopup();
				if (!popup) new Swal();
				popup = getPopup();
				if (!popup) return;
				const loader = getLoader();
				if (isToast()) hide(getIcon());
				else replaceButton(popup, buttonToReplace);
				show(loader);
				popup.setAttribute("data-loading", "true");
				popup.setAttribute("aria-busy", "true");
				popup.focus();
			};
			/**
			* @param {HTMLElement} popup
			* @param {HTMLButtonElement | null} [buttonToReplace]
			*/
			const replaceButton = (popup, buttonToReplace) => {
				const actions = getActions();
				const loader = getLoader();
				if (!actions || !loader) return;
				if (!buttonToReplace && isVisible$1(getConfirmButton())) buttonToReplace = getConfirmButton();
				show(actions);
				if (buttonToReplace) {
					hide(buttonToReplace);
					loader.setAttribute("data-button-to-replace", buttonToReplace.className);
					actions.insertBefore(loader, buttonToReplace);
				}
				addClass([popup, actions], swalClasses.loading);
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const handleInputOptionsAndValue = (instance, params) => {
				if (params.input === "select" || params.input === "radio") handleInputOptions(instance, params);
				else if ([
					"text",
					"email",
					"number",
					"tel",
					"textarea"
				].some((i) => i === params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
					showLoading(getConfirmButton());
					handleInputValue(instance, params);
				}
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} innerParams
			* @returns {SweetAlertInputValue}
			*/
			const getInputValue = (instance, innerParams) => {
				const input = instance.getInput();
				if (!input) return null;
				switch (innerParams.input) {
					case "checkbox": return getCheckboxValue(input);
					case "radio": return getRadioValue(input);
					case "file": return getFileValue(input);
					default: return innerParams.inputAutoTrim ? input.value.trim() : input.value;
				}
			};
			/**
			* @param {HTMLInputElement} input
			* @returns {number}
			*/
			const getCheckboxValue = (input) => input.checked ? 1 : 0;
			/**
			* @param {HTMLInputElement} input
			* @returns {string | null}
			*/
			const getRadioValue = (input) => input.checked ? input.value : null;
			/**
			* @param {HTMLInputElement} input
			* @returns {FileList | File | null}
			*/
			const getFileValue = (input) => input.files && input.files.length ? input.getAttribute("multiple") !== null ? input.files : input.files[0] : null;
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const handleInputOptions = (instance, params) => {
				const popup = getPopup();
				if (!popup) return;
				/**
				* @param {*} inputOptions
				*/
				const processInputOptions = (inputOptions) => {
					if (params.input === "select") populateSelectOptions(popup, formatInputOptions(inputOptions), params);
					else if (params.input === "radio") populateRadioOptions(popup, formatInputOptions(inputOptions), params);
				};
				if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
					showLoading(getConfirmButton());
					asPromise(params.inputOptions).then((inputOptions) => {
						instance.hideLoading();
						processInputOptions(inputOptions);
					});
				} else if (typeof params.inputOptions === "object") processInputOptions(params.inputOptions);
				else error(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof params.inputOptions}`);
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertOptions} params
			*/
			const handleInputValue = (instance, params) => {
				const input = instance.getInput();
				if (!input) return;
				hide(input);
				asPromise(params.inputValue).then((inputValue) => {
					input.value = params.input === "number" ? `${parseFloat(inputValue) || 0}` : `${inputValue}`;
					show(input);
					input.focus();
					instance.hideLoading();
				}).catch((err) => {
					error(`Error in inputValue promise: ${err}`);
					input.value = "";
					show(input);
					input.focus();
					instance.hideLoading();
				});
			};
			/**
			* @param {HTMLElement} popup
			* @param {InputOptionFlattened[]} inputOptions
			* @param {SweetAlertOptions} params
			*/
			function populateSelectOptions(popup, inputOptions, params) {
				const select = getDirectChildByClass(popup, swalClasses.select);
				if (!select) return;
				/**
				* @param {HTMLElement} parent
				* @param {string} optionLabel
				* @param {string} optionValue
				*/
				const renderOption = (parent, optionLabel, optionValue) => {
					const option = document.createElement("option");
					option.value = optionValue;
					setInnerHtml(option, optionLabel);
					option.selected = isSelected(optionValue, params.inputValue);
					parent.appendChild(option);
				};
				inputOptions.forEach((inputOption) => {
					const optionValue = inputOption[0];
					const optionLabel = inputOption[1];
					if (Array.isArray(optionLabel)) {
						const optgroup = document.createElement("optgroup");
						optgroup.label = optionValue;
						optgroup.disabled = false;
						select.appendChild(optgroup);
						optionLabel.forEach((o) => renderOption(optgroup, o[1], o[0]));
					} else renderOption(select, optionLabel, optionValue);
				});
				select.focus();
			}
			/**
			* @param {HTMLElement} popup
			* @param {InputOptionFlattened[]} inputOptions
			* @param {SweetAlertOptions} params
			*/
			function populateRadioOptions(popup, inputOptions, params) {
				const radio = getDirectChildByClass(popup, swalClasses.radio);
				if (!radio) return;
				inputOptions.forEach((inputOption) => {
					const radioValue = inputOption[0];
					const radioLabel = inputOption[1];
					const radioInput = document.createElement("input");
					const radioLabelElement = document.createElement("label");
					radioInput.type = "radio";
					radioInput.name = swalClasses.radio;
					radioInput.value = radioValue;
					if (isSelected(radioValue, params.inputValue)) radioInput.checked = true;
					const label = document.createElement("span");
					setInnerHtml(label, radioLabel);
					label.className = swalClasses.label;
					radioLabelElement.appendChild(radioInput);
					radioLabelElement.appendChild(label);
					radio.appendChild(radioLabelElement);
				});
				const radios = radio.querySelectorAll("input");
				if (radios.length) radios[0].focus();
			}
			/**
			* Converts `inputOptions` into an array of `[value, label]`s
			*
			* @param {*} inputOptions
			* @typedef {string[]} InputOptionFlattened
			* @returns {InputOptionFlattened[]}
			*/
			const formatInputOptions = (inputOptions) => {
				return (inputOptions instanceof Map ? Array.from(inputOptions) : Object.entries(inputOptions)).map(([key, value]) => [key, typeof value === "object" ? formatInputOptions(value) : value]);
			};
			/**
			* @param {string} optionValue
			* @param {SweetAlertInputValue} inputValue
			* @returns {boolean}
			*/
			const isSelected = (optionValue, inputValue) => Boolean(inputValue) && inputValue != null && inputValue.toString() === optionValue.toString();
			/**
			* @param {SweetAlert} instance
			*/
			const handleConfirmButtonClick = (instance) => {
				const innerParams = privateProps.innerParams.get(instance);
				instance.disableButtons();
				if (innerParams.input) handleConfirmOrDenyWithInput(instance, "confirm");
				else confirm(instance, true);
			};
			/**
			* @param {SweetAlert} instance
			*/
			const handleDenyButtonClick = (instance) => {
				const innerParams = privateProps.innerParams.get(instance);
				instance.disableButtons();
				if (innerParams.returnInputValueOnDeny) handleConfirmOrDenyWithInput(instance, "deny");
				else deny(instance, false);
			};
			/**
			* @param {SweetAlert} instance
			* @param {(dismiss: DismissReason) => void} dismissWith
			*/
			const handleCancelButtonClick = (instance, dismissWith) => {
				instance.disableButtons();
				dismissWith(DismissReason.cancel);
			};
			/**
			* @param {SweetAlert} instance
			* @param {'confirm' | 'deny'} type
			*/
			const handleConfirmOrDenyWithInput = (instance, type) => {
				const innerParams = privateProps.innerParams.get(instance);
				if (!innerParams.input) {
					error(`The "input" parameter is needed to be set when using returnInputValueOn${capitalizeFirstLetter(type)}`);
					return;
				}
				const input = instance.getInput();
				const inputValue = getInputValue(instance, innerParams);
				if (innerParams.inputValidator) handleInputValidator(instance, inputValue, type);
				else if (input && !input.checkValidity()) {
					instance.enableButtons();
					instance.showValidationMessage(innerParams.validationMessage || input.validationMessage);
				} else if (type === "deny") deny(instance, inputValue);
				else confirm(instance, inputValue);
			};
			/**
			* @param {SweetAlert} instance
			* @param {SweetAlertInputValue} inputValue
			* @param {'confirm' | 'deny'} type
			*/
			const handleInputValidator = (instance, inputValue, type) => {
				const innerParams = privateProps.innerParams.get(instance);
				instance.disableInput();
				Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage))).then((validationMessage) => {
					instance.enableButtons();
					instance.enableInput();
					if (validationMessage) instance.showValidationMessage(validationMessage);
					else if (type === "deny") deny(instance, inputValue);
					else confirm(instance, inputValue);
				});
			};
			/**
			* @param {SweetAlert} instance
			* @param {*} value
			*/
			const deny = (instance, value) => {
				const innerParams = privateProps.innerParams.get(instance);
				if (innerParams.showLoaderOnDeny) showLoading(getDenyButton());
				if (innerParams.preDeny) {
					instance.isAwaitingPromise = true;
					Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage))).then((preDenyValue) => {
						if (preDenyValue === false) {
							instance.hideLoading();
							handleAwaitingPromise(instance);
						} else instance.close(
							/** @type SweetAlertResult */
							{
								isDenied: true,
								value: typeof preDenyValue === "undefined" ? value : preDenyValue
							}
						);
					}).catch((error) => rejectWith(instance, error));
				} else instance.close(
					/** @type SweetAlertResult */
					{
						isDenied: true,
						value
					}
				);
			};
			/**
			* @param {SweetAlert} instance
			* @param {*} value
			*/
			const succeedWith = (instance, value) => {
				instance.close(
					/** @type SweetAlertResult */
					{
						isConfirmed: true,
						value
					}
				);
			};
			/**
			*
			* @param {SweetAlert} instance
			* @param {string} error
			*/
			const rejectWith = (instance, error) => {
				instance.rejectPromise(error);
			};
			/**
			*
			* @param {SweetAlert} instance
			* @param {*} value
			*/
			const confirm = (instance, value) => {
				const innerParams = privateProps.innerParams.get(instance);
				if (innerParams.showLoaderOnConfirm) showLoading();
				if (innerParams.preConfirm) {
					instance.resetValidationMessage();
					instance.isAwaitingPromise = true;
					Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage))).then((preConfirmValue) => {
						if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
							instance.hideLoading();
							handleAwaitingPromise(instance);
						} else succeedWith(instance, typeof preConfirmValue === "undefined" ? value : preConfirmValue);
					}).catch((error) => rejectWith(instance, error));
				} else succeedWith(instance, value);
			};
			/**
			* Hides loader and shows back the button which was hidden by .showLoading()
			* @this {SweetAlert}
			*/
			function hideLoading() {
				const innerParams = privateProps.innerParams.get(this);
				if (!innerParams) return;
				const domCache = privateProps.domCache.get(this);
				hide(domCache.loader);
				if (isToast()) {
					if (innerParams.icon) show(getIcon());
				} else showRelatedButton(domCache);
				removeClass([domCache.popup, domCache.actions], swalClasses.loading);
				domCache.popup.removeAttribute("aria-busy");
				domCache.popup.removeAttribute("data-loading");
				this.enableButtons();
			}
			/**
			* @param {DomCache} domCache
			*/
			const showRelatedButton = (domCache) => {
				const dataButtonToReplace = domCache.loader.getAttribute("data-button-to-replace");
				const buttonToReplace = dataButtonToReplace ? domCache.popup.getElementsByClassName(dataButtonToReplace) : [];
				if (buttonToReplace.length) show(
					/** @type {HTMLElement} */
					buttonToReplace[0],
					"inline-block"
				);
				else if (allButtonsAreHidden()) hide(domCache.actions);
			};
			/**
			* Gets the input DOM node, this method works with input parameter.
			*
			* @returns {HTMLInputElement | null}
			* @this {SweetAlert}
			*/
			function getInput() {
				const innerParams = privateProps.innerParams.get(this);
				const domCache = privateProps.domCache.get(this);
				if (!domCache) return null;
				return getInput$1(domCache.popup, innerParams.input);
			}
			/**
			* @param {SweetAlert} instance
			* @param {string[]} buttons
			* @param {boolean} disabled
			*/
			function setButtonsDisabled(instance, buttons, disabled) {
				const domCache = privateProps.domCache.get(instance);
				buttons.forEach((button) => {
					domCache[button].disabled = disabled;
				});
			}
			/**
			* @param {HTMLInputElement | null} input
			* @param {boolean} disabled
			*/
			function setInputDisabled(input, disabled) {
				const popup = getPopup();
				if (!popup || !input) return;
				if (input.type === "radio") popup.querySelectorAll(`[name="${swalClasses.radio}"]`).forEach((radio) => {
					radio.disabled = disabled;
				});
				else input.disabled = disabled;
			}
			/**
			* Enable all the buttons
			* @this {SweetAlert}
			*/
			function enableButtons() {
				setButtonsDisabled(this, [
					"confirmButton",
					"denyButton",
					"cancelButton"
				], false);
				const focusedElement = privateProps.focusedElement.get(this);
				if (focusedElement instanceof HTMLElement && document.activeElement === document.body) focusedElement.focus();
				privateProps.focusedElement.delete(this);
			}
			/**
			* Disable all the buttons
			* @this {SweetAlert}
			*/
			function disableButtons() {
				privateProps.focusedElement.set(this, document.activeElement);
				setButtonsDisabled(this, [
					"confirmButton",
					"denyButton",
					"cancelButton"
				], true);
			}
			/**
			* Enable the input field
			* @this {SweetAlert}
			*/
			function enableInput() {
				setInputDisabled(this.getInput(), false);
			}
			/**
			* Disable the input field
			* @this {SweetAlert}
			*/
			function disableInput() {
				setInputDisabled(this.getInput(), true);
			}
			/**
			* Show block with validation message
			*
			* @param {string} error
			* @this {SweetAlert}
			*/
			function showValidationMessage(error) {
				const domCache = privateProps.domCache.get(this);
				const params = privateProps.innerParams.get(this);
				setInnerHtml(domCache.validationMessage, error);
				domCache.validationMessage.className = swalClasses["validation-message"];
				if (params.customClass && params.customClass.validationMessage) addClass(domCache.validationMessage, params.customClass.validationMessage);
				show(domCache.validationMessage);
				const input = this.getInput();
				if (input) {
					input.setAttribute("aria-invalid", "true");
					input.setAttribute("aria-describedby", swalClasses["validation-message"]);
					focusInput(input);
					addClass(input, swalClasses.inputerror);
				}
			}
			/**
			* Hide block with validation message
			*
			* @this {SweetAlert}
			*/
			function resetValidationMessage() {
				const domCache = privateProps.domCache.get(this);
				if (domCache.validationMessage) hide(domCache.validationMessage);
				const input = this.getInput();
				if (input) {
					input.removeAttribute("aria-invalid");
					input.removeAttribute("aria-describedby");
					removeClass(input, swalClasses.inputerror);
				}
			}
			const defaultParams = {
				title: "",
				titleText: "",
				text: "",
				html: "",
				footer: "",
				icon: void 0,
				iconColor: void 0,
				iconHtml: void 0,
				template: void 0,
				toast: false,
				draggable: false,
				animation: true,
				theme: "light",
				showClass: {
					popup: "swal2-show",
					backdrop: "swal2-backdrop-show",
					icon: "swal2-icon-show"
				},
				hideClass: {
					popup: "swal2-hide",
					backdrop: "swal2-backdrop-hide",
					icon: "swal2-icon-hide"
				},
				customClass: {},
				target: "body",
				color: void 0,
				backdrop: true,
				heightAuto: true,
				allowOutsideClick: true,
				allowEscapeKey: true,
				allowEnterKey: true,
				stopKeydownPropagation: true,
				keydownListenerCapture: false,
				showConfirmButton: true,
				showDenyButton: false,
				showCancelButton: false,
				preConfirm: void 0,
				preDeny: void 0,
				confirmButtonText: "OK",
				confirmButtonAriaLabel: "",
				confirmButtonColor: void 0,
				denyButtonText: "No",
				denyButtonAriaLabel: "",
				denyButtonColor: void 0,
				cancelButtonText: "Cancel",
				cancelButtonAriaLabel: "",
				cancelButtonColor: void 0,
				buttonsStyling: true,
				reverseButtons: false,
				focusConfirm: true,
				focusDeny: false,
				focusCancel: false,
				returnFocus: true,
				showCloseButton: false,
				closeButtonHtml: "&times;",
				closeButtonAriaLabel: "Close this dialog",
				loaderHtml: "",
				showLoaderOnConfirm: false,
				showLoaderOnDeny: false,
				imageUrl: void 0,
				imageWidth: void 0,
				imageHeight: void 0,
				imageAlt: "",
				timer: void 0,
				timerProgressBar: false,
				width: void 0,
				padding: void 0,
				background: void 0,
				input: void 0,
				inputPlaceholder: "",
				inputLabel: "",
				inputValue: "",
				inputOptions: {},
				inputAutoFocus: true,
				inputAutoTrim: true,
				inputAttributes: {},
				inputValidator: void 0,
				returnInputValueOnDeny: false,
				validationMessage: void 0,
				grow: false,
				position: "center",
				progressSteps: [],
				currentProgressStep: void 0,
				progressStepsDistance: void 0,
				willOpen: void 0,
				didOpen: void 0,
				didRender: void 0,
				willClose: void 0,
				didClose: void 0,
				didDestroy: void 0,
				scrollbarPadding: true,
				topLayer: false
			};
			const updatableParams = [
				"allowEscapeKey",
				"allowOutsideClick",
				"background",
				"buttonsStyling",
				"cancelButtonAriaLabel",
				"cancelButtonColor",
				"cancelButtonText",
				"closeButtonAriaLabel",
				"closeButtonHtml",
				"color",
				"confirmButtonAriaLabel",
				"confirmButtonColor",
				"confirmButtonText",
				"currentProgressStep",
				"customClass",
				"denyButtonAriaLabel",
				"denyButtonColor",
				"denyButtonText",
				"didClose",
				"didDestroy",
				"draggable",
				"footer",
				"hideClass",
				"html",
				"icon",
				"iconColor",
				"iconHtml",
				"imageAlt",
				"imageHeight",
				"imageUrl",
				"imageWidth",
				"preConfirm",
				"preDeny",
				"progressSteps",
				"returnFocus",
				"reverseButtons",
				"showCancelButton",
				"showCloseButton",
				"showConfirmButton",
				"showDenyButton",
				"text",
				"title",
				"titleText",
				"theme",
				"willClose"
			];
			/** @type {Record<string, string | undefined>} */
			const deprecatedParams = { allowEnterKey: void 0 };
			const toastIncompatibleParams = [
				"allowOutsideClick",
				"allowEnterKey",
				"backdrop",
				"draggable",
				"focusConfirm",
				"focusDeny",
				"focusCancel",
				"returnFocus",
				"heightAuto",
				"keydownListenerCapture"
			];
			/**
			* Is valid parameter
			*
			* @param {string} paramName
			* @returns {boolean}
			*/
			const isValidParameter = (paramName) => {
				return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
			};
			/**
			* Is valid parameter for Swal.update() method
			*
			* @param {string} paramName
			* @returns {boolean}
			*/
			const isUpdatableParameter = (paramName) => {
				return updatableParams.indexOf(paramName) !== -1;
			};
			/**
			* Is deprecated parameter
			*
			* @param {string} paramName
			* @returns {string | undefined}
			*/
			const isDeprecatedParameter = (paramName) => {
				return deprecatedParams[paramName];
			};
			/**
			* @param {string} param
			*/
			const checkIfParamIsValid = (param) => {
				if (!isValidParameter(param)) warn(`Unknown parameter "${param}"`);
			};
			/**
			* @param {string} param
			*/
			const checkIfToastParamIsValid = (param) => {
				if (toastIncompatibleParams.includes(param)) warn(`The parameter "${param}" is incompatible with toasts`);
			};
			/**
			* @param {string} param
			*/
			const checkIfParamIsDeprecated = (param) => {
				const isDeprecated = isDeprecatedParameter(param);
				if (isDeprecated) warnAboutDeprecation(param, isDeprecated);
			};
			/**
			* Show relevant warnings for given params
			*
			* @param {SweetAlertOptions} params
			*/
			const showWarningsForParams = (params) => {
				if (params.backdrop === false && params.allowOutsideClick) warn("\"allowOutsideClick\" parameter requires `backdrop` parameter to be set to `true`");
				if (params.theme && ![
					"light",
					"dark",
					"auto",
					"minimal",
					"borderless",
					"bootstrap-4",
					"bootstrap-4-light",
					"bootstrap-4-dark",
					"bootstrap-5",
					"bootstrap-5-light",
					"bootstrap-5-dark",
					"material-ui",
					"material-ui-light",
					"material-ui-dark",
					"embed-iframe",
					"bulma",
					"bulma-light",
					"bulma-dark"
				].includes(params.theme)) warn(`Invalid theme "${params.theme}"`);
				for (const param in params) {
					checkIfParamIsValid(param);
					if (params.toast) checkIfToastParamIsValid(param);
					checkIfParamIsDeprecated(param);
				}
			};
			/**
			* Updates popup parameters.
			*
			* @this {any}
			* @param {SweetAlertOptions} params
			*/
			function update(params) {
				const container = getContainer();
				const popup = getPopup();
				const innerParams = privateProps.innerParams.get(this);
				if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
					warn(`You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`);
					return;
				}
				const validUpdatableParams = filterValidParams(params);
				const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
				showWarningsForParams(updatedParams);
				if (container) container.dataset["swal2Theme"] = updatedParams.theme;
				render(this, updatedParams);
				privateProps.innerParams.set(this, updatedParams);
				Object.defineProperties(this, { params: {
					value: Object.assign({}, this.params, params),
					writable: false,
					enumerable: true
				} });
			}
			/**
			* @param {SweetAlertOptions} params
			* @returns {SweetAlertOptions}
			*/
			const filterValidParams = (params) => {
				/** @type {Record<string, any>} */
				const validUpdatableParams = {};
				Object.keys(params).forEach((param) => {
					if (isUpdatableParameter(param)) validUpdatableParams[param] = params[param];
					else warn(`Invalid parameter to update: ${param}`);
				});
				return validUpdatableParams;
			};
			/**
			* Dispose the current SweetAlert2 instance
			* @this {SweetAlert}
			*/
			function _destroy() {
				var _globalState$eventEmi;
				const domCache = privateProps.domCache.get(this);
				const innerParams = privateProps.innerParams.get(this);
				if (!innerParams) {
					disposeWeakMaps(this);
					return;
				}
				if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
					globalState.swalCloseEventFinishedCallback();
					delete globalState.swalCloseEventFinishedCallback;
				}
				if (typeof innerParams.didDestroy === "function") innerParams.didDestroy();
				(_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("didDestroy");
				disposeSwal(this);
			}
			/**
			* @param {SweetAlert} instance
			*/
			const disposeSwal = (instance) => {
				disposeWeakMaps(instance);
				delete instance.params;
				delete globalState.keydownHandler;
				delete globalState.keydownTarget;
				delete globalState.currentInstance;
			};
			/**
			* @param {SweetAlert} instance
			*/
			const disposeWeakMaps = (instance) => {
				if (instance.isAwaitingPromise) {
					unsetWeakMaps(privateProps, instance);
					instance.isAwaitingPromise = true;
				} else {
					unsetWeakMaps(privateMethods, instance);
					unsetWeakMaps(privateProps, instance);
					delete instance.isAwaitingPromise;
					delete instance.disableButtons;
					delete instance.enableButtons;
					delete instance.getInput;
					delete instance.disableInput;
					delete instance.enableInput;
					delete instance.hideLoading;
					delete instance.disableLoading;
					delete instance.showValidationMessage;
					delete instance.resetValidationMessage;
					delete instance.close;
					delete instance.closePopup;
					delete instance.closeModal;
					delete instance.closeToast;
					delete instance.rejectPromise;
					delete instance.update;
					delete instance._destroy;
				}
			};
			/**
			* @param {Record<string, WeakMap<any, any>>} obj
			* @param {SweetAlert} instance
			*/
			const unsetWeakMaps = (obj, instance) => {
				for (const i in obj) obj[i].delete(instance);
			};
			var instanceMethods = /*#__PURE__*/ Object.freeze({
				__proto__: null,
				_destroy,
				close,
				closeModal: close,
				closePopup: close,
				closeToast: close,
				disableButtons,
				disableInput,
				disableLoading: hideLoading,
				enableButtons,
				enableInput,
				getInput,
				handleAwaitingPromise,
				hideLoading,
				rejectPromise,
				resetValidationMessage,
				showValidationMessage,
				update
			});
			/**
			* @param {SweetAlertOptions} innerParams
			* @param {DomCache} domCache
			* @param {(dismiss: DismissReason) => void} dismissWith
			*/
			const handlePopupClick = (innerParams, domCache, dismissWith) => {
				if (innerParams.toast) handleToastClick(innerParams, domCache, dismissWith);
				else {
					handleModalMousedown(domCache);
					handleContainerMousedown(domCache);
					handleModalClick(innerParams, domCache, dismissWith);
				}
			};
			/**
			* @param {SweetAlertOptions} innerParams
			* @param {DomCache} domCache
			* @param {(dismiss: DismissReason) => void} dismissWith
			*/
			const handleToastClick = (innerParams, domCache, dismissWith) => {
				domCache.popup.onclick = () => {
					if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) return;
					dismissWith(DismissReason.close);
				};
			};
			/**
			* @param {SweetAlertOptions} innerParams
			* @returns {boolean}
			*/
			const isAnyButtonShown = (innerParams) => {
				return Boolean(innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton);
			};
			let ignoreOutsideClick = false;
			/**
			* @param {DomCache} domCache
			*/
			const handleModalMousedown = (domCache) => {
				domCache.popup.onmousedown = () => {
					domCache.container.onmouseup = function(e) {
						domCache.container.onmouseup = () => {};
						if (e.target === domCache.container) ignoreOutsideClick = true;
					};
				};
			};
			/**
			* @param {DomCache} domCache
			*/
			const handleContainerMousedown = (domCache) => {
				domCache.container.onmousedown = (e) => {
					if (e.target === domCache.container) e.preventDefault();
					domCache.popup.onmouseup = function(e) {
						domCache.popup.onmouseup = () => {};
						if (e.target === domCache.popup || e.target instanceof HTMLElement && domCache.popup.contains(e.target)) ignoreOutsideClick = true;
					};
				};
			};
			/**
			* @param {SweetAlertOptions} innerParams
			* @param {DomCache} domCache
			* @param {(dismiss: DismissReason) => void} dismissWith
			*/
			const handleModalClick = (innerParams, domCache, dismissWith) => {
				domCache.container.onclick = (e) => {
					if (ignoreOutsideClick) {
						ignoreOutsideClick = false;
						return;
					}
					if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) dismissWith(DismissReason.backdrop);
				};
			};
			/**
			* @param {unknown} elem
			* @returns {boolean}
			*/
			const isJqueryElement = (elem) => typeof elem === "object" && elem !== null && "jquery" in elem;
			/**
			* @param {unknown} elem
			* @returns {boolean}
			*/
			const isElement = (elem) => elem instanceof Element || isJqueryElement(elem);
			/**
			* @param {ReadonlyArray<unknown>} args
			* @returns {SweetAlertOptions}
			*/
			const argsToParams = (args) => {
				/** @type {Record<string, unknown>} */
				const params = {};
				if (typeof args[0] === "object" && !isElement(args[0])) Object.assign(params, args[0]);
				else [
					"title",
					"html",
					"icon"
				].forEach((name, index) => {
					const arg = args[index];
					if (typeof arg === "string" || isElement(arg)) params[name] = arg;
					else if (arg !== void 0) error(`Unexpected type of ${name}! Expected "string" or "Element", got ${typeof arg}`);
				});
				return params;
			};
			/**
			* Main method to create a new SweetAlert2 popup
			*
			* @this {new (...args: any[]) => any}
			* @param  {...SweetAlertOptions} args
			* @returns {Promise<SweetAlertResult>}
			*/
			function fire(...args) {
				return new this(...args);
			}
			/**
			* Returns an extended version of `Swal` containing `params` as defaults.
			* Useful for reusing Swal configuration.
			*
			* For example:
			*
			* Before:
			* const textPromptOptions = { input: 'text', showCancelButton: true }
			* const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
			* const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
			*
			* After:
			* const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
			* const {value: firstName} = await TextPrompt('What is your first name?')
			* const {value: lastName} = await TextPrompt('What is your last name?')
			*
			* @param {SweetAlertOptions} mixinParams
			* @returns {SweetAlert}
			* @this {typeof import('../SweetAlert.js').SweetAlert}
			*/
			function mixin(mixinParams) {
				class MixinSwal extends this {
					/**
					* @param {any} params
					* @param {any} priorityMixinParams
					*/
					_main(params, priorityMixinParams) {
						return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
					}
				}
				return MixinSwal;
			}
			/**
			* If `timer` parameter is set, returns number of milliseconds of timer remained.
			* Otherwise, returns undefined.
			*
			* @returns {number | undefined}
			*/
			const getTimerLeft = () => {
				return globalState.timeout && globalState.timeout.getTimerLeft();
			};
			/**
			* Stop timer. Returns number of milliseconds of timer remained.
			* If `timer` parameter isn't set, returns undefined.
			*
			* @returns {number | undefined}
			*/
			const stopTimer = () => {
				if (globalState.timeout) {
					stopTimerProgressBar();
					return globalState.timeout.stop();
				}
			};
			/**
			* Resume timer. Returns number of milliseconds of timer remained.
			* If `timer` parameter isn't set, returns undefined.
			*
			* @returns {number | undefined}
			*/
			const resumeTimer = () => {
				if (globalState.timeout) {
					const remaining = globalState.timeout.start();
					animateTimerProgressBar(remaining);
					return remaining;
				}
			};
			/**
			* Resume timer. Returns number of milliseconds of timer remained.
			* If `timer` parameter isn't set, returns undefined.
			*
			* @returns {number | undefined}
			*/
			const toggleTimer = () => {
				const timer = globalState.timeout;
				return timer && (timer.running ? stopTimer() : resumeTimer());
			};
			/**
			* Increase timer. Returns number of milliseconds of an updated timer.
			* If `timer` parameter isn't set, returns undefined.
			*
			* @param {number} ms
			* @returns {number | undefined}
			*/
			const increaseTimer = (ms) => {
				if (globalState.timeout) {
					const remaining = globalState.timeout.increase(ms);
					animateTimerProgressBar(remaining, true);
					return remaining;
				}
			};
			/**
			* Check if timer is running. Returns true if timer is running
			* or false if timer is paused or stopped.
			* If `timer` parameter isn't set, returns undefined
			*
			* @returns {boolean}
			*/
			const isTimerRunning = () => {
				return Boolean(globalState.timeout && globalState.timeout.isRunning());
			};
			let bodyClickListenerAdded = false;
			/** @type {Record<string, any>} */
			const clickHandlers = {};
			/**
			* @this {any}
			* @param {string} attr
			*/
			function bindClickHandler(attr = "data-swal-template") {
				clickHandlers[attr] = this;
				if (!bodyClickListenerAdded) {
					document.body.addEventListener("click", bodyClickListener);
					bodyClickListenerAdded = true;
				}
			}
			/**
			* @param {MouseEvent} event
			*/
			const bodyClickListener = (event) => {
				for (let el = event.target; el && el !== document; el = el.parentNode) for (const attr in clickHandlers) {
					const template = el.getAttribute && el.getAttribute(attr);
					if (template) {
						clickHandlers[attr].fire({ template });
						return;
					}
				}
			};
			class EventEmitter {
				constructor() {
					/** @type {Events} */
					this.events = {};
				}
				/**
				* @param {string} eventName
				* @returns {EventHandlers}
				*/
				_getHandlersByEventName(eventName) {
					if (typeof this.events[eventName] === "undefined") this.events[eventName] = [];
					return this.events[eventName];
				}
				/**
				* @param {string} eventName
				* @param {EventHandler} eventHandler
				*/
				on(eventName, eventHandler) {
					const currentHandlers = this._getHandlersByEventName(eventName);
					if (!currentHandlers.includes(eventHandler)) currentHandlers.push(eventHandler);
				}
				/**
				* @param {string} eventName
				* @param {EventHandler} eventHandler
				*/
				once(eventName, eventHandler) {
					/**
					* @param {...any} args
					*/
					const onceFn = (...args) => {
						this.removeListener(eventName, onceFn);
						eventHandler.apply(this, args);
					};
					this.on(eventName, onceFn);
				}
				/**
				* @param {string} eventName
				* @param {...any} args
				*/
				emit(eventName, ...args) {
					this._getHandlersByEventName(eventName).forEach(
						/**
						* @param {EventHandler} eventHandler
						*/
						(eventHandler) => {
							try {
								eventHandler.apply(this, args);
							} catch (error) {
								console.error(error);
							}
						}
					);
				}
				/**
				* @param {string} eventName
				* @param {EventHandler} eventHandler
				*/
				removeListener(eventName, eventHandler) {
					const currentHandlers = this._getHandlersByEventName(eventName);
					const index = currentHandlers.indexOf(eventHandler);
					if (index > -1) currentHandlers.splice(index, 1);
				}
				/**
				* @param {string} eventName
				*/
				removeAllListeners(eventName) {
					if (this.events[eventName] !== void 0) this.events[eventName].length = 0;
				}
				reset() {
					this.events = {};
				}
			}
			globalState.eventEmitter = new EventEmitter();
			/**
			* @param {string} eventName
			* @param {EventHandler} eventHandler
			*/
			const on = (eventName, eventHandler) => {
				if (globalState.eventEmitter) globalState.eventEmitter.on(eventName, eventHandler);
			};
			/**
			* @param {string} eventName
			* @param {EventHandler} eventHandler
			*/
			const once = (eventName, eventHandler) => {
				if (globalState.eventEmitter) globalState.eventEmitter.once(eventName, eventHandler);
			};
			/**
			* @param {string} [eventName]
			* @param {EventHandler} [eventHandler]
			*/
			const off = (eventName, eventHandler) => {
				if (!globalState.eventEmitter) return;
				if (!eventName) {
					globalState.eventEmitter.reset();
					return;
				}
				if (eventHandler) globalState.eventEmitter.removeListener(eventName, eventHandler);
				else globalState.eventEmitter.removeAllListeners(eventName);
			};
			var staticMethods = /*#__PURE__*/ Object.freeze({
				__proto__: null,
				argsToParams,
				bindClickHandler,
				clickCancel,
				clickConfirm,
				clickDeny,
				enableLoading: showLoading,
				fire,
				getActions,
				getCancelButton,
				getCloseButton,
				getConfirmButton,
				getContainer,
				getDenyButton,
				getFocusableElements,
				getFooter,
				getHtmlContainer,
				getIcon,
				getIconContent,
				getImage,
				getInputLabel,
				getLoader,
				getPopup,
				getProgressSteps,
				getTimerLeft,
				getTimerProgressBar,
				getTitle,
				getValidationMessage,
				increaseTimer,
				isDeprecatedParameter,
				isLoading,
				isTimerRunning,
				isUpdatableParameter,
				isValidParameter,
				isVisible,
				mixin,
				off,
				on,
				once,
				resumeTimer,
				showLoading,
				stopTimer,
				toggleTimer
			});
			class Timer {
				/**
				* @param {() => void} callback
				* @param {number} delay
				*/
				constructor(callback, delay) {
					this.callback = callback;
					this.remaining = delay;
					this.running = false;
					this.start();
				}
				/**
				* @returns {number}
				*/
				start() {
					if (!this.running) {
						this.running = true;
						this.started = /* @__PURE__ */ new Date();
						this.id = setTimeout(this.callback, this.remaining);
					}
					return this.remaining;
				}
				/**
				* @returns {number}
				*/
				stop() {
					if (this.started && this.running) {
						this.running = false;
						clearTimeout(this.id);
						this.remaining -= (/* @__PURE__ */ new Date()).getTime() - this.started.getTime();
					}
					return this.remaining;
				}
				/**
				* @param {number} n
				* @returns {number}
				*/
				increase(n) {
					const running = this.running;
					if (running) this.stop();
					this.remaining += n;
					if (running) this.start();
					return this.remaining;
				}
				/**
				* @returns {number}
				*/
				getTimerLeft() {
					if (this.running) {
						this.stop();
						this.start();
					}
					return this.remaining;
				}
				/**
				* @returns {boolean}
				*/
				isRunning() {
					return this.running;
				}
			}
			const swalStringParams = [
				"swal-title",
				"swal-html",
				"swal-footer"
			];
			/**
			* @param {SweetAlertOptions} params
			* @returns {SweetAlertOptions}
			*/
			const getTemplateParams = (params) => {
				const template = typeof params.template === "string" ? document.querySelector(params.template) : params.template;
				if (!template) return {};
				/** @type {DocumentFragment} */
				const templateContent = template.content;
				showWarningsForElements(templateContent);
				return Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
			};
			/**
			* @param {DocumentFragment} templateContent
			* @returns {Record<string, string | boolean | number>}
			*/
			const getSwalParams = (templateContent) => {
				/** @type {Record<string, string | boolean | number>} */
				const result = {};
				Array.from(templateContent.querySelectorAll("swal-param")).forEach((param) => {
					showWarningsForAttributes(param, ["name", "value"]);
					const paramName = param.getAttribute("name");
					const value = param.getAttribute("value");
					if (!paramName || !value) return;
					if (paramName in defaultParams && typeof defaultParams[paramName] === "boolean") result[paramName] = value !== "false";
					else if (paramName in defaultParams && typeof defaultParams[paramName] === "object") result[paramName] = JSON.parse(value);
					else result[paramName] = value;
				});
				return result;
			};
			/**
			* @param {DocumentFragment} templateContent
			* @returns {Record<string, () => void>}
			*/
			const getSwalFunctionParams = (templateContent) => {
				/** @type {Record<string, () => void>} */
				const result = {};
				Array.from(templateContent.querySelectorAll("swal-function-param")).forEach((param) => {
					const paramName = param.getAttribute("name");
					const value = param.getAttribute("value");
					if (!paramName || !value) return;
					result[paramName] = new Function(`return ${value}`)();
				});
				return result;
			};
			/**
			* @param {DocumentFragment} templateContent
			* @returns {Record<string, string | boolean>}
			*/
			const getSwalButtons = (templateContent) => {
				/** @type {Record<string, string | boolean>} */
				const result = {};
				Array.from(templateContent.querySelectorAll("swal-button")).forEach((button) => {
					showWarningsForAttributes(button, [
						"type",
						"color",
						"aria-label"
					]);
					const type = button.getAttribute("type");
					if (!type || ![
						"confirm",
						"cancel",
						"deny"
					].includes(type)) return;
					result[`${type}ButtonText`] = button.innerHTML;
					result[`show${capitalizeFirstLetter(type)}Button`] = true;
					const color = button.getAttribute("color");
					if (color !== null) result[`${type}ButtonColor`] = color;
					const ariaLabel = button.getAttribute("aria-label");
					if (ariaLabel !== null) result[`${type}ButtonAriaLabel`] = ariaLabel;
				});
				return result;
			};
			/**
			* @param {DocumentFragment} templateContent
			* @returns {Pick<SweetAlertOptions, 'imageUrl' | 'imageWidth' | 'imageHeight' | 'imageAlt'>}
			*/
			const getSwalImage = (templateContent) => {
				const result = {};
				/** @type {HTMLElement | null} */
				const image = templateContent.querySelector("swal-image");
				if (image) {
					showWarningsForAttributes(image, [
						"src",
						"width",
						"height",
						"alt"
					]);
					const src = image.getAttribute("src");
					if (src !== null) result.imageUrl = src || void 0;
					const width = image.getAttribute("width");
					if (width !== null) result.imageWidth = width || void 0;
					const height = image.getAttribute("height");
					if (height !== null) result.imageHeight = height || void 0;
					const alt = image.getAttribute("alt");
					if (alt !== null) result.imageAlt = alt || void 0;
				}
				return result;
			};
			/**
			* @param {DocumentFragment} templateContent
			* @returns {object}
			*/
			const getSwalIcon = (templateContent) => {
				const result = {};
				/** @type {HTMLElement | null} */
				const icon = templateContent.querySelector("swal-icon");
				if (icon) {
					showWarningsForAttributes(icon, ["type", "color"]);
					if (icon.hasAttribute("type")) result.icon = icon.getAttribute("type");
					if (icon.hasAttribute("color")) result.iconColor = icon.getAttribute("color");
					result.iconHtml = icon.innerHTML;
				}
				return result;
			};
			/**
			* @param {DocumentFragment} templateContent
			* @returns {object}
			*/
			const getSwalInput = (templateContent) => {
				/** @type {Record<string, any>} */
				const result = {};
				/** @type {HTMLElement | null} */
				const input = templateContent.querySelector("swal-input");
				if (input) {
					showWarningsForAttributes(input, [
						"type",
						"label",
						"placeholder",
						"value"
					]);
					result.input = input.getAttribute("type") || "text";
					if (input.hasAttribute("label")) result.inputLabel = input.getAttribute("label");
					if (input.hasAttribute("placeholder")) result.inputPlaceholder = input.getAttribute("placeholder");
					if (input.hasAttribute("value")) result.inputValue = input.getAttribute("value");
				}
				/** @type {HTMLElement[]} */
				const inputOptions = Array.from(templateContent.querySelectorAll("swal-input-option"));
				if (inputOptions.length) {
					result.inputOptions = {};
					inputOptions.forEach((option) => {
						showWarningsForAttributes(option, ["value"]);
						const optionValue = option.getAttribute("value");
						if (!optionValue) return;
						const optionName = option.innerHTML;
						result.inputOptions[optionValue] = optionName;
					});
				}
				return result;
			};
			/**
			* @param {DocumentFragment} templateContent
			* @param {string[]} paramNames
			* @returns {Record<string, string>}
			*/
			const getSwalStringParams = (templateContent, paramNames) => {
				/** @type {Record<string, string>} */
				const result = {};
				for (const i in paramNames) {
					const paramName = paramNames[i];
					/** @type {HTMLElement | null} */
					const tag = templateContent.querySelector(paramName);
					if (tag) {
						showWarningsForAttributes(tag, []);
						result[paramName.replace(/^swal-/, "")] = tag.innerHTML.trim();
					}
				}
				return result;
			};
			/**
			* @param {DocumentFragment} templateContent
			*/
			const showWarningsForElements = (templateContent) => {
				const allowedElements = swalStringParams.concat([
					"swal-param",
					"swal-function-param",
					"swal-button",
					"swal-image",
					"swal-icon",
					"swal-input",
					"swal-input-option"
				]);
				Array.from(templateContent.children).forEach((el) => {
					const tagName = el.tagName.toLowerCase();
					if (!allowedElements.includes(tagName)) warn(`Unrecognized element <${tagName}>`);
				});
			};
			/**
			* @param {HTMLElement} el
			* @param {string[]} allowedAttributes
			*/
			const showWarningsForAttributes = (el, allowedAttributes) => {
				Array.from(el.attributes).forEach((attribute) => {
					if (allowedAttributes.indexOf(attribute.name) === -1) warn([`Unrecognized attribute "${attribute.name}" on <${el.tagName.toLowerCase()}>.`, `${allowedAttributes.length ? `Allowed attributes are: ${allowedAttributes.join(", ")}` : "To set the value, use HTML within the element."}`]);
				});
			};
			const SHOW_CLASS_TIMEOUT = 10;
			/**
			* Open popup, add necessary classes and styles, fix scrollbar
			*
			* @param {SweetAlertOptions} params
			*/
			const openPopup = (params) => {
				var _globalState$eventEmi, _globalState$eventEmi2;
				const container = getContainer();
				const popup = getPopup();
				if (!container || !popup) return;
				if (typeof params.willOpen === "function") params.willOpen(popup);
				(_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("willOpen", popup);
				const initialBodyOverflow = window.getComputedStyle(document.body).overflowY;
				addClasses(container, popup, params);
				setTimeout(() => {
					setScrollingVisibility(container, popup);
				}, SHOW_CLASS_TIMEOUT);
				if (isModal()) {
					fixScrollContainer(container, params.scrollbarPadding !== void 0 ? params.scrollbarPadding : false, initialBodyOverflow);
					setAriaHidden();
				}
				if (isIOS && params.backdrop === false && popup.scrollHeight > container.clientHeight) container.style.pointerEvents = "auto";
				if (!isToast() && !globalState.previousActiveElement) globalState.previousActiveElement = document.activeElement;
				if (typeof params.didOpen === "function") {
					const didOpen = params.didOpen;
					setTimeout(() => didOpen(popup));
				}
				(_globalState$eventEmi2 = globalState.eventEmitter) === null || _globalState$eventEmi2 === void 0 || _globalState$eventEmi2.emit("didOpen", popup);
			};
			/**
			* @param {Event} event
			*/
			const swalOpenAnimationFinished = (event) => {
				const popup = getPopup();
				if (!popup || event.target !== popup) return;
				const container = getContainer();
				if (!container) return;
				popup.removeEventListener("animationend", swalOpenAnimationFinished);
				popup.removeEventListener("transitionend", swalOpenAnimationFinished);
				container.style.overflowY = "auto";
				removeClass(container, swalClasses["no-transition"]);
			};
			/**
			* @param {HTMLElement} container
			* @param {HTMLElement} popup
			*/
			const setScrollingVisibility = (container, popup) => {
				if (hasCssAnimation(popup)) {
					container.style.overflowY = "hidden";
					popup.addEventListener("animationend", swalOpenAnimationFinished);
					popup.addEventListener("transitionend", swalOpenAnimationFinished);
				} else container.style.overflowY = "auto";
			};
			/**
			* @param {HTMLElement} container
			* @param {boolean} scrollbarPadding
			* @param {string} initialBodyOverflow
			*/
			const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
				iOSfix();
				if (scrollbarPadding && initialBodyOverflow !== "hidden") replaceScrollbarWithPadding(initialBodyOverflow);
				setTimeout(() => {
					container.scrollTop = 0;
				});
			};
			/**
			* @param {HTMLElement} container
			* @param {HTMLElement} popup
			* @param {SweetAlertOptions} params
			*/
			const addClasses = (container, popup, params) => {
				var _params$showClass;
				if ((_params$showClass = params.showClass) !== null && _params$showClass !== void 0 && _params$showClass.backdrop) addClass(container, params.showClass.backdrop);
				if (params.animation) {
					popup.style.setProperty("opacity", "0", "important");
					show(popup, "grid");
					setTimeout(() => {
						var _params$showClass2;
						if ((_params$showClass2 = params.showClass) !== null && _params$showClass2 !== void 0 && _params$showClass2.popup) addClass(popup, params.showClass.popup);
						popup.style.removeProperty("opacity");
					}, SHOW_CLASS_TIMEOUT);
				} else show(popup, "grid");
				addClass([document.documentElement, document.body], swalClasses.shown);
				if (params.heightAuto && params.backdrop && !params.toast) addClass([document.documentElement, document.body], swalClasses["height-auto"]);
			};
			var defaultInputValidators = {
				/**
				* @param {string} string
				* @param {string} [validationMessage]
				* @returns {Promise<string | void>}
				*/
				email: (string, validationMessage) => {
					return /^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid email address");
				},
				/**
				* @param {string} string
				* @param {string} [validationMessage]
				* @returns {Promise<string | void>}
				*/
				url: (string, validationMessage) => {
					return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid URL");
				}
			};
			/**
			* @param {SweetAlertOptions} params
			*/
			function setDefaultInputValidators(params) {
				if (params.inputValidator) return;
				if (params.input === "email") params.inputValidator = defaultInputValidators["email"];
				if (params.input === "url") params.inputValidator = defaultInputValidators["url"];
			}
			/**
			* @param {SweetAlertOptions} params
			*/
			function validateCustomTargetElement(params) {
				if (!params.target || typeof params.target === "string" && !document.querySelector(params.target) || typeof params.target !== "string" && !params.target.appendChild) {
					warn("Target parameter is not valid, defaulting to \"body\"");
					params.target = "body";
				}
			}
			/**
			* Set type, text and actions on popup
			*
			* @param {SweetAlertOptions} params
			*/
			function setParameters(params) {
				setDefaultInputValidators(params);
				if (params.showLoaderOnConfirm && !params.preConfirm) warn("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request");
				validateCustomTargetElement(params);
				if (typeof params.title === "string") params.title = params.title.split("\n").join("<br />");
				init(params);
			}
			/** @type {SweetAlert} */
			let currentInstance;
			var _promise = /*#__PURE__*/ new WeakMap();
			class SweetAlert {
				/**
				* @param {...(SweetAlertOptions | string)} args
				* @this {SweetAlert}
				*/
				constructor(...args) {
					/**
					* @type {Promise<SweetAlertResult>}
					*/
					_classPrivateFieldInitSpec(this, _promise, Promise.resolve({
						isConfirmed: false,
						isDenied: false,
						isDismissed: true
					}));
					if (typeof window === "undefined") return;
					currentInstance = this;
					const outerParams = Object.freeze(this.constructor.argsToParams(args));
					/** @type {Readonly<SweetAlertOptions>} */
					this.params = outerParams;
					/** @type {boolean} */
					this.isAwaitingPromise = false;
					_classPrivateFieldSet2(_promise, this, this._main(currentInstance.params));
				}
				/**
				* @param {any} userParams
				* @param {any} mixinParams
				*/
				_main(userParams, mixinParams = {}) {
					showWarningsForParams(Object.assign({}, mixinParams, userParams));
					if (globalState.currentInstance) {
						const swalPromiseResolve = privateMethods.swalPromiseResolve.get(globalState.currentInstance);
						const { isAwaitingPromise } = globalState.currentInstance;
						globalState.currentInstance._destroy();
						if (!isAwaitingPromise) swalPromiseResolve({ isDismissed: true });
						if (isModal()) unsetAriaHidden();
					}
					globalState.currentInstance = currentInstance;
					const innerParams = prepareParams(userParams, mixinParams);
					setParameters(innerParams);
					Object.freeze(innerParams);
					if (globalState.timeout) {
						globalState.timeout.stop();
						delete globalState.timeout;
					}
					clearTimeout(globalState.restoreFocusTimeout);
					const domCache = populateDomCache(currentInstance);
					render(currentInstance, innerParams);
					privateProps.innerParams.set(currentInstance, innerParams);
					return swalPromise(currentInstance, domCache, innerParams);
				}
				/**
				* @param {any} onFulfilled
				*/
				then(onFulfilled) {
					return _classPrivateFieldGet2(_promise, this).then(onFulfilled);
				}
				/**
				* @param {any} onFinally
				*/
				finally(onFinally) {
					return _classPrivateFieldGet2(_promise, this).finally(onFinally);
				}
			}
			/**
			* @param {SweetAlert} instance
			* @param {DomCache} domCache
			* @param {SweetAlertOptions} innerParams
			* @returns {Promise<SweetAlertResult>}
			*/
			const swalPromise = (instance, domCache, innerParams) => {
				return new Promise((resolve, reject) => {
					/**
					* @param {DismissReason} dismiss
					*/
					const dismissWith = (dismiss) => {
						instance.close({
							isDismissed: true,
							dismiss,
							isConfirmed: false,
							isDenied: false
						});
					};
					privateMethods.swalPromiseResolve.set(instance, resolve);
					privateMethods.swalPromiseReject.set(instance, reject);
					domCache.confirmButton.onclick = () => {
						handleConfirmButtonClick(instance);
					};
					domCache.denyButton.onclick = () => {
						handleDenyButtonClick(instance);
					};
					domCache.cancelButton.onclick = () => {
						handleCancelButtonClick(instance, dismissWith);
					};
					domCache.closeButton.onclick = () => {
						dismissWith(DismissReason.close);
					};
					handlePopupClick(innerParams, domCache, dismissWith);
					addKeydownHandler(globalState, innerParams, dismissWith);
					handleInputOptionsAndValue(instance, innerParams);
					openPopup(innerParams);
					setupTimer(globalState, innerParams, dismissWith);
					initFocus(domCache, innerParams);
					setTimeout(() => {
						domCache.container.scrollTop = 0;
					});
				});
			};
			/**
			* @param {SweetAlertOptions} userParams
			* @param {SweetAlertOptions} mixinParams
			* @returns {SweetAlertOptions}
			*/
			const prepareParams = (userParams, mixinParams) => {
				const templateParams = getTemplateParams(userParams);
				const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams);
				params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
				params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
				if (params.animation === false) {
					params.showClass = { backdrop: "swal2-noanimation" };
					params.hideClass = {};
				}
				return params;
			};
			/**
			* @param {SweetAlert} instance
			* @returns {DomCache}
			*/
			const populateDomCache = (instance) => {
				const domCache = (/** @type {DomCache} */ {
					popup: /** @type {HTMLElement} */ getPopup(),
					container: /** @type {HTMLElement} */ getContainer(),
					actions: /** @type {HTMLElement} */ getActions(),
					confirmButton: /** @type {HTMLElement} */ getConfirmButton(),
					denyButton: /** @type {HTMLElement} */ getDenyButton(),
					cancelButton: /** @type {HTMLElement} */ getCancelButton(),
					loader: /** @type {HTMLElement} */ getLoader(),
					closeButton: /** @type {HTMLElement} */ getCloseButton(),
					validationMessage: /** @type {HTMLElement} */ getValidationMessage(),
					progressSteps: /** @type {HTMLElement} */ getProgressSteps()
				});
				privateProps.domCache.set(instance, domCache);
				return domCache;
			};
			/**
			* @param {GlobalState} globalState
			* @param {SweetAlertOptions} innerParams
			* @param {(dismiss: DismissReason) => void} dismissWith
			*/
			const setupTimer = (globalState, innerParams, dismissWith) => {
				const timerProgressBar = getTimerProgressBar();
				hide(timerProgressBar);
				if (innerParams.timer) {
					globalState.timeout = new Timer(() => {
						dismissWith("timer");
						delete globalState.timeout;
					}, innerParams.timer);
					if (innerParams.timerProgressBar && timerProgressBar) {
						show(timerProgressBar);
						applyCustomClass(timerProgressBar, innerParams, "timerProgressBar");
						setTimeout(() => {
							if (globalState.timeout && globalState.timeout.running) animateTimerProgressBar(
								/** @type {number} */
								innerParams.timer
							);
						});
					}
				}
			};
			/**
			* Initialize focus in the popup:
			*
			* 1. If `toast` is `true`, don't steal focus from the document.
			* 2. Else if there is an [autofocus] element, focus it.
			* 3. Else if `focusConfirm` is `true` and confirm button is visible, focus it.
			* 4. Else if `focusDeny` is `true` and deny button is visible, focus it.
			* 5. Else if `focusCancel` is `true` and cancel button is visible, focus it.
			* 6. Else focus the first focusable element in a popup (if any).
			*
			* @param {DomCache} domCache
			* @param {SweetAlertOptions} innerParams
			*/
			const initFocus = (domCache, innerParams) => {
				if (innerParams.toast) return;
				if (!callIfFunction(innerParams.allowEnterKey)) {
					warnAboutDeprecation("allowEnterKey", "preConfirm: () => false");
					domCache.popup.focus();
					return;
				}
				if (focusAutofocus(domCache)) return;
				if (focusButton(domCache, innerParams)) return;
				setFocus(-1, 1);
			};
			/**
			* @param {DomCache} domCache
			* @returns {boolean}
			*/
			const focusAutofocus = (domCache) => {
				const autofocusElements = Array.from(domCache.popup.querySelectorAll("[autofocus]"));
				for (const autofocusElement of autofocusElements) if (autofocusElement instanceof HTMLElement && isVisible$1(autofocusElement)) {
					autofocusElement.focus();
					return true;
				}
				return false;
			};
			/**
			* @param {DomCache} domCache
			* @param {SweetAlertOptions} innerParams
			* @returns {boolean}
			*/
			const focusButton = (domCache, innerParams) => {
				if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
					domCache.denyButton.focus();
					return true;
				}
				if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
					domCache.cancelButton.focus();
					return true;
				}
				if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
					domCache.confirmButton.focus();
					return true;
				}
				return false;
			};
			SweetAlert.prototype.disableButtons = disableButtons;
			SweetAlert.prototype.enableButtons = enableButtons;
			SweetAlert.prototype.getInput = getInput;
			SweetAlert.prototype.disableInput = disableInput;
			SweetAlert.prototype.enableInput = enableInput;
			SweetAlert.prototype.hideLoading = hideLoading;
			SweetAlert.prototype.disableLoading = hideLoading;
			SweetAlert.prototype.showValidationMessage = showValidationMessage;
			SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
			SweetAlert.prototype.close = close;
			SweetAlert.prototype.closePopup = close;
			SweetAlert.prototype.closeModal = close;
			SweetAlert.prototype.closeToast = close;
			SweetAlert.prototype.rejectPromise = rejectPromise;
			SweetAlert.prototype.update = update;
			SweetAlert.prototype._destroy = _destroy;
			Object.assign(SweetAlert, staticMethods);
			Object.keys(instanceMethods).forEach((key) => {
				/**
				* @param {...(SweetAlertOptions | string | undefined)} args
				* @returns {SweetAlertResult | Promise<SweetAlertResult> | undefined}
				*/
				SweetAlert[key] = function(...args) {
					if (currentInstance && currentInstance[key]) return currentInstance[key](...args);
				};
			});
			SweetAlert.DismissReason = DismissReason;
			SweetAlert.version = "11.26.25";
			const Swal = SweetAlert;
			Swal.default = Swal;
			return Swal;
		}));
		if (typeof exports !== "undefined" && exports.Sweetalert2) exports.swal = exports.sweetAlert = exports.Swal = exports.SweetAlert = exports.Sweetalert2;
		"undefined" != typeof document && function(e, t) {
			var n = e.createElement("style");
			if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet) n.styleSheet.disabled || (n.styleSheet.cssText = t);
			else try {
				n.innerHTML = t;
			} catch (e) {
				n.innerText = t;
			}
		}(document, ":root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.15s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:auto}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;overflow-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;overflow-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:auto}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes swal2-hide{0%{transform:translate3d(0, 0, 0) scale(1);opacity:1}100%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}");
	}));
	//#endregion
	//#region resources/js/shared/legacy/components/config.js
	var require_config = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = class ConfigReposirtory {
			constructor(config) {
				this.__data = config || {};
			}
			/**
			* @param {String} key
			* @param {*} def
			* @returns {*}
			*/
			get(key, def) {
				return _.get(this.__data, key, def);
			}
			/**
			*
			* @param {String} key
			* @param {*} value
			* @returns {Object}
			*/
			set(key, value) {
				return _.set(this.__data, key, value);
			}
			/**
			* Проверка на существование значения
			*
			* @param {String} key
			* @returns {boolean}
			*/
			has(key) {
				return _.has(this.__data, key);
			}
			/**
			* Слияние текущего конфига с переданным
			*
			* @param {Object} config
			*/
			merge(config) {
				_.merge(this.__data, config);
			}
			/**
			* Получение списка ключей
			*
			* @returns {Array}
			*/
			keys() {
				return _.keys(this.__data);
			}
			/**
			* Получение списка всех значений
			*
			* @returns {Object}
			*/
			all() {
				return this.__data;
			}
		};
	}));
	//#endregion
	//#region resources/js/shared/legacy/components/url.js
	var require_url = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = class Url {
			/**
			* @param {String} url
			* @param {String} url_prefix
			* @param {String} url_path
			* @param {String} asset_dir
			*/
			constructor(url, url_prefix, url_path, asset_dir) {
				this._url = url;
				this._url_prefix = url_prefix;
				this._url_path = url_path;
				this._asset_dir = asset_dir;
			}
			/**
			* Получение якоря
			*
			* @returns {string}
			*/
			get hash() {
				return window.location.hash ? window.location.hash.substr(1) : "";
			}
			/**
			* @param {String} path
			*/
			set hash(path) {
				if (_.isString(path) && path.length > 0) window.history.pushState({ path: this.hash }, document.title, `#${path}`);
				else window.history.pushState({ path: this.hash }, document.title, window.location.pathname);
			}
			/**
			* Ссылка на front
			*
			* @returns {String}
			*/
			get url() {
				return this._url;
			}
			set url(value) {
				throw new Error(`The url property cannot be written.`);
			}
			/**
			* Получение значения url prefix админ панели
			*
			* @returns {String}
			*/
			get url_prefix() {
				return this._url_prefix;
			}
			set url_prefix(value) {
				throw new Error(`The url_prefix property cannot be written.`);
			}
			/**
			* Получение значения url path админ панели
			*
			* @returns {String}
			*/
			get url_path() {
				return this._url_path;
			}
			set url_path(value) {
				throw new Error(`The url_path property cannot be written.`);
			}
			/**
			* Относительный путь до хранения ассетов для текущей темы
			*
			* @returns {String}
			*/
			get asset_dir() {
				return this._asset_dir;
			}
			set asset_dir(value) {
				throw new Error(`The asset_dir property cannot be written.`);
			}
			/**
			* Генерация ссылки на asset файл для текущей темы
			*
			* @param {String} path относительный путь до файла
			* @param {Object} query (Опционально) параметры для генерации query string {foo: bar, baz: bar} = ?foo=bar&baz=bar
			* @returns {String}
			*/
			asset(path, query) {
				return this.app(this.asset_dir + "/" + _.trimStart(path, "/"), query);
			}
			/**
			* Генерация admin ссылки
			*
			* @param {String} path относительный путь
			* @param {Object} query (Опционально) параметры для генерации query string {foo: bar, baz: bar} = ?foo=bar&baz=bar
			* @returns {String}
			*/
			admin(path, query) {
				return this.app(this.url_prefix + "/" + _.trimStart(path, "/"), query);
			}
			/**
			* Генерация upload ссылки
			*
			* @param {String} path относительный путь
			* @param {Object} query (Опционально) параметры для генерации query string {foo: bar, baz: bar} = ?foo=bar&baz=bar
			* @returns {String}
			*/
			upload(path, query) {
				return this._buildUrl(this.url + "/" + _.trimStart(path, "/"), query);
			}
			/**
			* Генерация front ссылки
			*
			* @param {String} path относительный путь
			* @param {Object} query (Опционально) параметры для генерации query string {foo: bar, baz: bar} = ?foo=bar&baz=bar
			* @returns {String}
			*/
			app(path, query) {
				return this._buildUrl(this.url + "/" + _.trimStart(path, "/"), query);
			}
			/**
			*
			* @param query
			* @return {Object} query (Опционально) параметры для генерации query string {foo: bar, baz: bar} = ?foo=bar&baz=bar
			*/
			query(query) {
				window.location.href = window.location.href.split("?")[0] + "?" + this._serialize(query);
			}
			_buildUrl(url, query) {
				if (_.isObject(query)) {
					query = this._serialize(query);
					if (query.length) url += `?${query}`;
				}
				return url;
			}
			_serialize(query, prefix) {
				let str = [], p;
				for (p in query) if (query.hasOwnProperty(p)) {
					let k = prefix ? prefix + "[" + p + "]" : p, v = query[p];
					str.push(!_.isNull(v) && _.isObject(v) ? this._serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
				}
				return str.join("&");
			}
		};
	}));
	//#endregion
	//#region resources/js/shared/legacy/components/user.js
	var require_user = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = class User {
			constructor(userId) {
				this.__userId = userId;
				this.__data = {};
			}
			isAuthenticated() {
				return _.isInteger(this.id);
			}
			/**
			*
			* @returns {Integer}
			*/
			get id() {
				return this.__userId;
			}
			set id(value) {
				throw new Error(`The id property cannot be written.`);
			}
		};
	}));
	//#endregion
	//#region resources/js/shared/legacy/components/admin.js
	var import_lodash = /* @__PURE__ */ __toESM(require_lodash());
	var import_sweetalert2_all = /* @__PURE__ */ __toESM(require_sweetalert2_all());
	var import_config = /* @__PURE__ */ __toESM(require_config());
	var import_url = /* @__PURE__ */ __toESM(require_url());
	var import_user = /* @__PURE__ */ __toESM(require_user());
	var Admin$1 = class {
		constructor(token, config) {
			this.__token = token;
			this.__config = new import_config.default(config);
			this.__user = new import_user.default(this.Config.get("user_id"));
			this.__url = new import_url.default(this.Config.get("url"), this.Config.get("url_prefix", "admin"), this.Config.get("url_path", "admin"), this.Config.get("template.asset_dir"));
		}
		/**
		* @returns {User}
		*/
		get User() {
			return this.__user;
		}
		/**
		* @returns {String}
		*/
		get token() {
			return this.__token;
		}
		/**
		* @returns {String}
		*/
		get locale() {
			return this.Config.get("locale");
		}
		/**
		* @returns {boolean}
		*/
		get debug() {
			return this.Config.get("debug");
		}
		/**
		* @returns {String}
		*/
		get env() {
			return this.Config.get("env");
		}
		/**
		* @returns {ConfigReposirtory}
		*/
		get Config() {
			return this.__config;
		}
		/**
		* @returns {Url}
		*/
		get Url() {
			return this.__url;
		}
		log(error, module) {
			if (this.debug) console.log(`[${module || "SleepingOwl Framework"}]: ${error}`);
		}
		set token(value) {
			throw new Error(`The token property cannot be written.`);
		}
		set debug(value) {
			throw new Error(`The debug property cannot be written.`);
		}
		set env(value) {
			throw new Error(`The env property cannot be written.`);
		}
		set locale(value) {
			throw new Error(`The locale property cannot be written.`);
		}
		set Config(value) {
			throw new Error(`The Config property cannot be written.`);
		}
		set Url(value) {
			throw new Error(`The Url property cannot be written.`);
		}
		set User(value) {
			throw new Error(`The User property cannot be written.`);
		}
	};
	//#endregion
	//#region resources/js/shared/legacy/components/messages.js
	var require_messages = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = (function() {
			return {
				/**
				* Error message output
				*
				* @param {String} title
				* @param {String} message
				* @returns {*}
				*/
				error(title, message) {
					return this.message(title, message, "error");
				},
				/**
				* Success message output
				*
				* @param {String} title
				* @param {String} message
				* @returns {*}
				*/
				success(title, message) {
					return this.message(title, message, "success");
				},
				/**
				* Message output
				*
				* @param {String} title
				* @param {String} message
				* @param {String} icon Message icon (error, success)
				* @returns {*}
				*/
				message(title, message, icon) {
					return Swal.fire(title, message, icon || "success");
				},
				/**
				* Confirmation message
				*
				* @param {String} title
				* @param {String} message
				* @param {Object} id
				*/
				confirm(title, message, id) {
					let settings = {
						title,
						text: message || "",
						icon: "warning",
						showCancelButton: true,
						confirmButtonColor: "#3c8dbc",
						cancelButtonColor: "#d33",
						confirmButtonText: trans("lang.button.yes"),
						cancelButtonText: trans("lang.button.cancel")
					};
					Admin.Events.fire("datatables::confirm::init", settings, id);
					return Swal.fire(settings);
				},
				/**
				* Displaying a message with an input field
				*
				* @param {String} title
				* @param {String} message
				* @param {Function} callback Code executed when confirmation
				* @param {String} inputPlaceholder Placeholder
				* @param {String} inputValue Default value in input field
				* @param {String} imageUrl Show Image on this link
				*/
				prompt(title, message, inputPlaceholder, inputValue, imageUrl) {
					return Swal.fire({
						title,
						text: message || "",
						input: "text",
						showCancelButton: true,
						inputPlaceholder: inputPlaceholder || "",
						inputValue: inputValue || "",
						imageUrl: imageUrl || "",
						confirmButtonText: trans("lang.button.yes"),
						cancelButtonText: trans("lang.button.cancel")
					});
				},
				cliptobuffer(title, message, inputPlaceholder, inputValue, imageUrl) {
					return Swal.fire({
						title,
						text: message || "",
						input: "text",
						showCancelButton: true,
						inputPlaceholder: inputPlaceholder || "",
						inputValue: inputValue || "",
						imageUrl: imageUrl || "",
						confirmButtonText: trans("lang.button.yes"),
						cancelButtonText: trans("lang.button.cancel"),
						didOpen: () => {
							const field = Swal.getContainer().getElementsByClassName("swal2-input")[0];
							const image = Swal.getContainer().getElementsByClassName("swal2-image")[0];
							var blob = null;
							var link = null;
							var input = document.createElement("img");
							input.setAttribute("id", "image-paste-in-buffer");
							input.classList.add("hidden");
							document.getElementById("vueApp").appendChild(input);
							field.onpaste = function(event) {
								var items = (event.clipboardData || event.originalEvent.clipboardData).items;
								var text = (event.clipboardData || event.originalEvent.clipboardData).getData("Text");
								if (link) {
									URL.revokeObjectURL(link);
									link = null;
								}
								for (var i = 0; i < items.length; i++) if (items[i].type.indexOf("image") === 0) {
									blob = items[i].getAsFile();
									const extension = [
										{
											ext: "ico",
											mime: "image/x-icon"
										},
										{
											ext: "ico",
											mime: "image/vnd.microsoft.icon"
										},
										{
											ext: "jpg",
											mime: "image/jpeg"
										},
										{
											ext: "jpg",
											mime: "image/pjpeg"
										},
										{
											ext: "jpg",
											mime: "image/x-citrix-jpeg"
										},
										{
											ext: "jpg2",
											mime: "image/jp2"
										},
										{
											ext: "jpm",
											mime: "image/jpm"
										},
										{
											ext: "jpx",
											mime: "image/jpx"
										},
										{
											ext: "png",
											mime: "image/png"
										},
										{
											ext: "png",
											mime: "image/x-png"
										},
										{
											ext: "bmp",
											mime: "image/bmp"
										},
										{
											ext: "tif",
											mime: "image/tiff"
										},
										{
											ext: "svg",
											mime: "image/svg+xml"
										},
										{
											ext: "gif",
											mime: "image/gif"
										},
										{
											ext: "wbmp",
											mime: "image/vnd.wap.wbmp"
										},
										{
											ext: "webp",
											mime: "image/webp"
										}
									].find((el) => el.mime == items[i].type);
									if (extension) input.setAttribute("data-ext", extension.ext);
								}
								if (blob !== null) {
									var reader = new FileReader();
									reader.onload = function(event) {
										input.setAttribute("src", event.target.result);
										link = window.URL.createObjectURL(blob);
										input.setAttribute("name", link);
										image.src = link;
										field.value = link;
										image.style.display = "block";
									};
									reader.readAsDataURL(blob);
								} else if (text) {
									image.src = text;
									image.style.display = "block";
								}
							};
						}
					}).then((result) => {
						if (result.isDismissed) {
							const input = document.getElementById("image-paste-in-buffer");
							if (input) {
								if (input.name) window.URL.revokeObjectURL(input.name);
								input.remove();
							}
							return false;
						}
						return result;
					});
				}
			};
		})();
	}));
	//#endregion
	//#region resources/js/shared/legacy/components/modules.js
	var require_modules = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = (function() {
			var modules = {};
			return {
				/**
				* @deprecated
				*/
				add(module$1, callback, priority, events) {
					return this.register(module$1, callback, priority, events);
				},
				/**
				* Регистрация модуля
				* @param {String} module ключ модуля
				* @param {Function} callback тело модуля
				* @param {Integer} priority приоритет запуска
				* @param {Array} events список событий при срабатывании которых необходимо перезапустить модуль
				* @returns {exports}
				*/
				register(module$2, callback, priority, events) {
					if (!_.isFunction(callback)) {
						Admin.log(`Module ${module$2} not added. You need to specify callback`, "Modules");
						return this;
					}
					modules[module$2] = {
						name: module$2,
						callback,
						priority: priority || 0
					};
					if (_.isString(events)) Admin.Events.on(events, callback);
					else if (_.isArray(events)) _.each(events, function(event) {
						Admin.Events.on(event, callback);
					});
					return this;
				},
				/**
				* Запус зарегестрированного модуля по имени
				*
				* @param {String} name название модуля
				*/
				call(name) {
					_.each(modules, (module$3, index) => {
						if (_.isArray(name) && _.indexOf(name, index) != -1) module$3.callback();
						else if (name == index) module$3.callback();
					});
				},
				/**
				* Запуск всех модулей
				*/
				boot() {
					_.each(_.sortBy(modules, function(module$4) {
						return module$4.priority;
					}), (module$5, name) => {
						try {
							module$5.callback();
						} catch (e) {
							Admin.log(`Error with loading module ${name}:`, "Modules");
							console.log(module$5);
						}
					});
				}
			};
		})();
	}));
	//#endregion
	//#region resources/js/shared/features/forms/wysiwyg/wysiwyg-registry.js
	var import_messages = /* @__PURE__ */ __toESM(require_messages());
	var import_modules = /* @__PURE__ */ __toESM(require_modules());
	function createWysiwygRegistry(options = {}) {
		var _options$log;
		const adapters = /* @__PURE__ */ new Map();
		const records = /* @__PURE__ */ new Map();
		const events = options.events;
		const log = (_options$log = options.log) !== null && _options$log !== void 0 ? _options$log : (() => {});
		return {
			add(name, switchOn, switchOff, exec) {
				return this.register(name, switchOn, switchOff, exec);
			},
			destroyAll: () => Promise.all([...records.keys()].map((id) => switchOff(records, id, events, log))),
			editor: (id) => editorFor(records, id),
			exec: (id, command, data) => execute(records, id, command, data, events),
			get: (id) => {
				var _records$get;
				return (_records$get = records.get(id)) === null || _records$get === void 0 ? void 0 : _records$get.adapter;
			},
			register: (name, on, off, exec) => registerAdapter(adapters, name, on, off, exec, log),
			switchOff: (id) => switchOff(records, id, events, log),
			switchOn: (id, name, params) => switchOn(adapters, records, id, name, params, events, log)
		};
	}
	function registerAdapter(adapters, name, switchOn, switchOff, exec, log) {
		if (typeof switchOn !== "function" || typeof switchOff !== "function") {
			log("System try to add editor without required callbacks.", "Wysiwyg");
			return false;
		}
		adapters.set(name, Object.freeze([
			name,
			switchOn,
			switchOff,
			exec
		]));
		return true;
	}
	async function switchOn(adapters, records, id, name, params, events, log) {
		const adapter = adapters.get(name);
		if (!adapter) {
			log(`Unknown WYSIWYG editor [${name}].`, "Wysiwyg");
			return null;
		}
		const active = records.get(id);
		if ((active === null || active === void 0 ? void 0 : active.adapter) === adapter) return active.ready;
		if (active) await switchOff(records, id, events, log);
		return activate(records, id, adapter, params, events, log);
	}
	function activate(records, id, adapter, params, events, log) {
		const record = {
			adapter,
			editor: null,
			ready: null
		};
		records.set(id, record);
		record.ready = Promise.resolve().then(() => adapter[1](id, params)).then(normalizeEditor).then((editor) => editorReady(records, record, id, editor, events)).catch((error) => editorFailed(records, record, id, error, log));
		return record.ready;
	}
	function editorReady(records, record, id, editor, events) {
		var _events$fire;
		record.editor = editor;
		if (records.get(id) === record) events === null || events === void 0 || (_events$fire = events.fire) === null || _events$fire === void 0 || _events$fire.call(events, "wysiwyg:switchOn", editor);
		return editor;
	}
	function editorFailed(records, record, id, error, log) {
		if (records.get(id) === record) records.delete(id);
		log(error, "Wysiwyg");
		return null;
	}
	async function switchOff(records, id, events, log) {
		const record = records.get(id);
		if (!record) return false;
		records.delete(id);
		try {
			var _events$fire2;
			const editor = await record.ready;
			if (editor) await record.adapter[2](editor, id);
			events === null || events === void 0 || (_events$fire2 = events.fire) === null || _events$fire2 === void 0 || _events$fire2.call(events, "wysiwyg:switchOff", id);
			return true;
		} catch (error) {
			log(error, "Wysiwyg");
			return false;
		}
	}
	function execute(records, id, command, data, events) {
		var _record$adapter, _events$fire3;
		const record = records.get(id);
		if (typeof (record === null || record === void 0 || (_record$adapter = record.adapter) === null || _record$adapter === void 0 ? void 0 : _record$adapter[3]) !== "function") return void 0;
		events === null || events === void 0 || (_events$fire3 = events.fire) === null || _events$fire3 === void 0 || _events$fire3.call(events, "wysiwyg:exec", command, id, data);
		if (record.editor) return record.adapter[3](record.editor, command, id, data);
		return record.ready.then((editor) => {
			if (editor) return record.adapter[3](editor, command, id, data);
		});
	}
	function editorFor(records, id) {
		var _record$editor;
		const record = records.get(id);
		return (_record$editor = record === null || record === void 0 ? void 0 : record.editor) !== null && _record$editor !== void 0 ? _record$editor : record === null || record === void 0 ? void 0 : record.ready;
	}
	function normalizeEditor(editor) {
		var _editor$;
		return Array.isArray(editor) ? (_editor$ = editor[0]) !== null && _editor$ !== void 0 ? _editor$ : null : editor;
	}
	//#endregion
	//#region resources/js/shared/compatibility/translator.js
	function createTranslator(translations = {}) {
		return (key, parameters) => {
			const value = resolveTranslation(translations, key);
			return replaceParameters(value !== null && value !== void 0 ? value : key, parameters);
		};
	}
	function resolveTranslation(translations, key) {
		return String(key).split(".").reduce((value, segment) => readSegment(value, segment), translations);
	}
	function readSegment(value, segment) {
		if (!isRecord(value) || !Object.hasOwn(value, segment)) return void 0;
		return value[segment];
	}
	function replaceParameters(value, parameters = {}) {
		return Object.entries(parameters !== null && parameters !== void 0 ? parameters : {}).reverse().reduce((translation, [name, replacement]) => translation.replace(`:${name}`, String(replacement)), String(value));
	}
	function isRecord(value) {
		return value !== null && typeof value === "object";
	}
	//#endregion
	//#region resources/js/shared/compatibility/runtime.js
	var INSTALLATION = Symbol.for("sleepingowl.shared.compatibility");
	function installCompatibilityRuntime(target) {
		if (target[INSTALLATION]) return target.Admin;
		const core = requireCore(target.Admin);
		target._ = import_lodash.default;
		target.axios = configuredAxios();
		target.Swal = import_sweetalert2_all.default;
		target.Admin = createLegacyAdmin(target, core);
		target.trans = createTranslator({ lang: target.Admin.Config.get("lang") });
		installLegacyServices(target.Admin);
		target[INSTALLATION] = true;
		return target.Admin;
	}
	function createLegacyAdmin(target, core) {
		var _target$document, _target$GlobalConfig;
		const token = (_target$document = target.document) === null || _target$document === void 0 || (_target$document = _target$document.querySelector("meta[name=\"csrf-token\"]")) === null || _target$document === void 0 ? void 0 : _target$document.getAttribute("content");
		const admin = new Admin$1(token !== null && token !== void 0 ? token : "", (_target$GlobalConfig = target.GlobalConfig) !== null && _target$GlobalConfig !== void 0 ? _target$GlobalConfig : {});
		Object.assign(admin, core);
		return admin;
	}
	function installLegacyServices(admin) {
		admin.Messages = import_messages.default;
		admin.Modules = import_modules.default;
		admin.WYSIWYG = createWysiwygRegistry({
			events: admin.Events,
			log: (message, scope) => admin.log(message, scope)
		});
	}
	function configuredAxios() {
		axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
		return axios;
	}
	function requireCore(admin) {
		if (!(admin === null || admin === void 0 ? void 0 : admin.Components) || !(admin === null || admin === void 0 ? void 0 : admin.Events) || !(admin === null || admin === void 0 ? void 0 : admin.Http)) throw new TypeError("SleepingOwl compatibility runtime requires the headless core.");
		return admin;
	}
	//#endregion
	//#region resources/js/shared/compatibility/browser.js
	if (globalThis.document) installCompatibilityRuntime(globalThis);
	//#endregion
})();

//# sourceMappingURL=compatibility.js.map