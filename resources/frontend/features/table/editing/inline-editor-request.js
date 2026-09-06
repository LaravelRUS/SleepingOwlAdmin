export class InlineEditRejectedError extends Error {
    constructor(message) {
        super(message)
        this.name = 'InlineEditRejectedError'
    }
}

export async function submitInlineEdit(http, config, value, signal) {
    assertHttp(http)
    const response = await http.post(config.url, inlineEditParameters(config, value), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        signal,
    })
    const payload = await response.json()

    return normalizeInlineEditResponse(payload, value)
}

export function inlineEditParameters(config, value) {
    const parameters = new globalThis.URLSearchParams()
    parameters.set('name', config.name)
    parameters.set('pk', config.pk)
    appendValue(parameters, value)

    return parameters
}

export function normalizeInlineEditResponse(payload, fallbackValue) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new InlineEditRejectedError('Inline edit response must be an object.')
    }
    if (payload.status !== true && payload.status !== 'true') {
        throw new InlineEditRejectedError(payload.reason || '')
    }

    return Object.hasOwn(payload, 'newValue') ? payload.newValue : fallbackValue
}

export async function inlineEditErrorMessage(error, fallback) {
    const rejected = rejectedErrorMessage(error, fallback)
    if (rejected !== null) return rejected

    const response = error?.response
    if (!response) return error?.message || fallback
    if (response.status >= 500) return fallback

    const payload = await readErrorPayload(response)

    return payloadErrorMessage(payload, fallback)
}

function rejectedErrorMessage(error, fallback) {
    return error instanceof InlineEditRejectedError ? error.message || fallback : null
}

function payloadErrorMessage(payload, fallback) {
    return validationMessage(payload) || payload?.message || payload?.reason || fallback
}

async function readErrorPayload(response) {
    if (typeof response.text === 'function') {
        const text = await response.text()
        if (!text) return null

        try {
            return JSON.parse(text)
        } catch {
            return { message: text }
        }
    }

    return typeof response.json === 'function' ? response.json() : null
}

function validationMessage(payload) {
    const errors = payload?.errors
    if (!errors || typeof errors !== 'object') return null

    const first = Object.values(errors)
        .flat()
        .find((value) => typeof value === 'string')

    return first ?? null
}

function appendValue(parameters, value) {
    if (Array.isArray(value)) {
        if (value.length === 0) parameters.set('value', '')
        value.forEach((item) => parameters.append('value[]', String(item)))
        return
    }

    parameters.set('value', String(value ?? ''))
}

function assertHttp(http) {
    if (typeof http?.post !== 'function') {
        throw new TypeError('Inline editor requires Admin.Http.')
    }
}
