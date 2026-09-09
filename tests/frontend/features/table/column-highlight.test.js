import { expect, it, vi } from 'vitest'

import {
    highlightColumn,
    syncColumnHighlight,
} from '../../../../resources/js/shared/features/table/hooks/column-highlight.js'

function node() {
    return { classList: { add: vi.fn(), remove: vi.fn() } }
}

it('replaces the highlighted cells with the hovered DataTables column', () => {
    const allCells = [node(), node(), node()]
    const columnCells = [allCells[1], allCells[2]]
    const cell = {}
    const table = {
        cell: vi.fn(() => ({ index: () => ({ column: 2 }) })),
        cells: () => ({ nodes: () => allCells }),
        column: vi.fn(() => ({ nodes: () => columnCells })),
        data: () => ({ any: () => true }),
    }

    highlightColumn(table, cell)

    expect(table.cell).toHaveBeenCalledWith(cell)
    expect(table.column).toHaveBeenCalledWith(2)
    allCells.forEach((item) => expect(item.classList.remove).toHaveBeenCalledWith('highlight'))
    columnCells.forEach((item) => expect(item.classList.add).toHaveBeenCalledWith('highlight'))
})

it('does not inspect a cell when the table has no data', () => {
    const table = {
        cell: vi.fn(),
        data: () => ({ any: () => false }),
    }

    highlightColumn(table, {})

    expect(table.cell).not.toHaveBeenCalled()
})

it('binds one delegated listener, updates its table API and removes it when disabled', () => {
    let listener
    const cell = { contains: () => false }
    const element = {
        addEventListener: vi.fn((event, callback) => {
            listener = callback
        }),
        contains: () => true,
        removeEventListener: vi.fn(),
    }
    const previousTable = { data: () => ({ any: () => false }) }
    const currentTable = {
        cell: vi.fn(() => ({ index: () => ({ column: 0 }) })),
        cells: () => ({ nodes: () => [] }),
        column: () => ({ nodes: () => [] }),
        data: () => ({ any: () => true }),
    }

    const firstDestroy = syncColumnHighlight(element, previousTable, true)
    const secondDestroy = syncColumnHighlight(element, currentTable, true)
    listener({ relatedTarget: null, target: { closest: () => cell } })

    expect(firstDestroy).toBe(secondDestroy)
    expect(element.addEventListener).toHaveBeenCalledOnce()
    expect(currentTable.cell).toHaveBeenCalledWith(cell)

    syncColumnHighlight(element, currentTable, false)
    expect(element.removeEventListener).toHaveBeenCalledOnce()
})
