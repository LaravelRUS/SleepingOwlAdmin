import { collectTreeContexts, siblingTreeContexts } from './sidebar-elements.js'

export function normalizeTree(tree) {
    tree.setAttribute('role', tree.getAttribute('role') ?? 'menu')
    collectTreeContexts(tree).forEach((context) => {
        applyTreeItemState(context, context.item.classList.contains('menu-open'))
    })
}

export function expandTreeItem(context) {
    if (context.item.classList.contains('menu-open')) return false
    if (!dispatchTreeEvent(context, 'navigation:expand', true)) return false

    if (!collapseAccordionSiblings(context)) return false
    applyTreeItemState(context, true)
    dispatchTreeEvents(context, ['navigation:expanded', 'expanded.lte.treeview'])

    return true
}

export function collapseTreeItem(context) {
    if (!context.item.classList.contains('menu-open')) return false
    if (!dispatchTreeEvent(context, 'navigation:collapse', true)) return false

    closeTreeBranch(context)
    dispatchTreeEvents(context, ['navigation:collapsed', 'collapsed.lte.treeview'])

    return true
}

export function toggleTreeItem(context) {
    return context.item.classList.contains('menu-open')
        ? collapseTreeItem(context)
        : expandTreeItem(context)
}

function collapseAccordionSiblings(context) {
    if (context.tree.getAttribute('data-accordion') === 'false') return true

    return siblingTreeContexts(context)
        .filter((sibling) => sibling.item !== context.item)
        .filter((sibling) => sibling.item.classList.contains('menu-open'))
        .every(collapseTreeItem)
}

function closeTreeBranch(context) {
    applyTreeItemState(context, false)
    collectTreeContexts(context.menu).forEach((nested) => applyTreeItemState(nested, false))
}

function applyTreeItemState(context, expanded) {
    context.item.classList.toggle('menu-open', expanded)
    context.item.classList.remove('menu-is-opening')
    context.menu.hidden = !expanded
    context.link.setAttribute('aria-expanded', String(expanded))
    context.link.setAttribute('aria-haspopup', 'true')
}

function dispatchTreeEvents(context, names) {
    names.forEach((name) => dispatchTreeEvent(context, name))
}

function dispatchTreeEvent(context, name, cancelable = false) {
    return context.tree.dispatchEvent(
        new context.tree.ownerDocument.defaultView.CustomEvent(name, {
            bubbles: true,
            cancelable,
            detail: context,
        }),
    )
}
