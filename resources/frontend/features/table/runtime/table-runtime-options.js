import { createTableAjax } from '../transport/table-ajax.js'
import { syncColumnHighlight } from '../hooks/column-highlight.js'
import { loadLazyImages } from '../hooks/lazy-images.js'
import { applyCreatedRowClass, createDrawHook } from '../hooks/table-hooks.js'
import { applyServerOptions } from '../options/table-options.js'
import { applyTableStateOptions } from '../options/state-options.js'

export function createRuntimeTableOptions(element, definition, settings) {
    const options = applyServerOptions(definition.options, definition)

    if (definition.url) configureServerTable(options, definition, settings)

    applyTableStateOptions(options, {
        stateDatatables: Boolean(definition.url && settings.admin.Config.get('state_datatables')),
        stateFilters: !definition.url || settings.stateFilters,
    })

    options.drawCallback = createRuntimeDrawHook(element, settings)
    options.createdRow = applyCreatedRowClass

    return options
}

function configureServerTable(options, definition, settings) {
    options.ajax = createTableAjax({
        events: settings.admin.Events,
        id: definition.id,
        method: definition.method,
        payload: definition.payload,
        root: settings.root,
        url: definition.url,
    })
}

function createRuntimeDrawHook(element, settings) {
    return createDrawHook({
        events: settings.admin.Events,
        highlight: (engineContext) =>
            syncColumnHighlight(
                element,
                engineContext.api(),
                Boolean(settings.admin.Config.get('datatables_highlight')),
            ),
        inlineEditor: () => settings.inlineEditor.scan(element),
        lazyload: () => loadLazyImages(element),
        tooltips: () => settings.tooltips(element),
    })
}
