import { vueAppLifecycleName } from './app-lifecycle'

export function createVueExtensionApi(options) {
    assertOptions(options)
    const { catalog, lifecycle, plugins, runtime } = options
    const defaultRoot = options.root ?? globalThis.document

    function scan(root = defaultRoot) {
        return lifecycle.scan(root, vueAppLifecycleName)
    }

    function destroy(root = defaultRoot) {
        return lifecycle.destroy(root, vueAppLifecycleName)
    }

    function register(name, component) {
        const registered = catalog.register(name, component)
        scan()

        return registered
    }

    return Object.freeze({
        destroy,
        register,
        runtime,
        scan,
        use: (plugin, ...pluginOptions) => plugins.use(plugin, ...pluginOptions),
        version: runtime.version,
    })
}

function assertOptions(options) {
    if (!options || typeof options !== 'object') {
        throw new TypeError('Vue extension API options must be an object.')
    }

    assertMethod(options.catalog, 'register', 'component catalog')
    assertMethod(options.lifecycle, 'scan', 'component lifecycle')
    assertMethod(options.lifecycle, 'destroy', 'component lifecycle')
    assertMethod(options.plugins, 'use', 'app plugins')
    if (!options.runtime || typeof options.runtime !== 'object') {
        throw new TypeError('Vue extension API runtime must be an object.')
    }
}

function assertMethod(owner, method, name) {
    if (typeof owner?.[method] !== 'function') {
        throw new TypeError(`Vue extension API ${name} must expose ${method}().`)
    }
}
