Admin.Modules.register('form.elements.select', () => {
    $('.input-select').each((e, item) => {
        let options = {},
            $self = $(item);

        if ($self.hasClass('input-taggable')) {
            options['tags'] = true;
        }

        if ($self.attr('data-select2-allow-html')) {
            options['escapeMarkup'] = function(m) { return m; };
        }

        $self.select2(options)
    })
}, 0, ['bootstrap::tab::shown'])