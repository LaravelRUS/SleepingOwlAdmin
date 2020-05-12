Admin.Modules.register('display.actions', () => {
    $('form[data-type="display-actions"]').on('submit', function (e) {

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

        e.preventDefault();
        let self = $(this);


        let $checkboxes = $('.adminCheckboxRow').filter(':checked'),
        $selectActions = $("#sleepingOwlActionsStore");


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
                        window[callback_name]($datatable_wrapper, $checkboxes, $selectActions);
                    }
                }
            });

                Admin.Events.fire("datatables::actions::submitted", self);
                //reload datatables
                $('.datatables').DataTable().draw();
            }else
                Admin.Events.fire("datatables::actions::cancel", self);
        });

        return false;
    });
})
