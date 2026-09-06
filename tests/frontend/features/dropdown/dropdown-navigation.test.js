import { expect, it } from 'vitest'

import { dropdownNavigationTarget } from '../../../../resources/frontend/features/dropdown/dropdown-navigation.js'

it('wraps arrow navigation in both directions', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }]

    expect(dropdownNavigationTarget(items, items[2], 'ArrowDown')).toBe(items[0])
    expect(dropdownNavigationTarget(items, items[0], 'ArrowUp')).toBe(items[2])
})

it('opens at the expected edge and supports Home and End', () => {
    const items = [{ id: 1 }, { id: 2 }]

    expect(dropdownNavigationTarget(items, null, 'ArrowDown')).toBe(items[0])
    expect(dropdownNavigationTarget(items, null, 'ArrowUp')).toBe(items[1])
    expect(dropdownNavigationTarget(items, items[1], 'Home')).toBe(items[0])
    expect(dropdownNavigationTarget(items, items[0], 'End')).toBe(items[1])
})

it('ignores unsupported keys and empty menus', () => {
    expect(dropdownNavigationTarget([], null, 'ArrowDown')).toBeNull()
    expect(dropdownNavigationTarget([{}], null, 'Enter')).toBeNull()
})
