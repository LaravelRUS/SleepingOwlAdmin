export function createNamedActionCallbacks(root = globalThis) {
    return {
        bulk(message, context) {
            invokeNamedCallback(root, message, [
                context.wrapper,
                context.checkboxes,
                context.select,
                message,
            ])
        },
        form(message, context) {
            invokeNamedCallback(root, message, [context.wrapper, context.checkboxes])
        },
    }
}

function invokeNamedCallback(root, message, parameters) {
    const callback = message.__callback && root[message.__callback]

    if (typeof callback === 'function') {
        callback(...parameters)
    }
}
