import { expect, it, vi } from 'vitest'

import {
    applyCreatedRowClass,
    createDrawHook,
} from '../../../../resources/frontend/features/table/hooks/table-hooks.js'

it('runs draw hooks in stable order with the engine callback context', () => {
    const calls = []
    const events = { fire: vi.fn(() => calls.push('event')) }
    const draw = createDrawHook({
        events,
        highlight: () => calls.push('highlight'),
        lazyload: () => calls.push('lazyload'),
        tooltips: () => calls.push('tooltips'),
    })
    const context = { name: 'engine' }

    draw.call(context)

    expect(events.fire).toHaveBeenCalledWith('datatables::draw', context)
    expect(calls).toEqual(['event', 'tooltips', 'lazyload', 'highlight'])
})

it('applies server-provided row classes through classList', () => {
    const row = { classList: { add: vi.fn() } }

    applyCreatedRowClass(row, ['value', { add_class: 'featured muted' }])
    applyCreatedRowClass(row, ['value'])

    expect(row.classList.add).toHaveBeenCalledOnce()
    expect(row.classList.add).toHaveBeenCalledWith('featured', 'muted')
})
