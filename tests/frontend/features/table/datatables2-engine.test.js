import { expect, it, vi } from 'vitest'

const { DataTable } = vi.hoisted(() => {
    const DataTable = vi.fn(function (element, options) {
        this.element = element
        this.options = options
    })
    DataTable.version = '2.3.8'
    DataTable.Responsive = { version: '3.0.8' }

    return { DataTable }
})

vi.mock('datatables.net', () => ({ default: DataTable }))
vi.mock('datatables.net-responsive', () => ({}))

import {
    createDataTables2,
    dataTables2Runtime,
    dataTables2Versions,
} from '../../../../resources/frontend/features/table/engine/datatables2.js'

it('creates DataTables 2 through its constructor API', () => {
    const element = { nodeType: 1 }
    const options = { pageLength: 25 }
    const instance = createDataTables2(element, options)

    expect(DataTable).toHaveBeenCalledWith(element, options)
    expect(instance).toMatchObject({ element, options })
    expect(dataTables2Runtime()).toBe(DataTable)
})

it('reports the paired core and Responsive versions', () => {
    expect(dataTables2Versions()).toEqual({ core: '2.3.8', responsive: '3.0.8' })
    expect(Object.isFrozen(dataTables2Versions())).toBe(true)
})
