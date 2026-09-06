const ADAPTER_METHODS = ['reload', 'destroy', 'clearState', 'selectedRows']

export class TableRegistry {
    constructor() {
        this.adapters = new Map()
    }

    register(adapter) {
        assertTableAdapter(adapter)

        const current = this.adapters.get(adapter.element)
        if (current && current !== adapter) {
            throw new Error('A table adapter is already registered for this element.')
        }

        this.adapters.set(adapter.element, adapter)

        return adapter
    }

    unregister(element) {
        assertElement(element)

        const adapter = this.adapters.get(element) ?? null
        this.adapters.delete(element)

        return adapter
    }

    get(element) {
        assertElement(element)

        return this.adapters.get(element) ?? null
    }

    require(element) {
        const adapter = this.get(element)

        if (!adapter) {
            throw new Error('No table adapter is registered for this element.')
        }

        return adapter
    }

    has(element) {
        assertElement(element)

        return this.adapters.has(element)
    }

    all() {
        return [...this.adapters.values()]
    }

    reload(element) {
        return invokeAdapters(this, 'reload', element)
    }

    clearState(element) {
        return invokeAdapters(this, 'clearState', element)
    }

    selectedRows(element) {
        const rows = this.require(element).selectedRows()

        if (!Array.isArray(rows)) {
            throw new TypeError('Table adapter selectedRows() must return an array.')
        }

        return rows
    }
}

export function createTableRegistry() {
    return new TableRegistry()
}

export function assertTableAdapter(adapter) {
    if (!adapter || typeof adapter !== 'object') {
        throw new TypeError('Table adapter must be an object.')
    }

    assertElement(adapter.element)
    assertEngineInstance(adapter)

    for (const method of ADAPTER_METHODS) {
        assertAdapterMethod(adapter, method)
    }
}

function assertElement(element) {
    if (!element || typeof element !== 'object' || element.nodeType !== 1) {
        throw new TypeError('Table adapter element must be a DOM Element.')
    }
}

function assertEngineInstance(adapter) {
    if (!('engineInstance' in adapter) || adapter.engineInstance === undefined) {
        throw new TypeError('Table adapter must expose engineInstance.')
    }
}

function assertAdapterMethod(adapter, method) {
    if (typeof adapter[method] !== 'function') {
        throw new TypeError(`Table adapter must implement ${method}().`)
    }
}

function invokeAdapters(registry, method, element) {
    if (element !== undefined) {
        return registry.require(element)[method]()
    }

    return registry.all().map((adapter) => adapter[method]())
}
