export const INLINE_EDITOR_TYPES = Object.freeze([
    'boolean',
    'checkbox',
    'checklist',
    'date',
    'datetime',
    'number',
    'range',
    'select',
    'text',
    'textarea',
])

const MULTIPLE_TYPES = new Set(['boolean', 'checkbox', 'checklist'])

export function readInlineEditorConfig(element) {
    const type = element.dataset.inlineEditor
    assertType(type)

    return Object.freeze({
        dateFormat: element.dataset.dateFormat ?? '',
        displayHtml: element.dataset.displayHtml === 'true',
        emptyText: element.dataset.emptyText ?? '',
        max: element.dataset.max ?? null,
        min: element.dataset.min ?? null,
        mode: normalizeMode(element.dataset.mode),
        name: requiredValue(element.dataset.name, 'name'),
        options: parseOptions(readOptionsSource(element)),
        pk: requiredValue(element.dataset.pk, 'pk'),
        step: element.dataset.step ?? null,
        title: element.dataset.title ?? '',
        type,
        url: requiredValue(element.dataset.url, 'url'),
        value: parseValue(element.dataset.value, type),
    })
}

function readOptionsSource(element) {
    const id = element.dataset.inlineEditorOptionsId
    if (!id) return element.dataset.options

    const script = element.ownerDocument?.getElementById(id)
    if (!script) throw new Error(`Inline editor options [${id}] were not found.`)
    if (script.tagName !== 'SCRIPT' || script.type !== 'application/json') {
        throw new TypeError(`Inline editor options [${id}] must reference application/json.`)
    }

    return script.textContent
}

function parseOptions(source) {
    if (!source) return []

    const value = JSON.parse(source)
    if (!Array.isArray(value)) throw new TypeError('Inline editor options must be an array.')

    return value.map(normalizeOption)
}

function normalizeOption(option) {
    if (!option || typeof option !== 'object' || !Object.hasOwn(option, 'value')) {
        throw new TypeError('Inline editor option must contain a value.')
    }

    return Object.freeze({
        text: String(option.text ?? ''),
        value: String(option.value ?? ''),
    })
}

function parseValue(value, type) {
    if (!MULTIPLE_TYPES.has(type)) return String(value ?? '')

    return String(value ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
}

function normalizeMode(mode) {
    return mode === 'inline' ? 'inline' : 'popup'
}

function requiredValue(value, field) {
    if (typeof value !== 'string' || value.length === 0) {
        throw new TypeError(`Inline editor requires ${field}.`)
    }

    return value
}

function assertType(type) {
    if (!INLINE_EDITOR_TYPES.includes(type)) {
        throw new TypeError(`Unsupported inline editor type [${type ?? ''}].`)
    }
}
