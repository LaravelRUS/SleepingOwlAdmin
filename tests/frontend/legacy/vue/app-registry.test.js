import { expect, it, vi } from 'vitest'

import {
    createVueAppRegistry,
    vueAppSelector,
} from '../../../../resources/frontend/legacy/vue/app-registry.js'
import { createVueComponentCatalog } from '../../../../resources/frontend/legacy/vue/component-catalog.js'

function createElement(id, marked = false, children = []) {
    const element = {
        children,
        id,
        nodeType: 1,
        parentElement: null,
        matches: (selector) => selector === vueAppSelector && marked,
    }
    children.forEach((child) => {
        child.parentElement = element
    })
    element.contains = (candidate) =>
        element === candidate || descendants(element).includes(candidate)
    element.querySelectorAll = (selector) =>
        descendants(element).filter((candidate) => candidate.matches(selector))
    element.closest = (selector) => closest(element, selector)

    return element
}

function descendants(element) {
    return element.children.flatMap((child) => [child, ...descendants(child)])
}

function closest(element, selector) {
    let candidate = element

    while (candidate) {
        if (candidate.matches(selector)) return candidate
        candidate = candidate.parentElement
    }

    return null
}

function fakeAppFactory(apps) {
    return vi.fn(() => {
        const app = {
            component: vi.fn(),
            mount: vi.fn(),
            unmount: vi.fn(),
        }
        apps.push(app)

        return app
    })
}

it('mounts only top-level marked roots and remains idempotent', () => {
    const nested = createElement('nested', true)
    const parent = createElement('parent', true, [nested])
    const sibling = createElement('sibling', true)
    const root = createElement('root', false, [parent, sibling])
    const apps = []
    const registry = createVueAppRegistry(fakeAppFactory(apps))

    expect(registry.mountAll(root)).toBe(2)
    expect(registry.mountAll(root)).toBe(0)
    expect(registry.size).toBe(2)
    expect(apps.map((app) => app.mount.mock.calls[0][0].id)).toEqual(['parent', 'sibling'])
    expect(registry.get(nested)).toBeUndefined()
})

it('registers the component catalog locally on every app', () => {
    const first = createElement('first', true)
    const second = createElement('second', true)
    const root = createElement('root', false, [first, second])
    const components = { alpha: {}, beta: () => null }
    const apps = []
    const registry = createVueAppRegistry(fakeAppFactory(apps), components)

    registry.mountAll(root)

    apps.forEach((app) => {
        expect(app.component.mock.calls).toEqual([
            ['alpha', components.alpha],
            ['beta', components.beta],
        ])
    })
})

it('mounts a named precompiled component with JSON props', () => {
    const host = createElement('precompiled', true)
    const component = { name: 'PrecompiledFixture' }
    const factory = fakeAppFactory([])
    host.dataset = {
        soaVueComponent: 'fixture',
        soaVueProps: '{"message":"ready","enabled":true}',
    }

    createVueAppRegistry(factory, { fixture: component }).mount(host)

    expect(factory).toHaveBeenCalledWith(component, {
        message: 'ready',
        enabled: true,
    })
})

it('reads large precompiled props from a referenced JSON script', () => {
    const host = createElement('precompiled', true)
    const component = { name: 'PrecompiledFixture' }
    const factory = fakeAppFactory([])
    const script = {
        tagName: 'SCRIPT',
        textContent: '{"html":"<fieldset>Trusted fields</fieldset>"}',
        type: 'application/json',
    }
    host.dataset = { soaVueComponent: 'fixture', soaVuePropsId: 'fixture-props' }
    host.ownerDocument = { getElementById: vi.fn(() => script) }

    createVueAppRegistry(factory, { fixture: component }).mount(host)

    expect(host.ownerDocument.getElementById).toHaveBeenCalledWith('fixture-props')
    expect(factory).toHaveBeenCalledWith(component, {
        html: '<fieldset>Trusted fields</fieldset>',
    })
})

it('rejects missing and incorrectly typed referenced props scripts', () => {
    const registry = createVueAppRegistry(fakeAppFactory([]), { fixture: {} })
    const host = createElement('precompiled', true)
    host.dataset = { soaVueComponent: 'fixture', soaVuePropsId: 'fixture-props' }
    host.ownerDocument = { getElementById: vi.fn(() => null) }

    expect(() => registry.mount(host)).toThrow('props script [fixture-props] was not found')

    host.ownerDocument.getElementById = vi.fn(() => ({
        tagName: 'DIV',
        textContent: '{}',
        type: 'application/json',
    }))
    expect(() => registry.mount(host)).toThrow('must reference an application/json script')
})

it('rejects unknown precompiled components and invalid props before creating an app', () => {
    const factory = fakeAppFactory([])
    const registry = createVueAppRegistry(factory, { fixture: {} })
    const unknown = createElement('unknown', true)
    unknown.dataset = { soaVueComponent: 'missing' }
    const invalid = createElement('invalid', true)
    invalid.dataset = { soaVueComponent: 'fixture', soaVueProps: '[]' }

    expect(() => registry.mount(unknown)).toThrow('Unknown Vue app component [missing]')
    expect(() => registry.mount(invalid)).toThrow('props JSON must contain an object')
    expect(factory).not.toHaveBeenCalled()
})

it('observes components registered after the app registry is created', () => {
    const component = { name: 'LateComponent' }
    const host = createElement('late', true)
    const factory = fakeAppFactory([])
    const catalog = createVueComponentCatalog()
    const registry = createVueAppRegistry(factory, catalog)
    host.dataset = { soaVueComponent: 'late-component' }

    expect(registry.canMount(host)).toBe(false)
    expect(() => registry.mount(host)).toThrow('Unknown Vue app component [late-component]')

    catalog.register('late-component', component)
    expect(registry.canMount(host)).toBe(true)
    registry.mount(host)
    expect(factory).toHaveBeenCalledWith(component, {})
})

it('unmounts a subtree once and allows a later remount', () => {
    const first = createElement('first', true)
    const second = createElement('second', true)
    const root = createElement('root', false, [first, second])
    const apps = []
    const registry = createVueAppRegistry(fakeAppFactory(apps))
    registry.mountAll(root)

    expect(registry.unmountAll(first)).toBe(1)
    expect(apps[0].unmount).toHaveBeenCalledOnce()
    expect(registry.unmount(first)).toBe(false)
    expect(registry.mount(first)).toBe(apps[2])
    expect(registry.size).toBe(2)
})

it('returns the same app during a re-entrant mount', () => {
    const host = createElement('host', true)
    let registry
    const app = {
        component: vi.fn(),
        mount: vi.fn(() => expect(registry.mount(host)).toBe(app)),
        unmount: vi.fn(),
    }
    const factory = vi.fn(() => app)
    registry = createVueAppRegistry(factory)

    expect(registry.mount(host)).toBe(app)
    expect(factory).toHaveBeenCalledOnce()
    expect(app.mount).toHaveBeenCalledOnce()
    expect(registry.size).toBe(1)
})

it('does not retain an app whose mount fails', () => {
    const host = createElement('host', true)
    const registry = createVueAppRegistry(() => ({
        component: vi.fn(),
        mount: () => {
            throw new Error('mount failed')
        },
        unmount: vi.fn(),
    }))

    expect(() => registry.mount(host)).toThrow('mount failed')
    expect(registry.get(host)).toBeUndefined()
    expect(registry.size).toBe(0)
})

it('validates factories, roots, elements and returned apps', () => {
    expect(() => createVueAppRegistry(null)).toThrow('createApp must be a function')

    const invalid = createVueAppRegistry(() => ({}))
    expect(() => invalid.mount(createElement('host', true))).toThrow(
        'Vue app component registration must be a function',
    )
    expect(invalid.size).toBe(0)

    const registry = createVueAppRegistry(() => ({
        component: vi.fn(),
        mount: vi.fn(),
        unmount: vi.fn(),
    }))
    expect(() => registry.mount(null)).toThrow('requires an Element')
    expect(() => registry.mountAll({})).toThrow('must be a DOM query root')
})

it('validates component catalogs before creating an app', () => {
    const factory = fakeAppFactory([])

    expect(() => createVueAppRegistry(factory, [])).toThrow('must be an object')
    expect(() => createVueAppRegistry(factory, { '': {} })).toThrow('require a name and definition')
    expect(() => createVueAppRegistry(factory, { invalid: null })).toThrow(
        'require a name and definition',
    )
    expect(factory).not.toHaveBeenCalled()
})
