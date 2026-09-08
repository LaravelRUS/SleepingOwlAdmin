const INSTALLATION = Symbol.for('sleepingowl.theme.tailwind')

export function installTailwindTheme(target = globalThis) {
    if (target[INSTALLATION]) return target[INSTALLATION]

    const document = target.document
    if (!document) return null

    const toggle = document.getElementById('theme-mode')
    if (!toggle) return null

    const apply = (mode) => applyColorMode(target, toggle, mode)
    const onClick = () => apply(toggle.getAttribute('data-mode') === 'dark' ? 'light' : 'dark')
    toggle.addEventListener('click', onClick)
    apply(readStoredMode(target) ?? toggle.getAttribute('data-mode'))

    const controller = {
        apply,
        destroy() {
            toggle.removeEventListener('click', onClick)
            delete target[INSTALLATION]
        },
    }
    target[INSTALLATION] = controller

    return controller
}

export function applyColorMode(target, toggle, requestedMode) {
    const mode = requestedMode === 'dark' ? 'dark' : 'light'
    const root = target.document.documentElement
    const icon = target.document.getElementById('theme-icon')

    root.dataset.bsTheme = mode
    root.dataset.colorScheme = mode
    toggle.setAttribute('data-mode', mode)
    if (icon) {
        icon.className = mode === 'dark' ? 'fa-regular fa-lightbulb' : 'fa-solid fa-moon'
    }

    writeStoredMode(target, mode)

    return mode
}

function readStoredMode(target) {
    try {
        const value = target.localStorage?.getItem('theme-mode')
        return value === 'dark' || value === 'light' ? value : null
    } catch {
        return null
    }
}

function writeStoredMode(target, mode) {
    try {
        target.localStorage?.setItem('theme-mode', mode)
    } catch {
        // Storage can be unavailable in private or embedded browsing contexts.
    }

    const secure = target.location?.protocol === 'https:' ? '; Secure' : ''
    target.document.cookie = `theme-mode=${mode}; Path=/; SameSite=Lax${secure}`
}
