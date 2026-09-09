import {
    collectPushMenuToggles,
    collectTreeRoots,
    findPushMenuToggle,
    findTreeContext,
    isControlDisabled,
} from './sidebar-elements.js'
import { navigateTree, TREE_NAVIGATION_KEYS } from './sidebar-navigation.js'
import {
    clearCollapsedDone,
    collapseSidebar,
    expandSidebar,
    normalizeSidebar,
    sidebarPreference,
} from './sidebar-state.js'
import {
    readSidebarPreference,
    SIDEBAR_COLLAPSED,
    writeSidebarPreference,
} from './sidebar-storage.js'
import { collapseTreeItem, expandTreeItem, normalizeTree, toggleTreeItem } from './sidebar-tree.js'

const DEFAULT_BREAKPOINT = 1024
const DEFAULT_ANIMATION_DURATION = 360

export function mountSidebar(root, options = {}) {
    const state = createSidebarState(root, options)
    const listeners = bindSidebarListeners(state)
    scanSidebar(state, root)
    restoreSidebar(state)
    markSidebarLoaded(state)

    return sidebarController(state, listeners)
}

function sidebarController(state, listeners) {
    return {
        collapse: (options) => setSidebar(state, false, options),
        collapseItem: collapseTreeItem,
        destroy: () => destroySidebar(state, listeners),
        expand: (options) => setSidebar(state, true, options),
        expandItem: expandTreeItem,
        scan: (root = state.root) => scanSidebar(state, root),
        toggle: (options) => toggleAndPersist(state, options),
        toggleItem: toggleTreeItem,
    }
}

function createSidebarState(root, options) {
    assertRoot(root)
    const document = root.ownerDocument
    const window = document.defaultView

    return {
        animationDuration: options.animationDuration ?? DEFAULT_ANIMATION_DURATION,
        body: root,
        breakpoint: options.breakpoint ?? DEFAULT_BREAKPOINT,
        compact: isCompact(window, options.breakpoint ?? DEFAULT_BREAKPOINT),
        collapseTimer: null,
        document,
        expanded: !root.classList.contains('sidebar-collapse'),
        loadedFrame: null,
        preference: readSidebarPreference(window.localStorage),
        root,
        toggles: [],
        treeRoots: [],
        window,
    }
}

function bindSidebarListeners(state) {
    const listeners = {
        click: (event) => handleSidebarClick(state, event),
        keydown: (event) => handleSidebarKeydown(state, event),
        resize: () => handleSidebarResize(state),
    }
    state.root.addEventListener('click', listeners.click)
    state.root.addEventListener('keydown', listeners.keydown)
    state.window.addEventListener('resize', listeners.resize)

    return listeners
}

function handleSidebarClick(state, event) {
    const toggle = findPushMenuToggle(state.root, event.target)
    if (toggle) return handlePushMenuClick(state, event, toggle)
    if (event.target.closest?.('#sidebar-overlay')) return handleOverlayClick(state, event)

    const context = findTreeContext(state.root, event.target)
    if (!context || !isPlainPrimaryClick(event) || isControlDisabled(context.link)) return false
    event.preventDefault()
    event.stopPropagation()

    return toggleTreeItem(context)
}

function handlePushMenuClick(state, event, toggle) {
    if (!isPlainPrimaryClick(event) || isControlDisabled(toggle)) return false
    event.preventDefault()
    event.stopPropagation()

    return toggleAndPersist(state, { target: toggle })
}

function handleOverlayClick(state, event) {
    event.preventDefault()
    event.stopPropagation()

    return setSidebar(state, false, { persist: true })
}

function handleSidebarKeydown(state, event) {
    if (event.key === 'Escape') return handleSidebarEscape(state, event)
    const toggle = findPushMenuToggle(state.root, event.target)
    if (toggle) return handlePushMenuKeydown(state, event, toggle)

    const context = findTreeContext(state.root, event.target)

    return context ? handleTreeKeydown(event, context) : false
}

function handlePushMenuKeydown(state, event, toggle) {
    return ['Enter', ' '].includes(event.key) ? handleKeyboardToggle(state, event, toggle) : false
}

function handleSidebarEscape(state, event) {
    return state.compact && state.expanded ? closeOnEscape(state, event) : false
}

function handleTreeKeydown(event, context) {
    if (isControlDisabled(context.link)) return false
    if (['Enter', ' '].includes(event.key)) return handleKeyboardTreeToggle(event, context)
    if (!TREE_NAVIGATION_KEYS.has(event.key)) return false
    event.preventDefault()

    return navigateTree(context, event.key)
}

function handleKeyboardToggle(state, event, toggle) {
    event.preventDefault()
    event.stopPropagation()

    return toggleAndPersist(state, { target: toggle })
}

function handleKeyboardTreeToggle(event, context) {
    event.preventDefault()
    event.stopPropagation()

    return toggleTreeItem(context)
}

function closeOnEscape(state, event) {
    event.preventDefault()
    const changed = setSidebar(state, false, { persist: true })
    if (changed) state.toggles[0]?.focus()

    return changed
}

function handleSidebarResize(state) {
    const compact = isCompact(state.window, state.breakpoint)
    if (compact === state.compact) return false
    state.compact = compact
    const expanded = compact ? false : state.preference !== SIDEBAR_COLLAPSED
    normalizeSidebar(state, expanded)

    return true
}

function restoreSidebar(state) {
    const expanded = state.compact ? false : state.preference !== SIDEBAR_COLLAPSED
    normalizeSidebar(state, expanded)
}

function markSidebarLoaded(state) {
    state.loadedFrame = state.window.requestAnimationFrame(() => {
        state.body.classList.add('app-loaded')
        state.loadedFrame = null
    })
}

function toggleAndPersist(state, options = {}) {
    const expanded = !state.expanded

    return setSidebar(state, expanded, { ...options, persist: true })
}

function setSidebar(state, expanded, options = {}) {
    const changed = expanded ? expandSidebar(state, options) : collapseSidebar(state, options)
    if (!changed || !options.persist) return changed
    state.preference = sidebarPreference(expanded)
    writeSidebarPreference(state.window.localStorage, state.document, state.preference)

    return true
}

function scanSidebar(state, root) {
    state.toggles = collectPushMenuToggles(state.root)
    state.treeRoots = collectTreeRoots(state.root)
    state.treeRoots.forEach(normalizeTree)
    normalizeSidebar(state, state.expanded)

    return collectPushMenuToggles(root).length + collectTreeRoots(root).length
}

function destroySidebar(state, listeners) {
    clearCollapsedDone(state)
    if (state.loadedFrame !== null) {
        state.window.cancelAnimationFrame(state.loadedFrame)
        state.loadedFrame = null
    }
    state.root.removeEventListener('click', listeners.click)
    state.root.removeEventListener('keydown', listeners.keydown)
    state.window.removeEventListener('resize', listeners.resize)
}

function isCompact(window, breakpoint) {
    return window.innerWidth <= breakpoint
}

function isPlainPrimaryClick(event) {
    return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
    )
}

function assertRoot(root) {
    if (!root?.ownerDocument || typeof root.addEventListener !== 'function') {
        throw new TypeError('Sidebar requires a document body root.')
    }
}
