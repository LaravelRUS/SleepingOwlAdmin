export const TREE_ITEM_SELECTOR = '[data-soa-tree-item]'
export const TREE_LIST_SELECTOR = '[data-soa-tree-list]'

export function serializeTree(element) {
    return serializeTreeList(rootTreeList(element))
}

export function serializeTreeList(list) {
    return directTreeItems(list).map((item) => serializeTreeItem(item))
}

export function directTreeItems(list) {
    return [...list.children].filter((child) => child.matches(TREE_ITEM_SELECTOR))
}

export function childTreeList(item) {
    return [...item.children].find((child) => child.matches(TREE_LIST_SELECTOR)) ?? null
}

export function rootTreeList(element) {
    const list = element.querySelector('[data-soa-tree-root]')
    if (!list) throw new Error('Tree root list was not found.')

    return list
}

export function canMoveTreeItem(root, item, targetList, maxDepth) {
    if (item.contains(targetList)) return false

    const destinationDepth = treeListDepth(root, targetList)

    return destinationDepth + treeBranchDepth(item) <= maxDepth
}

export function treeBranchDepth(item) {
    const children = childTreeList(item)
    if (!children) return 1

    const depths = directTreeItems(children).map(treeBranchDepth)

    return 1 + (depths.length ? Math.max(...depths) : 0)
}

export function treeListDepth(root, list) {
    let current = list
    let depth = 0

    while (current !== root) {
        const parentItem = current.parentElement?.closest(TREE_ITEM_SELECTOR)
        if (!parentItem || !root.contains(parentItem)) return Number.POSITIVE_INFINITY
        current = parentItem.parentElement
        depth += 1
    }

    return depth
}

function serializeTreeItem(item) {
    const value = { id: item.dataset.id }
    const children = childTreeList(item)
    const serialized = children ? serializeTreeList(children) : []
    if (serialized.length) value.children = serialized

    return value
}
