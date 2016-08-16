Admin.Modules.add('display.columns.control', () => {
    let clickEvent = (selector, question) => {
        $('table').on('click', selector, function (e) {
            e.preventDefault();

            let $form = $(this).closest('form');
            swal({
                title: question,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: i18next.t('lang.button.yes')
            }).then(() => {
                $form.submit()
            }, dismiss => {

            });
        });
    };

    clickEvent('button.btn-delete', i18next.t('lang.table.delete-confirm'))
    clickEvent('button.btn-destroy', i18next.t('lang.table.destroy-confirm'))
});