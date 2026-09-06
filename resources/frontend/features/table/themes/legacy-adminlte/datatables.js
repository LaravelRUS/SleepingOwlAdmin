import BootstrapDataTable from 'datatables.net-bs4'
import 'datatables.net-responsive-bs4'

export const DATATABLES_PRESENTATION_ID = 'legacy-adminlte.bootstrap4'

export function installLegacyDataTablesPresentation(engine) {
    if (engine !== BootstrapDataTable) {
        throw new Error('The DataTables Bootstrap adapter must use the active table engine.')
    }

    return engine
}
