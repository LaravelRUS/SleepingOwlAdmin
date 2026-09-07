import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('replaces Nestable with the shared SortableJS tree driver', () => {
    const packageJson = readJson('package.json')
    const bootstrap = read('resources/assets/js_owl/bootstrap.js')
    const runtime = read('resources/assets/js_owl/admin/display/treeview.js')

    expect(packageJson.dependencies.nestable2).toBeUndefined()
    expect(packageJson.dependencies.sortablejs).toBeDefined()
    expect(bootstrap).not.toMatch(/libs\/nestable/)
    expect(runtime).not.toMatch(/jquery|jQuery|\$\(|\.nestable\(|\$\.post/i)
    expect(existsSync(resolve(root, 'resources/assets/js_owl/libs/nestable.js'))).toBe(false)
})

it('keeps the tree driver and both theme adapters in separate owned sources', () => {
    const files = [
        'resources/frontend/features/tree/index.js',
        'resources/frontend/features/tree/styles/tree.scss',
        'resources/frontend/features/tree/themes/legacy-adminlte/styles/tree-adminlte.scss',
        'resources/frontend/features/tree/themes/tailwind/styles/tree-tailwind.scss',
    ]

    files.forEach((file) => expect(existsSync(resolve(root, file))).toBe(true))
})

it('keeps visible tree controls in the Blade item template', () => {
    const view = read('resources/frontend/features/tree/tree-view.js')
    const template = read('resources/views/themes/legacy/default/display/tree_children.blade.php')

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
