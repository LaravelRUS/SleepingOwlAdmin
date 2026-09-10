(function() {
	//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __esmMin = (fn, res, err) => () => {
		if (err) throw err[0];
		try {
			return fn && (res = fn(fn = 0)), res;
		} catch (e) {
			throw err = [e], e;
		}
	};
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
	var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	//#endregion
	//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
	/**
	* @vue/shared v3.5.42
	* (c) 2018-present Yuxi (Evan) You and Vue contributors
	* @license MIT
	**/
	// @__NO_SIDE_EFFECTS__
	function makeMap(str) {
		const map = /* @__PURE__ */ Object.create(null);
		for (const key of str.split(",")) map[key] = 1;
		return (val) => val in map;
	}
	var EMPTY_OBJ = {};
	var EMPTY_ARR = [];
	var NOOP = () => {};
	var NO = () => false;
	var isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
	var isModelListener = (key) => key.startsWith("onUpdate:");
	var extend$2 = Object.assign;
	var remove = (arr, el) => {
		const i = arr.indexOf(el);
		if (i > -1) arr.splice(i, 1);
	};
	var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
	var hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
	var isArray = Array.isArray;
	var isMap = (val) => toTypeString(val) === "[object Map]";
	var isSet = (val) => toTypeString(val) === "[object Set]";
	var isDate = (val) => toTypeString(val) === "[object Date]";
	var isRegExp = (val) => toTypeString(val) === "[object RegExp]";
	var isFunction = (val) => typeof val === "function";
	var isString = (val) => typeof val === "string";
	var isSymbol = (val) => typeof val === "symbol";
	var isObject = (val) => val !== null && typeof val === "object";
	var isPromise = (val) => {
		return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
	};
	var objectToString = Object.prototype.toString;
	var toTypeString = (value) => objectToString.call(value);
	var toRawType = (value) => {
		return toTypeString(value).slice(8, -1);
	};
	var isPlainObject = (val) => toTypeString(val) === "[object Object]";
	var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
	var isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
	var cacheStringFunction = (fn) => {
		const cache = /* @__PURE__ */ Object.create(null);
		return ((str) => {
			return cache[str] || (cache[str] = fn(str));
		});
	};
	var camelizeRE = /-\w/g;
	var camelize$1 = cacheStringFunction((str) => {
		return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
	});
	var hyphenateRE = /\B([A-Z])/g;
	var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
	var capitalize = cacheStringFunction((str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	});
	var toHandlerKey = cacheStringFunction((str) => {
		return str ? `on${capitalize(str)}` : ``;
	});
	var hasChanged = (value, oldValue) => !Object.is(value, oldValue);
	var invokeArrayFns = (fns, ...arg) => {
		for (let i = 0; i < fns.length; i++) fns[i](...arg);
	};
	var def = (obj, key, value, writable = false) => {
		Object.defineProperty(obj, key, {
			configurable: true,
			enumerable: false,
			writable,
			value
		});
	};
	var looseToNumber = (val) => {
		const n = parseFloat(val);
		return isNaN(n) ? val : n;
	};
	var toNumber = (val) => {
		const n = isString(val) ? Number(val) : NaN;
		return isNaN(n) ? val : n;
	};
	var _globalThis;
	var getGlobalThis = () => {
		return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : {});
	};
	var isGloballyAllowed = /* @__PURE__ */ makeMap("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol");
	function normalizeStyle(value) {
		if (isArray(value)) {
			const res = {};
			for (let i = 0; i < value.length; i++) {
				const item = value[i];
				const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
				if (normalized) for (const key in normalized) res[key] = normalized[key];
			}
			return res;
		} else if (isString(value) || isObject(value)) return value;
	}
	var listDelimiterRE = /;(?![^(]*\))/g;
	var propertyDelimiterRE = /:([^]+)/;
	var styleCommentRE = /\/\*[^]*?\*\//g;
	function parseStringStyle(cssText) {
		const ret = {};
		cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
			if (item) {
				const tmp = item.split(propertyDelimiterRE);
				tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
			}
		});
		return ret;
	}
	function stringifyStyle(styles) {
		if (!styles) return "";
		if (isString(styles)) return styles;
		let ret = "";
		for (const key in styles) {
			const value = styles[key];
			if (isString(value) || typeof value === "number") {
				const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
				ret += `${normalizedKey}:${value};`;
			}
		}
		return ret;
	}
	function normalizeClass(value) {
		let res = "";
		if (isString(value)) res = value;
		else if (isArray(value)) for (let i = 0; i < value.length; i++) {
			const normalized = normalizeClass(value[i]);
			if (normalized) res += normalized + " ";
		}
		else if (isObject(value)) {
			for (const name in value) if (value[name]) res += name + " ";
		}
		return res.trim();
	}
	function normalizeProps(props) {
		if (!props) return null;
		let { class: klass, style } = props;
		if (klass && !isString(klass)) props.class = normalizeClass(klass);
		if (style) props.style = normalizeStyle(style);
		return props;
	}
	var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
	var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
	var isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
	function includeBooleanAttr(value) {
		return !!value || value === "";
	}
	var isKnownHtmlAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,inert,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
	var isKnownSvgAttr = /* @__PURE__ */ makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xmlns:xlink,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
	function isRenderableAttrValue(value) {
		if (value == null) return false;
		const type = typeof value;
		return type === "string" || type === "number" || type === "boolean";
	}
	var cssVarNameEscapeSymbolsRE = /[ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g;
	function getEscapedCssVarName(key, doubleEscape) {
		return key.replace(cssVarNameEscapeSymbolsRE, (s) => doubleEscape ? s === "\"" ? "\\\\\\\"" : `\\\\${s}` : `\\${s}`);
	}
	function looseCompareArrays(a, b) {
		if (a.length !== b.length) return false;
		let equal = true;
		for (let i = 0; equal && i < a.length; i++) equal = looseEqual(a[i], b[i]);
		return equal;
	}
	function looseCompareCollections(a, b) {
		if (a.size !== b.size) return false;
		const candidates = Array.from(b);
		const matched = new Uint8Array(candidates.length);
		for (const item of a) {
			let index = -1;
			for (let i = 0; i < candidates.length; i++) if (!matched[i] && looseEqual(item, candidates[i])) {
				index = i;
				break;
			}
			if (index < 0) return false;
			matched[index] = 1;
		}
		return true;
	}
	function looseEqual(a, b) {
		if (a === b) return true;
		let aValidType = isDate(a);
		let bValidType = isDate(b);
		if (aValidType || bValidType) return aValidType && bValidType ? a.getTime() === b.getTime() : false;
		aValidType = isSymbol(a);
		bValidType = isSymbol(b);
		if (aValidType || bValidType) return a === b;
		aValidType = isArray(a);
		bValidType = isArray(b);
		if (aValidType || bValidType) return aValidType && bValidType ? looseCompareArrays(a, b) : false;
		aValidType = isObject(a);
		bValidType = isObject(b);
		if (aValidType || bValidType) {
			if (!aValidType || !bValidType) return false;
			aValidType = isMap(a);
			bValidType = isMap(b);
			if (aValidType || bValidType) return aValidType && bValidType ? looseCompareCollections(a, b) : false;
			aValidType = isSet(a);
			bValidType = isSet(b);
			if (aValidType || bValidType) return aValidType && bValidType ? looseCompareCollections(a, b) : false;
			if (Object.keys(a).length !== Object.keys(b).length) return false;
			for (const key in a) {
				const aHasKey = a.hasOwnProperty(key);
				const bHasKey = b.hasOwnProperty(key);
				if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) return false;
			}
		}
		return String(a) === String(b);
	}
	function looseIndexOf(arr, val) {
		return arr.findIndex((item) => looseEqual(item, val));
	}
	var isRef$1 = (val) => {
		return !!(val && val["__v_isRef"] === true);
	};
	var toDisplayString = (val) => {
		return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
	};
	var replacer = (_key, val) => {
		if (isRef$1(val)) return replacer(_key, val.value);
		else if (isMap(val)) return { [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2], i) => {
			entries[stringifySymbol(key, i) + " =>"] = val2;
			return entries;
		}, {}) };
		else if (isSet(val)) return { [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v)) };
		else if (isSymbol(val)) return stringifySymbol(val);
		else if (isObject(val) && !isArray(val) && !isPlainObject(val)) return String(val);
		return val;
	};
	var stringifySymbol = (v, i = "") => {
		var _a;
		return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
	};
	function normalizeCssVarValue(value) {
		if (value == null) return "initial";
		if (typeof value === "string") return value === "" ? " " : value;
		if (typeof value !== "number" || !Number.isFinite(value)) {}
		return String(value);
	}
	//#endregion
	//#region node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
	/**
	* @vue/reactivity v3.5.42
	* (c) 2018-present Yuxi (Evan) You and Vue contributors
	* @license MIT
	**/
	var activeEffectScope;
	var EffectScope = class {
		constructor(detached = false) {
			this.detached = detached;
			/**
			* @internal
			*/
			this._active = true;
			/**
			* @internal track `on` calls, allow `on` call multiple times
			*/
			this._on = 0;
			/**
			* @internal
			*/
			this.effects = [];
			/**
			* @internal
			*/
			this.cleanups = [];
			this._isPaused = false;
			this._warnOnRun = true;
			this.__v_skip = true;
			if (!detached && activeEffectScope) {
				if (activeEffectScope.active) {
					this.parent = activeEffectScope;
					this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
				} else {
					this._active = false;
					this._warnOnRun = false;
				}
			}
		}
		get active() {
			return this._active;
		}
		pause() {
			if (this._active) {
				this._isPaused = true;
				let i, l;
				if (this.scopes) {
					const scopes = this.scopes.slice();
					for (i = 0, l = scopes.length; i < l; i++) scopes[i].pause();
				}
				for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].pause();
			}
		}
		/**
		* Resumes the effect scope, including all child scopes and effects.
		*/
		resume() {
			if (this._active) {
				if (this._isPaused) {
					this._isPaused = false;
					let i, l;
					if (this.scopes) {
						const scopes = this.scopes.slice();
						for (i = 0, l = scopes.length; i < l; i++) scopes[i].resume();
					}
					const effects = this.effects.slice();
					for (i = 0, l = effects.length; i < l; i++) effects[i].resume();
				}
			}
		}
		run(fn) {
			if (this._active) {
				const currentEffectScope = activeEffectScope;
				try {
					activeEffectScope = this;
					return fn();
				} finally {
					activeEffectScope = currentEffectScope;
				}
			}
		}
		/**
		* This should only be called on non-detached scopes
		* @internal
		*/
		on() {
			if (++this._on === 1) {
				this.prevScope = activeEffectScope;
				activeEffectScope = this;
			}
		}
		/**
		* This should only be called on non-detached scopes
		* @internal
		*/
		off() {
			if (this._on > 0 && --this._on === 0) {
				if (activeEffectScope === this) activeEffectScope = this.prevScope;
				else {
					let current = activeEffectScope;
					while (current) {
						if (current.prevScope === this) {
							current.prevScope = this.prevScope;
							break;
						}
						current = current.prevScope;
					}
				}
				this.prevScope = void 0;
			}
		}
		stop(fromParent) {
			if (this._active) {
				this._active = false;
				let i, l;
				for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].stop();
				this.effects.length = 0;
				for (i = 0, l = this.cleanups.length; i < l; i++) this.cleanups[i]();
				this.cleanups.length = 0;
				if (this.scopes) {
					const scopes = this.scopes.slice();
					for (i = 0, l = scopes.length; i < l; i++) scopes[i].stop(true);
					this.scopes.length = 0;
				}
				if (!this.detached && this.parent && !fromParent) {
					const last = this.parent.scopes.pop();
					if (last && last !== this) {
						this.parent.scopes[this.index] = last;
						last.index = this.index;
					}
				}
				this.parent = void 0;
			}
		}
	};
	function effectScope(detached) {
		return new EffectScope(detached);
	}
	function getCurrentScope() {
		return activeEffectScope;
	}
	function onScopeDispose(fn, failSilently = false) {
		if (activeEffectScope) activeEffectScope.cleanups.push(fn);
	}
	var activeSub;
	var pausedQueueEffects = /* @__PURE__ */ new WeakSet();
	var ReactiveEffect = class {
		constructor(fn) {
			this.fn = fn;
			/**
			* @internal
			*/
			this.deps = void 0;
			/**
			* @internal
			*/
			this.depsTail = void 0;
			/**
			* @internal
			*/
			this.flags = 5;
			/**
			* @internal
			*/
			this.next = void 0;
			/**
			* @internal
			*/
			this.cleanup = void 0;
			this.scheduler = void 0;
			if (activeEffectScope) {
				if (activeEffectScope.active) activeEffectScope.effects.push(this);
				else this.flags &= -2;
			}
		}
		pause() {
			this.flags |= 64;
		}
		resume() {
			if (this.flags & 64) {
				this.flags &= -65;
				if (pausedQueueEffects.has(this)) {
					pausedQueueEffects.delete(this);
					this.trigger();
				}
			}
		}
		/**
		* @internal
		*/
		notify() {
			if (this.flags & 2 && !(this.flags & 32)) return;
			if (!(this.flags & 8)) batch(this);
		}
		run() {
			if (!(this.flags & 1)) return this.fn();
			this.flags |= 2;
			cleanupEffect(this);
			prepareDeps(this);
			const prevEffect = activeSub;
			const prevShouldTrack = shouldTrack;
			activeSub = this;
			shouldTrack = true;
			try {
				return this.fn();
			} finally {
				cleanupDeps(this);
				activeSub = prevEffect;
				shouldTrack = prevShouldTrack;
				this.flags &= -3;
			}
		}
		stop() {
			if (this.flags & 1) {
				for (let link = this.deps; link; link = link.nextDep) removeSub(link);
				this.deps = this.depsTail = void 0;
				cleanupEffect(this);
				this.onStop && this.onStop();
				this.flags &= -2;
			}
		}
		trigger() {
			if (this.flags & 64) pausedQueueEffects.add(this);
			else if (this.scheduler) this.scheduler();
			else this.runIfDirty();
		}
		/**
		* @internal
		*/
		runIfDirty() {
			if (isDirty(this)) this.run();
		}
		get dirty() {
			return isDirty(this);
		}
	};
	var batchDepth = 0;
	var batchedSub;
	var batchedComputed;
	function batch(sub, isComputed = false) {
		sub.flags |= 8;
		if (isComputed) {
			sub.next = batchedComputed;
			batchedComputed = sub;
			return;
		}
		sub.next = batchedSub;
		batchedSub = sub;
	}
	function startBatch() {
		batchDepth++;
	}
	function endBatch() {
		if (--batchDepth > 0) return;
		if (batchedComputed) {
			let e = batchedComputed;
			batchedComputed = void 0;
			while (e) {
				const next = e.next;
				e.next = void 0;
				e.flags &= -9;
				e = next;
			}
		}
		let error;
		while (batchedSub) {
			let e = batchedSub;
			batchedSub = void 0;
			while (e) {
				const next = e.next;
				e.next = void 0;
				e.flags &= -9;
				if (e.flags & 1) try {
					e.trigger();
				} catch (err) {
					if (!error) error = err;
				}
				e = next;
			}
		}
		if (error) throw error;
	}
	function prepareDeps(sub) {
		for (let link = sub.deps; link; link = link.nextDep) {
			link.version = -1;
			link.prevActiveLink = link.dep.activeLink;
			link.dep.activeLink = link;
		}
	}
	function cleanupDeps(sub) {
		let head;
		let tail = sub.depsTail;
		let link = tail;
		while (link) {
			const prev = link.prevDep;
			if (link.version === -1) {
				if (link === tail) tail = prev;
				removeSub(link);
				removeDep(link);
			} else head = link;
			link.dep.activeLink = link.prevActiveLink;
			link.prevActiveLink = void 0;
			link = prev;
		}
		sub.deps = head;
		sub.depsTail = tail;
	}
	function isDirty(sub) {
		for (let link = sub.deps; link; link = link.nextDep) if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) return true;
		if (sub._dirty) return true;
		return false;
	}
	function refreshComputed(computed) {
		if (computed.flags & 4 && !(computed.flags & 16)) return;
		computed.flags &= -17;
		if (computed.globalVersion === globalVersion) return;
		computed.globalVersion = globalVersion;
		if (!computed.isSSR && computed.flags & 128 && (!computed.deps && !computed._dirty || !isDirty(computed))) return;
		computed.flags |= 2;
		const dep = computed.dep;
		const prevSub = activeSub;
		const prevShouldTrack = shouldTrack;
		activeSub = computed;
		shouldTrack = true;
		try {
			prepareDeps(computed);
			const value = computed.fn(computed._value);
			if (dep.version === 0 || hasChanged(value, computed._value)) {
				computed.flags |= 128;
				computed._value = value;
				dep.version++;
			}
		} catch (err) {
			dep.version++;
			throw err;
		} finally {
			activeSub = prevSub;
			shouldTrack = prevShouldTrack;
			cleanupDeps(computed);
			computed.flags &= -3;
		}
	}
	function removeSub(link, soft = false) {
		const { dep, prevSub, nextSub } = link;
		if (prevSub) {
			prevSub.nextSub = nextSub;
			link.prevSub = void 0;
		}
		if (nextSub) {
			nextSub.prevSub = prevSub;
			link.nextSub = void 0;
		}
		if (dep.subs === link) {
			dep.subs = prevSub;
			if (!prevSub && dep.computed) {
				dep.computed.flags &= -5;
				for (let l = dep.computed.deps; l; l = l.nextDep) removeSub(l, true);
			}
		}
		if (!soft && !--dep.sc && dep.map) dep.map.delete(dep.key);
	}
	function removeDep(link) {
		const { prevDep, nextDep } = link;
		if (prevDep) {
			prevDep.nextDep = nextDep;
			link.prevDep = void 0;
		}
		if (nextDep) {
			nextDep.prevDep = prevDep;
			link.nextDep = void 0;
		}
	}
	function effect(fn, options) {
		if (fn.effect instanceof ReactiveEffect) fn = fn.effect.fn;
		const e = new ReactiveEffect(fn);
		if (options) extend$2(e, options);
		try {
			e.run();
		} catch (err) {
			e.stop();
			throw err;
		}
		const runner = e.run.bind(e);
		runner.effect = e;
		return runner;
	}
	function stop(runner) {
		runner.effect.stop();
	}
	var shouldTrack = true;
	var trackStack = [];
	function pauseTracking() {
		trackStack.push(shouldTrack);
		shouldTrack = false;
	}
	function resetTracking() {
		const last = trackStack.pop();
		shouldTrack = last === void 0 ? true : last;
	}
	function cleanupEffect(e) {
		const { cleanup } = e;
		e.cleanup = void 0;
		if (cleanup) {
			const prevSub = activeSub;
			activeSub = void 0;
			try {
				cleanup();
			} finally {
				activeSub = prevSub;
			}
		}
	}
	var globalVersion = 0;
	var Link = class {
		constructor(sub, dep) {
			this.sub = sub;
			this.dep = dep;
			this.version = dep.version;
			this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
		}
	};
	var Dep = class {
		constructor(computed) {
			this.computed = computed;
			this.version = 0;
			/**
			* Link between this dep and the current active effect
			*/
			this.activeLink = void 0;
			/**
			* Doubly linked list representing the subscribing effects (tail)
			*/
			this.subs = void 0;
			/**
			* For object property deps cleanup
			*/
			this.map = void 0;
			this.key = void 0;
			/**
			* Subscriber counter
			*/
			this.sc = 0;
			/**
			* @internal
			*/
			this.__v_skip = true;
		}
		track(debugInfo) {
			if (!activeSub || !shouldTrack || activeSub === this.computed) return;
			let link = this.activeLink;
			if (link === void 0 || link.sub !== activeSub) {
				link = this.activeLink = new Link(activeSub, this);
				if (!activeSub.deps) activeSub.deps = activeSub.depsTail = link;
				else {
					link.prevDep = activeSub.depsTail;
					activeSub.depsTail.nextDep = link;
					activeSub.depsTail = link;
				}
				addSub(link);
			} else if (link.version === -1) {
				link.version = this.version;
				if (link.nextDep) {
					const next = link.nextDep;
					next.prevDep = link.prevDep;
					if (link.prevDep) link.prevDep.nextDep = next;
					link.prevDep = activeSub.depsTail;
					link.nextDep = void 0;
					activeSub.depsTail.nextDep = link;
					activeSub.depsTail = link;
					if (activeSub.deps === link) activeSub.deps = next;
				}
			}
			return link;
		}
		trigger(debugInfo) {
			this.version++;
			globalVersion++;
			this.notify(debugInfo);
		}
		notify(debugInfo) {
			startBatch();
			try {
				for (let link = this.subs; link; link = link.prevSub) if (link.sub.notify()) link.sub.dep.notify();
			} finally {
				endBatch();
			}
		}
	};
	function addSub(link) {
		link.dep.sc++;
		if (link.sub.flags & 4) {
			const computed = link.dep.computed;
			if (computed && !link.dep.subs) {
				computed.flags |= 20;
				for (let l = computed.deps; l; l = l.nextDep) addSub(l);
			}
			const currentTail = link.dep.subs;
			if (currentTail !== link) {
				link.prevSub = currentTail;
				if (currentTail) currentTail.nextSub = link;
			}
			link.dep.subs = link;
		}
	}
	var targetMap = /* @__PURE__ */ new WeakMap();
	var ITERATE_KEY = /* @__PURE__ */ Symbol("");
	var MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
	var ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
	function track(target, type, key) {
		if (shouldTrack && activeSub) {
			let depsMap = targetMap.get(target);
			if (!depsMap) targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
			let dep = depsMap.get(key);
			if (!dep) {
				depsMap.set(key, dep = new Dep());
				dep.map = depsMap;
				dep.key = key;
			}
			dep.track();
		}
	}
	function trigger(target, type, key, newValue, oldValue, oldTarget) {
		const depsMap = targetMap.get(target);
		if (!depsMap) {
			globalVersion++;
			return;
		}
		const run = (dep) => {
			if (dep) dep.trigger();
		};
		startBatch();
		if (type === "clear") depsMap.forEach(run);
		else {
			const targetIsArray = isArray(target);
			const isArrayIndex = targetIsArray && isIntegerKey(key);
			if (targetIsArray && key === "length") {
				const newLength = Number(newValue);
				depsMap.forEach((dep, key2) => {
					if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) run(dep);
				});
			} else {
				if (key !== void 0 || depsMap.has(void 0)) run(depsMap.get(key));
				if (isArrayIndex) run(depsMap.get(ARRAY_ITERATE_KEY));
				switch (type) {
					case "add":
						if (!targetIsArray) {
							run(depsMap.get(ITERATE_KEY));
							if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
						} else if (isArrayIndex) run(depsMap.get("length"));
						break;
					case "delete":
						if (!targetIsArray) {
							run(depsMap.get(ITERATE_KEY));
							if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
						}
						break;
					case "set": if (isMap(target)) run(depsMap.get(ITERATE_KEY));
				}
			}
		}
		endBatch();
	}
	function getDepFromReactive(object, key) {
		const depMap = targetMap.get(object);
		return depMap && depMap.get(key);
	}
	function reactiveReadArray(array) {
		const raw = /* @__PURE__ */ toRaw(array);
		if (raw === array) return raw;
		track(raw, "iterate", ARRAY_ITERATE_KEY);
		return /* @__PURE__ */ isShallow(array) ? raw : raw.map(toReactive);
	}
	function shallowReadArray(arr) {
		track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
		return arr;
	}
	function toWrapped(target, item) {
		if (/* @__PURE__ */ isReadonly(target)) return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
		return toReactive(item);
	}
	var arrayInstrumentations = {
		__proto__: null,
		[Symbol.iterator]() {
			return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
		},
		concat(...args) {
			return reactiveReadArray(this).concat(...args.map((x) => isArray(x) ? reactiveReadArray(x) : x));
		},
		entries() {
			return iterator(this, "entries", (value) => {
				value[1] = toWrapped(this, value[1]);
				return value;
			});
		},
		every(fn, thisArg) {
			return apply(this, "every", fn, thisArg, void 0, arguments);
		},
		filter(fn, thisArg) {
			return apply(this, "filter", fn, thisArg, (v) => v.map((item) => toWrapped(this, item)), arguments);
		},
		find(fn, thisArg) {
			return apply(this, "find", fn, thisArg, (item) => toWrapped(this, item), arguments);
		},
		findIndex(fn, thisArg) {
			return apply(this, "findIndex", fn, thisArg, void 0, arguments);
		},
		findLast(fn, thisArg) {
			return apply(this, "findLast", fn, thisArg, (item) => toWrapped(this, item), arguments);
		},
		findLastIndex(fn, thisArg) {
			return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
		},
		forEach(fn, thisArg) {
			return apply(this, "forEach", fn, thisArg, void 0, arguments);
		},
		includes(...args) {
			return searchProxy(this, "includes", args);
		},
		indexOf(...args) {
			return searchProxy(this, "indexOf", args);
		},
		join(separator) {
			return reactiveReadArray(this).join(separator);
		},
		lastIndexOf(...args) {
			return searchProxy(this, "lastIndexOf", args);
		},
		map(fn, thisArg) {
			return apply(this, "map", fn, thisArg, void 0, arguments);
		},
		pop() {
			return noTracking(this, "pop");
		},
		push(...args) {
			return noTracking(this, "push", args);
		},
		reduce(fn, ...args) {
			return reduce(this, "reduce", fn, args);
		},
		reduceRight(fn, ...args) {
			return reduce(this, "reduceRight", fn, args);
		},
		shift() {
			return noTracking(this, "shift");
		},
		some(fn, thisArg) {
			return apply(this, "some", fn, thisArg, void 0, arguments);
		},
		splice(...args) {
			return noTracking(this, "splice", args);
		},
		toReversed() {
			return reactiveReadArray(this).toReversed();
		},
		toSorted(comparer) {
			return reactiveReadArray(this).toSorted(comparer);
		},
		toSpliced(...args) {
			return reactiveReadArray(this).toSpliced(...args);
		},
		unshift(...args) {
			return noTracking(this, "unshift", args);
		},
		values() {
			return iterator(this, "values", (item) => toWrapped(this, item));
		}
	};
	function iterator(self, method, wrapValue) {
		const arr = shallowReadArray(self);
		const iter = arr[method]();
		if (arr !== self && !/* @__PURE__ */ isShallow(self)) {
			iter._next = iter.next;
			iter.next = () => {
				const result = iter._next();
				if (!result.done) result.value = wrapValue(result.value);
				return result;
			};
		}
		return iter;
	}
	var arrayProto = Array.prototype;
	function apply(self, method, fn, thisArg, wrappedRetFn, args) {
		const arr = shallowReadArray(self);
		const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
		const methodFn = arr[method];
		if (methodFn !== arrayProto[method]) {
			const result2 = methodFn.apply(self, args);
			return needsWrap ? toReactive(result2) : result2;
		}
		let wrappedFn = fn;
		if (arr !== self) {
			if (needsWrap) wrappedFn = function(item, index) {
				return fn.call(this, toWrapped(self, item), index, self);
			};
			else if (fn.length > 2) wrappedFn = function(item, index) {
				return fn.call(this, item, index, self);
			};
		}
		const result = methodFn.call(arr, wrappedFn, thisArg);
		return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
	}
	function reduce(self, method, fn, args) {
		const arr = shallowReadArray(self);
		const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
		let wrappedFn = fn;
		let wrapInitialAccumulator = false;
		if (arr !== self) {
			if (needsWrap) {
				wrapInitialAccumulator = args.length === 0;
				wrappedFn = function(acc, item, index) {
					if (wrapInitialAccumulator) {
						wrapInitialAccumulator = false;
						acc = toWrapped(self, acc);
					}
					return fn.call(this, acc, toWrapped(self, item), index, self);
				};
			} else if (fn.length > 3) wrappedFn = function(acc, item, index) {
				return fn.call(this, acc, item, index, self);
			};
		}
		const result = arr[method](wrappedFn, ...args);
		return wrapInitialAccumulator ? toWrapped(self, result) : result;
	}
	function searchProxy(self, method, args) {
		const arr = /* @__PURE__ */ toRaw(self);
		track(arr, "iterate", ARRAY_ITERATE_KEY);
		const res = arr[method](...args);
		if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
			args[0] = /* @__PURE__ */ toRaw(args[0]);
			return arr[method](...args);
		}
		return res;
	}
	function noTracking(self, method, args = []) {
		pauseTracking();
		startBatch();
		const res = (/* @__PURE__ */ toRaw(self))[method].apply(self, args);
		endBatch();
		resetTracking();
		return res;
	}
	var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
	var builtInSymbols = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
	function hasOwnProperty(key) {
		if (!isSymbol(key)) key = String(key);
		const obj = /* @__PURE__ */ toRaw(this);
		track(obj, "has", key);
		return obj.hasOwnProperty(key);
	}
	var BaseReactiveHandler = class {
		constructor(_isReadonly = false, _isShallow = false) {
			this._isReadonly = _isReadonly;
			this._isShallow = _isShallow;
		}
		get(target, key, receiver) {
			if (key === "__v_skip") return target["__v_skip"];
			const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
			if (key === "__v_isReactive") return !isReadonly2;
			else if (key === "__v_isReadonly") return isReadonly2;
			else if (key === "__v_isShallow") return isShallow2;
			else if (key === "__v_raw") {
				if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) return target;
				return;
			}
			const targetIsArray = isArray(target);
			if (!isReadonly2) {
				let fn;
				if (targetIsArray && (fn = arrayInstrumentations[key])) return fn;
				if (key === "hasOwnProperty") return hasOwnProperty;
			}
			const res = Reflect.get(target, key, /* @__PURE__ */ isRef(target) ? target : receiver);
			if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) return res;
			if (!isReadonly2) track(target, "get", key);
			if (isShallow2) return res;
			if (/* @__PURE__ */ isRef(res)) {
				const value = targetIsArray && isIntegerKey(key) ? res : res.value;
				return isReadonly2 && isObject(value) ? /* @__PURE__ */ readonly(value) : value;
			}
			if (isObject(res)) return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
			return res;
		}
	};
	var MutableReactiveHandler = class extends BaseReactiveHandler {
		constructor(isShallow2 = false) {
			super(false, isShallow2);
		}
		set(target, key, value, receiver) {
			let oldValue = target[key];
			const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
			if (!this._isShallow) {
				const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
				if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
					oldValue = /* @__PURE__ */ toRaw(oldValue);
					value = /* @__PURE__ */ toRaw(value);
				}
				if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
					if (isOldValueReadonly) return true;
					else {
						oldValue.value = value;
						return true;
					}
				}
			}
			const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
			const result = Reflect.set(target, key, value, /* @__PURE__ */ isRef(target) ? target : receiver);
			if (target === /* @__PURE__ */ toRaw(receiver) && result) {
				if (!hadKey) trigger(target, "add", key, value);
				else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
			}
			return result;
		}
		deleteProperty(target, key) {
			const hadKey = hasOwn(target, key);
			const oldValue = target[key];
			const result = Reflect.deleteProperty(target, key);
			if (result && hadKey) trigger(target, "delete", key, void 0, oldValue);
			return result;
		}
		has(target, key) {
			const result = Reflect.has(target, key);
			if (!isSymbol(key) || !builtInSymbols.has(key)) track(target, "has", key);
			return result;
		}
		ownKeys(target) {
			track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
			return Reflect.ownKeys(target);
		}
	};
	var ReadonlyReactiveHandler = class extends BaseReactiveHandler {
		constructor(isShallow2 = false) {
			super(true, isShallow2);
		}
		set(target, key) {
			return true;
		}
		deleteProperty(target, key) {
			return true;
		}
	};
	var mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
	var readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
	var shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
	var shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
	var toShallow = (value) => value;
	var getProto = (v) => Reflect.getPrototypeOf(v);
	function createIterableMethod(method, isReadonly2, isShallow2) {
		return function(...args) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const targetIsMap = isMap(rawTarget);
			const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
			const isKeyOnly = method === "keys" && targetIsMap;
			const innerIterator = target[method](...args);
			const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
			!isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
			return extend$2(Object.create(innerIterator), { next() {
				const { value, done } = innerIterator.next();
				return done ? {
					value,
					done
				} : {
					value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
					done
				};
			} });
		};
	}
	function createReadonlyMethod(type) {
		return function(...args) {
			return type === "delete" ? false : type === "clear" ? void 0 : this;
		};
	}
	function createInstrumentations(readonly, shallow) {
		const instrumentations = {
			get(key) {
				const target = this["__v_raw"];
				const rawTarget = /* @__PURE__ */ toRaw(target);
				const rawKey = /* @__PURE__ */ toRaw(key);
				if (!readonly) {
					if (hasChanged(key, rawKey)) track(rawTarget, "get", key);
					track(rawTarget, "get", rawKey);
				}
				const { has } = getProto(rawTarget);
				const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
				if (has.call(rawTarget, key)) return wrap(target.get(key));
				else if (has.call(rawTarget, rawKey)) return wrap(target.get(rawKey));
				else if (target !== rawTarget) target.get(key);
			},
			get size() {
				const target = this["__v_raw"];
				!readonly && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
				return target.size;
			},
			has(key) {
				const target = this["__v_raw"];
				const rawTarget = /* @__PURE__ */ toRaw(target);
				const rawKey = /* @__PURE__ */ toRaw(key);
				if (!readonly) {
					if (hasChanged(key, rawKey)) track(rawTarget, "has", key);
					track(rawTarget, "has", rawKey);
				}
				return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
			},
			forEach(callback, thisArg) {
				const observed = this;
				const target = observed["__v_raw"];
				const rawTarget = /* @__PURE__ */ toRaw(target);
				const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
				!readonly && track(rawTarget, "iterate", ITERATE_KEY);
				return target.forEach((value, key) => {
					return callback.call(thisArg, wrap(value), wrap(key), observed);
				});
			}
		};
		extend$2(instrumentations, readonly ? {
			add: createReadonlyMethod("add"),
			set: createReadonlyMethod("set"),
			delete: createReadonlyMethod("delete"),
			clear: createReadonlyMethod("clear")
		} : {
			add(value) {
				const target = /* @__PURE__ */ toRaw(this);
				const proto = getProto(target);
				const rawValue = /* @__PURE__ */ toRaw(value);
				const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
				if (!(proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue))) {
					target.add(valueToAdd);
					trigger(target, "add", valueToAdd, valueToAdd);
				}
				return this;
			},
			set(key, value) {
				if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) value = /* @__PURE__ */ toRaw(value);
				const target = /* @__PURE__ */ toRaw(this);
				const { has, get } = getProto(target);
				let hadKey = has.call(target, key);
				if (!hadKey) {
					key = /* @__PURE__ */ toRaw(key);
					hadKey = has.call(target, key);
				}
				const oldValue = get.call(target, key);
				target.set(key, value);
				if (!hadKey) trigger(target, "add", key, value);
				else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
				return this;
			},
			delete(key) {
				const target = /* @__PURE__ */ toRaw(this);
				const { has, get } = getProto(target);
				let hadKey = has.call(target, key);
				if (!hadKey) {
					key = /* @__PURE__ */ toRaw(key);
					hadKey = has.call(target, key);
				}
				const oldValue = get ? get.call(target, key) : void 0;
				const result = target.delete(key);
				if (hadKey) trigger(target, "delete", key, void 0, oldValue);
				return result;
			},
			clear() {
				const target = /* @__PURE__ */ toRaw(this);
				const hadItems = target.size !== 0;
				const oldTarget = void 0;
				const result = target.clear();
				if (hadItems) trigger(target, "clear", void 0, void 0, oldTarget);
				return result;
			}
		});
		[
			"keys",
			"values",
			"entries",
			Symbol.iterator
		].forEach((method) => {
			instrumentations[method] = createIterableMethod(method, readonly, shallow);
		});
		return instrumentations;
	}
	function createInstrumentationGetter(isReadonly2, shallow) {
		const instrumentations = createInstrumentations(isReadonly2, shallow);
		return (target, key, receiver) => {
			if (key === "__v_isReactive") return !isReadonly2;
			else if (key === "__v_isReadonly") return isReadonly2;
			else if (key === "__v_raw") return target;
			return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
		};
	}
	var mutableCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, false) };
	var shallowCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, true) };
	var readonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, false) };
	var shallowReadonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, true) };
	var reactiveMap = /* @__PURE__ */ new WeakMap();
	var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
	var readonlyMap = /* @__PURE__ */ new WeakMap();
	var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
	function targetTypeMap(rawType) {
		switch (rawType) {
			case "Object":
			case "Array": return 1;
			case "Map":
			case "Set":
			case "WeakMap":
			case "WeakSet": return 2;
			default: return 0;
		}
	}
	// @__NO_SIDE_EFFECTS__
	function reactive(target) {
		if (/* @__PURE__ */ isReadonly(target)) return target;
		return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
	}
	// @__NO_SIDE_EFFECTS__
	function shallowReactive(target) {
		return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
	}
	// @__NO_SIDE_EFFECTS__
	function readonly(target) {
		return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
	}
	// @__NO_SIDE_EFFECTS__
	function shallowReadonly(target) {
		return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
	}
	function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
		if (!isObject(target)) return target;
		if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) return target;
		if (target["__v_skip"] || !Object.isExtensible(target)) return target;
		const existingProxy = proxyMap.get(target);
		if (existingProxy) return existingProxy;
		const targetType = targetTypeMap(toRawType(target));
		if (targetType === 0) return target;
		const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
		proxyMap.set(target, proxy);
		return proxy;
	}
	// @__NO_SIDE_EFFECTS__
	function isReactive(value) {
		if (/* @__PURE__ */ isReadonly(value)) return /* @__PURE__ */ isReactive(value["__v_raw"]);
		return !!(value && value["__v_isReactive"]);
	}
	// @__NO_SIDE_EFFECTS__
	function isReadonly(value) {
		return !!(value && value["__v_isReadonly"]);
	}
	// @__NO_SIDE_EFFECTS__
	function isShallow(value) {
		return !!(value && value["__v_isShallow"]);
	}
	// @__NO_SIDE_EFFECTS__
	function isProxy(value) {
		return value ? !!value["__v_raw"] : false;
	}
	// @__NO_SIDE_EFFECTS__
	function toRaw(observed) {
		const raw = observed && observed["__v_raw"];
		return raw ? /* @__PURE__ */ toRaw(raw) : observed;
	}
	function markRaw(value) {
		if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) def(value, "__v_skip", true);
		return value;
	}
	var toReactive = (value) => isObject(value) ? /* @__PURE__ */ reactive(value) : value;
	var toReadonly = (value) => isObject(value) ? /* @__PURE__ */ readonly(value) : value;
	// @__NO_SIDE_EFFECTS__
	function isRef(r) {
		return r ? r["__v_isRef"] === true : false;
	}
	// @__NO_SIDE_EFFECTS__
	function ref(value) {
		return createRef(value, false);
	}
	// @__NO_SIDE_EFFECTS__
	function shallowRef(value) {
		return createRef(value, true);
	}
	function createRef(rawValue, shallow) {
		if (/* @__PURE__ */ isRef(rawValue)) return rawValue;
		return new RefImpl(rawValue, shallow);
	}
	var RefImpl = class {
		constructor(value, isShallow2) {
			this.dep = new Dep();
			this["__v_isRef"] = true;
			this["__v_isShallow"] = false;
			this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
			this._value = isShallow2 ? value : toReactive(value);
			this["__v_isShallow"] = isShallow2;
		}
		get value() {
			this.dep.track();
			return this._value;
		}
		set value(newValue) {
			const oldValue = this._rawValue;
			const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
			newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
			if (hasChanged(newValue, oldValue)) {
				this._rawValue = newValue;
				this._value = useDirectValue ? newValue : toReactive(newValue);
				this.dep.trigger();
			}
		}
	};
	function triggerRef(ref2) {
		if (ref2.dep) ref2.dep.trigger();
	}
	function unref(ref2) {
		return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
	}
	function toValue(source) {
		return isFunction(source) ? source() : unref(source);
	}
	var shallowUnwrapHandlers = {
		get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
		set: (target, key, value, receiver) => {
			const oldValue = target[key];
			if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
				oldValue.value = value;
				return true;
			} else return Reflect.set(target, key, value, receiver);
		}
	};
	function proxyRefs(objectWithRefs) {
		return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
	}
	var CustomRefImpl = class {
		constructor(factory) {
			this["__v_isRef"] = true;
			this._value = void 0;
			const dep = this.dep = new Dep();
			const { get, set } = factory(dep.track.bind(dep), dep.trigger.bind(dep));
			this._get = get;
			this._set = set;
		}
		get value() {
			return this._value = this._get();
		}
		set value(newVal) {
			this._set(newVal);
		}
	};
	function customRef(factory) {
		return new CustomRefImpl(factory);
	}
	// @__NO_SIDE_EFFECTS__
	function toRefs(object) {
		const ret = isArray(object) ? new Array(object.length) : {};
		for (const key in object) ret[key] = propertyToRef(object, key);
		return ret;
	}
	var ObjectRefImpl = class {
		constructor(_object, key, _defaultValue) {
			this._object = _object;
			this._defaultValue = _defaultValue;
			this["__v_isRef"] = true;
			this._value = void 0;
			this._key = isSymbol(key) ? key : String(key);
			this._raw = /* @__PURE__ */ toRaw(_object);
			let shallow = true;
			let obj = _object;
			if (!isArray(_object) || isSymbol(this._key) || !isIntegerKey(this._key)) do
				shallow = !/* @__PURE__ */ isProxy(obj) || /* @__PURE__ */ isShallow(obj);
			while (shallow && (obj = obj["__v_raw"]));
			this._shallow = shallow;
		}
		get value() {
			let val = this._object[this._key];
			if (this._shallow) val = unref(val);
			return this._value = val === void 0 ? this._defaultValue : val;
		}
		set value(newVal) {
			if (this._shallow && /* @__PURE__ */ isRef(this._raw[this._key])) {
				const nestedRef = this._object[this._key];
				if (/* @__PURE__ */ isRef(nestedRef)) {
					nestedRef.value = newVal;
					return;
				}
			}
			this._object[this._key] = newVal;
		}
		get dep() {
			return getDepFromReactive(this._raw, this._key);
		}
	};
	var GetterRefImpl = class {
		constructor(_getter) {
			this._getter = _getter;
			this["__v_isRef"] = true;
			this["__v_isReadonly"] = true;
			this._value = void 0;
		}
		get value() {
			return this._value = this._getter();
		}
	};
	// @__NO_SIDE_EFFECTS__
	function toRef(source, key, defaultValue) {
		if (/* @__PURE__ */ isRef(source)) return source;
		else if (isFunction(source)) return new GetterRefImpl(source);
		else if (isObject(source) && arguments.length > 1) return propertyToRef(source, key, defaultValue);
		else return /* @__PURE__ */ ref(source);
	}
	function propertyToRef(source, key, defaultValue) {
		return new ObjectRefImpl(source, key, defaultValue);
	}
	var ComputedRefImpl = class {
		constructor(fn, setter, isSSR) {
			this.fn = fn;
			this.setter = setter;
			/**
			* @internal
			*/
			this._value = void 0;
			/**
			* @internal
			*/
			this.dep = new Dep(this);
			/**
			* @internal
			*/
			this.__v_isRef = true;
			/**
			* @internal
			*/
			this.deps = void 0;
			/**
			* @internal
			*/
			this.depsTail = void 0;
			/**
			* @internal
			*/
			this.flags = 16;
			/**
			* @internal
			*/
			this.globalVersion = globalVersion - 1;
			/**
			* @internal
			*/
			this.next = void 0;
			this.effect = this;
			this["__v_isReadonly"] = !setter;
			this.isSSR = isSSR;
		}
		/**
		* @internal
		*/
		notify() {
			this.flags |= 16;
			if (!(this.flags & 8) && activeSub !== this) {
				batch(this, true);
				return true;
			}
		}
		get value() {
			const link = this.dep.track();
			refreshComputed(this);
			if (link) link.version = this.dep.version;
			return this._value;
		}
		set value(newValue) {
			if (this.setter) this.setter(newValue);
		}
	};
	// @__NO_SIDE_EFFECTS__
	function computed$1(getterOrOptions, debugOptions, isSSR = false) {
		let getter;
		let setter;
		if (isFunction(getterOrOptions)) getter = getterOrOptions;
		else {
			getter = getterOrOptions.get;
			setter = getterOrOptions.set;
		}
		return new ComputedRefImpl(getter, setter, isSSR);
	}
	var TrackOpTypes = {
		"GET": "get",
		"HAS": "has",
		"ITERATE": "iterate"
	};
	var TriggerOpTypes = {
		"SET": "set",
		"ADD": "add",
		"DELETE": "delete",
		"CLEAR": "clear"
	};
	var INITIAL_WATCHER_VALUE = {};
	var cleanupMap = /* @__PURE__ */ new WeakMap();
	var activeWatcher = void 0;
	function getCurrentWatcher() {
		return activeWatcher;
	}
	function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
		if (owner) {
			let cleanups = cleanupMap.get(owner);
			if (!cleanups) cleanupMap.set(owner, cleanups = []);
			cleanups.push(cleanupFn);
		}
	}
	function watch$1(source, cb, options = EMPTY_OBJ) {
		const { immediate, deep, once, scheduler, augmentJob, call } = options;
		const reactiveGetter = (source2) => {
			if (deep) return source2;
			if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0) return traverse(source2, 1);
			return traverse(source2);
		};
		let effect;
		let getter;
		let cleanup;
		let boundCleanup;
		let forceTrigger = false;
		let isMultiSource = false;
		if (/* @__PURE__ */ isRef(source)) {
			getter = () => source.value;
			forceTrigger = /* @__PURE__ */ isShallow(source);
		} else if (/* @__PURE__ */ isReactive(source)) {
			getter = () => reactiveGetter(source);
			forceTrigger = true;
		} else if (isArray(source)) {
			isMultiSource = true;
			forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
			getter = () => source.map((s) => {
				if (/* @__PURE__ */ isRef(s)) return s.value;
				else if (/* @__PURE__ */ isReactive(s)) return reactiveGetter(s);
				else if (isFunction(s)) return call ? call(s, 2) : s();
			});
		} else if (isFunction(source)) {
			if (cb) getter = call ? () => call(source, 2) : source;
			else getter = () => {
				if (cleanup) {
					pauseTracking();
					try {
						cleanup();
					} finally {
						resetTracking();
					}
				}
				const currentEffect = activeWatcher;
				activeWatcher = effect;
				try {
					return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
				} finally {
					activeWatcher = currentEffect;
				}
			};
		} else getter = NOOP;
		if (cb && deep) {
			const baseGetter = getter;
			const depth = deep === true ? Infinity : deep;
			getter = () => traverse(baseGetter(), depth);
		}
		const scope = getCurrentScope();
		const watchHandle = () => {
			effect.stop();
			if (scope && scope.active) remove(scope.effects, effect);
		};
		if (once && cb) {
			const _cb = cb;
			cb = (...args) => {
				const res = _cb(...args);
				watchHandle();
				return res;
			};
		}
		let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
		const job = (immediateFirstRun) => {
			if (!(effect.flags & 1) || !effect.dirty && !immediateFirstRun) return;
			if (cb) {
				const newValue = effect.run();
				if (immediateFirstRun || deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
					if (cleanup) cleanup();
					const currentWatcher = activeWatcher;
					activeWatcher = effect;
					try {
						const args = [
							newValue,
							oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
							boundCleanup
						];
						oldValue = newValue;
						call ? call(cb, 3, args) : cb(...args);
					} finally {
						activeWatcher = currentWatcher;
					}
				}
			} else effect.run();
		};
		if (augmentJob) augmentJob(job);
		effect = new ReactiveEffect(getter);
		effect.scheduler = scheduler ? () => scheduler(job, false) : job;
		boundCleanup = (fn) => onWatcherCleanup(fn, false, effect);
		cleanup = effect.onStop = () => {
			const cleanups = cleanupMap.get(effect);
			if (cleanups) {
				if (call) call(cleanups, 4);
				else for (const cleanup2 of cleanups) cleanup2();
				cleanupMap.delete(effect);
			}
		};
		if (cb) {
			if (immediate) job(true);
			else oldValue = effect.run();
		} else if (scheduler) scheduler(job.bind(null, true), true);
		else effect.run();
		watchHandle.pause = effect.pause.bind(effect);
		watchHandle.resume = effect.resume.bind(effect);
		watchHandle.stop = watchHandle;
		return watchHandle;
	}
	function traverse(value, depth = Infinity, seen) {
		if (depth <= 0 || !isObject(value) || value["__v_skip"]) return value;
		seen = seen || /* @__PURE__ */ new Map();
		if ((seen.get(value) || 0) >= depth) return value;
		seen.set(value, depth);
		depth--;
		if (/* @__PURE__ */ isRef(value)) traverse(value.value, depth, seen);
		else if (isArray(value)) for (let i = 0; i < value.length; i++) traverse(value[i], depth, seen);
		else if (isSet(value) || isMap(value)) value.forEach((v) => {
			traverse(v, depth, seen);
		});
		else if (isPlainObject(value)) {
			for (const key in value) traverse(value[key], depth, seen);
			for (const key of Object.getOwnPropertySymbols(value)) if (Object.prototype.propertyIsEnumerable.call(value, key)) traverse(value[key], depth, seen);
		}
		return value;
	}
	//#endregion
	//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
	/**
	* @vue/runtime-core v3.5.42
	* (c) 2018-present Yuxi (Evan) You and Vue contributors
	* @license MIT
	**/
	var stack = [];
	function pushWarningContext(vnode) {
		stack.push(vnode);
	}
	function popWarningContext() {
		stack.pop();
	}
	var isWarning = false;
	function warn$1(msg, ...args) {
		if (isWarning) return;
		isWarning = true;
		pauseTracking();
		const instance = stack.length ? stack[stack.length - 1].component : null;
		const appWarnHandler = instance && instance.appContext.config.warnHandler;
		const trace = getComponentTrace();
		if (appWarnHandler) callWithErrorHandling(appWarnHandler, instance, 11, [
			msg + args.map((a) => {
				var _a, _b;
				return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
			}).join(""),
			instance && instance.proxy,
			trace.map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`).join("\n"),
			trace
		]);
		else {
			const warnArgs = [`[Vue warn]: ${msg}`, ...args];
			if (trace.length && true) warnArgs.push(`
`, ...formatTrace(trace));
			console.warn(...warnArgs);
		}
		resetTracking();
		isWarning = false;
	}
	function getComponentTrace() {
		let currentVNode = stack[stack.length - 1];
		if (!currentVNode) return [];
		const normalizedStack = [];
		while (currentVNode) {
			const last = normalizedStack[0];
			if (last && last.vnode === currentVNode) last.recurseCount++;
			else normalizedStack.push({
				vnode: currentVNode,
				recurseCount: 0
			});
			const parentInstance = currentVNode.component && currentVNode.component.parent;
			currentVNode = parentInstance && parentInstance.vnode;
		}
		return normalizedStack;
	}
	function formatTrace(trace) {
		const logs = [];
		trace.forEach((entry, i) => {
			logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
		});
		return logs;
	}
	function formatTraceEntry({ vnode, recurseCount }) {
		const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
		const isRoot = vnode.component ? vnode.component.parent == null : false;
		const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
		const close = `>` + postfix;
		return vnode.props ? [
			open,
			...formatProps(vnode.props),
			close
		] : [open + close];
	}
	function formatProps(props) {
		const res = [];
		const keys = Object.keys(props);
		keys.slice(0, 3).forEach((key) => {
			res.push(...formatProp(key, props[key]));
		});
		if (keys.length > 3) res.push(` ...`);
		return res;
	}
	function formatProp(key, value, raw) {
		if (isString(value)) {
			value = JSON.stringify(value);
			return raw ? value : [`${key}=${value}`];
		} else if (typeof value === "number" || typeof value === "boolean" || value == null) return raw ? value : [`${key}=${value}`];
		else if (/* @__PURE__ */ isRef(value)) {
			value = formatProp(key, /* @__PURE__ */ toRaw(value.value), true);
			return raw ? value : [
				`${key}=Ref<`,
				value,
				`>`
			];
		} else if (isFunction(value)) return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
		else {
			value = /* @__PURE__ */ toRaw(value);
			return raw ? value : [`${key}=`, value];
		}
	}
	function assertNumber(val, type) {}
	var ErrorCodes = {
		"SETUP_FUNCTION": 0,
		"0": "SETUP_FUNCTION",
		"RENDER_FUNCTION": 1,
		"1": "RENDER_FUNCTION",
		"NATIVE_EVENT_HANDLER": 5,
		"5": "NATIVE_EVENT_HANDLER",
		"COMPONENT_EVENT_HANDLER": 6,
		"6": "COMPONENT_EVENT_HANDLER",
		"VNODE_HOOK": 7,
		"7": "VNODE_HOOK",
		"DIRECTIVE_HOOK": 8,
		"8": "DIRECTIVE_HOOK",
		"TRANSITION_HOOK": 9,
		"9": "TRANSITION_HOOK",
		"APP_ERROR_HANDLER": 10,
		"10": "APP_ERROR_HANDLER",
		"APP_WARN_HANDLER": 11,
		"11": "APP_WARN_HANDLER",
		"FUNCTION_REF": 12,
		"12": "FUNCTION_REF",
		"ASYNC_COMPONENT_LOADER": 13,
		"13": "ASYNC_COMPONENT_LOADER",
		"SCHEDULER": 14,
		"14": "SCHEDULER",
		"COMPONENT_UPDATE": 15,
		"15": "COMPONENT_UPDATE",
		"APP_UNMOUNT_CLEANUP": 16,
		"16": "APP_UNMOUNT_CLEANUP"
	};
	var ErrorTypeStrings$1 = {
		["sp"]: "serverPrefetch hook",
		["bc"]: "beforeCreate hook",
		["c"]: "created hook",
		["bm"]: "beforeMount hook",
		["m"]: "mounted hook",
		["bu"]: "beforeUpdate hook",
		["u"]: "updated",
		["bum"]: "beforeUnmount hook",
		["um"]: "unmounted hook",
		["a"]: "activated hook",
		["da"]: "deactivated hook",
		["ec"]: "errorCaptured hook",
		["rtc"]: "renderTracked hook",
		["rtg"]: "renderTriggered hook",
		[0]: "setup function",
		[1]: "render function",
		[2]: "watcher getter",
		[3]: "watcher callback",
		[4]: "watcher cleanup function",
		[5]: "native event handler",
		[6]: "component event handler",
		[7]: "vnode hook",
		[8]: "directive hook",
		[9]: "transition hook",
		[10]: "app errorHandler",
		[11]: "app warnHandler",
		[12]: "ref function",
		[13]: "async component loader",
		[14]: "scheduler flush",
		[15]: "component update",
		[16]: "app unmount cleanup function"
	};
	function callWithErrorHandling(fn, instance, type, args) {
		try {
			return args ? fn(...args) : fn();
		} catch (err) {
			handleError(err, instance, type);
		}
	}
	function callWithAsyncErrorHandling(fn, instance, type, args) {
		if (isFunction(fn)) {
			const res = callWithErrorHandling(fn, instance, type, args);
			if (res && isPromise(res)) res.catch((err) => {
				handleError(err, instance, type);
			});
			return res;
		}
		if (isArray(fn)) {
			const values = [];
			for (let i = 0; i < fn.length; i++) values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
			return values;
		}
	}
	function handleError(err, instance, type, throwInDev = true) {
		const contextVNode = instance ? instance.vnode : null;
		const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
		if (instance) {
			let cur = instance.parent;
			const exposedInstance = instance.proxy;
			const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
			while (cur) {
				const errorCapturedHooks = cur.ec;
				if (errorCapturedHooks) {
					for (let i = 0; i < errorCapturedHooks.length; i++) if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) return;
				}
				cur = cur.parent;
			}
			if (errorHandler) {
				pauseTracking();
				callWithErrorHandling(errorHandler, null, 10, [
					err,
					exposedInstance,
					errorInfo
				]);
				resetTracking();
				return;
			}
		}
		logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
	}
	function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
		if (throwInProd) throw err;
		else console.error(err);
	}
	var queue = [];
	var flushIndex = -1;
	var pendingPostFlushCbs = [];
	var activePostFlushCbs = null;
	var postFlushIndex = 0;
	var resolvedPromise = /* @__PURE__ */ Promise.resolve();
	var currentFlushPromise = null;
	function nextTick(fn) {
		const p = currentFlushPromise || resolvedPromise;
		return fn ? p.then(this ? fn.bind(this) : fn) : p;
	}
	function findInsertionIndex(id) {
		let start = flushIndex + 1;
		let end = queue.length;
		while (start < end) {
			const middle = start + end >>> 1;
			const middleJob = queue[middle];
			const middleJobId = getId(middleJob);
			if (middleJobId < id || middleJobId === id && middleJob.flags & 2) start = middle + 1;
			else end = middle;
		}
		return start;
	}
	function queueJob(job) {
		if (!(job.flags & 1)) {
			const jobId = getId(job);
			const lastJob = queue[queue.length - 1];
			if (!lastJob || !(job.flags & 2) && jobId >= getId(lastJob)) queue.push(job);
			else queue.splice(findInsertionIndex(jobId), 0, job);
			job.flags |= 1;
			queueFlush();
		}
	}
	function queueFlush() {
		if (!currentFlushPromise) currentFlushPromise = resolvedPromise.then(flushJobs);
	}
	function queuePostFlushCb(cb) {
		if (!isArray(cb)) {
			if (activePostFlushCbs && cb.id === -1) activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
			else if (!(cb.flags & 1)) {
				pendingPostFlushCbs.push(cb);
				cb.flags |= 1;
			}
		} else for (let i = 0; i < cb.length; i++) pendingPostFlushCbs.push(cb[i]);
		queueFlush();
	}
	function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
		for (; i < queue.length; i++) {
			const cb = queue[i];
			if (cb && cb.flags & 2) {
				if (instance && cb.id !== instance.uid) continue;
				queue.splice(i, 1);
				i--;
				if (cb.flags & 4) cb.flags &= -2;
				cb();
				if (!(cb.flags & 4)) cb.flags &= -2;
			}
		}
	}
	function flushPostFlushCbs(seen) {
		if (pendingPostFlushCbs.length) {
			const deduped = [...new Set(pendingPostFlushCbs)].sort((a, b) => getId(a) - getId(b));
			pendingPostFlushCbs.length = 0;
			if (activePostFlushCbs) {
				for (let i = 0; i < deduped.length; i++) activePostFlushCbs.push(deduped[i]);
				return;
			}
			activePostFlushCbs = deduped;
			for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
				const cb = activePostFlushCbs[postFlushIndex];
				if (cb.flags & 4) cb.flags &= -2;
				if (!(cb.flags & 8)) cb();
				cb.flags &= -2;
			}
			activePostFlushCbs = null;
			postFlushIndex = 0;
		}
	}
	var getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
	function flushJobs(seen) {
		try {
			for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
				const job = queue[flushIndex];
				if (job && !(job.flags & 8)) {
					if (job.flags & 4) job.flags &= -2;
					callWithErrorHandling(job, job.i, job.i ? 15 : 14);
					if (!(job.flags & 4)) job.flags &= -2;
				}
			}
		} finally {
			for (; flushIndex < queue.length; flushIndex++) {
				const job = queue[flushIndex];
				if (job) job.flags &= -2;
			}
			flushIndex = -1;
			queue.length = 0;
			flushPostFlushCbs(seen);
			currentFlushPromise = null;
			if (queue.length || pendingPostFlushCbs.length) flushJobs(seen);
		}
	}
	var devtools$1;
	var buffer = [];
	var devtoolsNotInstalled = false;
	function emit$1(event, ...args) {
		if (devtools$1) devtools$1.emit(event, ...args);
		else if (!devtoolsNotInstalled) buffer.push({
			event,
			args
		});
	}
	function setDevtoolsHook$1(hook, target) {
		var _a, _b;
		devtools$1 = hook;
		if (devtools$1) {
			devtools$1.enabled = true;
			buffer.forEach(({ event, args }) => devtools$1.emit(event, ...args));
			buffer = [];
		} else if (typeof window !== "undefined" && window.HTMLElement && !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))) {
			(target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((newHook) => {
				setDevtoolsHook$1(newHook, target);
			});
			setTimeout(() => {
				if (!devtools$1) {
					target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
					devtoolsNotInstalled = true;
					buffer = [];
				}
			}, 3e3);
		} else {
			devtoolsNotInstalled = true;
			buffer = [];
		}
	}
	function devtoolsInitApp(app, version) {
		emit$1("app:init", app, version, {
			Fragment,
			Text,
			Comment,
			Static
		});
	}
	function devtoolsUnmountApp(app) {
		emit$1("app:unmount", app);
	}
	var devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook("component:added");
	var devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook("component:updated");
	var _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook("component:removed");
	var devtoolsComponentRemoved = (component) => {
		if (devtools$1 && typeof devtools$1.cleanupBuffer === "function" && !devtools$1.cleanupBuffer(component)) _devtoolsComponentRemoved(component);
	};
	// @__NO_SIDE_EFFECTS__
	function createDevtoolsComponentHook(hook) {
		return (component) => {
			emit$1(hook, component.appContext.app, component.uid, component.parent ? component.parent.uid : void 0, component);
		};
	}
	function devtoolsComponentEmit(component, event, params) {
		emit$1("component:emit", component.appContext.app, component, event, params);
	}
	var currentRenderingInstance = null;
	var currentScopeId = null;
	function setCurrentRenderingInstance(instance) {
		const prev = currentRenderingInstance;
		currentRenderingInstance = instance;
		currentScopeId = instance && instance.type.__scopeId || null;
		return prev;
	}
	function pushScopeId(id) {
		currentScopeId = id;
	}
	function popScopeId() {
		currentScopeId = null;
	}
	var withScopeId = (_id) => withCtx;
	function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
		if (!ctx) return fn;
		if (fn._n) return fn;
		const renderFnWithContext = (...args) => {
			if (renderFnWithContext._d) setBlockTracking(-1);
			const prevInstance = setCurrentRenderingInstance(ctx);
			const prevStackSize = blockStack.length;
			let res;
			try {
				res = fn(...args);
			} finally {
				for (let i = blockStack.length; i > prevStackSize; i--) closeBlock();
				setCurrentRenderingInstance(prevInstance);
				if (renderFnWithContext._d) setBlockTracking(1);
			}
			devtoolsComponentUpdated(ctx);
			return res;
		};
		renderFnWithContext._n = true;
		renderFnWithContext._c = true;
		renderFnWithContext._d = true;
		return renderFnWithContext;
	}
	function withDirectives(vnode, directives) {
		if (currentRenderingInstance === null) return vnode;
		const instance = getComponentPublicInstance(currentRenderingInstance);
		const bindings = vnode.dirs || (vnode.dirs = []);
		for (let i = 0; i < directives.length; i++) {
			let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
			if (dir) {
				if (isFunction(dir)) dir = {
					mounted: dir,
					updated: dir
				};
				if (dir.deep) traverse(value);
				bindings.push({
					dir,
					instance,
					value,
					oldValue: void 0,
					arg,
					modifiers
				});
			}
		}
		return vnode;
	}
	function invokeDirectiveHook(vnode, prevVNode, instance, name) {
		const bindings = vnode.dirs;
		const oldBindings = prevVNode && prevVNode.dirs;
		for (let i = 0; i < bindings.length; i++) {
			const binding = bindings[i];
			if (oldBindings) binding.oldValue = oldBindings[i].value;
			let hook = binding.dir[name];
			if (hook) {
				pauseTracking();
				callWithAsyncErrorHandling(hook, instance, 8, [
					vnode.el,
					binding,
					vnode,
					prevVNode
				]);
				resetTracking();
			}
		}
	}
	function provide(key, value) {
		if (currentInstance) {
			let provides = currentInstance.provides;
			const parentProvides = currentInstance.parent && currentInstance.parent.provides;
			if (parentProvides === provides) provides = currentInstance.provides = Object.create(parentProvides);
			provides[key] = value;
		}
	}
	function inject(key, defaultValue, treatDefaultAsFactory = false) {
		const instance = getCurrentInstance();
		if (instance || currentApp) {
			let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
			if (provides && key in provides) return provides[key];
			else if (arguments.length > 1) return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
		}
	}
	function hasInjectionContext() {
		return !!(getCurrentInstance() || currentApp);
	}
	var ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
	var useSSRContext = () => {
		{
			const ctx = inject(ssrContextKey);
			if (!ctx) {}
			return ctx;
		}
	};
	function watchEffect(effect, options) {
		return doWatch(effect, null, options);
	}
	function watchPostEffect(effect, options) {
		return doWatch(effect, null, { flush: "post" });
	}
	function watchSyncEffect(effect, options) {
		return doWatch(effect, null, { flush: "sync" });
	}
	function watch(source, cb, options) {
		return doWatch(source, cb, options);
	}
	function doWatch(source, cb, options = EMPTY_OBJ) {
		const { immediate, deep, flush, once } = options;
		const baseWatchOptions = extend$2({}, options);
		const runsImmediately = cb && immediate || !cb && flush !== "post";
		let ssrCleanup;
		if (isInSSRComponentSetup) {
			if (flush === "sync") {
				const ctx = useSSRContext();
				ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
			} else if (!runsImmediately) {
				const watchStopHandle = () => {};
				watchStopHandle.stop = NOOP;
				watchStopHandle.resume = NOOP;
				watchStopHandle.pause = NOOP;
				return watchStopHandle;
			}
		}
		const instance = currentInstance;
		baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
		let isPre = false;
		if (flush === "post") baseWatchOptions.scheduler = (job) => {
			queuePostRenderEffect(job, instance && instance.suspense);
		};
		else if (flush !== "sync") {
			isPre = true;
			baseWatchOptions.scheduler = (job, isFirstRun) => {
				if (isFirstRun) job();
				else queueJob(job);
			};
		}
		baseWatchOptions.augmentJob = (job) => {
			if (cb) job.flags |= 4;
			if (isPre) {
				job.flags |= 2;
				if (instance) {
					job.id = instance.uid;
					job.i = instance;
				}
			}
		};
		const watchHandle = watch$1(source, cb, baseWatchOptions);
		if (isInSSRComponentSetup) {
			if (ssrCleanup) ssrCleanup.push(watchHandle);
			else if (runsImmediately) watchHandle();
		}
		return watchHandle;
	}
	function instanceWatch(source, value, options) {
		const publicThis = this.proxy;
		const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
		let cb;
		if (isFunction(value)) cb = value;
		else {
			cb = value.handler;
			options = value;
		}
		const reset = setCurrentInstance(this);
		const res = doWatch(getter, cb.bind(publicThis), options);
		reset();
		return res;
	}
	function createPathGetter(ctx, path) {
		const segments = path.split(".");
		return () => {
			let cur = ctx;
			for (let i = 0; i < segments.length && cur; i++) cur = cur[segments[i]];
			return cur;
		};
	}
	var pendingMounts = /* @__PURE__ */ new WeakMap();
	var TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
	var isTeleport = (type) => type.__isTeleport;
	var isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
	var isTeleportDeferred = (props) => props && (props.defer || props.defer === "");
	var isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
	var isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
	var resolveTarget = (props, select) => {
		const targetSelector = props && props.to;
		if (isString(targetSelector)) {
			if (!select) return null;
			else return select(targetSelector);
		} else return targetSelector;
	};
	var TeleportImpl = {
		name: "Teleport",
		__isTeleport: true,
		process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals) {
			const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment, parentNode } } = internals;
			const disabled = isTeleportDisabled(n2.props);
			let { dynamicChildren } = n2;
			const mount = (vnode, container2, anchor2) => {
				if (vnode.shapeFlag & 16) mountChildren(vnode.children, container2, anchor2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			};
			const mountToTarget = (vnode = n2) => {
				const disabled2 = isTeleportDisabled(vnode.props);
				const target = vnode.target = resolveTarget(vnode.props, querySelector);
				const targetAnchor = prepareAnchor(target, vnode, createText, insert);
				if (target) {
					if (namespace !== "svg" && isTargetSVG(target)) namespace = "svg";
					else if (namespace !== "mathml" && isTargetMathML(target)) namespace = "mathml";
					if (parentComponent && parentComponent.isCE) (parentComponent.ce._teleportTargets || (parentComponent.ce._teleportTargets = /* @__PURE__ */ new Set())).add(target);
					if (!disabled2) {
						mount(vnode, target, targetAnchor);
						updateCssVars(vnode, false);
					}
				}
			};
			const queuePendingMount = (vnode) => {
				const mountJob = () => {
					if (pendingMounts.get(vnode) !== mountJob) return;
					pendingMounts.delete(vnode);
					if (isTeleportDisabled(vnode.props)) {
						const mountContainer = parentNode(vnode.el) || container;
						mount(vnode, mountContainer, vnode.anchor);
						updateCssVars(vnode, true);
					}
					mountToTarget(vnode);
				};
				pendingMounts.set(vnode, mountJob);
				queuePostRenderEffect(mountJob, parentSuspense);
			};
			if (n1 == null) {
				const placeholder = n2.el = createText("");
				const mainAnchor = n2.anchor = createText("");
				insert(placeholder, container, anchor);
				insert(mainAnchor, container, anchor);
				if (isTeleportDeferred(n2.props) || parentSuspense && parentSuspense.pendingBranch) {
					queuePendingMount(n2);
					return;
				}
				if (disabled) {
					mount(n2, container, mainAnchor);
					updateCssVars(n2, true);
				}
				mountToTarget();
			} else {
				n2.el = n1.el;
				const mainAnchor = n2.anchor = n1.anchor;
				const pendingMount = pendingMounts.get(n1);
				if (pendingMount) {
					pendingMount.flags |= 8;
					pendingMounts.delete(n1);
					queuePendingMount(n2);
					return;
				}
				n2.targetStart = n1.targetStart;
				const target = n2.target = n1.target;
				const targetAnchor = n2.targetAnchor = n1.targetAnchor;
				const wasDisabled = isTeleportDisabled(n1.props);
				const currentContainer = wasDisabled ? container : target;
				const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
				if (namespace === "svg" || isTargetSVG(target)) namespace = "svg";
				else if (namespace === "mathml" || isTargetMathML(target)) namespace = "mathml";
				if (dynamicChildren) {
					patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, namespace, slotScopeIds);
					traverseStaticChildren(n1, n2, true);
				} else if (!optimized) patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, false);
				if (disabled) {
					if (!wasDisabled) moveTeleport(n2, container, mainAnchor, internals, 1);
					else if (n2.props && n1.props && n2.props.to !== n1.props.to) n2.props.to = n1.props.to;
				} else if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
					const nextTarget = resolveTarget(n2.props, querySelector);
					if (nextTarget) {
						n2.target = nextTarget;
						moveTeleport(n2, nextTarget, null, internals, 0);
					}
				} else if (wasDisabled) moveTeleport(n2, target, targetAnchor, internals, 1);
				updateCssVars(n2, disabled);
			}
		},
		remove(vnode, parentComponent, parentSuspense, { um: unmount, o: { remove: hostRemove } }, doRemove) {
			const { shapeFlag, children, anchor, targetStart, targetAnchor, target, props } = vnode;
			const disabled = isTeleportDisabled(props);
			const shouldRemove = doRemove || !disabled;
			const pendingMount = pendingMounts.get(vnode);
			if (pendingMount) {
				pendingMount.flags |= 8;
				pendingMounts.delete(vnode);
			}
			if (target) {
				hostRemove(targetStart);
				hostRemove(targetAnchor);
			}
			doRemove && hostRemove(anchor);
			if (!pendingMount && (disabled || target) && shapeFlag & 16) for (let i = 0; i < children.length; i++) {
				const child = children[i];
				unmount(child, parentComponent, parentSuspense, shouldRemove, !!child.dynamicChildren);
			}
		},
		move: moveTeleport,
		hydrate: hydrateTeleport
	};
	function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
		if (moveType === 0) insert(vnode.targetAnchor, container, parentAnchor);
		const { el, anchor, shapeFlag, children, props } = vnode;
		const isReorder = moveType === 2;
		if (isReorder) insert(el, container, parentAnchor);
		if (!pendingMounts.has(vnode) && (!isReorder || isTeleportDisabled(props))) {
			if (shapeFlag & 16) for (let i = 0; i < children.length; i++) move(children[i], container, parentAnchor, 2);
		}
		if (isReorder) insert(anchor, container, parentAnchor);
	}
	function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, { o: { nextSibling, parentNode, querySelector, insert, createText } }, hydrateChildren) {
		function hydrateAnchor(target2, targetNode) {
			let targetAnchor = targetNode;
			while (targetAnchor) {
				if (targetAnchor && targetAnchor.nodeType === 8) {
					if (targetAnchor.data === "teleport start anchor") vnode.targetStart = targetAnchor;
					else if (targetAnchor.data === "teleport anchor") {
						vnode.targetAnchor = targetAnchor;
						target2._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
						break;
					}
				}
				targetAnchor = nextSibling(targetAnchor);
			}
		}
		function hydrateDisabledTeleport(node2, vnode2) {
			vnode2.anchor = hydrateChildren(nextSibling(node2), vnode2, parentNode(node2), parentComponent, parentSuspense, slotScopeIds, optimized);
		}
		const target = vnode.target = resolveTarget(vnode.props, querySelector);
		const disabled = isTeleportDisabled(vnode.props);
		if (target) {
			const targetNode = target._lpa || target.firstChild;
			if (vnode.shapeFlag & 16) {
				if (disabled) {
					hydrateDisabledTeleport(node, vnode);
					hydrateAnchor(target, targetNode);
					if (!vnode.targetAnchor) prepareAnchor(target, vnode, createText, insert, parentNode(node) === target ? node : null);
				} else {
					vnode.anchor = nextSibling(node);
					hydrateAnchor(target, targetNode);
					if (!vnode.targetAnchor) prepareAnchor(target, vnode, createText, insert);
					hydrateChildren(targetNode && nextSibling(targetNode), vnode, target, parentComponent, parentSuspense, slotScopeIds, optimized);
				}
			}
			updateCssVars(vnode, disabled);
		} else if (disabled) {
			if (vnode.shapeFlag & 16) {
				hydrateDisabledTeleport(node, vnode);
				vnode.targetStart = node;
				vnode.targetAnchor = nextSibling(node);
			}
		}
		return vnode.anchor && nextSibling(vnode.anchor);
	}
	var Teleport = TeleportImpl;
	function updateCssVars(vnode, isDisabled) {
		const ctx = vnode.ctx;
		if (ctx && ctx.ut) {
			let node, anchor;
			if (isDisabled) {
				node = vnode.el;
				anchor = vnode.anchor;
			} else {
				node = vnode.targetStart;
				anchor = vnode.targetAnchor;
			}
			while (node && node !== anchor) {
				if (node.nodeType === 1) node.setAttribute("data-v-owner", ctx.uid);
				node = node.nextSibling;
			}
			ctx.ut();
		}
	}
	function prepareAnchor(target, vnode, createText, insert, anchor = null) {
		const targetStart = vnode.targetStart = createText("");
		const targetAnchor = vnode.targetAnchor = createText("");
		targetStart[TeleportEndKey] = targetAnchor;
		if (target) {
			insert(targetStart, target, anchor);
			insert(targetAnchor, target, anchor);
		}
		return targetAnchor;
	}
	var leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
	var enterCbKey$1 = /* @__PURE__ */ Symbol("_enterCb");
	function useTransitionState() {
		const state = {
			isMounted: false,
			isLeaving: false,
			isUnmounting: false,
			leavingVNodes: /* @__PURE__ */ new Map()
		};
		onMounted(() => {
			state.isMounted = true;
		});
		onBeforeUnmount(() => {
			state.isUnmounting = true;
		});
		return state;
	}
	var TransitionHookValidator = [Function, Array];
	var BaseTransitionPropsValidators = {
		mode: String,
		appear: Boolean,
		persisted: Boolean,
		onBeforeEnter: TransitionHookValidator,
		onEnter: TransitionHookValidator,
		onAfterEnter: TransitionHookValidator,
		onEnterCancelled: TransitionHookValidator,
		onBeforeLeave: TransitionHookValidator,
		onLeave: TransitionHookValidator,
		onAfterLeave: TransitionHookValidator,
		onLeaveCancelled: TransitionHookValidator,
		onBeforeAppear: TransitionHookValidator,
		onAppear: TransitionHookValidator,
		onAfterAppear: TransitionHookValidator,
		onAppearCancelled: TransitionHookValidator
	};
	var recursiveGetSubtree = (instance) => {
		const subTree = instance.subTree;
		return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
	};
	var BaseTransitionImpl = {
		name: `BaseTransition`,
		props: BaseTransitionPropsValidators,
		setup(props, { slots }) {
			const instance = getCurrentInstance();
			const state = useTransitionState();
			return () => {
				const children = slots.default && getTransitionRawChildren(slots.default(), true);
				const child = children && children.length ? findNonCommentChild(children) : instance.subTree ? createCommentVNode() : void 0;
				if (!child) return;
				const rawProps = /* @__PURE__ */ toRaw(props);
				const { mode } = rawProps;
				if (state.isLeaving) return emptyPlaceholder(child);
				const innerChild = getInnerChild$1(child);
				if (!innerChild) return emptyPlaceholder(child);
				let enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance, (hooks) => enterHooks = hooks);
				if (innerChild.type !== Comment) setTransitionHooks(innerChild, enterHooks);
				let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
				if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(oldInnerChild, innerChild) && recursiveGetSubtree(instance).type !== Comment) {
					let leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
					setTransitionHooks(oldInnerChild, leavingHooks);
					if (mode === "out-in" && innerChild.type !== Comment) {
						state.isLeaving = true;
						leavingHooks.afterLeave = () => {
							state.isLeaving = false;
							if (!(instance.job.flags & 8)) instance.update();
							delete leavingHooks.afterLeave;
							oldInnerChild = void 0;
						};
						return emptyPlaceholder(child);
					} else if (mode === "in-out" && innerChild.type !== Comment) leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
						const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
						leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
						el[leaveCbKey] = () => {
							earlyRemove();
							el[leaveCbKey] = void 0;
							delete enterHooks.delayedLeave;
							oldInnerChild = void 0;
						};
						enterHooks.delayedLeave = () => {
							delayedLeave();
							delete enterHooks.delayedLeave;
							oldInnerChild = void 0;
						};
					};
					else oldInnerChild = void 0;
				} else if (oldInnerChild) oldInnerChild = void 0;
				return child;
			};
		}
	};
	function findNonCommentChild(children) {
		let child = children[0];
		if (children.length > 1) {
			for (const c of children) if (c.type !== Comment) {
				child = c;
				break;
			}
		}
		return child;
	}
	var BaseTransition = BaseTransitionImpl;
	function getLeavingNodesForType(state, vnode) {
		const { leavingVNodes } = state;
		let leavingVNodesCache = leavingVNodes.get(vnode.type);
		if (!leavingVNodesCache) {
			leavingVNodesCache = /* @__PURE__ */ Object.create(null);
			leavingVNodes.set(vnode.type, leavingVNodesCache);
		}
		return leavingVNodesCache;
	}
	function resolveTransitionHooks(vnode, props, state, instance, postClone) {
		const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
		const key = String(vnode.key);
		const leavingVNodesCache = getLeavingNodesForType(state, vnode);
		const callHook = (hook, args) => {
			hook && callWithAsyncErrorHandling(hook, instance, 9, args);
		};
		const callAsyncHook = (hook, args) => {
			const done = args[1];
			callHook(hook, args);
			if (isArray(hook)) {
				if (hook.every((hook2) => hook2.length <= 1)) done();
			} else if (hook.length <= 1) done();
		};
		const hooks = {
			mode,
			persisted,
			beforeEnter(el) {
				let hook = onBeforeEnter;
				if (!state.isMounted) {
					if (appear) hook = onBeforeAppear || onBeforeEnter;
					else return;
				}
				if (el[leaveCbKey]) el[leaveCbKey](true);
				const leavingVNode = leavingVNodesCache[key];
				if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) leavingVNode.el[leaveCbKey]();
				callHook(hook, [el]);
			},
			enter(el) {
				if (leavingVNodesCache[key] === vnode) return;
				let hook = onEnter;
				let afterHook = onAfterEnter;
				let cancelHook = onEnterCancelled;
				if (!state.isMounted) {
					if (appear) {
						hook = onAppear || onEnter;
						afterHook = onAfterAppear || onAfterEnter;
						cancelHook = onAppearCancelled || onEnterCancelled;
					} else return;
				}
				let called = false;
				el[enterCbKey$1] = (cancelled) => {
					if (called) return;
					called = true;
					if (cancelled) callHook(cancelHook, [el]);
					else callHook(afterHook, [el]);
					if (hooks.delayedLeave) hooks.delayedLeave();
					el[enterCbKey$1] = void 0;
				};
				const done = el[enterCbKey$1].bind(null, false);
				if (hook) callAsyncHook(hook, [el, done]);
				else done();
			},
			leave(el, remove) {
				const key2 = String(vnode.key);
				if (el[enterCbKey$1]) el[enterCbKey$1](true);
				if (state.isUnmounting) return remove();
				callHook(onBeforeLeave, [el]);
				let called = false;
				el[leaveCbKey] = (cancelled) => {
					if (called) return;
					called = true;
					remove();
					if (cancelled) callHook(onLeaveCancelled, [el]);
					else callHook(onAfterLeave, [el]);
					el[leaveCbKey] = void 0;
					if (leavingVNodesCache[key2] === vnode) delete leavingVNodesCache[key2];
				};
				const done = el[leaveCbKey].bind(null, false);
				leavingVNodesCache[key2] = vnode;
				if (onLeave) callAsyncHook(onLeave, [el, done]);
				else done();
			},
			clone(vnode2) {
				const hooks2 = resolveTransitionHooks(vnode2, props, state, instance, postClone);
				if (postClone) postClone(hooks2);
				return hooks2;
			}
		};
		return hooks;
	}
	function emptyPlaceholder(vnode) {
		if (isKeepAlive(vnode)) {
			vnode = cloneVNode(vnode);
			vnode.children = null;
			return vnode;
		}
	}
	function getInnerChild$1(vnode) {
		if (!isKeepAlive(vnode)) {
			if (isTeleport(vnode.type) && vnode.children) return findNonCommentChild(vnode.children);
			return vnode;
		}
		if (vnode.component) return vnode.component.subTree;
		const { shapeFlag, children } = vnode;
		if (children) {
			if (shapeFlag & 16) return children[0];
			if (shapeFlag & 32 && isFunction(children.default)) return children.default();
		}
	}
	function setTransitionHooks(vnode, hooks) {
		if (vnode.shapeFlag & 6 && vnode.component) {
			vnode.transition = hooks;
			const subTree = vnode.component.subTree;
			setTransitionHooks(isTeleport(subTree.type) ? getInnerChild$1(subTree) || subTree : subTree, hooks);
		} else if (vnode.shapeFlag & 128) {
			vnode.ssContent.transition = hooks.clone(vnode.ssContent);
			vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
		} else vnode.transition = hooks;
	}
	function getTransitionRawChildren(children, keepComment = false, parentKey) {
		let ret = [];
		let keyedFragmentCount = 0;
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
			if (child.type === Fragment) {
				if (child.patchFlag & 128) keyedFragmentCount++;
				ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
			} else if (keepComment || child.type !== Comment) ret.push(key != null ? cloneVNode(child, { key }) : child);
		}
		if (keyedFragmentCount > 1) for (let i = 0; i < ret.length; i++) ret[i].patchFlag = -2;
		return ret;
	}
	// @__NO_SIDE_EFFECTS__
	function defineComponent(options, extraOptions) {
		return isFunction(options) ? /* @__PURE__ */ (() => extend$2({ name: options.name }, extraOptions, { setup: options }))() : options;
	}
	function useId() {
		const i = getCurrentInstance();
		if (i) return (i.appContext.config.idPrefix || "v") + "-" + i.ids[0] + i.ids[1]++;
		return "";
	}
	function markAsyncBoundary(instance) {
		instance.ids = [
			instance.ids[0] + instance.ids[2]++ + "-",
			0,
			0
		];
	}
	function useTemplateRef(key) {
		const i = getCurrentInstance();
		const r = /* @__PURE__ */ shallowRef(null);
		if (i) {
			const refs = i.refs === EMPTY_OBJ ? i.refs = {} : i.refs;
			Object.defineProperty(refs, key, {
				enumerable: true,
				get: () => r.value,
				set: (val) => r.value = val
			});
		}
		return r;
	}
	function isTemplateRefKey(refs, key) {
		let desc;
		return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
	}
	var pendingSetRefMap = /* @__PURE__ */ new WeakMap();
	function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
		if (isArray(rawRef)) {
			rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
			return;
		}
		if (isAsyncWrapper(vnode) && !isUnmount) {
			if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
			return;
		}
		const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
		const value = isUnmount ? null : refValue;
		const { i: owner, r: ref } = rawRef;
		const oldRef = oldRawRef && oldRawRef.r;
		const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
		const setupState = owner.setupState;
		const rawSetupState = /* @__PURE__ */ toRaw(setupState);
		const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
			if (isTemplateRefKey(refs, key)) return false;
			return hasOwn(rawSetupState, key);
		};
		const canSetRef = (ref2, key) => {
			if (key && isTemplateRefKey(refs, key)) return false;
			return true;
		};
		if (oldRef != null && oldRef !== ref) {
			invalidatePendingSetRef(oldRawRef);
			if (isString(oldRef)) {
				refs[oldRef] = null;
				if (canSetSetupRef(oldRef)) setupState[oldRef] = null;
			} else if (/* @__PURE__ */ isRef(oldRef)) {
				const oldRawRefAtom = oldRawRef;
				if (canSetRef(oldRef, oldRawRefAtom.k)) oldRef.value = null;
				if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
			}
		}
		if (isFunction(ref)) callWithErrorHandling(ref, owner, 12, [value, refs]);
		else {
			const _isString = isString(ref);
			const _isRef = /* @__PURE__ */ isRef(ref);
			if (_isString || _isRef) {
				const doSet = () => {
					if (rawRef.f) {
						const existing = _isString ? canSetSetupRef(ref) ? setupState[ref] : refs[ref] : canSetRef(ref) || !rawRef.k ? ref.value : refs[rawRef.k];
						if (isUnmount) isArray(existing) && remove(existing, refValue);
						else if (!isArray(existing)) {
							if (_isString) {
								refs[ref] = [refValue];
								if (canSetSetupRef(ref)) setupState[ref] = refs[ref];
							} else {
								const newVal = [refValue];
								if (canSetRef(ref, rawRef.k)) ref.value = newVal;
								if (rawRef.k) refs[rawRef.k] = newVal;
							}
						} else if (!existing.includes(refValue)) existing.push(refValue);
					} else if (_isString) {
						refs[ref] = value;
						if (canSetSetupRef(ref)) setupState[ref] = value;
					} else if (_isRef) {
						if (canSetRef(ref, rawRef.k)) ref.value = value;
						if (rawRef.k) refs[rawRef.k] = value;
					}
				};
				if (value) {
					const job = () => {
						doSet();
						pendingSetRefMap.delete(rawRef);
					};
					job.id = -1;
					pendingSetRefMap.set(rawRef, job);
					queuePostRenderEffect(job, parentSuspense);
				} else {
					invalidatePendingSetRef(rawRef);
					doSet();
				}
			}
		}
	}
	function invalidatePendingSetRef(rawRef) {
		const pendingSetRef = pendingSetRefMap.get(rawRef);
		if (pendingSetRef) {
			pendingSetRef.flags |= 8;
			pendingSetRefMap.delete(rawRef);
		}
	}
	var hasLoggedMismatchError = false;
	var logMismatchError = () => {
		if (hasLoggedMismatchError) return;
		console.error("Hydration completed but contains mismatches.");
		hasLoggedMismatchError = true;
	};
	var isSVGContainer = (container) => container.namespaceURI.includes("svg") && container.tagName !== "foreignObject";
	var isMathMLContainer = (container) => container.namespaceURI.includes("MathML");
	var getContainerType = (container) => {
		if (container.nodeType !== 1) return void 0;
		if (isSVGContainer(container)) return "svg";
		if (isMathMLContainer(container)) return "mathml";
	};
	var isComment = (node) => node.nodeType === 8;
	function createHydrationFunctions(rendererInternals) {
		const { mt: mountComponent, p: patch, o: { patchProp, createText, nextSibling, parentNode, remove, insert, createComment } } = rendererInternals;
		const hydrate = (vnode, container) => {
			if (!container.hasChildNodes()) {
				warn$1(`Attempting to hydrate existing markup but container is empty. Performing full mount instead.`);
				patch(null, vnode, container);
				flushPostFlushCbs();
				container._vnode = vnode;
				return;
			}
			hydrateNode(container.firstChild, vnode, null, null, null);
			flushPostFlushCbs();
			container._vnode = vnode;
		};
		const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
			optimized = optimized || !!vnode.dynamicChildren;
			const isFragmentStart = isComment(node) && node.data === "[";
			const onMismatch = () => handleMismatch(node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragmentStart);
			const { type, ref, shapeFlag, patchFlag } = vnode;
			let domType = node.nodeType;
			vnode.el = node;
			def(node, "__vnode", vnode, true);
			def(node, "__vueParentComponent", parentComponent, true);
			if (patchFlag === -2) {
				optimized = false;
				vnode.dynamicChildren = null;
			}
			let nextNode = null;
			switch (type) {
				case Text:
					if (domType !== 3) {
						if (vnode.children === "") {
							insert(vnode.el = createText(""), parentNode(node), node);
							nextNode = node;
						} else nextNode = onMismatch();
					} else {
						if (node.data !== vnode.children) {
							warn$1(`Hydration text mismatch in`, node.parentNode, `
  - rendered on server: ${JSON.stringify(node.data)}
  - expected on client: ${JSON.stringify(vnode.children)}`);
							logMismatchError();
							node.data = vnode.children;
						}
						nextNode = nextSibling(node);
					}
					break;
				case Comment:
					if (isTemplateNode(node)) {
						nextNode = nextSibling(node);
						replaceNode(vnode.el = node.content.firstChild, node, parentComponent);
					} else if (domType !== 8 || isFragmentStart) nextNode = onMismatch();
					else nextNode = nextSibling(node);
					break;
				case Static:
					if (isFragmentStart) {
						node = nextSibling(node);
						domType = node.nodeType;
					}
					if (domType === 1 || domType === 3) {
						nextNode = node;
						const needToAdoptContent = !vnode.children.length;
						for (let i = 0; i < vnode.staticCount; i++) {
							if (needToAdoptContent) vnode.children += nextNode.nodeType === 1 ? nextNode.outerHTML : nextNode.data;
							if (i === vnode.staticCount - 1) vnode.anchor = nextNode;
							nextNode = nextSibling(nextNode);
						}
						return isFragmentStart ? nextSibling(nextNode) : nextNode;
					} else onMismatch();
					break;
				case Fragment:
					if (!isFragmentStart) nextNode = onMismatch();
					else nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
					break;
				default: if (shapeFlag & 1) {
					if ((domType !== 1 || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) && !isTemplateNode(node)) nextNode = onMismatch();
					else nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
				} else if (shapeFlag & 6) {
					vnode.slotScopeIds = slotScopeIds;
					const container = parentNode(node);
					if (isFragmentStart) nextNode = locateClosingAnchor(node);
					else if (isComment(node) && node.data === "teleport start") nextNode = locateClosingAnchor(node, node.data, "teleport end");
					else nextNode = nextSibling(node);
					mountComponent(vnode, container, null, parentComponent, parentSuspense, getContainerType(container), optimized);
					if (isAsyncWrapper(vnode) && !vnode.component.subTree) {
						let subTree;
						if (isFragmentStart) {
							subTree = createVNode(Static);
							subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
						} else subTree = node.nodeType === 3 ? createTextVNode("") : createVNode("div");
						subTree.el = node;
						vnode.component.subTree = subTree;
					}
				} else if (shapeFlag & 64) {
					if (domType !== 8) nextNode = onMismatch();
					else nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, rendererInternals, hydrateChildren);
				} else if (shapeFlag & 128) nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, getContainerType(parentNode(node)), slotScopeIds, optimized, rendererInternals, hydrateNode);
				else warn$1("Invalid HostVNode type:", type, `(${typeof type})`);
			}
			if (ref != null) setRef(ref, null, parentSuspense, vnode);
			return nextNode;
		};
		const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
			optimized = optimized || !!vnode.dynamicChildren;
			const { type, dynamicProps, props, patchFlag, shapeFlag, dirs, transition } = vnode;
			const forcePatch = type === "input" || type === "option";
			if (forcePatch || !!dynamicProps || patchFlag !== -1) {
				if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "created");
				let needCallTransitionHooks = false;
				if (isTemplateNode(el)) {
					needCallTransitionHooks = needTransition(null, transition) && parentComponent && parentComponent.vnode.props && parentComponent.vnode.props.appear;
					const content = el.content.firstChild;
					if (needCallTransitionHooks) {
						const cls = content.getAttribute("class");
						if (cls) content.$cls = cls;
						transition.beforeEnter(content);
					}
					replaceNode(content, el, parentComponent);
					vnode.el = el = content;
				}
				if (shapeFlag & 16 && !(props && (props.innerHTML || props.textContent))) {
					let next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, slotScopeIds, optimized);
					if (next && !isMismatchAllowed(el, 1)) {
						warn$1(`Hydration children mismatch on`, el, `
Server rendered element contains more child nodes than client vdom.`);
						logMismatchError();
					}
					while (next) {
						const cur = next;
						next = next.nextSibling;
						remove(cur);
					}
				} else if (shapeFlag & 8) {
					let clientText = vnode.children;
					if (clientText[0] === "\n" && (el.tagName === "PRE" || el.tagName === "TEXTAREA")) clientText = clientText.slice(1);
					const { textContent } = el;
					if (textContent !== clientText && textContent !== clientText.replace(/\r\n|\r/g, "\n")) {
						if (!isMismatchAllowed(el, 0)) {
							warn$1(`Hydration text content mismatch on`, el, `
  - rendered on server: ${textContent}
  - expected on client: ${clientText}`);
							logMismatchError();
						}
						el.textContent = vnode.children;
					}
				}
				if (props) {
					const isCustomElement = el.tagName.includes("-");
					const namespace = el.namespaceURI.includes("svg") ? "svg" : el.namespaceURI.includes("MathML") ? "mathml" : void 0;
					for (const key in props) {
						if (!(dirs && dirs.some((d) => d.dir.created)) && propHasMismatch(el, key, props[key], vnode, parentComponent)) logMismatchError();
						if (forcePatch && (key.endsWith("value") || key === "indeterminate") || isOn(key) && !isReservedProp(key) || key[0] === "." || isCustomElement && !isReservedProp(key) || dynamicProps && dynamicProps.includes(key)) {
							if (isUnchangedResourceProp(el, key, props[key])) continue;
							patchProp(el, key, null, props[key], namespace, parentComponent);
						}
					}
				}
				let vnodeHooks;
				if (vnodeHooks = props && props.onVnodeBeforeMount) invokeVNodeHook(vnodeHooks, parentComponent, vnode);
				if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
				if ((vnodeHooks = props && props.onVnodeMounted) || dirs || needCallTransitionHooks) queueEffectWithSuspense(() => {
					vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
					needCallTransitionHooks && transition.enter(el);
					dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
				}, parentSuspense);
			}
			return el.nextSibling;
		};
		const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
			optimized = optimized || !!parentVNode.dynamicChildren;
			const children = parentVNode.children;
			const l = children.length;
			let hasCheckedMismatch = false;
			for (let i = 0; i < l; i++) {
				const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
				const isText = vnode.type === Text;
				if (node) {
					if (isText && !optimized) {
						if (i + 1 < l && normalizeVNode(children[i + 1]).type === Text) {
							insert(createText(node.data.slice(vnode.children.length)), container, nextSibling(node));
							node.data = vnode.children;
						}
					}
					node = hydrateNode(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
				} else if (isText && !vnode.children) insert(vnode.el = createText(""), container);
				else {
					if (!hasCheckedMismatch) {
						hasCheckedMismatch = true;
						if (!isMismatchAllowed(container, 1)) {
							warn$1(`Hydration children mismatch on`, container, `
Server rendered element contains fewer child nodes than client vdom.`);
							logMismatchError();
						}
					}
					patch(null, vnode, container, null, parentComponent, parentSuspense, getContainerType(container), slotScopeIds);
				}
			}
			return node;
		};
		const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
			const { slotScopeIds: fragmentSlotScopeIds } = vnode;
			if (fragmentSlotScopeIds) slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
			const container = parentNode(node);
			const next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, slotScopeIds, optimized);
			if (next && isComment(next) && next.data === "]") return nextSibling(vnode.anchor = next);
			else {
				logMismatchError();
				insert(vnode.anchor = createComment(`]`), container, next);
				return next;
			}
		};
		const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
			if (!isNodeMismatchAllowed(node, vnode)) {
				warn$1(`Hydration node mismatch:
- rendered on server:`, node, node.nodeType === 3 ? `(text)` : isComment(node) && node.data === "[" ? `(start of fragment)` : ``, `
- expected on client:`, vnode.type);
				logMismatchError();
			}
			vnode.el = null;
			if (isFragment) {
				const end = locateClosingAnchor(node);
				while (true) {
					const next2 = nextSibling(node);
					if (next2 && next2 !== end) remove(next2);
					else break;
				}
			}
			const next = nextSibling(node);
			const container = parentNode(node);
			remove(node);
			patch(null, vnode, container, next, parentComponent, parentSuspense, getContainerType(container), slotScopeIds);
			if (parentComponent) {
				parentComponent.vnode.el = vnode.el;
				updateHOCHostEl(parentComponent, vnode.el);
			}
			return next;
		};
		const locateClosingAnchor = (node, open = "[", close = "]") => {
			let match = 0;
			while (node) {
				node = nextSibling(node);
				if (node && isComment(node)) {
					if (node.data === open) match++;
					if (node.data === close) {
						if (match === 0) return nextSibling(node);
						else match--;
					}
				}
			}
			return node;
		};
		const replaceNode = (newNode, oldNode, parentComponent) => {
			const parentNode2 = oldNode.parentNode;
			if (parentNode2) parentNode2.replaceChild(newNode, oldNode);
			let parent = parentComponent;
			while (parent) {
				if (parent.vnode.el === oldNode) parent.vnode.el = parent.subTree.el = newNode;
				parent = parent.parent;
			}
		};
		const isTemplateNode = (node) => {
			return node.nodeType === 1 && node.tagName === "TEMPLATE";
		};
		return [hydrate, hydrateNode];
	}
	var resourceProps = /* @__PURE__ */ new Set([
		"src",
		"srcset",
		"href",
		"poster"
	]);
	function isUnchangedResourceProp(el, key, clientValue) {
		if (!resourceProps.has(key)) return false;
		return el.getAttribute(key) === (clientValue == null ? null : `${clientValue}`);
	}
	function propHasMismatch(el, key, clientValue, vnode, instance) {
		let mismatchType;
		let mismatchKey;
		let actual;
		let expected;
		if (key === "class") {
			if (el.$cls) {
				actual = el.$cls;
				delete el.$cls;
			} else actual = el.getAttribute("class");
			expected = normalizeClass(clientValue);
			if (!isSetEqual(toClassSet(actual || ""), toClassSet(expected))) {
				mismatchType = 2;
				mismatchKey = `class`;
			}
		} else if (key === "style") {
			actual = el.getAttribute("style") || "";
			expected = isString(clientValue) ? clientValue : stringifyStyle(normalizeStyle(clientValue));
			const actualMap = toStyleMap(actual);
			const expectedMap = toStyleMap(expected);
			if (vnode.dirs) {
				for (const { dir, value } of vnode.dirs) if (dir.name === "show" && !value) expectedMap.set("display", "none");
			}
			if (instance) resolveCssVars(instance, vnode, expectedMap);
			if (!isMapEqual(actualMap, expectedMap)) {
				mismatchType = 3;
				mismatchKey = "style";
			}
		} else if (el instanceof SVGElement && isKnownSvgAttr(key) || el instanceof HTMLElement && (isBooleanAttr(key) || isKnownHtmlAttr(key))) {
			if (key === "hidden") {
				actual = normalizeHiddenValue(el.getAttribute(key));
				expected = normalizeHiddenValue(clientValue);
			} else if (isBooleanAttr(key)) {
				actual = el.hasAttribute(key);
				expected = includeBooleanAttr(clientValue);
			} else if (clientValue == null) {
				actual = el.hasAttribute(key);
				expected = false;
			} else {
				if (el.hasAttribute(key)) actual = el.getAttribute(key);
				else if (key === "value" && el.tagName === "TEXTAREA") actual = el.value;
				else actual = false;
				expected = isRenderableAttrValue(clientValue) ? String(clientValue) : false;
			}
			if (actual !== expected) {
				mismatchType = 4;
				mismatchKey = key;
			}
		}
		if (mismatchType != null && !isMismatchAllowed(el, mismatchType)) {
			const format = (v) => v === false ? `(not rendered)` : `${mismatchKey}="${v}"`;
			warn$1(`Hydration ${MismatchTypeString[mismatchType]} mismatch on`, el, `
  - rendered on server: ${format(actual)}
  - expected on client: ${format(expected)}
  Note: this mismatch is check-only. The DOM will not be rectified in production due to performance overhead.
  You should fix the source of the mismatch.`);
			return true;
		}
		return false;
	}
	function normalizeHiddenValue(value) {
		if (!isRenderableAttrValue(value)) return false;
		if (isString(value)) return value.toLowerCase() === "until-found" ? "until-found" : "";
		return includeBooleanAttr(value) ? "" : false;
	}
	function toClassSet(str) {
		return new Set(str.trim().split(/\s+/));
	}
	function isSetEqual(a, b) {
		if (a.size !== b.size) return false;
		for (const s of a) if (!b.has(s)) return false;
		return true;
	}
	function toStyleMap(str) {
		const styleMap = /* @__PURE__ */ new Map();
		for (const item of str.split(";")) {
			let [key, value] = item.split(":");
			key = key.trim();
			value = value && value.trim();
			if (key && value) styleMap.set(key, value);
		}
		return styleMap;
	}
	function isMapEqual(a, b) {
		if (a.size !== b.size) return false;
		for (const [key, value] of a) if (value !== b.get(key)) return false;
		return true;
	}
	function resolveCssVars(instance, vnode, expectedMap) {
		const root = instance.subTree;
		if (instance.getCssVars && (vnode === root || root && root.type === Fragment && root.children.includes(vnode))) {
			const cssVars = instance.getCssVars();
			for (const key in cssVars) {
				const value = normalizeCssVarValue(cssVars[key]);
				expectedMap.set(`--${getEscapedCssVarName(key, false)}`, value);
			}
		}
		if (vnode === root && instance.parent) resolveCssVars(instance.parent, instance.vnode, expectedMap);
	}
	var allowMismatchAttr = "data-allow-mismatch";
	var MismatchTypeString = {
		[0]: "text",
		[1]: "children",
		[2]: "class",
		[3]: "style",
		[4]: "attribute"
	};
	function isMismatchAllowed(el, allowedType) {
		if (allowedType === 0 || allowedType === 1) while (el && !el.hasAttribute(allowMismatchAttr)) el = el.parentElement;
		return isMismatchAllowedByAttr(el && el.getAttribute(allowMismatchAttr), allowedType);
	}
	function isMismatchAllowedByAttr(allowedAttr, allowedType) {
		if (allowedAttr == null) return false;
		else if (allowedAttr === "") return true;
		else {
			const list = allowedAttr.split(",");
			if (allowedType === 0 && list.includes("children")) return true;
			return list.includes(MismatchTypeString[allowedType]);
		}
	}
	function isNodeMismatchAllowed(node, vnode) {
		return isMismatchAllowed(node.parentElement, 1) || isMismatchAllowedByNode(node) || isMismatchAllowedByVNode(vnode);
	}
	function isMismatchAllowedByNode(node) {
		return node.nodeType === 1 && isMismatchAllowedByAttr(node.getAttribute(allowMismatchAttr), 1);
	}
	function isMismatchAllowedByVNode({ props }) {
		const allowedAttr = props && props[allowMismatchAttr];
		return typeof allowedAttr === "string" && isMismatchAllowedByAttr(allowedAttr, 1);
	}
	var requestIdleCallback = getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
	var cancelIdleCallback = getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
	var hydrateOnIdle = (timeout = 1e4) => (hydrate) => {
		const id = requestIdleCallback(hydrate, { timeout });
		return () => cancelIdleCallback(id);
	};
	function elementIsVisibleInViewport(el) {
		const { top, left, bottom, right } = el.getBoundingClientRect();
		const { innerHeight, innerWidth } = window;
		return (top > 0 && top < innerHeight || bottom > 0 && bottom < innerHeight) && (left > 0 && left < innerWidth || right > 0 && right < innerWidth);
	}
	var hydrateOnVisible = (opts) => (hydrate, forEach) => {
		const ob = new IntersectionObserver((entries) => {
			for (const e of entries) {
				if (!e.isIntersecting) continue;
				ob.disconnect();
				hydrate();
				break;
			}
		}, opts);
		forEach((el) => {
			if (!(el instanceof Element)) return;
			if (elementIsVisibleInViewport(el)) {
				hydrate();
				ob.disconnect();
				return false;
			}
			ob.observe(el);
		});
		return () => ob.disconnect();
	};
	var hydrateOnMediaQuery = (query) => (hydrate) => {
		if (query) {
			const mql = matchMedia(query);
			if (mql.matches) hydrate();
			else {
				mql.addEventListener("change", hydrate, { once: true });
				return () => mql.removeEventListener("change", hydrate);
			}
		}
	};
	var hydrateOnInteraction = (interactions = []) => (hydrate, forEach) => {
		if (isString(interactions)) interactions = [interactions];
		let hasHydrated = false;
		const doHydrate = (e) => {
			if (!hasHydrated) {
				hasHydrated = true;
				teardown();
				hydrate();
				e.target.dispatchEvent(new e.constructor(e.type, e));
			}
		};
		const teardown = () => {
			forEach((el) => {
				for (const i of interactions) el.removeEventListener(i, doHydrate);
			});
		};
		forEach((el) => {
			for (const i of interactions) el.addEventListener(i, doHydrate, { once: true });
		});
		return teardown;
	};
	function forEachElement(node, cb) {
		if (isComment(node) && node.data === "[") {
			let depth = 1;
			let next = node.nextSibling;
			while (next) {
				if (next.nodeType === 1) {
					if (cb(next) === false) break;
				} else if (isComment(next)) {
					if (next.data === "]") {
						if (--depth === 0) break;
					} else if (next.data === "[") depth++;
				}
				next = next.nextSibling;
			}
		} else cb(node);
	}
	var isAsyncWrapper = (i) => !!i.type.__asyncLoader;
	// @__NO_SIDE_EFFECTS__
	function defineAsyncComponent(source) {
		if (isFunction(source)) source = { loader: source };
		const { loader, loadingComponent, errorComponent, delay = 200, hydrate: hydrateStrategy, timeout, suspensible = true, onError: userOnError } = source;
		let pendingRequest = null;
		let resolvedComp;
		let retries = 0;
		const retry = () => {
			retries++;
			pendingRequest = null;
			return load();
		};
		const load = () => {
			let thisRequest;
			return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
				err = err instanceof Error ? err : new Error(String(err));
				if (userOnError) return new Promise((resolve, reject) => {
					const userRetry = () => resolve(retry());
					const userFail = () => reject(err);
					userOnError(err, userRetry, userFail, retries + 1);
				});
				else throw err;
			}).then((comp) => {
				if (thisRequest !== pendingRequest && pendingRequest) return pendingRequest;
				if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) comp = comp.default;
				resolvedComp = comp;
				return comp;
			}));
		};
		return /* @__PURE__ */ defineComponent({
			name: "AsyncComponentWrapper",
			__asyncLoader: load,
			__asyncHydrate(el, instance, hydrate) {
				const wasConnected = el.isConnected;
				let patched = false;
				(instance.bu || (instance.bu = [])).push(() => patched = true);
				const performHydrate = () => {
					if (patched) return;
					if (!el.parentNode || wasConnected && !el.isConnected) return;
					hydrate();
				};
				const doHydrate = hydrateStrategy ? () => {
					const teardown = hydrateStrategy(performHydrate, (cb) => forEachElement(el, cb));
					if (teardown) (instance.bum || (instance.bum = [])).push(teardown);
				} : performHydrate;
				if (resolvedComp) doHydrate();
				else load().then(() => !instance.isUnmounted && doHydrate());
			},
			get __asyncResolved() {
				return resolvedComp;
			},
			setup() {
				const instance = currentInstance;
				markAsyncBoundary(instance);
				if (resolvedComp) return () => createInnerComp(resolvedComp, instance);
				const onError = (err) => {
					pendingRequest = null;
					handleError(err, instance, 13, !errorComponent);
				};
				if (suspensible && instance.suspense || isInSSRComponentSetup) return load().then((comp) => {
					return () => createInnerComp(comp, instance);
				}).catch((err) => {
					onError(err);
					return () => errorComponent ? createVNode(errorComponent, { error: err }) : null;
				});
				const loaded = /* @__PURE__ */ ref(false);
				const error = /* @__PURE__ */ ref();
				const delayed = /* @__PURE__ */ ref(!!delay);
				let timeoutTimer;
				let delayTimer;
				onUnmounted(() => {
					if (timeoutTimer != null) clearTimeout(timeoutTimer);
					if (delayTimer != null) clearTimeout(delayTimer);
				});
				if (delay) delayTimer = setTimeout(() => {
					if (instance.isUnmounted) return;
					delayed.value = false;
				}, delay);
				if (timeout != null) timeoutTimer = setTimeout(() => {
					if (instance.isUnmounted) return;
					if (!loaded.value && !error.value) {
						const err = /* @__PURE__ */ new Error(`Async component timed out after ${timeout}ms.`);
						onError(err);
						error.value = err;
					}
				}, timeout);
				load().then(() => {
					if (instance.isUnmounted) return;
					loaded.value = true;
					if (instance.parent && isKeepAlive(instance.parent.vnode)) instance.parent.update();
				}).catch((err) => {
					if (instance.isUnmounted) {
						pendingRequest = null;
						return;
					}
					onError(err);
					error.value = err;
				});
				return () => {
					if (loaded.value && resolvedComp) return createInnerComp(resolvedComp, instance);
					else if (error.value && errorComponent) return createVNode(errorComponent, { error: error.value });
					else if (loadingComponent && !delayed.value) return createInnerComp(loadingComponent, instance);
				};
			}
		});
	}
	function createInnerComp(comp, parent) {
		const { ref: ref2, props, children, ce } = parent.vnode;
		const vnode = createVNode(comp, props, children);
		vnode.ref = ref2;
		vnode.ce = ce;
		delete parent.vnode.ce;
		return vnode;
	}
	var isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
	var KeepAlive = {
		name: `KeepAlive`,
		__isKeepAlive: true,
		props: {
			include: [
				String,
				RegExp,
				Array
			],
			exclude: [
				String,
				RegExp,
				Array
			],
			max: [String, Number]
		},
		setup(props, { slots }) {
			const instance = getCurrentInstance();
			const sharedContext = instance.ctx;
			if (!sharedContext.renderer) return () => {
				const children = slots.default && slots.default();
				return children && children.length === 1 ? children[0] : children;
			};
			const cache = /* @__PURE__ */ new Map();
			const keys = /* @__PURE__ */ new Set();
			let current = null;
			instance.__v_cache = cache;
			const parentSuspense = instance.suspense;
			const { renderer: { p: patch, m: move, um: _unmount, o: { createElement } } } = sharedContext;
			const storageContainer = createElement("div");
			sharedContext.activate = (vnode, container, anchor, namespace, optimized) => {
				const instance2 = vnode.component;
				move(vnode, container, anchor, 0, parentSuspense);
				patch(instance2.vnode, vnode, container, anchor, instance2, parentSuspense, namespace, vnode.slotScopeIds, optimized);
				queuePostRenderEffect(() => {
					instance2.isDeactivated = false;
					if (instance2.a) invokeArrayFns(instance2.a);
					const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
					if (vnodeHook) invokeVNodeHook(vnodeHook, instance2.parent, vnode);
				}, parentSuspense);
				devtoolsComponentAdded(instance2);
			};
			sharedContext.deactivate = (vnode) => {
				const instance2 = vnode.component;
				invalidateMount(instance2.m);
				invalidateMount(instance2.a);
				move(vnode, storageContainer, null, 1, parentSuspense);
				queuePostRenderEffect(() => {
					if (instance2.da) invokeArrayFns(instance2.da);
					const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
					if (vnodeHook) invokeVNodeHook(vnodeHook, instance2.parent, vnode);
					instance2.isDeactivated = true;
				}, parentSuspense);
				devtoolsComponentAdded(instance2);
			};
			function unmount(vnode) {
				resetShapeFlag(vnode);
				_unmount(vnode, instance, parentSuspense, true);
			}
			function pruneCache(filter) {
				cache.forEach((vnode, key) => {
					const name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : vnode.type);
					if (name && !filter(name)) pruneCacheEntry(key);
				});
			}
			function pruneCacheEntry(key) {
				const cached = cache.get(key);
				if (cached && (!current || !isSameVNodeType(cached, current))) unmount(cached);
				else if (current) resetShapeFlag(current);
				cache.delete(key);
				keys.delete(key);
			}
			watch(() => [props.include, props.exclude], ([include, exclude]) => {
				include && pruneCache((name) => matches$1(include, name));
				exclude && pruneCache((name) => !matches$1(exclude, name));
			}, {
				flush: "post",
				deep: true
			});
			let pendingCacheKey = null;
			const cacheSubtree = () => {
				if (pendingCacheKey != null) {
					if (isSuspense(instance.subTree.type)) queuePostRenderEffect(() => {
						const vnode = getInnerChild(instance.subTree);
						if (vnode.component) cache.set(pendingCacheKey, vnode);
					}, instance.subTree.suspense);
					else cache.set(pendingCacheKey, getInnerChild(instance.subTree));
				}
			};
			onMounted(cacheSubtree);
			onUpdated(cacheSubtree);
			onBeforeUnmount(() => {
				cache.forEach((cached) => {
					const { subTree, suspense } = instance;
					const vnode = getInnerChild(subTree);
					if (cached.type === vnode.type && cached.key === vnode.key) {
						resetShapeFlag(vnode);
						const da = vnode.component.da;
						da && queuePostRenderEffect(da, suspense);
						return;
					}
					unmount(cached);
				});
			});
			return () => {
				pendingCacheKey = null;
				if (!slots.default) return current = null;
				const children = slots.default();
				const rawVNode = children[0];
				if (children.length > 1) {
					current = null;
					return children;
				} else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128)) {
					current = null;
					return rawVNode;
				}
				let vnode = getInnerChild(rawVNode);
				if (vnode.type === Comment) {
					current = null;
					return vnode;
				}
				const comp = vnode.type;
				const name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp);
				const { include, exclude, max } = props;
				if (include && (!name || !matches$1(include, name)) || exclude && name && matches$1(exclude, name)) {
					vnode.shapeFlag &= -257;
					current = vnode;
					return rawVNode;
				}
				const key = vnode.key == null ? comp : vnode.key;
				const cachedVNode = cache.get(key);
				if (vnode.el) {
					vnode = cloneVNode(vnode);
					if (rawVNode.shapeFlag & 128) rawVNode.ssContent = vnode;
				}
				pendingCacheKey = key;
				if (cachedVNode) {
					vnode.el = cachedVNode.el;
					vnode.component = cachedVNode.component;
					if (vnode.transition) setTransitionHooks(vnode, vnode.transition);
					vnode.shapeFlag |= 512;
					keys.delete(key);
					keys.add(key);
				} else {
					keys.add(key);
					if (max && keys.size > parseInt(max, 10)) pruneCacheEntry(keys.values().next().value);
				}
				vnode.shapeFlag |= 256;
				current = vnode;
				return isSuspense(rawVNode.type) ? rawVNode : vnode;
			};
		}
	};
	function matches$1(pattern, name) {
		if (isArray(pattern)) return pattern.some((p) => matches$1(p, name));
		else if (isString(pattern)) return pattern.split(",").includes(name);
		else if (isRegExp(pattern)) {
			pattern.lastIndex = 0;
			return pattern.test(name);
		}
		return false;
	}
	function onActivated(hook, target) {
		registerKeepAliveHook(hook, "a", target);
	}
	function onDeactivated(hook, target) {
		registerKeepAliveHook(hook, "da", target);
	}
	function registerKeepAliveHook(hook, type, target = currentInstance) {
		const wrappedHook = hook.__wdc || (hook.__wdc = () => {
			let current = target;
			while (current) {
				if (current.isDeactivated) return;
				current = current.parent;
			}
			return hook();
		});
		injectHook(type, wrappedHook, target);
		if (target) {
			let current = target.parent;
			while (current && current.parent) {
				if (isKeepAlive(current.parent.vnode)) injectToKeepAliveRoot(wrappedHook, type, target, current);
				current = current.parent;
			}
		}
	}
	function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
		const injected = injectHook(type, hook, keepAliveRoot, true);
		onUnmounted(() => {
			remove(keepAliveRoot[type], injected);
		}, target);
	}
	function resetShapeFlag(vnode) {
		vnode.shapeFlag &= -257;
		vnode.shapeFlag &= -513;
	}
	function getInnerChild(vnode) {
		return vnode.shapeFlag & 128 ? vnode.ssContent : vnode;
	}
	function injectHook(type, hook, target = currentInstance, prepend = false) {
		if (target) {
			const hooks = target[type] || (target[type] = []);
			const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
				pauseTracking();
				const reset = setCurrentInstance(target);
				const res = callWithAsyncErrorHandling(hook, target, type, args);
				reset();
				resetTracking();
				return res;
			});
			if (prepend) hooks.unshift(wrappedHook);
			else hooks.push(wrappedHook);
			return wrappedHook;
		}
	}
	var createHook = (lifecycle) => (hook, target = currentInstance) => {
		if (!isInSSRComponentSetup || lifecycle === "sp") injectHook(lifecycle, (...args) => hook(...args), target);
	};
	var onBeforeMount = createHook("bm");
	var onMounted = createHook("m");
	var onBeforeUpdate = createHook("bu");
	var onUpdated = createHook("u");
	var onBeforeUnmount = createHook("bum");
	var onUnmounted = createHook("um");
	var onServerPrefetch = createHook("sp");
	var onRenderTriggered = createHook("rtg");
	var onRenderTracked = createHook("rtc");
	function onErrorCaptured(hook, target = currentInstance) {
		injectHook("ec", hook, target);
	}
	var COMPONENTS = "components";
	var DIRECTIVES = "directives";
	function resolveComponent(name, maybeSelfReference) {
		return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
	}
	var NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
	function resolveDynamicComponent(component) {
		if (isString(component)) return resolveAsset(COMPONENTS, component, false) || component;
		else return component || NULL_DYNAMIC_COMPONENT;
	}
	function resolveDirective(name) {
		return resolveAsset(DIRECTIVES, name);
	}
	function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
		const instance = currentRenderingInstance || currentInstance;
		if (instance) {
			const Component = instance.type;
			if (type === COMPONENTS) {
				const selfName = getComponentName(Component, false);
				if (selfName && (selfName === name || selfName === camelize$1(name) || selfName === capitalize(camelize$1(name)))) return Component;
			}
			const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
			if (!res && maybeSelfReference) return Component;
			return res;
		}
	}
	function resolve(registry, name) {
		return registry && (registry[name] || registry[camelize$1(name)] || registry[capitalize(camelize$1(name))]);
	}
	function renderList(source, renderItem, cache, index) {
		let ret;
		const cached = cache && cache[index];
		const sourceIsArray = isArray(source);
		if (sourceIsArray || isString(source)) {
			const sourceIsReactiveArray = sourceIsArray && /* @__PURE__ */ isReactive(source);
			let needsWrap = false;
			let isReadonlySource = false;
			if (sourceIsReactiveArray) {
				needsWrap = !/* @__PURE__ */ isShallow(source);
				isReadonlySource = /* @__PURE__ */ isReadonly(source);
				source = shallowReadArray(source);
			}
			ret = new Array(source.length);
			for (let i = 0, l = source.length; i < l; i++) ret[i] = renderItem(needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i], i, void 0, cached && cached[i]);
		} else if (typeof source === "number") {
			ret = new Array(source);
			for (let i = 0; i < source; i++) ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
		} else if (isObject(source)) {
			if (source[Symbol.iterator]) ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
			else {
				const keys = Object.keys(source);
				ret = new Array(keys.length);
				for (let i = 0, l = keys.length; i < l; i++) {
					const key = keys[i];
					ret[i] = renderItem(source[key], key, i, cached && cached[i]);
				}
			}
		} else ret = [];
		if (cache) cache[index] = ret;
		return ret;
	}
	function createSlots(slots, dynamicSlots) {
		for (let i = 0; i < dynamicSlots.length; i++) {
			const slot = dynamicSlots[i];
			if (isArray(slot)) for (let j = 0; j < slot.length; j++) slots[slot[j].name] = slot[j].fn;
			else if (slot) slots[slot.name] = slot.key ? (...args) => {
				const res = slot.fn(...args);
				if (res) res.key = slot.key;
				return res;
			} : slot.fn;
		}
		return slots;
	}
	function renderSlot(slots, name, props, fallback, noSlotted, branchKey) {
		if (props == null) props = {};
		if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {
			const slotProps = branchKey != null && props.key == null ? extend$2({}, props, { key: branchKey }) : props;
			const hasProps = Object.keys(slotProps).length > 0;
			if (name !== "default") slotProps.name = name;
			return openBlock(), createBlock(Fragment, null, [createVNode("slot", slotProps, fallback && fallback())], hasProps ? -2 : 64);
		}
		let slot = slots[name];
		if (slot && slot._c) slot._d = false;
		const prevStackSize = blockStack.length;
		openBlock();
		let rendered;
		try {
			const validSlotContent = slot && ensureValidVNode(slot(props));
			const slotKey = props.key || branchKey || validSlotContent && validSlotContent.key;
			rendered = createBlock(Fragment, { key: (slotKey && !isSymbol(slotKey) ? slotKey : `_${name}`) + (!validSlotContent && fallback ? "_fb" : "") }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
		} catch (err) {
			for (let i = blockStack.length; i > prevStackSize; i--) closeBlock();
			throw err;
		} finally {
			if (slot && slot._c) slot._d = true;
		}
		if (!noSlotted && rendered.scopeId) rendered.slotScopeIds = [rendered.scopeId + "-s"];
		return rendered;
	}
	function ensureValidVNode(vnodes) {
		return vnodes.some((child) => {
			if (!isVNode(child)) return true;
			if (child.type === Comment) return false;
			if (child.type === Fragment && !ensureValidVNode(child.children)) return false;
			return true;
		}) ? vnodes : null;
	}
	function toHandlers(obj, preserveCaseIfNecessary) {
		const ret = {};
		for (const key in obj) ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : toHandlerKey(key)] = obj[key];
		return ret;
	}
	var getPublicInstance = (i) => {
		if (!i) return null;
		if (isStatefulComponent(i)) return getComponentPublicInstance(i);
		return getPublicInstance(i.parent);
	};
	var publicPropertiesMap = /* @__PURE__ */ extend$2(/* @__PURE__ */ Object.create(null), {
		$: (i) => i,
		$el: (i) => i.vnode.el,
		$data: (i) => i.data,
		$props: (i) => i.props,
		$attrs: (i) => i.attrs,
		$slots: (i) => i.slots,
		$refs: (i) => i.refs,
		$parent: (i) => getPublicInstance(i.parent),
		$root: (i) => getPublicInstance(i.root),
		$host: (i) => i.ce,
		$emit: (i) => i.emit,
		$options: (i) => resolveMergedOptions(i),
		$forceUpdate: (i) => i.f || (i.f = () => {
			queueJob(i.update);
		}),
		$nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
		$watch: (i) => instanceWatch.bind(i)
	});
	var hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
	var PublicInstanceProxyHandlers = {
		get({ _: instance }, key) {
			if (key === "__v_skip") return true;
			const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
			if (key[0] !== "$") {
				const n = accessCache[key];
				if (n !== void 0) switch (n) {
					case 1: return setupState[key];
					case 2: return data[key];
					case 4: return ctx[key];
					case 3: return props[key];
				}
				else if (hasSetupBinding(setupState, key)) {
					accessCache[key] = 1;
					return setupState[key];
				} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
					accessCache[key] = 2;
					return data[key];
				} else if (hasOwn(props, key)) {
					accessCache[key] = 3;
					return props[key];
				} else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
					accessCache[key] = 4;
					return ctx[key];
				} else if (shouldCacheAccess) accessCache[key] = 0;
			}
			const publicGetter = publicPropertiesMap[key];
			let cssModule, globalProperties;
			if (publicGetter) {
				if (key === "$attrs") track(instance.attrs, "get", "");
				return publicGetter(instance);
			} else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) return cssModule;
			else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
				accessCache[key] = 4;
				return ctx[key];
			} else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) return globalProperties[key];
		},
		set({ _: instance }, key, value) {
			const { data, setupState, ctx } = instance;
			if (hasSetupBinding(setupState, key)) {
				setupState[key] = value;
				return true;
			} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
				data[key] = value;
				return true;
			} else if (hasOwn(instance.props, key)) return false;
			if (key[0] === "$" && key.slice(1) in instance) return false;
			else ctx[key] = value;
			return true;
		},
		has({ _: { data, setupState, accessCache, ctx, appContext, props, type } }, key) {
			let cssModules;
			return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
		},
		defineProperty(target, key, descriptor) {
			if (descriptor.get != null) target._.accessCache[key] = 0;
			else if (hasOwn(descriptor, "value")) this.set(target, key, descriptor.value, null);
			return Reflect.defineProperty(target, key, descriptor);
		}
	};
	var RuntimeCompiledPublicInstanceProxyHandlers = /* @__PURE__ */ extend$2({}, PublicInstanceProxyHandlers, {
		get(target, key) {
			if (key === Symbol.unscopables) return;
			return PublicInstanceProxyHandlers.get(target, key, target);
		},
		has(_, key) {
			return key[0] !== "_" && !isGloballyAllowed(key);
		}
	});
	function defineProps() {
		return null;
	}
	function defineEmits() {
		return null;
	}
	function defineExpose(exposed) {}
	function defineOptions(options) {}
	function defineSlots() {
		return null;
	}
	function defineModel() {}
	function withDefaults(props, defaults) {
		return null;
	}
	function useSlots() {
		return getContext("useSlots").slots;
	}
	function useAttrs() {
		return getContext("useAttrs").attrs;
	}
	function getContext(calledFunctionName) {
		const i = getCurrentInstance();
		return i.setupContext || (i.setupContext = createSetupContext(i));
	}
	function normalizePropsOrEmits(props) {
		return isArray(props) ? props.reduce((normalized, p) => (normalized[p] = null, normalized), {}) : props;
	}
	function mergeDefaults(raw, defaults) {
		const props = normalizePropsOrEmits(raw);
		for (const key in defaults) {
			if (key.startsWith("__skip")) continue;
			let opt = props[key];
			if (opt) {
				if (isArray(opt) || isFunction(opt)) opt = props[key] = {
					type: opt,
					default: defaults[key]
				};
				else opt.default = defaults[key];
			} else if (opt === null) opt = props[key] = { default: defaults[key] };
			if (opt && defaults[`__skip_${key}`]) opt.skipFactory = true;
		}
		return props;
	}
	function mergeModels(a, b) {
		if (!a || !b) return a || b;
		if (isArray(a) && isArray(b)) return a.concat(b);
		return extend$2({}, normalizePropsOrEmits(a), normalizePropsOrEmits(b));
	}
	function createPropsRestProxy(props, excludedKeys) {
		const ret = {};
		for (const key in props) if (!excludedKeys.includes(key)) Object.defineProperty(ret, key, {
			enumerable: true,
			get: () => props[key]
		});
		return ret;
	}
	function withAsyncContext(getAwaitable) {
		const ctx = getCurrentInstance();
		const inSSRSetup = isInSSRComponentSetup;
		let awaitable = getAwaitable();
		unsetCurrentInstance();
		if (inSSRSetup) setInSSRSetupState(false);
		const restore = () => {
			setCurrentInstance(ctx);
			if (inSSRSetup) setInSSRSetupState(true);
		};
		const cleanup = () => {
			if (getCurrentInstance() !== ctx) ctx.scope.off();
			unsetCurrentInstance();
			if (inSSRSetup) setInSSRSetupState(false);
		};
		if (isPromise(awaitable)) awaitable = awaitable.catch((e) => {
			restore();
			Promise.resolve().then(() => Promise.resolve().then(cleanup));
			throw e;
		});
		return [awaitable, () => {
			restore();
			Promise.resolve().then(cleanup);
		}];
	}
	var shouldCacheAccess = true;
	function applyOptions(instance) {
		const options = resolveMergedOptions(instance);
		const publicThis = instance.proxy;
		const ctx = instance.ctx;
		shouldCacheAccess = false;
		if (options.beforeCreate) callHook$1(options.beforeCreate, instance, "bc");
		const { data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, created, beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeDestroy, beforeUnmount, destroyed, unmounted, render, renderTracked, renderTriggered, errorCaptured, serverPrefetch, expose, inheritAttrs, components, directives, filters } = options;
		const checkDuplicateProperties = null;
		if (injectOptions) resolveInjections(injectOptions, ctx, checkDuplicateProperties);
		if (methods) for (const key in methods) {
			const methodHandler = methods[key];
			if (isFunction(methodHandler)) ctx[key] = methodHandler.bind(publicThis);
		}
		if (dataOptions) {
			const data = dataOptions.call(publicThis, publicThis);
			if (!isObject(data)) {} else instance.data = /* @__PURE__ */ reactive(data);
		}
		shouldCacheAccess = true;
		if (computedOptions) for (const key in computedOptions) {
			const opt = computedOptions[key];
			const c = computed({
				get: isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP,
				set: !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP
			});
			Object.defineProperty(ctx, key, {
				enumerable: true,
				configurable: true,
				get: () => c.value,
				set: (v) => c.value = v
			});
		}
		if (watchOptions) for (const key in watchOptions) createWatcher(watchOptions[key], ctx, publicThis, key);
		if (provideOptions) {
			const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
			Reflect.ownKeys(provides).forEach((key) => {
				provide(key, provides[key]);
			});
		}
		if (created) callHook$1(created, instance, "c");
		function registerLifecycleHook(register, hook) {
			if (isArray(hook)) hook.forEach((_hook) => register(_hook.bind(publicThis)));
			else if (hook) register(hook.bind(publicThis));
		}
		registerLifecycleHook(onBeforeMount, beforeMount);
		registerLifecycleHook(onMounted, mounted);
		registerLifecycleHook(onBeforeUpdate, beforeUpdate);
		registerLifecycleHook(onUpdated, updated);
		registerLifecycleHook(onActivated, activated);
		registerLifecycleHook(onDeactivated, deactivated);
		registerLifecycleHook(onErrorCaptured, errorCaptured);
		registerLifecycleHook(onRenderTracked, renderTracked);
		registerLifecycleHook(onRenderTriggered, renderTriggered);
		registerLifecycleHook(onBeforeUnmount, beforeUnmount);
		registerLifecycleHook(onUnmounted, unmounted);
		registerLifecycleHook(onServerPrefetch, serverPrefetch);
		if (isArray(expose)) {
			if (expose.length) {
				const exposed = instance.exposed || (instance.exposed = {});
				expose.forEach((key) => {
					Object.defineProperty(exposed, key, {
						get: () => publicThis[key],
						set: (val) => publicThis[key] = val,
						enumerable: true
					});
				});
			} else if (!instance.exposed) instance.exposed = {};
		}
		if (render && instance.render === NOOP) instance.render = render;
		if (inheritAttrs != null) instance.inheritAttrs = inheritAttrs;
		if (components) instance.components = components;
		if (directives) instance.directives = directives;
		if (serverPrefetch) markAsyncBoundary(instance);
	}
	function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
		if (isArray(injectOptions)) injectOptions = normalizeInject(injectOptions);
		for (const key in injectOptions) {
			const opt = injectOptions[key];
			let injected;
			if (isObject(opt)) {
				if ("default" in opt) injected = inject(opt.from || key, opt.default, true);
				else injected = inject(opt.from || key);
			} else injected = inject(opt);
			if (/* @__PURE__ */ isRef(injected)) Object.defineProperty(ctx, key, {
				enumerable: true,
				configurable: true,
				get: () => injected.value,
				set: (v) => injected.value = v
			});
			else ctx[key] = injected;
		}
	}
	function callHook$1(hook, instance, type) {
		callWithAsyncErrorHandling(isArray(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
	}
	function createWatcher(raw, ctx, publicThis, key) {
		let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
		if (isString(raw)) {
			const handler = ctx[raw];
			if (isFunction(handler)) watch(getter, handler);
		} else if (isFunction(raw)) watch(getter, raw.bind(publicThis));
		else if (isObject(raw)) {
			if (isArray(raw)) raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
			else {
				const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
				if (isFunction(handler)) watch(getter, handler, raw);
			}
		}
	}
	function resolveMergedOptions(instance) {
		const base = instance.type;
		const { mixins, extends: extendsOptions } = base;
		const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
		const cached = cache.get(base);
		let resolved;
		if (cached) resolved = cached;
		else if (!globalMixins.length && !mixins && !extendsOptions) resolved = base;
		else {
			resolved = {};
			if (globalMixins.length) globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
			mergeOptions(resolved, base, optionMergeStrategies);
		}
		if (isObject(base)) cache.set(base, resolved);
		return resolved;
	}
	function mergeOptions(to, from, strats, asMixin = false) {
		const { mixins, extends: extendsOptions } = from;
		if (extendsOptions) mergeOptions(to, extendsOptions, strats, true);
		if (mixins) mixins.forEach((m) => mergeOptions(to, m, strats, true));
		for (const key in from) if (asMixin && key === "expose") {} else {
			const strat = internalOptionMergeStrats[key] || strats && strats[key];
			to[key] = strat ? strat(to[key], from[key]) : from[key];
		}
		return to;
	}
	var internalOptionMergeStrats = {
		data: mergeDataFn,
		props: mergeEmitsOrPropsOptions,
		emits: mergeEmitsOrPropsOptions,
		methods: mergeObjectOptions,
		computed: mergeObjectOptions,
		beforeCreate: mergeAsArray,
		created: mergeAsArray,
		beforeMount: mergeAsArray,
		mounted: mergeAsArray,
		beforeUpdate: mergeAsArray,
		updated: mergeAsArray,
		beforeDestroy: mergeAsArray,
		beforeUnmount: mergeAsArray,
		destroyed: mergeAsArray,
		unmounted: mergeAsArray,
		activated: mergeAsArray,
		deactivated: mergeAsArray,
		errorCaptured: mergeAsArray,
		serverPrefetch: mergeAsArray,
		components: mergeObjectOptions,
		directives: mergeObjectOptions,
		watch: mergeWatchOptions,
		provide: mergeDataFn,
		inject: mergeInject
	};
	function mergeDataFn(to, from) {
		if (!from) return to;
		if (!to) return from;
		return function mergedDataFn() {
			return extend$2(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
		};
	}
	function mergeInject(to, from) {
		return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
	}
	function normalizeInject(raw) {
		if (isArray(raw)) {
			const res = {};
			for (let i = 0; i < raw.length; i++) res[raw[i]] = raw[i];
			return res;
		}
		return raw;
	}
	function mergeAsArray(to, from) {
		return to ? [...new Set([].concat(to, from))] : from;
	}
	function mergeObjectOptions(to, from) {
		return to ? extend$2(/* @__PURE__ */ Object.create(null), to, from) : from;
	}
	function mergeEmitsOrPropsOptions(to, from) {
		if (to) {
			if (isArray(to) && isArray(from)) return [.../* @__PURE__ */ new Set([...to, ...from])];
			return extend$2(/* @__PURE__ */ Object.create(null), normalizePropsOrEmits(to), normalizePropsOrEmits(from != null ? from : {}));
		} else return from;
	}
	function mergeWatchOptions(to, from) {
		if (!to) return from;
		if (!from) return to;
		const merged = extend$2(/* @__PURE__ */ Object.create(null), to);
		for (const key in from) merged[key] = mergeAsArray(to[key], from[key]);
		return merged;
	}
	function createAppContext() {
		return {
			app: null,
			config: {
				isNativeTag: NO,
				performance: false,
				globalProperties: {},
				optionMergeStrategies: {},
				errorHandler: void 0,
				warnHandler: void 0,
				compilerOptions: {}
			},
			mixins: [],
			components: {},
			directives: {},
			provides: /* @__PURE__ */ Object.create(null),
			optionsCache: /* @__PURE__ */ new WeakMap(),
			propsCache: /* @__PURE__ */ new WeakMap(),
			emitsCache: /* @__PURE__ */ new WeakMap()
		};
	}
	var uid$1 = 0;
	function createAppAPI(render, hydrate) {
		return function createApp(rootComponent, rootProps = null) {
			if (!isFunction(rootComponent)) rootComponent = extend$2({}, rootComponent);
			if (rootProps != null && !isObject(rootProps)) rootProps = null;
			const context = createAppContext();
			const installedPlugins = /* @__PURE__ */ new WeakSet();
			const pluginCleanupFns = [];
			let isMounted = false;
			const app = context.app = {
				_uid: uid$1++,
				_component: rootComponent,
				_props: rootProps,
				_container: null,
				_context: context,
				_instance: null,
				version: version$1,
				get config() {
					return context.config;
				},
				set config(v) {},
				use(plugin, ...options) {
					if (installedPlugins.has(plugin)) {} else if (plugin && isFunction(plugin.install)) {
						installedPlugins.add(plugin);
						plugin.install(app, ...options);
					} else if (isFunction(plugin)) {
						installedPlugins.add(plugin);
						plugin(app, ...options);
					}
					return app;
				},
				mixin(mixin) {
					if (!context.mixins.includes(mixin)) context.mixins.push(mixin);
					return app;
				},
				component(name, component) {
					if (!component) return context.components[name];
					context.components[name] = component;
					return app;
				},
				directive(name, directive) {
					if (!directive) return context.directives[name];
					context.directives[name] = directive;
					return app;
				},
				mount(rootContainer, isHydrate, namespace) {
					if (!isMounted) {
						const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
						vnode.appContext = context;
						if (namespace === true) namespace = "svg";
						else if (namespace === false) namespace = void 0;
						if (isHydrate && hydrate) hydrate(vnode, rootContainer);
						else render(vnode, rootContainer, namespace);
						isMounted = true;
						app._container = rootContainer;
						rootContainer.__vue_app__ = app;
						app._instance = vnode.component;
						devtoolsInitApp(app, version$1);
						return getComponentPublicInstance(vnode.component);
					}
				},
				onUnmount(cleanupFn) {
					pluginCleanupFns.push(cleanupFn);
				},
				unmount() {
					if (isMounted) {
						callWithAsyncErrorHandling(pluginCleanupFns, app._instance, 16);
						render(null, app._container);
						app._instance = null;
						devtoolsUnmountApp(app);
						delete app._container.__vue_app__;
					}
				},
				provide(key, value) {
					context.provides[key] = value;
					return app;
				},
				runWithContext(fn) {
					const lastApp = currentApp;
					currentApp = app;
					try {
						return fn();
					} finally {
						currentApp = lastApp;
					}
				}
			};
			return app;
		};
	}
	var currentApp = null;
	function useModel(props, name, options = EMPTY_OBJ) {
		const i = getCurrentInstance();
		const camelizedName = camelize$1(name);
		const hyphenatedName = hyphenate(name);
		const modifiers = getModelModifiers(props, camelizedName);
		const res = customRef((track, trigger) => {
			let localValue;
			let prevSetValue = EMPTY_OBJ;
			let prevEmittedValue;
			watchSyncEffect(() => {
				const propValue = props[camelizedName];
				if (hasChanged(localValue, propValue)) {
					localValue = propValue;
					trigger();
				}
			});
			return {
				get() {
					track();
					return options.get ? options.get(localValue) : localValue;
				},
				set(value) {
					const emittedValue = options.set ? options.set(value) : value;
					if (!hasChanged(emittedValue, localValue) && !(prevSetValue !== EMPTY_OBJ && hasChanged(value, prevSetValue))) return;
					const rawProps = i.vnode.props;
					const hasVModel = !!(rawProps && (name in rawProps || camelizedName in rawProps || hyphenatedName in rawProps) && (`onUpdate:${name}` in rawProps || `onUpdate:${camelizedName}` in rawProps || `onUpdate:${hyphenatedName}` in rawProps));
					if (!hasVModel) {
						localValue = value;
						trigger();
					}
					i.emit(`update:${name}`, emittedValue);
					if (hasChanged(value, prevSetValue) && (hasChanged(value, emittedValue) && !hasChanged(emittedValue, prevEmittedValue) || hasVModel && prevSetValue !== EMPTY_OBJ && !hasChanged(emittedValue, localValue))) trigger();
					prevSetValue = value;
					prevEmittedValue = emittedValue;
				}
			};
		});
		res[Symbol.iterator] = () => {
			let i2 = 0;
			return { next() {
				if (i2 < 2) return {
					value: i2++ ? modifiers || EMPTY_OBJ : res,
					done: false
				};
				else return { done: true };
			} };
		};
		return res;
	}
	var getModelModifiers = (props, modelName) => {
		return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize$1(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
	};
	function emit(instance, event, ...rawArgs) {
		if (instance.isUnmounted) return;
		const props = instance.vnode.props || EMPTY_OBJ;
		let args = rawArgs;
		const isModelListener = event.startsWith("update:");
		const modifiers = isModelListener && getModelModifiers(props, event.slice(7));
		if (modifiers) {
			if (modifiers.trim) args = rawArgs.map((a) => isString(a) ? a.trim() : a);
			if (modifiers.number) args = args.map(looseToNumber);
		}
		devtoolsComponentEmit(instance, event, args);
		let handlerName;
		let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize$1(event))];
		if (!handler && isModelListener) handler = props[handlerName = toHandlerKey(hyphenate(event))];
		if (handler) callWithAsyncErrorHandling(handler, instance, 6, args);
		const onceHandler = props[handlerName + `Once`];
		if (onceHandler) {
			if (!instance.emitted) instance.emitted = {};
			else if (instance.emitted[handlerName]) return;
			instance.emitted[handlerName] = true;
			callWithAsyncErrorHandling(onceHandler, instance, 6, args);
		}
	}
	var mixinEmitsCache = /* @__PURE__ */ new WeakMap();
	function normalizeEmitsOptions(comp, appContext, asMixin = false) {
		const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
		const cached = cache.get(comp);
		if (cached !== void 0) return cached;
		const raw = comp.emits;
		let normalized = {};
		let hasExtends = false;
		if (!isFunction(comp)) {
			const extendEmits = (raw2) => {
				const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
				if (normalizedFromExtend) {
					hasExtends = true;
					extend$2(normalized, normalizedFromExtend);
				}
			};
			if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendEmits);
			if (comp.extends) extendEmits(comp.extends);
			if (comp.mixins) comp.mixins.forEach(extendEmits);
		}
		if (!raw && !hasExtends) {
			if (isObject(comp)) cache.set(comp, null);
			return null;
		}
		if (isArray(raw)) raw.forEach((key) => normalized[key] = null);
		else extend$2(normalized, raw);
		if (isObject(comp)) cache.set(comp, normalized);
		return normalized;
	}
	function isEmitListener(options, key) {
		if (!options || !isOn(key)) return false;
		key = key.slice(2);
		key = key === "Once" ? key : key.replace(/Once$/, "");
		return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
	}
	function renderComponentRoot(instance) {
		const { type: Component, vnode, proxy, withProxy, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, props, data, setupState, ctx, inheritAttrs } = instance;
		const prev = setCurrentRenderingInstance(instance);
		let result;
		let fallthroughAttrs;
		try {
			if (vnode.shapeFlag & 4) {
				const proxyToUse = withProxy || proxy;
				const thisProxy = proxyToUse;
				result = normalizeVNode(render.call(thisProxy, proxyToUse, renderCache, props, setupState, data, ctx));
				fallthroughAttrs = attrs;
			} else {
				const render2 = Component;
				result = normalizeVNode(render2.length > 1 ? render2(props, {
					attrs,
					slots,
					emit
				}) : render2(props, null));
				fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
			}
		} catch (err) {
			blockStack.length = 0;
			handleError(err, instance, 1);
			result = createVNode(Comment);
		}
		let root = result;
		if (fallthroughAttrs && inheritAttrs !== false) {
			const keys = Object.keys(fallthroughAttrs);
			const { shapeFlag } = root;
			if (keys.length) {
				if (shapeFlag & 7) {
					if (propsOptions && keys.some(isModelListener)) fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
					root = cloneVNode(root, fallthroughAttrs, false, true);
				}
			}
		}
		if (vnode.dirs) {
			root = cloneVNode(root, null, false, true);
			root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
		}
		if (vnode.transition) setTransitionHooks(isTeleport(root.type) ? getInnerChild$1(root) || root : root, vnode.transition);
		result = root;
		setCurrentRenderingInstance(prev);
		return result;
	}
	function filterSingleRoot(children, recurse = true) {
		let singleRoot;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (isVNode(child)) {
				if (child.type !== Comment || child.children === "v-if") {
					if (singleRoot) return;
					else singleRoot = child;
				}
			} else return;
		}
		return singleRoot;
	}
	var getFunctionalFallthrough = (attrs) => {
		let res;
		for (const key in attrs) if (key === "class" || key === "style" || isOn(key)) (res || (res = {}))[key] = attrs[key];
		return res;
	};
	var filterModelListeners = (attrs, props) => {
		const res = {};
		for (const key in attrs) if (!isModelListener(key) || !(key.slice(9) in props)) res[key] = attrs[key];
		return res;
	};
	function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
		const { props: prevProps, children: prevChildren, component } = prevVNode;
		const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
		const emits = component.emitsOptions;
		if (nextVNode.dirs || nextVNode.transition) return true;
		if (optimized && patchFlag >= 0) {
			if (patchFlag & 1024) return true;
			if (patchFlag & 16) {
				if (!prevProps) return !!nextProps;
				return hasPropsChanged(prevProps, nextProps, emits);
			} else if (patchFlag & 8) {
				const dynamicProps = nextVNode.dynamicProps;
				for (let i = 0; i < dynamicProps.length; i++) {
					const key = dynamicProps[i];
					if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) return true;
				}
			}
		} else {
			if (prevChildren || nextChildren) {
				if (!nextChildren || !nextChildren.$stable) return true;
			}
			if (prevProps === nextProps) return false;
			if (!prevProps) return !!nextProps;
			if (!nextProps) return true;
			return hasPropsChanged(prevProps, nextProps, emits);
		}
		return false;
	}
	function hasPropsChanged(prevProps, nextProps, emitsOptions) {
		const nextKeys = Object.keys(nextProps);
		if (nextKeys.length !== Object.keys(prevProps).length) return true;
		for (let i = 0; i < nextKeys.length; i++) {
			const key = nextKeys[i];
			if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) return true;
		}
		return false;
	}
	function hasPropValueChanged(nextProps, prevProps, key) {
		const nextProp = nextProps[key];
		const prevProp = prevProps[key];
		if (key === "style" && isObject(nextProp) && isObject(prevProp)) return !looseEqual(nextProp, prevProp);
		return nextProp !== prevProp;
	}
	function updateHOCHostEl({ vnode, parent, suspense }, el) {
		while (parent) {
			const root = parent.subTree;
			if (root.suspense && root.suspense.activeBranch === vnode) {
				root.suspense.vnode.el = root.el = el;
				vnode = root;
			}
			if (root === vnode) {
				(vnode = parent.vnode).el = el;
				parent = parent.parent;
			} else break;
		}
		if (suspense && suspense.activeBranch === vnode) suspense.vnode.el = el;
	}
	var internalObjectProto = {};
	var createInternalObject = () => Object.create(internalObjectProto);
	var isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
	function initProps(instance, rawProps, isStateful, isSSR = false) {
		const props = {};
		const attrs = createInternalObject();
		instance.propsDefaults = /* @__PURE__ */ Object.create(null);
		setFullProps(instance, rawProps, props, attrs);
		for (const key in instance.propsOptions[0]) if (!(key in props)) props[key] = void 0;
		if (isStateful) instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
		else if (!instance.type.props) instance.props = attrs;
		else instance.props = props;
		instance.attrs = attrs;
	}
	function updateProps(instance, rawProps, rawPrevProps, optimized) {
		const { props, attrs, vnode: { patchFlag } } = instance;
		const rawCurrentProps = /* @__PURE__ */ toRaw(props);
		const [options] = instance.propsOptions;
		let hasAttrsChanged = false;
		if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
			if (patchFlag & 8) {
				const propsToUpdate = instance.vnode.dynamicProps;
				for (let i = 0; i < propsToUpdate.length; i++) {
					let key = propsToUpdate[i];
					if (isEmitListener(instance.emitsOptions, key)) continue;
					const value = rawProps[key];
					if (options) {
						if (hasOwn(attrs, key)) {
							if (value !== attrs[key]) {
								attrs[key] = value;
								hasAttrsChanged = true;
							}
						} else {
							const camelizedKey = camelize$1(key);
							props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
						}
					} else if (value !== attrs[key]) {
						attrs[key] = value;
						hasAttrsChanged = true;
					}
				}
			}
		} else {
			if (setFullProps(instance, rawProps, props, attrs)) hasAttrsChanged = true;
			let kebabKey;
			for (const key in rawCurrentProps) if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
				if (options) {
					if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
				} else delete props[key];
			}
			if (attrs !== rawCurrentProps) {
				for (const key in attrs) if (!rawProps || !hasOwn(rawProps, key) && true) {
					delete attrs[key];
					hasAttrsChanged = true;
				}
			}
		}
		if (hasAttrsChanged) trigger(instance.attrs, "set", "");
	}
	function setFullProps(instance, rawProps, props, attrs) {
		const [options, needCastKeys] = instance.propsOptions;
		let hasAttrsChanged = false;
		let rawCastValues;
		if (rawProps) for (let key in rawProps) {
			if (isReservedProp(key)) continue;
			const value = rawProps[key];
			let camelKey;
			if (options && hasOwn(options, camelKey = camelize$1(key))) {
				if (!needCastKeys || !needCastKeys.includes(camelKey)) props[camelKey] = value;
				else (rawCastValues || (rawCastValues = {}))[camelKey] = value;
			} else if (!isEmitListener(instance.emitsOptions, key)) {
				if (!(key in attrs) || value !== attrs[key]) {
					attrs[key] = value;
					hasAttrsChanged = true;
				}
			}
		}
		if (needCastKeys) {
			const rawCurrentProps = /* @__PURE__ */ toRaw(props);
			const castValues = rawCastValues || EMPTY_OBJ;
			for (let i = 0; i < needCastKeys.length; i++) {
				const key = needCastKeys[i];
				props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
			}
		}
		return hasAttrsChanged;
	}
	function resolvePropValue(options, props, key, value, instance, isAbsent) {
		const opt = options[key];
		if (opt != null) {
			const hasDefault = hasOwn(opt, "default");
			if (hasDefault && value === void 0) {
				const defaultValue = opt.default;
				if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
					const { propsDefaults } = instance;
					if (key in propsDefaults) value = propsDefaults[key];
					else {
						const reset = setCurrentInstance(instance);
						value = propsDefaults[key] = defaultValue.call(null, props);
						reset();
					}
				} else value = defaultValue;
				if (instance.ce) instance.ce._setProp(key, value);
			}
			if (opt[0]) {
				if (isAbsent && !hasDefault) value = false;
				else if (opt[1] && (value === "" || value === hyphenate(key))) value = true;
			}
		}
		return value;
	}
	var mixinPropsCache = /* @__PURE__ */ new WeakMap();
	function normalizePropsOptions(comp, appContext, asMixin = false) {
		const cache = asMixin ? mixinPropsCache : appContext.propsCache;
		const cached = cache.get(comp);
		if (cached) return cached;
		const raw = comp.props;
		const normalized = {};
		const needCastKeys = [];
		let hasExtends = false;
		if (!isFunction(comp)) {
			const extendProps = (raw2) => {
				hasExtends = true;
				const [props, keys] = normalizePropsOptions(raw2, appContext, true);
				extend$2(normalized, props);
				if (keys) needCastKeys.push(...keys);
			};
			if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendProps);
			if (comp.extends) extendProps(comp.extends);
			if (comp.mixins) comp.mixins.forEach(extendProps);
		}
		if (!raw && !hasExtends) {
			if (isObject(comp)) cache.set(comp, EMPTY_ARR);
			return EMPTY_ARR;
		}
		if (isArray(raw)) for (let i = 0; i < raw.length; i++) {
			const normalizedKey = camelize$1(raw[i]);
			if (validatePropName(normalizedKey)) normalized[normalizedKey] = EMPTY_OBJ;
		}
		else if (raw) for (const key in raw) {
			const normalizedKey = camelize$1(key);
			if (validatePropName(normalizedKey)) {
				const opt = raw[key];
				const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend$2({}, opt);
				const propType = prop.type;
				let shouldCast = false;
				let shouldCastTrue = true;
				if (isArray(propType)) for (let index = 0; index < propType.length; ++index) {
					const type = propType[index];
					const typeName = isFunction(type) && type.name;
					if (typeName === "Boolean") {
						shouldCast = true;
						break;
					} else if (typeName === "String") shouldCastTrue = false;
				}
				else shouldCast = isFunction(propType) && propType.name === "Boolean";
				prop[0] = shouldCast;
				prop[1] = shouldCastTrue;
				if (shouldCast || hasOwn(prop, "default")) needCastKeys.push(normalizedKey);
			}
		}
		const res = [normalized, needCastKeys];
		if (isObject(comp)) cache.set(comp, res);
		return res;
	}
	function validatePropName(key) {
		if (key[0] !== "$" && !isReservedProp(key)) return true;
		return false;
	}
	var isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
	var normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
	var normalizeSlot = (key, rawSlot, ctx) => {
		if (rawSlot._n) return rawSlot;
		const normalized = withCtx((...args) => {
			return normalizeSlotValue(rawSlot(...args));
		}, ctx);
		normalized._c = false;
		return normalized;
	};
	var normalizeObjectSlots = (rawSlots, slots, instance) => {
		const ctx = rawSlots._ctx;
		for (const key in rawSlots) {
			if (isInternalKey(key)) continue;
			const value = rawSlots[key];
			if (isFunction(value)) slots[key] = normalizeSlot(key, value, ctx);
			else if (value != null) {
				const normalized = normalizeSlotValue(value);
				slots[key] = () => normalized;
			}
		}
	};
	var normalizeVNodeSlots = (instance, children) => {
		const normalized = normalizeSlotValue(children);
		instance.slots.default = () => normalized;
	};
	var assignSlots = (slots, children, optimized) => {
		for (const key in children) if (optimized || !isInternalKey(key)) slots[key] = children[key];
	};
	var initSlots = (instance, children, optimized) => {
		const slots = instance.slots = createInternalObject();
		if (instance.vnode.shapeFlag & 32) {
			const type = children._;
			if (type) {
				assignSlots(slots, children, optimized);
				if (optimized) def(slots, "_", type, true);
			} else normalizeObjectSlots(children, slots);
		} else if (children) normalizeVNodeSlots(instance, children);
	};
	var updateSlots = (instance, children, optimized) => {
		const { vnode, slots } = instance;
		let needDeletionCheck = true;
		let deletionComparisonTarget = EMPTY_OBJ;
		if (vnode.shapeFlag & 32) {
			const type = children._;
			if (type) {
				if (optimized && type === 1) needDeletionCheck = false;
				else assignSlots(slots, children, optimized);
			} else {
				needDeletionCheck = !children.$stable;
				normalizeObjectSlots(children, slots);
			}
			deletionComparisonTarget = children;
		} else if (children) {
			normalizeVNodeSlots(instance, children);
			deletionComparisonTarget = { default: 1 };
		}
		if (needDeletionCheck) {
			for (const key in slots) if (!isInternalKey(key) && deletionComparisonTarget[key] == null) delete slots[key];
		}
	};
	var queuePostRenderEffect = queueEffectWithSuspense;
	function createRenderer(options) {
		return baseCreateRenderer(options);
	}
	function createHydrationRenderer(options) {
		return baseCreateRenderer(options, createHydrationFunctions);
	}
	function baseCreateRenderer(options, createHydrationFns) {
		const target = getGlobalThis();
		target.__VUE__ = true;
		setDevtoolsHook$1(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
		const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
		const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
			if (n1 === n2) return;
			if (n1 && !isSameVNodeType(n1, n2)) {
				anchor = getNextHostNode(n1);
				unmount(n1, parentComponent, parentSuspense, true);
				n1 = null;
			}
			if (n2.patchFlag === -2) {
				optimized = false;
				n2.dynamicChildren = null;
			}
			const { type, ref, shapeFlag } = n2;
			switch (type) {
				case Text:
					processText(n1, n2, container, anchor);
					break;
				case Comment:
					processCommentNode(n1, n2, container, anchor);
					break;
				case Static:
					if (n1 == null) mountStaticNode(n2, container, anchor, namespace);
					break;
				case Fragment:
					processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					break;
				default: if (shapeFlag & 1) processElement(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else if (shapeFlag & 6) processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else if (shapeFlag & 64) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
				else if (shapeFlag & 128) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
			}
			if (ref != null && parentComponent) setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
			else if (ref == null && n1 && n1.ref != null) setRef(n1.ref, null, parentSuspense, n1, true);
		};
		const processText = (n1, n2, container, anchor) => {
			if (n1 == null) hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
			else {
				const el = n2.el = n1.el;
				if (n2.children !== n1.children) hostSetText(el, n2.children);
			}
		};
		const processCommentNode = (n1, n2, container, anchor) => {
			if (n1 == null) hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
			else n2.el = n1.el;
		};
		const mountStaticNode = (n2, container, anchor, namespace) => {
			[n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, namespace, n2.el, n2.anchor);
		};
		const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
			let next;
			while (el && el !== anchor) {
				next = hostNextSibling(el);
				hostInsert(el, container, nextSibling);
				el = next;
			}
			hostInsert(anchor, container, nextSibling);
		};
		const removeStaticNode = ({ el, anchor }) => {
			let next;
			while (el && el !== anchor) {
				next = hostNextSibling(el);
				hostRemove(el);
				el = next;
			}
			hostRemove(anchor);
		};
		const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			if (n2.type === "svg") namespace = "svg";
			else if (n2.type === "math") namespace = "mathml";
			if (n1 == null) mountElement(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else {
				const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
				try {
					if (customElement) customElement._beginPatch();
					patchElement(n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				} finally {
					if (customElement) customElement._endPatch();
				}
			}
		};
		const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			let el;
			let vnodeHook;
			const { props, shapeFlag, transition, dirs } = vnode;
			el = vnode.el = hostCreateElement(vnode.type, namespace, props && props.is, props);
			if (shapeFlag & 8) hostSetElementText(el, vnode.children);
			else if (shapeFlag & 16) mountChildren(vnode.children, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(vnode, namespace), slotScopeIds, optimized);
			if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "created");
			setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
			if (props) {
				for (const key in props) if (key !== "value" && !isReservedProp(key)) hostPatchProp(el, key, null, props[key], namespace, parentComponent);
				if ("value" in props) hostPatchProp(el, "value", null, props.value, namespace);
				if (vnodeHook = props.onVnodeBeforeMount) invokeVNodeHook(vnodeHook, parentComponent, vnode);
			}
			def(el, "__vnode", vnode, true);
			def(el, "__vueParentComponent", parentComponent, true);
			if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
			const needCallTransitionHooks = needTransition(parentSuspense, transition);
			if (needCallTransitionHooks) transition.beforeEnter(el);
			hostInsert(el, container, anchor);
			if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) queuePostRenderEffect(() => {
				try {
					vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
					needCallTransitionHooks && transition.enter(el);
					dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
				} finally {}
			}, parentSuspense);
		};
		const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
			if (scopeId) hostSetScopeId(el, scopeId);
			if (slotScopeIds) for (let i = 0; i < slotScopeIds.length; i++) hostSetScopeId(el, slotScopeIds[i]);
			if (parentComponent) {
				let subTree = parentComponent.subTree;
				if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
					const parentVNode = parentComponent.vnode;
					setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
				}
			}
		};
		const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
			for (let i = start; i < children.length; i++) {
				const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
				patch(null, child, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			}
		};
		const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			const el = n2.el = n1.el;
			el.__vnode = n2;
			let { patchFlag, dynamicChildren, dirs } = n2;
			patchFlag |= n1.patchFlag & 16;
			const oldProps = n1.props || EMPTY_OBJ;
			const newProps = n2.props || EMPTY_OBJ;
			let vnodeHook;
			parentComponent && toggleRecurse(parentComponent, false);
			if (vnodeHook = newProps.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
			if (dirs) invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
			parentComponent && toggleRecurse(parentComponent, true);
			if (dynamicChildren && (!n1.dynamicChildren || n1.dynamicChildren.length !== dynamicChildren.length)) {
				patchFlag = 0;
				optimized = false;
				dynamicChildren = null;
			}
			if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) hostSetElementText(el, "");
			if (dynamicChildren) patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds);
			else if (!optimized) patchChildren(n1, n2, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds, false);
			if (patchFlag > 0) {
				if (patchFlag & 16) patchProps(el, oldProps, newProps, parentComponent, namespace);
				else {
					if (patchFlag & 2) {
						if (oldProps.class !== newProps.class) hostPatchProp(el, "class", null, newProps.class, namespace);
					}
					if (patchFlag & 4) hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
					if (patchFlag & 8) {
						const propsToUpdate = n2.dynamicProps;
						for (let i = 0; i < propsToUpdate.length; i++) {
							const key = propsToUpdate[i];
							const prev = oldProps[key];
							const next = newProps[key];
							if (next !== prev || key === "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
						}
					}
				}
				if (patchFlag & 1) {
					if (n1.children !== n2.children) hostSetElementText(el, n2.children);
				}
			} else if (!optimized && dynamicChildren == null) patchProps(el, oldProps, newProps, parentComponent, namespace);
			if ((vnodeHook = newProps.onVnodeUpdated) || dirs) queuePostRenderEffect(() => {
				vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
				dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
			}, parentSuspense);
		};
		const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
			for (let i = 0; i < newChildren.length; i++) {
				const oldVNode = oldChildren[i];
				const newVNode = newChildren[i];
				const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & 198) ? hostParentNode(oldVNode.el) : fallbackContainer;
				patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, true);
			}
		};
		const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
			if (oldProps !== newProps) {
				if (oldProps !== EMPTY_OBJ) {
					for (const key in oldProps) if (!isReservedProp(key) && !(key in newProps)) hostPatchProp(el, key, oldProps[key], null, namespace, parentComponent);
				}
				for (const key in newProps) {
					if (isReservedProp(key)) continue;
					const next = newProps[key];
					const prev = oldProps[key];
					if (next !== prev && key !== "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
				}
				if ("value" in newProps) hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
			}
		};
		const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
			const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
			let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
			if (fragmentSlotScopeIds) slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
			if (n1 == null) {
				hostInsert(fragmentStartAnchor, container, anchor);
				hostInsert(fragmentEndAnchor, container, anchor);
				mountChildren(n2.children || [], container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} else if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
				patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, namespace, slotScopeIds);
				if (n2.key != null || parentComponent && n2 === parentComponent.subTree) traverseStaticChildren(n1, n2, true);
			} else patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		};
		const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			n2.slotScopeIds = slotScopeIds;
			if (n1 == null) {
				if (n2.shapeFlag & 512) parentComponent.ctx.activate(n2, container, anchor, namespace, optimized);
				else mountComponent(n2, container, anchor, parentComponent, parentSuspense, namespace, optimized);
			} else updateComponent(n1, n2, optimized);
		};
		const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
			const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
			if (isKeepAlive(initialVNode)) instance.ctx.renderer = internals;
			setupComponent(instance, false, optimized);
			if (instance.asyncDep) {
				parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
				if (!initialVNode.el) {
					const placeholder = instance.subTree = createVNode(Comment);
					processCommentNode(null, placeholder, container, anchor);
					initialVNode.placeholder = placeholder.el;
				}
			} else setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, namespace, optimized);
		};
		const updateComponent = (n1, n2, optimized) => {
			const instance = n2.component = n1.component;
			if (shouldUpdateComponent(n1, n2, optimized)) {
				if (instance.asyncDep && !instance.asyncResolved) {
					updateComponentPreRender(instance, n2, optimized);
					return;
				} else {
					instance.next = n2;
					instance.update();
				}
			} else {
				n2.el = n1.el;
				instance.vnode = n2;
			}
		};
		const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
			const componentUpdateFn = () => {
				if (!instance.isMounted) {
					let vnodeHook;
					const { el, props } = initialVNode;
					const { bm, m, parent, root, type } = instance;
					const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
					toggleRecurse(instance, false);
					if (bm) invokeArrayFns(bm);
					if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) invokeVNodeHook(vnodeHook, parent, initialVNode);
					toggleRecurse(instance, true);
					if (el && hydrateNode) {
						const hydrateSubTree = () => {
							instance.subTree = renderComponentRoot(instance);
							hydrateNode(el, instance.subTree, instance, parentSuspense, null);
						};
						if (isAsyncWrapperVNode && type.__asyncHydrate) type.__asyncHydrate(el, instance, hydrateSubTree);
						else hydrateSubTree();
					} else {
						if (root.ce && root.ce._hasShadowRoot()) root.ce._injectChildStyle(type, instance.parent ? instance.parent.type : void 0);
						const subTree = instance.subTree = renderComponentRoot(instance);
						patch(null, subTree, container, anchor, instance, parentSuspense, namespace);
						initialVNode.el = subTree.el;
					}
					if (m) queuePostRenderEffect(m, parentSuspense);
					if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
						const scopedInitialVNode = initialVNode;
						queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
					}
					if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) instance.a && queuePostRenderEffect(instance.a, parentSuspense);
					instance.isMounted = true;
					devtoolsComponentAdded(instance);
					initialVNode = container = anchor = null;
				} else {
					let { next, bu, u, parent, vnode } = instance;
					{
						const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
						if (nonHydratedAsyncRoot) {
							if (next) {
								next.el = vnode.el;
								updateComponentPreRender(instance, next, optimized);
							}
							nonHydratedAsyncRoot.asyncDep.then(() => {
								queuePostRenderEffect(() => {
									if (!instance.isUnmounted) update();
								}, parentSuspense);
							});
							return;
						}
					}
					let originNext = next;
					let vnodeHook;
					toggleRecurse(instance, false);
					if (next) {
						next.el = vnode.el;
						updateComponentPreRender(instance, next, optimized);
					} else next = vnode;
					if (bu) invokeArrayFns(bu);
					if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parent, next, vnode);
					toggleRecurse(instance, true);
					const nextTree = renderComponentRoot(instance);
					const prevTree = instance.subTree;
					instance.subTree = nextTree;
					patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, namespace);
					next.el = nextTree.el;
					if (originNext === null) updateHOCHostEl(instance, nextTree.el);
					if (u) queuePostRenderEffect(u, parentSuspense);
					if (vnodeHook = next.props && next.props.onVnodeUpdated) queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
					devtoolsComponentUpdated(instance);
				}
			};
			instance.scope.on();
			const effect = instance.effect = new ReactiveEffect(componentUpdateFn);
			instance.scope.off();
			const update = instance.update = effect.run.bind(effect);
			const job = instance.job = effect.runIfDirty.bind(effect);
			job.i = instance;
			job.id = instance.uid;
			effect.scheduler = () => queueJob(job);
			toggleRecurse(instance, true);
			update();
		};
		const updateComponentPreRender = (instance, nextVNode, optimized) => {
			nextVNode.component = instance;
			const prevProps = instance.vnode.props;
			instance.vnode = nextVNode;
			instance.next = null;
			updateProps(instance, nextVNode.props, prevProps, optimized);
			updateSlots(instance, nextVNode.children, optimized);
			pauseTracking();
			flushPreFlushCbs(instance);
			resetTracking();
		};
		const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
			const c1 = n1 && n1.children;
			const prevShapeFlag = n1 ? n1.shapeFlag : 0;
			const c2 = n2.children;
			const { patchFlag, shapeFlag } = n2;
			if (patchFlag > 0) {
				if (patchFlag & 128) {
					patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					return;
				} else if (patchFlag & 256) {
					patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					return;
				}
			}
			if (shapeFlag & 8) {
				if (prevShapeFlag & 16) unmountChildren(c1, parentComponent, parentSuspense);
				if (c2 !== c1) hostSetElementText(container, c2);
			} else if (prevShapeFlag & 16) {
				if (shapeFlag & 16) patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else unmountChildren(c1, parentComponent, parentSuspense, true);
			} else {
				if (prevShapeFlag & 8) hostSetElementText(container, "");
				if (shapeFlag & 16) mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			}
		};
		const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			c1 = c1 || EMPTY_ARR;
			c2 = c2 || EMPTY_ARR;
			const oldLength = c1.length;
			const newLength = c2.length;
			const commonLength = Math.min(oldLength, newLength);
			let i = 0;
			for (; i < commonLength; i++) {
				const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
				patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			}
			if (oldLength > newLength) unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
			else mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, commonLength);
		};
		const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			let i = 0;
			const l2 = c2.length;
			let e1 = c1.length - 1;
			let e2 = l2 - 1;
			while (i <= e1 && i <= e2) {
				const n1 = c1[i];
				const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
				if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else break;
				i++;
			}
			while (i <= e1 && i <= e2) {
				const n1 = c1[e1];
				const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
				if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else break;
				e1--;
				e2--;
			}
			if (i > e1) {
				if (i <= e2) {
					const nextPos = e2 + 1;
					const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
					while (i <= e2) {
						patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
						i++;
					}
				}
			} else if (i > e2) while (i <= e1) {
				unmount(c1[i], parentComponent, parentSuspense, true);
				i++;
			}
			else {
				const s1 = i;
				const s2 = i;
				const keyToNewIndexMap = /* @__PURE__ */ new Map();
				for (i = s2; i <= e2; i++) {
					const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
					if (nextChild.key != null) keyToNewIndexMap.set(nextChild.key, i);
				}
				let j;
				let patched = 0;
				const toBePatched = e2 - s2 + 1;
				let moved = false;
				let maxNewIndexSoFar = 0;
				const newIndexToOldIndexMap = new Array(toBePatched);
				for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
				for (i = s1; i <= e1; i++) {
					const prevChild = c1[i];
					if (patched >= toBePatched) {
						unmount(prevChild, parentComponent, parentSuspense, true);
						continue;
					}
					let newIndex;
					if (prevChild.key != null) newIndex = keyToNewIndexMap.get(prevChild.key);
					else for (j = s2; j <= e2; j++) if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
						newIndex = j;
						break;
					}
					if (newIndex === void 0) unmount(prevChild, parentComponent, parentSuspense, true);
					else {
						newIndexToOldIndexMap[newIndex - s2] = i + 1;
						if (newIndex >= maxNewIndexSoFar) maxNewIndexSoFar = newIndex;
						else moved = true;
						patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
						patched++;
					}
				}
				const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
				j = increasingNewIndexSequence.length - 1;
				for (i = toBePatched - 1; i >= 0; i--) {
					const nextIndex = s2 + i;
					const nextChild = c2[nextIndex];
					const anchorVNode = c2[nextIndex + 1];
					const anchor = nextIndex + 1 < l2 ? anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode) : parentAnchor;
					if (newIndexToOldIndexMap[i] === 0) patch(null, nextChild, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					else if (moved) {
						if (j < 0 || i !== increasingNewIndexSequence[j]) move(nextChild, container, anchor, 2);
						else j--;
					}
				}
			}
		};
		const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
			const { el, type, transition, children, shapeFlag } = vnode;
			if (shapeFlag & 6) {
				move(vnode.component.subTree, container, anchor, moveType);
				return;
			}
			if (shapeFlag & 128) {
				vnode.suspense.move(container, anchor, moveType);
				return;
			}
			if (shapeFlag & 64) {
				type.move(vnode, container, anchor, internals);
				return;
			}
			if (type === Fragment) {
				hostInsert(el, container, anchor);
				for (let i = 0; i < children.length; i++) move(children[i], container, anchor, moveType);
				hostInsert(vnode.anchor, container, anchor);
				return;
			}
			if (type === Static) {
				moveStaticNode(vnode, container, anchor);
				return;
			}
			if (moveType !== 2 && shapeFlag & 1 && transition) {
				if (moveType === 0) {
					if (transition.persisted && !el[leaveCbKey]) hostInsert(el, container, anchor);
					else {
						transition.beforeEnter(el);
						hostInsert(el, container, anchor);
						queuePostRenderEffect(() => transition.enter(el), parentSuspense);
					}
				} else {
					const { leave, delayLeave, afterLeave } = transition;
					const remove2 = () => {
						if (vnode.ctx.isUnmounted) hostRemove(el);
						else hostInsert(el, container, anchor);
					};
					const performLeave = () => {
						const wasLeaving = el._isLeaving || !!el[leaveCbKey];
						if (el._isLeaving) el[leaveCbKey](true);
						if (transition.persisted && !wasLeaving) remove2();
						else leave(el, () => {
							remove2();
							afterLeave && afterLeave();
						});
					};
					if (delayLeave) delayLeave(el, remove2, performLeave);
					else performLeave();
				}
			} else hostInsert(el, container, anchor);
		};
		const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
			const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs, cacheIndex, memo } = vnode;
			if (patchFlag === -2) optimized = false;
			if (ref != null) {
				pauseTracking();
				setRef(ref, null, parentSuspense, vnode, true);
				resetTracking();
			}
			if (cacheIndex != null) parentComponent.renderCache[cacheIndex] = void 0;
			if (shapeFlag & 256) {
				parentComponent.ctx.deactivate(vnode);
				return;
			}
			const shouldInvokeDirs = shapeFlag & 1 && dirs;
			const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
			let vnodeHook;
			if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) invokeVNodeHook(vnodeHook, parentComponent, vnode);
			if (shapeFlag & 6) unmountComponent(vnode.component, parentSuspense, doRemove);
			else {
				if (shapeFlag & 128) {
					vnode.suspense.unmount(parentSuspense, doRemove);
					return;
				}
				if (shouldInvokeDirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
				if (shapeFlag & 64) vnode.type.remove(vnode, parentComponent, parentSuspense, internals, doRemove);
				else if (dynamicChildren && !dynamicChildren.hasOnce && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
				else if (type === Fragment && patchFlag & 384 || !optimized && shapeFlag & 16) unmountChildren(children, parentComponent, parentSuspense);
				if (doRemove) remove(vnode);
			}
			const shouldInvalidateMemo = memo != null && cacheIndex == null;
			if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) queuePostRenderEffect(() => {
				vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
				shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
				if (shouldInvalidateMemo) vnode.el = null;
			}, parentSuspense);
		};
		const remove = (vnode) => {
			const { type, el, anchor, transition } = vnode;
			if (type === Fragment) {
				removeFragment(el, anchor);
				return;
			}
			if (type === Static) {
				removeStaticNode(vnode);
				return;
			}
			const performRemove = () => {
				hostRemove(el);
				if (transition && !transition.persisted && transition.afterLeave) transition.afterLeave();
			};
			if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
				const { leave, delayLeave } = transition;
				const performLeave = () => leave(el, performRemove);
				if (delayLeave) delayLeave(vnode.el, performRemove, performLeave);
				else performLeave();
			} else performRemove();
		};
		const removeFragment = (cur, end) => {
			let next;
			while (cur !== end) {
				next = hostNextSibling(cur);
				hostRemove(cur);
				cur = next;
			}
			hostRemove(end);
		};
		const unmountComponent = (instance, parentSuspense, doRemove) => {
			const { bum, scope, job, subTree, um, m, a } = instance;
			invalidateMount(m);
			invalidateMount(a);
			if (bum) invokeArrayFns(bum);
			scope.stop();
			if (job) {
				job.flags |= 8;
				unmount(subTree, instance, parentSuspense, doRemove);
			}
			if (um) queuePostRenderEffect(um, parentSuspense);
			queuePostRenderEffect(() => {
				instance.isUnmounted = true;
			}, parentSuspense);
			devtoolsComponentRemoved(instance);
		};
		const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
			for (let i = start; i < children.length; i++) unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
		};
		const getNextHostNode = (vnode) => {
			if (vnode.shapeFlag & 6) return getNextHostNode(vnode.component.subTree);
			if (vnode.shapeFlag & 128) return vnode.suspense.next();
			const el = hostNextSibling(vnode.anchor || vnode.el);
			const teleportEnd = el && el[TeleportEndKey];
			return teleportEnd ? hostNextSibling(teleportEnd) : el;
		};
		let isFlushing = false;
		const render = (vnode, container, namespace) => {
			let instance;
			if (vnode == null) {
				if (container._vnode) {
					unmount(container._vnode, null, null, true);
					instance = container._vnode.component;
				}
			} else patch(container._vnode || null, vnode, container, null, null, null, namespace);
			container._vnode = vnode;
			if (!isFlushing) {
				isFlushing = true;
				flushPreFlushCbs(instance);
				flushPostFlushCbs();
				isFlushing = false;
			}
		};
		const internals = {
			p: patch,
			um: unmount,
			m: move,
			r: remove,
			mt: mountComponent,
			mc: mountChildren,
			pc: patchChildren,
			pbc: patchBlockChildren,
			n: getNextHostNode,
			o: options
		};
		let hydrate;
		let hydrateNode;
		if (createHydrationFns) [hydrate, hydrateNode] = createHydrationFns(internals);
		return {
			render,
			hydrate,
			createApp: createAppAPI(render, hydrate)
		};
	}
	function resolveChildrenNamespace({ type, props }, currentNamespace) {
		return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
	}
	function toggleRecurse({ effect, job }, allowed) {
		if (allowed) {
			effect.flags |= 32;
			job.flags |= 4;
		} else {
			effect.flags &= -33;
			job.flags &= -5;
		}
	}
	function needTransition(parentSuspense, transition) {
		return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
	}
	function traverseStaticChildren(n1, n2, shallow = false) {
		const ch1 = n1.children;
		const ch2 = n2.children;
		if (isArray(ch1) && isArray(ch2)) for (let i = 0; i < ch1.length; i++) {
			const c1 = ch1[i];
			let c2 = ch2[i];
			if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
				if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
					c2 = ch2[i] = cloneIfMounted(ch2[i]);
					c2.el = c1.el;
				}
				if (!shallow && c2.patchFlag !== -2) traverseStaticChildren(c1, c2);
			}
			if (c2.type === Text) {
				if (c2.patchFlag === -1) c2 = ch2[i] = cloneIfMounted(c2);
				c2.el = c1.el;
			}
			if (c2.type === Comment && !c2.el) c2.el = c1.el;
		}
	}
	function getSequence(arr) {
		const p = arr.slice();
		const result = [0];
		let i, j, u, v, c;
		const len = arr.length;
		for (i = 0; i < len; i++) {
			const arrI = arr[i];
			if (arrI !== 0) {
				j = result[result.length - 1];
				if (arr[j] < arrI) {
					p[i] = j;
					result.push(i);
					continue;
				}
				u = 0;
				v = result.length - 1;
				while (u < v) {
					c = u + v >> 1;
					if (arr[result[c]] < arrI) u = c + 1;
					else v = c;
				}
				if (arrI < arr[result[u]]) {
					if (u > 0) p[i] = result[u - 1];
					result[u] = i;
				}
			}
		}
		u = result.length;
		v = result[u - 1];
		while (u-- > 0) {
			result[u] = v;
			v = p[v];
		}
		return result;
	}
	function locateNonHydratedAsyncRoot(instance) {
		const subComponent = instance.subTree.component;
		if (subComponent) {
			if (subComponent.asyncDep && !subComponent.asyncResolved) return subComponent;
			else return locateNonHydratedAsyncRoot(subComponent);
		}
	}
	function invalidateMount(hooks) {
		if (hooks) for (let i = 0; i < hooks.length; i++) hooks[i].flags |= 8;
	}
	function resolveAsyncComponentPlaceholder(anchorVnode) {
		if (anchorVnode.placeholder) return anchorVnode.placeholder;
		const instance = anchorVnode.component;
		if (instance) return resolveAsyncComponentPlaceholder(instance.subTree);
		return null;
	}
	var isSuspense = (type) => type.__isSuspense;
	var suspenseId = 0;
	var Suspense = {
		name: "Suspense",
		__isSuspense: true,
		process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
			if (n1 == null) mountSuspense(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals);
			else {
				if (parentSuspense && parentSuspense.deps > 0 && !n1.suspense.isInFallback) {
					n2.suspense = n1.suspense;
					n2.suspense.vnode = n2;
					n2.el = n1.el;
					return;
				}
				patchSuspense(n1, n2, container, anchor, parentComponent, namespace, slotScopeIds, optimized, rendererInternals);
			}
		},
		hydrate: hydrateSuspense,
		normalize: normalizeSuspenseChildren
	};
	function triggerEvent(vnode, name) {
		const eventListener = vnode.props && vnode.props[name];
		if (isFunction(eventListener)) eventListener();
	}
	function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
		const { p: patch, o: { createElement } } = rendererInternals;
		const hiddenContainer = createElement("div");
		const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, namespace, slotScopeIds, optimized, rendererInternals);
		patch(null, suspense.pendingBranch = vnode.ssContent, hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds);
		if (suspense.deps > 0) {
			triggerEvent(vnode, "onPending");
			triggerEvent(vnode, "onFallback");
			patch(null, vnode.ssFallback, container, anchor, parentComponent, null, namespace, slotScopeIds);
			setActiveBranch(suspense, vnode.ssFallback);
		} else suspense.resolve(false, true);
	}
	function patchSuspense(n1, n2, container, anchor, parentComponent, namespace, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement } }) {
		const suspense = n2.suspense = n1.suspense;
		suspense.vnode = n2;
		n2.el = n1.el;
		const newBranch = n2.ssContent;
		const newFallback = n2.ssFallback;
		const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
		if (pendingBranch) {
			suspense.pendingBranch = newBranch;
			if (isSameVNodeType(pendingBranch, newBranch)) {
				patch(pendingBranch, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
				if (suspense.deps <= 0) suspense.resolve();
				else if (isInFallback) {
					if (!isHydrating && !suspense.isFallbackMountPending) {
						patch(activeBranch, newFallback, container, anchor, parentComponent, null, namespace, slotScopeIds, optimized);
						setActiveBranch(suspense, newFallback);
					}
				}
			} else {
				suspense.pendingId = suspenseId++;
				if (isHydrating) {
					suspense.isHydrating = false;
					suspense.activeBranch = pendingBranch;
				} else unmount(pendingBranch, parentComponent, suspense);
				suspense.deps = 0;
				suspense.effects.length = 0;
				suspense.hiddenContainer = createElement("div");
				if (isInFallback) {
					patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
					if (suspense.deps <= 0) suspense.resolve();
					else if (!suspense.isFallbackMountPending) {
						patch(activeBranch, newFallback, container, anchor, parentComponent, null, namespace, slotScopeIds, optimized);
						setActiveBranch(suspense, newFallback);
					}
				} else if (activeBranch && isSameVNodeType(activeBranch, newBranch)) {
					patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, namespace, slotScopeIds, optimized);
					suspense.resolve(true);
				} else {
					patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
					if (suspense.deps <= 0) suspense.resolve();
				}
			}
		} else if (activeBranch && isSameVNodeType(activeBranch, newBranch)) {
			patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, namespace, slotScopeIds, optimized);
			setActiveBranch(suspense, newBranch);
		} else {
			triggerEvent(n2, "onPending");
			suspense.pendingBranch = newBranch;
			if (newBranch.shapeFlag & 512) suspense.pendingId = newBranch.component.suspenseId;
			else suspense.pendingId = suspenseId++;
			patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
			if (suspense.deps <= 0) suspense.resolve();
			else {
				const { timeout, pendingId } = suspense;
				if (timeout > 0) setTimeout(() => {
					if (suspense.pendingId === pendingId) suspense.fallback(newFallback);
				}, timeout);
				else if (timeout === 0) suspense.fallback(newFallback);
			}
		}
	}
	function createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, namespace, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
		const { p: patch, m: move, um: unmount, n: next, o: { parentNode, remove } } = rendererInternals;
		let parentSuspenseId;
		const isSuspensible = isVNodeSuspensible(vnode);
		if (isSuspensible) {
			if (parentSuspense && parentSuspense.pendingBranch) {
				parentSuspenseId = parentSuspense.pendingId;
				parentSuspense.deps++;
			}
		}
		const timeout = vnode.props ? toNumber(vnode.props.timeout) : void 0;
		const initialAnchor = anchor;
		const suspense = {
			vnode,
			parent: parentSuspense,
			parentComponent,
			namespace,
			container,
			hiddenContainer,
			deps: 0,
			pendingId: suspenseId++,
			timeout: typeof timeout === "number" ? timeout : -1,
			activeBranch: null,
			isFallbackMountPending: false,
			pendingBranch: null,
			isInFallback: !isHydrating,
			isHydrating,
			isUnmounted: false,
			effects: [],
			resolve(resume = false, sync = false) {
				const { vnode: vnode2, activeBranch, pendingBranch, pendingId, effects, parentComponent: parentComponent2, container: container2, isInFallback } = suspense;
				let delayEnter = false;
				if (suspense.isHydrating) suspense.isHydrating = false;
				else if (!resume) {
					delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
					let hasUpdatedAnchor = false;
					if (delayEnter) activeBranch.transition.afterLeave = () => {
						if (pendingId === suspense.pendingId) {
							move(pendingBranch, container2, anchor === initialAnchor && !hasUpdatedAnchor ? next(activeBranch) : anchor, 0);
							queuePostFlushCb(effects);
							if (isInFallback && vnode2.ssFallback) vnode2.ssFallback.el = null;
						}
					};
					if (activeBranch && !suspense.isFallbackMountPending) {
						if (parentNode(activeBranch.el) === container2) {
							anchor = next(activeBranch);
							hasUpdatedAnchor = true;
						}
						unmount(activeBranch, parentComponent2, suspense, true);
						if (!delayEnter && isInFallback && vnode2.ssFallback) queuePostRenderEffect(() => vnode2.ssFallback.el = null, suspense);
					}
					if (!delayEnter) move(pendingBranch, container2, anchor, 0);
				}
				suspense.isFallbackMountPending = false;
				setActiveBranch(suspense, pendingBranch);
				suspense.pendingBranch = null;
				suspense.isInFallback = false;
				let parent = suspense.parent;
				let hasUnresolvedAncestor = false;
				while (parent) {
					if (parent.pendingBranch) {
						for (let i = 0; i < effects.length; i++) parent.effects.push(effects[i]);
						hasUnresolvedAncestor = true;
						break;
					}
					parent = parent.parent;
				}
				if (!hasUnresolvedAncestor && !delayEnter) queuePostFlushCb(effects);
				suspense.effects = [];
				if (isSuspensible) {
					if (parentSuspense && parentSuspense.pendingBranch && parentSuspenseId === parentSuspense.pendingId) {
						parentSuspense.deps--;
						if (parentSuspense.deps === 0 && !sync) parentSuspense.resolve();
					}
				}
				triggerEvent(vnode2, "onResolve");
			},
			fallback(fallbackVNode) {
				if (!suspense.pendingBranch) return;
				const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, namespace: namespace2 } = suspense;
				triggerEvent(vnode2, "onFallback");
				const anchor2 = next(activeBranch);
				const mountFallback = () => {
					suspense.isFallbackMountPending = false;
					if (!suspense.isInFallback) return;
					const latestFallback = suspense.vnode.ssFallback;
					patch(null, latestFallback, container2, anchor2, parentComponent2, null, namespace2, slotScopeIds, optimized);
					setActiveBranch(suspense, latestFallback);
				};
				const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
				if (delayEnter) {
					suspense.isFallbackMountPending = true;
					activeBranch.transition.afterLeave = mountFallback;
				}
				suspense.isInFallback = true;
				unmount(activeBranch, parentComponent2, null, true);
				if (!delayEnter) mountFallback();
			},
			move(container2, anchor2, type) {
				suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type);
				suspense.container = container2;
			},
			next() {
				return suspense.activeBranch && next(suspense.activeBranch);
			},
			registerDep(instance, setupRenderEffect, optimized2) {
				const isInPendingSuspense = !!suspense.pendingBranch;
				if (isInPendingSuspense) suspense.deps++;
				const hydratedEl = instance.vnode.el;
				instance.asyncDep.catch((err) => {
					handleError(err, instance, 0);
				}).then((asyncSetupResult) => {
					if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) return;
					unsetCurrentInstance();
					instance.asyncResolved = true;
					const { vnode: vnode2 } = instance;
					handleSetupResult(instance, asyncSetupResult, false);
					if (hydratedEl) vnode2.el = hydratedEl;
					const placeholder = !hydratedEl && instance.subTree.el;
					setupRenderEffect(instance, vnode2, parentNode(hydratedEl || instance.subTree.el), hydratedEl ? null : next(instance.subTree), suspense, namespace, optimized2);
					if (placeholder) {
						vnode2.placeholder = null;
						remove(placeholder);
					}
					updateHOCHostEl(instance, vnode2.el);
					if (isInPendingSuspense && --suspense.deps === 0) suspense.resolve();
				});
			},
			unmount(parentSuspense2, doRemove) {
				suspense.isUnmounted = true;
				if (suspense.activeBranch) unmount(suspense.activeBranch, parentComponent, parentSuspense2, doRemove);
				if (suspense.pendingBranch) unmount(suspense.pendingBranch, parentComponent, parentSuspense2, doRemove);
			}
		};
		return suspense;
	}
	function hydrateSuspense(node, vnode, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals, hydrateNode) {
		const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement("div"), null, namespace, slotScopeIds, optimized, rendererInternals, true);
		const result = hydrateNode(node, suspense.pendingBranch = vnode.ssContent, parentComponent, suspense, slotScopeIds, optimized);
		if (suspense.deps === 0) suspense.resolve(false, true);
		return result;
	}
	function normalizeSuspenseChildren(vnode) {
		const { shapeFlag, children } = vnode;
		const isSlotChildren = shapeFlag & 32;
		vnode.ssContent = normalizeSuspenseSlot(isSlotChildren ? children.default : children);
		vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
	}
	function normalizeSuspenseSlot(s) {
		let block;
		if (isFunction(s)) {
			const trackBlock = isBlockTreeEnabled && s._c;
			if (trackBlock) {
				s._d = false;
				openBlock();
			}
			s = s();
			if (trackBlock) {
				s._d = true;
				block = currentBlock;
				closeBlock();
			}
		}
		if (isArray(s)) s = filterSingleRoot(s);
		s = normalizeVNode(s);
		if (block && !s.dynamicChildren) s.dynamicChildren = block.filter((c) => c !== s);
		return s;
	}
	function queueEffectWithSuspense(fn, suspense) {
		if (suspense && suspense.pendingBranch) {
			if (isArray(fn)) suspense.effects.push(...fn);
			else suspense.effects.push(fn);
		} else queuePostFlushCb(fn);
	}
	function setActiveBranch(suspense, branch) {
		suspense.activeBranch = branch;
		const { vnode, parentComponent } = suspense;
		let el = branch.el;
		while (!el && branch.component) {
			branch = branch.component.subTree;
			el = branch.el;
		}
		vnode.el = el;
		if (parentComponent && parentComponent.subTree === vnode) {
			parentComponent.vnode.el = el;
			updateHOCHostEl(parentComponent, el);
		}
	}
	function isVNodeSuspensible(vnode) {
		const suspensible = vnode.props && vnode.props.suspensible;
		return suspensible != null && suspensible !== false;
	}
	var Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
	var Text = /* @__PURE__ */ Symbol.for("v-txt");
	var Comment = /* @__PURE__ */ Symbol.for("v-cmt");
	var Static = /* @__PURE__ */ Symbol.for("v-stc");
	var blockStack = [];
	var currentBlock = null;
	function openBlock(disableTracking = false) {
		blockStack.push(currentBlock = disableTracking ? null : []);
	}
	function closeBlock() {
		blockStack.pop();
		currentBlock = blockStack[blockStack.length - 1] || null;
	}
	var isBlockTreeEnabled = 1;
	function setBlockTracking(value, inVOnce = false) {
		isBlockTreeEnabled += value;
		if (value < 0 && currentBlock && inVOnce) currentBlock.hasOnce = true;
	}
	function setupBlock(vnode) {
		vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
		closeBlock();
		if (isBlockTreeEnabled > 0 && currentBlock) currentBlock.push(vnode);
		return vnode;
	}
	function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
		return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
	}
	function createBlock(type, props, children, patchFlag, dynamicProps) {
		return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
	}
	function isVNode(value) {
		return value ? value.__v_isVNode === true : false;
	}
	function isSameVNodeType(n1, n2) {
		return n1.type === n2.type && n1.key === n2.key;
	}
	function transformVNodeArgs(transformer) {}
	var normalizeKey = ({ key }) => key != null ? key : null;
	var normalizeRef = ({ ref, ref_key, ref_for }) => {
		if (typeof ref === "number") ref = "" + ref;
		return ref != null ? isString(ref) || /* @__PURE__ */ isRef(ref) || isFunction(ref) ? {
			i: currentRenderingInstance,
			r: ref,
			k: ref_key,
			f: !!ref_for
		} : ref : null;
	};
	function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
		const vnode = {
			__v_isVNode: true,
			__v_skip: true,
			type,
			props,
			key: props && normalizeKey(props),
			ref: props && normalizeRef(props),
			scopeId: currentScopeId,
			slotScopeIds: null,
			children,
			component: null,
			suspense: null,
			ssContent: null,
			ssFallback: null,
			dirs: null,
			transition: null,
			el: null,
			anchor: null,
			target: null,
			targetStart: null,
			targetAnchor: null,
			staticCount: 0,
			shapeFlag,
			patchFlag,
			dynamicProps,
			dynamicChildren: null,
			appContext: null,
			ctx: currentRenderingInstance
		};
		if (needFullChildrenNormalization) {
			normalizeChildren(vnode, children);
			if (shapeFlag & 128) type.normalize(vnode);
		} else if (children) vnode.shapeFlag |= isString(children) ? 8 : 16;
		if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) currentBlock.push(vnode);
		return vnode;
	}
	var createVNode = _createVNode;
	function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
		if (!type || type === NULL_DYNAMIC_COMPONENT) type = Comment;
		if (isVNode(type)) {
			const cloned = cloneVNode(type, props, true);
			if (children) normalizeChildren(cloned, children);
			if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
				if (cloned.shapeFlag & 6) currentBlock[currentBlock.indexOf(type)] = cloned;
				else currentBlock.push(cloned);
			}
			cloned.patchFlag = -2;
			return cloned;
		}
		if (isClassComponent(type)) type = type.__vccOpts;
		if (props) {
			props = guardReactiveProps(props);
			let { class: klass, style } = props;
			if (klass && !isString(klass)) props.class = normalizeClass(klass);
			if (isObject(style)) {
				if (/* @__PURE__ */ isProxy(style) && !isArray(style)) style = extend$2({}, style);
				props.style = normalizeStyle(style);
			}
		}
		const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
		return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
	}
	function guardReactiveProps(props) {
		if (!props) return null;
		return /* @__PURE__ */ isProxy(props) || isInternalObject(props) ? extend$2({}, props) : props;
	}
	function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
		const { props, ref, patchFlag, children, transition } = vnode;
		const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
		const cloned = {
			__v_isVNode: true,
			__v_skip: true,
			type: vnode.type,
			props: mergedProps,
			key: mergedProps && normalizeKey(mergedProps),
			ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
			scopeId: vnode.scopeId,
			slotScopeIds: vnode.slotScopeIds,
			children,
			target: vnode.target,
			targetStart: vnode.targetStart,
			targetAnchor: vnode.targetAnchor,
			staticCount: vnode.staticCount,
			shapeFlag: vnode.shapeFlag,
			patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
			dynamicProps: vnode.dynamicProps,
			dynamicChildren: vnode.dynamicChildren,
			appContext: vnode.appContext,
			dirs: vnode.dirs,
			transition,
			component: vnode.component,
			suspense: vnode.suspense,
			ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
			ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
			placeholder: vnode.placeholder,
			el: vnode.el,
			anchor: vnode.anchor,
			ctx: vnode.ctx,
			ce: vnode.ce
		};
		if (transition && cloneTransition) setTransitionHooks(cloned, transition.clone(cloned));
		return cloned;
	}
	function createTextVNode(text = " ", flag = 0) {
		return createVNode(Text, null, text, flag);
	}
	function createStaticVNode(content, numberOfNodes) {
		const vnode = createVNode(Static, null, content);
		vnode.staticCount = numberOfNodes;
		return vnode;
	}
	function createCommentVNode(text = "", asBlock = false) {
		return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
	}
	function normalizeVNode(child) {
		if (child == null || typeof child === "boolean") return createVNode(Comment);
		else if (isArray(child)) return createVNode(Fragment, null, child.slice());
		else if (isVNode(child)) return cloneIfMounted(child);
		else return createVNode(Text, null, String(child));
	}
	function cloneIfMounted(child) {
		return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
	}
	function normalizeChildren(vnode, children) {
		let type = 0;
		const { shapeFlag } = vnode;
		if (children == null) children = null;
		else if (isArray(children)) type = 16;
		else if (typeof children === "object") {
			if (shapeFlag & 65) {
				const slot = children.default;
				if (slot) {
					slot._c && (slot._d = false);
					normalizeChildren(vnode, slot());
					slot._c && (slot._d = true);
				}
				return;
			} else {
				type = 32;
				const slotFlag = children._;
				if (!slotFlag && !isInternalObject(children)) children._ctx = currentRenderingInstance;
				else if (slotFlag === 3 && currentRenderingInstance) {
					if (currentRenderingInstance.slots._ === 1) children._ = 1;
					else {
						children._ = 2;
						vnode.patchFlag |= 1024;
					}
				}
			}
		} else if (isFunction(children)) {
			if (shapeFlag & 65) {
				normalizeChildren(vnode, { default: children });
				return;
			}
			children = {
				default: children,
				_ctx: currentRenderingInstance
			};
			type = 32;
		} else {
			children = String(children);
			if (shapeFlag & 64) {
				type = 16;
				children = [createTextVNode(children)];
			} else type = 8;
		}
		vnode.children = children;
		vnode.shapeFlag |= type;
	}
	function mergeProps(...args) {
		const ret = {};
		for (let i = 0; i < args.length; i++) {
			const toMerge = args[i];
			for (const key in toMerge) if (key === "class") {
				if (ret.class !== toMerge.class) ret.class = normalizeClass([ret.class, toMerge.class]);
			} else if (key === "style") ret.style = normalizeStyle([ret.style, toMerge.style]);
			else if (isOn(key)) {
				const existing = ret[key];
				const incoming = toMerge[key];
				if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) ret[key] = existing ? [].concat(existing, incoming) : incoming;
				else if (incoming == null && existing == null && !isModelListener(key)) ret[key] = incoming;
			} else if (key !== "") ret[key] = toMerge[key];
		}
		return ret;
	}
	function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
		callWithAsyncErrorHandling(hook, instance, 7, [vnode, prevVNode]);
	}
	var emptyAppContext = createAppContext();
	var uid = 0;
	function createComponentInstance(vnode, parent, suspense) {
		const type = vnode.type;
		const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
		const instance = {
			uid: uid++,
			vnode,
			type,
			parent,
			appContext,
			root: null,
			next: null,
			subTree: null,
			effect: null,
			update: null,
			job: null,
			scope: new EffectScope(true),
			render: null,
			proxy: null,
			exposed: null,
			exposeProxy: null,
			withProxy: null,
			provides: parent ? parent.provides : Object.create(appContext.provides),
			ids: parent ? parent.ids : [
				"",
				0,
				0
			],
			accessCache: null,
			renderCache: [],
			components: null,
			directives: null,
			propsOptions: normalizePropsOptions(type, appContext),
			emitsOptions: normalizeEmitsOptions(type, appContext),
			emit: null,
			emitted: null,
			propsDefaults: EMPTY_OBJ,
			inheritAttrs: type.inheritAttrs,
			ctx: EMPTY_OBJ,
			data: EMPTY_OBJ,
			props: EMPTY_OBJ,
			attrs: EMPTY_OBJ,
			slots: EMPTY_OBJ,
			refs: EMPTY_OBJ,
			setupState: EMPTY_OBJ,
			setupContext: null,
			suspense,
			suspenseId: suspense ? suspense.pendingId : 0,
			asyncDep: null,
			asyncResolved: false,
			isMounted: false,
			isUnmounted: false,
			isDeactivated: false,
			bc: null,
			c: null,
			bm: null,
			m: null,
			bu: null,
			u: null,
			um: null,
			bum: null,
			da: null,
			a: null,
			rtg: null,
			rtc: null,
			ec: null,
			sp: null
		};
		instance.ctx = { _: instance };
		instance.root = parent ? parent.root : instance;
		instance.emit = emit.bind(null, instance);
		if (vnode.ce) vnode.ce(instance);
		return instance;
	}
	var currentInstance = null;
	var getCurrentInstance = () => currentInstance || currentRenderingInstance;
	var internalSetCurrentInstance;
	var setInSSRSetupState;
	{
		const g = getGlobalThis();
		const registerGlobalSetter = (key, setter) => {
			let setters;
			if (!(setters = g[key])) setters = g[key] = [];
			setters.push(setter);
			return (v) => {
				if (setters.length > 1) setters.forEach((set) => set(v));
				else setters[0](v);
			};
		};
		internalSetCurrentInstance = registerGlobalSetter(`__VUE_INSTANCE_SETTERS__`, (v) => currentInstance = v);
		setInSSRSetupState = registerGlobalSetter(`__VUE_SSR_SETTERS__`, (v) => isInSSRComponentSetup = v);
	}
	var setCurrentInstance = (instance) => {
		const prev = currentInstance;
		internalSetCurrentInstance(instance);
		instance.scope.on();
		return () => {
			instance.scope.off();
			internalSetCurrentInstance(prev);
		};
	};
	var unsetCurrentInstance = () => {
		currentInstance && currentInstance.scope.off();
		internalSetCurrentInstance(null);
	};
	function isStatefulComponent(instance) {
		return instance.vnode.shapeFlag & 4;
	}
	var isInSSRComponentSetup = false;
	function setupComponent(instance, isSSR = false, optimized = false) {
		isSSR && setInSSRSetupState(isSSR);
		const { props, children } = instance.vnode;
		const isStateful = isStatefulComponent(instance);
		initProps(instance, props, isStateful, isSSR);
		initSlots(instance, children, optimized || isSSR);
		const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
		isSSR && setInSSRSetupState(false);
		return setupResult;
	}
	function setupStatefulComponent(instance, isSSR) {
		const Component = instance.type;
		instance.accessCache = /* @__PURE__ */ Object.create(null);
		instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
		const { setup } = Component;
		if (setup) {
			pauseTracking();
			const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
			const reset = setCurrentInstance(instance);
			const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
			const isAsyncSetup = isPromise(setupResult);
			resetTracking();
			reset();
			if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) markAsyncBoundary(instance);
			if (isAsyncSetup) {
				setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
				if (isSSR) return setupResult.then((resolvedResult) => {
					setInSSRSetupState(true);
					try {
						handleSetupResult(instance, resolvedResult, isSSR);
					} finally {
						setInSSRSetupState(false);
					}
				}).catch((e) => {
					handleError(e, instance, 0);
				});
				else instance.asyncDep = setupResult;
			} else handleSetupResult(instance, setupResult, isSSR);
		} else finishComponentSetup(instance, isSSR);
	}
	function handleSetupResult(instance, setupResult, isSSR) {
		if (isFunction(setupResult)) {
			if (instance.type.__ssrInlineRender) instance.ssrRender = setupResult;
			else instance.render = setupResult;
		} else if (isObject(setupResult)) {
			instance.devtoolsRawSetupState = setupResult;
			instance.setupState = proxyRefs(setupResult);
		}
		finishComponentSetup(instance, isSSR);
	}
	var compile$1;
	var installWithProxy;
	function registerRuntimeCompiler(_compile) {
		compile$1 = _compile;
		installWithProxy = (i) => {
			if (i.render._rc) i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
		};
	}
	var isRuntimeOnly = () => !compile$1;
	function finishComponentSetup(instance, isSSR, skipOptions) {
		const Component = instance.type;
		if (!instance.render) {
			if (!isSSR && compile$1 && !Component.render) {
				const template = Component.template || resolveMergedOptions(instance).template;
				if (template) {
					const { isCustomElement, compilerOptions } = instance.appContext.config;
					const { delimiters, compilerOptions: componentCompilerOptions } = Component;
					const finalCompilerOptions = extend$2(extend$2({
						isCustomElement,
						delimiters
					}, compilerOptions), componentCompilerOptions);
					Component.render = compile$1(template, finalCompilerOptions);
				}
			}
			instance.render = Component.render || NOOP;
			if (installWithProxy) installWithProxy(instance);
		}
		{
			const reset = setCurrentInstance(instance);
			pauseTracking();
			try {
				applyOptions(instance);
			} finally {
				resetTracking();
				reset();
			}
		}
	}
	var attrsProxyHandlers = { get(target, key) {
		track(target, "get", "");
		return target[key];
	} };
	function createSetupContext(instance) {
		const expose = (exposed) => {
			instance.exposed = exposed || {};
		};
		return {
			attrs: new Proxy(instance.attrs, attrsProxyHandlers),
			slots: instance.slots,
			emit: instance.emit,
			expose
		};
	}
	function getComponentPublicInstance(instance) {
		if (instance.exposed) return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
			get(target, key) {
				if (key in target) return target[key];
				else if (key in publicPropertiesMap) return publicPropertiesMap[key](instance);
			},
			has(target, key) {
				return key in target || key in publicPropertiesMap;
			}
		}));
		else return instance.proxy;
	}
	var classifyRE = /(?:^|[-_])\w/g;
	var classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
	function getComponentName(Component, includeInferred = true) {
		return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
	}
	function formatComponentName(instance, Component, isRoot = false) {
		let name = getComponentName(Component);
		if (!name && Component.__file) {
			const match = Component.__file.match(/([^/\\]+)\.\w+$/);
			if (match) name = match[1];
		}
		if (!name && instance) {
			const inferFromRegistry = (registry) => {
				for (const key in registry) if (registry[key] === Component) return key;
			};
			name = inferFromRegistry(instance.components) || instance.parent && inferFromRegistry(instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
		}
		return name ? classify(name) : isRoot ? `App` : `Anonymous`;
	}
	function isClassComponent(value) {
		return isFunction(value) && "__vccOpts" in value;
	}
	var computed = (getterOrOptions, debugOptions) => {
		return /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
	};
	function h(type, propsOrChildren, children) {
		try {
			setBlockTracking(-1);
			const l = arguments.length;
			if (l === 2) {
				if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
					if (isVNode(propsOrChildren)) return createVNode(type, null, [propsOrChildren]);
					return createVNode(type, propsOrChildren);
				} else return createVNode(type, null, propsOrChildren);
			} else {
				if (l > 3) children = Array.prototype.slice.call(arguments, 2);
				else if (l === 3 && isVNode(children)) children = [children];
				return createVNode(type, propsOrChildren, children);
			}
		} finally {
			setBlockTracking(1);
		}
	}
	function initCustomFormatter() {}
	function withMemo(memo, render, cache, index) {
		const cached = cache[index];
		if (cached && isMemoSame(cached, memo)) return cached;
		const ret = render();
		ret.memo = memo.slice();
		ret.cacheIndex = index;
		return cache[index] = ret;
	}
	function isMemoSame(cached, memo) {
		const prev = cached.memo;
		if (prev.length != memo.length) return false;
		for (let i = 0; i < prev.length; i++) if (hasChanged(prev[i], memo[i])) return false;
		if (isBlockTreeEnabled > 0 && currentBlock) currentBlock.push(cached);
		return true;
	}
	var version$1 = "3.5.42";
	var warn = NOOP;
	var ErrorTypeStrings = ErrorTypeStrings$1;
	var devtools = devtools$1;
	var setDevtoolsHook = setDevtoolsHook$1;
	var ssrUtils = {
		createComponentInstance,
		setupComponent,
		renderComponentRoot,
		setCurrentRenderingInstance,
		isVNode,
		normalizeVNode,
		getComponentPublicInstance,
		ensureValidVNode,
		pushWarningContext,
		popWarningContext
	};
	//#endregion
	//#region node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
	/**
	* @vue/runtime-dom v3.5.42
	* (c) 2018-present Yuxi (Evan) You and Vue contributors
	* @license MIT
	**/
	var policy = void 0;
	var tt = typeof window !== "undefined" && window.trustedTypes;
	if (tt) try {
		policy = /* @__PURE__ */ tt.createPolicy("vue", { createHTML: (val) => val });
	} catch (e) {}
	var unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
	var svgNS = "http://www.w3.org/2000/svg";
	var mathmlNS = "http://www.w3.org/1998/Math/MathML";
	var doc = typeof document !== "undefined" ? document : null;
	var templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
	var nodeOps = {
		insert: (child, parent, anchor) => {
			parent.insertBefore(child, anchor || null);
		},
		remove: (child) => {
			const parent = child.parentNode;
			if (parent) parent.removeChild(child);
		},
		createElement: (tag, namespace, is, props) => {
			const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
			if (tag === "select" && props && props.multiple != null) el.setAttribute("multiple", props.multiple);
			return el;
		},
		createText: (text) => doc.createTextNode(text),
		createComment: (text) => doc.createComment(text),
		setText: (node, text) => {
			node.nodeValue = text;
		},
		setElementText: (el, text) => {
			el.textContent = text;
		},
		parentNode: (node) => node.parentNode,
		nextSibling: (node) => node.nextSibling,
		querySelector: (selector) => doc.querySelector(selector),
		setScopeId(el, id) {
			el.setAttribute(id, "");
		},
		insertStaticContent(content, parent, anchor, namespace, start, end) {
			const before = anchor ? anchor.previousSibling : parent.lastChild;
			if (start && (start === end || start.nextSibling)) while (true) {
				parent.insertBefore(start.cloneNode(true), anchor);
				if (start === end || !(start = start.nextSibling)) break;
			}
			else {
				templateContainer.innerHTML = unsafeToTrustedHTML(namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content);
				const template = templateContainer.content;
				if (namespace === "svg" || namespace === "mathml") {
					const wrapper = template.firstChild;
					while (wrapper.firstChild) template.appendChild(wrapper.firstChild);
					template.removeChild(wrapper);
				}
				parent.insertBefore(template, anchor);
			}
			return [before ? before.nextSibling : parent.firstChild, anchor ? anchor.previousSibling : parent.lastChild];
		}
	};
	var TRANSITION = "transition";
	var ANIMATION = "animation";
	var vtcKey = /* @__PURE__ */ Symbol("_vtc");
	var DOMTransitionPropsValidators = {
		name: String,
		type: String,
		css: {
			type: Boolean,
			default: true
		},
		duration: [
			String,
			Number,
			Object
		],
		enterFromClass: String,
		enterActiveClass: String,
		enterToClass: String,
		appearFromClass: String,
		appearActiveClass: String,
		appearToClass: String,
		leaveFromClass: String,
		leaveActiveClass: String,
		leaveToClass: String
	};
	var TransitionPropsValidators = /* @__PURE__ */ extend$2({}, BaseTransitionPropsValidators, DOMTransitionPropsValidators);
	var decorate$1 = (t) => {
		t.displayName = "Transition";
		t.props = TransitionPropsValidators;
		return t;
	};
	var Transition = /* @__PURE__ */ decorate$1((props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots));
	var callHook = (hook, args = []) => {
		if (isArray(hook)) hook.forEach((h2) => h2(...args));
		else if (hook) hook(...args);
	};
	var hasExplicitCallback = (hook) => {
		return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
	};
	function resolveTransitionProps(rawProps) {
		const baseProps = {};
		for (const key in rawProps) if (!(key in DOMTransitionPropsValidators)) baseProps[key] = rawProps[key];
		if (rawProps.css === false) return baseProps;
		const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
		const durations = normalizeDuration(duration);
		const enterDuration = durations && durations[0];
		const leaveDuration = durations && durations[1];
		const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
		const finishEnter = (el, isAppear, done, isCancelled) => {
			el._enterCancelled = isCancelled;
			removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
			removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
			done && done();
		};
		const finishLeave = (el, done) => {
			el._isLeaving = false;
			removeTransitionClass(el, leaveFromClass);
			removeTransitionClass(el, leaveToClass);
			removeTransitionClass(el, leaveActiveClass);
			done && done();
		};
		const makeEnterHook = (isAppear) => {
			return (el, done) => {
				const hook = isAppear ? onAppear : onEnter;
				const resolve = () => finishEnter(el, isAppear, done);
				callHook(hook, [el, resolve]);
				nextFrame(() => {
					removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
					addTransitionClass(el, isAppear ? appearToClass : enterToClass);
					if (!hasExplicitCallback(hook)) whenTransitionEnds(el, type, enterDuration, resolve);
				});
			};
		};
		return extend$2(baseProps, {
			onBeforeEnter(el) {
				callHook(onBeforeEnter, [el]);
				addTransitionClass(el, enterFromClass);
				addTransitionClass(el, enterActiveClass);
			},
			onBeforeAppear(el) {
				callHook(onBeforeAppear, [el]);
				addTransitionClass(el, appearFromClass);
				addTransitionClass(el, appearActiveClass);
			},
			onEnter: makeEnterHook(false),
			onAppear: makeEnterHook(true),
			onLeave(el, done) {
				el._isLeaving = true;
				const resolve = () => finishLeave(el, done);
				addTransitionClass(el, leaveFromClass);
				if (!el._enterCancelled) {
					forceReflow(el);
					addTransitionClass(el, leaveActiveClass);
				} else {
					addTransitionClass(el, leaveActiveClass);
					forceReflow(el);
				}
				nextFrame(() => {
					if (!el._isLeaving) return;
					removeTransitionClass(el, leaveFromClass);
					addTransitionClass(el, leaveToClass);
					if (!hasExplicitCallback(onLeave)) whenTransitionEnds(el, type, leaveDuration, resolve);
				});
				callHook(onLeave, [el, resolve]);
			},
			onEnterCancelled(el) {
				finishEnter(el, false, void 0, true);
				callHook(onEnterCancelled, [el]);
			},
			onAppearCancelled(el) {
				finishEnter(el, true, void 0, true);
				callHook(onAppearCancelled, [el]);
			},
			onLeaveCancelled(el) {
				finishLeave(el);
				callHook(onLeaveCancelled, [el]);
			}
		});
	}
	function normalizeDuration(duration) {
		if (duration == null) return null;
		else if (isObject(duration)) return [NumberOf(duration.enter), NumberOf(duration.leave)];
		else {
			const n = NumberOf(duration);
			return [n, n];
		}
	}
	function NumberOf(val) {
		return toNumber(val);
	}
	function addTransitionClass(el, cls) {
		cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
		(el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
	}
	function removeTransitionClass(el, cls) {
		cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
		const _vtc = el[vtcKey];
		if (_vtc) {
			_vtc.delete(cls);
			if (!_vtc.size) el[vtcKey] = void 0;
		}
	}
	function nextFrame(cb) {
		requestAnimationFrame(() => {
			requestAnimationFrame(cb);
		});
	}
	var endId = 0;
	function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
		const id = el._endId = ++endId;
		const resolveIfNotStale = () => {
			if (id === el._endId) resolve();
		};
		if (explicitTimeout != null) return setTimeout(resolveIfNotStale, explicitTimeout);
		const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
		if (!type) return resolve();
		const endEvent = type + "end";
		let ended = 0;
		const end = () => {
			el.removeEventListener(endEvent, onEnd);
			resolveIfNotStale();
		};
		const onEnd = (e) => {
			if (e.target === el && ++ended >= propCount) end();
		};
		setTimeout(() => {
			if (ended < propCount) end();
		}, timeout + 1);
		el.addEventListener(endEvent, onEnd);
	}
	function getTransitionInfo(el, expectedType) {
		const styles = window.getComputedStyle(el);
		const getStyleProperties = (key) => (styles[key] || "").split(", ");
		const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
		const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
		const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
		const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
		const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
		const animationTimeout = getTimeout(animationDelays, animationDurations);
		let type = null;
		let timeout = 0;
		let propCount = 0;
		if (expectedType === TRANSITION) {
			if (transitionTimeout > 0) {
				type = TRANSITION;
				timeout = transitionTimeout;
				propCount = transitionDurations.length;
			}
		} else if (expectedType === ANIMATION) {
			if (animationTimeout > 0) {
				type = ANIMATION;
				timeout = animationTimeout;
				propCount = animationDurations.length;
			}
		} else {
			timeout = Math.max(transitionTimeout, animationTimeout);
			type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
			propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
		}
		const hasTransform = type === TRANSITION && /\b(?:transform|all)(?:,|$)/.test(getStyleProperties(`${TRANSITION}Property`).toString());
		return {
			type,
			timeout,
			propCount,
			hasTransform
		};
	}
	function getTimeout(delays, durations) {
		while (delays.length < durations.length) delays = delays.concat(delays);
		return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
	}
	function toMs(s) {
		if (s === "auto") return 0;
		return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
	}
	function forceReflow(el) {
		return (el ? el.ownerDocument : document).body.offsetHeight;
	}
	function patchClass(el, value, isSVG) {
		const transitionClasses = el[vtcKey];
		if (transitionClasses) value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
		if (value == null) el.removeAttribute("class");
		else if (isSVG) el.setAttribute("class", value);
		else el.className = value;
	}
	var vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
	var vShowHidden = /* @__PURE__ */ Symbol("_vsh");
	var vShow = {
		name: "show",
		beforeMount(el, { value }, { transition }) {
			el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
			if (transition && value) transition.beforeEnter(el);
			else setDisplay(el, value);
		},
		mounted(el, { value }, { transition }) {
			if (transition && value) transition.enter(el);
		},
		updated(el, { value, oldValue }, { transition }) {
			if (!value === !oldValue) return;
			if (transition) {
				if (value) {
					transition.beforeEnter(el);
					setDisplay(el, true);
					transition.enter(el);
				} else transition.leave(el, () => {
					setDisplay(el, false);
				});
			} else setDisplay(el, value);
		},
		beforeUnmount(el, { value }) {
			setDisplay(el, value);
		}
	};
	function setDisplay(el, value) {
		el.style.display = value ? el[vShowOriginalDisplay] : "none";
		el[vShowHidden] = !value;
	}
	function initVShowForSSR() {
		vShow.getSSRProps = ({ value }) => {
			if (!value) return { style: { display: "none" } };
		};
	}
	var CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
	function useCssVars(getter) {
		const instance = getCurrentInstance();
		if (!instance) return;
		const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
			Array.from(document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)).forEach((node) => setVarsOnNode(node, vars));
		};
		const setVars = () => {
			const vars = getter(instance.proxy);
			if (instance.ce) setVarsOnNode(instance.ce, vars);
			else setVarsOnVNode(instance.subTree, vars);
			updateTeleports(vars);
		};
		onBeforeUpdate(() => {
			queuePostFlushCb(setVars);
		});
		onMounted(() => {
			watch(setVars, NOOP, { flush: "post" });
			const ob = new MutationObserver(setVars);
			ob.observe(instance.subTree.el.parentNode, { childList: true });
			onUnmounted(() => ob.disconnect());
		});
	}
	function setVarsOnVNode(vnode, vars) {
		if (vnode.shapeFlag & 128) {
			const suspense = vnode.suspense;
			vnode = suspense.activeBranch;
			if (suspense.pendingBranch && !suspense.isHydrating) suspense.effects.push(() => {
				setVarsOnVNode(suspense.activeBranch, vars);
			});
		}
		while (vnode.component) vnode = vnode.component.subTree;
		if (vnode.shapeFlag & 1 && vnode.el) setVarsOnNode(vnode.el, vars);
		else if (vnode.type === Fragment) vnode.children.forEach((c) => setVarsOnVNode(c, vars));
		else if (vnode.type === Static) {
			let { el, anchor } = vnode;
			while (el) {
				setVarsOnNode(el, vars);
				if (el === anchor) break;
				el = el.nextSibling;
			}
		}
	}
	function setVarsOnNode(el, vars) {
		if (el.nodeType === 1) {
			const style = el.style;
			let cssText = "";
			for (const key in vars) {
				const value = normalizeCssVarValue(vars[key]);
				style.setProperty(`--${key}`, value);
				cssText += `--${key}: ${value};`;
			}
			style[CSS_VAR_TEXT] = cssText;
		}
	}
	var displayRE = /(?:^|;)\s*display\s*:/;
	function patchStyle(el, prev, next) {
		const style = el.style;
		const isCssString = isString(next);
		let hasControlledDisplay = false;
		if (next && !isCssString) {
			if (prev) {
				if (!isString(prev)) {
					for (const key in prev) if (next[key] == null) setStyle(style, key, "");
				} else for (const prevStyle of prev.split(";")) {
					const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
					if (next[key] == null) setStyle(style, key, "");
				}
			}
			for (const key in next) {
				if (key === "display") hasControlledDisplay = true;
				const value = next[key];
				if (value != null) {
					if (!shouldPreserveTextareaResizeStyle(el, key, !isString(prev) && prev ? prev[key] : void 0, value)) setStyle(style, key, value);
				} else setStyle(style, key, "");
			}
		} else if (isCssString) {
			if (prev !== next) {
				const cssVarText = style[CSS_VAR_TEXT];
				if (cssVarText) next += ";" + cssVarText;
				style.cssText = next;
				hasControlledDisplay = displayRE.test(next);
			}
		} else if (prev) el.removeAttribute("style");
		if (vShowOriginalDisplay in el) {
			el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
			if (el[vShowHidden]) style.display = "none";
		}
	}
	var importantRE = /\s*!important$/;
	function setStyle(style, name, val) {
		if (isArray(val)) val.forEach((v) => setStyle(style, name, v));
		else {
			if (val == null) val = "";
			if (name.startsWith("--")) {
				if (importantRE.test(val)) style.setProperty(name, val.replace(importantRE, ""), "important");
				else style.setProperty(name, val);
			} else {
				const prefixed = autoPrefix(style, name);
				if (importantRE.test(val)) style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
				else style[prefixed] = val;
			}
		}
	}
	var prefixes = [
		"Webkit",
		"Moz",
		"ms"
	];
	var prefixCache = {};
	function autoPrefix(style, rawName) {
		const cached = prefixCache[rawName];
		if (cached) return cached;
		let name = camelize$1(rawName);
		if (name !== "filter" && name in style) return prefixCache[rawName] = name;
		name = capitalize(name);
		for (let i = 0; i < prefixes.length; i++) {
			const prefixed = prefixes[i] + name;
			if (prefixed in style) return prefixCache[rawName] = prefixed;
		}
		return rawName;
	}
	function shouldPreserveTextareaResizeStyle(el, key, prev, next) {
		return el.tagName === "TEXTAREA" && (key === "width" || key === "height") && isString(next) && prev === next;
	}
	var xlinkNS = "http://www.w3.org/1999/xlink";
	function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
		if (isSVG && key.startsWith("xlink:")) {
			if (value == null) el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
			else el.setAttributeNS(xlinkNS, key, value);
		} else if (value == null || isBoolean && !includeBooleanAttr(value)) el.removeAttribute(key);
		else el.setAttribute(key, isBoolean ? "" : isSymbol(value) ? String(value) : value);
	}
	function patchDOMProp(el, key, value, parentComponent, attrName) {
		if (key === "innerHTML" || key === "textContent") {
			if (value != null) el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
			return;
		}
		const tag = el.tagName;
		if (key === "value" && tag !== "PROGRESS" && !tag.includes("-")) {
			const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
			const newValue = value == null ? el.type === "checkbox" ? "on" : "" : String(value);
			if (oldValue !== newValue || !("_value" in el)) el.value = newValue;
			if (value == null) el.removeAttribute(key);
			el._value = value;
			return;
		}
		let needRemove = false;
		if (value === "" || value == null) {
			const type = typeof el[key];
			if (type === "boolean") value = includeBooleanAttr(value);
			else if (value == null && type === "string") {
				value = "";
				needRemove = true;
			} else if (type === "number") {
				value = 0;
				needRemove = true;
			}
		}
		try {
			el[key] = value;
		} catch (e) {}
		needRemove && el.removeAttribute(attrName || key);
	}
	function addEventListener(el, event, handler, options) {
		el.addEventListener(event, handler, options);
	}
	function removeEventListener(el, event, handler, options) {
		el.removeEventListener(event, handler, options);
	}
	var veiKey = /* @__PURE__ */ Symbol("_vei");
	function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
		const invokers = el[veiKey] || (el[veiKey] = {});
		const existingInvoker = invokers[rawName];
		if (nextValue && existingInvoker) existingInvoker.value = nextValue;
		else {
			const [name, options] = parseName(rawName);
			if (nextValue) addEventListener(el, name, invokers[rawName] = createInvoker(nextValue, instance), options);
			else if (existingInvoker) {
				removeEventListener(el, name, existingInvoker, options);
				invokers[rawName] = void 0;
			}
		}
	}
	var optionsModifierRE = /(Once|Passive|Capture)$/;
	var optionsModifierEventRE = /^on:?(?:Once|Passive|Capture)$/;
	function parseName(name) {
		let options;
		let m;
		while ((m = name.match(optionsModifierRE)) && !optionsModifierEventRE.test(name)) {
			if (!options) options = {};
			name = name.slice(0, name.length - m[1].length);
			options[m[1].toLowerCase()] = true;
		}
		return [name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2)), options];
	}
	var cachedNow = 0;
	var p = /* @__PURE__ */ Promise.resolve();
	var getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
	function createInvoker(initialValue, instance) {
		const invoker = (e) => {
			if (!e._vts) e._vts = Date.now();
			else if (e._vts <= invoker.attached) return;
			const value = invoker.value;
			if (isArray(value)) {
				const originalStop = e.stopImmediatePropagation;
				e.stopImmediatePropagation = () => {
					originalStop.call(e);
					e._stopped = true;
				};
				const handlers = value.slice();
				const args = [e];
				for (let i = 0; i < handlers.length; i++) {
					if (e._stopped) break;
					const handler = handlers[i];
					if (handler) callWithAsyncErrorHandling(handler, instance, 5, args);
				}
			} else callWithAsyncErrorHandling(value, instance, 5, [e]);
		};
		invoker.value = initialValue;
		invoker.attached = getNow();
		return invoker;
	}
	var isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
	var patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
		const isSVG = namespace === "svg";
		if (key === "class") patchClass(el, nextValue, isSVG);
		else if (key === "style") patchStyle(el, prevValue, nextValue);
		else if (isOn(key)) {
			if (!isModelListener(key)) patchEvent(el, key, prevValue, nextValue, parentComponent);
		} else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
			patchDOMProp(el, key, nextValue);
			if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
		} else if (el._isVueCE && (shouldSetAsPropForVueCE(el, key) || el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString(nextValue)))) patchDOMProp(el, camelize$1(key), nextValue, parentComponent, key);
		else {
			if (key === "true-value") el._trueValue = nextValue;
			else if (key === "false-value") el._falseValue = nextValue;
			patchAttr(el, key, nextValue, isSVG);
		}
	};
	function shouldSetAsProp(el, key, value, isSVG) {
		if (isSVG) {
			if (key === "innerHTML" || key === "textContent") return true;
			if (key in el && isNativeOn(key) && isFunction(value)) return true;
			return false;
		}
		if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") return false;
		if (key === "sandbox" && el.tagName === "IFRAME") return false;
		if (key === "form") return false;
		if (key === "list" && el.tagName === "INPUT") return false;
		if (key === "type" && el.tagName === "TEXTAREA") return false;
		if (key === "width" || key === "height") {
			const tag = el.tagName;
			if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") return false;
		}
		if (isNativeOn(key) && isString(value)) return false;
		return key in el;
	}
	function shouldSetAsPropForVueCE(el, key) {
		const props = el._def.props;
		if (!props) return false;
		const camelKey = camelize$1(key);
		return Array.isArray(props) ? props.some((prop) => camelize$1(prop) === camelKey) : Object.keys(props).some((prop) => camelize$1(prop) === camelKey);
	}
	var REMOVAL = {};
	// @__NO_SIDE_EFFECTS__
	function defineCustomElement(options, extraOptions, _createApp) {
		let Comp = /* @__PURE__ */ defineComponent(options, extraOptions);
		if (isPlainObject(Comp)) Comp = extend$2({}, Comp, extraOptions);
		class VueCustomElement extends VueElement {
			constructor(initialProps) {
				super(Comp, initialProps, _createApp);
			}
		}
		VueCustomElement.def = Comp;
		return VueCustomElement;
	}
	var defineSSRCustomElement = /* @__NO_SIDE_EFFECTS__ */ ((options, extraOptions) => {
		return /* @__PURE__ */ defineCustomElement(options, extraOptions, createSSRApp);
	});
	var BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {};
	var VueElement = class VueElement extends BaseClass {
		constructor(_def, _props = {}, _createApp = createApp) {
			super();
			this._def = _def;
			this._props = _props;
			this._createApp = _createApp;
			this._isVueCE = true;
			/**
			* @internal
			*/
			this._instance = null;
			/**
			* @internal
			*/
			this._app = null;
			/**
			* @internal
			*/
			this._nonce = this._def.nonce;
			this._connected = false;
			this._resolved = false;
			this._patching = false;
			this._dirty = false;
			this._numberProps = null;
			this._styleChildren = /* @__PURE__ */ new WeakSet();
			this._styleAnchors = /* @__PURE__ */ new WeakMap();
			this._ob = null;
			if (this.shadowRoot && _createApp !== createApp) this._root = this.shadowRoot;
			else if (_def.shadowRoot !== false) {
				this.attachShadow(extend$2({}, _def.shadowRootOptions, { mode: "open" }));
				this._root = this.shadowRoot;
			} else this._root = this;
		}
		connectedCallback() {
			if (!this.isConnected) return;
			if (!this.shadowRoot && !this._resolved) this._parseSlots();
			this._connected = true;
			let parent = this;
			while (parent = parent && (parent.assignedSlot || parent.parentNode || parent.host)) if (parent instanceof VueElement) {
				this._parent = parent;
				break;
			}
			if (!this._instance) {
				if (this._resolved) this._mount(this._def);
				else if (parent && parent._pendingResolve) this._pendingResolve = parent._pendingResolve.then(() => {
					this._pendingResolve = void 0;
					if (this.isConnected) return this._resolveDef();
				});
				else this._resolveDef();
			}
		}
		_setParent(parent = this._parent) {
			if (parent) {
				this._instance.parent = parent._instance;
				this._inheritParentContext(parent);
			}
		}
		_inheritParentContext(parent = this._parent) {
			if (parent && this._app) Object.setPrototypeOf(this._app._context.provides, parent._instance.provides);
		}
		disconnectedCallback() {
			this._connected = false;
			nextTick(() => {
				if (!this._connected) {
					if (this._ob) {
						this._ob.disconnect();
						this._ob = null;
					}
					this._app && this._app.unmount();
					if (this._instance) this._instance.ce = void 0;
					this._app = this._instance = null;
					if (this._teleportTargets) {
						this._teleportTargets.clear();
						this._teleportTargets = void 0;
					}
				}
			});
		}
		_processMutations(mutations) {
			for (const m of mutations) this._setAttr(m.attributeName);
		}
		/**
		* resolve inner component definition (handle possible async component)
		*/
		_resolveDef() {
			if (this._pendingResolve) return this._pendingResolve;
			for (let i = 0; i < this.attributes.length; i++) this._setAttr(this.attributes[i].name);
			this._ob = new MutationObserver(this._processMutations.bind(this));
			this._ob.observe(this, { attributes: true });
			const resolve = (def, isAsync = false) => {
				this._resolved = true;
				this._pendingResolve = void 0;
				const { props, styles } = def;
				let numberProps;
				if (props && !isArray(props)) for (const key in props) {
					const opt = props[key];
					if (opt === Number || opt && opt.type === Number) {
						if (key in this._props) this._props[key] = toNumber(this._props[key]);
						(numberProps || (numberProps = /* @__PURE__ */ Object.create(null)))[camelize$1(key)] = true;
					}
				}
				this._numberProps = numberProps;
				this._resolveProps(def);
				if (this.shadowRoot) this._applyStyles(styles);
				this._mount(def);
			};
			const asyncDef = this._def.__asyncLoader;
			if (asyncDef) {
				this._pendingResolve = asyncDef().then((def) => {
					def.configureApp = this._def.configureApp;
					resolve(this._def = def, true);
				});
				return this._pendingResolve;
			} else resolve(this._def);
		}
		_mount(def) {
			if (!def.name) def.name = "VueElement";
			this._app = this._createApp(def);
			this._inheritParentContext();
			if (def.configureApp) def.configureApp(this._app);
			this._app._ceVNode = this._createVNode();
			this._app.mount(this._root);
			const exposed = this._instance && this._instance.exposed;
			if (!exposed) return;
			for (const key in exposed) if (!hasOwn(this, key)) Object.defineProperty(this, key, { get: () => unref(exposed[key]) });
		}
		_resolveProps(def) {
			const { props } = def;
			const declaredPropKeys = isArray(props) ? props : Object.keys(props || {});
			for (const key of Object.keys(this)) if (key[0] !== "_" && declaredPropKeys.includes(key)) this._setProp(key, this[key]);
			for (const key of declaredPropKeys.map(camelize$1)) Object.defineProperty(this, key, {
				get() {
					return this._getProp(key);
				},
				set(val) {
					this._setProp(key, val, true, !this._patching);
				}
			});
		}
		_setAttr(key) {
			if (key.startsWith("data-v-")) return;
			const has = this.hasAttribute(key);
			let value = has ? this.getAttribute(key) : REMOVAL;
			const camelKey = camelize$1(key);
			if (has && this._numberProps && this._numberProps[camelKey]) value = toNumber(value);
			this._setProp(camelKey, value, false, true);
		}
		/**
		* @internal
		*/
		_getProp(key) {
			return this._props[key];
		}
		/**
		* @internal
		*/
		_setProp(key, val, shouldReflect = true, shouldUpdate = false) {
			if (val !== this._props[key]) {
				this._dirty = true;
				if (val === REMOVAL) delete this._props[key];
				else {
					this._props[key] = val;
					if (key === "key" && this._app) this._app._ceVNode.key = val;
				}
				if (shouldUpdate && this._instance) this._update();
				if (shouldReflect) {
					const ob = this._ob;
					if (ob) {
						this._processMutations(ob.takeRecords());
						ob.disconnect();
					}
					if (val === true) this.setAttribute(hyphenate(key), "");
					else if (typeof val === "string" || typeof val === "number") this.setAttribute(hyphenate(key), val + "");
					else if (!val) this.removeAttribute(hyphenate(key));
					ob && ob.observe(this, { attributes: true });
				}
			}
		}
		_update() {
			const vnode = this._createVNode();
			if (this._app) vnode.appContext = this._app._context;
			render$1(vnode, this._root);
		}
		_createVNode() {
			const baseProps = {};
			if (!this.shadowRoot) baseProps.onVnodeMounted = baseProps.onVnodeUpdated = this._renderSlots.bind(this);
			const vnode = createVNode(this._def, extend$2(baseProps, this._props));
			if (!this._instance) vnode.ce = (instance) => {
				this._instance = instance;
				instance.ce = this;
				instance.isCE = true;
				const dispatch = (event, args) => {
					this.dispatchEvent(new CustomEvent(event, isPlainObject(args[0]) ? extend$2({ detail: args }, args[0]) : { detail: args }));
				};
				instance.emit = (event, ...args) => {
					dispatch(event, args);
					if (hyphenate(event) !== event) dispatch(hyphenate(event), args);
				};
				this._setParent();
			};
			return vnode;
		}
		_applyStyles(styles, owner, parentComp) {
			if (!styles) return;
			if (owner) {
				if (owner === this._def || this._styleChildren.has(owner)) return;
				this._styleChildren.add(owner);
			}
			const nonce = this._nonce;
			const root = this.shadowRoot;
			const insertionAnchor = parentComp ? this._getStyleAnchor(parentComp) || this._getStyleAnchor(this._def) : this._getRootStyleInsertionAnchor(root);
			let last = null;
			for (let i = styles.length - 1; i >= 0; i--) {
				const s = document.createElement("style");
				if (nonce) s.setAttribute("nonce", nonce);
				s.textContent = styles[i];
				root.insertBefore(s, last || insertionAnchor);
				last = s;
				if (i === 0) {
					if (!parentComp) this._styleAnchors.set(this._def, s);
					if (owner) this._styleAnchors.set(owner, s);
				}
			}
		}
		_getStyleAnchor(comp) {
			if (!comp) return null;
			const anchor = this._styleAnchors.get(comp);
			if (anchor && anchor.parentNode === this.shadowRoot) return anchor;
			if (anchor) this._styleAnchors.delete(comp);
			return null;
		}
		_getRootStyleInsertionAnchor(root) {
			for (let i = 0; i < root.childNodes.length; i++) {
				const node = root.childNodes[i];
				if (!(node instanceof HTMLStyleElement)) return node;
			}
			return null;
		}
		/**
		* Only called when shadowRoot is false
		*/
		_parseSlots() {
			const slots = this._slots = {};
			let n;
			while (n = this.firstChild) {
				const slotName = n.nodeType === 1 && n.getAttribute("slot") || "default";
				(slots[slotName] || (slots[slotName] = [])).push(n);
				this.removeChild(n);
			}
		}
		/**
		* Only called when shadowRoot is false
		*/
		_renderSlots() {
			const outlets = this._getSlots();
			const scopeId = this._instance.type.__scopeId;
			for (let i = 0; i < outlets.length; i++) {
				const o = outlets[i];
				const slotName = o.getAttribute("name") || "default";
				const content = this._slots[slotName];
				const parent = o.parentNode;
				if (content) for (const n of content) {
					if (scopeId && n.nodeType === 1) {
						const id = scopeId + "-s";
						const walker = document.createTreeWalker(n, 1);
						n.setAttribute(id, "");
						let child;
						while (child = walker.nextNode()) child.setAttribute(id, "");
					}
					parent.insertBefore(n, o);
				}
				else while (o.firstChild) parent.insertBefore(o.firstChild, o);
				parent.removeChild(o);
			}
		}
		/**
		* @internal
		*/
		_getSlots() {
			const roots = [this];
			if (this._teleportTargets) roots.push(...this._teleportTargets);
			const slots = /* @__PURE__ */ new Set();
			for (const root of roots) {
				const found = root.querySelectorAll("slot");
				for (let i = 0; i < found.length; i++) slots.add(found[i]);
			}
			return Array.from(slots);
		}
		/**
		* @internal
		*/
		_injectChildStyle(comp, parentComp) {
			this._applyStyles(comp.styles, comp, parentComp);
		}
		/**
		* @internal
		*/
		_beginPatch() {
			this._patching = true;
			this._dirty = false;
		}
		/**
		* @internal
		*/
		_endPatch() {
			this._patching = false;
			if (this._dirty && this._instance) this._update();
		}
		/**
		* @internal
		*/
		_hasShadowRoot() {
			return this._def.shadowRoot !== false;
		}
		/**
		* @internal
		*/
		_removeChildStyle(comp) {}
	};
	function useHost(caller) {
		const instance = getCurrentInstance();
		const el = instance && instance.ce;
		if (el) return el;
		return null;
	}
	function useShadowRoot() {
		const el = useHost();
		return el && el.shadowRoot;
	}
	function useCssModule(name = "$style") {
		{
			const instance = getCurrentInstance();
			if (!instance) return EMPTY_OBJ;
			const modules = instance.type.__cssModules;
			if (!modules) return EMPTY_OBJ;
			const mod = modules[name];
			if (!mod) return EMPTY_OBJ;
			return mod;
		}
	}
	var positionMap = /* @__PURE__ */ new WeakMap();
	var newPositionMap = /* @__PURE__ */ new WeakMap();
	var moveCbKey = /* @__PURE__ */ Symbol("_moveCb");
	var enterCbKey = /* @__PURE__ */ Symbol("_enterCb");
	var decorate = (t) => {
		delete t.props.mode;
		return t;
	};
	var TransitionGroup = /* @__PURE__ */ decorate({
		name: "TransitionGroup",
		props: /* @__PURE__ */ extend$2({}, TransitionPropsValidators, {
			tag: String,
			moveClass: String
		}),
		setup(props, { slots }) {
			const instance = getCurrentInstance();
			const state = useTransitionState();
			let prevChildren;
			let children;
			onUpdated(() => {
				if (!prevChildren.length) return;
				const moveClass = props.moveClass || `${props.name || "v"}-move`;
				if (!hasCSSTransform(prevChildren[0].el, instance.vnode.el, moveClass)) {
					prevChildren = [];
					return;
				}
				prevChildren.forEach(callPendingCbs);
				prevChildren.forEach(recordPosition);
				const movedChildren = prevChildren.filter(applyTranslation);
				forceReflow(instance.vnode.el);
				movedChildren.forEach((c) => {
					const el = c.el;
					const style = el.style;
					addTransitionClass(el, moveClass);
					style.transform = style.webkitTransform = style.transitionDuration = "";
					const cb = el[moveCbKey] = (e) => {
						if (e && e.target !== el) return;
						if (!e || e.propertyName.endsWith("transform")) {
							el.removeEventListener("transitionend", cb);
							el[moveCbKey] = null;
							removeTransitionClass(el, moveClass);
						}
					};
					el.addEventListener("transitionend", cb);
				});
				prevChildren = [];
			});
			return () => {
				const rawProps = /* @__PURE__ */ toRaw(props);
				const cssTransitionProps = resolveTransitionProps(rawProps);
				let tag = rawProps.tag || Fragment;
				prevChildren = [];
				if (children) for (let i = 0; i < children.length; i++) {
					const child = children[i];
					if (child.el && child.el instanceof Element && !child.el[vShowHidden]) {
						prevChildren.push(child);
						setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
						positionMap.set(child, getPosition(child.el));
					}
				}
				children = slots.default ? getTransitionRawChildren(slots.default()) : [];
				for (let i = 0; i < children.length; i++) {
					const child = children[i];
					if (child.key != null) setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
				}
				return createVNode(tag, null, children);
			};
		}
	});
	function callPendingCbs(c) {
		const el = c.el;
		if (el[moveCbKey]) el[moveCbKey]();
		if (el[enterCbKey]) el[enterCbKey]();
	}
	function recordPosition(c) {
		newPositionMap.set(c, getPosition(c.el));
	}
	function applyTranslation(c) {
		const oldPos = positionMap.get(c);
		const newPos = newPositionMap.get(c);
		const dx = oldPos.left - newPos.left;
		const dy = oldPos.top - newPos.top;
		if (dx || dy) {
			const el = c.el;
			const s = el.style;
			const rect = el.getBoundingClientRect();
			let scaleX = 1;
			let scaleY = 1;
			if (el.offsetWidth) scaleX = rect.width / el.offsetWidth;
			if (el.offsetHeight) scaleY = rect.height / el.offsetHeight;
			if (!Number.isFinite(scaleX) || scaleX === 0) scaleX = 1;
			if (!Number.isFinite(scaleY) || scaleY === 0) scaleY = 1;
			if (Math.abs(scaleX - 1) < .01) scaleX = 1;
			if (Math.abs(scaleY - 1) < .01) scaleY = 1;
			s.transform = s.webkitTransform = `translate(${dx / scaleX}px,${dy / scaleY}px)`;
			s.transitionDuration = "0s";
			return c;
		}
	}
	function getPosition(el) {
		const rect = el.getBoundingClientRect();
		return {
			left: rect.left,
			top: rect.top
		};
	}
	function hasCSSTransform(el, root, moveClass) {
		const clone = el.cloneNode();
		const _vtc = el[vtcKey];
		if (_vtc) _vtc.forEach((cls) => {
			cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
		});
		moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
		clone.style.display = "none";
		const container = root.nodeType === 1 ? root : root.parentNode;
		container.appendChild(clone);
		const { hasTransform } = getTransitionInfo(clone);
		container.removeChild(clone);
		return hasTransform;
	}
	var getModelAssigner = (vnode) => {
		const fn = vnode.props["onUpdate:modelValue"] || false;
		return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
	};
	function onCompositionStart(e) {
		e.target.composing = true;
	}
	function onCompositionEnd(e) {
		const target = e.target;
		if (target.composing) {
			target.composing = false;
			target.dispatchEvent(new Event("input"));
		}
	}
	var assignKey = /* @__PURE__ */ Symbol("_assign");
	var initialValueKey = /* @__PURE__ */ Symbol("_initialValue");
	function castValue(value, trim, number) {
		if (trim) value = value.trim();
		if (number) value = looseToNumber(value);
		return value;
	}
	var vModelText = {
		created(el, { modifiers: { lazy, trim, number } }, vnode) {
			if (el.parentNode) {
				if (el.type === "text") el[initialValueKey] = el.defaultValue.replace(/[\r\n]/g, "");
				else if (el.type === "textarea") el[initialValueKey] = el.defaultValue.replace(/\r\n?/g, "\n");
			}
			el[assignKey] = getModelAssigner(vnode);
			const castToNumber = number || vnode.props && vnode.props.type === "number";
			addEventListener(el, lazy ? "change" : "input", (e) => {
				if (e.target.composing) return;
				el[assignKey](castValue(el.value, trim, castToNumber));
			});
			if (trim || castToNumber) addEventListener(el, "change", () => {
				el.value = castValue(el.value, trim, castToNumber);
			});
			if (!lazy) {
				addEventListener(el, "compositionstart", onCompositionStart);
				addEventListener(el, "compositionend", onCompositionEnd);
				addEventListener(el, "change", onCompositionEnd);
			}
		},
		mounted(el, { value, modifiers: { trim, number } }) {
			const newValue = value == null ? "" : value;
			const initialValue = el[initialValueKey];
			delete el[initialValueKey];
			if (initialValue !== void 0 && (el.type === "text" || el.type === "textarea") && el.value !== initialValue) el[assignKey](castValue(el.value, trim, number));
			else el.value = newValue;
		},
		beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
			el[assignKey] = getModelAssigner(vnode);
			if (el.composing) return;
			const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
			const newValue = value == null ? "" : value;
			if (elValue === newValue) return;
			const rootNode = el.getRootNode();
			if ((rootNode instanceof Document || rootNode instanceof ShadowRoot) && rootNode.activeElement === el && el.type !== "range") {
				if (lazy && value === oldValue) return;
				if (trim && el.value.trim() === newValue) return;
			}
			el.value = newValue;
		}
	};
	var vModelCheckbox = {
		deep: true,
		created(el, _, vnode) {
			el[assignKey] = getModelAssigner(vnode);
			addEventListener(el, "change", () => {
				const modelValue = el._modelValue;
				const elementValue = getValue(el);
				const checked = el.checked;
				const assign = el[assignKey];
				if (isArray(modelValue)) {
					const index = looseIndexOf(modelValue, elementValue);
					const found = index !== -1;
					if (checked && !found) assign(modelValue.concat(elementValue));
					else if (!checked && found) {
						const filtered = [...modelValue];
						filtered.splice(index, 1);
						assign(filtered);
					}
				} else if (isSet(modelValue)) {
					const cloned = new Set(modelValue);
					if (checked) cloned.add(elementValue);
					else cloned.delete(elementValue);
					assign(cloned);
				} else assign(getCheckboxValue(el, checked));
			});
		},
		mounted: setChecked,
		beforeUpdate(el, binding, vnode) {
			el[assignKey] = getModelAssigner(vnode);
			setChecked(el, binding, vnode);
		}
	};
	function setChecked(el, { value, oldValue }, vnode) {
		el._modelValue = value;
		let checked;
		if (isArray(value)) checked = looseIndexOf(value, vnode.props.value) > -1;
		else if (isSet(value)) checked = value.has(vnode.props.value);
		else {
			if (value === oldValue) return;
			checked = looseEqual(value, getCheckboxValue(el, true));
		}
		if (el.checked !== checked) el.checked = checked;
	}
	var vModelRadio = {
		created(el, { value }, vnode) {
			el.checked = looseEqual(value, vnode.props.value);
			el[assignKey] = getModelAssigner(vnode);
			addEventListener(el, "change", () => {
				el[assignKey](getValue(el));
			});
		},
		beforeUpdate(el, { value, oldValue }, vnode) {
			el[assignKey] = getModelAssigner(vnode);
			if (value !== oldValue) el.checked = looseEqual(value, vnode.props.value);
		}
	};
	var vModelSelect = {
		deep: true,
		created(el, { value, modifiers: { number } }, vnode) {
			el._modelValue = value;
			addEventListener(el, "change", () => {
				const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map((o) => number ? looseToNumber(getValue(o)) : getValue(o));
				const multiple = el.multiple;
				const assignedValue = multiple ? isSet(el._modelValue) ? new Set(selectedVal) : selectedVal : selectedVal[0];
				const pending = el._pendingValue = [multiple, multiple ? isArray(assignedValue) ? selectedVal.slice() : selectedVal : assignedValue];
				try {
					el[assignKey](assignedValue);
				} finally {
					nextTick(() => {
						if (el._pendingValue === pending) el._pendingValue = void 0;
					});
				}
			});
			el[assignKey] = getModelAssigner(vnode);
		},
		mounted(el, { value }) {
			setSelected(el, value);
		},
		beforeUpdate(el, { value }, vnode) {
			el._modelValue = value;
			el[assignKey] = getModelAssigner(vnode);
		},
		updated(el, { value }) {
			const pending = el._pendingValue;
			el._pendingValue = void 0;
			if (!pending || pending[0] !== el.multiple || !isSameSelectValue(value, pending[1], pending[0])) setSelected(el, value);
		}
	};
	function isSameSelectValue(value, assignedValue, multiple) {
		if (!multiple) return looseEqual(value, assignedValue);
		if (isArray(value)) return looseEqual(value, assignedValue);
		if (isSet(value)) {
			if (value.size !== assignedValue.length) return false;
			for (const item of assignedValue) if (!value.has(item)) return false;
			return true;
		}
		return false;
	}
	function setSelected(el, value) {
		const isMultiple = el.multiple;
		const isArrayValue = isArray(value);
		if (isMultiple && !isArrayValue && !isSet(value)) return;
		for (let i = 0, l = el.options.length; i < l; i++) {
			const option = el.options[i];
			const optionValue = getValue(option);
			if (isMultiple) {
				if (isArrayValue) {
					const optionType = typeof optionValue;
					if (optionType === "string" || optionType === "number") option.selected = value.some((v) => String(v) === String(optionValue));
					else option.selected = looseIndexOf(value, optionValue) > -1;
				} else option.selected = value.has(optionValue);
			} else if (looseEqual(getValue(option), value)) {
				if (el.selectedIndex !== i) el.selectedIndex = i;
				return;
			}
		}
		if (!isMultiple && el.selectedIndex !== -1) el.selectedIndex = -1;
	}
	function getValue(el) {
		return "_value" in el ? el._value : el.value;
	}
	function getCheckboxValue(el, checked) {
		const key = checked ? "_trueValue" : "_falseValue";
		return key in el ? el[key] : checked;
	}
	var vModelDynamic = {
		created(el, binding, vnode) {
			callModelHook(el, binding, vnode, null, "created");
		},
		mounted(el, binding, vnode) {
			callModelHook(el, binding, vnode, null, "mounted");
		},
		beforeUpdate(el, binding, vnode, prevVNode) {
			callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
		},
		updated(el, binding, vnode, prevVNode) {
			callModelHook(el, binding, vnode, prevVNode, "updated");
		}
	};
	function resolveDynamicModel(tagName, type) {
		switch (tagName) {
			case "SELECT": return vModelSelect;
			case "TEXTAREA": return vModelText;
			default: switch (type) {
				case "checkbox": return vModelCheckbox;
				case "radio": return vModelRadio;
				default: return vModelText;
			}
		}
	}
	function callModelHook(el, binding, vnode, prevVNode, hook) {
		const fn = resolveDynamicModel(el.tagName, vnode.props && vnode.props.type)[hook];
		fn && fn(el, binding, vnode, prevVNode);
	}
	function initVModelForSSR() {
		vModelText.getSSRProps = ({ value }) => ({ value });
		vModelRadio.getSSRProps = ({ value }, vnode) => {
			if (vnode.props && looseEqual(vnode.props.value, value)) return { checked: true };
		};
		vModelCheckbox.getSSRProps = ({ value }, vnode) => {
			if (isArray(value)) {
				if (vnode.props && looseIndexOf(value, vnode.props.value) > -1) return { checked: true };
			} else if (isSet(value)) {
				if (vnode.props && value.has(vnode.props.value)) return { checked: true };
			} else if (value) return { checked: true };
		};
		vModelDynamic.getSSRProps = (binding, vnode) => {
			if (typeof vnode.type !== "string") return;
			const modelToUse = resolveDynamicModel(vnode.type.toUpperCase(), vnode.props && vnode.props.type);
			if (modelToUse.getSSRProps) return modelToUse.getSSRProps(binding, vnode);
		};
	}
	var systemModifiers = [
		"ctrl",
		"shift",
		"alt",
		"meta"
	];
	var modifierGuards = {
		stop: (e) => e.stopPropagation(),
		prevent: (e) => e.preventDefault(),
		self: (e) => e.target !== e.currentTarget,
		ctrl: (e) => !e.ctrlKey,
		shift: (e) => !e.shiftKey,
		alt: (e) => !e.altKey,
		meta: (e) => !e.metaKey,
		left: (e) => "button" in e && e.button !== 0,
		middle: (e) => "button" in e && e.button !== 1,
		right: (e) => "button" in e && e.button !== 2,
		exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
	};
	var withModifiers = (fn, modifiers) => {
		if (!fn) return fn;
		const cache = fn._withMods || (fn._withMods = {});
		const cacheKey = modifiers.join(".");
		return cache[cacheKey] || (cache[cacheKey] = ((event, ...args) => {
			for (let i = 0; i < modifiers.length; i++) {
				const guard = modifierGuards[modifiers[i]];
				if (guard && guard(event, modifiers)) return;
			}
			return fn(event, ...args);
		}));
	};
	var keyNames = {
		esc: "escape",
		space: " ",
		up: "arrow-up",
		left: "arrow-left",
		right: "arrow-right",
		down: "arrow-down",
		delete: "backspace"
	};
	var withKeys = (fn, modifiers) => {
		const cache = fn._withKeys || (fn._withKeys = {});
		const cacheKey = modifiers.join(".");
		return cache[cacheKey] || (cache[cacheKey] = ((event) => {
			if (!("key" in event)) return;
			const eventKey = hyphenate(event.key);
			if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) return fn(event);
		}));
	};
	var rendererOptions = /* @__PURE__ */ extend$2({ patchProp }, nodeOps);
	var renderer;
	var enabledHydration = false;
	function ensureRenderer() {
		return renderer || (renderer = createRenderer(rendererOptions));
	}
	function ensureHydrationRenderer() {
		renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
		enabledHydration = true;
		return renderer;
	}
	var render$1 = ((...args) => {
		ensureRenderer().render(...args);
	});
	var hydrate = ((...args) => {
		ensureHydrationRenderer().hydrate(...args);
	});
	var createApp = ((...args) => {
		const app = ensureRenderer().createApp(...args);
		const { mount } = app;
		app.mount = (containerOrSelector) => {
			const container = normalizeContainer(containerOrSelector);
			if (!container) return;
			const component = app._component;
			if (!isFunction(component) && !component.render && !component.template) component.template = container.innerHTML;
			if (container.nodeType === 1) container.textContent = "";
			const proxy = mount(container, false, resolveRootNamespace(container));
			if (container instanceof Element) {
				container.removeAttribute("v-cloak");
				container.setAttribute("data-v-app", "");
			}
			return proxy;
		};
		return app;
	});
	var createSSRApp = ((...args) => {
		const app = ensureHydrationRenderer().createApp(...args);
		const { mount } = app;
		app.mount = (containerOrSelector) => {
			const container = normalizeContainer(containerOrSelector);
			if (container) return mount(container, true, resolveRootNamespace(container));
		};
		return app;
	});
	function resolveRootNamespace(container) {
		if (container instanceof SVGElement) return "svg";
		if (typeof MathMLElement === "function" && container instanceof MathMLElement) return "mathml";
	}
	function normalizeContainer(container) {
		if (isString(container)) return document.querySelector(container);
		return container;
	}
	var ssrDirectiveInitialized = false;
	var initDirectivesForSSR = () => {
		if (!ssrDirectiveInitialized) {
			ssrDirectiveInitialized = true;
			initVModelForSSR();
			initVShowForSSR();
		}
	};
	//#endregion
	//#region node_modules/vue/dist/vue.runtime.esm-bundler.js
	var vue_runtime_esm_bundler_exports = /* @__PURE__ */ __exportAll({
		BaseTransition: () => BaseTransition,
		BaseTransitionPropsValidators: () => BaseTransitionPropsValidators,
		Comment: () => Comment,
		DeprecationTypes: () => null,
		EffectScope: () => EffectScope,
		ErrorCodes: () => ErrorCodes,
		ErrorTypeStrings: () => ErrorTypeStrings,
		Fragment: () => Fragment,
		KeepAlive: () => KeepAlive,
		ReactiveEffect: () => ReactiveEffect,
		Static: () => Static,
		Suspense: () => Suspense,
		Teleport: () => Teleport,
		Text: () => Text,
		TrackOpTypes: () => TrackOpTypes,
		Transition: () => Transition,
		TransitionGroup: () => TransitionGroup,
		TriggerOpTypes: () => TriggerOpTypes,
		VueElement: () => VueElement,
		assertNumber: () => assertNumber,
		callWithAsyncErrorHandling: () => callWithAsyncErrorHandling,
		callWithErrorHandling: () => callWithErrorHandling,
		camelize: () => camelize$1,
		capitalize: () => capitalize,
		cloneVNode: () => cloneVNode,
		compatUtils: () => null,
		compile: () => compile,
		computed: () => computed,
		createApp: () => createApp,
		createBlock: () => createBlock,
		createCommentVNode: () => createCommentVNode,
		createElementBlock: () => createElementBlock,
		createElementVNode: () => createBaseVNode,
		createHydrationRenderer: () => createHydrationRenderer,
		createPropsRestProxy: () => createPropsRestProxy,
		createRenderer: () => createRenderer,
		createSSRApp: () => createSSRApp,
		createSlots: () => createSlots,
		createStaticVNode: () => createStaticVNode,
		createTextVNode: () => createTextVNode,
		createVNode: () => createVNode,
		customRef: () => customRef,
		defineAsyncComponent: () => defineAsyncComponent,
		defineComponent: () => defineComponent,
		defineCustomElement: () => defineCustomElement,
		defineEmits: () => defineEmits,
		defineExpose: () => defineExpose,
		defineModel: () => defineModel,
		defineOptions: () => defineOptions,
		defineProps: () => defineProps,
		defineSSRCustomElement: () => defineSSRCustomElement,
		defineSlots: () => defineSlots,
		devtools: () => devtools,
		effect: () => effect,
		effectScope: () => effectScope,
		getCurrentInstance: () => getCurrentInstance,
		getCurrentScope: () => getCurrentScope,
		getCurrentWatcher: () => getCurrentWatcher,
		getTransitionRawChildren: () => getTransitionRawChildren,
		guardReactiveProps: () => guardReactiveProps,
		h: () => h,
		handleError: () => handleError,
		hasInjectionContext: () => hasInjectionContext,
		hydrate: () => hydrate,
		hydrateOnIdle: () => hydrateOnIdle,
		hydrateOnInteraction: () => hydrateOnInteraction,
		hydrateOnMediaQuery: () => hydrateOnMediaQuery,
		hydrateOnVisible: () => hydrateOnVisible,
		initCustomFormatter: () => initCustomFormatter,
		initDirectivesForSSR: () => initDirectivesForSSR,
		inject: () => inject,
		isMemoSame: () => isMemoSame,
		isProxy: () => isProxy,
		isReactive: () => isReactive,
		isReadonly: () => isReadonly,
		isRef: () => isRef,
		isRuntimeOnly: () => isRuntimeOnly,
		isShallow: () => isShallow,
		isVNode: () => isVNode,
		markRaw: () => markRaw,
		mergeDefaults: () => mergeDefaults,
		mergeModels: () => mergeModels,
		mergeProps: () => mergeProps,
		nextTick: () => nextTick,
		nodeOps: () => nodeOps,
		normalizeClass: () => normalizeClass,
		normalizeProps: () => normalizeProps,
		normalizeStyle: () => normalizeStyle,
		onActivated: () => onActivated,
		onBeforeMount: () => onBeforeMount,
		onBeforeUnmount: () => onBeforeUnmount,
		onBeforeUpdate: () => onBeforeUpdate,
		onDeactivated: () => onDeactivated,
		onErrorCaptured: () => onErrorCaptured,
		onMounted: () => onMounted,
		onRenderTracked: () => onRenderTracked,
		onRenderTriggered: () => onRenderTriggered,
		onScopeDispose: () => onScopeDispose,
		onServerPrefetch: () => onServerPrefetch,
		onUnmounted: () => onUnmounted,
		onUpdated: () => onUpdated,
		onWatcherCleanup: () => onWatcherCleanup,
		openBlock: () => openBlock,
		patchProp: () => patchProp,
		popScopeId: () => popScopeId,
		provide: () => provide,
		proxyRefs: () => proxyRefs,
		pushScopeId: () => pushScopeId,
		queuePostFlushCb: () => queuePostFlushCb,
		reactive: () => reactive,
		readonly: () => readonly,
		ref: () => ref,
		registerRuntimeCompiler: () => registerRuntimeCompiler,
		render: () => render$1,
		renderList: () => renderList,
		renderSlot: () => renderSlot,
		resolveComponent: () => resolveComponent,
		resolveDirective: () => resolveDirective,
		resolveDynamicComponent: () => resolveDynamicComponent,
		resolveFilter: () => null,
		resolveTransitionHooks: () => resolveTransitionHooks,
		setBlockTracking: () => setBlockTracking,
		setDevtoolsHook: () => setDevtoolsHook,
		setTransitionHooks: () => setTransitionHooks,
		shallowReactive: () => shallowReactive,
		shallowReadonly: () => shallowReadonly,
		shallowRef: () => shallowRef,
		ssrContextKey: () => ssrContextKey,
		ssrUtils: () => ssrUtils,
		stop: () => stop,
		toDisplayString: () => toDisplayString,
		toHandlerKey: () => toHandlerKey,
		toHandlers: () => toHandlers,
		toRaw: () => toRaw,
		toRef: () => toRef,
		toRefs: () => toRefs,
		toValue: () => toValue,
		transformVNodeArgs: () => transformVNodeArgs,
		triggerRef: () => triggerRef,
		unref: () => unref,
		useAttrs: () => useAttrs,
		useCssModule: () => useCssModule,
		useCssVars: () => useCssVars,
		useHost: () => useHost,
		useId: () => useId,
		useModel: () => useModel,
		useSSRContext: () => useSSRContext,
		useShadowRoot: () => useShadowRoot,
		useSlots: () => useSlots,
		useTemplateRef: () => useTemplateRef,
		useTransitionState: () => useTransitionState,
		vModelCheckbox: () => vModelCheckbox,
		vModelDynamic: () => vModelDynamic,
		vModelRadio: () => vModelRadio,
		vModelSelect: () => vModelSelect,
		vModelText: () => vModelText,
		vShow: () => vShow,
		version: () => version$1,
		warn: () => warn,
		watch: () => watch,
		watchEffect: () => watchEffect,
		watchPostEffect: () => watchPostEffect,
		watchSyncEffect: () => watchSyncEffect,
		withAsyncContext: () => withAsyncContext,
		withCtx: () => withCtx,
		withDefaults: () => withDefaults,
		withDirectives: () => withDirectives,
		withKeys: () => withKeys,
		withMemo: () => withMemo,
		withModifiers: () => withModifiers,
		withScopeId: () => withScopeId
	});
	/**
	* vue v3.5.42
	* (c) 2018-present Yuxi (Evan) You and Vue contributors
	* @license MIT
	**/
	var compile = () => {};
	//#endregion
	//#region node_modules/dropzone/dist/dropzone.mjs
	var dropzone_exports = /* @__PURE__ */ __exportAll({
		Dropzone: () => Dropzone$3,
		default: () => Dropzone$3
	});
	function extend$1() {
		var args = [].slice.call(arguments);
		var deep = false;
		if (typeof args[0] == "boolean") deep = args.shift();
		var result = args[0];
		if (isUnextendable(result)) throw new Error("extendee must be an object");
		var extenders = args.slice(1);
		var len = extenders.length;
		for (var i = 0; i < len; i++) {
			var extender = extenders[i];
			for (var key in extender) if (Object.prototype.hasOwnProperty.call(extender, key)) {
				var value = extender[key];
				if (deep && isCloneable(value)) {
					var base = Array.isArray(value) ? [] : {};
					result[key] = extend$1(true, Object.prototype.hasOwnProperty.call(result, key) && !isUnextendable(result[key]) ? result[key] : base, value);
				} else result[key] = value;
			}
		}
		return result;
	}
	function isCloneable(obj) {
		return Array.isArray(obj) || {}.toString.call(obj) == "[object Object]";
	}
	function isUnextendable(val) {
		return !val || typeof val != "object" && typeof val != "function";
	}
	function __guard__(value, transform) {
		return typeof value !== "undefined" && value !== null ? transform(value) : void 0;
	}
	function __guardMethod__(obj, methodName, transform) {
		if (typeof obj !== "undefined" && obj !== null && typeof obj[methodName] === "function") return transform(obj, methodName);
		else return;
	}
	var Emitter, defaultOptions, Dropzone$3, without, camelize, detectVerticalSquash, drawImageIOSFix, ExifRestore;
	var init_dropzone = __esmMin((() => {
		Emitter = class {
			on(event, fn) {
				this._callbacks = this._callbacks || {};
				if (!this._callbacks[event]) this._callbacks[event] = [];
				this._callbacks[event].push(fn);
				return this;
			}
			emit(event, ...args) {
				this._callbacks = this._callbacks || {};
				let callbacks = this._callbacks[event];
				if (callbacks) for (let callback of callbacks) callback.apply(this, args);
				if (this.element) this.element.dispatchEvent(this.makeEvent("dropzone:" + event, { args }));
				return this;
			}
			makeEvent(eventName, detail) {
				let params = {
					bubbles: true,
					cancelable: true,
					detail
				};
				if (typeof window.CustomEvent === "function") return new CustomEvent(eventName, params);
				else {
					var evt = document.createEvent("CustomEvent");
					evt.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
					return evt;
				}
			}
			off(event, fn) {
				if (!this._callbacks || arguments.length === 0) {
					this._callbacks = {};
					return this;
				}
				let callbacks = this._callbacks[event];
				if (!callbacks) return this;
				if (arguments.length === 1) {
					delete this._callbacks[event];
					return this;
				}
				for (let i = 0; i < callbacks.length; i++) if (callbacks[i] === fn) {
					callbacks.splice(i, 1);
					break;
				}
				return this;
			}
		};
		defaultOptions = {
			/**
			* Has to be specified on elements other than form (or when the form doesn't
			* have an `action` attribute).
			*
			* You can also provide a function that will be called with `files` and
			* `dataBlocks`  and must return the url as string.
			*/
			url: null,
			/**
			* Can be changed to `"put"` if necessary. You can also provide a function
			* that will be called with `files` and must return the method (since `v3.12.0`).
			*/
			method: "post",
			/**
			* Will be set on the XHRequest.
			*/
			withCredentials: false,
			/**
			* The timeout for the XHR requests in milliseconds (since `v4.4.0`).
			* If set to null or 0, no timeout is going to be set.
			*/
			timeout: null,
			/**
			* How many file uploads to process in parallel (See the
			* Enqueuing file uploads documentation section for more info)
			*/
			parallelUploads: 2,
			/**
			* Whether to send multiple files in one request. If
			* this it set to true, then the fallback file input element will
			* have the `multiple` attribute as well. This option will
			* also trigger additional events (like `processingmultiple`). See the events
			* documentation section for more information.
			*/
			uploadMultiple: false,
			/**
			* Whether you want files to be uploaded in chunks to your server. This can't be
			* used in combination with `uploadMultiple`.
			*
			* See [chunksUploaded](#config-chunksUploaded) for the callback to finalise an upload.
			*/
			chunking: false,
			/**
			* If `chunking` is enabled, this defines whether **every** file should be chunked,
			* even if the file size is below chunkSize. This means, that the additional chunk
			* form data will be submitted and the `chunksUploaded` callback will be invoked.
			*/
			forceChunking: false,
			/**
			* If `chunking` is `true`, then this defines the chunk size in bytes.
			*/
			chunkSize: 2097152,
			/**
			* If `true`, the individual chunks of a file are uploaded simultaneously, at
			* most `parallelUploads` of them at a time. Set a number to use a different
			* limit, or `Infinity` to start every chunk at once.
			*/
			parallelChunkUploads: false,
			/**
			* Whether a chunk should be retried if it fails.
			*/
			retryChunks: false,
			/**
			* If `retryChunks` is true, how many times should it be retried.
			*/
			retryChunksLimit: 3,
			/**
			* The maximum filesize (in MiB) that is allowed to be uploaded.
			*/
			maxFilesize: 256,
			/**
			* The name of the file param that gets transferred.
			* **NOTE**: If you have the option  `uploadMultiple` set to `true`, then
			* Dropzone will append `[]` to the name.
			*/
			paramName: "file",
			/**
			* Whether thumbnails for images should be generated
			*/
			createImageThumbnails: true,
			/**
			* In MB. When the filename exceeds this limit, the thumbnail will not be generated.
			*/
			maxThumbnailFilesize: 10,
			/**
			* If `null`, the ratio of the image will be used to calculate it.
			*/
			thumbnailWidth: 120,
			/**
			* The same as `thumbnailWidth`. If both are null, images will not be resized.
			*/
			thumbnailHeight: 120,
			/**
			* How the images should be scaled down in case both, `thumbnailWidth` and `thumbnailHeight` are provided.
			* Can be either `contain` or `crop`.
			*/
			thumbnailMethod: "crop",
			/**
			* If set, images will be resized to these dimensions before being **uploaded**.
			* If only one, `resizeWidth` **or** `resizeHeight` is provided, the original aspect
			* ratio of the file will be preserved.
			*
			* The `options.transformFile` function uses these options, so if the `transformFile` function
			* is overridden, these options don't do anything.
			*/
			resizeWidth: null,
			/**
			* See `resizeWidth`.
			*/
			resizeHeight: null,
			/**
			* The mime type of the resized image (before it gets uploaded to the server).
			* If `null` the original mime type will be used. To force jpeg, for example, use `image/jpeg`.
			* See `resizeWidth` for more information.
			*/
			resizeMimeType: null,
			/**
			* The quality of the resized images. See `resizeWidth`.
			*/
			resizeQuality: .8,
			/**
			* How the images should be scaled down in case both, `resizeWidth` and `resizeHeight` are provided.
			* Can be either `contain` or `crop`.
			*/
			resizeMethod: "contain",
			/**
			* The color to show through transparent parts of a resized image, as any
			* CSS color. Formats without an alpha channel cannot store transparency, so
			* a transparent PNG resized to `image/jpeg` comes out with black where it
			* used to be see-through; setting this to `"#fff"` makes it white instead.
			*
			* `null` leaves transparency alone, which only produces black once the image
			* is encoded to a format that cannot represent it. This has no effect on the
			* preview thumbnails, which are always PNG.
			*/
			resizeTransparencyFill: null,
			/**
			* The base that is used to calculate the **displayed** filesize. You can
			* change this to 1024 if you would rather display kibibytes, mebibytes,
			* etc... 1024 is technically incorrect, because `1024 bytes` are `1 kibibyte`
			* not `1 kilobyte`. You can change this to `1024` if you don't care about
			* validity.
			*/
			filesizeBase: 1e3,
			/**
			* If not `null` defines how many files this Dropzone handles. If it exceeds,
			* the event `maxfilesexceeded` will be called. The dropzone element gets the
			* class `dz-max-files-reached` accordingly so you can provide visual
			* feedback.
			*/
			maxFiles: null,
			/**
			* An optional object to send additional headers to the server. Eg:
			* `{ "My-Awesome-Header": "header value" }`
			*/
			headers: null,
			/**
			* Should the default headers be set or not?
			* Accept: application/json <- for requesting json response
			* Cache-Control: no-cache <- Request shouldnt be cached
			* X-Requested-With: XMLHttpRequest <- We sent the request via XMLHttpRequest
			*/
			defaultHeaders: true,
			/**
			* If `true`, the dropzone element itself will be clickable, if `false`
			* nothing will be clickable.
			*
			* You can also pass an HTML element, a CSS selector (for multiple elements)
			* or an array of those. In that case, all of those elements will trigger an
			* upload when clicked.
			*/
			clickable: true,
			/**
			* Whether hidden files in directories should be ignored.
			*/
			ignoreHiddenFiles: true,
			/**
			* The default implementation of `accept` checks the file's mime type or
			* extension against this list. This is a comma separated list of mime
			* types or file extensions.
			*
			* Eg.: `image/*,application/pdf,.psd`
			*
			* If the Dropzone is `clickable` this option will also be used as
			* [`accept`](https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept)
			* parameter on the hidden file input as well.
			*/
			acceptedFiles: null,
			/**
			* **Deprecated!**
			* Use acceptedFiles instead.
			*/
			acceptedMimeTypes: null,
			/**
			* If false, files will be added to the queue but the queue will not be
			* processed automatically.
			* This can be useful if you need some additional user input before sending
			* files (or if you want want all files sent at once).
			* If you're ready to send the file simply call `myDropzone.processQueue()`.
			*
			* See the [enqueuing file uploads](#enqueuing-file-uploads) documentation
			* section for more information.
			*/
			autoProcessQueue: true,
			/**
			* If false, files added to the dropzone will not be queued by default.
			* You'll have to call `enqueueFile(file)` manually.
			*/
			autoQueue: true,
			/**
			* If `true`, this will add a link to every file preview to remove or cancel (if
			* already uploading) the file. The `dictCancelUpload`, `dictCancelUploadConfirmation`
			* and `dictRemoveFile` options are used for the wording.
			*/
			addRemoveLinks: false,
			/**
			* Defines where to display the file previews – if `null` the
			* Dropzone element itself is used. Can be a plain `HTMLElement` or a CSS
			* selector. The element should have the `dropzone-previews` class so
			* the previews are displayed properly.
			*/
			previewsContainer: null,
			/**
			* Set this to `true` if you don't want previews to be shown.
			*/
			disablePreviews: false,
			/**
			* This is the element the hidden input field (which is used when clicking on the
			* dropzone to trigger file selection) will be appended to. This might
			* be important in case you use frameworks to switch the content of your page.
			*
			* Can be a selector string, or an element directly.
			*/
			hiddenInputContainer: "body",
			/**
			* If null, no capture type will be specified
			* If camera, mobile devices will skip the file selection and choose camera
			* If microphone, mobile devices will skip the file selection and choose the microphone
			* If camcorder, mobile devices will skip the file selection and choose the camera in video mode
			* On apple devices multiple must be set to false.  AcceptedFiles may need to
			* be set to an appropriate mime type (e.g. "image/*", "audio/*", or "video/*").
			*/
			capture: null,
			/**
			* **Deprecated**. Use `renameFile` instead.
			*/
			renameFilename: null,
			/**
			* A function that is invoked before the file is uploaded to the server and renames the file.
			* This function gets the `File` as argument and can use the `file.name`. The actual name of the
			* file that gets used during the upload can be accessed through `file.upload.filename`.
			*/
			renameFile: null,
			/**
			* If `true` the fallback will be forced. This is very useful to test your server
			* implementations first and make sure that everything works as
			* expected without dropzone if you experience problems, and to test
			* how your fallbacks will look.
			*/
			forceFallback: false,
			/**
			* The text used before any files are dropped.
			*/
			dictDefaultMessage: "Drop files here to upload",
			/**
			* The text that replaces the default message text it the browser is not supported.
			*/
			dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
			/**
			* The text that will be added before the fallback form.
			* If you provide a  fallback element yourself, or if this option is `null` this will
			* be ignored.
			*/
			dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
			/**
			* If the filesize is too big.
			* `{{filesize}}` and `{{maxFilesize}}` will be replaced with the respective configuration values.
			*/
			dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
			/**
			* If the file doesn't match the file type.
			*/
			dictInvalidFileType: "You can't upload files of this type.",
			/**
			* If the file looks like an image but cannot be decoded, so no thumbnail can
			* be generated for it.
			*/
			dictThumbnailError: "Failed to load the image. The file may be corrupted.",
			/**
			* If the server response was invalid.
			* `{{statusCode}}` will be replaced with the servers status code.
			*/
			dictResponseError: "Server responded with {{statusCode}} code.",
			/**
			* If `addRemoveLinks` is true, the text to be used for the cancel upload link.
			*/
			dictCancelUpload: "Cancel upload",
			/**
			* The text that is displayed if an upload was manually canceled
			*/
			dictUploadCanceled: "Upload canceled.",
			/**
			* If `addRemoveLinks` is true, the text to be used for confirmation when cancelling upload.
			*/
			dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
			/**
			* If `addRemoveLinks` is true, the text to be used to remove a file.
			*/
			dictRemoveFile: "Remove file",
			/**
			* If this is not null, then the user will be prompted before removing a file.
			*/
			dictRemoveFileConfirmation: null,
			/**
			* Displayed if `maxFiles` is set and exceeded.
			* The string `{{maxFiles}}` will be replaced by the configuration value.
			*/
			dictMaxFilesExceeded: "You cannot upload any more files.",
			/**
			* Allows you to translate the different units. Starting with `tb` for terabytes and going down to
			* `b` for bytes.
			*/
			dictFileSizeUnits: {
				tb: "TB",
				gb: "GB",
				mb: "MB",
				kb: "KB",
				b: "b"
			},
			/**
			* Called when dropzone initialized
			* You can add event listeners here
			*/
			init() {},
			/**
			* Can be an **object** of additional parameters to transfer to the server, **or** a `Function`
			* that gets invoked with the `files`, `xhr` and, if it's a chunked upload, `chunk` arguments. In case
			* of a function, this needs to return a map.
			*
			* The default implementation does nothing for normal uploads, but adds relevant information for
			* chunked uploads.
			*
			* This is the same as adding hidden input fields in the form element.
			*/
			params(files, xhr, chunk) {
				if (chunk) return {
					dzuuid: chunk.file.upload.uuid,
					dzchunkindex: chunk.index,
					dztotalfilesize: chunk.file.size,
					dzchunksize: this.options.chunkSize,
					dztotalchunkcount: chunk.file.upload.totalChunkCount,
					dzchunkbyteoffset: chunk.index * this.options.chunkSize
				};
			},
			/**
			* A function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File)
			* and a `done` function as parameters.
			*
			* If the done function is invoked without arguments, the file is "accepted" and will
			* be processed. If you pass an error message, the file is rejected, and the error
			* message will be displayed.
			* This function will not be called if the file is too big or doesn't match the mime types.
			*/
			accept(file, done) {
				return done();
			},
			/**
			* The callback that will be invoked when all chunks have been uploaded for a file.
			* It gets the file for which the chunks have been uploaded as the first parameter,
			* and the `done` function as second. `done()` needs to be invoked when everything
			* needed to finish the upload process is done.
			*/
			chunksUploaded: function(file, done) {
				done();
			},
			/**
			* Sends the file as binary blob in body instead of form data.
			* If this is set, the `params` option will be ignored.
			* It's an error to set this to `true` along with `uploadMultiple` since
			* multiple files cannot be in a single binary body.
			*/
			binaryBody: false,
			/**
			* Gets called when the browser is not supported.
			* The default implementation shows the fallback input field and adds
			* a text.
			*/
			fallback() {
				let messageElement;
				this.element.className = `${this.element.className} dz-browser-not-supported`;
				for (let child of this.element.getElementsByTagName("div")) if (/(^| )dz-message($| )/.test(child.className)) {
					messageElement = child;
					child.className = "dz-message";
					break;
				}
				if (!messageElement) {
					messageElement = Dropzone$3.createElement("<div class=\"dz-message\"><span></span></div>");
					this.element.appendChild(messageElement);
				}
				let span = messageElement.getElementsByTagName("span")[0];
				if (span) {
					if (span.textContent != null) span.textContent = this.options.dictFallbackMessage;
					else if (span.innerText != null) span.innerText = this.options.dictFallbackMessage;
				}
				return this.element.appendChild(this.getFallbackForm());
			},
			/**
			* Gets called to calculate the thumbnail dimensions.
			*
			* It gets `file`, `width` and `height` (both may be `null`) as parameters and must return an object containing:
			*
			*  - `srcWidth` & `srcHeight` (required)
			*  - `trgWidth` & `trgHeight` (required)
			*  - `srcX` & `srcY` (optional, default `0`)
			*  - `trgX` & `trgY` (optional, default `0`)
			*
			* Those values are going to be used by `ctx.drawImage()`.
			*/
			resize(file, width, height, resizeMethod) {
				let info = {
					srcX: 0,
					srcY: 0,
					srcWidth: file.width,
					srcHeight: file.height
				};
				let srcRatio = file.width / file.height;
				if (width == null && height == null) {
					width = info.srcWidth;
					height = info.srcHeight;
				} else if (width == null) width = height * srcRatio;
				else if (height == null) height = width / srcRatio;
				width = Math.min(width, info.srcWidth);
				height = Math.min(height, info.srcHeight);
				let trgRatio = width / height;
				if (info.srcWidth > width || info.srcHeight > height) {
					if (resizeMethod === "crop") {
						if (srcRatio > trgRatio) {
							info.srcHeight = file.height;
							info.srcWidth = info.srcHeight * trgRatio;
						} else {
							info.srcWidth = file.width;
							info.srcHeight = info.srcWidth / trgRatio;
						}
					} else if (resizeMethod === "contain") {
						if (srcRatio > trgRatio) height = width / srcRatio;
						else width = height * srcRatio;
					} else throw new Error(`Unknown resizeMethod '${resizeMethod}'`);
				}
				info.srcX = (file.width - info.srcWidth) / 2;
				info.srcY = (file.height - info.srcHeight) / 2;
				info.trgWidth = width;
				info.trgHeight = height;
				return info;
			},
			/**
			* Can be used to transform the file (for example, resize an image if necessary).
			*
			* The default implementation uses `resizeWidth` and `resizeHeight` (if provided) and resizes
			* images according to those dimensions.
			*
			* Gets the `file` as the first parameter, and a `done()` function as the second, that needs
			* to be invoked with the file when the transformation is done.
			*/
			transformFile(file, done) {
				if ((this.options.resizeWidth || this.options.resizeHeight) && file.type.match(/image.*/)) return this.resizeImage(file, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, done);
				else return done(file);
			},
			/**
			* A string that contains the template used for each dropped
			* file. Change it to fulfill your needs but make sure to properly
			* provide all elements.
			*
			* If you want to use an actual HTML element instead of providing a String
			* as a config option, you could create a div with the id `tpl`,
			* put the template inside it and provide the element like this:
			*
			*     document
			*       .querySelector('#tpl')
			*       .innerHTML
			*
			*/
			previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail draggable=\"false\" /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\">\n    <span class=\"dz-upload\" data-dz-uploadprogress></span>\n  </div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54\" height=\"54\" viewBox=\"0 0 54 54\" fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path\n        d=\"M10.2071 29.7929L14.2929 25.7071C14.6834 25.3166 15.3166 25.3166 15.7071 25.7071L21.2929 31.2929C21.6834 31.6834 22.3166 31.6834 22.7071 31.2929L38.2929 15.7071C38.6834 15.3166 39.3166 15.3166 39.7071 15.7071L43.7929 19.7929C44.1834 20.1834 44.1834 20.8166 43.7929 21.2071L22.7071 42.2929C22.3166 42.6834 21.6834 42.6834 21.2929 42.2929L10.2071 31.2071C9.81658 30.8166 9.81658 30.1834 10.2071 29.7929Z\"\n      />\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54\" height=\"54\" viewBox=\"0 0 54 54\" fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path\n        d=\"M26.2929 20.2929L19.2071 13.2071C18.8166 12.8166 18.1834 12.8166 17.7929 13.2071L13.2071 17.7929C12.8166 18.1834 12.8166 18.8166 13.2071 19.2071L20.2929 26.2929C20.6834 26.6834 20.6834 27.3166 20.2929 27.7071L13.2071 34.7929C12.8166 35.1834 12.8166 35.8166 13.2071 36.2071L17.7929 40.7929C18.1834 41.1834 18.8166 41.1834 19.2071 40.7929L26.2929 33.7071C26.6834 33.3166 27.3166 33.3166 27.7071 33.7071L34.7929 40.7929C35.1834 41.1834 35.8166 41.1834 36.2071 40.7929L40.7929 36.2071C41.1834 35.8166 41.1834 35.1834 40.7929 34.7929L33.7071 27.7071C33.3166 27.3166 33.3166 26.6834 33.7071 26.2929L40.7929 19.2071C41.1834 18.8166 41.1834 18.1834 40.7929 17.7929L36.2071 13.2071C35.8166 12.8166 35.1834 12.8166 34.7929 13.2071L27.7071 20.2929C27.3166 20.6834 26.6834 20.6834 26.2929 20.2929Z\"\n      />\n    </svg>\n  </div>\n</div>\n",
			drop(e) {
				return this.element.classList.remove("dz-drag-hover");
			},
			dragstart(e) {},
			dragend(e) {
				return this.element.classList.remove("dz-drag-hover");
			},
			dragenter(e) {
				return this.element.classList.add("dz-drag-hover");
			},
			dragover(e) {
				return this.element.classList.add("dz-drag-hover");
			},
			dragleave(e) {
				return this.element.classList.remove("dz-drag-hover");
			},
			paste(e) {},
			reset() {
				return this.element.classList.remove("dz-started");
			},
			addedfile(file) {
				if (this.element === this.previewsContainer) this.element.classList.add("dz-started");
				if (this.previewsContainer && !this.options.disablePreviews) {
					file.previewElement = Dropzone$3.createElement(this.options.previewTemplate.trim());
					file.previewTemplate = file.previewElement;
					this.previewsContainer.appendChild(file.previewElement);
					for (var node of file.previewElement.querySelectorAll("[data-dz-name]")) node.textContent = file.name;
					for (node of file.previewElement.querySelectorAll("[data-dz-size]")) node.innerHTML = this.filesize(file.size);
					if (this.options.addRemoveLinks) {
						file._removeLink = Dropzone$3.createElement(`<a class="dz-remove" href="javascript:undefined;" data-dz-remove>${this.options.dictRemoveFile}</a>`);
						file.previewElement.appendChild(file._removeLink);
					}
					let removeFileEvent = (e) => {
						e.preventDefault();
						e.stopPropagation();
						if (file.status === Dropzone$3.UPLOADING) return Dropzone$3.confirm(this.options.dictCancelUploadConfirmation, () => this.removeFile(file));
						else if (this.options.dictRemoveFileConfirmation) return Dropzone$3.confirm(this.options.dictRemoveFileConfirmation, () => this.removeFile(file));
						else return this.removeFile(file);
					};
					for (let removeLink of file.previewElement.querySelectorAll("[data-dz-remove]")) removeLink.addEventListener("click", removeFileEvent);
				}
			},
			removedfile(file) {
				if (file.previewElement != null && file.previewElement.parentNode != null) file.previewElement.parentNode.removeChild(file.previewElement);
				return this._updateMaxFilesReachedClass();
			},
			thumbnail(file, dataUrl) {
				if (file.previewElement) {
					file.previewElement.classList.remove("dz-file-preview");
					for (let thumbnailElement of file.previewElement.querySelectorAll("[data-dz-thumbnail]")) {
						thumbnailElement.alt = file.name;
						thumbnailElement.src = dataUrl;
					}
					return setTimeout(() => file.previewElement.classList.add("dz-image-preview"), 1);
				}
			},
			error(file, message) {
				if (file.previewElement) {
					file.previewElement.classList.add("dz-error");
					if (typeof message !== "string" && message.error) message = message.error;
					for (let node of file.previewElement.querySelectorAll("[data-dz-errormessage]")) node.textContent = message;
				}
			},
			errormultiple() {},
			processing(file) {
				if (file.previewElement) {
					file.previewElement.classList.add("dz-processing");
					if (file._removeLink) return file._removeLink.innerHTML = this.options.dictCancelUpload;
				}
			},
			processingmultiple() {},
			uploadprogress(file, progress, bytesSent) {
				if (file.previewElement) for (let node of file.previewElement.querySelectorAll("[data-dz-uploadprogress]")) if (node.nodeName === "PROGRESS") node.value = progress;
				else node.style.width = `${progress}%`;
			},
			totaluploadprogress() {},
			sending() {},
			sendingmultiple() {},
			success(file) {
				if (file.previewElement) return file.previewElement.classList.add("dz-success");
			},
			successmultiple() {},
			canceled(file) {
				return this.emit("error", file, this.options.dictUploadCanceled);
			},
			canceledmultiple() {},
			complete(file) {
				if (file._removeLink) file._removeLink.innerHTML = this.options.dictRemoveFile;
				if (file.previewElement) return file.previewElement.classList.add("dz-complete");
			},
			completemultiple() {},
			maxfilesexceeded() {},
			maxfilesreached() {},
			queuecomplete() {},
			addedfiles() {},
			/**
			* Called when a dropped folder turns out to have nothing in it at all.
			* Receives the folder's path.
			*/
			emptyfolder() {}
		};
		Dropzone$3 = class Dropzone extends Emitter {
			static initClass() {
				this.prototype.Emitter = Emitter;
				this.prototype.events = [
					"drop",
					"dragstart",
					"dragend",
					"dragenter",
					"dragover",
					"dragleave",
					"addedfile",
					"addedfiles",
					"removedfile",
					"thumbnail",
					"error",
					"errormultiple",
					"processing",
					"processingmultiple",
					"uploadprogress",
					"totaluploadprogress",
					"sending",
					"sendingmultiple",
					"success",
					"successmultiple",
					"canceled",
					"canceledmultiple",
					"complete",
					"completemultiple",
					"reset",
					"maxfilesexceeded",
					"maxfilesreached",
					"queuecomplete",
					"emptyfolder"
				];
				this.prototype._thumbnailQueue = [];
				this.prototype._processingThumbnail = false;
			}
			constructor(el, options) {
				super();
				let fallback, left;
				this.element = el;
				this.clickableElements = [];
				this.listeners = [];
				this.files = [];
				if (typeof this.element === "string") this.element = document.querySelector(this.element);
				if (!this.element || this.element.nodeType == null) throw new Error("Invalid dropzone element.");
				if (this.element.dropzone) throw new Error("Dropzone already attached.");
				Dropzone.instances.push(this);
				this.element.dropzone = this;
				let elementOptions = (left = Dropzone.optionsForElement(this.element)) != null ? left : {};
				this.options = extend$1(true, {}, defaultOptions, elementOptions, options != null ? options : {});
				this.options.previewTemplate = this.options.previewTemplate.replace(/\n*/g, "");
				if (this.options.forceFallback || !Dropzone.isBrowserSupported()) return this.options.fallback.call(this);
				if (this.options.url == null) this.options.url = this.element.getAttribute("action");
				if (!this.options.url) throw new Error("No URL provided.");
				if (this.options.acceptedFiles && this.options.acceptedMimeTypes) throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
				if (this.options.uploadMultiple && this.options.chunking) throw new Error("You cannot set both: uploadMultiple and chunking.");
				if (this.options.binaryBody && this.options.uploadMultiple) throw new Error("You cannot set both: binaryBody and uploadMultiple.");
				if (this.options.acceptedMimeTypes) {
					this.options.acceptedFiles = this.options.acceptedMimeTypes;
					delete this.options.acceptedMimeTypes;
				}
				if (this.options.renameFilename != null) this.options.renameFile = (file) => this.options.renameFilename.call(this, file.name, file);
				if (typeof this.options.method === "string") this.options.method = this.options.method.toUpperCase();
				if ((fallback = this.getExistingFallback()) && fallback.parentNode) fallback.parentNode.removeChild(fallback);
				if (this.options.previewsContainer !== false) {
					if (this.options.previewsContainer) this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
					else this.previewsContainer = this.element;
				}
				if (this.options.clickable) {
					if (this.options.clickable === true) this.clickableElements = [this.element];
					else this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
				}
				this.init();
			}
			getAcceptedFiles() {
				return this.files.filter((file) => file.accepted).map((file) => file);
			}
			getRejectedFiles() {
				return this.files.filter((file) => !file.accepted).map((file) => file);
			}
			getFilesWithStatus(status) {
				return this.files.filter((file) => file.status === status).map((file) => file);
			}
			getQueuedFiles() {
				return this.getFilesWithStatus(Dropzone.QUEUED);
			}
			getUploadingFiles() {
				return this.getFilesWithStatus(Dropzone.UPLOADING);
			}
			getAddedFiles() {
				return this.getFilesWithStatus(Dropzone.ADDED);
			}
			getActiveFiles() {
				return this.files.filter((file) => file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED).map((file) => file);
			}
			init() {
				if (this.element.tagName === "form") this.element.setAttribute("enctype", "multipart/form-data");
				if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) this.element.appendChild(Dropzone.createElement(`<div class="dz-default dz-message"><button class="dz-button" type="button">${this.options.dictDefaultMessage}</button></div>`));
				if (this.clickableElements.length) {
					let setupHiddenFileInput = () => {
						if (this.hiddenFileInput) this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
						this.hiddenFileInput = document.createElement("input");
						this.hiddenFileInput.setAttribute("type", "file");
						if (this.options.maxFiles === null || this.options.maxFiles > 1) this.hiddenFileInput.setAttribute("multiple", "multiple");
						this.hiddenFileInput.className = "dz-hidden-input";
						if (this.options.acceptedFiles !== null) this.hiddenFileInput.setAttribute("accept", this.options.acceptedFiles);
						if (this.options.capture !== null) this.hiddenFileInput.setAttribute("capture", this.options.capture);
						this.hiddenFileInput.setAttribute("tabindex", "-1");
						this.hiddenFileInput.setAttribute("aria-label", "hidden file upload");
						this.hiddenFileInput.style.visibility = "hidden";
						this.hiddenFileInput.style.position = "absolute";
						this.hiddenFileInput.style.top = "0";
						this.hiddenFileInput.style.left = "0";
						this.hiddenFileInput.style.height = "0";
						this.hiddenFileInput.style.width = "0";
						let ownerForm = this.element.closest("form");
						if (ownerForm && ownerForm.id) this.hiddenFileInput.setAttribute("form", ownerForm.id);
						Dropzone.getElement(this.options.hiddenInputContainer, "hiddenInputContainer").appendChild(this.hiddenFileInput);
						this.hiddenFileInput.addEventListener("change", () => {
							let { files } = this.hiddenFileInput;
							if (files.length) for (let file of files) this.addFile(file);
							this.emit("addedfiles", files);
							setupHiddenFileInput();
						});
					};
					setupHiddenFileInput();
				}
				this.URL = window.URL !== null ? window.URL : window.webkitURL;
				for (let eventName of this.events) this.on(eventName, this.options[eventName]);
				this.on("uploadprogress", () => this.updateTotalUploadProgress());
				this.on("removedfile", () => this.updateTotalUploadProgress());
				this.on("canceled", (file) => this.emit("complete", file));
				this.on("complete", (file) => {
					if (this.getAddedFiles().length === 0 && this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) return setTimeout(() => this.emit("queuecomplete"), 0);
				});
				const containsFiles = function(e) {
					if (e.dataTransfer.types) {
						for (var i = 0; i < e.dataTransfer.types.length; i++) if (e.dataTransfer.types[i] === "Files") return true;
					}
					return false;
				};
				let noPropagation = function(e) {
					if (!containsFiles(e)) return;
					e.stopPropagation();
					if (e.preventDefault) return e.preventDefault();
					else return e.returnValue = false;
				};
				this.listeners = [{
					element: this.element,
					events: {
						dragstart: (e) => {
							return this.emit("dragstart", e);
						},
						dragenter: (e) => {
							noPropagation(e);
							return this.emit("dragenter", e);
						},
						dragover: (e) => {
							let efct;
							try {
								efct = e.dataTransfer.effectAllowed;
							} catch (error) {}
							e.dataTransfer.dropEffect = "move" === efct || "linkMove" === efct ? "move" : "copy";
							noPropagation(e);
							return this.emit("dragover", e);
						},
						dragleave: (e) => {
							return this.emit("dragleave", e);
						},
						drop: (e) => {
							noPropagation(e);
							return this.drop(e);
						},
						dragend: (e) => {
							return this.emit("dragend", e);
						}
					}
				}];
				this.clickableElements.forEach((clickableElement) => {
					return this.listeners.push({
						element: clickableElement,
						events: { click: (evt) => {
							if (clickableElement !== this.element || evt.target === this.element || Dropzone.elementInside(evt.target, this.element.querySelector(".dz-message"))) this.hiddenFileInput.click();
							return true;
						} }
					});
				});
				this.enable();
				return this.options.init.call(this);
			}
			destroy() {
				this.disable();
				this.removeAllFiles(true);
				if (this.hiddenFileInput != null ? this.hiddenFileInput.parentNode : void 0) {
					this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
					this.hiddenFileInput = null;
				}
				delete this.element.dropzone;
				return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
			}
			updateTotalUploadProgress() {
				let totalUploadProgress;
				let totalBytesSent = 0;
				let totalBytes = 0;
				if (this.getActiveFiles().length) {
					for (let file of this.getActiveFiles()) {
						totalBytesSent += file.upload.bytesSent;
						totalBytes += file.upload.total;
					}
					totalUploadProgress = 100 * totalBytesSent / totalBytes;
				} else totalUploadProgress = 100;
				return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
			}
			_getParamName(n) {
				if (typeof this.options.paramName === "function") return this.options.paramName(n);
				else return `${this.options.paramName}${this.options.uploadMultiple ? `[${n}]` : ""}`;
			}
			_renameFile(file) {
				if (typeof this.options.renameFile !== "function") return file.name;
				return this.options.renameFile(file);
			}
			getFallbackForm() {
				let existingFallback, form;
				if (existingFallback = this.getExistingFallback()) return existingFallback;
				let fieldsString = "<div class=\"dz-fallback\">";
				if (this.options.dictFallbackText) fieldsString += `<p>${this.options.dictFallbackText}</p>`;
				fieldsString += `<input type="file" name="${this._getParamName(0)}" ${this.options.uploadMultiple ? "multiple=\"multiple\"" : void 0} /><input type="submit" value="Upload!"></div>`;
				let fields = Dropzone.createElement(fieldsString);
				if (this.element.tagName !== "FORM") {
					form = Dropzone.createElement(`<form action="${this.options.url}" enctype="multipart/form-data" method="${this.options.method}"></form>`);
					form.appendChild(fields);
				} else {
					this.element.setAttribute("enctype", "multipart/form-data");
					this.element.setAttribute("method", this.options.method);
				}
				return form != null ? form : fields;
			}
			getExistingFallback() {
				let getFallback = function(elements) {
					for (let el of elements) if (/(^| )fallback($| )/.test(el.className)) return el;
				};
				for (let tagName of ["div", "form"]) {
					var fallback;
					if (fallback = getFallback(this.element.getElementsByTagName(tagName))) return fallback;
				}
			}
			setupEventListeners() {
				return this.listeners.map((elementListeners) => (() => {
					let result = [];
					for (let event in elementListeners.events) {
						let listener = elementListeners.events[event];
						result.push(elementListeners.element.addEventListener(event, listener, false));
					}
					return result;
				})());
			}
			removeEventListeners() {
				return this.listeners.map((elementListeners) => (() => {
					let result = [];
					for (let event in elementListeners.events) {
						let listener = elementListeners.events[event];
						result.push(elementListeners.element.removeEventListener(event, listener, false));
					}
					return result;
				})());
			}
			disable() {
				this.clickableElements.forEach((element) => element.classList.remove("dz-clickable"));
				this.removeEventListeners();
				this.disabled = true;
				return this.files.map((file) => this.cancelUpload(file));
			}
			enable() {
				delete this.disabled;
				this.clickableElements.forEach((element) => element.classList.add("dz-clickable"));
				return this.setupEventListeners();
			}
			filesize(size) {
				let selectedSize = 0;
				let selectedUnit = "b";
				if (size > 0) {
					let units = [
						"tb",
						"gb",
						"mb",
						"kb",
						"b"
					];
					for (let i = 0; i < units.length; i++) {
						let unit = units[i];
						if (size >= Math.pow(this.options.filesizeBase, 4 - i) / 10) {
							selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
							selectedUnit = unit;
							break;
						}
					}
					selectedSize = Math.round(10 * selectedSize) / 10;
				}
				return `<strong>${selectedSize}</strong> ${this.options.dictFileSizeUnits[selectedUnit]}`;
			}
			_updateMaxFilesReachedClass() {
				if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
					if (this.getAcceptedFiles().length === this.options.maxFiles) this.emit("maxfilesreached", this.files);
					return this.element.classList.add("dz-max-files-reached");
				} else return this.element.classList.remove("dz-max-files-reached");
			}
			drop(e) {
				if (!e.dataTransfer) return;
				this.emit("drop", e);
				let files = [];
				for (let i = 0; i < e.dataTransfer.files.length; i++) files[i] = e.dataTransfer.files[i];
				if (files.length) {
					let { items } = e.dataTransfer;
					if (items && items.length && items[0].webkitGetAsEntry != null) {
						this._addFilesFromItems(items).then((addedFiles) => {
							this.emit("addedfiles", addedFiles);
						});
						return;
					}
					this.handleFiles(files);
				}
				this.emit("addedfiles", files);
			}
			paste(e) {
				if (__guard__(e != null ? e.clipboardData : void 0, (x) => x.items) == null) return;
				this.emit("paste", e);
				let { items } = e.clipboardData;
				if (items.length) return this._addFilesFromItems(items);
			}
			handleFiles(files) {
				for (let file of files) this.addFile(file);
			}
			_addFilesFromItems(items) {
				let files = [];
				let directories = [];
				for (let item of items) {
					let entry = item.webkitGetAsEntry != null ? item.webkitGetAsEntry() : null;
					if (entry) {
						if (entry.isFile) {
							let file = item.getAsFile();
							this.addFile(file);
							files.push(file);
						} else if (entry.isDirectory) directories.push(this._addFilesFromDirectory(entry, entry.name));
					} else if (item.getAsFile != null && (item.kind == null || item.kind === "file")) {
						let file = item.getAsFile();
						this.addFile(file);
						files.push(file);
					}
				}
				return Promise.all(directories).then((fromDirectories) => files.concat(...fromDirectories));
			}
			_addFilesFromDirectory(directory, path) {
				let dirReader = directory.createReader();
				return new Promise((resolve) => {
					let pending = [];
					let entryCount = 0;
					let settle = () => Promise.all(pending).then((results) => resolve([].concat(...results)));
					let errorHandler = (error) => {
						__guardMethod__(console, "log", (o) => o.log(error));
						settle();
					};
					let readEntries = () => dirReader.readEntries((entries) => {
						if (entries.length > 0) {
							entryCount += entries.length;
							for (let entry of entries) if (entry.isFile) pending.push(new Promise((resolveEntry) => entry.file((file) => {
								if (this.options.ignoreHiddenFiles && file.name.substring(0, 1) === ".") {
									resolveEntry([]);
									return;
								}
								file.fullPath = `${path}/${file.name}`;
								this.addFile(file);
								resolveEntry([file]);
							}, () => resolveEntry([]))));
							else if (entry.isDirectory) pending.push(this._addFilesFromDirectory(entry, `${path}/${entry.name}`));
							readEntries();
							return null;
						}
						if (entryCount === 0) this.emit("emptyfolder", path);
						settle();
						return null;
					}, errorHandler);
					readEntries();
				});
			}
			accept(file, done) {
				if (this.options.maxFilesize && file.size > this.options.maxFilesize * 1024 * 1024) done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
				else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) done(this.options.dictInvalidFileType);
				else if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
					done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
					this.emit("maxfilesexceeded", file);
				} else this.options.accept.call(this, file, done);
			}
			addFile(file) {
				file.upload = {
					uuid: Dropzone.uuidv4(),
					progress: 0,
					total: file.size,
					bytesSent: 0,
					filename: this._renameFile(file)
				};
				this.files.push(file);
				file.status = Dropzone.ADDED;
				this.emit("addedfile", file);
				this._enqueueThumbnail(file);
				this.accept(file, (error) => {
					if (error) {
						file.accepted = false;
						this._errorProcessing([file], error);
					} else {
						file.accepted = true;
						if (this.options.autoQueue) this.enqueueFile(file);
					}
					this._updateMaxFilesReachedClass();
				});
			}
			enqueueFiles(files) {
				for (let file of files) this.enqueueFile(file);
				return null;
			}
			enqueueFile(file) {
				if (file.status === Dropzone.ADDED && file.accepted === true) {
					file.status = Dropzone.QUEUED;
					if (this.options.autoProcessQueue) return setTimeout(() => this.processQueue(), 0);
				} else throw new Error("This file can't be queued because it has already been processed or was rejected.");
			}
			_enqueueThumbnail(file) {
				if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
					this._thumbnailQueue.push(file);
					return setTimeout(() => this._processThumbnailQueue(), 0);
				}
			}
			_processThumbnailQueue() {
				if (this._processingThumbnail || this._thumbnailQueue.length === 0) return;
				this._processingThumbnail = true;
				let file = this._thumbnailQueue.shift();
				return this.createThumbnail(file, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, true, (dataUrl) => {
					if (typeof dataUrl === "string") this.emit("thumbnail", file, dataUrl);
					else this.emit("error", file, this.options.dictThumbnailError);
					this._processingThumbnail = false;
					return this._processThumbnailQueue();
				});
			}
			removeFile(file) {
				if (file.status === Dropzone.UPLOADING) this.cancelUpload(file);
				this.files = without(this.files, file);
				this.emit("removedfile", file);
				if (this.files.length === 0) return this.emit("reset");
			}
			removeAllFiles(cancelIfNecessary) {
				if (cancelIfNecessary == null) cancelIfNecessary = false;
				for (let file of this.files.slice()) if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) this.removeFile(file);
				return null;
			}
			resizeImage(file, width, height, resizeMethod, callback) {
				return this.createThumbnail(file, width, height, resizeMethod, true, (dataUrl, canvas) => {
					if (canvas == null) return callback(file);
					else {
						let { resizeMimeType } = this.options;
						if (resizeMimeType == null) resizeMimeType = file.type;
						if (this.options.resizeTransparencyFill != null) {
							let ctx = canvas.getContext("2d");
							ctx.globalCompositeOperation = "destination-over";
							ctx.fillStyle = this.options.resizeTransparencyFill;
							ctx.fillRect(0, 0, canvas.width, canvas.height);
						}
						let resizedDataURL = canvas.toDataURL(resizeMimeType, this.options.resizeQuality);
						if (resizeMimeType === "image/jpeg" || resizeMimeType === "image/jpg") resizedDataURL = ExifRestore.restore(file.dataURL, resizedDataURL);
						return callback(Dropzone.dataURItoBlob(resizedDataURL));
					}
				});
			}
			createThumbnail(file, width, height, resizeMethod, fixOrientation, callback) {
				let fileReader = new FileReader();
				fileReader.onload = () => {
					file.dataURL = fileReader.result;
					if (file.type === "image/svg+xml") {
						if (callback != null) callback(fileReader.result);
						return;
					}
					this.createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback);
				};
				fileReader.readAsDataURL(file);
			}
			displayExistingFile(mockFile, imageUrl, callback, crossOrigin, resizeThumbnail = true) {
				this.emit("addedfile", mockFile);
				this.emit("complete", mockFile);
				if (!resizeThumbnail) {
					this.emit("thumbnail", mockFile, imageUrl);
					if (callback) callback();
				} else {
					let onDone = (thumbnail) => {
						this.emit("thumbnail", mockFile, thumbnail);
						if (callback) callback();
					};
					mockFile.dataURL = imageUrl;
					this.createThumbnailFromUrl(mockFile, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, this.options.fixOrientation, onDone, crossOrigin);
				}
			}
			createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback, crossOrigin) {
				let img = document.createElement("img");
				if (crossOrigin) img.crossOrigin = crossOrigin;
				fixOrientation = getComputedStyle(document.body)["imageOrientation"] == "from-image" ? false : fixOrientation;
				img.onload = () => {
					let loadExif = (callback) => callback(1);
					if (typeof EXIF !== "undefined" && EXIF !== null && fixOrientation) loadExif = (callback) => EXIF.getData(img, function() {
						return callback(EXIF.getTag(this, "Orientation"));
					});
					return loadExif((orientation) => {
						file.width = img.width;
						file.height = img.height;
						let resizeInfo = this.options.resize.call(this, file, width, height, resizeMethod);
						let canvas = document.createElement("canvas");
						let ctx = canvas.getContext("2d");
						canvas.width = resizeInfo.trgWidth;
						canvas.height = resizeInfo.trgHeight;
						if (orientation > 4) {
							canvas.width = resizeInfo.trgHeight;
							canvas.height = resizeInfo.trgWidth;
						}
						switch (orientation) {
							case 2:
								ctx.translate(canvas.width, 0);
								ctx.scale(-1, 1);
								break;
							case 3:
								ctx.translate(canvas.width, canvas.height);
								ctx.rotate(Math.PI);
								break;
							case 4:
								ctx.translate(0, canvas.height);
								ctx.scale(1, -1);
								break;
							case 5:
								ctx.rotate(.5 * Math.PI);
								ctx.scale(1, -1);
								break;
							case 6:
								ctx.rotate(.5 * Math.PI);
								ctx.translate(0, -canvas.width);
								break;
							case 7:
								ctx.rotate(.5 * Math.PI);
								ctx.translate(canvas.height, -canvas.width);
								ctx.scale(-1, 1);
								break;
							case 8:
								ctx.rotate(-.5 * Math.PI);
								ctx.translate(-canvas.height, 0);
						}
						drawImageIOSFix(ctx, img, resizeInfo.srcX != null ? resizeInfo.srcX : 0, resizeInfo.srcY != null ? resizeInfo.srcY : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, resizeInfo.trgX != null ? resizeInfo.trgX : 0, resizeInfo.trgY != null ? resizeInfo.trgY : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
						let thumbnail = canvas.toDataURL("image/png");
						if (callback != null) return callback(thumbnail, canvas);
					});
				};
				if (callback != null) img.onerror = callback;
				return img.src = file.dataURL;
			}
			processQueue() {
				let { parallelUploads } = this.options;
				let processingLength = this.getUploadingFiles().length;
				let i = processingLength;
				if (processingLength >= parallelUploads) return;
				let queuedFiles = this.getQueuedFiles();
				if (!(queuedFiles.length > 0)) return;
				if (this.options.uploadMultiple) return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
				else while (i < parallelUploads) {
					if (!queuedFiles.length) return;
					this.processFile(queuedFiles.shift());
					i++;
				}
			}
			processFile(file) {
				return this.processFiles([file]);
			}
			processFiles(files) {
				for (let file of files) {
					file.processing = true;
					file.status = Dropzone.UPLOADING;
					this.emit("processing", file);
				}
				if (this.options.uploadMultiple) this.emit("processingmultiple", files);
				return this.uploadFiles(files);
			}
			_getFilesWithXhr(xhr) {
				return this.files.filter((file) => file.xhr === xhr).map((file) => file);
			}
			cancelUpload(file) {
				if (file.status === Dropzone.UPLOADING) {
					let groupedFiles = this._getFilesWithXhr(file.xhr);
					for (let groupedFile of groupedFiles) groupedFile.status = Dropzone.CANCELED;
					if (typeof file.xhr !== "undefined") file.xhr.abort();
					for (let groupedFile of groupedFiles) this.emit("canceled", groupedFile);
					if (this.options.uploadMultiple) this.emit("canceledmultiple", groupedFiles);
				} else if (file.status === Dropzone.ADDED || file.status === Dropzone.QUEUED) {
					file.status = Dropzone.CANCELED;
					this.emit("canceled", file);
					if (this.options.uploadMultiple) this.emit("canceledmultiple", [file]);
				}
				if (this.options.autoProcessQueue) return this.processQueue();
			}
			resolveOption(option, ...args) {
				if (typeof option === "function") return option.apply(this, args);
				return option;
			}
			uploadFile(file) {
				return this.uploadFiles([file]);
			}
			uploadFiles(files) {
				this._transformFiles(files, (transformedFiles) => {
					let chunkSize = Number(this.options.chunkSize);
					if (this.options.chunking) {
						let transformedFile = transformedFiles[0];
						files[0].upload.chunked = this.options.chunking && (this.options.forceChunking || transformedFile.size > chunkSize);
						files[0].upload.totalChunkCount = Math.max(1, Math.ceil(transformedFile.size / chunkSize));
					}
					if (files[0].upload.chunked) {
						let file = files[0];
						let transformedFile = transformedFiles[0];
						file.upload.chunks = [];
						let handleNextChunk = () => {
							let chunkIndex = 0;
							while (file.upload.chunks[chunkIndex] !== void 0) chunkIndex++;
							if (chunkIndex >= file.upload.totalChunkCount) return;
							let start = chunkIndex * chunkSize;
							let end = Math.min(start + chunkSize, transformedFile.size);
							let dataBlock = {
								name: this._getParamName(0),
								data: transformedFile.webkitSlice ? transformedFile.webkitSlice(start, end) : transformedFile.slice(start, end),
								filename: file.upload.filename,
								chunkIndex
							};
							file.upload.chunks[chunkIndex] = {
								file,
								index: chunkIndex,
								dataBlock,
								status: Dropzone.UPLOADING,
								progress: 0,
								retries: 0
							};
							this._uploadData(files, [dataBlock]);
						};
						file.upload.finishedChunkUpload = (chunk, response) => {
							let allFinished = true;
							chunk.status = Dropzone.SUCCESS;
							chunk.dataBlock = null;
							chunk.response = chunk.xhr.responseText;
							chunk.responseHeaders = chunk.xhr.getAllResponseHeaders();
							chunk.xhr = null;
							for (let i = 0; i < file.upload.totalChunkCount; i++) {
								if (file.upload.chunks[i] === void 0) return handleNextChunk();
								if (file.upload.chunks[i].status !== Dropzone.SUCCESS) allFinished = false;
							}
							if (allFinished) this.options.chunksUploaded(file, () => {
								this._finished(files, response, null);
							});
						};
						if (this.options.parallelChunkUploads) {
							let limit = this.options.parallelChunkUploads === true ? this.options.parallelUploads : this.options.parallelChunkUploads;
							let startCount = Math.max(1, Math.min(limit, file.upload.totalChunkCount));
							for (let i = 0; i < startCount; i++) handleNextChunk();
						} else handleNextChunk();
					} else {
						let dataBlocks = [];
						for (let i = 0; i < files.length; i++) dataBlocks[i] = {
							name: this._getParamName(i),
							data: transformedFiles[i],
							filename: files[i].upload.filename
						};
						this._uploadData(files, dataBlocks);
					}
				});
			}
			_getChunk(file, xhr) {
				for (let i = 0; i < file.upload.totalChunkCount; i++) if (file.upload.chunks[i] !== void 0 && file.upload.chunks[i].xhr === xhr) return file.upload.chunks[i];
			}
			_uploadData(files, dataBlocks) {
				let xhr = new XMLHttpRequest();
				for (let file of files) file.xhr = xhr;
				if (files[0].upload.chunked) files[0].upload.chunks[dataBlocks[0].chunkIndex].xhr = xhr;
				let method = this.resolveOption(this.options.method, files, dataBlocks);
				let url = this.resolveOption(this.options.url, files, dataBlocks);
				xhr.open(method, url, true);
				if (this.resolveOption(this.options.timeout, files)) xhr.timeout = this.resolveOption(this.options.timeout, files);
				xhr.withCredentials = !!this.options.withCredentials;
				xhr.onload = (e) => {
					this._finishedUploading(files, xhr, e);
				};
				xhr.ontimeout = () => {
					this._handleUploadError(files, xhr, `Request timedout after ${this.options.timeout / 1e3} seconds`);
				};
				xhr.onerror = () => {
					this._handleUploadError(files, xhr);
				};
				let progressObj = xhr.upload != null ? xhr.upload : xhr;
				progressObj.onprogress = (e) => this._updateFilesUploadProgress(files, xhr, e);
				let headers = this.options.defaultHeaders ? {
					Accept: "application/json",
					"Cache-Control": "no-cache",
					"X-Requested-With": "XMLHttpRequest"
				} : {};
				if (this.options.binaryBody) headers["Content-Type"] = files[0].type;
				if (this.options.headers) extend$1(headers, this.options.headers);
				for (let headerName in headers) {
					let headerValue = headers[headerName];
					if (headerValue) xhr.setRequestHeader(headerName, headerValue);
				}
				if (this.options.binaryBody) {
					for (let file of files) this.emit("sending", file, xhr);
					if (this.options.uploadMultiple) this.emit("sendingmultiple", files, xhr);
					this.submitRequest(xhr, null, files);
				} else {
					let formData = new FormData();
					if (this.options.params) {
						let additionalParams = this.options.params;
						if (typeof additionalParams === "function") additionalParams = additionalParams.call(this, files, xhr, files[0].upload.chunked ? this._getChunk(files[0], xhr) : null);
						for (let key in additionalParams) {
							let value = additionalParams[key];
							if (Array.isArray(value)) for (let i = 0; i < value.length; i++) formData.append(key, value[i]);
							else formData.append(key, value);
						}
					}
					for (let file of files) this.emit("sending", file, xhr, formData);
					if (this.options.uploadMultiple) this.emit("sendingmultiple", files, xhr, formData);
					this._addFormElementData(formData);
					for (let i = 0; i < dataBlocks.length; i++) {
						let dataBlock = dataBlocks[i];
						formData.append(dataBlock.name, dataBlock.data, dataBlock.filename);
					}
					this.submitRequest(xhr, formData, files);
				}
			}
			_transformFiles(files, done) {
				let transformedFiles = [];
				let doneCounter = 0;
				for (let i = 0; i < files.length; i++) this.options.transformFile.call(this, files[i], (transformedFile) => {
					transformedFiles[i] = transformedFile;
					if (++doneCounter === files.length) done(transformedFiles);
				});
			}
			_addFormElementData(formData) {
				if (this.element.tagName === "FORM") for (let input of this.element.querySelectorAll("input, textarea, select, button")) {
					let inputName = input.getAttribute("name");
					let inputType = input.getAttribute("type");
					if (inputType) inputType = inputType.toLowerCase();
					if (typeof inputName === "undefined" || inputName === null) continue;
					if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
						for (let option of input.options) if (option.selected) formData.append(inputName, option.value);
					} else if (!inputType || inputType !== "checkbox" && inputType !== "radio" || input.checked) formData.append(inputName, input.value);
				}
			}
			_updateFilesUploadProgress(files, xhr, e) {
				if (!files[0].upload.chunked) for (let file of files) {
					if (file.upload.total && file.upload.bytesSent && file.upload.bytesSent == file.upload.total) continue;
					if (e) {
						file.upload.progress = 100 * e.loaded / e.total;
						file.upload.total = e.total;
						file.upload.bytesSent = e.loaded;
					} else {
						file.upload.progress = 100;
						file.upload.bytesSent = file.upload.total;
					}
					this.emit("uploadprogress", file, file.upload.progress, file.upload.bytesSent);
				}
				else {
					let file = files[0];
					let chunk = this._getChunk(file, xhr);
					if (e) {
						chunk.progress = 100 * e.loaded / e.total;
						chunk.total = e.total;
						chunk.bytesSent = e.loaded;
					} else {
						chunk.progress = 100;
						chunk.bytesSent = chunk.total;
					}
					file.upload.progress = 0;
					file.upload.total = 0;
					file.upload.bytesSent = 0;
					for (let i = 0; i < file.upload.totalChunkCount; i++) if (file.upload.chunks[i] && typeof file.upload.chunks[i].progress !== "undefined") {
						file.upload.progress += file.upload.chunks[i].progress;
						file.upload.total += file.upload.chunks[i].total;
						file.upload.bytesSent += file.upload.chunks[i].bytesSent;
					}
					file.upload.progress = file.upload.progress / file.upload.totalChunkCount;
					this.emit("uploadprogress", file, file.upload.progress, file.upload.bytesSent);
				}
			}
			_finishedUploading(files, xhr, e) {
				let response;
				if (files[0].status === Dropzone.CANCELED) return;
				if (xhr.readyState !== 4) return;
				if (xhr.responseType !== "arraybuffer" && xhr.responseType !== "blob") {
					response = xhr.responseText;
					if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) try {
						response = JSON.parse(response);
					} catch (error) {
						e = error;
						response = "Invalid JSON response from server.";
					}
				}
				this._updateFilesUploadProgress(files, xhr);
				if (!(200 <= xhr.status && xhr.status < 300)) this._handleUploadError(files, xhr, response);
				else if (files[0].upload.chunked) files[0].upload.finishedChunkUpload(this._getChunk(files[0], xhr), response);
				else this._finished(files, response, e);
			}
			_handleUploadError(files, xhr, response) {
				if (files[0].status === Dropzone.CANCELED) return;
				if (files[0].upload.chunked && this.options.retryChunks) {
					let chunk = this._getChunk(files[0], xhr);
					if (chunk.retries++ < this.options.retryChunksLimit) {
						this._uploadData(files, [chunk.dataBlock]);
						return;
					} else console.warn("Retried this chunk too often. Giving up.");
				}
				this._errorProcessing(files, response || this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr);
			}
			submitRequest(xhr, formData, files) {
				if (xhr.readyState != 1) {
					console.warn("Cannot send this request because the XMLHttpRequest.readyState is not OPENED.");
					return;
				}
				if (this.options.binaryBody) {
					if (files[0].upload.chunked) {
						const chunk = this._getChunk(files[0], xhr);
						xhr.send(chunk.dataBlock.data);
					} else xhr.send(files[0]);
				} else xhr.send(formData);
			}
			_finished(files, responseText, e) {
				for (let file of files) {
					file.status = Dropzone.SUCCESS;
					this.emit("success", file, responseText, e);
					this.emit("complete", file);
				}
				if (this.options.uploadMultiple) {
					this.emit("successmultiple", files, responseText, e);
					this.emit("completemultiple", files);
				}
				if (this.options.autoProcessQueue) return this.processQueue();
			}
			_errorProcessing(files, message, xhr) {
				for (let file of files) {
					file.status = Dropzone.ERROR;
					this.emit("error", file, message, xhr);
					this.emit("complete", file);
				}
				if (this.options.uploadMultiple) {
					this.emit("errormultiple", files, message, xhr);
					this.emit("completemultiple", files);
				}
				if (this.options.autoProcessQueue) return this.processQueue();
			}
			static uuidv4() {
				return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
					let r = Math.random() * 16 | 0;
					return (c === "x" ? r : r & 3 | 8).toString(16);
				});
			}
		};
		Dropzone$3.initClass();
		Dropzone$3.options = {};
		Dropzone$3.optionsForElement = function(element) {
			if (element.getAttribute("id")) return Dropzone$3.options[camelize(element.getAttribute("id"))];
			else return;
		};
		Dropzone$3.instances = [];
		Dropzone$3.forElement = function(element) {
			if (typeof element === "string") element = document.querySelector(element);
			if ((element != null ? element.dropzone : void 0) == null) throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
			return element.dropzone;
		};
		Dropzone$3.discover = function() {
			let dropzones;
			if (document.querySelectorAll) dropzones = document.querySelectorAll(".dropzone");
			else {
				dropzones = [];
				let checkElements = (elements) => (() => {
					let result = [];
					for (let el of elements) if (/(^| )dropzone($| )/.test(el.className)) result.push(dropzones.push(el));
					else result.push(void 0);
					return result;
				})();
				checkElements(document.getElementsByTagName("div"));
				checkElements(document.getElementsByTagName("form"));
			}
			return (() => {
				let result = [];
				for (let dropzone of dropzones) if (Dropzone$3.optionsForElement(dropzone) !== false) result.push(new Dropzone$3(dropzone));
				else result.push(void 0);
				return result;
			})();
		};
		Dropzone$3.blockedBrowsers = [/opera.*(Macintosh|Windows Phone).*version\/12/i];
		Dropzone$3.isBrowserSupported = function() {
			let capableBrowser = true;
			if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
				if (!("classList" in document.createElement("a"))) capableBrowser = false;
				else {
					if (Dropzone$3.blacklistedBrowsers !== void 0) Dropzone$3.blockedBrowsers = Dropzone$3.blacklistedBrowsers;
					for (let regex of Dropzone$3.blockedBrowsers) if (regex.test(navigator.userAgent)) {
						capableBrowser = false;
						continue;
					}
				}
			} else capableBrowser = false;
			return capableBrowser;
		};
		Dropzone$3.dataURItoBlob = function(dataURI) {
			let byteString = atob(dataURI.split(",")[1]);
			let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
			let ab = new ArrayBuffer(byteString.length);
			let ia = new Uint8Array(ab);
			for (let i = 0, end = byteString.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) ia[i] = byteString.charCodeAt(i);
			return new Blob([ab], { type: mimeString });
		};
		without = (list, rejectedItem) => list.filter((item) => item !== rejectedItem).map((item) => item);
		camelize = (str) => str.replace(/[-_](\w)/g, (match) => match.charAt(1).toUpperCase());
		Dropzone$3.createElement = function(string) {
			let div = document.createElement("div");
			div.innerHTML = string;
			return div.childNodes[0];
		};
		Dropzone$3.elementInside = function(element, container) {
			if (element === container) return true;
			while (element = element.parentNode) if (element === container) return true;
			return false;
		};
		Dropzone$3.getElement = function(el, name) {
			let element;
			if (typeof el === "string") element = document.querySelector(el);
			else if (el.nodeType != null) element = el;
			if (element == null) throw new Error(`Invalid \`${name}\` option provided. Please provide a CSS selector or a plain HTML element.`);
			return element;
		};
		Dropzone$3.getElements = function(els, name) {
			let el, elements;
			if (els instanceof Array) {
				elements = [];
				try {
					for (el of els) elements.push(this.getElement(el, name));
				} catch (e) {
					elements = null;
				}
			} else if (typeof els === "string") {
				elements = [];
				for (el of document.querySelectorAll(els)) elements.push(el);
			} else if (els.nodeType != null) elements = [els];
			if (elements == null || !elements.length) throw new Error(`Invalid \`${name}\` option provided. Please provide a CSS selector, a plain HTML element or a list of those.`);
			return elements;
		};
		Dropzone$3.confirm = function(question, accepted, rejected) {
			if (window.confirm(question)) return accepted();
			else if (rejected != null) return rejected();
		};
		Dropzone$3.isValidFile = function(file, acceptedFiles) {
			if (!acceptedFiles) return true;
			acceptedFiles = acceptedFiles.split(",");
			let mimeType = file.type;
			let baseMimeType = mimeType.replace(/\/.*$/, "");
			for (let validType of acceptedFiles) {
				validType = validType.trim();
				if (validType.charAt(0) === ".") {
					if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) return true;
				} else if (validType.endsWith("/*")) {
					if (baseMimeType === validType.replace(/\/.*$/, "")) return true;
				} else if (mimeType === validType) return true;
			}
			return false;
		};
		if (typeof jQuery !== "undefined" && jQuery !== null) jQuery.fn.dropzone = function(options) {
			return this.each(function() {
				return new Dropzone$3(this, options);
			});
		};
		Dropzone$3.ADDED = "added";
		Dropzone$3.QUEUED = "queued";
		Dropzone$3.ACCEPTED = Dropzone$3.QUEUED;
		Dropzone$3.UPLOADING = "uploading";
		Dropzone$3.PROCESSING = Dropzone$3.UPLOADING;
		Dropzone$3.CANCELED = "canceled";
		Dropzone$3.ERROR = "error";
		Dropzone$3.SUCCESS = "success";
		detectVerticalSquash = function(img) {
			let ih = img.naturalHeight;
			let canvas = document.createElement("canvas");
			canvas.width = 1;
			canvas.height = ih;
			let ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			let { data } = ctx.getImageData(1, 0, 1, ih);
			let sy = 0;
			let ey = ih;
			let py = ih;
			while (py > sy) {
				if (data[(py - 1) * 4 + 3] === 0) ey = py;
				else sy = py;
				py = ey + sy >> 1;
			}
			let ratio = py / ih;
			if (ratio === 0) return 1;
			else return ratio;
		};
		drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
			let vertSquashRatio = detectVerticalSquash(img);
			return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
		};
		ExifRestore = class {
			static initClass() {
				this.KEY_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			}
			static encode64(input) {
				let output = "";
				let chr1 = void 0;
				let chr2 = void 0;
				let chr3 = "";
				let enc1 = void 0;
				let enc2 = void 0;
				let enc3 = void 0;
				let enc4 = "";
				let i = 0;
				while (true) {
					chr1 = input[i++];
					chr2 = input[i++];
					chr3 = input[i++];
					enc1 = chr1 >> 2;
					enc2 = (chr1 & 3) << 4 | chr2 >> 4;
					enc3 = (chr2 & 15) << 2 | chr3 >> 6;
					enc4 = chr3 & 63;
					if (isNaN(chr2)) enc3 = enc4 = 64;
					else if (isNaN(chr3)) enc4 = 64;
					output = output + this.KEY_STR.charAt(enc1) + this.KEY_STR.charAt(enc2) + this.KEY_STR.charAt(enc3) + this.KEY_STR.charAt(enc4);
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
					if (!(i < input.length)) break;
				}
				return output;
			}
			static restore(origFileBase64, resizedFileBase64) {
				if (!origFileBase64.match("data:image/jpeg;base64,")) return resizedFileBase64;
				let rawImage = this.decode64(origFileBase64.replace("data:image/jpeg;base64,", ""));
				let segments = this.slice2Segments(rawImage);
				let image = this.exifManipulation(resizedFileBase64, segments);
				return `data:image/jpeg;base64,${this.encode64(image)}`;
			}
			static exifManipulation(resizedFileBase64, segments) {
				let exifArray = this.getExifArray(segments);
				let newImageArray = this.insertExif(resizedFileBase64, exifArray);
				return new Uint8Array(newImageArray);
			}
			static getExifArray(segments) {
				let seg = void 0;
				let x = 0;
				while (x < segments.length) {
					seg = segments[x];
					if (seg[0] === 255 & seg[1] === 225) return seg;
					x++;
				}
				return [];
			}
			static insertExif(resizedFileBase64, exifArray) {
				let imageData = resizedFileBase64.replace("data:image/jpeg;base64,", "");
				let buf = this.decode64(imageData);
				let separatePoint = buf.indexOf(255, 3);
				let mae = buf.slice(0, separatePoint);
				let ato = buf.slice(separatePoint);
				let array = mae;
				array = array.concat(exifArray);
				array = array.concat(ato);
				return array;
			}
			static slice2Segments(rawImageArray) {
				let head = 0;
				let segments = [];
				while (true) {
					var length;
					if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 218) break;
					if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 216) head += 2;
					else {
						length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3];
						let endPoint = head + length + 2;
						let seg = rawImageArray.slice(head, endPoint);
						segments.push(seg);
						head = endPoint;
					}
					if (head > rawImageArray.length) break;
				}
				return segments;
			}
			static decode64(input) {
				let chr1 = void 0;
				let chr2 = void 0;
				let chr3 = "";
				let enc1 = void 0;
				let enc2 = void 0;
				let enc3 = void 0;
				let enc4 = "";
				let i = 0;
				let buf = [];
				if (/[^A-Za-z0-9+/=]/g.exec(input)) console.warn("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding.");
				input = input.replace(/[^A-Za-z0-9+/=]/g, "");
				while (true) {
					enc1 = this.KEY_STR.indexOf(input.charAt(i++));
					enc2 = this.KEY_STR.indexOf(input.charAt(i++));
					enc3 = this.KEY_STR.indexOf(input.charAt(i++));
					enc4 = this.KEY_STR.indexOf(input.charAt(i++));
					chr1 = enc1 << 2 | enc2 >> 4;
					chr2 = (enc2 & 15) << 4 | enc3 >> 2;
					chr3 = (enc3 & 3) << 6 | enc4;
					buf.push(chr1);
					if (enc3 !== 64) buf.push(chr2);
					if (enc4 !== 64) buf.push(chr3);
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
					if (!(i < input.length)) break;
				}
				return buf;
			}
		};
		ExifRestore.initClass();
	}));
	//#endregion
	//#region resources/js/shared/features/forms/file-download.js
	var import_dropzone = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
		/**
		* DropzoneJS is an open source library that provides drag’n’drop
		* file uploads with image previews.
		*
		* @see http://www.dropzonejs.com/
		*/
		var dropzoneModule = (init_dropzone(), __toCommonJS(dropzone_exports));
		var Dropzone = dropzoneModule.Dropzone || dropzoneModule.default || dropzoneModule;
		Dropzone.autoDiscover = false;
		if (Dropzone.prototype && Dropzone.prototype.defaultOptions) Dropzone.prototype.defaultOptions.headers = { "X-CSRF-TOKEN": Admin.token };
		window.Dropzone = Dropzone;
		module.exports = Dropzone;
	})))());
	async function downloadFile(url, options = {}) {
		const { document, fetch, urlApi } = downloadDependencies(options);
		assertDependencies(document, fetch, urlApi);
		const response = await fetch(url, { credentials: "same-origin" });
		assertResponse(response);
		const objectUrl = urlApi.createObjectURL(await response.blob());
		const link = document.createElement("a");
		link.href = objectUrl;
		link.download = downloadName(url, document.baseURI);
		link.hidden = true;
		document.body.append(link);
		link.click();
		link.remove();
		globalThis.setTimeout(() => urlApi.revokeObjectURL(objectUrl), 0);
	}
	function downloadName(url, baseUrl) {
		try {
			var _pathname$split$filte;
			const pathname = new globalThis.URL(url, baseUrl).pathname;
			return decodeURIComponent((_pathname$split$filte = pathname.split("/").filter(Boolean).pop()) !== null && _pathname$split$filte !== void 0 ? _pathname$split$filte : "download");
		} catch (_unused) {
			return "download";
		}
	}
	function downloadDependencies(options) {
		var _options$document, _options$fetch, _ref, _options$urlApi, _document$defaultView;
		const document = (_options$document = options.document) !== null && _options$document !== void 0 ? _options$document : globalThis.document;
		return {
			document,
			fetch: (_options$fetch = options.fetch) !== null && _options$fetch !== void 0 ? _options$fetch : globalThis.fetch,
			urlApi: (_ref = (_options$urlApi = options.urlApi) !== null && _options$urlApi !== void 0 ? _options$urlApi : document === null || document === void 0 || (_document$defaultView = document.defaultView) === null || _document$defaultView === void 0 ? void 0 : _document$defaultView.URL) !== null && _ref !== void 0 ? _ref : globalThis.URL
		};
	}
	function assertResponse(response) {
		var _response$status;
		if (response === null || response === void 0 ? void 0 : response.ok) return;
		throw new Error(`File download failed with status ${(_response$status = response === null || response === void 0 ? void 0 : response.status) !== null && _response$status !== void 0 ? _response$status : 0}.`);
	}
	function assertDependencies(document, fetch, urlApi) {
		if (!(document === null || document === void 0 ? void 0 : document.body) || typeof document.createElement !== "function") throw new TypeError("File download requires a document.");
		if (typeof fetch !== "function") throw new TypeError("File download requires fetch.");
		if (typeof (urlApi === null || urlApi === void 0 ? void 0 : urlApi.createObjectURL) !== "function") throw new TypeError("File download requires URL.createObjectURL().");
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/file-upload.js
	function createFileUpload(Upload, element, config) {
		return new Upload(element, fileUploadOptions(config));
	}
	function fileUploadOptions(config) {
		return {
			url: config.url,
			method: "POST",
			uploadMultiple: false,
			previewsContainer: false,
			dictDefaultMessage: "",
			maxFilesize: config.maxFileSize,
			dictFileTooBig: config.fileTooBigText,
			dictResponseError: config.responseErrorText,
			headers: { "X-CSRF-TOKEN": config.csrfToken },
			sending: config.onSending,
			success: (_file, response) => config.onSuccess(response),
			error: (_file, response) => config.onError(response),
			complete: config.onComplete
		};
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/file-value.js
	function normalizeFileValue(value) {
		return value === null || value === void 0 ? "" : String(value);
	}
	function fileDownloadUrl(value, createUploadUrl) {
		const normalized = normalizeFileValue(value);
		return normalized.startsWith("http") ? normalized : createUploadUrl(normalized);
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/upload-response.js
	function responseErrors(response) {
		return Array.isArray(response === null || response === void 0 ? void 0 : response.errors) ? response.errors : [];
	}
	//#endregion
	//#region \0plugin-vue:export-helper
	var _plugin_vue_export_helper_default = (sfc, props) => {
		const target = sfc.__vccOpts || sfc;
		for (const [key, val] of props) target[key] = val;
		return target;
	};
	//#endregion
	//#region resources/js/shared/legacy/admin/form/file.vue
	var _sfc_main$4 = /* @__PURE__ */ defineComponent({
		name: "ElementFile",
		props: {
			classes: {
				type: Object,
				default: () => ({})
			},
			csrfToken: {
				type: String,
				required: true
			},
			labels: {
				type: Object,
				required: true
			},
			maxFileSize: {
				type: Number,
				required: true
			},
			messages: {
				type: Object,
				required: true
			},
			name: {
				type: String,
				required: true
			},
			readonly: Boolean,
			url: {
				type: String,
				required: true
			},
			value: {
				type: [String, Number],
				default: ""
			}
		},
		data() {
			return {
				errors: [],
				uploader: null,
				uploading: false,
				val: normalizeFileValue(this.value)
			};
		},
		computed: {
			downloadUrl() {
				return fileDownloadUrl(this.val, (path) => Admin.Url.upload(path));
			},
			hasValue() {
				return this.val.length > 0;
			},
			uploadIconClass() {
				return this.uploading ? this.classes.uploadingIcon : this.classes.uploadIcon;
			},
			stateClasses() {
				return {
					"soa-is-empty": !this.hasValue,
					"soa-is-error": this.errors.length > 0,
					"soa-is-readonly": this.readonly,
					"soa-is-uploading": this.uploading
				};
			}
		},
		mounted() {
			if (!this.readonly) this.mountUpload();
		},
		beforeUnmount() {
			var _this$uploader;
			(_this$uploader = this.uploader) === null || _this$uploader === void 0 || _this$uploader.destroy();
			this.uploader = null;
		},
		methods: {
			closeAlert() {
				this.errors = [];
			},
			completeUpload(response) {
				this.val = normalizeFileValue(response === null || response === void 0 ? void 0 : response.value);
			},
			async downloadCurrent() {
				try {
					await downloadFile(this.downloadUrl, { document: this.$el.ownerDocument });
				} catch (error) {
					Admin.Messages.error(this.messages.responseError, error.message);
				}
			},
			failUpload(response) {
				const errors = responseErrors(response);
				if (errors[0]) Admin.Messages.error(response === null || response === void 0 ? void 0 : response.message, errors[0]);
				this.errors = errors;
			},
			finishUpload() {
				this.uploading = false;
			},
			mountUpload() {
				this.uploader = createFileUpload(import_dropzone.default, this.$refs.uploadButton, {
					csrfToken: this.csrfToken,
					fileTooBigText: this.messages.fileTooBig,
					maxFileSize: this.maxFileSize,
					onComplete: this.finishUpload,
					onError: this.failUpload,
					onSending: this.startUpload,
					onSuccess: this.completeUpload,
					responseErrorText: this.messages.responseError,
					url: this.url
				});
			},
			async remove() {
				if ((await Admin.Messages.confirm(this.messages.confirmRemove)).value) this.val = "";
			},
			startUpload() {
				this.uploading = true;
				this.closeAlert();
			}
		}
	});
	var _hoisted_1$5 = ["aria-busy", "aria-readonly"];
	var _hoisted_2$4 = [
		"href",
		"title",
		"aria-label"
	];
	var _hoisted_3$4 = ["title", "aria-label"];
	var _hoisted_4$4 = { key: 2 };
	var _hoisted_5$4 = ["name", "value"];
	function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
		return openBlock(), createElementBlock("div", {
			class: normalizeClass(["soa-file", _ctx.stateClasses]),
			"aria-busy": _ctx.uploading ? "true" : "false",
			"aria-readonly": _ctx.readonly ? "true" : void 0
		}, [
			_ctx.errors.length ? (openBlock(), createElementBlock("div", {
				key: 0,
				"data-file-alert": "",
				class: normalizeClass(_ctx.classes.alert)
			}, [createBaseVNode("button", {
				type: "button",
				"data-file-alert-close": "",
				class: normalizeClass(_ctx.classes.alertClose),
				"aria-label": "Close",
				onClick: _cache[0] || (_cache[0] = (...args) => _ctx.closeAlert && _ctx.closeAlert(...args))
			}, [..._cache[3] || (_cache[3] = [createBaseVNode("span", { "aria-hidden": "true" }, "×", -1)])], 2), (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.errors, (error) => {
				return openBlock(), createElementBlock("p", { key: error }, [createBaseVNode("i", {
					"data-file-error-icon": "",
					class: normalizeClass(_ctx.classes.errorIcon),
					"aria-hidden": "true"
				}, null, 2), createTextVNode(" " + toDisplayString(error), 1)]);
			}), 128))], 2)) : createCommentVNode("v-if", true),
			_ctx.hasValue ? (openBlock(), createElementBlock("div", {
				key: 1,
				"data-file-current": "",
				class: normalizeClass(_ctx.classes.current)
			}, [createBaseVNode("div", {
				"data-file-item": "",
				class: normalizeClass(_ctx.classes.item)
			}, [createBaseVNode("div", { class: normalizeClass(_ctx.classes.file) }, [createBaseVNode("i", {
				class: normalizeClass(_ctx.classes.fileIcon),
				"aria-hidden": "true"
			}, null, 2)], 2), createBaseVNode("div", { class: normalizeClass(_ctx.classes.info) }, [createBaseVNode("a", {
				href: _ctx.downloadUrl,
				"data-file-download": "",
				class: normalizeClass(_ctx.classes.downloadButton),
				download: "",
				title: _ctx.labels.download,
				"aria-label": _ctx.labels.download,
				onClick: _cache[1] || (_cache[1] = withModifiers((...args) => _ctx.downloadCurrent && _ctx.downloadCurrent(...args), ["prevent"]))
			}, [createBaseVNode("i", {
				class: normalizeClass(_ctx.classes.downloadIcon),
				"aria-hidden": "true"
			}, null, 2)], 10, _hoisted_2$4), !_ctx.readonly ? (openBlock(), createElementBlock("button", {
				key: 0,
				type: "button",
				"data-file-remove": "",
				class: normalizeClass(_ctx.classes.removeButton),
				title: _ctx.labels.remove,
				"aria-label": _ctx.labels.remove,
				onClick: _cache[2] || (_cache[2] = (...args) => _ctx.remove && _ctx.remove(...args))
			}, [createBaseVNode("i", {
				class: normalizeClass(_ctx.classes.removeIcon),
				"aria-hidden": "true"
			}, null, 2)], 10, _hoisted_3$4)) : createCommentVNode("v-if", true)], 2)], 2)], 2)) : createCommentVNode("v-if", true),
			!_ctx.readonly ? (openBlock(), createElementBlock("div", _hoisted_4$4, [createBaseVNode("button", {
				ref: "uploadButton",
				type: "button",
				"data-file-upload": "",
				class: normalizeClass(_ctx.classes.uploadButton)
			}, [createBaseVNode("i", {
				"data-file-upload-icon": "",
				class: normalizeClass(_ctx.uploadIconClass),
				"aria-hidden": "true"
			}, null, 2), createTextVNode(" " + toDisplayString(_ctx.labels.browse), 1)], 2)])) : createCommentVNode("v-if", true),
			createBaseVNode("input", {
				"data-file-value": "",
				name: _ctx.name,
				type: "hidden",
				value: _ctx.val
			}, null, 8, _hoisted_5$4)
		], 10, _hoisted_1$5);
	}
	var file_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$4, [["render", _sfc_render$4], ["__file", "file.vue"]]);
	//#endregion
	//#region resources/js/shared/legacy/admin/form/image-paste-buffer.js
	var PASTE_BUFFER_ID = "image-paste-in-buffer";
	function readImagePasteBuffer(document) {
		const element = findImagePasteBuffer(document);
		if (!(element === null || element === void 0 ? void 0 : element.src)) return null;
		return {
			dataUrl: element.src,
			extension: element.dataset.ext || "jpg"
		};
	}
	function createImagePasteBody(buffer, dependencies = {}) {
		var _dependencies$now, _dependencies$FormDat;
		const now = (_dependencies$now = dependencies.now) !== null && _dependencies$now !== void 0 ? _dependencies$now : Date.now;
		const FormDataType = (_dependencies$FormDat = dependencies.FormDataType) !== null && _dependencies$FormDat !== void 0 ? _dependencies$FormDat : globalThis.FormData;
		const filename = `${now()}.${buffer.extension || "jpg"}`;
		const file = dataUrlToFile(buffer.dataUrl, filename, dependencies);
		const body = new FormDataType();
		body.append("file", file, filename);
		return body;
	}
	function dataUrlToFile(dataUrl, filename, dependencies = {}) {
		var _dependencies$decode, _dependencies$FileTyp, _metadata$match;
		const decode = (_dependencies$decode = dependencies.decode) !== null && _dependencies$decode !== void 0 ? _dependencies$decode : globalThis.atob;
		const FileType = (_dependencies$FileTyp = dependencies.FileType) !== null && _dependencies$FileTyp !== void 0 ? _dependencies$FileTyp : globalThis.File;
		const [metadata, payload] = String(dataUrl).split(",", 2);
		const mime = (_metadata$match = metadata.match(/^data:([^;]+);base64$/)) === null || _metadata$match === void 0 ? void 0 : _metadata$match[1];
		if (!mime || payload === void 0) throw new TypeError("Invalid image data URL.");
		const binary = decode(payload);
		return new FileType([Uint8Array.from(binary, (character) => character.charCodeAt(0))], filename, { type: mime });
	}
	function removeImagePasteBuffer(document, revokeObjectUrl = defaultRevoke) {
		const element = findImagePasteBuffer(document);
		if (!element) return false;
		if (element.name && typeof revokeObjectUrl === "function") revokeObjectUrl(element.name);
		element.remove();
		return true;
	}
	function findImagePasteBuffer(document) {
		var _document$getElementB;
		return (_document$getElementB = document === null || document === void 0 ? void 0 : document.getElementById(PASTE_BUFFER_ID)) !== null && _document$getElementB !== void 0 ? _document$getElementB : null;
	}
	function defaultRevoke(url) {
		var _globalThis$URL, _globalThis$URL$revok;
		(_globalThis$URL = globalThis.URL) === null || _globalThis$URL === void 0 || (_globalThis$URL$revok = _globalThis$URL.revokeObjectURL) === null || _globalThis$URL$revok === void 0 || _globalThis$URL$revok.call(_globalThis$URL, url);
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/image-upload.js
	function createImageUpload(Upload, element, config) {
		return new Upload(element, imageUploadOptions(config));
	}
	function imageUploadOptions(config) {
		return {
			url: config.url,
			method: "POST",
			uploadMultiple: false,
			previewsContainer: false,
			acceptedFiles: "image/*",
			dictDefaultMessage: "",
			maxFilesize: config.maxFileSize,
			dictFileTooBig: config.fileTooBigText,
			dictInvalidFileType: config.invalidFileTypeText,
			dictResponseError: config.responseErrorText,
			headers: { "X-CSRF-TOKEN": config.csrfToken },
			sending: config.onSending,
			success: (_file, response) => config.onSuccess(response),
			error: (_file, response) => config.onError(response),
			complete: config.onComplete
		};
	}
	async function postPastedImage(http, url, body) {
		return (await http.post(url, body)).json();
	}
	async function imageUploadError(error, fallbackTitle) {
		const response = error === null || error === void 0 ? void 0 : error.response;
		const data = await responseData(response);
		const validationError = Array.isArray(data.errors) ? data.errors[0] : null;
		if (validationError) return {
			title: data.message || fallbackTitle,
			message: validationError
		};
		if (!response) return {
			title: fallbackTitle,
			message: ""
		};
		return {
			title: statusTitle(response, fallbackTitle),
			message: data.message || ""
		};
	}
	async function responseData(response) {
		if (typeof (response === null || response === void 0 ? void 0 : response.json) !== "function") return {};
		try {
			return await response.json();
		} catch (_unused) {
			return {};
		}
	}
	function statusTitle(response, fallbackTitle) {
		const status = response.status ? `(${response.status})` : "";
		return [response.statusText || fallbackTitle, status].filter(Boolean).join(" ");
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/image-value.js
	function normalizeImageValue(value) {
		return value === null || value === void 0 ? "" : String(value);
	}
	function isBlobImageValue(value) {
		return normalizeImageValue(value).startsWith("blob:");
	}
	function imagePreviewUrl(value, options) {
		const normalized = normalizeImageValue(value);
		if (isExternalImageValue(normalized)) return normalized;
		if (options.useAssetPrefix && options.assetPrefix) return `${options.assetPrefix}${normalized}`;
		return options.createUploadUrl(normalized);
	}
	function isExternalImageValue(value) {
		return value.startsWith("http") || value.startsWith("blob:");
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/image.vue
	var _sfc_main$3 = /* @__PURE__ */ defineComponent({
		name: "ElementImage",
		props: {
			assetPrefix: {
				type: String,
				default: ""
			},
			classes: {
				type: Object,
				default: () => ({})
			},
			csrfToken: {
				type: String,
				required: true
			},
			labels: {
				type: Object,
				required: true
			},
			maxFileSize: {
				type: Number,
				required: true
			},
			messages: {
				type: Object,
				required: true
			},
			name: {
				type: String,
				required: true
			},
			onlyLink: Boolean,
			readonly: Boolean,
			url: {
				type: String,
				required: true
			},
			value: {
				type: [String, Number],
				default: ""
			}
		},
		data() {
			return {
				disposed: false,
				errors: [],
				pasteActive: false,
				uploader: null,
				uploading: false,
				useAssetPrefix: true,
				val: normalizeImageValue(this.value)
			};
		},
		computed: {
			hasValue() {
				return this.val.length > 0;
			},
			previewUrl() {
				return imagePreviewUrl(this.val, {
					assetPrefix: this.assetPrefix,
					createUploadUrl: (path) => Admin.Url.upload(path),
					useAssetPrefix: this.useAssetPrefix
				});
			},
			uploadIconClass() {
				return this.uploading ? this.classes.uploadingIcon : this.classes.uploadIcon;
			},
			stateClasses() {
				return {
					"soa-is-empty": !this.hasValue,
					"soa-is-error": this.errors.length > 0,
					"soa-is-readonly": this.readonly,
					"soa-is-uploading": this.uploading
				};
			}
		},
		mounted() {
			if (!this.readonly && !this.onlyLink) this.mountUpload();
		},
		beforeUnmount() {
			var _this$uploader;
			this.disposed = true;
			(_this$uploader = this.uploader) === null || _this$uploader === void 0 || _this$uploader.destroy();
			this.uploader = null;
			if (this.pasteActive) removeImagePasteBuffer(this.pasteDocument());
		},
		methods: {
			acceptPastedUpload(response) {
				var _response$path;
				const value = (_response$path = response === null || response === void 0 ? void 0 : response.path) !== null && _response$path !== void 0 ? _response$path : response === null || response === void 0 ? void 0 : response.value;
				if (value === void 0) return;
				this.val = normalizeImageValue(value);
				this.useAssetPrefix = false;
			},
			applyInsertedValue(value) {
				if (!value) return removeImagePasteBuffer(this.pasteDocument());
				if (isBlobImageValue(value)) {
					if (this.onlyLink) return removeImagePasteBuffer(this.pasteDocument());
					return this.uploadPastedImage();
				}
				removeImagePasteBuffer(this.pasteDocument());
				this.val = normalizeImageValue(value);
				return true;
			},
			closeAlert() {
				this.errors = [];
			},
			completeUpload(response) {
				if ((response === null || response === void 0 ? void 0 : response.value) === void 0) return;
				this.val = normalizeImageValue(response.value);
				this.useAssetPrefix = false;
			},
			async downloadCurrent() {
				try {
					await downloadFile(this.previewUrl, { document: this.$el.ownerDocument });
				} catch (error) {
					if (!this.disposed) Admin.Messages.error(this.messages.responseError, error.message);
				}
			},
			failUpload(response) {
				const errors = responseErrors(response);
				if (errors[0]) Admin.Messages.error(response === null || response === void 0 ? void 0 : response.message, errors[0]);
				this.errors = errors;
			},
			finishUpload() {
				this.uploading = false;
			},
			async insert(showCurrent) {
				this.pasteActive = true;
				try {
					const result = await Admin.Messages.cliptobuffer(this.labels.insertLink, null, null, showCurrent ? this.val : null, showCurrent ? this.previewUrl : null);
					if (!this.disposed) await this.applyInsertedValue(result === null || result === void 0 ? void 0 : result.value);
				} finally {
					this.pasteActive = false;
				}
			},
			mountUpload() {
				this.uploader = createImageUpload(import_dropzone.default, this.$refs.uploadButton, {
					csrfToken: this.csrfToken,
					fileTooBigText: this.messages.fileTooBig,
					invalidFileTypeText: this.messages.invalidFileType,
					maxFileSize: this.maxFileSize,
					onComplete: this.finishUpload,
					onError: this.failUpload,
					onSending: this.startUpload,
					onSuccess: this.completeUpload,
					responseErrorText: this.messages.responseError,
					url: this.url
				});
			},
			pasteDocument() {
				return this.$el.ownerDocument;
			},
			async remove() {
				const result = await Admin.Messages.confirm(this.messages.confirmRemove);
				if (!this.disposed && result.value) this.val = "";
			},
			startUpload() {
				this.uploading = true;
				this.closeAlert();
			},
			async uploadPastedImage() {
				const document = this.pasteDocument();
				const buffer = readImagePasteBuffer(document);
				if (!buffer) return false;
				this.startUpload();
				try {
					const body = createImagePasteBody(buffer);
					const response = await postPastedImage(Admin.Http, this.url, body);
					if (!this.disposed) this.acceptPastedUpload(response);
				} catch (error) {
					await this.showPasteUploadError(error);
				} finally {
					removeImagePasteBuffer(document);
					if (!this.disposed) this.finishUpload();
				}
				return true;
			},
			async showPasteUploadError(error) {
				const details = await imageUploadError(error, this.messages.responseError);
				if (!this.disposed) Admin.Messages.error(details.title, details.message);
			}
		}
	});
	var _hoisted_1$4 = ["aria-busy", "aria-readonly"];
	var _hoisted_2$3 = ["href"];
	var _hoisted_3$3 = ["src"];
	var _hoisted_4$3 = [
		"href",
		"title",
		"aria-label"
	];
	var _hoisted_5$3 = ["title", "aria-label"];
	var _hoisted_6$2 = ["title", "aria-label"];
	var _hoisted_7$2 = { key: 2 };
	var _hoisted_8$2 = ["title", "aria-label"];
	var _hoisted_9$2 = ["name", "value"];
	function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
		return openBlock(), createElementBlock("div", {
			class: normalizeClass(["soa-image", _ctx.stateClasses]),
			"aria-busy": _ctx.uploading ? "true" : "false",
			"aria-readonly": _ctx.readonly ? "true" : void 0
		}, [
			_ctx.errors.length ? (openBlock(), createElementBlock("div", {
				key: 0,
				"data-image-alert": "",
				class: normalizeClass(_ctx.classes.alert)
			}, [createBaseVNode("button", {
				type: "button",
				"data-image-alert-close": "",
				class: normalizeClass(_ctx.classes.alertClose),
				"aria-label": "Close",
				onClick: _cache[0] || (_cache[0] = (...args) => _ctx.closeAlert && _ctx.closeAlert(...args))
			}, [..._cache[5] || (_cache[5] = [createBaseVNode("span", { "aria-hidden": "true" }, "×", -1)])], 2), (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.errors, (error, index) => {
				return openBlock(), createElementBlock("p", { key: `${error}-${index}` }, [createBaseVNode("i", {
					"data-image-error-icon": "",
					class: normalizeClass(_ctx.classes.errorIcon),
					"aria-hidden": "true"
				}, null, 2), createTextVNode(" " + toDisplayString(error), 1)]);
			}), 128))], 2)) : createCommentVNode("v-if", true),
			_ctx.hasValue ? (openBlock(), createElementBlock("div", {
				key: 1,
				"data-image-current": "",
				class: normalizeClass(_ctx.classes.current)
			}, [createBaseVNode("div", {
				"data-image-item": "",
				class: normalizeClass(_ctx.classes.item)
			}, [createBaseVNode("a", {
				href: _ctx.previewUrl,
				"data-image-preview-link": "",
				"data-lightbox": "",
				class: normalizeClass(_ctx.classes.previewLink)
			}, [createBaseVNode("img", {
				src: _ctx.previewUrl,
				alt: "",
				"data-image-preview": ""
			}, null, 8, _hoisted_3$3)], 10, _hoisted_2$3), createBaseVNode("div", {
				"data-image-info": "",
				class: normalizeClass(_ctx.classes.info)
			}, [
				createBaseVNode("a", {
					href: _ctx.previewUrl,
					"data-image-download": "",
					class: normalizeClass(_ctx.classes.downloadButton),
					"data-toggle": "tooltip",
					"data-bs-toggle": "tooltip",
					download: "",
					title: _ctx.labels.download,
					"aria-label": _ctx.labels.download,
					onClick: _cache[1] || (_cache[1] = withModifiers((...args) => _ctx.downloadCurrent && _ctx.downloadCurrent(...args), ["prevent"]))
				}, [createBaseVNode("i", {
					class: normalizeClass(_ctx.classes.downloadIcon),
					"aria-hidden": "true"
				}, null, 2)], 10, _hoisted_4$3),
				!_ctx.readonly ? (openBlock(), createElementBlock("button", {
					key: 0,
					type: "button",
					"data-image-insert-current": "",
					class: normalizeClass(_ctx.classes.insertCurrentButton),
					"data-toggle": "tooltip",
					"data-bs-toggle": "tooltip",
					title: _ctx.labels.insertLink,
					"aria-label": _ctx.labels.insertLink,
					onClick: _cache[2] || (_cache[2] = ($event) => _ctx.insert(true))
				}, [createBaseVNode("i", {
					class: normalizeClass(_ctx.classes.insertIcon),
					"aria-hidden": "true"
				}, null, 2)], 10, _hoisted_5$3)) : createCommentVNode("v-if", true),
				!_ctx.readonly ? (openBlock(), createElementBlock("button", {
					key: 1,
					type: "button",
					"data-image-remove": "",
					class: normalizeClass(_ctx.classes.removeButton),
					"data-toggle": "tooltip",
					"data-bs-toggle": "tooltip",
					title: _ctx.labels.remove,
					"aria-label": _ctx.labels.remove,
					onClick: _cache[3] || (_cache[3] = (...args) => _ctx.remove && _ctx.remove(...args))
				}, [createBaseVNode("i", {
					class: normalizeClass(_ctx.classes.removeIcon),
					"aria-hidden": "true"
				}, null, 2)], 10, _hoisted_6$2)) : createCommentVNode("v-if", true)
			], 2)], 2)], 2)) : createCommentVNode("v-if", true),
			!_ctx.readonly ? (openBlock(), createElementBlock("div", _hoisted_7$2, [!_ctx.onlyLink ? (openBlock(), createElementBlock("button", {
				key: 0,
				ref: "uploadButton",
				type: "button",
				"data-image-upload": "",
				class: normalizeClass(_ctx.classes.uploadButton)
			}, [createBaseVNode("i", {
				"data-image-upload-icon": "",
				class: normalizeClass(_ctx.uploadIconClass),
				"aria-hidden": "true"
			}, null, 2), createTextVNode(" " + toDisplayString(_ctx.labels.browse), 1)], 2)) : createCommentVNode("v-if", true), createBaseVNode("button", {
				type: "button",
				"data-image-insert-new": "",
				class: normalizeClass(_ctx.classes.insertNewButton),
				"data-toggle": "tooltip",
				"data-bs-toggle": "tooltip",
				title: _ctx.labels.insertLink,
				"aria-label": _ctx.labels.insertLink,
				onClick: _cache[4] || (_cache[4] = ($event) => _ctx.insert(false))
			}, [createBaseVNode("i", {
				class: normalizeClass(_ctx.classes.insertIcon),
				"aria-hidden": "true"
			}, null, 2)], 10, _hoisted_8$2)])) : createCommentVNode("v-if", true),
			createBaseVNode("input", {
				"data-image-value": "",
				name: _ctx.name,
				type: "hidden",
				value: _ctx.val
			}, null, 8, _hoisted_9$2)
		], 10, _hoisted_1$4);
	}
	var image_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$3, [["render", _sfc_render$3], ["__file", "image.vue"]]);
	//#endregion
	//#region node_modules/sortablejs/modular/sortable.esm.js
	/**!
	* Sortable 1.15.7
	* @author	RubaXa   <trash@rubaxa.org>
	* @author	owenm    <owen23355@gmail.com>
	* @license MIT
	*/
	function _defineProperty(e, r, t) {
		return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	function _extends() {
		return _extends = Object.assign ? Object.assign.bind() : function(n) {
			for (var e = 1; e < arguments.length; e++) {
				var t = arguments[e];
				for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
			}
			return n;
		}, _extends.apply(null, arguments);
	}
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread2(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}
	function _objectWithoutProperties(e, t) {
		if (null == e) return {};
		var o, r, i = _objectWithoutPropertiesLoose(e, t);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
		}
		return i;
	}
	function _objectWithoutPropertiesLoose(r, e) {
		if (null == r) return {};
		var t = {};
		for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
			if (-1 !== e.indexOf(n)) continue;
			t[n] = r[n];
		}
		return t;
	}
	function _toPrimitive(t, r) {
		if ("object" != typeof t || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != typeof i) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == typeof i ? i : i + "";
	}
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	var version = "1.15.7";
	function userAgent(pattern) {
		if (typeof window !== "undefined" && window.navigator) return !!/*@__PURE__*/ navigator.userAgent.match(pattern);
	}
	var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
	var Edge = userAgent(/Edge/i);
	var FireFox = userAgent(/firefox/i);
	var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
	var IOS = userAgent(/iP(ad|od|hone)/i);
	var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
	var captureMode = {
		capture: false,
		passive: false
	};
	function on(el, event, fn) {
		el.addEventListener(event, fn, !IE11OrLess && captureMode);
	}
	function off(el, event, fn) {
		el.removeEventListener(event, fn, !IE11OrLess && captureMode);
	}
	function matches(el, selector) {
		if (!selector) return;
		selector[0] === ">" && (selector = selector.substring(1));
		if (el) try {
			if (el.matches) return el.matches(selector);
			else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
			else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
		} catch (_) {
			return false;
		}
		return false;
	}
	function getParentOrHost(el) {
		return el.host && el !== document && el.host.nodeType && el.host !== el ? el.host : el.parentNode;
	}
	function closest(el, selector, ctx, includeCTX) {
		if (el) {
			ctx = ctx || document;
			do {
				if (selector != null && (selector[0] === ">" ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) return el;
				if (el === ctx) break;
			} while (el = getParentOrHost(el));
		}
		return null;
	}
	var R_SPACE = /\s+/g;
	function toggleClass(el, name, state) {
		if (el && name) {
			if (el.classList) el.classList[state ? "add" : "remove"](name);
			else el.className = ((" " + el.className + " ").replace(R_SPACE, " ").replace(" " + name + " ", " ") + (state ? " " + name : "")).replace(R_SPACE, " ");
		}
	}
	function css(el, prop, val) {
		var style = el && el.style;
		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) val = document.defaultView.getComputedStyle(el, "");
				else if (el.currentStyle) val = el.currentStyle;
				return prop === void 0 ? val : val[prop];
			} else {
				if (!(prop in style) && prop.indexOf("webkit") === -1) prop = "-webkit-" + prop;
				style[prop] = val + (typeof val === "string" ? "" : "px");
			}
		}
	}
	function matrix(el, selfOnly) {
		var appliedTransforms = "";
		if (typeof el === "string") appliedTransforms = el;
		else do {
			var transform = css(el, "transform");
			if (transform && transform !== "none") appliedTransforms = transform + " " + appliedTransforms;
		} while (!selfOnly && (el = el.parentNode));
		var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
		return matrixFn && new matrixFn(appliedTransforms);
	}
	function find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
			if (iterator) for (; i < n; i++) iterator(list[i], i);
			return list;
		}
		return [];
	}
	function getWindowScrollingElement() {
		var scrollingElement = document.scrollingElement;
		if (scrollingElement) return scrollingElement;
		else return document.documentElement;
	}
	/**
	* Returns the "bounding client rect" of given element
	* @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
	* @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
	* @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
	* @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
	* @param  {[HTMLElement]} container              The parent the element will be placed in
	* @return {Object}                               The boundingClientRect of el, with specified adjustments
	*/
	function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
		if (!el.getBoundingClientRect && el !== window) return;
		var elRect, top, left, bottom, right, height, width;
		if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
			elRect = el.getBoundingClientRect();
			top = elRect.top;
			left = elRect.left;
			bottom = elRect.bottom;
			right = elRect.right;
			height = elRect.height;
			width = elRect.width;
		} else {
			top = 0;
			left = 0;
			bottom = window.innerHeight;
			right = window.innerWidth;
			height = window.innerHeight;
			width = window.innerWidth;
		}
		if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
			container = container || el.parentNode;
			if (!IE11OrLess) do
				if (container && container.getBoundingClientRect && (css(container, "transform") !== "none" || relativeToNonStaticParent && css(container, "position") !== "static")) {
					var containerRect = container.getBoundingClientRect();
					top -= containerRect.top + parseInt(css(container, "border-top-width"));
					left -= containerRect.left + parseInt(css(container, "border-left-width"));
					bottom = top + elRect.height;
					right = left + elRect.width;
					break;
				}
			while (container = container.parentNode);
		}
		if (undoScale && el !== window) {
			var elMatrix = matrix(container || el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d;
			if (elMatrix) {
				top /= scaleY;
				left /= scaleX;
				width /= scaleX;
				height /= scaleY;
				bottom = top + height;
				right = left + width;
			}
		}
		return {
			top,
			left,
			bottom,
			right,
			width,
			height
		};
	}
	/**
	* Checks if a side of an element is scrolled past a side of its parents
	* @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
	* @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
	* @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
	* @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
	*/
	function isScrolledPast(el, elSide, parentSide) {
		var parent = getParentAutoScrollElement(el, true), elSideVal = getRect(el)[elSide];
		while (parent) {
			var parentSideVal = getRect(parent)[parentSide], visible = void 0;
			if (parentSide === "top" || parentSide === "left") visible = elSideVal >= parentSideVal;
			else visible = elSideVal <= parentSideVal;
			if (!visible) return parent;
			if (parent === getWindowScrollingElement()) break;
			parent = getParentAutoScrollElement(parent, false);
		}
		return false;
	}
	/**
	* Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
	* and non-draggable elements
	* @param  {HTMLElement} el       The parent element
	* @param  {Number} childNum      The index of the child
	* @param  {Object} options       Parent Sortable's options
	* @return {HTMLElement}          The child at index childNum, or null if not found
	*/
	function getChild(el, childNum, options, includeDragEl) {
		var currentChild = 0, i = 0, children = el.children;
		while (i < children.length) {
			if (children[i].style.display !== "none" && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
				if (currentChild === childNum) return children[i];
				currentChild++;
			}
			i++;
		}
		return null;
	}
	/**
	* Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
	* @param  {HTMLElement} el       Parent element
	* @param  {selector} selector    Any other elements that should be ignored
	* @return {HTMLElement}          The last child, ignoring ghostEl
	*/
	function lastChild(el, selector) {
		var last = el.lastElementChild;
		while (last && (last === Sortable.ghost || css(last, "display") === "none" || selector && !matches(last, selector))) last = last.previousElementSibling;
		return last || null;
	}
	/**
	* Returns the index of an element within its parent for a selected set of
	* elements
	* @param  {HTMLElement} el
	* @param  {selector} selector
	* @return {number}
	*/
	function index(el, selector) {
		var index = 0;
		if (!el || !el.parentNode) return -1;
		while (el = el.previousElementSibling) if (el.nodeName.toUpperCase() !== "TEMPLATE" && el !== Sortable.clone && (!selector || matches(el, selector))) index++;
		return index;
	}
	/**
	* Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
	* The value is returned in real pixels.
	* @param  {HTMLElement} el
	* @return {Array}             Offsets in the format of [left, top]
	*/
	function getRelativeScrollOffset(el) {
		var offsetLeft = 0, offsetTop = 0, winScroller = getWindowScrollingElement();
		if (el) do {
			var elMatrix = matrix(el), scaleX = elMatrix.a, scaleY = elMatrix.d;
			offsetLeft += el.scrollLeft * scaleX;
			offsetTop += el.scrollTop * scaleY;
		} while (el !== winScroller && (el = el.parentNode));
		return [offsetLeft, offsetTop];
	}
	/**
	* Returns the index of the object within the given array
	* @param  {Array} arr   Array that may or may not hold the object
	* @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
	* @return {Number}      The index of the object in the array, or -1
	*/
	function indexOfObject(arr, obj) {
		for (var i in arr) {
			if (!arr.hasOwnProperty(i)) continue;
			for (var key in obj) if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
		}
		return -1;
	}
	function getParentAutoScrollElement(el, includeSelf) {
		if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
		var elem = el;
		var gotSelf = false;
		do
			if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
				var elemCSS = css(elem);
				if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == "auto" || elemCSS.overflowX == "scroll") || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == "auto" || elemCSS.overflowY == "scroll")) {
					if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
					if (gotSelf || includeSelf) return elem;
					gotSelf = true;
				}
			}
		while (elem = elem.parentNode);
		return getWindowScrollingElement();
	}
	function extend(dst, src) {
		if (dst && src) {
			for (var key in src) if (src.hasOwnProperty(key)) dst[key] = src[key];
		}
		return dst;
	}
	function isRectEqual(rect1, rect2) {
		return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
	}
	var _throttleTimeout;
	function throttle(callback, ms) {
		return function() {
			if (!_throttleTimeout) {
				var args = arguments, _this = this;
				if (args.length === 1) callback.call(_this, args[0]);
				else callback.apply(_this, args);
				_throttleTimeout = setTimeout(function() {
					_throttleTimeout = void 0;
				}, ms);
			}
		};
	}
	function cancelThrottle() {
		clearTimeout(_throttleTimeout);
		_throttleTimeout = void 0;
	}
	function scrollBy(el, x, y) {
		el.scrollLeft += x;
		el.scrollTop += y;
	}
	function clone(el) {
		var Polymer = window.Polymer;
		var $ = window.jQuery || window.Zepto;
		if (Polymer && Polymer.dom) return Polymer.dom(el).cloneNode(true);
		else if ($) return $(el).clone(true)[0];
		else return el.cloneNode(true);
	}
	function getChildContainingRectFromElement(container, options, ghostEl) {
		var rect = {};
		Array.from(container.children).forEach(function(child) {
			var _rect$left, _rect$top, _rect$right, _rect$bottom;
			if (!closest(child, options.draggable, container, false) || child.animated || child === ghostEl) return;
			var childRect = getRect(child);
			rect.left = Math.min((_rect$left = rect.left) !== null && _rect$left !== void 0 ? _rect$left : Infinity, childRect.left);
			rect.top = Math.min((_rect$top = rect.top) !== null && _rect$top !== void 0 ? _rect$top : Infinity, childRect.top);
			rect.right = Math.max((_rect$right = rect.right) !== null && _rect$right !== void 0 ? _rect$right : -Infinity, childRect.right);
			rect.bottom = Math.max((_rect$bottom = rect.bottom) !== null && _rect$bottom !== void 0 ? _rect$bottom : -Infinity, childRect.bottom);
		});
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;
		rect.x = rect.left;
		rect.y = rect.top;
		return rect;
	}
	var expando = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
	function AnimationStateManager() {
		var animationStates = [], animationCallbackId;
		return {
			captureAnimationState: function captureAnimationState() {
				animationStates = [];
				if (!this.options.animation) return;
				[].slice.call(this.el.children).forEach(function(child) {
					if (css(child, "display") === "none" || child === Sortable.ghost) return;
					animationStates.push({
						target: child,
						rect: getRect(child)
					});
					var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);
					if (child.thisAnimationDuration) {
						var childMatrix = matrix(child, true);
						if (childMatrix) {
							fromRect.top -= childMatrix.f;
							fromRect.left -= childMatrix.e;
						}
					}
					child.fromRect = fromRect;
				});
			},
			addAnimationState: function addAnimationState(state) {
				animationStates.push(state);
			},
			removeAnimationState: function removeAnimationState(target) {
				animationStates.splice(indexOfObject(animationStates, { target }), 1);
			},
			animateAll: function animateAll(callback) {
				var _this = this;
				if (!this.options.animation) {
					clearTimeout(animationCallbackId);
					if (typeof callback === "function") callback();
					return;
				}
				var animating = false, animationTime = 0;
				animationStates.forEach(function(state) {
					var time = 0, target = state.target, fromRect = target.fromRect, toRect = getRect(target), prevFromRect = target.prevFromRect, prevToRect = target.prevToRect, animatingRect = state.rect, targetMatrix = matrix(target, true);
					if (targetMatrix) {
						toRect.top -= targetMatrix.f;
						toRect.left -= targetMatrix.e;
					}
					target.toRect = toRect;
					if (target.thisAnimationDuration) {
						if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
					}
					if (!isRectEqual(toRect, fromRect)) {
						target.prevFromRect = fromRect;
						target.prevToRect = toRect;
						if (!time) time = _this.options.animation;
						_this.animate(target, animatingRect, toRect, time);
					}
					if (time) {
						animating = true;
						animationTime = Math.max(animationTime, time);
						clearTimeout(target.animationResetTimer);
						target.animationResetTimer = setTimeout(function() {
							target.animationTime = 0;
							target.prevFromRect = null;
							target.fromRect = null;
							target.prevToRect = null;
							target.thisAnimationDuration = null;
						}, time);
						target.thisAnimationDuration = time;
					}
				});
				clearTimeout(animationCallbackId);
				if (!animating) {
					if (typeof callback === "function") callback();
				} else animationCallbackId = setTimeout(function() {
					if (typeof callback === "function") callback();
				}, animationTime);
				animationStates = [];
			},
			animate: function animate(target, currentRect, toRect, duration) {
				if (duration) {
					css(target, "transition", "");
					css(target, "transform", "");
					var elMatrix = matrix(this.el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d, translateX = (currentRect.left - toRect.left) / (scaleX || 1), translateY = (currentRect.top - toRect.top) / (scaleY || 1);
					target.animatingX = !!translateX;
					target.animatingY = !!translateY;
					css(target, "transform", "translate3d(" + translateX + "px," + translateY + "px,0)");
					this.forRepaintDummy = repaint(target);
					css(target, "transition", "transform " + duration + "ms" + (this.options.easing ? " " + this.options.easing : ""));
					css(target, "transform", "translate3d(0,0,0)");
					typeof target.animated === "number" && clearTimeout(target.animated);
					target.animated = setTimeout(function() {
						css(target, "transition", "");
						css(target, "transform", "");
						target.animated = false;
						target.animatingX = false;
						target.animatingY = false;
					}, duration);
				}
			}
		};
	}
	function repaint(target) {
		return target.offsetWidth;
	}
	function calculateRealTime(animatingRect, fromRect, toRect, options) {
		return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
	}
	var plugins = [];
	var defaults = { initializeByDefault: true };
	var PluginManager = {
		mount: function mount(plugin) {
			for (var option in defaults) if (defaults.hasOwnProperty(option) && !(option in plugin)) plugin[option] = defaults[option];
			plugins.forEach(function(p) {
				if (p.pluginName === plugin.pluginName) throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
			});
			plugins.push(plugin);
		},
		pluginEvent: function pluginEvent(eventName, sortable, evt) {
			var _this = this;
			this.eventCanceled = false;
			evt.cancel = function() {
				_this.eventCanceled = true;
			};
			var eventNameGlobal = eventName + "Global";
			plugins.forEach(function(plugin) {
				if (!sortable[plugin.pluginName]) return;
				if (sortable[plugin.pluginName][eventNameGlobal]) sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({ sortable }, evt));
				if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) sortable[plugin.pluginName][eventName](_objectSpread2({ sortable }, evt));
			});
		},
		initializePlugins: function initializePlugins(sortable, el, defaults, options) {
			plugins.forEach(function(plugin) {
				var pluginName = plugin.pluginName;
				if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
				var initialized = new plugin(sortable, el, sortable.options);
				initialized.sortable = sortable;
				initialized.options = sortable.options;
				sortable[pluginName] = initialized;
				_extends(defaults, initialized.defaults);
			});
			for (var option in sortable.options) {
				if (!sortable.options.hasOwnProperty(option)) continue;
				var modified = this.modifyOption(sortable, option, sortable.options[option]);
				if (typeof modified !== "undefined") sortable.options[option] = modified;
			}
		},
		getEventProperties: function getEventProperties(name, sortable) {
			var eventProperties = {};
			plugins.forEach(function(plugin) {
				if (typeof plugin.eventProperties !== "function") return;
				_extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
			});
			return eventProperties;
		},
		modifyOption: function modifyOption(sortable, name, value) {
			var modifiedValue;
			plugins.forEach(function(plugin) {
				if (!sortable[plugin.pluginName]) return;
				if (plugin.optionListeners && typeof plugin.optionListeners[name] === "function") modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
			});
			return modifiedValue;
		}
	};
	function dispatchEvent(_ref) {
		var sortable = _ref.sortable, rootEl = _ref.rootEl, name = _ref.name, targetEl = _ref.targetEl, cloneEl = _ref.cloneEl, toEl = _ref.toEl, fromEl = _ref.fromEl, oldIndex = _ref.oldIndex, newIndex = _ref.newIndex, oldDraggableIndex = _ref.oldDraggableIndex, newDraggableIndex = _ref.newDraggableIndex, originalEvent = _ref.originalEvent, putSortable = _ref.putSortable, extraEventProperties = _ref.extraEventProperties;
		sortable = sortable || rootEl && rootEl[expando];
		if (!sortable) return;
		var evt, options = sortable.options, onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
		if (window.CustomEvent && !IE11OrLess && !Edge) evt = new CustomEvent(name, {
			bubbles: true,
			cancelable: true
		});
		else {
			evt = document.createEvent("Event");
			evt.initEvent(name, true, true);
		}
		evt.to = toEl || rootEl;
		evt.from = fromEl || rootEl;
		evt.item = targetEl || rootEl;
		evt.clone = cloneEl;
		evt.oldIndex = oldIndex;
		evt.newIndex = newIndex;
		evt.oldDraggableIndex = oldDraggableIndex;
		evt.newDraggableIndex = newDraggableIndex;
		evt.originalEvent = originalEvent;
		evt.pullMode = putSortable ? putSortable.lastPutMode : void 0;
		var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
		for (var option in allEventProperties) evt[option] = allEventProperties[option];
		if (rootEl) rootEl.dispatchEvent(evt);
		if (options[onName]) options[onName].call(sortable, evt);
	}
	var _excluded = ["evt"];
	var pluginEvent = function pluginEvent(eventName, sortable) {
		var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, originalEvent = _ref.evt, data = _objectWithoutProperties(_ref, _excluded);
		PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
			dragEl,
			parentEl,
			ghostEl,
			rootEl,
			nextEl,
			lastDownEl,
			cloneEl,
			cloneHidden,
			dragStarted: moved,
			putSortable,
			activeSortable: Sortable.active,
			originalEvent,
			oldIndex,
			oldDraggableIndex,
			newIndex,
			newDraggableIndex,
			hideGhostForTarget: _hideGhostForTarget,
			unhideGhostForTarget: _unhideGhostForTarget,
			cloneNowHidden: function cloneNowHidden() {
				cloneHidden = true;
			},
			cloneNowShown: function cloneNowShown() {
				cloneHidden = false;
			},
			dispatchSortableEvent: function dispatchSortableEvent(name) {
				_dispatchEvent({
					sortable,
					name,
					originalEvent
				});
			}
		}, data));
	};
	function _dispatchEvent(info) {
		dispatchEvent(_objectSpread2({
			putSortable,
			cloneEl,
			targetEl: dragEl,
			rootEl,
			oldIndex,
			oldDraggableIndex,
			newIndex,
			newDraggableIndex
		}, info));
	}
	var dragEl;
	var parentEl;
	var ghostEl;
	var rootEl;
	var nextEl;
	var lastDownEl;
	var cloneEl;
	var cloneHidden;
	var oldIndex;
	var newIndex;
	var oldDraggableIndex;
	var newDraggableIndex;
	var activeGroup;
	var putSortable;
	var awaitingDragStarted = false;
	var ignoreNextClick = false;
	var sortables = [];
	var tapEvt;
	var touchEvt;
	var lastDx;
	var lastDy;
	var tapDistanceLeft;
	var tapDistanceTop;
	var moved;
	var lastTarget;
	var lastDirection;
	var pastFirstInvertThresh = false;
	var isCircumstantialInvert = false;
	var targetMoveDistance;
	var ghostRelativeParent;
	var ghostRelativeParentInitialScroll = [];
	var _silent = false;
	var savedInputChecked = [];
	/** @const */
	var documentExists = typeof document !== "undefined";
	var PositionGhostAbsolutely = IOS;
	var CSSFloatProperty = Edge || IE11OrLess ? "cssFloat" : "float";
	var supportDraggable = documentExists && !ChromeForAndroid && !IOS && "draggable" in document.createElement("div");
	var supportCssPointerEvents = function() {
		if (!documentExists) return;
		if (IE11OrLess) return false;
		var el = document.createElement("x");
		el.style.cssText = "pointer-events:auto";
		return el.style.pointerEvents === "auto";
	}();
	var _detectDirection = function _detectDirection(el, options) {
		var elCSS = css(el), elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth), child1 = getChild(el, 0, options), child2 = getChild(el, 1, options), firstChildCSS = child1 && css(child1), secondChildCSS = child2 && css(child2), firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width, secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
		if (elCSS.display === "flex") return elCSS.flexDirection === "column" || elCSS.flexDirection === "column-reverse" ? "vertical" : "horizontal";
		if (elCSS.display === "grid") return elCSS.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
		if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== "none") {
			var touchingSideChild2 = firstChildCSS["float"] === "left" ? "left" : "right";
			return child2 && (secondChildCSS.clear === "both" || secondChildCSS.clear === touchingSideChild2) ? "vertical" : "horizontal";
		}
		return child1 && (firstChildCSS.display === "block" || firstChildCSS.display === "flex" || firstChildCSS.display === "table" || firstChildCSS.display === "grid" || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === "none" || child2 && elCSS[CSSFloatProperty] === "none" && firstChildWidth + secondChildWidth > elWidth) ? "vertical" : "horizontal";
	};
	var _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
		var dragElS1Opp = vertical ? dragRect.left : dragRect.top, dragElS2Opp = vertical ? dragRect.right : dragRect.bottom, dragElOppLength = vertical ? dragRect.width : dragRect.height, targetS1Opp = vertical ? targetRect.left : targetRect.top, targetS2Opp = vertical ? targetRect.right : targetRect.bottom, targetOppLength = vertical ? targetRect.width : targetRect.height;
		return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
	};
	var _detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
		var ret;
		sortables.some(function(sortable) {
			var threshold = sortable[expando].options.emptyInsertThreshold;
			if (!threshold || lastChild(sortable)) return;
			var rect = getRect(sortable), insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold, insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
			if (insideHorizontally && insideVertically) return ret = sortable;
		});
		return ret;
	};
	var _prepareGroup = function _prepareGroup(options) {
		function toFn(value, pull) {
			return function(to, from, dragEl, evt) {
				var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
				if (value == null && (pull || sameGroup)) return true;
				else if (value == null || value === false) return false;
				else if (pull && value === "clone") return value;
				else if (typeof value === "function") return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
				else {
					var otherGroup = (pull ? to : from).options.group.name;
					return value === true || typeof value === "string" && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
				}
			};
		}
		var group = {};
		var originalGroup = options.group;
		if (!originalGroup || _typeof(originalGroup) != "object") originalGroup = { name: originalGroup };
		group.name = originalGroup.name;
		group.checkPull = toFn(originalGroup.pull, true);
		group.checkPut = toFn(originalGroup.put);
		group.revertClone = originalGroup.revertClone;
		options.group = group;
	};
	var _hideGhostForTarget = function _hideGhostForTarget() {
		if (!supportCssPointerEvents && ghostEl) css(ghostEl, "display", "none");
	};
	var _unhideGhostForTarget = function _unhideGhostForTarget() {
		if (!supportCssPointerEvents && ghostEl) css(ghostEl, "display", "");
	};
	if (documentExists && !ChromeForAndroid) document.addEventListener("click", function(evt) {
		if (ignoreNextClick) {
			evt.preventDefault();
			evt.stopPropagation && evt.stopPropagation();
			evt.stopImmediatePropagation && evt.stopImmediatePropagation();
			ignoreNextClick = false;
			return false;
		}
	}, true);
	var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
		if (dragEl) {
			evt = evt.touches ? evt.touches[0] : evt;
			var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
			if (nearest) {
				var event = {};
				for (var i in evt) if (evt.hasOwnProperty(i)) event[i] = evt[i];
				event.target = event.rootEl = nearest;
				event.preventDefault = void 0;
				event.stopPropagation = void 0;
				nearest[expando]._onDragOver(event);
			}
		}
	};
	var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
		if (dragEl) dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
	};
	/**
	* @class  Sortable
	* @param  {HTMLElement}  el
	* @param  {Object}       [options]
	*/
	function Sortable(el, options) {
		if (!(el && el.nodeType && el.nodeType === 1)) throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
		this.el = el;
		this.options = options = _extends({}, options);
		el[expando] = this;
		var defaults = {
			group: null,
			sort: true,
			disabled: false,
			store: null,
			handle: null,
			draggable: /^[uo]l$/i.test(el.nodeName) ? ">li" : ">*",
			swapThreshold: 1,
			invertSwap: false,
			invertedSwapThreshold: null,
			removeCloneOnHide: true,
			direction: function direction() {
				return _detectDirection(el, this.options);
			},
			ghostClass: "sortable-ghost",
			chosenClass: "sortable-chosen",
			dragClass: "sortable-drag",
			ignore: "a, img",
			filter: null,
			preventOnFilter: true,
			animation: 0,
			easing: null,
			setData: function setData(dataTransfer, dragEl) {
				dataTransfer.setData("Text", dragEl.textContent);
			},
			dropBubble: false,
			dragoverBubble: false,
			dataIdAttr: "data-id",
			delay: 0,
			delayOnTouchOnly: false,
			touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
			forceFallback: false,
			fallbackClass: "sortable-fallback",
			fallbackOnBody: false,
			fallbackTolerance: 0,
			fallbackOffset: {
				x: 0,
				y: 0
			},
			supportPointer: Sortable.supportPointer !== false && "PointerEvent" in window && (!Safari || IOS),
			emptyInsertThreshold: 5
		};
		PluginManager.initializePlugins(this, el, defaults);
		for (var name in defaults) !(name in options) && (options[name] = defaults[name]);
		_prepareGroup(options);
		for (var fn in this) if (fn.charAt(0) === "_" && typeof this[fn] === "function") this[fn] = this[fn].bind(this);
		this.nativeDraggable = options.forceFallback ? false : supportDraggable;
		if (this.nativeDraggable) this.options.touchStartThreshold = 1;
		if (options.supportPointer) on(el, "pointerdown", this._onTapStart);
		else {
			on(el, "mousedown", this._onTapStart);
			on(el, "touchstart", this._onTapStart);
		}
		if (this.nativeDraggable) {
			on(el, "dragover", this);
			on(el, "dragenter", this);
		}
		sortables.push(this.el);
		options.store && options.store.get && this.sort(options.store.get(this) || []);
		_extends(this, AnimationStateManager());
	}
	Sortable.prototype = (/** @lends Sortable.prototype */ {
		constructor: Sortable,
		_isOutsideThisEl: function _isOutsideThisEl(target) {
			if (!this.el.contains(target) && target !== this.el) lastTarget = null;
		},
		_getDirection: function _getDirection(evt, target) {
			return typeof this.options.direction === "function" ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
		},
		_onTapStart: function _onTapStart(evt) {
			if (!evt.cancelable) return;
			var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === "touch" && evt, target = (touch || evt).target, originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target, filter = options.filter;
			_saveInputCheckedState(el);
			if (dragEl) return;
			if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) return;
			if (originalTarget.isContentEditable) return;
			if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === "SELECT") return;
			target = closest(target, options.draggable, el, false);
			if (target && target.animated) return;
			if (lastDownEl === target) return;
			oldIndex = index(target);
			oldDraggableIndex = index(target, options.draggable);
			if (typeof filter === "function") {
				if (filter.call(this, evt, target, this)) {
					_dispatchEvent({
						sortable: _this,
						rootEl: originalTarget,
						name: "filter",
						targetEl: target,
						toEl: el,
						fromEl: el
					});
					pluginEvent("filter", _this, { evt });
					preventOnFilter && evt.preventDefault();
					return;
				}
			} else if (filter) {
				filter = filter.split(",").some(function(criteria) {
					criteria = closest(originalTarget, criteria.trim(), el, false);
					if (criteria) {
						_dispatchEvent({
							sortable: _this,
							rootEl: criteria,
							name: "filter",
							targetEl: target,
							fromEl: el,
							toEl: el
						});
						pluginEvent("filter", _this, { evt });
						return true;
					}
				});
				if (filter) {
					preventOnFilter && evt.preventDefault();
					return;
				}
			}
			if (options.handle && !closest(originalTarget, options.handle, el, false)) return;
			this._prepareDragStart(evt, touch, target);
		},
		_prepareDragStart: function _prepareDragStart(evt, touch, target) {
			var _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument, dragStartFn;
			if (target && !dragEl && target.parentNode === el) {
				var dragRect = getRect(target);
				rootEl = el;
				dragEl = target;
				parentEl = dragEl.parentNode;
				nextEl = dragEl.nextSibling;
				lastDownEl = target;
				activeGroup = options.group;
				Sortable.dragged = dragEl;
				tapEvt = {
					target: dragEl,
					clientX: (touch || evt).clientX,
					clientY: (touch || evt).clientY
				};
				tapDistanceLeft = tapEvt.clientX - dragRect.left;
				tapDistanceTop = tapEvt.clientY - dragRect.top;
				this._lastX = (touch || evt).clientX;
				this._lastY = (touch || evt).clientY;
				dragEl.style["will-change"] = "all";
				dragStartFn = function dragStartFn() {
					pluginEvent("delayEnded", _this, { evt });
					if (Sortable.eventCanceled) {
						_this._onDrop();
						return;
					}
					_this._disableDelayedDragEvents();
					if (!FireFox && _this.nativeDraggable) dragEl.draggable = true;
					_this._triggerDragStart(evt, touch);
					_dispatchEvent({
						sortable: _this,
						name: "choose",
						originalEvent: evt
					});
					toggleClass(dragEl, options.chosenClass, true);
				};
				options.ignore.split(",").forEach(function(criteria) {
					find(dragEl, criteria.trim(), _disableDraggable);
				});
				on(ownerDocument, "dragover", nearestEmptyInsertDetectEvent);
				on(ownerDocument, "mousemove", nearestEmptyInsertDetectEvent);
				on(ownerDocument, "touchmove", nearestEmptyInsertDetectEvent);
				if (options.supportPointer) {
					on(ownerDocument, "pointerup", _this._onDrop);
					!this.nativeDraggable && on(ownerDocument, "pointercancel", _this._onDrop);
				} else {
					on(ownerDocument, "mouseup", _this._onDrop);
					on(ownerDocument, "touchend", _this._onDrop);
					on(ownerDocument, "touchcancel", _this._onDrop);
				}
				if (FireFox && this.nativeDraggable) {
					this.options.touchStartThreshold = 4;
					dragEl.draggable = true;
				}
				pluginEvent("delayStart", this, { evt });
				if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
					if (Sortable.eventCanceled) {
						this._onDrop();
						return;
					}
					if (options.supportPointer) {
						on(ownerDocument, "pointerup", _this._disableDelayedDrag);
						on(ownerDocument, "pointercancel", _this._disableDelayedDrag);
					} else {
						on(ownerDocument, "mouseup", _this._disableDelayedDrag);
						on(ownerDocument, "touchend", _this._disableDelayedDrag);
						on(ownerDocument, "touchcancel", _this._disableDelayedDrag);
					}
					on(ownerDocument, "mousemove", _this._delayedDragTouchMoveHandler);
					on(ownerDocument, "touchmove", _this._delayedDragTouchMoveHandler);
					options.supportPointer && on(ownerDocument, "pointermove", _this._delayedDragTouchMoveHandler);
					_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
				} else dragStartFn();
			}
		},
		_delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(e) {
			var touch = e.touches ? e.touches[0] : e;
			if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) this._disableDelayedDrag();
		},
		_disableDelayedDrag: function _disableDelayedDrag() {
			dragEl && _disableDraggable(dragEl);
			clearTimeout(this._dragStartTimer);
			this._disableDelayedDragEvents();
		},
		_disableDelayedDragEvents: function _disableDelayedDragEvents() {
			var ownerDocument = this.el.ownerDocument;
			off(ownerDocument, "mouseup", this._disableDelayedDrag);
			off(ownerDocument, "touchend", this._disableDelayedDrag);
			off(ownerDocument, "touchcancel", this._disableDelayedDrag);
			off(ownerDocument, "pointerup", this._disableDelayedDrag);
			off(ownerDocument, "pointercancel", this._disableDelayedDrag);
			off(ownerDocument, "mousemove", this._delayedDragTouchMoveHandler);
			off(ownerDocument, "touchmove", this._delayedDragTouchMoveHandler);
			off(ownerDocument, "pointermove", this._delayedDragTouchMoveHandler);
		},
		_triggerDragStart: function _triggerDragStart(evt, touch) {
			touch = touch || evt.pointerType == "touch" && evt;
			if (!this.nativeDraggable || touch) {
				if (this.options.supportPointer) on(document, "pointermove", this._onTouchMove);
				else if (touch) on(document, "touchmove", this._onTouchMove);
				else on(document, "mousemove", this._onTouchMove);
			} else {
				on(dragEl, "dragend", this);
				on(rootEl, "dragstart", this._onDragStart);
			}
			try {
				if (document.selection) _nextTick(function() {
					document.selection.empty();
				});
				else window.getSelection().removeAllRanges();
			} catch (err) {}
		},
		_dragStarted: function _dragStarted(fallback, evt) {
			awaitingDragStarted = false;
			if (rootEl && dragEl) {
				pluginEvent("dragStarted", this, { evt });
				if (this.nativeDraggable) on(document, "dragover", _checkOutsideTargetEl);
				var options = this.options;
				!fallback && toggleClass(dragEl, options.dragClass, false);
				toggleClass(dragEl, options.ghostClass, true);
				Sortable.active = this;
				fallback && this._appendGhost();
				_dispatchEvent({
					sortable: this,
					name: "start",
					originalEvent: evt
				});
			} else this._nulling();
		},
		_emulateDragOver: function _emulateDragOver() {
			if (touchEvt) {
				this._lastX = touchEvt.clientX;
				this._lastY = touchEvt.clientY;
				_hideGhostForTarget();
				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
				var parent = target;
				while (target && target.shadowRoot) {
					target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
					if (target === parent) break;
					parent = target;
				}
				dragEl.parentNode[expando]._isOutsideThisEl(target);
				if (parent) do {
					if (parent[expando]) {
						var inserted = void 0;
						inserted = parent[expando]._onDragOver({
							clientX: touchEvt.clientX,
							clientY: touchEvt.clientY,
							target,
							rootEl: parent
						});
						if (inserted && !this.options.dragoverBubble) break;
					}
					target = parent;
				} while (parent = getParentOrHost(parent));
				_unhideGhostForTarget();
			}
		},
		_onTouchMove: function _onTouchMove(evt) {
			if (tapEvt) {
				var options = this.options, fallbackTolerance = options.fallbackTolerance, fallbackOffset = options.fallbackOffset, touch = evt.touches ? evt.touches[0] : evt, ghostMatrix = ghostEl && matrix(ghostEl, true), scaleX = ghostEl && ghostMatrix && ghostMatrix.a, scaleY = ghostEl && ghostMatrix && ghostMatrix.d, relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent), dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1), dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);
				if (!Sortable.active && !awaitingDragStarted) {
					if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) return;
					this._onDragStart(evt, true);
				}
				if (ghostEl) {
					if (ghostMatrix) {
						ghostMatrix.e += dx - (lastDx || 0);
						ghostMatrix.f += dy - (lastDy || 0);
					} else ghostMatrix = {
						a: 1,
						b: 0,
						c: 0,
						d: 1,
						e: dx,
						f: dy
					};
					var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
					css(ghostEl, "webkitTransform", cssMatrix);
					css(ghostEl, "mozTransform", cssMatrix);
					css(ghostEl, "msTransform", cssMatrix);
					css(ghostEl, "transform", cssMatrix);
					lastDx = dx;
					lastDy = dy;
					touchEvt = touch;
				}
				evt.cancelable && evt.preventDefault();
			}
		},
		_appendGhost: function _appendGhost() {
			if (!ghostEl) {
				var container = this.options.fallbackOnBody ? document.body : rootEl, rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container), options = this.options;
				if (PositionGhostAbsolutely) {
					ghostRelativeParent = container;
					while (css(ghostRelativeParent, "position") === "static" && css(ghostRelativeParent, "transform") === "none" && ghostRelativeParent !== document) ghostRelativeParent = ghostRelativeParent.parentNode;
					if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
						if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
						rect.top += ghostRelativeParent.scrollTop;
						rect.left += ghostRelativeParent.scrollLeft;
					} else ghostRelativeParent = getWindowScrollingElement();
					ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
				}
				ghostEl = dragEl.cloneNode(true);
				toggleClass(ghostEl, options.ghostClass, false);
				toggleClass(ghostEl, options.fallbackClass, true);
				toggleClass(ghostEl, options.dragClass, true);
				css(ghostEl, "transition", "");
				css(ghostEl, "transform", "");
				css(ghostEl, "box-sizing", "border-box");
				css(ghostEl, "margin", 0);
				css(ghostEl, "top", rect.top);
				css(ghostEl, "left", rect.left);
				css(ghostEl, "width", rect.width);
				css(ghostEl, "height", rect.height);
				css(ghostEl, "opacity", "0.8");
				css(ghostEl, "position", PositionGhostAbsolutely ? "absolute" : "fixed");
				css(ghostEl, "zIndex", "100000");
				css(ghostEl, "pointerEvents", "none");
				Sortable.ghost = ghostEl;
				container.appendChild(ghostEl);
				css(ghostEl, "transform-origin", tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + "% " + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + "%");
			}
		},
		_onDragStart: function _onDragStart(evt, fallback) {
			var _this = this;
			var dataTransfer = evt.dataTransfer;
			var options = _this.options;
			pluginEvent("dragStart", this, { evt });
			if (Sortable.eventCanceled) {
				this._onDrop();
				return;
			}
			pluginEvent("setupClone", this);
			if (!Sortable.eventCanceled) {
				cloneEl = clone(dragEl);
				cloneEl.removeAttribute("id");
				cloneEl.draggable = false;
				cloneEl.style["will-change"] = "";
				this._hideClone();
				toggleClass(cloneEl, this.options.chosenClass, false);
				Sortable.clone = cloneEl;
			}
			_this.cloneId = _nextTick(function() {
				pluginEvent("clone", _this);
				if (Sortable.eventCanceled) return;
				if (!_this.options.removeCloneOnHide) rootEl.insertBefore(cloneEl, dragEl);
				_this._hideClone();
				_dispatchEvent({
					sortable: _this,
					name: "clone"
				});
			});
			!fallback && toggleClass(dragEl, options.dragClass, true);
			if (fallback) {
				ignoreNextClick = true;
				_this._loopId = setInterval(_this._emulateDragOver, 50);
			} else {
				off(document, "mouseup", _this._onDrop);
				off(document, "touchend", _this._onDrop);
				off(document, "touchcancel", _this._onDrop);
				if (dataTransfer) {
					dataTransfer.effectAllowed = "move";
					options.setData && options.setData.call(_this, dataTransfer, dragEl);
				}
				on(document, "drop", _this);
				css(dragEl, "transform", "translateZ(0)");
			}
			awaitingDragStarted = true;
			_this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
			on(document, "selectstart", _this);
			moved = true;
			window.getSelection().removeAllRanges();
			if (Safari) css(document.body, "user-select", "none");
		},
		_onDragOver: function _onDragOver(evt) {
			var el = this.el, target = evt.target, dragRect, targetRect, revert, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = activeGroup === group, canSort = options.sort, fromSortable = putSortable || activeSortable, vertical, _this = this, completedFired = false;
			if (_silent) return;
			function dragOverEvent(name, extra) {
				pluginEvent(name, _this, _objectSpread2({
					evt,
					isOwner,
					axis: vertical ? "vertical" : "horizontal",
					revert,
					dragRect,
					targetRect,
					canSort,
					fromSortable,
					target,
					completed,
					onMove: function onMove(target, after) {
						return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
					},
					changed
				}, extra));
			}
			function capture() {
				dragOverEvent("dragOverAnimationCapture");
				_this.captureAnimationState();
				if (_this !== fromSortable) fromSortable.captureAnimationState();
			}
			function completed(insertion) {
				dragOverEvent("dragOverCompleted", { insertion });
				if (insertion) {
					if (isOwner) activeSortable._hideClone();
					else activeSortable._showClone(_this);
					if (_this !== fromSortable) {
						toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
						toggleClass(dragEl, options.ghostClass, true);
					}
					if (putSortable !== _this && _this !== Sortable.active) putSortable = _this;
					else if (_this === Sortable.active && putSortable) putSortable = null;
					if (fromSortable === _this) _this._ignoreWhileAnimating = target;
					_this.animateAll(function() {
						dragOverEvent("dragOverAnimationComplete");
						_this._ignoreWhileAnimating = null;
					});
					if (_this !== fromSortable) {
						fromSortable.animateAll();
						fromSortable._ignoreWhileAnimating = null;
					}
				}
				if (target === dragEl && !dragEl.animated || target === el && !target.animated) lastTarget = null;
				if (!options.dragoverBubble && !evt.rootEl && target !== document) {
					dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
					!insertion && nearestEmptyInsertDetectEvent(evt);
				}
				!options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
				return completedFired = true;
			}
			function changed() {
				newIndex = index(dragEl);
				newDraggableIndex = index(dragEl, options.draggable);
				_dispatchEvent({
					sortable: _this,
					name: "change",
					toEl: el,
					newIndex,
					newDraggableIndex,
					originalEvent: evt
				});
			}
			if (evt.preventDefault !== void 0) evt.cancelable && evt.preventDefault();
			target = closest(target, options.draggable, el, true);
			dragOverEvent("dragOver");
			if (Sortable.eventCanceled) return completedFired;
			if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) return completed(false);
			ignoreNextClick = false;
			if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
				vertical = this._getDirection(evt, target) === "vertical";
				dragRect = getRect(dragEl);
				dragOverEvent("dragOverValid");
				if (Sortable.eventCanceled) return completedFired;
				if (revert) {
					parentEl = rootEl;
					capture();
					this._hideClone();
					dragOverEvent("revert");
					if (!Sortable.eventCanceled) {
						if (nextEl) rootEl.insertBefore(dragEl, nextEl);
						else rootEl.appendChild(dragEl);
					}
					return completed(true);
				}
				var elLastChild = lastChild(el, options.draggable);
				if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
					if (elLastChild === dragEl) return completed(false);
					if (elLastChild && el === evt.target) target = elLastChild;
					if (target) targetRect = getRect(target);
					if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
						capture();
						if (elLastChild && elLastChild.nextSibling) el.insertBefore(dragEl, elLastChild.nextSibling);
						else el.appendChild(dragEl);
						parentEl = el;
						changed();
						return completed(true);
					}
				} else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
					var firstChild = getChild(el, 0, options, true);
					if (firstChild === dragEl) return completed(false);
					target = firstChild;
					targetRect = getRect(target);
					if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
						capture();
						el.insertBefore(dragEl, firstChild);
						parentEl = el;
						changed();
						return completed(true);
					}
				} else if (target.parentNode === el) {
					targetRect = getRect(target);
					var direction = 0, targetBeforeFirstSwap, differentLevel = dragEl.parentNode !== el, differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical), side1 = vertical ? "top" : "left", scrolledPastTop = isScrolledPast(target, "top", "top") || isScrolledPast(dragEl, "top", "top"), scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
					if (lastTarget !== target) {
						targetBeforeFirstSwap = targetRect[side1];
						pastFirstInvertThresh = false;
						isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
					}
					direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
					var sibling;
					if (direction !== 0) {
						var dragIndex = index(dragEl);
						do {
							dragIndex -= direction;
							sibling = parentEl.children[dragIndex];
						} while (sibling && (css(sibling, "display") === "none" || sibling === ghostEl));
					}
					if (direction === 0 || sibling === target) return completed(false);
					lastTarget = target;
					lastDirection = direction;
					var nextSibling = target.nextElementSibling, after = false;
					after = direction === 1;
					var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
					if (moveVector !== false) {
						if (moveVector === 1 || moveVector === -1) after = moveVector === 1;
						_silent = true;
						setTimeout(_unsilent, 30);
						capture();
						if (after && !nextSibling) el.appendChild(dragEl);
						else target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
						if (scrolledPastTop) scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
						parentEl = dragEl.parentNode;
						if (targetBeforeFirstSwap !== void 0 && !isCircumstantialInvert) targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
						changed();
						return completed(true);
					}
				}
				if (el.contains(dragEl)) return completed(false);
			}
			return false;
		},
		_ignoreWhileAnimating: null,
		_offMoveEvents: function _offMoveEvents() {
			off(document, "mousemove", this._onTouchMove);
			off(document, "touchmove", this._onTouchMove);
			off(document, "pointermove", this._onTouchMove);
			off(document, "dragover", nearestEmptyInsertDetectEvent);
			off(document, "mousemove", nearestEmptyInsertDetectEvent);
			off(document, "touchmove", nearestEmptyInsertDetectEvent);
		},
		_offUpEvents: function _offUpEvents() {
			var ownerDocument = this.el.ownerDocument;
			off(ownerDocument, "mouseup", this._onDrop);
			off(ownerDocument, "touchend", this._onDrop);
			off(ownerDocument, "pointerup", this._onDrop);
			off(ownerDocument, "pointercancel", this._onDrop);
			off(ownerDocument, "touchcancel", this._onDrop);
			off(document, "selectstart", this);
		},
		_onDrop: function _onDrop(evt) {
			var el = this.el, options = this.options;
			newIndex = index(dragEl);
			newDraggableIndex = index(dragEl, options.draggable);
			pluginEvent("drop", this, { evt });
			parentEl = dragEl && dragEl.parentNode;
			newIndex = index(dragEl);
			newDraggableIndex = index(dragEl, options.draggable);
			if (Sortable.eventCanceled) {
				this._nulling();
				return;
			}
			awaitingDragStarted = false;
			isCircumstantialInvert = false;
			pastFirstInvertThresh = false;
			clearInterval(this._loopId);
			clearTimeout(this._dragStartTimer);
			_cancelNextTick(this.cloneId);
			_cancelNextTick(this._dragStartId);
			if (this.nativeDraggable) {
				off(document, "drop", this);
				off(el, "dragstart", this._onDragStart);
			}
			this._offMoveEvents();
			this._offUpEvents();
			if (Safari) css(document.body, "user-select", "");
			css(dragEl, "transform", "");
			if (evt) {
				if (moved) {
					evt.cancelable && evt.preventDefault();
					!options.dropBubble && evt.stopPropagation();
				}
				ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
				if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== "clone") cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
				if (dragEl) {
					if (this.nativeDraggable) off(dragEl, "dragend", this);
					_disableDraggable(dragEl);
					dragEl.style["will-change"] = "";
					if (moved && !awaitingDragStarted) toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
					toggleClass(dragEl, this.options.chosenClass, false);
					_dispatchEvent({
						sortable: this,
						name: "unchoose",
						toEl: parentEl,
						newIndex: null,
						newDraggableIndex: null,
						originalEvent: evt
					});
					if (rootEl !== parentEl) {
						if (newIndex >= 0) {
							_dispatchEvent({
								rootEl: parentEl,
								name: "add",
								toEl: parentEl,
								fromEl: rootEl,
								originalEvent: evt
							});
							_dispatchEvent({
								sortable: this,
								name: "remove",
								toEl: parentEl,
								originalEvent: evt
							});
							_dispatchEvent({
								rootEl: parentEl,
								name: "sort",
								toEl: parentEl,
								fromEl: rootEl,
								originalEvent: evt
							});
							_dispatchEvent({
								sortable: this,
								name: "sort",
								toEl: parentEl,
								originalEvent: evt
							});
						}
						putSortable && putSortable.save();
					} else if (newIndex !== oldIndex) {
						if (newIndex >= 0) {
							_dispatchEvent({
								sortable: this,
								name: "update",
								toEl: parentEl,
								originalEvent: evt
							});
							_dispatchEvent({
								sortable: this,
								name: "sort",
								toEl: parentEl,
								originalEvent: evt
							});
						}
					}
					if (Sortable.active) {
						if (newIndex == null || newIndex === -1) {
							newIndex = oldIndex;
							newDraggableIndex = oldDraggableIndex;
						}
						_dispatchEvent({
							sortable: this,
							name: "end",
							toEl: parentEl,
							originalEvent: evt
						});
						this.save();
					}
				}
			}
			this._nulling();
		},
		_nulling: function _nulling() {
			pluginEvent("nulling", this);
			rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
			var el = this.el;
			savedInputChecked.forEach(function(checkEl) {
				if (el.contains(checkEl)) checkEl.checked = true;
			});
			savedInputChecked.length = lastDx = lastDy = 0;
		},
		handleEvent: function handleEvent(evt) {
			switch (evt.type) {
				case "drop":
				case "dragend":
					this._onDrop(evt);
					break;
				case "dragenter":
				case "dragover":
					if (dragEl) {
						this._onDragOver(evt);
						_globalDragOver(evt);
					}
					break;
				case "selectstart": evt.preventDefault();
			}
		},
		/**
		* Serializes the item into an array of string.
		* @returns {String[]}
		*/
		toArray: function toArray() {
			var order = [], el, children = this.el.children, i = 0, n = children.length, options = this.options;
			for (; i < n; i++) {
				el = children[i];
				if (closest(el, options.draggable, this.el, false)) order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
			}
			return order;
		},
		/**
		* Sorts the elements according to the array.
		* @param  {String[]}  order  order of the items
		*/
		sort: function sort(order, useAnimation) {
			var items = {}, rootEl = this.el;
			this.toArray().forEach(function(id, i) {
				var el = rootEl.children[i];
				if (closest(el, this.options.draggable, rootEl, false)) items[id] = el;
			}, this);
			useAnimation && this.captureAnimationState();
			order.forEach(function(id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
			useAnimation && this.animateAll();
		},
		/**
		* Save the current sorting
		*/
		save: function save() {
			var store = this.options.store;
			store && store.set && store.set(this);
		},
		/**
		* For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
		* @param   {HTMLElement}  el
		* @param   {String}       [selector]  default: `options.draggable`
		* @returns {HTMLElement|null}
		*/
		closest: function closest$1(el, selector) {
			return closest(el, selector || this.options.draggable, this.el, false);
		},
		/**
		* Set/get option
		* @param   {string} name
		* @param   {*}      [value]
		* @returns {*}
		*/
		option: function option(name, value) {
			var options = this.options;
			if (value === void 0) return options[name];
			else {
				var modifiedValue = PluginManager.modifyOption(this, name, value);
				if (typeof modifiedValue !== "undefined") options[name] = modifiedValue;
				else options[name] = value;
				if (name === "group") _prepareGroup(options);
			}
		},
		/**
		* Destroy
		*/
		destroy: function destroy() {
			pluginEvent("destroy", this);
			var el = this.el;
			el[expando] = null;
			off(el, "mousedown", this._onTapStart);
			off(el, "touchstart", this._onTapStart);
			off(el, "pointerdown", this._onTapStart);
			if (this.nativeDraggable) {
				off(el, "dragover", this);
				off(el, "dragenter", this);
			}
			Array.prototype.forEach.call(el.querySelectorAll("[draggable]"), function(el) {
				el.removeAttribute("draggable");
			});
			this._onDrop();
			this._disableDelayedDragEvents();
			sortables.splice(sortables.indexOf(this.el), 1);
			this.el = el = null;
		},
		_hideClone: function _hideClone() {
			if (!cloneHidden) {
				pluginEvent("hideClone", this);
				if (Sortable.eventCanceled) return;
				css(cloneEl, "display", "none");
				if (this.options.removeCloneOnHide && cloneEl.parentNode) cloneEl.parentNode.removeChild(cloneEl);
				cloneHidden = true;
			}
		},
		_showClone: function _showClone(putSortable) {
			if (putSortable.lastPutMode !== "clone") {
				this._hideClone();
				return;
			}
			if (cloneHidden) {
				pluginEvent("showClone", this);
				if (Sortable.eventCanceled) return;
				if (dragEl.parentNode == rootEl && !this.options.group.revertClone) rootEl.insertBefore(cloneEl, dragEl);
				else if (nextEl) rootEl.insertBefore(cloneEl, nextEl);
				else rootEl.appendChild(cloneEl);
				if (this.options.group.revertClone) this.animate(dragEl, cloneEl);
				css(cloneEl, "display", "");
				cloneHidden = false;
			}
		}
	});
	function _globalDragOver(evt) {
		if (evt.dataTransfer) evt.dataTransfer.dropEffect = "move";
		evt.cancelable && evt.preventDefault();
	}
	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
		var evt, sortable = fromEl[expando], onMoveFn = sortable.options.onMove, retVal;
		if (window.CustomEvent && !IE11OrLess && !Edge) evt = new CustomEvent("move", {
			bubbles: true,
			cancelable: true
		});
		else {
			evt = document.createEvent("Event");
			evt.initEvent("move", true, true);
		}
		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || getRect(toEl);
		evt.willInsertAfter = willInsertAfter;
		evt.originalEvent = originalEvent;
		fromEl.dispatchEvent(evt);
		if (onMoveFn) retVal = onMoveFn.call(sortable, evt, originalEvent);
		return retVal;
	}
	function _disableDraggable(el) {
		el.draggable = false;
	}
	function _unsilent() {
		_silent = false;
	}
	function _ghostIsFirst(evt, vertical, sortable) {
		var firstElRect = getRect(getChild(sortable.el, 0, sortable.options, true));
		var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
		var spacer = 10;
		return vertical ? evt.clientX < childContainingRect.left - spacer || evt.clientY < firstElRect.top && evt.clientX < firstElRect.right : evt.clientY < childContainingRect.top - spacer || evt.clientY < firstElRect.bottom && evt.clientX < firstElRect.left;
	}
	function _ghostIsLast(evt, vertical, sortable) {
		var lastElRect = getRect(lastChild(sortable.el, sortable.options.draggable));
		var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
		var spacer = 10;
		return vertical ? evt.clientX > childContainingRect.right + spacer || evt.clientY > lastElRect.bottom && evt.clientX > lastElRect.left : evt.clientY > childContainingRect.bottom + spacer || evt.clientX > lastElRect.right && evt.clientY > lastElRect.top;
	}
	function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
		var mouseOnAxis = vertical ? evt.clientY : evt.clientX, targetLength = vertical ? targetRect.height : targetRect.width, targetS1 = vertical ? targetRect.top : targetRect.left, targetS2 = vertical ? targetRect.bottom : targetRect.right, invert = false;
		if (!invertSwap) {
			if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
				if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) pastFirstInvertThresh = true;
				if (!pastFirstInvertThresh) {
					if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance : mouseOnAxis > targetS2 - targetMoveDistance) return -lastDirection;
				} else invert = true;
			} else if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) return _getInsertDirection(target);
		}
		invert = invert || invertSwap;
		if (invert) {
			if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
		}
		return 0;
	}
	/**
	* Gets the direction dragEl must be swapped relative to target in order to make it
	* seem that dragEl has been "inserted" into that element's position
	* @param  {HTMLElement} target       The target whose position dragEl is being inserted at
	* @return {Number}                   Direction dragEl must be swapped
	*/
	function _getInsertDirection(target) {
		if (index(dragEl) < index(target)) return 1;
		else return -1;
	}
	/**
	* Generate id
	* @param   {HTMLElement} el
	* @returns {String}
	* @private
	*/
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent, i = str.length, sum = 0;
		while (i--) sum += str.charCodeAt(i);
		return sum.toString(36);
	}
	function _saveInputCheckedState(root) {
		savedInputChecked.length = 0;
		var inputs = root.getElementsByTagName("input");
		var idx = inputs.length;
		while (idx--) {
			var el = inputs[idx];
			el.checked && savedInputChecked.push(el);
		}
	}
	function _nextTick(fn) {
		return setTimeout(fn, 0);
	}
	function _cancelNextTick(id) {
		return clearTimeout(id);
	}
	if (documentExists) on(document, "touchmove", function(evt) {
		if ((Sortable.active || awaitingDragStarted) && evt.cancelable) evt.preventDefault();
	});
	Sortable.utils = {
		on,
		off,
		css,
		find,
		is: function is(el, selector) {
			return !!closest(el, selector, el, false);
		},
		extend,
		throttle,
		closest,
		toggleClass,
		clone,
		index,
		nextTick: _nextTick,
		cancelNextTick: _cancelNextTick,
		detectDirection: _detectDirection,
		getChild,
		expando
	};
	/**
	* Get the Sortable instance of an element
	* @param  {HTMLElement} element The element
	* @return {Sortable|undefined}         The instance of Sortable
	*/
	Sortable.get = function(element) {
		return element[expando];
	};
	/**
	* Mount a plugin to Sortable
	* @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
	*/
	Sortable.mount = function() {
		for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) plugins[_key] = arguments[_key];
		if (plugins[0].constructor === Array) plugins = plugins[0];
		plugins.forEach(function(plugin) {
			if (!plugin.prototype || !plugin.prototype.constructor) throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
			if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
			PluginManager.mount(plugin);
		});
	};
	/**
	* Create sortable instance
	* @param {HTMLElement}  el
	* @param {Object}      [options]
	*/
	Sortable.create = function(el, options) {
		return new Sortable(el, options);
	};
	Sortable.version = version;
	var autoScrolls = [];
	var scrollEl;
	var scrollRootEl;
	var scrolling = false;
	var lastAutoScrollX;
	var lastAutoScrollY;
	var touchEvt$1;
	var pointerElemChangedInterval;
	function AutoScrollPlugin() {
		function AutoScroll() {
			this.defaults = {
				scroll: true,
				forceAutoScrollFallback: false,
				scrollSensitivity: 30,
				scrollSpeed: 10,
				bubbleScroll: true
			};
			for (var fn in this) if (fn.charAt(0) === "_" && typeof this[fn] === "function") this[fn] = this[fn].bind(this);
		}
		AutoScroll.prototype = {
			dragStarted: function dragStarted(_ref) {
				var originalEvent = _ref.originalEvent;
				if (this.sortable.nativeDraggable) on(document, "dragover", this._handleAutoScroll);
				else if (this.options.supportPointer) on(document, "pointermove", this._handleFallbackAutoScroll);
				else if (originalEvent.touches) on(document, "touchmove", this._handleFallbackAutoScroll);
				else on(document, "mousemove", this._handleFallbackAutoScroll);
			},
			dragOverCompleted: function dragOverCompleted(_ref2) {
				var originalEvent = _ref2.originalEvent;
				if (!this.options.dragOverBubble && !originalEvent.rootEl) this._handleAutoScroll(originalEvent);
			},
			drop: function drop() {
				if (this.sortable.nativeDraggable) off(document, "dragover", this._handleAutoScroll);
				else {
					off(document, "pointermove", this._handleFallbackAutoScroll);
					off(document, "touchmove", this._handleFallbackAutoScroll);
					off(document, "mousemove", this._handleFallbackAutoScroll);
				}
				clearPointerElemChangedInterval();
				clearAutoScrolls();
				cancelThrottle();
			},
			nulling: function nulling() {
				touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
				autoScrolls.length = 0;
			},
			_handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
				this._handleAutoScroll(evt, true);
			},
			_handleAutoScroll: function _handleAutoScroll(evt, fallback) {
				var _this = this;
				var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, elem = document.elementFromPoint(x, y);
				touchEvt$1 = evt;
				if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
					autoScroll(evt, this.options, elem, fallback);
					var ogElemScroller = getParentAutoScrollElement(elem, true);
					if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
						pointerElemChangedInterval && clearPointerElemChangedInterval();
						pointerElemChangedInterval = setInterval(function() {
							var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
							if (newElem !== ogElemScroller) {
								ogElemScroller = newElem;
								clearAutoScrolls();
							}
							autoScroll(evt, _this.options, newElem, fallback);
						}, 10);
						lastAutoScrollX = x;
						lastAutoScrollY = y;
					}
				} else {
					if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
						clearAutoScrolls();
						return;
					}
					autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
				}
			}
		};
		return _extends(AutoScroll, {
			pluginName: "scroll",
			initializeByDefault: true
		});
	}
	function clearAutoScrolls() {
		autoScrolls.forEach(function(autoScroll) {
			clearInterval(autoScroll.pid);
		});
		autoScrolls = [];
	}
	function clearPointerElemChangedInterval() {
		clearInterval(pointerElemChangedInterval);
	}
	var autoScroll = throttle(function(evt, options, rootEl, isFallback) {
		if (!options.scroll) return;
		var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, sens = options.scrollSensitivity, speed = options.scrollSpeed, winScroller = getWindowScrollingElement();
		var scrollThisInstance = false, scrollCustomFn;
		if (scrollRootEl !== rootEl) {
			scrollRootEl = rootEl;
			clearAutoScrolls();
			scrollEl = options.scroll;
			scrollCustomFn = options.scrollFn;
			if (scrollEl === true) scrollEl = getParentAutoScrollElement(rootEl, true);
		}
		var layersOut = 0;
		var currentParent = scrollEl;
		do {
			var el = currentParent, rect = getRect(el), top = rect.top, bottom = rect.bottom, left = rect.left, right = rect.right, width = rect.width, height = rect.height, canScrollX = void 0, canScrollY = void 0, scrollWidth = el.scrollWidth, scrollHeight = el.scrollHeight, elCSS = css(el), scrollPosX = el.scrollLeft, scrollPosY = el.scrollTop;
			if (el === winScroller) {
				canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll" || elCSS.overflowX === "visible");
				canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll" || elCSS.overflowY === "visible");
			} else {
				canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll");
				canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll");
			}
			var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
			var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
			if (!autoScrolls[layersOut]) {
				for (var i = 0; i <= layersOut; i++) if (!autoScrolls[i]) autoScrolls[i] = {};
			}
			if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
				autoScrolls[layersOut].el = el;
				autoScrolls[layersOut].vx = vx;
				autoScrolls[layersOut].vy = vy;
				clearInterval(autoScrolls[layersOut].pid);
				if (vx != 0 || vy != 0) {
					scrollThisInstance = true;
					autoScrolls[layersOut].pid = setInterval(function() {
						if (isFallback && this.layer === 0) Sortable.active._onTouchMove(touchEvt$1);
						var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
						var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
						if (typeof scrollCustomFn === "function") {
							if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== "continue") return;
						}
						scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
					}.bind({ layer: layersOut }), 24);
				}
			}
			layersOut++;
		} while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
		scrolling = scrollThisInstance;
	}, 30);
	var drop = function drop(_ref) {
		var originalEvent = _ref.originalEvent, putSortable = _ref.putSortable, dragEl = _ref.dragEl, activeSortable = _ref.activeSortable, dispatchSortableEvent = _ref.dispatchSortableEvent, hideGhostForTarget = _ref.hideGhostForTarget, unhideGhostForTarget = _ref.unhideGhostForTarget;
		if (!originalEvent) return;
		var toSortable = putSortable || activeSortable;
		hideGhostForTarget();
		var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
		var target = document.elementFromPoint(touch.clientX, touch.clientY);
		unhideGhostForTarget();
		if (toSortable && !toSortable.el.contains(target)) {
			dispatchSortableEvent("spill");
			this.onSpill({
				dragEl,
				putSortable
			});
		}
	};
	function Revert() {}
	Revert.prototype = {
		startIndex: null,
		dragStart: function dragStart(_ref2) {
			var oldDraggableIndex = _ref2.oldDraggableIndex;
			this.startIndex = oldDraggableIndex;
		},
		onSpill: function onSpill(_ref3) {
			var dragEl = _ref3.dragEl, putSortable = _ref3.putSortable;
			this.sortable.captureAnimationState();
			if (putSortable) putSortable.captureAnimationState();
			var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
			if (nextSibling) this.sortable.el.insertBefore(dragEl, nextSibling);
			else this.sortable.el.appendChild(dragEl);
			this.sortable.animateAll();
			if (putSortable) putSortable.animateAll();
		},
		drop
	};
	_extends(Revert, { pluginName: "revertOnSpill" });
	function Remove() {}
	Remove.prototype = {
		onSpill: function onSpill(_ref4) {
			var dragEl = _ref4.dragEl;
			var parentSortable = _ref4.putSortable || this.sortable;
			parentSortable.captureAnimationState();
			dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
			parentSortable.animateAll();
		},
		drop
	};
	_extends(Remove, { pluginName: "removeOnSpill" });
	Sortable.mount(new AutoScrollPlugin());
	Sortable.mount(Remove, Revert);
	//#endregion
	//#region resources/js/shared/legacy/admin/form/images-sortable.js
	function createImagesSortable(Sortable, element, ghostClass, onReorder) {
		return new Sortable(element, imagesSortableOptions(ghostClass, onReorder));
	}
	function imagesSortableOptions(ghostClass, onReorder) {
		return {
			animation: 150,
			draggable: "[data-images-item]",
			...ghostClass ? { ghostClass } : {},
			handle: "[data-images-drag-handle]",
			onEnd: (event) => notifyReorder(event, onReorder)
		};
	}
	function notifyReorder(event, onReorder) {
		var _event$oldDraggableIn, _event$newDraggableIn;
		const from = (_event$oldDraggableIn = event.oldDraggableIndex) !== null && _event$oldDraggableIn !== void 0 ? _event$oldDraggableIn : event.oldIndex;
		const to = (_event$newDraggableIn = event.newDraggableIndex) !== null && _event$newDraggableIn !== void 0 ? _event$newDraggableIn : event.newIndex;
		if (Number.isInteger(from) && Number.isInteger(to) && from !== to) onReorder(from, to);
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/images-upload.js
	function createImagesUpload(Upload, container, config) {
		return new Upload(container, imagesUploadOptions(config));
	}
	function imagesUploadOptions(config) {
		return {
			...imageUploadOptions(config),
			clickable: config.clickable
		};
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/images-values.js
	function normalizeImagesValues(values) {
		if (!Array.isArray(values)) return [];
		return values.map(normalizeImageValue).filter(Boolean);
	}
	function addImageValue(values, value) {
		const normalized = normalizeImageValue(value);
		return normalized ? [...values, normalized] : values;
	}
	function replaceImageValue(values, index, value) {
		if (!hasImageIndex(values, index)) return values;
		const normalized = normalizeImageValue(value);
		if (!normalized) return values;
		return values.map((current, position) => position === index ? normalized : current);
	}
	function removeImageValue(values, index) {
		if (!hasImageIndex(values, index)) return values;
		return values.filter((_value, position) => position !== index);
	}
	function reorderImageValues(values, from, to) {
		if (!hasImageIndex(values, from) || !hasImageIndex(values, to) || from === to) return values;
		const reordered = [...values];
		const [moved] = reordered.splice(from, 1);
		reordered.splice(to, 0, moved);
		return reordered;
	}
	function serializeImagesValues(values) {
		return values.join(",");
	}
	function hasImageIndex(values, index) {
		return Number.isInteger(index) && index >= 0 && index < values.length;
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/images.vue
	var _sfc_main$2 = /* @__PURE__ */ defineComponent({
		name: "ElementImages",
		props: {
			assetPrefix: {
				type: String,
				default: ""
			},
			classes: {
				type: Object,
				default: () => ({})
			},
			csrfToken: {
				type: String,
				required: true
			},
			draggable: {
				type: Boolean,
				default: true
			},
			labels: {
				type: Object,
				required: true
			},
			maxFileSize: {
				type: Number,
				required: true
			},
			messages: {
				type: Object,
				required: true
			},
			name: {
				type: String,
				required: true
			},
			onlyLink: Boolean,
			readonly: Boolean,
			url: {
				type: String,
				required: true
			},
			values: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				disposed: false,
				errors: [],
				lightboxIndex: null,
				pasteActive: false,
				sortable: null,
				uploader: null,
				uploading: false,
				vals: normalizeImagesValues(this.values)
			};
		},
		computed: {
			hasValues() {
				return this.vals.length > 0;
			},
			lightboxPosition() {
				return this.lightboxIndex === null ? "" : `${this.lightboxIndex + 1} / ${this.vals.length}`;
			},
			lightboxUrl() {
				return this.lightboxIndex === null ? "" : this.imageUrl(this.vals[this.lightboxIndex]);
			},
			serializedValues() {
				return serializeImagesValues(this.vals);
			},
			uploadIconClass() {
				return this.uploading ? this.classes.uploadingIcon : this.classes.uploadIcon;
			},
			stateClasses() {
				return {
					"soa-is-empty": !this.hasValues,
					"soa-is-error": this.errors.length > 0,
					"soa-is-readonly": this.readonly,
					"soa-is-uploading": this.uploading
				};
			}
		},
		mounted() {
			if (!this.readonly && !this.onlyLink) this.mountUpload();
			if (!this.readonly && this.draggable) this.mountSortable();
		},
		beforeUnmount() {
			var _this$sortable, _this$uploader;
			this.disposed = true;
			this.closeLightbox();
			(_this$sortable = this.sortable) === null || _this$sortable === void 0 || _this$sortable.destroy();
			(_this$uploader = this.uploader) === null || _this$uploader === void 0 || _this$uploader.destroy();
			this.sortable = null;
			this.uploader = null;
			if (this.pasteActive) removeImagePasteBuffer(this.pasteDocument());
		},
		methods: {
			applyInsertedValue(value, index) {
				if (!value) return removeImagePasteBuffer(this.pasteDocument());
				if (isBlobImageValue(value)) {
					if (this.onlyLink) return removeImagePasteBuffer(this.pasteDocument());
					return this.uploadPastedImage(index);
				}
				removeImagePasteBuffer(this.pasteDocument());
				this.setValue(value, index);
				return true;
			},
			closeAlert() {
				this.errors = [];
			},
			closeLightbox() {
				const dialog = this.$refs.lightbox;
				if ((dialog === null || dialog === void 0 ? void 0 : dialog.open) && typeof dialog.close === "function") dialog.close();
				else dialog === null || dialog === void 0 || dialog.removeAttribute("open");
				this.lightboxIndex = null;
			},
			completeUpload(response) {
				this.setValue(response === null || response === void 0 ? void 0 : response.value);
			},
			failUpload(response) {
				const errors = responseErrors(response);
				if (errors[0]) Admin.Messages.error(response === null || response === void 0 ? void 0 : response.message, errors[0]);
				this.errors = errors;
			},
			finishUpload() {
				this.uploading = false;
			},
			async downloadImage(uri) {
				try {
					await downloadFile(this.imageUrl(uri), { document: this.$el.ownerDocument });
				} catch (error) {
					if (!this.disposed) Admin.Messages.error(this.messages.responseError, error.message);
				}
			},
			handleLightboxKey(event) {
				if (event.key === "ArrowLeft") this.showPreviousImage();
				if (event.key === "ArrowRight") this.showNextImage();
				if (event.key.startsWith("Arrow")) event.preventDefault();
			},
			imageUrl(uri) {
				return imagePreviewUrl(uri, {
					assetPrefix: this.assetPrefix,
					createUploadUrl: (path) => Admin.Url.upload(path),
					useAssetPrefix: true
				});
			},
			async insert(index = null) {
				const current = index === null ? null : this.vals[index];
				this.pasteActive = true;
				try {
					const result = await Admin.Messages.cliptobuffer(this.labels.insertLink, null, null, current, current === null ? null : this.imageUrl(current));
					if (!this.disposed) await this.applyInsertedValue(result === null || result === void 0 ? void 0 : result.value, index);
				} finally {
					this.pasteActive = false;
				}
			},
			mountSortable() {
				this.sortable = createImagesSortable(Sortable, this.$refs.gallery, this.classes.sortableGhost, this.reorder);
			},
			mountUpload() {
				this.uploader = createImagesUpload(import_dropzone.default, this.$refs.gallery, {
					clickable: this.$refs.uploadButton,
					csrfToken: this.csrfToken,
					fileTooBigText: this.messages.fileTooBig,
					invalidFileTypeText: this.messages.invalidFileType,
					maxFileSize: this.maxFileSize,
					onComplete: this.finishUpload,
					onError: this.failUpload,
					onSending: this.startUpload,
					onSuccess: this.completeUpload,
					responseErrorText: this.messages.responseError,
					url: this.url
				});
			},
			async openLightbox(index) {
				this.lightboxIndex = index;
				await nextTick();
				const dialog = this.$refs.lightbox;
				if (!dialog || this.disposed) return;
				if (typeof dialog.showModal === "function") dialog.showModal();
				else dialog.setAttribute("open", "");
			},
			pasteDocument() {
				return this.$el.ownerDocument;
			},
			previewLabel(index) {
				return `${this.labels.preview} ${index + 1}`;
			},
			async remove(index) {
				const result = await Admin.Messages.confirm(this.messages.confirmRemove);
				if (this.disposed || !result.value) return;
				this.closeLightbox();
				this.vals = removeImageValue(this.vals, index);
			},
			reorder(from, to) {
				this.vals = reorderImageValues(this.vals, from, to);
			},
			resetLightbox() {
				this.lightboxIndex = null;
			},
			setValue(value, index = null) {
				this.vals = index === null ? addImageValue(this.vals, value) : replaceImageValue(this.vals, index, value);
			},
			showNextImage() {
				if (this.lightboxIndex === null) return;
				this.lightboxIndex = (this.lightboxIndex + 1) % this.vals.length;
			},
			showPreviousImage() {
				if (this.lightboxIndex === null) return;
				this.lightboxIndex = (this.lightboxIndex - 1 + this.vals.length) % this.vals.length;
			},
			startUpload() {
				this.uploading = true;
				this.closeAlert();
			},
			async uploadPastedImage(index) {
				const document = this.pasteDocument();
				const buffer = readImagePasteBuffer(document);
				if (!buffer) return false;
				this.startUpload();
				try {
					var _response$path;
					const response = await postPastedImage(Admin.Http, this.url, createImagePasteBody(buffer));
					if (!this.disposed) this.setValue((_response$path = response === null || response === void 0 ? void 0 : response.path) !== null && _response$path !== void 0 ? _response$path : response === null || response === void 0 ? void 0 : response.value, index);
				} catch (error) {
					await this.showPasteUploadError(error);
				} finally {
					removeImagePasteBuffer(document);
					if (!this.disposed) this.finishUpload();
				}
				return true;
			},
			async showPasteUploadError(error) {
				const details = await imageUploadError(error, this.messages.responseError);
				if (!this.disposed) Admin.Messages.error(details.title, details.message);
			}
		}
	});
	var _hoisted_1$3 = ["aria-busy", "aria-readonly"];
	var _hoisted_2$2 = ["aria-label"];
	var _hoisted_3$2 = ["aria-label", "onClick"];
	var _hoisted_4$2 = ["src"];
	var _hoisted_5$2 = ["aria-label", "title"];
	var _hoisted_6$1 = [
		"href",
		"title",
		"aria-label",
		"onClick"
	];
	var _hoisted_7$1 = [
		"title",
		"aria-label",
		"onClick"
	];
	var _hoisted_8$1 = [
		"title",
		"aria-label",
		"onClick"
	];
	var _hoisted_9$1 = ["title", "aria-label"];
	var _hoisted_10$1 = ["name", "value"];
	var _hoisted_11$1 = ["aria-label"];
	var _hoisted_12$1 = ["aria-label", "title"];
	var _hoisted_13$1 = ["aria-label", "title"];
	var _hoisted_14$1 = ["src"];
	var _hoisted_15$1 = ["aria-label", "title"];
	function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
		return openBlock(), createElementBlock("div", {
			"data-images-root": "",
			class: normalizeClass([_ctx.classes.root, _ctx.stateClasses]),
			"aria-busy": _ctx.uploading ? "true" : "false",
			"aria-readonly": _ctx.readonly ? "true" : void 0
		}, [
			_ctx.errors.length ? (openBlock(), createElementBlock("div", {
				key: 0,
				"data-images-alert": "",
				class: normalizeClass(_ctx.classes.alert)
			}, [createBaseVNode("button", {
				type: "button",
				"data-images-alert-close": "",
				class: normalizeClass(_ctx.classes.alertClose),
				"aria-label": _ctx.labels.close,
				onClick: _cache[0] || (_cache[0] = (...args) => _ctx.closeAlert && _ctx.closeAlert(...args))
			}, [..._cache[9] || (_cache[9] = [createBaseVNode("span", { "aria-hidden": "true" }, "×", -1)])], 10, _hoisted_2$2), (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.errors, (error, index) => {
				return openBlock(), createElementBlock("p", { key: `${error}-${index}` }, [createBaseVNode("i", {
					"data-images-error-icon": "",
					class: normalizeClass(_ctx.classes.errorIcon),
					"aria-hidden": "true"
				}, null, 2), createTextVNode(" " + toDisplayString(error), 1)]);
			}), 128))], 2)) : createCommentVNode("v-if", true),
			createBaseVNode("div", {
				ref: "gallery",
				"data-images-gallery": "",
				class: normalizeClass([_ctx.classes.gallery, _ctx.readonly && _ctx.classes.galleryReadonly])
			}, [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.vals, (uri, index) => {
				return openBlock(), createElementBlock("article", {
					key: `${uri}-${index}`,
					"data-images-item": "",
					class: normalizeClass(_ctx.classes.item)
				}, [createBaseVNode("button", {
					type: "button",
					"data-images-preview": "",
					class: normalizeClass(_ctx.classes.previewButton),
					"aria-label": _ctx.previewLabel(index),
					onClick: ($event) => _ctx.openLightbox(index)
				}, [createBaseVNode("img", {
					src: _ctx.imageUrl(uri),
					alt: "",
					"data-images-preview-image": ""
				}, null, 8, _hoisted_4$2), createBaseVNode("span", {
					"data-images-order": "",
					class: normalizeClass(_ctx.classes.order),
					"aria-hidden": "true"
				}, toDisplayString(index + 1), 3)], 10, _hoisted_3$2), createBaseVNode("div", {
					"data-images-info": "",
					class: normalizeClass(_ctx.classes.info)
				}, [
					!_ctx.readonly && _ctx.draggable ? (openBlock(), createElementBlock("button", {
						key: 0,
						type: "button",
						"data-images-drag-handle": "",
						class: normalizeClass(_ctx.classes.dragButton),
						"aria-label": _ctx.labels.reorder,
						title: _ctx.labels.reorder
					}, [createBaseVNode("i", {
						"data-images-drag-icon": "",
						class: normalizeClass(_ctx.classes.dragIcon),
						"aria-hidden": "true"
					}, null, 2)], 10, _hoisted_5$2)) : createCommentVNode("v-if", true),
					createBaseVNode("a", {
						href: _ctx.imageUrl(uri),
						"data-images-download": "",
						class: normalizeClass(_ctx.classes.downloadButton),
						download: "",
						title: _ctx.labels.download,
						"aria-label": _ctx.labels.download,
						onClick: withModifiers(($event) => _ctx.downloadImage(uri), ["prevent"])
					}, [createBaseVNode("i", {
						"data-images-download-icon": "",
						class: normalizeClass(_ctx.classes.downloadIcon),
						"aria-hidden": "true"
					}, null, 2)], 10, _hoisted_6$1),
					!_ctx.readonly ? (openBlock(), createElementBlock("button", {
						key: 1,
						type: "button",
						"data-images-insert": "",
						class: normalizeClass(_ctx.classes.insertButton),
						title: _ctx.labels.insertLink,
						"aria-label": _ctx.labels.insertLink,
						onClick: ($event) => _ctx.insert(index)
					}, [createBaseVNode("i", {
						"data-images-insert-icon": "",
						class: normalizeClass(_ctx.classes.insertIcon),
						"aria-hidden": "true"
					}, null, 2)], 10, _hoisted_7$1)) : createCommentVNode("v-if", true),
					!_ctx.readonly ? (openBlock(), createElementBlock("button", {
						key: 2,
						type: "button",
						"data-images-remove": "",
						class: normalizeClass(_ctx.classes.removeButton),
						title: _ctx.labels.remove,
						"aria-label": _ctx.labels.remove,
						onClick: ($event) => _ctx.remove(index)
					}, [createBaseVNode("i", {
						"data-images-remove-icon": "",
						class: normalizeClass(_ctx.classes.removeIcon),
						"aria-hidden": "true"
					}, null, 2)], 10, _hoisted_8$1)) : createCommentVNode("v-if", true)
				], 2)], 2);
			}), 128))], 2),
			!_ctx.readonly ? (openBlock(), createElementBlock("div", {
				key: 1,
				"data-images-actions": "",
				class: normalizeClass(_ctx.classes.actions)
			}, [!_ctx.onlyLink ? (openBlock(), createElementBlock("button", {
				key: 0,
				ref: "uploadButton",
				type: "button",
				"data-images-upload": "",
				class: normalizeClass(_ctx.classes.uploadButton)
			}, [createBaseVNode("i", {
				"data-images-upload-icon": "",
				class: normalizeClass(_ctx.uploadIconClass),
				"aria-hidden": "true"
			}, null, 2), createTextVNode(" " + toDisplayString(_ctx.labels.browse), 1)], 2)) : createCommentVNode("v-if", true), createBaseVNode("button", {
				type: "button",
				"data-images-insert-new": "",
				class: normalizeClass(_ctx.classes.insertNewButton),
				title: _ctx.labels.insertLink,
				"aria-label": _ctx.labels.insertLink,
				onClick: _cache[1] || (_cache[1] = ($event) => _ctx.insert())
			}, [createBaseVNode("i", {
				"data-images-insert-icon": "",
				class: normalizeClass(_ctx.classes.insertIcon),
				"aria-hidden": "true"
			}, null, 2)], 10, _hoisted_9$1)], 2)) : createCommentVNode("v-if", true),
			createBaseVNode("input", {
				"data-images-value": "",
				name: _ctx.name,
				type: "hidden",
				value: _ctx.serializedValues
			}, null, 8, _hoisted_10$1),
			(openBlock(), createBlock(Teleport, { to: "body" }, [_ctx.hasValues ? (openBlock(), createElementBlock("dialog", {
				key: 0,
				ref: "lightbox",
				"data-images-dialog": "",
				class: normalizeClass(_ctx.classes.dialog),
				"aria-label": _ctx.labels.preview,
				onCancel: _cache[5] || (_cache[5] = (...args) => _ctx.resetLightbox && _ctx.resetLightbox(...args)),
				onClick: _cache[6] || (_cache[6] = withModifiers((...args) => _ctx.closeLightbox && _ctx.closeLightbox(...args), ["self"])),
				onClose: _cache[7] || (_cache[7] = (...args) => _ctx.resetLightbox && _ctx.resetLightbox(...args)),
				onKeydown: _cache[8] || (_cache[8] = (...args) => _ctx.handleLightboxKey && _ctx.handleLightboxKey(...args))
			}, [
				createBaseVNode("button", {
					type: "button",
					"data-images-dialog-close": "",
					class: normalizeClass(_ctx.classes.dialogCloseButton),
					"aria-label": _ctx.labels.close,
					title: _ctx.labels.close,
					onClick: _cache[2] || (_cache[2] = (...args) => _ctx.closeLightbox && _ctx.closeLightbox(...args))
				}, [createBaseVNode("i", {
					"data-images-dialog-close-icon": "",
					class: normalizeClass(_ctx.classes.dialogCloseIcon),
					"aria-hidden": "true"
				}, null, 2)], 10, _hoisted_12$1),
				createBaseVNode("div", {
					"data-images-dialog-frame": "",
					class: normalizeClass(_ctx.classes.dialogFrame)
				}, [
					createBaseVNode("button", {
						type: "button",
						"data-images-dialog-previous": "",
						class: normalizeClass(_ctx.classes.dialogPreviousButton),
						"aria-label": _ctx.labels.previous,
						title: _ctx.labels.previous,
						onClick: _cache[3] || (_cache[3] = (...args) => _ctx.showPreviousImage && _ctx.showPreviousImage(...args))
					}, [createBaseVNode("i", {
						"data-images-dialog-previous-icon": "",
						class: normalizeClass(_ctx.classes.dialogPreviousIcon),
						"aria-hidden": "true"
					}, null, 2)], 10, _hoisted_13$1),
					createBaseVNode("img", {
						src: _ctx.lightboxUrl,
						alt: "",
						"data-images-dialog-image": "",
						class: normalizeClass(_ctx.classes.dialogImage)
					}, null, 10, _hoisted_14$1),
					createBaseVNode("button", {
						type: "button",
						"data-images-dialog-next": "",
						class: normalizeClass(_ctx.classes.dialogNextButton),
						"aria-label": _ctx.labels.next,
						title: _ctx.labels.next,
						onClick: _cache[4] || (_cache[4] = (...args) => _ctx.showNextImage && _ctx.showNextImage(...args))
					}, [createBaseVNode("i", {
						"data-images-dialog-next-icon": "",
						class: normalizeClass(_ctx.classes.dialogNextIcon),
						"aria-hidden": "true"
					}, null, 2)], 10, _hoisted_15$1)
				], 2),
				createBaseVNode("p", {
					"data-images-dialog-position": "",
					class: normalizeClass(_ctx.classes.dialogPosition),
					"aria-live": "polite"
				}, toDisplayString(_ctx.lightboxPosition), 3)
			], 42, _hoisted_11$1)) : createCommentVNode("v-if", true)]))
		], 10, _hoisted_1$3);
	}
	var images_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["render", _sfc_render$2], ["__file", "images.vue"]]);
	//#endregion
	//#region node_modules/vue-multiselect/dist/vue-multiselect.esm.js
	function isEmpty(opt) {
		if (opt === 0) return false;
		if (Array.isArray(opt) && opt.length === 0) return true;
		return !opt;
	}
	function not(fun) {
		return (...params) => !fun(...params);
	}
	function includes(str, query) {
		/* istanbul ignore else */
		if (str === void 0) str = "undefined";
		if (str === null) str = "null";
		if (str === false) str = "false";
		return str.toString().toLowerCase().indexOf(query.trim()) !== -1;
	}
	function stripGroups(options) {
		return options.filter((option) => !option.$isLabel);
	}
	function flattenOptions(values, label) {
		return (options) => options.reduce((prev, curr) => {
			/* istanbul ignore else */
			if (curr[values] && curr[values].length) {
				prev.push({
					$groupLabel: curr[label],
					$isLabel: true
				});
				return prev.concat(curr[values]);
			}
			return prev;
		}, []);
	}
	var flow = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
	var script = {
		name: "vue-multiselect",
		mixins: [{
			data() {
				return {
					search: "",
					isOpen: false,
					preferredOpenDirection: "below",
					optimizedHeight: this.maxHeight
				};
			},
			props: {
				/**
				* Decide whether to filter the results based on search query.
				* Useful for async filtering, where we search through more complex data.
				* @type {Boolean}
				*/
				internalSearch: {
					type: Boolean,
					default: true
				},
				/**
				* Array of available options: Objects, Strings or Integers.
				* If array of objects, visible label will default to option.label.
				* If `labal` prop is passed, label will equal option['label']
				* @type {Array}
				*/
				options: {
					type: Array,
					required: true
				},
				/**
				* Equivalent to the `multiple` attribute on a `<select>` input.
				* @default false
				* @type {Boolean}
				*/
				multiple: {
					type: Boolean,
					default: false
				},
				/**
				* Key to compare objects
				* @default 'id'
				* @type {String}
				*/
				trackBy: { type: String },
				/**
				* Label to look for in option Object
				* @default 'label'
				* @type {String}
				*/
				label: { type: String },
				/**
				* Enable/disable search in options
				* @default true
				* @type {Boolean}
				*/
				searchable: {
					type: Boolean,
					default: true
				},
				/**
				* Clear the search input after `)
				* @default true
				* @type {Boolean}
				*/
				clearOnSelect: {
					type: Boolean,
					default: true
				},
				/**
				* Hide already selected options
				* @default false
				* @type {Boolean}
				*/
				hideSelected: {
					type: Boolean,
					default: false
				},
				/**
				* Equivalent to the `placeholder` attribute on a `<select>` input.
				* @default 'Select option'
				* @type {String}
				*/
				placeholder: {
					type: String,
					default: "Select option"
				},
				/**
				* Allow to remove all selected values
				* @default true
				* @type {Boolean}
				*/
				allowEmpty: {
					type: Boolean,
					default: true
				},
				/**
				* Reset this.internalValue, this.search after this.internalValue changes.
				* Useful if want to create a stateless dropdown.
				* @default false
				* @type {Boolean}
				*/
				resetAfter: {
					type: Boolean,
					default: false
				},
				/**
				* Enable/disable closing after selecting an option
				* @default true
				* @type {Boolean}
				*/
				closeOnSelect: {
					type: Boolean,
					default: true
				},
				/**
				* Function to interpolate the custom label
				* @default false
				* @type {Function}
				*/
				customLabel: {
					type: Function,
					default(option, label) {
						if (isEmpty(option)) return "";
						return label ? option[label] : option;
					}
				},
				/**
				* Disable / Enable tagging
				* @default false
				* @type {Boolean}
				*/
				taggable: {
					type: Boolean,
					default: false
				},
				/**
				* String to show when highlighting a potential tag
				* @default 'Press enter to create a tag'
				* @type {String}
				*/
				tagPlaceholder: {
					type: String,
					default: "Press enter to create a tag"
				},
				/**
				* By default new tags will appear above the search results.
				* Changing to 'bottom' will revert this behaviour
				* and will proritize the search results
				* @default 'top'
				* @type {String}
				*/
				tagPosition: {
					type: String,
					default: "top"
				},
				/**
				* Number of allowed selected options. No limit if 0.
				* @default 0
				* @type {Number}
				*/
				max: {
					type: [Number, Boolean],
					default: false
				},
				/**
				* Will be passed with all events as second param.
				* Useful for identifying events origin.
				* @default null
				* @type {String|Integer}
				*/
				id: { default: null },
				/**
				* Limits the options displayed in the dropdown
				* to the first X options.
				* @default 1000
				* @type {Integer}
				*/
				optionsLimit: {
					type: Number,
					default: 1e3
				},
				/**
				* Name of the property containing
				* the group values
				* @default 1000
				* @type {String}
				*/
				groupValues: { type: String },
				/**
				* Name of the property containing
				* the group label
				* @default 1000
				* @type {String}
				*/
				groupLabel: { type: String },
				/**
				* Allow to select all group values
				* by selecting the group label
				* @default false
				* @type {Boolean}
				*/
				groupSelect: {
					type: Boolean,
					default: false
				},
				/**
				* Array of keyboard keys to block
				* when selecting
				* @default 1000
				* @type {String}
				*/
				blockKeys: {
					type: Array,
					default() {
						return [];
					}
				},
				/**
				* Prevent from wiping up the search value
				* @default false
				* @type {Boolean}
				*/
				preserveSearch: {
					type: Boolean,
					default: false
				},
				/**
				* Select 1st options if value is empty
				* @default false
				* @type {Boolean}
				*/
				preselectFirst: {
					type: Boolean,
					default: false
				},
				/**
				* Prevent autofocus
				* @default false
				* @type {Boolean}
				*/
				preventAutofocus: {
					type: Boolean,
					default: false
				},
				/**
				* Allows a custom function for sorting search/filtered results.
				* @default null
				* @type {Function}
				*/
				filteringSortFunc: {
					type: Function,
					default: null
				}
			},
			mounted() {
				/* istanbul ignore else */
				if (!this.multiple && this.max) console.warn("[Vue-Multiselect warn]: Max prop should not be used when prop Multiple equals false.");
				if (this.preselectFirst && !this.internalValue.length && this.options.length) this.select(this.filteredOptions[0]);
			},
			computed: {
				internalValue() {
					return this.modelValue || this.modelValue === 0 ? Array.isArray(this.modelValue) ? this.modelValue : [this.modelValue] : [];
				},
				filteredOptions() {
					const search = this.search || "";
					const normalizedSearch = search.toLowerCase().trim();
					let options = this.options.concat();
					/* istanbul ignore else */
					if (this.internalSearch) options = this.groupValues ? this.filterAndFlat(options, normalizedSearch, this.label) : this.filterOptions(options, normalizedSearch, this.label, this.customLabel);
					else options = this.groupValues ? flattenOptions(this.groupValues, this.groupLabel)(options) : options;
					options = this.hideSelected ? options.filter(not(this.isSelected)) : options;
					/* istanbul ignore else */
					if (this.taggable && normalizedSearch.length && !this.isExistingOption(normalizedSearch)) {
						if (this.tagPosition === "bottom") options.push({
							isTag: true,
							label: search
						});
						else options.unshift({
							isTag: true,
							label: search
						});
					}
					return options.slice(0, this.optionsLimit);
				},
				valueKeys() {
					if (this.trackBy) return this.internalValue.map((element) => element[this.trackBy]);
					else return this.internalValue;
				},
				optionKeys() {
					return (this.groupValues ? this.flatAndStrip(this.options) : this.options).map((element) => this.customLabel(element, this.label).toString().toLowerCase());
				},
				currentOptionLabel() {
					return this.multiple ? this.searchable ? "" : this.placeholder : this.internalValue.length ? this.getOptionLabel(this.internalValue[0]) : this.searchable ? "" : this.placeholder;
				}
			},
			watch: {
				internalValue: {
					handler() {
						/* istanbul ignore else */
						if (this.resetAfter && this.internalValue.length) {
							this.search = "";
							this.$emit("update:modelValue", this.multiple ? [] : null);
						}
					},
					deep: true
				},
				search() {
					this.$emit("search-change", this.search);
				}
			},
			emits: [
				"open",
				"search-change",
				"close",
				"select",
				"update:modelValue",
				"remove",
				"tag"
			],
			methods: {
				/**
				* Returns the internalValue in a way it can be emited to the parent
				* @returns {Object||Array||String||Integer}
				*/
				getValue() {
					return this.multiple ? this.internalValue : this.internalValue.length === 0 ? null : this.internalValue[0];
				},
				/**
				* Filters and then flattens the options list
				* @param  {Array}
				* @return {Array} returns a filtered and flat options list
				*/
				filterAndFlat(options, search, label) {
					return flow(this.filterGroups(search, label, this.groupValues, this.groupLabel, this.customLabel), flattenOptions(this.groupValues, this.groupLabel))(options);
				},
				/**
				* Flattens and then strips the group labels from the options list
				* @param  {Array}
				* @return {Array} returns a flat options list without group labels
				*/
				flatAndStrip(options) {
					return flow(flattenOptions(this.groupValues, this.groupLabel), stripGroups)(options);
				},
				/**
				* Updates the search value
				* @param  {String}
				*/
				updateSearch(query) {
					this.search = query;
				},
				/**
				* Finds out if the given query is already present
				* in the available options
				* @param  {String}
				* @return {Boolean} returns true if element is available
				*/
				isExistingOption(query) {
					return !this.options ? false : this.optionKeys.indexOf(query) > -1;
				},
				/**
				* Finds out if the given element is already present
				* in the result value
				* @param  {Object||String||Integer} option passed element to check
				* @returns {Boolean} returns true if element is selected
				*/
				isSelected(option) {
					const opt = this.trackBy ? option[this.trackBy] : option;
					return this.valueKeys.indexOf(opt) > -1;
				},
				/**
				* Finds out if the given option is disabled
				* @param  {Object||String||Integer} option passed element to check
				* @returns {Boolean} returns true if element is disabled
				*/
				isOptionDisabled(option) {
					return !!option.$isDisabled;
				},
				/**
				* Returns empty string when options is null/undefined
				* Returns tag query if option is tag.
				* Returns the customLabel() results and casts it to string.
				*
				* @param  {Object||String||Integer} Passed option
				* @returns {Object||String}
				*/
				getOptionLabel(option) {
					if (isEmpty(option)) return "";
					/* istanbul ignore else */
					if (option.isTag) return option.label;
					/* istanbul ignore else */
					if (option.$isLabel) return option.$groupLabel;
					const label = this.customLabel(option, this.label);
					/* istanbul ignore else */
					if (isEmpty(label)) return "";
					return label;
				},
				/**
				* Add the given option to the list of selected options
				* or sets the option as the selected option.
				* If option is already selected -> remove it from the results.
				*
				* @param  {Object||String||Integer} option to select/deselect
				* @param  {Boolean} block removing
				*/
				select(option, key) {
					/* istanbul ignore else */
					if (option.$isLabel && this.groupSelect) {
						this.selectGroup(option);
						return;
					}
					if (this.blockKeys.indexOf(key) !== -1 || this.disabled || option.$isDisabled || option.$isLabel) return;
					/* istanbul ignore else */
					if (this.max && this.multiple && this.internalValue.length === this.max) return;
					/* istanbul ignore else */
					if (key === "Tab" && !this.pointerDirty) return;
					if (option.isTag) {
						this.$emit("tag", option.label, this.id);
						this.search = "";
						if (this.closeOnSelect && !this.multiple) this.deactivate();
					} else {
						if (this.isSelected(option)) {
							if (key !== "Tab") this.removeElement(option);
							return;
						}
						if (this.multiple) this.$emit("update:modelValue", this.internalValue.concat([option]));
						else this.$emit("update:modelValue", option);
						this.$emit("select", option, this.id);
						/* istanbul ignore else */
						if (this.clearOnSelect) this.search = "";
					}
					/* istanbul ignore else */
					if (this.closeOnSelect) this.deactivate();
				},
				/**
				* Add the given group options to the list of selected options
				* If all group optiona are already selected -> remove it from the results.
				*
				* @param  {Object||String||Integer} group to select/deselect
				*/
				selectGroup(selectedGroup) {
					const group = this.options.find((option) => {
						return option[this.groupLabel] === selectedGroup.$groupLabel;
					});
					if (!group) return;
					if (this.wholeGroupSelected(group)) {
						this.$emit("remove", group[this.groupValues], this.id);
						const groupValues = this.trackBy ? group[this.groupValues].map((val) => val[this.trackBy]) : group[this.groupValues];
						const newValue = this.internalValue.filter((option) => groupValues.indexOf(this.trackBy ? option[this.trackBy] : option) === -1);
						this.$emit("update:modelValue", newValue);
					} else {
						const optionsToAdd = group[this.groupValues].filter((option) => !(this.isOptionDisabled(option) || this.isSelected(option)));
						if (this.max) optionsToAdd.splice(this.max - this.internalValue.length);
						this.$emit("select", optionsToAdd, this.id);
						this.$emit("update:modelValue", this.internalValue.concat(optionsToAdd));
					}
					if (this.closeOnSelect) this.deactivate();
				},
				/**
				* Helper to identify if all values in a group are selected
				*
				* @param {Object} group to validated selected values against
				*/
				wholeGroupSelected(group) {
					return group[this.groupValues].every((option) => this.isSelected(option) || this.isOptionDisabled(option));
				},
				/**
				* Helper to identify if all values in a group are disabled
				*
				* @param {Object} group to check for disabled values
				*/
				wholeGroupDisabled(group) {
					return group[this.groupValues].every(this.isOptionDisabled);
				},
				/**
				* Removes the given option from the selected options.
				* Additionally checks this.allowEmpty prop if option can be removed when
				* it is the last selected option.
				*
				* @param  {type} option description
				* @return {type}        description
				*/
				removeElement(option, shouldClose = true) {
					/* istanbul ignore else */
					if (this.disabled) return;
					/* istanbul ignore else */
					if (option.$isDisabled) return;
					/* istanbul ignore else */
					if (!this.allowEmpty && this.internalValue.length <= 1) {
						this.deactivate();
						return;
					}
					const index = typeof option === "object" ? this.valueKeys.indexOf(option[this.trackBy]) : this.valueKeys.indexOf(option);
					if (this.multiple) {
						const newValue = this.internalValue.slice(0, index).concat(this.internalValue.slice(index + 1));
						this.$emit("update:modelValue", newValue);
					} else this.$emit("update:modelValue", null);
					this.$emit("remove", option, this.id);
					/* istanbul ignore else */
					if (this.closeOnSelect && shouldClose) this.deactivate();
				},
				/**
				* Calls this.removeElement() with the last element
				* from this.internalValue (selected element Array)
				*
				* @fires this#removeElement
				*/
				removeLastElement() {
					/* istanbul ignore else */
					if (this.blockKeys.indexOf("Delete") !== -1) return;
					/* istanbul ignore else */
					if (this.search.length === 0 && Array.isArray(this.internalValue) && this.internalValue.length) this.removeElement(this.internalValue[this.internalValue.length - 1], false);
				},
				/**
				* Opens the multiselect’s dropdown.
				* Sets this.isOpen to TRUE
				*/
				activate() {
					/* istanbul ignore else */
					if (this.isOpen || this.disabled) return;
					this.adjustPosition();
					/* istanbul ignore else  */
					if (this.groupValues && this.pointer === 0 && this.filteredOptions.length) this.pointer = 1;
					this.isOpen = true;
					/* istanbul ignore else  */
					if (this.searchable) {
						if (!this.preserveSearch) this.search = "";
						if (!this.preventAutofocus) this.$nextTick(() => this.$refs.search && this.$refs.search.focus());
					} else if (!this.preventAutofocus) {
						if (typeof this.$el !== "undefined") this.$el.focus();
					}
					this.$emit("open", this.id);
				},
				/**
				* Closes the multiselect’s dropdown.
				* Sets this.isOpen to FALSE
				*/
				deactivate() {
					/* istanbul ignore else */
					if (!this.isOpen) return;
					this.isOpen = false;
					/* istanbul ignore else  */
					if (this.searchable) {
						if (this.$refs.search !== null && typeof this.$refs.search !== "undefined") this.$refs.search.blur();
					} else if (typeof this.$el !== "undefined") this.$el.blur();
					if (!this.preserveSearch) this.search = "";
					this.$emit("close", this.getValue(), this.id);
				},
				/**
				* Call this.activate() or this.deactivate()
				* depending on this.isOpen value.
				*
				* @fires this#activate || this#deactivate
				* @property {Boolean} isOpen indicates if dropdown is open
				*/
				toggle() {
					this.isOpen ? this.deactivate() : this.activate();
				},
				/**
				* Updates the hasEnoughSpace variable used for
				* detecting where to expand the dropdown
				*/
				adjustPosition() {
					if (typeof window === "undefined") return;
					const spaceAbove = this.$el.getBoundingClientRect().top;
					const spaceBelow = window.innerHeight - this.$el.getBoundingClientRect().bottom;
					if (spaceBelow > this.maxHeight || spaceBelow > spaceAbove || this.openDirection === "below" || this.openDirection === "bottom") {
						this.preferredOpenDirection = "below";
						this.optimizedHeight = Math.min(spaceBelow - 40, this.maxHeight);
					} else {
						this.preferredOpenDirection = "above";
						this.optimizedHeight = Math.min(spaceAbove - 40, this.maxHeight);
					}
				},
				/**
				* Filters and sorts the options ready for selection
				* @param {Array} options
				* @param {String} search
				* @param {String} label
				* @param {Function} customLabel
				* @returns {Array}
				*/
				filterOptions(options, search, label, customLabel) {
					return search ? options.filter((option) => includes(customLabel(option, label), search)).sort((a, b) => {
						if (typeof this.filteringSortFunc === "function") return this.filteringSortFunc(a, b);
						return customLabel(a, label).length - customLabel(b, label).length;
					}) : options;
				},
				/**
				*
				* @param {String} search
				* @param {String} label
				* @param {String} values
				* @param {String} groupLabel
				* @param {function} customLabel
				* @returns {function(*): *}
				*/
				filterGroups(search, label, values, groupLabel, customLabel) {
					return (groups) => groups.map((group) => {
						/* istanbul ignore else */
						if (!group[values]) {
							console.warn("Options passed to vue-multiselect do not contain groups, despite the config.");
							return [];
						}
						const groupOptions = this.filterOptions(group[values], search, label, customLabel);
						return groupOptions.length ? {
							[groupLabel]: group[groupLabel],
							[values]: groupOptions
						} : [];
					});
				}
			}
		}, {
			data() {
				return {
					pointer: 0,
					pointerDirty: false
				};
			},
			props: {
				/**
				* Enable/disable highlighting of the pointed value.
				* @type {Boolean}
				* @default true
				*/
				showPointer: {
					type: Boolean,
					default: true
				},
				optionHeight: {
					type: Number,
					default: 40
				}
			},
			computed: {
				pointerPosition() {
					return this.pointer * this.optionHeight;
				},
				visibleElements() {
					return this.optimizedHeight / this.optionHeight;
				}
			},
			watch: {
				filteredOptions() {
					this.pointerAdjust();
				},
				isOpen() {
					this.pointerDirty = false;
				},
				pointer() {
					this.$refs.search && this.$refs.search.setAttribute("aria-activedescendant", this.id + "-" + this.pointer.toString());
				}
			},
			methods: {
				optionHighlight(index, option) {
					return {
						"multiselect__option--highlight": index === this.pointer && this.showPointer,
						"multiselect__option--selected": this.isSelected(option)
					};
				},
				groupHighlight(index, selectedGroup) {
					if (!this.groupSelect) return ["multiselect__option--disabled", { "multiselect__option--group": selectedGroup.$isLabel }];
					const group = this.options.find((option) => {
						return option[this.groupLabel] === selectedGroup.$groupLabel;
					});
					return group && !this.wholeGroupDisabled(group) ? [
						"multiselect__option--group",
						{ "multiselect__option--highlight": index === this.pointer && this.showPointer },
						{ "multiselect__option--group-selected": this.wholeGroupSelected(group) }
					] : "multiselect__option--disabled";
				},
				addPointerElement({ key } = "Enter") {
					/* istanbul ignore else */
					if (this.filteredOptions.length > 0) this.select(this.filteredOptions[this.pointer], key);
					this.pointerReset();
				},
				pointerForward() {
					/* istanbul ignore else */
					if (this.pointer < this.filteredOptions.length - 1) {
						var _this$$refs$list;
						this.pointer++;
						/* istanbul ignore next */
						if (((_this$$refs$list = this.$refs.list) === null || _this$$refs$list === void 0 ? void 0 : _this$$refs$list.scrollTop) <= this.pointerPosition - (this.visibleElements - 1) * this.optionHeight) this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.optionHeight;
						/* istanbul ignore else */
						if (this.filteredOptions[this.pointer] && this.filteredOptions[this.pointer].$isLabel && !this.groupSelect) this.pointerForward();
					}
					this.pointerDirty = true;
				},
				pointerBackward() {
					if (this.pointer > 0) {
						var _this$$refs$list2;
						this.pointer--;
						/* istanbul ignore else */
						if (((_this$$refs$list2 = this.$refs.list) === null || _this$$refs$list2 === void 0 ? void 0 : _this$$refs$list2.scrollTop) >= this.pointerPosition) this.$refs.list.scrollTop = this.pointerPosition;
						/* istanbul ignore else */
						if (this.filteredOptions[this.pointer] && this.filteredOptions[this.pointer].$isLabel && !this.groupSelect) this.pointerBackward();
					} else if (this.filteredOptions[this.pointer] && this.filteredOptions[0].$isLabel && !this.groupSelect) this.pointerForward();
					this.pointerDirty = true;
				},
				pointerReset() {
					/* istanbul ignore else */
					if (!this.closeOnSelect) return;
					this.pointer = 0;
					/* istanbul ignore else */
					if (this.$refs.list) this.$refs.list.scrollTop = 0;
				},
				pointerAdjust() {
					/* istanbul ignore else */
					if (this.pointer >= this.filteredOptions.length - 1) this.pointer = this.filteredOptions.length ? this.filteredOptions.length - 1 : 0;
					if (this.filteredOptions.length > 0 && this.filteredOptions[this.pointer] && this.filteredOptions[this.pointer].$isLabel && !this.groupSelect) this.pointerForward();
				},
				pointerSet(index) {
					this.pointer = index;
					this.pointerDirty = true;
				}
			}
		}],
		compatConfig: {
			MODE: 3,
			ATTR_ENUMERATED_COERCION: false
		},
		props: {
			/**
			* name attribute to match optional label element
			* @default ''
			* @type {String}
			*/
			name: {
				type: String,
				default: ""
			},
			/**
			* Presets the selected options value.
			* @type {Object||Array||String||Integer}
			*/
			modelValue: {
				type: null,
				default() {
					return [];
				}
			},
			/**
			* String to show when pointing to an option
			* @default 'Press enter to select'
			* @type {String}
			*/
			selectLabel: {
				type: String,
				default: "Press enter to select"
			},
			/**
			* String to show when pointing to an option
			* @default 'Press enter to select'
			* @type {String}
			*/
			selectGroupLabel: {
				type: String,
				default: "Press enter to select group"
			},
			/**
			* String to show next to selected option
			* @default 'Selected'
			* @type {String}
			*/
			selectedLabel: {
				type: String,
				default: "Selected"
			},
			/**
			* String to show when pointing to an already selected option
			* @default 'Press enter to remove'
			* @type {String}
			*/
			deselectLabel: {
				type: String,
				default: "Press enter to remove"
			},
			/**
			* String to show when pointing to an already selected option
			* @default 'Press enter to remove'
			* @type {String}
			*/
			deselectGroupLabel: {
				type: String,
				default: "Press enter to deselect group"
			},
			/**
			* Decide whether to show pointer labels
			* @default true
			* @type {Boolean}
			*/
			showLabels: {
				type: Boolean,
				default: true
			},
			/**
			* Limit the display of selected options. The rest will be hidden within the limitText string.
			* @default 99999
			* @type {Integer}
			*/
			limit: {
				type: Number,
				default: 99999
			},
			/**
			* Sets maxHeight style value of the dropdown
			* @default 300
			* @type {Integer}
			*/
			maxHeight: {
				type: Number,
				default: 300
			},
			/**
			* Function that process the message shown when selected
			* elements pass the defined limit.
			* @default 'and * more'
			* @param {Int} count Number of elements more than limit
			* @type {Function}
			*/
			limitText: {
				type: Function,
				default: (count) => `and ${count} more`
			},
			/**
			* Set true to trigger the loading spinner.
			* @default False
			* @type {Boolean}
			*/
			loading: {
				type: Boolean,
				default: false
			},
			/**
			* Disables the multiselect if true.
			* @default false
			* @type {Boolean}
			*/
			disabled: {
				type: Boolean,
				default: false
			},
			/**
			* Enables search input's spellcheck if true.
			* @default false
			* @type {Boolean}
			*/
			spellcheck: {
				type: Boolean,
				default: false
			},
			/**
			* Fixed opening direction
			* @default ''
			* @type {String}
			*/
			openDirection: {
				type: String,
				default: ""
			},
			/**
			* Shows slot with message about empty options
			* @default true
			* @type {Boolean}
			*/
			showNoOptions: {
				type: Boolean,
				default: true
			},
			showNoResults: {
				type: Boolean,
				default: true
			},
			tabindex: {
				type: Number,
				default: 0
			},
			/**
			* Adds Required attribute to the input element when there is no value selected
			* @default false
			* @type {Boolean}
			*/
			required: {
				type: Boolean,
				default: false
			},
			/**
			* Uses Vue Teleport's feature. Teleports the open dropdown to the bottom of the teleportTarget element
			* @default false
			* @type {Boolean}
			*/
			useTeleport: {
				type: Boolean,
				default: false
			},
			/**
			* Target selector for teleporting the dropdown element
			* @default 'body'
			* @type {String|Object}
			*/
			teleportTarget: {
				type: [String, Object],
				default: "body"
			},
			/**
			* Classes to apply to the `multiselect__content-wrapper` element. This element is a teleport element (when enabled), so can be used to specifically target
			* the teleported element
			*/
			contentWrapperClass: {
				type: [
					String,
					Array,
					Object
				],
				default: ""
			}
		},
		data() {
			return {
				dropdownStyles: {},
				ready: false
			};
		},
		computed: {
			hasOptionGroup() {
				return this.groupValues && this.groupLabel && this.groupSelect;
			},
			isSingleLabelVisible() {
				return (this.singleValue || this.singleValue === 0) && (!this.isOpen || !this.searchable) && !this.visibleValues.length;
			},
			isPlaceholderVisible() {
				return !this.internalValue.length && (!this.searchable || !this.isOpen);
			},
			visibleValues() {
				return this.multiple ? this.internalValue.slice(0, this.limit) : [];
			},
			singleValue() {
				return this.internalValue[0];
			},
			deselectLabelText() {
				return this.showLabels ? this.deselectLabel : "";
			},
			deselectGroupLabelText() {
				return this.showLabels ? this.deselectGroupLabel : "";
			},
			selectLabelText() {
				return this.showLabels ? this.selectLabel : "";
			},
			selectGroupLabelText() {
				return this.showLabels ? this.selectGroupLabel : "";
			},
			selectedLabelText() {
				return this.showLabels ? this.selectedLabel : "";
			},
			inputStyle() {
				if (this.searchable || this.multiple && this.modelValue && this.modelValue.length) return this.isOpen ? { width: "100%" } : {
					width: "0",
					position: "absolute",
					padding: "0"
				};
				return "";
			},
			contentStyle() {
				return this.options.length ? { display: "inline-block" } : { display: "block" };
			},
			isAbove() {
				if (this.openDirection === "above" || this.openDirection === "top") return true;
				else if (this.openDirection === "below" || this.openDirection === "bottom") return false;
				else return this.preferredOpenDirection === "above";
			},
			showSearchInput() {
				return this.searchable && (this.hasSingleSelectedSlot && (this.visibleSingleValue || this.visibleSingleValue === 0) ? this.isOpen : true);
			},
			isRequired() {
				if (this.required === false) return false;
				return this.internalValue.length <= 0;
			}
		},
		watch: { isOpen(val) {
			if (val) {
				if (this.useTeleport) {
					this.ready = false;
					this.$nextTick(() => {
						const rect = this.$el.getBoundingClientRect();
						this.dropdownStyles = {
							position: "absolute",
							top: `${rect.bottom + window.scrollY}px`,
							left: `${rect.left + window.scrollX}px`,
							width: `${rect.width}px`,
							zIndex: 9999
						};
						this.ready = true;
					});
				} else this.ready = true;
			}
		} }
	};
	var _hoisted_1$2 = [
		"tabindex",
		"aria-expanded",
		"aria-owns",
		"aria-activedescendant"
	];
	var _hoisted_2$1 = {
		ref: "tags",
		class: "multiselect__tags"
	};
	var _hoisted_3$1 = { class: "multiselect__tags-wrap" };
	var _hoisted_4$1 = ["textContent"];
	var _hoisted_5$1 = ["onKeydown", "onMousedown"];
	var _hoisted_6 = ["textContent"];
	var _hoisted_7 = { class: "multiselect__spinner" };
	var _hoisted_8 = [
		"name",
		"id",
		"spellcheck",
		"placeholder",
		"required",
		"value",
		"disabled",
		"tabindex",
		"aria-label",
		"aria-controls"
	];
	var _hoisted_9 = ["id", "aria-multiselectable"];
	var _hoisted_10 = { key: 0 };
	var _hoisted_11 = { class: "multiselect__option" };
	var _hoisted_12 = [
		"aria-selected",
		"id",
		"role"
	];
	var _hoisted_13 = [
		"onClick",
		"onMouseenter",
		"data-select",
		"data-selected",
		"data-deselect"
	];
	var _hoisted_14 = [
		"data-select",
		"data-deselect",
		"onMouseenter",
		"onMousedown"
	];
	var _hoisted_15 = { class: "multiselect__option" };
	var _hoisted_16 = { class: "multiselect__option" };
	function render(_ctx, _cache, $props, $setup, $data, $options) {
		return openBlock(), createElementBlock("div", {
			tabindex: _ctx.searchable ? -1 : $props.tabindex,
			class: normalizeClass([{
				"multiselect--active": _ctx.isOpen,
				"multiselect--disabled": $props.disabled,
				"multiselect--above": $options.isAbove,
				"multiselect--has-options-group": $options.hasOptionGroup
			}, "multiselect"]),
			onFocus: _cache[14] || (_cache[14] = ($event) => _ctx.activate()),
			onBlur: _cache[15] || (_cache[15] = ($event) => _ctx.searchable ? false : _ctx.deactivate()),
			onKeydown: [
				_cache[16] || (_cache[16] = withKeys(withModifiers(($event) => _ctx.pointerForward(), ["self", "prevent"]), ["down"])),
				_cache[17] || (_cache[17] = withKeys(withModifiers(($event) => _ctx.pointerBackward(), ["self", "prevent"]), ["up"])),
				_cache[18] || (_cache[18] = withKeys(withModifiers(($event) => _ctx.addPointerElement($event), ["stop", "self"]), ["enter", "tab"]))
			],
			onKeyup: _cache[19] || (_cache[19] = withKeys(($event) => _ctx.deactivate(), ["esc"])),
			role: "combobox",
			"aria-expanded": _ctx.isOpen,
			"aria-owns": "listbox-" + _ctx.id,
			"aria-activedescendant": _ctx.isOpen && _ctx.pointer !== null ? _ctx.id + "-" + _ctx.pointer : null
		}, [
			renderSlot(_ctx.$slots, "caret", { toggle: _ctx.toggle }, () => [createBaseVNode("div", {
				onMousedown: _cache[0] || (_cache[0] = withModifiers(($event) => _ctx.toggle(), ["prevent", "stop"])),
				class: "multiselect__select"
			}, null, 32)]),
			renderSlot(_ctx.$slots, "clear", { search: _ctx.search }),
			createBaseVNode("div", _hoisted_2$1, [
				renderSlot(_ctx.$slots, "selection", {
					search: _ctx.search,
					remove: _ctx.removeElement,
					values: $options.visibleValues,
					isOpen: _ctx.isOpen
				}, () => [withDirectives(createBaseVNode("div", _hoisted_3$1, [(openBlock(true), createElementBlock(Fragment, null, renderList($options.visibleValues, (option, index) => {
					return renderSlot(_ctx.$slots, "tag", {
						option,
						search: _ctx.search,
						remove: _ctx.removeElement
					}, () => [(openBlock(), createElementBlock("span", {
						class: "multiselect__tag",
						key: index,
						onMousedown: _cache[1] || (_cache[1] = withModifiers(() => {}, ["prevent"]))
					}, [createBaseVNode("span", { textContent: toDisplayString(_ctx.getOptionLabel(option)) }, null, 8, _hoisted_4$1), createBaseVNode("i", {
						tabindex: "1",
						onKeydown: withKeys(withModifiers(($event) => _ctx.removeElement(option), ["prevent"]), ["enter"]),
						onMousedown: withModifiers(($event) => _ctx.removeElement(option), ["prevent"]),
						class: "multiselect__tag-icon"
					}, null, 40, _hoisted_5$1)], 32))]);
				}), 256))], 512), [[vShow, $options.visibleValues.length > 0]]), _ctx.internalValue && _ctx.internalValue.length > $props.limit ? renderSlot(_ctx.$slots, "limit", { key: 0 }, () => [createBaseVNode("strong", {
					class: "multiselect__strong",
					textContent: toDisplayString($props.limitText(_ctx.internalValue.length - $props.limit))
				}, null, 8, _hoisted_6)]) : createCommentVNode("v-if", true)]),
				createVNode(Transition, { name: "multiselect__loading" }, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "loading", {}, () => [withDirectives(createBaseVNode("div", _hoisted_7, null, 512), [[vShow, $props.loading]])])]),
					_: 3
				}),
				_ctx.searchable ? (openBlock(), createElementBlock("input", {
					key: 0,
					ref: "search",
					name: $props.name,
					id: _ctx.id,
					type: "text",
					autocomplete: "off",
					spellcheck: $props.spellcheck,
					placeholder: _ctx.placeholder,
					required: $options.isRequired,
					style: normalizeStyle($options.inputStyle),
					value: _ctx.search,
					disabled: $props.disabled,
					tabindex: $props.tabindex,
					"aria-label": $props.name + "-searchbox",
					onInput: _cache[2] || (_cache[2] = ($event) => _ctx.updateSearch($event.target.value)),
					onFocus: _cache[3] || (_cache[3] = withModifiers(($event) => _ctx.activate(), ["prevent"])),
					onBlur: _cache[4] || (_cache[4] = withModifiers(($event) => _ctx.deactivate(), ["prevent"])),
					onKeyup: _cache[5] || (_cache[5] = withKeys(($event) => _ctx.deactivate(), ["esc"])),
					onKeydown: [
						_cache[6] || (_cache[6] = withKeys(withModifiers(($event) => _ctx.pointerForward(), ["prevent"]), ["down"])),
						_cache[7] || (_cache[7] = withKeys(withModifiers(($event) => _ctx.pointerBackward(), ["prevent"]), ["up"])),
						_cache[8] || (_cache[8] = withKeys(withModifiers(($event) => _ctx.addPointerElement($event), [
							"prevent",
							"stop",
							"self"
						]), ["enter"])),
						_cache[9] || (_cache[9] = withKeys(withModifiers(($event) => _ctx.removeLastElement(), ["stop"]), ["delete"]))
					],
					class: "multiselect__input",
					"aria-controls": "listbox-" + _ctx.id
				}, null, 44, _hoisted_8)) : createCommentVNode("v-if", true),
				$options.isSingleLabelVisible ? (openBlock(), createElementBlock("span", {
					key: 1,
					class: "multiselect__single",
					onMousedown: _cache[10] || (_cache[10] = withModifiers((...args) => _ctx.toggle && _ctx.toggle(...args), ["prevent"]))
				}, [renderSlot(_ctx.$slots, "singleLabel", { option: $options.singleValue }, () => [createTextVNode(toDisplayString(_ctx.currentOptionLabel), 1)])], 32)) : createCommentVNode("v-if", true),
				$options.isPlaceholderVisible ? (openBlock(), createElementBlock("span", {
					key: 2,
					class: "multiselect__placeholder",
					onMousedown: _cache[11] || (_cache[11] = withModifiers((...args) => _ctx.toggle && _ctx.toggle(...args), ["prevent"]))
				}, [renderSlot(_ctx.$slots, "placeholder", {}, () => [createTextVNode(toDisplayString(_ctx.placeholder), 1)])], 32)) : createCommentVNode("v-if", true)
			], 512),
			(openBlock(), createBlock(Teleport, {
				to: $props.teleportTarget,
				disabled: !$props.useTeleport
			}, [createVNode(Transition, { name: "multiselect" }, {
				default: withCtx(() => [_ctx.isOpen && $data.ready ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: normalizeClass(["multiselect__content-wrapper", $props.contentWrapperClass]),
					onFocus: _cache[12] || (_cache[12] = (...args) => _ctx.activate && _ctx.activate(...args)),
					tabindex: "-1",
					onMousedown: _cache[13] || (_cache[13] = withModifiers(() => {}, ["prevent"])),
					style: normalizeStyle([$data.dropdownStyles, { maxHeight: _ctx.optimizedHeight + "px" }]),
					ref: "list"
				}, [createBaseVNode("ul", {
					class: "multiselect__content",
					style: normalizeStyle($options.contentStyle),
					role: "listbox",
					id: "listbox-" + _ctx.id,
					"aria-multiselectable": _ctx.multiple
				}, [
					renderSlot(_ctx.$slots, "beforeList"),
					_ctx.multiple && _ctx.max === _ctx.internalValue.length ? (openBlock(), createElementBlock("li", _hoisted_10, [createBaseVNode("span", _hoisted_11, [renderSlot(_ctx.$slots, "maxElements", {}, () => [createTextVNode("Maximum of " + toDisplayString(_ctx.max) + " options selected. First remove a selected option to select another.", 1)])])])) : createCommentVNode("v-if", true),
					!_ctx.max || _ctx.internalValue.length < _ctx.max ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(_ctx.filteredOptions, (option, index) => {
						return openBlock(), createElementBlock("li", {
							class: "multiselect__element",
							key: index,
							"aria-selected": _ctx.isSelected(option),
							id: _ctx.id + "-" + index,
							role: !(option && (option.$isLabel || option.$isDisabled)) ? "option" : null
						}, [!(option && (option.$isLabel || option.$isDisabled)) ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: normalizeClass([_ctx.optionHighlight(index, option), "multiselect__option"]),
							onClick: withModifiers(($event) => _ctx.select(option), ["stop"]),
							onMouseenter: withModifiers(($event) => _ctx.pointerSet(index), ["self"]),
							"data-select": option && option.isTag ? _ctx.tagPlaceholder : $options.selectLabelText,
							"data-selected": $options.selectedLabelText,
							"data-deselect": $options.deselectLabelText
						}, [renderSlot(_ctx.$slots, "option", {
							option,
							search: _ctx.search,
							index
						}, () => [createBaseVNode("span", null, toDisplayString(_ctx.getOptionLabel(option)), 1)])], 42, _hoisted_13)) : createCommentVNode("v-if", true), option && (option.$isLabel || option.$isDisabled) ? (openBlock(), createElementBlock("span", {
							key: 1,
							"data-select": _ctx.groupSelect && $options.selectGroupLabelText,
							"data-deselect": _ctx.groupSelect && $options.deselectGroupLabelText,
							class: normalizeClass([_ctx.groupHighlight(index, option), "multiselect__option"]),
							onMouseenter: withModifiers(($event) => _ctx.groupSelect && _ctx.pointerSet(index), ["self"]),
							onMousedown: withModifiers(($event) => _ctx.selectGroup(option), ["prevent"])
						}, [renderSlot(_ctx.$slots, "option", {
							option,
							search: _ctx.search,
							index
						}, () => [createBaseVNode("span", null, toDisplayString(_ctx.getOptionLabel(option)), 1)])], 42, _hoisted_14)) : createCommentVNode("v-if", true)], 8, _hoisted_12);
					}), 128)) : createCommentVNode("v-if", true),
					withDirectives(createBaseVNode("li", null, [createBaseVNode("span", _hoisted_15, [renderSlot(_ctx.$slots, "noResult", { search: _ctx.search }, () => [_cache[20] || (_cache[20] = createTextVNode("No elements found. Consider changing the search query."))])])], 512), [[vShow, $props.showNoResults && _ctx.filteredOptions.length === 0 && _ctx.search && !$props.loading]]),
					withDirectives(createBaseVNode("li", null, [createBaseVNode("span", _hoisted_16, [renderSlot(_ctx.$slots, "noOptions", {}, () => [_cache[21] || (_cache[21] = createTextVNode("List is empty."))])])], 512), [[vShow, $props.showNoOptions && _ctx.filteredOptions.length === 0 && !_ctx.search && !$props.loading]]),
					renderSlot(_ctx.$slots, "afterList")
				], 12, _hoisted_9)], 38)) : createCommentVNode("v-if", true)]),
				_: 3
			})], 8, ["to", "disabled"]))
		], 42, _hoisted_1$2);
	}
	script.render = render;
	//#endregion
	//#region resources/js/shared/legacy/admin/form/select-values.js
	function copySelectOptions(options) {
		return Array.isArray(options) ? options.map((option) => ({ ...option })) : [];
	}
	function initialSelectValue(options, value, multiple) {
		return multiple ? selectedOptions$1(options, value) : findSelectOption(options, value);
	}
	function findSelectOption(options, value) {
		var _ref, _options$find;
		return (_ref = (_options$find = options.find((option) => option.id === value)) !== null && _options$find !== void 0 ? _options$find : options.find((option) => sameSelectId(option.id, value))) !== null && _ref !== void 0 ? _ref : null;
	}
	function selectedOptionIds(selection, multiple) {
		if (multiple) return Array.isArray(selection) ? selection.map(({ id }) => id) : [];
		return selection === null ? [] : [selection.id];
	}
	function isSelectOptionSelected(selection, id, multiple) {
		return selectedOptionIds(selection, multiple).some((value) => sameSelectId(value, id));
	}
	function appendSelectTag(options, selection, value, multiple = true) {
		const current = findSelectOption(options, value);
		const option = current !== null && current !== void 0 ? current : {
			id: value,
			text: value
		};
		return {
			options: current ? options : [...options, option],
			selection: appendTagSelection(selection, option, multiple)
		};
	}
	function selectFormValue(value) {
		return value === null || value === void 0 ? "" : String(value);
	}
	function selectOptionKey(option, index) {
		return `${typeof option.id}:${selectFormValue(option.id)}:${index}`;
	}
	function selectedOptions$1(options, value) {
		const values = Array.isArray(value) ? value : value === null ? [] : [value];
		return options.filter((option) => values.some((item) => sameSelectId(option.id, item)));
	}
	function sameSelectId(left, right) {
		if (left === right) return true;
		if (left === null || left === void 0 || right === null || right === void 0) return false;
		return String(left) === String(right);
	}
	function appendTagSelection(selection, option, multiple) {
		if (!multiple) return option;
		return isSelectOptionSelected(selection, option.id, true) ? selection : [...selection, option];
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/select-dependencies.js
	function readSelectDependencies(ids, document = globalThis.document) {
		assertDocument(document);
		return normalizeIds(ids).map((id) => ({
			id,
			value: readControlValue(document, id)
		}));
	}
	function appendSelectDependencies(parameters, dependencies) {
		if (!dependencies.length) return parameters;
		parameters.set("depends", JSON.stringify(dependencies.map(({ id }) => id)));
		dependencies.forEach(({ id, value }, index) => {
			appendValue$1(parameters, `depdrop_parents[${index}]`, value);
			appendValue$1(parameters, `depdrop_all_params[${id}]`, value);
		});
		return parameters;
	}
	function readControlValue(document, id) {
		var _control$value;
		const control = document.getElementById(id);
		if (!control) return "";
		if (control.type === "radio") return checkedRadioValue(document, control);
		if (control.type === "checkbox") return control.checked;
		if (control.multiple) return [...control.selectedOptions].map(({ value }) => value);
		return (_control$value = control.value) !== null && _control$value !== void 0 ? _control$value : "";
	}
	function checkedRadioValue(document, control) {
		var _checked$value;
		const checked = [...document.querySelectorAll("input[type=\"radio\"]")].find((candidate) => candidate.name === control.name && candidate.checked);
		return (_checked$value = checked === null || checked === void 0 ? void 0 : checked.value) !== null && _checked$value !== void 0 ? _checked$value : "";
	}
	function appendValue$1(parameters, name, value) {
		if (Array.isArray(value)) {
			value.forEach((item) => parameters.append(`${name}[]`, String(item)));
			return;
		}
		parameters.append(name, String(value !== null && value !== void 0 ? value : ""));
	}
	function normalizeIds(ids) {
		return Array.isArray(ids) ? ids.filter((id) => typeof id === "string" && id.length > 0) : [];
	}
	function assertDocument(document) {
		if (typeof (document === null || document === void 0 ? void 0 : document.getElementById) !== "function") throw new TypeError("Select dependencies require a document.");
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/select-dependent-options.js
	function dependentSelectParameters(dependencyIds, document) {
		const parameters = new globalThis.URLSearchParams();
		readSelectDependencies(dependencyIds, document).forEach((dependency, index) => {
			appendValue(parameters, `depdrop_parents[${index}]`, dependency.value);
			appendValue(parameters, `depdrop_all_params[${dependency.id}]`, dependency.value);
		});
		return parameters;
	}
	function normalizeDependentSelectResponse(payload) {
		var _payload$selected;
		if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new TypeError("Dependent select response must be an object.");
		return {
			hasSelected: Object.hasOwn(payload, "selected"),
			options: normalizeOutput(payload.output),
			selected: (_payload$selected = payload.selected) !== null && _payload$selected !== void 0 ? _payload$selected : null
		};
	}
	function dependentSelectValue(options, response, fallback, multiple) {
		return initialSelectValue(options, response.hasSelected ? response.selected : fallback, multiple);
	}
	function normalizeOutput(output) {
		if (output === null || output === void 0) return [];
		return (Array.isArray(output) ? output : objectValues(output)).map(normalizeOption);
	}
	function normalizeOption(item) {
		var _ref, _item$name;
		if (!item || typeof item !== "object" || !Object.hasOwn(item, "id")) throw new TypeError("Dependent select option must contain an id.");
		return {
			id: item.id,
			text: String((_ref = (_item$name = item.name) !== null && _item$name !== void 0 ? _item$name : item.text) !== null && _ref !== void 0 ? _ref : "")
		};
	}
	function objectValues(value) {
		if (value && typeof value === "object") return Object.values(value);
		throw new TypeError("Dependent select output must be an array or object.");
	}
	function appendValue(parameters, name, value) {
		if (Array.isArray(value)) {
			value.forEach((item) => parameters.append(`${name}[]`, String(item)));
			return;
		}
		parameters.append(name, String(value !== null && value !== void 0 ? value : ""));
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/select-dependent-load.js
	function createDependentSelectLoad(input) {
		const settings = normalizeSettings$1(input);
		const state = createLoadState();
		const load = (dependencyId = null) => loadOptions$1(dependencyId, state, settings);
		state.removeListeners = bindDependencies(settings, load);
		settings.onInit();
		if (settings.initialize) load();
		return {
			destroy: () => destroyLoad(state, settings),
			load
		};
	}
	async function loadOptions$1(dependencyId, state, settings) {
		cancelRequest(state);
		const requestId = ++state.requestId;
		const context = dependencyContext(dependencyId, settings);
		state.controller = new globalThis.AbortController();
		settings.onBefore(context);
		settings.onLoading(true);
		try {
			const body = dependentSelectParameters(settings.dependencies, settings.document);
			const result = normalizeDependentSelectResponse(await (await settings.http.post(settings.url, body, { signal: state.controller.signal })).json());
			if (isCurrent(requestId, state)) await settings.onResults(result, context);
		} catch (error) {
			handleLoadError(error, requestId, state, settings, context);
		} finally {
			finishLoad(requestId, state, settings, context);
		}
	}
	function bindDependencies(settings, load) {
		const listeners = settings.dependencies.flatMap((id) => {
			const control = settings.document.getElementById(id);
			if (!control) return [];
			const listener = () => load(id);
			control.addEventListener("change", listener);
			return [[control, listener]];
		});
		return () => listeners.forEach(([control, listener]) => control.removeEventListener("change", listener));
	}
	function dependencyContext(id, settings) {
		var _dependency$value;
		const dependency = id ? readSelectDependencies([id], settings.document)[0] : null;
		return {
			dependencyId: id,
			dependencyValue: (_dependency$value = dependency === null || dependency === void 0 ? void 0 : dependency.value) !== null && _dependency$value !== void 0 ? _dependency$value : null
		};
	}
	function handleLoadError(error, requestId, state, settings, context) {
		if (isCurrent(requestId, state) && (error === null || error === void 0 ? void 0 : error.name) !== "AbortError") settings.onError(error, context);
	}
	function finishLoad(requestId, state, settings, context) {
		if (!isCurrent(requestId, state)) return;
		state.controller = null;
		settings.onLoading(false);
		settings.onAfter(context);
	}
	function destroyLoad(state, settings) {
		state.destroyed = true;
		state.requestId += 1;
		state.removeListeners();
		cancelRequest(state);
		settings.onLoading(false);
	}
	function cancelRequest(state) {
		var _state$controller;
		(_state$controller = state.controller) === null || _state$controller === void 0 || _state$controller.abort();
		state.controller = null;
	}
	function isCurrent(requestId, state) {
		return !state.destroyed && requestId === state.requestId;
	}
	function createLoadState() {
		return {
			controller: null,
			destroyed: false,
			removeListeners: () => {},
			requestId: 0
		};
	}
	function normalizeSettings$1(input) {
		var _input$http, _input$document;
		if (!input || typeof input !== "object" || typeof ((_input$http = input.http) === null || _input$http === void 0 ? void 0 : _input$http.post) !== "function") throw new TypeError("Dependent select requires an HTTP client.");
		if (typeof input.url !== "string" || input.url.length === 0) throw new TypeError("Dependent select requires a URL.");
		return {
			dependencies: Array.isArray(input.dependencies) ? input.dependencies : [],
			document: (_input$document = input.document) !== null && _input$document !== void 0 ? _input$document : globalThis.document,
			http: input.http,
			initialize: input.initialize !== false,
			onAfter: callback$1(input.onAfter),
			onBefore: callback$1(input.onBefore),
			onError: callback$1(input.onError),
			onInit: callback$1(input.onInit),
			onLoading: callback$1(input.onLoading),
			onResults: callback$1(input.onResults),
			url: input.url
		};
	}
	function callback$1(value) {
		return typeof value === "function" ? value : () => {};
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/select-remote-options.js
	function normalizeRemoteSelectOptions(items) {
		if (!Array.isArray(items)) throw new TypeError("Remote select response must be an array.");
		return items.map((item) => ({
			id: item.id,
			text: optionText(item)
		}));
	}
	function mergeRemoteSelectOptions(selection, items, multiple) {
		const selected = selectedOptions(selection, multiple);
		return items.reduce((options, item) => {
			if (!findSelectOption(options, item.id)) options.push(item);
			return options;
		}, [...selected]);
	}
	function optionText(item) {
		const value = item.custom_name || item.tag_name || item.text || "";
		return String(value);
	}
	function selectedOptions(selection, multiple) {
		if (multiple) return Array.isArray(selection) ? selection : [];
		return selection ? [selection] : [];
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/select-remote-search.js
	function createRemoteSelectSearch(input) {
		const settings = normalizeSettings(input);
		const state = createSearchState();
		return {
			destroy: () => destroySearch(state, settings),
			search: (query) => scheduleSearch(query, state, settings)
		};
	}
	function remoteSelectParameters(query, dependencyIds, document) {
		return appendSelectDependencies(new globalThis.URLSearchParams({
			page: "1",
			q: query
		}), readSelectDependencies(dependencyIds, document));
	}
	function scheduleSearch(input, state, settings) {
		const query = String(input !== null && input !== void 0 ? input : "").trim();
		cancelPending(state);
		state.requestId += 1;
		if (state.destroyed || query.length < settings.minSymbols) {
			settings.onLoading(false);
			return false;
		}
		settings.onLoading(true);
		const requestId = state.requestId;
		state.timer = globalThis.setTimeout(() => loadOptions(query, requestId, state, settings), settings.delay);
		return true;
	}
	async function loadOptions(query, requestId, state, settings) {
		state.timer = null;
		state.controller = new globalThis.AbortController();
		try {
			const body = remoteSelectParameters(query, settings.dependencies, settings.document);
			const items = normalizeRemoteSelectOptions(await (await settings.http.post(settings.url, body, { signal: state.controller.signal })).json());
			if (isCurrentRequest(requestId, state)) settings.onResults(items);
		} catch (error) {
			if (isCurrentRequest(requestId, state) && (error === null || error === void 0 ? void 0 : error.name) !== "AbortError") settings.onError(error);
		} finally {
			if (isCurrentRequest(requestId, state)) finishRequest(state, settings);
		}
	}
	function finishRequest(state, settings) {
		state.controller = null;
		settings.onLoading(false);
	}
	function destroySearch(state, settings) {
		state.destroyed = true;
		state.requestId += 1;
		cancelPending(state);
		settings.onLoading(false);
	}
	function cancelPending(state) {
		var _state$controller;
		if (state.timer !== null) globalThis.clearTimeout(state.timer);
		(_state$controller = state.controller) === null || _state$controller === void 0 || _state$controller.abort();
		state.timer = null;
		state.controller = null;
	}
	function isCurrentRequest(requestId, state) {
		return !state.destroyed && requestId === state.requestId;
	}
	function createSearchState() {
		return {
			controller: null,
			destroyed: false,
			requestId: 0,
			timer: null
		};
	}
	function normalizeSettings(input) {
		var _input$http, _input$document;
		if (!input || typeof input !== "object" || typeof ((_input$http = input.http) === null || _input$http === void 0 ? void 0 : _input$http.post) !== "function") throw new TypeError("Remote select search requires an HTTP client.");
		if (typeof input.url !== "string" || input.url.length === 0) throw new TypeError("Remote select search requires a URL.");
		return {
			delay: positiveNumber(input.delay, 250),
			dependencies: Array.isArray(input.dependencies) ? input.dependencies : [],
			document: (_input$document = input.document) !== null && _input$document !== void 0 ? _input$document : globalThis.document,
			http: input.http,
			minSymbols: nonNegativeNumber(input.minSymbols, 3),
			onError: callback(input.onError),
			onLoading: callback(input.onLoading),
			onResults: callback(input.onResults),
			url: input.url
		};
	}
	function positiveNumber(value, fallback) {
		const number = Number(value);
		return Number.isFinite(number) && number > 0 ? number : fallback;
	}
	function nonNegativeNumber(value, fallback) {
		const number = Number(value);
		return Number.isFinite(number) && number >= 0 ? number : fallback;
	}
	function callback(value) {
		return typeof value === "function" ? value : () => {};
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/select2-option-migration.js
	var SUPPORTED_OPTIONS = /* @__PURE__ */ new Set([
		"allowClear",
		"disabled",
		"maximumSelectionLength",
		"minimumInputLength",
		"placeholder",
		"tags"
	]);
	var OPTION_MIGRATIONS = Object.freeze({
		ajax: "Use SelectAjax or MultiSelectAjax.",
		escapeMarkup: "HTML labels are no longer executed; use text labels or a custom Vue island.",
		multiple: "Use MultiSelect or MultiSelectAjax.",
		templateResult: "Use a custom Vue island component.",
		templateSelection: "Use a custom Vue island component."
	});
	function normalizeLegacySelect2Options(options, { warn = warnOption } = {}) {
		const source = validOptions(options);
		warnUnsupportedOptions(source, warn);
		return {
			allowEmpty: optionalBoolean(source.allowClear),
			max: optionalCount(source.maximumSelectionLength),
			minSymbols: optionalCount(source.minimumInputLength),
			placeholder: optionalString(source.placeholder),
			readonly: optionalBoolean(source.disabled),
			taggable: optionalBoolean(source.tags)
		};
	}
	function warnUnsupportedOptions(options, warn) {
		Object.keys(options).filter((name) => !SUPPORTED_OPTIONS.has(name)).forEach((name) => warn(optionWarning(name)));
	}
	function optionWarning(name) {
		var _OPTION_MIGRATIONS$na;
		return `[SleepingOwl Admin] Select2 option "${name}" is not supported. ${(_OPTION_MIGRATIONS$na = OPTION_MIGRATIONS[name]) !== null && _OPTION_MIGRATIONS$na !== void 0 ? _OPTION_MIGRATIONS$na : "Use the Vue Multiselect or custom-island API."}`;
	}
	function optionalBoolean(value) {
		if (value === void 0 || value === null) return null;
		if (value === "false" || value === "0") return false;
		return Boolean(value);
	}
	function optionalCount(value) {
		if (value === void 0 || value === null) return null;
		const number = Number(value);
		return Number.isFinite(number) && number >= 0 ? number : null;
	}
	function optionalString(value) {
		return value === void 0 || value === null ? null : String(value);
	}
	function validOptions(options) {
		return options && typeof options === "object" && !Array.isArray(options) ? options : {};
	}
	function warnOption(message) {
		var _globalThis$console;
		(_globalThis$console = globalThis.console) === null || _globalThis$console === void 0 || _globalThis$console.warn(message);
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/select.vue
	var SELECT_CLEAR_EVENT = "select:clear";
	var _sfc_main$1 = /* @__PURE__ */ defineComponent({
		name: "ElementSelect",
		components: { Multiselect: script },
		props: {
			attributes: {
				type: Object,
				required: true
			},
			classes: {
				type: Object,
				default: () => ({})
			},
			dependent: {
				type: Object,
				default: null
			},
			legacyOptions: {
				type: Object,
				default: () => ({})
			},
			labels: {
				type: Object,
				required: true
			},
			limit: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 0
			},
			multiple: Boolean,
			options: {
				type: Array,
				default: () => []
			},
			remote: {
				type: Object,
				default: null
			},
			readonly: Boolean,
			required: Boolean,
			taggable: Boolean,
			value: {
				type: [
					Array,
					Number,
					String
				],
				default: null
			}
		},
		data() {
			const localOptions = copySelectOptions(this.options);
			return {
				dependentLoad: null,
				dependentReady: !this.dependent || this.dependent.initialize === false,
				loadError: false,
				legacy: normalizeLegacySelect2Options(this.legacyOptions),
				loading: false,
				localOptions,
				remoteSearch: null,
				searchQuery: "",
				selection: initialSelectValue(localOptions, this.value, this.multiple)
			};
		},
		computed: {
			allowEmpty() {
				var _this$legacy$allowEmp;
				return (_this$legacy$allowEmp = this.legacy.allowEmpty) !== null && _this$legacy$allowEmp !== void 0 ? _this$legacy$allowEmp : !this.required;
			},
			effectiveReadonly() {
				var _this$legacy$readonly;
				return (_this$legacy$readonly = this.legacy.readonly) !== null && _this$legacy$readonly !== void 0 ? _this$legacy$readonly : this.readonly;
			},
			effectiveDisabled() {
				return this.effectiveReadonly || Boolean(this.dependent && (this.loading || !this.dependentReady));
			},
			effectiveTaggable() {
				var _this$legacy$taggable;
				return (_this$legacy$taggable = this.legacy.taggable) !== null && _this$legacy$taggable !== void 0 ? _this$legacy$taggable : this.taggable;
			},
			emptyMessage() {
				return this.loadError ? this.labels.error : this.labels.noItems;
			},
			minimumSearchLength() {
				var _this$legacy$minSymbo, _this$remote$minSymbo, _this$remote;
				return (_this$legacy$minSymbo = this.legacy.minSymbols) !== null && _this$legacy$minSymbo !== void 0 ? _this$legacy$minSymbo : Number((_this$remote$minSymbo = (_this$remote = this.remote) === null || _this$remote === void 0 ? void 0 : _this$remote.minSymbols) !== null && _this$remote$minSymbo !== void 0 ? _this$remote$minSymbo : 0);
			},
			placeholder() {
				if (this.legacy.placeholder !== null) return this.legacy.placeholder;
				return this.localOptions.length || this.remote || this.dependent ? this.labels.placeholder : this.labels.noItems;
			},
			statusMessage() {
				if (this.loadError) return this.labels.error;
				if (this.loading) return this.labels.searching;
				if (this.searchQuery && this.searchQuery.length < this.minimumSearchLength) return this.labels.tooShort;
				return "";
			},
			resolvedLimit() {
				return this.limit > 0 ? this.limit : 99999;
			},
			resolvedMax() {
				var _this$legacy$max;
				const maximum = (_this$legacy$max = this.legacy.max) !== null && _this$legacy$max !== void 0 ? _this$legacy$max : this.max;
				return maximum > 0 ? maximum : false;
			},
			selectedIds() {
				return selectedOptionIds(this.selection, this.multiple);
			},
			singleValue() {
				return selectFormValue(this.selectedIds[0]);
			}
		},
		mounted() {
			this.$el.addEventListener(SELECT_CLEAR_EVENT, this.clearSelection);
			this.mountRemoteSearch();
			this.mountDependentSelect();
		},
		beforeUnmount() {
			var _this$dependentLoad, _this$remoteSearch;
			this.$el.removeEventListener(SELECT_CLEAR_EVENT, this.clearSelection);
			(_this$dependentLoad = this.dependentLoad) === null || _this$dependentLoad === void 0 || _this$dependentLoad.destroy();
			this.dependentLoad = null;
			(_this$remoteSearch = this.remoteSearch) === null || _this$remoteSearch === void 0 || _this$remoteSearch.destroy();
			this.remoteSearch = null;
		},
		methods: {
			addTag(value) {
				if (!this.effectiveTaggable || this.reachedMaximum()) return;
				const next = appendSelectTag(this.localOptions, this.selection, value, this.multiple);
				this.localOptions = next.options;
				this.selectionChanged(next.selection);
			},
			clearSelection() {
				if (this.required) return;
				this.selectionChanged(this.multiple ? [] : null);
			},
			applyRemoteOptions(options) {
				this.loadError = false;
				this.localOptions = mergeRemoteSelectOptions(this.selection, options, this.multiple);
			},
			async applyDependentOptions(result, context) {
				this.loadError = false;
				this.localOptions = result.options;
				this.selection = dependentSelectValue(result.options, result, this.value, this.multiple);
				this.dependentReady = true;
				await nextTick();
				this.dispatchChange();
				this.dispatchDependentEvent("depdrop:change", {
					...context,
					optionCount: result.options.length,
					selected: this.selectedIds
				});
			},
			dispatchChange() {
				const control = this.$refs.nativeControl;
				const EventConstructor = control === null || control === void 0 ? void 0 : control.ownerDocument.defaultView.Event;
				if (control && EventConstructor) control.dispatchEvent(new EventConstructor("change", { bubbles: true }));
			},
			dispatchDependentEvent(name, detail = {}) {
				const control = this.$refs.nativeControl;
				const EventConstructor = control === null || control === void 0 ? void 0 : control.ownerDocument.defaultView.CustomEvent;
				if (control && EventConstructor) control.dispatchEvent(new EventConstructor(name, {
					bubbles: true,
					detail
				}));
			},
			formValue(value) {
				return selectFormValue(value);
			},
			optionKey(option, index) {
				return selectOptionKey(option, index);
			},
			optionSelected(id) {
				return isSelectOptionSelected(this.selection, id, this.multiple);
			},
			mountRemoteSearch() {
				if (!this.remote) return;
				this.remoteSearch = createRemoteSelectSearch({
					...this.remote,
					document: this.$el.ownerDocument,
					http: globalThis.Admin.Http,
					minSymbols: this.minimumSearchLength,
					onError: () => {
						this.loadError = true;
					},
					onLoading: (loading) => {
						this.loading = loading;
						if (loading) this.loadError = false;
					},
					onResults: this.applyRemoteOptions
				});
			},
			mountDependentSelect() {
				if (!this.dependent) return;
				this.dependentLoad = createDependentSelectLoad({
					...this.dependent,
					document: this.$el.ownerDocument,
					http: globalThis.Admin.Http,
					onAfter: (context) => this.dispatchDependentEvent("depdrop:afterChange", context),
					onBefore: (context) => {
						this.dependentReady = false;
						this.dispatchDependentEvent("depdrop:beforeChange", context);
					},
					onError: (error, context) => {
						this.loadError = true;
						this.dispatchDependentEvent("depdrop:error", {
							...context,
							error
						});
					},
					onInit: () => this.dispatchDependentEvent("depdrop:init"),
					onLoading: (loading) => {
						this.loading = loading;
						if (loading) this.loadError = false;
					},
					onResults: this.applyDependentOptions
				});
			},
			reachedMaximum() {
				return this.resolvedMax !== false && this.selectedIds.length >= this.resolvedMax;
			},
			searchOptions(query) {
				var _this$remoteSearch2;
				this.searchQuery = String(query !== null && query !== void 0 ? query : "").trim();
				(_this$remoteSearch2 = this.remoteSearch) === null || _this$remoteSearch2 === void 0 || _this$remoteSearch2.search(this.searchQuery);
			},
			async selectionChanged(value) {
				this.selection = value;
				await nextTick();
				this.dispatchChange();
			}
		}
	});
	var _hoisted_1$1 = { "data-select-root": "" };
	var _hoisted_2 = {
		key: 0,
		"data-select-status": "",
		"aria-live": "polite"
	};
	var _hoisted_3 = ["disabled", "value"];
	var _hoisted_4 = ["disabled"];
	var _hoisted_5 = ["selected", "value"];
	function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
		const _component_Multiselect = resolveComponent("Multiselect");
		return openBlock(), createElementBlock("div", _hoisted_1$1, [
			createVNode(_component_Multiselect, {
				"track-by": "id",
				label: "text",
				"allow-empty": _ctx.allowEmpty,
				"deselect-label": _ctx.required ? "" : _ctx.labels.deselect,
				disabled: _ctx.effectiveDisabled,
				"internal-search": !_ctx.remote,
				limit: _ctx.resolvedLimit,
				loading: _ctx.loading,
				max: _ctx.resolvedMax,
				multiple: _ctx.multiple,
				options: _ctx.localOptions,
				placeholder: _ctx.placeholder,
				searchable: true,
				"select-label": _ctx.labels.select,
				"selected-label": _ctx.labels.selected,
				taggable: _ctx.effectiveTaggable,
				"model-value": _ctx.selection,
				onSearchChange: _ctx.searchOptions,
				onTag: _ctx.addTag,
				"onUpdate:modelValue": _ctx.selectionChanged
			}, {
				noResult: withCtx(() => [createTextVNode(toDisplayString(_ctx.emptyMessage), 1)]),
				noOptions: withCtx(() => [createTextVNode(toDisplayString(_ctx.emptyMessage), 1)]),
				_: 1
			}, 8, [
				"allow-empty",
				"deselect-label",
				"disabled",
				"internal-search",
				"limit",
				"loading",
				"max",
				"multiple",
				"options",
				"placeholder",
				"select-label",
				"selected-label",
				"taggable",
				"model-value",
				"onSearchChange",
				"onTag",
				"onUpdate:modelValue"
			]),
			_ctx.statusMessage ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(_ctx.statusMessage), 1)) : createCommentVNode("v-if", true),
			!_ctx.multiple ? (openBlock(), createElementBlock("input", mergeProps({
				key: 1,
				ref: "nativeControl"
			}, _ctx.attributes, {
				"data-select-native": "",
				type: "hidden",
				disabled: _ctx.effectiveDisabled,
				value: _ctx.singleValue
			}), null, 16, _hoisted_3)) : (openBlock(), createElementBlock("select", mergeProps({
				key: 2,
				ref: "nativeControl"
			}, _ctx.attributes, {
				"data-select-native": "",
				hidden: "",
				multiple: "",
				disabled: _ctx.effectiveDisabled
			}), [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.localOptions, (option, index) => {
				return openBlock(), createElementBlock("option", {
					key: _ctx.optionKey(option, index),
					selected: _ctx.optionSelected(option.id),
					value: _ctx.formValue(option.id)
				}, toDisplayString(option.text), 9, _hoisted_5);
			}), 128))], 16, _hoisted_4)),
			_ctx.required && _ctx.multiple && !_ctx.selectedIds.length ? (openBlock(), createElementBlock("div", {
				key: 3,
				"data-select-required": "",
				class: normalizeClass(_ctx.classes.required)
			}, toDisplayString(_ctx.labels.required), 3)) : createCommentVNode("v-if", true)
		]);
	}
	var select_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["render", _sfc_render$1], ["__file", "select.vue"]]);
	//#endregion
	//#region resources/js/core/data/island-props.js
	function parseJsonProps(source) {
		let value;
		try {
			value = JSON.parse(source);
		} catch (error) {
			throw new TypeError("Island props must contain valid JSON.", { cause: error });
		}
		if (value === null || Array.isArray(value) || typeof value !== "object") throw new TypeError("Island props JSON must contain an object.");
		return value;
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/related/related-fields.js
	function appendRelatedIndex(value, index) {
		if (typeof value !== "string" || value.length === 0 || /_\d+$/.test(value)) return value;
		return `${value}_${index}`;
	}
	function createRelatedName(relation, index, value) {
		if (typeof value !== "string" || value.length === 0) return value;
		if (value.startsWith(`${relation}[`)) return value;
		const arraySuffix = value.endsWith("[]") ? "[]" : "";
		return `${relation}[new_${index}][${arraySuffix ? value.slice(0, -2) : value}]${arraySuffix}`;
	}
	function rewriteRelatedIslandProps(props, context) {
		const rewritten = { ...props };
		if (context.isNew && typeof props.name === "string") rewritten.name = createRelatedName(context.name, context.index, props.name);
		if (isAttributes(props.attributes)) rewritten.attributes = rewriteAttributes(props.attributes, context);
		return rewritten;
	}
	function rewriteAttributes(attributes, context) {
		const rewritten = { ...attributes };
		if (typeof attributes.id === "string") rewritten.id = appendRelatedIndex(attributes.id, context.index);
		if (context.isNew && typeof attributes.name === "string") rewritten.name = createRelatedName(context.name, context.index, attributes.name);
		return rewritten;
	}
	function isAttributes(value) {
		return value !== null && typeof value === "object" && !Array.isArray(value);
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/related/related-dom.js
	var CONTROL_SELECTOR = "input, select, textarea";
	var ISLAND_SELECTOR = "[data-vue-app][data-vue-component]";
	function createRelatedGroup(document, html, context) {
		const group = parseGroup(document, html);
		markGroup(group, context);
		rewriteControls(group, context);
		rewriteIslands(group, context);
		return group;
	}
	function parseGroup(document, html) {
		const template = document.createElement("template");
		template.innerHTML = html.trim();
		if (template.content.children.length !== 1) throw new Error("Related group HTML must contain exactly one root element.");
		return template.content.firstElementChild;
	}
	function markGroup(group, context) {
		group.dataset.relatedGroup = "";
		group.dataset.relatedIndex = String(context.index);
		group.dataset.relatedKey = context.key;
		group.dataset.relatedPrimary = context.primary;
	}
	function rewriteControls(group, context) {
		group.querySelectorAll(CONTROL_SELECTOR).forEach((control) => {
			rewriteId(control, context.index);
			if (context.isNew) rewriteName(control, context);
		});
	}
	function rewriteId(element, index) {
		const value = element.getAttribute("id");
		if (!value) return;
		element.setAttribute("id", appendRelatedIndex(value, index));
	}
	function rewriteName(element, context) {
		const value = element.getAttribute("name");
		if (!value) return;
		element.setAttribute("name", createRelatedName(context.name, context.index, value));
	}
	function rewriteIslands(group, context) {
		group.querySelectorAll(ISLAND_SELECTOR).forEach((host, position) => {
			const binding = islandPropsBinding(group, host, context, position);
			const props = rewriteRelatedIslandProps(parseJsonProps(binding.source), context);
			binding.write(JSON.stringify(props));
		});
	}
	function islandPropsBinding(group, host, context, position) {
		const id = host.dataset.vuePropsId;
		if (!id) return inlinePropsBinding(host);
		const script = findPropsScript(group, id);
		if (!script) throw new Error(`Related island props script [${id}] was not found.`);
		if (context.isNew) assignUniquePropsId(host, script, context.key, position);
		return scriptPropsBinding(script);
	}
	function inlinePropsBinding(host) {
		return {
			source: host.dataset.vueProps || "{}",
			write: (source) => {
				host.dataset.vueProps = source;
			}
		};
	}
	function scriptPropsBinding(script) {
		return {
			source: script.textContent || "{}",
			write: (source) => {
				script.textContent = source;
			}
		};
	}
	function findPropsScript(group, id) {
		return [...group.querySelectorAll("script[type=\"application/json\"][id]")].find((script) => script.id === id);
	}
	function assignUniquePropsId(host, script, key, position) {
		const suffix = `${safeIdPart(key)}-${position}`;
		script.id = `${script.id}--${suffix}`;
		host.dataset.vuePropsId = script.id;
	}
	function safeIdPart(value) {
		return String(value).replace(/[^a-zA-Z0-9_-]/g, "-");
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/related/related-lifecycle.js
	var relatedModuleNames = Object.freeze(["form.elements.wysiwyg"]);
	function initializeRelatedGroup(admin, element) {
		relatedModuleNames.forEach((name) => admin.Modules.call(name));
		admin.Components.scan(element);
	}
	function destroyRelatedGroup(admin, element) {
		return admin.Components.destroy(element);
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/related/related-sortable.js
	function createRelatedSortable(Sortable, element, enabled) {
		if (!enabled) return null;
		return new Sortable(element, {
			animation: 150,
			draggable: "[data-related-group]",
			handle: ".drag-handle"
		});
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/related/related-state.js
	var NEW_PRIMARY = /^new_(\d+)$/;
	var NEW_PRIMARY_PREFIX = "new_";
	function normalizeRelatedGroups(groups) {
		if (!Array.isArray(groups)) throw new TypeError("Related groups must be an array.");
		return groups.map((group, position) => normalizeGroup(group, position));
	}
	function normalizeRemovedGroups(groups) {
		if (!Array.isArray(groups)) throw new TypeError("Removed related groups must be an array.");
		return [...new Set(groups.map(String))];
	}
	function firstNewGroupIndex(groups) {
		const usedIndexes = groups.map(({ primary }) => newPrimaryIndex(primary)).filter(Number.isInteger);
		const usedFloor = usedIndexes.length === 0 ? 1 : Math.max(...usedIndexes) + 1;
		return Math.max(groups.length + 1, usedFloor);
	}
	function canAddRelatedGroup(limit, groupCount) {
		return limit === null || limit === void 0 || limit > groupCount;
	}
	function isPersistedPrimary(primary) {
		const value = String(primary !== null && primary !== void 0 ? primary : "");
		return value.length > 0 && !value.startsWith(NEW_PRIMARY_PREFIX);
	}
	function normalizeGroup(group, position) {
		var _group$primary, _group$index;
		if (!group || typeof group !== "object" || Array.isArray(group)) throw new TypeError("Each related group must be an object.");
		if (typeof group.html !== "string") throw new TypeError("Each related group must contain HTML.");
		const primary = String((_group$primary = group.primary) !== null && _group$primary !== void 0 ? _group$primary : "");
		return Object.freeze({
			html: group.html,
			index: String((_group$index = group.index) !== null && _group$index !== void 0 ? _group$index : position),
			key: `initial:${position}:${primary}`,
			primary
		});
	}
	function newPrimaryIndex(primary) {
		const match = String(primary !== null && primary !== void 0 ? primary : "").match(NEW_PRIMARY);
		return match ? Number(match[1]) : null;
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/form/related/elements.vue
	var _sfc_main = /* @__PURE__ */ defineComponent({
		name: "RelatedElements",
		props: {
			classes: {
				type: Object,
				default: () => ({})
			},
			draggable: Boolean,
			groups: {
				type: Array,
				required: true
			},
			labels: {
				type: Object,
				required: true
			},
			limit: {
				type: Number,
				default: null
			},
			name: {
				type: String,
				required: true
			},
			readonly: Boolean,
			removed: {
				type: Array,
				default: () => []
			},
			stubHtml: {
				type: String,
				required: true
			}
		},
		data() {
			const groups = normalizeRelatedGroups(this.groups);
			return {
				groupCount: 0,
				groupRecords: markRaw(/* @__PURE__ */ new Map()),
				initialGroups: markRaw(groups),
				nextIndex: firstNewGroupIndex(groups),
				removedGroups: normalizeRemovedGroups(this.removed),
				sortable: null
			};
		},
		computed: {
			canAddMore() {
				return canAddRelatedGroup(this.limit, this.groupCount);
			},
			removedExistingGroups() {
				return this.removedGroups.filter(isPersistedPrimary);
			}
		},
		mounted() {
			this.initialGroups.filter((group) => !this.removedGroups.includes(group.primary)).forEach((group) => this.mountGroup(group, false));
			const sortableEnabled = this.draggable && !this.readonly;
			this.sortable = createRelatedSortable(Sortable, this.$refs.groups, sortableEnabled);
		},
		beforeUnmount() {
			var _this$sortable;
			(_this$sortable = this.sortable) === null || _this$sortable === void 0 || _this$sortable.destroy();
			this.sortable = null;
			[...this.groupRecords.values()].reverse().forEach((record) => this.destroyGroup(record));
			this.groupRecords.clear();
		},
		methods: {
			addNewGroup() {
				if (this.readonly || !this.canAddMore) return;
				const index = this.nextIndex++;
				const record = {
					html: this.stubHtml,
					index: String(index),
					key: `new:${index}`,
					primary: ""
				};
				const element = this.mountGroup(record, true);
				this.$nextTick(() => initializeRelatedGroup(Admin, element));
			},
			destroyGroup(record) {
				destroyRelatedGroup(Admin, record.element);
			},
			handleClick(event) {
				var _event$target, _event$target$closest;
				if (this.readonly) return;
				const button = (_event$target = event.target) === null || _event$target === void 0 || (_event$target$closest = _event$target.closest) === null || _event$target$closest === void 0 ? void 0 : _event$target$closest.call(_event$target, "[data-related-remove]");
				if (!button || !this.$refs.groups.contains(button)) return;
				const group = button.closest("[data-related-group]");
				if (group) this.removeGroup(group.dataset.relatedKey);
			},
			mountGroup(group, isNew) {
				const context = {
					...group,
					isNew,
					name: this.name
				};
				const element = createRelatedGroup(this.$el.ownerDocument, group.html, context);
				const record = markRaw({
					...group,
					element
				});
				this.$refs.groups.append(element);
				this.groupRecords.set(group.key, record);
				this.groupCount++;
				return element;
			},
			removeGroup(key) {
				const record = this.groupRecords.get(key);
				if (!record) return;
				this.destroyGroup(record);
				record.element.remove();
				this.groupRecords.delete(key);
				this.groupCount--;
				if (isPersistedPrimary(record.primary)) this.rememberRemoved(record.primary);
			},
			rememberRemoved(primary) {
				if (!this.removedGroups.includes(primary)) this.removedGroups.push(primary);
			}
		}
	});
	var _hoisted_1 = ["name", "value"];
	function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
		return openBlock(), createElementBlock("div", {
			"data-related-root": "",
			class: normalizeClass(_ctx.classes.root),
			onClick: _cache[1] || (_cache[1] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
		}, [
			createBaseVNode("div", {
				ref: "groups",
				"data-related-groups": "",
				class: normalizeClass(_ctx.classes.groups)
			}, null, 2),
			!_ctx.readonly ? (openBlock(), createElementBlock("div", {
				key: 0,
				"data-related-actions": "",
				class: normalizeClass(_ctx.classes.actions)
			}, [_ctx.canAddMore ? (openBlock(), createElementBlock("button", {
				key: 0,
				type: "button",
				"data-related-add": "",
				class: normalizeClass(_ctx.classes.add),
				onClick: _cache[0] || (_cache[0] = (...args) => _ctx.addNewGroup && _ctx.addNewGroup(...args))
			}, [createBaseVNode("i", {
				"data-related-add-icon": "",
				class: normalizeClass(_ctx.classes.addIcon),
				"aria-hidden": "true"
			}, null, 2), createTextVNode(" " + toDisplayString(_ctx.labels.add), 1)], 2)) : createCommentVNode("v-if", true)], 2)) : createCommentVNode("v-if", true),
			(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.removedExistingGroups, (id) => {
				return openBlock(), createElementBlock("input", {
					key: id,
					type: "hidden",
					name: `${_ctx.name}[remove][]`,
					value: id,
					"data-related-removed": ""
				}, null, 8, _hoisted_1);
			}), 128))
		], 2);
	}
	//#endregion
	//#region resources/js/shared/legacy/admin/vue-components.js
	var vueComponents = Object.freeze({
		"element-file": file_default,
		"element-image": image_default,
		"element-images": images_default,
		"element-select": select_default,
		"related-elements": /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__file", "elements.vue"]])
	});
	//#endregion
	//#region resources/js/core/lifecycle/component-lifecycle.js
	var componentMountSkipped = Symbol.for("sleepingowl.component-mount-skipped");
	//#endregion
	//#region resources/js/shared/vue/legacy/component-catalog.js
	var VueComponentCatalog = class {
		constructor(components = {}) {
			assertComponentObject(components);
			this.components = /* @__PURE__ */ new Map();
			Object.entries(components).forEach(([name, component]) => this.register(name, component));
		}
		register(name, component) {
			const entry = validateComponent(name, component);
			if (this.components.has(entry.name)) throw new Error(`Vue app component [${entry.name}] is already registered.`);
			this.components.set(entry.name, entry.component);
			return entry.component;
		}
		has(name) {
			return this.components.has(name);
		}
		get(name) {
			return this.components.get(name);
		}
		entries() {
			return [...this.components.entries()];
		}
	};
	function createVueComponentCatalog(components) {
		return new VueComponentCatalog(components);
	}
	function validateComponent(name, component) {
		const validDefinition = component !== null && ["function", "object"].includes(typeof component);
		if (typeof name !== "string" || !name.trim() || !validDefinition) throw new TypeError("Vue app component entries require a name and definition.");
		return {
			component,
			name
		};
	}
	function assertComponentObject(components) {
		if (!components || typeof components !== "object" || Array.isArray(components)) throw new TypeError("Vue app components must be an object.");
	}
	//#endregion
	//#region resources/js/shared/vue/legacy/app-registry.js
	var vueAppSelector = "[data-vue-app]";
	var VueAppRegistry = class {
		constructor(createApp, components = {}) {
			assertFunction$1(createApp, "createApp");
			this.createApp = createApp;
			this.components = resolveCatalog(components);
			this.apps = /* @__PURE__ */ new Map();
		}
		get size() {
			return this.apps.size;
		}
		mount(element) {
			assertElement(element);
			if (this.apps.has(element)) return this.apps.get(element);
			const root = resolveRootComponent(element, this.components);
			const app = this.createApp(root.component, root.props);
			assertApp(app);
			registerComponents(app, this.components.entries());
			this.apps.set(element, app);
			try {
				app.mount(element);
			} catch (error) {
				this.apps.delete(element);
				throw error;
			}
			return app;
		}
		mountAll(root = globalThis.document) {
			assertRoot(root);
			return topLevelVueRoots(root).reduce((count, element) => {
				if (this.apps.has(element)) return count;
				this.mount(element);
				return count + 1;
			}, 0);
		}
		unmount(element) {
			const app = this.apps.get(element);
			if (!app) return false;
			this.apps.delete(element);
			app.unmount();
			return true;
		}
		unmountAll(root = globalThis.document) {
			assertRoot(root);
			const elements = [...this.apps.keys()].filter((element) => contains(root, element));
			elements.reverse().forEach((element) => this.unmount(element));
			return elements.length;
		}
		get(element) {
			return this.apps.get(element);
		}
		canMount(element) {
			var _element$dataset;
			const name = (_element$dataset = element.dataset) === null || _element$dataset === void 0 ? void 0 : _element$dataset.vueComponent;
			return !name || this.components.has(name);
		}
	};
	function createVueAppRegistry(createApp, components) {
		return new VueAppRegistry(createApp, components);
	}
	function registerComponents(app, components) {
		components.forEach(([name, component]) => app.component(name, component));
	}
	function resolveRootComponent(element, components) {
		var _element$dataset2;
		const name = (_element$dataset2 = element.dataset) === null || _element$dataset2 === void 0 ? void 0 : _element$dataset2.vueComponent;
		if (!name) return {
			component: {},
			props: void 0
		};
		const component = components.get(name);
		if (!component) throw new Error(`Unknown Vue app component [${name}].`);
		return {
			component,
			props: parseJsonProps(readPropsSource(element))
		};
	}
	function readPropsSource(element) {
		var _element$dataset3, _element$dataset4;
		const propsId = (_element$dataset3 = element.dataset) === null || _element$dataset3 === void 0 ? void 0 : _element$dataset3.vuePropsId;
		if (!propsId) return ((_element$dataset4 = element.dataset) === null || _element$dataset4 === void 0 ? void 0 : _element$dataset4.vueProps) || "{}";
		return readReferencedProps(element, propsId);
	}
	function readReferencedProps(element, propsId) {
		var _element$ownerDocumen;
		const script = (_element$ownerDocumen = element.ownerDocument) === null || _element$ownerDocumen === void 0 ? void 0 : _element$ownerDocumen.getElementById(propsId);
		if (!script) throw new Error(`Vue app props script [${propsId}] was not found.`);
		assertJsonPropsScript(script, propsId);
		return script.textContent || "{}";
	}
	function assertJsonPropsScript(script, propsId) {
		if (script.tagName === "SCRIPT" && script.type === "application/json") return;
		throw new TypeError(`Vue app props [${propsId}] must reference an application/json script.`);
	}
	function resolveCatalog(components) {
		if (components instanceof VueComponentCatalog) return components;
		return createVueComponentCatalog(components);
	}
	function topLevelVueRoots(root) {
		return matchingElements(root).filter((element) => !hasVueRootAncestor(element));
	}
	function matchingElements(root) {
		const descendants = [...root.querySelectorAll(vueAppSelector)];
		if (typeof root.matches === "function" && root.matches("[data-vue-app]")) descendants.unshift(root);
		return descendants;
	}
	function hasVueRootAncestor(element) {
		var _element$parentElemen;
		return Boolean((_element$parentElemen = element.parentElement) === null || _element$parentElemen === void 0 ? void 0 : _element$parentElemen.closest(vueAppSelector));
	}
	function contains(root, element) {
		return root === element || root.contains(element);
	}
	function assertApp(app) {
		assertFunction$1(app === null || app === void 0 ? void 0 : app.component, "Vue app component registration");
		assertFunction$1(app === null || app === void 0 ? void 0 : app.mount, "Vue app mount");
		assertFunction$1(app === null || app === void 0 ? void 0 : app.unmount, "Vue app unmount");
	}
	function assertFunction$1(value, name) {
		if (typeof value !== "function") throw new TypeError(`${name} must be a function.`);
	}
	function assertRoot(root) {
		if (typeof (root === null || root === void 0 ? void 0 : root.querySelectorAll) !== "function" || typeof (root === null || root === void 0 ? void 0 : root.contains) !== "function") throw new TypeError("Vue app scan root must be a DOM query root.");
	}
	function assertElement(element) {
		if (!element || element.nodeType !== 1) throw new TypeError("Vue app mount requires an Element.");
	}
	//#endregion
	//#region resources/js/shared/vue/legacy/app-lifecycle.js
	var vueAppLifecycleName = "soa.vue-app";
	function registerVueAppLifecycle(components, vueApps) {
		return components.register({
			destroy: (element) => vueApps.unmount(element),
			mount: (element) => mountVueApp(components, vueApps, element),
			name: vueAppLifecycleName,
			selector: vueAppSelector
		});
	}
	function mountVueApp(components, vueApps, element) {
		if (!vueApps.canMount(element)) return componentMountSkipped;
		const app = vueApps.mount(element);
		components.scan(element);
		return app;
	}
	//#endregion
	//#region resources/js/shared/vue/legacy/app-plugins.js
	var VueAppPlugins = class {
		constructor() {
			this.plugins = [];
			this.registered = /* @__PURE__ */ new Set();
		}
		use(plugin, ...options) {
			assertPlugin(plugin);
			if (this.registered.has(plugin)) return plugin;
			this.registered.add(plugin);
			this.plugins.push({
				options,
				plugin
			});
			return plugin;
		}
		install(app) {
			assertUse(app);
			this.plugins.forEach(({ options, plugin }) => app.use(plugin, ...options));
			return app;
		}
	};
	function createVueAppPlugins() {
		return new VueAppPlugins();
	}
	function assertPlugin(plugin) {
		if (!(typeof plugin === "function" || typeof (plugin === null || plugin === void 0 ? void 0 : plugin.install) === "function")) throw new TypeError("Vue app plugin must be a function or expose install().");
	}
	function assertUse(app) {
		if (typeof (app === null || app === void 0 ? void 0 : app.use) !== "function") throw new TypeError("Vue app plugin installation requires app.use().");
	}
	//#endregion
	//#region resources/js/shared/vue/legacy/extension-api.js
	function createVueExtensionApi(options) {
		var _options$root;
		assertOptions(options);
		const { catalog, lifecycle, plugins, runtime } = options;
		const defaultRoot = (_options$root = options.root) !== null && _options$root !== void 0 ? _options$root : globalThis.document;
		function scan(root = defaultRoot) {
			return lifecycle.scan(root, vueAppLifecycleName);
		}
		function destroy(root = defaultRoot) {
			return lifecycle.destroy(root, vueAppLifecycleName);
		}
		function register(name, component) {
			const registered = catalog.register(name, component);
			scan();
			return registered;
		}
		return Object.freeze({
			destroy,
			register,
			runtime,
			scan,
			use: (plugin, ...pluginOptions) => plugins.use(plugin, ...pluginOptions),
			version: runtime.version
		});
	}
	function assertOptions(options) {
		if (!options || typeof options !== "object") throw new TypeError("Vue extension API options must be an object.");
		assertMethod(options.catalog, "register", "component catalog");
		assertMethod(options.lifecycle, "scan", "component lifecycle");
		assertMethod(options.lifecycle, "destroy", "component lifecycle");
		assertMethod(options.plugins, "use", "app plugins");
		if (!options.runtime || typeof options.runtime !== "object") throw new TypeError("Vue extension API runtime must be an object.");
	}
	function assertMethod(owner, method, name) {
		if (typeof (owner === null || owner === void 0 ? void 0 : owner[method]) !== "function") throw new TypeError(`Vue extension API ${name} must expose ${method}().`);
	}
	//#endregion
	//#region resources/js/shared/vue/legacy/translation.js
	var vueTranslationKey = Symbol.for("sleepingowl.admin.vue.translation");
	function createVueTranslation(translate) {
		assertFunction(translate, "Vue translation function");
		return Object.freeze({ trans: (key, replacements) => translate(key, replacements) });
	}
	function installVueTranslation(app, translation) {
		assertFunction(app === null || app === void 0 ? void 0 : app.provide, "Vue app provide");
		requireVueTranslation(translation);
		app.provide(vueTranslationKey, translation);
		return app;
	}
	function requireVueTranslation(translation) {
		assertFunction(translation === null || translation === void 0 ? void 0 : translation.trans, "Injected Vue translation");
		return translation;
	}
	function assertFunction(value, name) {
		if (typeof value !== "function") throw new TypeError(`${name} must be a function.`);
	}
	//#endregion
	//#region resources/js/shared/vue/browser.js
	if (globalThis.document) bootVue(globalThis);
	function bootVue(target) {
		const Admin = target.Admin;
		const document = target.document;
		const translation = createVueTranslation(target.trans);
		const components = createVueComponentCatalog(vueComponents);
		const plugins = createVueAppPlugins();
		const vueApps = createVueAppRegistry(createAppFactory(translation, plugins), components);
		registerVueAppLifecycle(Admin.Components, vueApps);
		Admin.VueApps = vueApps;
		Admin.Vue = createVueExtensionApi({
			catalog: components,
			lifecycle: Admin.Components,
			plugins,
			root: document,
			runtime: vue_runtime_esm_bundler_exports
		});
		Admin.Vue.scan(document);
		return Admin.Vue;
	}
	function createAppFactory(translation, plugins) {
		return (component, props) => {
			const app = createApp(component, props);
			installVueTranslation(app, translation);
			return plugins.install(app);
		};
	}
	//#endregion
})();

//# sourceMappingURL=vue.js.map