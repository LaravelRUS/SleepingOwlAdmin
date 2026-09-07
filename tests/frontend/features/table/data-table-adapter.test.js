import { expect, it, vi } from 'vitest'

import {
    DataTableAdapter,
    mountDataTable,
} from '../../../../resources/frontend/features/table/lifecycle/data-table-adapter.js'

function engine() {
    const rowApi = {
        draw: vi.fn(() => 'row drawn'),
        invalidate: vi.fn(),
    }
    rowApi.invalidate.mockReturnValue(rowApi)
    const rowsApi = {
        draw: vi.fn(() => 'table drawn'),
        invalidate: vi.fn(),
    }
    rowsApi.invalidate.mockReturnValue(rowsApi)

    return {
        destroy: vi.fn(() => 'destroyed'),
        draw: vi.fn(() => 'drawn'),
        row: vi.fn(() => rowApi),
        rowApi,
        rows: vi.fn(() => rowsApi),
        rowsApi,
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

it('refreshes one DOM row for client-side data and keeps its current page', () => {
    const row = { nodeType: 1 }
    const engineInstance = engine()
    const adapter = new DataTableAdapter({
        element: { nodeType: 1 },
        engineInstance,
        registry: { unregister: vi.fn() },
    })

    expect(adapter.refreshRow(row)).toBe('row drawn')
    expect(engineInstance.row).toHaveBeenCalledWith(row)
    expect(engineInstance.rowApi.invalidate).toHaveBeenCalledWith('dom')
    expect(engineInstance.rowApi.draw).toHaveBeenCalledWith(false)
    expect(engineInstance.draw).not.toHaveBeenCalled()
})

it('refreshes all DOM rows for client-side data and keeps its current page', () => {
    const engineInstance = engine()
    const adapter = new DataTableAdapter({
        element: { nodeType: 1 },
        engineInstance,
        registry: { unregister: vi.fn() },
    })

    expect(adapter.refresh()).toBe('table drawn')
    expect(engineInstance.rows).toHaveBeenCalledOnce()
    expect(engineInstance.rowsApi.invalidate).toHaveBeenCalledWith('dom')
    expect(engineInstance.rowsApi.draw).toHaveBeenCalledWith(false)
    expect(engineInstance.draw).not.toHaveBeenCalled()
})

it('reloads the current server-side page when a row changes', () => {
    const engineInstance = engine()
    const adapter = new DataTableAdapter({
        element: { nodeType: 1 },
        engineInstance,
        registry: { unregister: vi.fn() },
        serverSide: true,
    })

    expect(adapter.refreshRow({ nodeType: 1 })).toBe('drawn')
    expect(engineInstance.draw).toHaveBeenCalledWith(false)
    expect(engineInstance.row).not.toHaveBeenCalled()
    expect(adapter.refresh()).toBe('drawn')
    expect(engineInstance.draw).toHaveBeenLastCalledWith(false)
    expect(engineInstance.rows).not.toHaveBeenCalled()
})
