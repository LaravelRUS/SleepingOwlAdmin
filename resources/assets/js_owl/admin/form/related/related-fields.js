export function appendRelatedIndex(value, index) {
    if (typeof value !== 'string' || value.length === 0 || /_\d+$/.test(value)) return value

    return `${value}_${index}`
}

export function createRelatedName(relation, index, value) {
    if (typeof value !== 'string' || value.length === 0) return value
    if (value.startsWith(`${relation}[`)) return value

    const arraySuffix = value.endsWith('[]') ? '[]' : ''
    const field = arraySuffix ? value.slice(0, -2) : value

    return `${relation}[new_${index}][${field}]${arraySuffix}`
}

export function rewriteRelatedIslandProps(props, context) {
    const rewritten = { ...props }
    if (context.isNew && typeof props.name === 'string') {
        rewritten.name = createRelatedName(context.name, context.index, props.name)
    }
    if (isAttributes(props.attributes)) {
        rewritten.attributes = rewriteAttributes(props.attributes, context)
    }

    return rewritten
}

function rewriteAttributes(attributes, context) {
    const rewritten = { ...attributes }
    if (typeof attributes.id === 'string') {
        rewritten.id = appendRelatedIndex(attributes.id, context.index)
    }
    if (context.isNew && typeof attributes.name === 'string') {
        rewritten.name = createRelatedName(context.name, context.index, attributes.name)
    }

    return rewritten
}

function isAttributes(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}
