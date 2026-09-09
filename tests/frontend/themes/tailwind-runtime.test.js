import { describe, expect, it, vi } from 'vitest'

import {
    applyColorMode,
    installTailwindCardControls,
    installTailwindTheme,
} from '../../../resources/js/themes/shadcn/runtime.js'

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

    it('drives preserved AdminLTE card hooks without AdminLTE', () => {
        const listeners = new Map()
        const iconClasses = createClassList(['fa-minus'])
        const cardClasses = createClassList(['soa-card'])
        const button = {
            closest: vi.fn(() => ({ classList: cardClasses })),
            getAttribute: vi.fn(() => 'collapse'),
            querySelector: vi.fn(() => ({ classList: iconClasses })),
            setAttribute: vi.fn(),
        }
        const document = {
            addEventListener: vi.fn((type, listener) => listeners.set(type, listener)),
            removeEventListener: vi.fn(),
        }
        const controller = installTailwindCardControls(document)
        const event = {
            preventDefault: vi.fn(),
            target: { closest: vi.fn(() => button) },
        }

        listeners.get('click')(event)

        expect(cardClasses.contains('collapsed-card')).toBe(true)
        expect(iconClasses.contains('fa-plus')).toBe(true)
        expect(button.setAttribute).toHaveBeenCalledWith('aria-expanded', 'false')
        expect(event.preventDefault).toHaveBeenCalled()

        controller.destroy()
        expect(document.removeEventListener).toHaveBeenCalledTimes(2)
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

function createClassList(initial = []) {
    const values = new Set(initial)

    return {
        contains: (value) => values.has(value),
        remove: (value) => values.delete(value),
        toggle(value, force) {
            const enabled = force ?? !values.has(value)
            if (enabled) values.add(value)
            else values.delete(value)

            return enabled
        },
    }
}
