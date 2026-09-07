import { delegate } from '../../../core/dom/listeners.js'

const CHECKBOX_SELECTOR = '.adminCheckboxRow, .adminCheckboxAll'

export function bindTableCheckboxes({ root, selectedRowClass = null }) {
    return delegate(root, 'change', CHECKBOX_SELECTOR, (_event, checkbox) => {
        if (checkbox.classList.contains('adminCheckboxAll')) {
            updateTableSelection(checkbox, selectedRowClass)
            return
        }

        updateRowSelection(checkbox, selectedRowClass)
    })
}

export function updateRowSelection(checkbox, selectedRowClass = null) {
    const row = checkbox.closest('tr')
    if (!row) {
        return
    }

    row.toggleAttribute('data-selected', checkbox.checked)
    row.setAttribute('aria-selected', String(checkbox.checked))

    if (selectedRowClass) {
        row.classList.toggle(selectedRowClass, checkbox.checked)
    }
}

function updateTableSelection(selectAll, selectedRowClass) {
    const table = selectAll.closest('table')
    if (!table) {
        return
    }

    table.querySelectorAll('.adminCheckboxRow').forEach((checkbox) => {
        if (checkbox.checked === selectAll.checked) {
            updateRowSelection(checkbox, selectedRowClass)
            return
        }

        checkbox.checked = selectAll.checked
        dispatchChange(checkbox)
    })
}

function dispatchChange(element) {
    const EventConstructor = element.ownerDocument?.defaultView?.Event ?? globalThis.Event
    element.dispatchEvent(new EventConstructor('change', { bubbles: true }))
}
