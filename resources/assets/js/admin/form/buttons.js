$(() => {
    var formRequest = (url, params) => {
        let form = '<form method="POST" action="' + url + '">';
        for (let name in params) {
            form += '<input type="hidden" name="' + name + '" value="' + params[name] + '">';
        }

        form += '</form>';
        $(form).submit();
    }

    var clickEvent = (selector, question, method) => {

        var prepareData = (jSelector) => {
            var url = jSelector.data('url'),
                redirect = jSelector.data('redirect'),
                params = {
                    _token: Admin.Settings.token,
                };

            if (!_.isUndefined(method)) {
                params._method = method;
            }

            if (!_.isUndefined(redirect)) {
                params._redirectBack = redirect;
            }

            formRequest(url, params);
        };

        $(selector).on('click', function (e) {
            e.preventDefault();

            let self = $(this);

            if (_.isUndefined(question)) {
                return prepareData(self);
            }

            bootbox.confirm(question, (result) => {
                result && prepareData(self);
            });
        });
    };

    clickEvent('.form-buttons button.btn-delete', i18next.t('lang.table.delete-confirm'), 'DELETE');
    clickEvent('.form-buttons button.btn-destroy', i18next.t('lang.table.destroy-confirm'), 'DELETE');
    clickEvent('.form-buttons button.btn-restore');
});