import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const logicalId = 'theme:empty'

describe('empty diagnostic theme', () => {
    it('has one CSS entry and no theme JavaScript', () => {
        const entries = readJson('build/frontend-entries.json').modern

        expect(entries.styles.filter((entry) => entry.logicalId === logicalId)).toHaveLength(1)
        expect(entries.scripts.some((entry) => entry.logicalId === logicalId)).toBe(false)
    })

    it.each(['production', 'development'])('%s bundle contains no style rules', (profile) => {
        const manifest = readJson('public/default/asset-manifest.json')
        const styles = manifest.profiles[profile].entries[logicalId].styles

        expect(styles).toHaveLength(1)
        expect(read(`public/default/${styles[0].file}`)).not.toContain('{')
    })

    it.each(['production', 'development'])(
        '%s inherits scroll controls from the shared feature runtime',
        (profile) => {
            const entries = readJson('public/default/asset-manifest.json').profiles[profile].entries
            const sharedRuntime = read(
                `public/default/${entries['shared:features'].scripts[0].file}`,
            )
            const adminLteRuntime = read(
                `public/default/${entries['theme:adminlte'].scripts[0].file}`,
            )

            expect(sharedRuntime).toContain('sleepingowl.shared.features.scroll-controls')
            expect(sharedRuntime).toContain('scrolltotop')
            expect(adminLteRuntime).not.toContain('scrolltotop')
        },
    )
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function readJson(path) {
    return JSON.parse(read(path))
}
