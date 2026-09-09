import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildAdminLteBundleReport } from '../../../scripts/modernization/report-adminlte-bundles.mjs'

const root = resolve(import.meta.dirname, '../../..')
const reportPath = resolve(root, 'docs/modernization/adminlte-bundle-measurements.json')

describe('AdminLTE bundle measurements', () => {
    it('matches the current versioned production and development assets', () => {
        const saved = JSON.parse(readFileSync(reportPath, 'utf8'))

        expect(saved).toEqual(buildAdminLteBundleReport())
        expect(saved.profiles.production.totals.files).toBeGreaterThan(0)
        expect(saved.profiles.development.totals.files).toBeGreaterThan(0)
    })

    it('reports every runtime boundary separately', () => {
        const entries = Object.keys(buildAdminLteBundleReport().profiles.production.entries)

        expect(entries).toContain('core')
        expect(entries).toContain('shared:vue')
        expect(entries).toContain('feature:table')
        expect(entries).toContain('feature:table:theme:adminlte')
        expect(entries).toContain('theme:adminlte')
        expect(entries).not.toContain('theme:shadcn')
    })
})
