import { readSelectDependencies } from './select-dependencies.js'
import { initialSelectValue } from './select-values.js'

export function dependentSelectParameters(dependencyIds, document) {
    const parameters = new globalThis.URLSearchParams()
    const dependencies = readSelectDependencies(dependencyIds, document)

    dependencies.forEach((dependency, index) => {
        appendValue(parameters, `depdrop_parents[${index}]`, dependency.value)
        appendValue(parameters, `depdrop_all_params[${dependency.id}]`, dependency.value)
    })

    return parameters
}

export function normalizeDependentSelectResponse(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new TypeError('Dependent select response must be an object.')
    }

    return {
        hasSelected: Object.hasOwn(payload, 'selected'),
        options: normalizeOutput(payload.output),
        selected: payload.selected ?? null,
    }
}

export function dependentSelectValue(options, response, fallback, multiple) {
    const value = response.hasSelected ? response.selected : fallback

    return initialSelectValue(options, value, multiple)
}

function normalizeOutput(output) {
    if (output === null || output === undefined) return []

    const items = Array.isArray(output) ? output : objectValues(output)

    return items.map(normalizeOption)
}

function normalizeOption(item) {
    if (!item || typeof item !== 'object' || !Object.hasOwn(item, 'id')) {
        throw new TypeError('Dependent select option must contain an id.')
    }

    return {
        id: item.id,
        text: String(item.name ?? item.text ?? ''),
    }
}

function objectValues(value) {
    if (value && typeof value === 'object') return Object.values(value)

    throw new TypeError('Dependent select output must be an array or object.')
}

function appendValue(parameters, name, value) {
    if (Array.isArray(value)) {
        value.forEach((item) => parameters.append(`${name}[]`, String(item)))
        return
    }

    parameters.append(name, String(value ?? ''))
}
