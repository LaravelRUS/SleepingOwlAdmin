import { expect, it, vi } from 'vitest'

import { createRelatedSortable } from '../../../../resources/assets/js_owl/admin/form/related/related-sortable'

it('creates a handle-only Sortable driver when related ordering is enabled', () => {
    const element = { id: 'related-groups' }
    const Sortable = vi.fn(function (target, options) {
        Object.assign(this, { options, target })
    })

    const sortable = createRelatedSortable(Sortable, element, true)

    expect(sortable.target).toBe(element)
    expect(sortable.options).toMatchObject({
        draggable: '[data-related-group]',
        handle: '.drag-handle',
    })
    expect(createRelatedSortable(Sortable, element, false)).toBeNull()
    expect(Sortable).toHaveBeenCalledOnce()
})
