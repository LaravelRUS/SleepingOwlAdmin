const {
    createTableFilterDrivers,
    isDateInRange,
    isNumberInRange,
} = require('../../../../frontend/features/table/filters/filter-drivers')
const {
    bindFilterControls,
    clearFilterControls,
} = require('../../../../frontend/features/table/filters/filter-controls')
const {
    createDataTables2,
    dataTables2Runtime,
} = require('../../../../frontend/features/table/engine/datatables2')
const {
    installDataTables2Extensions,
} = require('../../../../frontend/features/table/engine/extensions')
const {
    createLegacyFilterEventBridge,
} = require('../../../../frontend/features/table/themes/legacy-adminlte/filter-events')
const {
    forEachColumnFilter,
} = require('../../../../frontend/features/table/filters/filter-elements')
const {
    applyCreatedRowClass,
    createDrawHook,
} = require('../../../../frontend/features/table/hooks/table-hooks')
const {
    mountDataTable,
} = require('../../../../frontend/features/table/lifecycle/data-table-adapter')
const {
    applyServerOptions,
    readTableDefinition,
} = require('../../../../frontend/features/table/options/table-options')
const {
    clearFilterState,
    clearSavedTableSearch,
    filterStateKey,
    loadFilterState,
    saveFilterState,
} = require('../../../../frontend/features/table/state/filter-state')
const {
    createTableAjax,
} = require('../../../../frontend/features/table/transport/table-ajax')

globalThis.checkNumberRange = isNumberInRange
globalThis.checkDateRange = isDateInRange
globalThis.columnFilters = createTableFilterDrivers(
    dataTables2Runtime(),
    createLegacyFilterEventBridge(),
)

Admin.Modules.register('display.datatables', () => {
    const stateFilters = Boolean(Admin.Config.get('state_filters'))
    const filterContainers = document.querySelectorAll(
        '.display-filters[data-display="DisplayDatatablesAsync"]',
    )
    const stateKey = filterStateKey(Admin.Url.url_path)

    if (stateFilters) {
        loadFilterState(localStorage, stateKey, filterContainers)
    }

    configureDataTableExtensions()
    document.querySelectorAll('.datatables').forEach((element) =>
        mountLegacyTable(element, { filterContainers, stateFilters, stateKey }),
    )
})

function configureDataTableExtensions() {
    installDataTables2Extensions(dataTables2Runtime(), {
        onError: reportDataTableError,
    })
}

function reportDataTableError(settings) {
    const message = settings.jqXHR?.responseJSON?.message || trans('lang.table.error')

    Admin.Messages.error(message)
}

function mountLegacyTable(element, context) {
    if (Admin.Tables.has(element)) {
        return Admin.Tables.get(element)
    }

    const definition = readTableDefinition(element)
    const options = buildOptions(element, definition, context.stateFilters)
    const adapter = mountDataTable({
        createEngine: createDataTables2,
        element,
        options,
        registry: Admin.Tables,
    })

    bindColumnFilters(definition.id, adapter.engineInstance, options.serverSide)
    bindTableFilterControls(definition.id, adapter, context)

    return adapter
}

function buildOptions(element, definition, stateFilters) {
    const options = applyServerOptions(definition.options, definition)

    if (definition.url) {
        options.ajax = createTableAjax({
            events: Admin.Events,
            id: definition.id,
            method: definition.method,
            payload: definition.payload,
            root: document,
            url: definition.url,
        })
        applyStateOptions(options, stateFilters)
    }

    options.drawCallback = createDrawHook({
        events: Admin.Events,
        highlight: (engineContext) => bindHighlight(element, engineContext),
        lazyload: () => globalThis.lazyload(),
        tooltips: () => jQuery('[data-toggle="tooltip"]').tooltip(),
    })
    options.createdRow = applyCreatedRowClass

    return options
}

function applyStateOptions(options, stateFilters) {
    if (Admin.Config.get('state_datatables')) {
        options.stateSave = true
    }

    if (!stateFilters) {
        options.stateSaveParams = clearSavedTableSearch
    }
}

function bindColumnFilters(id, table, serverSide) {
    forEachColumnFilter(document, id, (filter, index, type) => {
        const driver = globalThis.columnFilters[type]

        if (typeof driver === 'function') {
            driver(filter, table, table.column(index), index, serverSide)
        }
    })
}

function bindTableFilterControls(id, adapter, context) {
    matchingContainers(id).forEach((container) => {
        bindFilterControls(container, {
            clear: () => clearFilters(adapter, context),
            execute: () => executeFilters(adapter, context),
            reload: () => adapter.reload(),
        })
    })
}

function executeFilters(adapter, { filterContainers, stateFilters, stateKey }) {
    if (stateFilters) {
        saveFilterState(localStorage, stateKey, filterContainers)
    }

    adapter.reload()
}

function clearFilters(adapter, { filterContainers, stateKey }) {
    clearFilterControls(filterContainers)
    adapter.clearState()
    clearFilterState(localStorage, stateKey)
    adapter.reload()
}

function matchingContainers(id) {
    return [...document.querySelectorAll('[data-datatables-id]')].filter(
        (container) => container.dataset.datatablesId === String(id),
    )
}

function bindHighlight(element, engineContext) {
    if (!Admin.Config.get('datatables_highlight')) {
        return
    }

    const table = engineContext.api()
    $(element.tBodies)
        .off('mouseenter.soa-highlight', 'td')
        .on('mouseenter.soa-highlight', 'td', function () {
            highlightColumn(table, this)
        })
}

function highlightColumn(table, cell) {
    if (!table.data().any()) {
        return
    }

    const column = table.cell(cell).index().column
    $(table.cells().nodes()).removeClass('highlight')
    $(table.column(column).nodes()).addClass('highlight')
}
