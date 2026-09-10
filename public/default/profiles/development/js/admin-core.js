(function() {
	//#region resources/js/core/assets/runtime-assets.js
	var SUPPORTED_ASSET_TYPES = /* @__PURE__ */ new Set([
		"css",
		"img",
		"js"
	]);
	function createRuntimeAssetLoader({ document = globalThis.document, createImage = () => new globalThis.Image(), log = () => {} } = {}) {
		assertDocument$1(document);
		assertFunction(createImage, "Image factory");
		assertFunction(log, "Asset logger");
		const pending = /* @__PURE__ */ new Map();
		const loader = {
			css: (url) => loadStylesheet(document, url, log, pending),
			img: (url) => loadImage(createImage, url),
			js: (url) => loadScript(document, url, log, pending),
			register: (assets) => registerAssets(loader, assets)
		};
		return loader;
	}
	function registerAssets(loader, assets) {
		if (!assets || typeof assets !== "object") return Promise.resolve([]);
		return Promise.all(Object.entries(assets).map(([type, url]) => {
			if (!SUPPORTED_ASSET_TYPES.has(type)) throw new TypeError(`Unsupported runtime asset type: ${type}.`);
			return loader[type](url);
		}));
	}
	function loadScript(document, url, log, pending) {
		assertUrl$2(url);
		const key = assetKey(document, "js", url);
		if (pending.has(key)) return pending.get(key);
		if (hasMatchingUrl(document, "script[src]", "src", url)) {
			log(`Script file ${url} is loaded.`);
			return Promise.resolve(url);
		}
		const script = document.createElement("script");
		script.src = url;
		return trackPending(pending, key, appendAndWait(document.head, script, url));
	}
	function loadStylesheet(document, url, log, pending) {
		assertUrl$2(url);
		const key = assetKey(document, "css", url);
		if (pending.has(key)) return pending.get(key);
		if (hasMatchingUrl(document, "link[href]", "href", url)) {
			log(`CSS file ${url} is loaded.`);
			return Promise.resolve(url);
		}
		const link = document.createElement("link");
		link.href = url;
		link.rel = "stylesheet";
		link.type = "text/css";
		return trackPending(pending, key, appendAndWait(document.head, link, url));
	}
	function loadImage(createImage, url) {
		assertUrl$2(url);
		const image = createImage();
		const loaded = waitForLoad(image, url);
		image.src = url;
		return loaded;
	}
	function appendAndWait(parent, element, url) {
		const loaded = waitForLoad(element, url);
		parent.appendChild(element);
		return loaded;
	}
	function waitForLoad(element, url) {
		return new Promise((resolve, reject) => {
			element.onload = () => resolve(url);
			element.onerror = () => {
				var _element$remove;
				(_element$remove = element.remove) === null || _element$remove === void 0 || _element$remove.call(element);
				reject(url);
			};
		});
	}
	function trackPending(pending, key, promise) {
		pending.set(key, promise);
		promise.then(() => pending.delete(key), () => pending.delete(key));
		return promise;
	}
	function assetKey(document, type, url) {
		return `${type}:${absoluteUrl(document, url)}`;
	}
	function hasMatchingUrl(document, selector, property, url) {
		const expected = absoluteUrl(document, url);
		return [...document.querySelectorAll(selector)].some((element) => absoluteUrl(document, element[property]) === expected);
	}
	function absoluteUrl(document, url) {
		return new globalThis.URL(url, document.baseURI).href;
	}
	function assertDocument$1(document) {
		if (!(document === null || document === void 0 ? void 0 : document.head) || typeof document.createElement !== "function") throw new TypeError("Runtime assets require a document with a head element.");
		if (typeof document.querySelectorAll !== "function") throw new TypeError("Runtime assets require document.querySelectorAll().");
	}
	function assertUrl$2(url) {
		if (typeof url !== "string" || url.length === 0) throw new TypeError("Runtime asset URL must be a non-empty string.");
	}
	function assertFunction(value, label) {
		if (typeof value !== "function") throw new TypeError(`${label} must be a function.`);
	}
	//#endregion
	//#region resources/js/core/data/island-props.js
	var DATASET_PARSERS = {
		boolean: parseBoolean,
		number: parseNumber,
		string: String
	};
	function parseBoolean(value, name = "value") {
		if (value === "true" || value === true) return true;
		if (value === "false" || value === false) return false;
		throw new TypeError(`${name} must be true or false.`);
	}
	function parseNumber(value, name = "value") {
		const number = typeof value === "number" ? value : Number(value);
		if (value === "" || !Number.isFinite(number)) throw new TypeError(`${name} must be a finite number.`);
		return number;
	}
	function readDataset(dataset, schema) {
		return Object.fromEntries(Object.entries(schema).filter(([name]) => Object.hasOwn(dataset, name)).map(([name, type]) => [name, parseDatasetValue(dataset[name], type, name)]));
	}
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
	function parseDatasetValue(value, type, name) {
		const parser = DATASET_PARSERS[type];
		if (!parser) throw new TypeError(`Unsupported dataset type for ${name}: ${type}.`);
		return parser(value, name);
	}
	//#endregion
	//#region resources/js/core/dom/forms.js
	function createPostForm(document, url, parameters = {}) {
		assertDocument(document);
		assertUrl$1(url);
		assertParameters(parameters);
		const form = document.createElement("form");
		form.setAttribute("method", "POST");
		form.setAttribute("action", url);
		Object.entries(parameters).forEach(([name, value]) => {
			form.appendChild(createHiddenInput(document, name, value));
		});
		return form;
	}
	function submitPostForm(document, url, parameters = {}) {
		const form = createPostForm(document, url, parameters);
		document.body.appendChild(form);
		submitForm(form);
		return form;
	}
	function submitForm(form) {
		if (typeof (form === null || form === void 0 ? void 0 : form.requestSubmit) === "function") return form.requestSubmit();
		if (typeof (form === null || form === void 0 ? void 0 : form.submit) === "function") return form.submit();
		throw new TypeError("Form submission requires requestSubmit() or submit().");
	}
	function createHiddenInput(document, name, value) {
		const input = document.createElement("input");
		input.setAttribute("type", "hidden");
		input.setAttribute("name", name);
		input.setAttribute("value", String(value));
		return input;
	}
	function assertDocument(document) {
		if (!(document === null || document === void 0 ? void 0 : document.body) || typeof document.createElement !== "function") throw new TypeError("Form creation requires a document with a body element.");
	}
	function assertUrl$1(url) {
		if (typeof url !== "string" || url.length === 0) throw new TypeError("Form action URL must be a non-empty string.");
	}
	function assertParameters(parameters) {
		if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) throw new TypeError("Form parameters must be an object.");
	}
	//#endregion
	//#region resources/js/core/dom/listeners.js
	function listen(target, type, listener, options) {
		assertEventTarget(target);
		assertEventType$1(type);
		assertListener(listener);
		target.addEventListener(type, listener, options);
		return () => target.removeEventListener(type, listener, options);
	}
	function delegate(root, type, selector, listener, options) {
		assertDelegationRoot(root);
		assertSelector(selector);
		assertListener(listener);
		return listen(root, type, (event) => invokeDelegate(event, root, selector, listener), options);
	}
	function invokeDelegate(event, root, selector, listener) {
		const matched = findDelegateTarget(event.target, root, selector);
		if (matched) listener.call(matched, event, matched);
	}
	function findDelegateTarget(target, root, selector) {
		const element = closestElement(target);
		const matched = element === null || element === void 0 ? void 0 : element.closest(selector);
		return matched && root.contains(matched) ? matched : null;
	}
	function closestElement(target) {
		var _target$parentElement;
		if (typeof (target === null || target === void 0 ? void 0 : target.closest) === "function") return target;
		return (_target$parentElement = target === null || target === void 0 ? void 0 : target.parentElement) !== null && _target$parentElement !== void 0 ? _target$parentElement : null;
	}
	function assertEventTarget(target) {
		if (typeof (target === null || target === void 0 ? void 0 : target.addEventListener) !== "function" || typeof (target === null || target === void 0 ? void 0 : target.removeEventListener) !== "function") throw new TypeError("Event target must support addEventListener and removeEventListener.");
	}
	function assertDelegationRoot(root) {
		assertEventTarget(root);
		if (typeof root.contains !== "function") throw new TypeError("Delegation root must support contains().");
	}
	function assertEventType$1(type) {
		if (typeof type !== "string" || type.length === 0) throw new TypeError("Event type must be a non-empty string.");
	}
	function assertSelector(selector) {
		if (typeof selector !== "string" || selector.length === 0) throw new TypeError("Delegated selector must be a non-empty string.");
	}
	function assertListener(listener) {
		if (typeof listener !== "function") throw new TypeError("Event listener must be a function.");
	}
	//#endregion
	//#region resources/js/core/events/event-bus.js
	var dispatchStates = /* @__PURE__ */ new WeakMap();
	var AdminEventBus = class {
		constructor(target = defaultEventTarget()) {
			this.eventTarget = target;
			this.subscriptions = /* @__PURE__ */ new Map();
		}
		on(type, callback, context) {
			var _this$subscriptions$g;
			assertEventType(type);
			assertCallback(callback);
			const subscription = this.createSubscription(callback, context);
			const subscriptions = (_this$subscriptions$g = this.subscriptions.get(type)) !== null && _this$subscriptions$g !== void 0 ? _this$subscriptions$g : [];
			subscriptions.push(subscription);
			this.subscriptions.set(type, subscriptions);
			this.eventTarget.addEventListener(type, subscription.listener);
		}
		off(type, callback) {
			var _this$subscriptions$g2;
			if (!type) {
				this.clear();
				return;
			}
			const subscriptions = (_this$subscriptions$g2 = this.subscriptions.get(type)) !== null && _this$subscriptions$g2 !== void 0 ? _this$subscriptions$g2 : [];
			const removed = callback ? subscriptions.filter((subscription) => subscription.callback === callback) : subscriptions;
			this.removeSubscriptions(type, removed);
		}
		fire(type, ...parameters) {
			assertEventType(type);
			const event = createCustomEvent(type, parameters);
			const state = { error: null };
			dispatchStates.set(event, state);
			try {
				this.eventTarget.dispatchEvent(event);
			} finally {
				dispatchStates.delete(event);
			}
			if (state.error) throw state.error;
		}
		target() {
			return this.eventTarget;
		}
		clear() {
			for (const [type, subscriptions] of this.subscriptions) this.removeSubscriptions(type, subscriptions);
		}
		createSubscription(callback, context) {
			return {
				callback,
				listener: (event) => invokeCallback(event, callback, context)
			};
		}
		removeSubscriptions(type, removed) {
			var _this$subscriptions$g3;
			if (removed.length === 0) return;
			for (const subscription of removed) this.eventTarget.removeEventListener(type, subscription.listener);
			const removedSet = new Set(removed);
			const remaining = ((_this$subscriptions$g3 = this.subscriptions.get(type)) !== null && _this$subscriptions$g3 !== void 0 ? _this$subscriptions$g3 : []).filter((subscription) => !removedSet.has(subscription));
			if (remaining.length === 0) this.subscriptions.delete(type);
			else this.subscriptions.set(type, remaining);
		}
	};
	function createEventBus(target) {
		return new AdminEventBus(target);
	}
	function invokeCallback(event, callback, context) {
		const state = dispatchStates.get(event);
		if (state === null || state === void 0 ? void 0 : state.error) return;
		try {
			callback.apply(context, event.detail);
		} catch (error) {
			if (!state) throw error;
			state.error = error;
		}
	}
	function defaultEventTarget() {
		var _globalThis$document;
		return (_globalThis$document = globalThis.document) !== null && _globalThis$document !== void 0 ? _globalThis$document : new globalThis.EventTarget();
	}
	function createCustomEvent(type, detail) {
		if (typeof globalThis.CustomEvent === "function") return new globalThis.CustomEvent(type, { detail });
		const event = new globalThis.Event(type);
		Object.defineProperty(event, "detail", { value: detail });
		return event;
	}
	function assertEventType(type) {
		if (typeof type !== "string" || type.length === 0) throw new TypeError("Event type must be a non-empty string.");
	}
	function assertCallback(callback) {
		if (typeof callback !== "function") throw new TypeError("Event callback must be a function.");
	}
	//#endregion
	//#region resources/js/core/http/csrf-token.js
	function readCsrfToken(document = globalThis.document) {
		var _document$querySelect;
		const content = document === null || document === void 0 || (_document$querySelect = document.querySelector) === null || _document$querySelect === void 0 || (_document$querySelect = _document$querySelect.call(document, "meta[name=\"csrf-token\"]")) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.getAttribute("content");
		return typeof content === "string" && content.length > 0 ? content : null;
	}
	//#endregion
	//#region resources/js/core/http/http-client.js
	var SAFE_METHODS = /* @__PURE__ */ new Set([
		"GET",
		"HEAD",
		"OPTIONS"
	]);
	var HttpError = class extends Error {
		constructor(response) {
			var _response$status;
			super(httpErrorMessage(response));
			this.name = "HttpError";
			this.response = response;
			this.status = (_response$status = response === null || response === void 0 ? void 0 : response.status) !== null && _response$status !== void 0 ? _response$status : 0;
		}
	};
	var HttpClient = class {
		constructor({ fetch = globalThis.fetch, csrfToken = null } = {}) {
			assertFetch(fetch);
			this.fetch = fetch;
			this.csrfToken = csrfToken;
		}
		async request(url, options = {}) {
			var _options$credentials;
			assertUrl(url);
			assertOptions(options);
			const method = normalizeMethod(options.method);
			const response = await this.fetch(url, {
				...options,
				credentials: (_options$credentials = options.credentials) !== null && _options$credentials !== void 0 ? _options$credentials : "same-origin",
				headers: requestHeaders(options.headers, method, this.csrfToken),
				method
			});
			if (!(response === null || response === void 0 ? void 0 : response.ok)) throw new HttpError(response);
			return response;
		}
		get(url, options) {
			return this.request(url, {
				...options,
				method: "GET"
			});
		}
		post(url, body, options) {
			return this.request(url, {
				...options,
				body,
				method: "POST"
			});
		}
		put(url, body, options) {
			return this.request(url, {
				...options,
				body,
				method: "PUT"
			});
		}
		patch(url, body, options) {
			return this.request(url, {
				...options,
				body,
				method: "PATCH"
			});
		}
		delete(url, options) {
			return this.request(url, {
				...options,
				method: "DELETE"
			});
		}
	};
	function createHttpClient(options) {
		return new HttpClient(options);
	}
	function requestHeaders(input, method, csrfToken) {
		const headers = new globalThis.Headers(input);
		setDefaultHeader(headers, "Accept", "application/json");
		setDefaultHeader(headers, "X-Requested-With", "XMLHttpRequest");
		if (!SAFE_METHODS.has(method) && csrfToken) setDefaultHeader(headers, "X-CSRF-TOKEN", csrfToken);
		return headers;
	}
	function setDefaultHeader(headers, name, value) {
		if (!headers.has(name)) headers.set(name, value);
	}
	function normalizeMethod(method = "GET") {
		if (typeof method !== "string" || method.length === 0) throw new TypeError("HTTP method must be a non-empty string.");
		return method.toUpperCase();
	}
	function httpErrorMessage(response) {
		var _response$status2;
		return `HTTP request failed with status ${(_response$status2 = response === null || response === void 0 ? void 0 : response.status) !== null && _response$status2 !== void 0 ? _response$status2 : 0}${(response === null || response === void 0 ? void 0 : response.statusText) ? ` ${response.statusText}` : ""}.`;
	}
	function assertFetch(fetch) {
		if (typeof fetch !== "function") throw new TypeError("HTTP client requires a fetch function.");
	}
	function assertUrl(url) {
		if (typeof url !== "string" || url.length === 0) throw new TypeError("HTTP request URL must be a non-empty string.");
	}
	function assertOptions(options) {
		if (!options || typeof options !== "object" || Array.isArray(options)) throw new TypeError("HTTP request options must be an object.");
	}
	//#endregion
	//#region resources/js/core/lifecycle/component-lifecycle.js
	var componentMountSkipped = Symbol.for("sleepingowl.component-mount-skipped");
	var ComponentLifecycle = class {
		constructor() {
			this.definitions = [];
			this.definitionsByName = /* @__PURE__ */ new Map();
			this.records = /* @__PURE__ */ new Set();
			this.recordsByElement = /* @__PURE__ */ new WeakMap();
		}
		register(definition) {
			const normalized = normalizeDefinition(definition);
			if (this.definitionsByName.has(normalized.name)) throw new Error(`Component ${normalized.name} is already registered.`);
			this.definitions.push(normalized);
			this.definitionsByName.set(normalized.name, normalized);
			return () => this.unregister(normalized.name);
		}
		unregister(name) {
			const definition = this.definitionsByName.get(name);
			if (!definition) return false;
			this.definitions = this.definitions.filter((item) => item !== definition);
			this.definitionsByName.delete(name);
			this.destroyRecords(recordsForDefinition(this.records, definition));
			return true;
		}
		scan(root = globalThis.document, name) {
			assertRoot(root);
			return this.resolveDefinitions(name).reduce((count, definition) => count + matchingElements(root, definition.selector).reduce((mounted, element) => mounted + this.mountDefinition(element, definition), 0), 0);
		}
		mount(element) {
			assertElement$1(element);
			return this.definitions.reduce((count, definition) => count + (element.matches(definition.selector) ? this.mountDefinition(element, definition) : 0), 0);
		}
		destroy(root, name) {
			assertRoot(root);
			return this.destroyRecords(recordsInside(this.records, root, name));
		}
		get(element, name) {
			var _this$recordsByElemen;
			return (_this$recordsByElemen = this.recordsByElement.get(element)) === null || _this$recordsByElemen === void 0 || (_this$recordsByElemen = _this$recordsByElemen.get(name)) === null || _this$recordsByElemen === void 0 ? void 0 : _this$recordsByElemen.instance;
		}
		mountDefinition(element, definition) {
			var _this$recordsByElemen2;
			if ((_this$recordsByElemen2 = this.recordsByElement.get(element)) === null || _this$recordsByElemen2 === void 0 ? void 0 : _this$recordsByElemen2.has(definition.name)) return 0;
			const record = {
				definition,
				element,
				instance: void 0
			};
			this.track(record);
			try {
				record.instance = definition.mount(element);
			} catch (error) {
				this.untrack(record);
				throw error;
			}
			if (record.instance === componentMountSkipped) {
				this.untrack(record);
				return 0;
			}
			return 1;
		}
		resolveDefinitions(name) {
			if (name === void 0) return this.definitions;
			const definition = this.definitionsByName.get(name);
			return definition ? [definition] : [];
		}
		destroyRecords(records) {
			const errors = [];
			records.forEach((record) => {
				if (!this.records.has(record)) return;
				this.untrack(record);
				try {
					destroyRecord(record);
				} catch (error) {
					errors.push(error);
				}
			});
			throwCleanupErrors(errors);
			return records.length;
		}
		track(record) {
			var _this$recordsByElemen3;
			const elementRecords = (_this$recordsByElemen3 = this.recordsByElement.get(record.element)) !== null && _this$recordsByElemen3 !== void 0 ? _this$recordsByElemen3 : /* @__PURE__ */ new Map();
			elementRecords.set(record.definition.name, record);
			this.recordsByElement.set(record.element, elementRecords);
			this.records.add(record);
		}
		untrack(record) {
			const elementRecords = this.recordsByElement.get(record.element);
			elementRecords === null || elementRecords === void 0 || elementRecords.delete(record.definition.name);
			if ((elementRecords === null || elementRecords === void 0 ? void 0 : elementRecords.size) === 0) this.recordsByElement.delete(record.element);
			this.records.delete(record);
		}
	};
	function createComponentLifecycle() {
		return new ComponentLifecycle();
	}
	function normalizeDefinition(definition) {
		var _definition$destroy;
		if (!definition || typeof definition !== "object") throw new TypeError("Component definition must be an object.");
		assertNonEmptyString(definition.name, "name");
		assertNonEmptyString(definition.selector, "selector");
		if (typeof definition.mount !== "function") throw new TypeError("Component definition mount must be a function.");
		if (definition.destroy !== void 0 && typeof definition.destroy !== "function") throw new TypeError("Component definition destroy must be a function when provided.");
		return Object.freeze({
			destroy: (_definition$destroy = definition.destroy) !== null && _definition$destroy !== void 0 ? _definition$destroy : null,
			mount: definition.mount,
			name: definition.name,
			selector: definition.selector
		});
	}
	function matchingElements(root, selector) {
		const descendants = [...root.querySelectorAll(selector)];
		if (typeof root.matches === "function" && root.matches(selector)) descendants.unshift(root);
		return descendants;
	}
	function recordsInside(records, root, name) {
		return [...records].filter((record) => root === record.element || root.contains(record.element)).filter((record) => name === void 0 || record.definition.name === name).reverse();
	}
	function recordsForDefinition(records, definition) {
		return [...records].filter((record) => record.definition === definition).reverse();
	}
	function destroyRecord({ definition, element, instance }) {
		if (definition.destroy) return definition.destroy(element, instance);
		if (typeof instance === "function") return instance();
		if (typeof (instance === null || instance === void 0 ? void 0 : instance.destroy) === "function") return instance.destroy();
	}
	function throwCleanupErrors(errors) {
		if (errors.length === 1) throw errors[0];
		if (errors.length > 1) throw new AggregateError(errors, "Multiple component destroy callbacks failed.");
	}
	function assertRoot(root) {
		if (typeof (root === null || root === void 0 ? void 0 : root.querySelectorAll) !== "function" || typeof (root === null || root === void 0 ? void 0 : root.contains) !== "function") throw new TypeError("Component lifecycle root must be a DOM query root.");
	}
	function assertElement$1(element) {
		if (!element || element.nodeType !== 1 || typeof element.matches !== "function") throw new TypeError("Component lifecycle mount requires an Element.");
	}
	function assertNonEmptyString(value, field) {
		if (typeof value !== "string" || value.length === 0) throw new TypeError(`Component definition ${field} must be a non-empty string.`);
	}
	//#endregion
	//#region resources/js/core/storage/storage-repository.js
	var DEFAULT_PREFIX = "SleepingOwl::";
	var StorageRepository = class {
		constructor(storage = globalThis.localStorage, prefix = DEFAULT_PREFIX) {
			assertStorage(storage);
			assertPrefix(prefix);
			this.storage = storage;
			this.prefix = prefix;
		}
		set(key, value) {
			if (isRecord(key)) {
				Object.entries(key).forEach(([name, item]) => this.write(name, item));
				return this;
			}
			this.write(key, value);
			return this;
		}
		get(key) {
			if (Array.isArray(key)) return Object.fromEntries(key.map((name) => [name, this.read(name)]));
			return this.read(key);
		}
		remove(key) {
			normalizeKeys(key).forEach((name) => this.storage.removeItem(this.storageKey(name)));
			return this;
		}
		clear() {
			const keys = this.ownedKeys();
			keys.forEach((key) => this.storage.removeItem(key));
			return keys.length;
		}
		read(key) {
			return this.storage.getItem(this.storageKey(key));
		}
		write(key, value) {
			this.storage.setItem(this.storageKey(key), value);
		}
		storageKey(key) {
			assertKey(key);
			return `${this.prefix}${key}`;
		}
		ownedKeys() {
			return Array.from({ length: this.storage.length }, (_, index) => this.storage.key(index)).filter((key) => typeof key === "string" && key.startsWith(this.prefix));
		}
	};
	function createStorageRepository(storage, prefix) {
		return new StorageRepository(storage, prefix);
	}
	function normalizeKeys(key) {
		return Array.isArray(key) ? key : [key];
	}
	function isRecord(value) {
		return value !== null && typeof value === "object" && !Array.isArray(value);
	}
	function assertStorage(storage) {
		if (!storage || [
			"getItem",
			"setItem",
			"removeItem",
			"key"
		].some((method) => typeof storage[method] !== "function")) throw new TypeError("Storage repository requires the Web Storage interface.");
	}
	function assertPrefix(prefix) {
		if (typeof prefix !== "string" || prefix.length === 0) throw new TypeError("Storage prefix must be a non-empty string.");
	}
	function assertKey(key) {
		if (typeof key !== "string" || key.length === 0) throw new TypeError("Storage key must be a non-empty string.");
	}
	//#endregion
	//#region resources/js/core/tables/table-registry.js
	var ADAPTER_METHODS = [
		"reload",
		"destroy",
		"clearState",
		"selectedRows"
	];
	var TableRegistry = class {
		constructor() {
			this.adapters = /* @__PURE__ */ new Map();
			this.listeners = /* @__PURE__ */ new Set();
		}
		register(adapter) {
			assertTableAdapter(adapter);
			const current = this.adapters.get(adapter.element);
			if (current && current !== adapter) throw new Error("A table adapter is already registered for this element.");
			if (current === adapter) return adapter;
			this.adapters.set(adapter.element, adapter);
			this.notify("registered", adapter);
			return adapter;
		}
		unregister(element) {
			var _this$adapters$get;
			assertElement(element);
			const adapter = (_this$adapters$get = this.adapters.get(element)) !== null && _this$adapters$get !== void 0 ? _this$adapters$get : null;
			this.adapters.delete(element);
			if (adapter) this.notify("unregistered", adapter);
			return adapter;
		}
		get(element) {
			var _this$adapters$get2;
			assertElement(element);
			return (_this$adapters$get2 = this.adapters.get(element)) !== null && _this$adapters$get2 !== void 0 ? _this$adapters$get2 : null;
		}
		require(element) {
			const adapter = this.get(element);
			if (!adapter) throw new Error("No table adapter is registered for this element.");
			return adapter;
		}
		has(element) {
			assertElement(element);
			return this.adapters.has(element);
		}
		all() {
			return [...this.adapters.values()];
		}
		subscribe(listener) {
			if (typeof listener !== "function") throw new TypeError("Table registry listener must be a function.");
			this.listeners.add(listener);
			return () => this.listeners.delete(listener);
		}
		reload(element) {
			return invokeAdapters(this, "reload", element);
		}
		clearState(element) {
			return invokeAdapters(this, "clearState", element);
		}
		selectedRows(element) {
			const rows = this.require(element).selectedRows();
			if (!Array.isArray(rows)) throw new TypeError("Table adapter selectedRows() must return an array.");
			return rows;
		}
		notify(type, adapter) {
			this.listeners.forEach((listener) => listener({
				adapter,
				type
			}));
		}
	};
	function createTableRegistry() {
		return new TableRegistry();
	}
	function assertTableAdapter(adapter) {
		if (!adapter || typeof adapter !== "object") throw new TypeError("Table adapter must be an object.");
		assertElement(adapter.element);
		assertEngineInstance(adapter);
		for (const method of ADAPTER_METHODS) assertAdapterMethod(adapter, method);
	}
	function assertElement(element) {
		if (!element || typeof element !== "object" || element.nodeType !== 1) throw new TypeError("Table adapter element must be a DOM Element.");
	}
	function assertEngineInstance(adapter) {
		if (!("engineInstance" in adapter) || adapter.engineInstance === void 0) throw new TypeError("Table adapter must expose engineInstance.");
	}
	function assertAdapterMethod(adapter, method) {
		if (typeof adapter[method] !== "function") throw new TypeError(`Table adapter must implement ${method}().`);
	}
	function invokeAdapters(registry, method, element) {
		if (element !== void 0) return registry.require(element)[method]();
		return registry.all().map((adapter) => adapter[method]());
	}
	//#endregion
	//#region resources/js/core/runtime/admin-core.js
	var DATA_API = Object.freeze({
		parseBoolean,
		parseJsonProps,
		parseNumber,
		readDataset
	});
	var DOM_API = Object.freeze({
		createPostForm,
		delegate,
		listen,
		submitForm,
		submitPostForm
	});
	function createAdminCore(options = {}) {
		var _options$document, _options$csrfToken, _options$fetch, _options$storage;
		const document = (_options$document = options.document) !== null && _options$document !== void 0 ? _options$document : globalThis.document;
		return {
			Asset: createRuntimeAssetLoader({
				createImage: options.createImage,
				document,
				log: options.assetLog
			}),
			Components: createComponentLifecycle(),
			Data: DATA_API,
			DOM: DOM_API,
			Events: createEventBus(document),
			Http: createHttpClient({
				csrfToken: (_options$csrfToken = options.csrfToken) !== null && _options$csrfToken !== void 0 ? _options$csrfToken : readCsrfToken(document),
				fetch: (_options$fetch = options.fetch) !== null && _options$fetch !== void 0 ? _options$fetch : globalThis.fetch
			}),
			Storage: createStorageRepository((_options$storage = options.storage) !== null && _options$storage !== void 0 ? _options$storage : globalThis.localStorage),
			Tables: createTableRegistry()
		};
	}
	function installAdminCore(target = globalThis, options = {}) {
		assertTarget(target);
		const admin = adminNamespace(target);
		const services = createAdminCore({
			...targetOptions(target),
			...options
		});
		Object.entries(services).forEach(([name, service]) => {
			if (!(name in admin)) admin[name] = service;
		});
		target.Admin = admin;
		return admin;
	}
	function adminNamespace(target) {
		var _target$Admin;
		const admin = (_target$Admin = target.Admin) !== null && _target$Admin !== void 0 ? _target$Admin : {};
		if ((typeof admin !== "object" || admin === null) && typeof admin !== "function") throw new TypeError("Existing Admin namespace must be an object.");
		return admin;
	}
	function targetOptions(target) {
		const Image = safeProperty(target, "Image");
		const fetch = safeProperty(target, "fetch");
		return {
			createImage: typeof Image === "function" ? () => new Image() : void 0,
			document: safeProperty(target, "document"),
			fetch: typeof fetch === "function" ? fetch.bind(target) : fetch,
			storage: safeProperty(target, "localStorage")
		};
	}
	function safeProperty(target, name) {
		try {
			return target[name];
		} catch (_unused) {
			return;
		}
	}
	function assertTarget(target) {
		if (!target || typeof target !== "object" && typeof target !== "function") throw new TypeError("Admin core target must be an object.");
	}
	//#endregion
	//#region resources/js/core/browser.js
	if (globalThis.document) installAdminCore(globalThis);
	//#endregion
})();

//# sourceMappingURL=admin-core.js.map