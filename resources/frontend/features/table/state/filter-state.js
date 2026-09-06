import { readControlValue } from '../filters/filter-elements.js'

export function filterStateKey(path) {
    const normalized = path.match(/\d+\/edit$/) ? path.replace(/\d+\/edit$/, 'edit') : path

    return `Filters_/${normalized}`
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
    return value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

function parseState(serialized) {
    try {
        return JSON.parse(serialized)
    } catch (error) {
        throw new TypeError('Saved table filters contain invalid JSON.', { cause: error })
    }
}
