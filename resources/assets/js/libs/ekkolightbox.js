require('magnific-popup');

$(() => {
    $(document).magnificPopup({
        delegate: '[data-toggle="lightbox"]',
        type: 'image'
    });
})