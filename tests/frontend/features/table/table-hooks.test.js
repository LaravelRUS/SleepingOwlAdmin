import { expect, it, vi } from 'vitest'

import {
    applyCreatedRowClass,
    createDrawHook,
} from '../../../../resources/frontend/features/table/hooks/table-hooks.js'

it('preserves the DataTable.Dom callback context and its public api method', () => {
    const calls = []
    const events = { fire: vi.fn(() => calls.push('event')) }
    const draw = createDrawHook({
        events,
        highlight: (context) => {
            expect(context.api()).toBe(api)
            calls.push('highlight')
        },
        inlineEditor: () => calls.push('inline-editor'),
        lazyload: () => calls.push('lazyload'),
        tooltips: () => calls.push('tooltips'),
    })
    const api = { table: vi.fn() }
    const context = { api: vi.fn(() => api) }

    draw.call(context)

    expect(events.fire).toHaveBeenCalledWith('datatables::draw', context)
    expect(context.api).toHaveBeenCalledOnce()
    expect(calls).toEqual(['event', 'inline-editor', 'tooltips', 'lazyload', 'highlight'])
})

it('applies server-provided row classes through classList', () => {
    const row = { classList: { add: vi.fn() } }

    applyCreatedRowClass(row, ['value', { add_class: 'featured muted' }])
    applyCreatedRowClass(row, ['value'])

    expect(row.classList.add).toHaveBeenCalledOnce()
    expect(row.classList.add).toHaveBeenCalledWith('featured', 'muted')
})
