import {
    AUTO_UPDATE_FEATURE,
    installTableAutoUpdateFeature,
    readAutoUpdateConfig,
} from '../autoupdate/table-auto-update.js'

export const TABLE_AUTO_UPDATES_COMPONENT = 'table-auto-updates'
export const TABLE_AUTO_UPDATES_SELECTOR = '[data-admin-table-autoupdate]'

export function installTableAutoUpdates(admin, options) {
    assertOptions(admin, options)
    if (!hasAutoUpdateTargets(options.root)) {
        return { feature: AUTO_UPDATE_FEATURE, scan: () => 0 }
    }

    installTableAutoUpdateFeature(options.engine, {
        now: options.now,
        ProgressBar: options.ProgressBar,
        scheduler: options.scheduler,
        tables: admin.Tables,
    })

    return { feature: AUTO_UPDATE_FEATURE, scan: () => 0 }
}

export function hasAutoUpdateTargets(root) {
    const hosts = Array.from(root.querySelectorAll(TABLE_AUTO_UPDATES_SELECTOR))
    const tables = Array.from(root.querySelectorAll('.datatables'))

    return hosts.some((host) => tables.some((table) => readAutoUpdateConfig(host, table)))
}

function assertOptions(admin, options) {
    const dependencies = [
        admin?.Tables,
        options?.engine,
        options?.ProgressBar,
        options?.root,
        options?.scheduler,
    ]

    if (
        dependencies.some((dependency) => !dependency) ||
        typeof options.root.querySelectorAll !== 'function'
    ) {
        throw new TypeError('Table auto-updates require lifecycle, registry and browser drivers.')
    }
}
