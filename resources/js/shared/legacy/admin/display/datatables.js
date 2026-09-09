const {
    tableBrowserOptions,
} = require('../../../features/table/browser-options')
const {
    installDataTables,
} = require('../../../features/table/runtime/install-data-tables')
const inlineEditor = require('./columns/inline_edit')

module.exports = installDataTables(Admin, {
    inlineEditor,
    onError: tableBrowserOptions(globalThis).onError,
    root: document,
    storage: localStorage,
    target: globalThis,
})
