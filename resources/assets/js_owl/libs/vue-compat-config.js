export const vueCompatFeatures = Object.freeze({
    ATTR_ENUMERATED_COERCION: 'suppress-warning',
    COMPILER_INLINE_TEMPLATE: true,
    COMPONENT_V_MODEL: 'suppress-warning',
    CONFIG_WHITESPACE: 'suppress-warning',
    GLOBAL_PROTOTYPE: 'suppress-warning',
    INSTANCE_ATTRS_CLASS_STYLE: 'suppress-warning',
    INSTANCE_CHILDREN: 'suppress-warning',
    INSTANCE_SCOPED_SLOTS: 'suppress-warning',
    INSTANCE_SET: 'suppress-warning',
    OPTIONS_BEFORE_DESTROY: 'suppress-warning',
    PRIVATE_APIS: 'suppress-warning',
    RENDER_FUNCTION: 'suppress-warning',
    WATCH_ARRAY: 'suppress-warning',
})

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
