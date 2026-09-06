import { dirname, resolve } from 'node:path'
import { readFileSync } from 'node:fs'

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
        expect(readFileSync(siblingPath(entry, '_variables.scss')).byteLength).toBeGreaterThan(0)
        expect(readFileSync(siblingPath(entry, '_colors.scss')).byteLength).toBeGreaterThan(0)
    })

    it.each(entries)('$logicalId exposes overridable build-time tokens', (entry) => {
        const variables = readFileSync(siblingPath(entry, '_variables.scss'), 'utf8')
        const colors = readFileSync(siblingPath(entry, '_colors.scss'), 'utf8')

        expect(variableDeclarations(variables)).not.toHaveLength(0)
        expect(variableDeclarations(colors)).not.toHaveLength(0)
        expect(nonDefaultDeclarations(variables)).toEqual([])
        expect(nonDefaultDeclarations(colors)).toEqual([])
    })
})

function variableDeclarations(source) {
    return source.split('\n').filter((line) => line.trim().startsWith('$'))
}

function nonDefaultDeclarations(source) {
    return variableDeclarations(source).filter((line) => !line.includes('!default'))
}
