const FORMAT_TOKENS = /\[[^\]]*]|YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|A|a|./g

const AIR_FORMAT_TOKENS = Object.freeze({
    D: 'd',
    DD: 'dd',
    M: 'M',
    MM: 'MM',
    MMM: 'MMM',
    MMMM: 'MMMM',
    YY: 'yy',
    YYYY: 'yyyy',
})

const DATE_PART_READERS = Object.freeze({
    D: ['day', numberValue],
    DD: ['day', numberValue],
    H: ['hour', numberValue],
    HH: ['hour', numberValue],
    h: ['hour', numberValue],
    hh: ['hour', numberValue],
    M: ['month', numberValue],
    MM: ['month', numberValue],
    MMM: ['month', (value, locale) => namedMonth(value, locale.monthsShort)],
    MMMM: ['month', (value, locale) => namedMonth(value, locale.months)],
    m: ['minute', numberValue],
    mm: ['minute', numberValue],
    s: ['second', numberValue],
    ss: ['second', numberValue],
    YY: ['year', (value) => 2000 + Number(value)],
    YYYY: ['year', numberValue],
})

export function formatDateValue(date, format, locale = {}) {
    if (!isValidDate(date)) return ''

    const values = dateTokenValues(date, locale)

    return tokenize(format)
        .map((token) => values[token] ?? literalValue(token))
        .join('')
}

export function parseDateValue(value, format, locale = {}) {
    const input = String(value ?? '').trim()
    if (!input) return null

    const parsed = parseFormattedDate(input, format, locale)
    if (parsed) return parsed

    return parseIsoDate(input)
}

export function toAirDateFormat(format) {
    return tokenize(format)
        .map((token) => AIR_FORMAT_TOKENS[token] ?? literalValue(token))
        .join('')
}

function parseFormattedDate(value, format, locale) {
    const captures = []
    const source = tokenize(format)
        .map((token) => tokenPattern(token, captures, locale))
        .join('')
    const match = new RegExp(`^${source}$`, 'iu').exec(value)
    if (!match) return null

    return dateFromCaptures(captures, match.slice(1), locale)
}

function tokenPattern(token, captures, locale) {
    const patterns = {
        A: '(AM|PM)',
        a: '(am|pm)',
        D: '(\\d{1,2})',
        DD: '(\\d{2})',
        H: '(\\d{1,2})',
        HH: '(\\d{2})',
        h: '(\\d{1,2})',
        hh: '(\\d{2})',
        M: '(\\d{1,2})',
        MM: '(\\d{2})',
        MMM: namedMonthPattern(locale.monthsShort),
        MMMM: namedMonthPattern(locale.months),
        m: '(\\d{1,2})',
        mm: '(\\d{2})',
        s: '(\\d{1,2})',
        ss: '(\\d{2})',
        YY: '(\\d{2})',
        YYYY: '(\\d{4})',
    }

    if (!patterns[token]) return escapeRegExp(literalValue(token))

    captures.push(token)

    return patterns[token]
}

function dateFromCaptures(tokens, values, locale) {
    const now = new Date()
    const parts = {
        day: 1,
        hour: 0,
        minute: 0,
        month: 1,
        second: 0,
        year: now.getFullYear(),
    }
    let period = null

    tokens.forEach((token, index) => {
        const value = values[index]
        if (token === 'A' || token === 'a') period = value.toLowerCase()
        else assignDatePart(parts, token, value, locale)
    })

    parts.hour = normalizeTwelveHour(parts.hour, period)
    const date = new Date(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second,
    )

    return matchesParts(date, parts) ? date : null
}

function assignDatePart(parts, token, value, locale) {
    const [field, read] = DATE_PART_READERS[token]
    parts[field] = read(value, locale)
}

function dateTokenValues(date, locale) {
    const hour = date.getHours()
    const hour12 = hour % 12 || 12

    return {
        A: hour >= 12 ? 'PM' : 'AM',
        a: hour >= 12 ? 'pm' : 'am',
        D: String(date.getDate()),
        DD: pad(date.getDate()),
        H: String(hour),
        HH: pad(hour),
        h: String(hour12),
        hh: pad(hour12),
        M: String(date.getMonth() + 1),
        MM: pad(date.getMonth() + 1),
        MMM: locale.monthsShort?.[date.getMonth()] ?? pad(date.getMonth() + 1),
        MMMM: locale.months?.[date.getMonth()] ?? pad(date.getMonth() + 1),
        m: String(date.getMinutes()),
        mm: pad(date.getMinutes()),
        s: String(date.getSeconds()),
        ss: pad(date.getSeconds()),
        YY: String(date.getFullYear()).slice(-2),
        YYYY: String(date.getFullYear()),
    }
}

function matchesParts(date, parts) {
    return (
        isValidDate(date) &&
        date.getFullYear() === parts.year &&
        date.getMonth() === parts.month - 1 &&
        date.getDate() === parts.day &&
        date.getHours() === parts.hour &&
        date.getMinutes() === parts.minute &&
        date.getSeconds() === parts.second
    )
}

function parseIsoDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}(?:[T ][0-2]\d:[0-5]\d(?::[0-5]\d)?)?$/.test(value)) return null

    const date = new Date(value.replace(' ', 'T'))

    return isValidDate(date) ? date : null
}

function namedMonthPattern(months = []) {
    return months.length ? `(${months.map(escapeRegExp).join('|')})` : '([^\\d]+)'
}

function namedMonth(value, months = []) {
    return months.findIndex((month) => month.toLocaleLowerCase() === value.toLocaleLowerCase()) + 1
}

function numberValue(value) {
    return Number(value)
}

function normalizeTwelveHour(hour, period) {
    if (!period) return hour
    if (hour < 1 || hour > 12) return -1
    if (period === 'am') return hour === 12 ? 0 : hour

    return hour === 12 ? 12 : hour + 12
}

function tokenize(format) {
    return String(format ?? '').match(FORMAT_TOKENS) ?? []
}

function literalValue(token) {
    return token.startsWith('[') && token.endsWith(']') ? token.slice(1, -1) : token
}

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function pad(value) {
    return String(value).padStart(2, '0')
}

function isValidDate(value) {
    return value instanceof Date && !Number.isNaN(value.getTime())
}
