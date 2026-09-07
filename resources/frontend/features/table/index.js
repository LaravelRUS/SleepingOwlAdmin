export const TABLE_FEATURE_ID = 'table'

export { tableBrowserOptions } from './browser-options.js'
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
export { createDateFilterSupport } from './filters/date-filter-support.js'
export {
    createTableFilterDrivers,
    dataTableSearchExtensions,
    isDateInRange,
    isNumberInRange,
} from './filters/filter-drivers.js'
export { forEachColumnFilter, readControlValue } from './filters/filter-elements.js'
export { highlightColumn, syncColumnHighlight } from './hooks/column-highlight.js'
export { loadLazyImage, loadLazyImages } from './hooks/lazy-images.js'
export { applyCreatedRowClass, createDrawHook } from './hooks/table-hooks.js'
export { readInlineEditorConfig, INLINE_EDITOR_TYPES } from './editing/inline-editor-config.js'
export {
    createInlineEditorDefinition,
    INLINE_EDITOR_COMPONENT,
    INLINE_EDITOR_SELECTOR,
    mountInlineEditor,
} from './editing/inline-editor.js'
export { installInlineEditors } from './editing/install-inline-editors.js'
export { bindInlineEditorTableRefresh } from './editing/inline-editor-table-refresh.js'
export {
    inlineEditErrorMessage,
    inlineEditParameters,
    InlineEditRejectedError,
    normalizeInlineEditResponse,
    submitInlineEdit,
} from './editing/inline-editor-request.js'
export { DataTableAdapter, mountDataTable } from './lifecycle/data-table-adapter.js'
export {
    createDataTableDefinition,
    DATA_TABLE_COMPONENT,
    DATA_TABLE_SELECTOR,
    installDataTables,
} from './runtime/install-data-tables.js'
export {
    installTableAutoUpdates,
    TABLE_AUTO_UPDATES_COMPONENT,
    TABLE_AUTO_UPDATES_SELECTOR,
} from './runtime/install-table-auto-updates.js'
export {
    createTableControlsDefinition,
    installTableControls,
    TABLE_CONTROLS_COMPONENT,
    TABLE_CONTROLS_SELECTOR,
} from './runtime/install-table-controls.js'
export { normalizeDataTableOptions } from './options/option-aliases.js'
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
