export class VueComponentCatalog {
    constructor(components = {}) {
        assertComponentObject(components)
        this.components = new Map()
        Object.entries(components).forEach(([name, component]) => this.register(name, component))
    }

    register(name, component) {
        const entry = validateComponent(name, component)
        if (this.components.has(entry.name)) {
            throw new Error(`Vue app component [${entry.name}] is already registered.`)
        }

        this.components.set(entry.name, entry.component)

        return entry.component
    }

    has(name) {
        return this.components.has(name)
    }

    get(name) {
        return this.components.get(name)
    }

    entries() {
        return [...this.components.entries()]
    }
}

export function createVueComponentCatalog(components) {
    return new VueComponentCatalog(components)
}

function validateComponent(name, component) {
    const validDefinition = component !== null && ['function', 'object'].includes(typeof component)

    if (typeof name !== 'string' || !name.trim() || !validDefinition) {
        throw new TypeError('Vue app component entries require a name and definition.')
    }

    return { component, name }
}

function assertComponentObject(components) {
    if (!components || typeof components !== 'object' || Array.isArray(components)) {
        throw new TypeError('Vue app components must be an object.')
    }
}
