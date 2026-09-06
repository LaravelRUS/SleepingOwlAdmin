const MULTIPLE_TYPES = new Set(['checkbox', 'checklist'])

export function applyInlineEditorValue(element, config, value) {
    const normalized = normalizeInlineEditorValue(value, config.type)
    element.dataset.value = serializeInlineEditorValue(normalized)
    const display = inlineEditorDisplayValue(config, normalized)

    if (config.displayHtml) element.innerHTML = display
    else element.textContent = display
}

export function normalizeInlineEditorValue(value, type) {
    if (!MULTIPLE_TYPES.has(type)) return String(value ?? '')
    if (Array.isArray(value)) return value.map((item) => String(item))
    if (value === null || value === undefined || value === '') return []

    return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
}

export function inlineEditorDisplayValue(config, value) {
    if (config.type === 'select') return optionText(config.options, value) || config.emptyText
    if (MULTIPLE_TYPES.has(config.type)) {
        const labels = value.map((item) => optionText(config.options, item)).filter(Boolean)

        return labels.length ? labels.join(', ') : config.emptyText
    }

    return String(value ?? '') || config.emptyText
}

export function serializeInlineEditorValue(value) {
    return Array.isArray(value) ? value.join(',') : String(value ?? '')
}

function optionText(options, value) {
    return options.find((option) => option.value === String(value ?? ''))?.text ?? ''
}
