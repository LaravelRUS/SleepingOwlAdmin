import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('replaces Magnific Popup with the GLightbox feature driver', () => {
    const packageJson = readJson('package.json')
    const bootstrap = read('resources/js/shared/legacy/bootstrap.js')
    const runtime = read('resources/js/shared/legacy/admin/display/lightbox.js')

    expect(packageJson.dependencies.glightbox).toBe('3.3.1')
    expect(packageJson.dependencies['magnific-popup']).toBeUndefined()
    expect(bootstrap).not.toMatch(/libs\/magnific-popup/)
    expect(runtime).not.toMatch(/jquery|jQuery|\$\(|magnificPopup/i)
    expect(existsSync(resolve(root, 'resources/js/shared/legacy/libs/magnific-popup.js'))).toBe(
        false,
    )
})

it('ships standalone lightbox sources and both theme adapters', () => {
    const files = [
        'resources/js/shared/features/lightbox/index.js',
        'resources/css/shared/features/lightbox/lightbox-base.scss',
        'resources/css/themes/adminlte/features/lightbox/lightbox-adminlte.scss',
        'resources/css/themes/shadcn/features/lightbox/lightbox-tailwind.scss',
    ]

    files.forEach((file) => expect(existsSync(resolve(root, file))).toBe(true))
})

it('uses the native behavior marker in package-owned image views', () => {
    const files = [
        'resources/views/themes/adminlte/default/column/image.blade.php',
        'resources/views/themes/adminlte/default/column/gravatar.blade.php',
        'resources/views/themes/adminlte/default/form/element/files.blade.php',
        'resources/js/shared/legacy/admin/form/image.vue',
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
