import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const themeId = 'framework-free-test'
const logicalId = `theme:${themeId}`

describe('framework-free ThemeInterface acceptance bundle', () => {
    it('publishes only Sass presentation entries and no theme JavaScript', () => {
        const entries = readJson('build/frontend-entries.json').modern
        const styleIds = entries.styles.map((entry) => entry.logicalId)
        const scriptIds = entries.scripts.map((entry) => entry.logicalId)

        expect(styleIds).toContain(logicalId)
        expect(scriptIds.some((logicalId) => logicalId?.includes(themeId))).toBe(false)
    })

    it.each(['production', 'development'])('%s assets contain no UI framework', (profile) => {
        const manifest = readJson('public/default/asset-manifest.json')
        const entries = manifest.profiles[profile].entries
        const styles = entries[logicalId].styles

        expect(styles).toHaveLength(1)
        for (const asset of styles) {
            const css = read(`public/default/${asset.file}`)

            expect(css).not.toMatch(/bootstrap|admin-lte|tailwind|font[ -]?awesome/i)
        }
    })

    it('keeps visible classes and theme tokens in the standalone theme bundle', () => {
        const css = read('public/default/css/themes/framework-free-test.css')

        expect(css).toContain('.workbench-shell')
        expect(css).toContain('.workbench-button')
        expect(css).toContain('--soa-primary-color')
        expect(css).toContain('data-color-scheme')
    })
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function readJson(path) {
    return JSON.parse(read(path))
}
