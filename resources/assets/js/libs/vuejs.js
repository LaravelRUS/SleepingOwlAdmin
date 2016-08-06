window.Vue = require('vue');
require('vue-resource');

/**
 * We'll register a HTTP interceptor to attach the "XSRF" header to each of
 * the outgoing requests issued by this application. The CSRF middleware
 * included with Laravel will automatically verify the header's value.
 */
Vue.http.interceptors.push((request, next) => {
    request.headers['X-CSRF-TOKEN'] = Admin.Settings.token;

    next((response) => {
        switch (response.status) {
            case 200:
            case 202:
            case 400:
                break;
            default:
                sweetAlert(
                    i18next.t('lang.message.something_went_wrong'),
                    response.data.message || '',
                    'error'
                )
        }
    });
});

Vue.use({
    install (Vue, options) {
        Vue.prototype.$trans = (key) => i18next.t(key)
    }
});