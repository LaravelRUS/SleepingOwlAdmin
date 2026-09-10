import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('replaces Nestable with the shared SortableJS tree driver', () => {
    const packageJson = readJson('package.json')
    const bootstrap = read('resources/js/shared/legacy/bootstrap.js')
    const runtime = read('resources/js/shared/legacy/admin/display/treeview.js')

    expect(packageJson.dependencies.nestable2).toBeUndefined()
    expect(packageJson.dependencies.sortablejs).toBeDefined()
    expect(bootstrap).not.toMatch(/libs\/nestable/)
    expect(runtime).not.toMatch(/jquery|jQuery|\$\(|\.nestable\(|\$\.post/i)
    expect(existsSync(resolve(root, 'resources/js/shared/legacy/libs/nestable.js'))).toBe(false)
})

it('keeps tree behavior and presentation in shared owned sources', () => {
    const files = [
        'resources/js/shared/features/tree/index.js',
        'resources/css/shared/features/tree/tree.scss',
        'resources/css/shared/_tokens.scss',
    ]

    files.forEach((file) => expect(existsSync(resolve(root, file))).toBe(true))
    expect(read('resources/css/shared/features/tree/tree.scss')).toContain('.soa-tree-content')
    expect(
        existsSync(resolve(root, 'resources/css/themes/adminlte/features/tree/tree-adminlte.scss')),
    ).toBe(false)
})

it('keeps theme notification policies out of the neutral tree entry', () => {
    const entries = readJson('build/frontend-entries.json').modern
    const adminlte = entries.scripts.find(({ logicalId }) => logicalId === 'theme:adminlte')

    expect(read(adminlte.source)).toContain("import './features/tree/browser.js'")
    expect(read('resources/js/shared/features/tree/browser.js')).not.toMatch(
        /Swal|SweetAlert|Admin\.Messages|adminlte/,
    )
})

it.each(['production', 'development'])(
    '%s manifest publishes the tree notification adapter inside the AdminLTE bundle',
    (profile) => {
        const entries = readJson('public/default/asset-manifest.json').profiles[profile].entries
        const adminlte = entries['theme:adminlte']

        expect(adminlte.scripts.map(({ file }) => file)).toEqual([
            `profiles/${profile}/js/themes/adminlte.js`,
        ])
        expect(adminlte.styles).toHaveLength(1)
    },
)

it('keeps visible tree controls in the Blade item template', () => {
    const view = read('resources/js/shared/features/tree/tree-view.js')
    const template = read('resources/views/default/display/tree_children.blade.php')

    expect(view).not.toContain('createElement')
    expect(view).not.toContain("toggle.textContent = collapsed ? '+' : '−'")
    expect(template).toContain('data-tree-toggle')
    expect(template).toContain('data-tree-toggle-expanded')
    expect(template).toContain('data-tree-toggle-collapsed')
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function readJson(path) {
    return JSON.parse(read(path))
}
