$(function () {
    var clickEvent = function(selector, question) {
        $('table').on('click', selector, function (e) {
            e.preventDefault();
            var form = $(this).closest('form');
            bootbox.confirm(question, function (result) {
                if (result) {
                    form.submit();
                }
            });
        });
    };

    clickEvent('button.btn-delete', window.Admin.Settings.lang.table['delete-confirm']);
    clickEvent('button.btn-destroy', window.Admin.Settings.lang.table['destroy-confirm']);
});