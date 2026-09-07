import { bindFieldGenerator } from './field-generator.js'

export const TEXT_GENERATOR_COMPONENT = 'form-text-generator'
export const TEXT_GENERATOR_SELECTOR = '.form-element-text'

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
