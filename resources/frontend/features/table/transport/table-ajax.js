import { forEachColumnFilter, readControlValue } from '../filters/filter-elements.js'

export function createTableAjax({ events, id, method, payload, root, url }) {
    assertEvents(events)

    return {
        data(parameters) {
            events.fire('datatables::ajax::data', parameters)
            appendNamedFilterData(parameters, root, id)
            parameters.payload = payload
        },
        type: method,
        url,
    }
}

export function appendNamedFilterData(parameters, root, tableId) {
    forEachColumnFilter(root, tableId, (filter, index) => {
        const name = filter.dataset.ajaxDataName
        const search = parameters.columns?.[index]?.search

        if (name && search) {
            search[name] = readControlValue(filter)
        }
    })
}

function assertEvents(events) {
    if (typeof events?.fire !== 'function') {
        throw new TypeError('Table transport requires an event bus.')
    }
}
