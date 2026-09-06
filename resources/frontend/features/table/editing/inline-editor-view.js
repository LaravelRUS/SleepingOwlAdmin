const CONTROL_CLASS = 'soa-inline-editor-control'

export function createInlineEditorView(trigger, config, labels, handlers) {
    const document = trigger.ownerDocument
    const control = createControl(document, config)
    const elements = createEditorElements(document, config, labels, control.element)
    const removeListeners = bindViewEvents(elements, control, handlers)

    trigger.hidden = true
    trigger.setAttribute('aria-expanded', 'true')
    trigger.insertAdjacentElement('afterend', elements.root)
    focusControl(control.element)

    return {
        destroy: () => destroyView(trigger, elements.root, control, removeListeners),
        readValue: control.read,
        root: elements.root,
        setBusy: (busy) => setBusy(elements, busy),
        setError: (message) => setError(elements.error, message),
    }
}

function createEditorElements(document, config, labels, control) {
    const root = createElement(
        document,
        'div',
        `soa-inline-editor soa-inline-editor-${config.mode}`,
    )
    const form = createElement(document, 'form', 'soa-inline-editor-form')
    const title = createTitle(document, config.title)
    const input = createElement(document, 'div', 'soa-inline-editor-input')
    const actions = createElement(document, 'div', 'soa-inline-editor-actions')
    const submit = createButton(document, 'submit', 'soa-inline-editor-submit', labels.save)
    const cancel = createButton(document, 'button', 'soa-inline-editor-cancel', labels.cancel)
    const error = createElement(document, 'div', 'soa-inline-editor-error')

    input.append(control)
    actions.append(submit, cancel)
    form.append(...[title, input, actions, error].filter(Boolean))
    root.append(form)
    root.setAttribute('role', config.mode === 'popup' ? 'dialog' : 'group')

    return { cancel, error, form, root, submit }
}

function bindViewEvents(elements, control, handlers) {
    const submit = (event) => {
        event.preventDefault()
        handlers.submit(control.read())
    }
    const cancel = () => handlers.cancel()
    const keydown = (event) => {
        if (event.key === 'Escape') handlers.cancel()
    }

    elements.form.addEventListener('submit', submit)
    elements.form.addEventListener('keydown', keydown)
    elements.cancel.addEventListener('click', cancel)

    return () => {
        elements.form.removeEventListener('submit', submit)
        elements.form.removeEventListener('keydown', keydown)
        elements.cancel.removeEventListener('click', cancel)
    }
}

function createControl(document, config) {
    if (config.type === 'select') return createSelect(document, config)
    if (config.type === 'checklist' || config.type === 'checkbox') {
        return createChecklist(document, config)
    }
    if (config.type === 'textarea') return createTextarea(document, config)
    if (config.type === 'range') return createRange(document, config)

    return createInput(document, config)
}

function createInput(document, config) {
    const input = createElement(document, 'input', CONTROL_CLASS)
    input.type = config.type === 'number' ? 'number' : 'text'
    input.value = config.value
    applyNumberAttributes(input, config)
    applyDateAttributes(input, config)

    return { element: input, read: () => input.value }
}

function createTextarea(document, config) {
    const textarea = createElement(document, 'textarea', CONTROL_CLASS)
    textarea.value = config.value

    return { element: textarea, read: () => textarea.value }
}

function createSelect(document, config) {
    const select = createElement(document, 'select', CONTROL_CLASS)
    config.options.forEach((option) => select.append(createOption(document, option, config.value)))

    return { element: select, read: () => select.value }
}

function createChecklist(document, config) {
    const fieldset = createElement(document, 'fieldset', 'soa-inline-editor-checklist')
    config.options.forEach((option) => fieldset.append(createCheckOption(document, option, config)))

    return {
        element: fieldset,
        read: () => [...fieldset.querySelectorAll('input:checked')].map((input) => input.value),
    }
}

function createRange(document, config) {
    const wrapper = createElement(document, 'div', 'soa-inline-editor-range')
    const input = createElement(document, 'input', CONTROL_CLASS)
    const output = createElement(document, 'output', 'soa-inline-editor-range-value')
    const update = () => {
        output.value = input.value
    }

    input.type = 'range'
    input.value = config.value
    applyNumberAttributes(input, config)
    input.addEventListener('input', update)
    update()
    wrapper.append(input, output)

    return {
        destroy: () => input.removeEventListener('input', update),
        element: wrapper,
        read: () => input.value,
    }
}

function createCheckOption(document, option, config) {
    const label = createElement(document, 'label', 'soa-inline-editor-check-option')
    const input = createElement(document, 'input', 'soa-inline-editor-check-input')
    const text = createElement(document, 'span', 'soa-inline-editor-check-label')

    input.type = 'checkbox'
    input.value = option.value
    input.checked = config.value.includes(option.value)
    text.textContent = option.text
    label.append(input, text)

    return label
}

function createOption(document, option, value) {
    const element = document.createElement('option')
    element.value = option.value
    element.textContent = option.text
    element.selected = option.value === String(value ?? '')

    return element
}

function applyNumberAttributes(input, config) {
    for (const name of ['min', 'max', 'step']) {
        if (config[name] !== null) input.setAttribute(name, config[name])
    }
}

function applyDateAttributes(input, config) {
    if (config.type !== 'date' && config.type !== 'datetime') return

    input.dataset.soaDateControl = config.type
    input.dataset.dateFormat = config.dateFormat
}

function setBusy(elements, busy) {
    elements.form.setAttribute('aria-busy', String(busy))
    elements.form.querySelectorAll('input, textarea, select, button').forEach((control) => {
        control.disabled = busy
    })
}

function setError(element, message) {
    element.textContent = message
    element.hidden = !message
}

function destroyView(trigger, root, control, removeListeners) {
    removeListeners()
    control.destroy?.()
    root.remove()
    trigger.hidden = false
    trigger.setAttribute('aria-expanded', 'false')
}

function focusControl(control) {
    const input = control.matches('input, textarea, select')
        ? control
        : control.querySelector('input, textarea, select')
    input?.focus()
}

function createButton(document, type, className, label) {
    const button = createElement(document, 'button', className)
    button.type = type
    button.textContent = label

    return button
}

function createTitle(document, title) {
    if (!title) return null

    const element = createElement(document, 'div', 'soa-inline-editor-title')
    element.textContent = title

    return element
}

function createElement(document, tag, className) {
    const element = document.createElement(tag)
    element.className = className

    return element
}
