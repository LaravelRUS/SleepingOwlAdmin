import { parseDateValue } from '../../forms/date/date-format.js'

export function createDateFilterSupport(locale = {}) {
    return Object.freeze({
        bindDateChange: () => {},
        bindSyntheticChange: () => {},
        parseDate: (value, format) => parseDateValue(value, format, locale),
    })
}
