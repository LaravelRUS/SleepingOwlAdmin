export const SIDEBAR_COLLAPSED = 'sidebar-collapse'
export const SIDEBAR_EXPANDED = 'sidebar-open'
export const SIDEBAR_STORAGE_KEY = 'sidebar-state'

export function readSidebarPreference(storage) {
    try {
        return normalizeSidebarPreference(storage?.getItem?.(SIDEBAR_STORAGE_KEY))
    } catch {
        return null
    }
}

export function writeSidebarPreference(storage, document, value) {
    const preference = normalizeSidebarPreference(value)
    if (!preference) return false

    writeStorage(storage, preference)
    writeCookie(document, preference)

    return true
}

export function normalizeSidebarPreference(value) {
    return [SIDEBAR_COLLAPSED, SIDEBAR_EXPANDED].includes(value) ? value : null
}

function writeStorage(storage, value) {
    try {
        storage?.setItem?.(SIDEBAR_STORAGE_KEY, value)
    } catch {
        // Storage can be unavailable in privacy-restricted browsing contexts.
    }
}

function writeCookie(document, value) {
    if (!document || typeof document.cookie !== 'string') return
    const secure = document.location?.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${SIDEBAR_STORAGE_KEY}=${encodeURIComponent(value)}; Path=/; SameSite=Lax${secure}`
}
