import * as VueRuntime from 'vue'

import { createVueAppPlugins } from '../../frontend/legacy/vue/app-plugins'
import { createVueAppRegistry } from '../../frontend/legacy/vue/app-registry'
import { createVueComponentCatalog } from '../../frontend/legacy/vue/component-catalog'
import { createVueExtensionApi } from '../../frontend/legacy/vue/extension-api'
import { registerVueAppLifecycle } from '../../frontend/legacy/vue/app-lifecycle'
import {
    createVueTranslation,
    installVueTranslation,
} from '../../frontend/legacy/vue/translation'
import { vueComponents } from './admin/vue-components'

const translation = createVueTranslation(trans)
const components = createVueComponentCatalog(vueComponents)
const plugins = createVueAppPlugins()

function createAdminVueApp(component, props) {
    const app = VueRuntime.createApp(component, props)

    installVueTranslation(app, translation)

    return plugins.install(app)
}

const vueApps = createVueAppRegistry(createAdminVueApp, components)
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
