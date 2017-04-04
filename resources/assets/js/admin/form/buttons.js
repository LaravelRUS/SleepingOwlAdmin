Admin.Modules.register('form.buttons', () => {
    var formRequest = (url, params) => {
        let form = $(`<form method="POST" action="${url}"></form>`);
        for (let name in params) {
            form.append(`<input type="hidden" name="${name}" value="${params[name]}">`);
        }

        form.appendTo('body');
        form.submit();
    }

    var clickEvent = (selector, question, method) => {

        var prepareData = (jSelector) => {
            var url = jSelector.data('url'),
                redirect = jSelector.data('redirect'),
                params = {
                    _token: Admin.token,
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

            Admin.Messages.confirm(question).then(() => {
                prepareData(self);
            }, dismiss => {

            });
        });
    };

    clickEvent('.form-buttons button.btn-delete', trans('lang.table.delete-confirm'), 'DELETE');
    clickEvent('.form-buttons button.btn-destroy', trans('lang.table.destroy-confirm'), 'DELETE');
    clickEvent('.form-buttons button.btn-restore');
});
