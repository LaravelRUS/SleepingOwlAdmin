import { SIDEBAR_COLLAPSED, SIDEBAR_EXPANDED } from './sidebar-storage.js'

const COLLAPSED_EVENTS = ['sidebar:collapsed', 'collapsed.lte.pushmenu']
const EXPANDED_EVENTS = ['sidebar:shown', 'shown.lte.pushmenu']

export function normalizeSidebar(state, expanded) {
    state.expanded = expanded
    applySidebarClasses(state, expanded)
    syncPushMenuToggles(state)
}

export function expandSidebar(state, options = {}) {
    return changeSidebarState(state, true, options)
}

export function collapseSidebar(state, options = {}) {
    return changeSidebarState(state, false, options)
}

export function toggleSidebar(state, options = {}) {
    return state.expanded ? collapseSidebar(state, options) : expandSidebar(state, options)
}

export function sidebarPreference(expanded) {
    return expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED
}

function changeSidebarState(state, expanded, options) {
    if (state.expanded === expanded) return false
    const target = options.target ?? state.toggles[0] ?? state.body
    const before = expanded ? 'sidebar:show' : 'sidebar:collapse'
    if (!dispatchSidebarEvent(target, before, state, true)) return false

    clearCollapsedDone(state)
    state.expanded = expanded
    applySidebarClasses(state, expanded)
    syncPushMenuToggles(state)
    dispatchSidebarEvents(target, expanded ? EXPANDED_EVENTS : COLLAPSED_EVENTS, state)
    if (!expanded) dispatchCollapsedDone(target, state)

    return true
}

function applySidebarClasses(state, expanded) {
    state.body.classList.toggle('sidebar-collapse', !expanded)
    state.body.classList.toggle('sidebar-closed', !expanded && state.compact)
    state.body.classList.toggle('sidebar-open', expanded || !state.compact)
}

function syncPushMenuToggles(state) {
    state.toggles.forEach((toggle) => {
        toggle.setAttribute('aria-expanded', String(state.expanded))
        if (!toggle.hasAttribute('href')) toggle.setAttribute('role', 'button')
        if (!toggle.hasAttribute('href') && !toggle.hasAttribute('tabindex')) {
            toggle.setAttribute('tabindex', '0')
        }
    })
}

function dispatchSidebarEvents(target, names, state) {
    names.forEach((name) => dispatchSidebarEvent(target, name, state))
}

function dispatchCollapsedDone(target, state) {
    state.collapseTimer = state.window.setTimeout(
        () => completeCollapsedEvent(target, state),
        state.animationDuration,
    )
}

function completeCollapsedEvent(target, state) {
    state.collapseTimer = null
    dispatchSidebarEvent(target, 'collapsed-done.lte.pushmenu', state)
}

export function clearCollapsedDone(state) {
    if (state.collapseTimer === null) return
    state.window.clearTimeout(state.collapseTimer)
    state.collapseTimer = null
}

function dispatchSidebarEvent(target, name, state, cancelable = false) {
    return target.dispatchEvent(
        new state.window.CustomEvent(name, {
            bubbles: true,
            cancelable,
            detail: { body: state.body, expanded: state.expanded },
        }),
    )
}
