import { parseDateValue, toAirDateFormat } from './date-format.js'

export const DATE_RANGE_SEPARATOR = ' - '

export function createDateRangeOptions(input, format, locale) {
    const selectedDates = rangeDates(input, format, locale)
    const maxSpan = parseMaxSpan(input.dataset.maxSpan)

    return {
        autoClose: input.dataset.autoApply === 'true',
        dateFormat: toAirDateFormat(format),
        maxDate: constraintDate(input.dataset.maxDate, format, locale),
        minDate: constraintDate(input.dataset.minDate, format, locale),
        multipleDatesSeparator: DATE_RANGE_SEPARATOR,
        onBeforeSelect: maxSpan ? withinMaxSpan(maxSpan) : undefined,
        position: pickerPosition(input.dataset.opens, input.dataset.drops),
        range: true,
        selectedDates: selectedDates.length ? selectedDates : false,
    }
}

export function parseDateRangeValue(value, format, locale) {
    return String(value ?? '')
        .split(DATE_RANGE_SEPARATOR, 2)
        .map((part) => parseDateValue(part, format, locale))
        .filter(Boolean)
}

function rangeDates(input, format, locale) {
    const current = parseDateRangeValue(input.value, format, locale)
    if (current.length) return current

    return [input.dataset.startDate, input.dataset.endDate]
        .map((value) => constraintDate(value, format, locale))
        .filter(Boolean)
}

function constraintDate(value, format, locale) {
    return value ? parseDateValue(value, format, locale) || false : false
}

function parseMaxSpan(value) {
    if (!value) return null

    try {
        const parsed = JSON.parse(value)

        return parsed && typeof parsed === 'object' ? parsed : null
    } catch {
        return null
    }
}

function withinMaxSpan(span) {
    return ({ datepicker, date }) => {
        const start = datepicker.selectedDates[0]
        if (!start || datepicker.selectedDates.length > 1) return true

        return date >= shiftDate(start, span, -1) && date <= shiftDate(start, span, 1)
    }
}

function shiftDate(value, span, direction) {
    const date = new Date(value.getTime())
    date.setFullYear(date.getFullYear() + number(span.years) * direction)
    date.setMonth(date.getMonth() + number(span.months) * direction)
    date.setDate(date.getDate() + (number(span.weeks) * 7 + number(span.days)) * direction)
    date.setHours(date.getHours() + number(span.hours) * direction)
    date.setMinutes(date.getMinutes() + number(span.minutes) * direction)
    date.setSeconds(date.getSeconds() + number(span.seconds) * direction)
    date.setMilliseconds(date.getMilliseconds() + number(span.milliseconds) * direction)

    return date
}

function pickerPosition(opens = 'right', drops = 'auto') {
    const vertical = drops === 'up' ? 'top' : 'bottom'
    if (opens === 'center') return vertical

    return `${vertical} ${opens === 'left' ? 'right' : 'left'}`
}

function number(value) {
    const parsed = Number(value)

    return Number.isFinite(parsed) ? parsed : 0
}
