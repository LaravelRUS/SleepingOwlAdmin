const dispatchStates = new WeakMap()

export class AdminEventBus {
    constructor(target = defaultEventTarget()) {
        this.eventTarget = target
        this.subscriptions = new Map()
    }

    on(type, callback, context) {
        assertEventType(type)
        assertCallback(callback)

        const subscription = this.createSubscription(callback, context)
        const subscriptions = this.subscriptions.get(type) ?? []
        subscriptions.push(subscription)
        this.subscriptions.set(type, subscriptions)
        this.eventTarget.addEventListener(type, subscription.listener)
    }

    off(type, callback) {
        if (!type) {
            this.clear()
            return
        }

        const subscriptions = this.subscriptions.get(type) ?? []
        const removed = callback
            ? subscriptions.filter((subscription) => subscription.callback === callback)
            : subscriptions

        this.removeSubscriptions(type, removed)
    }

    fire(type, ...parameters) {
        assertEventType(type)

        const event = createCustomEvent(type, parameters)
        const state = { error: null }
        dispatchStates.set(event, state)

        try {
            this.eventTarget.dispatchEvent(event)
        } finally {
            dispatchStates.delete(event)
        }

        if (state.error) {
            throw state.error
        }
    }

    target() {
        return this.eventTarget
    }

    clear() {
        for (const [type, subscriptions] of this.subscriptions) {
            this.removeSubscriptions(type, subscriptions)
        }
    }

    createSubscription(callback, context) {
        return {
            callback,
            listener: (event) => invokeCallback(event, callback, context),
        }
    }

    removeSubscriptions(type, removed) {
        if (removed.length === 0) {
            return
        }

        for (const subscription of removed) {
            this.eventTarget.removeEventListener(type, subscription.listener)
        }

        const removedSet = new Set(removed)
        const remaining = (this.subscriptions.get(type) ?? []).filter(
            (subscription) => !removedSet.has(subscription),
        )

        if (remaining.length === 0) {
            this.subscriptions.delete(type)
        } else {
            this.subscriptions.set(type, remaining)
        }
    }
}

export function createEventBus(target) {
    return new AdminEventBus(target)
}

function invokeCallback(event, callback, context) {
    const state = dispatchStates.get(event)

    if (state?.error) {
        return
    }

    try {
        callback.apply(context, event.detail)
    } catch (error) {
        if (!state) {
            throw error
        }

        state.error = error
    }
}

function defaultEventTarget() {
    return globalThis.document ?? new globalThis.EventTarget()
}

function createCustomEvent(type, detail) {
    if (typeof globalThis.CustomEvent === 'function') {
        return new globalThis.CustomEvent(type, { detail })
    }

    const event = new globalThis.Event(type)
    Object.defineProperty(event, 'detail', { value: detail })

    return event
}

function assertEventType(type) {
    if (typeof type !== 'string' || type.length === 0) {
        throw new TypeError('Event type must be a non-empty string.')
    }
}

function assertCallback(callback) {
    if (typeof callback !== 'function') {
        throw new TypeError('Event callback must be a function.')
    }
}
