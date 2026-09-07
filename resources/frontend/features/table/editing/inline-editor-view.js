import { bindInlineEditorControl } from './inline-editor-control.js'
import { cloneInlineEditorTemplate } from './inline-editor-template.js'

export function createInlineEditorView(trigger, config, labels, handlers) {
    const elements = cloneInlineEditorTemplate(trigger)
    const control = bindInlineEditorControl(elements.control, config)
    const removeListeners = bindViewEvents(elements, control, handlers)

    trigger.hidden = true
    trigger.setAttribute('aria-expanded', 'true')
    trigger.insertAdjacentElement('afterend', elements.root)
    focusControl(control.focusElement)

    return {
        destroy: () => destroyView(trigger, elements.root, control, removeListeners),
        readValue: control.read,
        root: elements.root,
        setBusy: (busy) => setBusy(elements, busy),
        setError: (message) => setError(elements.error, message),
    }
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

function focusControl(element) {
    element?.focus()
}
