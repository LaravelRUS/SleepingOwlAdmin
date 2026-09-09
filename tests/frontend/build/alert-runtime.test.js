import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')

it('replaces Bootstrap alert execution while preserving the public marker', () => {
    const views = ['error', 'info', 'success', 'warning']
        .map((type) =>
            read(`resources/views/themes/adminlte/default/_partials/messages/${type}.blade.php`),
        )
        .join('\n')
    const runtime = [
        read('resources/js/shared/legacy/admin/alert.js'),
        read('resources/js/shared/features/alert/alerts.js'),
        read('resources/js/shared/features/alert/alert-elements.js'),
    ].join('\n')

    expect(views).toContain('data-dismiss="alert"')
    expect(views).not.toContain('data-alert')
    expect(runtime).toContain('[data-dismiss="alert"]')
    expect(runtime).not.toMatch(/jquery|jQuery|\$\(|bootstrap/i)
})

it('ships alert behavior through the consolidated feature runtime', () => {
    const entries = JSON.parse(read('build/frontend-entries.json'))
    const entry = entries.modern.scripts.find(({ logicalId }) => logicalId === 'shared:features')

    expect(entry).toEqual({
        logicalId: 'shared:features',
        output: 'js/shared/features.js',
        source: 'resources/js/shared/features/browser.js',
    })
    expect(read(entry.source)).toContain("import './alert/browser.js'")
})

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}
