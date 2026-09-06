import { createApp } from 'vue'

import { createVueAppRegistry } from '../../frontend/legacy/vue/app-registry'
import { registerVueAppLifecycle } from '../../frontend/legacy/vue/app-lifecycle'
import {
    createVueTranslation,
    installVueTranslation,
} from '../../frontend/legacy/vue/translation'
import { vueComponents } from './admin/vue-components'

const translation = createVueTranslation(trans)

function createAdminVueApp(component, props) {
    const app = createApp(component, props)

    return installVueTranslation(app, translation)
}

const vueApps = createVueAppRegistry(
    createAdminVueApp,
    vueComponents,
)

Admin.VueApps = vueApps
vueApps.mountAll(document)
registerVueAppLifecycle(Admin.Components, vueApps)
