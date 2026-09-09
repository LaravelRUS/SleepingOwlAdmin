import { listen } from '../../../../core/dom/listeners.js'
import { bindFieldGenerator } from './field-generator.js'

export const PASSWORD_COMPONENT = 'form-password'
export const PASSWORD_SELECTOR = '.password-field'

export function installPasswordControls(admin, options = {}) {
    const definition = createPasswordDefinition(options.random)
    admin.Components.register(definition)
    const scan = (root = options.root ?? globalThis.document) => {
        return admin.Components.scan(root, PASSWORD_COMPONENT)
    }
    admin.Modules.register('form.elements.password', () => scan())

    return { definition, scan }
}

export function createPasswordDefinition(random) {
    return {
        mount: (element) => mountPasswordControl(element, random),
        name: PASSWORD_COMPONENT,
        selector: PASSWORD_SELECTOR,
    }
}

export function mountPasswordControl(element, random = Math.random) {
    const field = element.querySelector('.passwd')
    const show = element.querySelector('.button-show')
    const removers = [bindFieldGenerator(element, field, random)]
    if (field && show) removers.push(listen(show, 'click', () => togglePassword(field, show)))

    return () => removers.reverse().forEach((remove) => remove())
}

function togglePassword(field, control) {
    const visible = field.type === 'password'
    field.type = visible ? 'text' : 'password'
    control.setAttribute('aria-pressed', String(visible))
    const icon = control.querySelector('i')
    icon?.classList.toggle('fa-eye', !visible)
    icon?.classList.toggle('fa-eye-slash', visible)
}
