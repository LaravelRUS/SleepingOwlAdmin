import { expect, it, vi } from 'vitest'

import {
    createVueAppRegistry,
    vueAppSelector,
} from '../../../../resources/frontend/legacy/vue/app-registry.js'

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
        'Vue app mount must be a function',
    )
    expect(invalid.size).toBe(0)

    const registry = createVueAppRegistry(() => ({ mount: vi.fn(), unmount: vi.fn() }))
    expect(() => registry.mount(null)).toThrow('requires an Element')
    expect(() => registry.mountAll({})).toThrow('must be a DOM query root')
})
