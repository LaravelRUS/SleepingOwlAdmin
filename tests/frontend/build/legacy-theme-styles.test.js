import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('keeps framework imports behind the legacy AdminLTE theme boundary', () => {
    const entrypoint = read('resources/css/themes/adminlte/legacy/admin-app.scss')
    const legacyBuild = read('resources/css/themes/adminlte/_legacy-build.scss')
    const framework = read('resources/css/themes/adminlte/_framework.scss')
    const vendor = read('resources/css/themes/adminlte/_vendor.scss')
    const sharedIcons = read('resources/css/shared/features/icons/font-awesome.scss')
    const sharedVueMultiselect = read('resources/css/shared/features/forms/_vue-multiselect.scss')

    expect(entrypoint).toContain("@use '../legacy-build' as legacy-theme;")
    for (const legacyImport of [
        'bootstrap/scss/',
        'legacy/adminLte',
        '@fortawesome/fontawesome',
        'legacy/components',
        'legacy/addition',
    ]) {
        expect(entrypoint).not.toContain(legacyImport)
    }

    for (const owner of [
        'legacy/variables',
        'legacy/colors',
        'admin-lte/src/scss/adminlte',
        'legacy/font',
        'legacy/components',
        'legacy/addition',
    ]) {
        expect(framework).toContain(owner)
    }
    expect(legacyBuild).toContain('@layer sleepingowl-framework')
    expect(legacyBuild).toContain('@layer sleepingowl-theme')
    expect(legacyBuild).toContain("meta.load-css('./vendor')")
    expect(legacyBuild).toContain("meta.load-css('./framework')")
    expect(vendor).toContain('node_modules/dropzone/dist/dropzone.css')
    expect(vendor).not.toContain('node_modules/vue-multiselect/dist/vue-multiselect.css')
    expect(sharedVueMultiselect).toContain('node_modules/vue-multiselect/dist/vue-multiselect.css')
    expect(sharedIcons).toContain('@fortawesome/fontawesome-free/scss/fontawesome')
})

it('preserves the structural AdminLTE selectors in the legacy aggregate', () => {
    const css = read('public/default/css/admin-app.css')

    for (const selector of [
        '.app-header',
        '.app-sidebar',
        '.app-main',
        '.app-footer',
        '.card',
        '.navbar',
    ]) {
        expect(css).toContain(selector)
    }
    expect(css).toContain('.multiselect__tags')
})

it('builds a standalone AdminLTE theme without embedding shared icons', () => {
    const css = read('public/default/css/themes/adminlte.css')

    for (const selector of [
        '.app-header',
        '.app-sidebar',
        '.app-main',
        '.app-footer',
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
        'css/themes/adminlte.css',
        'profiles/development/css/icons.css',
        'profiles/development/css/themes/adminlte.css',
        'profiles/production/css/icons.css',
        'profiles/production/css/themes/adminlte.css',
    ]) {
        const path = resolve(publicRoot, stylesheet)
        for (const fontUrl of fontUrls(readFileSync(path, 'utf8'))) {
            expect(existsSync(resolve(dirname(path), fontUrl))).toBe(true)
        }
    }
})

it('styles the asset health footer in standalone and compatibility bundles', () => {
    for (const css of [
        read('public/default/css/themes/adminlte.css'),
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
    return [...css.matchAll(/url\((["']?)([^"')?]+\.(?:ttf|woff2))\1[^)]*\)/g)].map(
        (match) => match[2],
    )
}
