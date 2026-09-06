import { expect, it, vi } from 'vitest'

import {
    ComponentLifecycle,
    createComponentLifecycle,
} from '../../../../resources/frontend/core/lifecycle/component-lifecycle.js'

function createElement(id, selectors = [], children = []) {
    const element = {
        children,
        id,
        nodeType: 1,
        matches: (selector) => selectors.includes(selector),
        querySelectorAll: (selector) =>
            descendants(element).filter((item) => item.matches(selector)),
    }
    element.contains = (candidate) =>
        element === candidate || descendants(element).includes(candidate)

    return element
}

function descendants(element) {
    return element.children.flatMap((child) => [child, ...descendants(child)])
}

it('scans matching roots and descendants exactly once', () => {
    const child = createElement('child', ['[data-widget]'])
    const root = createElement('root', ['[data-widget]'], [child])
    const mount = vi.fn((element) => ({ id: element.id }))
    const lifecycle = createComponentLifecycle()
    lifecycle.register({ name: 'widget', selector: '[data-widget]', mount })

    expect(lifecycle.scan(root)).toBe(2)
    expect(lifecycle.scan(root)).toBe(0)
    expect(lifecycle.mount(child)).toBe(0)
    expect(mount.mock.calls.map(([element]) => element.id)).toEqual(['root', 'child'])
    expect(lifecycle.get(child, 'widget')).toEqual({ id: 'child' })
})

it('mounts multiple registered component types on one element in registration order', () => {
    const element = createElement('shared', ['.first', '.second'])
    const calls = []
    const lifecycle = new ComponentLifecycle()
    lifecycle.register({ name: 'first', selector: '.first', mount: () => calls.push('first') })
    lifecycle.register({ name: 'second', selector: '.second', mount: () => calls.push('second') })

    expect(lifecycle.mount(element)).toBe(2)
    expect(calls).toEqual(['first', 'second'])
    expect(() => lifecycle.register({ name: 'first', selector: '.other', mount: vi.fn() })).toThrow(
        'already registered',
    )
})

it('destroys a subtree in reverse mount order and allows remounting', () => {
    const child = createElement('child', ['.widget'])
    const root = createElement('root', ['.widget'], [child])
    const destroyed = []
    const lifecycle = createComponentLifecycle()
    lifecycle.register({
        name: 'widget',
        selector: '.widget',
        mount: (element) => () => destroyed.push(element.id),
    })
    lifecycle.scan(root)

    expect(lifecycle.destroy(root)).toBe(2)
    expect(destroyed).toEqual(['child', 'root'])
    expect(lifecycle.destroy(root)).toBe(0)
    expect(lifecycle.scan(root)).toBe(2)
})

it('supports explicit destroy callbacks and unregisters mounted definitions', () => {
    const element = createElement('host', ['.widget'])
    const destroy = vi.fn()
    const lifecycle = createComponentLifecycle()
    const unregister = lifecycle.register({
        destroy,
        mount: () => ({ state: 'mounted' }),
        name: 'widget',
        selector: '.widget',
    })
    lifecycle.mount(element)

    expect(unregister()).toBe(true)
    expect(destroy).toHaveBeenCalledWith(element, { state: 'mounted' })
    expect(lifecycle.mount(element)).toBe(0)
    expect(unregister()).toBe(false)
})

it('attempts every cleanup and clears records when destroy callbacks fail', () => {
    const element = createElement('host', ['.first', '.second'])
    const destroyed = []
    const lifecycle = createComponentLifecycle()
    const names = ['first', 'second']
    names.forEach((name) => {
        lifecycle.register({
            name,
            selector: `.${name}`,
            mount: () => ({
                destroy() {
                    destroyed.push(name)
                    throw new Error(`${name} failed`)
                },
            }),
        })
    })
    lifecycle.mount(element)

    expect(() => lifecycle.destroy(element)).toThrow(AggregateError)
    expect(destroyed).toEqual(['second', 'first'])
    expect(lifecycle.mount(element)).toBe(2)
})

it('untracks before cleanup so re-entrant destroy cannot clean a record twice', () => {
    const element = createElement('host', ['.first', '.second'])
    const destroyed = []
    const lifecycle = createComponentLifecycle()
    lifecycle.register({
        name: 'first',
        selector: '.first',
        mount: () => () => destroyed.push('first'),
    })
    lifecycle.register({
        name: 'second',
        selector: '.second',
        mount: () => () => {
            destroyed.push('second')
            expect(lifecycle.destroy(element)).toBe(1)
        },
    })
    lifecycle.mount(element)

    expect(lifecycle.destroy(element)).toBe(2)
    expect(destroyed).toEqual(['second', 'first'])
    expect(lifecycle.destroy(element)).toBe(0)
})

it('clears failed mounts for retry and diagnoses invalid contracts', () => {
    const element = createElement('host', ['.widget'])
    const mount = vi.fn().mockImplementationOnce(() => {
        throw new Error('mount failed')
    })
    const lifecycle = createComponentLifecycle()
    lifecycle.register({ name: 'widget', selector: '.widget', mount })

    expect(() => lifecycle.mount(element)).toThrow('mount failed')
    expect(lifecycle.mount(element)).toBe(1)
    expect(() => lifecycle.register(null)).toThrow('must be an object')
    expect(() => lifecycle.register({ name: '', selector: '.x', mount })).toThrow(
        'name must be a non-empty string',
    )
    expect(() => lifecycle.scan({})).toThrow('must be a DOM query root')
})
