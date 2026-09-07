import { bindFilterControls, clearFilterControls } from '../filters/filter-controls.js'
import { forEachColumnFilter } from '../filters/filter-elements.js'
import {
    clearFilterState,
    filterStateKey,
    loadFilterState,
    migrateLegacyFilterState,
    saveFilterState,
} from '../state/filter-state.js'

const FILTER_SELECTOR =
    '.display-filters[data-display="DisplayDatatablesAsync"][data-datatables-id]'

export function createTableFilters(options) {
    const settings = normalizeOptions(options)

    return {
        bind: (definition, adapter, serverSide, context) =>
            bindTableFilters(settings, definition, adapter, serverSide, context),
        context: (id) => createFilterContext(settings, id),
        prepare: () => prepareFilterState(settings),
        restore: (context) => restoreFilterState(settings, context),
    }
}

function prepareFilterState(settings) {
    if (!settings.stateFilters) return

    migrateLegacyFilterState(settings.storage, settings.path, allFilterContainers(settings.root))
}

function createFilterContext(settings, id) {
    return {
        filterContainers: matchingContainers(settings.root, id),
        stateFilters: settings.stateFilters,
        stateKey: filterStateKey(settings.path, id),
    }
}

function restoreFilterState(settings, context) {
    if (!context.stateFilters) return

    loadFilterState(settings.storage, context.stateKey, context.filterContainers)
}

function bindTableFilters(settings, definition, adapter, serverSide, context) {
    bindColumnFilters(settings, definition.id, adapter.engineInstance, serverSide)
    context.filterContainers.forEach((container) => {
        bindFilterControls(container, {
            clear: () => clearFilters(settings, adapter, context),
            execute: () => executeFilters(settings, adapter, context),
            reload: () => adapter.reload(),
        })
    })
}

function bindColumnFilters(settings, id, table, serverSide) {
    forEachColumnFilter(settings.root, id, (filter, index, type) => {
        const driver = settings.drivers[type]

        if (typeof driver === 'function') {
            driver(filter, table, table.column(index), index, serverSide)
        }
    })
}

function executeFilters(settings, adapter, context) {
    if (context.stateFilters) {
        saveFilterState(settings.storage, context.stateKey, context.filterContainers)
    }

    adapter.reload()
}

function clearFilters(settings, adapter, context) {
    clearFilterControls(context.filterContainers)
    adapter.clearState()
    clearFilterState(settings.storage, context.stateKey)
    adapter.reload()
}

function matchingContainers(root, id) {
    return allFilterContainers(root).filter(
        (container) => container.dataset.datatablesId === String(id),
    )
}

function allFilterContainers(root) {
    return [...root.querySelectorAll(FILTER_SELECTOR)]
}

function normalizeOptions(options) {
    if (!options?.drivers || !options.root || !options.storage) {
        throw new TypeError('Table filters require drivers, a document and storage.')
    }

    return {
        drivers: options.drivers,
        path: options.path,
        root: options.root,
        stateFilters: Boolean(options.stateFilters),
        storage: options.storage,
    }
}
