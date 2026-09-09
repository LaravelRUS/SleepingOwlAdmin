export const DROPDOWN_NAVIGATION_KEYS = new Set(['ArrowDown', 'ArrowUp', 'End', 'Home'])

export function dropdownNavigationTarget(items, current, key) {
    if (items.length === 0 || !DROPDOWN_NAVIGATION_KEYS.has(key)) return null
    if (key === 'Home') return items[0]
    if (key === 'End') return items.at(-1)

    const index = items.indexOf(current)
    if (key === 'ArrowDown') return items[index < 0 ? 0 : (index + 1) % items.length]

    return items[index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length]
}
