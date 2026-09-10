const INSTALLATION = Symbol.for('sleepingowl.theme.shadcn')

export function installTailwindTheme(target = globalThis) {
    if (target[INSTALLATION]) return target[INSTALLATION]

    const document = target.document
    if (!document) return null

    const cards = installTailwindCardControls(document)

    const controller = {
        cards,
        destroy() {
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
        const control = cardControl(event)
        if (!control) return

        const { button, card } = control
        const action = button.getAttribute('data-card-widget')
        if (action === 'collapse') {
            collapseCard(event, button, card)
        }
        if (action === 'maximize') {
            maximizeCard(event, button, card)
        }
    }
    const onKeydown = (event) => {
        if (event.key !== 'Escape') return
        const card = document.querySelector?.('.soa-card-maximized')
        if (!card) return
        card.classList.remove('soa-card-maximized')
        card.querySelector?.('[data-card-widget="maximize"]')?.setAttribute('aria-pressed', 'false')
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

function cardControl(event) {
    const button = event.target?.closest?.('[data-card-widget]')
    const card = button?.closest?.('.soa-card, .card')

    return button && card ? { button, card } : null
}

function collapseCard(event, button, card) {
    const collapsed = card.classList.toggle('collapsed-card')
    button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
    updateCollapseIcon(button, collapsed)
    event.preventDefault()
}

function maximizeCard(event, button, card) {
    const maximized = card.classList.toggle('soa-card-maximized')
    button.setAttribute('aria-pressed', maximized ? 'true' : 'false')
    event.preventDefault()
}

function updateCollapseIcon(button, collapsed) {
    const icon = button.querySelector?.('i')
    if (!icon?.classList) return
    icon.classList.toggle('fa-plus', collapsed)
    icon.classList.toggle('fa-minus', !collapsed)
}
