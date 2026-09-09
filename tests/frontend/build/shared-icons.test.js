import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('pins the shared Font Awesome build to the current stable release', () => {
    const packageJson = readJson('package.json')
    const packageLock = readJson('package-lock.json')

    expect(packageJson.dependencies['@fortawesome/fontawesome-free']).toBe('^7.3.1')
    expect(packageLock.packages['node_modules/@fortawesome/fontawesome-free'].version).toBe('7.3.1')
})

it('publishes icons separately from both theme stylesheets', () => {
    const icons = read('public/default/css/icons.css')

    expect(icons).toContain('Font Awesome Free 7.3.1')
    expect(icons).toMatch(/\.fa-solid|\.fas/)

    for (const theme of ['adminlte', 'shadcn']) {
        expect(read(`public/default/css/themes/${theme}.css`)).not.toContain('Font Awesome')
    }
})

it('keeps icons in the transitional aggregate for existing installations', () => {
    expect(read('public/default/css/admin-app.css')).toContain('Font Awesome Free 7.3.1')
})

it.each(['production', 'development'])('keeps the %s icon profile self-contained', (profile) => {
    const profileRoot = `public/default/profiles/${profile}`
    const icons = read(`${profileRoot}/css/icons.css`)

    for (const url of fontUrls(icons)) {
        expect(() => read(`${profileRoot}/css/${url}`)).not.toThrow()
    }
})

function readJson(path) {
    return JSON.parse(read(path))
}

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function fontUrls(css) {
    return [...css.matchAll(/url\(([^)?]+\.woff2)[^)]*\)/g)].map((match) => match[1])
}
