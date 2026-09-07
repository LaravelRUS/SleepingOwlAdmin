import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('ships an executable tooltip browser entry without jQuery', () => {
    const entry = readFileSync(
        resolve(root, 'public/default/profiles/production/js/features/tooltip.js'),
        'utf8',
    )

    expect(entry.length).toBeGreaterThan(1000)
    expect(entry).toContain('data-toggle')
    expect(entry).not.toMatch(/(?:\$|jQuery)\s*\(/)
})

it('keeps the legacy trigger and renders the normal popup from a Blade template', () => {
    const base = read('resources/views/themes/legacy/default/_layout/base.blade.php')
    const partial = read('resources/views/themes/legacy/default/_partials/tooltip.blade.php')
    const elements = read('resources/frontend/features/tooltip/tooltip-elements.js')
    const runtime = read('resources/frontend/features/tooltip/tooltips.js')
    const template = read('resources/frontend/features/tooltip/tooltip-template.js')

    expect(base).toContain('_partials.tooltip')
    expect(partial).toContain('data-soa-tooltip-template')
    expect(partial).toContain('data-soa-tooltip-popup')
    expect(partial).toContain('data-soa-tooltip-content')
    expect(elements).toContain('[data-toggle="tooltip"]')
    expect(runtime).not.toContain('createElement(')
    expect(template).toContain("document.createElement('div')")
    expect(`${base}\n${partial}\n${elements}`).not.toContain('data-soa-tooltip="')
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
