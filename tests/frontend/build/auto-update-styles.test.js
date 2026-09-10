import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const sharedPartial = 'resources/css/shared/features/table/_auto-update.scss'

it('keeps auto-update presentation in one shared source owner', () => {
    const source = read(sharedPartial)
    const tableEntry = read('resources/css/shared/features/table/table.scss')

    for (const hook of [
        'data-admin-table-autoupdate-bar',
        'data-admin-table-autoupdate-toggle',
        'data-admin-table-autoupdate-label',
    ]) {
        expect(source).toContain(hook)
    }

    expect(tableEntry).toContain("@use 'auto-update';")
    expect(tableEntry).toContain('@include auto-update.styles;')
    expect(
        existsSync(resolve(root, 'resources/css/themes/adminlte/features/table/_auto-update.scss')),
    ).toBe(false)
    expect(
        existsSync(resolve(root, 'resources/css/themes/shadcn/features/table/_auto-update.scss')),
    ).toBe(false)
})

it('keeps auto-update selectors out of theme presentation sources', () => {
    const themeSources = filesUnder(resolve(root, 'resources/css/themes'))
        .map((path) => readFileSync(path, 'utf8'))
        .join('\n')

    expect(themeSources).not.toMatch(/autoupdater|data-admin-table-autoupdate/)
})

it('publishes auto-update presentation in shared features and the legacy aggregate', () => {
    for (const output of [
        'public/default/css/shared/features.css',
        'public/default/css/admin-app.css',
    ]) {
        expect(read(output)).toContain('[data-admin-table-autoupdate-bar]')
        expect(read(output)).toContain('[data-admin-table-autoupdate-toggle]')
    }
})

function filesUnder(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = resolve(directory, entry.name)

        if (entry.isDirectory()) return filesUnder(path)

        return entry.isFile() && entry.name.endsWith('.scss') ? [path] : []
    })
}

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
