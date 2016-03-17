$(function () {
    $('.adminCheckboxRow').on('change', function(e) {
        var $self = $(this),
            $row = $self.closest('tr');

        if($self.is(':checked')) {
            $row.addClass('info');
        } else {
            $row.removeClass('info');
        }
    });

    $('.adminCheckboxAll').on('change', function() {
        var $self = $(this),
            $checkboxes = $('.adminCheckboxRow');

        if($self.is(':checked')) {
            $checkboxes.not(':checked').each(function(i, a) {
                this.checked = true;
                $(this).trigger('change');
            });
        } else {
            $checkboxes.filter(':checked').each(function(i, a) {
                this.checked = false;
                $(this).trigger('change');
            });
        }
    });
});