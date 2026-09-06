import { readTreeConfig } from './tree-config.js'
import { submitTreeOrder } from './tree-request.js'
import { serializeTree } from './tree-structure.js'
import { mountTreeSortables } from './tree-sortable.js'
import { bindTreeControls, setTreeBusy, syncTreeView } from './tree-view.js'

export const TREE_COMPONENT = 'tree'
export const TREE_SELECTOR = '[data-soa-tree]'

export function createTreeDefinition(dependencies) {
    const settings = normalizeDependencies(dependencies)

    return {
        mount: (element) => mountTree(element, settings),
        name: TREE_COMPONENT,
        selector: TREE_SELECTOR,
    }
}

export function mountTree(element, dependencies) {
    const settings = normalizeDependencies(dependencies)
    const state = createTreeState(element, settings)
    const removeControls = bindTreeControls(element, settings.labels)
    const sortables = mountTreeSortables(settings.sortable, element, state.config, {
        end: () => handleTreeMove(state),
    })

    return {
        destroy: () => destroyTree(state, removeControls, sortables),
        save: () => enqueueTreeSave(state),
        serialize: () => serializeTree(element),
    }
}

function createTreeState(element, dependencies) {
    return {
        config: readTreeConfig(element),
        dependencies,
        destroyed: false,
        element,
        pending: 0,
        queue: Promise.resolve(),
    }
}

function handleTreeMove(state) {
    syncTreeView(state.element, state.dependencies.labels)
    enqueueTreeSave(state).catch(() => {})
}

function enqueueTreeSave(state) {
    const data = serializeTree(state.element)
    const request = state.queue
        .catch(() => {})
        .then(() => {
            return submitTreeOrder(state.dependencies.http, state.config, data)
        })

    state.queue = request
    changePending(state, 1)

    return request
        .then(
            () => handleTreeSaved(state, data),
            (error) => handleTreeFailure(state, error),
        )
        .finally(() => changePending(state, -1))
}

function handleTreeSaved(state, data) {
    if (state.destroyed) return

    dispatchTreeEvent(state.element, 'tree:changed', { data })
    state.dependencies.events?.fire?.('display.tree::changed', state.element, data)
    state.dependencies.notifications.success?.()
}

function handleTreeFailure(state, error) {
    if (!state.destroyed) {
        state.element.dataset.soaTreeSaveState = 'error'
        dispatchTreeEvent(state.element, 'tree:failed', { error })
        state.dependencies.notifications.error?.(error)
    }

    throw error
}

function changePending(state, amount) {
    state.pending += amount
    if (!state.destroyed) setTreeBusy(state.element, state.pending > 0)
}

function destroyTree(state, removeControls, sortables) {
    state.destroyed = true
    removeControls()
    sortables.destroy()
    delete state.element.dataset.soaTreeDragging
    state.element.removeAttribute('aria-busy')
}

function dispatchTreeEvent(element, name, detail) {
    element.dispatchEvent(new globalThis.CustomEvent(name, { bubbles: true, detail }))
}

function normalizeDependencies(input) {
    if (typeof input?.http?.post !== 'function') throw new TypeError('Tree requires Admin.Http.')

    return {
        events: input.events,
        http: input.http,
        labels: normalizeLabels(input.labels),
        notifications: normalizeNotifications(input.notifications),
        sortable: input.sortable,
    }
}

function normalizeLabels(labels = {}) {
    return {
        collapse: labels.collapse ?? 'Collapse',
        expand: labels.expand ?? 'Expand',
    }
}

function normalizeNotifications(notifications = {}) {
    return notifications
}
