import { dirname, resolve } from 'node:path'
import { existsSync, readFileSync, readdirSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const entries = readJson('build/frontend-entries.json').modern.styles
const aggregateEntries = new Set(['shared:features', 'shared:icons'])
const layerOnlyEntries = new Set([
    'shared:ui',
    'theme:adminlte:overrides',
    'theme:shadcn:overrides',
])
const tokenizedEntries = entries.filter(
    (entry) => !aggregateEntries.has(entry.logicalId) && !layerOnlyEntries.has(entry.logicalId),
)
const sassTokenizedEntries = tokenizedEntries.filter((entry) => entry.source.endsWith('.scss'))

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

            expect(source).toMatch(/@layer sleepingowl-(?:shared|theme-override);/)
            expect(source).not.toMatch(/@import\b/)
            expect(variableDeclarations(source)).toEqual([])
        },
    )
})

describe('Sass entrypoint token ownership', () => {
    it.each(sassTokenizedEntries)('$logicalId loads its canonical token owner', (entry) => {
        const source = readSource(entry.source)
        const isCore = entry.logicalId === 'core'

        if (isCore) {
            expect(source).not.toContain("@use 'tokens';")
            expect(variableDeclarations(source)).not.toHaveLength(0)
        } else {
            expect(source).toContain("@use 'tokens';")
            expect(readFileSync(siblingPath(entry, '_tokens.scss')).byteLength).toBeGreaterThan(0)
        }

        const colorsPath = siblingPath(entry, '_colors.scss')
        if (!existsSync(colorsPath)) return

        expect(source).toContain("@use 'colors';")
        expect(readFileSync(colorsPath).byteLength).toBeGreaterThan(0)
    })

    it.each(sassTokenizedEntries)(
        '$logicalId exposes owner-local overridable build-time tokens',
        (entry) => {
            const tokens =
                entry.logicalId === 'core'
                    ? readSource(entry.source)
                    : readFileSync(siblingPath(entry, '_tokens.scss'), 'utf8')
            const colorsPath = siblingPath(entry, '_colors.scss')

            expect(variableDeclarations(tokens)).not.toHaveLength(0)
            expect(nonDefaultDeclarations(tokens)).toEqual([])

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

    it('contains no handwritten plain CSS below resources', () => {
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

    it('limits shadcn aliases to the Tailwind bridge and canonical --soa-* values', () => {
        const source = readSource('resources/css/themes/shadcn/_shadcn-theme.scss')
        const aliases = customPropertyDeclarations(source)
        const bridgedAliases = [
            ...source.matchAll(
                /(--(?:color|font|radius|shadow)-[a-z0-9-]+)\s*:\s*var\((--soa-[a-z0-9-]+)\)/gi,
            ),
        ].map((match) => match[1])

        expect(aliases.length).toBeGreaterThan(0)
        expect(bridgedAliases).toEqual(aliases)
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
        normalized !== 'css/themes/shadcn/tailwind.input.css' &&
        !/(^|\/)(generated|vendor)\//.test(normalized)
    )
}

function customPropertyDeclarations(source) {
    return [...source.matchAll(/(?:^|\n|[;{])\s*(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1])
}

function allowedCustomProperty({ name, path }) {
    if (name.startsWith('--soa-')) return true

    if (path === 'themes/shadcn/_shadcn-theme.scss') {
        return /^--(?:color|font|radius|shadow)-/.test(name)
    }

    return path.endsWith('/_date-picker.scss') && name.startsWith('--adp-')
}
