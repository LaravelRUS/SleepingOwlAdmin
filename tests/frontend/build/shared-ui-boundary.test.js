import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const entryPath = resolve(root, 'resources/css/shared/shared-ui.scss')
const partialsDirectory = resolve(root, 'resources/css/shared/ui')
const partialNames = readdirSync(partialsDirectory)
    .filter((name) => name.endsWith('.scss'))
    .sort()
const entry = readFileSync(entryPath, 'utf8')
const partials = partialNames.map((name) => readFileSync(resolve(partialsDirectory, name), 'utf8'))
const rulesSource = partials.join('\n')
const source = [entry, rulesSource].join('\n')
const compiled = readFileSync(resolve(root, 'public/default/css/shared/ui.css'), 'utf8')

describe('shared semantic UI source ownership', () => {
    it('keeps one logical entry composed from element-level source owners', () => {
        expect(partialNames).toEqual([
            '_attachments.scss',
            '_containers.scss',
            '_controls.scss',
            '_fixed-controls.scss',
            '_forms.scss',
            '_foundation.scss',
            '_shell.scss',
        ])

        for (const owner of partialNames.map((name) => name.slice(1, -5))) {
            expect(entry).toContain(`@use 'ui/${owner}';`)
            expect(entry).toContain(`@include ${owner}.styles;`)
        }

        for (const partial of partials) {
            expect(partial).not.toMatch(/@(import|use)\b/)
        }
    })
})

describe('shared semantic UI compiled boundary', () => {
    it('ships shell, controls, containers and fixed-control geometry', () => {
        for (const selector of [
            '.soa-app',
            '.soa-header',
            '.soa-sidebar',
            '.soa-main',
            '.soa-footer',
            '.soa-asset-health',
            '.soa-scroll-control',
            '.soa-button',
            '.soa-input',
            '.soa-card',
            '.soa-attachment',
            '.soa-dialog',
        ]) {
            expect(compiled).toContain(selector)
        }

        expect(compiled).toContain('@layer sleepingowl-shared')
        expect(compiled).toContain('grid-template-columns')
        expect(compiled).toMatch(/prefers-reduced-motion\s*:\s*reduce/)
    })

    it('does not import frameworks or declare palette literals', () => {
        expect(source).not.toMatch(/bootstrap|admin-?lte|tailwind/i)
        expect(source).not.toMatch(/#[\da-f]{3,8}\b|\b(?:rgb|hsl)a?\(/i)
    })
})

describe('shared semantic UI selector boundary', () => {
    it('uses only semantic classes and documented layout state hooks', () => {
        const allowedStateHooks = new Set([
            'hide',
            'has-error',
            'menu-open',
            'show',
            'collapsed-card',
            'sidebar-collapse',
            'sidebar-closed',
            'sidebar-open',
        ])
        const classes = [...rulesSource.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((match) => match[1])
        const violations = [...new Set(classes)].filter(
            (className) => !className.startsWith('soa-') && !allowedStateHooks.has(className),
        )

        expect(violations).toEqual([])
    })
})
