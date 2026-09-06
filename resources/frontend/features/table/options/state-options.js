import { clearSavedTableSearch } from '../state/filter-state.js'

export function applyTableStateOptions(options, config) {
    if (config.stateDatatables) {
        options.stateSave = true
    }

    if (!config.stateFilters) {
        options.stateSaveParams = clearSavedTableSearch
    }

    return options
}
