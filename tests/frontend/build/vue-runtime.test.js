import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { basename, resolve } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

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
    'resources/views/themes/legacy/default/form/element/partials/select_island.blade.php',
    'resources/views/themes/legacy/default/form/element/related/inner_element.blade.php',
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

describe('Vue 3 runtime dependencies', () => {
    it('pins one matching Vue runtime and compiler line', () => {
        expect(packageJson.dependencies.vue).toBe('3.5.42')
        expect(packageJson.dependencies).not.toHaveProperty('@vue/compat')
        expect(packageJson.devDependencies['@vue/compiler-sfc']).toBe(packageJson.dependencies.vue)
        expect(packageJson.devDependencies['vue-loader']).toMatch(/^\^17\./)
        expect(packageLock.packages['node_modules/vue'].version).toBe(packageJson.dependencies.vue)
        expect(packageLock.packages).not.toHaveProperty('node_modules/@vue/compat')
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

describe('Vue asset profiles', () => {
    it('aliases package imports to the runtime-only Vue build', () => {
        const development = resolveVueRuntime(root, 'development').replaceAll('\\', '/')

        expect(runtimeFiles).toEqual({
            development: 'vue.runtime.esm-bundler.js',
            production: 'vue.runtime.esm-bundler.js',
        })
        expect(basename(development)).toBe('vue.runtime.esm-bundler.js')
        expect(basename(resolveVueRuntime(root, 'production'))).toBe('vue.runtime.esm-bundler.js')
        expect(development).toContain('/node_modules/vue/dist/vue.runtime.esm-bundler.js')
        expect(development).not.toContain('/node_modules/@vue/compat/')
        expect(() => resolveVueRuntime(root, 'preview')).toThrow(/Unsupported Vue asset profile/)
    })

    it('publishes restorable development app and Vue bundles beside production', () => {
        const developmentApp = resolve(root, 'public/default/js/admin-app-dev.js')
        const developmentVue = resolve(root, 'public/default/js/vue-dev.js')
        const productionApp = resolve(root, 'public/default/js/admin-app.js')
        const productionVue = resolve(root, 'public/default/js/vue.js')
        const manifest = readJson('public/default/mix-manifest.json')

        expectDevelopmentAsset(developmentApp, manifest)
        expectDevelopmentAsset(developmentVue, manifest)
        expectProductionAsset(productionApp, manifest)
        expectProductionAsset(productionVue, manifest)
        expect(readFileSync(productionVue).byteLength).toBeLessThan(
            readFileSync(developmentVue).byteLength,
        )
    })

    it('keeps Vue ownership out of the application aggregate', () => {
        const developmentApp = readSource('public/default/js/admin-app-dev.js')
        const productionApp = readSource('public/default/js/admin-app.js')
        const productionVue = readSource('public/default/js/vue.js')

        expect(developmentApp).not.toContain('3.5.42')
        expect(productionApp).not.toContain('3.5.42')
        expect(productionVue).toContain('3.5.42')
        expect(productionVue).not.toMatch(/@vue\/compat|compileToFunction|window\.Vue/)
    })
})

describe('bounded legacy Vue apps', () => {
    it.each(legacyVueViews)('marks the Vue host in %s', (path) => {
        expect(readSource(path)).toContain('data-vue-app')
    })

    it('mounts bounded hosts through the tolerant shared lifecycle', () => {
        const initializer = readSource('resources/frontend/shared/vue/browser.js')
        const legacyBridge = readSource('resources/assets/js_owl/vue_init.js')

        expect(initializer).toContain('createVueAppRegistry')
        expect(initializer).toContain('registerVueAppLifecycle')
        expect(
            initializer.indexOf('registerVueAppLifecycle(Admin.Components, vueApps)'),
        ).toBeLessThan(initializer.indexOf('Admin.Vue.scan(document)'))
        expect(initializer).not.toMatch(/vueApps\.mountAll|new Vue|#vueApp/)
        expect(legacyBridge).toContain("import '../../frontend/shared/vue/browser'")
    })

    it('provides translations per app without a global Vue prototype plugin', () => {
        const initializer = readSource('resources/frontend/shared/vue/browser.js')
        const bootstrap = readSource('resources/assets/js_owl/bootstrap.js')

        expect(initializer).toContain('createVueTranslation')
        expect(initializer).toContain('installVueTranslation')
        expect(bootstrap).not.toMatch(/libs\/vuejs|Vue\.use|Vue\.prototype/)
        expect(initializer).not.toMatch(/window\.Vue|globalThis\.Vue|Vue\.prototype/)
    })

    it('contains no package-owned global component registration', () => {
        const sources = readSource('resources/assets/js_owl/bootstrap.js')

        expect(readSource('resources/assets/js_owl/admin/vue-components.js')).toContain(
            'vueComponents',
        )
        expect(readSource('resources/assets/js_owl/bootstrap.js')).not.toContain(
            'Admin.LegacyVueComponents',
        )
        expect(sources).not.toMatch(/Vue\.(?:component|extend)/)
    })
})

it('publishes a namespaced extension API and a shared runtime external stub', () => {
    const initializer = readSource('resources/frontend/shared/vue/browser.js')
    const extension = readSource('resources/frontend/legacy/vue/extension-api.js')
    const stub = readSource('docs/modernization/examples/custom-vue-island/webpack.mix.js')

    expect(initializer).toContain("import * as VueRuntime from 'vue'")
    expect(initializer).toContain('Admin.Vue = createVueExtensionApi')
    expect(extension).toContain('register(name, component)')
    expect(extension).toContain('plugins.use(plugin, ...pluginOptions)')
    expect(stub).toContain("vue: ['Admin', 'Vue', 'runtime']")
    expect(initializer).not.toMatch(/window\.Vue|globalThis\.Vue/)
})

describe('precompiled Vue islands', () => {
    it('mounts the env editor directly from typed host props', () => {
        const view = readSource('resources/views/themes/legacy/default/env_editor.blade.php')
        const component = readSource('resources/assets/js_owl/admin/display/env-editor.vue')

        expect(readSource('webpack.mix.js')).toContain('mix.vue({ version: 3 })')
        expect(view).toContain('data-vue-component="env_editor"')
        expect(view).toContain('data-vue-props=')
        expect(view).toContain('v-pre')
        expect(view).toContain("'removeCell' => 'row-link align-middle'")
        expect(view).toContain("'saveIcon' => 'fas fa-check'")
        expect(view).not.toContain('inline-template')
        expect(component).toContain('<template>')
        expect(component).toContain(':class="classes.card"')
        expect(component).toContain('data-env-remove')
        expect(component).not.toContain('style="vertical-align: inherit"')
        expect(component).not.toMatch(/class="(?:card|table|row-|form-control|btn|pull-right|fas)/)
        expect(component).not.toContain('withLegacyInlineTemplate')
    })

    it('mounts the file element directly and uses the Dropzone constructor', () => {
        const view = readSource('resources/views/themes/legacy/default/form/element/file.blade.php')
        const component = readSource('resources/assets/js_owl/admin/form/file.vue')
        const dropzone = readSource('resources/assets/js_owl/libs/dropzone.js')

        expect(view).toContain('data-vue-component="element-file"')
        expect(view).toContain('data-vue-props=')
        expect(view).toContain('v-pre')
        expect(view).toContain("'alert' => 'alert alert-warning'")
        expect(view).toContain("'uploadingIcon' => 'fas fa-spinner fa-spin'")
        expect(view).not.toContain('inline-template')
        expect(component).toContain('<template>')
        expect(component).toContain('data-file-upload')
        expect(component).toContain(':class="uploadIconClass"')
        expect(component).not.toMatch(
            /class="(?:alert|close|form-element-files|btn|fa-fw|fas|upload-button)/,
        )
        expect(component).not.toMatch(/\$\(|withLegacyInlineTemplate/)
        expect(dropzone).toContain('dropzoneModule.Dropzone')
        expect(dropzone).not.toContain("window.Dropzone = require('dropzone')")
    })
})

it('keeps both related theme shells in Blade', () => {
    const card = readSource(
        'resources/views/themes/legacy/default/form/element/related/elements.blade.php',
    )
    const plain = readSource(
        'resources/views/themes/legacy/default/form/element/related/elements_without_card.blade.php',
    )
    const group = readSource(
        'resources/views/themes/legacy/default/form/element/related/group.blade.php',
    )

    expect(card).toContain('card card-outline card-info')
    expect(plain).toContain('HtmlAttributeBag')
    expect(group).toContain('data-related-remove')
    expect([card, plain, group].join('\n')).not.toContain('inline-template')
})

it('passes trusted related group HTML through referenced JSON props', () => {
    const island = readSource(
        'resources/views/themes/legacy/default/form/element/related/inner_element.blade.php',
    )

    expect(island).toContain('data-vue-component="related-elements"')
    expect(island).toContain('data-vue-props-id=')
    expect(island).toContain('Illuminate\\Support\\Js::encode')
    expect(island).toContain("'root' => 'grouped-elements clearfix'")
    expect(island).toContain("'addIcon' => 'fas fa-plus'")
    expect(island).not.toContain('inline-template')
})

it('uses precompiled related state, native Sortable and shared lifecycle modules', () => {
    const component = readSource('resources/assets/js_owl/admin/form/related/elements.vue')
    const catalog = readSource('resources/assets/js_owl/admin/vue-components.js')

    expect(component).toContain('<template>')
    expect(component).toContain(':class="classes.root"')
    expect(component).toContain(':class="classes.addIcon"')
    expect(component).toContain("import Sortable from 'sortablejs'")
    expect(component).toContain('initializeRelatedGroup(Admin, element)')
    expect(component).not.toMatch(/\$\(|vuedraggable|withLegacyInlineTemplate/)
    expect(component).not.toMatch(
        /class="(?:grouped-elements|related-elements__draggable|d-block|fas fa-plus)/,
    )
    expect(catalog).toContain("'related-elements': RelatedElements")
    expect(catalog).not.toContain("'related-group'")
    expect(packageJson.dependencies).not.toHaveProperty('vuedraggable')
    expect(packageLock.packages).not.toHaveProperty('node_modules/vuedraggable')
})

it('removes every package inline-template bridge owner', () => {
    expect(existsSync(resolve(root, 'resources/assets/js_owl/libs/vue-inline-template.js'))).toBe(
        false,
    )
    expect(
        existsSync(resolve(root, 'resources/assets/js_owl/admin/form/related/elements.js')),
    ).toBe(false)
    expect(existsSync(resolve(root, 'resources/assets/js_owl/admin/form/related/group.js'))).toBe(
        false,
    )
})

describe('precompiled select island', () => {
    it('mounts single and multiple modes through one native Vue 3 component', () => {
        const partial = readSource(
            'resources/views/themes/legacy/default/form/element/partials/select_island.blade.php',
        )
        const component = readSource('resources/assets/js_owl/admin/form/select.vue')
        const catalog = readSource('resources/assets/js_owl/admin/vue-components.js')

        expect(partial).toContain('data-vue-component="element-select"')
        expect(partial).toContain('data-vue-props=')
        expect(partial).toContain('v-pre')
        expect(partial).toContain("'required' => 'text-danger pt-2 pb-3'")
        expect(component).toContain('<template>')
        expect(component).toContain(':class="classes.required"')
        expect(component).toContain('data-select-required')
        expect(component).toContain('v-bind="attributes"')
        expect(component).toContain("new EventConstructor('change', { bubbles: true })")
        expect(component).toContain("import Multiselect from 'vue-multiselect'")
        expect(component).not.toMatch(/\$\(|withLegacyInlineTemplate/)
        expect(component).not.toContain('class="text-danger pt-2 pb-3"')
        expect(catalog).toContain("'element-select': ElementSelect")
        expect(catalog).not.toMatch(/\bdeselect\b|\bmultiselect:/)
        expect(
            existsSync(resolve(root, 'resources/assets/js_owl/admin/form/multiselect-compat.js')),
        ).toBe(false)
        expect(existsSync(resolve(root, 'resources/assets/js_owl/admin/form/deselect.js'))).toBe(
            false,
        )
    })
})

describe('Select2 migration boundary', () => {
    it('uses the shared remote Vue driver without first-party Select2 assets', () => {
        const bootstrap = readSource('resources/assets/js_owl/bootstrap.js')
        const component = readSource('resources/assets/js_owl/admin/form/select.vue')
        const ajaxView = readSource(
            'resources/views/themes/legacy/default/form/element/selectajax.blade.php',
        )

        expect(packageJson.dependencies).not.toHaveProperty('select2')
        expect(packageLock.packages[''].dependencies).not.toHaveProperty('select2')
        expect(bootstrap).not.toMatch(/select2|admin\/form\/selectajax/)
        expect(component).toContain(
            "import { createRemoteSelectSearch } from './select-remote-search'",
        )
        expect(component).not.toMatch(/\$\(|jQuery|\.select2\(/)
        expect(ajaxView).toContain("'selectExtraProps' => ['remote' => $remoteSelect]")
        expect(existsSync(resolve(root, 'resources/assets/js_owl/libs/select2.js'))).toBe(false)
        expect(existsSync(resolve(root, 'resources/assets/scss/components/select2.scss'))).toBe(
            false,
        )
        expect(existsSync(resolve(root, 'resources/assets/js_owl/admin/form/selectajax.js'))).toBe(
            false,
        )
    })
})

describe('precompiled image island', () => {
    it('mounts the image element directly without jQuery or Axios', () => {
        const view = readSource(
            'resources/views/themes/legacy/default/form/element/image.blade.php',
        )
        const component = readSource('resources/assets/js_owl/admin/form/image.vue')
        const catalog = readSource('resources/assets/js_owl/admin/vue-components.js')

        expect(existsSync(resolve(root, 'resources/assets/js_owl/admin/form/image.js'))).toBe(false)
        expect(view).toContain('data-vue-component="element-image"')
        expect(view).toContain('data-vue-props=')
        expect(view).toContain('v-pre')
        expect(view).toContain("'alert' => 'alert alert-warning'")
        expect(view).toContain("'uploadingIcon' => 'fas fa-spinner fa-spin'")
        expect(view).toContain('$imageExtraProps ?? []')
        expect(view).not.toContain('inline-template')
        expect(component).toContain('<template>')
        expect(component).toContain('postPastedImage(Admin.Http')
        expect(component).toContain('data-image-upload')
        expect(component).toContain(':class="uploadIconClass"')
        expect(component).not.toMatch(
            /class="(?:alert|close|form-element-files|btn|fa-fw|fas|upload-button)/,
        )
        expect(component).not.toMatch(/\$\(|axios|withLegacyInlineTemplate/)
        expect(catalog).toContain("'element-image': ElementImage")
    })
})

describe('precompiled images island', () => {
    it('mounts the images element directly without legacy frontend dependencies', () => {
        const view = readSource(
            'resources/views/themes/legacy/default/form/element/images.blade.php',
        )
        const component = readSource('resources/assets/js_owl/admin/form/images.vue')
        const catalog = readSource('resources/assets/js_owl/admin/vue-components.js')

        expect(existsSync(resolve(root, 'resources/assets/js_owl/admin/form/images.js'))).toBe(
            false,
        )
        expect(view).toContain('data-vue-component="element-images"')
        expect(view).toContain('data-vue-props=')
        expect(view).toContain('v-pre')
        expect(view).toContain("'root' => 'soa-images'")
        expect(view).toContain("'sortableGhost' => 'soa-images__item--moving'")
        expect(view).toContain("'uploadingIcon' => 'fas fa-spinner fa-spin'")
        expect(view).toContain('$imagesExtraProps ?? []')
        expect(view).not.toContain('inline-template')
        expect(component).toContain('<template>')
        expect(component).toContain('postPastedImage(')
        expect(component).toContain('data-images-upload-icon')
        expect(component).toContain(':class="uploadIconClass"')
        expect(component).not.toMatch(
            /class="(?:soa-images|alert|close|form-element-files|dropzone|btn|fa-fw|fas|upload-button|gallery-remove)/,
        )
        expect(component).not.toMatch(/\$\(|axios|vuedraggable|withLegacyInlineTemplate/)
        expect(catalog).toContain("'element-images': ElementImages")
    })
})

function expectDevelopmentAsset(path, manifest) {
    const name = basename(path)
    const manifestKey = `/js/${name}`

    expect(readFileSync(path, 'utf8')).toContain(`sourceMappingURL=${name}.map`)
    expect(existsSync(`${path}.map`)).toBe(true)
    expect(manifest[manifestKey]).toBe(`${manifestKey}?id=${md5(path)}`)
}

function expectProductionAsset(path, manifest) {
    const name = basename(path)
    const manifestKey = `/js/${name}`

    expect(readFileSync(path, 'utf8')).not.toContain('sourceMappingURL=')
    expect(manifest[manifestKey]).toBe(`${manifestKey}?id=${md5(path)}`)
}
