import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('replaces AdminLTE PushMenu and Treeview execution with a native feature', () => {
    const bootstrap = read('resources/assets/js_owl/bootstrap.js')
    const sidebar = read('resources/frontend/features/sidebar/sidebars.js')
    const legacy = read('resources/assets/js_owl/admin/sidebar.js')

    expect(bootstrap).not.toContain("require('admin-lte')")
    expect(bootstrap).not.toContain("require('./libs/js-cookie')")
    expect(`${sidebar}\n${legacy}`).not.toMatch(/jquery|jQuery|\$\(|\.PushMenu\(|\.Treeview\(/)
    expect(legacy).toContain('installSidebar(Admin)')
})

it('keeps existing PushMenu and Treeview markers without replacement attributes', () => {
    const header = read('resources/views/themes/legacy/default/_partials/header.blade.php')
    const layout = read('resources/views/themes/legacy/default/_layout/inner.blade.php')
    const navigation = read('resources/views/themes/legacy/default/_partials/navigation.blade.php')
    const elements = read('resources/frontend/features/sidebar/sidebar-elements.js')
    const sidebar = read('resources/frontend/features/sidebar/sidebars.js')

    expect(header).toContain('data-widget="pushmenu"')
    expect(layout).toContain('id="sidebar-overlay"')
    expect(navigation).toContain('data-widget="treeview"')
    expect(elements).toContain('[data-widget="pushmenu"]')
    expect(elements).toContain('[data-widget="treeview"]')
    expect(sidebar).not.toContain('createElement(')
    expect(`${header}\n${layout}\n${navigation}\n${elements}\n${sidebar}`).not.toContain(
        'data-sidebar',
    )
})

it('ships independent behavior and AdminLTE/Tailwind Sass adapters', () => {
    expect(read('resources/frontend/features/sidebar/styles/sidebar-base.scss')).toContain(
        '@layer sleepingowl-feature.sidebar',
    )
    expect(
        read(
            'resources/frontend/features/sidebar/themes/legacy-adminlte/styles/sidebar-adminlte.scss',
        ),
    ).toContain('@layer sleepingowl-theme.sidebar')
    expect(
        read('resources/frontend/features/sidebar/themes/tailwind/styles/sidebar-tailwind.scss'),
    ).toContain('@layer sleepingowl-theme.sidebar')
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
