import { expect, it } from 'vitest'

import { applyTableStateOptions } from '../../../../resources/js/shared/features/table/options/state-options.js'

it('enables DataTables state without changing filter state when both flags are on', () => {
    const options = applyTableStateOptions({}, { stateDatatables: true, stateFilters: true })

    expect(options).toEqual({ stateSave: true, stateLoadParams: expect.any(Function) })
})

it('keeps current column visibility when restoring saved table state', () => {
    const options = applyTableStateOptions(
        { columns: [{ visible: false }, { visible: true }] },
        { stateDatatables: true, stateFilters: true },
    )
    const state = {
        columns: [
            { visible: true, name: 'secret' },
            { visible: false, name: 'name' },
        ],
        start: 20,
        length: 10,
        order: [[1, 'desc']],
    }

    options.stateLoadParams({}, state)

    expect(state).toEqual({
        columns: [{ name: 'secret' }, { name: 'name' }],
        start: 20,
        length: 10,
        order: [[1, 'desc']],
    })
    expect(options.columns).toEqual([{ visible: false }, { visible: true }])
})

it('preserves custom state loading callbacks and their cancellation', () => {
    const context = {}
    const state = { columns: [{ visible: true }] }
    const options = applyTableStateOptions(
        {
            stateLoadParams(settings, data) {
                expect(this).toBe(context)
                expect(settings).toEqual({ id: 'table' })
                expect(data).toBe(state)
                return false
            },
        },
        { stateDatatables: true, stateFilters: true },
    )

    expect(options.stateLoadParams.call(context, { id: 'table' }, state)).toBe(false)
    expect(state.columns[0].visible).toBe(true)
})

it('removes built-in search from saved state when custom filter state is off', () => {
    const options = applyTableStateOptions({}, { stateDatatables: true, stateFilters: false })
    const state = { columns: [{ search: { search: 'column' } }], search: { search: 'global' } }

    options.stateSaveParams({}, state)

    expect(options.stateSave).toBe(true)
    expect(state).toEqual({
        columns: [{ search: { search: '' } }],
        search: { search: '' },
    })
})

it('does not force DataTables state on when its config flag is off', () => {
    const options = applyTableStateOptions({}, { stateDatatables: false, stateFilters: false })

    expect(options).not.toHaveProperty('stateSave')
    expect(options.stateSaveParams).toBeTypeOf('function')
})
