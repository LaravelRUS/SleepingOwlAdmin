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
