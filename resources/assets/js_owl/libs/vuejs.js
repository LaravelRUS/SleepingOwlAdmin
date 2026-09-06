Vue.use({
    install (Vue, options) {
        Vue.prototype.$trans = (key) => i18next.t(key)
    }
});
