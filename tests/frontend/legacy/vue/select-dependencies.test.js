import { expect, it } from 'vitest'

import {
    appendSelectDependencies,
    readSelectDependencies,
} from '../../../../resources/js/shared/legacy/admin/form/select-dependencies.js'

function fixtureDocument() {
    const controls = new Map([
        ['country', { value: 'fr' }],
        ['enabled', { checked: true, type: 'checkbox', value: 'yes' }],
        [
            'regions',
            {
                multiple: true,
                selectedOptions: [{ value: 'north' }, { value: 'west' }],
            },
        ],
        ['owner-a', { name: 'owner', type: 'radio', value: 'alice' }],
    ])
    const checkedOwner = { checked: true, name: 'owner', type: 'radio', value: 'bob' }

    return {
        getElementById: (id) => controls.get(id) ?? null,
        querySelectorAll: () => [controls.get('owner-a'), checkedOwner],
    }
}

it('reads scalar, checkbox, multiple and radio dependency controls without selectors', () => {
    const dependencies = readSelectDependencies(
        ['country', 'enabled', 'regions', 'owner-a', 'missing'],
        fixtureDocument(),
    )

    expect(dependencies).toEqual([
        { id: 'country', value: 'fr' },
        { id: 'enabled', value: true },
        { id: 'regions', value: ['north', 'west'] },
        { id: 'owner-a', value: 'bob' },
        { id: 'missing', value: '' },
    ])
})

it('preserves the existing Laravel dependency payload names', () => {
    const dependencies = readSelectDependencies(['country', 'regions'], fixtureDocument())
    const parameters = appendSelectDependencies(
        new globalThis.URLSearchParams({ page: '1', q: 'aurora' }),
        dependencies,
    )

    expect(parameters.get('depends')).toBe('["country","regions"]')
    expect(parameters.get('depdrop_parents[0]')).toBe('fr')
    expect(parameters.getAll('depdrop_parents[1][]')).toEqual(['north', 'west'])
    expect(parameters.get('depdrop_all_params[country]')).toBe('fr')
    expect(parameters.getAll('depdrop_all_params[regions][]')).toEqual(['north', 'west'])
})
