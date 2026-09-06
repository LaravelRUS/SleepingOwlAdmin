import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const entries = readJson('build/frontend-entries.json')

function readJson(path) {
    return JSON.parse(readFileSync(resolve(root, path), 'utf8'))
}

function modernEntry(logicalId, type) {
    return entries.modern[type].find((entry) => entry.logicalId === logicalId)
}

function allEntries() {
    return Object.values(entries).flatMap(({ scripts, styles }) => [...scripts, ...styles])
}

function expectedSourceRoot(logicalId) {
    const [type, id] = logicalId.split(':')

    if (type === 'core') {
        return 'resources/frontend/core/'
    }

    return `resources/frontend/${type}s/${id}/`
}

describe('frontend build entries', () => {
    it('keeps the transitional legacy outputs intact', () => {
        expect(entries.legacy).toEqual({
            scripts: [
                sourceEntry('resources/assets/js_owl/vue-runtime.js', 'js/vue.js'),
                sourceEntry('resources/assets/js_owl/vue-runtime-dev.js', 'js/vue-dev.js'),
                sourceEntry('resources/assets/js_owl/app.js', 'js/admin-app.js'),
                sourceEntry('resources/assets/js_owl/app-dev.js', 'js/admin-app-dev.js'),
                sourceEntry('resources/assets/js_owl/modules_load.js', 'js/modules.js'),
            ],
            styles: [sourceEntry('resources/assets/scss/admin-app.scss', 'css/admin-app.css')],
        })
    })

    it.each([
        'core',
        'feature:forms',
        'feature:lightbox',
        'feature:table',
        'feature:tree',
        'theme:legacy-adminlte',
        'theme:tailwind',
    ])('defines independent script and style outputs for %s', (logicalId) => {
        expect(modernEntry(logicalId, 'scripts')).toBeDefined()
        expect(modernEntry(logicalId, 'styles')).toBeDefined()
    })

    it('keeps behavior-only tabs free of a generic presentation stylesheet', () => {
        expect(modernEntry('feature:tabs', 'scripts')).toBeDefined()
        expect(modernEntry('feature:tabs', 'styles')).toBeUndefined()
    })

    it('keeps modern source ownership aligned with logical ids', () => {
        Object.values(entries.modern)
            .flat()
            .forEach(({ logicalId, source }) => {
                expect(source.startsWith(expectedSourceRoot(logicalId))).toBe(true)
            })
    })
})

describe('frontend build entry files', () => {
    it('uses existing sources and unique output paths', () => {
        const configured = allEntries()
        const outputs = configured.map(({ output }) => output)

        expect(new Set(outputs).size).toBe(outputs.length)
        configured.forEach(({ source }) => {
            expect(() => readFileSync(resolve(root, source))).not.toThrow()
        })
    })
})

describe('table presentation entries', () => {
    it.each(['legacy-adminlte', 'tailwind'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:table:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

describe('tree presentation entries', () => {
    it.each(['legacy-adminlte', 'tailwind'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:tree:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

describe('lightbox presentation entries', () => {
    it.each(['legacy-adminlte', 'tailwind'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:lightbox:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

describe('tabs presentation entries', () => {
    it.each(['legacy-adminlte', 'tailwind'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:tabs:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

function sourceEntry(source, output) {
    return { source, output }
}
