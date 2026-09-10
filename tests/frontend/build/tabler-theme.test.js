import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const entries = JSON.parse(readFileSync(resolve(root, 'build/frontend-entries.json'), 'utf8'))
const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const lock = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8'))
const source = (path) => readFileSync(resolve(root, path), 'utf8')

describe('Tabler package boundary', () => {
    it('pins the official package and publishes one CSS-only logical entry', () => {
        expect(packageJson.dependencies['@tabler/core']).toBe('1.5.1')
        expect(lock.packages['node_modules/@tabler/core']).toMatchObject({
            version: '1.5.1',
            integrity:
                'sha512-PI9rJq4H4lBh53YP/J+m5Uz6lqVQbsGPmWCMN34IP4KQQ/wy28YMO6a3Eiz1cQHdFFr+3MlU3yYhXdzvFGJfqw==',
            license: 'MIT',
        })

        const scripts = entries.modern.scripts.filter(
            ({ logicalId }) => logicalId === 'theme:tabler',
        )
        const styles = entries.modern.styles.filter(({ logicalId }) => logicalId === 'theme:tabler')

        expect(scripts).toEqual([])
        expect(styles).toEqual([
            {
                logicalId: 'theme:tabler',
                source: 'resources/css/themes/tabler/theme.scss',
                output: 'css/themes/tabler.css',
            },
        ])
    })
})

it('keeps the Tabler vendor import and variable bridge inside the theme', () => {
    const framework = source('resources/css/themes/tabler/_framework.scss')
    const tokens = source('resources/css/themes/tabler/_tokens.scss')

    expect(framework).toContain('@tabler/core/dist/css/tabler.css')
    expect(tokens).toContain('--soa-primary-color')
    expect(tokens).toContain('--tblr-primary')
    expect(tokens).toContain(":root[data-color-scheme='dark']")
})

it('does not introduce cross-theme or duplicated Tabler runtime dependencies', () => {
    const tablerSources = [
        'resources/css/themes/tabler/theme.scss',
        'resources/css/themes/tabler/_framework.scss',
        'resources/css/themes/tabler/_tokens.scss',
        'resources/css/themes/tabler/_components.scss',
        'resources/css/themes/tabler/features/_sidebar.scss',
        'resources/css/themes/tabler/features/_table.scss',
        'resources/css/themes/tabler/features/_forms.scss',
    ]
        .map(source)
        .join('\n')

    expect(tablerSources).not.toMatch(/admin-?lte|tailwind|jquery|fontawesome/i)
    expect(
        entries.modern.styles.filter(({ logicalId }) => logicalId === 'shared:icons'),
    ).toHaveLength(1)
})
