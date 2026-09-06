import { expect, it, vi } from 'vitest'

import { createComponentLifecycle } from '../../../../resources/frontend/core/lifecycle/component-lifecycle.js'
import {
    registerVueAppLifecycle,
    vueAppLifecycleName,
} from '../../../../resources/frontend/legacy/vue/app-lifecycle.js'
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
    children.forEach((child) => attach(element, child))
    element.contains = (candidate) =>
        element === candidate || descendants(element).includes(candidate)
    element.querySelectorAll = (selector) =>
        descendants(element).filter((candidate) => candidate.matches(selector))
    element.closest = (selector) => closest(element, selector)

    return element
}

function attach(parent, child) {
    child.parentElement = parent
    if (!parent.children.includes(child)) parent.children.push(child)
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

function fakeAppFactory(events) {
    return vi.fn(() => {
        let host

        return {
            component: vi.fn(),
            mount(element) {
                host = element
                events.push(`mount:${host.id}`)
            },
            unmount() {
                events.push(`unmount:${host.id}`)
            },
        }
    })
}

it('adopts top-level apps and mounts nested islands through the shared lifecycle', () => {
    const nested = createElement('nested-image', true)
    const parent = createElement('related', true, [nested])
    const root = createElement('document', false, [parent])
    const events = []
    const vueApps = createVueAppRegistry(fakeAppFactory(events))
    const components = createComponentLifecycle()

    expect(vueApps.mountAll(root)).toBe(1)
    expect(vueApps.get(nested)).toBeUndefined()
    registerVueAppLifecycle(components, vueApps)
    components.scan(root)

    expect(vueApps.size).toBe(2)
    expect(components.get(parent, vueAppLifecycleName)).toBe(vueApps.get(parent))
    expect(components.get(nested, vueAppLifecycleName)).toBe(vueApps.get(nested))
    expect(events).toEqual(['mount:related', 'mount:nested-image'])
})

it('mounts dynamic nested islands once and destroys children before their parent', () => {
    const parent = createElement('related', true)
    const root = createElement('document', false, [parent])
    const events = []
    const vueApps = createVueAppRegistry(fakeAppFactory(events))
    const components = createComponentLifecycle()
    vueApps.mountAll(root)
    registerVueAppLifecycle(components, vueApps)
    components.scan(root)

    const nested = createElement('dynamic-image', true)
    attach(parent, nested)

    expect(components.scan(parent)).toBe(1)
    expect(components.scan(parent)).toBe(0)
    expect(components.destroy(root)).toBe(2)
    expect(events).toEqual([
        'mount:related',
        'mount:dynamic-image',
        'unmount:dynamic-image',
        'unmount:related',
    ])
    expect(vueApps.size).toBe(0)
})
