export function copySelectOptions(options) {
    return Array.isArray(options) ? options.map((option) => ({ ...option })) : []
}

export function initialSelectValue(options, value, multiple) {
    return multiple ? selectedOptions(options, value) : findSelectOption(options, value)
}

export function findSelectOption(options, value) {
    return (
        options.find((option) => option.id === value) ??
        options.find((option) => sameSelectId(option.id, value)) ??
        null
    )
}

export function selectedOptionIds(selection, multiple) {
    if (multiple) return Array.isArray(selection) ? selection.map(({ id }) => id) : []

    return selection === null ? [] : [selection.id]
}

export function isSelectOptionSelected(selection, id, multiple) {
    return selectedOptionIds(selection, multiple).some((value) => sameSelectId(value, id))
}

export function appendSelectTag(options, selection, value) {
    const current = findSelectOption(options, value)
    const option = current ?? { id: value, text: value }

    return {
        options: current ? options : [...options, option],
        selection: isSelectOptionSelected(selection, option.id, true)
            ? selection
            : [...selection, option],
    }
}

export function selectFormValue(value) {
    return value === null || value === undefined ? '' : String(value)
}

export function selectOptionKey(option, index) {
    return `${typeof option.id}:${selectFormValue(option.id)}:${index}`
}

function selectedOptions(options, value) {
    const values = Array.isArray(value) ? value : value === null ? [] : [value]

    return options.filter((option) => values.some((item) => sameSelectId(option.id, item)))
}

function sameSelectId(left, right) {
    if (left === right) return true
    if (left === null || left === undefined || right === null || right === undefined) return false

    return String(left) === String(right)
}
