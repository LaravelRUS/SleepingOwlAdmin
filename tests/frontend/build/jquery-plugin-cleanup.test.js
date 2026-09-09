import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('removes the unused jQuery Form and Noty wrappers', () => {
    const packageJson = readJson('package.json')
    const packageLock = readJson('package-lock.json')
    const bootstrap = read('resources/js/shared/legacy/bootstrap.js')

    expect(packageJson.dependencies).not.toHaveProperty('jquery-form')
    expect(packageLock.packages[''].dependencies).not.toHaveProperty('jquery-form')
    expect(packageLock.packages).not.toHaveProperty('node_modules/jquery-form')
    expect(bootstrap).not.toMatch(/jquery-form|libs\/noty/)
    expect(wrapperExists('jquery-form.js')).toBe(false)
    expect(wrapperExists('noty.js')).toBe(false)
})

it('does not publish jQuery or Bootstrap JavaScript globals', () => {
    const packageJson = readJson('package.json')
    const packageLock = readJson('package-lock.json')
    const bootstrap = read('resources/js/shared/legacy/bootstrap.js')

    expect(packageJson.dependencies).not.toHaveProperty('jquery')
    expect(packageLock.packages[''].dependencies).not.toHaveProperty('jquery')
    expect(bootstrap).not.toMatch(/libs\/(?:jquery|bootstrap)/)
    expect(wrapperExists('jquery.js')).toBe(false)
    expect(wrapperExists('bootstrap.js')).toBe(false)
})

it('keeps first-party runtime sources free of jQuery calls', () => {
    const sources = ['resources/js', 'resources/views']
        .flatMap(sourceFiles)
        .map(read)
        .join('\n')

    expect(sources).not.toMatch(/jquery|jQuery|\$\(/i)
})

it('keeps first-party data attributes free of a package prefix', () => {
    const sources = ['src', 'resources/js', 'resources/views']
        .flatMap(sourceFiles)
        .map(read)
        .join('\n')

    expect(sources).not.toContain('data-soa-')
})

it('removes the legacy theme callback adapter and dead jQuery table draft', () => {
    const callbacks = read('resources/js/shared/features/table/actions/named-action-callbacks.js')
    const table = read('resources/js/shared/legacy/admin/display/table.js')

    expect(callbacks).not.toMatch(/jquery|jQuery|\$\(/)
    expect(table).not.toMatch(/jquery|jQuery|\$\(/)
    expect(
        existsSync(
            resolve(
                root,
                'resources/js/themes/adminlte/features/table/action-callbacks.js',
            ),
        ),
    ).toBe(false)
})

function wrapperExists(name) {
    return existsSync(resolve(root, 'resources/js/shared/legacy/libs', name))
}

function readJson(path) {
    return JSON.parse(read(path))
}

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function sourceFiles(path) {
    return readdirSync(resolve(root, path), { withFileTypes: true }).flatMap((entry) => {
        const child = `${path}/${entry.name}`

        return entry.isDirectory() ? sourceFiles(child) : runtimeSource(child)
    })
}

function runtimeSource(path) {
    return /\.(?:php|js|vue)$/.test(path) ? [path] : []
}
