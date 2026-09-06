import { expect, it, vi } from 'vitest'

import { delegate, listen } from '../../../../resources/frontend/core/dom/listeners.js'

function createTarget() {
    const listeners = new Map()

    return {
        addEventListener: vi.fn((type, listener) => listeners.set(type, listener)),
        contains: vi.fn(() => true),
        emit(type, event) {
            listeners.get(type)?.(event)
        },
        removeEventListener: vi.fn((type) => listeners.delete(type)),
    }
}

it('listens with native options and returns a cleanup function', () => {
    const target = createTarget()
    const listener = vi.fn()
    const options = { capture: true }
    const stop = listen(target, 'change', listener, options)

    target.emit('change', { value: 1 })
    stop()
    target.emit('change', { value: 2 })

    expect(listener).toHaveBeenCalledOnce()
    expect(target.addEventListener).toHaveBeenCalledWith('change', listener, options)
    expect(target.removeEventListener).toHaveBeenCalledWith('change', listener, options)
})

it('delegates to the closest matching element inside the root', () => {
    const root = createTarget()
    const matched = { id: 'save' }
    const child = { closest: vi.fn(() => matched) }
    const calls = []

    delegate(root, 'click', '[data-action]', function (event, element) {
        calls.push({ context: this, element, event })
    })
    const event = { target: child }
    root.emit('click', event)

    expect(child.closest).toHaveBeenCalledWith('[data-action]')
    expect(root.contains).toHaveBeenCalledWith(matched)
    expect(calls).toEqual([{ context: matched, element: matched, event }])
})

it('ignores delegated matches outside the root', () => {
    const root = createTarget()
    const matched = { id: 'outside' }
    const listener = vi.fn()
    root.contains.mockReturnValue(false)

    delegate(root, 'click', 'button', listener)
    root.emit('click', { target: { closest: () => matched } })

    expect(listener).not.toHaveBeenCalled()
})

it('rejects invalid listener contracts early', () => {
    const target = createTarget()

    expect(() => listen(null, 'click', () => {})).toThrow(TypeError)
    expect(() => listen(target, '', () => {})).toThrow(TypeError)
    expect(() => listen(target, 'click', null)).toThrow(TypeError)
    expect(() => delegate(target, 'click', '', () => {})).toThrow(TypeError)
    expect(() => delegate(new globalThis.EventTarget(), 'click', 'button', () => {})).toThrow(
        TypeError,
    )
})
