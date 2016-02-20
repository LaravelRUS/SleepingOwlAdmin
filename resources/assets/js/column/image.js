$(function () {
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function (e) {
        e.preventDefault();
        $(this).ekkoLightbox({
            always_show_close: false
        });
    });
});