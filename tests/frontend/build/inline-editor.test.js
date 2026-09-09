import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..', '..', '..')

function source(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

it('removes direct X-editable, Moment and DateTimePicker dependencies', () => {
    const packageJson = JSON.parse(source('package.json'))
    const packageLock = JSON.parse(source('package-lock.json'))
    const removed = ['bootstrap4-datetimepicker', 'moment', 'tempusdominus-core', 'x-editable-bs4']

    removed.forEach((name) => {
        expect(packageJson.dependencies).not.toHaveProperty(name)
        expect(packageLock.packages[''].dependencies).not.toHaveProperty(name)
    })

    const orphanedAssets = [
        'public/default/images/vendor/x-editable-bs4/dist/jquery-editable/clear.png',
        'public/default/images/vendor/x-editable-bs4/dist/jquery-editable/loading.gif',
        'public/ckeditor/adapters/jquery.js',
    ]

    orphanedAssets.forEach((path) => {
        expect(existsSync(resolve(root, path)), path).toBe(false)
    })
})

it('keeps the headless runtime free of jQuery and plugin wrappers', () => {
    const runtime = [
        source('resources/js/shared/features/table/editing/inline-editor.js'),
        source('resources/js/shared/features/table/editing/inline-editor-config.js'),
        source('resources/js/shared/features/table/editing/inline-editor-request.js'),
        source('resources/js/shared/features/table/editing/inline-editor-control.js'),
        source('resources/js/shared/features/table/editing/inline-editor-template.js'),
        source('resources/js/shared/features/table/editing/inline-editor-view.js'),
    ].join('\n')

    expect(runtime).not.toMatch(/jquery|jQuery|\$\(|\.editable\(|datetimepicker|moment/i)
    expect(runtime).not.toMatch(/createElement\s*\(/)
    expect(source('resources/js/shared/legacy/bootstrap.js')).not.toMatch(
        /libs\/(?:xeditable|datetimepicker|moment)/,
    )
    expect(existsSync(resolve(root, 'resources/js/shared/legacy/libs/xeditable.js'))).toBe(false)
})

it('keeps geometry in the shared table feature and themes limited to token values', () => {
    const shared = source('resources/css/shared/features/table/_inline-editor.scss')
    const contract = source('resources/css/shared/_tokens.scss')
    const adminlte = source('resources/css/themes/adminlte/_tokens.scss')
    const shadcn = source('resources/css/themes/shadcn/_tokens.scss')

    expect(shared).toContain('.soa-inline-editor-popup')
    expect(shared).toContain('var(--soa-inline-editor-accent)')
    expect(contract).toContain('--soa-inline-editor-accent:')
    expect(adminlte).toContain('--soa-inline-editor-accent:')
    expect(shadcn).toContain('--soa-inline-editor-shadow:')
    expect(shared).not.toContain('#')
    expect(
        existsSync(
            resolve(root, 'resources/css/themes/adminlte/features/table/_inline-editor.scss'),
        ),
    ).toBe(false)
    expect(
        existsSync(resolve(root, 'resources/css/themes/shadcn/features/table/_inline-editor.scss')),
    ).toBe(false)
})
