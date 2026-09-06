import { selectedRowValues } from '../selection/selected-rows.js'

export class DataTableAdapter {
    constructor({ element, engineInstance, registry }) {
        this.element = element
        this.engineInstance = engineInstance
        this.registry = registry
    }

    reload() {
        return this.engineInstance.draw()
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
    const adapter = new DataTableAdapter({ element, engineInstance, registry })

    return registry.register(adapter)
}

function assertMountDependencies(createEngine, registry) {
    if (typeof createEngine !== 'function' || typeof registry?.register !== 'function') {
        throw new TypeError('Table mount requires an engine factory and table registry.')
    }
}
