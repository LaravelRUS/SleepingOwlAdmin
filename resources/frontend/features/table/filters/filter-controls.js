export function bindFilterControls(container, { clear, execute, reload }) {
    assertCallbacks(clear, execute, reload)

    bindClick(container, '#filters-exec', execute)
    bindClick(container, '#filters-cancel', clear)

    for (const input of container.querySelectorAll('[data-index] input')) {
        input.addEventListener('keyup', (event) => {
            if (isEnter(event)) reload()
        })
    }
}

export function clearFilterControls(containers) {
    for (const container of containers) {
        for (const control of container.querySelectorAll(
            '[data-index] input, [data-index] select',
        )) {
            resetControl(control)
            dispatchChange(control)
        }
    }
}

function bindClick(container, selector, listener) {
    for (const control of container.querySelectorAll(selector)) {
        control.addEventListener('click', listener)
    }
}

function resetControl(control) {
    if (control.options) {
        for (const option of control.options) {
            option.selected = false
        }
        control.selectedIndex = -1
    } else {
        control.value = ''
    }
}

function dispatchChange(control) {
    const EventConstructor = control.ownerDocument?.defaultView?.Event ?? globalThis.Event

    control.dispatchEvent(new EventConstructor('change', { bubbles: true }))
}

function isEnter(event) {
    return event.key === 'Enter' || event.keyCode === 13
}

function assertCallbacks(clear, execute, reload) {
    if (![clear, execute, reload].every((callback) => typeof callback === 'function')) {
        throw new TypeError('Table filter controls require clear, execute and reload callbacks.')
    }
}
