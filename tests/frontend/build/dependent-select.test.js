import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const packageJson = readJson('package.json')
const packageLock = readJson('package-lock.json')

describe('dependent select build boundary', () => {
    it('uses the shared Vue island without the jQuery plugin', () => {
        const bootstrap = readSource('resources/assets/js_owl/bootstrap.js')
        const component = readSource('resources/assets/js_owl/admin/form/select.vue')
        const view = readSource(
            'resources/views/themes/legacy/default/form/element/dependentselect.blade.php',
        )

        expect(packageJson.dependencies).not.toHaveProperty('dependent-dropdown')
        expect(packageLock.packages[''].dependencies).not.toHaveProperty('dependent-dropdown')
        expect(bootstrap).not.toMatch(/dependent-dropdown|admin\/form\/dependent-select/)
        expect(component).toContain(
            "import { createDependentSelectLoad } from './select-dependent-load'",
        )
        expect(view).toContain("'selectExtraProps' => ['dependent' => $dependentSelect]")
        expect(view).not.toMatch(/Form::select|html\(\)->select/)
        expect(
            existsSync(resolve(root, 'resources/assets/js_owl/admin/form/dependent-select.js')),
        ).toBe(false)
        expect(
            existsSync(resolve(root, 'resources/assets/js_owl/libs/dependent-dropdown.js')),
        ).toBe(false)
    })
})

function readJson(path) {
    return JSON.parse(readSource(path))
}

function readSource(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
