/**
 * i18next is a very popular internationalization library for
 * browser or any other javascript environment (eg. node.js).
 *
 * @see http://i18next.com/
 */

import i18next from 'i18next';

i18next.init({
    lng: Admin.locale,
    resources: {
        [Admin.locale]: {
            translation: {
                lang: Admin.Config.get('lang')
            }
        }
    }
});

window.trans = function (key, args) {
    let value = i18next.t(key)
    _.eachRight(args, (paramVal, paramKey) => {
        value = _.replace(value, `:${paramKey}`, paramVal)
    })
    return value
}
