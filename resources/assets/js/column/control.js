$(function () {
    $('td.row-control button.btn-delete').on('click', function (e) {
        e.preventDefault();
        var form = $(this).closest('form');
        bootbox.confirm(window.Admin.Settings.lang.table['delete-confirm'], function (result) {
            if (result) {
                form.submit();
            }
        });
    });

    $('td.row-control button.btn-destroy').on('click', function (e) {
        e.preventDefault();
        var form = $(this).closest('form');
        bootbox.confirm(window.Admin.Settings.lang.table['destroy-confirm'], function (result) {
            if (result) {
                form.submit();
            }
        });
    });
});