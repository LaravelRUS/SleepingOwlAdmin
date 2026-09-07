import { expect, it, vi } from 'vitest'

import {
    AUTO_UPDATE_COLOR_PROPERTY,
    mountTableAutoUpdate,
    readAutoUpdateConfig,
} from '../../../../resources/frontend/features/table/autoupdate/table-auto-update.js'

function fixture() {
    let click
    const properties = new Map()
    const view = controlView((listener) => {
        click = listener
    })
    const table = {
        appendChild: vi.fn(),
        classList: { add: vi.fn(), remove: vi.fn() },
        style: {
            removeProperty: vi.fn((name) => properties.delete(name)),
            setProperty: vi.fn((name, value) => properties.set(name, value)),
        },
    }
    const bar = { animate: vi.fn(), destroy: vi.fn(), set: vi.fn() }
    const Line = vi.fn(function () {
        return bar
    })
    const scheduler = { clearTimeout: vi.fn(), setTimeout: vi.fn(() => 17) }
    const tables = { reload: vi.fn() }

    return { bar, click: () => click(), Line, scheduler, table, tables, ...view }
}

function controlView(registerClick) {
    const close = {
        addEventListener: vi.fn((_event, listener) => {
            registerClick(listener)
        }),
        removeEventListener: vi.fn(),
    }
    const root = {
        matches: vi.fn(() => false),
        querySelector: vi.fn(() => close),
        remove: vi.fn(),
    }
    const controlTemplate = {
        content: {
            cloneNode: vi.fn(() => ({ children: [root], firstElementChild: root })),
        },
    }

    return { close, controlTemplate, root }
}

it('reads typed config from the no-script Blade host', () => {
    const host = {
        dataset: {
            closeLabel: 'Stop',
            interval: '120000',
            tableClass: 'project-orders',
        },
        style: { getPropertyValue: () => '#123456' },
    }

    expect(readAutoUpdateConfig(host)).toEqual({
        closeLabel: 'Stop',
        color: '#123456',
        interval: 120000,
        tableClass: 'project-orders',
    })
})

it('reloads one registered table and destroys its timer, bar and control independently', () => {
    const item = fixture()
    const controller = mountTableAutoUpdate(
        item.table,
        { closeLabel: 'Stop', color: '#123456', interval: 250, tableClass: null },
        {
            controlTemplate: item.controlTemplate,
            ProgressBar: { Line: item.Line },
            scheduler: item.scheduler,
            tables: item.tables,
        },
    )

    const refresh = item.scheduler.setTimeout.mock.calls[0][0]
    refresh()

    expect(item.tables.reload).toHaveBeenCalledWith(item.table)
    expect(item.table.style.setProperty).toHaveBeenCalledWith(AUTO_UPDATE_COLOR_PROPERTY, '#123456')
    expect(item.Line).toHaveBeenCalledWith(
        item.table,
        expect.objectContaining({ color: `var(${AUTO_UPDATE_COLOR_PROPERTY})`, duration: 250 }),
    )
    expect(item.table.appendChild).toHaveBeenCalledWith(item.root)

    item.click()
    controller.destroy()

    expect(item.scheduler.clearTimeout).toHaveBeenCalledOnce()
    expect(item.bar.destroy).toHaveBeenCalledOnce()
    expect(item.root.remove).toHaveBeenCalledOnce()
    expect(item.table.classList.remove).toHaveBeenCalledWith('autoupdater')
})

it('rejects invalid host configuration before mounting tables', () => {
    expect(() =>
        readAutoUpdateConfig({
            dataset: { interval: '0' },
            style: { getPropertyValue: () => '' },
        }),
    ).toThrow('interval must be a positive number')
})
