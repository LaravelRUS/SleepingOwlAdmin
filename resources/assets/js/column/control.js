$(function () {
    $(document).delegate('.btn-delete', 'click', function (e) {
        e.preventDefault();
        var form = $(this).closest('form');
        bootbox.confirm(window.Admin.Settings.lang.table['delete-confirm'], function (result) {
            if (result) {
                form.submit();
            }
        });
    });
    bootbox.setDefaults('locale', window.Admin.Settings.locale);
});