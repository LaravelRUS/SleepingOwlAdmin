import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

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

function manifestPath(output) {
    return `/${output.replaceAll('\\', '/')}`
}

function contentHash(path) {
    return createHash('md5').update(readFileSync(path)).digest('hex')
}

function checksum(path) {
    return `sha256:${createHash('sha256').update(readFileSync(path)).digest('hex')}`
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

    it('keeps the compiled core free of frontend frameworks and feature engines', () => {
        const core = readFileSync(resolve(root, 'public/default/js/admin-core.js'), 'utf8')

        expect(core).not.toMatch(
            /jquery|jQuery|bootstrap|admin-lte|AdminLTE|DataTable|\bVue\b|@vue/,
        )
    })

    it('keeps framework and theme CSS out of the compiled core stylesheet', () => {
        const core = readFileSync(resolve(root, 'public/default/css/admin-core.css'), 'utf8')

        expect(core).toContain('@layer sleepingowl-core, sleepingowl-feature, sleepingowl-theme')
        expect(core).not.toMatch(/bootstrap|adminlte|tailwind|dataTables/i)
    })

    it('publishes multiple-file styles in the forms feature and legacy aggregate', () => {
        const forms = readFileSync(resolve(root, 'public/default/css/features/forms.css'), 'utf8')
        const legacy = readFileSync(resolve(root, 'public/default/css/admin-app.css'), 'utf8')
        const selector = '.fileUploadMultiple .files-group .fileThumbnail'

        expect(forms).toContain('@layer sleepingowl-feature.forms')
        expect(forms).toContain(selector)
        expect(legacy).toContain(selector)
    })
})

describe('logical asset manifest', () => {
    it('publishes schema and build metadata', () => {
        expect(assetManifest.schema_version).toBe(1)
        expect(assetManifest.package_version).toMatch(/\S+/)
        expect(assetManifest.build_id).toMatch(/^sha256:[a-f0-9]{64}$/)
        expect(Object.keys(assetManifest.profiles)).toEqual(['production'])
    })

    it.each([...modernEntries('scripts'), ...modernEntries('styles')])(
        'maps $logicalId to a versioned and checksummed $output',
        ({ logicalId, output }) => {
            const type = output.endsWith('.js') ? 'scripts' : 'styles'
            const publicPath = resolve(root, 'public/default', output)
            const assets = assetManifest.profiles.production.entries[logicalId][type]
            const asset = assets.find(({ file }) => file === output)

            expect(asset.version).toBe(contentHash(publicPath))
            expect(asset.checksum).toBe(checksum(publicPath))
        },
    )
})

describe('compiled runtime properties', () => {
    it('publishes bundle-owned runtime custom properties', () => {
        const expectations = {
            'css/admin-core.css': ['--soa-text-color', '--soa-motion-duration-normal'],
            'css/features/forms.css': [
                '--soa-form-control-text-color',
                '--soa-form-file-thumbnail-border-color',
            ],
            'css/features/table.css': ['--soa-table-text-color', '--soa-table-row-selected-color'],
            'css/themes/legacy-adminlte.css': ['--soa-sidebar-bg', '--soa-sidebar-width'],
            'css/themes/tailwind.css': ['--soa-sidebar-bg', '--soa-sidebar-width'],
        }

        for (const [path, properties] of Object.entries(expectations)) {
            const css = readFileSync(resolve(root, 'public/default', path), 'utf8')

            expect(css).toContain(':root')
            properties.forEach((property) => expect(css).toContain(property))
        }
    })

    it('keeps the sidebar variable live in both color schemes and the legacy aggregate', () => {
        const theme = readFileSync(
            resolve(root, 'public/default/css/themes/legacy-adminlte.css'),
            'utf8',
        )
        const legacy = readFileSync(resolve(root, 'public/default/css/admin-app.css'), 'utf8')

        expect(theme).toContain('data-soa-color-scheme')
        expect(theme).toContain('var(--soa-sidebar-bg')
        expect(legacy).toContain('var(--soa-sidebar-bg')
    })
})
