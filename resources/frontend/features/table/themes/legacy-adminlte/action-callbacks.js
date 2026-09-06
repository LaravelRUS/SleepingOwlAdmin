export function createLegacyActionCallbacks(root = globalThis) {
    const jquery = root.jQuery

    if (typeof jquery !== 'function') {
        throw new TypeError('The legacy AdminLTE action callback adapter requires jQuery.')
    }

    return {
        bulk(message, context) {
            invokeNamedCallback(root, message, [
                jquery(context.wrapper),
                jquery(context.checkboxes),
                jquery(context.select),
                message,
            ])
        },
        form(message, context) {
            invokeNamedCallback(root, message, [
                jquery(context.wrapper),
                jquery(context.checkboxes),
            ])
        },
    }
}

function invokeNamedCallback(root, message, parameters) {
    const callback = message.__callback && root[message.__callback]

    if (typeof callback === 'function') {
        callback(...parameters)
    }
}
