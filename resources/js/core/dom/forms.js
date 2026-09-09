export function createPostForm(document, url, parameters = {}) {
    assertDocument(document)
    assertUrl(url)
    assertParameters(parameters)

    const form = document.createElement('form')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', url)

    Object.entries(parameters).forEach(([name, value]) => {
        form.appendChild(createHiddenInput(document, name, value))
    })

    return form
}

export function submitPostForm(document, url, parameters = {}) {
    const form = createPostForm(document, url, parameters)
    document.body.appendChild(form)
    submitForm(form)

    return form
}

export function submitForm(form) {
    if (typeof form?.requestSubmit === 'function') {
        return form.requestSubmit()
    }

    if (typeof form?.submit === 'function') {
        return form.submit()
    }

    throw new TypeError('Form submission requires requestSubmit() or submit().')
}

function createHiddenInput(document, name, value) {
    const input = document.createElement('input')
    input.setAttribute('type', 'hidden')
    input.setAttribute('name', name)
    input.setAttribute('value', String(value))

    return input
}

function assertDocument(document) {
    if (!document?.body || typeof document.createElement !== 'function') {
        throw new TypeError('Form creation requires a document with a body element.')
    }
}

function assertUrl(url) {
    if (typeof url !== 'string' || url.length === 0) {
        throw new TypeError('Form action URL must be a non-empty string.')
    }
}

function assertParameters(parameters) {
    if (!parameters || typeof parameters !== 'object' || Array.isArray(parameters)) {
        throw new TypeError('Form parameters must be an object.')
    }
}
