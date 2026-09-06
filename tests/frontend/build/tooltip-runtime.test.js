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
