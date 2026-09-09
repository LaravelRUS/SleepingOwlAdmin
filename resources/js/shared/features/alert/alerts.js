import { delegate } from '../../../core/dom/listeners.js'

export const ALERT_SELECTOR = '.alert'
export const ALERT_DISMISS_SELECTOR = '[data-bs-dismiss="alert"], [data-dismiss="alert"]'

export function mountAlerts(root) {
    assertRoot(root)
    const pending = new Map()
    const unbind = delegate(root, 'click', ALERT_DISMISS_SELECTOR, (event, trigger) => {
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

export function findAlert(root, element) {
    const target = directAlert(element) ?? targetedAlert(element) ?? closestAlert(element)

    return containedAlert(root, target)
}

export function findAlertDismiss(root, target) {
    const dismiss = target?.closest?.(ALERT_DISMISS_SELECTOR)

    return dismiss && root.contains(dismiss) ? dismiss : null
}

export function isAlertDismissDisabled(element) {
    return hasDisabledAttribute(element) || hasDisabledState(element)
}

export function dispatchAlertEvent(alert, name, trigger, cancelable = false) {
    const CustomEvent = alert.ownerDocument.defaultView.CustomEvent

    return alert.dispatchEvent(
        new CustomEvent(name, {
            bubbles: true,
            cancelable,
            detail: { alert, trigger },
        }),
    )
}

export function transitionMilliseconds(element) {
    const styles = element.ownerDocument.defaultView.getComputedStyle(element)
    const durations = timeList(styles.transitionDuration)
    const delays = timeList(styles.transitionDelay)
    const length = Math.max(durations.length, delays.length)

    return Math.max(
        0,
        ...Array.from({ length }, (_, index) => {
            return durations[index % durations.length] + delays[index % delays.length]
        }),
    )
}

export function waitForAlertTransition(alert, callback, timeout = globalThis.setTimeout) {
    const duration = alert.classList.contains('fade') ? transitionMilliseconds(alert) : 0
    if (duration <= 0) {
        callback()
        return () => {}
    }

    let timer = timeout(callback, duration + 50)
    const finish = (event) => {
        if (event.target !== alert) return
        globalThis.clearTimeout(timer)
        timer = null
        callback()
    }
    alert.addEventListener('transitionend', finish, { once: true })

    return () => {
        if (timer !== null) globalThis.clearTimeout(timer)
        alert.removeEventListener('transitionend', finish)
    }
}

function permitAlertClose(alert, trigger) {
    return (
        dispatchAlertEvent(alert, 'alert:close', trigger, true) &&
        dispatchAlertEvent(alert, 'close.bs.alert', trigger, true)
    )
}

function notifyAlertClosed(alert, trigger) {
    dispatchAlertEvent(alert, 'alert:closed', trigger)
    dispatchAlertEvent(alert, 'closed.bs.alert', trigger)
}

function directAlert(element) {
    return element?.matches?.(ALERT_SELECTOR) ? element : null
}

function closestAlert(element) {
    return element?.closest?.(ALERT_SELECTOR) ?? null
}

function containedAlert(root, alert) {
    return alert && root.contains(alert) ? alert : null
}

function hasDisabledAttribute(element) {
    return element?.hasAttribute?.('disabled') === true
}

function hasDisabledState(element) {
    return (
        element?.getAttribute?.('aria-disabled') === 'true' ||
        element?.classList?.contains('disabled') === true
    )
}

function targetedAlert(element) {
    const target = element?.getAttribute?.('data-target') ?? element?.getAttribute?.('href') ?? ''

    return target.startsWith('#') ? element.ownerDocument.getElementById(target.slice(1)) : null
}

function timeList(value) {
    return value.split(',').map(timeMilliseconds)
}

function timeMilliseconds(value) {
    const number = Number.parseFloat(value)
    if (!Number.isFinite(number)) return 0

    return value.trim().endsWith('ms') ? number : number * 1000
}
