export const componentMountSkipped = Symbol.for('sleepingowl.component-mount-skipped')

export class ComponentLifecycle {
    constructor() {
        this.definitions = []
        this.definitionsByName = new Map()
        this.records = new Set()
        this.recordsByElement = new WeakMap()
    }

    register(definition) {
        const normalized = normalizeDefinition(definition)
        if (this.definitionsByName.has(normalized.name)) {
            throw new Error(`Component ${normalized.name} is already registered.`)
        }

        this.definitions.push(normalized)
        this.definitionsByName.set(normalized.name, normalized)

        return () => this.unregister(normalized.name)
    }

    unregister(name) {
        const definition = this.definitionsByName.get(name)
        if (!definition) return false

        this.definitions = this.definitions.filter((item) => item !== definition)
        this.definitionsByName.delete(name)
        this.destroyRecords(recordsForDefinition(this.records, definition))

        return true
    }

    scan(root = globalThis.document, name) {
        assertRoot(root)

        return this.resolveDefinitions(name).reduce(
            (count, definition) =>
                count +
                matchingElements(root, definition.selector).reduce(
                    (mounted, element) => mounted + this.mountDefinition(element, definition),
                    0,
                ),
            0,
        )
    }

    mount(element) {
        assertElement(element)

        return this.definitions.reduce(
            (count, definition) =>
                count +
                (element.matches(definition.selector)
                    ? this.mountDefinition(element, definition)
                    : 0),
            0,
        )
    }

    destroy(root, name) {
        assertRoot(root)

        return this.destroyRecords(recordsInside(this.records, root, name))
    }

    get(element, name) {
        return this.recordsByElement.get(element)?.get(name)?.instance
    }

    mountDefinition(element, definition) {
        if (this.recordsByElement.get(element)?.has(definition.name)) return 0

        const record = { definition, element, instance: undefined }
        this.track(record)

        try {
            record.instance = definition.mount(element)
        } catch (error) {
            this.untrack(record)
            throw error
        }

        if (record.instance === componentMountSkipped) {
            this.untrack(record)

            return 0
        }

        return 1
    }

    resolveDefinitions(name) {
        if (name === undefined) return this.definitions

        const definition = this.definitionsByName.get(name)

        return definition ? [definition] : []
    }

    destroyRecords(records) {
        const errors = []
        records.forEach((record) => {
            if (!this.records.has(record)) return

            this.untrack(record)
            try {
                destroyRecord(record)
            } catch (error) {
                errors.push(error)
            }
        })
        throwCleanupErrors(errors)

        return records.length
    }

    track(record) {
        const elementRecords = this.recordsByElement.get(record.element) ?? new Map()
        elementRecords.set(record.definition.name, record)
        this.recordsByElement.set(record.element, elementRecords)
        this.records.add(record)
    }

    untrack(record) {
        const elementRecords = this.recordsByElement.get(record.element)
        elementRecords?.delete(record.definition.name)
        if (elementRecords?.size === 0) this.recordsByElement.delete(record.element)
        this.records.delete(record)
    }
}

export function createComponentLifecycle() {
    return new ComponentLifecycle()
}

function normalizeDefinition(definition) {
    if (!definition || typeof definition !== 'object') {
        throw new TypeError('Component definition must be an object.')
    }
    assertNonEmptyString(definition.name, 'name')
    assertNonEmptyString(definition.selector, 'selector')
    if (typeof definition.mount !== 'function') {
        throw new TypeError('Component definition mount must be a function.')
    }
    if (definition.destroy !== undefined && typeof definition.destroy !== 'function') {
        throw new TypeError('Component definition destroy must be a function when provided.')
    }

    return Object.freeze({
        destroy: definition.destroy ?? null,
        mount: definition.mount,
        name: definition.name,
        selector: definition.selector,
    })
}

function matchingElements(root, selector) {
    const descendants = [...root.querySelectorAll(selector)]
    if (typeof root.matches === 'function' && root.matches(selector)) descendants.unshift(root)

    return descendants
}

function recordsInside(records, root, name) {
    return [...records]
        .filter((record) => root === record.element || root.contains(record.element))
        .filter((record) => name === undefined || record.definition.name === name)
        .reverse()
}

function recordsForDefinition(records, definition) {
    return [...records].filter((record) => record.definition === definition).reverse()
}

function destroyRecord({ definition, element, instance }) {
    if (definition.destroy) return definition.destroy(element, instance)
    if (typeof instance === 'function') return instance()
    if (typeof instance?.destroy === 'function') return instance.destroy()
}

function throwCleanupErrors(errors) {
    if (errors.length === 1) throw errors[0]
    if (errors.length > 1) {
        throw new AggregateError(errors, 'Multiple component destroy callbacks failed.')
    }
}

function assertRoot(root) {
    if (typeof root?.querySelectorAll !== 'function' || typeof root?.contains !== 'function') {
        throw new TypeError('Component lifecycle root must be a DOM query root.')
    }
}

function assertElement(element) {
    if (!element || element.nodeType !== 1 || typeof element.matches !== 'function') {
        throw new TypeError('Component lifecycle mount requires an Element.')
    }
}

function assertNonEmptyString(value, field) {
    if (typeof value !== 'string' || value.length === 0) {
        throw new TypeError(`Component definition ${field} must be a non-empty string.`)
    }
}
