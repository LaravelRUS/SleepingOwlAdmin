export function readTableDefinition(element) {
    assertElement(element)

    return {
        id: element.dataset.id,
        method: element.dataset.method || 'GET',
        options: parseOptions(element.dataset.attributes),
        payload: parsePayload(element.dataset.payload),
        showLength: parseFlag(element.dataset.displayDtlength),
        showSearch: parseFlag(element.dataset.displaySearch),
        url: element.dataset.url || null,
    }
}

export function applyServerOptions(options, definition) {
    if (!definition.url) {
        return options
    }

    return {
        ...options,
        processing: true,
        serverSide: true,
        sDom: tableDomLayout(definition),
    }
}

export function tableDomLayout({ showLength, showSearch }) {
    const controls = `${showLength ? 'l' : ''}${showSearch ? 'f' : ''}`

    return `<"H"${controls}r>t<"F"ip>`
}

function parseOptions(source) {
    const options = parseJson(source, {})

    if (!options || Array.isArray(options) || typeof options !== 'object') {
        throw new TypeError('Table data-attributes must contain a JSON object.')
    }

    return options
}

function parsePayload(source) {
    if (source === undefined) {
        return undefined
    }

    try {
        return JSON.parse(source)
    } catch {
        return source
    }
}

function parseJson(source, fallback) {
    if (source === undefined || source === '') {
        return fallback
    }

    try {
        return JSON.parse(source)
    } catch (error) {
        throw new TypeError('Table data-attributes must contain valid JSON.', { cause: error })
    }
}

function parseFlag(value) {
    return value === '1' || value === 'true' || value === true || value === 1
}

function assertElement(element) {
    if (!element || element.nodeType !== 1 || !element.dataset) {
        throw new TypeError('Table definition requires a DOM Element with dataset support.')
    }
}
