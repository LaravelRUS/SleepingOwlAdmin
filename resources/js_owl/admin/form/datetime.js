Admin.Modules.register('form.elements.datetime', () => {
    $('.input-date').each((i, item) => {
        let $self = $(item);

        $self.datetimepicker({
            locale: Admin.locale
        }).on('dp.change', () => {
            $self.change()
        })
    })
})