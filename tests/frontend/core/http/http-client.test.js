import { describe, expect, it, vi } from 'vitest'

import { readCsrfToken } from '../../../../resources/js/core/http/csrf-token.js'
import {
    createHttpClient,
    HttpError,
} from '../../../../resources/js/core/http/http-client.js'

function response({ ok = true, status = 200, statusText = 'OK' } = {}) {
    return { ok, status, statusText }
}

describe('HTTP request defaults', () => {
    it('reads CSRF metadata and adds native request defaults to mutations', async () => {
        const fetch = vi.fn(async () => response())
        const client = createHttpClient({ fetch, csrfToken: 'csrf-value' })

        await client.post('/orders', 'payload', {
            headers: { 'Content-Type': 'text/plain', 'X-Requested-With': 'Custom' },
        })

        const [url, options] = fetch.mock.calls[0]
        expect(url).toBe('/orders')
        expect(options).toMatchObject({
            body: 'payload',
            credentials: 'same-origin',
            method: 'POST',
        })
        expect(Object.fromEntries(options.headers)).toMatchObject({
            accept: 'application/json',
            'content-type': 'text/plain',
            'x-csrf-token': 'csrf-value',
            'x-requested-with': 'Custom',
        })
        expect(
            readCsrfToken({
                querySelector: () => ({ getAttribute: () => 'meta-token' }),
            }),
        ).toBe('meta-token')
    })

    it('omits CSRF from safe methods and preserves caller credentials', async () => {
        const fetch = vi.fn(async () => response())
        const client = createHttpClient({ fetch, csrfToken: 'csrf-value' })

        await client.get('/orders', { credentials: 'include' })

        const options = fetch.mock.calls[0][1]
        expect(options.credentials).toBe('include')
        expect(options.headers.has('X-CSRF-TOKEN')).toBe(false)
    })
})

describe('HTTP failures', () => {
    it('throws a typed error with the original unsuccessful response', async () => {
        const failed = response({ ok: false, status: 422, statusText: 'Unprocessable Content' })
        const client = createHttpClient({ fetch: vi.fn(async () => failed) })

        await expect(client.patch('/orders/1', 'payload')).rejects.toMatchObject({
            name: 'HttpError',
            response: failed,
            status: 422,
        })
        await expect(client.delete('/orders/1')).rejects.toBeInstanceOf(HttpError)
    })
})
