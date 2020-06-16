Admin.Modules.register('display.actions_form', () => {
    $('.display-actions-form-wrapper form').on('submit', function (e) {

        e.preventDefault();
        let self = $(this);
        let confirm = $(self).attr('data-confirm') || true;
        var result = $(self).attr('data-result') || true;
        var result_timeout = $(self).attr('data-result-timeout') || 5000;

        var run_action = function() {
            let $datatable_wrapper = $(self).parents('.card').find('.dataTables_wrapper'),
                $checkboxes = $datatable_wrapper.find('.adminCheckboxRow').filter(':checked'),
                data = $(self).serialize() + '&' + $checkboxes.serialize();

            let settings = {
                url: $(self).attr('action'),
                type: $(self).attr('method'),
                data: data,
                dataType: 'json'
            };

            Admin.Events.fire("datatables::actions::submitting", settings);

            $.ajax(settings).done(function (msg) {
                if (msg.hasOwnProperty('text')) {
                    if (result !== 'false' && result !== false && result !== '0' && result !== 0) {
                        swal({title: msg.text, text: msg.message, type: msg.type, timer: result_timeout})
                    } else {
                        console.log(msg);
                    }
                }
                if (msg.hasOwnProperty('__callback')) {
                    let callback_name = msg.__callback;
                    if (typeof window[callback_name] == 'function') {
                        window[callback_name]($datatable_wrapper, $checkboxes);
                    }
                }
            });

            Admin.Events.fire("datatables::actions::submitted", self);
        };

        if (confirm !== 'false' && confirm !== false && confirm !== '0' && confirm !== 0) {
            Admin.Messages.confirm(trans('lang.table.action-confirm'), null, self).then(result => {
                if (result.value) {
                    run_action();
                } else {
                    Admin.Events.fire("datatables::actions::cancel", self);
                }
            });
        } else {
            run_action();
        }

        return false;
    });
})
