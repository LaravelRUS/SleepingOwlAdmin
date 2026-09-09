import { expect, it } from 'vitest'

import {
    formatDateValue,
    parseDateValue,
    toAirDateFormat,
} from '../../../../resources/js/shared/features/forms/date/date-format.js'

const locale = {
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    monthsShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ],
}

it('parses and formats existing Moment-style date contracts without timezone conversion', () => {
    const date = parseDateValue('06.09.2026 14:05:09', 'DD.MM.YYYY HH:mm:ss', locale)

    expect(date).toBeInstanceOf(Date)
    expect(formatDateValue(date, 'YYYY-MM-DD HH:mm:ss', locale)).toBe('2026-09-06 14:05:09')
})

it('supports localized month names, literals, twelve-hour time and ISO fallback', () => {
    const named = parseDateValue('6 September 2026 at 02:15 PM', 'D MMMM YYYY [at] hh:mm A', locale)
    const iso = parseDateValue('2026-09-06 14:15:09', 'DD.MM.YYYY', locale)

    expect(formatDateValue(named, 'DD MMM YYYY HH:mm', locale)).toBe('06 Sep 2026 14:15')
    expect(formatDateValue(iso, 'DD.MM.YYYY HH:mm:ss', locale)).toBe('06.09.2026 14:15:09')
})

it('rejects impossible values and maps date tokens for Air Datepicker range mode', () => {
    expect(parseDateValue('31.02.2026', 'DD.MM.YYYY', locale)).toBeNull()
    expect(parseDateValue('', 'DD.MM.YYYY', locale)).toBeNull()
    expect(toAirDateFormat('DD.MM.YYYY')).toBe('dd.MM.yyyy')
})
