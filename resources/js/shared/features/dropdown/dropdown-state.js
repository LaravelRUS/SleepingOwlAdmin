export function openDropdown(state, context) {
    if (state.current?.toggle === context.toggle) return false
    if (state.current && !closeDropdown(state)) return false
    if (!dispatchDropdownEvent(context, 'dropdown:show', true)) return false

    state.current = context
    applyDropdownState(context, true)
    dispatchDropdownEvent(context, 'dropdown:shown')

    return true
}

export function closeDropdown(state, options = {}) {
    const context = state.current
    if (!context) return false
    if (!dispatchDropdownEvent(context, 'dropdown:hide', true)) return false

    state.current = null
    applyDropdownState(context, false)
    dispatchDropdownEvent(context, 'dropdown:hidden')
    if (options.restoreFocus) context.toggle.focus?.()

    return true
}

export function normalizeDropdown(context, open = false) {
    context.toggle.setAttribute('aria-haspopup', 'menu')
    context.menu.setAttribute('role', context.menu.getAttribute('role') ?? 'menu')
    applyDropdownState(context, open)
}

export function resetDropdown(context) {
    applyDropdownState(context, false)
}

function applyDropdownState(context, open) {
    context.root.classList.toggle('show', open)
    context.root.classList.toggle('open', open)
    context.menu.classList.toggle('show', open)
    context.menu.hidden = !open
    context.toggle.setAttribute('aria-expanded', String(open))
}

function dispatchDropdownEvent(context, name, cancelable = false) {
    return context.toggle.dispatchEvent(
        new context.toggle.ownerDocument.defaultView.CustomEvent(name, {
            bubbles: true,
            cancelable,
            detail: { menu: context.menu, root: context.root, toggle: context.toggle },
        }),
    )
}
