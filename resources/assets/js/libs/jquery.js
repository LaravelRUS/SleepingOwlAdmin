/**
 * jQuery
 */
window.$ = global.jQuery = require('jquery');

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': Admin.Settings.token
    }
});