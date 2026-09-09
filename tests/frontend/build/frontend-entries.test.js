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

function expectedSourceRoots(logicalId) {
    const [type, id, scope, themeId] = logicalId.split(':')
    const theme = themeSourceName(themeId ?? id)

    if (type === 'core') {
        return ['resources/css/core/', 'resources/js/core/']
    }

    if (type === 'shared') {
        return id === 'icons'
            ? ['resources/css/shared/features/icons/']
            : [`resources/js/shared/${id}/`]
    }

    if (type === 'feature' && scope === 'theme') {
        return [
            `resources/css/themes/${theme}/features/${id}/`,
            `resources/js/themes/${theme}/features/${id}/`,
        ]
    }

    if (type === 'feature') {
        return [`resources/css/shared/features/${id}/`, `resources/js/shared/features/${id}/`]
    }

    return [`resources/css/themes/${theme}/`, `resources/js/themes/${theme}/`]
}

function themeSourceName(logicalId) {
    return logicalId
}

describe('frontend build entries', () => {
    it('keeps the transitional legacy outputs intact', () => {
        expect(entries.legacy).toEqual({
            scripts: [
                sourceEntry('resources/js/shared/legacy/vue-runtime.js', 'js/vue.js'),
                sourceEntry('resources/js/shared/legacy/vue-runtime-dev.js', 'js/vue-dev.js'),
                sourceEntry('resources/js/shared/legacy/app.js', 'js/admin-app.js'),
                sourceEntry('resources/js/shared/legacy/app-dev.js', 'js/admin-app-dev.js'),
                sourceEntry('resources/js/shared/legacy/modules_load.js', 'js/modules.js'),
            ],
            styles: [
                sourceEntry(
                    'resources/css/themes/adminlte/legacy/admin-app.scss',
                    'css/admin-app.css',
                ),
            ],
        })
    })
})

describe('modern frontend build entries', () => {
    it.each([
        'core',
        'feature:dropdown',
        'feature:forms',
        'feature:lightbox',
        'feature:sidebar',
        'feature:table',
        'feature:tooltip',
        'feature:tree',
        'theme:adminlte',
        'theme:shadcn',
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
                expect(expectedSourceRoots(logicalId).some((root) => source.startsWith(root))).toBe(
                    true,
                )
            })
    })
})

it('publishes shared icons as a standalone stylesheet', () => {
    expect(modernEntry('shared:icons', 'scripts')).toBeUndefined()
    expect(modernEntry('shared:icons', 'styles')).toEqual({
        logicalId: 'shared:icons',
        source: 'resources/css/shared/features/icons/font-awesome.scss',
        output: 'css/icons.css',
    })
})

it('publishes the Vue 3 islands as one profile-selected shared script', () => {
    expect(modernEntry('shared:vue', 'scripts')).toEqual({
        logicalId: 'shared:vue',
        source: 'resources/js/shared/vue/browser.js',
        output: 'js/shared/vue.js',
    })
    expect(modernEntry('shared:vue', 'styles')).toBeUndefined()
})

it('publishes the legacy API compatibility layer without presentation styles', () => {
    expect(modernEntry('shared:compatibility', 'scripts')).toEqual({
        logicalId: 'shared:compatibility',
        source: 'resources/js/shared/compatibility/browser.js',
        output: 'js/shared/compatibility.js',
    })
    expect(modernEntry('shared:compatibility', 'styles')).toBeUndefined()
})

it('publishes the final compatibility module boot as an independent shared script', () => {
    expect(modernEntry('shared:modules', 'scripts')).toEqual({
        logicalId: 'shared:modules',
        source: 'resources/js/shared/modules/browser.js',
        output: 'js/shared/modules.js',
    })
    expect(modernEntry('shared:modules', 'styles')).toBeUndefined()
})

it.each(['forms', 'lightbox', 'table', 'tree'])(
    'publishes %s through an auto-boot browser entry',
    (feature) => {
        expect(modernEntry(`feature:${feature}`, 'scripts')).toEqual({
            logicalId: `feature:${feature}`,
            source: `resources/js/shared/features/${feature}/browser.js`,
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
    it('publishes the AdminLTE presentation and DataTables adapter together', () => {
        const logicalId = 'feature:table:theme:adminlte'

        expect(modernEntry(logicalId, 'styles')).toBeDefined()
        expect(modernEntry(logicalId, 'scripts')).toBeDefined()
    })

    it.each(['framework-free-test', 'shadcn'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:table:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

describe('forms presentation entries', () => {
    it('publishes the Tailwind adapter as an independent stylesheet', () => {
        const logicalId = 'feature:forms:theme:shadcn'

        expect(modernEntry(logicalId, 'styles')).toBeDefined()
        expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
    })
})

describe('tree presentation entries', () => {
    it('publishes the AdminLTE presentation and notification adapter together', () => {
        const logicalId = 'feature:tree:theme:adminlte'

        expect(modernEntry(logicalId, 'styles')).toBeDefined()
        expect(modernEntry(logicalId, 'scripts')).toBeDefined()
    })

    it('publishes Tailwind presentation with its native-event notification adapter', () => {
        const logicalId = 'feature:tree:theme:shadcn'

        expect(modernEntry(logicalId, 'styles')).toBeDefined()
        expect(modernEntry(logicalId, 'scripts')).toBeDefined()
    })
})

describe('lightbox presentation entries', () => {
    it.each(['adminlte', 'shadcn'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:lightbox:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

describe('tabs presentation entries', () => {
    it.each(['adminlte', 'shadcn'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:tabs:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

describe('tooltip presentation entries', () => {
    it.each(['adminlte', 'shadcn'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:tooltip:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

describe('dropdown presentation entries', () => {
    it.each(['adminlte', 'shadcn'])(
        'publishes the %s adapter as an independent stylesheet',
        (theme) => {
            const logicalId = `feature:dropdown:theme:${theme}`

            expect(modernEntry(logicalId, 'styles')).toBeDefined()
            expect(modernEntry(logicalId, 'scripts')).toBeUndefined()
        },
    )
})

describe('sidebar presentation entries', () => {
    it.each(['adminlte', 'shadcn'])(
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
