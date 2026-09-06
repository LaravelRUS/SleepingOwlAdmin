import { installAlerts } from './install-alerts.js'

if (globalThis.document) bootAlerts(globalThis)

export function bootAlerts(target) {
    const alerts = installAlerts(target.Admin, { root: target.document })
    target.Admin.Alerts = alerts
    alerts.scan()

    return alerts
}
