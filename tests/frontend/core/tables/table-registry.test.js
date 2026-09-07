import { describe, expect, it, vi } from 'vitest'

import {
    assertTableAdapter,
    createTableRegistry,
    TableRegistry,
} from '../../../../resources/frontend/core/tables/table-registry.js'

function createElement(id = 'orders') {
    return { id, nodeType: 1 }
}

function createAdapter(element = createElement()) {
    return {
        clearState: vi.fn(),
        destroy: vi.fn(),
        element,
        engineInstance: { name: 'fixture-engine' },
        reload: vi.fn(),
        selectedRows: vi.fn(() => []),
    }
}

describe('TableRegistry', () => {
    it('registers and resolves an engine-neutral table adapter by its element', () => {
        const registry = createTableRegistry()
        const adapter = createAdapter()

        expect(registry).toBeInstanceOf(TableRegistry)
        expect(registry.register(adapter)).toBe(adapter)
        expect(registry.get(adapter.element)).toBe(adapter)
        expect(registry.has(adapter.element)).toBe(true)
        expect(registry.all()).toEqual([adapter])
    })

    it('makes repeated registration idempotent but rejects a second adapter', () => {
        const registry = createTableRegistry()
        const adapter = createAdapter()

        registry.register(adapter)

        expect(registry.register(adapter)).toBe(adapter)
        expect(() => registry.register(createAdapter(adapter.element))).toThrow(
            'A table adapter is already registered for this element.',
        )
    })

    it('unregisters without destroying the adapter implicitly', () => {
        const registry = createTableRegistry()
        const adapter = createAdapter()
        registry.register(adapter)

        expect(registry.unregister(adapter.element)).toBe(adapter)
        expect(registry.unregister(adapter.element)).toBeNull()
        expect(registry.all()).toEqual([])
        expect(adapter.destroy).not.toHaveBeenCalled()
    })
})

describe('TableRegistry subscriptions', () => {
    it('notifies when adapters are registered and unregistered', () => {
        const registry = createTableRegistry()
        const listener = vi.fn()
        const adapter = createAdapter()
        const unsubscribe = registry.subscribe(listener)

        registry.register(adapter)
        registry.register(adapter)
        registry.unregister(adapter.element)

        expect(listener.mock.calls).toEqual([
            [{ adapter, type: 'registered' }],
            [{ adapter, type: 'unregistered' }],
        ])

        unsubscribe()
        registry.register(adapter)
        expect(listener).toHaveBeenCalledTimes(2)
    })
})

describe('TableRegistry operations', () => {
    it('runs reload and clear state for one adapter or all registered adapters', () => {
        const registry = createTableRegistry()
        const first = createAdapter(createElement('first'))
        const second = createAdapter(createElement('second'))
        first.reload.mockReturnValue('first reload')
        second.reload.mockReturnValue('second reload')
        first.clearState.mockReturnValue('first clear')
        second.clearState.mockReturnValue('second clear')
        registry.register(first)
        registry.register(second)

        expect(registry.reload(first.element)).toBe('first reload')
        expect(registry.reload()).toEqual(['first reload', 'second reload'])
        expect(registry.clearState(second.element)).toBe('second clear')
        expect(registry.clearState()).toEqual(['first clear', 'second clear'])
        expect(first.reload).toHaveBeenCalledTimes(2)
        expect(second.reload).toHaveBeenCalledOnce()
        expect(first.clearState).toHaveBeenCalledOnce()
        expect(second.clearState).toHaveBeenCalledTimes(2)
    })

    it('returns selected rows for one table and diagnoses invalid adapters', () => {
        const registry = createTableRegistry()
        const adapter = createAdapter()
        adapter.selectedRows.mockReturnValue(['10', '20'])
        registry.register(adapter)

        expect(registry.selectedRows(adapter.element)).toEqual(['10', '20'])
        expect(() => registry.require(createElement('missing'))).toThrow(
            'No table adapter is registered',
        )

        adapter.selectedRows.mockReturnValue(null)
        expect(() => registry.selectedRows(adapter.element)).toThrow('must return an array')
    })
})

describe('table adapter contract', () => {
    it('accepts a null engine instance when the property is explicit', () => {
        const adapter = createAdapter()
        adapter.engineInstance = null

        expect(() => assertTableAdapter(adapter)).not.toThrow()
    })

    it.each([
        [null, 'must be an object'],
        [{}, 'element must be a DOM Element'],
        [{ ...createAdapter(), engineInstance: undefined }, 'must expose engineInstance'],
        [{ ...createAdapter(), reload: null }, 'must implement reload()'],
        [{ ...createAdapter(), destroy: null }, 'must implement destroy()'],
        [{ ...createAdapter(), clearState: null }, 'must implement clearState()'],
        [{ ...createAdapter(), selectedRows: null }, 'must implement selectedRows()'],
    ])('validates adapter %#', (adapter, message) => {
        if (message === null) {
            expect(() => assertTableAdapter(adapter)).not.toThrow()
            return
        }

        expect(() => assertTableAdapter(adapter)).toThrow(message)
    })

    it('requires the engineInstance property', () => {
        const adapter = createAdapter()
        delete adapter.engineInstance

        expect(() => assertTableAdapter(adapter)).toThrow('must expose engineInstance')
    })
})
