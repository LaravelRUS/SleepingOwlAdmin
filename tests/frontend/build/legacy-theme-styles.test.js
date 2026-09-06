import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('keeps framework imports behind the legacy AdminLTE theme boundary', () => {
    const entrypoint = read('resources/assets/scss/admin-app.scss')
    const legacyBuild = read('resources/frontend/themes/legacy-adminlte/styles/_legacy-build.scss')
    const sharedIcons = read('resources/frontend/shared/icons/styles/font-awesome.scss')

    expect(entrypoint).toContain(
        "@use '../../frontend/themes/legacy-adminlte/styles/legacy-build' as legacy-theme;",
    )
    for (const legacyImport of [
        'bootstrap/scss/',
        'assets/scss/adminLte',
        '@fortawesome/fontawesome',
        'assets/scss/components',
        'assets/scss/addition',
    ]) {
        expect(entrypoint).not.toContain(legacyImport)
    }

    for (const owner of [
        'bootstrap/scss/bootstrap',
        'assets/scss/adminLte',
        'assets/scss/adminLte-dark',
        'assets/scss/components',
        'assets/scss/addition',
    ]) {
        expect(legacyBuild).toContain(owner)
    }
    expect(sharedIcons).toContain('@fortawesome/fontawesome-free/scss/fontawesome')
})

it('preserves the structural AdminLTE selectors in the legacy aggregate', () => {
    const css = read('public/default/css/admin-app.css')

    for (const selector of [
        '.main-header',
        '.main-sidebar',
        '.content-wrapper',
        '.main-footer',
        '.card',
        '.navbar',
    ]) {
        expect(css).toContain(selector)
    }
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
