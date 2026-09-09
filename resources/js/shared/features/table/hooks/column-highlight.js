const bindings = new WeakMap()

export function syncColumnHighlight(element, table, enabled) {
    if (!enabled) {
        removeColumnHighlight(element)

        return null
    }

    const current = bindings.get(element)
    if (current) {
        current.table = table

        return current.destroy
    }

    return bindColumnHighlight(element, table)
}

export function highlightColumn(table, cell) {
    if (!table.data().any()) {
        return
    }

    const index = table.cell(cell).index()?.column
    if (index === undefined) {
        return
    }

    Array.from(table.cells().nodes()).forEach((node) => node.classList.remove('highlight'))
    Array.from(table.column(index).nodes()).forEach((node) => node.classList.add('highlight'))
}

function bindColumnHighlight(element, table) {
    const binding = { destroy: null, table }
    const onMouseOver = (event) => handleMouseOver(element, binding.table, event)

    binding.destroy = () => {
        element.removeEventListener('mouseover', onMouseOver)
        bindings.delete(element)
    }
    element.addEventListener('mouseover', onMouseOver)
    bindings.set(element, binding)

    return binding.destroy
}

function removeColumnHighlight(element) {
    bindings.get(element)?.destroy()
}

function handleMouseOver(element, table, event) {
    const cell = event.target.closest?.('td')
    if (!cell || !element.contains(cell) || cell.contains(event.relatedTarget)) {
        return
    }

    highlightColumn(table, cell)
}
