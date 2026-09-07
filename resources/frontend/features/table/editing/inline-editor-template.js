const TEMPLATE_ID_ATTRIBUTE = 'inlineEditorTemplateId'
const TEMPLATE_SELECTOR = '[data-inline-editor-template]'
const ROOT_SELECTOR = '[data-inline-editor-root]'
const FORM_SELECTOR = '[data-inline-editor-form]'
const CONTROL_SELECTOR = '[data-inline-editor-control]'
const CLEAR_SELECTOR = '[data-inline-editor-clear]'
const CANCEL_SELECTOR = '[data-inline-editor-cancel]'
const ERROR_SELECTOR = '[data-inline-editor-error]'

export function cloneInlineEditorTemplate(trigger) {
    const template = readTemplate(trigger)
    const root = cloneSingleRoot(template)

    return {
        cancel: requiredDescendant(root, CANCEL_SELECTOR, 'cancel control'),
        clear: root.querySelector?.(CLEAR_SELECTOR) ?? null,
        control: requiredDescendant(root, CONTROL_SELECTOR, 'value control'),
        error: requiredDescendant(root, ERROR_SELECTOR, 'error region'),
        form: requiredDescendant(root, FORM_SELECTOR, 'form'),
        root,
    }
}

function readTemplate(trigger) {
    const id = trigger.dataset?.[TEMPLATE_ID_ATTRIBUTE]
    const template = id ? trigger.ownerDocument?.getElementById(id) : null

    if (template?.matches?.(TEMPLATE_SELECTOR) && template.content) return template

    throw new TypeError('Inline editor requires a referenced Blade template.')
}

function cloneSingleRoot(template) {
    const fragment = template.content.cloneNode(true)
    if (fragment.children?.length !== 1) {
        throw new TypeError('Inline editor template requires one root element.')
    }

    const root = fragment.firstElementChild
    if (!root?.matches?.(ROOT_SELECTOR)) {
        throw new TypeError('Inline editor template requires a marked root element.')
    }

    return root
}

function requiredDescendant(root, selector, label) {
    const element = root.matches?.(selector) ? root : root.querySelector?.(selector)
    if (!element) throw new TypeError(`Inline editor template requires a ${label}.`)

    return element
}
