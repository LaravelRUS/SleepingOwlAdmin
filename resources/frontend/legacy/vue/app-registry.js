export const vueAppSelector = '[data-soa-vue-app]'

export class VueAppRegistry {
    constructor(createApp) {
        assertFunction(createApp, 'createApp')
        this.createApp = createApp
        this.apps = new Map()
    }

    get size() {
        return this.apps.size
    }

    mount(element) {
        assertElement(element)
        if (this.apps.has(element)) return this.apps.get(element)

        const app = this.createApp({})
        assertApp(app)
        this.apps.set(element, app)

        try {
            app.mount(element)
        } catch (error) {
            this.apps.delete(element)
            throw error
        }

        return app
    }

    mountAll(root = globalThis.document) {
        assertRoot(root)

        return topLevelVueRoots(root).reduce((count, element) => {
            if (this.apps.has(element)) return count
            this.mount(element)

            return count + 1
        }, 0)
    }

    unmount(element) {
        const app = this.apps.get(element)
        if (!app) return false

        this.apps.delete(element)
        app.unmount()

        return true
    }

    unmountAll(root = globalThis.document) {
        assertRoot(root)
        const elements = [...this.apps.keys()].filter((element) => contains(root, element))

        elements.reverse().forEach((element) => this.unmount(element))

        return elements.length
    }

    get(element) {
        return this.apps.get(element)
    }
}

export function createVueAppRegistry(createApp) {
    return new VueAppRegistry(createApp)
}

function topLevelVueRoots(root) {
    return matchingElements(root).filter((element) => !hasVueRootAncestor(element))
}

function matchingElements(root) {
    const descendants = [...root.querySelectorAll(vueAppSelector)]
    if (typeof root.matches === 'function' && root.matches(vueAppSelector)) {
        descendants.unshift(root)
    }

    return descendants
}

function hasVueRootAncestor(element) {
    return Boolean(element.parentElement?.closest(vueAppSelector))
}

function contains(root, element) {
    return root === element || root.contains(element)
}

function assertApp(app) {
    assertFunction(app?.mount, 'Vue app mount')
    assertFunction(app?.unmount, 'Vue app unmount')
}

function assertFunction(value, name) {
    if (typeof value !== 'function') {
        throw new TypeError(`${name} must be a function.`)
    }
}

function assertRoot(root) {
    if (typeof root?.querySelectorAll !== 'function' || typeof root?.contains !== 'function') {
        throw new TypeError('Vue app scan root must be a DOM query root.')
    }
}

function assertElement(element) {
    if (!element || element.nodeType !== 1) {
        throw new TypeError('Vue app mount requires an Element.')
    }
}
