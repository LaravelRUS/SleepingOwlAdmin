import { expect, it } from 'vitest'

import { selectedRowValues } from '../../../../resources/js/shared/features/table/selection/selected-rows.js'

it('returns checked row values from the adapter table element', () => {
    const element = {
        querySelectorAll: (selector) => {
            expect(selector).toBe('.adminCheckboxRow:checked')
            return [{ value: '10' }, { value: '20' }]
        },
    }

    expect(selectedRowValues(element)).toEqual(['10', '20'])
})
