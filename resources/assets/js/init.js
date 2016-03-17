$(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('form[data-type="display-actions"]').on('submit', function(e) {
        var $form = $(this),
            $btn = $(e.target.action),
            $checkboxes = $('.adminCheckboxRow').filter(':checked');

        if (!$checkboxes.length) {
            e.preventDefault();
        }

        this.action = $btn.data('action');
        this.method = $btn.data('method');

        $checkboxes.each(function () {
            $form.append('<input type="hidden" name="id[]" value="' + $(this).val() + '" />');
        });
    });

    $('.inline-editable').editable();

    Admin.Components.init();
    Admin.Controllers.call();
});