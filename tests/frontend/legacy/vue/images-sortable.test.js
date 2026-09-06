import { describe, expect, it, vi } from 'vitest'

import {
    createImagesSortable,
    imagesSortableOptions,
} from '../../../../resources/assets/js_owl/admin/form/images-sortable'

describe('images sortable driver', () => {
    it('creates a handle-only sortable collection', () => {
        const element = { id: 'gallery' }
        const Sortable = vi.fn(function (target, options) {
            Object.assign(this, { options, target })
        })

        const sortable = createImagesSortable(Sortable, element, vi.fn())

        expect(sortable.target).toBe(element)
        expect(sortable.options).toMatchObject({
            draggable: '[data-soa-images-item]',
            handle: '[data-soa-images-drag-handle]',
        })
    })

    it('reports changed draggable indexes and ignores no-op moves', () => {
        const onReorder = vi.fn()
        const options = imagesSortableOptions(onReorder)

        options.onEnd({ newDraggableIndex: 2, oldDraggableIndex: 0 })
        options.onEnd({ newIndex: 1, oldIndex: 1 })

        expect(onReorder).toHaveBeenCalledOnce()
        expect(onReorder).toHaveBeenCalledWith(0, 2)
    })
})
