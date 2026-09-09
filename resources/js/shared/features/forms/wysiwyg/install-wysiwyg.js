import { createWysiwygDefinition, WYSIWYG_COMPONENT } from './wysiwyg-component.js'

export const LEGACY_WYSIWYG_MODULE = 'form.elements.wysiwyg'

export function installWysiwyg(admin, options = {}) {
    assertAdmin(admin)
    const definition = createWysiwygDefinition(admin.WYSIWYG)
    admin.Components.register(definition)
    const scan = (root = options.root ?? globalThis.document) => {
        return admin.Components.scan(root, WYSIWYG_COMPONENT)
    }
    admin.Modules.register(LEGACY_WYSIWYG_MODULE, scan)

    return { definition, scan }
}

function assertAdmin(admin) {
    assertComponents(admin?.Components)
    assertFunction(admin?.Modules?.register, 'WYSIWYG requires Admin.Modules.')
    assertFunction(admin?.WYSIWYG?.switchOn, 'WYSIWYG requires Admin.WYSIWYG.')
}

function assertComponents(components) {
    assertFunction(components?.register, 'WYSIWYG requires Admin.Components.')
    assertFunction(components?.scan, 'WYSIWYG requires Admin.Components.scan().')
}

function assertFunction(value, message) {
    if (typeof value !== 'function') throw new TypeError(message)
}
