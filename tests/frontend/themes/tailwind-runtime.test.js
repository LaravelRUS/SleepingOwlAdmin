import { describe, expect, it, vi } from 'vitest'

import {
    applyColorMode,
    installTailwindTheme,
} from '../../../resources/frontend/themes/tailwind/runtime.js'

describe('Tailwind theme runtime', () => {
    it('restores, toggles and persists the color scheme without a framework runtime', () => {
        const fixture = createFixture('dark')
        const controller = installTailwindTheme(fixture.target)

        expect(fixture.root.dataset).toEqual({ bsTheme: 'dark', colorScheme: 'dark' })
        expect(fixture.toggle.getAttribute('data-mode')).toBe('dark')
        expect(fixture.icon.className).toBe('fa-regular fa-lightbulb')
        expect(fixture.document.cookie).toContain('theme-mode=dark')

        fixture.click()

        expect(fixture.root.dataset).toEqual({ bsTheme: 'light', colorScheme: 'light' })
        expect(fixture.storage.setItem).toHaveBeenLastCalledWith('theme-mode', 'light')
        expect(fixture.icon.className).toBe('fa-solid fa-moon')
        expect(installTailwindTheme(fixture.target)).toBe(controller)

        controller.destroy()
        expect(fixture.toggle.removeEventListener).toHaveBeenCalledWith(
            'click',
            expect.any(Function),
        )
    })

    it('normalizes unsupported values to light', () => {
        const fixture = createFixture(null)

        expect(applyColorMode(fixture.target, fixture.toggle, 'system')).toBe('light')
        expect(fixture.root.dataset.colorScheme).toBe('light')
    })
})

function createFixture(storedMode) {
    const attributes = new Map([['data-mode', 'light']])
    const listeners = new Map()
    const root = { dataset: {} }
    const icon = { className: '' }
    const toggle = {
        addEventListener: vi.fn((type, listener) => listeners.set(type, listener)),
        getAttribute: vi.fn((name) => attributes.get(name) ?? null),
        removeEventListener: vi.fn(),
        setAttribute: vi.fn((name, value) => attributes.set(name, value)),
    }
    const document = {
        cookie: '',
        documentElement: root,
        getElementById: vi.fn((id) => ({ 'theme-icon': icon, 'theme-mode': toggle })[id] ?? null),
    }
    const storage = {
        getItem: vi.fn(() => storedMode),
        setItem: vi.fn(),
    }
    const target = {
        document,
        localStorage: storage,
        location: { protocol: 'https:' },
    }

    return {
        click: () => listeners.get('click')(),
        document,
        icon,
        root,
        storage,
        target,
        toggle,
    }
}
