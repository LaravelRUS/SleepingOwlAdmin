import { expect, it, vi } from 'vitest'

import {
    clearFilterState,
    clearSavedTableSearch,
    filterStateKey,
    loadFilterState,
    migrateLegacyFilterState,
    saveFilterState,
} from '../../../../resources/js/shared/features/table/state/filter-state.js'

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

it('keeps the legacy key and adds a stable encoded table scope', () => {
    expect(filterStateKey('orders')).toBe('Filters_/orders')
    expect(filterStateKey('orders/42/edit')).toBe('Filters_/orders/edit')
    expect(filterStateKey('orders/42/edit', 'orders table')).toBe(
        'Filters_/orders/edit::orders%20table',
    )
})

it('serializes non-empty filter values without clearing unrelated storage', () => {
    const repository = storage()
    const { container } = textFixture()

    saveFilterState(repository, 'Filters_/orders', [container])

    expect(JSON.parse(repository.value('Filters_/orders'))).toEqual({
        0: { 1: { type: 'text', val: 'Alice' } },
    })
})

it('does not persist an empty range filter', () => {
    const repository = storage()
    const range = {
        dataset: { type: 'range' },
        querySelectorAll: () => [{ value: '' }, { value: '' }],
    }
    const column = {
        dataset: { index: '3' },
        querySelector: () => range,
    }
    const container = { querySelectorAll: () => [column] }

    saveFilterState(repository, 'Filters_/orders::primary', [container])

    expect(repository.value('Filters_/orders::primary')).toBeUndefined()
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

it('migrates positional legacy state into table-scoped keys', () => {
    const legacy = JSON.stringify({
        0: { 1: { type: 'text', val: 'Alice' } },
        1: { 1: { type: 'text', val: 'Bob' } },
        2: { 2: { type: 'text', val: 'Active' } },
    })
    const repository = storage({ 'Filters_/orders': legacy })
    const containers = [
        { dataset: { datatablesId: 'primary' } },
        { dataset: { datatablesId: 'secondary' } },
        { dataset: { datatablesId: 'primary' } },
    ]

    expect(migrateLegacyFilterState(repository, 'orders', containers)).toEqual([
        'Filters_/orders::primary',
        'Filters_/orders::secondary',
    ])
    expect(JSON.parse(repository.value('Filters_/orders::primary'))).toEqual({
        0: { 1: { type: 'text', val: 'Alice' } },
        1: { 2: { type: 'text', val: 'Active' } },
    })
    expect(JSON.parse(repository.value('Filters_/orders::secondary'))).toEqual({
        0: { 1: { type: 'text', val: 'Bob' } },
    })
    expect(repository.value('Filters_/orders')).toBeUndefined()
})

it('does not overwrite current state during legacy migration', () => {
    const current = JSON.stringify({ 0: { 1: { type: 'text', val: 'Current' } } })
    const legacy = JSON.stringify({ 0: { 1: { type: 'text', val: 'Legacy' } } })
    const repository = storage({
        'Filters_/orders': legacy,
        'Filters_/orders::primary': current,
    })

    migrateLegacyFilterState(repository, 'orders', [{ dataset: { datatablesId: 'primary' } }])

    expect(repository.value('Filters_/orders::primary')).toBe(current)
    expect(repository.value('Filters_/orders')).toBeUndefined()
})

it('retains legacy state when a positional container cannot be identified', () => {
    const legacy = JSON.stringify({ 1: { 1: { type: 'text', val: 'Orphan' } } })
    const repository = storage({ 'Filters_/orders': legacy })

    migrateLegacyFilterState(repository, 'orders', [])

    expect(repository.value('Filters_/orders')).toBe(legacy)
})
