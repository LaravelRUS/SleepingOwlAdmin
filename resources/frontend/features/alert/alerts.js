import { delegate } from '../../core/dom/listeners.js'
import { findAlert, isAlertDismissDisabled } from './alert-elements.js'
import { notifyAlertClosed, permitAlertClose } from './alert-events.js'
import { waitForAlertTransition } from './alert-transition.js'

export function mountAlerts(root) {
    assertRoot(root)
    const pending = new Map()
    const unbind = delegate(root, 'click', '[data-dismiss="alert"]', (event, trigger) => {
        if (isAlertDismissDisabled(trigger)) return
        event.preventDefault()
        closeAlert(root, pending, trigger)
    })

    return {
        close: (element) => closeAlert(root, pending, element),
        destroy: () => destroyAlerts(pending, unbind),
    }
}

function closeAlert(root, pending, element) {
    const alert = findAlert(root, element)
    if (!alert || pending.has(alert) || !permitAlertClose(alert, element)) return false

    alert.classList.remove('show')
    const finish = () => removeAlert(pending, alert, element)
    pending.set(alert, () => {})
    const cancel = waitForAlertTransition(alert, finish)
    if (pending.has(alert)) pending.set(alert, cancel)

    return true
}

function removeAlert(pending, alert, trigger) {
    pending.get(alert)?.()
    pending.delete(alert)
    alert.remove()
    notifyAlertClosed(alert, trigger)
}

function destroyAlerts(pending, unbind) {
    unbind()
    pending.forEach((cancel) => cancel())
    pending.clear()
}

function assertRoot(root) {
    if (typeof root?.addEventListener !== 'function' || typeof root?.contains !== 'function') {
        throw new TypeError('Alerts require a DOM query root.')
    }
}
