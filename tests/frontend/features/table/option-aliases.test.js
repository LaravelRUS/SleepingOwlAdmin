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
