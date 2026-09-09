import Sortable from 'sortablejs'

import { createTreeDefinition, TREE_COMPONENT } from './tree.js'

export function installTrees(admin, options = {}) {
    assertAdmin(admin)
    const definition = createTreeDefinition({
        events: admin.Events,
        http: admin.Http,
        labels: options.labels,
        notifications: options.notifications,
        sortable: options.sortable ?? Sortable,
    })
    admin.Components.register(definition)
    const scan = (root = options.root ?? globalThis.document) => {
        return admin.Components.scan(root, TREE_COMPONENT)
    }

    admin.Modules?.register?.('display.tree', () => scan(), 0, ['bootstrap::tab::shown'])

    return { definition, scan }
}

function assertAdmin(admin) {
    assertFunction(admin?.Components, 'register', 'Trees require Admin.Components.')
    assertFunction(admin?.Components, 'scan', 'Trees require Admin.Components.')
    assertFunction(admin?.Http, 'post', 'Trees require Admin.Http.')
}

function assertFunction(object, method, message) {
    if (typeof object?.[method] !== 'function') throw new TypeError(message)
}
