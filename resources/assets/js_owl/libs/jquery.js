/**
 * jQuery is a fast, small, and feature-rich JavaScript library.
 * It makes things like HTML document traversal and manipulation,
 * event handling, animation, and Ajax much simpler with an easy-to-use
 * API that works across a multitude of browsers.
 *
 * @see https://api.jquery.com/
 */
window.$ = global.jQuery = require('jquery');

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': Admin.token
    }
});
