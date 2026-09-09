import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('pins Tailwind 4 build-only dependencies and an explicit PostCSS entry', () => {
    const packageJson = readJson('package.json')
    const entries = readJson('build/frontend-entries.json').modern.styles.filter(
        ({ logicalId }) => logicalId === 'theme:shadcn',
    )

    expect(packageJson.dependencies.tailwindcss).toBeUndefined()
    expect(packageJson.dependencies['@tailwindcss/postcss']).toBeUndefined()
    expect(packageJson.devDependencies.tailwindcss).toBe('4.3.3')
    expect(packageJson.devDependencies['@tailwindcss/postcss']).toBe('4.3.3')
    expect(entries).toContainEqual({
        logicalId: 'theme:shadcn',
        output: 'css/themes/shadcn-utilities.css',
        processor: 'postcss',
        source: 'resources/css/themes/shadcn/tailwind.input.css',
    })
})

it('uses explicit Tailwind sources and a canonical-token preset without preflight', () => {
    const input = read('resources/css/themes/shadcn/tailwind.input.css')
    const config = read('resources/css/themes/shadcn/tailwind.config.cjs')
    const preset = read('resources/css/themes/shadcn/tailwind.preset.cjs')

    expect(input).toContain("tailwindcss/utilities.css' layer(utilities) source(none)")
    expect(input).toContain("@config './tailwind.config.cjs'")
    expect(input).toContain("@source '../../../views/themes/shadcn'")
    expect(input).toContain("@source inline('flex grid')")
    expect(config).toContain('./resources/views/themes/shadcn/**/*.blade.php')
    expect(config).toContain("require('./tailwind.preset.cjs')")
    expect(preset).toContain('var(--soa-primary-color)')
    expect(preset).toContain('var(--soa-surface-color)')
    expect(preset).not.toMatch(/#[\da-f]{3,8}\b|oklch\(/i)
    expect(input).not.toMatch(/preflight|tailwindcss\/preflight/i)
})

it.each(['production', 'development'])(
    'ships a framework-free %s Tailwind utility layer',
    (profile) => {
        const css = read(`public/default/profiles/${profile}/css/themes/shadcn-utilities.css`)

        expect(css).toContain('@layer utilities')
        expect(css).toMatch(/\.float-end\b/)
        expect(css).toMatch(/\.flex\b/)
        expect(css).toMatch(/\.grid\b/)
        expect(css).toMatch(/\.hidden\b/)
        expect(css).not.toMatch(
            /bootstrap|admin-lte|adminlte|jquery|react|radix|lucide|oklch\(|#[\da-f]{3,8}\b/i,
        )
    },
)

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function readJson(path) {
    return JSON.parse(read(path))
}
