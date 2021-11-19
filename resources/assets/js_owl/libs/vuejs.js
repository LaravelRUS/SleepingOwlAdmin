/**
 * Vue is a modern JavaScript for building interactive web interfaces using
 * reacting data binding and reusable components. Vue's API is clean and
 * simple, leaving you to focus only on building your next great idea.
 *
 * @see https://vuejs.org/guide/
 */


/**
 * The plugin for Vue.js provides services for making web requests and handle
 * responses using a XMLHttpRequest or JSONP.
 *
 * @see https://github.com/vuejs/vue-resource/tree/master/docs
 */
require('vue-resource');

/**
 * We'll register a HTTP interceptor to attach the "XSRF" header to each of
 * the outgoing requests issued by this application. The CSRF middleware
 * included with Laravel will automatically verify the header's value.
 */
Vue.http.interceptors.push((request, next) => {
    request.headers['X-CSRF-TOKEN'] = Admin.token;

    next((response) => {
        switch (response.status) {
            case 200:
            case 202:
            case 400:
                break;
            default:
                Admin.Messages.error(
                    trans('lang.message.something_went_wrong'),
                    response.data.message || ''
                )
        }
    });
});

// Vue.config.ignoredElements = ['trix-editor', 'trix-toolbar'];

Vue.use({
    install (Vue, options) {
        Vue.prototype.$trans = (key) => i18next.t(key)
    }
});
