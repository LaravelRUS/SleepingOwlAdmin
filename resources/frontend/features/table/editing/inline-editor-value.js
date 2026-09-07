const MULTIPLE_TYPES = new Set(['boolean', 'checkbox', 'checklist'])

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
    if (!MULTIPLE_TYPES.has(config.type)) return String(value ?? '') || config.emptyText

    return multipleDisplayValue(config, value)
}

function multipleDisplayValue(config, value) {
    const labels = value.map((item) => optionText(config.options, item)).filter(Boolean)

    if (config.type === 'checklist' && config.displayHtml && labels.length) {
        return listDisplay(labels, config)
    }

    return labels.length ? labels.join(', ') : config.emptyText
}

function listDisplay(labels, config) {
    const limit = config.listLimit > 0 ? config.listLimit : labels.length
    const visible = labels.slice(0, limit)
    const more = labels.length - visible.length
    const badges = visible.map((label) => `<span class="badge table-badge">${label}</span>`)

    if (more > 0) {
        const text = (config.listMore || `+${more}`).replace('__count__', String(more))
        badges.push(`<span class="badge bg-white text-secondary">${text}</span>`)
    }

    return badges.join('\n')
}

export function serializeInlineEditorValue(value) {
    return Array.isArray(value) ? value.join(',') : String(value ?? '')
}

function optionText(options, value) {
    return options.find((option) => option.value === String(value ?? ''))?.text ?? ''
}
