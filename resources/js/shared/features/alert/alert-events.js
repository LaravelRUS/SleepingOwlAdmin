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

export function permitAlertClose(alert, trigger) {
    return (
        dispatchAlertEvent(alert, 'alert:close', trigger, true) &&
        dispatchAlertEvent(alert, 'close.bs.alert', trigger, true)
    )
}

export function notifyAlertClosed(alert, trigger) {
    dispatchAlertEvent(alert, 'alert:closed', trigger)
    dispatchAlertEvent(alert, 'closed.bs.alert', trigger)
}
