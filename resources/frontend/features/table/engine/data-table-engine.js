import DataTable from 'datatables.net'
import 'datatables.net-responsive'

export function createDataTableEngine(element, options) {
    return new DataTable(element, options)
}

export function dataTableEngineRuntime() {
    return DataTable
}

export function dataTableEngineVersions() {
    return Object.freeze({
        core: DataTable.version,
        responsive: DataTable.Responsive?.version,
    })
}
