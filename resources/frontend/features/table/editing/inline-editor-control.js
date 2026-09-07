const CHECK_INPUT_SELECTOR = '[data-inline-editor-check-input]'
const RANGE_INPUT_SELECTOR = '[data-inline-editor-range-input]'
const RANGE_OUTPUT_SELECTOR = '[data-inline-editor-range-output]'

export function bindInlineEditorControl(element, config) {
    if (config.type === 'boolean' || config.type === 'checkbox' || config.type === 'checklist') {
        return bindChecklist(element, config.value)
    }
    if (config.type === 'range') return bindRange(element, config)

    return bindScalar(element, config)
}

function bindScalar(element, config) {
    element.value = config.value
    syncNumberAttributes(element, config)
    syncDateAttributes(element, config)

    return { focusElement: element, read: () => element.value }
}

function bindChecklist(element, value) {
    const selected = new Set(value)
    const inputs = [...element.querySelectorAll(CHECK_INPUT_SELECTOR)]
    inputs.forEach((input) => {
        input.checked = selected.has(input.value)
    })

    return {
        focusElement: inputs[0],
        read: () => inputs.filter((input) => input.checked).map((input) => input.value),
    }
}

function bindRange(element, config) {
    const input = requiredRangePart(element, RANGE_INPUT_SELECTOR, 'input')
    const output = requiredRangePart(element, RANGE_OUTPUT_SELECTOR, 'output')
    const update = () => {
        output.value = input.value
        output.textContent = input.value
    }

    input.value = config.value
    syncNumberAttributes(input, config)
    input.addEventListener('input', update)
    update()

    return {
        destroy: () => input.removeEventListener('input', update),
        focusElement: input,
        read: () => input.value,
    }
}

function syncNumberAttributes(input, config) {
    if (config.type !== 'number' && config.type !== 'range') return

    for (const name of ['min', 'max', 'step']) {
        syncOptionalAttribute(input, name, config[name])
    }
}

function syncDateAttributes(input, config) {
    if (config.type !== 'date' && config.type !== 'datetime') return

    input.dataset.dateControl = config.type
    input.dataset.dateFormat = config.dateFormat
    input.dataset.dateShowEvent = 'click'
}

function syncOptionalAttribute(element, name, value) {
    if (value === null) element.removeAttribute(name)
    else element.setAttribute(name, value)
}

function requiredRangePart(element, selector, label) {
    const part = element.querySelector(selector)
    if (!part) throw new TypeError(`Inline editor range template requires an ${label}.`)

    return part
}
