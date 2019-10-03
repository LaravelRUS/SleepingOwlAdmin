Admin.Modules.register('display.actions', () => {
    $('form[data-type="display-actions"]').on('submit', function (e) {

        e.preventDefault();
        let self = $(this);

        Admin.Messages.confirm(trans('lang.table.action-confirm'), null, self).then(result => {
            //Исправлено для версии sweetalert 7.0.0
            if (result.value) {

                //let $checkboxes = $('.adminCheckboxRow').filter(':checked'),
                //    $selectActions = $("#sleepingOwlActionsStore");

                let $datatable_wrapper = $(self).parents('.panel').find('.dataTables_wrapper'),
                    $checkboxes = $datatable_wrapper.find('.adminCheckboxRow').filter(':checked'),
                    $selectActions = $(self).find(".sleepingOwlActionsStore");

                //console.log($checkboxes);
                //console.log($selectActions);

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
                        swal({title: msg.text, text: msg.message, type: msg.type, timer: 5000})
                    }
                    if (msg.hasOwnProperty('__callback')) {
                        let callback_name = msg.__callback;
                        if (typeof window[callback_name] == 'function') {
                            window[callback_name]($datatable_wrapper, $checkboxes, $selectActions);
                        }
                    }
                });

                Admin.Events.fire("datatables::actions::submitted", self);
                //Исправлено для версии sweetalert 7.0.0
            }else
                Admin.Events.fire("datatables::actions::cancel", self);
        });

        return false;
    });
})