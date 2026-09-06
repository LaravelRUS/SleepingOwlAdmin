export function tabStateKey(pathname = '/') {
    const normalized = normalizeEditPath(pathname)

    return `Tabbed_${normalized}`
}

export function readTabState(storage, key) {
    if (!storage || !key) return {}

    try {
        const value = JSON.parse(storage.getItem(key) ?? '{}')

        return isRecord(value) ? value : {}
    } catch {
        return {}
    }
}

export function writeTabState(storage, key, state) {
    if (!storage || !key) return false

    try {
        storage.setItem(key, JSON.stringify(state))
        return true
    } catch {
        return false
    }
}

function normalizeEditPath(pathname) {
    const path = typeof pathname === 'string' && pathname ? pathname : '/'

    return path.search('edit') > 0 ? path.replace(/\d+\/edit$/, '') + 'edit' : path
}

function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}
