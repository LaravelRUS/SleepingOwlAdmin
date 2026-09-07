import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('keeps framework imports behind the legacy AdminLTE theme boundary', () => {
    const entrypoint = read('resources/assets/scss/admin-app.scss')
    const legacyBuild = read('resources/frontend/themes/legacy-adminlte/styles/_legacy-build.scss')
    const framework = read('resources/frontend/themes/legacy-adminlte/styles/_framework.scss')
    const vendor = read('resources/frontend/themes/legacy-adminlte/styles/_vendor.scss')
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
        expect(framework).toContain(owner)
    }
    expect(legacyBuild).toContain('@layer sleepingowl-theme.framework')
    expect(legacyBuild).toContain("meta.load-css('vendor')")
    expect(legacyBuild).toContain("meta.load-css('framework')")
    expect(vendor).toContain('node_modules/dropzone/dist/dropzone.css')
    expect(vendor).toContain('node_modules/vue-multiselect/dist/vue-multiselect.css')
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

it('builds a standalone AdminLTE theme without embedding shared icons', () => {
    const css = read('public/default/css/themes/legacy-adminlte.css')

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
    expect(css).not.toMatch(/@import\s+url\([^)]*(?:dropzone|vue-multiselect)/)
    expect(css).not.toContain('Font Awesome')
})

it('publishes font assets once and resolves them from every built stylesheet', () => {
    const publicRoot = resolve(root, 'public/default')

    for (const font of ['OpenSans-Bold.ttf', 'OpenSans-Italic.ttf', 'OpenSans-Regular.ttf']) {
        expect(existsSync(resolve(publicRoot, 'fonts', font))).toBe(true)
    }

    for (const duplicate of [
        'css/fonts',
        'profiles/development/fonts',
        'profiles/development/css/fonts',
        'profiles/production/fonts',
        'profiles/production/css/fonts',
    ]) {
        expect(existsSync(resolve(publicRoot, duplicate))).toBe(false)
    }

    for (const stylesheet of [
        'css/admin-app.css',
        'css/icons.css',
        'css/themes/legacy-adminlte.css',
        'profiles/development/css/icons.css',
        'profiles/development/css/themes/legacy-adminlte.css',
        'profiles/production/css/icons.css',
        'profiles/production/css/themes/legacy-adminlte.css',
    ]) {
        const path = resolve(publicRoot, stylesheet)
        for (const fontUrl of fontUrls(readFileSync(path, 'utf8'))) {
            expect(existsSync(resolve(dirname(path), fontUrl))).toBe(true)
        }
    }
})

it('styles the asset health footer in standalone and compatibility bundles', () => {
    for (const css of [
        read('public/default/css/themes/legacy-adminlte.css'),
        read('public/default/css/admin-app.css'),
    ]) {
        expect(css).toContain('.asset-health-status')
        expect(css).toContain('--soa-asset-health-surface-color')
        expect(css).toContain('var(--soa-asset-health-border-color)')
    }
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function fontUrls(css) {
    return [...css.matchAll(/url\(([^)?]+\.(?:ttf|woff2))[^)]*\)/g)].map((match) => match[1])
}
