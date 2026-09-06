import { formatDateValue, parseDateValue } from './date-format.js'
import { createDateRangeOptions } from './date-range-options.js'

export const DATE_CONTROL_TYPES = Object.freeze(['date', 'datetime', 'time', 'daterange'])

export function createDatePickerOptions(input, locale) {
    const type = input.dataset.soaDateControl
    assertControlType(type)

    const format = input.dataset.dateFormat || defaultFormat(type)
    const selectedDate = parseDateValue(input.value, format, locale)
    const options = {
        autoClose: type === 'date',
        dateFormat: (date) => formatDateValue(date, format, locale),
        locale,
        selectedDates: selectedDate ? [selectedDate] : false,
    }

    if (type === 'daterange') {
        return { ...options, ...createDateRangeOptions(input, format, locale) }
    }

    if (type === 'datetime' || type === 'time') options.timepicker = true
    if (type === 'time') options.onlyTimepicker = true

    return options
}

function defaultFormat(type) {
    if (type === 'time') return 'HH:mm'
    if (type === 'datetime') return 'DD.MM.YYYY HH:mm'

    return 'DD.MM.YYYY'
}

function assertControlType(type) {
    if (!DATE_CONTROL_TYPES.includes(type)) {
        throw new TypeError(`Unsupported date control type [${type ?? ''}].`)
    }
}
