export function createImagesSortable(Sortable, element, ghostClass, onReorder) {
    return new Sortable(element, imagesSortableOptions(ghostClass, onReorder))
}

export function imagesSortableOptions(ghostClass, onReorder) {
    return {
        animation: 150,
        draggable: '[data-images-item]',
        ...(ghostClass ? { ghostClass } : {}),
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
