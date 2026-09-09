import { mountAlerts } from './alerts.js'

export const ALERT_COMPONENT = 'alerts'
export const ALERT_ROOT_SELECTOR = 'body'

export function installAlerts(admin, options = {}) {
    assertAdmin(admin)
    let controller = null
    admin.Components.register({
        mount: (body) => {
            controller = mountAlerts(body)
            return { destroy: () => controller?.destroy() }
        },
        name: ALERT_COMPONENT,
        selector: ALERT_ROOT_SELECTOR,
    })

    return {
        close: (element) => controller?.close(element) ?? false,
        scan: (root = options.root ?? globalThis.document) => {
            return admin.Components.scan(root, ALERT_COMPONENT)
        },
    }
}

function assertAdmin(admin) {
    if (typeof admin?.Components?.register !== 'function') {
        throw new TypeError('Alerts require Admin.Components.')
    }
    if (typeof admin.Components.scan !== 'function') {
        throw new TypeError('Alerts require Admin.Components.scan().')
    }
}
