const INLINE_EDIT_SUBMITTED_EVENT = 'inline-edit:submitted'
const REFRESH_MODES = new Set(['row', 'table'])

export function bindInlineEditorTableRefresh(
    root,
    tables,
    mode = 'row',
    schedule = globalThis.queueMicrotask,
) {
    assertDependencies(root, tables, mode, schedule)

    const refresh = (event) => {
        const trigger = event.target
        const table = trigger?.closest?.('table.datatables')
        const row = trigger?.closest?.('tr')
        const adapter = table ? tables.get(table) : null

        if (!adapter) return

        schedule(() => refreshTable(adapter, row, mode))
    }

    root.addEventListener(INLINE_EDIT_SUBMITTED_EVENT, refresh)

    return () => root.removeEventListener(INLINE_EDIT_SUBMITTED_EVENT, refresh)
}

function refreshTable(adapter, row, mode) {
    if (mode === 'row' && typeof adapter.refreshRow === 'function') {
        adapter.refreshRow(row)
        return
    }

    if (mode === 'table' && typeof adapter.refresh === 'function') {
        adapter.refresh()
        return
    }

    adapter.reload(false)
}

function assertDependencies(root, tables, mode, schedule) {
    const message = 'Inline editor table refresh requires events, tables and a scheduler.'

    assertMethod(root, 'addEventListener', message)
    assertMethod(root, 'removeEventListener', message)
    assertMethod(tables, 'get', message)
    if (!REFRESH_MODES.has(mode)) throw new TypeError(message)
    if (typeof schedule !== 'function') throw new TypeError(message)
}

function assertMethod(object, method, message) {
    if (typeof object?.[method] !== 'function') throw new TypeError(message)
}
