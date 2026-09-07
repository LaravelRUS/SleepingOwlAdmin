import { selectedRowValues } from '../selection/selected-rows.js'

export class DataTableAdapter {
    constructor({ element, engineInstance, registry, serverSide = false }) {
        this.element = element
        this.engineInstance = engineInstance
        this.registry = registry
        this.serverSide = serverSide
    }

    reload(resetPaging) {
        return resetPaging === undefined
            ? this.engineInstance.draw()
            : this.engineInstance.draw(resetPaging)
    }

    refresh() {
        if (this.serverSide) return this.reload(false)

        return this.engineInstance.rows().invalidate('dom').draw(false)
    }

    refreshRow(row) {
        if (this.serverSide || !row) return this.reload(false)

        return this.engineInstance.row(row).invalidate('dom').draw(false)
    }

    destroy() {
        try {
            return this.engineInstance.destroy()
        } finally {
            this.registry.unregister(this.element)
        }
    }

    clearState() {
        return this.engineInstance.state.clear()
    }

    selectedRows() {
        return selectedRowValues(this.element)
    }
}

export function mountDataTable({ createEngine, element, options, registry }) {
    assertMountDependencies(createEngine, registry)

    const engineInstance = createEngine(element, options)
    const adapter = new DataTableAdapter({
        element,
        engineInstance,
        registry,
        serverSide: Boolean(options.serverSide),
    })

    return registry.register(adapter)
}

function assertMountDependencies(createEngine, registry) {
    if (typeof createEngine !== 'function' || typeof registry?.register !== 'function') {
        throw new TypeError('Table mount requires an engine factory and table registry.')
    }
}
