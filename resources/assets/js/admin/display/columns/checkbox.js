Admin.Modules.add('display.columns.checkbox', () => {
    $('.adminCheckboxRow').on('change', (e) => {
        let $self = $(e.target),
            $row = $self.closest('tr')

        if ($self.is(':checked')) {
            $row.addClass('info')
        } else {
            $row.removeClass('info')
        }
    })

    $('.adminCheckboxAll').on('change', (e) => {
        let $self = $(e.target),
            $checkboxes = $('.adminCheckboxRow')

        if ($self.is(':checked')) {
            $checkboxes.not(':checked').each((i, item) => {
                item.checked = true
                $(item).trigger('change')
            });
        } else {
            $checkboxes.filter(':checked').each((i, item) => {
                item.checked = false
                $(item).trigger('change')
            });
        }
    })
})