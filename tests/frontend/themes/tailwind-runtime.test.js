import { describe, expect, it, vi } from 'vitest'

import {
    installTailwindCardControls,
    installTailwindTheme,
} from '../../../resources/js/themes/shadcn/runtime.js'

describe('Tailwind theme runtime', () => {
    it('installs its card controls once', () => {
        const fixture = createFixture()
        const controller = installTailwindTheme(fixture.target)

        expect(fixture.document.addEventListener).toHaveBeenCalledTimes(2)
        expect(installTailwindTheme(fixture.target)).toBe(controller)

        controller.destroy()
        expect(fixture.document.removeEventListener).toHaveBeenCalledTimes(2)
    })
})

describe('Tailwind card controls', () => {
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

function createFixture() {
    const document = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }
    const target = { document }

    return { document, target }
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
