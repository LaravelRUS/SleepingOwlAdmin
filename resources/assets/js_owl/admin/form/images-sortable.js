export function createImagesSortable(Sortable, element, onReorder) {
    return new Sortable(element, imagesSortableOptions(onReorder))
}

export function imagesSortableOptions(onReorder) {
    return {
        animation: 150,
        draggable: '[data-images-item]',
        ghostClass: 'soa-images__item--moving',
        handle: '[data-images-drag-handle]',
        onEnd: (event) => notifyReorder(event, onReorder),
    }
}

function notifyReorder(event, onReorder) {
    const from = event.oldDraggableIndex ?? event.oldIndex
    const to = event.newDraggableIndex ?? event.newIndex

    if (Number.isInteger(from) && Number.isInteger(to) && from !== to) {
        onReorder(from, to)
    }
}
