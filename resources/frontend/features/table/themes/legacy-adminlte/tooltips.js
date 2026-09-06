export function createLegacyTableTooltips(root = globalThis) {
    const jquery = root.jQuery

    if (typeof jquery?.fn?.tooltip !== 'function') {
        throw new TypeError('The legacy AdminLTE table tooltip adapter requires Bootstrap tooltip.')
    }

    return {
        scan(container) {
            const elements = matchingElements(container, '[data-toggle="tooltip"]')

            if (elements.length > 0) {
                jquery(elements).tooltip()
            }

            return elements.length
        },
    }
}

function matchingElements(root, selector) {
    const elements = [...root.querySelectorAll(selector)]
    if (typeof root.matches === 'function' && root.matches(selector)) {
        elements.unshift(root)
    }

    return elements
}
