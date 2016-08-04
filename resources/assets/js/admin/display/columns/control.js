$(() => {
    let clickEvent = (selector, question) => {
        $('table').on('click', selector, function (e) {
            e.preventDefault();

            let $form = $(this).closest('form');
            bootbox.confirm(question, (result) => {
                result && $form.submit()
            });
        });
    };

    clickEvent('button.btn-delete', i18next.t('lang.table.delete-confirm'))
    clickEvent('button.btn-destroy', i18next.t('lang.table.destroy-confirm'))
});