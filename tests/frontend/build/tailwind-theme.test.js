import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const entries = readJson('build/frontend-entries.json')
const packageJson = readJson('package.json')
const lock = readJson('package-lock.json')

it('pins Tailwind 4 and publishes one CSS-only logical entry', () => {
    expect(packageJson.devDependencies).toMatchObject({
        '@tailwindcss/postcss': '4.3.3',
        tailwindcss: '4.3.3',
    })
    expect(lock.packages['node_modules/@tailwindcss/postcss']).toMatchObject({
        version: '4.3.3',
        license: 'MIT',
    })
    expect(lock.packages['node_modules/tailwindcss']).toMatchObject({
        version: '4.3.3',
        license: 'MIT',
    })

    expect(
        entries.modern.scripts.filter(({ logicalId }) => logicalId === 'theme:tailwind'),
    ).toEqual([])
    expect(entries.modern.styles.filter(({ logicalId }) => logicalId === 'theme:tailwind')).toEqual(
        [
            {
                logicalId: 'theme:tailwind',
                output: 'css/themes/tailwind.css',
                processor: 'tailwind',
                source: 'resources/css/themes/tailwind/theme.css',
            },
        ],
    )
})

it('keeps the semantic token contract and dark palette in the theme source', () => {
    const theme = read('resources/css/themes/tailwind/theme.css')

    expect(theme).toContain("@import 'tailwindcss/theme.css'")
    expect(theme).toContain("@import 'tailwindcss/utilities.css'")
    expect(theme).toContain('--soa-primary-color')
    expect(theme).toContain('@apply tw:antialiased')
    expect(theme).toContain(":root[data-color-scheme='dark']")
    expect(theme).not.toMatch(/admin-?lte|bootstrap|jquery|tabler/i)
})

it.each(['production', 'development'])(
    '%s bundle contains Tailwind output and the night-watch theme',
    (profile) => {
        const manifest = readJson('public/default/asset-manifest.json')
        const entry = manifest.profiles[profile].entries['theme:tailwind']
        const bundle = read(`public/default/${entry.styles[0].file}`)

        expect(entry.scripts).toEqual([])
        expect(bundle).toContain('tailwindcss v4.3.3')
        expect(bundle).toContain('--tw-font-display')
        expect(bundle).toContain('--soa-primary-color:#405cf5')
        expect(bundle).toContain('.soa-nav-link.active:before')
        expect(bundle).not.toMatch(/\.tw\\:collapse|\.collapse\{visibility:collapse/)
    },
)

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function readJson(path) {
    return JSON.parse(read(path))
}
