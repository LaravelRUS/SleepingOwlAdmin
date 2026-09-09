import { listen } from '../../../core/dom/listeners.js'

export const DEFAULT_GENERATED_CHARACTERS =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const PASSWORD_COMPONENT = 'form-password'
export const PASSWORD_SELECTOR = '.password-field'
export const TEXT_GENERATOR_COMPONENT = 'form-text-generator'
export const TEXT_GENERATOR_SELECTOR = '.form-element-text'

export function generateFieldValue(field, random = Math.random) {
    const characters = field.dataset.generateChars || DEFAULT_GENERATED_CHARACTERS
    const length = positiveInteger(field.dataset.generateLength, 8)

    return Array.from({ length }, () => randomCharacter(characters, random)).join('')
}

export function bindFieldGenerator(root, field, random) {
    const control = root.querySelector('.generate')
    if (!control || !field) return () => {}

    return listen(control, 'click', () => {
        field.value = generateFieldValue(field, random)
        dispatchValueChange(field)
    })
}

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

export function installTextGenerators(admin, options = {}) {
    const definition = createTextGeneratorDefinition(options.random)
    admin.Components.register(definition)
    const scan = (root = options.root ?? globalThis.document) => {
        return admin.Components.scan(root, TEXT_GENERATOR_COMPONENT)
    }
    admin.Modules.register('form.elements.text', () => scan())

    return { definition, scan }
}

export function createTextGeneratorDefinition(random) {
    return {
        mount: (element) =>
            bindFieldGenerator(element, element.querySelector('.text-element'), random),
        name: TEXT_GENERATOR_COMPONENT,
        selector: TEXT_GENERATOR_SELECTOR,
    }
}

function dispatchValueChange(field) {
    const Event = field.ownerDocument.defaultView.Event
    field.dispatchEvent(new Event('input', { bubbles: true }))
    field.dispatchEvent(new Event('change', { bubbles: true }))
}

function randomCharacter(characters, random) {
    const index = Math.floor(random() * characters.length)

    return characters.charAt(Math.min(index, characters.length - 1))
}

function positiveInteger(value, fallback) {
    const number = Number.parseInt(value, 10)

    return Number.isInteger(number) && number > 0 ? number : fallback
}

function togglePassword(field, control) {
    const visible = field.type === 'password'
    field.type = visible ? 'text' : 'password'
    control.setAttribute('aria-pressed', String(visible))
    const icon = control.querySelector('i')
    icon?.classList.toggle('fa-eye', !visible)
    icon?.classList.toggle('fa-eye-slash', visible)
}
