import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTablerBundleReport } from '../../../scripts/modernization/report-tabler-bundles.mjs'

const root = resolve(import.meta.dirname, '../../..')
const reportPath = resolve(root, 'docs/modernization/tabler-bundle-report.json')

describe('Tabler bundle report', () => {
    it('matches both published profiles and the frozen upstream snapshot', () => {
        const saved = JSON.parse(readFileSync(reportPath, 'utf8'))
        const current = buildTablerBundleReport()

        expect(saved).toEqual(current)
        expect(current.upstream).toMatchObject({
            package: '@tabler/core',
            version: '1.5.1',
            license: 'MIT',
        })
        expect(current.profiles.production.entries['theme:tabler'].assets).toHaveLength(1)
        expect(current.profiles.development.entries['theme:tabler'].assets).toHaveLength(1)
    })

    it('proves the CSS-only, local and cross-theme-isolated boundary', () => {
        const report = buildTablerBundleReport()

        expect(report.selection.publishedStaticFiles).toBe(0)
        expect(report.selection.publishedThemeScripts).toBe(0)
        expect(report.selection.externalAssetUrls).toEqual([])
        expect(report.isolation).toEqual({
            adminlte: false,
            tailwind: false,
            jquery: false,
            'font awesome': false,
        })
    })
})
