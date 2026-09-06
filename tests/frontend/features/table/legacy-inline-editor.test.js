import { expect, it, vi } from 'vitest'

import {
    mapInlineEditError,
    mapInlineEditSuccess,
} from '../../../../resources/frontend/features/table/themes/legacy-adminlte/inline-editor.js'

const translate = vi.fn(() => 'Table error')

it('maps successful inline-edit responses without changing the wire contract', () => {
    expect(mapInlineEditSuccess({ status: true, newValue: 'Published' }, translate)).toEqual({
        newValue: 'Published',
    })
    expect(mapInlineEditSuccess({ status: 'true' }, translate)).toBeUndefined()
})

it('maps rejected and failed inline-edit responses', () => {
    expect(mapInlineEditSuccess({ reason: 'Validation failed', status: false }, translate)).toBe(
        'Validation failed',
    )
    expect(mapInlineEditSuccess({ status: false }, translate)).toBe('Table error')
    expect(mapInlineEditError({ responseText: 'Forbidden', status: 403 }, translate)).toBe(
        'Forbidden',
    )
    expect(mapInlineEditError({ responseText: 'Failure', status: 500 }, translate)).toBe(
        'Table error',
    )
})
