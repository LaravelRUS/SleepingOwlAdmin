export function readSelectDependencies(ids, document = globalThis.document) {
    assertDocument(document)

    return normalizeIds(ids).map((id) => ({
        id,
        value: readControlValue(document, id),
    }))
}

export function appendSelectDependencies(parameters, dependencies) {
    if (!dependencies.length) return parameters

    parameters.set('depends', JSON.stringify(dependencies.map(({ id }) => id)))
    dependencies.forEach(({ id, value }, index) => {
        appendValue(parameters, `depdrop_parents[${index}]`, value)
        appendValue(parameters, `depdrop_all_params[${id}]`, value)
    })

    return parameters
}

function readControlValue(document, id) {
    const control = document.getElementById(id)
    if (!control) return ''
    if (control.type === 'radio') return checkedRadioValue(document, control)
    if (control.type === 'checkbox') return control.checked
    if (control.multiple) return [...control.selectedOptions].map(({ value }) => value)

    return control.value ?? ''
}

function checkedRadioValue(document, control) {
    const checked = [...document.querySelectorAll('input[type="radio"]')].find(
        (candidate) => candidate.name === control.name && candidate.checked,
    )

    return checked?.value ?? ''
}

function appendValue(parameters, name, value) {
    if (Array.isArray(value)) {
        value.forEach((item) => parameters.append(`${name}[]`, String(item)))
        return
    }

    parameters.append(name, String(value ?? ''))
}

function normalizeIds(ids) {
    return Array.isArray(ids)
        ? ids.filter((id) => typeof id === 'string' && id.length > 0)
        : []
}

function assertDocument(document) {
    if (typeof document?.getElementById !== 'function') {
        throw new TypeError('Select dependencies require a document.')
    }
}
