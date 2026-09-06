import { describe, expect, it } from 'vitest'

import {
    appendEnvValue,
    createEnvValues,
    removeEnvValue,
} from '../../../../resources/assets/js_owl/admin/display/env-editor-values'

describe('env editor values', () => {
    it('normalizes keyed server values without mutating the source', () => {
        const source = {
            APP_NAME: { value: 'Owl', deletable: false, editable: true },
        }

        expect(createEnvValues(source)).toEqual([
            { key: 'APP_NAME', value: 'Owl', deletable: false, editable: true },
        ])
        expect(source).toEqual({
            APP_NAME: { value: 'Owl', deletable: false, editable: true },
        })
    })

    it('creates editable and deletable rows', () => {
        const values = []

        appendEnvValue(values)

        expect(values).toEqual([{ key: null, value: null, deletable: true, editable: true }])
    })

    it('removes only rows allowed by the server metadata', () => {
        const values = createEnvValues([
            { value: 'open', deletable: true, editable: true },
            { value: 'locked', deletable: false, editable: false },
        ])

        expect(removeEnvValue(values, 1)).toBe(false)
        expect(removeEnvValue(values, 0)).toBe(true)
        expect(values).toEqual([{ key: '1', value: 'locked', deletable: false, editable: false }])
    })
})
