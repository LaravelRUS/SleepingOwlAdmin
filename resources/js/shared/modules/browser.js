if (globalThis.document) bootCompatibilityModules(globalThis)

export function bootCompatibilityModules(target) {
    const admin = target.Admin
    if (typeof admin?.Modules?.boot !== 'function' || !admin?.Components) {
        throw new TypeError('Compatibility modules require Admin.Modules and Admin.Components.')
    }

    admin.Modules.boot()

    return admin.Components.scan(target.document)
}
