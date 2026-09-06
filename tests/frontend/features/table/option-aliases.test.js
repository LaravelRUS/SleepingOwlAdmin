import { expect, it, vi } from 'vitest'

import { normalizeDataTables2Options } from '../../../../resources/frontend/features/table/options/option-aliases.js'

it('moves supported legacy aliases to current DataTables option names', () => {
    const drawCallback = vi.fn()

    expect(
        normalizeDataTables2Options({
            bStateSave: true,
            fnDrawCallback: drawCallback,
            sDom: 't',
        }),
    ).toEqual({ dom: 't', drawCallback, stateSave: true })
})

it('keeps explicit current options ahead of their legacy aliases', () => {
    const currentCallback = vi.fn()

    expect(
        normalizeDataTables2Options({
            bStateSave: false,
            dom: 'modern',
            drawCallback: currentCallback,
            fnDrawCallback: vi.fn(),
            sDom: 'legacy',
            stateSave: true,
        }),
    ).toEqual({ dom: 'modern', drawCallback: currentCallback, stateSave: true })
})

it('reports and removes only options dropped by DataTables 2', () => {
    const warn = vi.fn()
    const options = normalizeDataTables2Options(
        {
            asStripeClasses: ['odd', 'even'],
            fnServerData: vi.fn(),
            fnServerParams: vi.fn(),
            sAjaxDataProp: 'rows',
            sAjaxSource: '/records',
        },
        { warn },
    )

    expect(options).toEqual({})
    expect(warn).toHaveBeenCalledTimes(5)
    expect(warn.mock.calls.map(([message]) => message)).toEqual([
        expect.stringMatching(/asStripeClasses.*theme CSS/),
        expect.stringMatching(/fnServerData.*ajax function/),
        expect.stringMatching(/fnServerParams.*ajax\.data/),
        expect.stringMatching(/sAjaxSource.*Use ajax\./),
        expect.stringMatching(/sAjaxDataProp.*ajax\.dataSrc/),
    ])
})

it('passes supported Hungarian and extension-specific options through unchanged', () => {
    const warn = vi.fn()
    const options = {
        bPaginate: false,
        bSort: true,
        customExtensionOption: { mode: 'project' },
        iDisplayLength: 50,
        sPaginationType: 'full_numbers',
        sScrollX: '100%',
    }

    expect(normalizeDataTables2Options(options, { warn })).toEqual(options)
    expect(warn).not.toHaveBeenCalled()
})
