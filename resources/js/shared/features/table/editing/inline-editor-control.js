const CHECK_INPUT_SELECTOR = '[data-inline-editor-check-input]'
const RANGE_INPUT_SELECTOR = '[data-inline-editor-range-input]'
const RANGE_NUMBER_SELECTOR = '[data-inline-editor-range-number]'
const RANGE_OUTPUT_SELECTOR = '[data-inline-editor-range-output]'
const RANGE_EMPTY_VALUE = '0'
const SELECT_CLEAR_EVENT = 'select:clear'
const SELECT_CONTROL_SELECTOR = '[data-inline-editor-select]'
const SELECT_NATIVE_SELECTOR = '[data-inline-editor-select-native]'
const SELECT_ROOT_SELECTOR = '[data-select-root]'

export function bindInlineEditorControl(element, config) {
    if (config.type === 'boolean' || config.type === 'checkbox' || config.type === 'checklist') {
        return bindChecklist(element, config.value)
    }
    if (config.type === 'range') return bindRange(element, config)
    if (config.type === 'select' && element.matches?.(SELECT_CONTROL_SELECTOR)) {
        return bindSelect(element)
    }

    return bindScalar(element, config)
}

function bindScalar(element, config) {
    element.value = config.value
    syncNumberAttributes(element, config)
    syncDateAttributes(element, config)

    return {
        clear: () => clearScalar(element),
        focusElement: element,
        read: () => element.value,
    }
}

function bindChecklist(element, value) {
    const selected = new Set(value)
    const inputs = [...element.querySelectorAll(CHECK_INPUT_SELECTOR)]
    inputs.forEach((input) => {
        input.checked = selected.has(input.value)
    })

    return {
        clear: () => inputs.forEach((input) => (input.checked = false)),
        focusElement: inputs[0],
        read: () => inputs.filter((input) => input.checked).map((input) => input.value),
    }
}

function bindRange(element, config) {
    const input = requiredRangePart(element, RANGE_INPUT_SELECTOR, 'input')
    const number = element.querySelector(RANGE_NUMBER_SELECTOR)
    const output = requiredRangePart(element, RANGE_OUTPUT_SELECTOR, 'output')
    const initialValue = config.value === '' ? RANGE_EMPTY_VALUE : config.value
    const updateFromRange = () => {
        if (number) number.value = input.value
        setRangeOutput(output, input.value)
    }
    const updateFromNumber = () => {
        const value = number.value === '' ? RANGE_EMPTY_VALUE : number.value
        number.value = value
        input.value = value
        setRangeOutput(output, value)
    }
    input.value = initialValue
    syncNumberAttributes(input, config)
    input.addEventListener('input', updateFromRange)
    if (number) {
        number.value = initialValue
        syncNumberAttributes(number, config)
        number.addEventListener('input', updateFromNumber)
    }
    updateFromRange()

    return {
        clear: () => {
            input.value = RANGE_EMPTY_VALUE
            if (number) number.value = RANGE_EMPTY_VALUE
            setRangeOutput(output, RANGE_EMPTY_VALUE)
        },
        destroy: () => {
            input.removeEventListener('input', updateFromRange)
            number?.removeEventListener('input', updateFromNumber)
        },
        focusElement: input,
        read: () => (number?.value === '' ? RANGE_EMPTY_VALUE : (number?.value ?? input.value)),
    }
}

function bindSelect(element) {
    const nativeControl = () => element.querySelector(SELECT_NATIVE_SELECTOR)

    return {
        clear: () => dispatchSelectClear(element),
        focusElement: element,
        read: () => nativeControl()?.value ?? '',
    }
}

function dispatchSelectClear(element) {
    const root = element.querySelector(SELECT_ROOT_SELECTOR)
    const EventConstructor = root?.ownerDocument?.defaultView?.Event ?? globalThis.Event

    root?.dispatchEvent(new EventConstructor(SELECT_CLEAR_EVENT))
}

function setRangeOutput(output, value) {
    output.hidden = false
    output.value = value
    output.textContent = value
}

function clearScalar(element) {
    element.value = ''
    element.dispatchEvent(new globalThis.Event('input', { bubbles: true }))
    element.dispatchEvent(new globalThis.Event('change', { bubbles: true }))
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
