import { expect, it } from 'vitest'

import { applyTableStateOptions } from '../../../../resources/frontend/features/table/options/state-options.js'

it('enables DataTables state without changing filter state when both flags are on', () => {
    const options = applyTableStateOptions({}, { stateDatatables: true, stateFilters: true })

    expect(options).toEqual({ stateSave: true })
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
