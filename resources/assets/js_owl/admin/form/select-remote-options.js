import { findSelectOption } from './select-values.js'

export function normalizeRemoteSelectOptions(items) {
    if (!Array.isArray(items)) {
        throw new TypeError('Remote select response must be an array.')
    }

    return items.map((item) => ({
        id: item.id,
        text: optionText(item),
    }))
}

export function mergeRemoteSelectOptions(selection, items, multiple) {
    const selected = selectedOptions(selection, multiple)

    return items.reduce((options, item) => {
        if (!findSelectOption(options, item.id)) options.push(item)

        return options
    }, [...selected])
}

function optionText(item) {
    const value = item.custom_name || item.tag_name || item.text || ''

    return String(value)
}

function selectedOptions(selection, multiple) {
    if (multiple) return Array.isArray(selection) ? selection : []

    return selection ? [selection] : []
}
