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

    if (type === 'shared') {
        return `resources/frontend/shared/${id}/`
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
        'feature:dropdown',
        'feature:forms',
        'feature:lightbox',
        'feature:sidebar',
        'feature:table',
        'feature:tooltip',
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

it('publishes shared icons as a standalone stylesheet', () => {
    expect(modernEntry('shared:icons', 'scripts')).toBeUndefined()
    expect(modernEntry('shared:icons', 'styles')).toEqual({
        logicalId: 'shared:icons',
        source: 'resources/frontend/shared/icons/styles/font-awesome.scss',
        output: 'css/icons.css',
    })
})

it('publishes the Vue 3 islands as one profile-selected shared script', () => {
    expect(modernEntry('shared:vue', 'scripts')).toEqual({
        logicalId: 'shared:vue',
        source: 'resources/frontend/shared/vue/browser.js',
        output: 'js/shared/vue.js',
    })
    expect(modernEntry('shared:vue', 'styles')).toBeUndefined()
})

it('publishes the legacy API compatibility layer without presentation styles', () => {
    expect(modernEntry('shared:compatibility', 'scripts')).toEqual({
        logicalId: 'shared:compatibility',
        source: 'resources/frontend/shared/compatibility/browser.js',
        output: 'js/shared/compatibility.js',
    })
    expect(modernEntry('shared:compatibility', 'styles')).toBeUndefined()
})

it('publishes the final compatibility module boot as an independent shared script', () => {
    expect(modernEntry('shared:modules', 'scripts')).toEqual({
        logicalId: 'shared:modules',
        source: 'resources/frontend/shared/modules/browser.js',
        output: 'js/shared/modules.js',
    })
    expect(modernEntry('shared:modules', 'styles')).toBeUndefined()
})

it.each(['forms', 'lightbox', 'table', 'tree'])(
    'publishes %s through an auto-boot browser entry',
    (feature) => {
        expect(modernEntry(`feature:${feature}`, 'scripts')).toEqual({
            logicalId: `feature:${feature}`,
            source: `resources/frontend/features/${feature}/browser.js`,
            output: `js/features/${feature}.js`,
        })
    },
)

describe('behavior-only entries', () => {
    it('keeps alerts free of a generic presentation stylesheet', () => {
        expect(modernEntry('feature:alert', 'scripts')).toBeDefined()
        expect(modernEntry('feature:alert', 'styles')).toBeUndefined()
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
    it('publishes the AdminLTE presentation and notification adapter together', () => {
        const logicalId = 'feature:tree:theme:legacy-adminlte'

        expect(modernEntry(logicalId, 'styles')).toBeDefined()
        expect(modernEntry(logicalId, 'scripts')).toBeDefined()
    })

    it('keeps the Tailwind adapter presentation-only', () => {
        const logicalId = 'feature:tree:theme:tailwind'

        expect(modernEntry(logicalId, 'styles')).toBeDefined()
        expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
    })
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

describe('tooltip presentation entries', () => {
    it.each(['legacy-adminlte', 'tailwind'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:tooltip:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

describe('dropdown presentation entries', () => {
    it.each(['legacy-adminlte', 'tailwind'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:dropdown:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

describe('sidebar presentation entries', () => {
    it.each(['legacy-adminlte', 'tailwind'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:sidebar:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

function sourceEntry(source, output) {
    return { source, output }
}
