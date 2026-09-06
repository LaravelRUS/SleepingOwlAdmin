import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('removes the unused jQuery Form and Noty wrappers', () => {
    const packageJson = readJson('package.json')
    const packageLock = readJson('package-lock.json')
    const bootstrap = read('resources/assets/js_owl/bootstrap.js')

    expect(packageJson.dependencies).not.toHaveProperty('jquery-form')
    expect(packageLock.packages[''].dependencies).not.toHaveProperty('jquery-form')
    expect(packageLock.packages).not.toHaveProperty('node_modules/jquery-form')
    expect(bootstrap).not.toMatch(/jquery-form|libs\/noty/)
    expect(wrapperExists('jquery-form.js')).toBe(false)
    expect(wrapperExists('noty.js')).toBe(false)
})

it('removes the legacy theme callback adapter and dead jQuery table draft', () => {
    const callbacks = read('resources/frontend/features/table/actions/named-action-callbacks.js')
    const table = read('resources/assets/js_owl/admin/display/table.js')

    expect(callbacks).not.toMatch(/jquery|jQuery|\$\(/)
    expect(table).not.toMatch(/jquery|jQuery|\$\(/)
    expect(
        existsSync(
            resolve(
                root,
                'resources/frontend/features/table/themes/legacy-adminlte/action-callbacks.js',
            ),
        ),
    ).toBe(false)
})

function wrapperExists(name) {
    return existsSync(resolve(root, 'resources/assets/js_owl/libs', name))
}

function readJson(path) {
    return JSON.parse(read(path))
}

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
