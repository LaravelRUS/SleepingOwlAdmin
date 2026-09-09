import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('replaces Bootstrap dropdown execution with a delegated native feature', () => {
    const legacy = read('resources/js/shared/legacy/admin/dropdown.js')
    const runtime = read('resources/js/shared/features/dropdown/dropdowns.js')

    expect(legacy).toContain('installDropdowns(Admin)')
    expect(`${legacy}\n${runtime}`).not.toMatch(/jquery|jQuery|\$\(|\.dropdown\(/)
})

it('keeps the public marker without introducing replacement attributes', () => {
    const view = read('resources/views/default/form/button.blade.php')
    const elements = read('resources/js/shared/features/dropdown/dropdowns.js')

    expect(view).toContain('data-toggle="dropdown"')
    expect(view).not.toContain('data-dropdown')
    expect(elements).toContain('[data-toggle="dropdown"]')
    expect(elements).not.toContain('data-dropdown')
})

it('ships independent behavior and AdminLTE/Tailwind Sass adapters', () => {
    expect(read('resources/js/shared/features/dropdown/browser.js')).toContain(
        'installDropdowns(target.Admin',
    )
    expect(read('resources/css/shared/features/dropdown/dropdown-base.scss')).toContain(
        '@layer sleepingowl-feature.dropdown',
    )
    expect(
        read('resources/css/themes/adminlte/features/dropdown/dropdown-adminlte.scss'),
    ).toContain('@layer sleepingowl-theme.dropdown')
    expect(read('resources/css/themes/shadcn/features/dropdown/dropdown-tailwind.scss')).toContain(
        '@layer sleepingowl-theme.dropdown',
    )
})

it('removes the legacy AdminLTE and aggregate dropdown style owners', () => {
    expect(existsSync(resolve(root, 'resources/css/themes/adminlte/legacy/adminLte.scss'))).toBe(
        false,
    )
    expect(read('resources/css/themes/adminlte/legacy/components.scss')).not.toContain(
        'components/dropdown',
    )
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
