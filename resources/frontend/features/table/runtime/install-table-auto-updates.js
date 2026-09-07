import { mountTableAutoUpdates } from '../autoupdate/table-auto-update.js'

export const TABLE_AUTO_UPDATES_COMPONENT = 'table-auto-updates'
export const TABLE_AUTO_UPDATES_SELECTOR = '[data-admin-table-autoupdate]'

export function installTableAutoUpdates(admin, options) {
    assertOptions(admin, options)
    const definition = {
        mount: (host) =>
            mountTableAutoUpdates(host, {
                now: options.now,
                ProgressBar: options.ProgressBar,
                scheduler: options.scheduler,
                tables: admin.Tables,
            }),
        name: TABLE_AUTO_UPDATES_COMPONENT,
        selector: TABLE_AUTO_UPDATES_SELECTOR,
    }
    const scan = (root = options.root) => admin.Components.scan(root, TABLE_AUTO_UPDATES_COMPONENT)

    admin.Components.register(definition)
    scanAfterDocumentReady(options.root, scan)

    return { definition, scan }
}

function scanAfterDocumentReady(root, scan) {
    if (root.readyState !== 'loading' || typeof root.addEventListener !== 'function') return

    root.addEventListener('DOMContentLoaded', () => scan(root), { once: true })
}

function assertOptions(admin, options) {
    const dependencies = [
        admin?.Components,
        admin?.Tables,
        options?.ProgressBar,
        options?.root,
        options?.scheduler,
    ]

    if (dependencies.some((dependency) => !dependency)) {
        throw new TypeError('Table auto-updates require lifecycle, registry and browser drivers.')
    }
}
