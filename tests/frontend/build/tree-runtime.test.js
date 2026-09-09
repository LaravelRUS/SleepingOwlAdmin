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

it('keeps the tree driver and both theme adapters in separate owned sources', () => {
    const files = [
        'resources/js/shared/features/tree/index.js',
        'resources/css/shared/features/tree/tree.scss',
        'resources/css/themes/adminlte/features/tree/tree-adminlte.scss',
        'resources/css/themes/shadcn/features/tree/tree-tailwind.scss',
    ]

    files.forEach((file) => expect(existsSync(resolve(root, file))).toBe(true))
})

it('keeps theme notification policies out of the neutral tree entry', () => {
    const entries = readJson('build/frontend-entries.json').modern
    const scripts = entries.scripts.filter(({ logicalId }) => logicalId.includes('tree'))
    const adminlte = scripts.find(({ logicalId }) => logicalId === 'feature:tree:theme:adminlte')
    const tailwind = scripts.find(({ logicalId }) => logicalId === 'feature:tree:theme:shadcn')

    expect(adminlte?.source).toBe('resources/js/themes/adminlte/features/tree/browser.js')
    expect(tailwind?.source).toBe('resources/js/themes/shadcn/features/tree/browser.js')
    expect(read('resources/js/shared/features/tree/browser.js')).not.toMatch(
        /Swal|SweetAlert|Admin\.Messages|adminlte/,
    )
    expect(read('resources/js/themes/shadcn/theme.js')).not.toMatch(
        /Swal|SweetAlert|Admin\.Messages|adminlte/,
    )
    expect(read(tailwind.source)).not.toMatch(/Swal|SweetAlert|Admin\.Messages|adminlte/)
})

it.each(['production', 'development'])(
    '%s manifest publishes isolated AdminLTE and Tailwind tree notification adapters',
    (profile) => {
        const entries = readJson('public/default/asset-manifest.json').profiles[profile].entries
        const adminlte = entries['feature:tree:theme:adminlte']
        const tailwind = entries['feature:tree:theme:shadcn']

        expect(adminlte.scripts.map(({ file }) => file)).toEqual([
            `profiles/${profile}/js/features/tree/themes/adminlte.js`,
        ])
        expect(adminlte.styles).toHaveLength(1)
        expect(tailwind.scripts.map(({ file }) => file)).toEqual([
            `profiles/${profile}/js/features/tree/themes/shadcn.js`,
        ])
        expect(tailwind.styles).toHaveLength(1)
    },
)

it('keeps visible tree controls in the Blade item template', () => {
    const view = read('resources/js/shared/features/tree/tree-view.js')
    const template = read('resources/views/themes/adminlte/default/display/tree_children.blade.php')

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
