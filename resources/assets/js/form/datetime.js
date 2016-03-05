$(function () {
    $('.input-date').each(function () {
        var $self = $(this);
        $self.datetimepicker({
            locale: window.Admin.Settings.locale
        }).trigger('dp.change').on('dp.change', function () {
            $self.change();
        });
    });
});