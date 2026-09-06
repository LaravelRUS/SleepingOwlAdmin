import { expect, it } from 'vitest'

import {
    dropdownItems,
    findDropdownToggle,
    isDropdownDisabled,
} from '../../../../resources/frontend/features/dropdown/dropdown-elements.js'

it('resolves a nested dropdown toggle inside the delegated root', () => {
    const toggle = {}
    const nested = { closest: () => toggle }
    const root = { contains: (candidate) => candidate === toggle }

    expect(findDropdownToggle(root, nested)).toBe(toggle)
})

it('keeps enabled items in the current menu and excludes disabled items', () => {
    const menu = {}
    const enabled = item(menu)
    const nested = item({})
    const disabled = item(menu, { disabled: true })
    menu.querySelectorAll = () => [enabled, nested, disabled]

    expect(dropdownItems(menu)).toEqual([enabled])
})

it('recognizes native, ARIA and legacy disabled states', () => {
    expect(isDropdownDisabled(item(null, { disabled: true }))).toBe(true)
    expect(isDropdownDisabled(item(null, { ariaDisabled: 'true' }))).toBe(true)
    expect(isDropdownDisabled(item(null, { classDisabled: true }))).toBe(true)
    expect(isDropdownDisabled(item(null))).toBe(false)
})

function item(menu, options = {}) {
    return {
        classList: { contains: () => options.classDisabled === true },
        closest: () => menu,
        getAttribute: (name) => (name === 'aria-disabled' ? (options.ariaDisabled ?? null) : null),
        hasAttribute: (name) => name === 'disabled' && options.disabled === true,
    }
}
