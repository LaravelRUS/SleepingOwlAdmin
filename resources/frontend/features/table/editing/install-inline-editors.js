import { createInlineEditorDefinition, INLINE_EDITOR_COMPONENT } from './inline-editor.js'

export function installInlineEditors(admin, options = {}) {
    assertAdmin(admin)
    const definition = createInlineEditorDefinition({
        components: admin.Components,
        http: admin.Http,
        labels: options.labels,
        messages: admin.Messages,
    })
    admin.Components.register(definition)
    const scan = (root = options.root ?? globalThis.document) =>
        admin.Components.scan(root, INLINE_EDITOR_COMPONENT)

    admin.Modules.register('display.columns.inline-edit', () => scan(), 0, [
        'bootstrap::tab::shown',
    ])

    return { definition, scan }
}

function assertAdmin(admin) {
    assertFunction(admin?.Components, 'register', 'Inline editors require Admin.Components.')
    assertFunction(admin?.Modules, 'register', 'Inline editors require Admin.Modules.')
    assertFunction(admin?.Http, 'post', 'Inline editors require Admin.Http.')
}

function assertFunction(object, method, message) {
    if (typeof object?.[method] !== 'function') throw new TypeError(message)
}
