export const TABLE_FEATURE_ID = 'table'

export {
    AUTO_UPDATE_COLOR_PROPERTY,
    mountTableAutoUpdate,
    mountTableAutoUpdates,
    readAutoUpdateConfig,
} from './autoupdate/table-auto-update.js'
export { findActionTable, selectedRowParameters } from './actions/action-context.js'
export { actionRequestSettings, executeTableAction } from './actions/action-request.js'
export { bindBulkActions } from './actions/bulk-actions.js'
export { bindFormActions } from './actions/form-actions.js'
export { bindConfirmedControls } from './controls/confirm-submit.js'
export { bindFilterControls, clearFilterControls } from './filters/filter-controls.js'
export {
    createTableFilterDrivers,
    dataTables2SearchExtensions,
    isDateInRange,
    isNumberInRange,
} from './filters/filter-drivers.js'
export { forEachColumnFilter, readControlValue } from './filters/filter-elements.js'
export { highlightColumn, syncColumnHighlight } from './hooks/column-highlight.js'
export { loadLazyImage, loadLazyImages } from './hooks/lazy-images.js'
export { applyCreatedRowClass, createDrawHook } from './hooks/table-hooks.js'
export { DataTableAdapter, mountDataTable } from './lifecycle/data-table-adapter.js'
export { normalizeDataTables2Options } from './options/option-aliases.js'
export { applyServerOptions, readTableDefinition, tableLayout } from './options/table-options.js'
export { selectedRowValues } from './selection/selected-rows.js'
export { bindTableCheckboxes, updateRowSelection } from './selection/checkbox-controls.js'
export {
    clearFilterState,
    clearSavedTableSearch,
    filterStateKey,
    loadFilterState,
    migrateLegacyFilterState,
    saveFilterState,
} from './state/filter-state.js'
export { appendNamedFilterData, createTableAjax } from './transport/table-ajax.js'
