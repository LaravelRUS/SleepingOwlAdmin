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

export function assignFilterControlIds(containers, tableId) {
    const tablePart = normalizeIdPart(tableId)

    containers.forEach((container, containerIndex) => {
        for (const column of container.querySelectorAll('[data-index]')) {
            const columnPart = normalizeIdPart(column.dataset.index)

            column.querySelectorAll('input, select').forEach((control, controlIndex) => {
                control.id ||= `datatable-${tablePart}-filter-${containerIndex}-${columnPart}-${controlIndex}`
            })
        }
    })
}

function bindClick(container, selector, listener) {
    for (const control of container.querySelectorAll(selector)) {
        control.addEventListener('click', listener)
    }
}

function resetControl(control) {
    if (control.dataset.filterDefault !== undefined) {
        restoreControlValue(control, JSON.parse(control.dataset.filterDefault))
        return
    }

    if (control.options) {
        resetSelectControl(control)
        return
    }

    if (isCheckable(control)) {
        control.checked = control.defaultChecked
        return
    }

    control.value = control.defaultValue
}

function resetSelectControl(control) {
    let hasDefault = false

    for (const option of control.options) {
        option.selected = option.defaultSelected
        hasDefault ||= option.defaultSelected
    }

    if (!hasDefault) control.selectedIndex = control.multiple ? -1 : 0
}

function isCheckable(control) {
    return control.type === 'checkbox' || control.type === 'radio'
}

function restoreControlValue(control, value) {
    if (!control.options) {
        control.value = value ?? ''
        return
    }

    const values = (Array.isArray(value) ? value : [value]).map(String)

    for (const option of control.options) {
        option.selected = values.includes(option.value)
    }
}

function normalizeIdPart(value) {
    return String(value ?? 'unknown').replace(/[^a-zA-Z0-9_-]+/g, '-')
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
