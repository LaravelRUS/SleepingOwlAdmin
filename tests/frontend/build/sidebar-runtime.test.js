import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('replaces AdminLTE PushMenu and Treeview execution with a native feature', () => {
    const bootstrap = read('resources/js/shared/legacy/bootstrap.js')
    const sidebar = read('resources/js/shared/features/sidebar/sidebars.js')
    const legacy = read('resources/js/shared/legacy/admin/sidebar.js')

    expect(bootstrap).not.toContain("require('admin-lte')")
    expect(bootstrap).not.toContain("require('./libs/js-cookie')")
    expect(`${sidebar}\n${legacy}`).not.toMatch(/jquery|jQuery|\$\(|\.PushMenu\(|\.Treeview\(/)
    expect(legacy).toContain('installSidebar(Admin)')
})

it('keeps existing PushMenu and Treeview markers without replacement attributes', () => {
    const header = read('resources/views/default/_partials/header.blade.php')
    const layout = read('resources/views/default/_layout/inner.blade.php')
    const navigation = read('resources/views/default/_partials/navigation.blade.php')
    const elements = read('resources/js/shared/features/sidebar/sidebar-elements.js')
    const sidebar = read('resources/js/shared/features/sidebar/sidebars.js')

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

it('ships independent behavior and an AdminLTE Sass adapter', () => {
    expect(read('resources/css/shared/features/sidebar/sidebar-base.scss')).toContain(
        '@layer sleepingowl-feature.sidebar',
    )
    expect(read('resources/css/themes/adminlte/features/sidebar/sidebar-adminlte.scss')).toContain(
        '@layer sleepingowl-theme.sidebar',
    )
})

it('keeps nav-sidebar presentation in the shared sidebar feature', () => {
    const sharedSidebar = read('resources/css/shared/features/sidebar/_sidebar.scss')

    for (const selector of [
        '.nav-sidebar .nav-link',
        '.nav-sidebar .nav-link.active',
        '.nav-treeview',
    ]) {
        expect(sharedSidebar).toContain(selector)
    }
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
