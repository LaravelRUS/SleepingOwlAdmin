Admin.Modules.register('display.columns.control', () => {
    let clickEvent = (selector, question) => {
        $('table').on('click', selector, function (e) {
            e.preventDefault();

            let $form = $(this).closest('form');

            Admin.Messages.confirm(question).then(() => {
                $form.submit()
            }, dismiss => {

            });
        });
    };

    clickEvent('button.btn-delete', trans('lang.table.delete-confirm'))
    clickEvent('button.btn-destroy', trans('lang.table.destroy-confirm'))
});