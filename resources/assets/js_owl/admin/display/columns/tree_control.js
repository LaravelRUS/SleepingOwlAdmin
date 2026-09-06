const {
    bindConfirmedControls,
} = require('../../../../../frontend/features/table/controls/confirm-submit')

Admin.Modules.register('display.columns.tree_control', () =>
    bindConfirmedControls({
        containerSelector: '.dd3-content',
        events: Admin.Events,
        messages: Admin.Messages,
        questions: {
            delete: trans('lang.table.delete-confirm'),
            destroy: trans('lang.table.destroy-confirm'),
        },
        root: document,
    }),
)
