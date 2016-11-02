Admin.Modules.add('display.actions', () => {
    $('form[data-type="display-actions"]').on('submit', function (e) {
        var $btn = $(e.target.action),
            $checkboxes = $('.adminCheckboxRow').filter(':checked')

        if (!$checkboxes.length) {
            swal(
                '',
                'You need select one or more rows',
                'error'
            )
            e.preventDefault();
            return;
        }

        $.ajax({
            type: $btn.data('method'),
            url: $btn.data('action'),
            data: $checkboxes.serialize()
        })
            .done(function (msg) {
                swal(
                    'Success',
                    '',
                    'success'
                )
            });

        return false;
    });
})