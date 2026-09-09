const {
    installFormButtons,
} = require('../../../features/forms/actions/install-form-buttons')

installFormButtons(Admin, {
    document,
    questions: {
        delete: trans('lang.table.delete-confirm'),
        destroy: trans('lang.table.destroy-confirm'),
    },
})
