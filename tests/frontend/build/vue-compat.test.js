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
const legacyVueViews = [
    'resources/views/themes/legacy/default/env_editor.blade.php',
    'resources/views/themes/legacy/default/form/element/file.blade.php',
    'resources/views/themes/legacy/default/form/element/image.blade.php',
    'resources/views/themes/legacy/default/form/element/images.blade.php',
    'resources/views/themes/legacy/default/form/element/select.blade.php',
    'resources/views/themes/legacy/default/form/element/multiselect.blade.php',
    'resources/views/themes/legacy/default/form/element/related/elements.blade.php',
    'resources/views/themes/legacy/default/form/element/related/elements_without_card.blade.php',
]
const legacyVueDefinitions = [
    'resources/assets/js_owl/admin/form/deselect.js',
    'resources/assets/js_owl/admin/form/image.js',
    'resources/assets/js_owl/admin/form/images.js',
    'resources/assets/js_owl/admin/form/related/elements.js',
    'resources/assets/js_owl/admin/form/related/group.js',
]
const legacyInlineTemplateViews = [
    'resources/views/themes/legacy/default/form/element/image.blade.php',
    'resources/views/themes/legacy/default/form/element/images.blade.php',
    'resources/views/themes/legacy/default/form/element/select.blade.php',
    'resources/views/themes/legacy/default/form/element/multiselect.blade.php',
    'resources/views/themes/legacy/default/form/element/related/elements.blade.php',
    'resources/views/themes/legacy/default/form/element/related/elements_without_card.blade.php',
    'resources/views/themes/legacy/default/form/element/related/group.blade.php',
]

const expectedCompatFeatures = [
    'ATTR_ENUMERATED_COERCION',
    'COMPILER_INLINE_TEMPLATE',
    'COMPONENT_V_MODEL',
    'CONFIG_WHITESPACE',
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

function readSource(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function md5(path) {
    return createHash('md5').update(readFileSync(path)).digest('hex')
}

describe('Vue 3 compat dependencies', () => {
    it('pins one matching Vue runtime and compiler line', () => {
        expect(packageJson.dependencies.vue).toBe('3.5.42')
        expect(packageJson.dependencies['@vue/compat']).toBe(packageJson.dependencies.vue)
        expect(packageJson.devDependencies['@vue/compiler-sfc']).toBe(packageJson.dependencies.vue)
        expect(packageJson.devDependencies['vue-loader']).toMatch(/^\^16\./)
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

    it('uses Admin.Http instead of vue-resource', () => {
        const bootstrap = readSource('resources/assets/js_owl/bootstrap.js')

        expect(packageJson.dependencies).not.toHaveProperty('vue-resource')
        expect(packageLock.packages).not.toHaveProperty('node_modules/vue-resource')
        expect(bootstrap).not.toMatch(/vue-resource|Vue\.http|\$http/)
        expect(readSource('resources/frontend/core/runtime/admin-core.js')).toContain(
            'Http: createHttpClient',
        )
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

describe('bounded legacy Vue apps', () => {
    it.each(legacyVueViews)('marks the Vue host in %s', (path) => {
        expect(readSource(path)).toContain('data-soa-vue-app')
    })

    it('does not mount the page-wide #vueApp element', () => {
        const initializer = readSource('resources/assets/js_owl/vue_init.js')

        expect(initializer).toContain('createVueAppRegistry')
        expect(initializer).not.toMatch(/new Vue|#vueApp/)
    })

    it('provides translations per app without a global Vue prototype plugin', () => {
        const initializer = readSource('resources/assets/js_owl/vue_init.js')
        const bootstrap = readSource('resources/assets/js_owl/bootstrap.js')

        expect(initializer).toContain('createVueTranslation')
        expect(initializer).toContain('installVueTranslation')
        expect(bootstrap).not.toMatch(/libs\/vuejs|Vue\.use|Vue\.prototype/)
        expect(vueCompatFeatures).not.toHaveProperty('GLOBAL_PROTOTYPE')
    })

    it.each(legacyVueDefinitions)('exports an app-local definition from %s', (path) => {
        const source = readSource(path)

        expect(source).toContain('defineComponent')
        expect(source).toContain('export default')
        expect(source).not.toMatch(/Vue\.(?:component|extend)/)
    })

    it('contains no package-owned global component registration', () => {
        const sources = [...legacyVueDefinitions, 'resources/assets/js_owl/bootstrap.js']
            .map(readSource)
            .join('\n')

        expect(readSource('resources/assets/js_owl/admin/vue-components.js')).toContain(
            'legacyVueComponents',
        )
        expect(readSource('resources/assets/js_owl/bootstrap.js')).toContain(
            'Admin.LegacyVueComponents',
        )
        expect(sources).not.toMatch(/Vue\.(?:component|extend)/)
    })
})

describe('precompiled Vue islands', () => {
    it('mounts the env editor directly from typed host props', () => {
        const view = readSource('resources/views/themes/legacy/default/env_editor.blade.php')
        const component = readSource('resources/assets/js_owl/admin/display/env-editor.vue')

        expect(readSource('webpack.mix.js')).toContain('mix.vue({ version: 3 })')
        expect(view).toContain('data-soa-vue-component="env_editor"')
        expect(view).toContain('data-soa-vue-props=')
        expect(view).not.toContain('inline-template')
        expect(component).toContain('<template>')
        expect(component).not.toContain('withLegacyInlineTemplate')
    })

    it.each(legacyInlineTemplateViews)('keeps the audited inline template in %s', (path) => {
        expect(readSource(path).match(/inline-template/g)).toHaveLength(1)
    })

    it('mounts the file element directly and uses the Dropzone constructor', () => {
        const view = readSource('resources/views/themes/legacy/default/form/element/file.blade.php')
        const component = readSource('resources/assets/js_owl/admin/form/file.vue')
        const dropzone = readSource('resources/assets/js_owl/libs/dropzone.js')

        expect(view).toContain('data-soa-vue-component="element-file"')
        expect(view).toContain('data-soa-vue-props=')
        expect(view).not.toContain('inline-template')
        expect(component).toContain('<template>')
        expect(component).not.toMatch(/\$\(|withLegacyInlineTemplate/)
        expect(dropzone).toContain('dropzoneModule.Dropzone')
        expect(dropzone).not.toContain("window.Dropzone = require('dropzone')")
    })
})
