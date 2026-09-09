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
        return sharedSourceRoots(id)
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

function sharedSourceRoots(id) {
    if (id === 'icons') return ['resources/css/shared/features/icons/']
    if (id === 'features') {
        return ['resources/css/shared/features.scss', 'resources/js/shared/features/']
    }

    return [`resources/js/shared/${id}/`]
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
    it('publishes always-loaded features as one shared runtime boundary', () => {
        expect(modernEntry('shared:features', 'scripts')).toEqual({
            logicalId: 'shared:features',
            source: 'resources/js/shared/features/browser.js',
            output: 'js/shared/features.js',
        })
        expect(modernEntry('shared:features', 'styles')).toEqual({
            logicalId: 'shared:features',
            source: 'resources/css/shared/features.scss',
            output: 'css/shared/features.css',
        })
    })

    it.each(['adminlte', 'shadcn'])(
        'publishes the %s runtime and adapters as one theme boundary',
        (theme) => {
            expect(modernEntry(`theme:${theme}`, 'scripts')).toBeDefined()
            expect(modernEntry(`theme:${theme}`, 'styles')).toBeDefined()
        },
    )

    it('does not create per-feature or feature-theme public entries', () => {
        const logicalIds = Object.values(entries.modern)
            .flat()
            .map(({ logicalId }) => logicalId)

        expect(logicalIds.some((logicalId) => logicalId.startsWith('feature:'))).toBe(false)
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

function sourceEntry(source, output) {
    return { source, output }
}
