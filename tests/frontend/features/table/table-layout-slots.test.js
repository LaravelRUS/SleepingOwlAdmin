import { expect, it, vi } from 'vitest'

import {
    configureTableLayoutSlots,
    findTableLayoutSlots,
    isTableLayoutPosition,
} from '../../../../resources/frontend/features/table/layout/table-layout-slots.js'

function fixture(slotDefinitions = [['top3Start', 'first']], tableId = 'orders') {
    const comments = []
    const host = createHost(tableId)
    const slots = slotDefinitions.map(([position, name]) => createSlot(host, position, name))
    host.children = slots

    const unrelatedHost = createHost('customers')
    const unrelatedSlot = createSlot(unrelatedHost, 'top3Start', 'unrelated')
    unrelatedHost.children = [unrelatedSlot]

    const document = {
        createComment: vi.fn((text) => {
            const comment = { parentNode: null, text }
            comments.push(comment)

            return comment
        }),
        querySelectorAll: vi.fn(() => [unrelatedHost, host]),
    }
    const table = { dataset: { id: tableId }, ownerDocument: document }

    return { comments, document, host, slots, table, unrelatedHost, unrelatedSlot }
}

function createHost(tableId) {
    const host = {
        children: [],
        dataset: { datatablesId: tableId },
        insertBefore: vi.fn((placeholder) => {
            placeholder.parentNode = host
        }),
        replaceChild: vi.fn(),
    }

    return host
}

function createSlot(host, position, name) {
    return {
        getAttribute: vi.fn((attribute) =>
            attribute === 'data-admin-datatables-layout-slot' ? position : null,
        ),
        name,
        parentNode: host,
    }
}

it('recognizes numbered top and bottom layout positions', () => {
    expect(isTableLayoutPosition('top3')).toBe(true)
    expect(isTableLayoutPosition('top3Start')).toBe(true)
    expect(isTableLayoutPosition('top4End')).toBe(true)
    expect(isTableLayoutPosition('bottom3Start')).toBe(true)
    expect(isTableLayoutPosition('bottom25End')).toBe(true)
    expect(isTableLayoutPosition('top')).toBe(false)
    expect(isTableLayoutPosition('top0Start')).toBe(false)
    expect(isTableLayoutPosition('top3Middle')).toBe(false)
    expect(isTableLayoutPosition('bottom3start')).toBe(false)
})

it('discovers only valid slots scoped to the current table id', () => {
    const item = fixture([
        ['top3Start', 'start'],
        ['bottom4End', 'end'],
        ['top3Middle', 'invalid'],
    ])

    expect(findTableLayoutSlots(item.table)).toEqual(item.slots.slice(0, 2))
    expect(findTableLayoutSlots(item.table)).not.toContain(item.unrelatedSlot)
})

it('merges slots after existing layout content and preserves block order', () => {
    const item = fixture([
        ['top3Start', 'first'],
        ['top3Start', 'second'],
        ['top3End', 'third'],
        ['bottom4', 'fourth'],
    ])
    const options = {
        layout: {
            top3Start: 'search',
            top3End: ['pageLength'],
        },
    }

    expect(configureTableLayoutSlots(item.table, options)).toBe(true)
    expect(options.layout.top3Start[0]).toBe('search')
    expect(options.layout.top3Start).toHaveLength(3)
    expect(options.layout.top3End[0]).toBe('pageLength')
    expect(options.layout.top3End).toHaveLength(2)
    expect(options.layout.bottom4).toHaveLength(1)

    const settings = { api: { one: vi.fn() } }
    expect(options.layout.top3Start[1](settings)).toBe(item.slots[0])
    expect(options.layout.top3Start[2](settings)).toBe(item.slots[1])
    expect(options.layout.top3End[1](settings)).toBe(item.slots[2])
    expect(options.layout.bottom4[0](settings)).toBe(item.slots[3])
})

it('moves original slot nodes and restores every node once when DataTables is destroyed', () => {
    const item = fixture([
        ['top3Start', 'first'],
        ['bottom4End', 'second'],
    ])
    const options = { layout: {} }
    const destroyListeners = []
    const settings = {
        api: {
            one: vi.fn((_event, listener) => destroyListeners.push(listener)),
        },
    }

    configureTableLayoutSlots(item.table, options)
    expect(item.host.insertBefore).toHaveBeenNthCalledWith(1, item.comments[0], item.slots[0])
    expect(item.host.insertBefore).toHaveBeenNthCalledWith(2, item.comments[1], item.slots[1])

    expect(options.layout.top3Start[0](settings)).toBe(item.slots[0])
    expect(options.layout.bottom4End[0](settings)).toBe(item.slots[1])
    expect(settings.api.one).toHaveBeenCalledWith('destroy.soaLayoutSlots', expect.any(Function))

    destroyListeners.forEach((listener) => listener())
    expect(item.host.replaceChild).toHaveBeenCalledTimes(2)
    expect(item.host.replaceChild).toHaveBeenNthCalledWith(1, item.slots[0], item.comments[0])
    expect(item.host.replaceChild).toHaveBeenNthCalledWith(2, item.slots[1], item.comments[1])
})

it('leaves layout untouched when the table has no matching slots', () => {
    const item = fixture([], 'orders')
    const options = { layout: { top2Start: 'search' } }

    expect(configureTableLayoutSlots(item.table, options)).toBe(false)
    expect(options.layout).toEqual({ top2Start: 'search' })
})
