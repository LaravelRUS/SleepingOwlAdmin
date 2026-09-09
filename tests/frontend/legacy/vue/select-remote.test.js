import { afterEach, expect, it, vi } from 'vitest'

import {
    mergeRemoteSelectOptions,
    normalizeRemoteSelectOptions,
} from '../../../../resources/js/shared/legacy/admin/form/select-remote-options.js'
import {
    createRemoteSelectSearch,
    remoteSelectParameters,
} from '../../../../resources/js/shared/legacy/admin/form/select-remote-search.js'

afterEach(() => vi.useRealTimers())

it('normalizes legacy server labels as escaped Vue text values', () => {
    expect(
        normalizeRemoteSelectOptions([
            { custom_name: '<strong>Aurora</strong>', id: 1, tag_name: 'Ignored' },
            { custom_name: null, id: 'b', tag_name: 'Borealis' },
        ]),
    ).toEqual([
        { id: 1, text: '<strong>Aurora</strong>' },
        { id: 'b', text: 'Borealis' },
    ])
})

it('keeps current selections while replacing remote results', () => {
    const selected = { id: 1, text: 'Current' }
    const results = [
        { id: '1', text: 'Duplicate' },
        { id: 2, text: 'New' },
    ]

    expect(mergeRemoteSelectOptions(selected, results, false)).toEqual([
        selected,
        { id: 2, text: 'New' },
    ])
})

it('debounces searches, ignores short input and posts the legacy endpoint payload', async () => {
    vi.useFakeTimers()
    const http = {
        post: vi.fn(async () => ({ json: async () => [{ id: 2, tag_name: 'Borealis' }] })),
    }
    const onLoading = vi.fn()
    const onResults = vi.fn()
    const document = dependencyDocument()
    const search = createRemoteSelectSearch({
        delay: 25,
        dependencies: ['country'],
        document,
        http,
        minSymbols: 3,
        onLoading,
        onResults,
        url: '/select-search',
    })

    expect(search.search('ab')).toBe(false)
    expect(search.search('first')).toBe(true)
    expect(search.search('second')).toBe(true)
    await vi.advanceTimersByTimeAsync(25)

    expect(http.post).toHaveBeenCalledTimes(1)
    const [url, body, options] = http.post.mock.calls[0]
    expect(url).toBe('/select-search')
    expect(body.get('q')).toBe('second')
    expect(body.get('page')).toBe('1')
    expect(body.get('depdrop_all_params[country]')).toBe('fr')
    expect(options.signal.constructor.name).toBe('AbortSignal')
    expect(onResults).toHaveBeenCalledWith([{ id: 2, text: 'Borealis' }])
    expect(onLoading).toHaveBeenLastCalledWith(false)
})

it('reports transport errors and cancels delayed work during destroy', async () => {
    vi.useFakeTimers()
    const error = new Error('Unavailable')
    const onError = vi.fn()
    const onLoading = vi.fn()
    const search = createRemoteSelectSearch({
        delay: 10,
        document: dependencyDocument(),
        http: { post: vi.fn().mockRejectedValue(error) },
        onError,
        onLoading,
        url: '/select-search',
    })

    search.search('failure')
    await vi.advanceTimersByTimeAsync(10)
    expect(onError).toHaveBeenCalledWith(error)
    expect(onLoading).toHaveBeenLastCalledWith(false)

    search.search('cancelled')
    search.destroy()
    await vi.runAllTimersAsync()
    expect(onError).toHaveBeenCalledTimes(1)
})

it('builds a request without dependency fields when none are configured', () => {
    const parameters = remoteSelectParameters('query', [], dependencyDocument())

    expect(Object.fromEntries(parameters)).toEqual({ page: '1', q: 'query' })
})

function dependencyDocument() {
    return {
        getElementById: (id) => (id === 'country' ? { value: 'fr' } : null),
        querySelectorAll: () => [],
    }
}
