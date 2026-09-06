export function readTreeConfig(element) {
    assertElement(element)

    return Object.freeze({
        maxDepth: positiveInteger(element.dataset.maxDepth, 20),
        parameters: readParameters(element),
        reorderable: element.dataset.reorderable !== 'false',
        url: requiredString(element.dataset.url, 'url'),
    })
}

function readParameters(element) {
    const id = element.dataset.soaTreeParametersId
    const source = id ? referencedParameters(element, id) : element.dataset.parameters
    if (!source) return {}

    const parameters = JSON.parse(source)
    if (!parameters || typeof parameters !== 'object') {
        throw new TypeError('Tree parameters must contain an object or array.')
    }

    return parameters
}

function referencedParameters(element, id) {
    const script = element.ownerDocument?.getElementById(id)
    if (!script) throw new Error(`Tree parameters [${id}] were not found.`)
    if (script.tagName !== 'SCRIPT' || script.type !== 'application/json') {
        throw new TypeError(`Tree parameters [${id}] must reference application/json.`)
    }

    return script.textContent
}

function positiveInteger(value, fallback) {
    const number = Number.parseInt(value, 10)

    return Number.isInteger(number) && number > 0 ? number : fallback
}

function requiredString(value, field) {
    if (typeof value !== 'string' || value.length === 0) {
        throw new TypeError(`Tree requires ${field}.`)
    }

    return value
}

function assertElement(element) {
    if (!element || element.nodeType !== 1 || !element.dataset) {
        throw new TypeError('Tree configuration requires a DOM Element.')
    }
}
