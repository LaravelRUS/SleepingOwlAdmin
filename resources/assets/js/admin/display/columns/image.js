$(() => {
    $(document).on('click', '[data-toggle="lightbox"]', function (e) {
        e.preventDefault();
        $(this).ekkoLightbox({
            always_show_close: false
        });
    });
})