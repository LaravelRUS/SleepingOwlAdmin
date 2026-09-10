import { describe, expect, it, vi } from 'vitest'

import {
    installScrollControls,
    pageMetrics,
} from '../../../resources/js/shared/features/scroll-controls.js'

describe('shared scroll controls', () => {
    it('shows the top control after one viewport and scrolls both ways', () => {
        const fixture = createFixture()
        const controls = installScrollControls(fixture.target)

        expect(fixture.top.classes.has('show')).toBe(false)
        expect(fixture.bottom.classes.has('hide')).toBe(false)

        fixture.root.scrollTop = 601
        fixture.windowListeners.get('scroll')()

        expect(fixture.top.classes.has('show')).toBe(true)

        const event = { preventDefault: vi.fn() }
        fixture.top.listeners.get('click')(event)
        expect(event.preventDefault).toHaveBeenCalledOnce()
        expect(fixture.target.scrollTo).toHaveBeenCalledWith({
            behavior: 'smooth',
            left: 0,
            top: 0,
        })

        fixture.bottom.listeners.get('click')(event)
        expect(fixture.target.scrollTo).toHaveBeenLastCalledWith({
            behavior: 'smooth',
            left: 0,
            top: 1800,
        })

        controls.destroy()
        expect(fixture.target.removeEventListener).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
        )
    })

    it('reads the shared document scroll root', () => {
        const { root, target } = createFixture()
        root.scrollTop = 725

        expect(pageMetrics(target)).toEqual({ height: 1800, top: 725, viewport: 600 })
    })
})

function createFixture() {
    const top = createControl()
    const bottom = createControl()
    const root = { clientHeight: 600, scrollHeight: 1800, scrollTop: 0 }
    const windowListeners = new Map()
    const document = {
        body: { scrollHeight: 1700 },
        documentElement: { clientHeight: 600, scrollHeight: 1750 },
        getElementById: (id) => ({ scrolltotop: top, scrolltobottom: bottom })[id] ?? null,
        scrollingElement: root,
    }
    const target = {
        addEventListener: vi.fn((type, listener) => windowListeners.set(type, listener)),
        document,
        innerHeight: 600,
        removeEventListener: vi.fn(),
        scrollTo: vi.fn(),
    }

    return { bottom, root, target, top, windowListeners }
}

function createControl() {
    const classes = new Set()
    const listeners = new Map()

    return {
        addEventListener: vi.fn((type, listener) => listeners.set(type, listener)),
        classes,
        classList: {
            toggle: (name, enabled) => (enabled ? classes.add(name) : classes.delete(name)),
        },
        listeners,
        removeEventListener: vi.fn(),
    }
}
