import { dirname, resolve } from 'node:path'
import { existsSync, readFileSync, readdirSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const entries = readJson('build/frontend-entries.json').modern.styles
const layerOnlyEntries = new Set(['theme:empty', 'theme:adminlte:overrides'])
const declaredPostcssInputs = new Set(
    entries
        .filter((entry) => entry.processor === 'tailwind')
        .map((entry) => entry.source.replace(/^resources\//, '')),
)
const themeTokenEntries = entries.filter(
    (entry) =>
        entry.source.endsWith('.scss') &&
        entry.logicalId.startsWith('theme:') &&
        !layerOnlyEntries.has(entry.logicalId),
)

function readJson(path) {
    return JSON.parse(readFileSync(resolve(root, path), 'utf8'))
}

function readSource(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function siblingPath(entry, filename) {
    return resolve(root, dirname(entry.source), filename)
}

describe('Sass aggregate entries', () => {
    it('keeps the shared feature entry as a thin aggregate of owned feature modules', () => {
        const source = readSource('resources/css/shared/features.scss')

        for (const feature of [
            'dropdown',
            'forms',
            'lightbox',
            'sidebar',
            'table',
            'tabs',
            'tooltip',
            'tree',
        ]) {
            expect(source).toContain(`@use 'features/${feature}/`)
        }
        expect(source).not.toContain('$')
    })
})

describe('Sass entrypoint boundaries', () => {
    it.each(entries.filter((entry) => layerOnlyEntries.has(entry.logicalId)))(
        '$logicalId is an explicit framework-free cascade boundary',
        (entry) => {
            const source = readSource(entry.source)

            expect(source).toMatch(/@layer sleepingowl-(?:shared|theme|theme-override);/)
            expect(source).not.toMatch(/@import\b/)
            expect(variableDeclarations(source)).toEqual([])
        },
    )
})

describe('Sass entrypoint token ownership', () => {
    it('loads the complete canonical contract from shared:ui', () => {
        const entry = entries.find((candidate) => candidate.logicalId === 'shared:ui')
        const source = readSource(entry.source)
        const tokens = readFileSync(siblingPath(entry, '_tokens.scss'), 'utf8')

        expect(source).toContain("@use 'tokens';")
        expect(source).toContain('@include tokens.define;')
        expect(tokens).toContain('@mixin define')
        expect(customPropertyDeclarations(tokens).length).toBeGreaterThan(0)
    })

    it('keeps runtime token ownership out of core', () => {
        const entry = entries.find((candidate) => candidate.logicalId === 'core')
        const source = readSource(entry.source)

        expect(source).not.toContain("@use 'tokens';")
        expect(customPropertyDeclarations(source)).toEqual([])
    })

    it.each(themeTokenEntries)('$logicalId loads only token overrides', (entry) => {
        const source = readSource(entry.source)
        const tokens = readFileSync(siblingPath(entry, '_tokens.scss'), 'utf8')

        expect(source).toContain("@use 'tokens';")
        expect(source).toContain('@include tokens.define;')
        expect(tokens).toContain('@mixin define')
        expect(customPropertyDeclarations(tokens).length).toBeGreaterThan(0)
        expect(nonDefaultDeclarations(tokens)).toEqual([])
    })

    it.each(themeTokenEntries)(
        '$logicalId keeps build-time palette inputs overridable',
        (entry) => {
            const colorsPath = siblingPath(entry, '_colors.scss')

            if (existsSync(colorsPath)) {
                const colors = readFileSync(colorsPath, 'utf8')

                expect(variableDeclarations(colors)).not.toHaveLength(0)
                expect(nonDefaultDeclarations(colors)).toEqual([])
            }
        },
    )
})

describe('Sass resource boundaries', () => {
    it('does not split modern token declarations from custom-property emission', () => {
        const files = readdirSync(resolve(root, 'resources/css'), { recursive: true })

        expect(files.filter((path) => path.endsWith('_custom-properties.scss'))).toEqual([])
    })

    it('contains no undeclared handwritten plain CSS below resources', () => {
        const files = readdirSync(resolve(root, 'resources'), { recursive: true })

        expect(files.filter(isHandwrittenCss)).toEqual([])
    })
})

describe('Sass custom property namespaces', () => {
    it('uses the public --soa-* namespace outside explicit vendor adapters', () => {
        const stylesRoot = resolve(root, 'resources/css')
        const declarations = readdirSync(stylesRoot, { recursive: true })
            .filter((path) => path.endsWith('.scss'))
            .flatMap((path) =>
                customPropertyDeclarations(readFileSync(resolve(stylesRoot, path), 'utf8')).map(
                    (name) => ({ name, path: path.replaceAll('\\', '/') }),
                ),
            )

        expect(declarations.length).toBeGreaterThan(0)
        expect(declarations.filter((declaration) => !allowedCustomProperty(declaration))).toEqual(
            [],
        )
    })
})

describe('Core Sass boundary', () => {
    it('is limited to accessibility and behavior', () => {
        const coreRoot = resolve(root, 'resources/css/core')
        const source = readdirSync(coreRoot)
            .filter((path) => path.endsWith('.scss'))
            .map((path) => readFileSync(resolve(coreRoot, path), 'utf8'))
            .join('\n')

        expect(source).toContain('[data-cloak]')
        expect(source).toContain('[data-visually-hidden]')
        expect(source).not.toMatch(/bootstrap|adminlte|tailwind|datatable|normalize|reset/i)
        expect(source).not.toMatch(
            /(^|[},]\s*)(html|body|main|header|nav|section|table|button|input|select|textarea|\*)\s*[{,]/m,
        )
    })
})

function variableDeclarations(source) {
    return source.split('\n').filter((line) => line.trim().startsWith('$'))
}

function nonDefaultDeclarations(source) {
    return variableDeclarations(source).filter((line) => !line.includes('!default'))
}

function isHandwrittenCss(path) {
    const normalized = path.replaceAll('\\', '/')

    return (
        normalized.endsWith('.css') &&
        !/(^|\/)(generated|vendor)\//.test(normalized) &&
        !declaredPostcssInputs.has(normalized)
    )
}

function customPropertyDeclarations(source) {
    return [...source.matchAll(/(?:^|\n|[;{])\s*(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1])
}

function allowedCustomProperty({ name, path }) {
    if (name.startsWith('--soa-')) return true

    if (path === 'themes/tabler/_tokens.scss') {
        return name.startsWith('--tblr-')
    }

    if (path === 'shared/features/table/_column-order.scss') {
        return name.startsWith('--dt-order-arrow-')
    }

    return path.endsWith('/_date-picker.scss') && name.startsWith('--adp-')
}
