import { componentMountSkipped } from '../../../core/lifecycle/component-lifecycle.js'
import { createDatePickerOptions } from './date-options.js'

export const DATE_CONTROL_COMPONENT = 'date-control'
export const DATE_CONTROL_SELECTOR = 'input[data-date-control]'

export function createDateControlDefinition(Datepicker, locale) {
    if (typeof Datepicker !== 'function') {
        throw new TypeError('Date controls require an Air Datepicker constructor.')
    }

    return {
        name: DATE_CONTROL_COMPONENT,
        selector: DATE_CONTROL_SELECTOR,
        mount: (input) => mountDateControl(input, Datepicker, locale),
    }
}

export function mountDateControl(input, Datepicker, locale) {
    if (input.disabled || input.readOnly) return componentMountSkipped

    const options = createDatePickerOptions(input, locale)
    const picker = new Datepicker(input, options)
    const addon = findAddon(input)
    const show = (event) => {
        event.preventDefault()
        input.focus()
        picker.show()
    }

    addon?.addEventListener('click', show)
    if (options.showEvent !== 'click' && input.ownerDocument?.activeElement === input) {
        picker.show()
    }

    return {
        destroy() {
            addon?.removeEventListener('click', show)
            picker.destroy()
        },
        picker,
    }
}

function findAddon(input) {
    return input.closest('.input-date')?.querySelector('.input-group-addon, .input-group-prepend')
}
