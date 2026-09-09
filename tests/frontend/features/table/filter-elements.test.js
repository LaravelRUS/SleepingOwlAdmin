import { expect, it, vi } from 'vitest'

import {
    forEachColumnFilter,
    readControlValue,
} from '../../../../resources/js/shared/features/table/filters/filter-elements.js'

it('iterates filters only inside containers owned by the table id', () => {
    const filter = {
        closest: () => ({ dataset: { index: '3' } }),
        dataset: { type: 'range' },
    }
    const matching = {
        dataset: { datatablesId: 'orders' },
        querySelectorAll: () => [filter],
    }
    const other = {
        dataset: { datatablesId: 'users' },
        querySelectorAll: vi.fn(),
    }
    const root = { querySelectorAll: () => [matching, other] }
    const callback = vi.fn()

    forEachColumnFilter(root, 'orders', callback)

    expect(callback).toHaveBeenCalledWith(filter, '3', 'range')
    expect(other.querySelectorAll).not.toHaveBeenCalled()
})

it('reads scalar and multiple-select control values', () => {
    expect(readControlValue({ value: 'Alice' })).toBe('Alice')
    expect(
        readControlValue({
            multiple: true,
            selectedOptions: [{ value: 'active' }, { value: 'archived' }],
        }),
    ).toEqual(['active', 'archived'])
    expect(readControlValue(null)).toBeNull()
})
