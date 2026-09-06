export function createEnvValues(source) {
    return Object.entries(source).map(([key, value]) => ({
        key: Array.isArray(source) ? (value.key ?? key) : key,
        value: value.value,
        deletable: Boolean(value.deletable),
        editable: Boolean(value.editable),
    }))
}

export function appendEnvValue(values) {
    values.push({
        key: null,
        value: null,
        deletable: true,
        editable: true,
    })
}

export function removeEnvValue(values, index) {
    if (!values[index]?.deletable) return false

    values.splice(index, 1)

    return true
}
