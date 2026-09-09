import { expect, it, vi } from 'vitest'

const { BootstrapDataTable } = vi.hoisted(() => ({ BootstrapDataTable: vi.fn() }))

vi.mock('datatables.net-bs5', () => ({ default: BootstrapDataTable }))
vi.mock('datatables.net-responsive-bs5', () => ({}))

import {
    DATATABLES_PRESENTATION_ID,
    installLegacyDataTablesPresentation,
} from '../../../../resources/js/themes/adminlte/features/table/datatables.js'

it('binds the Bootstrap presentation only to the active engine instance', () => {
    expect(DATATABLES_PRESENTATION_ID).toBe('legacy-adminlte.bootstrap5')
    expect(installLegacyDataTablesPresentation(BootstrapDataTable)).toBe(BootstrapDataTable)
    expect(() => installLegacyDataTablesPresentation(vi.fn())).toThrow('active table engine')
})
