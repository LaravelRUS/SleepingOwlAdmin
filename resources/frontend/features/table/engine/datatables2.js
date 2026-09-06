import DataTable from 'datatables.net'
import 'datatables.net-responsive'

export function createDataTables2(element, options) {
    return new DataTable(element, options)
}

export function dataTables2Runtime() {
    return DataTable
}

export function dataTables2Versions() {
    return Object.freeze({
        core: DataTable.version,
        responsive: DataTable.Responsive?.version,
    })
}
