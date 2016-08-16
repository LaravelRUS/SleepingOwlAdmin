Admin.Modules.add('display.actions', () => {
    $('form[data-type="display-actions"]').on('submit', (e) => {
        var $form = $(this),
            $btn = $(e.target.action),
            $checkboxes = $('.adminCheckboxRow').filter(':checked')

        if (!$checkboxes.length) {
            e.preventDefault()
        }

        this.action = $btn.data('action')
        this.method = $btn.data('method')

        $checkboxes.each((i, item) => {
            $form.append('<input type="hidden" name="id[]" value="' + $(item).val() + '" />')
        });
    });
})