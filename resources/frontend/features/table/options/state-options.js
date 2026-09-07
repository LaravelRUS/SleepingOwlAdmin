import { clearSavedTableSearch } from '../state/filter-state.js'

export function applyTableStateOptions(options, config) {
    const stateLoadParams = options.stateLoadParams
    options.stateLoadParams = function (settings, state) {
        const result = stateLoadParams?.call(this, settings, state)
        if (result === false) return false

        // The section defines column visibility; saved browser state must not override it.
        state.columns?.forEach((column) => {
            delete column.visible
        })

        return result
    }

    if (config.stateDatatables) {
        options.stateSave = true
    }

    if (!config.stateFilters) {
        options.stateSaveParams = clearSavedTableSearch
    }

    return options
}
