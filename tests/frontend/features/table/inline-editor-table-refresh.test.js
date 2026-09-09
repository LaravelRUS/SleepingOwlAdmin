import { expect, it, vi } from 'vitest'

import { bindInlineEditorTableRefresh } from '../../../../resources/js/shared/features/table/editing/inline-editor-table-refresh.js'

function eventRoot() {
    const listeners = new Map()

    return {
        addEventListener: vi.fn((name, listener) => listeners.set(name, listener)),
        dispatch(name, target) {
            listeners.get(name)?.({ target })
        },
        removeEventListener: vi.fn((name) => listeners.delete(name)),
    }
}

it('refreshes only the table containing a successfully edited trigger', () => {
    const root = eventRoot()
    const row = { id: 'row-17' }
    const table = { id: 'orders' }
    const trigger = {
        closest: vi.fn((selector) => (selector === 'table.datatables' ? table : row)),
    }
    const adapter = { refreshRow: vi.fn() }
    const tables = { get: vi.fn((element) => (element === table ? adapter : null)) }
    const scheduled = []
    const destroy = bindInlineEditorTableRefresh(root, tables, 'row', (callback) =>
        scheduled.push(callback),
    )

    root.dispatch('inline-edit:submitted', trigger)
    expect(adapter.refreshRow).not.toHaveBeenCalled()

    scheduled[0]()
    expect(tables.get).toHaveBeenCalledWith(table)
    expect(adapter.refreshRow).toHaveBeenCalledWith(row)

    destroy()
    expect(root.removeEventListener).toHaveBeenCalledWith(
        'inline-edit:submitted',
        expect.any(Function),
    )
})

it('ignores successful edits outside registered DataTables', () => {
    const root = eventRoot()
    const tables = { get: vi.fn(() => null) }
    const schedule = vi.fn()
    const trigger = { closest: vi.fn(() => null) }

    bindInlineEditorTableRefresh(root, tables, 'row', schedule)
    root.dispatch('inline-edit:submitted', trigger)

    expect(tables.get).not.toHaveBeenCalled()
    expect(schedule).not.toHaveBeenCalled()
})

it('reloads the containing table when table mode is selected', () => {
    const root = eventRoot()
    const row = { id: 'row-17' }
    const table = { id: 'orders' }
    const trigger = {
        closest: vi.fn((selector) => (selector === 'table.datatables' ? table : row)),
    }
    const adapter = { refresh: vi.fn(), refreshRow: vi.fn(), reload: vi.fn() }
    const tables = { get: vi.fn(() => adapter) }

    bindInlineEditorTableRefresh(root, tables, 'table', (callback) => callback())
    root.dispatch('inline-edit:submitted', trigger)

    expect(adapter.refresh).toHaveBeenCalledOnce()
    expect(adapter.reload).not.toHaveBeenCalled()
    expect(adapter.refreshRow).not.toHaveBeenCalled()
})
