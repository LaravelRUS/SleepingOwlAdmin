import * as VueRuntime from 'vue'

import { vueComponents } from '../legacy/admin/vue-components'
import { registerVueAppLifecycle } from './legacy/app-lifecycle'
import { createVueAppPlugins } from './legacy/app-plugins'
import { createVueAppRegistry } from './legacy/app-registry'
import { createVueComponentCatalog } from './legacy/component-catalog'
import { createVueExtensionApi } from './legacy/extension-api'
import { createVueTranslation, installVueTranslation } from './legacy/translation'

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
