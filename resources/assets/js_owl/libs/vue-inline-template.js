export function withLegacyInlineTemplate(component) {
    const options = component.options || component
    const hooks = normalizeHooks(options.beforeCreate)

    options.beforeCreate = [resetCachedRender(options), ...hooks]

    return component
}

function normalizeHooks(hooks) {
    if (!hooks) {
        return []
    }

    return Array.isArray(hooks) ? hooks : [hooks]
}

function resetCachedRender(options) {
    return function resetInlineTemplateRender() {
        delete options.render
    }
}
