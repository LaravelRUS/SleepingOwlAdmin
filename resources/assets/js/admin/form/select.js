Admin.Modules.add('form.elements.select', () => {
    $('.input-select').each((e, item) => {
        let options = {},
            $self = $(item);

        if ($self.hasClass('input-taggable')) {
            options['tags'] = true;
        }

        options['width'] = '100%';

        $self.select2(options)
    })
})