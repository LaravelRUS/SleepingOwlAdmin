import { childTreeList, directTreeItems, TREE_ITEM_SELECTOR } from './tree-structure.js'

const TREE_ACTION_SELECTOR = '[data-soa-tree-action]'
const TREE_TOGGLE_SELECTOR = '[data-soa-tree-toggle]'
const TREE_TOGGLE_COLLAPSED_SELECTOR = '[data-soa-tree-toggle-collapsed]'
const TREE_TOGGLE_EXPANDED_SELECTOR = '[data-soa-tree-toggle-expanded]'

export function bindTreeControls(element, labels) {
    const click = (event) => handleTreeClick(element, labels, event)
    element.addEventListener('click', click)
    syncTreeView(element, labels)

    return () => element.removeEventListener('click', click)
}

export function syncTreeView(element, labels) {
    element.querySelectorAll(TREE_ITEM_SELECTOR).forEach((item) => syncTreeItem(item, labels))
}

export function setAllTreeItemsCollapsed(element, collapsed, labels) {
    element.querySelectorAll(TREE_ITEM_SELECTOR).forEach((item) => {
        if (directTreeItems(childTreeList(item) ?? emptyList()).length) {
            setTreeItemCollapsed(item, collapsed, labels)
        }
    })
}

export function setTreeBusy(element, busy) {
    element.setAttribute('aria-busy', String(busy))
    if (busy) element.dataset.soaTreeSaveState = 'saving'
    else if (element.dataset.soaTreeSaveState !== 'error') element.dataset.soaTreeSaveState = 'idle'
}

function handleTreeClick(element, labels, event) {
    const action = event.target.closest(TREE_ACTION_SELECTOR)
    if (action && element.contains(action)) {
        event.preventDefault()
        handleTreeAction(element, labels, action.dataset.soaTreeAction)
        return
    }

    const toggle = event.target.closest(TREE_TOGGLE_SELECTOR)
    if (!toggle || !element.contains(toggle)) return

    event.preventDefault()
    const item = toggle.closest(TREE_ITEM_SELECTOR)
    setTreeItemCollapsed(item, item.dataset.soaTreeCollapsed !== 'true', labels)
}

function handleTreeAction(element, labels, action) {
    if (action === 'expand-all') setAllTreeItemsCollapsed(element, false, labels)
    if (action === 'collapse-all') setAllTreeItemsCollapsed(element, true, labels)
}

function syncTreeItem(item, labels) {
    const list = childTreeList(item)
    const hasChildren = list && directTreeItems(list).length > 0
    const toggle = directToggle(item)

    if (!hasChildren) {
        hideTreeToggle(toggle)
        delete item.dataset.soaTreeCollapsed
        if (list) list.hidden = false
        return
    }

    setTreeItemCollapsed(item, item.dataset.soaTreeCollapsed === 'true', labels)
}

function setTreeItemCollapsed(item, collapsed, labels) {
    const list = childTreeList(item)
    if (!list) return

    const toggle = directToggle(item)
    item.dataset.soaTreeCollapsed = String(collapsed)
    list.hidden = collapsed
    syncTreeToggle(toggle, collapsed, labels)
}

function directToggle(item) {
    return [...item.children].find((child) => child.matches(TREE_TOGGLE_SELECTOR)) ?? null
}

function hideTreeToggle(toggle) {
    if (!toggle) return

    toggle.hidden = true
    toggle.setAttribute('aria-expanded', 'false')
}

function syncTreeToggle(toggle, collapsed, labels) {
    if (!toggle) return

    toggle.hidden = false
    toggle.setAttribute('aria-expanded', String(!collapsed))
    toggle.setAttribute('aria-label', collapsed ? labels.expand : labels.collapse)
    setToggleState(toggle, TREE_TOGGLE_COLLAPSED_SELECTOR, collapsed)
    setToggleState(toggle, TREE_TOGGLE_EXPANDED_SELECTOR, !collapsed)
}

function setToggleState(toggle, selector, visible) {
    const state = toggle.querySelector(selector)
    if (state) state.hidden = !visible
}

function emptyList() {
    return { children: [] }
}
