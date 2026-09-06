import { expect, it, vi } from 'vitest'

import { createVueAppPlugins } from '../../../../resources/frontend/legacy/vue/app-plugins.js'

function fakeApp() {
    return { use: vi.fn() }
}

it('installs every registered plugin once on each new app', () => {
    const first = { install: vi.fn() }
    const second = vi.fn()
    const plugins = createVueAppPlugins()
    const apps = [fakeApp(), fakeApp()]

    expect(plugins.use(first, { locale: 'uk' })).toBe(first)
    plugins.use(first, { locale: 'ignored-duplicate' })
    plugins.use(second)
    apps.forEach((app) => plugins.install(app))

    apps.forEach((app) => {
        expect(app.use.mock.calls).toEqual([[first, { locale: 'uk' }], [second]])
    })
})

it('diagnoses invalid plugins and app contracts', () => {
    const plugins = createVueAppPlugins()

    expect(() => plugins.use({})).toThrow('must be a function or expose install')
    expect(() => plugins.install({})).toThrow('requires app.use')
})
