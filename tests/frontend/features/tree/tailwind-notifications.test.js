import { describe, expect, it, vi } from 'vitest'

import { installTailwindTreeNotifications } from '../../../../resources/frontend/features/tree/themes/tailwind/browser.js'

describe('Tailwind tree notifications', () => {
    it('maps public native tree events to the theme-owned live region', () => {
        const listeners = new Map()
        const region = notificationRegion()
        const tree = {
            closest: vi.fn(() => tree),
            querySelector: vi.fn(() => region),
        }
        const document = {
            addEventListener: vi.fn((type, listener) => listeners.set(type, listener)),
            removeEventListener: vi.fn(),
        }
        const installation = installTailwindTreeNotifications({
            document,
            trans: (key) =>
                ({
                    'lang.table.error': 'Unable to reorder',
                    'lang.tree.reorderCompleted': 'Item moved',
                })[key] ?? key,
        })

        listeners.get('tree:changed')({ target: tree })
        expect(region.hidden).toBe(false)
        expect(region.dataset.state).toBe('success')
        expect(region.textContent).toBe('Item moved')
        expect(region.setAttribute).toHaveBeenLastCalledWith('role', 'status')

        listeners.get('tree:failed')({ target: tree })
        expect(region.dataset.state).toBe('error')
        expect(region.textContent).toBe('Unable to reorder')
        expect(region.setAttribute).toHaveBeenLastCalledWith('role', 'alert')

        installation.destroy()
        expect(document.removeEventListener).toHaveBeenCalledTimes(2)
    })
})

function notificationRegion() {
    return {
        dataset: {},
        hidden: true,
        setAttribute: vi.fn(),
        textContent: '',
    }
}
