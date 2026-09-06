import { expect, it, vi } from 'vitest'

const { BootstrapDataTable } = vi.hoisted(() => ({ BootstrapDataTable: vi.fn() }))

vi.mock('datatables.net-bs4', () => ({ default: BootstrapDataTable }))
vi.mock('datatables.net-responsive-bs4', () => ({}))

import {
    DATATABLES_PRESENTATION_ID,
    installLegacyDataTablesPresentation,
} from '../../../../resources/frontend/features/table/themes/legacy-adminlte/datatables.js'

it('binds the Bootstrap presentation only to the active engine instance', () => {
    expect(DATATABLES_PRESENTATION_ID).toBe('legacy-adminlte.bootstrap4')
    expect(installLegacyDataTablesPresentation(BootstrapDataTable)).toBe(BootstrapDataTable)
    expect(() => installLegacyDataTablesPresentation(vi.fn())).toThrow('active table engine')
})
