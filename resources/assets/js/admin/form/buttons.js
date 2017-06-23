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
            Admin.Events.fire("datatables::confirm::submitting::data", params)
            formRequest(url, params);
            Admin.Events.fire("datatables::confirm::submitted::data", params)
        };

        $(selector).on('click', function (e) {
            e.preventDefault();

            let self = $(this);

            if (_.isUndefined(question)) {
                return prepareData(self);
            }

            Admin.Messages.confirm(question, null, selector).then(() => {
                Admin.Events.fire("datatables::confirm::submitting", self);
                prepareData(self);
                Admin.Events.fire("datatables::confirm::submitted", self);
            }, dismiss => {
                Admin.Events.fire("datatables::confirm::cancel", self);
            });
        });
    };

    clickEvent('.form-buttons button.btn-delete', trans('lang.table.delete-confirm'), 'DELETE');
    clickEvent('.form-buttons button.btn-destroy', trans('lang.table.destroy-confirm'), 'DELETE');
    clickEvent('.form-buttons button.btn-restore');
});
