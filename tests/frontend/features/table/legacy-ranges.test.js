import { expect, it } from 'vitest'

import {
    createTableFilterDrivers,
    dataTableSearchExtensions,
    isDateInRange,
    isNumberInRange,
} from '../../../../resources/js/shared/features/table/filters/filter-drivers.js'

it('preserves numeric range boundary behavior', () => {
    expect(isNumberInRange(Number.NaN, Number.NaN, 10)).toBe(true)
    expect(isNumberInRange(Number.NaN, 20, 10)).toBe(true)
    expect(isNumberInRange(5, Number.NaN, 10)).toBe(true)
    expect(isNumberInRange(5, 20, 21)).toBe(false)
    expect(isNumberInRange(5, 20, Number.NaN)).toBe(false)
})

it('preserves date range boundary behavior', () => {
    const start = new Date(2026, 8, 1)
    const middle = new Date(2026, 8, 6)
    const end = new Date(2026, 8, 10)

    expect(isDateInRange(false, false, middle)).toBe(true)
    expect(isDateInRange(start, end, new Date('invalid'))).toBe(false)
    expect(isDateInRange(false, end, middle)).toBe(true)
    expect(isDateInRange(start, false, middle)).toBe(true)
    expect(isDateInRange(start, end, middle)).toBe(true)
    expect(isDateInRange(start, end, end)).toBe(true)
})

it('resolves custom search registration from the active engine', () => {
    const search = []
    const engine = { ext: { search } }

    expect(dataTableSearchExtensions(engine)).toBe(search)
    expect(createTableFilterDrivers(engine)).toMatchObject({
        date: expect.any(Function),
        range: expect.any(Function),
    })
    expect(() => createTableFilterDrivers({})).toThrow('search registry')
})
