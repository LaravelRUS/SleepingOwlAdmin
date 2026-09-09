import { expect, it } from 'vitest'

import { createVueComponentCatalog } from '../../../../resources/js/shared/vue/legacy/component-catalog.js'

it('registers initial and late Vue component definitions', () => {
    const initial = { name: 'Initial' }
    const late = { name: 'Late' }
    const catalog = createVueComponentCatalog({ initial })

    expect(catalog.entries()).toEqual([['initial', initial]])
    expect(catalog.register('late-component', late)).toBe(late)
    expect(catalog.has('late-component')).toBe(true)
    expect(catalog.get('late-component')).toBe(late)
})

it('rejects duplicate names and invalid component entries', () => {
    const catalog = createVueComponentCatalog({ existing: {} })

    expect(() => catalog.register('existing', {})).toThrow('already registered')
    expect(() => catalog.register(' ', {})).toThrow('require a name and definition')
    expect(() => catalog.register('invalid', null)).toThrow('require a name and definition')
    expect(() => createVueComponentCatalog([])).toThrow('must be an object')
})
