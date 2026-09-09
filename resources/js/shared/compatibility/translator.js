export function createTranslator(translations = {}) {
    return (key, parameters) => {
        const value = resolveTranslation(translations, key)

        return replaceParameters(value ?? key, parameters)
    }
}

function resolveTranslation(translations, key) {
    return String(key)
        .split('.')
        .reduce((value, segment) => readSegment(value, segment), translations)
}

function readSegment(value, segment) {
    if (!isRecord(value) || !Object.hasOwn(value, segment)) return undefined

    return value[segment]
}

function replaceParameters(value, parameters = {}) {
    return Object.entries(parameters ?? {})
        .reverse()
        .reduce(
            (translation, [name, replacement]) =>
                translation.replace(`:${name}`, String(replacement)),
            String(value),
        )
}

function isRecord(value) {
    return value !== null && typeof value === 'object'
}
