import { dirname, resolve } from 'node:path'
import { readFileSync, readdirSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const entries = readJson('build/frontend-entries.json').modern.styles

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
    it.each(entries)('$logicalId loads its local variables and colors modules', (entry) => {
        const source = readSource(entry.source)

        expect(source).toContain("@use 'variables';")
        expect(source).toContain("@use 'colors';")
        expect(source).toContain("@use 'custom-properties';")
        expect(readFileSync(siblingPath(entry, '_variables.scss')).byteLength).toBeGreaterThan(0)
        expect(readFileSync(siblingPath(entry, '_colors.scss')).byteLength).toBeGreaterThan(0)
        expect(
            readFileSync(siblingPath(entry, '_custom-properties.scss')).byteLength,
        ).toBeGreaterThan(0)
    })

    it.each(entries)('$logicalId exposes overridable build-time tokens', (entry) => {
        const variables = readFileSync(siblingPath(entry, '_variables.scss'), 'utf8')
        const colors = readFileSync(siblingPath(entry, '_colors.scss'), 'utf8')

        expect(variableDeclarations(variables)).not.toHaveLength(0)
        expect(variableDeclarations(colors)).not.toHaveLength(0)
        expect(nonDefaultDeclarations(variables)).toEqual([])
        expect(nonDefaultDeclarations(colors)).toEqual([])
    })

    it('contains no handwritten plain CSS below resources', () => {
        const files = readdirSync(resolve(root, 'resources'), { recursive: true })

        expect(files.filter(isHandwrittenCss)).toEqual([])
    })

    it('uses the public --soa-* namespace for every declared custom property', () => {
        const stylesRoot = resolve(root, 'resources/frontend')
        const declarations = readdirSync(stylesRoot, { recursive: true })
            .filter((path) => path.endsWith('.scss'))
            .flatMap((path) =>
                customPropertyDeclarations(readFileSync(resolve(stylesRoot, path), 'utf8')),
            )

        expect(declarations.length).toBeGreaterThan(0)
        expect(declarations.filter((name) => !name.startsWith('--soa-'))).toEqual([])
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
    return [...source.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1])
}
