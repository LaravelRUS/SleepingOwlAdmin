export class VueAppPlugins {
    constructor() {
        this.plugins = []
        this.registered = new Set()
    }

    use(plugin, ...options) {
        assertPlugin(plugin)
        if (this.registered.has(plugin)) return plugin

        this.registered.add(plugin)
        this.plugins.push({ options, plugin })

        return plugin
    }

    install(app) {
        assertUse(app)
        this.plugins.forEach(({ options, plugin }) => app.use(plugin, ...options))

        return app
    }
}

export function createVueAppPlugins() {
    return new VueAppPlugins()
}

function assertPlugin(plugin) {
    const valid = typeof plugin === 'function' || typeof plugin?.install === 'function'
    if (!valid) throw new TypeError('Vue app plugin must be a function or expose install().')
}

function assertUse(app) {
    if (typeof app?.use !== 'function') {
        throw new TypeError('Vue app plugin installation requires app.use().')
    }
}
