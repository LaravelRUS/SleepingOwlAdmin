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
})

it('keeps the headless runtime free of jQuery and plugin wrappers', () => {
    const runtime = [
        source('resources/frontend/features/table/editing/inline-editor.js'),
        source('resources/frontend/features/table/editing/inline-editor-config.js'),
        source('resources/frontend/features/table/editing/inline-editor-request.js'),
        source('resources/frontend/features/table/editing/inline-editor-view.js'),
    ].join('\n')

    expect(runtime).not.toMatch(/jquery|jQuery|\$\(|\.editable\(|datetimepicker|moment/i)
    expect(source('resources/assets/js_owl/bootstrap.js')).not.toMatch(
        /libs\/(?:xeditable|datetimepicker|moment)/,
    )
    expect(existsSync(resolve(root, 'resources/assets/js_owl/libs/xeditable.js'))).toBe(false)
})

it('keeps presentation in Sass adapters owned by each theme', () => {
    const legacy = source(
        'resources/frontend/features/table/themes/legacy-adminlte/styles/_inline-editor.scss',
    )
    const tailwind = source(
        'resources/frontend/features/table/themes/tailwind/styles/_inline-editor.scss',
    )

    expect(legacy).toContain('var(--soa-inline-editor-accent)')
    expect(tailwind).toContain('var(--soa-inline-editor-accent)')
    expect(legacy).not.toContain('#')
    expect(tailwind).not.toContain('#')
})
