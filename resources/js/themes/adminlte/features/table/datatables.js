import BootstrapDataTable from 'datatables.net-bs5'
import 'datatables.net-responsive-bs5'

export const DATATABLES_PRESENTATION_ID = 'adminlte.bootstrap5'

export function createLegacyDataTableEngine(element, options) {
    return new BootstrapDataTable(element, options)
}

export function legacyDataTableEngineRuntime() {
    return BootstrapDataTable
}

export function installLegacyDataTablesPresentation(engine) {
    if (engine !== BootstrapDataTable) {
        throw new Error('The DataTables Bootstrap adapter must use the active table engine.')
    }

    return engine
}
