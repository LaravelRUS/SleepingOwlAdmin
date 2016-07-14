$(function () {
    var formRequest = function(url, params) {
        var form = '<form method="POST" action="' + url + '">';
        for (var name in params) {
            form += '<input type="hidden" name="' + name + '" value="' + params[name] + '">';
        }
        form += '</form>';
        $(form).submit();
    };

    var clickEvent = function (selector, question, method) {

        var prepareData = function (jSelector) {
            var url = jSelector.data('url');
            var redirect = jSelector.data('redirect');
            var params = {
                _token: window.Admin.Settings.token,
            };

            if (method !== undefined) {
                params._method = method;
            }

            if (redirect !== undefined) {
                params._redirectBack = redirect;
            }

            formRequest(url, params);
        };

        $(selector).on('click', function (e) {
            e.preventDefault();

            var self = $(this);

            if (question === undefined) {
                return prepareData(self);
            }

            bootbox.confirm(question, function (result) {
                if (result) {
                    prepareData(self);
                }
            });
        });
    };

    clickEvent('.form-buttons button.btn-delete', window.Admin.Settings.lang.table['delete-confirm'], 'DELETE');
    clickEvent('.form-buttons button.btn-destroy', window.Admin.Settings.lang.table['destroy-confirm'], 'DELETE');
    clickEvent('.form-buttons button.btn-restore');
});