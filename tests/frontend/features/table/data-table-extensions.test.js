import { expect, it, vi } from 'vitest'

import {
    DATE_TIME_ORDER,
    dateTimeOrderValues,
    installDataTableExtensions,
} from '../../../../resources/js/shared/features/table/engine/extensions.js'

function fixture() {
    const cells = [
        { dataset: { value: '2026-09-07 10:00:00' } },
        { dataset: { value: '2026-09-06 09:00:00' } },
    ]
    const nodes = { map: vi.fn((callback) => cells.map(callback)) }
    const column = vi.fn(() => ({ nodes: () => nodes }))
    const Api = vi.fn(function () {
        this.column = column
    })

    return { Api, column, engine: { Api, ext: { order: {}, search: [] } }, nodes }
}

it('registers error and DateTime ordering through the engine extension API', () => {
    const { engine } = fixture()
    const onError = vi.fn()
    const extensions = installDataTableExtensions(engine, { onError })

    expect(extensions.errMode).toBe(onError)
    expect(extensions.order[DATE_TIME_ORDER]).toBeTypeOf('function')
})

it('reads DateTime order values through the active engine Api and native datasets', () => {
    const { Api, column, engine, nodes } = fixture()
    const settings = { table: 'orders' }
    const values = dateTimeOrderValues(engine, settings, 3)

    expect(Api).toHaveBeenCalledWith(settings)
    expect(column).toHaveBeenCalledWith(3, { order: 'index' })
    expect(nodes.map).toHaveBeenCalledOnce()
    expect(values).toEqual(['2026-09-07 10:00:00', '2026-09-06 09:00:00'])
})

it('rejects incomplete extension dependencies', () => {
    expect(() => installDataTableExtensions({}, { onError: vi.fn() })).toThrow(
        'engine extension registry',
    )
    expect(() => installDataTableExtensions(fixture().engine, { onError: null })).toThrow(
        'error handler',
    )
})
