export const vueCompatFeatures = Object.freeze({})

export function configureVueCompat(Vue) {
    Vue.configureCompat({
        MODE: 3,
        ...vueCompatFeatures,
    })
}

export function asNativeVue3Component(component, overrides = {}) {
    return {
        ...component,
        compatConfig: {
            ...nativeVue3CompatConfig(),
            ...overrides,
        },
    }
}

function nativeVue3CompatConfig() {
    const disabledFeatures = Object.keys(vueCompatFeatures).map((feature) => [feature, false])

    return Object.fromEntries([
        ['MODE', 3],
        ...disabledFeatures,
    ])
}
