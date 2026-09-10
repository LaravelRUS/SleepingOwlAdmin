(function() {
	//#region resources/js/shared/modules/browser.js
	if (globalThis.document) bootCompatibilityModules(globalThis);
	function bootCompatibilityModules(target) {
		var _admin$Modules;
		const admin = target.Admin;
		if (typeof (admin === null || admin === void 0 || (_admin$Modules = admin.Modules) === null || _admin$Modules === void 0 ? void 0 : _admin$Modules.boot) !== "function" || !(admin === null || admin === void 0 ? void 0 : admin.Components)) throw new TypeError("Compatibility modules require Admin.Modules and Admin.Components.");
		admin.Modules.boot();
		return admin.Components.scan(target.document);
	}
	//#endregion
})();

//# sourceMappingURL=modules.js.map