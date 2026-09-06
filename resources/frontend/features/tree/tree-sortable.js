import {
    canMoveTreeItem,
    rootTreeList,
    TREE_ITEM_SELECTOR,
    TREE_LIST_SELECTOR,
} from './tree-structure.js'

let treeGroupSequence = 0

export function mountTreeSortables(sortable, element, config, handlers) {
    if (!config.reorderable) return emptySortableSet()
    assertSortable(sortable)

    const root = rootTreeList(element)
    const group = `sleepingowl-tree-${++treeGroupSequence}`
    const instances = matchingLists(element).map((list) =>
        sortable.create(list, sortableOptions(element, root, group, config, handlers)),
    )

    return {
        destroy: () => instances.forEach((instance) => instance.destroy()),
        instances,
    }
}

export function sortableOptions(element, root, group, config, handlers) {
    return {
        animation: 150,
        chosenClass: 'soa-tree-chosen',
        draggable: TREE_ITEM_SELECTOR,
        emptyInsertThreshold: 16,
        fallbackOnBody: true,
        ghostClass: 'soa-tree-ghost',
        group,
        handle: '[data-soa-tree-handle]',
        invertSwap: true,
        onEnd: (event) => endDrag(element, handlers, event),
        onMove: (event) => canMoveTreeItem(root, event.dragged, event.to, config.maxDepth),
        onStart: () => {
            element.dataset.soaTreeDragging = 'true'
        },
        swapThreshold: 0.65,
    }
}

function endDrag(element, handlers, event) {
    delete element.dataset.soaTreeDragging
    handlers.end(event)
}

function matchingLists(element) {
    return [...element.querySelectorAll(TREE_LIST_SELECTOR)]
}

function emptySortableSet() {
    return { destroy() {}, instances: [] }
}

function assertSortable(sortable) {
    if (typeof sortable?.create !== 'function') {
        throw new TypeError('Tree reorder requires SortableJS.')
    }
}
