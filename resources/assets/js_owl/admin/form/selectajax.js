Admin.Modules.register('form.elements.selectajax', () => {
    $('.js-data-ajax').each((e, item) => {
        let options = {},
            $self = $(item);

        options = {
            placeholder: "Search ...",
            minimumInputLength: $self.data('min-symbols'),
            ajax: {
                url: $self.attr('search_url'),
                dataType: 'json',
                method: 'POST',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term, // search term
                        page: params.page,
                        model: $self.attr('model'),
                        field: $self.attr('field'),
                        search: $self.attr('search')
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    $.each(data, function(elem, index){
                        index.desc = index.name;
                    });

                    return {
                        results: data,
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup; },
            templateResult: formatRepo,
            templateSelection: formatRepoSelection
        };

        $self.select2(options)
    });

    function formatRepo (repo) {
        if (repo.custom_name) return repo.custom_name;

        let markup = "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" + repo.tag_name + "</div>";

        return markup;
    }

    function formatRepoSelection (repo) {
        return repo.custom_name || repo.tag_name || repo.text;
    }

}, 0, ['bootstrap::tab::shown'])