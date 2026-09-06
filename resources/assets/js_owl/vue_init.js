import { createVueAppRegistry } from '../../frontend/legacy/vue/app-registry'

const vueApps = createVueAppRegistry((options) => Vue.createApp(options))

Admin.VueApps = vueApps
vueApps.mountAll(document)
