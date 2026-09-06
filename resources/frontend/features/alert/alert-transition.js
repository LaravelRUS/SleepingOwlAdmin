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

function timeList(value) {
    return value.split(',').map(timeMilliseconds)
}

function timeMilliseconds(value) {
    const number = Number.parseFloat(value)
    if (!Number.isFinite(number)) return 0

    return value.trim().endsWith('ms') ? number : number * 1000
}
