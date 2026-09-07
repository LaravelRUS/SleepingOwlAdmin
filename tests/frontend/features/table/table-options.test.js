import { expect, it } from 'vitest'

import {
    applyServerOptions,
    readTableDefinition,
    tableLayout,
} from '../../../../resources/frontend/features/table/options/table-options.js'

function element(dataset) {
    return { dataset, nodeType: 1 }
}

it('reads typed values from the table dataset without jQuery coercion', () => {
    const definition = readTableDefinition(
        element({
            attributes: '{"pageLength":25}',
            displayDtlength: '1',
            displayInfo: '0',
            displaySearch: 'false',
            id: 'orders',
            method: 'POST',
            payload: '{"scope":"active"}',
            url: '/orders',
        }),
    )

    expect(definition).toEqual({
        id: 'orders',
        method: 'POST',
        options: { pageLength: 25 },
        payload: { scope: 'active' },
        showInfo: false,
        showLength: true,
        showSearch: false,
        url: '/orders',
    })
})

it('keeps a non-JSON payload string and defaults optional values', () => {
    const definition = readTableDefinition(element({ payload: 'scope=active' }))

    expect(definition).toMatchObject({
        method: 'GET',
        options: {},
        payload: 'scope=active',
        showInfo: true,
        showLength: false,
        showSearch: false,
        url: null,
    })
})

it('applies server flags and the current engine layout only to async tables', () => {
    const options = { pageLength: 10 }
    const configured = applyServerOptions(options, {
        showLength: true,
        showSearch: true,
        url: '/orders',
    })

    expect(configured).toEqual({
        layout: {
            bottom1End: 'pageJump',
            bottom1Start: { paging: { type: 'simple_numbers' } },
            bottomEnd: null,
            bottomStart: 'info',
            topEnd: 'search',
            topStart: 'pageLength',
        },
        pageLength: 10,
        processing: true,
        serverSide: true,
    })
    expect(applyServerOptions(options, { url: null })).toEqual(options)
    expect(tableLayout({ showLength: false, showSearch: true })).toEqual({
        bottom1End: 'pageJump',
        bottom1Start: { paging: { type: 'simple_numbers' } },
        bottomEnd: null,
        bottomStart: 'info',
        topEnd: 'search',
        topStart: null,
    })
    expect(tableLayout({ showInfo: false, showLength: false, showSearch: true })).toEqual({
        bottom1End: 'pageJump',
        bottom1Start: { paging: { type: 'simple_numbers' } },
        bottomEnd: null,
        bottomStart: null,
        topEnd: 'search',
        topStart: null,
    })
})

it('rejects invalid table option JSON', () => {
    expect(() => readTableDefinition(element({ attributes: '{' }))).toThrow(
        'must contain valid JSON',
    )
    expect(() => readTableDefinition(element({ attributes: '[]' }))).toThrow(
        'must contain a JSON object',
    )
})
