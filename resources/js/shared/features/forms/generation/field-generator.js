import { listen } from '../../../../core/dom/listeners.js'
import { generateFieldValue } from './generated-value.js'

export function bindFieldGenerator(root, field, random) {
    const control = root.querySelector('.generate')
    if (!control || !field) return () => {}

    return listen(control, 'click', () => {
        field.value = generateFieldValue(field, random)
        dispatchValueChange(field)
    })
}

function dispatchValueChange(field) {
    const Event = field.ownerDocument.defaultView.Event
    field.dispatchEvent(new Event('input', { bubbles: true }))
    field.dispatchEvent(new Event('change', { bubbles: true }))
}
