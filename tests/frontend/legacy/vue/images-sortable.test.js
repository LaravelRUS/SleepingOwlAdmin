import { describe, expect, it, vi } from 'vitest'

import {
    createImagesSortable,
    imagesSortableOptions,
} from '../../../../resources/js/shared/legacy/admin/form/images-sortable'

describe('images sortable driver', () => {
    it('creates a handle-only sortable collection', () => {
        const element = { id: 'gallery' }
        const Sortable = vi.fn(function (target, options) {
            Object.assign(this, { options, target })
        })

        const sortable = createImagesSortable(Sortable, element, 'project-images-moving', vi.fn())

        expect(sortable.target).toBe(element)
        expect(sortable.options).toMatchObject({
            draggable: '[data-images-item]',
            ghostClass: 'project-images-moving',
            handle: '[data-images-drag-handle]',
        })
    })

    it('reports changed draggable indexes and ignores no-op moves', () => {
        const onReorder = vi.fn()
        const options = imagesSortableOptions('project-images-moving', onReorder)

        options.onEnd({ newDraggableIndex: 2, oldDraggableIndex: 0 })
        options.onEnd({ newIndex: 1, oldIndex: 1 })

        expect(onReorder).toHaveBeenCalledOnce()
        expect(onReorder).toHaveBeenCalledWith(0, 2)
    })

    it('keeps a classless custom host on the vendor default', () => {
        expect(imagesSortableOptions(undefined, vi.fn())).not.toHaveProperty('ghostClass')
    })
})
