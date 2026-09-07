import { expect, it } from 'vitest'

import { createDatePickerOptions } from '../../../../resources/frontend/features/forms/date/date-options.js'
import { resolveDatePickerLocale } from '../../../../resources/frontend/features/forms/date/date-locales.js'

const locale = resolveDatePickerLocale('en')

function input(type, value = '', dataset = {}) {
    return {
        dataset: {
            dateFormat: type === 'time' ? 'HH:mm:ss' : 'DD.MM.YYYY HH:mm',
            dateControl: type,
            ...dataset,
        },
        value,
    }
}

it('builds date, datetime and time options from typed control metadata', () => {
    const date = createDatePickerOptions(input('date', '06.09.2026'), locale)
    const datetime = createDatePickerOptions(input('datetime', '06.09.2026 14:25'), locale)
    const time = createDatePickerOptions(input('time', '14:25:09'), locale)

    expect(date.autoClose).toBe(true)
    expect(date.timepicker).toBeUndefined()
    expect(datetime.timepicker).toBe(true)
    expect(datetime.dateFormat(datetime.selectedDates[0])).toBe('06.09.2026 14:25')
    expect(time).toMatchObject({ onlyTimepicker: true, timepicker: true })
    expect(time.dateFormat(time.selectedDates[0])).toBe('14:25:09')
})

it('allows inline editors to open the picker only on click', () => {
    const date = createDatePickerOptions(
        input('date', '06.09.2026', { dateShowEvent: 'click' }),
        locale,
    )

    expect(date.showEvent).toBe('click')
})

it('preserves daterange separator, placement, boundaries and max span', () => {
    const options = createDatePickerOptions(
        input('daterange', '01.09.2026 - 06.09.2026', {
            autoApply: 'true',
            dateFormat: 'DD.MM.YYYY',
            drops: 'up',
            maxDate: '30.09.2026',
            maxSpan: '{"days":7}',
            minDate: '01.09.2026',
            opens: 'left',
        }),
        locale,
    )

    expect(options).toMatchObject({
        autoClose: true,
        dateFormat: 'dd.MM.yyyy',
        multipleDatesSeparator: ' - ',
        position: 'top right',
        range: true,
    })
    expect(options.selectedDates).toHaveLength(2)
    expect(
        options.onBeforeSelect({
            date: new Date(2026, 8, 8),
            datepicker: { selectedDates: [new Date(2026, 8, 1)] },
        }),
    ).toBe(true)
    expect(
        options.onBeforeSelect({
            date: new Date(2026, 8, 9),
            datepicker: { selectedDates: [new Date(2026, 8, 1)] },
        }),
    ).toBe(false)
})

it('rejects unknown server control types explicitly', () => {
    expect(() => createDatePickerOptions(input('calendar'), locale)).toThrow(
        'Unsupported date control type [calendar]',
    )
})
