import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { basename, resolve } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import {
    asNativeVue3Component,
    configureVueCompat,
    vueCompatFeatures,
} from '../../../resources/assets/js_owl/libs/vue-compat-config'

const root = resolve(import.meta.dirname, '../../..')
const require = createRequire(import.meta.url)
const { resolveVueRuntime, runtimeFiles } = require('../../../build/vue-runtime')
const packageJson = readJson('package.json')
const packageLock = readJson('package-lock.json')

const expectedCompatFeatures = [
    'ATTR_ENUMERATED_COERCION',
    'COMPILER_INLINE_TEMPLATE',
    'COMPONENT_V_MODEL',
    'CONFIG_WHITESPACE',
    'GLOBAL_EXTEND',
    'GLOBAL_MOUNT',
    'GLOBAL_PROTOTYPE',
    'INSTANCE_ATTRS_CLASS_STYLE',
    'INSTANCE_CHILDREN',
    'INSTANCE_SCOPED_SLOTS',
    'INSTANCE_SET',
    'OPTIONS_BEFORE_DESTROY',
    'PRIVATE_APIS',
    'RENDER_FUNCTION',
    'WATCH_ARRAY',
]

function readJson(path) {
    return JSON.parse(readFileSync(resolve(root, path), 'utf8'))
}

function md5(path) {
    return createHash('md5').update(readFileSync(path)).digest('hex')
}

describe('Vue 3 compat dependencies', () => {
    it('pins one matching Vue runtime and compiler line', () => {
        expect(packageJson.dependencies.vue).toBe('3.5.42')
        expect(packageJson.dependencies['@vue/compat']).toBe(packageJson.dependencies.vue)
        expect(packageJson.devDependencies['@vue/compiler-sfc']).toBe(packageJson.dependencies.vue)
        expect(packageLock.packages['node_modules/vue'].version).toBe(packageJson.dependencies.vue)
        expect(packageLock.packages['node_modules/@vue/compat'].version).toBe(
            packageJson.dependencies.vue,
        )
    })

    it('removes the Vue 2 compiler and selects Vue Multiselect 3', () => {
        expect(packageJson.dependencies['vue-multiselect']).toMatch(/^3\./)
        expect(packageJson.dependencies).not.toHaveProperty('vue-template-compiler')
        expect(packageJson.devDependencies).not.toHaveProperty('vue-template-compiler')
        expect(packageLock.packages).not.toHaveProperty('node_modules/vue-template-compiler')
    })
})

describe('explicit Vue compatibility boundary', () => {
    it('uses MODE 3 with an audited allowlist', () => {
        const calls = []

        configureVueCompat({ configureCompat: (config) => calls.push(config) })

        expect(calls).toHaveLength(1)
        expect(calls[0].MODE).toBe(3)
        expect(Object.keys(vueCompatFeatures).sort()).toEqual(expectedCompatFeatures.sort())
        expect(vueCompatFeatures.COMPILER_INLINE_TEMPLATE).toBe(true)
    })

    it('disables every legacy feature for native Vue 3 components', () => {
        const component = asNativeVue3Component({ name: 'Fixture' })

        expect(component.compatConfig.MODE).toBe(3)
        expectedCompatFeatures.forEach((feature) => {
            expect(component.compatConfig[feature]).toBe(false)
        })
    })
})

describe('Vue asset profiles', () => {
    it('aliases package imports to the selected compat runtime', () => {
        expect(runtimeFiles).toEqual({
            development: 'vue.cjs.js',
            production: 'vue.cjs.prod.js',
        })
        expect(basename(resolveVueRuntime(root, 'development'))).toBe('vue.cjs.js')
        expect(basename(resolveVueRuntime(root, 'production'))).toBe('vue.cjs.prod.js')
        expect(() => resolveVueRuntime(root, 'preview')).toThrow(/Unsupported Vue asset profile/)
    })

    it('publishes a restorable development bundle beside production', () => {
        const development = resolve(root, 'public/default/js/admin-app-dev.js')
        const production = resolve(root, 'public/default/js/admin-app.js')
        const manifest = readJson('public/default/mix-manifest.json')

        expect(readFileSync(development, 'utf8')).toContain('sourceMappingURL=admin-app-dev.js.map')
        expect(existsSync(`${development}.map`)).toBe(true)
        expect(readFileSync(production, 'utf8')).not.toContain('sourceMappingURL=')
        expect(readFileSync(production).byteLength).toBeLessThan(
            readFileSync(development).byteLength,
        )
        expect(manifest['/js/admin-app-dev.js']).toBe(`/js/admin-app-dev.js?id=${md5(development)}`)
        expect(manifest['/js/admin-app.js']).toBe(`/js/admin-app.js?id=${md5(production)}`)
    })
})
