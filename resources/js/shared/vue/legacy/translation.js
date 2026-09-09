export const vueTranslationKey = Symbol.for('sleepingowl.admin.vue.translation')

export function createVueTranslation(translate) {
    assertFunction(translate, 'Vue translation function')

    return Object.freeze({
        trans: (key, replacements) => translate(key, replacements),
    })
}

export function installVueTranslation(app, translation) {
    assertFunction(app?.provide, 'Vue app provide')
    requireVueTranslation(translation)
    app.provide(vueTranslationKey, translation)

    return app
}

export function requireVueTranslation(translation) {
    assertFunction(translation?.trans, 'Injected Vue translation')

    return translation
}

function assertFunction(value, name) {
    if (typeof value !== 'function') {
        throw new TypeError(`${name} must be a function.`)
    }
}
