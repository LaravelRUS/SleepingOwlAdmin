function findActionTable(form) {
    const scope = form.closest('.card') || document

    return [...scope.querySelectorAll('table.datatables')].find((table) =>
        Admin.Tables.has(table),
    )
}

function selectedRows(table) {
    return table ? Admin.Tables.selectedRows(table) : []
}

function serializeSelectedRows(table) {
    const parameters = new URLSearchParams()
    selectedRows(table).forEach((value) => parameters.append('_id[]', value))

    return parameters.toString()
}

module.exports = { findActionTable, selectedRows, serializeSelectedRows }
