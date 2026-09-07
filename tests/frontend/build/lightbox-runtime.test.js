import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('replaces Magnific Popup with the GLightbox feature driver', () => {
    const packageJson = readJson('package.json')
    const bootstrap = read('resources/assets/js_owl/bootstrap.js')
    const runtime = read('resources/assets/js_owl/admin/display/lightbox.js')

    expect(packageJson.dependencies.glightbox).toBe('3.3.1')
    expect(packageJson.dependencies['magnific-popup']).toBeUndefined()
    expect(bootstrap).not.toMatch(/libs\/magnific-popup/)
    expect(runtime).not.toMatch(/jquery|jQuery|\$\(|magnificPopup/i)
    expect(existsSync(resolve(root, 'resources/assets/js_owl/libs/magnific-popup.js'))).toBe(false)
})

it('ships standalone lightbox sources and both theme adapters', () => {
    const files = [
        'resources/frontend/features/lightbox/index.js',
        'resources/frontend/features/lightbox/styles/lightbox-base.scss',
        'resources/frontend/features/lightbox/themes/legacy-adminlte/styles/lightbox-adminlte.scss',
        'resources/frontend/features/lightbox/themes/tailwind/styles/lightbox-tailwind.scss',
    ]

    files.forEach((file) => expect(existsSync(resolve(root, file))).toBe(true))
})

it('uses the native behavior marker in package-owned image views', () => {
    const files = [
        'resources/views/themes/legacy/default/column/image.blade.php',
        'resources/views/themes/legacy/default/column/gravatar.blade.php',
        'resources/views/themes/legacy/default/form/element/files.blade.php',
        'resources/assets/js_owl/admin/form/image.vue',
    ]

    files.forEach((file) => {
        expect(read(file)).toContain('data-lightbox')
        expect(read(file)).not.toContain('data-toggle="lightbox"')
    })
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function readJson(path) {
    return JSON.parse(read(path))
}
