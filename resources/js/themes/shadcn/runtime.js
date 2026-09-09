const INSTALLATION = Symbol.for('sleepingowl.theme.tailwind')

export function installTailwindTheme(target = globalThis) {
    if (target[INSTALLATION]) return target[INSTALLATION]

    const document = target.document
    if (!document) return null

    const toggle = document.getElementById('theme-mode')
    const cards = installTailwindCardControls(document)
    const apply = (mode) => (toggle ? applyColorMode(target, toggle, mode) : null)
    const onClick = toggle
        ? () => apply(toggle.getAttribute('data-mode') === 'dark' ? 'light' : 'dark')
        : null

    if (toggle) {
        toggle.addEventListener('click', onClick)
        apply(readStoredMode(target) ?? toggle.getAttribute('data-mode'))
    }

    const controller = {
        apply,
        cards,
        destroy() {
            if (toggle) toggle.removeEventListener('click', onClick)
            cards?.destroy()
            delete target[INSTALLATION]
        },
    }
    target[INSTALLATION] = controller

    return controller
}

export function installTailwindCardControls(document) {
    if (typeof document?.addEventListener !== 'function') return null

    const onClick = (event) => {
        const button = event.target?.closest?.('[data-card-widget]')
        const card = button?.closest?.('.soa-card, .card')
        if (!button || !card) return

        const action = button.getAttribute('data-card-widget')
        if (action === 'collapse') {
            const collapsed = card.classList.toggle('collapsed-card')
            button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
            updateCollapseIcon(button, collapsed)
            event.preventDefault()
        }
        if (action === 'maximize') {
            const maximized = card.classList.toggle('soa-card-maximized')
            button.setAttribute('aria-pressed', maximized ? 'true' : 'false')
            event.preventDefault()
        }
    }
    const onKeydown = (event) => {
        if (event.key !== 'Escape') return
        const card = document.querySelector?.('.soa-card-maximized')
        if (!card) return
        card.classList.remove('soa-card-maximized')
        card.querySelector?.('[data-card-widget="maximize"]')?.setAttribute(
            'aria-pressed',
            'false',
        )
    }

    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeydown)

    return {
        destroy() {
            document.removeEventListener('click', onClick)
            document.removeEventListener('keydown', onKeydown)
        },
    }
}

function updateCollapseIcon(button, collapsed) {
    const icon = button.querySelector?.('i')
    if (!icon?.classList) return
    icon.classList.toggle('fa-plus', collapsed)
    icon.classList.toggle('fa-minus', !collapsed)
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
