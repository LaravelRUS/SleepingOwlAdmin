import {
    dependentSelectParameters,
    normalizeDependentSelectResponse,
} from './select-dependent-options.js'
import { readSelectDependencies } from './select-dependencies.js'

export function createDependentSelectLoad(input) {
    const settings = normalizeSettings(input)
    const state = createLoadState()
    const load = (dependencyId = null) => loadOptions(dependencyId, state, settings)

    state.removeListeners = bindDependencies(settings, load)
    settings.onInit()
    if (settings.initialize) load()

    return {
        destroy: () => destroyLoad(state, settings),
        load,
    }
}

async function loadOptions(dependencyId, state, settings) {
    cancelRequest(state)
    const requestId = ++state.requestId
    const context = dependencyContext(dependencyId, settings)
    state.controller = new globalThis.AbortController()
    settings.onBefore(context)
    settings.onLoading(true)

    try {
        const body = dependentSelectParameters(settings.dependencies, settings.document)
        const response = await settings.http.post(settings.url, body, {
            signal: state.controller.signal,
        })
        const result = normalizeDependentSelectResponse(await response.json())
        if (isCurrent(requestId, state)) await settings.onResults(result, context)
    } catch (error) {
        handleLoadError(error, requestId, state, settings, context)
    } finally {
        finishLoad(requestId, state, settings, context)
    }
}

function bindDependencies(settings, load) {
    const listeners = settings.dependencies.flatMap((id) => {
        const control = settings.document.getElementById(id)
        if (!control) return []

        const listener = () => load(id)
        control.addEventListener('change', listener)

        return [[control, listener]]
    })

    return () => listeners.forEach(([control, listener]) => control.removeEventListener('change', listener))
}

function dependencyContext(id, settings) {
    const dependency = id ? readSelectDependencies([id], settings.document)[0] : null

    return {
        dependencyId: id,
        dependencyValue: dependency?.value ?? null,
    }
}

function handleLoadError(error, requestId, state, settings, context) {
    if (isCurrent(requestId, state) && error?.name !== 'AbortError') {
        settings.onError(error, context)
    }
}

function finishLoad(requestId, state, settings, context) {
    if (!isCurrent(requestId, state)) return

    state.controller = null
    settings.onLoading(false)
    settings.onAfter(context)
}

function destroyLoad(state, settings) {
    state.destroyed = true
    state.requestId += 1
    state.removeListeners()
    cancelRequest(state)
    settings.onLoading(false)
}

function cancelRequest(state) {
    state.controller?.abort()
    state.controller = null
}

function isCurrent(requestId, state) {
    return !state.destroyed && requestId === state.requestId
}

function createLoadState() {
    return {
        controller: null,
        destroyed: false,
        removeListeners: () => {},
        requestId: 0,
    }
}

function normalizeSettings(input) {
    if (!input || typeof input !== 'object' || typeof input.http?.post !== 'function') {
        throw new TypeError('Dependent select requires an HTTP client.')
    }
    if (typeof input.url !== 'string' || input.url.length === 0) {
        throw new TypeError('Dependent select requires a URL.')
    }

    return {
        dependencies: Array.isArray(input.dependencies) ? input.dependencies : [],
        document: input.document ?? globalThis.document,
        http: input.http,
        initialize: input.initialize !== false,
        onAfter: callback(input.onAfter),
        onBefore: callback(input.onBefore),
        onError: callback(input.onError),
        onInit: callback(input.onInit),
        onLoading: callback(input.onLoading),
        onResults: callback(input.onResults),
        url: input.url,
    }
}

function callback(value) {
    return typeof value === 'function' ? value : () => {}
}
