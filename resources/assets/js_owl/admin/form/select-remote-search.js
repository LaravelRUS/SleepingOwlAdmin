import {
    appendSelectDependencies,
    readSelectDependencies,
} from './select-dependencies.js'
import { normalizeRemoteSelectOptions } from './select-remote-options.js'

export function createRemoteSelectSearch(input) {
    const settings = normalizeSettings(input)
    const state = createSearchState()

    return {
        destroy: () => destroySearch(state, settings),
        search: (query) => scheduleSearch(query, state, settings),
    }
}

export function remoteSelectParameters(query, dependencyIds, document) {
    const parameters = new globalThis.URLSearchParams({ page: '1', q: query })
    const dependencies = readSelectDependencies(dependencyIds, document)

    return appendSelectDependencies(parameters, dependencies)
}

function scheduleSearch(input, state, settings) {
    const query = String(input ?? '').trim()
    cancelPending(state)
    state.requestId += 1

    if (state.destroyed || query.length < settings.minSymbols) {
        settings.onLoading(false)
        return false
    }

    settings.onLoading(true)
    const requestId = state.requestId
    state.timer = globalThis.setTimeout(
        () => loadOptions(query, requestId, state, settings),
        settings.delay,
    )

    return true
}

async function loadOptions(query, requestId, state, settings) {
    state.timer = null
    state.controller = new globalThis.AbortController()

    try {
        const body = remoteSelectParameters(query, settings.dependencies, settings.document)
        const response = await settings.http.post(settings.url, body, {
            signal: state.controller.signal,
        })
        const items = normalizeRemoteSelectOptions(await response.json())
        if (isCurrentRequest(requestId, state)) settings.onResults(items)
    } catch (error) {
        if (isCurrentRequest(requestId, state) && error?.name !== 'AbortError') {
            settings.onError(error)
        }
    } finally {
        if (isCurrentRequest(requestId, state)) finishRequest(state, settings)
    }
}

function finishRequest(state, settings) {
    state.controller = null
    settings.onLoading(false)
}

function destroySearch(state, settings) {
    state.destroyed = true
    state.requestId += 1
    cancelPending(state)
    settings.onLoading(false)
}

function cancelPending(state) {
    if (state.timer !== null) globalThis.clearTimeout(state.timer)
    state.controller?.abort()
    state.timer = null
    state.controller = null
}

function isCurrentRequest(requestId, state) {
    return !state.destroyed && requestId === state.requestId
}

function createSearchState() {
    return {
        controller: null,
        destroyed: false,
        requestId: 0,
        timer: null,
    }
}

function normalizeSettings(input) {
    if (!input || typeof input !== 'object' || typeof input.http?.post !== 'function') {
        throw new TypeError('Remote select search requires an HTTP client.')
    }
    if (typeof input.url !== 'string' || input.url.length === 0) {
        throw new TypeError('Remote select search requires a URL.')
    }

    return {
        delay: positiveNumber(input.delay, 250),
        dependencies: Array.isArray(input.dependencies) ? input.dependencies : [],
        document: input.document ?? globalThis.document,
        http: input.http,
        minSymbols: nonNegativeNumber(input.minSymbols, 3),
        onError: callback(input.onError),
        onLoading: callback(input.onLoading),
        onResults: callback(input.onResults),
        url: input.url,
    }
}

function positiveNumber(value, fallback) {
    const number = Number(value)

    return Number.isFinite(number) && number > 0 ? number : fallback
}

function nonNegativeNumber(value, fallback) {
    const number = Number(value)

    return Number.isFinite(number) && number >= 0 ? number : fallback
}

function callback(value) {
    return typeof value === 'function' ? value : () => {}
}
