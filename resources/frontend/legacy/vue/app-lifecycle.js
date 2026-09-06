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
    const app = vueApps.mount(element)
    components.scan(element)

    return app
}
