import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const assetManifest = readJson('public/default/asset-manifest.json')
const buildEntries = readJson('build/frontend-entries.json')
const mixManifest = readJson('public/default/mix-manifest.json')

function readJson(path) {
    return JSON.parse(readFileSync(resolve(root, path), 'utf8'))
}

function modernEntries(type) {
    return buildEntries.modern[type]
}

function profileCases() {
    return ['production', 'development'].flatMap((profile) =>
        [...modernEntries('scripts'), ...modernEntries('styles')].map((entry) => ({
            profile,
            ...entry,
        })),
    )
}

function manifestPath(output) {
    return `/${output.replaceAll('\\', '/')}`
}

function contentHash(path) {
    return createHash('md5').update(readFileSync(path)).digest('hex')
}

function checksum(path) {
    return `sha256:${createHash('sha256').update(readFileSync(path)).digest('hex')}`
}

function filesUnder(path) {
    return readdirSync(resolve(root, path), { withFileTypes: true }).flatMap((entry) => {
        const child = `${path}/${entry.name}`

        return entry.isDirectory() ? filesUnder(child) : [child]
    })
}

describe('compiled frontend entries', () => {
    it.each([...modernEntries('scripts'), ...modernEntries('styles')])(
        'publishes a versioned $logicalId entry at $output',
        ({ output }) => {
            const publicPath = resolve(root, 'public/default', output)
            const versionedPath = mixManifest[manifestPath(output)]

            expect(readFileSync(publicPath).byteLength).toBeGreaterThan(0)
            expect(versionedPath).toBe(`${manifestPath(output)}?id=${contentHash(publicPath)}`)
        },
    )
})

describe('compiled form entries', () => {
    it('publishes multiple-file styles in the forms feature and legacy aggregate', () => {
        const forms = readFileSync(resolve(root, 'public/default/css/shared/features.css'), 'utf8')
        const legacy = readFileSync(resolve(root, 'public/default/css/admin-app.css'), 'utf8')
        const selector = '.fileUploadMultiple .files-group .fileThumbnail'

        expect(forms).toContain('@layer sleepingowl-feature.forms')
        expect(forms).toContain(selector)
        expect(legacy).toContain(selector)
    })

    it('publishes theme-token driven Air Datepicker styles in both form bundles', () => {
        const forms = readFileSync(resolve(root, 'public/default/css/shared/features.css'), 'utf8')
        const legacy = readFileSync(resolve(root, 'public/default/css/admin-app.css'), 'utf8')

        for (const css of [forms, legacy]) {
            expect(css).toContain('.air-datepicker')
            expect(css).toContain('--soa-form-date-picker-surface-color')
            expect(css).toContain('var(--soa-form-date-picker-selected-color)')
        }
    })

    it('publishes the Tailwind forms adapter from canonical theme tokens only', () => {
        for (const profile of ['production', 'development']) {
            const forms = readFileSync(
                resolve(root, `public/default/profiles/${profile}/css/themes/shadcn.css`),
                'utf8',
            )

            expect(forms).toContain('@layer sleepingowl-theme.forms')
            expect(forms).toContain('var(--soa-primary-color)')
            expect(forms).toContain('.multiselect__tags')
            expect(forms).toContain('.soa-attachment-list')
        }

        const sources = filesUnder('resources/css/themes/shadcn/features/forms')
            .map((path) => readFileSync(resolve(root, path), 'utf8'))
            .join('\n')
        expect(sources).not.toMatch(/bootstrap|admin-lte|adminlte|jquery|react|radix|lucide/i)
        expect(sources).not.toMatch(/#[\da-f]{3,8}\b/i)
    })
})

describe('compiled Tailwind content adapters', () => {
    it('publishes Tailwind content adapters from canonical theme tokens only', () => {
        for (const profile of ['production', 'development']) {
            for (const feature of ['lightbox', 'tabs', 'tree']) {
                const css = readFileSync(
                    resolve(root, `public/default/profiles/${profile}/css/themes/shadcn.css`),
                    'utf8',
                )

                expect(css).toContain(`@layer sleepingowl-theme.${feature}`)
                expect(css).toMatch(/var\(--soa-(?:primary|text|surface|border|muted)/)

                const sources = filesUnder(`resources/css/themes/shadcn/features/${feature}`)
                    .map((path) => readFileSync(resolve(root, path), 'utf8'))
                    .join('\n')
                expect(sources).not.toMatch(
                    /bootstrap|admin-lte|adminlte|jquery|react|radix|lucide/i,
                )
                expect(sources).not.toMatch(/#[\da-f]{3,8}\b/i)
            }
        }
    })
})

describe('compiled core boundaries', () => {
    it.each(['production', 'development'])(
        'keeps the %s core useful and free of frontend frameworks or feature engines',
        (profile) => {
            const core = readFileSync(
                resolve(root, `public/default/profiles/${profile}/js/admin-core.js`),
                'utf8',
            )

            for (const service of ['Components', 'Events', 'Http', 'Storage', 'Tables']) {
                expect(core).toContain(service)
            }
            expect(core).not.toMatch(
                /jquery|jQuery|bootstrap|admin-lte|AdminLTE|DataTable|\bVue\b|@vue/,
            )
        },
    )

    it('keeps first-party legacy event bridges out of modern table profiles', () => {
        for (const profile of ['production', 'development']) {
            const table = readFileSync(
                resolve(root, `public/default/profiles/${profile}/js/shared/features.js`),
                'utf8',
            )

            expect(table).not.toMatch(/adminlte\/filter-events/)
        }
    })

    it('keeps framework and theme CSS out of the compiled core stylesheet', () => {
        const core = readFileSync(resolve(root, 'public/default/css/admin-core.css'), 'utf8')

        expect(core).toContain(
            '@layer sleepingowl-core, sleepingowl-shared, sleepingowl-feature, sleepingowl-theme, sleepingowl-theme-override',
        )
        expect(core).toContain('[data-cloak]')
        expect(core).toContain('[data-visually-hidden]')
        expect(core).not.toMatch(/bootstrap|adminlte|tailwind|dataTables/i)
    })
})

describe('compiled table boundaries', () => {
    it('excludes jQuery and the Responsive Bootstrap JavaScript adapter', () => {
        const sources = readJson(
            'public/default/profiles/development/js/shared/features.js.map',
        ).sources.map((source) => source.replaceAll('\\', '/'))
        const license = readFileSync(
            resolve(root, 'public/default/profiles/production/js/shared/features.js.LICENSE.txt'),
            'utf8',
        )

        expect(sources.some((source) => source.includes('/node_modules/jquery/'))).toBe(false)
        expect(
            sources.some((source) =>
                source.includes('/node_modules/datatables.net-responsive-bs5/js/'),
            ),
        ).toBe(false)
        expect(license).not.toMatch(/jQuery JavaScript Library|OpenJS Foundation/i)
    })
})

describe('compiled jQuery boundary', () => {
    it('keeps every published JavaScript source map free of the jQuery package', () => {
        const maps = filesUnder('public/default').filter((path) => path.endsWith('.js.map'))

        expect(maps.length).toBeGreaterThan(0)

        for (const path of maps) {
            const sources = readJson(path).sources.map((source) => source.replaceAll('\\', '/'))

            expect(sources, path).not.toContainEqual(
                expect.stringContaining('/node_modules/jquery/'),
            )
        }
    })

    it('keeps every published JavaScript license sidecar free of jQuery', () => {
        const licenses = filesUnder('public/default').filter((path) =>
            path.endsWith('.js.LICENSE.txt'),
        )

        expect(licenses.length).toBeGreaterThan(0)

        for (const path of licenses) {
            expect(readFileSync(resolve(root, path), 'utf8'), path).not.toMatch(
                /jQuery JavaScript Library|jquery\.org\/license/i,
            )
        }
    })
})

describe('logical asset manifest', () => {
    it('publishes schema and build metadata', () => {
        expect(assetManifest.schema_version).toBe(1)
        expect(assetManifest.package_version).toMatch(/\S+/)
        expect(assetManifest.build_id).toMatch(/^sha256:[a-f0-9]{64}$/)
        expect(Object.keys(assetManifest.profiles)).toEqual(['production', 'development'])
        expect(Object.keys(assetManifest.profiles.production.entries)).toEqual(
            Object.keys(assetManifest.profiles.development.entries),
        )
    })

    it.each(profileCases())(
        'maps $profile $logicalId to a versioned and checksummed $output',
        ({ profile, logicalId, output }) => {
            const type = output.endsWith('.js') ? 'scripts' : 'styles'
            const file = `profiles/${profile}/${output}`
            const publicPath = resolve(root, 'public/default', file)
            const assets = assetManifest.profiles[profile].entries[logicalId][type]
            const asset = assets.find((candidate) => candidate.file === file)

            expect(asset.version).toBe(contentHash(publicPath))
            expect(asset.checksum).toBe(checksum(publicPath))
        },
    )

    it.each([...modernEntries('scripts'), ...modernEntries('styles')])(
        'ships source maps only for the development $output',
        ({ output }) => {
            const development = resolve(root, 'public/default/profiles/development', output)
            const production = resolve(root, 'public/default/profiles/production', output)
            const developmentSource = readFileSync(development, 'utf8')
            const productionSource = readFileSync(production, 'utf8')

            expect(developmentSource).toContain('sourceMappingURL=')
            expect(existsSync(`${development}.map`)).toBe(true)
            expect(productionSource).not.toContain('sourceMappingURL=')
            expect(existsSync(`${production}.map`)).toBe(false)
            expect(productionSource.length).toBeLessThan(developmentSource.length)
        },
    )
})

describe('production asset companions', () => {
    it('copies every referenced license sidecar beside its script', () => {
        let references = 0

        for (const { output } of modernEntries('scripts')) {
            const script = resolve(root, 'public/default/profiles/production', output)
            const source = readFileSync(script, 'utf8')
            const match = source.match(/For license information please see ([^\s*]+)/)

            if (!match) continue

            references += 1
            const license = resolve(dirname(script), match[1])
            expect(readFileSync(license, 'utf8').trim()).not.toBe('')
        }

        expect(references).toBeGreaterThan(0)
    })
})

describe('compiled runtime properties', () => {
    it('publishes bundle-owned runtime custom properties', () => {
        const expectations = {
            'css/admin-core.css': ['--soa-focus-ring-width', '--soa-motion-duration-normal'],
            'css/shared/features.css': [
                '--soa-form-control-text-color',
                '--soa-form-file-thumbnail-border-color',
                '--soa-form-date-picker-surface-color',
                '--soa-table-text-color',
                '--soa-table-row-selected-color',
            ],
            'css/themes/adminlte.css': [
                '--soa-sidebar-bg',
                '--soa-sidebar-width',
                '--soa-font-family-sans',
            ],
            'css/themes/shadcn.css': [
                '--soa-sidebar-bg',
                '--soa-sidebar-width',
                '--soa-font-family-sans',
            ],
        }

        for (const [path, properties] of Object.entries(expectations)) {
            const css = readFileSync(resolve(root, 'public/default', path), 'utf8')

            expect(css).toContain(':root')
            properties.forEach((property) => expect(css).toContain(property))
        }
    })

    it('keeps the sidebar variable live in both color schemes and the legacy aggregate', () => {
        const theme = readFileSync(resolve(root, 'public/default/css/themes/adminlte.css'), 'utf8')
        const legacy = readFileSync(resolve(root, 'public/default/css/admin-app.css'), 'utf8')

        expect(theme).toContain('data-color-scheme')
        expect(theme).toContain('var(--soa-sidebar-bg')
        expect(legacy).toContain('var(--soa-sidebar-bg')
    })
})
