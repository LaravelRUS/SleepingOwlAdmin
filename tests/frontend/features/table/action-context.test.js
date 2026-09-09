import { expect, it, vi } from 'vitest'

import {
    appendSelectedRows,
    formParameters,
    selectedRowParameters,
} from '../../../../resources/js/shared/features/table/actions/action-context.js'

it('serializes selected rows with the existing repeated parameter name', () => {
    const table = {}
    const tables = { selectedRows: vi.fn(() => ['10', '20']) }

    expect(selectedRowParameters(tables, table).toString()).toBe('_id%5B%5D=10&_id%5B%5D=20')
    expect(tables.selectedRows).toHaveBeenCalledWith(table)
})

it('combines successful native form fields and selected rows', () => {
    class FormDataStub {
        *[Symbol.iterator]() {
            yield ['reason', 'archive']
            yield ['attachment', { name: 'ignored-file' }]
        }
    }
    const parameters = formParameters({}, FormDataStub)

    appendSelectedRows(parameters, { selectedRows: () => ['7'] }, {})

    expect(parameters.toString()).toBe('reason=archive&_id%5B%5D=7')
})
