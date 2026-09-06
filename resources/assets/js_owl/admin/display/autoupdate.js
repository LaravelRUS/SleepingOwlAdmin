const {
    mountTableAutoUpdates,
} = require('../../../../frontend/features/table/autoupdate/table-auto-update')

let controller = null

function mountAutoUpdate() {
    const host = document.querySelector('[data-admin-table-autoupdate]')
    if (!host) return

    controller?.destroy()
    controller = mountTableAutoUpdates(host, {
        ProgressBar: globalThis.ProgressBar,
        scheduler: window,
        tables: Admin.Tables,
    })
}

if (document.readyState === 'complete') {
    globalThis.queueMicrotask(mountAutoUpdate)
} else {
    window.addEventListener('load', mountAutoUpdate, { once: true })
}

module.exports = { mountAutoUpdate }
