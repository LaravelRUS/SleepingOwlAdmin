Admin.Modules.register('display.actions_form', () => {
    $('.display-actions-form-wrapper form').on('submit', function (e) {

        e.preventDefault();
        let self = $(this);

        Admin.Messages.confirm(trans('lang.table.action-confirm'), null, self).then(result => {
            if (result.value) {

                let $datatable_wrapper = $(self).parents('.panel').find('.dataTables_wrapper'),
                    $checkboxes = $datatable_wrapper.find('.adminCheckboxRow').filter(':checked');

                let data = $(self).serialize() + '&' + $checkboxes.serialize();
                //console.log(data);

                let settings = {
                    url: $(self).attr('action'),
                    type: $(self).attr('method'),
                    data: data,
                    dataType: 'json'
                };

                Admin.Events.fire("datatables::actions::submitting", settings);

                $.ajax(settings).done(function (msg) {
                    if (msg.hasOwnProperty('text')) {
                        swal({title: msg.text, text: msg.message, type: msg.type, timer: 5000})
                    }
                    if (msg.hasOwnProperty('__callback')) {
                        let callback_name = msg.__callback;
                        if (typeof window[callback_name] == 'function') {
                            window[callback_name]($datatable_wrapper, $checkboxes);
                        }
                    }
                });

                Admin.Events.fire("datatables::actions::submitted", self);
            } else {
                Admin.Events.fire("datatables::actions::cancel", self);
            }
        });

        return false;
    });
})