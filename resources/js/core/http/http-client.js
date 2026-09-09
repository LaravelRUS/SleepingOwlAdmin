const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export class HttpError extends Error {
    constructor(response) {
        super(httpErrorMessage(response))
        this.name = 'HttpError'
        this.response = response
        this.status = response?.status ?? 0
    }
}

export class HttpClient {
    constructor({ fetch = globalThis.fetch, csrfToken = null } = {}) {
        assertFetch(fetch)
        this.fetch = fetch
        this.csrfToken = csrfToken
    }

    async request(url, options = {}) {
        assertUrl(url)
        assertOptions(options)

        const method = normalizeMethod(options.method)
        const response = await this.fetch(url, {
            ...options,
            credentials: options.credentials ?? 'same-origin',
            headers: requestHeaders(options.headers, method, this.csrfToken),
            method,
        })

        if (!response?.ok) throw new HttpError(response)

        return response
    }

    get(url, options) {
        return this.request(url, { ...options, method: 'GET' })
    }

    post(url, body, options) {
        return this.request(url, { ...options, body, method: 'POST' })
    }

    put(url, body, options) {
        return this.request(url, { ...options, body, method: 'PUT' })
    }

    patch(url, body, options) {
        return this.request(url, { ...options, body, method: 'PATCH' })
    }

    delete(url, options) {
        return this.request(url, { ...options, method: 'DELETE' })
    }
}

export function createHttpClient(options) {
    return new HttpClient(options)
}

function requestHeaders(input, method, csrfToken) {
    const headers = new globalThis.Headers(input)

    setDefaultHeader(headers, 'Accept', 'application/json')
    setDefaultHeader(headers, 'X-Requested-With', 'XMLHttpRequest')
    if (!SAFE_METHODS.has(method) && csrfToken) {
        setDefaultHeader(headers, 'X-CSRF-TOKEN', csrfToken)
    }

    return headers
}

function setDefaultHeader(headers, name, value) {
    if (!headers.has(name)) headers.set(name, value)
}

function normalizeMethod(method = 'GET') {
    if (typeof method !== 'string' || method.length === 0) {
        throw new TypeError('HTTP method must be a non-empty string.')
    }

    return method.toUpperCase()
}

function httpErrorMessage(response) {
    const status = response?.status ?? 0
    const text = response?.statusText ? ` ${response.statusText}` : ''

    return `HTTP request failed with status ${status}${text}.`
}

function assertFetch(fetch) {
    if (typeof fetch !== 'function') {
        throw new TypeError('HTTP client requires a fetch function.')
    }
}

function assertUrl(url) {
    if (typeof url !== 'string' || url.length === 0) {
        throw new TypeError('HTTP request URL must be a non-empty string.')
    }
}

function assertOptions(options) {
    if (!options || typeof options !== 'object' || Array.isArray(options)) {
        throw new TypeError('HTTP request options must be an object.')
    }
}
