const NO_COMPATIBILITY_EVENTS = Object.freeze({
    bindDateChange: () => {},
    bindSyntheticChange: () => {},
    parseDate: unsupportedDateParser,
})

export function createTableFilterDrivers(engine, compatibilityEvents = NO_COMPATIBILITY_EVENTS) {
    const searchExtensions = dataTables2SearchExtensions(engine)
    const events = normalizeCompatibilityEvents(compatibilityEvents)

    return {
        date: (input, table, column) => bindDateFilter(input, table, column, events),
        daterange: (input, table, column) => bindDateRangeFilter(input, table, column, events),
        range: (container, table, column, index, serverSide) =>
            bindRangeFilter(container, table, column, index, serverSide, searchExtensions, events),
        select: (input, table, column, index, serverSide) =>
            bindSelectFilter(input, table, column, index, serverSide, events),
        text: bindTextFilter,
    }
}

export function dataTables2SearchExtensions(engine) {
    if (!Array.isArray(engine?.ext?.search)) {
        throw new TypeError('Table range filters require a DataTables search registry.')
    }

    return engine.ext.search
}

export function isNumberInRange(fromValue, toValue, value) {
    if (Number.isNaN(fromValue) && Number.isNaN(toValue)) return true
    if (Number.isNaN(value)) return false
    if (Number.isNaN(fromValue)) return value <= toValue
    if (Number.isNaN(toValue)) return value >= fromValue

    return value >= fromValue && value <= toValue
}

export function isDateInRange(fromValue, toValue, value) {
    if (!fromValue && !toValue) return true
    const timestamp = dateTimestamp(value)
    if (!Number.isFinite(timestamp)) return false

    const fromTimestamp = dateTimestamp(fromValue)
    const toTimestamp = dateTimestamp(toValue)
    if (!fromValue) return timestamp <= toTimestamp
    if (!toValue) return timestamp >= fromTimestamp

    return timestamp >= fromTimestamp && timestamp <= toTimestamp
}

function bindDateFilter(input, _table, column, events) {
    const search = () => column.search(input.value)

    bindEvents(input, ['change'], search)
    events.bindDateChange(input, search)
}

function bindDateRangeFilter(input, _table, column, events) {
    bindTextFilter(input, _table, column)
    events.bindSyntheticChange(input, () => column.search(input.value))
}

function bindTextFilter(input, _table, column) {
    bindEvents(input, ['keyup', 'change'], () => column.search(input.value))
}

function bindSelectFilter(input, _table, column, _index, serverSide, events) {
    const search = () => searchSelectedValues(column, selectedValues(input), serverSide)

    bindEvents(input, ['change'], search)
    events.bindSyntheticChange(input, search)
}

function selectedValues(input) {
    return [...input.selectedOptions].map((option) => option.value).filter(Boolean)
}

function searchSelectedValues(column, selected, serverSide) {
    if (serverSide) {
        column.search(selected.join(':::'))
    } else {
        column.search(selected.join('|'), true, false, true)
    }
}

function bindRangeFilter(container, table, column, index, serverSide, searchExtensions, events) {
    const { from, to } = rangeInputs(container)
    const isDateRange = hasDatePickers(from, to)
    const search = () => searchRange(from, to, table, column, serverSide)

    bindEvents(from, ['keyup', 'change'], search)
    bindEvents(to, ['keyup', 'change'], search)
    bindDateRangeEvents(from, to, search, isDateRange, events)

    if (!serverSide) {
        searchExtensions.push((settings, data) =>
            filterRange(settings, data, table, index, from, to, isDateRange, events.parseDate),
        )
    }
}

function rangeInputs(container) {
    const inputs = container.querySelectorAll('input')
    const from = inputs[0]
    const to = inputs[inputs.length - 1]

    if (!from || !to || from === to) {
        throw new TypeError('Table range filters require two input controls.')
    }

    from.dataset.ajaxDataName = 'from'
    to.dataset.ajaxDataName = 'to'

    return { from, to }
}

function hasDatePickers(from, to) {
    return Boolean(from.closest('.input-date') && to.closest('.input-date'))
}

function bindDateRangeEvents(from, to, search, isDateRange, events) {
    if (!isDateRange) return

    events.bindDateChange(from, search)
    events.bindDateChange(to, search)
}

function searchRange(from, to, table, column, serverSide) {
    if (serverSide) {
        column.search(`${from.value}::${to.value}`)
    } else {
        table.draw()
    }
}

function filterRange(settings, data, table, index, from, to, isDateRange, parseDate) {
    if (table.settings()[0].sTableId !== settings.sTableId) return true

    const value = orderedValue(data[index])

    return isDateRange
        ? filterDateRange(value, from, to, parseDate)
        : isNumberInRange(
              Number.parseInt(from.value),
              Number.parseInt(to.value),
              Number.parseInt(value),
          )
}

function orderedValue(value) {
    return value && value['@data-order'] !== undefined ? value['@data-order'] : value
}

function filterDateRange(value, from, to, parseDate) {
    const format = from.dataset.dateFormat

    return isDateInRange(
        inputDate(from, format, parseDate),
        inputDate(to, format, parseDate),
        parseDate(value, format),
    )
}

function inputDate(input, format, parseDate) {
    return input.value.length > 0 ? parseDate(input.value, format) : false
}

function bindEvents(control, types, listener) {
    for (const type of types) {
        control.addEventListener(type, listener)
    }
}

function normalizeCompatibilityEvents(events) {
    if (
        typeof events?.bindDateChange !== 'function' ||
        typeof events?.bindSyntheticChange !== 'function' ||
        typeof events?.parseDate !== 'function'
    ) {
        throw new TypeError('Table filters require valid compatibility event bindings.')
    }

    return events
}

function unsupportedDateParser() {
    throw new TypeError('Client-side date filters require a date parser.')
}

function dateTimestamp(value) {
    if (typeof value?.isValid === 'function' && !value.isValid()) return Number.NaN

    const timestamp = value instanceof Date ? value.getTime() : Number(value?.valueOf?.())

    return Number.isFinite(timestamp) ? timestamp : Number.NaN
}
