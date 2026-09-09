import { expect, it } from 'vitest'

import {
    canMoveTreeItem,
    serializeTree,
    treeBranchDepth,
    treeListDepth,
} from '../../../../resources/js/shared/features/tree/tree-structure.js'

it('serializes nested tree ids without empty children arrays', () => {
    const child = treeItem('2')
    const parent = treeItem('1', treeList(child))
    const sibling = treeItem('3')
    const host = treeHost(treeList(parent, sibling))

    expect(serializeTree(host)).toEqual([{ id: '1', children: [{ id: '2' }] }, { id: '3' }])
})

it('rejects cycles and branches that exceed the configured max depth', () => {
    const nested = treeItem('2')
    const branch = treeItem('1', treeList(nested))
    const destination = treeItem('3', treeList())
    const root = treeList(branch, destination)
    treeHost(root)

    expect(treeBranchDepth(branch)).toBe(2)
    expect(treeListDepth(root, childList(destination))).toBe(1)
    expect(canMoveTreeItem(root, branch, childList(destination), 2)).toBe(false)
    expect(canMoveTreeItem(root, destination, childList(branch), 3)).toBe(true)
    expect(canMoveTreeItem(root, branch, childList(branch), 20)).toBe(false)
})

function treeHost(root) {
    const host = treeNode('host', [root])
    host.querySelector = (selector) => (selector === '[data-tree-root]' ? root : null)

    return host
}

function treeList(...items) {
    return treeNode('list', items)
}

function treeItem(id, children = null) {
    return treeNode('item', children ? [children] : [], { id })
}

function childList(item) {
    return item.children[0]
}

function treeNode(kind, children = [], dataset = {}) {
    const node = {
        children,
        dataset,
        kind,
        parentElement: null,
        closest: (selector) => closestNode(node, selector),
        contains: (target) => node === target || children.some((child) => child.contains(target)),
        matches: (selector) => matchesNode(kind, selector),
    }
    children.forEach((child) => {
        child.parentElement = node
    })

    return node
}

function closestNode(node, selector) {
    let current = node
    while (current) {
        if (current.matches(selector)) return current
        current = current.parentElement
    }

    return null
}

function matchesNode(kind, selector) {
    return (
        (kind === 'item' && selector === '[data-tree-item]') ||
        (kind === 'list' && selector === '[data-tree-list]')
    )
}
