export const ALERT_SELECTOR = '.alert'
export const ALERT_DISMISS_SELECTOR = '[data-dismiss="alert"]'

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
