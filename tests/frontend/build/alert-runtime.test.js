import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('replaces Bootstrap alert execution while preserving the public marker', () => {
    const views = ['error', 'info', 'success', 'warning']
        .map((type) =>
            read(`resources/views/themes/legacy/default/_partials/messages/${type}.blade.php`),
        )
        .join('\n')
    const runtime = [
        read('resources/assets/js_owl/admin/alert.js'),
        read('resources/frontend/features/alert/alerts.js'),
        read('resources/frontend/features/alert/alert-elements.js'),
    ].join('\n')

    expect(views).toContain('data-dismiss="alert"')
    expect(views).not.toContain('data-soa-alert')
    expect(runtime).toContain('[data-dismiss="alert"]')
    expect(runtime).not.toMatch(/jquery|jQuery|\$\(|bootstrap/i)
})

it('ships alert behavior as an independent no-build entry', () => {
    const entries = JSON.parse(read('build/frontend-entries.json'))
    const entry = entries.modern.scripts.find(({ logicalId }) => logicalId === 'feature:alert')

    expect(entry).toEqual({
        logicalId: 'feature:alert',
        output: 'js/features/alert.js',
        source: 'resources/frontend/features/alert/browser.js',
    })
    expect(entries.modern.styles.some(({ logicalId }) => logicalId === 'feature:alert')).toBe(false)
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
