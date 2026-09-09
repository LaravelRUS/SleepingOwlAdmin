import { parentTreeContext } from './sidebar-elements.js'
import { collapseTreeItem, expandTreeItem } from './sidebar-tree.js'

export const TREE_NAVIGATION_KEYS = new Set([
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'End',
    'Home',
])

export function navigateTree(context, key) {
    if (key === 'ArrowRight') return navigateRight(context)
    if (key === 'ArrowLeft') return navigateLeft(context)

    const links = visibleTreeLinks(context.tree)
    const current = links.indexOf(context.link)
    const target = navigationTarget(links, current, key)
    target?.focus()

    return Boolean(target)
}

function navigateRight(context) {
    if (!context.item.classList.contains('menu-open')) return expandTreeItem(context)
    const child = visibleTreeLinks(context.menu)[0]
    child?.focus()

    return Boolean(child)
}

function navigateLeft(context) {
    if (context.item.classList.contains('menu-open')) return collapseTreeItem(context)
    const parent = parentTreeContext(context)
    parent?.link.focus()

    return Boolean(parent)
}

function navigationTarget(links, current, key) {
    if (key === 'Home') return links[0]
    if (key === 'End') return links.at(-1)
    const offset = key === 'ArrowUp' ? -1 : 1

    return links[(current + offset + links.length) % links.length]
}

function visibleTreeLinks(root) {
    return [...root.querySelectorAll('.nav-link')]
        .filter(
            (link) =>
                !isInsideHiddenMenu(link) && !link.matches('[disabled], [aria-disabled="true"]'),
        )
        .filter((link) => link.closest('.nav-item'))
}

function isInsideHiddenMenu(link) {
    let menu = link.closest('.nav-treeview')
    while (menu) {
        if (menu.hidden) return true
        menu = menu.parentElement?.closest?.('.nav-treeview')
    }

    return false
}
