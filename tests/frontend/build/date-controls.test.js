import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const packageJson = readJson('package.json')
const packageLock = readJson('package-lock.json')

function readJson(path) {
    return JSON.parse(readSource(path))
}

function readSource(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

describe('Air Datepicker migration boundary', () => {
    it('pins the native picker and removes the first-party daterangepicker runtime', () => {
        const bootstrap = readSource('resources/js/shared/legacy/bootstrap.js')

        expect(packageJson.dependencies['air-datepicker']).toBe('3.6.0')
        expect(packageLock.packages['node_modules/air-datepicker'].version).toBe('3.6.0')
        expect(bootstrap).toContain("require('./admin/form/date-controls')")
        expect(bootstrap).not.toMatch(/libs\/daterangepicker|admin\/form\/daterange/)
        expect(existsSync(resolve(root, 'resources/js/shared/legacy/libs/daterangepicker.js'))).toBe(
            false,
        )
        expect(existsSync(resolve(root, 'resources/js/shared/legacy/admin/form/daterange.js'))).toBe(
            false,
        )
    })

    it('keeps date behavior free of jQuery and old picker APIs', () => {
        const files = [
            'resources/js/shared/features/forms/date/date-control.js',
            'resources/js/shared/features/forms/date/date-format.js',
            'resources/js/shared/features/forms/date/date-options.js',
            'resources/js/shared/features/forms/date/date-range-options.js',
            'resources/js/shared/features/forms/date/install-date-controls.js',
        ]
        const source = files.map(readSource).join('\n')

        expect(source).not.toMatch(/jquery|jQuery|\$\(|datetimepicker|daterangepicker|moment/i)
    })
})
