/**
 * Magnific Popup is a responsive lightbox & dialog script with focus
 * on performance and providing best experience for user with any
 * device (for jQuery or Zepto.js).
 *
 * @see http://dimsemenov.com/plugins/magnific-popup/documentation.html
 */
require('magnific-popup');

$(() => {
    $(document).magnificPopup({
        delegate: '[data-toggle="lightbox"]',
        type: 'image'
    });
})