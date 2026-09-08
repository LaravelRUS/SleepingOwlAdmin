export const DROPDOWN_TOGGLE_SELECTOR = '[data-bs-toggle="dropdown"], [data-toggle="dropdown"]'
export const DROPDOWN_CONTAINER_SELECTOR = '.dropdown, .btn-group, .nav-item'
export const DROPDOWN_MENU_SELECTOR = '.dropdown-menu'
export const DROPDOWN_ITEM_SELECTOR = '.dropdown-item, [role="menuitem"], a[href], button'

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
