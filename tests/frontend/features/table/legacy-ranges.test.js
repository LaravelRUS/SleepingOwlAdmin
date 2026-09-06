import { expect, it } from 'vitest'

import {
    createLegacyFilterDrivers,
    dataTables2SearchExtensions,
    isDateInRange,
    isNumberInRange,
} from '../../../../resources/frontend/features/table/filters/legacy-filter-drivers.js'

function date({ after = false, before = false, between = false, valid = true } = {}) {
    return {
        isBetween: () => between,
        isSameOrAfter: () => after,
        isSameOrBefore: () => before,
        isValid: () => valid,
    }
}

it('preserves numeric range boundary behavior', () => {
    expect(isNumberInRange(Number.NaN, Number.NaN, 10)).toBe(true)
    expect(isNumberInRange(Number.NaN, 20, 10)).toBe(true)
    expect(isNumberInRange(5, Number.NaN, 10)).toBe(true)
    expect(isNumberInRange(5, 20, 21)).toBe(false)
    expect(isNumberInRange(5, 20, Number.NaN)).toBe(false)
})

it('preserves date range boundary behavior', () => {
    expect(isDateInRange(false, false, date())).toBe(true)
    expect(isDateInRange({}, {}, date({ valid: false }))).toBe(false)
    expect(isDateInRange(false, {}, date({ before: true }))).toBe(true)
    expect(isDateInRange({}, false, date({ after: true }))).toBe(true)
    expect(isDateInRange({}, {}, date({ between: true }))).toBe(true)
})

it('resolves custom search registration from the active engine', () => {
    const search = []
    const engine = { ext: { search } }

    expect(dataTables2SearchExtensions(engine)).toBe(search)
    expect(createLegacyFilterDrivers(engine)).toMatchObject({
        date: expect.any(Function),
        range: expect.any(Function),
    })
    expect(() => createLegacyFilterDrivers({})).toThrow('search registry')
})
