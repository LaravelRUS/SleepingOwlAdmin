import { createVueAppRegistry } from '../../frontend/legacy/vue/app-registry'
import {
    createVueTranslation,
    installVueTranslation,
} from '../../frontend/legacy/vue/translation'

const translation = createVueTranslation(trans)

function createLegacyVueApp(component, props) {
    const app = Vue.createApp(component, props)

    return installVueTranslation(app, translation)
}

const vueApps = createVueAppRegistry(
    createLegacyVueApp,
    Admin.LegacyVueComponents,
)

Admin.VueApps = vueApps
vueApps.mountAll(document)
