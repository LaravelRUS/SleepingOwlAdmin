import { dirname, resolve } from 'node:path'
import { readFileSync, readdirSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const entries = readJson('build/frontend-entries.json').modern.styles
const tokenizedEntries = entries.filter((entry) => entry.logicalId !== 'shared:icons')

function readJson(path) {
    return JSON.parse(readFileSync(resolve(root, path), 'utf8'))
}

function readSource(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function siblingPath(entry, filename) {
    return resolve(root, dirname(entry.source), filename)
}

describe('Sass entrypoint boundaries', () => {
    it.each(tokenizedEntries)(
        '$logicalId loads its local variables and colors modules',
        (entry) => {
            const source = readSource(entry.source)

            expect(source).toContain("@use 'variables';")
            expect(source).toContain("@use 'colors';")
            expect(source).toContain("@use 'custom-properties';")
            expect(readFileSync(siblingPath(entry, '_variables.scss')).byteLength).toBeGreaterThan(
                0,
            )
            expect(readFileSync(siblingPath(entry, '_colors.scss')).byteLength).toBeGreaterThan(0)
            expect(
                readFileSync(siblingPath(entry, '_custom-properties.scss')).byteLength,
            ).toBeGreaterThan(0)
        },
    )

    it.each(tokenizedEntries)(
        '$logicalId exposes owner-local overridable build-time tokens',
        (entry) => {
            const variables = readFileSync(siblingPath(entry, '_variables.scss'), 'utf8')
            const colors = readFileSync(siblingPath(entry, '_colors.scss'), 'utf8')

            expect(variableDeclarations(variables)).not.toHaveLength(0)
            if (entry.logicalId === 'core') {
                expect(variableDeclarations(colors)).toEqual([])
            } else {
                expect(variableDeclarations(colors)).not.toHaveLength(0)
            }
            expect(nonDefaultDeclarations(variables)).toEqual([])
            expect(nonDefaultDeclarations(colors)).toEqual([])
        },
    )

    it('contains no handwritten plain CSS below resources', () => {
        const files = readdirSync(resolve(root, 'resources'), { recursive: true })

        expect(files.filter(isHandwrittenCss)).toEqual([])
    })
})

describe('Sass custom property namespaces', () => {
    it('uses the public --soa-* namespace outside explicit vendor adapters', () => {
        const stylesRoot = resolve(root, 'resources/frontend')
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
        const source = readSource('resources/frontend/themes/tailwind/styles/_shadcn-theme.scss')
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
        const coreRoot = resolve(root, 'resources/frontend/core/styles')
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

    return normalized.endsWith('.css') && !/(^|\/)(generated|vendor)\//.test(normalized)
}

function customPropertyDeclarations(source) {
    return [...source.matchAll(/(?:^|\n|[;{])\s*(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1])
}

function allowedCustomProperty({ name, path }) {
    if (name.startsWith('--soa-')) return true

    if (path === 'themes/tailwind/styles/_shadcn-theme.scss') {
        return /^--(?:color|font|radius|shadow)-/.test(name)
    }

    return path.endsWith('/_date-picker.scss') && name.startsWith('--adp-')
}
