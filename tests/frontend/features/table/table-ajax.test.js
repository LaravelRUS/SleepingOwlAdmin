import { expect, it, vi } from 'vitest'

import {
    appendNamedFilterData,
    createTableAjax,
} from '../../../../resources/js/shared/features/table/transport/table-ajax.js'

function filterRoot(filter) {
    const container = {
        dataset: { datatablesId: 'orders' },
        querySelectorAll: () => [filter],
    }

    return { querySelectorAll: () => [container] }
}

it('builds the unchanged DataTables wire transport and fires the compatibility hook', () => {
    const events = { fire: vi.fn() }
    const filter = {
        closest: () => ({ dataset: { index: '1' } }),
        dataset: { ajaxDataName: 'exact', type: 'text' },
        value: 'Alice',
    }
    const ajax = createTableAjax({
        events,
        id: 'orders',
        method: 'POST',
        payload: { scope: 'active' },
        root: filterRoot(filter),
        url: '/orders',
    })
    const parameters = { columns: [{}, { search: { value: '' } }] }

    ajax.data(parameters)

    expect(ajax).toMatchObject({ cache: true, type: 'POST', url: '/orders' })
    expect(events.fire).toHaveBeenCalledWith('datatables::ajax::data', parameters)
    expect(parameters).toMatchObject({
        columns: [{}, { search: { exact: 'Alice', value: '' } }],
        payload: { scope: 'active' },
    })
})

it('keeps cache busting on read requests only', () => {
    const ajax = createTableAjax({
        events: { fire: vi.fn() },
        id: 'orders',
        method: 'GET',
        payload: undefined,
        root: filterRoot({ dataset: {} }),
        url: '/orders',
    })

    expect(ajax.cache).toBe(false)
})

it('ignores named filter data when the DataTables column is absent', () => {
    const filter = {
        closest: () => ({ dataset: { index: '9' } }),
        dataset: { ajaxDataName: 'exact', type: 'text' },
        value: 'Alice',
    }
    const parameters = { columns: [] }

    expect(() => appendNamedFilterData(parameters, filterRoot(filter), 'orders')).not.toThrow()
    expect(parameters).toEqual({ columns: [] })
})
