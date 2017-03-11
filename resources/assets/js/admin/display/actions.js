Admin.Modules.add('display.actions', () => {
    $('form[data-type="display-actions"]').on('submit', function (e) {
        var $btn = $(e.target.action),
            $checkboxes = $('.adminCheckboxRow').filter(':checked')

        $.ajax({
            type: $btn.data('method'),
            url: $btn.data('action'),
            data: $checkboxes.serialize()
        })
            .done(function (msg) {
                // TODO Add success message
            });

        return false;
    });
})