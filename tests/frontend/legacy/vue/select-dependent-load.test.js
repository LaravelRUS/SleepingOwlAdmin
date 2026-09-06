import { describe, expect, it, vi } from 'vitest'

import { createDependentSelectLoad } from '../../../../resources/assets/js_owl/admin/form/select-dependent-load.js'

describe('dependent select load controller', () => {
    it('loads on demand, reports lifecycle in order and removes listeners', async () => {
        const fixture = loadFixture()
        const { calls, country, http, loader } = fixture

        expect(http.post).not.toHaveBeenCalled()
        await loader.load('country')

        expect(http.post).toHaveBeenCalledTimes(1)
        expectLoadPayload(http)
        expectLoadCalls(calls)

        loader.destroy()
        country.change()
        await Promise.resolve()
        expect(http.post).toHaveBeenCalledTimes(1)
        expect(calls.at(-1)).toEqual(['loading', false])
    })

    it('loads immediately by default and reports non-abort errors', async () => {
        const onError = vi.fn()
        const onAfter = vi.fn()
        const http = { post: vi.fn(async () => Promise.reject(new Error('Unavailable'))) }

        createDependentSelectLoad({
            dependencies: [],
            document: dependencyDocument({}),
            http,
            onAfter,
            onError,
            url: '/dependent/cities',
        })

        await vi.waitFor(() => expect(onError).toHaveBeenCalledOnce())
        expect(onAfter).toHaveBeenCalledOnce()
    })
})

describe('superseded dependent loads', () => {
    it('aborts the previous request and ignores its late response', async () => {
        const country = dependencyControl('fr')
        const pending = [deferredResponse(), deferredResponse()]
        const onResults = vi.fn()
        const http = {
            post: vi.fn(() => pending[http.post.mock.calls.length - 1].promise),
        }
        const loader = createDependentSelectLoad({
            dependencies: ['country'],
            document: dependencyDocument({ country }),
            http,
            initialize: false,
            onResults,
            url: '/dependent/cities',
        })

        const first = loader.load('country')
        const firstSignal = http.post.mock.calls[0][2].signal
        country.value = 'de'
        const second = loader.load('country')

        expect(firstSignal.aborted).toBe(true)
        pending[0].resolve({ output: [{ id: 'paris', name: 'Paris' }] })
        pending[1].resolve({ output: [{ id: 'berlin', name: 'Berlin' }] })
        await Promise.all([first, second])

        expect(onResults).toHaveBeenCalledOnce()
        expect(onResults.mock.calls[0][0].options).toEqual([{ id: 'berlin', text: 'Berlin' }])
    })
})

function loadFixture() {
    const country = dependencyControl('fr')
    const calls = []
    const http = {
        post: vi.fn(async () => response({ output: [{ id: 'paris', name: 'Paris' }] })),
    }
    const loader = createDependentSelectLoad({
        dependencies: ['country'],
        document: dependencyDocument({ country }),
        http,
        initialize: false,
        onAfter: (context) => calls.push(['after', context]),
        onBefore: (context) => calls.push(['before', context]),
        onInit: () => calls.push(['init']),
        onLoading: (value) => calls.push(['loading', value]),
        onResults: (result) => calls.push(['results', result.options]),
        url: '/dependent/cities',
    })

    return { calls, country, http, loader }
}

function expectLoadPayload(http) {
    expect([...http.post.mock.calls[0][1].entries()]).toEqual([
        ['depdrop_parents[0]', 'fr'],
        ['depdrop_all_params[country]', 'fr'],
    ])
}

function expectLoadCalls(calls) {
    expect(calls).toEqual([
        ['init'],
        ['before', { dependencyId: 'country', dependencyValue: 'fr' }],
        ['loading', true],
        ['results', [{ id: 'paris', text: 'Paris' }]],
        ['loading', false],
        ['after', { dependencyId: 'country', dependencyValue: 'fr' }],
    ])
}

function dependencyControl(value) {
    let listener = null

    return {
        addEventListener: (_name, callback) => {
            listener = callback
        },
        change: () => listener?.(),
        removeEventListener: () => {
            listener = null
        },
        type: 'text',
        value,
    }
}

function dependencyDocument(controls) {
    return {
        getElementById: (id) => controls[id] ?? null,
        querySelectorAll: () => [],
    }
}

function response(payload) {
    return { json: async () => payload }
}

function deferredResponse() {
    let resolve
    const promise = new Promise((done) => {
        resolve = (payload) => done(response(payload))
    })

    return { promise, resolve }
}
