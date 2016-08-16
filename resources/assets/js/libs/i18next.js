/**
 * i18next is a very popular internationalization library for
 * browser or any other javascript environment (eg. node.js).
 *
 * @see http://i18next.com/
 */
window.i18next = require('i18next');

i18next.init({
    lng: Admin.Settings.locale,
    resources: {
        [Admin.Settings.locale]: {
            translation: {
                lang: Admin.Settings.lang
            }
        }
    }
});