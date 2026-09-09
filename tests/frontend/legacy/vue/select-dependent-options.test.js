import { describe, expect, it } from 'vitest'

import {
    dependentSelectParameters,
    dependentSelectValue,
    normalizeDependentSelectResponse,
} from '../../../../resources/js/shared/legacy/admin/form/select-dependent-options.js'

describe('dependent select parameters', () => {
    it('preserves the legacy parent and named parameter payload', () => {
        const document = dependencyDocument({
            country: { type: 'text', value: 'fr' },
            regions: {
                multiple: true,
                selectedOptions: [{ value: 'north' }, { value: 'west' }],
            },
        })
        const parameters = dependentSelectParameters(['country', 'regions'], document)

        expect([...parameters.entries()]).toEqual([
            ['depdrop_parents[0]', 'fr'],
            ['depdrop_all_params[country]', 'fr'],
            ['depdrop_parents[1][]', 'north'],
            ['depdrop_parents[1][]', 'west'],
            ['depdrop_all_params[regions][]', 'north'],
            ['depdrop_all_params[regions][]', 'west'],
        ])
    })
})

describe('dependent select response', () => {
    it('normalizes keyed PHP output and resolves selected ids by value', () => {
        const response = normalizeDependentSelectResponse({
            output: {
                7: { id: 7, name: 'Paris' },
                code: { id: 'code', name: 'Custom' },
            },
            selected: '7',
        })

        expect(response).toEqual({
            hasSelected: true,
            options: [
                { id: 7, text: 'Paris' },
                { id: 'code', text: 'Custom' },
            ],
            selected: '7',
        })
        expect(dependentSelectValue(response.options, response, null, false)).toEqual({
            id: 7,
            text: 'Paris',
        })
    })

    it('uses the original value when related responses omit selected', () => {
        const response = normalizeDependentSelectResponse({
            output: [{ id: 3, name: 'Editor' }],
        })

        expect(dependentSelectValue(response.options, response, ['3'], true)).toEqual([
            { id: 3, text: 'Editor' },
        ])
    })

    it('rejects malformed response boundaries', () => {
        expect(() => normalizeDependentSelectResponse([])).toThrow(/must be an object/)
        expect(normalizeDependentSelectResponse({}).options).toEqual([])
        expect(() => normalizeDependentSelectResponse({ output: [{}] })).toThrow(
            /option must contain an id/,
        )
    })
})

function dependencyDocument(controls) {
    return {
        getElementById: (id) => controls[id] ?? null,
        querySelectorAll: () => [],
    }
}
