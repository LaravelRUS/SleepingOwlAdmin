import {
    collectDropdownToggles,
    dropdownContext,
    dropdownItems,
    findDropdownItem,
    findDropdownToggle,
    isDropdownDisabled,
    isDropdownFormControl,
} from './dropdown-elements.js'
import { dropdownNavigationTarget, DROPDOWN_NAVIGATION_KEYS } from './dropdown-navigation.js'
import { closeDropdown, normalizeDropdown, openDropdown, resetDropdown } from './dropdown-state.js'

const ROOT_EVENT_NAMES = ['click', 'focusin', 'keydown']

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

function assertRoot(root) {
    if (typeof root?.addEventListener !== 'function' || typeof root?.contains !== 'function') {
        throw new TypeError('Dropdowns require a DOM query root.')
    }
}
