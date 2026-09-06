import { parseJsonProps } from '../../core/data/island-props'

export const vueAppSelector = '[data-soa-vue-app]'

export class VueAppRegistry {
    constructor(createApp, components = {}) {
        assertFunction(createApp, 'createApp')
        this.createApp = createApp
        this.components = componentEntries(components)
        this.componentMap = new Map(this.components)
        this.apps = new Map()
    }

    get size() {
        return this.apps.size
    }

    mount(element) {
        assertElement(element)
        if (this.apps.has(element)) return this.apps.get(element)

        const root = resolveRootComponent(element, this.componentMap)
        const app = this.createApp(root.component, root.props)
        assertApp(app)
        registerComponents(app, this.components)
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

export function createVueAppRegistry(createApp, components) {
    return new VueAppRegistry(createApp, components)
}

function registerComponents(app, components) {
    components.forEach(([name, component]) => app.component(name, component))
}

function resolveRootComponent(element, components) {
    const name = element.dataset?.soaVueComponent
    if (!name) return { component: {}, props: undefined }

    const component = components.get(name)
    if (!component) {
        throw new Error(`Unknown Vue app component [${name}].`)
    }

    return {
        component,
        props: parseJsonProps(readPropsSource(element)),
    }
}

function readPropsSource(element) {
    const propsId = element.dataset?.soaVuePropsId
    if (!propsId) return element.dataset?.soaVueProps || '{}'

    return readReferencedProps(element, propsId)
}

function readReferencedProps(element, propsId) {
    const script = element.ownerDocument?.getElementById(propsId)
    if (!script) throw new Error(`Vue app props script [${propsId}] was not found.`)
    assertJsonPropsScript(script, propsId)

    return script.textContent || '{}'
}

function assertJsonPropsScript(script, propsId) {
    if (script.tagName === 'SCRIPT' && script.type === 'application/json') return

    throw new TypeError(`Vue app props [${propsId}] must reference an application/json script.`)
}

function componentEntries(components) {
    if (!components || typeof components !== 'object' || Array.isArray(components)) {
        throw new TypeError('Vue app components must be an object.')
    }

    return Object.entries(components).map(validateComponent)
}

function validateComponent([name, component]) {
    const validDefinition = component !== null && ['function', 'object'].includes(typeof component)

    if (!name.trim() || !validDefinition) {
        throw new TypeError('Vue app component entries require a name and definition.')
    }

    return [name, component]
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
    assertFunction(app?.component, 'Vue app component registration')
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
