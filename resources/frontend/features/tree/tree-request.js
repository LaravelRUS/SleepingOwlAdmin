export async function submitTreeOrder(http, config, data) {
    assertHttp(http)

    return http.post(config.url, treeRequestParameters(data, config.parameters), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    })
}

export function treeRequestParameters(data, parameters = {}) {
    const output = new globalThis.URLSearchParams()
    appendParameter(output, 'data', data)
    appendParameter(output, 'parameters', parameters)

    return output
}

function appendParameter(output, key, value) {
    if (Array.isArray(value)) {
        value.forEach((item, index) => appendParameter(output, `${key}[${index}]`, item))
        return
    }

    if (value && typeof value === 'object') {
        Object.entries(value).forEach(([name, item]) => {
            appendParameter(output, `${key}[${name}]`, item)
        })
        return
    }

    output.append(key, String(value ?? ''))
}

function assertHttp(http) {
    if (typeof http?.post !== 'function') {
        throw new TypeError('Tree reorder requires Admin.Http.')
    }
}
