import { expect, it, vi } from 'vitest'

const { DataTable } = vi.hoisted(() => {
    const DataTable = vi.fn(function (element, options) {
        this.element = element
        this.options = options
    })
    DataTable.version = '3.0.3'
    DataTable.Responsive = { version: '4.0.3' }

    return { DataTable }
})

vi.mock('datatables.net', () => ({ default: DataTable }))
vi.mock('datatables.net-responsive', () => ({}))

import {
    createDataTableEngine,
    dataTableEngineRuntime,
    dataTableEngineVersions,
} from '../../../../resources/frontend/features/table/engine/data-table-engine.js'

it('creates the active table engine through its constructor API', () => {
    const element = { nodeType: 1 }
    const options = { pageLength: 25 }
    const instance = createDataTableEngine(element, options)

    expect(DataTable).toHaveBeenCalledWith(element, options)
    expect(instance).toMatchObject({ element, options })
    expect(dataTableEngineRuntime()).toBe(DataTable)
})

it('reports the paired core and Responsive versions', () => {
    expect(dataTableEngineVersions()).toEqual({ core: '3.0.3', responsive: '4.0.3' })
    expect(Object.isFrozen(dataTableEngineVersions())).toBe(true)
})
