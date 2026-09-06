import { componentMountSkipped } from '../../../core/lifecycle/component-lifecycle.js'
import { readWysiwygConfig } from './wysiwyg-config.js'

export const WYSIWYG_COMPONENT = 'wysiwyg'
export const WYSIWYG_SELECTOR = 'textarea[data-wysiwyg-editor]'
export const WYSIWYG_INIT_ATTRIBUTE = 'data-wysiwyg-inited'

export function createWysiwygDefinition(registry) {
    assertRegistry(registry)

    return {
        mount: (textarea) => mountWysiwyg(textarea, registry),
        name: WYSIWYG_COMPONENT,
        selector: WYSIWYG_SELECTOR,
    }
}

export function mountWysiwyg(textarea, registry) {
    if (textarea.hasAttribute(WYSIWYG_INIT_ATTRIBUTE)) return componentMountSkipped

    const config = readWysiwygConfig(textarea)
    textarea.setAttribute(WYSIWYG_INIT_ATTRIBUTE, '1')
    registry.switchOn(config.id, config.editor, config.parameters)

    return {
        destroy() {
            textarea.removeAttribute(WYSIWYG_INIT_ATTRIBUTE)
            registry.switchOff(config.id)
        },
    }
}

function assertRegistry(registry) {
    if (typeof registry?.switchOn !== 'function' || typeof registry?.switchOff !== 'function') {
        throw new TypeError('WYSIWYG component requires the editor registry.')
    }
}
