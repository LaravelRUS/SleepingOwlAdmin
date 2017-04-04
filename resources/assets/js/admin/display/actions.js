Admin.Modules.register('display.actions', () => {
    $('form[data-type="display-actions"]').on('submit', function (e) {
        var $checkboxes = $('.adminCheckboxRow').filter(':checked'),
            $selectActions = $("#sleepingOwlActionsStore");

        $.ajax({
            type: $selectActions.find('option:selected').data('method'),
            url: $selectActions.val(),
            data: $checkboxes.serialize()

        }).done(function (msg) {
                // TODO Add success message
            });

        return false;
    });
})