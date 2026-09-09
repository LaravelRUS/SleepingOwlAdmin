import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const sharedRoot = resolve(root, 'resources/css/shared')
const themeRoot = resolve(root, 'resources/css/themes')
const tokenSource = readFileSync(resolve(sharedRoot, '_tokens.scss'), 'utf8')
const sharedTokens = declarations(tokenSource)

it('defines every shared presentation token in the canonical token file', () => {
    const usedTokens = new Set(
        filesUnder(sharedRoot)
            .filter((file) => !file.endsWith('_tokens.scss'))
            .flatMap((file) => references(readFileSync(file, 'utf8')))
            .filter((token) => token !== '--soa-inline-editable-max-rows'),
    )

    expect([...usedTokens].filter((token) => !sharedTokens.has(token)).sort()).toEqual([])
})

it('keeps root token declarations out of theme presentation files', () => {
    const violations = filesUnder(themeRoot)
        .filter((file) => !file.endsWith('_tokens.scss'))
        .filter((file) => !file.includes(`${resolve(themeRoot, 'adminlte/legacy')}`))
        .flatMap((file) => {
            const source = readFileSync(file, 'utf8')

            return [...source.matchAll(/:root[^{}]*\{([^{}]*)\}/g)].flatMap((match) =>
                [...declarations(match[1])].map(
                    (token) => `${file.slice(root.length + 1)}: ${token}`,
                ),
            )
        })

    expect(violations).toEqual([])
})

it('allows themes to reassign only declared shared tokens', () => {
    const themeTokens = filesUnder(themeRoot)
        .filter((file) => file.endsWith('_tokens.scss'))
        .flatMap((file) => [...declarations(readFileSync(file, 'utf8'))])

    expect([...new Set(themeTokens)].filter((token) => !sharedTokens.has(token)).sort()).toEqual([])
})

function declarations(source) {
    return new Set([...source.matchAll(/(--soa-[a-z0-9-]+)\s*:/g)].map((match) => match[1]))
}

function references(source) {
    return [...source.matchAll(/var\((--soa-[a-z0-9-]+)/g)].map((match) => match[1])
}

function filesUnder(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = resolve(directory, entry.name)

        if (entry.isDirectory()) return filesUnder(path)

        return entry.isFile() && entry.name.endsWith('.scss') ? [path] : []
    })
}
