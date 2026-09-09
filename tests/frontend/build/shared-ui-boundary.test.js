import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const source = readFileSync(resolve(root, 'resources/css/shared/shared-ui.scss'), 'utf8')
const compiled = readFileSync(resolve(root, 'public/default/css/shared/ui.css'), 'utf8')

describe('shared semantic UI boundary', () => {
    it('ships shell and fixed-control geometry from the shared layer', () => {
        for (const selector of [
            '.soa-app',
            '.soa-header',
            '.soa-sidebar',
            '.soa-main',
            '.soa-footer',
            '.soa-asset-health',
            '.soa-scroll-control',
        ]) {
            expect(compiled).toContain(selector)
        }

        expect(compiled).toContain('@layer sleepingowl-shared')
        expect(compiled).toContain('grid-template-columns')
        expect(compiled).toMatch(/prefers-reduced-motion\s*:\s*reduce/)
    })

    it('does not import frameworks or declare palette literals', () => {
        expect(source).not.toMatch(/@(import|use)\b/)
        expect(source).not.toMatch(/bootstrap|admin-?lte|tailwind/i)
        expect(source).not.toMatch(/#[\da-f]{3,8}\b|\b(?:rgb|hsl)a?\(/i)
    })

    it('uses only semantic classes and documented layout state hooks', () => {
        const allowedStateHooks = new Set([
            'hide',
            'menu-open',
            'show',
            'sidebar-collapse',
            'sidebar-closed',
            'sidebar-open',
        ])
        const classes = [...source.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((match) => match[1])
        const violations = [...new Set(classes)].filter(
            (className) => !className.startsWith('soa-') && !allowedStateHooks.has(className),
        )

        expect(violations).toEqual([])
    })
})
