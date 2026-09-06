import { expect, it } from 'vitest'

import {
    applyServerOptions,
    readTableDefinition,
    tableDomLayout,
} from '../../../../resources/frontend/features/table/options/table-options.js'

function element(dataset) {
    return { dataset, nodeType: 1 }
}

it('reads typed values from the table dataset without jQuery coercion', () => {
    const definition = readTableDefinition(
        element({
            attributes: '{"pageLength":25}',
            displayDtlength: '1',
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
        showLength: false,
        showSearch: false,
        url: null,
    })
})

it('applies server flags and legacy control layout only to async tables', () => {
    const options = { pageLength: 10 }
    const configured = applyServerOptions(options, {
        showLength: true,
        showSearch: true,
        url: '/orders',
    })

    expect(configured).toEqual({
        pageLength: 10,
        processing: true,
        serverSide: true,
        sDom: '<"H"lfr>t<"F"ip>',
    })
    expect(applyServerOptions(options, { url: null })).toBe(options)
    expect(tableDomLayout({ showLength: false, showSearch: true })).toBe('<"H"fr>t<"F"ip>')
})

it('rejects invalid table option JSON', () => {
    expect(() => readTableDefinition(element({ attributes: '{' }))).toThrow(
        'must contain valid JSON',
    )
    expect(() => readTableDefinition(element({ attributes: '[]' }))).toThrow(
        'must contain a JSON object',
    )
})
