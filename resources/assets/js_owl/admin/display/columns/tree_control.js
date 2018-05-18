Admin.Modules.register('display.columns.tree_control', () => {
    let clickEvent = (selector, question) => {
        $('.dd3-content').on('click', selector, function (e) {
            e.preventDefault();

            let $form = $(this).closest('form');

            Admin.Messages.confirm(question, null, $(this)).then(result => {
                if (result.value) {
                    Admin.Events.fire("datatables::confirm::submitting", $form, selector);
                    $form.submit()
                    Admin.Events.fire("datatables::confirm::submitted", $form, selector);
                }else
                    Admin.Events.fire("datatables::confirm::cancel", $form, selector);
            });
        });
    };

    clickEvent('button.btn-delete', trans('lang.table.delete-confirm'))
    clickEvent('button.btn-destroy', trans('lang.table.destroy-confirm'))
});