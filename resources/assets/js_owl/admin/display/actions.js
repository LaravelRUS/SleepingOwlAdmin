Admin.Modules.register('display.actions', () => {
    $('form[data-type="display-actions"]').on('submit', function (e) {
        e.preventDefault();
        let self = $(this);

        /**
         * @todo Need to refactor selectors for use properly instance of the form, because it can be used inside one of several tabs
         */
        let action_value = $("#sleepingOwlActionsStore").find('option:selected').val();
        if (action_value == 0) {
            Swal.fire({
                title: trans('lang.table.no-action'),
                text: trans('lang.select.nothing'),
                icon: 'error',
                timer: 5000
            })
            return false;
        }

        let $checkboxes = $('.adminCheckboxRow').filter(':checked');
        if ($checkboxes.length == 0) {
            Swal.fire({
                title: trans('lang.select.nothing'),
                text: trans('lang.select.no_items'),
                icon: 'error',
                timer: 5000
            })

            return false;
        }

        Admin.Messages.confirm(trans('lang.table.action-confirm'), null, self).then(result => {
            if (result.value) {
                let $datatable_wrapper = $(self).parents('.card').find('.dataTables_wrapper'),
                    $checkboxes = $datatable_wrapper.find('.adminCheckboxRow').filter(':checked'),
                    $selectActions = $(self).find(".sleepingOwlActionsStore");

                // console.log('check', $checkboxes);
                // console.log($selectActions);

                let data = $checkboxes.serialize();
                let settings = {
                    type: $selectActions.find('option:selected').data('method'),
                    url: $selectActions.val(),
                    data: data,
                    dataType: 'json'
                };

                Admin.Events.fire("datatables::actions::submitting", settings);

                $.ajax(settings).done(function (msg) {
                    if (msg.hasOwnProperty('text')) {
                        Swal.fire({
                            title: msg.text,
                            text: msg.message,
                            icon: msg.type,
                            timer: 5000
                        })
                    }
                    if (msg.hasOwnProperty('__callback')) {
                        let callback_name = msg.__callback;
                        if (typeof window[callback_name] == 'function') {
                            window[callback_name]($datatable_wrapper, $checkboxes, $selectActions, msg);
                        }
                    }
                    if (msg.hasOwnProperty('__redirect')) {
                        location.href = msg.__redirect;
                    }
                });

                Admin.Events.fire("datatables::actions::submitted", self);

                // Reload datatables
                $('.datatables').DataTable().draw();
            } else
                Admin.Events.fire("datatables::actions::cancel", self);
        });

        return false;
    });
})
