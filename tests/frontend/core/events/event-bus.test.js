import { expect, it, vi } from 'vitest'

import {
    AdminEventBus,
    createEventBus,
} from '../../../../resources/frontend/core/events/event-bus.js'

it('preserves positional arguments, registration order, duplicates, and callback context', () => {
    const events = createEventBus(new globalThis.EventTarget())
    const context = { name: 'context' }
    const calls = []
    const callback = function (...parameters) {
        calls.push([this, ...parameters])
    }

    events.on('table::draw', callback, context)
    events.on('table::draw', callback, context)
    events.fire('table::draw', 'table-1', { page: 2 })

    expect(calls).toEqual([
        [context, 'table-1', { page: 2 }],
        [context, 'table-1', { page: 2 }],
    ])
})

it('supports removing one callback, one event type, or all subscriptions', () => {
    const events = createEventBus(new globalThis.EventTarget())
    const first = vi.fn()
    const second = vi.fn()

    events.on('first', first)
    events.on('first', second)
    events.on('second', second)
    events.off('first', first)
    events.fire('first')

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)

    events.off('first')
    events.fire('first')
    events.off()
    events.fire('second')

    expect(second).toHaveBeenCalledTimes(1)
})

it('dispatches a native event with the compatibility arguments in detail', () => {
    const target = new globalThis.EventTarget()
    const events = new AdminEventBus(target)
    const listener = vi.fn()
    target.addEventListener('table::loaded', listener)

    events.fire('table::loaded', 'orders', 42)

    expect(events.target()).toBe(target)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0]).toBeInstanceOf(globalThis.Event)
    expect(listener.mock.calls[0][0].detail).toEqual(['orders', 42])
})

it('propagates the first compatibility callback error and stops later callbacks', () => {
    const events = createEventBus(new globalThis.EventTarget())
    const later = vi.fn()

    events.on('broken', () => {
        throw new Error('listener failed')
    })
    events.on('broken', later)

    expect(() => events.fire('broken')).toThrow('listener failed')
    expect(later).not.toHaveBeenCalled()
})

it('rejects invalid event registrations early', () => {
    const events = createEventBus(new globalThis.EventTarget())

    expect(() => events.on('', () => {})).toThrow(TypeError)
    expect(() => events.on('valid', null)).toThrow(TypeError)
    expect(() => events.fire(null)).toThrow(TypeError)
})
