(function() {
	//#region resources/js/themes/shadcn/runtime.js
	var INSTALLATION = Symbol.for("sleepingowl.theme.shadcn");
	function installTailwindTheme(target = globalThis) {
		if (target[INSTALLATION]) return target[INSTALLATION];
		const document = target.document;
		if (!document) return null;
		const cards = installTailwindCardControls(document);
		const controller = {
			cards,
			destroy() {
				cards === null || cards === void 0 || cards.destroy();
				delete target[INSTALLATION];
			}
		};
		target[INSTALLATION] = controller;
		return controller;
	}
	function installTailwindCardControls(document) {
		if (typeof (document === null || document === void 0 ? void 0 : document.addEventListener) !== "function") return null;
		const onClick = (event) => {
			const control = cardControl(event);
			if (!control) return;
			const { button, card } = control;
			const action = button.getAttribute("data-card-widget");
			if (action === "collapse") collapseCard(event, button, card);
			if (action === "maximize") maximizeCard(event, button, card);
		};
		const onKeydown = (event) => {
			var _document$querySelect, _card$querySelector;
			if (event.key !== "Escape") return;
			const card = (_document$querySelect = document.querySelector) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.call(document, ".soa-card-maximized");
			if (!card) return;
			card.classList.remove("soa-card-maximized");
			(_card$querySelector = card.querySelector) === null || _card$querySelector === void 0 || (_card$querySelector = _card$querySelector.call(card, "[data-card-widget=\"maximize\"]")) === null || _card$querySelector === void 0 || _card$querySelector.setAttribute("aria-pressed", "false");
		};
		document.addEventListener("click", onClick);
		document.addEventListener("keydown", onKeydown);
		return { destroy() {
			document.removeEventListener("click", onClick);
			document.removeEventListener("keydown", onKeydown);
		} };
	}
	function cardControl(event) {
		var _event$target, _event$target$closest, _button$closest;
		const button = (_event$target = event.target) === null || _event$target === void 0 || (_event$target$closest = _event$target.closest) === null || _event$target$closest === void 0 ? void 0 : _event$target$closest.call(_event$target, "[data-card-widget]");
		const card = button === null || button === void 0 || (_button$closest = button.closest) === null || _button$closest === void 0 ? void 0 : _button$closest.call(button, ".soa-card, .card");
		return button && card ? {
			button,
			card
		} : null;
	}
	function collapseCard(event, button, card) {
		const collapsed = card.classList.toggle("collapsed-card");
		button.setAttribute("aria-expanded", collapsed ? "false" : "true");
		updateCollapseIcon(button, collapsed);
		event.preventDefault();
	}
	function maximizeCard(event, button, card) {
		const maximized = card.classList.toggle("soa-card-maximized");
		button.setAttribute("aria-pressed", maximized ? "true" : "false");
		event.preventDefault();
	}
	function updateCollapseIcon(button, collapsed) {
		var _button$querySelector;
		const icon = (_button$querySelector = button.querySelector) === null || _button$querySelector === void 0 ? void 0 : _button$querySelector.call(button, "i");
		if (!(icon === null || icon === void 0 ? void 0 : icon.classList)) return;
		icon.classList.toggle("fa-plus", collapsed);
		icon.classList.toggle("fa-minus", !collapsed);
	}
	//#endregion
	//#region resources/js/themes/shadcn/features/tree/notifications.js
	function createTailwindTreeNotifications(labels = {}) {
		var _labels$error, _labels$success;
		const messages = {
			error: (_labels$error = labels.error) !== null && _labels$error !== void 0 ? _labels$error : "Unable to save tree",
			success: (_labels$success = labels.success) !== null && _labels$success !== void 0 ? _labels$success : "Tree order saved"
		};
		return {
			error: (region) => updateRegion(region, "error", messages.error),
			success: (region) => updateRegion(region, "success", messages.success)
		};
	}
	function updateRegion(region, state, message) {
		if (!region) return false;
		region.dataset.state = state;
		region.hidden = false;
		region.setAttribute("role", state === "error" ? "alert" : "status");
		region.textContent = message;
		return true;
	}
	//#endregion
	//#region resources/js/themes/shadcn/features/tree/browser.js
	var TREE_SELECTOR = "[data-tree]";
	var NOTIFICATION_SELECTOR = "[data-tree-notification]";
	if (globalThis.document) installTailwindTreeNotifications(globalThis);
	function installTailwindTreeNotifications(target) {
		const root = requireEventTarget(target.document);
		const notifications = createTailwindTreeNotifications(notificationLabels(target.trans));
		const onChanged = (event) => notifications.success(notificationRegion(event));
		const onFailed = (event) => notifications.error(notificationRegion(event));
		root.addEventListener("tree:changed", onChanged);
		root.addEventListener("tree:failed", onFailed);
		return { destroy() {
			root.removeEventListener("tree:changed", onChanged);
			root.removeEventListener("tree:failed", onFailed);
		} };
	}
	function notificationRegion(event) {
		var _event$target$closest, _event$target, _event$target$closest2, _event$target$closest3;
		return (_event$target$closest = (_event$target = event.target) === null || _event$target === void 0 || (_event$target$closest2 = _event$target.closest) === null || _event$target$closest2 === void 0 || (_event$target$closest2 = _event$target$closest2.call(_event$target, TREE_SELECTOR)) === null || _event$target$closest2 === void 0 || (_event$target$closest3 = _event$target$closest2.querySelector) === null || _event$target$closest3 === void 0 ? void 0 : _event$target$closest3.call(_event$target$closest2, NOTIFICATION_SELECTOR)) !== null && _event$target$closest !== void 0 ? _event$target$closest : null;
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
	function requireEventTarget(root) {
		if (typeof (root === null || root === void 0 ? void 0 : root.addEventListener) !== "function" || typeof (root === null || root === void 0 ? void 0 : root.removeEventListener) !== "function") throw new TypeError("Tailwind tree notifications require a document event target.");
		return root;
	}
	//#endregion
	//#region resources/js/themes/shadcn/theme.js
	if (globalThis.document) installTailwindTheme(globalThis);
	//#endregion
})();

//# sourceMappingURL=shadcn.js.map