Admin.Modules.register('display.actions', () => {
    $('form[data-type="display-actions"]').on('submit', function (e) {

      let action_value = $("#sleepingOwlActionsStore").find('option:selected').val();

      console.log(action_value);
      
      if (action_value == 0) {
        console.log('No action');
        return false;
      }

        e.preventDefault();
        let self = $(this);

        Admin.Messages.confirm(trans('lang.table.action-confirm'), null, self).then(result => {
            //Исправлено для версии sweetalert 7.0.0
            if (result.value) {

                let $checkboxes = $('.adminCheckboxRow').filter(':checked'),
                    $selectActions = $("#sleepingOwlActionsStore");

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
                      type: msg.type,
                      timer: 5000
                    })
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
