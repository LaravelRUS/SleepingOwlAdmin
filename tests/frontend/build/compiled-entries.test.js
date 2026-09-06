import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
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
