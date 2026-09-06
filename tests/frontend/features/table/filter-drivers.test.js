import { expect, it, vi } from 'vitest'

import { createTableFilterDrivers } from '../../../../resources/frontend/features/table/filters/filter-drivers.js'

function control({ closest = null, selectedOptions = [], value = '' } = {}) {
    const listeners = new Map()

    return {
        addEventListener: vi.fn((type, listener) => listeners.set(type, listener)),
        closest: vi.fn(() => closest),
        dataset: {},
        emit: (type) => listeners.get(type)?.({ type }),
        selectedOptions,
        value,
    }
}

function engine() {
    return { ext: { search: [] } }
}

function compatibilityEvents() {
    const dateChanges = new Map()
    const syntheticChanges = new Map()

    return {
        bindDateChange: vi.fn((input, listener) => dateChanges.set(input, listener)),
        bindSyntheticChange: vi.fn((input, listener) => syntheticChanges.set(input, listener)),
        emitDate: (input) => dateChanges.get(input)?.(),
        emitSynthetic: (input) => syntheticChanges.get(input)?.(),
        parseDate: vi.fn(),
    }
}

it('binds text and date filters through native control events', () => {
    const events = compatibilityEvents()
    const drivers = createTableFilterDrivers(engine(), events)
    const text = control({ value: 'Alice' })
    const date = control({ value: '06.09.2026' })
    const textColumn = { search: vi.fn() }
    const dateColumn = { search: vi.fn() }

    drivers.text(text, null, textColumn)
    drivers.date(date, null, dateColumn)
    text.emit('keyup')
    date.emit('change')
    events.emitDate(date)

    expect(textColumn.search).toHaveBeenCalledWith('Alice')
    expect(dateColumn.search).toHaveBeenCalledTimes(2)
    expect(dateColumn.search).toHaveBeenLastCalledWith('06.09.2026')
})

it('preserves server and client select search formats', () => {
    const events = compatibilityEvents()
    const drivers = createTableFilterDrivers(engine(), events)
    const input = control({
        selectedOptions: [{ value: 'active' }, { value: '' }, { value: 'archived' }],
    })
    const serverColumn = { search: vi.fn() }
    const clientColumn = { search: vi.fn() }

    drivers.select(input, null, serverColumn, 2, true)
    input.emit('change')
    drivers.select(input, null, clientColumn, 2, false)
    events.emitSynthetic(input)

    expect(serverColumn.search).toHaveBeenCalledWith('active:::archived')
    expect(clientColumn.search).toHaveBeenCalledWith('active|archived', true, false, true)
})

it('binds range inputs natively and registers client search on the active engine', () => {
    const runtime = engine()
    const drivers = createTableFilterDrivers(runtime)
    const from = control({ value: '10' })
    const to = control({ value: '40' })
    const container = { querySelectorAll: () => [from, to] }
    const column = { search: vi.fn() }
    const table = {
        draw: vi.fn(),
        settings: () => [{ sTableId: 'orders' }],
    }

    drivers.range(container, table, column, 3, false)
    from.emit('change')

    expect(from.dataset.ajaxDataName).toBe('from')
    expect(to.dataset.ajaxDataName).toBe('to')
    expect(table.draw).toHaveBeenCalledOnce()
    expect(runtime.ext.search).toHaveLength(1)
    expect(runtime.ext.search[0]({ sTableId: 'orders' }, [null, null, null, '25'])).toBe(true)
    expect(runtime.ext.search[0]({ sTableId: 'orders' }, [null, null, null, '50'])).toBe(false)
    expect(runtime.ext.search[0]({ sTableId: 'users' }, [])).toBe(true)
})

it('sends the unchanged range wire format for server-side tables', () => {
    const drivers = createTableFilterDrivers(engine())
    const from = control({ value: '10' })
    const to = control({ value: '40' })
    const column = { search: vi.fn() }

    drivers.range({ querySelectorAll: () => [from, to] }, {}, column, 3, true)
    to.emit('keyup')

    expect(column.search).toHaveBeenCalledWith('10::40')
})

it('delegates client-side date parsing without adding a date library to the driver', () => {
    const runtime = engine()
    const events = compatibilityEvents()
    const wrapper = {}
    const from = control({ closest: wrapper, value: '10' })
    const to = control({ closest: wrapper, value: '20' })
    from.dataset.dateFormat = 'fixture'
    events.parseDate.mockImplementation((value) => new Date(2026, 0, Number(value)))
    const table = { settings: () => [{ sTableId: 'orders' }] }

    createTableFilterDrivers(runtime, events).range(
        { querySelectorAll: () => [from, to] },
        table,
        {},
        1,
        false,
    )

    expect(runtime.ext.search[0]({ sTableId: 'orders' }, [null, '15'])).toBe(true)
    expect(events.parseDate).toHaveBeenCalledWith('15', 'fixture')
})
