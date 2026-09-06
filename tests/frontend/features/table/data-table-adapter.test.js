import { expect, it, vi } from 'vitest'

import {
    DataTableAdapter,
    mountDataTable,
} from '../../../../resources/frontend/features/table/lifecycle/data-table-adapter.js'

function engine() {
    return {
        destroy: vi.fn(() => 'destroyed'),
        draw: vi.fn(() => 'drawn'),
        state: { clear: vi.fn(() => 'cleared') },
    }
}

it('mounts an adapter around a concrete engine and registers it', () => {
    const element = { nodeType: 1, querySelectorAll: () => [] }
    const engineInstance = engine()
    const registry = { register: vi.fn((adapter) => adapter), unregister: vi.fn() }
    const createEngine = vi.fn(() => engineInstance)
    const adapter = mountDataTable({ createEngine, element, options: { pageLength: 25 }, registry })

    expect(adapter).toBeInstanceOf(DataTableAdapter)
    expect(createEngine).toHaveBeenCalledWith(element, { pageLength: 25 })
    expect(registry.register).toHaveBeenCalledWith(adapter)
    expect(adapter.engineInstance).toBe(engineInstance)
})

it('delegates the public adapter contract and unregisters after destroy', () => {
    const element = {
        nodeType: 1,
        querySelectorAll: () => [{ value: '10' }, { value: '20' }],
    }
    const engineInstance = engine()
    const registry = { unregister: vi.fn() }
    const adapter = new DataTableAdapter({ element, engineInstance, registry })

    expect(adapter.reload()).toBe('drawn')
    expect(adapter.clearState()).toBe('cleared')
    expect(adapter.selectedRows()).toEqual(['10', '20'])
    expect(adapter.destroy()).toBe('destroyed')
    expect(registry.unregister).toHaveBeenCalledWith(element)
})
