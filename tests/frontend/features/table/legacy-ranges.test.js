import { expect, it } from 'vitest'

import {
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
