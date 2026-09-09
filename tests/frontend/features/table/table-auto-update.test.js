import { expect, it, vi } from 'vitest'

import {
    AUTO_UPDATE_COLOR_PROPERTY,
    AUTO_UPDATE_FEATURE,
    configureTableAutoUpdate,
    createTableAutoUpdateFeature,
    installTableAutoUpdateFeature,
    matchesAutoUpdateTable,
    mountTableAutoUpdate,
    mountTableAutoUpdates,
    readAutoUpdateConfig,
} from '../../../../resources/js/shared/features/table/autoupdate/table-auto-update.js'

function fixture() {
    let click
    let currentTime = 1000
    const view = controlView((listener) => {
        click = listener
    })
    const tableFixture = createTableFixture()
    const bar = {
        animate: vi.fn(),
        destroy: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        set: vi.fn(),
    }
    const Line = vi.fn(function () {
        return bar
    })
    const scheduler = { clearTimeout: vi.fn(), setTimeout: vi.fn(() => 17) }
    const tables = { reload: vi.fn() }

    return {
        advance(milliseconds) {
            currentTime += milliseconds
        },
        bar,
        click: () => click(),
        Line,
        now: () => currentTime,
        scheduler,
        tables,
        ...tableFixture,
        ...view,
    }
}

function createTableFixture() {
    const classes = new Set(['datatables', 'orders'])
    const properties = new Map()
    const parentNode = { insertBefore: vi.fn() }
    const table = {
        classList: {
            add: vi.fn((...names) => names.forEach((name) => classes.add(name))),
            contains: vi.fn((name) => classes.has(name)),
            remove: vi.fn((...names) => names.forEach((name) => classes.delete(name))),
        },
        parentNode,
        style: {
            removeProperty: vi.fn((name) => properties.delete(name)),
            setProperty: vi.fn((name, value) => properties.set(name, value)),
        },
    }

    return { parentNode, table }
}

function controlView(registerClick) {
    const attributes = new Map()
    const label = { textContent: '' }
    const pauseIcon = { hidden: false }
    const resumeIcon = { hidden: true }
    const toggle = {
        addEventListener: vi.fn((_event, listener) => registerClick(listener)),
        removeEventListener: vi.fn(),
        setAttribute: vi.fn((name, value) => attributes.set(name, value)),
    }
    const rootProperties = new Map()
    const root = {
        dataset: {},
        matches: vi.fn(() => false),
        querySelector: vi.fn((selector) => {
            if (selector.includes('toggle')) return toggle
            if (selector.includes('label')) return label
            if (selector.includes('pause-icon')) return pauseIcon
            if (selector.includes('resume-icon')) return resumeIcon

            return null
        }),
        remove: vi.fn(),
        style: { setProperty: vi.fn((name, value) => rootProperties.set(name, value)) },
    }
    const controlTemplate = {
        content: {
            cloneNode: vi.fn(() => ({ children: [root], firstElementChild: root })),
        },
    }

    return {
        attributes,
        controlTemplate,
        label,
        pauseIcon,
        resumeIcon,
        root,
        rootProperties,
        toggle,
    }
}

function config(overrides = {}) {
    return {
        color: '#123456',
        interval: 250,
        pauseLabel: 'Pause updates',
        resumeLabel: 'Resume updates',
        tableClasses: [],
        ...overrides,
    }
}

function attachHost(item, overrides = {}) {
    const host = {
        dataset: {
            interval: '250',
            pauseLabel: 'Pause updates',
            resumeLabel: 'Resume updates',
            tableClasses: '["orders"]',
            ...overrides,
        },
        querySelector: vi.fn(() => item.controlTemplate),
        style: { getPropertyValue: () => '#123456' },
    }

    item.table.ownerDocument = { querySelector: vi.fn(() => host) }

    return host
}

it('registers auto-update as a DataTables layout feature', () => {
    const item = fixture()
    const register = vi.fn()

    installTableAutoUpdateFeature(
        { feature: { register } },
        {
            now: item.now,
            ProgressBar: { Line: item.Line },
            scheduler: item.scheduler,
            tables: item.tables,
        },
    )

    expect(register).toHaveBeenCalledWith(AUTO_UPDATE_FEATURE, expect.any(Function))
})

it('places matching auto-update controls in the DataTables top layout position', () => {
    const item = fixture()
    attachHost(item)
    const options = { layout: { topStart: 'search' } }
    let startAfterLayout
    let destroy
    const scheduler = {
        ...item.scheduler,
        cancelAnimationFrame: vi.fn(),
        requestAnimationFrame: vi.fn((callback) => {
            startAfterLayout = callback

            return 23
        }),
    }
    const settings = {
        api: { one: vi.fn((_event, listener) => (destroy = listener)) },
        table: item.table,
    }

    expect(configureTableAutoUpdate(item.table, options)).toBe(true)
    expect(options.layout).toEqual({ top: AUTO_UPDATE_FEATURE, topStart: 'search' })
    expect(
        createTableAutoUpdateFeature(settings, {
            now: item.now,
            ProgressBar: { Line: item.Line },
            scheduler,
            tables: item.tables,
        }),
    ).toBe(item.root)
    expect(item.parentNode.insertBefore).not.toHaveBeenCalled()
    expect(scheduler.requestAnimationFrame).toHaveBeenCalledOnce()
    expect(item.bar.animate).not.toHaveBeenCalled()
    expect(settings.api.one).toHaveBeenCalledWith('destroy.soaAutoUpdate', expect.any(Function))

    startAfterLayout()
    expect(item.bar.animate).toHaveBeenCalledWith(1, { duration: 250 })

    destroy()
    expect(item.root.remove).toHaveBeenCalledOnce()
})

it('reads typed config and multiple matching classes from the Blade host', () => {
    const host = {
        dataset: {
            interval: '120000',
            pauseLabel: 'Pause',
            resumeLabel: 'Continue',
            tableClasses: '["project-orders","project-stock"]',
        },
        style: { getPropertyValue: () => '#123456' },
    }

    expect(readAutoUpdateConfig(host)).toEqual({
        color: '#123456',
        interval: 120000,
        pauseLabel: 'Pause',
        resumeLabel: 'Continue',
        tableClasses: ['project-orders', 'project-stock'],
    })
})

it('keeps the singular class and close label as a legacy Blade contract', () => {
    const host = {
        dataset: { closeLabel: 'Stop', interval: '1000', tableClass: 'orders' },
        style: { getPropertyValue: () => 'currentColor' },
    }

    expect(readAutoUpdateConfig(host)).toEqual({
        color: 'currentColor',
        interval: 1000,
        pauseLabel: 'Stop',
        resumeLabel: 'Resume auto-update',
        tableClasses: ['orders'],
    })
})

it('matches every table for an empty class list and any configured class otherwise', () => {
    const table = fixture().table

    expect(matchesAutoUpdateTable(table, [])).toBe(true)
    expect(matchesAutoUpdateTable(table, ['missing', 'orders'])).toBe(true)
    expect(matchesAutoUpdateTable(table, ['missing', 'archived'])).toBe(false)
})

it('renders a progress line before the table and reloads it after one period', () => {
    const item = fixture()
    const controller = mountTableAutoUpdate(item.table, config(), {
        controlTemplate: item.controlTemplate,
        now: item.now,
        ProgressBar: { Line: item.Line },
        scheduler: item.scheduler,
        tables: item.tables,
    })

    const refresh = item.scheduler.setTimeout.mock.calls[0][0]
    refresh()

    expect(item.tables.reload).toHaveBeenCalledWith(item.table)
    expect(item.parentNode.insertBefore).toHaveBeenCalledWith(item.root, item.table)
    expect(item.table.style.setProperty).toHaveBeenCalledWith(AUTO_UPDATE_COLOR_PROPERTY, '#123456')
    expect(item.root.style.setProperty).toHaveBeenCalledWith(AUTO_UPDATE_COLOR_PROPERTY, '#123456')
    expect(item.Line).toHaveBeenCalledWith(
        item.root,
        expect.objectContaining({
            color: `var(${AUTO_UPDATE_COLOR_PROPERTY})`,
            duration: 250,
        }),
    )
    expect(item.bar.set).toHaveBeenNthCalledWith(1, 0)
    expect(item.bar.animate).toHaveBeenCalledWith(1, { duration: 250 })
    expect(item.scheduler.setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 250)

    controller.destroy()

    expect(item.bar.destroy).toHaveBeenCalledOnce()
    expect(item.root.remove).toHaveBeenCalledOnce()
    expect(item.table.classList.remove).toHaveBeenCalledWith('autoupdater', 'autoupdater-paused')
})

it('pauses and resumes both the remaining timer and progress animation', () => {
    const item = fixture()
    const controller = mountTableAutoUpdate(item.table, config(), {
        controlTemplate: item.controlTemplate,
        now: item.now,
        ProgressBar: { Line: item.Line },
        scheduler: item.scheduler,
        tables: item.tables,
    })

    item.advance(100)
    item.click()

    expect(controller.paused).toBe(true)
    expect(item.scheduler.clearTimeout).toHaveBeenCalledWith(17)
    expect(item.bar.pause).toHaveBeenCalledOnce()
    expect(item.root.remove).not.toHaveBeenCalled()
    expect(item.root.dataset.state).toBe('paused')
    expect(item.attributes.get('aria-label')).toBe('Resume updates')
    expect(item.attributes.get('aria-pressed')).toBe('true')
    expect(item.label.textContent).toBe('Resume updates')
    expect(item.pauseIcon.hidden).toBe(true)
    expect(item.resumeIcon.hidden).toBe(false)

    item.click()

    expect(controller.paused).toBe(false)
    expect(item.bar.resume).toHaveBeenCalledOnce()
    expect(item.scheduler.setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 150)
    expect(item.root.dataset.state).toBe('running')
    expect(item.attributes.get('aria-label')).toBe('Pause updates')
})

it('mounts and tears down matching tables registered after the Blade host', () => {
    const item = fixture()
    let registryListener
    const unsubscribe = vi.fn()
    const tables = {
        all: vi.fn(() => []),
        reload: vi.fn(),
        subscribe: vi.fn((listener) => {
            registryListener = listener

            return unsubscribe
        }),
    }
    const host = {
        dataset: { interval: '250', tableClasses: '["orders"]' },
        querySelector: vi.fn(() => item.controlTemplate),
        style: { getPropertyValue: () => '#123456' },
    }
    const collection = mountTableAutoUpdates(host, {
        now: item.now,
        ProgressBar: { Line: item.Line },
        scheduler: item.scheduler,
        tables,
    })
    const adapter = { element: item.table }

    registryListener({ adapter, type: 'registered' })
    expect(item.parentNode.insertBefore).toHaveBeenCalledWith(item.root, item.table)

    registryListener({ adapter, type: 'unregistered' })
    expect(item.root.remove).toHaveBeenCalledOnce()

    collection.destroy()
    expect(unsubscribe).toHaveBeenCalledOnce()
})

it('rejects invalid host configuration before mounting tables', () => {
    expect(() =>
        readAutoUpdateConfig({
            dataset: { interval: '0' },
            style: { getPropertyValue: () => '' },
        }),
    ).toThrow('interval must be a positive number')

    expect(() =>
        readAutoUpdateConfig({
            dataset: { interval: '1000', tableClasses: 'orders' },
            style: { getPropertyValue: () => '#123456' },
        }),
    ).toThrow('classes must be a JSON array')
})
