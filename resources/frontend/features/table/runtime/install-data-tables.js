import { componentMountSkipped } from '../../../core/lifecycle/component-lifecycle.js'
import { resolveDatePickerLocale } from '../../forms/date/date-locales.js'
import { createDataTableEngine, dataTableEngineRuntime } from '../engine/data-table-engine.js'
import { installDataTableExtensions } from '../engine/extensions.js'
import {
    createTableFilterDrivers,
    isDateInRange,
    isNumberInRange,
} from '../filters/filter-drivers.js'
import { createDateFilterSupport } from '../filters/date-filter-support.js'
import { mountDataTable } from '../lifecycle/data-table-adapter.js'
import { readTableDefinition } from '../options/table-options.js'
import { createTableFilters } from './table-filters.js'
import { createRuntimeTableOptions } from './table-runtime-options.js'

export const DATA_TABLE_COMPONENT = 'data-table'
export const DATA_TABLE_SELECTOR = '.datatables'

export function installDataTables(admin, options) {
    const settings = normalizeOptions(admin, options)
    const drivers = createFilterDrivers(settings)
    const filters = createTableFilters({
        drivers,
        path: admin.Url.url_path,
        root: settings.root,
        stateFilters: settings.stateFilters,
        storage: settings.storage,
    })
    const definition = createDataTableDefinition(settings, filters)
    const scan = (root = settings.root) => scanTables(settings, filters, root)

    installDataTableExtensions(settings.engine, { onError: settings.onError })
    publishCompatibility(settings.target, drivers)
    admin.Components.register(definition)
    admin.Modules.register('display.datatables', () => scan())

    return { definition, drivers, filters, scan }
}

export function createDataTableDefinition(settings, filters) {
    return {
        mount: (element) => mountTableElement(element, settings, filters),
        name: DATA_TABLE_COMPONENT,
        selector: DATA_TABLE_SELECTOR,
    }
}

function scanTables(settings, filters, root) {
    filters.prepare()

    return settings.admin.Components.scan(root, DATA_TABLE_COMPONENT)
}

function mountTableElement(element, settings, filters) {
    if (settings.admin.Tables.has(element)) return componentMountSkipped

    const definition = readTableDefinition(element)
    const filterContext = filters.context(definition.id)
    filters.restore(filterContext)
    const options = createRuntimeTableOptions(element, definition, settings)
    const adapter = mountDataTable({
        createEngine: settings.createEngine,
        element,
        options,
        registry: settings.admin.Tables,
    })

    try {
        filters.bind(definition, adapter, options.serverSide, filterContext)
    } catch (error) {
        adapter.destroy()
        throw error
    }

    return adapter
}

function createFilterDrivers(settings) {
    const locale = resolveDatePickerLocale(settings.admin.locale)

    return createTableFilterDrivers(settings.engine, createDateFilterSupport(locale))
}

function publishCompatibility(target, drivers) {
    target.checkNumberRange = isNumberInRange
    target.checkDateRange = isDateInRange
    target.columnFilters = drivers
}

function normalizeOptions(admin, options = {}) {
    assertAdmin(admin)
    assertOptions(options)

    return {
        admin,
        createEngine: options.createEngine ?? createDataTableEngine,
        engine: options.engine ?? dataTableEngineRuntime(),
        inlineEditor: options.inlineEditor,
        onError: options.onError,
        root: options.root,
        stateFilters: Boolean(admin.Config.get('state_filters')),
        storage: options.storage,
        target: options.target,
        tooltips: options.tooltips ?? ((root) => admin.Tooltips?.scan(root) ?? 0),
    }
}

function assertAdmin(admin) {
    const required = ['Components', 'Config', 'Events', 'Modules', 'Tables', 'Url']
    if (required.some((name) => !admin?.[name])) {
        throw new TypeError('DataTables require the SleepingOwl compatibility runtime.')
    }
}

function assertOptions(options) {
    if (
        !options.root ||
        !options.storage ||
        !options.target ||
        typeof options.inlineEditor?.scan !== 'function' ||
        typeof options.onError !== 'function'
    ) {
        throw new TypeError('DataTables require DOM, storage, editor and error dependencies.')
    }
}
