import { createInlineEditorDefinition, INLINE_EDITOR_COMPONENT } from './inline-editor.js'
import { bindInlineEditorTableRefresh } from './inline-editor-table-refresh.js'

export function installInlineEditors(admin, options = {}) {
    assertAdmin(admin)
    const root = options.root ?? globalThis.document
    const definition = createInlineEditorDefinition({
        components: admin.Components,
        http: admin.Http,
        labels: options.labels,
        messages: admin.Messages,
    })
    admin.Components.register(definition)
    const scan = (scanRoot = root) => admin.Components.scan(scanRoot, INLINE_EDITOR_COMPONENT)
    const refreshMode = tableRefreshMode(admin)
    const destroy = refreshMode
        ? bindInlineEditorTableRefresh(root, admin.Tables, refreshMode)
        : () => {}

    admin.Modules.register('display.columns.inline-edit', () => scan(), 0, [
        'bootstrap::tab::shown',
    ])

    return { definition, destroy, scan }
}

function assertAdmin(admin) {
    assertFunction(admin?.Components, 'register', 'Inline editors require Admin.Components.')
    assertFunction(admin?.Config, 'get', 'Inline editors require Admin.Config.')
    assertFunction(admin?.Modules, 'register', 'Inline editors require Admin.Modules.')
    assertFunction(admin?.Http, 'post', 'Inline editors require Admin.Http.')
    assertFunction(admin?.Tables, 'get', 'Inline editors require Admin.Tables.')
}

function tableRefreshMode(admin) {
    const mode = admin.Config.get('datatables_inline_edit_refresh', 'row')

    if (mode === false) return null
    if (mode === 'row' || mode === 'table') return mode

    throw new TypeError(`Unsupported inline edit refresh mode [${String(mode)}].`)
}

function assertFunction(object, method, message) {
    if (typeof object?.[method] !== 'function') throw new TypeError(message)
}
