import { expect, it, vi } from 'vitest'

import {
    createPageJumpControl,
    installPageJumpFeature,
    PAGE_JUMP_FEATURE,
} from '../../../../resources/frontend/features/table/pagination/page-jump.js'

function element(name) {
    const listeners = {}

    return {
        addEventListener: vi.fn((event, listener) => {
            listeners[event] = listener
        }),
        append: vi.fn(function (...children) {
            this.children.push(...children)
        }),
        children: [],
        listeners,
        name,
        setAttribute: vi.fn(),
    }
}

it('registers the page jump as a DataTables layout feature', () => {
    const register = vi.fn()

    installPageJumpFeature({ feature: { register } }, { labels: { label: 'Страница' } })

    expect(register).toHaveBeenCalledWith(PAGE_JUMP_FEATURE, expect.any(Function))
})

it('jumps to the entered one-based page and keeps the input in sync', () => {
    const draw = vi.fn()
    const page = vi.fn(() => ({ draw }))
    page.info = vi.fn(() => ({ page: 1, pages: 8 }))
    const api = { off: vi.fn(), on: vi.fn(), one: vi.fn(), page }
    const document = {
        createElement: vi.fn((name) => element(name)),
        createTextNode: vi.fn((text) => ({ text })),
    }
    const control = createPageJumpControl(
        { api, table: { ownerDocument: document } },
        { label: 'Страница' },
    )
    const input = control.children[1]

    expect(control.hidden).toBe(false)
    expect(input.value).toBe('2')
    expect(input.max).toBe('8')

    input.value = '5'
    input.listeners.change()

    expect(page).toHaveBeenCalledWith(4)
    expect(draw).toHaveBeenCalledWith('page')
})
