const ROOT_EVENT_NAMES = ['click', 'focusin', 'keydown']

export const DROPDOWN_TOGGLE_SELECTOR = '[data-bs-toggle="dropdown"], [data-toggle="dropdown"]'
export const DROPDOWN_CONTAINER_SELECTOR = '.dropdown, .btn-group, .nav-item'
export const DROPDOWN_MENU_SELECTOR = '.dropdown-menu'
export const DROPDOWN_ITEM_SELECTOR = '.dropdown-item, [role="menuitem"], a[href], button'
export const DROPDOWN_NAVIGATION_KEYS = new Set(['ArrowDown', 'ArrowUp', 'End', 'Home'])

export function mountDropdowns(root) {
    assertRoot(root)
    const state = { current: null, root }
    const listeners = bindDropdownListeners(state)
    scanDropdowns(state, root)

    return {
        close: (options) => closeDropdown(state, options),
        destroy: () => destroyDropdowns(state, listeners),
        open: (toggle) => openToggle(state, toggle),
        scan: (container = root) => scanDropdowns(state, container),
        toggle: (toggle) => toggleDropdown(state, toggle),
    }
}

function bindDropdownListeners(state) {
    const listeners = {
        click: (event) => handleDropdownClick(state, event),
        documentClick: (event) => handleDocumentClick(state, event),
        focusin: (event) => handleDropdownFocus(state, event),
        keydown: (event) => handleDropdownKeydown(state, event),
    }
    ROOT_EVENT_NAMES.forEach((name) => state.root.addEventListener(name, listeners[name]))
    state.root.ownerDocument.addEventListener('click', listeners.documentClick)

    return listeners
}

function handleDocumentClick(state, event) {
    if (state.current && !state.root.contains(event.target)) closeDropdown(state)
}

function handleDropdownClick(state, event) {
    const toggle = findDropdownToggle(state.root, event.target)
    if (toggle) return handleToggleClick(state, event, toggle)

    const current = state.current
    if (!current) return
    if (!current.root.contains(event.target)) return closeDropdown(state)
    if (!current.menu.contains(event.target)) return closeDropdown(state)
    if (isDropdownFormControl(current.menu, event.target)) return
    if (findDropdownItem(current.menu, event.target)) closeDropdown(state)
}

function handleToggleClick(state, event, toggle) {
    if (!isPlainPrimaryClick(event) || isDropdownDisabled(toggle)) return false

    event.preventDefault()
    event.stopPropagation()

    return toggleDropdown(state, toggle)
}

function handleDropdownFocus(state, event) {
    const current = state.current
    if (current && !current.root.contains(event.target)) closeDropdown(state)
}

function handleDropdownKeydown(state, event) {
    if (event.key === 'Escape') return handleEscape(state, event)
    if (!DROPDOWN_NAVIGATION_KEYS.has(event.key)) return false

    const context = keyboardContext(state, event.target)
    if (!context) return false
    const items = dropdownItems(context.menu)
    const current = findDropdownItem(context.menu, event.target)
    const target = dropdownNavigationTarget(items, current, event.key)

    event.preventDefault()
    event.stopPropagation()
    openDropdown(state, context)
    target?.focus()

    return true
}

function handleEscape(state, event) {
    const current = state.current
    if (!current || !current.root.contains(event.target)) return false

    event.preventDefault()
    event.stopPropagation()

    return closeDropdown(state, { restoreFocus: true })
}

function keyboardContext(state, target) {
    const toggle = findDropdownToggle(state.root, target)
    if (toggle && !isDropdownDisabled(toggle)) return dropdownContext(toggle)
    if (state.current?.menu.contains(target)) return state.current

    return null
}

function toggleDropdown(state, toggle) {
    const context = dropdownContext(toggle)
    if (!context || isDropdownDisabled(toggle)) return false
    if (state.current?.toggle === toggle) return closeDropdown(state)

    return openDropdown(state, context)
}

function openToggle(state, toggle) {
    const context = dropdownContext(toggle)

    return context && !isDropdownDisabled(toggle) ? openDropdown(state, context) : false
}

function scanDropdowns(state, container) {
    const toggles = collectDropdownToggles(container)
    toggles.forEach((toggle) => {
        const context = dropdownContext(toggle)
        if (context && context.toggle !== state.current?.toggle) normalizeDropdown(context)
    })

    return toggles.length
}

function destroyDropdowns(state, listeners) {
    if (state.current) resetDropdown(state.current)
    state.current = null
    ROOT_EVENT_NAMES.forEach((name) => state.root.removeEventListener(name, listeners[name]))
    state.root.ownerDocument.removeEventListener('click', listeners.documentClick)
}

function isPlainPrimaryClick(event) {
    return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
    )
}

export function findDropdownToggle(root, target) {
    const toggle = target?.closest?.(DROPDOWN_TOGGLE_SELECTOR)

    return toggle && root.contains(toggle) ? toggle : null
}

export function dropdownContext(toggle) {
    const menu = dropdownMenu(toggle)
    if (!menu) return null

    return { menu, root: dropdownRoot(toggle), toggle }
}

export function dropdownItems(menu) {
    return [...menu.querySelectorAll(DROPDOWN_ITEM_SELECTOR)]
        .filter((item) => item.closest(DROPDOWN_MENU_SELECTOR) === menu)
        .filter((item) => !isDropdownDisabled(item))
}

export function findDropdownItem(menu, target) {
    const item = target?.closest?.(DROPDOWN_ITEM_SELECTOR)

    return item && menu.contains(item) && item.closest(DROPDOWN_MENU_SELECTOR) === menu
        ? item
        : null
}

export function collectDropdownToggles(container) {
    const toggles = [...(container.querySelectorAll?.(DROPDOWN_TOGGLE_SELECTOR) ?? [])]
    if (container.matches?.(DROPDOWN_TOGGLE_SELECTOR)) toggles.unshift(container)

    return toggles
}

export function isDropdownDisabled(element) {
    return (
        element.hasAttribute?.('disabled') ||
        element.getAttribute?.('aria-disabled') === 'true' ||
        element.classList?.contains('disabled')
    )
}

export function isDropdownFormControl(menu, target) {
    const control = target?.closest?.(
        'form, input, label, option, select, textarea, [contenteditable]',
    )

    return Boolean(control && menu.contains(control))
}

export function dropdownNavigationTarget(items, current, key) {
    if (items.length === 0 || !DROPDOWN_NAVIGATION_KEYS.has(key)) return null
    if (key === 'Home') return items[0]
    if (key === 'End') return items.at(-1)

    const index = items.indexOf(current)
    if (key === 'ArrowDown') return items[index < 0 ? 0 : (index + 1) % items.length]

    return items[index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length]
}

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

function dropdownMenu(toggle) {
    const target = targetMenu(toggle)
    if (target) return target
    if (toggle.nextElementSibling?.matches(DROPDOWN_MENU_SELECTOR)) {
        return toggle.nextElementSibling
    }

    const root = dropdownRoot(toggle)
    return [...root.querySelectorAll(DROPDOWN_MENU_SELECTOR)].find(
        (menu) => menu.closest(DROPDOWN_CONTAINER_SELECTOR) === root,
    )
}

function dropdownRoot(toggle) {
    return toggle.closest(DROPDOWN_CONTAINER_SELECTOR) ?? toggle.parentElement
}

function targetMenu(toggle) {
    const id = dropdownTargetId(toggle)

    return id ? toggle.ownerDocument.getElementById(id) : null
}

function dropdownTargetId(toggle) {
    const controlled = toggle.getAttribute('aria-controls')?.trim()
    if (controlled) return controlled

    const target = toggle.getAttribute('data-target') ?? toggle.getAttribute('href') ?? ''

    return target.startsWith('#') ? target.slice(1) : ''
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

function assertRoot(root) {
    if (typeof root?.addEventListener !== 'function' || typeof root?.contains !== 'function') {
        throw new TypeError('Dropdowns require a DOM query root.')
    }
}
