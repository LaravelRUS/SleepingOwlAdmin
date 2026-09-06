import { describe, expect, it, vi } from 'vitest'

import {
    clearFilterState,
    clearSavedTableSearch,
    filterStateKey,
    loadFilterState,
    saveFilterState,
} from '../../../../resources/frontend/features/table/state/filter-state.js'

function storage(initial = {}) {
    const values = new Map(Object.entries(initial))

    return {
        getItem: vi.fn((key) => values.get(key) ?? null),
        removeItem: vi.fn((key) => values.delete(key)),
        setItem: vi.fn((key, value) => values.set(key, value)),
        value: (key) => values.get(key),
    }
}

function textFixture(value = 'Alice') {
    const control = {
        dataset: { type: 'text' },
        dispatchEvent: vi.fn(),
        value,
    }
    const column = {
        dataset: { index: '1' },
        querySelector: () => control,
    }
    const container = {
        querySelectorAll: () => [column],
    }

    return { column, container, control }
}

describe('filter state', () => {
    it('keeps the legacy key and normalizes edit routes', () => {
        expect(filterStateKey('orders')).toBe('Filters_/orders')
        expect(filterStateKey('orders/42/edit')).toBe('Filters_/orders/edit')
    })

    it('serializes non-empty filter values without clearing unrelated storage', () => {
        const repository = storage()
        const { container } = textFixture()

        saveFilterState(repository, 'Filters_/orders', [container])

        expect(JSON.parse(repository.value('Filters_/orders'))).toEqual({
            0: { 1: { type: 'text', val: 'Alice' } },
        })
    })

    it('restores values and dispatches a native change event', () => {
        const state = JSON.stringify({ 0: { 1: { type: 'text', val: 'Restored' } } })
        const repository = storage({ 'Filters_/orders': state })
        const { container, control } = textFixture('')

        loadFilterState(repository, 'Filters_/orders', [container])

        expect(control.value).toBe('Restored')
        expect(control.dispatchEvent).toHaveBeenCalledOnce()
        expect(control.dispatchEvent.mock.calls[0][0]).toBeInstanceOf(globalThis.Event)
    })

    it('clears only the requested filter key and saved DataTables searches', () => {
        const repository = storage({ 'Filters_/orders': '{}', unrelated: 'keep' })
        const state = {
            columns: [{ search: { search: 'column' } }],
            search: { search: 'global' },
        }

        clearFilterState(repository, 'Filters_/orders')
        clearSavedTableSearch(null, state)

        expect(repository.value('Filters_/orders')).toBeUndefined()
        expect(repository.value('unrelated')).toBe('keep')
        expect(state).toEqual({
            columns: [{ search: { search: '' } }],
            search: { search: '' },
        })
    })
})
