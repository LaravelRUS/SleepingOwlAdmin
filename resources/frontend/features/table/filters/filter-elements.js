export function forEachColumnFilter(root, tableId, callback) {
    assertRoot(root)

    for (const container of tableContainers(root, tableId)) {
        for (const filter of container.querySelectorAll('.column-filter[data-type]')) {
            const column = filter.closest('[data-index]')
            callback(filter, column?.dataset.index, filter.dataset.type)
        }
    }
}

export function readControlValue(control) {
    if (control?.multiple && control.selectedOptions) {
        return [...control.selectedOptions].map((option) => option.value)
    }

    return control?.value ?? null
}

function tableContainers(root, tableId) {
    return [...root.querySelectorAll('[data-datatables-id]')].filter(
        (container) => container.dataset.datatablesId === String(tableId),
    )
}

function assertRoot(root) {
    if (typeof root?.querySelectorAll !== 'function') {
        throw new TypeError('Column filter root must support querySelectorAll().')
    }
}
