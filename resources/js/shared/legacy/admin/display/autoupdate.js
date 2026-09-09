const {
    installTableAutoUpdates,
} = require('../../../features/table/runtime/install-table-auto-updates')
const dataTables = require('./datatables')

module.exports = installTableAutoUpdates(Admin, {
    engine: dataTables.engine,
    ProgressBar: globalThis.ProgressBar,
    scheduler: window,
})
