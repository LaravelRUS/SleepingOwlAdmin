const {
    bindFormButtons,
} = require('../../../../frontend/features/forms/actions/form-buttons')

Admin.Modules.register('form.buttons', () =>
    bindFormButtons({
        document,
        events: Admin.Events,
        messages: Admin.Messages,
        questions: {
            delete: trans('lang.table.delete-confirm'),
            destroy: trans('lang.table.destroy-confirm'),
        },
        root: document,
        token: Admin.token,
    }),
)
