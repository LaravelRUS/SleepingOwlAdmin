export function createRelatedSortable(Sortable, element, enabled) {
    if (!enabled) return null

    return new Sortable(element, {
        animation: 150,
        draggable: '[data-soa-related-group]',
        handle: '.drag-handle',
    })
}
