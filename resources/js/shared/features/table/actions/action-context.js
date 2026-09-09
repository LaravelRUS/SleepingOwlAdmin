export function findActionTable(form, tables, document = globalThis.document) {
    const scope = form.closest('.card') || document

    return (
        [...scope.querySelectorAll('table.datatables')].find((table) => tables.has(table)) ?? null
    )
}

export function selectedRows(tables, table) {
    return table ? tables.selectedRows(table) : []
}

export function selectedRowParameters(tables, table) {
    const parameters = new globalThis.URLSearchParams()

    selectedRows(tables, table).forEach((value) => parameters.append('_id[]', value))

    return parameters
}

export function formParameters(form, FormData = globalThis.FormData) {
    const parameters = new globalThis.URLSearchParams()

    for (const [name, value] of new FormData(form)) {
        if (typeof value === 'string') {
            parameters.append(name, value)
        }
    }

    return parameters
}

export function appendSelectedRows(parameters, tables, table) {
    selectedRows(tables, table).forEach((value) => parameters.append('_id[]', value))

    return parameters
}

export function actionCallbackContext(form, table, select = null) {
    const wrapper = table?.closest('.dataTables_wrapper') ?? form.closest('.card')
    const checkboxes = wrapper ? [...wrapper.querySelectorAll('.adminCheckboxRow:checked')] : []

    return { checkboxes, form, select, table, wrapper }
}
