import Sortable from 'sortablejs'

import { createFilesDefinition, FILES_COMPONENT } from './files-controller.js'

export const LEGACY_FILES_MODULE = 'form.elements.files'

export function installFiles(admin, options = {}) {
    assertAdmin(admin)
    const definition = createFilesDefinition({
        http: admin.Http,
        notifications: options.notifications,
        sortable: options.sortable ?? Sortable,
    })
    admin.Components.register(definition)
    const scan = (root = options.root ?? globalThis.document) => {
        return admin.Components.scan(root, FILES_COMPONENT)
    }
    admin.Modules.register(LEGACY_FILES_MODULE, scan)

    return { definition, scan }
}

function assertAdmin(admin) {
    assertFunction(admin?.Components?.register, 'Files require Admin.Components.')
    assertFunction(admin?.Components?.scan, 'Files require Admin.Components.scan().')
    assertFunction(admin?.Modules?.register, 'Files require Admin.Modules compatibility registry.')
}

function assertFunction(value, message) {
    if (typeof value !== 'function') throw new TypeError(message)
}
