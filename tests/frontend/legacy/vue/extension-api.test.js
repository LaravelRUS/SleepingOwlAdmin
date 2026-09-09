import { expect, it, vi } from 'vitest'

import { createVueExtensionApi } from '../../../../resources/js/shared/vue/legacy/extension-api.js'
import { vueAppLifecycleName } from '../../../../resources/js/shared/vue/legacy/app-lifecycle.js'

function dependencies() {
    return {
        catalog: { register: vi.fn((name, component) => component) },
        lifecycle: { destroy: vi.fn(() => 2), scan: vi.fn(() => 1) },
        plugins: { use: vi.fn((plugin) => plugin) },
        root: { id: 'document' },
        runtime: { ref: vi.fn(), version: '3.5.fixture' },
    }
}

it('registers late components and rescans pending hosts', () => {
    const options = dependencies()
    const component = { name: 'CustomStatus' }
    const api = createVueExtensionApi(options)

    expect(api.register('custom-status', component)).toBe(component)
    expect(options.catalog.register).toHaveBeenCalledWith('custom-status', component)
    expect(options.lifecycle.scan).toHaveBeenCalledWith(options.root, vueAppLifecycleName)
})

it('exposes one runtime and delegates plugins and scoped lifecycle calls', () => {
    const options = dependencies()
    const alternateRoot = { id: 'subtree' }
    const plugin = { install: vi.fn() }
    const api = createVueExtensionApi(options)

    expect(api.runtime).toBe(options.runtime)
    expect(api.version).toBe('3.5.fixture')
    expect(api.use(plugin, 'option')).toBe(plugin)
    expect(api.scan(alternateRoot)).toBe(1)
    expect(api.destroy(alternateRoot)).toBe(2)
    expect(options.plugins.use).toHaveBeenCalledWith(plugin, 'option')
    expect(options.lifecycle.scan).toHaveBeenCalledWith(alternateRoot, vueAppLifecycleName)
    expect(options.lifecycle.destroy).toHaveBeenCalledWith(alternateRoot, vueAppLifecycleName)
})

it('validates extension dependencies', () => {
    expect(() => createVueExtensionApi()).toThrow('options must be an object')
    expect(() => createVueExtensionApi({})).toThrow('component catalog must expose register')
})
