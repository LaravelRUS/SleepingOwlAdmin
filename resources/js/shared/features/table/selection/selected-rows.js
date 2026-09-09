export function selectedRowValues(element) {
    if (typeof element?.querySelectorAll !== 'function') {
        throw new TypeError('Selected rows require a table element.')
    }

    return [...element.querySelectorAll('.adminCheckboxRow:checked')].map(
        (checkbox) => checkbox.value,
    )
}
