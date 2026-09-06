import { componentMountSkipped } from '../../core/lifecycle/component-lifecycle'
import { vueAppSelector } from './app-registry'

export const vueAppLifecycleName = 'soa.vue-app'

export function registerVueAppLifecycle(components, vueApps) {
    return components.register({
        destroy: (element) => vueApps.unmount(element),
        mount: (element) => mountVueApp(components, vueApps, element),
        name: vueAppLifecycleName,
        selector: vueAppSelector,
    })
}

function mountVueApp(components, vueApps, element) {
    if (!vueApps.canMount(element)) return componentMountSkipped

    const app = vueApps.mount(element)
    components.scan(element)

    return app
}
