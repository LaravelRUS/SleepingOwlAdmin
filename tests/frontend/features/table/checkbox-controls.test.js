import { expect, it, vi } from 'vitest'

import {
    bindTableCheckboxes,
    updateRowSelection,
} from '../../../../resources/js/shared/features/table/selection/checkbox-controls.js'

function createRoot() {
    let listener

    return {
        addEventListener: vi.fn((_type, callback) => {
            listener = callback
        }),
        contains: () => true,
        emit: (event) => listener(event),
        removeEventListener: vi.fn(),
    }
}

function createRow() {
    return {
        classList: { toggle: vi.fn() },
        setAttribute: vi.fn(),
        toggleAttribute: vi.fn(),
    }
}

function createRowCheckbox(root, checked = false) {
    const row = createRow()
    const checkbox = {
        checked,
        classList: { contains: () => false },
        closest: (selector) => (selector === 'tr' ? row : checkbox),
        dispatchEvent: vi.fn((event) => root.emit({ target: checkbox, type: event.type })),
        ownerDocument: { defaultView: { Event: globalThis.Event } },
    }

    return { checkbox, row }
}

it('marks a selected row with neutral state and an injected legacy class', () => {
    const row = createRow()
    const checkbox = { checked: true, closest: () => row }

    updateRowSelection(checkbox, 'info')

    expect(row.toggleAttribute).toHaveBeenCalledWith('data-selected', true)
    expect(row.setAttribute).toHaveBeenCalledWith('aria-selected', 'true')
    expect(row.classList.toggle).toHaveBeenCalledWith('info', true)
})

it('selects only rows in the closest table and dispatches native changes', () => {
    const root = createRoot()
    const first = createRowCheckbox(root)
    const second = createRowCheckbox(root, true)
    const table = { querySelectorAll: () => [first.checkbox, second.checkbox] }
    const selectAll = {
        checked: true,
        classList: { contains: (name) => name === 'adminCheckboxAll' },
        closest: (selector) => (selector === 'table' ? table : selectAll),
    }
    bindTableCheckboxes({ root, selectedRowClass: 'info' })

    root.emit({ target: selectAll })

    expect(first.checkbox.checked).toBe(true)
    expect(first.checkbox.dispatchEvent).toHaveBeenCalledOnce()
    expect(first.row.classList.toggle).toHaveBeenCalledWith('info', true)
    expect(second.checkbox.dispatchEvent).not.toHaveBeenCalled()
    expect(second.row.classList.toggle).toHaveBeenCalledWith('info', true)
})
