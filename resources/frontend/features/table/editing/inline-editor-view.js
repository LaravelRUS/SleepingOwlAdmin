import { bindInlineEditorControl } from './inline-editor-control.js'
import { cloneInlineEditorTemplate } from './inline-editor-template.js'

export function createInlineEditorView(trigger, config, labels, handlers) {
    const elements = cloneInlineEditorTemplate(trigger)
    const control = bindInlineEditorControl(elements.control, config)
    const removeListeners = bindViewEvents(elements, control, handlers)

    const popup = config.mode === 'popup'
    trigger.hidden = !popup
    trigger.setAttribute('aria-expanded', 'true')
    trigger.insertAdjacentElement('afterend', elements.root)
    openPopup(elements.root, popup)
    focusControl(control.focusElement)

    return {
        destroy: () => destroyView(trigger, elements.root, control, removeListeners, popup),
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
    const dialogCancel = (event) => {
        event.preventDefault()
        handlers.cancel()
    }
    const removeBackdropEvents = bindBackdropEvents(elements.root, handlers.cancel)

    elements.form.addEventListener('submit', submit)
    elements.form.addEventListener('keydown', keydown)
    elements.cancel.addEventListener('click', cancel)
    elements.root.addEventListener('cancel', dialogCancel)

    return () => {
        elements.form.removeEventListener('submit', submit)
        elements.form.removeEventListener('keydown', keydown)
        elements.cancel.removeEventListener('click', cancel)
        elements.root.removeEventListener('cancel', dialogCancel)
        removeBackdropEvents()
    }
}

function bindBackdropEvents(root, cancel) {
    let pointerStartedOnBackdrop = false
    let pointerEndedOnBackdrop = false
    const pointerdown = (event) => {
        pointerStartedOnBackdrop = isDialogBackdrop(root, event)
        pointerEndedOnBackdrop = false
    }
    const pointerup = (event) => {
        pointerEndedOnBackdrop = isDialogBackdrop(root, event)
    }
    const click = (event) => {
        if (pointerStartedOnBackdrop && pointerEndedOnBackdrop && isDialogBackdrop(root, event)) {
            cancel()
        }

        pointerStartedOnBackdrop = false
        pointerEndedOnBackdrop = false
    }

    root.addEventListener('pointerdown', pointerdown)
    root.addEventListener('pointerup', pointerup)
    root.addEventListener('click', click)

    return () => {
        root.removeEventListener('pointerdown', pointerdown)
        root.removeEventListener('pointerup', pointerup)
        root.removeEventListener('click', click)
    }
}

function isDialogBackdrop(root, event) {
    return event.target === root && root.tagName === 'DIALOG'
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

function destroyView(trigger, root, control, removeListeners, popup) {
    removeListeners()
    control.destroy?.()
    if (popup && root.open && typeof root.close === 'function') root.close()
    root.remove()
    if (!popup) trigger.hidden = false
    trigger.setAttribute('aria-expanded', 'false')
}

function openPopup(root, popup) {
    if (!popup) return
    if (typeof root.showModal === 'function') root.showModal()
    else root.setAttribute('open', '')
}

function focusControl(element) {
    element?.focus()
}
