$(function () {
    $('.input-select').each(function () {
        var options = {},
            $self = $(this);

        if ($self.hasClass('input-taggable')) {
            options['tags'] = true;
        }

        $self.select2(options)
    });
});