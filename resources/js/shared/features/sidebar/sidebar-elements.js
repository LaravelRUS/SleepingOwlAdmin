export const PUSH_MENU_SELECTOR = '[data-lte-toggle="sidebar"], [data-widget="pushmenu"]'
export const TREE_ROOT_SELECTOR = '[data-lte-toggle="treeview"], [data-widget="treeview"]'
export const TREE_ITEM_SELECTOR = '.nav-item'
export const TREE_LINK_SELECTOR = '.nav-link'
export const TREE_MENU_SELECTOR = '.nav-treeview'

export function collectPushMenuToggles(root) {
    return collectMatching(root, PUSH_MENU_SELECTOR)
}

export function collectTreeRoots(root) {
    return collectMatching(root, TREE_ROOT_SELECTOR)
}

export function findPushMenuToggle(root, target) {
    const toggle = target?.closest?.(PUSH_MENU_SELECTOR)

    return toggle && root.contains(toggle) ? toggle : null
}

export function findTreeContext(root, target) {
    const link = target?.closest?.(TREE_LINK_SELECTOR)
    if (!link) return null
    const context = contextForLink(link)

    return isTreeContextInside(root, context) ? context : null
}

export function collectTreeContexts(tree) {
    return [...tree.querySelectorAll(TREE_ITEM_SELECTOR)]
        .map((item) => treeContextForItem(tree, item))
        .filter(Boolean)
}

export function siblingTreeContexts(context) {
    return [...(context.item.parentElement?.children ?? [])]
        .map((item) => treeContextForItem(context.tree, item))
        .filter(Boolean)
}

export function parentTreeContext(context) {
    const parentItem = context.item.parentElement?.closest?.(TREE_ITEM_SELECTOR)

    return parentItem ? treeContextForItem(context.tree, parentItem) : null
}

export function isControlDisabled(element) {
    const checks = [
        element?.hasAttribute?.('disabled'),
        element?.getAttribute?.('aria-disabled') === 'true',
        element?.classList?.contains('disabled'),
    ]

    return checks.some(Boolean)
}

function contextForLink(link) {
    const item = link.closest(TREE_ITEM_SELECTOR)
    const tree = item?.closest?.(TREE_ROOT_SELECTOR)
    const menu = directChild(item, TREE_MENU_SELECTOR)

    return item && tree && menu ? { item, link, menu, tree } : null
}

function isTreeContextInside(root, context) {
    return Boolean(
        context &&
        root.contains(context.tree) &&
        directChild(context.item, TREE_LINK_SELECTOR) === context.link,
    )
}

function treeContextForItem(tree, item) {
    if (item.closest(TREE_ROOT_SELECTOR) !== tree) return null
    const link = directChild(item, TREE_LINK_SELECTOR)
    const menu = directChild(item, TREE_MENU_SELECTOR)

    return link && menu ? { item, link, menu, tree } : null
}

function directChild(element, selector) {
    return [...(element?.children ?? [])].find((child) => child.matches(selector)) ?? null
}

function collectMatching(root, selector) {
    const elements = [...(root.querySelectorAll?.(selector) ?? [])]
    if (root.matches?.(selector)) elements.unshift(root)

    return elements
}
