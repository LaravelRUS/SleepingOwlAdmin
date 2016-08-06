$(() => {
    $('.input-date').each((i, item) => {
        let $self = $(item);

        $self.datetimepicker({
            locale: Admin.Settings.locale
        }).trigger('dp.change').on('dp.change', () => {
            $self.change()
        })
    })
})