import { readControlValue } from '../filters/filter-elements.js'

export function filterStateKey(path, tableId) {
    const normalized = path.match(/\d+\/edit$/) ? path.replace(/\d+\/edit$/, 'edit') : path
    const legacyKey = `Filters_/${normalized}`

    return tableId === undefined
        ? legacyKey
        : `${legacyKey}::${globalThis.encodeURIComponent(String(tableId))}`
}

export function migrateLegacyFilterState(storage, path, containers) {
    const legacyKey = filterStateKey(path)
    const serialized = storage.getItem(legacyKey)

    if (!serialized) return []

    const migration = groupLegacyState(parseState(serialized), containers)
    const keys = writeMigratedState(storage, path, migration.tables)

    if (migration.complete) {
        storage.removeItem(legacyKey)
    }

    return keys
}

export function loadFilterState(storage, key, containers) {
    const serialized = storage.getItem(key)

    if (serialized) {
        restoreFilterState(containers, parseState(serialized))
    }
}

export function saveFilterState(storage, key, containers) {
    const state = collectFilterState(containers)

    if (Object.keys(state).length === 0) {
        storage.removeItem(key)
        return
    }

    storage.setItem(key, JSON.stringify(state))
}

export function clearFilterState(storage, key) {
    storage.removeItem(key)
}

export function clearSavedTableSearch(_settings, state) {
    state.search.search = ''

    for (const column of state.columns) {
        column.search.search = ''
    }
}

function collectFilterState(containers) {
    return Object.fromEntries(
        [...containers]
            .map((container, index) => [index, collectContainerState(container)])
            .filter(([, state]) => Object.keys(state).length > 0),
    )
}

function groupLegacyState(state, containers) {
    const tables = new Map()
    let complete = true

    for (const [containerIndex, columns] of Object.entries(state)) {
        const tableId = containers[containerIndex]?.dataset?.datatablesId

        if (!tableId) {
            complete = false
            continue
        }

        const table = tables.get(tableId) ?? []
        table.push(columns)
        tables.set(tableId, table)
    }

    return { complete, tables }
}

function writeMigratedState(storage, path, tables) {
    const keys = []

    for (const [tableId, containers] of tables) {
        const key = filterStateKey(path, tableId)
        keys.push(key)

        if (storage.getItem(key) === null) {
            storage.setItem(key, JSON.stringify(Object.fromEntries(containers.entries())))
        }
    }

    return keys
}

function collectContainerState(container) {
    return Object.fromEntries(
        [...container.querySelectorAll('[data-index]')]
            .map((column) => [column.dataset.index, collectColumnState(column)])
            .filter(([, state]) => state !== null),
    )
}

function collectColumnState(column) {
    const filter = column.querySelector('.column-filter')
    const type = filter?.dataset.type

    if (!filter || type === 'control') {
        return null
    }

    const value = type === 'range' ? collectRangeState(filter) : readControlValue(filter)

    return isEmptyValue(value) ? null : { type, val: value }
}

function collectRangeState(filter) {
    return Object.fromEntries(
        [...filter.querySelectorAll('.form-control.column-filter')]
            .map((control, index) => [index, control.value])
            .filter(([, value]) => value !== ''),
    )
}

function restoreFilterState(containers, state) {
    for (const [containerIndex, columns] of Object.entries(state)) {
        const container = containers[containerIndex]

        if (container) {
            restoreContainerState(container, columns)
        }
    }
}

function restoreContainerState(container, columns) {
    for (const [index, state] of Object.entries(columns)) {
        const column = findColumn(container, index)

        if (state.type === 'range') {
            restoreRangeState(column, state.val)
        } else {
            setControlValue(column?.querySelector('.column-filter'), state.val)
        }
    }
}

function restoreRangeState(column, values) {
    const controls = column?.querySelectorAll('[data-type="range"] .column-filter') ?? []

    for (const [index, value] of Object.entries(values)) {
        setControlValue(controls[index], value)
    }
}

function findColumn(container, index) {
    return [...container.querySelectorAll('[data-index]')].find(
        (column) => column.dataset.index === index,
    )
}

function setControlValue(control, value) {
    if (!control) {
        return
    }

    if (control.multiple && Array.isArray(value)) {
        for (const option of control.options) {
            option.selected = value.includes(option.value)
        }
    } else {
        control.value = value
    }

    control.dispatchEvent(new globalThis.Event('change', { bubbles: true }))
}

function isEmptyValue(value) {
    if (value === null || value === '') return true
    if (Array.isArray(value)) return value.length === 0

    return typeof value === 'object' && Object.keys(value).length === 0
}

function parseState(serialized) {
    try {
        return JSON.parse(serialized)
    } catch (error) {
        throw new TypeError('Saved table filters contain invalid JSON.', { cause: error })
    }
}
