Admin.Modules.register('display.actions', () => {
    $('form[data-type="display-actions"]').on('submit', function (e) {
        var $checkboxes = $('.adminCheckboxRow').filter(':checked'),
            $selectActions = $("#sleepingOwlActionsStore");

        $.ajax({
            type: $selectActions.find('option:selected').data('method'),
            url: $selectActions.val(),
            data: $checkboxes.serialize(),
            dataType: 'json'
        }).done(function (msg) {
            if (msg.hasOwnProperty('text')) {
                swal({title: msg.text, text: msg.message, type: msg.type, timer: 5000})
                setTimeout(function(){
                    location.reload();
                    window.location.reload();
                }, 5000);

            }
        });

        return false;
    });
})