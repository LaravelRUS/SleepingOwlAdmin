import { expect, it, vi } from 'vitest'

import {
    bindFilterControls,
    clearFilterControls,
} from '../../../../resources/frontend/features/table/filters/filter-controls.js'

function interactiveControl(properties = {}) {
    const listeners = new Map()

    return {
        addEventListener: vi.fn((type, listener) => listeners.set(type, listener)),
        emit: (type, event = {}) => listeners.get(type)?.({ type, ...event }),
        ...properties,
    }
}

it('binds execute, clear and enter reload through native events', () => {
    const executeButton = interactiveControl()
    const clearButton = interactiveControl()
    const input = interactiveControl()
    const callbacks = { clear: vi.fn(), execute: vi.fn(), reload: vi.fn() }
    const container = {
        querySelectorAll: (selector) =>
            ({
                '#filters-cancel': [clearButton],
                '#filters-exec': [executeButton],
                '[data-index] input': [input],
            })[selector],
    }

    bindFilterControls(container, callbacks)
    executeButton.emit('click')
    clearButton.emit('click')
    input.emit('keyup', { key: 'Escape', keyCode: 27 })
    input.emit('keyup', { key: 'Enter', keyCode: 13 })

    expect(callbacks.execute).toHaveBeenCalledOnce()
    expect(callbacks.clear).toHaveBeenCalledOnce()
    expect(callbacks.reload).toHaveBeenCalledOnce()
})

it('clears inputs and selects and emits a bubbling native change', () => {
    const ownerDocument = { defaultView: { Event: globalThis.Event } }
    const input = {
        dispatchEvent: vi.fn(),
        ownerDocument,
        value: 'Alice',
    }
    const options = [{ selected: true }, { selected: true }]
    const select = {
        dispatchEvent: vi.fn(),
        options,
        ownerDocument,
        selectedIndex: 1,
    }
    const container = { querySelectorAll: () => [input, select] }

    clearFilterControls([container])

    expect(input.value).toBe('')
    expect(options.every((option) => option.selected === false)).toBe(true)
    expect(select.selectedIndex).toBe(-1)
    for (const item of [input, select]) {
        expect(item.dispatchEvent).toHaveBeenCalledOnce()
        expect(item.dispatchEvent.mock.calls[0][0]).toMatchObject({
            bubbles: true,
            type: 'change',
        })
    }
})

it('rejects incomplete control callbacks', () => {
    const container = { querySelectorAll: vi.fn() }

    expect(() =>
        bindFilterControls(container, { clear: vi.fn(), execute: null, reload: vi.fn() }),
    ).toThrow('clear, execute and reload callbacks')
})
