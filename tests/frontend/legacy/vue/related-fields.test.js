import { expect, it } from 'vitest'

import {
    appendRelatedIndex,
    createRelatedName,
    rewriteRelatedIslandProps,
} from '../../../../resources/js/shared/legacy/admin/form/related/related-fields'

it('adds a related index once to control ids', () => {
    expect(appendRelatedIndex('product_id', 3)).toBe('product_id_3')
    expect(appendRelatedIndex('product_id_2', 3)).toBe('product_id_2')
    expect(appendRelatedIndex('', 3)).toBe('')
})

it('namespaces scalar and array fields for a new related group', () => {
    expect(createRelatedName('images', 4, 'image')).toBe('images[new_4][image]')
    expect(createRelatedName('items', 4, 'categories[]')).toBe('items[new_4][categories][]')
    expect(createRelatedName('items', 4, 'items[new_3][title]')).toBe('items[new_3][title]')
})

it('rewrites direct island submit props before nested mount', () => {
    const props = {
        attributes: { id: 'category', name: 'categories[]' },
        name: 'image',
        value: 'fixtures/image.svg',
    }
    const context = { index: 2, isNew: true, name: 'items' }

    expect(rewriteRelatedIslandProps(props, context)).toEqual({
        attributes: {
            id: 'category_2',
            name: 'items[new_2][categories][]',
        },
        name: 'items[new_2][image]',
        value: 'fixtures/image.svg',
    })
    expect(props.name).toBe('image')
    expect(props.attributes.name).toBe('categories[]')
})

it('keeps existing relation names while still disambiguating ids', () => {
    const props = {
        attributes: { id: 'status', name: 'items[42][status]' },
        name: 'items[42][image]',
    }

    expect(
        rewriteRelatedIslandProps(props, {
            index: 0,
            isNew: false,
            name: 'items',
        }),
    ).toEqual({
        attributes: { id: 'status_0', name: 'items[42][status]' },
        name: 'items[42][image]',
    })
})
