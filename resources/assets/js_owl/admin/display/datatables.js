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
    createDateFilterSupport,
} = require('../../../../frontend/features/table/filters/date-filter-support')
const {
    resolveDatePickerLocale,
} = require('../../../../frontend/features/forms/date/date-locales')
const {
    createLegacyTableTooltips,
} = require('../../../../frontend/features/table/themes/legacy-adminlte/tooltips')
const {
    forEachColumnFilter,
} = require('../../../../frontend/features/table/filters/filter-elements')
const {
    syncColumnHighlight,
} = require('../../../../frontend/features/table/hooks/column-highlight')
const {
    loadLazyImages,
} = require('../../../../frontend/features/table/hooks/lazy-images')
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
    applyTableStateOptions,
} = require('../../../../frontend/features/table/options/state-options')
const {
    clearFilterState,
    filterStateKey,
    loadFilterState,
    migrateLegacyFilterState,
    saveFilterState,
} = require('../../../../frontend/features/table/state/filter-state')
const {
    createTableAjax,
} = require('../../../../frontend/features/table/transport/table-ajax')
const inlineEditor = require('./columns/inline_edit')

const tableTooltips = createLegacyTableTooltips(Admin)

globalThis.checkNumberRange = isNumberInRange
globalThis.checkDateRange = isDateInRange
globalThis.columnFilters = createTableFilterDrivers(
    dataTables2Runtime(),
    createDateFilterSupport(resolveDatePickerLocale(Admin.locale)),
)

Admin.Modules.register('display.datatables', () => {
    const stateFilters = Boolean(Admin.Config.get('state_filters'))
    const path = Admin.Url.url_path

    if (stateFilters) {
        migrateLegacyFilterState(localStorage, path, allFilterContainers())
    }

    configureDataTableExtensions()
    document.querySelectorAll('.datatables').forEach((element) =>
        mountLegacyTable(element, { path, stateFilters }),
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
    const filterContext = createFilterContext(definition.id, context)

    if (filterContext.stateFilters) {
        loadFilterState(localStorage, filterContext.stateKey, filterContext.filterContainers)
    }

    const options = buildOptions(element, definition, context.stateFilters)
    const adapter = mountDataTable({
        createEngine: createDataTables2,
        element,
        options,
        registry: Admin.Tables,
    })

    bindColumnFilters(definition.id, adapter.engineInstance, options.serverSide)
    bindTableFilterControls(definition.id, adapter, filterContext)

    return adapter
}

function createFilterContext(id, { path, stateFilters }) {
    return {
        filterContainers: matchingContainers(id),
        stateFilters,
        stateKey: filterStateKey(path, id),
    }
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
        applyTableStateOptions(options, {
            stateDatatables: Boolean(Admin.Config.get('state_datatables')),
            stateFilters,
        })
    }

    options.drawCallback = createDrawHook({
        events: Admin.Events,
        highlight: (engineContext) =>
            syncColumnHighlight(
                element,
                engineContext.api(),
                Boolean(Admin.Config.get('datatables_highlight')),
            ),
        inlineEditor: () => inlineEditor.scan(element),
        lazyload: () => loadLazyImages(element),
        tooltips: () => tableTooltips.scan(element),
    })
    options.createdRow = applyCreatedRowClass

    return options
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
    return allFilterContainers().filter(
        (container) => container.dataset.datatablesId === String(id),
    )
}

function allFilterContainers() {
    return [
        ...document.querySelectorAll(
            '.display-filters[data-display="DisplayDatatablesAsync"][data-datatables-id]',
        ),
    ]
}
