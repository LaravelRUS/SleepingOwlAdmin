import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('replaces Bootstrap dropdown execution with a delegated native feature', () => {
    const legacy = read('resources/assets/js_owl/admin/dropdown.js')
    const runtime = read('resources/frontend/features/dropdown/dropdowns.js')

    expect(legacy).toContain('installDropdowns(Admin)')
    expect(`${legacy}\n${runtime}`).not.toMatch(/jquery|jQuery|\$\(|\.dropdown\(/)
})

it('keeps the public marker without introducing replacement attributes', () => {
    const view = read('resources/views/themes/legacy/default/form/button.blade.php')
    const elements = read('resources/frontend/features/dropdown/dropdown-elements.js')

    expect(view).toContain('data-toggle="dropdown"')
    expect(view).not.toContain('data-dropdown')
    expect(elements).toContain('[data-toggle="dropdown"]')
    expect(elements).not.toContain('data-dropdown')
})

it('ships independent behavior and AdminLTE/Tailwind Sass adapters', () => {
    expect(read('resources/frontend/features/dropdown/browser.js')).toContain(
        'installDropdowns(target.Admin',
    )
    expect(read('resources/frontend/features/dropdown/styles/dropdown-base.scss')).toContain(
        '@layer sleepingowl-feature.dropdown',
    )
    expect(
        read(
            'resources/frontend/features/dropdown/themes/legacy-adminlte/styles/dropdown-adminlte.scss',
        ),
    ).toContain('@layer sleepingowl-theme.dropdown')
    expect(
        read('resources/frontend/features/dropdown/themes/tailwind/styles/dropdown-tailwind.scss'),
    ).toContain('@layer sleepingowl-theme.dropdown')
})

it('removes the legacy AdminLTE and aggregate dropdown style owners', () => {
    expect(read('resources/assets/scss/adminLte.scss')).not.toContain(
        'admin-lte/build/scss/dropdown',
    )
    expect(read('resources/assets/scss/components.scss')).not.toContain('components/dropdown')
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
