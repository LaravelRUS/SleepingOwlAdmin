import { readInlineEditorConfig } from './inline-editor-config.js'
import { inlineEditErrorMessage, submitInlineEdit } from './inline-editor-request.js'
import { applyInlineEditorValue } from './inline-editor-value.js'
import { createInlineEditorView } from './inline-editor-view.js'

export const INLINE_EDITOR_COMPONENT = 'inline-editor'
export const INLINE_EDITOR_SELECTOR = '[data-inline-editor]'

export function createInlineEditorDefinition(dependencies) {
    const settings = normalizeDependencies(dependencies)

    return {
        name: INLINE_EDITOR_COMPONENT,
        selector: INLINE_EDITOR_SELECTOR,
        mount: (element) => mountInlineEditor(element, settings),
    }
}

export function mountInlineEditor(element, dependencies) {
    const config = readInlineEditorConfig(element)
    const settings = normalizeDependencies(dependencies)
    const state = { config, dependencies: settings, element, request: null, view: null }
    const open = (event) => {
        event?.preventDefault()
        activateEditor(state)
    }

    element.addEventListener('click', open)

    return {
        destroy: () => destroyEditor(state, open),
        open: () => openEditor(state),
    }
}

function activateEditor(state) {
    state.config = readInlineEditorConfig(state.element)

    return state.config.type === 'boolean' ? toggleBoolean(state) : openEditor(state)
}

function openEditor(state) {
    if (state.view) return state.view

    state.config = readInlineEditorConfig(state.element)
    state.view = state.dependencies.createView(
        state.element,
        state.config,
        state.dependencies.labels,
        {
            cancel: () => closeEditor(state),
            submit: (value) => submitValue(state, value),
        },
    )
    state.dependencies.components.scan(state.view.root)
    state.view.focus?.()
    dispatch(state, 'inline-edit:opened')

    return state.view
}

async function submitValue(state, value) {
    if (state.request) return

    const request = new globalThis.AbortController()
    state.request = request
    state.view.setError('')
    state.view.setBusy(true)
    dispatch(state, 'inline-edit:submitting', { value })

    try {
        const saved = await submitInlineEdit(
            state.dependencies.http,
            state.config,
            value,
            request.signal,
        )
        if (state.request !== request) return
        state.request = null
        applyInlineEditorValue(state.element, state.config, saved)
        dispatch(state, 'inline-edit:submitted', { value: saved })
        closeEditor(state)
    } catch (error) {
        await handleSubmitError(state, request, error)
    }
}

async function toggleBoolean(state) {
    if (state.request) return

    const checkedValue = state.config.options[0]?.value ?? '1'
    const value = state.config.value.includes(checkedValue) ? [] : [checkedValue]
    const request = new globalThis.AbortController()
    state.request = request
    setTriggerBusy(state.element, true)
    dispatch(state, 'inline-edit:submitting', { value })

    try {
        const saved = await submitInlineEdit(
            state.dependencies.http,
            state.config,
            value,
            request.signal,
        )
        if (state.request !== request) return
        state.request = null
        applyInlineEditorValue(state.element, state.config, saved)
        dispatch(state, 'inline-edit:submitted', { value: saved })
    } catch (error) {
        if (state.request !== request || error?.name === 'AbortError') return
        const message = await inlineEditErrorMessage(error, state.dependencies.labels.error)
        if (state.request !== request) return
        state.request = null
        state.dependencies.messages?.error?.(state.dependencies.labels.error, message)
        dispatch(state, 'inline-edit:failed', { error })
    } finally {
        if (state.request === request) state.request = null
        setTriggerBusy(state.element, false)
    }
}

async function handleSubmitError(state, request, error) {
    if (state.request !== request || error?.name === 'AbortError') return

    const message = await inlineEditErrorMessage(error, state.dependencies.labels.error)
    if (state.request !== request) return

    state.request = null
    state.view.setBusy(false)
    state.view.setError(message)
    dispatch(state, 'inline-edit:failed', { error })
}

function closeEditor(state) {
    if (!state.view) return

    state.request?.abort()
    state.request = null
    state.dependencies.components.destroy(state.view.root)
    state.view.destroy()
    state.view = null
    dispatch(state, 'inline-edit:closed')
}

function destroyEditor(state, open) {
    state.element.removeEventListener('click', open)
    state.request?.abort()
    closeEditor(state)
}

function setTriggerBusy(element, busy) {
    element.disabled = busy
    element.setAttribute('aria-busy', String(busy))
}

function dispatch(state, name, extra = {}) {
    state.element.dispatchEvent(
        new globalThis.CustomEvent(name, {
            bubbles: true,
            detail: { name: state.config.name, pk: state.config.pk, ...extra },
        }),
    )
}

function normalizeDependencies(input) {
    assertFunction(input?.http, 'post', 'Inline editor requires HTTP.')
    assertFunction(input?.components, 'scan', 'Inline editor requires component lifecycle.')
    assertFunction(input?.components, 'destroy', 'Inline editor requires component lifecycle.')

    return {
        components: input.components,
        createView: input.createView ?? createInlineEditorView,
        http: input.http,
        labels: normalizeLabels(input.labels),
        messages: input.messages,
    }
}

function normalizeLabels(labels = {}) {
    return {
        cancel: labels.cancel ?? 'Cancel',
        error: labels.error ?? 'Request failed',
        save: labels.save ?? 'Save',
    }
}

function assertFunction(object, method, message) {
    if (typeof object?.[method] !== 'function') throw new TypeError(message)
}
