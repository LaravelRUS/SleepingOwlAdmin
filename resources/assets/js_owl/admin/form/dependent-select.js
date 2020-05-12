Admin.Modules.register('form.elements.dependent-select', () => {
    $('.input-select-dependent').depdrop({
      loadingText: trans('lang.table.loadingRecords'),
      placeholder: trans('lang.select.nothing'),
      emptyMsg: trans('lang.select.no_items')
    })

    $('.input-select-dependent').on('depdrop:init depdrop:change', function (event) {
        const $el = $(event.currentTarget);

        if ($el.hasClass('js-data-ajax')) {
            let correct = true;
            const depends = $el.data('depends');
            const vLoadText = $el.data('loadingText');

            $.each(depends, function (index, element) {
                let $dep_el = $('#' + element);
                let type = $dep_el.attr('type');
                let value = (type === "checkbox" || type === "radio") ? $dep_el.prop('checked') : $dep_el.val();

                if (!value || value === vLoadText) {
                    correct = false;
                    return;
                }
            });

            if (correct) {
                $el.removeClass($el.data('loadingClass'))
                    .removeAttr('disabled')
                    .html('');
            }
        }
    })
}, 0, ['bootstrap::tab::shown'])
