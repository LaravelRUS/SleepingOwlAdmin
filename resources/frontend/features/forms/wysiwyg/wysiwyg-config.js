export function readWysiwygConfig(textarea) {
    const id = requiredString(textarea.id, 'WYSIWYG textarea id')
    const editor = requiredString(textarea.dataset.wysiwygEditor, 'WYSIWYG editor name')

    return {
        editor,
        id,
        parameters: parseParameters(textarea.dataset.wysiwygParameters),
    }
}

export function parseParameters(value) {
    if (!value) return []

    const parameters = JSON.parse(value)
    if (parameters === null) return []

    return parameters
}

function requiredString(value, name) {
    if (typeof value !== 'string' || value.length === 0) {
        throw new TypeError(`${name} must be a non-empty string.`)
    }

    return value
}
