var isEmptyVal = function (value, trim) {
    return value === null || value === undefined || value.length === 0 || (trim && $.trim(value) === '');
};

Admin.Modules.register('form.elements.selectajax', () => {
    $('.js-data-ajax').each((e, item) => {

        if (jQuery().select2) {
            $.extend($.fn.select2.defaults.defaults.language, {
                noResults: function() {return trans('lang.table.infoEmpty')},
                errorLoading: function() {return trans('lang.message.something_went_wrong')},
                searching: function() {return trans('lang.table.loadingRecords')},
                inputTooShort: function() {return trans('lang.select.short', {min: $self.data('min-symbols')})}
            });
        }

        let options = {},
            $self = $(item);

        options = {
            placeholder: trans('lang.table.search'),
            minimumInputLength: $self.data('min-symbols'),
            ajax: {
                url: $self.attr('search_url'),
                dataType: 'json',
                method: 'POST',
                delay: 250,
                data: function (params) {
                    var _return = {
                        q: params.term, // search term
                        page: params.page,
                        model: $self.attr('model'),
                        field: $self.attr('field'),
                        search: $self.attr('search')
                    };
                    let depends = $self.attr('data-depends');
                    if (typeof depends !== "undefined" && depends !== '' && depends !== null && depends !== false && depends !== 0) {
                        let vPar = JSON.parse(depends);
                        if (!isEmptyVal(vPar)) {
                            let params_num = [], params_key = {};
                            for (i = 0; i < vPar.length; i++) {
                                let key = vPar[i];
                                let val = $('#' + key).val();
                                params_num[i] = val;
                                params_key[key] = val;
                            }
                            _return['depends'] = depends;
                            _return['depdrop_parents'] = params_num;
                            _return['depdrop_all_params'] = params_key;
                        }
                    }
                    return _return;
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
            "<div class='select2-result-repository__title'>" + escapeText(repo.tag_name) + "</div>";

        return markup;
    }

    function formatRepoSelection (repo) {
        return repo.custom_name || escapeText(repo.tag_name || repo.text);
    }

    // escapeMarkup above is disabled so that formatRepo can return markup (and custom_name
    // stays an HTML hook), therefore plain-text labels have to be escaped here. tag_name is
    // the setDisplay() value; text is the textContent of a preselected <option>, where the
    // browser has already decoded &lt; back to <. Same replacements as select2's
    // Utils.escapeMarkup.
    function escapeText (value) {
        const replaceMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#47;',
            '\\': '&#92;'
        };

        return String(value === null || value === undefined ? '' : value)
            .replace(/[&<>"'\/\\]/g, match => replaceMap[match]);
    }

}, 0, ['bootstrap::tab::shown'])
