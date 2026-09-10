import { describe, expect, it, vi } from 'vitest'

import {
    applyColorMode,
    installColorMode,
} from '../../../../resources/js/shared/features/color-mode/color-mode.js'

describe('shared color mode', () => {
    it('restores, toggles and persists the color scheme for every theme', () => {
        const fixture = createFixture('dark')
        const controller = installColorMode(fixture.target)

        expect(fixture.root.dataset).toEqual({ bsTheme: 'dark', colorScheme: 'dark' })
        expect(fixture.toggle.getAttribute('data-mode')).toBe('dark')
        expect(fixture.icon.className).toBe('fa-regular fa-lightbulb')
        expect(fixture.document.cookie).toContain('theme-mode=dark')

        fixture.click()

        expect(fixture.root.dataset).toEqual({ bsTheme: 'light', colorScheme: 'light' })
        expect(fixture.storage.setItem).toHaveBeenLastCalledWith('theme-mode', 'light')
        expect(fixture.icon.className).toBe('fa-solid fa-moon')
        expect(installColorMode(fixture.target)).toBe(controller)

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

    it('does nothing when the layout has no color-mode control', () => {
        const target = { document: { getElementById: vi.fn(() => null) } }

        expect(installColorMode(target)).toBeNull()
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
