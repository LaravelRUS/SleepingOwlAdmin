$(function () {
    $('.input-date').each(function () {
        $(this).datetimepicker({
            lang: window.admin.locale,
        });
    });
});