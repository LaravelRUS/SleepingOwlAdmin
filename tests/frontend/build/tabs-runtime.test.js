import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('replaces Bootstrap tab calls with the native feature driver', () => {
    const legacy = read('resources/js/shared/legacy/admin/localstorage/tabs.js')
    const runtime = read('resources/js/shared/features/tabs/tabs.js')

    expect(legacy).toContain('installTabs(Admin)')
    expect(`${legacy}\n${runtime}`).not.toMatch(/jquery|jQuery|\$\(|\.tab\(['"]show/i)
})

it('uses the native tab marker without replacing legacy compatibility attributes', () => {
    for (const file of [
        'resources/views/themes/adminlte/default/display/tab.blade.php',
        'resources/views/themes/adminlte/default/form/tabbed.blade.php',
    ]) {
        expect(read(file)).toContain('data-tab')
        expect(read(file)).not.toContain('data-soa-')
    }

    const tabbedForm = read('resources/views/themes/adminlte/default/form/tabbed.blade.php')
    expect(tabbedForm).toContain('data-toggle="tab"')
    expect(tabbedForm).toContain('data-bs-toggle="tab"')
})

it('ships theme-independent behavior and both presentation adapters', () => {
    expect(read('resources/js/shared/features/tabs/browser.js')).toContain(
        'installTabs(target.Admin',
    )
    expect(read('resources/js/shared/features/tabs/index.js')).toContain("TABS_FEATURE_ID = 'tabs'")
    expect(read('resources/css/themes/adminlte/features/tabs/tabs-adminlte.scss')).toContain(
        '@layer sleepingowl-theme.tabs',
    )
    expect(read('resources/css/themes/shadcn/features/tabs/tabs-tailwind.scss')).toContain(
        '@layer sleepingowl-theme.tabs',
    )
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
