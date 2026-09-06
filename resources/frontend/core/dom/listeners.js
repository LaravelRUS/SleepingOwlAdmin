export function listen(target, type, listener, options) {
    assertEventTarget(target)
    assertEventType(type)
    assertListener(listener)

    target.addEventListener(type, listener, options)

    return () => target.removeEventListener(type, listener, options)
}

export function delegate(root, type, selector, listener, options) {
    assertDelegationRoot(root)
    assertSelector(selector)
    assertListener(listener)

    return listen(root, type, (event) => invokeDelegate(event, root, selector, listener), options)
}

function invokeDelegate(event, root, selector, listener) {
    const matched = findDelegateTarget(event.target, root, selector)

    if (matched) {
        listener.call(matched, event, matched)
    }
}

function findDelegateTarget(target, root, selector) {
    const element = closestElement(target)
    const matched = element?.closest(selector)

    return matched && root.contains(matched) ? matched : null
}

function closestElement(target) {
    if (typeof target?.closest === 'function') {
        return target
    }

    return target?.parentElement ?? null
}

function assertEventTarget(target) {
    if (
        typeof target?.addEventListener !== 'function' ||
        typeof target?.removeEventListener !== 'function'
    ) {
        throw new TypeError('Event target must support addEventListener and removeEventListener.')
    }
}

function assertDelegationRoot(root) {
    assertEventTarget(root)

    if (typeof root.contains !== 'function') {
        throw new TypeError('Delegation root must support contains().')
    }
}

function assertEventType(type) {
    if (typeof type !== 'string' || type.length === 0) {
        throw new TypeError('Event type must be a non-empty string.')
    }
}

function assertSelector(selector) {
    if (typeof selector !== 'string' || selector.length === 0) {
        throw new TypeError('Delegated selector must be a non-empty string.')
    }
}

function assertListener(listener) {
    if (typeof listener !== 'function') {
        throw new TypeError('Event listener must be a function.')
    }
}
