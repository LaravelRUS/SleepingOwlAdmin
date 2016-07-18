$(function () {
    console.log('control');
    $('button.btn-delete').on('click', function (e) {
        console.log('.btn-delete');
        e.preventDefault();
        var form = $(this).closest('form');
        bootbox.confirm(window.Admin.Settings.lang.table['delete-confirm'], function (result) {
            if (result) {
                form.submit();
            }
        });
    });

    $('button.btn-destroy').on('click', function (e) {
        e.preventDefault();
        var form = $(this).closest('form');
        bootbox.confirm(window.Admin.Settings.lang.table['destroy-confirm'], function (result) {
            if (result) {
                form.submit();
            }
        });
    });
});