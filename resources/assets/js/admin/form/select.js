$(() => {
    $('.input-select').each((e, item) => {
        let options = {},
            $self = $(item);

        if ($self.hasClass('input-taggable')) {
            options['tags'] = true;
        }

        $self.select2(options)
    })
})