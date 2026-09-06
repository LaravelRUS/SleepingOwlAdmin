import * as VueRuntime from 'vue'

import { vueComponents } from '../../../assets/js_owl/admin/vue-components'
import { registerVueAppLifecycle } from '../../legacy/vue/app-lifecycle'
import { createVueAppPlugins } from '../../legacy/vue/app-plugins'
import { createVueAppRegistry } from '../../legacy/vue/app-registry'
import { createVueComponentCatalog } from '../../legacy/vue/component-catalog'
import { createVueExtensionApi } from '../../legacy/vue/extension-api'
import { createVueTranslation, installVueTranslation } from '../../legacy/vue/translation'

if (globalThis.document) bootVue(globalThis)

export function bootVue(target) {
    const Admin = target.Admin
    const document = target.document
    const translation = createVueTranslation(target.trans)
    const components = createVueComponentCatalog(vueComponents)
    const plugins = createVueAppPlugins()
    const vueApps = createVueAppRegistry(createAppFactory(translation, plugins), components)

    registerVueAppLifecycle(Admin.Components, vueApps)

    Admin.VueApps = vueApps
    Admin.Vue = createVueExtensionApi({
        catalog: components,
        lifecycle: Admin.Components,
        plugins,
        root: document,
        runtime: VueRuntime,
    })
    Admin.Vue.scan(document)

    return Admin.Vue
}

function createAppFactory(translation, plugins) {
    return (component, props) => {
        const app = VueRuntime.createApp(component, props)

        installVueTranslation(app, translation)

        return plugins.install(app)
    }
}
