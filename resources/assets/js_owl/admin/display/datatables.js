const {
    tableBrowserOptions,
} = require('../../../../frontend/features/table/browser-options')
const {
    installDataTables,
} = require('../../../../frontend/features/table/runtime/install-data-tables')
const inlineEditor = require('./columns/inline_edit')

module.exports = installDataTables(Admin, {
    inlineEditor,
    onError: tableBrowserOptions(globalThis).onError,
    root: document,
    storage: localStorage,
    target: globalThis,
})
