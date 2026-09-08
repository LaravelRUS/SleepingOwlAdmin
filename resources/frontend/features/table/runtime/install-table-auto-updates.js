import {
    AUTO_UPDATE_FEATURE,
    installTableAutoUpdateFeature,
} from '../autoupdate/table-auto-update.js'

export const TABLE_AUTO_UPDATES_COMPONENT = 'table-auto-updates'
export const TABLE_AUTO_UPDATES_SELECTOR = '[data-admin-table-autoupdate]'

export function installTableAutoUpdates(admin, options) {
    assertOptions(admin, options)
    installTableAutoUpdateFeature(options.engine, {
        now: options.now,
        ProgressBar: options.ProgressBar,
        scheduler: options.scheduler,
        tables: admin.Tables,
    })

    return { feature: AUTO_UPDATE_FEATURE, scan: () => 0 }
}

function assertOptions(admin, options) {
    const dependencies = [admin?.Tables, options?.engine, options?.ProgressBar, options?.scheduler]

    if (dependencies.some((dependency) => !dependency)) {
        throw new TypeError('Table auto-updates require lifecycle, registry and browser drivers.')
    }
}
