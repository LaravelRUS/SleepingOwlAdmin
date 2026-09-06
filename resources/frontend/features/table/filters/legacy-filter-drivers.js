import jQuery from 'jquery'
import moment from 'moment'

export function createLegacyFilterDrivers(dataTable = jQuery.fn.dataTable) {
    return {
        date: bindDateFilter,
        daterange: bindTextFilter,
        range: (container, table, column, index, serverSide) =>
            bindRangeFilter(container, table, column, index, serverSide, dataTable),
        select: bindSelectFilter,
        text: bindTextFilter,
    }
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
    if (!value.isValid()) return false
    if (!fromValue) return value.isSameOrBefore(toValue)
    if (!toValue) return value.isSameOrAfter(fromValue)

    return value.isBetween(fromValue, toValue)
}

function bindDateFilter(input, _table, column) {
    const field = jQuery(input)
    field.closest('.input-date').on('dp.change', () => column.search(field.val()))
}

function bindTextFilter(input, _table, column) {
    const field = jQuery(input)
    field.on('keyup change', () => column.search(field.val()))
}

function bindSelectFilter(input, _table, column, _index, serverSide) {
    const field = jQuery(input)
    field.on('change', () => {
        const selected = field
            .find(':selected')
            .map((_index, option) => option.value)
            .get()
            .filter(Boolean)

        searchSelectedValues(column, selected, serverSide)
    })
}

function searchSelectedValues(column, selected, serverSide) {
    if (serverSide) {
        column.search(selected.join(':::'))
    } else {
        column.search(selected.join('|'), true, false, true)
    }
}

function bindRangeFilter(container, table, column, index, serverSide, dataTable) {
    const { from, to } = rangeInputs(container)
    const isDateRange = hasDatePickers(from, to)
    const search = () => searchRange(from, to, table, column, serverSide)

    from.add(to).on('keyup change', search)
    bindDateRange(from, to, search, isDateRange, serverSide)

    if (!serverSide) {
        dataTable.ext.search.push((settings, data) =>
            filterRange(settings, data, table, index, from, to, isDateRange),
        )
    }
}

function rangeInputs(container) {
    const root = jQuery(container)
    const from = jQuery('input:first', root).attr('data-ajax-data-name', 'from')
    const to = jQuery('input:last', root).attr('data-ajax-data-name', 'to')

    return { from, to }
}

function hasDatePickers(from, to) {
    return from.closest('.input-date').length > 0 && to.closest('.input-date').length > 0
}

function bindDateRange(from, to, search, isDateRange, serverSide) {
    if (isDateRange) {
        from.closest('.input-date')
            .add(to.closest('.input-date'))
            .on('dp.change', () => {
                if (serverSide) search()
            })
    }
}

function searchRange(from, to, table, column, serverSide) {
    if (serverSide) {
        column.search(`${from.val()}::${to.val()}`)
    } else {
        table.draw()
    }
}

function filterRange(settings, data, table, index, from, to, isDateRange) {
    if (table.settings()[0].sTableId !== settings.sTableId) return true

    const value = orderedValue(data[index])

    return isDateRange
        ? filterDateRange(value, from, to)
        : isNumberInRange(
              Number.parseInt(from.val()),
              Number.parseInt(to.val()),
              Number.parseInt(value),
          )
}

function orderedValue(value) {
    return value && value['@data-order'] !== undefined ? value['@data-order'] : value
}

function filterDateRange(value, from, to) {
    return isDateInRange(pickerDate(from), pickerDate(to), moment(value, from.data('date-format')))
}

function pickerDate(field) {
    return field.val().length > 0
        ? field.closest('.input-date').data('DateTimePicker').date()
        : false
}
